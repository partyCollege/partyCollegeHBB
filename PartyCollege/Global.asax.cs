using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;

namespace PartyCollege
{
    public class WebApiApplication : System.Web.HttpApplication
    {
		void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
		{
			//给api启用session
			HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
		}
		public override void Init()
		{
			PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
			base.Init();
		}
		protected void Application_Start()
		{
			GlobalConfiguration.Configure(WebApiConfig.Register);
			string a = string.Empty;
		}
        protected void Session_End(object s, EventArgs e)
        {
			string SessionID = HttpContext.Current.Session.SessionID;
			object user = HttpContext.Current.Session["user"];
        }
		protected void Session_OnEnd(object s, EventArgs e)
		{
			string SessionID = HttpContext.Current.Session.SessionID;
			object user = HttpContext.Current.Session["user"];
		}
    }
}
