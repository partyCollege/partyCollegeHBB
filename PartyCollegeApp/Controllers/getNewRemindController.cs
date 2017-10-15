using Codeplex.Data;
using CollegeAPP.DataModel;
using CollegeAPP.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace CollegeAPP.Controllers
{
    public class getNewRemindController : ApiController
    {

        // GET: api/getNewRemind
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }


        // GET api/getNewRemind/5
        public string Get(int id)
        {
            return "value";
        }


        [HttpGet]
        [Route("api/getNewRemind/{userid}")]
        public string GetRemindData(string userid)
        {
            List<dynamic> errors = new List<dynamic>();
            List<dynamic> returnVal = new List<dynamic>();
            Dictionary<string, object> data = new Dictionary<string, object>();
            data.Add("userid", userid);
            try
            {
                CommonSQL sql = new CommonSQL();
                List<string> source = new List<string>();
                returnVal = sql.getRemindDataSource(data);
            }
            catch (Exception ex)
            {
                ErrLog.Log(ex);
                errors.Add(new { error = "数据库执行出错" });
            }
            if (errors.Count > 0)
            {
                return errors.ToString();
            }
            else
            {
                int numcount = returnVal.Count;
                string result = "";
                if (numcount > 0)
                {
                    string nguid = Guid.NewGuid().ToString().Replace("-", "");
                    int num1 = 0;
                    result = "{";
                    result += "\"messageid\":\"" + nguid + "\",";
                    result += "\"rows\":";
                    result += "[";
                    foreach (dynamic i in returnVal)
                    {
                        num1++;
                        result += "{";
                        string kvalue = "";
                        foreach (dynamic j in i)
                        {
                            string mkey = Convert.ToString(j.Key);
                            string mvalue = Convert.ToString(j.Value);
                            kvalue += "\"" + mkey + "\":\"" + mvalue + "\",";
                        }
                        if (kvalue != "")
                        {
                            kvalue = kvalue.Substring(0, kvalue.Length - 1);
                        }
                        result += kvalue;
                        if (num1 != numcount)
                        {
                            result += "},";
                        }
                        else
                        {
                            result += "}";
                        }

                    }
                    result += "]}";
                }
                return result;
            }
        }


        [HttpGet]
        [Route("api/GetRemindFuckData/{userid}")]
        public JObject GetRemindFuckData(string userid)
        {
            JObject j = new JObject();
            string ret = string.Empty;
            string guid = Guid.NewGuid().ToString();

            StringBuilder sb = new StringBuilder();

            JavaScriptSerializer json = new JavaScriptSerializer();
            json.Serialize(new { messageId = "0cfa318d47derf8a485aac405j694971", title = "你有一条新的消息", content = "你有一条新的消息" }, sb);
            ret = sb.ToString();
            j = JObject.Parse(sb.ToString());
            return j;
        }

        [HttpGet]
        [Route("api/updateNotice/{userid}/{obj}")]
        public void updateNotice(string userid, string obj)
        {
            G_INBOX ginbox = new G_INBOX();
            ginbox.USER_ID = userid.ToString();
            ginbox.updateLastReadTime(obj);

        }

        [Route("api/getNewRemindNotice/{userid}/{usertype}")]
        public NoticePackage getNewRemindNotice(string userid, string usertype)
        {
            List<notice> noticeList = new List<notice>();
            G_INBOX ginbox = new G_INBOX();
            ginbox.USER_ID = userid.ToString();
            string apiRoot = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace("getNewRemindNotice/" + userid + "/" + usertype, "") + "updateNotice/" + userid + "/";
            string json = File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath("~/config/AppConfig.json"));
            var jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(NoticeConfig));
            NoticeConfig noticeConfig = (NoticeConfig)jsonObj;
            List<G_INBOX> list = new List<G_INBOX>();
            foreach (var c in noticeConfig.notice)
            {
                notice nowNotice = new notice();
                //SessionModel session = (SessionModel)HttpContext.Current.Session["user"];
                if (c.type != usertype)
                {
                    continue;
                }
                switch (c.obj)
                {
                    case "db":
                        try
                        {
                            list = ginbox.getModule();
                            nowNotice = getNotice(list, ginbox, true, c);
                        }
                        catch (Exception e)
                        { }
                        break;
                    case "gysyxx":
                        try
                        {
                            DateTime lastReadTime1 = ginbox.getLastReadTime(c.obj);
                            list = ginbox.getGYXYXX(lastReadTime1);
                            nowNotice = getNotice(list, ginbox, true, c);
                        }
                        catch (Exception e)
                        { }
                        break;
                    case "tzgg":
                        try
                        {
                            list = ginbox.getTZGG();
                            nowNotice = getNotice(list, ginbox, true, c);
                        }
                        catch (Exception e)
                        { }
                        break;
                    case "daiyue":
                        try
                        {
                            DateTime lastReadTime = ginbox.getLastReadTime(c.obj);
                            list = ginbox.getDYXX(lastReadTime);
                            nowNotice = getNotice(list, ginbox, false, c);
                        }
                        catch (Exception e)
                        { }
                        break;
                    case "":
                        break;
                    case "kc":
                        try
                        {
                            nowNotice = getKCNotice(c, Convert.ToInt32(userid));
                        }
                        catch (Exception e)
                        { }
                        break;
                    case "studentKC":
                        nowNotice = getStudentKCNotice(c, userid);
                        break;
                    case "studentPJ":
                        nowNotice = getStudentPJNotice(c, userid);
                        break;

                }
                if (!string.IsNullOrEmpty(nowNotice.title) || !string.IsNullOrEmpty(nowNotice.content))
                {
                    nowNotice.action = apiRoot + c.obj;
                    nowNotice.messageId = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(nowNotice.content, "MD5").ToLower();
                    noticeList.Add(nowNotice);
                }
            }
            //noticeList.Add(tz);
            NoticePackage package = new NoticePackage();
            package.messageId = Guid.NewGuid().ToString();
            package.rows = noticeList;
            return package;
        }

        public static notice getStudentPJNotice(Notice notice, string userid)
        {
            notice returnVal = new notice();
            if (canNotice(userid, notice))
            {
                KCWH kwch = new KCWH();
                List<KCWH> kwlist = kwch.getStudentPJ(userid.ToString());
                if (kwlist.Count > 0)
                {
                    returnVal.action = notice.id;
                    returnVal.content = notice.message.Replace("[bt]", kwlist[0].kcname).Replace("[count]", kwlist.Count.ToString());
                    returnVal.title = notice.title.Replace("[count]", kwlist.Count.ToString());
                    returnVal.num = kwlist.Count;
                    returnVal.type = Convert.ToInt32(notice.id);
                }
            }


            return returnVal;
        }
        public static notice getStudentKCNotice(Notice notice, string userid)
        {
            notice returnVal = new notice();
            if (canNotice(userid, notice))
            {
                KCWH kwch = new KCWH();
                List<KCWH> kwlist = kwch.getStudentKC(userid.ToString());
                if (kwlist.Count > 0)
                {
                    returnVal.action = notice.id;
                    returnVal.content = notice.message.Replace("[bt]", kwlist[0].kcname);
                    returnVal.title = notice.title.Replace("[count]", kwlist.Count.ToString());
                    returnVal.num = kwlist.Count;
                    returnVal.type = Convert.ToInt32(notice.id);
                }
            }


            return returnVal;
        }
        /// <summary>
        /// 获取定时提醒是否应该再次推送
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="notice"></param>
        /// <returns></returns>
        private static bool canNotice(string userid, Notice notice)
        {
            bool returnVal = false;
            G_INBOX ginbox = new G_INBOX();
            ginbox.USER_ID = userid.ToString();
            DateTime lastReadTime = ginbox.getLastReadTime(notice.obj);
            int delayTime = 5;
            if (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]))
            {
                delayTime = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]);
            }
            if (notice.remindtime.Length == 0)
            {
                returnVal = true;
                return returnVal;
            }
            Dictionary<DateTime, DateTime> timeList = new Dictionary<DateTime, DateTime>();
            bool isNowNeedNotice = false;
            foreach (var c in notice.remindtime)
            {
                DateTime dt = Convert.ToDateTime(c);
                DateTime st = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
                st = st.AddHours(dt.Hour).AddMinutes(dt.Minute).AddMinutes(-delayTime);
                DateTime et = st.AddMinutes(delayTime * 2);
                timeList.Add(st, et);
                //以上查询出需要提醒的单个时间段
                if (DateTime.Now >= st && DateTime.Now <= et)
                {
                    isNowNeedNotice = true;
                    //目前定义为只要在提醒时间范围内就提醒，这样会有多次提醒。到时候看逻辑再修改
                    returnVal = true;
                }
            }


            return returnVal;
        }
        private static notice getKCNotice(Notice notice, int userid)
        {
            notice n = new notice();
            int delayTime = 5;
            if (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]))
            {
                delayTime = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]);
            }
            DateTime dt = Convert.ToDateTime(System.Configuration.ConfigurationManager.AppSettings["remindTime"]);
            DateTime st = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            st = st.AddHours(dt.Hour).AddMinutes(dt.Minute).AddMinutes(-delayTime);
            DateTime et = st.AddMinutes(delayTime * 2);
            if (DateTime.Now >= st && DateTime.Now <= et)
            {
                KCWH kw = new KCWH();
                List<KCWH> kwlist = kw.getKCDB(userid.ToString());
                n.title = notice.title.Replace("[count]", kwlist.Count.ToString());
                n.type = Convert.ToInt32(notice.id);
                n.content = "您明天的课程为:";
                foreach (var c in kwlist)
                {
                    n.content += c.KSSJ.ToShortTimeString() + " " + c.kcname + " " + c.address + ",";
                }
                n.content = n.content.Trim(",".ToCharArray());
            }

            return n;
        }
        private static notice getNotice(List<G_INBOX> list, G_INBOX ginbox, bool needFind, Notice notice)
        {
            List<G_INBOX> nowlist = list;
            notice n = new notice();
            if (needFind)
            {
                DateTime lastReadTime = ginbox.getLastReadTime(notice.obj);
                nowlist = list.FindAll(delegate(G_INBOX g) { return g.RDATE > lastReadTime; });
            }
            if (nowlist.Count > 0)
            {
                n = new notice { type = Convert.ToInt32(notice.id), title = notice.title.Replace("[count]", nowlist.Count.ToString()), content = notice.message.Replace("[bt]", nowlist[0].BT), action = notice.obj };
            }
            else
            {
                n = new notice { type = 0, title = string.Empty, content = string.Empty, action = string.Empty };
            }
            return n;
        }




        //[HttpPost]
        //[Route("api/getNewRemind/action/test")]

        //public dynamic test([FromUri]string v1)
        //{
        //    //test([FromBody]JObject json)
        //      List<dynamic> returnVal = new List<dynamic>();
        //   // dynamic dm = json;

        //    return returnVal;
        //}

        //public void Post([FromBody]string value)
        // {
        //     HttpContextBase context = (HttpContextBase)Request.Properties["MS_HttpContext"];//获取传统context
        //     HttpRequestBase request = context.Request;//定义传统request对象
        //     string name = request.Form["name"];

        // }





        // POST api/getNewRemind
        public void Post([FromBody]string value)
        {
        }

        // PUT api/getNewRemind/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/getNewRemind/5
        public void Delete(int id)
        {
        }
    }

}