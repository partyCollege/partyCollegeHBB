using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    [MyAttribute(TableName = "G_USERS")]
    public class G_USERS : DbClass
    {
        public G_USERS()
        {
            this.roles = new List<string>();
        }
        [MyAttribute(FromSQL = true, IsKey = true)]
        public string id { get; set; }
        [MyAttribute(FromSQL = true)]
        public string uname { get; set; }
        [MyAttribute(FromSQL = true)]
        public string logname { get; set; }
        [MyAttribute(FromSQL = true)]
        public string psd { get; set; }
        [MyAttribute(FromSQL = true)]
        public string md5psd { get; set; }
        [MyAttribute(FromSQL = true)]
        public string utype { get; set; }
        [MyAttribute(FromSQL = true)]
        public string mainCode { get; set; }
        [MyAttribute(FromSQL = true)]
        public string zppath { get; set; }
        [MyAttribute(FromSQL = true)]
        public int status { get; set; }
        public string department { get; set; }
        [MyAttribute(FromSQL = true)]
        public string mobile_email { get; set; }

        [MyAttribute(FromSQL = true)]
        public string mobileby { get; set; }

        [MyAttribute(FromSQL = true)]
        public string TEL { set; get; }
        [MyAttribute(FromSQL = true)]
        public string EMAIL { set; get; }
        public string ZP { set; get; }
        public List<string> roles { set; get; }
        public string onecard { set; get; }
        public string ishandpsd { set; get; }
        public string handpsd { set; get; }
    }
}