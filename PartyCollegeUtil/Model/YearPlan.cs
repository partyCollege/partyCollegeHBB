using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Model
{
	[Serializable]
	public class YearPlan
	{
		public string year { get; set; }
		public string rank { get; set; }
		public string departmentid { get; set; }
		public string departmentname { get; set; }
		public string studytime { get; set; }
	}
}
