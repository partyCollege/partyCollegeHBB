using CollegeAPP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Model;
using System.Data.OleDb;
using PartyCollegeUtil.DB_ORM;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.AdvancedAPIs;
using System.IO;
using System.Web;
using CollegeAPP.DataModel;
using Senparc.Weixin.QY.Containers;
using MySql.Data.MySqlClient;

namespace CollegeAPP.Controllers
{
    public class qingjiaController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];

        [HttpGet]
        [Route("api/qingjia/action/get/{userid}/{bcid}")]
        public IEnumerable<qingjia> get(string userid, string bcid)
        {
            List<qingjia> qingjiaList = new List<qingjia>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                qingjia qj = new qingjia();
                qingjiaList=qj.get<qingjia>(conn, SQLQueryMade.Add(
                    new SQLQuery("BCINFO_ID",Opertion.equal,bcid),
                    new SQLQuery("XYINFO_ID",Opertion.equal,userid),
                    new SQLQuery("createdate", OrderBy.DESC)
                    ),false);

            }
            return qingjiaList;
        }
        [HttpPost]
        [Route("api/qingjia/action/qingjiasp")]
        public bool qingjiasp(dynamic mic)
        {
            string info_id = mic.info_id.Value.ToString();
            string option = mic.option.Value.ToString();
            SessionModel session=(SessionModel)HttpContext.Current.Session["user"];
            bool returnVal = false;
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlTransaction tran = conn.BeginTransaction();
                MySqlCommand comm = conn.CreateCommand();
                comm.Transaction = tran;
                try
                {
                    string pnid = string.Empty;
                    string pid = string.Empty;
                    comm.CommandText = "select pnid,pid from g_inbox where user_id=:userid AND info_id=:info_id order by rdate desc";
                    comm.Parameters.Add(new MySqlParameter("userid", session.userid));
                    comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        if (odr.Read())
                        {
                            pnid = odr["pnid"].ToString();
                            pid = odr["pid"].ToString();
                        }
                    }

                    comm.CommandText = "delete g_inbox where info_id=:info_id";
                    comm.Parameters.Clear();
                    comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                    comm.ExecuteNonQuery();

                    comm.CommandText = "insert into g_opinion (content,pdate,pnid,pid,id) values (:content,:pdate,:pnid,:pid,:id)";
                    comm.Parameters.Clear();
                    comm.Parameters.Add(new MySqlParameter("content", option));
                    comm.Parameters.Add(new MySqlParameter("pdate", DateTime.Now));
                    comm.Parameters.Add(new MySqlParameter("pnid", pnid));
                    comm.Parameters.Add(new MySqlParameter("pid", pid));
                    comm.Parameters.Add(new MySqlParameter("id", 1));
                    comm.ExecuteNonQuery();

                    comm.CommandText = "update g_infos set status=2 where id=" + info_id;
                    comm.Parameters.Clear();
                    comm.ExecuteNonQuery();

                    comm.CommandText = "update g_pnodes set status=-1 where pid=" + pid;
                    comm.ExecuteNonQuery();
                    string spzt="0";
                    if (option == "不同意")
                    {
                        spzt = "-1";
                    }
                    else {
                        spzt = "1";
                    }
                    comm.CommandText = "update jw_qingjia set spzt=:spzt where info_id=" + info_id;
                    comm.Parameters.Clear();
                    comm.Parameters.Add(new MySqlParameter("spzt", spzt));
                    comm.ExecuteNonQuery();

                    comm.Parameters.Clear();
                    comm.CommandText = "insert into G_UFILES (info_id,user_id,PRIVILEGE) values (:info_id,:user_id,:PRIVILEGE)";
                    comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                    comm.Parameters.Add(new MySqlParameter("user_id", session.userid));
                    comm.Parameters.Add(new MySqlParameter("PRIVILEGE", 9));
                    comm.ExecuteNonQuery();


                    tran.Commit();
                }
                catch (Exception e)
                {
                    tran.Rollback();
                }

            }
            return returnVal;
        }

        public static string GetMaxValue(string sTag)
        {
            string sReturnID = "1";
            string sSql = "";
            bool bFind = false;

            MySqlConnection M_Conn;
            MySqlCommand M_Comm = new MySqlCommand();
            MySqlDataReader M_Read;
            M_Conn = new MySqlConnection(ConnectionString);
            M_Conn.Open();
            M_Comm.Connection = M_Conn;

            try
            {
                sSql = "select MAXID from MAXVALUE where TAG='" + sTag + "'";
                M_Comm.CommandText = sSql;
                M_Read = M_Comm.ExecuteReader();
                if (M_Read.Read())
                {
                    sReturnID = M_Read["MAXID"].ToString();
                    bFind = true;
                }
                M_Read.Close();

                if (!bFind)
                {
                    sSql = "INSERT INTO MAXVALUE(MAXID,TAG) VALUES(1,'" + sTag + "')";
                    M_Comm.CommandText = sSql;
                    M_Comm.ExecuteNonQuery();
                }

                sSql = "update MAXVALUE set MAXID=MAXID+1 where TAG='" + sTag + "'";
                M_Comm.CommandText = sSql;
                M_Comm.ExecuteNonQuery();
            }
            catch
            {
            }
            finally
            {
                M_Conn.Close();
            }
            return sReturnID;
        }
        private void SaveInboxAndPnodes(string id, MySqlConnection m_cn, MySqlTransaction mytran,string xyinfo_id,string bcinfo_id,string uname)
        {
            MySqlCommand comm = m_cn.CreateCommand();
            comm.Transaction = mytran;
            string strPid = GetMaxValue("G_PID");
            //要走流程，必先在g_infos表中插入数据,再向g_infos_relation表中插入数据
            string sql = "insert into g_infos(id,user_id,status,objclass,bt,JC_ID) values(" + id + ",'" + xyinfo_id + "',1,'QJD','" + uname + DateTime.Now.ToString("yyyy-MM-dd") + "的请假单'," + strPid + ")";
            comm.CommandText = sql;
            comm.ExecuteNonQuery();
            sql = "insert into g_infos_relation(id,fid) values(" + id + ",0)";
            comm.CommandText = sql;
            comm.ExecuteNonQuery();
            //插入数据到g_inbox表中

            string str = string.Empty;
            string strn = string.Empty;
            comm.CommandText = "select bzr,bzr_uid from jw_bcgl where info_id=" + bcinfo_id;
            using (MySqlDataReader odr = comm.ExecuteReader())
            {
                if (odr.Read())
                {
                    str = odr["bzr_uid"].ToString();
                    strn = odr["bzr"].ToString();
                }
            }

            //插入数据到g_pnodes表中
            sql = "insert into g_pnodes(pid,id,user_id,dept_id,status,whohandle,signed,muser_id,rdate,fid,info_id,utype,timetype,timespan,fstatus,actname,wf_id,wfnode_id,wfnode_caption,uname) values(" +
                  "" + strPid + "," +
                  "1," +
                  "2086," +
                  "2085," +
                  "-1," +
                  "null," +
                  "1," +
                  "2086," +
                  "SYSDATE," +
                  "1," +
                  "" + id + "," +
                  "9," +
                  "0," +
                  "0," +
                  "-1," +
                  "'拟稿'," +
                  "682," +
                  "7," +
                  "'拟稿'," +
                  "'')";
            comm.CommandText = sql;
            comm.ExecuteNonQuery();

            string[] strs = str.Split(',');
            string[] strns = strn.Split('、');
            string inboxid = string.Empty;
            for (int i = 0; i < strs.Length; i++)
            {
                inboxid =GetMaxValue("G_INBOX");
                sql = "insert into g_inbox(id,info_id,user_id,pid,pnid,rdate,fuser_id,actname,wf_id,wfnode_id,bt,objclass,funame) values(" +
                      "" + inboxid + "," +
                      "" + id + "," +
                      "" + strs[i] + "," +
                      "" + strPid + "," +
                      "" + (i + 2).ToString() + "," +
                      "SYSDATE," +
                      "2086," +
                      "'班主任审核'," +
                      "682," +
                      "2," +
                      "'" + uname + DateTime.Now.ToString("yyyy-MM-dd") + "的请假单'," +
                      "'QJD'," +
                       "'" + uname + "'" +
                      ")";
                comm.CommandText = sql;
                comm.ExecuteNonQuery();

                sql = "insert into g_pnodes(pid,id,user_id,dept_id,status,whohandle,signed,muser_id,rdate,fid,info_id,utype,timetype,timespan,fstatus,actname,wf_id,wfnode_id,wfnode_caption,uname) values(" +
                     "" + strPid + "," +
                     "" + (i + 2).ToString() + "," +
                     "" + strs[i] + "," +
                     "2085," +
                      "1," +
                      "null," +
                     "1," +
                     "" + strs[i] + "," +
                     "SYSDATE," +
                     "1," +
                     "" + id + "," +
                     "0," +
                     "0," +
                     "0," +
                     "-1," +
                     "'班主任审核'," +
                     "682," +
                     "2," +
                     "'班主任审核'," +
                     "'" + strns[i] + "')";
                comm.CommandText = sql;
                comm.ExecuteNonQuery();
            }
        }

        // GET: api/qingjia/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/qingjia
        public string Post(qingjia qingjia)
        {
            string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
            string token = AccessTokenContainer.GetToken(corpId,_corpSecret);

            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlTransaction tran = conn.BeginTransaction();
                MySqlCommand comm = conn.CreateCommand();
                comm.Transaction = tran;
                try
                {
                    string sql = string.Empty;
                    sql = "update maxvalue set maxid=decode(maxid,null,0,maxid)+1 where tag='G_INFOS'";
                    comm.CommandText = sql;
                    comm.ExecuteNonQuery();

                    sql = "select decode(max(id),null,0,max(id))+1 from g_infos";
                    comm.CommandText = sql;
                    string info_id = comm.ExecuteScalar().ToString();
                    sql = "select bt from g_infos where id=" + qingjia.XYINFO_ID;
                    comm.CommandText = sql;
                    string uname= comm.ExecuteScalar().ToString();

                    sql = "insert into jw_qingjia(info_id,bcinfo_id,xyinfo_id,sdate,edate,content,MINUTE,CreateUser,CreateDate,BCMC,qjlx) values (:info_id,:bcinfo_id,:xyinfo_id,:sdate,:edate,:content,:MINUTE,:CreateUser,:CreateDate,:BCMC,:qjlx)";
                    comm.CommandText = sql;
                    comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                    comm.Parameters.Add(new MySqlParameter("bcinfo_id", qingjia.BCINFO_ID));
                    comm.Parameters.Add(new MySqlParameter("xyinfo_id", qingjia.XYINFO_ID));
                    comm.Parameters.Add(new MySqlParameter("sdate", qingjia.SDATE));
                    comm.Parameters.Add(new MySqlParameter("edate", qingjia.EDATE));
                    comm.Parameters.Add(new MySqlParameter("content", qingjia.CONTENT));
                    comm.Parameters.Add(new MySqlParameter("MINUTE", (qingjia.EDATE-qingjia.SDATE).Minutes));
                    comm.Parameters.Add(new MySqlParameter("CreateUser", qingjia.CREATEUSER));
                    comm.Parameters.Add(new MySqlParameter("CreateDate", DateTime.Now));
                    comm.Parameters.Add(new MySqlParameter("BCMC",qingjia.BCMC));
                    comm.Parameters.Add(new MySqlParameter("qjlx", qingjia.QJLX));
                    comm.ExecuteNonQuery();
                    comm.Parameters.Clear();
                    if (!string.IsNullOrEmpty(qingjia.ImgserverId))
                    {
                        MemoryStream ms = new MemoryStream();
                        MediaApi.Get(token, qingjia.ImgserverId, ms);
                        System.Drawing.Image img1 = System.Drawing.Image.FromStream(ms);
                        string path = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + @"\img\qingjia\";
                        if (!System.IO.Directory.Exists(path))
                        {
                            System.IO.Directory.CreateDirectory(path);
                        }
                        img1.Save(path + info_id + ".jpg");
                    }

                    sql = "update jw_qingjia set qjts=(trunc(edate)-trunc(sdate)+1),minute=(ROUND(TO_NUMBER(edate - sdate) * 24*60))  where info_id=" + info_id;
                    comm.CommandText = sql;
                    comm.ExecuteNonQuery();

                    SaveInboxAndPnodes(info_id, conn, tran, qingjia.XYINFO_ID, qingjia.BCINFO_ID, uname);
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                    return "error";
                }
            }
            return "success";
        }

        // PUT: api/qingjia/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/qingjia/5
        public void Delete(int id)
        {
        }
    }
}
