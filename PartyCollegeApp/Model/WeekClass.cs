using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public class WeekClass
    {
        public string bcname { set; get; }
       public  Decimal info_id { set; get; }
       public List<DayClass> dayclass{set;get;}
    }
    public class kqData
    {
        public string info_id{set;get;}
        public string status{set;get;}
    }
}