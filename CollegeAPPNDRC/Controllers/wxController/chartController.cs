using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Senparc.Weixin.QY;
using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.AdvancedAPIs.Chat;
using MySql.Data.MySqlClient;
using Senparc.Weixin.Entities;
using System.Data;
using Senparc.Weixin.QY.Containers;

namespace CollegeAPP.Controllers.wxController
{
    public class chartController : ApiController
    {
        public string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
        public string connectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
        // GET: api/chart
        public string Get()
        {
            string token = AccessTokenContainer.GetToken(corpId,_corpSecret);
            MailListApi.CreateDepartment(token, "教师", 1, 1, 11);
            MailListApi.CreateDepartment(token, "学员", 1, 2, 22);
            return token;
            //  ChatApi.SendChatMessage(token,"")
        }

        // GET: api/chart/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/chart
        public string Post([FromBody]string value)
        {


            string token = AccessTokenContainer.GetToken(corpId,_corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                //查询当前正在开班或者10天内将要开班的班次
                comm.CommandText = @"select bc.pxsj, bc.pxsj_js, g.bt, g.id
                                      from jw_bcgl bc
                                     inner join g_infos g
                                        on bc.info_id = g.id
                                     where g.deleted > -1
                                       and sysdate <= bc.pxsj_js + 1
                                       and sysdate >= bc.pxsj - 10";
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable bcTable = new DataTable();
                oda.Fill(bcTable);
                foreach (DataRow dr in bcTable.Rows)
                {
                    string bcname = dr["bt"].ToString();
                    string bcid = dr["id"].ToString();
                    comm.CommandText = @"select g.bt,bc.*  from jw_bcgl bc
                                                        inner join g_infos g
                                                        on bc.info_id=g.id where g.id=" + bcid;
                    if (bcname.Length >= 32)
                    {
                        bcname = bcname.Substring(0, 31);
                    }
                    try
                    {
                        //22为学员这个部门ID
                        CreateDepartmentResult re = MailListApi.CreateDepartment(token, bcname, 22, Convert.ToInt32(bcid), Convert.ToInt32(bcid));
                        //deptid = re.id.ToString();
                    }
                    catch (Exception e)
                    {

                    }
                    comm.CommandText = @"select g.bt,xy.sjhm,g.id from sub_file_relation re
                                                        inner join jw_xyxx xy
                                                        on xy.info_id=re.info_id
                                                        inner join g_infos g
                                                        on g.id=xy.info_id
                                                        where re.finfo_id=" + bcid + " and xy.sjhm is not null and g.deleted>-1    and length( xy.sjhm )= 11";
                    GetDepartmentMemberResult memResult = new GetDepartmentMemberResult();
                    try
                    {
                        memResult = MailListApi.GetDepartmentMember(token, Convert.ToInt32(bcid), 1, 0);
                    }
                    catch (Exception e)
                    { }
                    List<dynamic> userList = new List<dynamic>();

                    List<int> dept = new List<int>();
                    dept.Add(Convert.ToInt32(bcid));
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        while (odr.Read())
                        {
                            userList.Add(new { name = odr["bt"].ToString(), id = odr["id"].ToString(), sjhm = odr["sjhm"].ToString(), type = "student" });

                        }
                    }
                    //查询班主任
                    comm.CommandText = @"select u.uname,u.mobile_email,u.id from jw_bbxx bx
                                                        inner join jw_bcgl bc
                                                        on bx.bcinfo_id=bc.info_id
                                                        inner join g_users u
                                                        on u.id=bx.user_id
                                                        where bc.info_id=" + bcid + " and u.mobile_email is not null";
                    List<dynamic> chatforAdd = new List<dynamic>();
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        while (odr.Read())
                        {
                            userList.Add(new { name = odr["uname"].ToString(), id = odr["id"].ToString(), sjhm = odr["mobile_email"].ToString(), type = "teacher" });
                        }
                    }

                    //查询随班领导
                    comm.CommandText = @"select u.uname,u.mobile_email,u.id from g_users u
where (select sbld_uid from jw_bcgl where info_id=" + bcid + ") like '%'||u.id||'%' and u.mobile_email is not null";
                    using (MySqlDataReader odr = comm.ExecuteReader())
                    {
                        while (odr.Read())
                        {
                            userList.Add(new { name = odr["uname"].ToString(), id = odr["id"].ToString(), sjhm = odr["mobile_email"].ToString(), type = "teacher" });
                        }
                    }

                    foreach (var c in userList)
                    {
                        if (c.type == "teacher")
                        {
                            continue;
                        }
                        UserList_Simple sim = memResult.userlist.Find(delegate(UserList_Simple d)
                        {
                            return d.userid == c.id;
                        });
                        //判断有无该学员
                        string nowSJHM = c.sjhm;
                        if (sim != null)
                        {
                            try
                            {
                                MailListApi.UpdateMember(token, c.id, c.name, dept.ToArray(), null, c.sjhm);
                            }
                            catch (Exception e)
                            {
                                continue;
                            }
                        }
                        else
                        {
                            try
                            {
                                QyJsonResult result = MailListApi.CreateMember(token, c.id, c.name, dept.ToArray(), null, c.sjhm);
                            }
                            catch (Exception e)
                            {
                                continue;
                            }

                        }
                    }
                    List<string> forDeleteUser = new List<string>();
                    //删除已被OA删除的学员
                    foreach (var c in memResult.userlist)
                    {
                        bool hasuser = false;
                        foreach (var d in userList)
                        {
                            if (c.userid == d.id)
                            {
                                hasuser = true;
                            }
                        }
                        if (!hasuser)
                        {
                            forDeleteUser.Add(c.userid);
                        }
                    }
                    foreach (var deleteuser in forDeleteUser)
                    {
                        MailListApi.DeleteMember(token, deleteuser);
                    }
                    if (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["needweixinchat"]))
                    {
                        if(Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["needweixinchat"]))
                        createChart(token, userList, bcid, bcname);
                    }

                }
            }
            return token;
        }
        private void createChart(string token, List<dynamic> userlist, string bcid, string bcname)
        {
            string teacherid = string.Empty;
            List<string> userList = new List<string>();
            foreach (var c in userlist)
            {
                //学员已经在学员关注公众号时自动加入班级内聊天组
                if (c.type == "student")
                {
                    continue;
                }
                if (c.type == "teacher")
                {
                    teacherid = c.id;
                }
                userList.Add(c.id);
            }
            GetDepartmentMemberResult admin = MailListApi.GetDepartmentMember(token, 1, 1, 0);
            GetDepartmentMemberResult result = MailListApi.GetDepartmentMember(token, 22, 1, 0);
            GetDepartmentMemberResult result2 = MailListApi.GetDepartmentMember(token, 11, 1, 0);
            List<dynamic> alluser = new List<dynamic>();
            foreach (var c in result.userlist)
            {
                alluser.Add(c.userid);
            }
            foreach (var c in result2.userlist)
            {
                alluser.Add(c.userid);
            }
            int x = 0;
            foreach (var c in userList)
            {
                bool hasUser = false;
                foreach (var d in alluser)
                {
                    if (c == d)
                    {
                        hasUser = true;
                    }
                }
                if (!hasUser)
                {
                    string id = c;
                    x++;
                }
            }
            string users = System.Configuration.ConfigurationManager.AppSettings["addUser"];
            foreach (var c in users.Split(','))
            {
                userList.Add(c);
            }
            List<string> forAdd = new List<string>();
            List<string> forDelete = new List<string>();
            try
            {
                GetChatResult getChatResult = ChatApi.GetChat(token, bcid);

                foreach (var d in userList)
                {
                    bool hasUserNowChat = false;
                    foreach (string c in getChatResult.chat_info.userlist)
                    {
                        if (c == d)
                        {
                            hasUserNowChat = true;
                        }
                    }
                    if (!hasUserNowChat)
                    {
                        forAdd.Add(d);
                    }
                }
                foreach (string c in getChatResult.chat_info.userlist)
                {
                    bool hasUserNowChat = false;
                    foreach (var d in userList)
                    {
                        if (c == d)
                        {
                            hasUserNowChat = true;
                        }
                    }
                    if (!hasUserNowChat)
                    {
                        forDelete.Add(c);
                    }
                }
            }
            catch (Exception e)
            {

            }

            try
            {
                ChatApi.CreateChat(token, bcid, bcname, teacherid, userList.ToArray());

            }
            catch (Exception e)
            {
                try
                {
                    //ChatApi.UpdateChat(token, bcid, teacherid, bcname, teacherid, forAdd.ToArray(), forDelete.ToArray());
                }
                catch (Exception ex)
                {
                }

            }
            InsertChat(bcid);
        }
        // PUT: api/chart/5
        public void Put(int id, [FromBody]string value)
        {
        }
        private void InsertChat(string bcid)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select count(*) from APP_LOG_CHAT where classid=" + bcid;
                object obj = comm.ExecuteScalar();
                if (Convert.ToInt32(obj) == 0)
                {
                    comm.CommandText = "insert into APP_LOG_CHAT (id,classid,createtime) values (:id,:classid,:createtime)";
                    comm.Parameters.Add(new MySqlParameter("id", Guid.NewGuid().ToString()));
                    comm.Parameters.Add(new MySqlParameter("classid", bcid));
                    comm.Parameters.Add(new MySqlParameter("createtime", DateTime.Now));
                    comm.ExecuteNonQuery();
                }
            }
        }

        [HttpGet]
        [Route("api/chart/action/addStudentToChat/{bcid}/{studentid}")]
        public dynamic addStudentToChat(string bcid, string studentid)
        {
            string corpid = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
            try
            {
                string accessToken = AccessTokenContainer.GetToken(corpid,_corpSecret);
                GetChatResult chatResult = ChatApi.GetChat(accessToken, bcid);
                string adminId = chatResult.chat_info.owner;
                List<string> addUser = new List<string>();
                addUser.Add(studentid);
                if (chatResult.chat_info.userlist.IndexOf(studentid) == -1)
                {
                    ChatApi.UpdateChat(accessToken, bcid, chatResult.chat_info.owner, chatResult.chat_info.name, chatResult.chat_info.owner, addUser.ToArray());
                }
                return new { res = "success" };
            }
            catch (Exception e)
            {
                return new { res = "error" };
            }

        }
        // DELETE: api/chart/5
        public void Delete(int id)
        {
        }
    }
}
