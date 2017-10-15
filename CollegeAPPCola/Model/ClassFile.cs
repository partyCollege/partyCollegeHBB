using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public class ClassFile
    {
        public Decimal info_id { set; get; }
        public string nrbt { set; get; }
        public string filepath { set; get; }
        public DateTime rq { set; get; }

        public Decimal user_id { set; get; }

    }
}