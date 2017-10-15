using CollegeAPP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using CollegeAPP.DataModel;

namespace CollegeAPP.Controllers
{
        public class NoticePackage
    {
        public string messageId { set; get; }
        public List<notice> rows = new List<notice>();

    }
    public class notice
    {
        public notice() {
            this.num = 0;
            this.title = string.Empty;
            this.content = string.Empty;
        }
        public string title { set; get; }
        public string content { set; get; }
        public int num { set; get; }
        public int type { set; get; }
        public string action { set; get; }

        public string messageId { set; get; }
    }
    public class getNoticeController : ApiController
    {
        // GET: api/getNotice/5
        [HttpGet]
        [Route("api/getNotice/{userid}")]
        public IEnumerable<notice> Get(int userid)
        {
            List<notice> noticeList = new List<notice>();
            G_INBOX ginbox = new G_INBOX();
            ginbox.USER_ID = userid.ToString();


            string json = File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath("~/config/AppConfig.json"));
            var jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(NoticeConfig));
            NoticeConfig noticeConfig = (NoticeConfig)jsonObj;
            List<G_INBOX> list = new List<G_INBOX>();
            foreach (var c in noticeConfig.notice)
            {
                notice nowNotice = new notice();
                switch (c.obj)
                {
                    case "db":
                        list = ginbox.getModule();
                        nowNotice = getNotice(list, ginbox, true, c);
                        break;
                    case "gysyxx":
                        DateTime lastReadTime1 = ginbox.getLastReadTime(c.obj);
                        list = ginbox.getGYXYXX(lastReadTime1);
                        nowNotice = getNotice(list, ginbox, true, c);
                        break;
                    case "tzgg":
                        list = ginbox.getTZGG();
                        nowNotice = getNotice(list, ginbox, true, c);
                        break;
                    case "daiyue":
                        DateTime lastReadTime = ginbox.getLastReadTime(c.obj);
                        list = ginbox.getDYXX(lastReadTime);
                        nowNotice = getNotice(list, ginbox, false, c);
                        break;
                    case "":

                        break;
                    case "kc":
                        nowNotice = getKCNotice(c,userid);
                        break;
                    case "studentKC":
                        nowNotice = getStudentKCNotice(c);
                        break;
                        
                }
                if (!string.IsNullOrEmpty(nowNotice.content))
                {
                    noticeList.Add(nowNotice);
                }
            }
            //noticeList.Add(tz);
            return noticeList;
        }

        public static notice getStudentKCNotice(Notice notice)
        {
            notice returnVal = new notice();
            returnVal.action = notice.id;
            returnVal.content = "最新课程为不知道";
            returnVal.title = "最新课程";
            returnVal.num = 3;
            returnVal.type = Convert.ToInt32(notice.id);
            return returnVal;
        }
        public static notice getKCNotice(Notice notice,int userid)
        {
            notice n = new notice();
            int delayTime = 5;
            if (!string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]))
            {
               delayTime= Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["remindTimeDelay"]);
            }
            DateTime dt = Convert.ToDateTime(System.Configuration.ConfigurationManager.AppSettings["remindTime"]);
            DateTime st = new DateTime(DateTime.Now.Year,DateTime.Now.Month,DateTime.Now.Day);
            st= st.AddHours(dt.Hour).AddMinutes(dt.Minute).AddMinutes(-delayTime);
            DateTime et = st.AddMinutes(delayTime*2);
            if (DateTime.Now >= st && DateTime.Now <= et)
            {
                KCWH kw = new KCWH();
                List<KCWH> kwlist= kw.getKCDB(userid.ToString());
                n.title = notice.title.Replace("[count]",kwlist.Count.ToString());
                n.type =Convert.ToInt32( notice.id);
                n.content="您明天的课程为:";
                foreach (var c in kwlist)
                {
                    n.content += c.KSSJ.ToShortTimeString() + " " + c.kcname + " " + c.address+",";
                }
                n.content = n.content.Trim(",".ToCharArray());
            }

            return n;
        }
        public static notice getNotice(List<G_INBOX> list, G_INBOX ginbox, bool needFind, Notice notice)
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
        // POST: api/getNotice
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/getNotice/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/getNotice/5
        public void Delete(int id)
        {
        }
    }
}
