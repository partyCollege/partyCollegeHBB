using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace PartyCollegeUtil.Service.uploadFile
{
    public class uploadfileService
    {
        public HttpResponseMessage Get(string category, string fileServername, string filename)
        {
            JObject jobject = getConfig.getAppConfig();
            Encoding ec = System.Text.UTF8Encoding.UTF8;

            fileServername = ec.GetString(Convert.FromBase64String(fileServername.Replace('_', '+')));
            filename = ec.GetString(Convert.FromBase64String(filename.Replace('_', '+')));
			filename = HttpUtility.UrlDecode(filename,Encoding.UTF8);
			filename=HttpUtility.UrlEncode(filename, Encoding.UTF8);
            string httpRoot = jobject["fileServer"]["rootPath"].ToString() + "/";
            string filesDic = httpRoot + jobject["fileServer"][category].ToString();
            if (fileServername.IndexOf('/') > 0) 
            {
                filesDic = httpRoot;
            }
            string filepath = filesDic + "/" + fileServername;
            //string rootPath = System.Configuration.ConfigurationManager.AppSettings["remoteAttach"];
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(filepath);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            //吞掉文件不存在异常
            try
            {
                HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();
                WebResponse we = myRequest.GetResponse();
                Stream rs = hres.GetResponseStream();
                //StreamReader sr = new StreamReader(rs);
                //string ddd= sr.ReadToEnd();
                result.Content = new StreamContent(rs);
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.ContentDisposition.FileName = filename;
            }
            catch (Exception ex)
            {
                ErrLog.Log("File Error :" + ex.Message);

            }
            //result.Content.Headers.ContentLength = new FileInfo(@"E:\笔记本程序\webAPP\浙江省委党校\ZJDX2010\ZJDX_TFS_NEW\党校项目\OA\CollegeAPP\CollegeAPP\Html\123.docx").Length;
            return result;
        }
        /// <summary>
        /// 内部Http上传方法
        /// </summary>
        /// <param name="url"></param>
        /// <param name="postFile"></param>
        /// <param name="fileFormName"></param>
        /// <param name="contenttype"></param>
        /// <param name="querystring"></param>
        /// <param name="cookies"></param>
        /// <returns></returns>
        public static string UploadFileEx(string url, Stream fileStream, string fileFormName, string contenttype, NameValueCollection querystring, CookieContainer cookies)
        {
            if ((fileFormName == null) ||
              (fileFormName.Length == 0))
            {
                fileFormName = "file";
            }

            if ((contenttype == null) ||
              (contenttype.Length == 0))
            {
                contenttype = "application/octet-stream";
            }
            string postdata;
            postdata = "?";
            if (querystring != null)
            {
                foreach (string key in querystring.Keys)
                {
                    postdata += key + "=" + querystring.Get(key) + "&";
                }
            }
            Uri uri = new Uri(url + postdata);

            string boundary = "----------" + DateTime.Now.Ticks.ToString("x");
            HttpWebRequest webrequest = (HttpWebRequest)WebRequest.Create(uri);
            webrequest.CookieContainer = cookies;
            webrequest.ContentType = "multipart/form-data; boundary=" + boundary;
            webrequest.Method = "POST";
            webrequest.Timeout = 5 * 60 * 1000;

            // Build up the post message header  
            StringBuilder sb = new StringBuilder();
            sb.Append("--");
            sb.Append(boundary);
            sb.Append("");
            sb.Append("Content-Disposition: form-data; name=\"");
            sb.Append(fileFormName);
            sb.Append("\"; filename=\"");
            sb.Append(querystring["filename"] + "." + querystring["extension"]);
            sb.Append("\"");
            sb.Append("");
            sb.Append("Content-Type: ");
            sb.Append(contenttype);
            sb.Append("");
            sb.Append("");

            string postHeader = sb.ToString();
            byte[] postHeaderBytes = Encoding.UTF8.GetBytes(postHeader);

            // Build the trailing boundary string as a byte array  
            // ensuring the boundary appears on a line by itself  
            byte[] boundaryBytes =
                Encoding.ASCII.GetBytes("--" + boundary + "");


            long length = fileStream.Length;

            webrequest.ContentLength = length;

            Stream requestStream = webrequest.GetRequestStream();

            // Write out our post header  
            //requestStream.Write(postHeaderBytes, 0, postHeaderBytes.Length);

            // Write out the file contents  
            byte[] buffer = new Byte[checked((uint)Math.Min(4096,
                         (int)fileStream.Length))];
            int bytesRead = 0;
            while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
                requestStream.Write(buffer, 0, bytesRead);

            // Write out the trailing boundary  
            //requestStream.Write(boundaryBytes, 0, boundaryBytes.Length);
            using (WebResponse responce = webrequest.GetResponse())
            {
                Stream s = responce.GetResponseStream();
                StreamReader sr = new StreamReader(s);
                return sr.ReadToEnd();
            }
        }

        public HttpResponseMessage Post()
        {
            // Check if the request contains multipart/form-data.
            // 检查该请求是否含有multipart/form-data
            List<object> returnObjs = new List<object>();
            dynamic returnVal = returnObjs;
            try
            {
                if (HttpContext.Current.Request.Files.Count > 0)
                {

                    HttpFileCollection files = HttpContext.Current.Request.Files;
                    var userName = HttpContext.Current.Request.Form["name"];
                    CookieContainer cookies = null;
                    NameValueCollection querystring = null;
                    string extension = string.Empty;
                    string filename = string.Empty;
                    string postfilename = string.Empty;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFile file = files[i];
                        cookies = new CookieContainer();
                        //add or use cookies  
                        querystring = new NameValueCollection();
                        postfilename = file.FileName;
                        extension = postfilename.Substring(postfilename.LastIndexOf(".") + 1);
                        filename = Guid.NewGuid().ToString();

                        string category = HttpContext.Current.Request.Form["upcategory"].ToString();
                        string datepath = DateTime.Now.ToString("yyyy/MM/");

                        string categorypath = getConfig.getAppConfig()["fileServer"][category].ToString();
                        categorypath = datepath + categorypath;

                        returnObjs.Add(new { filename = postfilename, servername = categorypath + "/" + filename + "." + extension });

                        querystring["categorypath"] = categorypath;
                        querystring["filename"] = filename;
                        querystring["extension"] = extension;
                        querystring["category"] = category; 

                        //如果是图片需要压缩
                        if (!string.IsNullOrEmpty(HttpContext.Current.Request.Form["width"]))
                        {
                            querystring["width"] = HttpContext.Current.Request.Form["width"];
                            querystring["height"] = HttpContext.Current.Request.Form["width"];
                        }
                        string outdata = UploadFileEx(
       getConfig.getAppConfig()["remoteFileUpload"].ToString(), file.InputStream, "uploadfile", file.ContentType,
       querystring, cookies);


                    }
                }
                HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.OK);
                msg.Content = new StringContent(JsonConvert.SerializeObject(returnVal));
                return msg;
            }
            catch (Exception ex)
            {
                HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.Forbidden);
                msg.Content = new StringContent(ex.ToString());
                ErrLog.Log(ex);
                return msg;
            }

        }



        public dynamic uploadAvatar(string upcategory)
        {
            List<object> returnObjs = new List<object>();
            dynamic returnVal = returnObjs;
            HttpFileCollection files = HttpContext.Current.Request.Files;
            var file = files["__source"];
            var avatar = files["__avatar1"];
            string filename = Guid.NewGuid().ToString();
            var extension = file.FileName.Substring(file.FileName.LastIndexOf(".") + 1);
            returnObjs.Add(new { filename = file.FileName, servername = filename + "." + extension });
            NameValueCollection querystring = new NameValueCollection();

			List<string> allowExtension = new List<string>();
			allowExtension.Add(".bmp");
			allowExtension.Add(".jpg");
			allowExtension.Add(".gif");
			allowExtension.Add(".png");

			if (!allowExtension.Contains("." + extension))
			{
				throw new Exception("未授权的文件类型，上传失败");
			}

            CookieContainer cookies = new CookieContainer();

            querystring["filename"] = filename;
            querystring["extension"] = extension;
            querystring["category"] = upcategory;

            string outdata = UploadFileEx(
                getConfig.getAppConfig()["remoteFileUpload"].ToString(), avatar.InputStream, "uploadfile", avatar.ContentType,
                querystring, cookies);
            object returnSucess = new
            {
                success = true,//该名/值对是必须定义的，表示上传成功
                sourceUrl = "原图片位于服务器的虚拟路径",
                avatarUrls = filename + "." + extension
            };
            return returnSucess;
        }
    }
}
