using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Tools
{
    public class getConfig
    {
        public static JArray arr = new JArray();
        public static JObject appConfigArr = new JObject();
        public static JArray getSQLConfig()
        {
            if (arr.Count == 0 ||!Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["memoryConfig"]))
            arr = (JArray)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/sqlconfig.json")));
            return arr;
        }

        public static void refalshSQLConfig()
        {
            arr = (JArray)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/sqlconfig.json")));
        }

        public static JObject getAppConfig()
        {
            if (appConfigArr.Count == 0||! Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["memoryConfig"]))
                appConfigArr = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/appConfig.json")));
            return appConfigArr;
        }

        public static void refalshAppConfig()
        {
            appConfigArr = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(HttpContext.Current.Server.MapPath("~/config/appConfig.json")));
        }
    }
}