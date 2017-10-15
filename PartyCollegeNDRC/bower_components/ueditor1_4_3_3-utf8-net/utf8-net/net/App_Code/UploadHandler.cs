using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// UploadHandler 的摘要说明
/// </summary>
public class UploadHandler : Handler
{

    public UploadConfig UploadConfig { get; private set; }
    public UploadResult Result { get; private set; }

    public UploadHandler(HttpContext context, UploadConfig config)
        : base(context)
    {
        this.UploadConfig = config;
        this.Result = new UploadResult() { State = UploadState.Unknown };
    }

    public override void Process()
    {
        byte[] uploadFileBytes = null;
        string uploadFileName = null;

        if (UploadConfig.Base64)
        {
            uploadFileName = UploadConfig.Base64Filename;
            uploadFileBytes = Convert.FromBase64String(Request[UploadConfig.UploadFieldName]);
        }
        else
        {
            var file = Request.Files[UploadConfig.UploadFieldName];
            uploadFileName = file.FileName;

            if (!CheckFileType(uploadFileName))
            {
                Result.State = UploadState.TypeNotAllow;
                WriteResult();
                return;
            }
            if (!CheckFileSize(file.ContentLength))
            {
                Result.State = UploadState.SizeLimitExceed;
                WriteResult();
                return;
            }

            uploadFileBytes = new byte[file.ContentLength];
            try
            {
                file.InputStream.Read(uploadFileBytes, 0, file.ContentLength);

                CookieContainer cookies = new CookieContainer();
                NameValueCollection querystring = new NameValueCollection();
                string extension = string.Empty;
                string filename = string.Empty;
                string postfilename = string.Empty;


                extension = uploadFileName.Substring(uploadFileName.LastIndexOf(".") + 1);
                filename = Guid.NewGuid().ToString();

                string category = "ueditor";
                string datepath = DateTime.Now.ToString("yyyy/MM/");

                string categorypath = "ueditor"; //getConfig.getAppConfig()["fileServer"][category].ToString();
                categorypath = datepath + categorypath;

                querystring["categorypath"] = categorypath;
                querystring["filename"] = filename;
                querystring["extension"] = extension;
                querystring["category"] = category;

                string outdata = UploadFileEx(getConfig.getAppConfig()["remoteFileUpload"].ToString(), file.InputStream, "uploadfile", file.ContentType, querystring, cookies);

                Result.OriginFileName = uploadFileName;
                Result.Url = categorypath + "/"+ filename + "." + extension;
                Result.State = UploadState.Success;

            }
            catch (Exception e)
            {
                Result.State = UploadState.NetworkError;
                Result.ErrorMessage = e.Message;
                //WriteResult();
            }
            finally
            {
                WriteResult();
            }
        }

        //Result.OriginFileName = uploadFileName;

        //var savePath = PathFormatter.Format(uploadFileName, UploadConfig.PathFormat);
        ////var localPath = Server.MapPath(savePath);
        //var localPath = Server.MapPath("~/") + savePath;


        //try
        //{
        //    if (!Directory.Exists(Path.GetDirectoryName(localPath)))
        //    {
        //        Directory.CreateDirectory(Path.GetDirectoryName(localPath));
        //    }
        //    File.WriteAllBytes(localPath, uploadFileBytes);
        //    Result.Url = savePath;
        //    Result.State = UploadState.Success;
        //}
        //catch (Exception e)
        //{
        //    Result.State = UploadState.FileAccessError;
        //    Result.ErrorMessage = e.Message;
        //}
        //finally
        //{
        //    WriteResult();
        //}
    }

    private void WriteResult()
    {
        this.WriteJson(new
        {
            state = GetStateMessage(Result.State),
            url = Result.Url,
            title = Result.OriginFileName,
            original = Result.OriginFileName,
            error = Result.ErrorMessage
        });
    }

    private string GetStateMessage(UploadState state)
    {
        switch (state)
        {
            case UploadState.Success:
                return "SUCCESS";
            case UploadState.FileAccessError:
                return "文件访问出错，请检查写入权限";
            case UploadState.SizeLimitExceed:
                return "文件大小超出服务器限制";
            case UploadState.TypeNotAllow:
                return "不允许的文件格式";
            case UploadState.NetworkError:
                return "网络错误"; 
        }
        return "未知错误";
    }

    private bool CheckFileType(string filename)
    {
        var fileExtension = Path.GetExtension(filename).ToLower();
        return UploadConfig.AllowExtensions.Select(x => x.ToLower()).Contains(fileExtension);
    }

    private bool CheckFileSize(int size)
    {
        return size < UploadConfig.SizeLimit;
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
    public static string UploadFileEx(string url, Stream fileStream,string fileFormName, string contenttype, NameValueCollection querystring,CookieContainer cookies)
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
        fileStream.Position = 0;

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

}

public class UploadConfig
{
    /// <summary>
    /// 文件命名规则
    /// </summary>
    public string PathFormat { get; set; }

    /// <summary>
    /// 上传表单域名称
    /// </summary>
    public string UploadFieldName { get; set; }

    /// <summary>
    /// 上传大小限制
    /// </summary>
    public int SizeLimit { get; set; }

    /// <summary>
    /// 上传允许的文件格式
    /// </summary>
    public string[] AllowExtensions { get; set; }

    /// <summary>
    /// 文件是否以 Base64 的形式上传
    /// </summary>
    public bool Base64 { get; set; }

    /// <summary>
    /// Base64 字符串所表示的文件名
    /// </summary>
    public string Base64Filename { get; set; }
}

public class UploadResult
{
    public UploadState State { get; set; }
    public string Url { get; set; }
    public string OriginFileName { get; set; }

    public string ErrorMessage { get; set; }
}

public enum UploadState
{
    Success = 0,
    SizeLimitExceed = -1,
    TypeNotAllow = -2,
    FileAccessError = -3,
    NetworkError = -4,
    Unknown = 1,
}

