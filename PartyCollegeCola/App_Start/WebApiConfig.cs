using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http;

namespace PartyCollege
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Filters.Add(new WebApiExceptionFilterAttribute());

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
