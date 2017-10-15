using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Senparc.Weixin.QY;
using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.AdvancedAPIs.Chat;
using Senparc.Weixin.QY.Entities;
using MySql.Data.MySqlClient;
using Senparc.Weixin.Entities;
using System.Data;
using Senparc.Weixin.QY.Helpers;
using System.Web;

namespace CollegeAPP.Controllers.wxController
{
    public class jsTicket
    {
        public string jsticket { set; get; }
        public string appId { set; get; }
        public string nonceStr { set; get; }
        public string signature { set; get; }
        public string timestamp { set; get; }
    }
    public class wxJSTicketsController : ApiController
    {
        public string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
        public string connectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/chart
        public void Get()
        {
            //string token = AccessTokenContainer.GetToken(corpId);
            //dynamic returnVal = new { jsTicket = string.Empty, appId = string.Empty, nonceStr = string.Empty, signature = string.Empty, timestamp = string.Empty };
            //JsApiTicketResult result = JsApiTicketContainer.GetTicketResult(corpId);
            ////returnVal.jsTicket = result.ticket;
            ////JsApiTicketContainer.TryGetTicket("123",123)
            //string host = HttpContext.Current.Request.Url.Host;
            
            //JSSDKHelper he = new JSSDKHelper();
            //string noncestr = JSSDKHelper.GetNoncestr();
            //string timestamp = JSSDKHelper.GetTimestamp();
            //string s = HttpContext.Current.Request.UserHostAddress;
            ////string sign = JSSDKHelper.GetSignature(result.ticket, noncestr, timestamp, "http://hudongwxy.com:8080/WebRoot/hdstreetapptest/Views/index_weixin.html?weixin=" + context.Server.UrlEncode(name));
            //string sign = he.GetSignature(result.ticket, noncestr, timestamp, System.Configuration.ConfigurationManager.AppSettings["JSTicketsPath"]);
            //jsTicket tick = new jsTicket();
            //tick.jsticket = result.ticket;
            //tick.appId = corpId;
            //tick.nonceStr = noncestr;
            //tick.signature = sign;
            //tick.timestamp = timestamp;
            //return tick;

        }

        // GET: api/chart/5
        public string Get(int id)
        {
            return "value";
        }
        // PUT: api/chart/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/chart/5
        public void Delete(int id)
        {
        }
    }
}
