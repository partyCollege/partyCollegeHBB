using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public class Discuz
    {
        public UInt32 fid { set; get; }
        public UInt32 tid { set; get; }
        public string name { set; get; }
        public string subject { set; get; }
        public string dateline { set; get; }
    }
}