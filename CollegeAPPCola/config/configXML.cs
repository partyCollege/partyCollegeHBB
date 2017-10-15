using CollegeAPP.DataModel;
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using PartyCollegeUtil.Tools;
using PartyCollegeUtil.config;

namespace CollegeAPP.config
{  
    public class ConfigXml
    {
        private listConfig lcfg = new listConfig();

        public listConfig ListCfg
        {
            get { return lcfg; }
            set { lcfg = value; }
        }

        public ConfigXml()
        {
            lcfg = LoadXML();
        }
        private listConfig LoadXML()
        {
            string xmlfilepath = string.Empty;
            if (string.IsNullOrEmpty(xmlfilepath))
            {
                xmlfilepath = "~/config/list.xml";
            }

            listConfig lcfg = XmlSerializerData.DeserializeCofing<listConfig>(HttpContext.Current.Server.MapPath(xmlfilepath));
            return lcfg;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_category"></param>
        /// <param name="pageindex"></param>
        /// <param name="sqlParam">若无参数可传递，请传null</param>
        /// <returns></returns>
        public PageData GetPageListData(string _category, int pageindex, Dictionary<string, string> sqlParam)
        {
            PageData pgdata = new PageData();
            item myitem = GetMyItem(_category);
            StringBuilder mysql = GetMyItemSQL(myitem, pageindex, sqlParam);
            pgdata.listData = GetListData(mysql, myitem);
            pgdata.rows = Convert.ToInt32(myitem.rows);
            pgdata.title = myitem.title;
            pgdata.keyColumn = myitem.pageList.keyColumn;
            pgdata.needSearch = myitem.pageList.needSearch;
            pgdata.hasDetail = myitem.pageList.hasDetail;
            pgdata.hasButton = myitem.hasButton;
            pgdata.buttonParams = myitem.buttonParams;
            pgdata.buttonHref = myitem.buttonHref;
            pgdata.hasGoBack = myitem.hasGoBack;
            pgdata.buttonTitle = myitem.buttonTitle;

            pgdata.searchColumn = new List<string>();
            if (!string.IsNullOrEmpty(myitem.pageList.searchColumn))
            {
                pgdata.searchColumn = myitem.pageList.searchColumn.Split(',').ToList<string>();
            }
            pgdata.nextNoData = false;
            return pgdata;
        }

        private List<RowData> GetListData(StringBuilder mysql, item myitem)
        {
            RowData rdata = null;
            //存返回数据；
            List<RowData> ret_data = new List<RowData>();
            //存列的数据
            List<ListColumn> columndata = null;
            //获取数据列名集合信息；
            List<plColumn> plclolist = myitem.pageList.plColumns.plColumnsList;

            int length = plclolist.Count;
            plColumn plcol = null;
            ListColumn listcol = null;

            string ConnectionString = "OLEDB_connString";
            //使用xml 配置数据库连接串
            if (!string.IsNullOrEmpty(myitem.connStrKey))
            {
                ConnectionString = myitem.connStrKey;
            }
            using (MySqlConnection conn = new MySqlConnection(System.Configuration.ConfigurationManager.AppSettings[ConnectionString]))
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(mysql.ToString(), conn);
                MySqlDataReader reader = null;
                try
                {
                    reader = cmd.ExecuteReader();
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            //循环定制的列数
                            columndata = new List<ListColumn>();
                            rdata = new RowData();
                            rdata.goHref = myitem.pageList.gohref;
                            rdata.linkParams = myitem.pageList.linkParams;
                            rdata.doScript = myitem.pageList.doScript;
                            rdata.keyData = DBNull.Value == reader[myitem.pageList.keyColumn] ? "" : reader[myitem.pageList.keyColumn];
                            rdata.linkParams = rdata.linkParams.Replace("[id]", rdata.keyData.ToString());
                            for (int i = 0; i < reader.FieldCount; i++)
                            {

                                var columnName = reader.GetName(i).Trim().ToLower();
                                if (rdata.linkParams.IndexOf("[" + columnName + "]") > -1)
                                {
                                    rdata.linkParams = rdata.linkParams.Replace("[" + columnName + "]", reader[columnName].ToString());
                                }

                            }
                            for (int i = 0; i < length; i++)
                            {
                                listcol = new ListColumn();
                                plcol = plclolist[i];
                                listcol.value = DBNull.Value == reader[plcol.dbColumn] ? "" : reader[plcol.dbColumn];
                                listcol.filter = plcol.filter;
                                listcol.format = plcol.format;
                                listcol.needPlay = plcol.needPlay;
                                listcol.istitle = plcol.isTitle;
                                columndata.Add(listcol);
                            }
                            rdata.rowListColumnData = columndata;
                            ret_data.Add(rdata);
                        }
                    }
                }
				catch (Exception ex) {ErrLog.Log(mysql.ToString()+"\n"+ex); }
                finally
                {
                    if (reader != null)
                    {
                        reader.Close();
                    }
                }
            }
            return ret_data;
        }

        private StringBuilder GetMyItemSQL(item myitem, Dictionary<string, string> sqlParam)
        {
            StringBuilder mysql = new StringBuilder();
            string sql = myitem.sql.sqlText;
            if (sql.IndexOf("[") > 0)
            {
                sql = GetMatchCollectionValue(sql, "[", "]", sqlParam);
            }
            mysql.Append(sql).Append(" ");

            if (sql.IndexOf("where") < 0 && sql.IndexOf("WHERE") < 0)
            {
                mysql.Append(" where ");
            }
            else
            {
                mysql.Append(" and ");
            }
            mysql.Append(myitem.pageDetail.keyColumn).Append("=").Append("?");
            return mysql;
        }

        /// <summary>
        /// 获取SQL
        /// </summary>
        /// <param name="myitem"></param>
        /// <returns></returns>
        private StringBuilder GetMyItemSQL(item myitem, int pageIndex, Dictionary<string, string> sqlParam)
        {
            string countSql = string.Empty;
            int iPageRows = 20;
            int totalRows = 0;
            if (!string.IsNullOrEmpty(myitem.rows))
            {
                iPageRows = Convert.ToInt32(myitem.rows);
            }
            int iStart = iPageRows * (pageIndex - 1);
            int iEnd = iPageRows * pageIndex;

            StringBuilder mysql = new StringBuilder();
            string orderby = myitem.orderBySql.orderBySqlText;
            string sql = myitem.sql.sqlText;
            if (sql.IndexOf("[") > 0)
            {
                sql = GetMatchCollectionValue(sql, "[", "]", sqlParam);
            }

            string datasql = string.Empty;
            if (myitem.connStrKey.ToLower().IndexOf("sql") >= 0)
            {
                mysql.Append(sql).Append(" ");
                datasql = @"Select TOP " + iPageRows + " * FROM(" + mysql.ToString() + ") A Where pageorder > (" + iStart + ")";
                datasql += orderby;
            }
            else
            {
                mysql.Append(sql).Append(" ").Append(orderby);
                datasql = "SELECT * FROM(SELECT ROWNUM rn,t.* FROM (" + mysql.ToString() + ") t) WHERE rn>" + iStart + " And rn <= " + iEnd;
            }
            mysql.Clear();
            mysql.Append(datasql);
            return mysql;
        }


        /// <summary>
        /// 处理内部参数；
        /// </summary>
        /// <param name="text"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="itemrow"></param>
        /// <returns></returns>
        public string GetMatchCollectionValue(string text, string start, string end, Dictionary<string, string> sqlParam)
        {
            string pattern = Regex.Escape(start) + "(?<content>[^\\" + start + "\\" + end + "].*?)" + Regex.Escape(end);
            MatchCollection _matchcollection = Regex.Matches(text, pattern);
            string matchvalue = string.Empty;
            string beforevalue = string.Empty;

            foreach (Match _match in _matchcollection)
            {
                beforevalue = _match.Value;
                matchvalue = _match.Value.Replace(start, "").Replace(end, "");
                //遍历Sql参数。
                if (sqlParam != null)
                {
                    foreach (KeyValuePair<string, string> kvp in sqlParam)
                    {
                        if (matchvalue == kvp.Key)
                        {
                            text = text.Replace(beforevalue, kvp.Value);
                        }
                    }
                }

                foreach (string key in HttpContext.Current.Request.QueryString.Keys)
                {
                    if (matchvalue.ToLower() == key)
                    {
                        text = text.Replace(beforevalue, HttpContext.Current.Request.QueryString[key]);
                    }
                }

                if (HttpContext.Current.Session != null)
                {
                    foreach (string key in HttpContext.Current.Session.Keys)
                    {
                        if (matchvalue.ToLower() == key)
                        {
                            text = text.Replace(beforevalue, HttpContext.Current.Session[key].ToString());
                        }
                    }
                }
            }
            return text;
        }

        /// <summary>
        /// 获取item对象
        /// </summary>
        /// <param name="_category"></param>
        /// <returns></returns>
        private item GetMyItem(string _category)
        {
            List<item> lstitem = this.ListCfg.items.item;
            item myitem = null;
            foreach (item item in lstitem)
            {
                if (item.category == _category)
                {
                    myitem = item;
                    break;
                }
            }
            return myitem;
        }

        public PageData GetPageDetailData(string _category, string id, string userid, Dictionary<string, string> sqlParam)
        {
            PageData pgdata = new PageData();
            item myitem = GetMyItem(_category);
            StringBuilder mysql = GetMyItemSQL(myitem,sqlParam);
            pgdata.detailData = GetDetailData(mysql, myitem, id, userid);

            pgdata.rows = Convert.ToInt32(myitem.rows);
            pgdata.title = myitem.title;
            pgdata.keyColumn = myitem.pageDetail.keyColumn;

            pgdata.needSearch = false;
            pgdata.hasDetail = false;
            pgdata.searchColumn = new List<string>();
            pgdata.nextNoData = false;
            return pgdata;
        }

        /// <summary>
        /// 获取详细页数据。
        /// </summary>
        /// <param name="mysql"></param>
        /// <param name="myitem"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        private RowData GetDetailData(StringBuilder mysql, item myitem, string id, string userid)
        {
            //List<DetailColumn>
            //存返回数据；
            //List<RowData> ret_data = new List<RowData>();

            RowData rdata = new RowData();
            //存列的数据
            List<DetailColumn> columndata = null;
            //获取数据列名集合信息；
            List<pdColumn> pdclolist = myitem.pageDetail.pdColumns.pdColumnsList;

            int length = pdclolist.Count;
            pdColumn pdcol = null;
            DetailColumn listcol = null;

            //使用xml 配置数据库连接串
            string ConnectionString = string.Empty;
            if (!string.IsNullOrEmpty(myitem.connStrKey))
            {
                ConnectionString = myitem.connStrKey;
            }
            using (MySqlConnection conn = new MySqlConnection(System.Configuration.ConfigurationManager.AppSettings[ConnectionString]))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                string keyColumn = myitem.pageDetail.keyColumn;
                if (keyColumn.IndexOf(".") > -1)
                {
                    keyColumn = myitem.pageDetail.keyColumn.Substring(myitem.pageDetail.keyColumn.LastIndexOf(".") + 1);
                }
                foreach (var dataSource in myitem.pageDetail.attachSQLS.attachSQL)
                {
                    comm.Parameters.Clear();
                    comm.CommandText = dataSource.sql.Replace("[" + keyColumn + "]", id);
                    MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                    pdColumn pdc = myitem.pageDetail.pdColumns.pdColumnsList.Find(delegate(pdColumn p) { return !string.IsNullOrEmpty(p.src) && p.source == dataSource.name; });
                    attachList atl = new attachList();
                    if (pdc != null)
                    {
                        atl = new attachList { source = pdc.source};
                        rdata.attachs.Add(atl);
                    }
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        while (odr.Read())
                        {
                            if (pdc != null)
                            {
                                atl.attachs.Add(new attach { filename = odr[pdc.filename].ToString(), filePath = odr[pdc.src].ToString(),category=dataSource.category });
                            }
                        }
                    }
                }
            }
            using (MySqlConnection conn = new MySqlConnection(System.Configuration.ConfigurationManager.AppSettings[ConnectionString]))
            {
                conn.Open();
                mysql = mysql.Replace("[userid]", userid);
                MySqlCommand cmd = new MySqlCommand(mysql.ToString(), conn);
                cmd.Parameters.Add(new MySqlParameter(myitem.pageDetail.keyColumn, id));
                MySqlDataReader reader = null;
                try
                {
                    reader = cmd.ExecuteReader();
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            string keyColumn = myitem.pageDetail.keyColumn;
                            if (keyColumn.IndexOf(".") > -1)
                            {
                                keyColumn = myitem.pageDetail.keyColumn.Substring(myitem.pageDetail.keyColumn.LastIndexOf(".") + 1);
                            }
                            //循环定制的列数
                            rdata.keyData = DBNull.Value == reader[keyColumn] ? "" : reader[keyColumn];
                            columndata = new List<DetailColumn>();
                            for (int i = 0; i < length; i++)
                            {
                                listcol = new DetailColumn();
                                pdcol = pdclolist[i];
                                listcol.dataSource = pdcol.source;
                                listcol.value = DBNull.Value == reader[pdcol.dbColumn] ? "" : reader[pdcol.dbColumn];
                                listcol.filter = pdcol.filter;
                                listcol.isPic = pdcol.isPic;
                                listcol.picRoot = pdcol.picRoot;
                                listcol.format = pdcol.format;
                                listcol.isHTML = pdcol.isHTML;
                                listcol.title = pdcol.title;
                                if (listcol.isPic)
                                {
                                    listcol.height = pdcol.height;
                                    listcol.width = pdcol.width;
                                }
                                listcol.isTitle = pdcol.isTitle;
                                listcol.subTitle = pdcol.subTitle;
                                columndata.Add(listcol);
                            }
                            rdata.rowDetailColumnData = columndata;
                        }
                    }
                }
                catch (Exception ex) { }
                finally
                {
                    if (reader != null)
                    {
                        reader.Close();
                    }
                }
            }
            return rdata;
        }
    }

    [XmlRoot("root", IsNullable = false)]
    public class listConfig
    {
        private items _items = new items();

        [XmlElement("items")]
        public items items
        {
            get { return _items; }
            set { _items = value; }
        }
    }

    public class items
    {

        private List<item> _item = new List<item>();

        [XmlElement("item")]
        public List<item> item
        {
            get { return _item; }
            set { _item = value; }
        }
    }

    public class item
    {
        [XmlAttribute("connStrKey")]
        public string connStrKey { get; set; }

        [XmlAttribute("title")]
        public string title { get; set; }

        [XmlAttribute("name")]
        public string name { get; set; }

        [XmlAttribute("rows")]
        public string rows { get; set; }

        [XmlAttribute("category")]
        public string category { get; set; }
        [XmlAttribute("hasGoBack")]
        public bool hasGoBack { set; get; }
        [XmlAttribute("hasButton")]
        public bool hasButton { get; set; }

        [XmlAttribute("buttonHref")]
        public string buttonHref { set; get; }

        [XmlAttribute("buttonTitle")]
        public string buttonTitle { set; get; }

        [XmlAttribute("buttonParams")]
        public string buttonParams { set; get; }

        private Sql _sql = new Sql();

        [XmlElement("sql", IsNullable = false)]
        public Sql sql
        {
            get { return _sql; }
            set { _sql = value; }
        }


        private orderBySql _orderBySql = new orderBySql();

        [XmlElement("orderbysql")]
        public orderBySql orderBySql
        {
            get { return _orderBySql; }
            set { _orderBySql = value; }
        }

        private pageList _pageList = new pageList();
        [XmlElement("pagelist")]
        public pageList pageList
        {
            get { return _pageList; }
            set { _pageList = value; }
        }

        private pageDetail _pageDetail = new pageDetail();
        [XmlElement("pagedetail")]
        public pageDetail pageDetail
        {
            get { return _pageDetail; }
            set { _pageDetail = value; }
        }
    }

    public class Sql
    {
        [XmlText]
        public string sqlText { set; get; }
    }

    public class orderBySql
    {
        [XmlText]
        public string orderBySqlText { set; get; }
    }
    public class pageList
    {
        public pageList()
        {
            gohref = string.Empty;
            linkParams = string.Empty;
            doScript = string.Empty;
        }
        [XmlAttribute("keyColumn")]
        public string keyColumn { get; set; }

        [XmlAttribute("needSearch")]
        public bool needSearch { get; set; }

        [XmlAttribute("searchColumn")]
        public string searchColumn { get; set; }

        [XmlAttribute("hasDetail")]
        public bool hasDetail { get; set; }

        private plColumns _plColumns = new plColumns();

        [XmlElement("plcolumns")]
        public plColumns plColumns
        {
            get { return _plColumns; }
            set { _plColumns = value; }
        }
        [XmlAttribute("gohref")]
        public string gohref { set; get; }
        [XmlAttribute("linkParams")]
        public string linkParams { set; get; }
        [XmlAttribute("doScript")]
        public string doScript { set; get; }
    }

    public class plColumns
    {
        private List<plColumn> _plColumnsList = new List<plColumn>();

        [XmlElement("plcolumn")]
        public List<plColumn> plColumnsList
        {
            get { return _plColumnsList; }
            set { _plColumnsList = value; }
        }
    }

    public class plColumn
    {
        [XmlAttribute("isTitle")]
        public bool isTitle { get; set; }

        //[XmlAttribute("isKey")]
        //public bool isKey { get; set; }
        [XmlAttribute("needPlay")]
        public bool needPlay { set; get; }
        [XmlAttribute("dbColumn")]
        public string dbColumn { get; set; }
        [XmlAttribute("filter")]
        public string filter { get; set; }
        [XmlAttribute("format")]
        public string format { get; set; }
    }

    public class pageDetail
    {
        public pageDetail()
        {
            attachSQLS = new attachSQLS();
        }
        [XmlAttribute("keyColumn")]
        public string keyColumn { get; set; }

        private pdColumns _pdColumns = new pdColumns();

        [XmlElement("pdcolumns")]
        public pdColumns pdColumns
        {
            get { return _pdColumns; }
            set { _pdColumns = value; }
        }
        [XmlElement("attachSQLS")]
        public attachSQLS attachSQLS { set; get; }
    }

    public class pdColumns
    {

        private List<pdColumn> _pdColumnsList = new List<pdColumn>();

        [XmlElement("pdcolumn")]
        public List<pdColumn> pdColumnsList
        {
            get { return _pdColumnsList; }
            set { _pdColumnsList = value; }
        }
    }

    public class attachSQLS
    {
        public attachSQLS()
        {
            _attachList = new List<attachSQL>();
        }
        private List<attachSQL> _attachList = new List<attachSQL>();
        [XmlElement("attachSQL")]
        public List<attachSQL> attachSQL
        {
            get { return _attachList; }
            set { _attachList = value; }
        }
    }

    public class attachSQL
    {
        [XmlText]
        public string sql { set; get; }
        [XmlAttribute("name")]
        public string name { set; get; }

        [XmlAttribute("category")]
        public string category { set; get; }
    }

    public class pdColumn
    {
        [XmlAttribute("isTitle")]
        public string isTitle { get; set; }

        [XmlAttribute("title")]
        public string title { get; set; }

        [XmlAttribute("dbColumn")]
        public string dbColumn { get; set; }

        [XmlAttribute("src")]
        public string src { get; set; }

        [XmlAttribute("filename")]
        public string filename { get; set; }

        [XmlAttribute("filter")]
        public string filter { get; set; }

        [XmlAttribute("source")]
        public string source { get; set; }

        [XmlAttribute("format")]
        public string format { get; set; }

        [XmlAttribute("isLink")]
        public bool isLink { get; set; }

        [XmlAttribute("isHTML")]
        public bool isHTML { get; set; }

        [XmlAttribute("subTitle")]
        public bool subTitle { get; set; }

        [XmlAttribute("isPic")]
        public bool isPic { get; set; }

        [XmlAttribute("picRoot")]
        public string picRoot { get; set; }

        [XmlAttribute("height")]
        public string height { get; set; }
        [XmlAttribute("width")]
        public string width { get; set; }
    }
}