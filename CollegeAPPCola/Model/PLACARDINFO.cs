using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    [MyAttribute(TableName = "PLACARDINFO")]
    public class PLACARDINFO : DbClass
    {
        [MyAttribute(FromSQL = true, IsKey = true)]
        public string REPORTID { set; get; }
        [MyAttribute(FromSQL = true)]
        public DateTime ONDATE { set; get; }
        [MyAttribute(FromSQL = true)]
        public string INFO_ID { set; get; }
        [MyAttribute(FromSQL = true)]
        public string USERS { set; get; }
        [MyAttribute(FromSQL = true)]
        public string TITLE { set; get; }
    }
}