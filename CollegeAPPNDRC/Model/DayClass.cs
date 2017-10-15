using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public class DayClass
    {
        public string dayOfWeek { set; get; }
        public string kcname { set; get; }
        public Decimal info_id { set; get; }
        public Decimal kc_id { set; get; }
        public string teacher { set; get; }
        public string address { set; get; }
        public DateTime kssj { set; get; }
        public DateTime jssj { set; get; }

        public string bz2 { set; get; }

        public int dayWeek { set; get; }

        public string jxxs { set; get; }
        public List<ClassFile> classFile { set; get; }

    }
}