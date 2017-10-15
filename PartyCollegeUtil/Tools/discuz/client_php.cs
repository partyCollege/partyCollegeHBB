using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Web;
using System.Configuration;
using System.Security.Cryptography;
using System.Net;
using System.IO;

namespace ucApi
{
    internal class client_php
    {
        internal static string uc_api_post(string module, string action, Hashtable arg)
        {
            string s = string.Empty;
            string sep = string.Empty;
            foreach (System.Collections.DictionaryEntry objDE in arg)
            {
                s += sep + objDE.Key + "=" + urlencode(uc_stripslashes(objDE.Value.ToString()));
                sep = "&";
            }

            string postdata = uc_api_requestdata(module, action, s);
            //return uc_fopen2(ConfigurationManager.AppSettings["UC_API"] + "/index.php?debug_session_id=1001&start_debug=1&debug_start_session=1&debug_host=127.0.0.1&debug_no_cache=1223456255968&debug_port=10000&send_sess_end=1&original_url=http://localhost/ucenter/index.php&debug_stop=1", 500000, postdata, string.Empty, true, ConfigurationManager.AppSettings["UC_IP"], 20);
            return uc_fopen2(ConfigurationManager.AppSettings["UC_API"] + "/index.php", 500000, postdata, string.Empty, true, ConfigurationManager.AppSettings["UC_IP"], 20);
        }


        internal static Hashtable uc_unserialize(string s)
        {
            return ucApi.lib.XmlFunc.xml_unserialize(s); ;
        }

        private static string uc_stripslashes(string str)
        {
            return str;
        }

        private static string uc_api_requestdata(string module, string action)
        {
            return uc_api_requestdata(module, action, string.Empty, string.Empty);
        }

        private static string uc_api_requestdata(string module, string action, string arg)
        {
            return uc_api_requestdata(module, action, arg, string.Empty);
        }

        private static string uc_api_requestdata(string module, string action, string arg, string extra)
        {
            string input = uc_api_input(arg);
            string post = "m="+module+"&a="+action+"&inajax=2&input="+input+"&appid="+ConfigurationManager.AppSettings["UC_APPID"]+extra;
	        return post;
        }

        private static string md5(string data)
        {
            /// <summary>
            /// 与ASP兼容的MD5加密算法
            /// </summary>

            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] t = md5.ComputeHash(Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]).GetBytes(data));
            StringBuilder sb = new StringBuilder(32);
            for (int i = 0; i < t.Length; i++)
            {
                sb.Append(t[i].ToString("x").PadLeft(2, '0'));
            }
            return sb.ToString();
        }

        private static long time()
        {
            DateTime timeStamp = new DateTime(1970, 1, 1);  //得到1970年的时间戳
            return (DateTime.UtcNow.Ticks - timeStamp.Ticks) / 10000000;  //注意这里有时区问题，用now就要减掉8个小时
        }

        private static string microtime()
        {
            long sec = time();
            int msec = DateTime.UtcNow.Millisecond;
            string strMsec = "0." + msec.ToString().PadRight(8,'0');
            string strRet = strMsec + " " +sec.ToString();
            return strRet;            
        }

        public static string base64_encode(byte[] bytes)
        {
            return Convert.ToBase64String(bytes);
        }

        public static string base64_encode(string thisEncode)
        {
            string encode = "";             
            try 
            { 
                byte[] bytes = System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]).GetBytes(thisEncode);
                encode = Convert.ToBase64String(bytes);
            } 
            catch 
            { 
                encode = thisEncode; 
            } 
            
            return encode; 
        }
        
        private static string base64_decode(string code)
        {
            string decode = ""; 
            byte[] bytes = Convert.FromBase64String(code);  
            try 
            { 
                decode = System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]).GetString(bytes);          
            } 
            catch 
            { 
                decode = code; 
            } 
            return decode; 

        }

        private static string urlencode(string str)
        {
            //此处有问题，因为php的urlencode不同于HttpUtility.UrlEncode
            //return HttpUtility.UrlEncode(str);
            string tmp = string.Empty;
            string strSpecial = "_-.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for(int i=0;i<str.Length;i++)
            {
                string crt = str.Substring(i,1);
                if(strSpecial.Contains(crt))
                    tmp += crt;
                else
                {
                    byte[] bts = System.Text.Encoding.Default.GetBytes(crt);
                    foreach (byte bt in bts)
                    {
                        tmp += "%" + bt.ToString("X");
                    }
                }
            }
            return tmp;
        }

        private static string uc_api_input(string data) {            
            string s = urlencode(uc_authcode(data + "&agent=" + md5(HttpContext.Current.Request.UserAgent) + "&time=" + time(), "ENCODE", ConfigurationManager.AppSettings["UC_KEY"]));
            
            return s;
        }
        
        #region uc_fopen
        private static string uc_fopen(string url)
        {
            return uc_fopen(url, 0, string.Empty, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen(string url, int limit)
        {
            return uc_fopen(url, limit, string.Empty, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen(string url, int limit, string post)
        {
            return uc_fopen(url, limit, post, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen(string url, int limit, string post, string cookie)
        {
            return uc_fopen(url, limit, post, cookie, false, string.Empty, 15, true);
        }

        private static string uc_fopen(string url, int limit, string post, string cookie, bool bysocket)
        {
            return uc_fopen(url, limit, post, cookie, bysocket, string.Empty, 15, true);
        }

        private static string uc_fopen(string url, int limit, string post, string cookie, bool bysocket, string ip)
        {
            return uc_fopen(url, limit, post, cookie, bysocket, ip, 15, true);
        }

        private static string uc_fopen(string url, int limit, string post, string cookie, bool bysocket, string ip, int timeout)
        {
            return uc_fopen(url, limit, post, cookie, bysocket, ip, timeout, true);
        }

        private static string uc_fopen(string url, int limit, string post, string cookie, bool bysocket, string ip, int timeout, bool block)
        {
            bool bRetVal = false;
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(url);
            myRequest.AllowAutoRedirect = true;
            //if (string.IsNullOrEmpty(HttpContext.Current.Request.UserAgent))
            //    myRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
            //else                
            myRequest.UserAgent = HttpContext.Current.Request.UserAgent;
            myRequest.KeepAlive = false;
            myRequest.ProtocolVersion = HttpVersion.Version10; 
            //if (HttpContext.Current.Request.Url != null)
            //    myRequest.Referer = HttpContext.Current.Request.Url.ToString();

            //myRequest.CookieContainer = ;

            if (string.IsNullOrEmpty(post))
            {
                myRequest.Method = "GET";
            }
            else
            {
                myRequest.Method = "POST";
                Stream myStream = new MemoryStream();//定义这个Stream是只是为了得到发送字串 经过编码之后得到的byte的长度。                    
                StreamWriter myStreamWriter = new StreamWriter(myStream, System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]));//用默认编码 得到Stream
                myStreamWriter.Write(post);
                myStreamWriter.Flush();
                long len = myStream.Length;//目的完成
                myStreamWriter.Close();
                myStream.Close();

                myRequest.ContentType = "application/x-www-form-urlencoded";
                myRequest.ContentLength = len;//如果字符串中存在中文 使用loginWebView.postContent.Length得到长度和编码之后的长度是不一样的:(

                Stream newStream = myRequest.GetRequestStream();
                myStreamWriter = new StreamWriter(newStream, System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]));//编码使用Encoding.Default 换来换去编码方法 还是用它得到的中文不会出现乱码

                myStreamWriter.Write(post);
                myStreamWriter.Close();
                newStream.Close();

            }

            //创建接收回馈的字节流类
            string responseHtml = string.Empty;
            myRequest.Timeout = timeout;
            HttpWebResponse webResponse = null;
            try
            {
                webResponse = (HttpWebResponse)myRequest.GetResponse();
                bRetVal = true;
                if (webResponse.StatusCode != HttpStatusCode.OK)
                    bRetVal = false;

                if (bRetVal)
                {
                    //创建接收回馈的字节流类
                    Stream receiveStream = webResponse.GetResponseStream();//得到回写的字节流
                    StreamReader readStream = new StreamReader(receiveStream, System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]));
                    responseHtml = readStream.ReadToEnd();
                    readStream.Close();
                }
                if (webResponse != null)
                    webResponse.Close();
            }
            catch (Exception exp)
            {
                webResponse.Close();
            }

            return responseHtml;
        }
        #endregion

        #region uc_fopen2
        private static string uc_fopen2(string url)
        {
            return  uc_fopen2(url, 0, string.Empty, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen2(string url, int limit)
        {
            return  uc_fopen2(url, limit, string.Empty, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen2(string url, int limit, string post)
        {
            return  uc_fopen2(url, limit, post, string.Empty, false, string.Empty, 15, true);
        }

        private static string uc_fopen2(string url, int limit, string post, string cookie)
        {
            return  uc_fopen2(url, limit, post, cookie, false, string.Empty, 15, true);
        }

        private static string uc_fopen2(string url, int limit, string post, string cookie, bool bysocket)
        {
            return  uc_fopen2(url, limit, post, cookie, bysocket, string.Empty, 15, true);
        }

        private static string uc_fopen2(string url, int limit, string post, string cookie, bool bysocket, string ip)
        {
            return  uc_fopen2(url, limit, post, cookie, bysocket, ip, 15, true);
        }

        private static string uc_fopen2(string url, int limit, string post, string cookie, bool bysocket, string ip, int timeout)
        {
            return  uc_fopen2(url, limit, post, cookie, bysocket, ip, timeout, true);
        }

        private static string uc_fopen2(string url, int limit, string post, string cookie, bool bysocket, string ip, int timeout, bool block)
        {
            int times = 1;
            if(HttpContext.Current.Request["__times__"]!=null)
            {
                times = int.Parse(HttpContext.Current.Request["__times__"].ToString())+1;
            }
            if(times>2)
                return string.Empty;

            url += url.Contains("?")?"&":"?"+"__times__="+times;

            return uc_fopen(url, limit, post, cookie, bysocket, ip, timeout, block);
        }
        #endregion

        #region uc_authcode
        private static string uc_authcode(string str)
        {
            return uc_authcode(str, "DECODE", string.Empty, 0);
        }

        private static string uc_authcode(string str, string operation)
        {
            return uc_authcode(str, operation, string.Empty, 0);
        }

        private static string uc_authcode(string str, string operation, string key)
        {
            return uc_authcode(str, operation, key, 0);
        }

        private static string uc_authcode(string str, string operation, string key, int expiry)
        {
            int ckey_length = 4;
            key = md5(string.IsNullOrEmpty(key) ? ConfigurationManager.AppSettings["UC_KEY"] : key);
            string keya = md5(key.Substring(0, 16));
            string keyb = md5(key.Substring(16, 16));
            string md5MT = md5(microtime());
            string keyc = ckey_length > 0 ? (operation.Equals("DECODE") ? str.Substring(0, ckey_length) : md5MT.Substring(md5MT.Length - ckey_length)) : string.Empty;

            string cryptkey = keya + md5(keya + keyc);
            int key_length = cryptkey.Length;

            str = operation.Equals("DECODE") ? base64_decode(str.Substring(ckey_length)) : (expiry > 0 ? expiry + time() : 0).ToString("D10") + (md5(str + keyb)).Substring(0, 16) + str;
            int string_length = str.Length;
            string result = string.Empty;

            int[] box = new int[256];
            for (int i = 0; i < 256; i++)
                box[i] = i;

            int[] rndkey = new int[256];
            for (int i = 0; i < 256; i++)
                rndkey[i] = (int)(cryptkey[i % key_length]);

            for (int i = 0, j = 0; i < 256; i++)
            {
                j = (j + box[i] + rndkey[i]) % 256;
                int tmp = box[i];
                box[i] = box[j];
                box[j] = tmp;
            }

            byte[] tmpResult = new byte[string_length];
            for (int a = 0, j = 0, i = 0; i < string_length; i++)
            {
                a = (a + 1) % 256;
                j = (j + box[a]) % 256;
                int tmp = box[a];
                box[a] = box[j];
                box[j] = tmp;
                //result += (char)(str[i] ^ box[(box[a] + box[j]) % 256]);
                tmpResult[i] = (byte)(str[i] ^ box[(box[a] + box[j]) % 256]);
            }
            //有问题
            result = System.Text.Encoding.GetEncoding(ConfigurationManager.AppSettings["UC_CHARSET"]).GetString(tmpResult); 
            
            if (operation.Equals("DECODE"))
            {
                if ((long.Parse(result.Substring(0, 10)) == 0 || long.Parse(result.Substring(0, 10)) > time()) && result.Substring(10, 16).Equals(md5(result.Substring(26) + keyb).Substring(0, 16)))
                    return result.Substring(26);
                else
                    return string.Empty;
            }
            else
            {
                return keyc + base64_encode(tmpResult).Replace("=", string.Empty);
                //return keyc + base64_encode(result).Replace("=", string.Empty);
            }
        }
        #endregion
    }
}
