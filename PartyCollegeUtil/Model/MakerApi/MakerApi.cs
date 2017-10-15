using Newtonsoft.Json;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollege.Model.MakerApi
{
	public class MakerApi
	{
		private static string accessTokenUrl = "http://www.cnmaker.org.cn/sns/oauth2/access_token";

		public static string GetTryAccessToken(string appid, string code)
		{
			object sessionAccessToken = HttpContext.Current.Session["access_token"];
			object sessionRefreshToken = HttpContext.Current.Session["refresh_token"];
			object sessionCreateTime = HttpContext.Current.Session["createtime"];
			if (sessionAccessToken == null)
			{
				return GetAccessToken(appid, code);
			}
			else
			{
				//检查是不是有过期
				DateTime createtime = Convert.ToDateTime(sessionCreateTime);
				TimeSpan ts = DateTime.Now - createtime;
				double remainSenconds = ts.TotalSeconds;
				//差不多要过期时，去刷新令牌
				if (remainSenconds < 7200 && remainSenconds > 6000)
				{
					dynamic returnInfo= RefreshAccessToken(appid, sessionRefreshToken.ToString());
					if (!returnInfo.status)
					{
						return "";
					}
					else
					{
						return sessionAccessToken.ToString();
					}
				}
				else
				{
					return sessionAccessToken.ToString();
				}
			}
		}

		/// <summary>
		/// 获取access_token
		/// //http://www.cnmaker.org.cn/sns/oauth2/access_token?appid=666666&code=xxxxxxx&grant_type=authorization_code
		/// </summary>
		public static string GetAccessToken(string appid, string code){
			string geturl = string.Format("{0}?appid={1}&code={2}&grant_type=authorization_code", accessTokenUrl, appid, code);
			string strJson = UtilHttpRequest.RequestUrl(geturl, "GET");
			dynamic messageJson = JsonConvert.DeserializeObject<dynamic>(strJson);
			if (strJson.IndexOf("access_token") > -1)
			{
				HttpContext.Current.Session["access_token"] = messageJson.access_token.ToString();
				HttpContext.Current.Session["refresh_token"] = messageJson.access_token.ToString();
				HttpContext.Current.Session["createtime"] = DateTime.Now;
				return messageJson.access_token.ToString();
			}
			else
			{
				return "";
			}
		}

		/// <summary>
		/// 刷新令牌
		/// http://www.cnmaker.org.cn/sns/oauth2/refresh_token?appid=1223&refresh_token=xxxxx&grant_type=refresh_token
		/// 调用示例成功结果:{"status":"true","discription":"刷新成功"}
		/// 调用示例失败: {"status":"true","discription":"失败详细信息"}
		/// </summary>
		public static dynamic RefreshAccessToken(string appid, string refresh_token)
		{

			string geturl = string.Format("{0}?appid={1}&refresh_token={2}&grant_type=refresh_token", "http://www.cnmaker.org.cn/sns/oauth2/refresh_token", appid, refresh_token);
			string strJson = UtilHttpRequest.RequestUrl(geturl, "GET");
			dynamic messageJson = JsonConvert.DeserializeObject<dynamic>(strJson);
			return messageJson;
		}

		/// <summary>
		/// 获取用户的信息
		/// http://www.cnmaker.org.cn/sns/user_info?access_token=xxxxxx
		/// </summary>
		/// <param name="appid"></param>
		/// <param name="refresh_token"></param>
		/// <returns></returns>
		public static dynamic GetUserInfo(string access_token)
		{

			string geturl = string.Format("{0}?access_token={1}", "http://www.cnmaker.org.cn/sns/user_info", access_token);
			string strJson = UtilHttpRequest.RequestUrl(geturl, "GET");
			dynamic messageJson = JsonConvert.DeserializeObject<dynamic>(strJson);
			if (strJson.IndexOf("status") > -1)
			{
				return null;
			}
			return messageJson;
		}

		/// <summary>
		/// 验证访问令牌
		/// http://www.cnmaker.org.cn/sns/auth?access_token=xxxxxx
		/// 调用示例成功结果：{"status":"true","discription":"访问令牌有效"}
		/// 调用示例失败：{"status":"false","discription":"失败的详细信息"}
		/// </summary>
		/// <param name="appid"></param>
		/// <param name="refresh_token"></param>
		/// <returns></returns>
		public static dynamic VerifyAccessToken(string access_token)
		{
			string geturl = string.Format("{0}?access_token={1}", "http://www.cnmaker.org.cn/sns/auth", access_token);
			string strJson = UtilHttpRequest.RequestUrl(geturl, "GET");
			dynamic messageJson = JsonConvert.DeserializeObject<dynamic>(strJson);
			return messageJson;
		}

		///获取code
		///http://www.cnmaker.org.cn/connect/oauth2/authorize?appid=666666&redirect_uri=http://www.1001hao.com/&response_type=code&scope=snsapi_userinfo&state=hhh
		///
		public static string GetCode(string appid,string redirecturi)
		{
			string geturl = string.Format("{0}?appid={1}&redirect_uri={2}&response_type=code&scope=snsapi_userinfo&state=hhh"
				, "http://www.cnmaker.org.cn/connect/oauth2/authorize", appid, redirecturi);
			string strJson = UtilHttpRequest.RequestUrl(geturl, "GET");
			return strJson;
		}
	}
}