using Aspose.Words;
using Aspose.Words.Reporting;
using Aspose.Words.Saving;
using Aspose.Words.Tables;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace PartyCollege.Model.outdoc
{
	public class HandleMergeFieldInsertHtml : IFieldMergingCallback
	{
		public HandleMergeFieldInsertHtml() { 
		
		}
		//文本处理在这里
		void IFieldMergingCallback.FieldMerging(FieldMergingArgs e)
		{
			if (e.DocumentFieldName.ToLower().IndexOf("html_")>-1)
			{
				// 使用DocumentBuilder处理图片的大小
				DocumentBuilder builder = new DocumentBuilder(e.Document);
				builder.MoveToMergeField(e.FieldName);
				builder.InsertHtml(e.FieldValue.ToString());
			}
		}
		//图片处理在这里
		void IFieldMergingCallback.ImageFieldMerging(ImageFieldMergingArgs args)
		{

		}
	}
	public class ExportDocHelper
	{
		private ExportHelper expHelper = new ExportHelper();
		private Aspose.Words.Document doc = null;
		private Aspose.Words.DocumentBuilder builder = null;

		private Aspose.Words.Document templet_doc = null;
		private Aspose.Words.DocumentBuilder templet_builder = null;
		private string downfilename = string.Empty;
		public enum saveType
		{
			doc,
			docx,
			html
		}

		/// <summary>
		/// 创建doc
		/// </summary>
		/// <param name="category"></param>
		/// <param name="info_id"></param>
		private void CreateExportDoc(string category, string info_id)
		{
			//取出xml文件
			Exports exports = GetExports(category);
			ExportItem expItem = GetExportItem(exports, "");
			if (expItem == null)
			{
				return;
			}
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				string sheetname = string.Empty;// "课程分类";
				string sql = string.Empty;
				sql = "select * from sy_courseware_category order by sortnum";
				MySqlCommand comm = conn.CreateCommand();
				comm.CommandText = sql;
				MySqlDataAdapter odatemp = new MySqlDataAdapter(comm);
				DataTable dt = new DataTable();
				odatemp.Fill(dt);
				Hashtable param = new Hashtable();

				DataRow[] rows=dt.Select("fid='0'");

				foreach (DataRow item in rows)
				{
					SetTableTitle(item["name"].ToString(), "one");
					foreach (DataRow row in dt.Select("fid='" + item["id"].ToString() + "'"))
					{
						param.Clear();
						SetTableTitle(row["name"].ToString(), "two");
						param.Add("categoryid", row["id"].ToString());
						DrawDocTable(expItem, sheetname, comm, param, "table");
					}
					builder.InsertBreak(BreakType.SectionBreakNewPage);
				}
			}
		}
		public void ExportDoc(string info_id, string category, string strFileName)
		{
			string path = HttpContext.Current.Server.MapPath("~/outPutWord/templet_empty.doc");
			doc = new Aspose.Words.Document(path);
			builder = new Aspose.Words.DocumentBuilder(doc);
			InsertToc(true);
			CreateExportDoc(category, info_id);
			UpdateToc(doc);
			saveDoc(HttpContext.Current.Response, doc, strFileName, ExportDocHelper.saveType.doc);
		}

		/// <summary>
		/// 导出学习心得
		/// </summary>
		/// <param name="info_id"></param>
		/// <param name="category"></param>
		public void ExportSenseDoc(Hashtable param, string category)
		{
			string sheetname = string.Empty;//"学习心得";
			//取出xml文件
			Exports exports = GetExports(category);
			ExportItem expItem = GetExportItem(exports, sheetname);
			if (expItem == null)
			{
				return;
			}
			downfilename = exports.downfilename;
			string path = HttpContext.Current.Server.MapPath("~/outPutWord/templet_empty.doc");
			doc = new Aspose.Words.Document(path);
			builder = new Aspose.Words.DocumentBuilder(doc);

			string templetpath = HttpContext.Current.Server.MapPath("~/outPutWord/" + expItem.templetdoc);
			templet_doc = new Aspose.Words.Document(templetpath);
			templet_builder = new Aspose.Words.DocumentBuilder(templet_doc);

			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand comm = conn.CreateCommand();

				List<ExtraSql> listsql = expItem.ListSqlSource.ExtraSqlSource;
				string sqltext = string.Empty;
				List<MySqlParameter> paramlist = new List<MySqlParameter>();
				foreach (ExtraSql item in listsql)
				{
					comm.Parameters.Clear();
					paramlist.Clear();
					sqltext = item.extraSql;
					sqltext = expHelper.GetMatchCollectionValue(sqltext, "[", "]", param, paramlist);
					//ErrLog.Log(sqltext);
					comm.CommandText = sqltext;
					foreach (MySqlParameter p in paramlist)
					{
						comm.Parameters.Add(p);
					}
					DataTable dt = new DataTable();
					MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
					adpt.Fill(dt);
					if (dt.Rows.Count > 0)
					{
						templet_doc.MailMerge.FieldMergingCallback = new HandleMergeFieldInsertHtml();
						
						templet_doc.MailMerge.Execute(dt.Rows[0]);
					}
				}
				DrawDocTable(expItem, sheetname, comm, param, "normal");
				UpdateToc(templet_doc);

				//DataTable dt = GetSyClassInfo(comm, param);
				//if (dt != null && dt.Rows.Count > 0)
				//{
				//	DataRow item = dt.Rows[0];
				//	downfilename = item["bcname"].ToString() + ".doc";
				//	//InsertToc(false);
				//	DrawDocTable(expItem, sheetname, comm, param, "normal");
				//	UpdateToc(templet_doc);
				//}
			}
			if (!string.IsNullOrEmpty(downfilename))
			{
				saveDoc(HttpContext.Current.Response, templet_doc, downfilename, ExportDocHelper.saveType.doc);
			}
		}


		public void ExportBcKcListSenseDoc(Hashtable param, string category)
		{
			string sheetname = string.Empty;//"学习心得";
			//取出xml文件
			Exports exports = GetExports(category);
			ExportItem expItem = GetExportItem(exports, sheetname);
			if (expItem == null)
			{
				return;
			}
			downfilename = exports.downfilename;
			string path = HttpContext.Current.Server.MapPath("~/outPutWord/templet_empty.doc");
			doc = new Aspose.Words.Document(path);
			builder = new Aspose.Words.DocumentBuilder(doc);

			string templetpath = HttpContext.Current.Server.MapPath("~/outPutWord/" + expItem.templetdoc);
			templet_doc = new Aspose.Words.Document(templetpath);
			templet_builder = new Aspose.Words.DocumentBuilder(templet_doc);

			MySqlDataAdapter adpt;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand comm = conn.CreateCommand();
				List<ExtraSql> listsql = expItem.ListSqlSource.ExtraSqlSource;
				string sqltext = string.Empty;
				List<MySqlParameter> paramlist = new List<MySqlParameter>();
				foreach (ExtraSql item in listsql)
				{
					comm.Parameters.Clear();
					paramlist.Clear();
					sqltext = item.extraSql;
					sqltext = expHelper.GetMatchCollectionValue(sqltext, "[", "]", param, paramlist);
					//ErrLog.Log(sqltext);
					comm.CommandText = sqltext;
					foreach (MySqlParameter p in paramlist)
					{
						comm.Parameters.Add(p);
					}
					DataTable dt = new DataTable();
					adpt = new MySqlDataAdapter(comm);
					adpt.Fill(dt);
					if (dt.Rows.Count > 0)
					{
						templet_doc.MailMerge.FieldMergingCallback = new HandleMergeFieldInsertHtml();
						templet_doc.MailMerge.Execute(dt.Rows[0]);
					}
				}
				comm.Parameters.Clear();
				string condition = string.Empty;
				if (param["title"].ToString() != "undefined")
				{
					condition += " and ss.title like concat('%',?title,'%')";
					comm.Parameters.Add(new MySqlParameter("title", param["title"]));
				}
				if (param["stuname"].ToString() != "undefined")
				{
					condition += " and b.name like concat('%',?stuname,'%')";
					comm.Parameters.Add(new MySqlParameter("stuname", param["stuname"]));
				}
				if (param["status"].ToString() != "undefined")
				{
					condition += " and ss.status=?status";
					comm.Parameters.Add(new MySqlParameter("status", param["status"]));
				}
				if (param["recommend"].ToString() != "undefined")
				{
					condition += " and ss.recommend=?recommend";
					comm.Parameters.Add(new MySqlParameter("recommend", param["recommend"]));
				}
				comm.CommandText = @"select ware.name as kcname,clsc.id from sy_classcourse clsc 
									INNER JOIN sy_courseware ware on clsc.coursewareid=ware.id 
									where clsc.classid=?classid 
									and exists(select * from sy_classcourse_learningsense ss inner join sy_student b on ss.studentid=b.id where  ss.status>=1 " + condition + " and ss.classcourseid=clsc.id)";

				
				comm.Parameters.Add(new MySqlParameter("classid", param["classid"]));
				DataSet ds = new DataSet();
				DataTable dtkc = new DataTable();
				adpt = new MySqlDataAdapter(comm);
				adpt.Fill(dtkc);
				dtkc.TableName = "kclist";
				ds.Tables.Add(dtkc);

				DataTable dtrowdata = GetDataTableXml(expItem, comm, param);
				dtrowdata.TableName = "datalist";
				ds.Tables.Add(dtrowdata);

				// Get the DataColumn objects from two DataTable objects 
				// in a DataSet. Code to get the DataSet not shown here.
				DataColumn parentColumn =
					ds.Tables["kclist"].Columns["id"];
				DataColumn childColumn =
					ds.Tables["datalist"].Columns["classcourseid"];
				// Create DataRelation.
				DataRelation relCustOrder;
				relCustOrder = new DataRelation("kcclasscourse",
					parentColumn, childColumn);
				// Add the relation to the DataSet.
				ds.Relations.Add(relCustOrder);

				templet_doc.MailMerge.ExecuteWithRegions(ds);

				//DrawDocTable(expItem, sheetname, comm, param, "normal");
				UpdateToc(templet_doc);
			}
			if (!string.IsNullOrEmpty(downfilename))
			{
				saveDoc(HttpContext.Current.Response, templet_doc, downfilename, ExportDocHelper.saveType.doc);
			}
		}

//		private DataTable GetSyCourseAndClassInfo(MySqlCommand comm, Hashtable param)
//		{
//			string sql = string.Empty;
//			sql = @"select bc.name as bcname,kc.name as kcname from sy_classcourse sc 
//					inner join sy_class bc on sc.classid=bc.id 
//					inner join sy_courseware kc on sc.coursewareid=kc.id 
//					where sc.id=?classcourseid";
//			comm.Parameters.Clear();
//			comm.CommandText = sql;
//			comm.Parameters.Add(new MySqlParameter("classcourseid", param["classcourseid"]));
//			DataTable dt = new DataTable();
//			MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
//			adpt.Fill(dt);
//			return dt;
//		}
		//private DataTable GetSyClassInfo(MySqlCommand comm, Hashtable param)
		//{
		//	string sql = string.Empty;
		//	sql = "select sc.name as bcname from sy_class sc where id=?bcid";
		//	comm.Parameters.Clear();
		//	comm.CommandText = sql;
		//	comm.Parameters.Add(new MySqlParameter("bcid", param["bcid"]));
		//	DataTable dt = new DataTable();
		//	MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
		//	adpt.Fill(dt);
		//	return dt;
		//}

		/// <summary>
		/// 更新目录的域
		/// </summary>
		private void UpdateToc(Aspose.Words.Document doctemp)
		{
			//更新目录的域
			doctemp.UpdatePageLayout();
			doctemp.UpdateFields();
		}

		/// <summary>
		/// 插入目录
		/// </summary>
		private void InsertToc(bool moveToStart)
		{
			//插入目录
			doc.FirstSection.Body.PrependChild(new Paragraph(doc));
			if (moveToStart)
			{
				builder.MoveToDocumentStart();
			}
			// Insert a table of contents at the beginning of the document.             
			builder.InsertTableOfContents("\\o \"1-3\" \\h \\z \\u");
			// Start the actual document content on the second page.                          
			builder.InsertBreak(BreakType.SectionBreakNewPage);
		}

		private void SetTableData(DataTable dtrowdata, ExportItem expItem)
		{
			//Section currentSection = builder.CurrentSection;
			//PageSetup pageSetup = currentSection.PageSetup;
			builder.StartTable();

			//double tableWidth = pageSetup.PageWidth - pageSetup.LeftMargin - pageSetup.RightMargin;
			//设置表头
			if (dtrowdata.Rows.Count > 0)
			{
				List<ExpColumn> fieldlist = SetTableHeader(expItem);
				
				foreach (DataRow r in dtrowdata.Rows)
				{
					foreach (ExpColumn field in fieldlist)
					{
						builder.InsertCell();
						builder.CellFormat.Borders.LineStyle = LineStyle.Single;
						builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
						builder.CellFormat.VerticalMerge = CellMerge.None;
						builder.CellFormat.HorizontalMerge = CellMerge.None;
						builder.CellFormat.LeftPadding = 0;
						builder.CellFormat.RightPadding = 0;
						builder.CellFormat.TopPadding = 0;
						builder.CellFormat.BottomPadding = 0;
						builder.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(Convert.ToDouble(field.width));
						if (field.textalign.ToLower() == "left")
						{
							builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;
						}
						else if (field.textalign.ToLower() == "right")
						{
							builder.ParagraphFormat.Alignment = ParagraphAlignment.Right;
						}
						else
						{
							builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;
						}
						builder.Write(r[field.dbcolumn].ToString());
						builder.Font.ClearFormatting();
					}	
					builder.EndRow();
				}
			}
			builder.EndTable();
		}
		private ExportItem GetExportItem(Exports exports, string sheetname)
		{
			List<ExportItem> listItem = exports.ExportItems;
			ExportItem lookForItem = null;
			foreach (ExportItem item in listItem)
			{
				if (string.IsNullOrEmpty(sheetname))
				{
					lookForItem = item;
					break;
				}
				else
				{
					if (("," + item.sheetname + ",").IndexOf(sheetname) > -1)
					{
						lookForItem = item;
						break;
					}
				}
			}
			return lookForItem;
		}


		public  Exports GetExports(string category)
		{
			string filepath = "~/config/DocExport.xml";
			ExportRoot pjroot = expHelper.GetRoot(filepath);
			Exports exports = expHelper.GetExportsByCategory(category, pjroot);
			return exports;
		}

		private void DrawDocTable(ExportItem expItem, string sheetname, MySqlCommand comm, Hashtable param, string contentType)
		{
			DrawDocTableDataFromXML(expItem, comm, param, contentType);
		}

		private void DrawDocTableDataFromXML(ExportItem expItem, MySqlCommand comm, Hashtable param, string contentType)
		{
			DataTable dtrowdata = GetDataTableXml(expItem, comm, param);
			dtrowdata.TableName = "datalist";
			if (contentType == "table")
			{
				SetTableData(dtrowdata, expItem);
			}
			else
			{
				//templet_doc.MailMerge.Execute(dtrowdata.Rows[0]);
				templet_doc.MailMerge.ExecuteWithRegions(dtrowdata);
				//SetContentData(dtrowdata, expItem);
			}
		}

		//private void SetContentData(DataTable dtrowdata, ExportItem expItem)
		//{
		//	int length = dtrowdata.Rows.Count;
		//	if (length > 0)
		//	{
		//		List<ExpRow> exprows = expItem.ExpColumns.ListExpRows;
		//		List<ExpColumn> fieldlist = new List<ExpColumn>();
		//		foreach (ExpRow item in exprows)
		//		{
		//			fieldlist = item.ListColumns;
		//			foreach (DataRow r in dtrowdata.Rows)
		//			{
		//				foreach (ExpColumn field in fieldlist)
		//				{
		//					builder.Writeln(field.dbcolumn);
		//					builder.Writeln(r[field.dbcolumn].ToString());
		//					builder.Font.ClearFormatting();
		//				}
		//			}
		//		}
		//	}
		//	return;
		//}

		private DataTable GetDataTableXml(ExportItem expItem, MySqlCommand comm, Hashtable param)
		{
			DataTable dtrowdata = new DataTable();
			List<MySqlParameter> paramlist = new List<MySqlParameter>();
			string sqlSource = string.Empty;
			if (expItem.SqlSource != null)
			{
				sqlSource = expItem.SqlSource.sqlText;
				sqlSource = expHelper.GetMatchCollectionValue(expItem.SqlSource.sqlText, "[", "]", param, paramlist);
				comm.Parameters.Clear();
				foreach (MySqlParameter item in paramlist)
				{
					comm.Parameters.Add(item);
				}
				comm.CommandText = sqlSource;
				MySqlDataAdapter odatemp = new MySqlDataAdapter(comm);
				odatemp.Fill(dtrowdata);
			}
			return dtrowdata;
		}

		

		public void SetTableHeadFont(ExpColumn col)
		{
			//调用word 的正文样式
			builder.ParagraphFormat.ClearFormatting();
			builder.ParagraphFormat.Style = doc.Styles["Normal"];
			if (col.textalign.ToLower() == "left")
			{
				builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;
			}
			else if (col.textalign.ToLower() == "right")
			{
				builder.ParagraphFormat.Alignment = ParagraphAlignment.Right;
			}
			else
			{
				builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;
			}

			SetFont(
				(string.IsNullOrEmpty(col.fontfamily) ? "黑体" : col.fontfamily)
				, (Convert.ToDouble("0" + col.fontsize) > 0 ? Convert.ToDouble("0" + col.fontsize) : 10.5)
				, false, GetColor(col.fontcolor));
			builder.Write(col.thtitle.Trim());
			builder.Font.ClearFormatting();
		}

		public System.Drawing.Color GetColor(string color)
		{
			Color clr;
			switch (color.ToLower())
			{
				case "red":
					clr = Color.Red;
					break;
				default:
					clr = Color.Black;
					break;
			}
			return clr;
		}

		private List<ExpColumn> SetTableHeader(ExportItem expItem)
		{
			List<ExpColumn> fieldlist = new List<ExpColumn>();
			List<ExpRow> exprows = expItem.ExpColumns.ListExpRows;
			int length = exprows.Count;
			int colcount = 0;
			List<ExpColumn> expCols = null;
			for (int i = 0; i < length; i++)
			{
				ExpRow row = exprows[i];
				expCols = row.ListColumns;
				colcount = expCols.Count;
				for (int j = 0; j < colcount; j++)
				{
					ExpColumn col = expCols[j];

					builder.InsertCell();
					builder.CellFormat.Borders.LineStyle = LineStyle.Single;
					builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
					builder.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(Convert.ToDouble(col.width));

					//列名需配置在最后一行
					if (!string.IsNullOrEmpty(col.dbcolumn))
					{
						fieldlist.Add(col);
					}

					//if (Convert.ToDouble("0" + col.width) > 0)
					//{
					//    builder.CellFormat.Width = Convert.ToDouble("0" + col.width);
					//}
					SetTableHeadFont(col);

					//垂直方向
					if (col.mergetype == "vertical")
					{
						if (col.cellmerge == "first")
						{
							builder.CellFormat.VerticalMerge = CellMerge.First;
							builder.CellFormat.HorizontalMerge = CellMerge.None;
						}
						else if (col.cellmerge == "previous")
						{
							builder.CellFormat.VerticalMerge = CellMerge.Previous;
							builder.CellFormat.HorizontalMerge = CellMerge.None;
						}
						else
						{
							builder.CellFormat.VerticalMerge = CellMerge.None;
							builder.CellFormat.HorizontalMerge = CellMerge.None;
						}
					}


					if (col.mergetype == "horizontal")
					{
						//水平方向
						if (col.cellmerge == "first")
						{
							builder.CellFormat.HorizontalMerge = CellMerge.First;
							builder.CellFormat.VerticalMerge = CellMerge.None;
						}
						else if (col.cellmerge == "previous")
						{
							builder.CellFormat.HorizontalMerge = CellMerge.Previous;
							builder.CellFormat.VerticalMerge = CellMerge.None;
						}
						else
						{
							builder.CellFormat.HorizontalMerge = CellMerge.None;
							builder.CellFormat.VerticalMerge = CellMerge.None;
						}
					}

					if (col.mergetype == "none")
					{
						//无
						builder.CellFormat.HorizontalMerge = CellMerge.None;
						builder.CellFormat.VerticalMerge = CellMerge.None;
					}
				}
				builder.EndRow();
			}
			return fieldlist;
		}

		public void SetFont(string fontName, double fontSize, bool Bold, System.Drawing.Color Color)
		{
			builder.Font.ClearFormatting();
			Aspose.Words.Font titleFont = builder.Font;
			titleFont.Size = fontSize;
			titleFont.Bold = Bold;
			titleFont.Color = Color;
			titleFont.Name = fontName;
		}
		public void SetTableTitle(string TitleText,string level)
		{
			//调用word 的正文样式
			builder.ParagraphFormat.ClearFormatting();
			builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;
			
			string templet = string.Empty;
			if (level == "one")
			{
				SetFont("宋体", 22, false, Color.Black);
				builder.ParagraphFormat.StyleIdentifier = StyleIdentifier.Heading1; 
			}
			else if (level == "two")
			{
				SetFont("宋体", 16, false, Color.Black);
				builder.ParagraphFormat.StyleIdentifier = StyleIdentifier.Subtitle; 
				builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;
			}
			else if (level == "title")
			{
				SetFont("宋体", 22, false, Color.Black);
				builder.ParagraphFormat.StyleIdentifier = StyleIdentifier.Title; 
			}
			builder.Writeln(TitleText);
			builder.Font.ClearFormatting();
			builder.ParagraphFormat.ClearFormatting();
		}

		/// <summary>
		/// 在浏览器中打开WORD文件或者Excel
		/// </summary>
		/// <param name="response"></param>
		/// <param name="doc">Aspose.Words.Document</param>
		/// <param name="filename">文件名</param>
		/// <param name="saveType">保存格式</param>
		public void saveDoc(HttpResponse response, Aspose.Words.Document doc, string filename, saveType saveType)
		{
			SaveOptions saveOption = SaveOptions.CreateSaveOptions(SaveFormat.Doc);
			switch (saveType)
			{
				case ExportDocHelper.saveType.doc:
					saveOption.SaveFormat = SaveFormat.Doc;
					break;
				case ExportDocHelper.saveType.docx:
					saveOption.SaveFormat = SaveFormat.Docx;
					break;
				case ExportDocHelper.saveType.html:
					saveOption.SaveFormat = SaveFormat.Html;
					break;
			}
			doc.Save(response, filename, ContentDisposition.Attachment, saveOption);
			//doc.Save(resp, "成绩单.doc", ContentDisposition.Inline, Aspose.Words.Saving.SaveOptions.CreateSaveOptions(SaveFormat.Doc));
		}

		/// <summary>
		/// 导出学员
		/// </summary>
		/// <param name="param"></param>
		/// <param name="category"></param>
		//public void ExportStudentDoc(Hashtable param, string category)
		//{
		//	//teacherService ts = new teacherService();
		//	//DataTable dt= ts.exportStudentlist(param["classid"].ToString(), param["name"].ToString(), param["company"].ToString(), param["signstatus"].ToString(), param["graduatestatus"].ToString(), param["studyrate"].ToString());
		//	//dt.TableName = "studentlist";

		//	downfilename = "学员列表.doc";
		//	string path = HttpContext.Current.Server.MapPath("~/outPutWord/templet_empty.doc");
		//	doc = new Aspose.Words.Document(path);
		//	builder = new Aspose.Words.DocumentBuilder(doc);

		//	string templetpath = HttpContext.Current.Server.MapPath("~/outPutWord/templet_student.doc");
		//	templet_doc = new Aspose.Words.Document(templetpath);
		//	templet_builder = new Aspose.Words.DocumentBuilder(templet_doc);

		//	//templet_doc.MailMerge.ExecuteWithRegions(dt);

		//	//if (!string.IsNullOrEmpty(downfilename))
		//	//{
		//	//	saveDoc(HttpContext.Current.Response, templet_doc, downfilename, ExportDocHelper.saveType.doc);
		//	//}
		//}
	}
}