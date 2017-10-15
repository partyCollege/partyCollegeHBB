using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    [MyAttribute(TableName = "JW_QINGJIA")]
    public class qingjia:DbClass
    {
        [MyAttribute(FromSQL = true, IsKey = true)]
        public string INFO_ID { set; get; }

        [MyAttribute(FromSQL = true)]
        public string BCINFO_ID { set; get; }

        [MyAttribute(FromSQL = true)]
        public string XYINFO_ID { set; get; }

        [MyAttribute(FromSQL = true)]
        public DateTime SDATE { set; get; }

        [MyAttribute(FromSQL = true)]
        public DateTime EDATE { set; get; }

        [MyAttribute(FromSQL = true)]
        public string CONTENT { set; get; }

        [MyAttribute(FromSQL = true)]
        public DateTime CREATEDATE { set; get; }

        [MyAttribute(FromSQL = true)]
        public int ISAUDITING { set; get; }

        [MyAttribute(FromSQL = true)]
        public string CREATEUSER { set; get; }

        [MyAttribute(FromSQL = true)]
        public string BCMC { set; get; }

        [MyAttribute(FromSQL = true)]
        public string QJLX { set; get; }

        [MyAttribute(FromSQL = true)]
        public string SPZT { set; get; }

        [MyAttribute(FromSQL = true)]
        public int SQCX { set; get; }

        public int SFCX { set; get; }

        public string ImgserverId { set; get; }

    }
}