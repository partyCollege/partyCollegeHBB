using CollegeAPP.config;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using MySql.Data.MySqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace CollegeAPP.Model
{
	public static class G_INBOX_Extension
	{
		static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
		private static string Get_FDepts(string strDeptId, string strDepts)
		{
			MySqlConnection M_Conn;
			MySqlDataAdapter M_Adpt;
			System.Data.DataSet M_Dset = new DataSet();
			M_Conn = new MySqlConnection(ConfigurationManager.AppSettings["OLEDB_connString"]);
			M_Conn.Open();
			try
			{
				string sql1 = "SELECT D.ID DEPTID,B.ID AS DID,B.UTYPE,B.UNAME,B.GLOBE_ID,B.ISOUTER,B.ALIAS FROM G_USERS A , G_USERS B , G_DEPT C , G_DEPT D WHERE A.ID = C.USER_ID AND C.FID = D.ID AND D.USER_ID = B.ID AND A.ID = " + strDeptId;
				M_Adpt = new MySqlDataAdapter(sql1, M_Conn);
				M_Adpt.Fill(M_Dset, "DEPT");
				for (int i = 0; i < M_Dset.Tables["DEPT"].Rows.Count; i++)
				{
					strDepts += M_Dset.Tables["DEPT"].Rows[i]["DID"].ToString() + ",";
					if (M_Dset.Tables["DEPT"].Rows[i]["UTYPE"].ToString() != "8" && M_Dset.Tables["DEPT"].Rows[i]["ISOUTER"].ToString() != "1")
					{
						strDepts = Get_FDepts(M_Dset.Tables["DEPT"].Rows[i]["DID"].ToString(), strDepts);
					}
				}
				M_Dset.Dispose();
				M_Adpt.Dispose();
			}
			catch { }
			finally
			{
				M_Conn.Close();
			}
			return strDepts;
		}
        /// <summary>
        /// 获取用户上次点击主屏提醒时间
        /// </summary>
        /// <param name="fa"></param>
        /// <returns></returns>
        public static DateTime getLastReadTime(this G_INBOX fa,string objclass)
        {
            DateTime returnVal = DateTime.MinValue;
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select LASTREADTIME from APP_NOTICE where userid=:userid and objclass=:objclass";
                comm.Parameters.Add(new MySqlParameter("userid", fa.USER_ID));
                comm.Parameters.Add(new MySqlParameter("objclass", objclass));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        returnVal = Convert.ToDateTime(odr["LASTREADTIME"]);
                    }
                }
            }
            return returnVal;
        }
        public static void updateLastReadTime(this G_INBOX fa,string objclass)
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "delete from APP_NOTICE where userid=:userid and objclass=:objclass";
                comm.Parameters.Add(new MySqlParameter("userid", fa.USER_ID));
                comm.Parameters.Add(new MySqlParameter("objclass", objclass));
                comm.ExecuteNonQuery();

                comm.CommandText = "insert into APP_NOTICE (userid,lastreadtime,objclass) values (:userid,:lastreadtime,:objclass)";
                comm.Parameters.Clear();
                comm.Parameters.Add(new MySqlParameter("userid", fa.USER_ID));
                comm.Parameters.Add(new MySqlParameter("lastreadtime", DateTime.Now));
                comm.Parameters.Add(new MySqlParameter("objclass", objclass));
                comm.ExecuteNonQuery();
            }
        }
		public static List<G_INBOX> getModule(this G_INBOX fa)
		{
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				List<G_INBOX> returnList = new List<G_INBOX>();
				conn.Open();
				string sql = string.Empty;
				sql = "SELECT A.ID , A.UNAME , B.ID AS DID , B.UNAME AS DNAME FROM G_USERS A , G_USERS B , G_DEPT C , G_DEPT D WHERE A.ID = C.USER_ID AND C.FID = D.ID AND C.ISMAIN = 1 AND D.USER_ID = B.ID AND A.ID = " + fa.USER_ID;
				MySqlCommand cmd = new MySqlCommand(sql,conn);
				MySqlDataReader reader = null;
				string sDept	= string.Empty;
				string sDeptID	= string.Empty;
				string sUser = string.Empty;

				reader = cmd.ExecuteReader();
				if (reader.Read()) 
				{
					sDept = reader["DNAME"].ToString();
					sDeptID = reader["DID"].ToString();
					sUser = reader["UNAME"].ToString();
				}
				reader.Close();


				string Depts = Get_FDepts(fa.USER_ID, "");
				if (Depts.Length > 1)
					Depts = Depts.Substring(0, Depts.Length - 1);
				string sUsers = "," + fa.USER_ID + "," + sDeptID + "," + Depts + ",";
				string strAllUid = "";

				sql = "SELECT ID FROM G_USERS WHERE UNAME='全部人员' AND UTYPE=3 AND ISNATIVE=1 AND STATUS>=0";
				cmd.CommandText = sql;
				reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					sUsers = sUsers + reader["ID"].ToString() + ",";
					strAllUid = reader["ID"].ToString();
				}
				reader.Close();

				sql = "SELECT * FROM G_GRPS WHERE USER_ID=" + fa.USER_ID + "";
				cmd.CommandText = sql;
				reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					sUsers = sUsers + reader["GRP_ID"].ToString() + ",";
				}
				reader.Close();

				sql = "SELECT * FROM G_GRPS_PRI WHERE USER_ID=" + fa.USER_ID + "";
				cmd.CommandText = sql;
				reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					sUsers = sUsers + reader["GRP_ID"].ToString() + ",";
				}
				reader.Close();

				sUsers = sUsers.Substring(1, sUsers.Length - 2);

				string strDeptArray = Depts + ";";
				string strRoleArray = sUsers + ";";
				string strUserArray = fa.USER_ID + ";";
				string strObjArray = ";";

				//添加代办用户的USER_ID和角色ID和部门ID（Added By Reno 2005-3-4）
				sql = "SELECT A.OBJCLASS,A.USER_ID,D.ID DEPTID FROM G_DBRESET A,G_DEPT B,G_DEPT C,G_USERS D WHERE A.USER_ID=B.USER_ID AND B.FID=C.ID AND C.USER_ID=D.ID AND A.AUSER_ID=" + fa.USER_ID + "";
				DataTable dt = new DataTable();
				MySqlDataAdapter adpt = new MySqlDataAdapter(sql,conn);
				adpt.Fill(dt);

				for (int i = 0; i < dt.Rows.Count; i++)
				{
					strDeptArray = strDeptArray + dt.Rows[i]["DEPTID"].ToString() + ";";
					strUserArray += dt.Rows[i]["USER_ID"].ToString() + ";";
					strObjArray += dt.Rows[i]["OBJCLASS"].ToString() + ";";
					sUsers = dt.Rows[i]["USER_ID"].ToString() + "," + strAllUid + ",";

					sql = "SELECT DISTINCT GRP_ID FROM G_GRPS WHERE USER_ID=" + dt.Rows[i]["USER_ID"] + "";
					cmd.CommandText = sql;
					reader = cmd.ExecuteReader();
					while (reader.Read())
					{
						sUsers = sUsers + reader["GRP_ID"].ToString() + ",";
					}
					reader.Close();

					sUsers = sUsers.Substring(0, sUsers.Length - 1);
					strRoleArray += sUsers + ";";
				}

				strDeptArray = strDeptArray.Substring(0, strDeptArray.Length - 1);
				strRoleArray = strRoleArray.Substring(0, strRoleArray.Length - 1);
				strUserArray = strUserArray.Substring(0, strUserArray.Length - 1);
				strObjArray = strObjArray.Substring(0, strObjArray.Length - 1);

				string[] strDeptArr = strDeptArray.Split(";".ToCharArray());
				string[] strRoleArr = strRoleArray.Split(";".ToCharArray());
				string[] strUserArr = strUserArray.Split(";".ToCharArray());
				string[] strObjArr = strObjArray.Split(";".ToCharArray());
				StringBuilder cmdStr = new StringBuilder();
				cmdStr.Append("SELECT A.USER_ID,B.UNAME AS MAINDEPTNAME,A.ISZNG,A.STATUS,A.HASCONTENT,A.URGENT,TO_CHAR(A.EDATE-SYSDATE) DAYS,A.SWH,A.WH,  TO_CHAR(A.rdate, 'YYYY-MM-DD') RDATE1,A.SENDTYPE,A.ACTNAME,A.BT,A.INFO_ID,A.PID,A.PNID,A.OBJCLASS,TO_CHAR(A.QSRQ,'YYYY.MM.DD HH24:MI') AS ORDERDATE,A.ID AS INBOX_ID,DECODE(A.FUNAME,null,C.UNAME,A.FUNAME) AS UNAME ,A.RDATE FROM G_INBOX A,G_USERS C,G_USERS B,G_INFOS D WHERE A.FUSER_ID = C.ID AND C.MAINCODE=B.ID AND D.ID=A.INFO_ID AND A.WFNODE_WAIT=0 AND A.DELETED>=0 AND (");
				if (strObjArr[0].Trim() == "ALL" || strObjArr[0].Trim() == "")
					cmdStr.Append(string.Format(" ((A.USER_ID IN ({0}) AND A.DEPT_ID IN ({1}) OR (A.USER_ID={2})) ) OR", strRoleArr[0], strDeptArr[0], strUserArr[0]));
				else
					cmdStr.Append(string.Format(" ((A.OBJCLASS='{0}' AND (A.USER_ID IN ({1}) AND A.DEPT_ID IN ({2}) OR (A.USER_ID={3})))) OR", strObjArr[0].Trim(), strRoleArr[0], strDeptArr[0], strUserArr[0]));
				for (int i1 = 1; i1 < strDeptArr.Length; i1++)
				{
					if (strObjArr[i1].Trim() == "ALL" || strObjArr[i1].Trim() == "")
						cmdStr.Append(string.Format(" (A.USER_ID IN ({0}) AND A.DEPT_ID IN ({1}) OR (A.USER_ID={2})) OR", strRoleArr[i1], strDeptArr[i1], strUserArr[i1]));
					else
						cmdStr.Append(string.Format(" (A.OBJCLASS='{0}' AND (A.USER_ID IN ({1}) AND A.DEPT_ID IN ({2}) OR (A.USER_ID={3}))) OR", strObjArr[i1].Trim(), strRoleArr[i1], strDeptArr[i1], strUserArr[i1]));
				}

				string cmdStr_1 = cmdStr.ToString();
				cmdStr_1 = cmdStr_1.Substring(0, cmdStr_1.Length - 2);
				cmdStr = new StringBuilder(cmdStr_1);
				cmdStr.Append(")");
				cmdStr.Append("AND A.STATUS<>9");
				cmdStr.Append(" ORDER BY A.RDATE DESC");

				sql = string.Format("SELECT * FROM (SELECT * FROM ({0}) UNION select RECEIVE_USER_ID, SEND_DEPTNAME AS MAINDEPTNAME,0 AS ISZNG,SYSTEMSTATUS AS STATUS,0 as hascontent,0 AS URGENT,url AS DAYS,objname AS SWH,ACTNAME AS WH,TO_CHAR(SENDTIME, 'YYYY-MM-DD') RDATE1,0 AS SENDTYPE,ID AS ACTNAME,MESSAGE AS BT,0 AS INFO_ID,0 AS PID,0 AS PNID,'MESSAGE' AS OBJCLASS,TO_CHAR(CREATEDATE, 'YYYY.MM.DD HH24:MI') AS ORDERDATE,0 AS INBOX_ID,SEND_UNAME AS UNAME,SENDTIME as RDATE from G_REMIND_MESSAGE where RECEIVE_USER_ID={1}) ORDER BY RDATE desc", cmdStr.ToString(), fa.USER_ID);
				cmd.CommandText = sql;
				reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					G_INBOX ginbox = new G_INBOX();
					ginbox.BT = reader["bt"].ToString();
					ginbox.INFO_ID = reader["info_id"].ToString();
					ginbox.USER_ID = reader["user_id"].ToString();
					ginbox.RDATE = Convert.ToDateTime(reader["RDATE"].ToString());
					returnList.Add(ginbox);
				}
				reader.Close();
				return returnList;
			}
		}

        /// <summary>
        /// 共用事业学校
        /// </summary>
        /// <param name="ginbox"></param>
        /// <param name="lastReadTime"></param>
        /// <returns></returns>
        public static List<G_INBOX> getGYXYXX(this G_INBOX ginbox, DateTime lastReadTime)
        {
            List<G_INBOX> returnVal = new List<G_INBOX>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                string strRoleList = "";
                MySqlCommand comm = conn.CreateCommand();
                //var config= File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/AppConfig.json"));
                string objclass= SystemConfig.AppSettings.GetValue("notice_gysyxx");
                string xxRole = "";
                switch (objclass)
                {
                    case "WGWJ":
                        xxRole = "违规违纪推送";
                        break;
                    case "":
                        break;
                }

                if (ginbox.USER_ID != null)
                {                    
                    comm.CommandText = "SELECT DISTINCT B.UNAME FROM G_GRPS A,G_USERS B WHERE A.GRP_ID = B.ID AND B.STATUS >= 0 AND B.UTYPE = 3 AND A.USER_ID = " + ginbox.USER_ID;
                    DataTable dtRole = new DataTable();
                    MySqlDataAdapter odaRole = new MySqlDataAdapter(comm);
                    odaRole.Fill(dtRole);
                    foreach (DataRow dr in dtRole.Rows)
                    {
                        strRoleList += dr["UNAME"].ToString() + ",";
                    }
                    strRoleList += "全部人员,";
                }

                comm.CommandText = "select g.id,g.user_id,g.bt,g.ngrq from g_infos g where objclass in (" + objclass + ") and printable=2 and ngrq>:dt";
                comm.Parameters.Add(new MySqlParameter("dt", lastReadTime));
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    if (Regex.Matches(strRoleList, xxRole).Count == 1)
                    {
                        G_INBOX inbox = new G_INBOX();
                        inbox.BT = dr["bt"].ToString();
                        inbox.INFO_ID = dr["id"].ToString();
                        inbox.RDATE = Convert.ToDateTime(dr["ngrq"]);
                        inbox.USER_ID = dr["user_id"].ToString();
                        returnVal.Add(inbox);
                    }
                }
            }
            return returnVal;
        }

        public static List<G_INBOX> getDYXX(this G_INBOX ginbox,DateTime lastReadTime)
        {
            List<G_INBOX> returnval = new List<G_INBOX>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @" select b.from_user,b.id,b.title,b.scrq from G_BIANJIAN b
                            where ','||to_uidstr||','  like '%," + ginbox.USER_ID + ",%' and SCRQ>=:dt order by scrq desc";
                comm.Parameters.Add(new MySqlParameter("dt", lastReadTime));
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    G_INBOX g = new G_INBOX();
                    g.BT = dr["title"].ToString();
                    g.RDATE = Convert.ToDateTime(dr["scrq"]);
                    returnval.Add(g);
                }


            }
            return returnval;

        }
        public static List<G_INBOX> getTZGG(this G_INBOX ginbox)
        {
            List<G_INBOX> returnval = new List<G_INBOX>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select reportid, title, ondate, offdate
  from PLACARDINFO t
 where status = '9'
   and placardtype = 0
   and (users like  '%'||(select maincode from g_users where id = @"+ginbox.USER_ID+")||'%'  or users like '%"+ginbox.USER_ID+@"%')
 order by ondate desc";
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    G_INBOX g = new G_INBOX();
                    g.BT = dr["title"].ToString();
                    g.RDATE = Convert.ToDateTime(dr["ondate"]);
                    returnval.Add(g);
                }
            }
            return returnval;
        }
	}
}