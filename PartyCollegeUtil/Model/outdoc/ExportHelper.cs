using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Data;
using System.Text.RegularExpressions;
using NPOI.HSSF.UserModel;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.HPSF;
using NPOI.HSSF.Util;
using System.Text;
using MySql.Data.MySqlClient;
using System.Collections;
using PartyCollegeUtil.config;

namespace PartyCollege.Model.outdoc
{
	public class ExportHelper
	{
		public ExportRoot GetRoot(string filepath)
		{
			string path = HttpContext.Current.Server.MapPath(filepath);
			ExportRoot _model = XmlSerializerData.DeserializeCofing<ExportRoot>(path);
			if (_model != null)
			{
				return _model;
			}
			return null;
		}

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

		public string GetMatchCollectionValue(string text, string start, string end, Hashtable param, List<MySqlParameter> paramlist)
		{
			//条件为空，去掉大括号
			string tempmatchvalue = string.Empty;
			string dealvalue = string.Empty;
			string patterntemp = Regex.Escape("{") + "(?<content>[^\\" + "{" + "\\" + "}" + "].*?)" + Regex.Escape("}");
			MatchCollection _matchtemp = Regex.Matches(text, patterntemp);
			if (_matchtemp.Count > 0)
			{
				foreach (Match _match in _matchtemp)
				{
					tempmatchvalue = _match.Value;
					dealvalue = GetMatchCurlyBracesParam(tempmatchvalue, start, end, param, paramlist);
					if (string.IsNullOrEmpty(dealvalue) || dealvalue == "undefined")
					{
						text = text.Replace(tempmatchvalue, "");
					}
					else
					{
						text = text.Replace(tempmatchvalue, dealvalue);
					}
				}
			}
			else
			{
				//text = GetMatchInnerParam(text, start, end, param, paramlist);
			}
			text = GetMatchInnerParam(text, start, end, param, paramlist);
			return text;
		}

		/// <summary>
		/// 大括号逻辑
		/// </summary>
		/// <param name="text"></param>
		/// <param name="start"></param>
		/// <param name="end"></param>
		/// <param name="param"></param>
		/// <param name="paramlist"></param>
		/// <returns></returns>
		public string GetMatchCurlyBracesParam(string text, string start, string end, Hashtable param, List<MySqlParameter> paramlist)
		{
			string pattern = Regex.Escape(start) + "(?<content>[^\\" + start + "\\" + end + "].*?)" + Regex.Escape(end);
			MatchCollection _matchcollection = Regex.Matches(text, pattern);
			string matchvalue = string.Empty;
			foreach (Match _match in _matchcollection)
			{
				matchvalue = _match.Value.Replace(start, "").Replace(end, "");
				if (param[matchvalue] != null && !string.IsNullOrEmpty(param[matchvalue].ToString()) && param[matchvalue].ToString() != "undefined")
				{
					text = text.Replace(_match.Value, "?" + matchvalue);
					text = text.Replace("{", "").Replace("}", "");
					paramlist.Add(new MySqlParameter(matchvalue, param[matchvalue].ToString()));
				}
				else
				{
					text = "";
				}
			}
			return text;
		}
		public string GetMatchInnerParam(string text, string start, string end, Hashtable param, List<MySqlParameter> paramlist)
		{
			string pattern = Regex.Escape(start) + "(?<content>[^\\" + start + "\\" + end + "].*?)" + Regex.Escape(end);
			MatchCollection _matchcollection = Regex.Matches(text, pattern);
			string matchvalue = string.Empty;
			foreach (Match _match in _matchcollection)
			{
				matchvalue = _match.Value.Replace(start, "").Replace(end, "");
				if (param[matchvalue] != null && !string.IsNullOrEmpty(param[matchvalue].ToString()) && param[matchvalue].ToString() != "undefined")
				{
					text = text.Replace(_match.Value, "?" + matchvalue);
					paramlist.Add(new MySqlParameter(matchvalue, param[matchvalue].ToString()));
				}
			}
			return text;
		}
	}
	[XmlRoot("root")]
	public class ExportRoot
	{
		private List<Exports> listexports = new List<Exports>();
		[XmlElement("exports")]
		public List<Exports> ListExports
		{
			get { return listexports; }
			set { listexports = value; }
		}
	}
	public class Exports{
		[XmlAttribute("category")]
		public string category { get; set; }
		[XmlAttribute("downfilename")]
		public string downfilename { get; set; }
		private List<ExportItem> exportItems = new List<ExportItem>();
		[XmlElement("exportitem")]
		public List<ExportItem> ExportItems
		{
			get { return exportItems; }
			set { exportItems = value; }
		}
	}
	public class ExportItem
	{
		[XmlAttribute("sheetname")]
		public string sheetname { get; set; }
		[XmlAttribute("templetdoc")]
		public string templetdoc { get; set; }

		[XmlElement("listextrasql")]
		public ListExtraSql ListSqlSource { get; set; }

		[XmlElement("sql")]
		public SqlSource SqlSource { get; set; }
		private ExpColumns expColumns = new ExpColumns();
		[XmlElement("expcolumns")]
		public ExpColumns ExpColumns
		{
			get { return expColumns; }
			set { expColumns = value; }
		}
	}

	public class ExpColumns
	{
		private List<ExpRow> listExpRows = new List<ExpRow>();
		[XmlElement("exprow")]
		public List<ExpRow> ListExpRows
		{
			get { return listExpRows; }
			set { listExpRows = value; }
		}
	}

	public class ListExtraSql
	{
		private List<ExtraSql> extraSqlSource = new List<ExtraSql>();
		[XmlElement("extrasql")]
		public List<ExtraSql> ExtraSqlSource
		{
			get { return extraSqlSource; }
			set { extraSqlSource = value; }
		}
	}
	public class ExtraSql
	{
		[XmlText]
		public string extraSql { get; set; }
	}
	public class SqlSource {
		[XmlAttribute("classname")]
		public string classname { get; set; }
		[XmlAttribute("methodname")]
		public string methodname { get; set; }
		[XmlText]
		public string sqlText { get; set; }
	}
	public class ExpRow
	{
		private List<ExpColumn> listColumns = new List<ExpColumn>();
		[XmlElement("expcolumn")]
		public List<ExpColumn> ListColumns
		{
			get { return listColumns; }
			set { listColumns = value; }
		}
	}
	public class ExpColumn
	{
		[XmlAttribute("firstrow")]
		public int firstrow { get; set; }
		[XmlAttribute("lastrow")]
		public int lastrow { get; set; }
		[XmlAttribute("firstcol")]
		public int firstcol { get; set; }
		[XmlAttribute("lastcol")]
		public int lastcol { get; set; }
		[XmlAttribute("mergetype")]
		public string mergetype { get; set; }
		[XmlAttribute("cellmerge")]
		public string cellmerge { get; set; }
		[XmlAttribute("fontfamily")]
		public string fontfamily { get; set; }
		[XmlAttribute("fontsize")]
		public string fontsize { get; set; }
		[XmlAttribute("fontcolor")]
		public string fontcolor { get; set; }
		[XmlAttribute("width")]
		public string width { get; set; }
		[XmlAttribute("textalign")]
		public string textalign { get; set; }


		[XmlAttribute("dbcolumn")]
		public string dbcolumn { get; set; }
		[XmlAttribute("thtitle")]
		public string thtitle { get; set; }
	}
}