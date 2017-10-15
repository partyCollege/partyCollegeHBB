using Newtonsoft.Json;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.Containers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http;

namespace CollegeAPP
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务

            // Web API 路由
            // Web API 路由

            // Web API 配置和服务
            try {
                AccessTokenContainer.Register(System.Configuration.ConfigurationManager.AppSettings["_corpId"], System.Configuration.ConfigurationManager.AppSettings["_corpSecret"]);

            }
            catch (Exception e) { }
            config.MapHttpAttributeRoutes();
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings =
             new JsonSerializerSettings
             {
                 DateFormatHandling = DateFormatHandling.IsoDateFormat,
                 DateTimeZoneHandling = DateTimeZoneHandling.Local,
                 Culture = CultureInfo.GetCultureInfo("zh-cn"),
                 DateParseHandling = DateParseHandling.DateTime,
             };


            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
