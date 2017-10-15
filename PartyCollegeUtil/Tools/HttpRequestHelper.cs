using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Tools
{
    public class HttpRequestHelper
    {
        public string GetHttp(string url, string body, string contentType)
        {
            return PostHttp(url, body, contentType, "GET");
        }
        public string PostHttp(string url, string body, string contentType, string Method = "POST")
        {
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = contentType;
            httpWebRequest.Method = Method;
            httpWebRequest.Timeout = 20000;

            if (Method == "POST")
            {
                byte[] btBodys = Encoding.UTF8.GetBytes(body);
                httpWebRequest.ContentLength = btBodys.Length;
                httpWebRequest.GetRequestStream().Write(btBodys, 0, btBodys.Length);
            }

            string responseContent = string.Empty;
            HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream zipstream = httpWebResponse.GetResponseStream();

            if (zipstream != null)
            {
                StreamReader reader = new StreamReader(zipstream, System.Text.Encoding.GetEncoding("utf-8"));
                responseContent = reader.ReadToEnd();
                reader.Close();
                zipstream.Close();
            }
            //using (System.IO.Compression.DeflateStream stream = new System.IO.Compression.DeflateStream(zipstream, System.IO.Compression.CompressionMode.Decompress))
            //{
            //	stream.Flush();
            //	byte[] decompressBuffer = ToByteArray(stream);
            //	int nSizeIncept = decompressBuffer.Length;
            //	stream.Close();
            //	responseContent = System.Text.Encoding.UTF8.GetString(decompressBuffer, 0, nSizeIncept);   //转换为普通的字符串
            //}

            httpWebResponse.Close();
            httpWebRequest.Abort();
            httpWebResponse.Close();

            return responseContent;
        }

        private string DeflateDecompress(byte[] buffer)
        {
            using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
            {
                ms.Write(buffer, 0, buffer.Length);
                ms.Position = 0;
                using (System.IO.Compression.DeflateStream stream = new System.IO.Compression.DeflateStream(ms, System.IO.Compression.CompressionMode.Decompress))
                {
                    stream.Flush();
                    byte[] decompressBuffer = ToByteArray(stream);
                    int nSizeIncept = decompressBuffer.Length;
                    stream.Close();
                    return System.Text.Encoding.UTF8.GetString(decompressBuffer, 0, nSizeIncept);   //转换为普通的字符串
                }
            }
        }

        private byte[] ToByteArray(Stream stream)
        {
            byte[] buffer = new byte[32768];//每次读取16k
            using (MemoryStream ms = new MemoryStream())
            {
                while (true)
                {
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if (read <= 0)
                        return ms.ToArray();
                    ms.Write(buffer, 0, read);
                }
            }
        }
    }
}