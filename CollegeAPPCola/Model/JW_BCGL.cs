using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
	[MyAttribute(TableName = "JW_BCGL")]
	public class JW_BCGL : DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string info_id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string pjVersion { get; set; }

		[MyAttribute(FromSQL = true)]
		public string pjPlanEdition { get; set; }

		[MyAttribute(FromSQL = true)]
		public string isyjs { get; set; }
	}
}