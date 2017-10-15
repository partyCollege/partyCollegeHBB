using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PartyCollegeUtil.DB_ORM;

namespace Model
{
    [MyAttribute(TableName = "JWYJS_BCGL")]
    public class JWYJS_BCGL : DbClass
    {
        [MyAttribute(IsKey = true, FromSQL = true)]
        public string INFO_ID { get; set; }

        [MyAttribute(FromSQL = true)]
        public DateTime KSSJ { set; get; }

        [MyAttribute(FromSQL = true)]
        public DateTime JSSJ { set; get; }

        [MyAttribute(FromSQL = true)]
        public int FBSTATUS { set; get; }

        [MyAttribute(FromSQL = true)]
        public int PKTYPE { set; get; }

        [MyAttribute(FromSQL = true)]
        public int PKDAY { set; get; }
    }
}