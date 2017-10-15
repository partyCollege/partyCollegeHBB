using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model.Cache;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace PartyCollegeUtil.Service
{
	public class SmsService
	{
		public dynamic SendSmsMessage(dynamic formModel)
		{
			string formatString = "1,2,3,4,5,6,7,8,9,0";
			string phone = string.Empty;
			string codeString = string.Empty;
			string content = string.Empty;
			string keyname = string.Empty;
			phone = formModel.phone;
			keyname = formModel.keyname;
			if (string.IsNullOrEmpty(phone))
			{
				return new { code = "failed", message = "发送失败" };
			}
			ValidateCode_Style9 vcs = new ValidateCode_Style9();

			vcs.GetRandom(formatString, 6, out codeString);
			//codeString="888888";
			SySmsTemplate smstemplate = CacheSmsTemplet.AppSettings[keyname];
			content = smstemplate.content.Replace("[" + keyname + "]", codeString);
			HttpContext.Current.Session[keyname] = codeString;
			HttpContext.Current.Session[keyname + "_telphone"] = phone;
			//SmsHelper smsHelper = new SmsHelper(phone, content, "", null);
			//smsHelper.SendSms();
			SMSContent smscontent = new SMSContent();
			smscontent.content = content;
			smscontent.phone = phone;
			smscontent.sendSMS();
			return new { code = "success", message = "发送成功" };
		}

		public dynamic sendClassSMS(dynamic formModel)
		{
			string content = formModel.content;
			int sendtype = Convert.ToInt32(formModel.sendtype);
			string classid = formModel.classid;

			string sql = @"select cellphone from sy_student where classid = ?classid and status >= 0 ";

			List<MySqlParameter> paramCollection = new List<MySqlParameter>();
			paramCollection.Add(new MySqlParameter("classid", classid));

			if (sendtype == 1)
			{
				//全部学员
			}
			else if (sendtype == 2)
			{
				//未报到
				sql += " and signstatus = 0 ";
			}
			else if (sendtype == 3)
			{
				//学习进度
				int operationtype = Convert.ToInt32(formModel.operationtype);
				decimal studyrate = Convert.ToDecimal(formModel.studyrate);
				if (operationtype == 1)
					sql += " and studyrate < ?studyrate ";
				else
					sql += " and studyrate > ?studyrate ";
				paramCollection.Add(new MySqlParameter("studyrate", studyrate));

			}
			else if (sendtype == 4)
			{
				//未结业
				sql += " and graduatestatus = 0 ";
			}
			else if (sendtype == 5)
			{
				//班委
				sql += " and ifnull(committees,'') <> '' ";
			}
			else if (sendtype == 6)
			{
				//手工
				string stuids = formModel.studentids;
				sql += " and id in (" + stuids + ") ";
			}
			DataTable dt = getStudentPhoneData(sql, paramCollection);
			if (dt != null && dt.Rows.Count > 0)
			{
				int len = Convert.ToInt32(Math.Ceiling(dt.Rows.Count / Convert.ToDecimal(5)));
				int count = 300;
				for (int i = 0; i < len; i++)
				{
					StringBuilder sbid = new StringBuilder();
					dt.AsEnumerable().ToList().Skip(i * count).Take(count).ToList().ForEach(r =>
					{
						if (sbid.Length > 0)
							sbid.Append(",");
						sbid.Append(r.Field<string>("cellphone"));
					});
					if (sbid.Length > 0)
					{
						SMSContent smscontent = new SMSContent();
						smscontent.content = content;
						smscontent.phone = sbid.ToString();
						smscontent.sendSMS();
					}
				}
			}

			return new { code = "success", message = "发送成功" };
		}

		public DataTable getStudentPhoneData(string sql, List<MySqlParameter> paramCollection)
		{
			DataTable dt = new DataTable();
			MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
			try
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
				cmd.CommandText = sql;
				cmd.Parameters.AddRange(paramCollection.ToArray());
				MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
				adpt.Fill(dt);
			}
			catch (Exception ex)
			{
				ErrLog.Log(sql + ex);
			}
			finally
			{
				conn.Close();
			}
			return dt;
		}
	}

	public class SMSContent
	{
		public string phone { set; get; }
		public string content { set; get; }

		public string sendSMS()
		{
			if (!string.IsNullOrEmpty(phone) && !string.IsNullOrEmpty(content))
			{
				byte[] utf8Buf = Encoding.UTF8.GetBytes(this.content);

				byte[] gbkBuf = Encoding.Convert(Encoding.UTF8, Encoding.GetEncoding("GBK"), utf8Buf);

				this.content = Encoding.GetEncoding("GBK").GetString(gbkBuf);

				string smsUrl = "http://sms.10690221.com:9011/hy/?uid=800884&encode=utf-8&auth=" + this.MD5Encrypt("hbwlxy" + "oa123ccs").ToLower() + "&mobile=" + this.phone + "&msg=" + this.content + "&expid=0";
				WebClient client = new WebClient();
				client.Encoding = Encoding.UTF8;
				WebRequest myre = WebRequest.Create(smsUrl);
				WebResponse rb = myre.GetResponse();
				return "1";
			}
			else
			{
				return "-1";
			}

		}
		public string MD5Encrypt(string strText)
		{
			return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(strText, "MD5").ToLower();
		}

		/// <summary>
		/// 接口为WebService方式，接口地址：
		/// http://10.100.242.35:8082/mepsms/CxService/SmsService
		/// </summary>
		/// <returns></returns>
		private string SendSmsMessage()
		{
			StringBuilder sb = new StringBuilder();
			sb.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
			sb.Append("<SMS UserId=\"8ae472a349ac6e5b0149ac6e5bf30000\" from=\"会议报名系统\" username=\"hybmxt\" password=\"123456\">");
			sb.Append("<Message Phone=\"" + phone + "\" Content=\"" + content + "\" />");
			sb.Append("</SMS>");
			return "1";

			//Object[] params = {sb.toString()};
			//QName qName = new QName("http://service.xfxmcy.com/", "send");
			//RPCServiceClient client;
			//Object[] rtnObjs = new Object[] {};
			//try {
			//	client = new RPCServiceClient();
			//	Options options = new Options();
			//	options.setTo(new EndpointReference("http://localhost/mepsms/CxService/SmsService"));
			//	options.setTimeOutInMilliSeconds(30000);
			//	client.setOptions(options);

			//	rtnObjs = client.invokeBlocking(qName, params, new Class[] {String.class});
			//} catch (AxisFault e) {
			//	// TODO Auto-generated catch block
			//	e.printStackTrace();
			//};
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="url"></param>
		/// <param name="body"></param>
		/// <param name="contentType"></param>
		/// <returns></returns>
		public string PostHttp(string url, string body, string contentType)
		{
			HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

			httpWebRequest.ContentType = contentType;
			httpWebRequest.Method = "POST";
			httpWebRequest.Timeout = 20000;

			byte[] btBodys = Encoding.UTF8.GetBytes(body);
			httpWebRequest.ContentLength = btBodys.Length;
			httpWebRequest.GetRequestStream().Write(btBodys, 0, btBodys.Length);

			HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
			StreamReader streamReader = new StreamReader(httpWebResponse.GetResponseStream());
			string responseContent = streamReader.ReadToEnd();

			httpWebResponse.Close();
			streamReader.Close();
			httpWebRequest.Abort();
			httpWebResponse.Close();

			return responseContent;
		}


		public string sendSMSList()
		{
			if (!string.IsNullOrEmpty(phone) && !string.IsNullOrEmpty(content))
			{
				byte[] utf8Buf = Encoding.UTF8.GetBytes(this.content);

				byte[] gbkBuf = Encoding.Convert(Encoding.UTF8, Encoding.GetEncoding("GBK"), utf8Buf);

				this.content = Encoding.GetEncoding("GBK").GetString(gbkBuf);
				string postString = "mobile=" + this.phone;
				byte[] postData = Encoding.UTF8.GetBytes(postString);
				string smsUrl = "http://sms.10690221.com:9011/hy/?uid=800882&encode=utf-8&auth=" + this.MD5Encrypt("zpy" + "dreamsoft123").ToLower() + "&msg=" + this.content + "&expid=0";
				WebClient webClient = new WebClient();
				webClient.Encoding = Encoding.UTF8;
				webClient.Headers.Add("Content-Type", "text/html; charset=utf-8");
				byte[] responseData = webClient.UploadData(smsUrl, "POST", postData);
				string srcString = Encoding.UTF8.GetString(responseData);
				return "1";
			}
			else
			{
				return "-1";
			}
		}
	}
}
