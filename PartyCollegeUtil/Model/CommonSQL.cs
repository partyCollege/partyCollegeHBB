using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using PartyCollegeUtil.Tools;
using PartyCollegeUtil.Model;
using System.Net;
using System.Net.Http;
using System.Dynamic;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model.Cache;

namespace PartyCollegeUtil.Model
{
    public class CommonSQL
    {
        public string sql { set; get; }
        public string key { set; get; }

		private static string SessionEmpty(object session)
		{
			if (session == null)
			{
				return "";
			}
			else
			{
				return session.ToString();
			}
		}


        public static void doLog4net(string tag, string group)
        {
            var session = HttpContext.Current.Session;
            if (session["accountid"] == null) return;
			dynamic msg = new
			{
				userid = SessionEmpty(session["accountid"]),
				username = SessionEmpty(session["logname"]),
				classid = SessionEmpty(session["classid"]),
				classname = SessionEmpty(session["classname"]),
				handle = tag,
				handlecategory = group,
				handletime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
				platformid = SessionEmpty(session["platformid"]),
				usertype = SessionEmpty(session["usertype"])
			};
			CacheLog.SaveLog(msg);
        }
		//public static void doLog(MySqlConnection conn, string tag, string group)
		//{
		//	MySqlCommand comm = null;
		//	try
		//	{
		//		comm = conn.CreateCommand();
		//		//doLog(comm, tag, group);
		//	}
		//	catch (Exception ex)
		//	{
		//		ErrLog.Log(ex, comm.CommandText);
		//	}
		//}
        /// <summary>
        /// 插入日志信息
        /// </summary>
        /// <param name="comm"></param>
        /// <param name="tag">日志操作内容</param>
        /// <param name="group">日志分类</param>
        public static void doLog(MySqlCommand comm, string tag, string group)
        {
            var session = HttpContext.Current.Session;
            comm.Parameters.Clear();
            string tableName = "sl_log_" + DateTime.Now.ToString("yyyy_MM");
            //comm.CommandText = "SELECT * FROM DBA_TABLES WHERE OWNER='DSOA' and table_name='" + tableName.ToLower() + "'";
            comm.CommandText = "select table_name,table_schema from information_schema.tables where table_schema='partycollegenew' and table_name='" + tableName + "'";
            //ErrLog.Log("tableName comm.CommandText=" + tableName + "|" + comm.CommandText);
            bool hasLogTable = false;
            using (MySqlDataReader odr = comm.ExecuteReader())
            {
                if (odr.Read())
                {
                    hasLogTable = true;
                }
            }
            if (!hasLogTable)
            {
                comm.CommandText = @"create table " + tableName + @"
                (
                    username         VARCHAR(50) not null,
                    userid           VARCHAR(50) not null,
					classid			VARCHAR(50) null,
					platformid		VARCHAR(50) null,
                    usertype       VARCHAR(100) null,
                    classname     VARCHAR(2000),
                    handle          VARCHAR(2000),
                    handletime      DATETime not null,
                    handlecategory  VARCHAR(2000)
                )";
                comm.ExecuteNonQuery();
            }
            try
            {
                comm.CommandText = "insert into " + tableName + " (username,classid,platformid,userid,usertype,classname,handle,handletime,handlecategory) values (?,?,?,?,?,?,?,?,?)";
                comm.Parameters.Add(new MySqlParameter("username", session["logname"]));
                comm.Parameters.Add(new MySqlParameter("classid", session["classid"]));
                comm.Parameters.Add(new MySqlParameter("platformid", session["platformid"]));
                comm.Parameters.Add(new MySqlParameter("userid", session["accountid"]));
                comm.Parameters.Add(new MySqlParameter("usertype", session["usertype"]));
                comm.Parameters.Add(new MySqlParameter("classname", session["classname"]));
                comm.Parameters.Add(new MySqlParameter("handle", tag));
                comm.Parameters.Add(new MySqlParameter("handletime", DateTime.Now));
                comm.Parameters.Add(new MySqlParameter("handlecategory", group));
                comm.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                ErrLog.Log(e, comm.CommandText);
            }

        }

		private List<dynamic> getOnePageData(MySqlCommand comm, out Int64 allRowCount)
		{
			allRowCount = 0;
			List<dynamic> dm = new List<object>();
			if (comm.CommandText.Trim().ToLower().StartsWith("select"))
			{
				//目前只有分页时，才支持2个结果接查询，固定写法，第二个结果集返回本次查询总行数
				int resultCount = 0;
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					do
					{
						resultCount++;
						if (resultCount == 1)
						{
							if (odr.HasRows)
							{
								int x = odr.FieldCount;
								while (odr.Read())
								{

									Dictionary<string, object> list = new Dictionary<string, object>();
									for (int i = 0; i < x; i++)
									{
										list.Add(odr.GetName(i).ToLower(), odr.GetValue(i));
									}
									dm.Add(list);
								}
							}
						}
						else
						{
							if (odr.HasRows)
							{
								if (odr.Read())
								{
									allRowCount = Convert.ToInt64("0" + odr["rowcount"].ToString());
								}
							}
						}
					} while (odr.NextResult());
				}
			}
			else
			{
				foreach (MySqlParameter pa in comm.Parameters)
				{
					if (pa.Size >= 4000)
					{
						pa.DbType = System.Data.DbType.String;
					}

				}
				int cRow = comm.ExecuteNonQuery();
				dm.Add(new { crow = cRow });
			}
			return dm;
		}
		private List<dynamic> getOneData(MySqlCommand comm)
		{
			List<dynamic> dm = new List<object>();
			if (comm.CommandText.Trim().ToLower().StartsWith("select"))
			{
				//目前只有分页时，才支持2个结果接查询，固定写法，第二个结果集返回本次查询总行数
				int resultCount = 0;
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					if (odr.HasRows)
					{
						int x = odr.FieldCount;
						while (odr.Read())
						{

							Dictionary<string, object> list = new Dictionary<string, object>();
							for (int i = 0; i < x; i++)
							{
								list.Add(odr.GetName(i).ToLower(), odr.GetValue(i));
							}
							dm.Add(list);
						}
					}

				}
			}
			else
			{
				foreach (MySqlParameter pa in comm.Parameters)
				{
					if (pa.Size >= 4000)
					{
						pa.DbType = System.Data.DbType.String;
					}

				}
				int cRow = comm.ExecuteNonQuery();
				dm.Add(new { crow = cRow });
			}
			return dm;
		}
        public static void addLog(MySqlConnection conn)
        {

        }

		//public List<dynamic> getDataSource(List<string> keys, Dictionary<string, object> data)
		//{
		//	List<dynamic> dm = new List<dynamic>();
		//	string connString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
		//	JArray obj = (JArray)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/getData.json")));
		//	List<dynamic> items = new List<dynamic>();
		//	foreach (var c in obj)
		//	{
		//		dynamic dic = c;
		//		foreach (var nowKey in keys)
		//		{
		//			if (dic.key.Value == nowKey)
		//			{
		//				items.Add(dic);
		//			}
		//		}
		//	}
		//	foreach (var c in items)
		//	{
		//		if (c.connection != null && !string.IsNullOrEmpty(c.connection.ToString()))
		//		{
		//			connString = System.Configuration.ConfigurationManager.AppSettings[c.connection.ToString()];
		//		}
		//	}
		//	using (MySqlConnection conn = new MySqlConnection(connString))
		//	{
		//		conn.Open();
		//		MySqlCommand comm = conn.CreateCommand();
		//		foreach (var c in items)
		//		{
		//			comm.Parameters.Clear();
		//			string sql = c.sql.Value;
		//			//替换普通参数
		//			List<Brack.SQLBracketPair> paramList = Brack.GetFangList(sql);
		//			string sqlTemp = string.Empty;
		//			sqlTemp = sql;

		//			foreach (var pa1 in paramList)
		//			{
		//				foreach (var jsonp in data)
		//				{
		//					if (sql.IndexOf("[[" + jsonp.Key.ToString() + "]]") > -1)
		//					{
		//						sql = sql.Replace("[[" + jsonp.Key.ToString() + "]]", jsonp.Value.ToString());
		//						sqlTemp = sqlTemp.Replace("[[" + jsonp.Key.ToString() + "]]", jsonp.Value.ToString());
		//						continue;
		//					}
		//				}
		//			}
		//			paramList = Brack.GetFangList(sql);

		//			foreach (var pa1 in paramList)
		//			{
		//				foreach (var jsonp in data)
		//				{
		//					if (pa1.Include.ToLower() == jsonp.Key.ToLower())
		//					{
		//						sqlTemp = sqlTemp.Replace("[" + jsonp.Key.ToString() + "]", "'" + jsonp.Value + "'");
		//						sql = sql.Replace("[" + jsonp.Key.ToString() + "]", "?" + jsonp.Key.ToString());
		//						if (sql.IndexOf("like ?" + jsonp.Key.ToString()) > -1)
		//						{
		//							comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), "%" + jsonp.Value + "%"));
		//						}
		//						else
		//						{
		//							comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), jsonp.Value));
		//						}
		//					}
		//				}
		//			}
		//			//foreach (var d in data)
		//			//{
		//			//    if (sql.IndexOf("[" + d.Key.ToString() + "]") > -1)
		//			//    {
		//			//        sql = sql.Replace("[" + d.Key.ToString() + "]", ":" + d.Key.ToString());
		//			//        if (sql.IndexOf("like :" + d.Key.ToString()) > -1)
		//			//        {
		//			//            comm.Parameters.Add(new OleDbParameter(d.Key.ToString(), "%" + d.Value + "%"));
		//			//        }
		//			//        else
		//			//        {
		//			//            comm.Parameters.Add(new OleDbParameter(d.Key.ToString(), d.Value));
		//			//        }
		//			//    }
		//			//}
		//			//替换GUID
		//			sqlTemp = sqlTemp.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");
		//			sql = sql.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");

		//			//替换大括号对
		//			if (sql.IndexOf("{") > -1)
		//			{
		//				List<Brack.SQLBracketPair> pairs = Brack.GetBracketList(sql);
		//				foreach (var pa in pairs)
		//				{
		//					if (pa.Include.IndexOf("[") > -1)
		//					{
		//						sql = sql.Replace("{" + pa.Include + "}", "");
		//						sqlTemp = sqlTemp.Replace("{" + pa.Include + "}", "");
		//					}
		//				}
		//				sql = sql.Replace("{", string.Empty).Replace("}", string.Empty);
		//				sqlTemp = sqlTemp.Replace("{", string.Empty).Replace("}", string.Empty);
		//			}
		//			comm.CommandText = sql;
		//			if (System.Configuration.ConfigurationManager.AppSettings["debugSQL"] == "true")
		//			{
		//				ErrLog.Log(sqlTemp);
		//			}
		//			dm.Add(new { name = c.key.Value, data = getOneData(comm) });
		//			if (c.tag != null)
		//			{
		//				string group = "";
		//				if (c.group != null)
		//				{
		//					group = c.group.Value;
		//				}
		//				foreach (var parInput in data)
		//				{
		//					c.tag.Value = c.tag.Value.Replace("[" + parInput.Key + "]", parInput.Value.ToString());
		//				}

		//			}
		//		}
		//	}
		//	//如果只有一次查询，则直接返回结果
		//	if (dm.Count == 1)
		//	{
		//		return dm[0].data;
		//	}
		//	else
		//	{
		//		return dm;
		//	}
		//}
		public List<dynamic> getDataSource(List<string> keys, Dictionary<string, object> data,MySqlCommand comm, JObject pageInfo = null
			, JObject search = null, JArray orderBy = null, JObject connectionKey = null)
        {
            List<dynamic> dm = new List<dynamic>();
			//string connString = DBConfig.ConnectionString;
			//if (connectionKey != null)
			//{
			//	connString = connectionKey["connectionKey"].ToString();
			//	connString = DBConfig.getConnectionString(connString);
			//}
            JArray obj = getConfig.getSQLConfig();
            List<dynamic> items = new List<dynamic>();
            Boolean isfla = false;
            foreach (var c in obj)
            {
                dynamic dic = c;
                foreach (var nowKey in keys)
                {
                    if (dic.key.Value == nowKey)
                    {
                        if (dic.cache != null && dic.cache == "true")
                        {
                            isfla = true;
                            List<dynamic> dac = getJsonData(dic.key.Value);
                            items.Add(new { name = dic.key.Value, data = dac, allRowCount = 0 });
                        }
                        else
                            items.Add(dic);
                    }
                }
            }
            if (isfla)
                return items;
           
                comm.CommandTimeout = 60*2;
                foreach (var c in items)
                {
                    comm.Parameters.Clear();
                    string sql = c.sql.Value;
                    //替换普通参数
                    List<Brack.SQLBracketPair> paramList = Brack.GetFangList(sql);
                    string sqlTemp = string.Empty;
                    sqlTemp = sql;

                    //替换动态表名
                    string dynamicTableName = string.Empty;
                    foreach (var pa1 in paramList)
                    {
                        foreach (var jsonp in data)
                        {
                            if (sql.IndexOf("[[" + jsonp.Key.ToString() + "]]") > -1)
                            {
                                //dynamictable 占位符
                                if (c.tableprefix != null && c.tablerule != null)
                                {
                                    dynamicTableName = getDynamicTable(c, jsonp.Value.ToString());
                                    sql = sql.Replace("[[" + jsonp.Key.ToString() + "]]", dynamicTableName);
                                    sqlTemp = sqlTemp.Replace("[[" + jsonp.Key.ToString() + "]]", dynamicTableName);
                                    continue;
                                }
                            }
                        }
                    }

                    //替换大括号对
                    if (sql.IndexOf("{") > -1)
                    {
                        List<Brack.SQLBracketPair> pairs = Brack.GetBracketList(sql);
                        foreach (var pa in pairs)
                        {
                            paramList = Brack.GetFangList(pa.Include.ToString());
                            foreach (var pa1 in paramList)
                            {
                                foreach (var jsonp in data)
                                {
                                    if (pa1.Include.ToLower() == jsonp.Key.ToLower())
                                    {
                                        if (jsonp.Value != null && string.IsNullOrEmpty(jsonp.Value.ToString()))
                                        {
                                            sql = sql.Replace("{" + pa.Include + "}", "");
                                            sqlTemp = sqlTemp.Replace("{" + pa.Include + "}", "");
                                        }
                                    }
                                }
                            }
                            //if (pa.Include.IndexOf("[") > -1)
                            //{
                            //	sql = sql.Replace("{" + pa.Include + "}", "");
                            //	sqlTemp = sqlTemp.Replace("{" + pa.Include + "}", "");
                            //}
                        }
                        sql = sql.Replace("{", string.Empty).Replace("}", string.Empty);
                        sqlTemp = sqlTemp.Replace("{", string.Empty).Replace("}", string.Empty);
                    }

                    paramList = Brack.GetFangList(sql);

					object sessionValTemp = null;
                    foreach (var pa1 in paramList)
                    {
						//优先过滤表单提交的参数过滤
                        foreach (var jsonp in data)
                        {
                            if (pa1.Include.ToLower() == jsonp.Key.ToLower())
                            {
                                sqlTemp = sqlTemp.Replace("[" + jsonp.Key.ToString() + "]", "'" + jsonp.Value + "'");
                                sql = sql.Replace("[" + jsonp.Key.ToString() + "]", "@" + jsonp.Key.ToString());
								if (sql.IndexOf("rightlike @" + jsonp.Key.ToString()) > -1)
								{
									sql = sql.Replace("rightlike", "like");
									comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), "" + jsonp.Value + "%"));
								}
								else if (sql.IndexOf("like @" + jsonp.Key.ToString()) > -1)
                                {
                                    comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), "%" + jsonp.Value + "%"));
                                }
                                else
                                {
                                    comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), jsonp.Value));
                                }
                            }
                        }
						sessionValTemp = null;
						//当需要用到session的参数时,在过滤session里的参数值
						for (int i = 0; i < HttpContext.Current.Session.Count; i++)
						{
							sessionValTemp=HttpContext.Current.Session[pa1.Include.ToLower().Replace("session.","")];
							if (sessionValTemp != null)
							{
								sqlTemp = sqlTemp.Replace("[" + pa1.Include.ToString() + "]", "'" + sessionValTemp.ToString() + "'");
								sql = sql.Replace("[" + pa1.Include.ToString() + "]", "'" + sessionValTemp.ToString() + "'");
							}
							else
							{
								sqlTemp = sqlTemp.Replace("[" + pa1.Include.ToString() + "]", "''");
								sql = sql.Replace("[" + pa1.Include.ToString() + "]", "''");
							}
						} 
                    }

                    //替换GUID
                    sqlTemp = sqlTemp.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");
                    sql = sql.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");

                    //删除
                    List<Brack.SQLBracketPair> forSetNullColumn = Brack.GetFangList(sql);
                    foreach (var column in forSetNullColumn)
                    {
                        sql = sql.Replace("[" + column.Include + "]", "null");
                    }
                    //添加排序
                    if (c.orderby != null)
                    {
                        sql += "  " + c.orderby.Value;
                    }
                    //添加检索条件
                    if (search != null)
                    {
                        sql = "select * from (" + sql + ") t where 1=1";
                        JObject bk = search;
                        //if (sql.ToLower().IndexOf(" where ") == -1)
                        //{
                        //    sql += " where 1=1 ";
                        //}
                        foreach (var key in bk)
                        {
                            if (key.Key.ToString().EndsWith("dbcolumn") || key.Key.ToString().EndsWith("handle") || key.Key.ToString().EndsWith("dbtype") || key.Value.ToString().Trim() == string.Empty)
                            { continue; }
                            string handler = string.Empty;
                            switch (bk[key.Key + "_handle"].ToString())
                            {
                                case "like":
                                    handler = " like "; break;
                                case "gt":
                                    handler = ">"; break;
                                case "lt":
                                    handler = "<"; break;
                                case "gte":
                                    handler = ">="; break;
                                case "lte":
                                    handler = "<="; break;
                                case "equal":
                                    handler = "="; break;
                            }
                            sql += " and " + bk[key.Key + "_dbcolumn"] + handler + "@" + key.Key + "_search";
                            if (handler == " like ")
                            {
                                comm.Parameters.Add(new MySqlParameter(key.Key + "_search", "%" + key.Value.ToString() + "%"));
                            }
                            else
                            {
                                comm.Parameters.Add(new MySqlParameter(key.Key + "_search", key.Value.ToString()));
                            }
                        }
                    }

                    //添加排序
                    if (orderBy != null)
                    {

                        sql += " order by ";
                        foreach (var order in orderBy)
                        {
                            sql += order["name"].ToString() + " " + order["sort"]["direction"].ToString() + ",";
                        }
                        sql = sql.Trim(",".ToCharArray());

                    }

                    Int64 allRowCount = 0;
                    //分页
                    if (pageInfo != null)
                    {
						comm.CommandText = ("select count(1) from (" + sql + ") t");
						allRowCount = Convert.ToInt64(comm.ExecuteScalar());
						sql += " limit " + pageInfo["firstRow"] + "," + pageInfo["pageSize"];

						//sql += " limit " + pageInfo["firstRow"] + "," + pageInfo["pageSize"] + ";SELECT found_rows() AS rowcount;";
                    }
					comm.CommandText = sql;

					MyStopWatch.start("CommonSQL");
					dynamic rowData = getOneData(comm);

					dm.Add(new { name = c.key.Value, data = rowData, allRowCount = allRowCount });
					MyStopWatch.stop(sqlTemp);

                    //插入日志
                    if (c.tag != null)
                    {
                        string group = "";
                        if (c.group != null)
                        {
                            group = c.group.Value;
                        }
                        foreach (var parInput in data)
                        {
                            if(parInput.Value!=null)
                            c.tag.Value = c.tag.Value.Replace("[" + parInput.Key + "]", parInput.Value.ToString());
                        }
                        doLog4net(c.tag.Value, group);
                    }
                    //插入积分
                    if (c.enablescore != null && c.enablescore.Value)
                    {
                        dynamic scoreConfig = c.scoreconfig;
                        foreach (var parInput in data)
                        {
                            scoreConfig.limitkey.Value = scoreConfig.limitkey.Value.Replace("[" + parInput.Key + "]", "" + parInput.Value);
                            scoreConfig.dimension.Value = scoreConfig.dimension.Value.Replace("[" + parInput.Key + "]", "" + parInput.Value);
                            scoreConfig.eventname.Value = scoreConfig.eventname.Value.Replace("[" + parInput.Key + "]", "" + parInput.Value);
                        }
                        //ScoreService sservice = new ScoreService();
                        //if (!string.IsNullOrEmpty(scoreConfig.dimension.Value) && !string.IsNullOrEmpty(scoreConfig.eventname.Value))
                        //{
                        //    sservice.doSaveScore(conn, scoreConfig.dimension.Value, scoreConfig.eventname.Value, scoreConfig.limitkey.Value);
                        //}
                    }
                }
            
            //如果只有一次查询，则直接返回结果
            if (dm.Count == 1 && pageInfo == null)
            {
                return dm[0].data;
            }
            else
            {
                return dm;
            }
        }
        private string getDynamicTable(dynamic c, string dynamicValue)
        {
            string fix = c.tableprefix.ToString();
            string tablerule = c.tablerule.ToString();
            string tablename = string.Empty;
            if (tablerule == "yyyy_MM")
            {
                tablename = fix + Convert.ToDateTime(dynamicValue).ToString(tablerule);
            }
            return tablename;
        }
        public List<dynamic> getJsonData(string key)
        {
            List<dynamic> result = new List<dynamic>();
            try
            {
                String url = "http://localhost/partycollege/json/" + key + ".json";
                HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(url);
                HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();
                WebResponse we = myRequest.GetResponse();
                Stream rs = hres.GetResponseStream();
                StreamReader sr = new StreamReader(rs);
                string json = sr.ReadToEnd();
                result = JsonConvert.DeserializeObject<List<dynamic>>(json);
            }
            catch
            {

            }
            return result;
        }
		public List<dynamic> getRemindDataSource(Dictionary<string, object> data)
		{
			List<dynamic> dm = new List<dynamic>();
			string connString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
			JArray obj = (JArray)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/getRemindData.json")));
			List<dynamic> items = new List<dynamic>();
			foreach (var c in obj)
			{
				dynamic dic = c;
				items.Add(dic);
			}
			foreach (var c in items)
			{
				if (c.connection != null && !string.IsNullOrEmpty(c.connection.ToString()))
				{
					connString = System.Configuration.ConfigurationManager.AppSettings[c.connection.ToString()];
				}
			}
			using (MySqlConnection conn = new MySqlConnection(connString))
			{
				conn.Open();
				MySqlCommand comm = conn.CreateCommand();
				string lastsql = "";
				string lastsqlTemp = "";
				string ckey = "";
				int num = 0;
				foreach (var c in items)
				{
					comm.Parameters.Clear();
					string sql = c.sql.Value;
					//替换普通参数
					List<Brack.SQLBracketPair> paramList = Brack.GetFangList(sql);
					string sqlTemp = string.Empty;
					sqlTemp = sql;

					foreach (var pa1 in paramList)
					{
						foreach (var jsonp in data)
						{
							if (sql.IndexOf("[" + jsonp.Key.ToString() + "]") > -1)
							{
								sql = sql.Replace("[" + jsonp.Key.ToString() + "]", jsonp.Value.ToString());
								sqlTemp = sqlTemp.Replace("[" + jsonp.Key.ToString() + "]", jsonp.Value.ToString());
								continue;
							}
						}
					}
					paramList = Brack.GetFangList(sql);

					foreach (var pa1 in paramList)
					{
						foreach (var jsonp in data)
						{
							if (pa1.Include.ToLower() == jsonp.Key.ToLower())
							{
								sqlTemp = sqlTemp.Replace("[" + jsonp.Key.ToString() + "]", "'" + jsonp.Value + "'");
								sql = sql.Replace("[" + jsonp.Key.ToString() + "]", ":" + jsonp.Key.ToString());
								if (sql.IndexOf("like :" + jsonp.Key.ToString()) > -1)
								{
									comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), "%" + jsonp.Value + "%"));
								}
								else
								{
									comm.Parameters.Add(new MySqlParameter(jsonp.Key.ToString(), jsonp.Value));
								}
							}
						}
					}
					foreach (var d in data)
					{
						if (sql.IndexOf("[" + d.Key.ToString() + "]") > -1)
						{
							sql = sql.Replace("[" + d.Key.ToString() + "]", ":" + d.Key.ToString());
							if (sql.IndexOf("like :" + d.Key.ToString()) > -1)
							{
								comm.Parameters.Add(new MySqlParameter(d.Key.ToString(), "%" + d.Value + "%"));
							}
							else
							{
								comm.Parameters.Add(new MySqlParameter(d.Key.ToString(), d.Value));
							}
						}
					}

					//替换大括号对
					if (sql.IndexOf("{") > -1)
					{
						List<Brack.SQLBracketPair> pairs = Brack.GetBracketList(sql);
						foreach (var pa in pairs)
						{
							if (pa.Include.IndexOf("[") > -1)
							{
								sql = sql.Replace("{" + pa.Include + "}", "");
								sqlTemp = sqlTemp.Replace("{" + pa.Include + "}", "");
							}
						}
						sql = sql.Replace("{", string.Empty).Replace("}", string.Empty);
						sqlTemp = sqlTemp.Replace("{", string.Empty).Replace("}", string.Empty);
					}

					sql = sql.Replace("|", "'");
					sqlTemp = sqlTemp.Replace("|", "'");

					ckey = c.key.Value;
					if (items.Count > 1)
					{
						if (num != items.Count - 1)
						{
							sql = sql + "  union  ";
						}

						lastsql += sql;
					}
					else
					{
						lastsql = sql;
					}
					num++;
				}

				comm.CommandText = lastsql;
				if (System.Configuration.ConfigurationManager.AppSettings["debugSQL"] == "true")
				{
					ErrLog.Log(lastsqlTemp);
				}
				dm.Add(new { name = ckey, data = getOneData(comm) });

			}
			//如果只有一次查询，则直接返回结果
			if (dm.Count == 1)
			{
				return dm[0].data;
			}
			else
			{
				return dm;
			}
		}
    }

}