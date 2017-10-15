using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;

namespace CollegeAPP
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
        {
            HttpContext.Current.SetSessionStateBehavior(
                SessionStateBehavior.Required);
        }
        public override void Init()
        {
            PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
            base.Init();
        }
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AccessTokenContainer.Register(System.Configuration.ConfigurationManager.AppSettings["_corpId"], System.Configuration.ConfigurationManager.AppSettings["_corpSecret"]);
            JsApiTicketContainer.Register(System.Configuration.ConfigurationManager.AppSettings["_corpId"], System.Configuration.ConfigurationManager.AppSettings["_corpSecret"]);
        }
    }
}
