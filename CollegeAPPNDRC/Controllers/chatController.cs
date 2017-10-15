using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;

namespace CollegeAPP.Controllers
{
    public class chatController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/chat
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/chat/5
        public string Get(int id)
        {
            return "value";
        }
        [HttpPost]
        [Route("api/chat/getUserInfo")]
        public dynamic getUserInfo([FromBody] JObject json)
        {
            Object obj = new Object();
            string userid = json.GetValue("userid").ToString();
            string usertype = json.GetValue("usertype").ToString();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select g.mobile_email as sjhm,g.uname as bt,avatarpath  from g_users g left join chatavatar avatar on g.id=avatar.userid where id=:id";
                if (usertype == "student")
                {
                    comm.CommandText = "select xy.*,g.bt,g.id,avatarpath from jw_xyxx xy inner join g_infos g on xy.info_id=g.id left join chatavatar avatar on g.id=avatar.userid  where g.id=:id";
                }
                comm.Parameters.Add(new MySqlParameter("id", userid));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        obj = new { name = odr["bt"].ToString(), sjhm = odr["sjhm"].ToString(), avatar = odr["avatarpath"].ToString() };
                    }
                }
            }
            return obj;
        }

        [HttpPost]
        [Route("api/chat/createNormalChat")]
        public void createNormalChat([FromBody] JObject json)
        {
            JToken postData = json.GetValue("users");
            string chatName = string.Empty;
            //string chatName = postData[0]["username"].ToString() + "、" + postData[1]["username"].ToString();
            //if (postData.ToList().Count > 2)
            //{
            //    chatName += "、" + postData[2]["username"].ToString();
            //}
            List<string> chatname = new List<string>();
            foreach (var c in postData)
            {
                if (chatname.Count <= 3 && !string.IsNullOrEmpty(c["username"].ToString()))
                {
                    chatname.Add(c["username"].ToString());
                }
            }
            chatName = String.Join("、", chatname.ToArray());
            //for (int i = 0; i< (int)postData.Count; i++)
            //{

            //}
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlTransaction tran = conn.BeginTransaction();
                MySqlCommand comm = conn.CreateCommand();
                comm.Transaction = tran;
                try
                {
                    string guid = Guid.NewGuid().ToString();
                    comm.CommandText = "insert into app_chat_group (id,name,adminid) values (:id,:name,:adminid)";
                    comm.Parameters.Add(new MySqlParameter("id", guid));
                    comm.Parameters.Add(new MySqlParameter("name", chatName));
                    comm.Parameters.Add(new MySqlParameter("adminid", json.GetValue("creater")));
                    comm.ExecuteNonQuery();

                    foreach (var c in postData)
                    {
                        comm.Parameters.Clear();
                        comm.CommandText = "insert into APP_CHAT_GROUPUSER (id,userid,groupid,name,usertype) values (:id,:userid,:groupid,:name,:usertype)";
                        comm.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
                        comm.Parameters.Add(new MySqlParameter("userid", c["userid"].ToString()));
                        comm.Parameters.Add(new MySqlParameter("groupid", guid));
                        comm.Parameters.Add(new MySqlParameter("name", c["username"].ToString()));
                        comm.Parameters.Add(new MySqlParameter("usertype", c["usertype"].ToString()));
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
        // POST: api/chat
        public void Post([FromBody]JObject json)
        {
            var bcid = json.GetValue("bcid");
            var userid = json.GetValue("userid");
            var username = json.GetValue("username");
            var usertype = json.GetValue("usertype");
            string bcname = string.Empty;
            List<object> userList = new List<object>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlTransaction tran = conn.BeginTransaction();
                MySqlCommand comm = conn.CreateCommand();
                comm.Transaction = tran;
                try
                {
                    comm.CommandText = "select count(*) from app_chat_group where bcid=" + bcid;
                    int x=Convert.ToInt32(comm.ExecuteScalar());
                    if (x > 0) {
                        comm.CommandText = "select count(*) from app_chat_groupuser where groupid =(select id from app_chat_group where bcid=" + bcid + ") and userid='"+userid+"'";
                        int y=Convert.ToInt32(comm.ExecuteScalar());
                        if (y == 0)
                        {
                            comm.CommandText = "select id from app_chat_group where bcid=" + bcid;
                            string groupid=comm.ExecuteScalar().ToString();

                            comm.Parameters.Clear();
                            comm.CommandText = "insert into APP_CHAT_GROUPUSER (id,userid,groupid,name,usertype) values (:id,:userid,:groupid,:name,:usertype)";
                            comm.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
                            comm.Parameters.Add(new MySqlParameter("userid", userid));
                            comm.Parameters.Add(new MySqlParameter("groupid", groupid));
                            comm.Parameters.Add(new MySqlParameter("name", username));
                            comm.Parameters.Add(new MySqlParameter("usertype", usertype));
                            comm.ExecuteNonQuery();
                        }
                        tran.Commit();
                        return; 
                    }

                    comm.CommandText = @"select g.bt, xy.info_id
                                                          from sub_file_relation re
                                                         inner join jw_xyxx xy
                                                            on re.info_id = xy.info_id
                                                         inner join g_infos g
                                                            on g.id = xy.info_id
                                                         where re.finfo_id =:bcid";
                    comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        while (odr.Read())
                        {
                            userList.Add(new { name = odr["bt"].ToString(), id = odr["info_id"].ToString(), usertype = "student" });
                        }
                    }

                    comm.CommandText = "select bzr,bzr_uid,g.bt from jw_bcgl bc inner join g_infos g on bc.info_id=g.id where info_id=:bcid";
                    string[] bzr_uid = { };
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        if (odr.Read())
                        {
                            string[] bzr = odr["bzr"].ToString().Split('、');
                            bzr_uid = odr["bzr_uid"].ToString().Split(',');
                            bcname = odr["bt"].ToString();
                            for (var c = 0; c < bzr.Length; c++)
                            {
                                userList.Add(new { name = bzr[c], id = bzr_uid[c], usertype = "teacher" });
                            }
                        }
                    }
                    comm.Parameters.Clear();

                    comm.CommandText = "insert into app_chat_group (id,name,category,bcid,adminid) values (:id,:name,:category,:bcid,:adminid)";
                    string guid = Guid.NewGuid().ToString();
                    comm.Parameters.Add(new MySqlParameter("id", guid));
                    comm.Parameters.Add(new MySqlParameter("name", bcname));
                    comm.Parameters.Add(new MySqlParameter("category", 2));
                    comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                    comm.Parameters.Add(new MySqlParameter("adminid", bzr_uid[0]));
                    comm.ExecuteNonQuery();

                    foreach (var row in userList)
                    {
                        dynamic dm = row;
                        comm.Parameters.Clear();
                        comm.CommandText = "insert into APP_CHAT_GROUPUSER (id,userid,groupid,name,usertype) values (:id,:userid,:groupid,:name,:usertype)";
                        comm.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
                        comm.Parameters.Add(new MySqlParameter("userid", dm.id));
                        comm.Parameters.Add(new MySqlParameter("groupid", guid));
                        comm.Parameters.Add(new MySqlParameter("name", dm.name));
                        comm.Parameters.Add(new MySqlParameter("usertype", dm.usertype));
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

        // PUT: api/chat/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/chat/5
        public void Delete(int id)
        {
        }
    }
}
