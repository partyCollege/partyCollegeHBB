using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model.Cache
{
	[MyAttribute(TableName = "sy_sms_template")]
	public class SySmsTemplate
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string category { get; set; }
		[MyAttribute(FromSQL = true)]
		public string content { get; set; }
		[MyAttribute(FromSQL = true)]
		public string comment { get; set; }
	}
}