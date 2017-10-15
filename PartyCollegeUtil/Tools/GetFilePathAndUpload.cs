using System;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;

namespace PartyCollegeUtil.Tools
{
    public class GetFilePathAndUpload
    {
        public static Stream GetPath(string path)
        {
            string rootPath = getConfig.getAppConfig()["webServer"]["rootPath"].ToString();
            // 打开文件   
            FileStream fileStream = new FileStream(rootPath + path, FileMode.Open, FileAccess.Read, FileShare.Read);
            // 读取文件的 byte[]   
            byte[] bytes = new byte[fileStream.Length];
            fileStream.Read(bytes, 0, bytes.Length);
            fileStream.Close();
            // 把 byte[] 转换成 Stream   
            Stream stream = new MemoryStream(bytes);
            return stream;
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
        public static string UploadFileEx(string url, Stream fileStream,
  string fileFormName, string contenttype, NameValueCollection querystring,
  CookieContainer cookies)
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
            WebResponse responce = webrequest.GetResponse();
            Stream s = responce.GetResponseStream();
            StreamReader sr = new StreamReader(s);

            return sr.ReadToEnd();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileFullname">文件名</param>
        /// <param name="category">文件存放路径</param>
        /// <param name="width">压缩宽度</param>
        /// <param name="height">压缩高度</param>
        /// <param name="filePath">web服务器的地址</param>
        public static void UploadFileMain(string fileFullname, string category, string width, string height,string filePath)
        {
            // 同步到文件服务器 add by litong 2016-10-11
            CookieContainer cookies = null;
            NameValueCollection querystring = null;
            cookies = new CookieContainer();
            querystring = new NameValueCollection();
            querystring["filename"] = fileFullname.Substring(0,fileFullname.LastIndexOf("."));
            querystring["extension"] = fileFullname.Substring(fileFullname.LastIndexOf(".") + 1);
            querystring["category"] = category;
            //如果是图片需要压缩
            if (!string.IsNullOrEmpty(width))
            {
                querystring["width"] = width;
                querystring["height"] = height;
            }
            UploadFileEx(
   getConfig.getAppConfig()["remoteFileUpload"].ToString(), GetPath(filePath + fileFullname), null, null,
   querystring, cookies);
        }
    }
}