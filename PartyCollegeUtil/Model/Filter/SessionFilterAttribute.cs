using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace PartyCollege.Model.Filter
{
	public class SessionCheckFilterAttribute:ActionFilterAttribute
	{
		public override void OnActionExecuting(HttpActionContext actionContext)
		{
			bool NewSession = HttpContext.Current.Session.IsNewSession; 

			//string SessionID = HttpContext.Current.Session.SessionID;
			//object user = HttpContext.Current.Session["user"];
			//HttpContext.Current.Session.Abandon();
			//var query = HttpUtility.ParseQueryString(actionContext.Request.RequestUri.Query);
			//string sessionKey = qs[SessionKeyName];
			//if (string.IsNullOrEmpty(sessionKey))
			//{
			//	throw new Exception("Invalid Session.");
			//}
			////validate user session
			//var userSession="aa"; //查询数据库
			//if (userSession == null)
			//{
			//	throw new Exception("sessionKey not found");
			//}
			//else
			//{

			//}
			//if (HttpContext.Current.Session["user"] == null)
			//{
			//	actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
			//}
			//else
			//{
			//	actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.OK);
			//}
			base.OnActionExecuting(actionContext);
		}
	}
}