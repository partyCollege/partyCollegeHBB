using CollegeAPP.DataModel;
using CollegeAPP.Model;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;

namespace CollegeAPP.config
{
	public class configAppraise
	{
		static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
		private XmlDocument doc=new XmlDocument();

		public configAppraise()
		{
			doc.Load(HttpContext.Current.Server.MapPath("~/config/PJSetting.xml"));
		}

		private string getXmlText(XmlNode node)
		{
			if (node.InnerText == null)
			{
				return "";
			}
			else
			{
				return node.InnerText;
			}
		}

		/// <summary>
		/// 得到xml指定节点的属性值；
		/// </summary>
		/// <param name="node"></param>
		/// <param name="AttriName"></param>
		/// <returns></returns>
		private string getXmlAttriValue(XmlNode node, string AttriName)
		{
			if (node.Attributes[AttriName] == null)
			{
				return "";
			}
			else
			{
				return node.Attributes[AttriName].Value;
			}
		}
		
		/// <summary>
		/// 获取pjsetting.xml文件中的对应SQL
		/// </summary>
		/// <param name="rdata"></param>
		/// <returns></returns>
		private string GetItemSql(ReqData rdata)
		{
			string sql = string.Empty;
			string itempath = GetItemPath(rdata) + "/tabs[@role='" + rdata.role + "']/tab[@ispj='" + rdata.ispj + "']/list/sql";
			//ErrLog.Log(itempath);
			XmlNode itemnode = doc.SelectSingleNode(itempath);
			sql = getXmlText(itemnode);
			sql = sql.Replace("[ispj]", rdata.ispj);
			foreach (System.Reflection.PropertyInfo p in rdata.GetType().GetProperties())
			{
				if (p.GetValue(rdata, null) != null)
				{
					sql = sql.Replace("[" + p.Name + "]", p.GetValue(rdata, null).ToString());
				}
			}
			sql = GetMatchCollectionValue(sql, "[", "]");
			return sql;
		}

		private XmlNodeList GetItemColumnList(ReqData rdata)
		{
			string itempath = GetItemPath(rdata) + "/tabs[@role='" + rdata.role + "']/tab[@ispj='" + rdata.ispj + "']/list/columns";
			return doc.SelectSingleNode(itempath).ChildNodes;
		}

		private XmlNode GetItemNode(ReqData rdata)
		{
			string itempath = GetItemPath(rdata);
			return doc.SelectSingleNode(itempath);
		}

		public List<PjTab> GetXmlItemList(ReqData rdata)
		{
			ReqData req = new ReqData();
			req.bcid = rdata.bcid;
			req.version = rdata.version;
			req.edition = rdata.edition;
			req.isyjs = rdata.isyjs;
			//req.itemid = rdata"1";// item的编号
			//req.role = rdata.role;
			//req.tabid = rdata.tabid;//tab页的编号
			//req.ispj = rdata.ispj;//未评
			//req.bcorclass = rdata;
			//req.userid = rdata.userid;

			XmlNodeList tabList = doc.SelectNodes(GetItemPath(req));
			List<PjTab> pjtabs = new List<PjTab>();
			PjTab tab = null;
			foreach (XmlNode item in tabList)
			{
				tab = new PjTab();
				tab.id = getXmlAttriValue(item, "id");
				tab.name = getXmlAttriValue(item, "name");
				tab.shortname = getXmlAttriValue(item, "shortname");
				tab.bcorclass = getXmlAttriValue(item, "bcorclass");
				pjtabs.Add(tab);
			}
			return pjtabs;
		}

		private string GetItemPath(ReqData rdata)
		{
			string itemconn = string.Empty;
			string itempath = "/Root/codes/code";
			double version = Convert.ToDouble(rdata.version);
			if (version != 0 || !string.IsNullOrEmpty(rdata.isyjs))
			{
				itempath += "[";
				if (version != 0)
				{
					itemconn += " @version='" + version.ToString("0.0") + "'";
				}
				if (!string.IsNullOrEmpty(rdata.isyjs))
				{
					if (!string.IsNullOrEmpty(itemconn))
					{
						itemconn += " and ";
					}
					itemconn += " @isyjs='" + rdata.isyjs + "'";
				}
				itempath += itemconn + "]";
			}
			itempath += "/plans/plan[";
			if (!string.IsNullOrEmpty(rdata.edition))
			{
				itempath += "@edition='" + rdata.edition + "'";
			}
			if (!string.IsNullOrEmpty(rdata.category))
			{
				itempath += " and @category='" + rdata.category + "'";
			}
			itempath += "]/item";
			if (!string.IsNullOrEmpty(rdata.bcorclass) || !string.IsNullOrEmpty(rdata.itemid))
			{
				itemconn = "";
				itempath += "[";
				if (!string.IsNullOrEmpty(rdata.bcorclass))
				{
					itemconn += " @bcorclass='" + rdata.bcorclass + "'";
				}
				if (!string.IsNullOrEmpty(rdata.itemid))
				{
					if (!string.IsNullOrEmpty(itemconn))
					{
						itemconn += " and ";
					}
					itemconn += " @id='" + rdata.itemid + "'";
				}
				itempath += itemconn;
				itempath += "]";
			}
			return itempath;
		}

		/// <summary>
		/// 得到评价项集合；
		/// </summary>
		/// <param name="xd"></param>
		/// <param name="p"></param>
		/// <returns></returns>
		public List<pjitem> getPJItemList(ReqData rdata)
		{
			string pjpath = string.Empty;
			List<pjitem> listitem = new List<pjitem>();
			string itempath = GetItemPath(rdata);
			string headpath = string.Empty;
			XmlNode nodetemp = doc.SelectSingleNode(itempath);
			if (nodetemp != null)
			{
				//济南党校的一个item 对应多种评价表单的选择。
				if (!string.IsNullOrEmpty(getXmlAttriValue(nodetemp, "ChooseOneForm")) && getXmlAttriValue(nodetemp, "ChooseOneForm").ToLower() == "true")
				{
					headpath = itempath + "/form[@formname='" + rdata.formname + "']/head";
				}
				else
				{
					headpath = itempath + "/form/head";
				}
			}

			nodetemp = doc.SelectSingleNode(headpath);
			if (nodetemp == null)
			{
				headpath = itempath + "/head";
			}

			pjpath = headpath.Replace("/head", "/pjitemsource");
			XmlNode sourcenode = doc.SelectSingleNode(pjpath);
			string rangeTemp = string.Empty;
			List<string> rangelist = null;
			int begin = 0;
			int end = 0;
			List<string> displayPoint=null;
			List<string> Point=null;

			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
				MySqlDataAdapter adpt = null;
				DataTable dtrange = new DataTable();
				if (sourcenode == null)
				{
					pjpath = headpath.Replace("/head", "/pjitem");
					XmlNodeList nodelist = doc.SelectNodes(pjpath);
					XmlNode rangesqlnode = null;
					int length = nodelist.Count;
					string rangsqlpath = string.Empty;
					for (int i = 0; i < length; i++)
					{
						pjitem item = new pjitem();
						XmlNode node = nodelist[i];
						begin = 0;
						end = 0;
						rangelist = new List<string>();
						displayPoint = new List<string>();
						Point = new List<string>();

						item.level1Id = Convert.ToInt32(getXmlAttriValue(node, "level1id") == "" ? "0" : getXmlAttriValue(node, "level1id"));
						item.level2Id = Convert.ToInt32(getXmlAttriValue(node, "level2id") == "" ? "0" : getXmlAttriValue(node, "level2id"));
						item.level1Title = getXmlAttriValue(node, "level1title");
						item.level2Title = getXmlAttriValue(node, "level2title");
						rangeTemp = getXmlAttriValue(node, "range");
						if (!string.IsNullOrEmpty(rangeTemp))
						{
							begin = Convert.ToInt32(rangeTemp.Split('-')[0]);
							end = Convert.ToInt32(rangeTemp.Split('-')[1]);
							item.rangeMin = begin;
							item.rangeMax = end;
							for (int k = end; k >= begin; k--)
							{
								rangelist.Add(k.ToString());
							}
							item.range = rangelist;
						}
						item.hiddenRange = getXmlAttriValue(node, "hiddenrange") == "" ? "false" : getXmlAttriValue(node, "hiddenrange");
						item.type = getXmlAttriValue(node, "type");
						double calcrate = 1;
						if (!string.IsNullOrEmpty(getXmlAttriValue(node, "calcrate")))
						{
							calcrate = Convert.ToDouble(getXmlAttriValue(node, "calcrate"));
						}
						item.calcrate = calcrate;
						if (!string.IsNullOrEmpty(getXmlAttriValue(node, "display_point")))
						{
							string[] temp = getXmlAttriValue(node, "display_point").Split(',');
							string[] temppoint = getXmlAttriValue(node, "point").Split(',');
							for (int k = 0; k < temp.Length; k++)
							{
								displayPoint.Add(temp[k]);
								Point.Add(temppoint[k]);
							}
						}
						item.displayPoint = displayPoint;
						item.point = Point;
						item.notNull = getXmlAttriValue(node, "notnull");
						item.orderIdx = Convert.ToDouble("0" + getXmlAttriValue(node, "orderidx"));
						item.isyjs = rdata.isyjs;
						item.defaultvalue = getXmlAttriValue(node, "defaultvalue");
						item.rangetextfield = getXmlAttriValue(node, "rangetextfield");
						item.rangevalfield = getXmlAttriValue(node, "rangevalfield");

						rangsqlpath = pjpath + "/rangesql";
						rangesqlnode = doc.SelectSingleNode(rangsqlpath);
						if (rangesqlnode != null && getXmlText(node) != "")
						{
							item.rangesql = getXmlText(node);
							if (!string.IsNullOrEmpty(item.rangesql))
							{
								foreach (System.Reflection.PropertyInfo p in rdata.GetType().GetProperties())
								{
									if (p.GetValue(rdata, null) != null)
									{
										item.rangesql = item.rangesql.Replace("[" + p.Name + "]", p.GetValue(rdata, null).ToString());
									}
								}
								item.rangesql = GetMatchCollectionValue(item.rangesql, "[", "]");

								cmd.CommandText = item.rangesql;
								adpt = new MySqlDataAdapter(cmd);
								dtrange.Clear();
								adpt.Fill(dtrange);
								item.rangekeyval = new List<KeyValuePair<string, string>>();
								foreach (DataRow rowrange in dtrange.Rows)
								{
									item.rangekeyval.Add(new KeyValuePair<string, string>(rowrange[item.rangevalfield].ToString(), rowrange[item.rangetextfield].ToString()));
								}
							}
						}
						listitem.Add(item);
					}
				}
				else
				{
					#region 模板SQL和模板评价项
					pjpath = headpath.Replace("/head", "/pjitemsource/sql");
					XmlNode sqlnode = doc.SelectSingleNode(pjpath);
					pjpath = headpath.Replace("/head", "/pjitemsource/tepmletpjitem");
					XmlNode pjnode = doc.SelectSingleNode(pjpath);

					string sourcesql = getXmlText(sqlnode);
					if (!string.IsNullOrEmpty(sourcesql))
					{
						//通过xml 配置的pjitem 来显示评价项，目前只支持单一类型，都是单选
						//MySqlConnection conn = new MySqlConnection(ConnectionString);
						//conn.Open();
						string sql = string.Empty;
						DataTable itdt = new DataTable();
						sourcesql = GetMatchCollectionValue(sourcesql, "[", "]");
						try
						{
							adpt = new MySqlDataAdapter(sourcesql, conn);
							adpt.Fill(itdt);
						}
						catch (Exception ex)
						{
						}
						finally
						{
							conn.Close();
						}

						if (itdt != null && itdt.Rows.Count > 0)
						{
							int length = itdt.Rows.Count;
							for (int i = 0; i < length; i++)
							{
								pjitem item = new pjitem();
								DataRow node = itdt.Rows[i];
								if (pjnode.SelectSingleNode("level1id") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("level1id"))))
								{
									item.level1Id = Convert.ToInt32(node[getXmlText(pjnode.SelectSingleNode("level1id"))] == DBNull.Value
										? "0" : node[getXmlText(pjnode.SelectSingleNode("level1id"))].ToString());
								}
								if (pjnode.SelectSingleNode("level2id") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("level2id"))))
								{
									item.level2Id = Convert.ToInt32(node[getXmlText(pjnode.SelectSingleNode("level2id"))] == DBNull.Value
										? "0" : node[getXmlText(pjnode.SelectSingleNode("level2id"))].ToString());
								}
								if (pjnode.SelectSingleNode("level1title") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("level1title"))))
								{
									item.level1Title = node[getXmlText(pjnode.SelectSingleNode("level1title"))].ToString();
								}
								if (pjnode.SelectSingleNode("level2title") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("level2title"))))
								{
									item.level2Title = node[getXmlText(pjnode.SelectSingleNode("level2title"))].ToString();
								}
								if (pjnode.SelectSingleNode("range") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("range"))))
								{
									rangeTemp = getXmlAttriValue(pjnode, "range");
									if (!string.IsNullOrEmpty(rangeTemp))
									{
										begin = Convert.ToInt32(rangeTemp.Split('-')[0]);
										end = Convert.ToInt32(rangeTemp.Split('-')[1]);
										for (int k = end; k >= begin; k--)
										{
											rangelist.Add(k.ToString());
										}
									}
									item.range = rangelist;
								}
								if (pjnode.SelectSingleNode("notnull") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("notnull"))))
								{
									item.notNull = node[getXmlText(pjnode.SelectSingleNode("notnull"))].ToString();
								}
								if (pjnode.SelectSingleNode("type") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("type"))))
								{
									item.type = node[getXmlText(pjnode.SelectSingleNode("type"))].ToString();
								}
								if (pjnode.SelectSingleNode("display_point") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("display_point"))))
								{
									string[] temp = node[getXmlText(pjnode.SelectSingleNode("display_point"))].ToString().Split(',');

									for (int k = 0; k < temp.Length; k++)
									{
										displayPoint.Add(temp[i]);

									}
									item.displayPoint = displayPoint;
								}
								if (pjnode.SelectSingleNode("point") != null && !string.IsNullOrEmpty(getXmlText(pjnode.SelectSingleNode("point"))))
								{
									string[] temppoint = node[getXmlText(pjnode.SelectSingleNode("point"))].ToString().Split(',');
									for (int k = 0; k < temppoint.Length; k++)
									{
										Point.Add(temppoint[i]);
									}
									item.point = Point;
								}
								listitem.Add(item);
							}
						}
					}
					#endregion
				}
			}
			return listitem;
		}


		private DataTable GetPJItem(ReqData rdata)
		{
			StringBuilder condition = new StringBuilder();
			condition.Append(" and bcid=" + rdata.bcid);
			condition.Append(" and version=" + rdata.version);
			condition.Append(" and plan=" + rdata.edition);
			condition.Append(" and pjtypeid=" + rdata.itemid);
			condition.Append(" and pjtype='" + rdata.bcorclass + "'");
			condition.Append(" and userid=" + rdata.userid);
			if (!string.IsNullOrEmpty(rdata.kwid))
                condition.Append(" and kwid='" + rdata.kwid + "'");
			if (!string.IsNullOrEmpty(rdata.dyid))
				condition.Append(" and dyid='" + rdata.dyid + "'");
			if (!string.IsNullOrEmpty(rdata.dykkid))
				condition.Append(" and dykkid='" + rdata.dykkid + "'");
			if (!string.IsNullOrEmpty(rdata.jxxs))
				condition.Append(" and jxxs='" + rdata.jxxs + "'");
			if (!string.IsNullOrEmpty(rdata.zcrid))
				condition.Append(" and zcrid='" + rdata.zcrid + "'");
			if (!string.IsNullOrEmpty(rdata.category))
				condition.Append(" and categorys='" + rdata.category + "'");
			//string orderby = " order by orderidx desc ";
			string sql = "select * from jw_appraise ja where 1>0 " + condition.ToString();
			DataTable dt = new DataTable();
			ErrLog.Log(sql);
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				if (conn.State == ConnectionState.Closed)
				{
					conn.Open();
				}
				MySqlCommand comm = conn.CreateCommand();
				comm.CommandText = sql;
				MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
				adpt.Fill(dt);
			}
			return dt;
		}

		public appraiseInfo GetPJInfoList(ReqData rdata)
		{
			appraiseInfo pgtemp = new appraiseInfo();

			//获取该版本对应的所有评价项
			//pgtemp.pjItemList = getPJItemList(rdata);

			List<PJKCInfo> infolist = new List<PJKCInfo>();
			#region 获取列表显示数据
			DataTable dt = GetKCDataList(rdata);
			//评价列表页的数据集合
			List<PJRowData> listData = new List<PJRowData>();
			pjListPjItemPjData listitemdata = null;
			//评价列表页的数据行单位
			PJRowData pgrow = null;
			//评价列表页的数据行的列集合
			List<ListColumn> listcol = null;
			//评价列表页的数据行的列单位
			ListColumn col = null;
			//获取pjsetting.xml的column
			XmlNodeList pjcols = GetItemColumnList(rdata);
			XmlNode itemnode = GetItemNode(rdata);
			if (dt != null && dt.Rows.Count > 0)
			{
				int length = dt.Rows.Count;
				//int plitemlen = pgtemp.pjItemList.Count;
				int cols = pjcols.Count;
				//int orderIdx = 0;//记录当前位置的索引
				string condition = string.Empty;
				for (int i = 0; i < length; i++)
				{
					System.Data.DataRow kcrow = dt.Rows[i];
					pgrow = new PJRowData();
					listcol = new List<ListColumn>();
					for (int j = 0; j < cols; j++)
					{
						col = new ListColumn();
						XmlNode pjcolnode = pjcols[j];
						if (getXmlAttriValue(pjcolnode, "istitle") == "true")
						{
							col.istitle = true;
						}
						if (!string.IsNullOrEmpty(getXmlAttriValue(pjcolnode, "columntype")))
						{
							col.columntype = getXmlAttriValue(pjcolnode, "columntype");
						}
						col.value = kcrow[getXmlAttriValue(pjcolnode, "dbcolumn")];
						listcol.Add(col);
					}
					pgrow.keyData = kcrow[getXmlAttriValue(itemnode, "keycolumn")].ToString();
					if (dt.Columns.Contains("formname"))
					{
						pgrow.formname = kcrow["formname"].ToString();
					}
					pgrow.noclick = (kcrow["hasdispaly"].ToString() == "1");
					condition = "pjtype='" + rdata.bcorclass + "'";
					if (rdata.bcorclass == "class")
					{
						pgrow.kcid = kcrow["kc_id"].ToString();
						condition = condition + " and bcid=" + rdata.bcid + " and kcid=" + kcrow["kc_id"].ToString() + " and kwid=" + kcrow["kwid"].ToString() + " and userid=" + rdata.userid;
					}
					else if (rdata.bcorclass == "dy")
					{
						pgrow.dyid = pgrow.keyData.ToString();
					}
					pgrow.rowListColumnData = listcol;
					listData.Add(pgrow);
				}
			}
			pgtemp.listData = listData;
			#endregion
			return pgtemp;
		}
		public appraiseInfo GetAppraisePageData(ReqData rdata)
		{
			appraiseInfo pgtemp = new appraiseInfo();
			//根据未评课程集合和评价项集合，以及已评项和暂存项集合，拼凑出一个巨大的数组，用于跳题和跳课
			List<pjListPjItemPjData> jumpDataList = new List<pjListPjItemPjData>();
			//获取该版本对应的所有评价项
			pgtemp.pjItemList = getPJItemList(rdata);

			//获取该班的所有已经保存的评价数据
			DataTable pjdata = GetPJItem(rdata);

			//获取该班所有评价的完成情况，true完成，false未完成。
			DataTable dtPjStatus = GetPJStatus(rdata);

			#region 获取列表显示数据
			DataTable dt = GetKCDataList(rdata);
			//评价列表页的数据集合
			List<PJRowData> listData = new List<PJRowData>();
			pjListPjItemPjData listitemdata = null;
			//评价列表页的数据行单位
			PJRowData pgrow = null;
			//评价列表页的数据行的列集合
			List<ListColumn> listcol = null;
			//评价列表页的数据行的列单位
			ListColumn col = null;
			//获取pjsetting.xml的column
			XmlNodeList pjcols = GetItemColumnList(rdata);
			XmlNode itemnode = GetItemNode(rdata);
			if (dt != null && dt.Rows.Count > 0)
			{
				int length = dt.Rows.Count;
				int plitemlen = pgtemp.pjItemList.Count;
				int cols = pjcols.Count;
				double orderIdx = 0;//记录当前位置的索引
				string condition = string.Empty;
				for (int i = 0; i < length; i++)
				{
					System.Data.DataRow kcrow = dt.Rows[i];
					pgrow = new PJRowData();
					listcol = new List<ListColumn>();
					for (int j = 0; j < cols; j++)
					{
						col = new ListColumn();
						XmlNode pjcolnode = pjcols[j];
						if (getXmlAttriValue(pjcolnode, "istitle") == "true")
						{
							col.istitle = true;
						}
						if (!string.IsNullOrEmpty(getXmlAttriValue(pjcolnode, "columntype")))
						{
							col.columntype = getXmlAttriValue(pjcolnode, "columntype");
						}
						col.value = kcrow[getXmlAttriValue(pjcolnode, "dbcolumn")];
						listcol.Add(col);
					}
					pgrow.keyData = kcrow[getXmlAttriValue(itemnode, "keycolumn")].ToString();
					pgrow.noclick = (kcrow["hasdispaly"].ToString() == "1");
					condition="pjtype='"+rdata.bcorclass+"'";
					if (rdata.bcorclass == "class")
					{
						condition = condition + " and bcid=" + rdata.bcid + " and kcid=" + kcrow["kc_id"].ToString() + " and kwid=" + kcrow["kwid"].ToString() + " and userid=" + rdata.userid;
					}
					DataRow[] pjrows=dtPjStatus.Select(condition);
					if(pjrows.Length>0){
						pgrow.ypItemCount =Convert.ToInt32("0"+pjrows[0]["ypitemcount"]);
					}else{
						pgrow.ypItemCount = 0;
					}

					if(pgtemp.pjItemList.Count==pgrow.ypItemCount){
						pgrow.isfinshed=true;
					}
					
					pgrow.rowListColumnData = listcol;
					listData.Add(pgrow);

					//内循环评价项集合
					for (int g = 0; g < plitemlen; g++)
					{
						listitemdata = new pjListPjItemPjData();
						listitemdata.keyData = pgrow.keyData;
						listitemdata.bcid = rdata.bcid;
						pjitem pitm = pgtemp.pjItemList[g];
						//课程评价的关键字段
						if (dt.Columns.Contains("kc_id")) {
							listitemdata.kcid = kcrow["kc_id"].ToString();
						}
						if (dt.Columns.Contains("kwid"))
						{
							listitemdata.kwid = kcrow["kwid"].ToString();
						}
						//单元评价的关键字段
						if (dt.Columns.Contains("dyid"))
						{
							listitemdata.dyid = kcrow["dyid"].ToString();
						}
						if (dt.Columns.Contains("dykkid"))
						{
							listitemdata.dykkid = kcrow["dykkid"].ToString();
						}
						//课程和单元评价共用一个字段bt.
						listitemdata.bt = kcrow["bt"].ToString();
						if (dt.Columns.Contains("subtitle"))
						{
							listitemdata.subtitle = kcrow["subtitle"].ToString();
						}
						listitemdata.userid = rdata.userid;
						listitemdata.pjtypeid = rdata.itemid;
						listitemdata.isyjs = rdata.isyjs;
						//以下为pjitem的属性
						listitemdata.orderIdx = orderIdx;
						orderIdx++;
						listitemdata.pjtype = rdata.bcorclass; //class or bc
						listitemdata.hiddenRange = pitm.hiddenRange;
						listitemdata.range = pitm.range;
						listitemdata.rangekeyval = pitm.rangekeyval;
						listitemdata.level1Id = pitm.level1Id;
						listitemdata.level1Title = pitm.level1Title;
						listitemdata.level2Id = pitm.level2Id;
						listitemdata.level2Title = pitm.level2Title;
						listitemdata.notNull = pitm.notNull;

						listitemdata.displayPoint = pitm.displayPoint;
						listitemdata.point = pitm.point;
						listitemdata.type = pitm.type;//input text select

						if (pgrow.isfinshed) { 
							listitemdata.ispost = 1;
							listitemdata.isfinshed = true;
						}
						else
						{
							listitemdata.ispost = 0;
							listitemdata.isfinshed = false;
						}
						condition = "pjtype='" + listitemdata.pjtype + "' and level1=" + listitemdata.level1Id;
						if (!string.IsNullOrEmpty(listitemdata.level2Title)) {
							condition = condition + " and level2=" + listitemdata.level2Id;
						}
						if (listitemdata.pjtype == "class")
						{
							condition = condition + " and bcid=" + listitemdata.bcid + " and kcid=" + listitemdata.kcid + " and kwid=" + listitemdata.kwid + " and userid=" + listitemdata.userid;
						}

						DataRow[] rval= pjdata.Select(condition);
						string selval = string.Empty;
						if (rval.Length > 0)
						{
							if (pitm.type == "select" || pitm.type == "radio" || pitm.type == "text")
							{
								listitemdata.selectValue = rval[0]["pj"].ToString();
							}
							else
							{
								listitemdata.selectValue = rval[0]["pjcontent"].ToString();
							}
						}
						else
						{
							listitemdata.selectValue = "";
						}
						jumpDataList.Add(listitemdata);
					}
				}
			}
			pgtemp.jumpDataList = jumpDataList;
			pgtemp.listData = listData;
			#endregion

			return pgtemp;
		}

		private DataTable GetPJStatus(ReqData rdata)
		{
			DataTable dt = new DataTable();
			string sql = "select * from jw_appraiseStudentTotal jst where jst.bcid=" + rdata.bcid;
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				if (conn.State == ConnectionState.Closed)
				{
					conn.Open();
				}
				MySqlCommand comm = conn.CreateCommand();
				comm.CommandText = sql;
				MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
				adpt.Fill(dt);
			}
			return dt;
		}
		/// <summary>
		/// 获取课程列表.
		/// </summary>
		/// <param name="rdata"></param>
		/// <returns></returns>
		private DataTable GetKCDataList(ReqData rdata)
		{
			string sql = string.Empty;
			string condition = string.Empty;
			string orderby = string.Empty;
			DataTable dt = new DataTable();
			sql = GetItemSql(rdata);
			ErrLog.Log(sql);
			if (sql != "")
			{
				using (MySqlConnection conn = new MySqlConnection(ConnectionString))
				{
					if (conn.State == ConnectionState.Closed)
					{
						conn.Open();
					}
					MySqlCommand comm = conn.CreateCommand();
					comm.CommandText = sql;
					MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
					adpt.Fill(dt);
				}
			}
			return dt;
		}

		public string GetMatchCollectionValue(string text, string start, string end)
		{
			string pattern = Regex.Escape(start) + "(?<content>[^\\" + start + "\\" + end + "].*?)" + Regex.Escape(end);
			MatchCollection _matchcollection = Regex.Matches(text, pattern);
			string matchvalue = string.Empty;
			string beforevalue = string.Empty;
			foreach (Match _match in _matchcollection)
			{
				beforevalue = _match.Value;
				matchvalue = _match.Value.Replace(start, "").Replace(end, "");
				if (matchvalue.IndexOf("sysconfig.") > -1)
				{
					text = text.Replace(beforevalue, SystemConfig.AppSettings[matchvalue.Replace("sysconfig.", "")]);
				}
			}
			return text;
		}


		public bool DoPJJson(List<pjListPjItemPjData> datas)
		{
			bool result = false;
			string sql = string.Empty;
			MySqlTransaction myTran = null;
			pjListPjItemPjData pj = null;
			MySqlConnection conn = new MySqlConnection(ConnectionString);

			//从集合中取出bcid.
			string bcid = string.Empty;
			for (int i = 0; i < datas.Count; i++)
			{
				pj = datas[i];
				bcid = pj.bcid;
				break;
			}

			JW_BCGL bcinfo = new JW_BCGL();
			bcinfo.info_id = bcid;
			bcinfo = bcinfo.get();
			MySqlCommand myCmd;
			string keytemp = ",";
			List<AppraiseStudentTotal> appTotalList = new List<AppraiseStudentTotal>();
			AppraiseStudentTotal apptol = null;
			string values = string.Empty;
			try
			{
				if (conn.State == ConnectionState.Closed)
				{
					conn.Open();
				}
				myTran = conn.BeginTransaction();
				myCmd = new MySqlCommand();
				myCmd.Connection = conn;
				myCmd.Transaction = myTran;
				
				string delsql = string.Empty;
				string sqlindx = string.Empty;
				//DataBase_Type dbType = OledbAppdbType.GetMySqlDbType();
				//switch (dbType)
				//{
				//	case DataBase_Type.hangao:
				//		sqlindx = "nextval('jw_appraise_seq')";
				//		break;
				//	default:
				sqlindx = "jw_appraise_seq.nextval";
				//		break;
				//}


				for (int i = 0; i < datas.Count; i++)
				{
					pj = datas[i];
					if (keytemp.IndexOf("," + pj.keyData + ",") < 0)
					{
						apptol = new AppraiseStudentTotal();
						keytemp = keytemp + pj.keyData + ",";
						apptol.bcid = bcinfo.info_id;
						apptol.kcid = pj.kcid;
						apptol.kwid = pj.kwid;
						apptol.dyid = pj.dyid;
						apptol.dykkid = pj.dykkid;
						apptol.pjtype = pj.pjtype;
						apptol.userid = pj.userid;
						apptol.pjtypeid = pj.pjtypeid;
						apptol.jxxs = pj.jxxs;
						appTotalList.Add(apptol);
					}
					delsql = "delete from jw_appraise where bcid=" + pj.bcid + " and version=" + bcinfo.pjVersion + " and  plan=" + bcinfo.pjPlanEdition
					+ " and pjtypeid= " + pj.pjtypeid + " and pjtype= '" + pj.pjtype + "'" + " and ispost=0 and userid=" + pj.userid;
					if (!string.IsNullOrEmpty(pj.isyjs))
						delsql = delsql + " and isyjs=" + pj.isyjs;
					if (!string.IsNullOrEmpty(pj.kcid))
						delsql = delsql + " and kcid='" + pj.kcid + "'";
					if (!string.IsNullOrEmpty(pj.kwid))
						delsql = delsql + " and kwid='" + pj.kwid + "'";
					if (!string.IsNullOrEmpty(pj.dyid))
						delsql = delsql + " and dyid='" + pj.dyid + "'";
					if (!string.IsNullOrEmpty(pj.zcrid))
						delsql = delsql + " and zcrid='" + pj.zcrid + "'";
					if (!string.IsNullOrEmpty(pj.dykkid))
						delsql = delsql + " and dykkid='" + pj.dykkid + "'";
					if (!string.IsNullOrEmpty(pj.jxxs))
						delsql = delsql + " and jxxs='" + pj.jxxs + "'";
					if (pj.level1Id > -1)
						delsql = delsql + " and level1='" + pj.level1Id + "'";
					if (pj.level2Id > -1)
						delsql = delsql + " and level2='" + pj.level2Id + "'";
					//if (!string.IsNullOrEmpty(pj.categorys))
					//	sql = sql + " and categorys='" + pj.categorys + "'";
					myCmd.CommandText = delsql;
					myCmd.ExecuteNonQuery();

					myCmd.Parameters.Clear();

					sql = "INSERT INTO jw_appraise(id,version,plan,pjtypeid,level1,level1title,level2,level2title";
					values = "" + sqlindx + ",:version,:plan,:pjtypeid,:level1,:level1title,:level2,:level2title";
					if (pj.type == "textarea" || pj.type == "check" || pj.type == "selectsourse")
					{
						sql += ",pjcontent";
						values += ",:pjcontent";
					}
					else
					{
						sql += ",pj";
						values += ",:pj";
					}
					if (pj.pjtype == "class")
					{
						sql += ",kwid,kcid";
						values += ",:kwid,:kcid";
					}else if (pj.pjtype == "jxxs")
					{
						sql += ",jxxs";
						values += ",:jxxs";
					}
					else if (pj.pjtype == "zcr")
					{
						sql += ",zcrid";
						values += ",:zcrid";
					}
					//if (!string.IsNullOrEmpty(categorys))
					//{
					//	sql += ",categorys";
					//	values += ",:categorys";
					//}
					sql += ",bcid,pjtype,ispost,inputtype,pjdate,userid,isyjs,dyid,dykkid,calcrate,clienttype)values(";
					values += ",:bcid,:pjtype,:ispost,:inputtype,sysdate,:userid,:isyjs,:dyid,:dykkid,:calcrate,1)";
					sql = sql + values;
					myCmd.CommandText = sql;
					myCmd.Parameters.Add(new MySqlParameter("version", bcinfo.pjVersion));
					myCmd.Parameters.Add(new MySqlParameter("plan", bcinfo.pjPlanEdition));
					myCmd.Parameters.Add(new MySqlParameter("pjtypeid", pj.pjtypeid));
					myCmd.Parameters.Add(new MySqlParameter("level1", pj.level1Id));
					myCmd.Parameters.Add(new MySqlParameter("level1title", pj.level1Title));
					myCmd.Parameters.Add(new MySqlParameter("level2", pj.level2Id));
					myCmd.Parameters.Add(new MySqlParameter("level2title", pj.level2Title));
					if (pj.type == "textarea" || pj.type == "check" || pj.type == "selectsourse")
						myCmd.Parameters.Add(new MySqlParameter("pjcontent", pj.selectValue));
					else
						myCmd.Parameters.Add(new MySqlParameter("pj", Convert.ToDouble(string.IsNullOrEmpty(pj.selectValue) ? "0" : pj.selectValue)));

					if (pj.pjtype.ToLower() == "class")
					{
						myCmd.Parameters.Add(new MySqlParameter("kwid", pj.kwid));
						myCmd.Parameters.Add(new MySqlParameter("kcid", pj.kcid));
					}else if (pj.pjtype == "jxxs")
					{
						myCmd.Parameters.Add(new MySqlParameter("jxxs", pj.jxxs));
					}
					else if (pj.pjtype == "zcr")
					{
						myCmd.Parameters.Add(new MySqlParameter("zcrid", pj.zcrid));
					}

					myCmd.Parameters.Add(new MySqlParameter("bcid", pj.bcid));
					myCmd.Parameters.Add(new MySqlParameter("pjtype", pj.pjtype));
					if (pj.isfinshed)
					{
						pj.ispost = 1;
					}
					myCmd.Parameters.Add(new MySqlParameter("ispost", pj.ispost));//0表示暂存，1表示提交；
					myCmd.Parameters.Add(new MySqlParameter("inputType", pj.type));
					myCmd.Parameters.Add(new MySqlParameter("userid", pj.userid));
					myCmd.Parameters.Add(new MySqlParameter("isyjs", Convert.ToInt32(pj.isyjs)));
					myCmd.Parameters.Add(new MySqlParameter("dyid", pj.dyid));
					myCmd.Parameters.Add(new MySqlParameter("dykkid", pj.dykkid));
					myCmd.Parameters.Add(new MySqlParameter("calcrate",string.IsNullOrEmpty(pj.calcrate)?"1":pj.calcrate));
					myCmd.ExecuteNonQuery();
				}
				myTran.Commit();
				result = true;
				myCmd.Dispose();
			}
			catch (System.Exception ew)
			{
				ErrLog.Log(ew);
				myTran.Rollback();
				throw ew;
			}
			finally
			{
				//conn.Close();
			}
			//对分离出来的集合进行颗粒度升级。
			
			//调用的是学员系统的服务
			CollegeAPP.ReCalcPjData.WS_ReCalcUnitTotal wservice = new ReCalcPjData.WS_ReCalcUnitTotal();
			wservice.CollegeReCalcUnitTotalPjData(bcid, "");

			myCmd = new MySqlCommand();
			myCmd.Connection = conn;
			string condtion = string.Empty;
			string jacondtion = string.Empty;
			for (int i = 0; i < appTotalList.Count; i++)
			{
				apptol = appTotalList[i];
				condtion = " and jst.bcid='" + apptol.bcid + "' and jst.pjtypeid='" + apptol.pjtypeid + "' and userid='" + apptol.userid + "'";

				sql = @"select count(*) from jw_appraiseStudentTotal jst where 1>0";
				if (apptol.pjtype.ToLower() == "class")
				{
					condtion += " and jst.kcid='" + apptol.kcid + "' and jst.kwid='" + apptol.kwid + "' and jst.pjtype='class'";
				}

				if (apptol.pjtype.ToLower() == "dy")
				{
					condtion += " and jst.dyid='" + apptol.kcid + "' and jst.pjtype='dy'";
				}

				if (apptol.pjtype.ToLower() == "jxxs")
				{
					condtion += " and jst.jxxs='"+apptol.jxxs+"' and jst.pjtype='jxxs'";
				}

				if (apptol.pjtype.ToLower() == "zcr")
				{
					condtion += " and jst.zcrid='" + apptol.zcrid + "' and jst.pjtype='zcr'";
				}

				if (apptol.pjtype.ToLower() == "bc")
				{
					condtion += " and jst.pjtype='bc'";
				}
				myCmd.CommandText = sql + condtion;
				myCmd.Connection = conn;
				int cct = Convert.ToInt32("0" + myCmd.ExecuteScalar());
				if (cct <= 0)
				{
					sql = @"insert into jw_appraiseStudentTotal(jstid,bcid,userid,ypitemcount,pjtype,pjtypeid";
					values = "values(:jstid,:bcid,:userid,0,:pjtype,:pjtypeid";
					if (apptol.pjtype == "class")
					{
						sql = sql + ",kcid,kwid,dyid,dykkid";
						values = values + ",:kcid,:kwid,:dyid,:dykkid";
					}
					if (apptol.pjtype == "dy")
					{
						sql = sql + ",dyid";
						values = values + ",:dyid";
					}
					if (apptol.pjtype == "jxxs")
					{
						sql = sql + ",jxxs";
						values = values + ",:jxxs";
					}
					if (apptol.pjtype == "zcr")
					{
						sql = sql + ",zcrid";
						values = values + ",:zcrid";
					}
					sql = sql + ")";
					values = values + ")";

					myCmd.Parameters.Clear();
					myCmd.Parameters.Add(new MySqlParameter("jstid", Guid.NewGuid().ToString("N")));
					myCmd.Parameters.Add(new MySqlParameter("bcid", apptol.bcid));
					
					myCmd.Parameters.Add(new MySqlParameter("userid", apptol.userid));
					myCmd.Parameters.Add(new MySqlParameter("pjtype", apptol.pjtype));
					myCmd.Parameters.Add(new MySqlParameter("pjtypeid", apptol.pjtypeid));
					if (apptol.pjtype == "class")
					{
						myCmd.Parameters.Add(new MySqlParameter("kcid", apptol.kcid));
						myCmd.Parameters.Add(new MySqlParameter("kwid", apptol.kwid));
						myCmd.Parameters.Add(new MySqlParameter("dyid", apptol.dyid));
						myCmd.Parameters.Add(new MySqlParameter("dykkid", apptol.dykkid));
					}
					if (apptol.pjtype == "dy")
					{
						myCmd.Parameters.Add(new MySqlParameter("dyid", apptol.dyid));
					}
					if (apptol.pjtype == "jxxs")
					{
						myCmd.Parameters.Add(new MySqlParameter("jxxs", apptol.jxxs));
					}
					if (apptol.pjtype == "zcr")
					{
						myCmd.Parameters.Add(new MySqlParameter("zcrid", apptol.zcrid));
					}
					myCmd.CommandText = sql+values;
					myCmd.ExecuteNonQuery();
				}
				//jacondtion = condtion.Replace("jst", "ja");
				//sql = "update jw_appraiseStudentTotal jst set ypitemcount=(select count(*) from jw_appraise ja where 1>0 and ja.ispost=1" + jacondtion + ") where 1>0 " + condtion;
				//ErrLog.Log(sql);
				//myCmd.CommandText = sql;
				//myCmd.ExecuteNonQuery();
			}
			return result;
		}

		public PJKCInfo GetPJDataList(ReqData rdata)
		{
			PJKCInfo kcinfo = new PJKCInfo();
			//获取该版本对应的所有评价项
			kcinfo.PjItemList = getPJItemList(rdata);
			//获取该班的所有已经保存的评价数据
			DataTable pjdata = GetPJItem(rdata);
			List<pjListPjItemPjData> list = new List<pjListPjItemPjData>();
			pjListPjItemPjData item = null;
			foreach (DataRow temp in pjdata.Rows)
			{
				item = new pjListPjItemPjData();
				item.level1Id =Convert.ToInt32(temp["level1"].ToString());
				item.level2Id =Convert.ToInt32( temp["level2"].ToString());
				item.bcid = temp["bcid"].ToString();
				item.kwid = temp["kwid"].ToString();
				item.kcid = temp["kcid"].ToString();
				item.dyid = temp["dyid"].ToString();
				item.isyjs = temp["isyjs"].ToString();
				item.pjtypeid = temp["pjtypeid"].ToString();
				item.type = temp["inputtype"].ToString();
				item.pjtype = temp["pjtype"].ToString();
				item.userid = temp["userid"].ToString();
				item.ispost =Convert.ToInt32( temp["ispost"].ToString());
				if (pjdata.Columns.Contains("jxxs"))
				{
					item.jxxs = temp["jxxs"].ToString();
				}
				if (pjdata.Columns.Contains("zcrid"))
				{
					item.zcrid = temp["zcrid"].ToString();
				}
				if (item.type == "textarea" || item.type == "check" || item.type == "selectsourse")
				{
					item.selectValue = temp["pjcontent"].ToString();
				}
				else
				{
					item.selectValue = temp["pj"].ToString();
				}
				list.Add(item);
			}
			kcinfo.PJedItemList = list;
			return kcinfo;
		}

		public AppMessage SaveZJPJJson(PJFormData formdata)
		{
			AppMessage appmsg = new AppMessage();
			string sql = string.Empty;
			MySqlConnection conn = new MySqlConnection(ConnectionString);
			MySqlCommand myCmd;
			conn.Open();
			//先检查是否已经评了
			sql = "select count(*) from jw_appraise_zjtotal where kwid=:kwid and jsid=:jsid";
			myCmd = new MySqlCommand();
			myCmd.CommandText = sql;
			myCmd.Connection = conn;
			myCmd.Parameters.Add(new MySqlParameter("kwid", formdata.kwid));
			myCmd.Parameters.Add(new MySqlParameter("jsid", formdata.zjid));
			int count=Convert.ToInt32("0"+ myCmd.ExecuteScalar());
			if (count > 0)
			{
				appmsg.msgStatus = false;
				appmsg.msgContent = "您已评价该课程，不能重复提交";
				return appmsg;
			}

			MySqlTransaction myTran = conn.BeginTransaction();
			myCmd = new MySqlCommand();
			myCmd.Connection = conn;
			myCmd.Transaction = myTran;

			List<KCPJItem> datalist = formdata.ListPJItem;
			//保存评价记录
			try
			{
				foreach (KCPJItem item in datalist)
				{
					sql = @"insert into jw_appraise_zj(kwid,jsid,name,title,id,placeholder,minval,maxval,inputtype,scorerate,val,valtext,notnull)
							values(:kwid,:jsid,:name,:title,:id,:placeholder,:minval,:maxval,:inputtype,:scorerate,:val,:valtext,:notnull)";
//					sql = @"insert into jw_appraise_zj(kwid,jsid,name,title,id,placeholder,minval,maxval,inputtype,scorerate,val,valtext,notnull)
//					values('" + formdata.kwid + "','" + formdata.zjid + "','" + item.name + "','" + item.title + "','" + Guid.NewGuid().ToString() + "','" + item.placeholder + "'," + item.minval + "," + item.maxval + ",'" + item.inputtype + "'," + item.scorerate + ",'" + item.val + "','" + item.valtext + "'," + (item.notnull?"1":"0") + ")";
					myCmd.CommandText = sql;
					myCmd.Parameters.Clear();
					myCmd.Parameters.Add(new MySqlParameter("kwid", formdata.kwid));
					myCmd.Parameters.Add(new MySqlParameter("jsid", formdata.zjid));
					myCmd.Parameters.Add(new MySqlParameter("name", item.name));
					myCmd.Parameters.Add(new MySqlParameter("title", item.title));
					myCmd.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
					myCmd.Parameters.Add(new MySqlParameter("placeholder", item.placeholder));
					myCmd.Parameters.Add(new MySqlParameter("minval", item.minval));
					myCmd.Parameters.Add(new MySqlParameter("maxval", item.maxval));
					myCmd.Parameters.Add(new MySqlParameter("inputtype", item.inputtype));
					myCmd.Parameters.Add(new MySqlParameter("scorerate", item.scorerate));
					myCmd.Parameters.Add(new MySqlParameter("val", item.val));
					myCmd.Parameters.Add(new MySqlParameter("valtext", item.valtext));
					myCmd.Parameters.Add(new MySqlParameter("notnull", item.notnull?"1":"0"));
					myCmd.ExecuteNonQuery();
				}

				sql = @"insert into jw_appraise_zjtotal(id,kwid,jsid,totalscore)values(:id,:kwid,:jsid,:totalscore)";
				myCmd.CommandText = sql;
				myCmd.Parameters.Clear();
				myCmd.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
				myCmd.Parameters.Add(new MySqlParameter("kwid", formdata.kwid));
				myCmd.Parameters.Add(new MySqlParameter("jsid", formdata.zjid));
				myCmd.Parameters.Add(new MySqlParameter("totalscore", formdata.totalscore));
				myCmd.ExecuteNonQuery();

				if (datalist.Count > 0)
				{
					myTran.Commit();
					appmsg.msgStatus = true;
					appmsg.msgContent = "保存成功";
				}
			}
			catch (Exception ex) {
				ErrLog.Log(ex);
				appmsg.msgStatus = false;
				appmsg.msgContent = "保存失败";
			}
			finally {
				conn.Close();
			}
			return appmsg;
		}
	}

	public class appraiseInfo:PageData
	{
		public string bcid { get; set; }
		public string pjversion { get; set; }
		public string pjplan { get; set; }

		private List<pjitem> _pjItemList = new List<pjitem>();
		public List<pjitem> pjItemList
		{
			get { return _pjItemList; }
			set { _pjItemList = value; }
		}

		private List<PJRowData> _listData = new List<PJRowData>();

		public List<PJRowData> listData
		{
			get { return _listData; }
			set { _listData = value; }
		}

		List<pjListPjItemPjData> _jumpDataList = new List<pjListPjItemPjData>();
		public List<pjListPjItemPjData> jumpDataList
		{
			get { return _jumpDataList; }
			set { _jumpDataList = value; }
		}
	}

	public class PjTab{
		public string name { get; set; }
		public string shortname { get; set; }
		public string id { get; set; }
		public string bcorclass { get; set; }
	}

	public class pjListPjItemPjData {
		public object keyData { get; set; }
		public double orderIdx { get; set; }
		public string kcid { get; set; }
		public string kwid { get; set; }
		public string zcrid { get; set; }
		public string jxxs { get; set; }
		public string bcid { get; set; }
		public string dyid { get; set; }
		public string dykkid { get; set; }
		public string bt { get; set; }
		public string subtitle { get; set; }
		public int ispost { get; set; }
		public bool isfinshed { get; set; }
		public string userid { get; set; }
		public string pjtype { get; set; }
		public string hiddenRange { get; set; }
		public int level1Id { get; set; }
		public string level1Title { get; set; }
		public int level2Id { get; set; }
		public string level2Title { get; set; }
		public string type { get; set; }
		public string calcrate { get; set; }

		public string pjtypeid { get; set; }
		private List<string> _range = new List<string>();

		public List<string> range
		{
			get { return _range; }
			set { _range = value; }
		}
		public string notNull { set; get; }
		public string isyjs { get; set; }
		public string defaultvalue { get; set; }
		public string selectValue { get; set; }
		private List<string> _displayPoint = new List<string>();

		public List<KeyValuePair<string, string>> rangekeyval { get; set; }

		public List<string> displayPoint
		{
			get { return _displayPoint; }
			set { _displayPoint = value; }
		}
		private List<string> _point = new List<string>();

		public List<string> point
		{
			get { return _point; }
			set { _point = value; }
		}
	}
	/// <summary>
	/// true隐藏range范围
	/// </summary>
	public class pjitem : IComparable<pjitem>
	{
		public string hiddenRange { get; set; }
		public int level1Id { get; set; }
		public string level1Title{ get; set; }
		public int level2Id { get; set; }
		public string level2Title{ get; set; }
		public string type{ get; set; }
		public string pjtype { get; set; }
		public int rangeMin { get; set; }
		public int rangeMax { get; set; }

		private List<string> _range = new List<string>();

		public List<string> range
		{
			get { return _range; }
			set { _range = value; }
		}
		public string notNull { set; get; }
		public string isyjs { get; set; }
		public double calcrate { get; set; }
		public string selectValue{ get; set; }
		private List<string> _displayPoint = new List<string>();

		public List<string> displayPoint
		{
			get { return _displayPoint; }
			set { _displayPoint = value; }
		}
		private List<string> _point = new List<string>();

		public List<string> point
		{
			get { return _point; }
			set { _point = value; }
		}
		public string kcid { get; set; }
		public string kwid { get; set; }
		public string bcid { get; set; }
		public double orderIdx { get; set; }

		public string defaultvalue { get; set; }
		public int CompareTo(pjitem other)
		{
			if (this.orderIdx > other.orderIdx)
				return 1;
			else if (this.orderIdx == other.orderIdx)
				return 0;
			else
				return -1;
		}

		public List<KeyValuePair<string, string>> rangekeyval { get; set; }
		public string rangesql { get; set; }
		public string rangevalfield { get; set; }
		public string rangetextfield { get; set; }
	}

	public class ReqData
	{
		public string version { set; get; }
		public string edition { set; get; }
		public string itemid { set; get; }
		public string userid { set; get; }
		public string bcid { set; get; }
		public string isyjs { set; get; }
		public string ispj { set; get; }
		public string tabid { set; get; }
		public string bcorclass { set; get; }
		public string role { set; get; }
		public string kcid { set; get; }
		public string dyid { set; get; }
		public string dykkid { set; get; }
		public string kwid { set; get; }
		public string zcrid { set; get; }
		public string category { get; set; }
		public string formname { get; set; }
		public string jxxs { get; set; }
	}

	public class PJKCInfo {
		public string kwid { get; set; }
		public string kcname { get; set; }
		public string zjr { get; set; }
		public DateTime kwsdate { get; set; }
		public DateTime kwedate { get; set; }

		private List<pjitem> _pjItemList = new List<pjitem>();

		public List<pjitem> PjItemList
		{
			get { return _pjItemList; }
			set { _pjItemList = value; }
		}

		private List<pjListPjItemPjData> _PJedItemList = new List<pjListPjItemPjData>();

		public List<pjListPjItemPjData> PJedItemList
		{
			get { return _PJedItemList; }
			set { _PJedItemList = value; }
		}
	}


	#region 深圳专家评价
	public class PJFormData
	{
		public double totalscore { get; set; }
		public string kwid { get; set; }
		public string zjid { get; set; }
		private List<KCPJItem> _listPJItem = new List<KCPJItem>();

		public List<KCPJItem> ListPJItem
		{
			get { return _listPJItem; }
			set { _listPJItem = value; }
		}
	}
	public class KCPJItem
	{
		public string name { get; set; }
		public string title { get; set; }
		public string id { get; set; }
		public string placeholder { get; set; }
		public int minval { get; set; }
		public int maxval { get; set; }
		public string val { get; set; }
		public bool notnull { get; set; }
		public string inputtype { get; set; }
		public string scorerate { get; set; }
		public string valtext { get; set; }
	}
	public class KCWHInfo
	{
		public string infoid { get; set; }
		public string kwname { get; set; }
		public string kssj { get; set; }
		public string jssj { get; set; }
		public string zjr { get; set; }
		public string kcdd { get; set; }
	}
	#endregion
}