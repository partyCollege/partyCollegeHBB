using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.DataModel
{
    public class AppMessage
    {
        public AppMessage()
        {
            this.roles = new List<string>();
        }
        public bool msgStatus { get; set; }
        public string msgContent { get; set; }
        public string onecard { set; get; }
        public string userid { get; set; }
        public string uname { get; set; }
        public string mainDept { set; get; }
        public List<string> roles { set; get; }
    }
}