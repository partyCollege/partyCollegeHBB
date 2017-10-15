using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.OleDb;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Tools;
namespace CollegeAPP.Model
{
    public class CommonSQL
    {
        public string sql { set; get; }
        public string key { set; get; }
        /// <summary>
        /// 插入日志信息
        /// </summary>
        /// <param name="comm"></param>
        /// <param name="tag">日志操作内容</param>
        /// <param name="group">日志分类</param>
        public static void doLog(OleDbCommand comm, string tag, string group)
        {
            var session = HttpContext.Current.Session;
            comm.Parameters.Clear();
            string tableName = DateTime.Now.ToString("APP_LOG_" + "yyyy_MM");
            comm.CommandText = "SELECT * FROM DBA_TABLES WHERE OWNER='DSOA' and table_name='" + tableName + "'";
            bool hasLogTable = false;
            using (OleDbDataReader odr = comm.ExecuteReader())
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
                                                          userName         VARCHAR2(50) not null,
                                                          userId           NUMBER not null,
															classid			number not null,
                                                          usertype       VARCHAR2(100) not null,
                                                          className     VARCHAR2(2000),
                                                          handle          VARCHAR2(2000),
                                                          handleTime      DATE not null,
                                                          handlecategory VARCHAR2(2000)
                                                        )";
                comm.ExecuteNonQuery();
            }
            try
            {
                comm.CommandText = "insert into " + tableName + " (userName,classid,userId,usertype,className,handle,handleTime,handlecategory) values (:userName,:classid,:userId,:usertype,:className,:handle,:handleTime,:handlecategory)";
                comm.Parameters.Add(new OleDbParameter("userName", session["username"]));
                comm.Parameters.Add(new OleDbParameter("classid", session["classid"]));
                comm.Parameters.Add(new OleDbParameter("userId", session["info_id"]));
                comm.Parameters.Add(new OleDbParameter("usertype", session["type"]));
                comm.Parameters.Add(new OleDbParameter("className", session["classname"]));
                comm.Parameters.Add(new OleDbParameter("handle", tag));
                comm.Parameters.Add(new OleDbParameter("handleTime", DateTime.Now));
                comm.Parameters.Add(new OleDbParameter("handlecategory", group));
                comm.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }

        }
        private List<dynamic> getOneData(MySqlCommand comm)
        {
            List<dynamic> dm = new List<object>();
            if (comm.CommandText.Trim().ToLower().StartsWith("select"))
            {
                using (MySqlDataReader odr = comm.ExecuteReader())
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
        public List<dynamic> getDataSource(List<string> keys, Dictionary<string, object> data)
        {
            List<dynamic> dm = new List<dynamic>();
            string connString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            JArray obj = (JArray)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/getData.json")));
            List<dynamic> items = new List<dynamic>();
            foreach (var c in obj)
            {
                dynamic dic = c;
                foreach (var nowKey in keys)
                {
                    if (dic.key.Value == nowKey)
                    {
                        items.Add(dic);
                    }
                }
            }
            foreach (var c in items)
            {
                if (c.connection!=null&&!string.IsNullOrEmpty(c.connection.ToString()))
                {
                    connString = System.Configuration.ConfigurationManager.AppSettings[c.connection.ToString()];
                }
            }
            using (MySqlConnection conn = new MySqlConnection(connString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
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
                            if (sql.IndexOf("[[" + jsonp.Key.ToString() + "]]") > -1)
                            {
                                sql = sql.Replace("[[" + jsonp.Key.ToString() + "]]", jsonp.Value.ToString());
                                sqlTemp = sqlTemp.Replace("[[" + jsonp.Key.ToString() + "]]", jsonp.Value.ToString());
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
                    //foreach (var d in data)
                    //{
                    //    if (sql.IndexOf("[" + d.Key.ToString() + "]") > -1)
                    //    {
                    //        sql = sql.Replace("[" + d.Key.ToString() + "]", ":" + d.Key.ToString());
                    //        if (sql.IndexOf("like :" + d.Key.ToString()) > -1)
                    //        {
                    //            comm.Parameters.Add(new OleDbParameter(d.Key.ToString(), "%" + d.Value + "%"));
                    //        }
                    //        else
                    //        {
                    //            comm.Parameters.Add(new OleDbParameter(d.Key.ToString(), d.Value));
                    //        }
                    //    }
                    //}
                    //替换GUID
                    sqlTemp = sqlTemp.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");
                    sql = sql.Replace("[::guid]", "'" + Guid.NewGuid().ToString() + "'");

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
                    comm.CommandText = sql;
                    if (System.Configuration.ConfigurationManager.AppSettings["debugSQL"] == "true")
                    {
                        ErrLog.Log(sqlTemp);
                    }
                    dm.Add(new { name = c.key.Value, data = getOneData(comm) });
                    if (c.tag != null)
                    {
                        string group = "";
                        if (c.group != null)
                        {
                            group = c.group.Value;
                        }
                        foreach (var parInput in data)
                        {
                            c.tag.Value = c.tag.Value.Replace("[" + parInput.Key + "]", parInput.Value.ToString());
                        }

                    }
                }
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