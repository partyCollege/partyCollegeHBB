using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
using System.Data;
using CollegeAPP.Model;
using System.Data.OleDb;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using PartyCollegeUtil.Tools;

namespace CollegeAPP.Controllers
{
    public class DiscuzController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
        public static string ConnectionOLEDBString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];

        [HttpGet]
        [Route("api/Appraise/action/Getdiscuz/{fid}/{topNum}")]
        // GET: api/Discuz
        public IEnumerable<Discuz> Get(string fid,string topNum)
        {
            List<Discuz> returnVal = new List<Discuz>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select m.fid,m.name,t.subject,t.tid,FROM_UNIXTIME(t.dateline, '%Y-%m-%d') as dateline from pre_forum_forum m inner join pre_forum_thread t on m.fid=t.fid where t.displayorder=0 and m.fid=" + fid;
                if (topNum != "0")
                {
                    comm.CommandText += " limit "+topNum;
                }
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable classTable = new DataTable();
                oda.Fill(classTable);
                returnVal = UtilDataTableToList<Discuz>.ConvertToList(classTable);
            }
            return returnVal;
        }

        [HttpGet]
        [Route("api/Appraise/action/SyncDiscuz")]
        public void SyncDiscuz()
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionOLEDBString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                try
                {
                    string onecard = string.Empty;
                    string password = string.Empty;
                    string email = string.Empty;
                    string log = string.Empty;
                    comm.CommandText = "select onecard,password from sub_file_relation where Finfo_id IN(select INFO_ID from jw_bcgl where to_CHAR(sysdate,'YYYY-MM-DD') = to_CHAR(pxsj,'YYYY-MM-DD'))";
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        if (odr.Read())
                        {
                            onecard = odr["onecard"].ToString();
                            password = odr["password"].ToString();
                            log = onecard;
                            if (onecard != "" && password != "")
                            {
                                email = onecard + "@qq.com";
                                //RTN_UserLogin rtnUserLogin = Func.uc_user_login(txtUserName.Text, txtPwd.Text);
                                // int ir =Func.uc_user_register(onecard, password, email);
                                InsertMembers(onecard, password, email);
                                //if (ir == -1)
                                //    log += "(用户名不合法)";
                                //else if (ir == -2)
                                //    log += "(包含不允许注册的词语)";
                                //else if (ir == -3)
                                //    log += "(用户名已经存在)";
                                //else if (ir == -4)
                                //    log += "(Email 格式有误)";
                                //else if (ir == -5)
                                //    log += "(Email 不允许注册)";
                                //else if (ir == -6)
                                //    log += "(该 Email 已经被注册)";
                                //Log(log);
                            }
                        }
                    }

                }
                catch (Exception e)
                {
                    conn.Close();
                    Log(e.ToString());
                }

            }
        }

        public void InsertMembers(string username,string password,string email)
        {
            string md5string, saltstring="";
            md5string = password;
            // 生成salt
            Random rd = new Random();
            string str = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (int i = 0; i < 6; i++)
            {
                saltstring += str[rd.Next(str.Length)];
            }
            string result = GetDiscuzPWString(md5string, saltstring);

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
                    comm.CommandText = "select count(*) as hasUser from pre_ucenter_members where username='" + username + "'";
                    if (int.Parse(comm.ExecuteScalar().ToString()) > 0)
                    {
                        Log(username+":此帐号已存在！");
                    }
                    else
                    {
                        comm.CommandText = @"insert into pre_ucenter_members (username,password,email,regip,regdate,salt,lastloginip,lastlogintime)
values('" + username + "','" + result + "','" + email + "','unknown','1481545473','" + saltstring + "',0,0)";
                        comm.ExecuteNonQuery();

                        comm.CommandText = @"select uid from pre_ucenter_members where username='" + username + "'";
                        string uid= comm.ExecuteScalar().ToString();

                        comm.CommandText = @"insert into pre_common_member (uid,username,password,email,groupid,regdate,credits,timeoffset)
values('"+uid+"','" + username + "','" + result + "','" + email + "','10','1481545473','2','9999')";
                        comm.ExecuteNonQuery();

                        comm.CommandText = @"insert into pre_common_member_profile (uid) values ('" + uid + "')";
                        comm.ExecuteNonQuery();

                        comm.CommandText = @"insert into pre_common_member_count (uid) values ('" + uid + "')";
                        comm.ExecuteNonQuery();
                    }
                    tran.Commit();
                }
                catch (Exception e)
                {
                    tran.Rollback();
                }

            }
        }

        static string GetDiscuzPWString(string sourceStr, string salt)
        {
            return GetMd5Hash(string.Concat(GetMd5Hash(sourceStr), salt));
        }
        static string GetMd5Hash(string input)
        {
            MD5 md5Hasher = MD5.Create();
            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

        public static void Log(string error)
        {
            try
            {
                if (!Directory.Exists(MapPath("~/log")))
                {
                    Directory.CreateDirectory(MapPath("~/log"));
                }

                string filename = MapPath("~/log/error" + DateTime.Now.ToString("yyyyMMdd") + "_tb.log");
                System.IO.TextWriter f = new System.IO.StreamWriter(filename, true, System.Text.ASCIIEncoding.Default);
                f = TextWriter.Synchronized(f); //多线程化
                f.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + "test" + " " + "" + " " + error);
                f.Close();
            }
            catch { return; }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string MapPath(string url)
        {
            string s = url;
            try
            {
                s = System.Web.HttpContext.Current.Server.MapPath(url);
            }
            catch { }
            return s;
        }

        // GET: api/Discuz/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Discuz
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Discuz/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Discuz/5
        public void Delete(int id)
        {
        }
    }
}
