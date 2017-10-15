using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;
namespace PartyCollege
{
    public class SessionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (HttpContext.Current.Session["accountId"] == null)
            {
                HttpResponseMessage msg = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("not login"),
                    ReasonPhrase = "not login",
                    StatusCode= System.Net.HttpStatusCode.Unauthorized
                };
                actionContext.Response = msg;
            }

            base.OnActionExecuting(actionContext);
        }
    }
}