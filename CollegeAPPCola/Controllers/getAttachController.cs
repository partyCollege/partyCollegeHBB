using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class getAttachController : ApiController
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        [HttpGet]
        [Route("api/getAttach/action/getAttach/{path}")]
        public HttpResponseMessage Get(string path)
        {
            Encoding ec=System.Text.UTF8Encoding.UTF8;
           
            path = ec.GetString(Convert.FromBase64String(path));
            string rootPath = System.Configuration.ConfigurationManager.AppSettings["remoteAttach"];
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(rootPath+path);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
             HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();

            WebResponse we= myRequest.GetResponse();
            Stream rs = hres.GetResponseStream();
            //StreamReader sr = new StreamReader(rs);
            //string ddd= sr.ReadToEnd();
            result.Content = new StreamContent(rs);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition.FileName =path.Substring(path.LastIndexOf(@"\")+1);
            //result.Content.Headers.ContentLength = new FileInfo(@"E:\笔记本程序\webAPP\浙江省委党校\ZJDX2010\ZJDX_TFS_NEW\党校项目\OA\CollegeAPP\CollegeAPP\Html\123.docx").Length;

            return result;
        }

        [HttpGet]
        [Route("api/getAttach/action/getContent/{key}/{path}")]
        public HttpResponseMessage Get(string key,string path)
        {
            Encoding ec = System.Text.UTF8Encoding.UTF8;

            path = ec.GetString(Convert.FromBase64String(path));
            string rootPath = System.Configuration.ConfigurationManager.AppSettings[key];
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(rootPath + path);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();

            WebResponse we = myRequest.GetResponse();
            Stream rs = hres.GetResponseStream();
            //StreamReader sr = new StreamReader(rs);
            //string ddd= sr.ReadToEnd();
            result.Content = new StreamContent(rs);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition.FileName = path.Substring(path.LastIndexOf(@"\") + 1);
            //result.Content.Headers.ContentLength = new FileInfo(@"E:\笔记本程序\webAPP\浙江省委党校\ZJDX2010\ZJDX_TFS_NEW\党校项目\OA\CollegeAPP\CollegeAPP\Html\123.docx").Length;

            return result;
        }

        [HttpGet]
        [Route("api/getAttach/action/getAttach/xy/{path}")]
        public HttpResponseMessage getXYAttach(string path)
        {
            Encoding ec = System.Text.UTF8Encoding.UTF8;

            path = ec.GetString(Convert.FromBase64String(path));
            var obj= Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(path);
            var fullPath= GetDownLoadUrl(obj.type.ToString(), obj.id.ToString());
            string rootPath = System.Configuration.ConfigurationManager.AppSettings["remoteXYAttach"];
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(fullPath);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();

            WebResponse we = myRequest.GetResponse();
            Stream rs = hres.GetResponseStream();
            //StreamReader sr = new StreamReader(rs);
            //string ddd= sr.ReadToEnd();
            result.Content = new StreamContent(rs);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition.FileName = Guid.NewGuid().ToString() + fullPath.Substring(fullPath.LastIndexOf("."));
            //result.Content.Headers.ContentLength = new FileInfo(@"E:\笔记本程序\webAPP\浙江省委党校\ZJDX2010\ZJDX_TFS_NEW\党校项目\OA\CollegeAPP\CollegeAPP\Html\123.docx").Length;

            return result;
        }

        [HttpGet]
        [Route("api/getAttach/action/getAttach/xyPhoto/{id}")]
        public HttpResponseMessage getXYPhotoAttach(string id)
        {
            DataTable tbl = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                string sql = String.Concat("select g.id,g.bt,xy.szdw,xy.zw, xy.sjhm,   xy.zppath from jw_xyxx xy inner join g_infos g  on g.id = xy.info_id   and g.deleted <> -1 where g.id= ", id);
                MySqlDataAdapter da = new MySqlDataAdapter(sql, conn);
                da.Fill(tbl);
            }
            if (tbl.Rows.Count > 0)
            {
                Encoding ec = System.Text.UTF8Encoding.UTF8;

                string fullPath = System.Configuration.ConfigurationManager.AppSettings["remoteXYPhoto"] + tbl.Rows[0]["zppath"].ToString();
                HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(fullPath);
                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();

                WebResponse we = myRequest.GetResponse();
                Stream rs = hres.GetResponseStream();
                result.Content = new StreamContent(rs);
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.ContentDisposition.FileName = Guid.NewGuid().ToString() + fullPath.Substring(fullPath.LastIndexOf("."));

                return result;
            }
            else
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/getAttach/action/getAttach/userPhoto/{id}")]
        public HttpResponseMessage getUserPhotoAttach(string id)
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
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
                            Encoding ec = System.Text.UTF8Encoding.UTF8;

                            string fullPath = System.Configuration.ConfigurationManager.AppSettings["remoteUserPhoto"] + odr["zppath"];
                            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(fullPath);
                            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                            HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();

                            WebResponse we = myRequest.GetResponse();
                            Stream rs = hres.GetResponseStream();
                            result.Content = new StreamContent(rs);
                            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                            result.Content.Headers.ContentDisposition.FileName = Guid.NewGuid().ToString() + fullPath.Substring(fullPath.LastIndexOf("."));
                            return result;
                        }
                    }
                }
            }
            return null;
        }

        // GET: api/getAttach/5
        public string Get(int id)
        {
            return "value";
        }
        // PUT: api/getAttach/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/getAttach/5
        public void Delete(int id)
        {
        }

        public static string GetDownLoadUrl(string type, string userid)
        {
            string fullpath = string.Empty;
            if (!string.IsNullOrEmpty(userid))
            {
                DataTable tbl = new DataTable();
                string FileType = string.Empty;
                string sql = string.Empty;
                if (type == "share" || type == "recommend" || type == "material" || type == "freebsd" || type == "bcgg" || type == "bring" || type == "corpus" || type == "studies" || type == "albums")
                {
                    using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                    {
                        if (conn.State == ConnectionState.Closed)
                            conn.Open();
                        if (type.Equals("share", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "班级共享";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_SHAREDFILES WHERE JW_SHAREDFILES.ID = ", userid);

                        }
                        if (type.Equals("recommend", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "推荐资料";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_RECOMMENDFILES WHERE JW_RECOMMENDFILES.ID = ", userid);

                        }
                        if (type.Equals("studies", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "学习心得";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_STUDIES WHERE JW_STUDIES.ID = ", userid);

                        }
                        else if (type.Equals("material", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "教学资料";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_MATERIAL WHERE JW_MATERIAL.ID = ", userid);

                        }
                        else if (type.Equals("freebsd", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "学员小结";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_FREEBSD WHERE JW_FREEBSD.ID = ", userid);

                        }
                        else if (type.Equals("bring", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "两带来材料";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_BRINGFILES WHERE JW_BRINGFILES.ID = ", userid);

                        }
                        else if (type.Equals("corpus", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "学员文集";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM JW_CORPUSFILES WHERE JW_CORPUSFILES.ID = ", userid);

                        }
                        else if (type.Equals("albums", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "相册";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM jw_albums WHERE jw_albums.ID = ", userid);

                        }
                        else if (type.Equals("bcgg", StringComparison.OrdinalIgnoreCase))
                        {
                            FileType = "班级公告附件";
                            sql = String.Concat("SELECT FILENAME,CLASSID FROM jw_bcggfiles bf WHERE bf.ID = ", userid);

                        }
                        MySqlDataAdapter da = new MySqlDataAdapter(sql, conn);
                        da.Fill(tbl);
                    }
                    if (tbl.Rows.Count > 0)
                    {
                        //下载本地文件
                        //string UpPath = System.Configuration.ConfigurationManager.AppSettings["UploadPathSite"].ToString();
                        string UpPath = System.Configuration.ConfigurationManager.AppSettings["remoteXYAttach"].ToString();
                        fullpath = UpPath + @"/" + FileType + @"/" + userid + "." + tbl.Rows[0]["FILENAME"].ToString().Substring(tbl.Rows[0]["FILENAME"].ToString().LastIndexOf(".") + 1);
                        //fullpath = UpPath + @"\" + FileType + @"\" + tbl.Rows[0]["FILENAME"].ToString();
                    }
                }
                else if (type == "template")//学员登记表
                {

                    //fullpath=SetStudentSummarize(userid, bcid);
                }
            }
            return fullpath;
        }
    }
}
