using MySql.Data.MySqlClient;
using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using PartyCollegeUtil.Config;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Xml.Serialization;

namespace PartyCollege.Model.outdoc
{
	public class ExcelHelper
	{
		private ExportHelper exporthelper = new ExportHelper();

		public Exports GetExportsByCategory(string category, ExportRoot pjroot)
		{
			Exports expTemp = null;
			List<Exports> listTemp = pjroot.ListExports;
			foreach (Exports item in listTemp)
			{
				if (item.category == category)
				{
					expTemp = item;
					break;
				}
			}
			return expTemp;
		}
		public void ExportToExcel(string filename, string category, Hashtable param)
		{
			string filepath = "~/config/excelExport.xml";
			ExportRoot pjroot = exporthelper.GetRoot(filepath);
			Exports exports = null;
			exports = GetExportsByCategory(category, pjroot);
			if (exports == null)
			{
				return;
			}
			List<ExportItem> listItem = exports.ExportItems;

			string exportSql = string.Empty;
			DataTable dtTemp = new DataTable();
			List<ExpRow> listExpRow = new List<ExpRow>();
			string strHeaderText = string.Empty;

			#region "创建工作簿和表"
			//创建工作薄
			HSSFWorkbook mWorkBook = new HSSFWorkbook();
			#endregion
			#region "右击文件 属性信息"
			DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
			dsi.Company = "NPOI";
			mWorkBook.DocumentSummaryInformation = dsi;

			SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
			si.Title = strHeaderText;                     //填加xls文件标题信息[标题信息]
			si.Subject = "数据Excel";                     //填加文件主题信息[主题信息]
			si.Author = strHeaderText;                    //填加xls文件作者信息[文件作者信息]
			si.ApplicationName = "Excel";                 //填加xls文件创建程序信息[创建程序信息]
			si.LastAuthor = "匿名";                       //填加xls文件最后保存者信息[最后保存者信息]
			si.Comments = "匿名";                         //填加xls文件作者信息[作者信息]
			si.CreateDateTime = DateTime.Now;
			mWorkBook.SummaryInformation = si;
			#endregion
			#region "设置格式样式"

			//标题样式
			ICellStyle headStyle = mWorkBook.CreateCellStyle();
			headStyle.Alignment = HorizontalAlignment.Center;
			headStyle.VerticalAlignment = VerticalAlignment.Center;
			IFont font = mWorkBook.CreateFont();
			font.FontHeightInPoints = 20;
			font.Boldweight = 700;
			headStyle.SetFont(font);

			//列头样式
			ICellStyle ColumnStyle = mWorkBook.CreateCellStyle();
			ColumnStyle.Alignment = HorizontalAlignment.Center;
			ColumnStyle.VerticalAlignment = VerticalAlignment.Center;
			IFont fontColumn = mWorkBook.CreateFont();
			fontColumn.FontHeightInPoints = 12;
			fontColumn.Boldweight = 700;
			ColumnStyle.SetFont(fontColumn);

			//时间格式样式
			ICellStyle dateStyle = mWorkBook.CreateCellStyle();
			dateStyle.Alignment = HorizontalAlignment.Center;
			dateStyle.VerticalAlignment = VerticalAlignment.Center;
			IDataFormat format = mWorkBook.CreateDataFormat();
			dateStyle.DataFormat = format.GetFormat("yyyy-MM-dd");

			//列表数据样式
			ICellStyle CellStyle = mWorkBook.CreateCellStyle();
			CellStyle.WrapText = true;
			CellStyle.Alignment = HorizontalAlignment.Left;
			CellStyle.VerticalAlignment = VerticalAlignment.Center;
			CellStyle.Indention = 0;

			IFont FontBody = mWorkBook.CreateFont();
			FontBody.FontHeightInPoints = 12;
			FontBody.FontHeight = 250;
			FontBody.FontName = "新宋体";
			FontBody.Color = HSSFColor.OliveGreen.Black.Index;
			CellStyle.SetFont(FontBody);
			dateStyle.SetFont(FontBody);

			//尾部合计样式
			ICellStyle CellFootStyle = mWorkBook.CreateCellStyle();
			CellFootStyle.WrapText = true;
			CellFootStyle.Alignment = HorizontalAlignment.Center;
			CellFootStyle.VerticalAlignment = VerticalAlignment.Center;
			CellFootStyle.Indention = 0;

			IFont FontFoot = mWorkBook.CreateFont();
			FontFoot.FontHeightInPoints = 12;
			FontFoot.FontName = "新宋体";
			FontFoot.Color = HSSFColor.OliveGreen.Red.Index;
			CellFootStyle.SetFont(FontFoot);
			#endregion

			List<MySqlParameter> paramlist = new List<MySqlParameter>();

			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand comm = conn.CreateCommand();
				foreach (ExportItem item in listItem)
				{
					//创建一个名称为mySheet的表
					//
					if (item.sheetname != null)
					{
						strHeaderText = item.sheetname;
					}
					ISheet mSheet = mWorkBook.CreateSheet(strHeaderText == string.Empty ? "sheet1" : strHeaderText);
					//设置打印缩放比例
					mSheet.PrintSetup.Scale = 100;
					mSheet.PrintSetup.FitWidth = 420;
					mSheet.PrintSetup.FitHeight = 420;

					paramlist.Clear();
					dtTemp = GetDataTableXml(item, comm, param);
					listExpRow = item.ExpColumns.ListExpRows;
					if (dtTemp.Rows.Count == 0)
					{
						continue;
					}
					NopiExport(mWorkBook, mSheet, headStyle, ColumnStyle, dateStyle, CellStyle, CellFootStyle, dtTemp, listExpRow);
				}
			}

			#region "返回[MemoryStream]对象"
			using (MemoryStream ms = new MemoryStream())
			{
				mWorkBook.Write(ms);
				ms.Flush();
				ms.Position = 0;
				HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(filename) + ".xls");
				HttpContext.Current.Response.BinaryWrite(ms.ToArray());
				ms.Flush();
				ms.Close();
				ms.Dispose();
				HttpContext.Current.Response.End();
			}
			#endregion
		}

		private DataTable GetDataTableXml(ExportItem expItem, MySqlCommand comm, Hashtable param)
		{
			DataTable dtrowdata = new DataTable();
			List<MySqlParameter> paramlist = new List<MySqlParameter>();
			string sqlSource = string.Empty;

			//Type type = Type.GetType("类的完全限定名");
			//object obj = type.Assembly.CreateInstance(type);

			//Assembly assembly = Assembly.GetExecutingAssembly(); // 获取当前程序集 
			//object obj = assembly.CreateInstance("PartyCollege.Model.teacher.teacherService"); // 创建类的实例，返回为 object 类型，需要强制类型转换
			//Type type = Type.GetType("PartyCollege.Model.teacher.teacherService");
			//MethodInfo pinfo = type.GetMethod("exportStudentlist", BindingFlags.Public | BindingFlags.Instance, null
			//	, new Type[] { typeof(Hashtable)}, null);
			//List<object> methodParam = new List<object>();
			//methodParam.Add(param);
			//object aobj=pinfo.MakeGenericMethod(new Type[] { typeof(Hashtable) }).Invoke(obj, methodParam.ToArray());
			//type.InvokeMember("")

			//Type type = typeof(PartyCollege.Model.teacher.teacherService);
			

			if (expItem.SqlSource != null)
			{
				if (!string.IsNullOrEmpty(expItem.SqlSource.classname) && !string.IsNullOrEmpty(expItem.SqlSource.methodname))
				{
					Type type = Type.GetType(expItem.SqlSource.classname);
					object o = Activator.CreateInstance(type);
					dtrowdata = (DataTable)type.InvokeMember(expItem.SqlSource.methodname, BindingFlags.Default | BindingFlags.InvokeMethod, null, o, new object[] { param });
				}
				else
				{
					sqlSource = expItem.SqlSource.sqlText;
					sqlSource = exporthelper.GetMatchCollectionValue(expItem.SqlSource.sqlText, "[", "]", param, paramlist);
					comm.Parameters.Clear();
					foreach (MySqlParameter item in paramlist)
					{
						comm.Parameters.Add(item);
					}
					comm.CommandText = sqlSource;
					MySqlDataAdapter odatemp = new MySqlDataAdapter(comm);
					odatemp.Fill(dtrowdata);
				}
			}
			return dtrowdata;
		}

		protected void NopiExport(HSSFWorkbook mWorkBook, ISheet mSheet
			, ICellStyle headStyle, ICellStyle ColumnStyle
			, ICellStyle dateStyle, ICellStyle CellStyle, ICellStyle CellFootStyle, DataTable dt, List<ExpRow> listExpRow)
		{
			#region "表头设置"
			IRow headerRow = null;

			int rowidx = 0;
			int width = 20 * 256;
			string strCellText = string.Empty;

			List<string> dataColumn = new List<string>();
			foreach (ExpRow item in listExpRow)
			{
				headerRow = mSheet.CreateRow(rowidx);
				foreach (ExpColumn col in item.ListColumns)
				{
					strCellText = col.thtitle;
					//headerRow.HeightInPoints = 25;
					headerRow.CreateCell(col.firstcol).SetCellValue(strCellText);
					headerRow.GetCell(col.firstcol).CellStyle = ColumnStyle;
					mSheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(col.firstrow, col.lastrow, col.firstcol, col.lastcol));
					if (!string.IsNullOrEmpty(col.dbcolumn))
					{
						dataColumn.Add(col.dbcolumn);
					}
				}
				rowidx++;
			}
			#endregion

			#region "移除多余列"
			DataTable dtNew = dt.Copy();
			for (int j = 0; j < dtNew.Columns.Count; j++)
			{
				foreach (string field in dataColumn)
				{
					if (!dtNew.Columns[j].ColumnName.ToUpper().Equals(field.ToUpper())
						&& !ContainsNEC(dataColumn, dtNew.Columns[j].ColumnName.ToUpper()))
					{
						dt.Columns.Remove(dtNew.Columns[j].ColumnName.ToUpper());
						break;
					}
				}
			}
			#endregion

			#region "中间[数据]部分"
			//rowidx++;
			int columnIndex = 0;
			IRow dataRow;
			foreach (DataRow row in dt.Rows)
			{
				dataRow = mSheet.CreateRow(rowidx);
				columnIndex = 0;
				foreach (string item in dataColumn)
				{
					foreach (DataColumn column in dt.Columns)
					{
						if (item.ToLower() == column.ColumnName.ToLower())
						{
							DataCellStyle(dateStyle, CellStyle, row, dataRow, column, columnIndex);
							break;
						}
					}
					columnIndex++;
				}
				rowidx++;
			}
			#endregion

			SetWidthHeightAuto(mSheet);
		}

		protected void SetWidthHeightAuto(ISheet ffSheet)
		{
			for (int columnNum = 0; columnNum <= 26; columnNum++)
			{
				int columnWidth = ffSheet.GetColumnWidth(columnNum) / 256;//获取当前列宽度  
				for (int rowNum = 1; rowNum <= ffSheet.LastRowNum; rowNum++)//在这一列上循环行  
				{
					IRow currentRow = ffSheet.GetRow(rowNum);
					ICell currentCell = currentRow.GetCell(columnNum);
					if (currentCell == null || string.IsNullOrEmpty(currentCell.ToString())) continue;
					int length = Encoding.UTF8.GetBytes(currentCell.ToString()).Length;//获取当前单元格的内容宽度  
					if (columnWidth < length + 1)
					{
						columnWidth = length + 1;
					}//若当前单元格内容宽度大于列宽，则调整列宽为当前单元格宽度，后面的+1是我人为的将宽度增加一个字符  
				}
				ffSheet.SetColumnWidth(columnNum, columnWidth * 256);
			}

			for (int rowNum = 2; rowNum <= ffSheet.LastRowNum; rowNum++)
			{
				IRow currentRow = ffSheet.GetRow(rowNum);
				ICell currentCell = currentRow.GetCell(27);
				if (currentCell == null || string.IsNullOrEmpty(currentCell.ToString())) continue;
				int length = Encoding.UTF8.GetBytes(currentCell.ToString()).Length;
				currentRow.HeightInPoints = 20 * (length / 60 + 1);
			}
		}

		public static void DataCellStyle(ICellStyle dateStyle, ICellStyle CellStyle, DataRow row, IRow dataRow, DataColumn column, int columnindex)
		{
			ICell newCell = dataRow.CreateCell(columnindex);
			object drValue = row[column];
			switch (column.DataType.ToString())
			{
				case "System.String":               //字符串类型
					newCell.SetCellValue(drValue == DBNull.Value ? "" : drValue.ToString().Trim());  //[普通显示]
					newCell.CellStyle = CellStyle;  //[普通显示]
					break;
				case "System.DateTime":             //日期类型
					if (drValue.Equals(String.Empty))
					{
						newCell.SetCellValue(String.Empty);
						newCell.CellStyle = CellStyle;
					}
					else
					{
						DateTime dateV;
						DateTime.TryParse(drValue == DBNull.Value ? "" : drValue.ToString().Trim(), out dateV);
						newCell.SetCellValue(dateV);
						newCell.CellStyle = dateStyle;  //[时间显示]
					}
					break;
				case "System.Boolean":              //布尔型
					if (drValue.Equals(String.Empty))
					{
						newCell.SetCellValue(String.Empty);
						newCell.CellStyle = CellStyle;
					}
					else
					{
						bool boolV = false;
						bool.TryParse(drValue == DBNull.Value ? "" : drValue.ToString().Trim(), out boolV);
						newCell.SetCellValue(boolV);
						newCell.CellStyle = CellStyle;  //[布尔显示]
					}
					break;
				case "System.Int16":                //整型
				case "System.Int32":
				case "System.Int64":
				case "System.Byte":
					if (drValue.Equals(String.Empty))
					{
						newCell.SetCellValue(String.Empty);
						newCell.CellStyle = CellStyle;
					}
					else
					{
						int intV = 0;
						int.TryParse(drValue == DBNull.Value ? "0" : drValue.ToString().Trim(), out intV);
						newCell.SetCellValue(intV);
						newCell.CellStyle = CellStyle; //[数字显示]
					}
					break;
				case "System.Decimal":             //浮点型
				case "System.Double":
					if (drValue.Equals(String.Empty))
					{
						newCell.SetCellValue(String.Empty);
						newCell.CellStyle = CellStyle;
					}
					else
					{
						double doubV = 0;
						double.TryParse(drValue == DBNull.Value ? "0" : drValue.ToString().Trim(), out doubV);
						newCell.SetCellValue(doubV);
						newCell.CellStyle = CellStyle; //[小数显示]
					}
					break;
				case "System.DBNull":              //空值处理
					newCell.SetCellValue(String.Empty);
					newCell.CellStyle = CellStyle; //[普通显示]
					break;
				default:
					newCell.SetCellValue(String.Empty);
					newCell.CellStyle = CellStyle; //[普通显示]
					break;
			}
		}

		public bool ContainsNEC(List<string> fieldnamelist, string datefield)
		{
			bool result = false;
			foreach (string item in fieldnamelist)
			{
				if (item.ToUpper().Equals(datefield))
				{
					result = true;
					break;
				}
			}
			return result;
		}
	}
}