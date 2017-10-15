using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.AdvancedAPIs.OAuth2;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Controllers.wxController
{
    /// <summary>
    /// Redicet 的摘要说明
    /// </summary>
    public class Redicet : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string url = context.Request.Url.AbsoluteUri;
            string corpid = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
            string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
            string accessToken = AccessTokenContainer.GetToken(corpid, _corpSecret);
            GetUserInfoResult result = OAuth2Api.GetUserId(accessToken, context.Request.QueryString["code"], "");
            GetMemberResult memResult = MailListApi.GetMember(accessToken, result.UserId);
            context.Response.Write("正在获取微信身份进入应用");
            Random ra = new Random();
            context.Response.Redirect("~/Html/index_wx.html#/autoLogin/" + memResult.mobile+"/"+ra.Next());
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}