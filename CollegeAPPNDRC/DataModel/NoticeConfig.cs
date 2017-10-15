using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.DataModel
{
    public class NoticeConfig
    {
       public List<Notice> notice = new List<Notice>();
    }

    public class Notice
    {
        public string name { set; get; }
        public string obj { set; get; }
        public string id { set; get; }
        public string title { set; get; }
        public string message { set; get; }
        public string type { set; get; }
        public string[] remindtime { set; get; }
    }
}