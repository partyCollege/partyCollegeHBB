using CollegeAPP.DataModel;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public static class G_USERS_Extension
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        static string SUPER_connString = System.Configuration.ConfigurationManager.AppSettings["SUPER_connString"];
        public static List<G_USERS> getModule(this G_USERS guser)
        {
            List<G_USERS> listGuser = new List<G_USERS>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                List<SQLQuery> condtion = new List<SQLQuery>();
                condtion.Add(new SQLQuery("status", Opertion.greater, 0));
                condtion.Add(new SQLQuery("Utype", Opertion.equal, 0));
                listGuser = DBHelp.Query<G_USERS>(conn, false);
            }
            return listGuser;
        }

        public static List<G_USERS> getGUserDepartInfo(this G_USERS guser, string maindept)
        {
            List<G_USERS> listGuser = new List<G_USERS>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"select g.utype, g.uname, g.globe_id
                                        from g_users g
                                        where utype = 2
                                        and g.maincode = :maindept
                                        and g.deptlevel = 2
                                        and status > -1
                                        order by g.userorderby";
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("maindept", maindept));
                MySqlDataAdapter oda = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                oda.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    cmd.Parameters.Clear();
                    cmd.CommandText = @"select g.uname, g.id, g.mobile_email, g.status, g.utype
                                                      from g_users g
                                                    inner join g_dept de
                                                    on g.id=de.user_id
                                                     where g.globe_id like '" + row["globe_id"].ToString() + @"%'
                                                       and status > -1 and g.utype=0 order by de.shorder";
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            G_USERS _guser = new G_USERS();
                            _guser.id = reader["id"].ToString();
                            _guser.uname = reader["UNAME"].ToString();
                            _guser.utype = reader["utype"].ToString();
                            _guser.status = Convert.ToInt32(reader["status"].ToString());
                            _guser.mobile_email = reader["mobile_email"].ToString();
                            _guser.department = row["uname"].ToString();
                            listGuser.Add(_guser);
                        }
                    }
                }
            }
            return listGuser;
        }
        public static string getSUPERPSD(this G_USERS guser, string onecard)
        {
            string returnVal = "";
            using (MySqlConnection conn = new MySqlConnection(SUPER_connString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select 密码,借书证号 from 读者库  where 借书证号=:onecard ";
                comm.Parameters.Add(new MySqlParameter("onecard", onecard));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        if (odr["密码"] != DBNull.Value)
                        {
                            returnVal = odr["密码"].ToString();
                        }
                    }
                }
            }
            return returnVal;
        }
        public static G_USERS get(this G_USERS guser)
        {
            G_USERS sigle = null;
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                sigle = DBHelp.QueryOne<G_USERS>(conn, SQLQueryMade.Add(new SQLQuery("STATUS", Opertion.greaterEqual, 0)
                ), false);
            }
            return sigle;
        }
        public static byte[] getimg(this G_USERS guser, string id)
        {
            byte[] by = null;
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                guser = guser.getOne<G_USERS>(conn, SQLQueryMade.Add(new SQLQuery("ID", Opertion.equal, id)), true);
                if (guser.OtherColumns.getColumn("ZP").Value != DBNull.Value)
                {
                    by = (byte[])guser.OtherColumns.getColumn("ZP").Value;
                }
            }

            return by;
        }
        public static string getimgUrl(this G_USERS guser, string id)
        {
            string returnVal = "";
            using (MySqlConnection conn = new MySqlConnection(SUPER_connString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select zppath from G_USERS  where id=:id ";
                comm.Parameters.Add(new MySqlParameter("id", id));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        if (odr["zppath"] != DBNull.Value)
                        {
                            // 宁夏党校地址
                            returnVal = "http://app.nxdx.org.cn"+odr["zppath"].ToString();
                        }
                    }
                }
            }
            return returnVal;
        }
        public static G_USERS getOne(this G_USERS guser, string id)
        {
            G_USERS returnVal = new G_USERS();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                returnVal = guser.getOne<G_USERS>(conn, SQLQueryMade.Add(new SQLQuery("ID", Opertion.equal, id)), false);
            }
            return returnVal;
        }
        public static G_USERS phoneLogin(this G_USERS guser)
        {
            G_USERS sigle = new G_USERS();

            return sigle;
        }
        /// <summary>
        /// 用于深圳的专家登录
        /// </summary>
        /// <param name="guser"></param>
        /// <returns></returns>
        public static G_USERS ZJLogin(this G_USERS guser)
        {
            G_USERS sigle = new G_USERS();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                string sSql = string.Empty;
                sSql = "select h.yhm,h.mm,g.bt,'zj' as utype,g.id,h.md5psd from jw_jsxx h inner join g_infos g on h.info_id=g.id where h.yhm=:yhm and g.deleted>-1";
                MySqlCommand cmd = new MySqlCommand(sSql, conn);
                MySqlParameter[] parms = new MySqlParameter[] { 
					new MySqlParameter("yhm",guser.logname)
				};
                cmd.Parameters.AddRange(parms);
                IDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    sigle.logname = reader["yhm"].ToString();
                    sigle.uname = reader["bt"].ToString();
                    sigle.utype = reader["utype"].ToString();
                    sigle.md5psd = reader["md5psd"].ToString();
                    sigle.id = reader["ID"].ToString();
                }
                reader.Close();
            }
            return sigle;
        }
        public static G_USERS Login(this G_USERS guser)
        {
            G_USERS sigle = new G_USERS();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                string sSql = @"SELECT ID, maincode, PSD, MD5PSD, ID, UTYPE, status, LOGNAME, Uname,ry.p_YKTH as p_yktaccnum,g.ishandpsd,g.handpsd
  FROM G_USERS g
  left join hr_rycyxx ry
  on to_char(g.id)=ry.oauserid
 WHERE (UPPER(LOGNAME) =? OR UPPER(UNAME) =? OR
       UPPER(LOGNAME_DEFAULT) =?)
   AND ISNATIVE = 1
   AND STATUS >= 0
   AND UTYPE IN (0, 9)";
                if (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["onecard"]))
                {
                    sSql = sSql.Replace("ry.p_YKTH", System.Configuration.ConfigurationManager.AppSettings["onecard"]);
                }
                MySqlCommand cmd = new MySqlCommand(sSql, conn);
                MySqlParameter[] parms = new MySqlParameter[] { 
					new MySqlParameter("LOGNAME",guser.logname),
					new MySqlParameter("UNAME",guser.logname),
					new MySqlParameter("LOGNAME_DEFAULT",guser.logname)
				};
                cmd.Parameters.AddRange(parms);
                IDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    sigle.status = Convert.ToInt32(reader["status"].ToString());
                    sigle.logname = reader["LOGNAME"].ToString();
                    sigle.mainCode = reader["MAINCODE"].ToString();
                    sigle.uname = reader["UNAME"].ToString();
                    sigle.utype = reader["UTYPE"].ToString();
                    sigle.md5psd = reader["MD5PSD"].ToString();
                    sigle.id = reader["ID"].ToString();
                    if (reader["p_yktaccnum"] != DBNull.Value)
                    {
                        sigle.onecard = reader["p_yktaccnum"].ToString();
                    }
                    sigle.ishandpsd = reader["ishandpsd"].ToString();
                    if (reader["handpsd"] != DBNull.Value)
                    {
                        sigle.handpsd = reader["handpsd"].ToString();
                    }
                    else
                    {
                        sigle.handpsd = "";
                    }
                    SessionModel sessionModel = new SessionModel();
                    sessionModel.userid = sigle.id;
                    sessionModel.usertype = "teacher";
                    sessionModel.username = sigle.uname;
                    HttpContext.Current.Session["user"] = sessionModel;
                }
                reader.Close();
				if (!string.IsNullOrEmpty(sigle.id))
				{ 
                cmd.Parameters.Clear();
                cmd.CommandText = @"SELECT DISTINCT B.UNAME
                                      FROM G_GRPS A, G_USERS B
                                     WHERE A.GRP_ID = B.ID
                                       AND B.STATUS >= 0
                                       AND B.UTYPE = 3
                                       AND A.USER_ID =:id";
				parms = new MySqlParameter[] { new MySqlParameter("id",sigle.id)};
				cmd.Parameters.AddRange(parms);
                using (MySqlDataReader odr = cmd.ExecuteReader())
                {
                    while (odr.Read())
                    {
                        sigle.roles.Add(odr["uname"].ToString());
                    }
                }
				}
            }
            return sigle;
        }
    }
}