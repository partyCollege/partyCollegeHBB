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
using Senparc.Weixin.QY.Entities;
using MySql.Data.MySqlClient;
using Senparc.Weixin.Entities;
using System.Data;
using Senparc.Weixin.QY.Helpers;
using System.Web;
using System.IO;
using System.Drawing;
using Newtonsoft.Json.Linq;
using Senparc.Weixin.QY.Containers;

namespace CollegeAPP.Controllers.wxController
{
    public class uploadResult
    {
        public string message { set; get; }
        public bool result { set; get; }
        public string fileFullPath { set; get; }

        public string fileName { set; get; }

    }
    public class uploadPicController : ApiController
    {
        public string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
        public string connectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
        // GET: api/chart
        [HttpGet]
        [Route("api/uploadPic/{mediaId}/{userid}")]
        public dynamic Get(string mediaId, string userid)
        {
            string token = AccessTokenContainer.TryGetToken(corpId, _corpSecret);
            using (MemoryStream ms = new MemoryStream())
            {
                MediaApi.Get(token, mediaId, ms);
                //System.Drawing.Image img= System.Drawing.Image.FromStream(ms);
                //System.Drawing.Image img1 = System.Drawing.Image.FromStream(context.Request.InputStream);
                string path = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + @"\formImg\";
                System.Drawing.Image img1 = System.Drawing.Image.FromStream(ms);
                string guid = Guid.NewGuid().ToString();
                string fileFullPath = guid + ".png";
                img1.Save(path + fileFullPath, System.Drawing.Imaging.ImageFormat.Png);
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    conn.Open();
                    MySqlCommand comm = conn.CreateCommand();
                    comm.CommandText = "select count(*) as hasAvatar from CHATAVATAR where userid=" + userid;
                    int x = Convert.ToInt32(comm.ExecuteScalar());
                    if (x > 0)
                    {
                        comm.CommandText = "update chatAvatar set AVATARPATH='" + fileFullPath + "' where userid=" + userid;
                        comm.ExecuteNonQuery();
                    }
                    else
                    {
                        comm.CommandText = "insert into chatAvatar (id,userid,AVATARPATH) values (:guid,:userid,:avatarpath)";
                        comm.Parameters.Add(new MySqlParameter("guid", Guid.NewGuid().ToString()));
                        comm.Parameters.Add(new MySqlParameter("userid", userid));
                        comm.Parameters.Add(new MySqlParameter("avatarpath", fileFullPath));
                    }

                }
                //picture.MakeThumbnail(path + fileFullPath, path + fileFullPath.Replace("_orgin", ""), 200, 200, "W", "JPG");
                //JObject job = new JObject(new { message = "上传成功", result = true, fileFullPath = fileFullPath.Replace("_orgin", "") });
                //dynamic dm= new { message = "上传成功", result = true, fileFullPath = fileFullPath.Replace("_orgin", "") };
                uploadResult result = new uploadResult();
                result.message = "上传成功";
                result.result = true;
                result.fileName = fileFullPath;
                return result;
            }



        }

        // GET: api/chart/5
        public string Get(int id)
        {
            return "value";
        }
        // PUT: api/chart/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/chart/5
        public void Delete(int id)
        {
        }
    }
}
