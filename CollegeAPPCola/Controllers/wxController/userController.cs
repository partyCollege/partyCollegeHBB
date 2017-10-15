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
using MySql.Data.MySqlClient;
using Senparc.Weixin.Entities;
using System.Data;
using Senparc.Weixin.QY.Containers;

namespace CollegeAPP.Controllers.wxController
{
    public class userController : ApiController
    {
        public string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
        public string connectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
        // GET: api/user
        public string Get()
        {
            string token = AccessTokenContainer.GetToken(corpId,_corpSecret);
            MailListApi.CreateDepartment(token, "教师", 1, 1, 11);
            MailListApi.CreateDepartment(token, "学员", 1, 2, 22);
            return token;
            //  ChatApi.SendChatMessage(token,"")
        }

        // GET: api/user/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/user
        public string Post([FromBody]string value)
        {
            DataTable dt = new DataTable();
            string token = AccessTokenContainer.GetToken(corpId,_corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select uname,utype,id,u.mobile_email from g_users u where status>-1 and utype in (0,9) and u.mobile_email is not null";
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);

                oda.Fill(dt);

            }
            foreach (DataRow dr in dt.Rows)
            {
                string uid = dr["id"].ToString();
                List<int> depts = new List<int>();
                depts.Add(11);
                try
                {
                    MailListApi.CreateMember(token, dr["id"].ToString(), dr["uname"].ToString(), depts.ToArray(), null, dr["mobile_email"].ToString());

                }
                catch (Exception e)
                {
                    try
                    {
                        MailListApi.UpdateMember(token, dr["id"].ToString(), dr["uname"].ToString(), depts.ToArray(), null, dr["mobile_email"].ToString());

                    }
                    catch (Exception e1)
                    {
                        continue;
                    }
                }
            }
            return token;
        }
        private void createChart(string token,List<dynamic> userlist, string bcid, string bcname)
        {
          //ChatApi.CreateChat(token,bcid,bcname,)
        }
        // PUT: api/user/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/user/5
        public void Delete(int id)
        {
        }
    }
}
