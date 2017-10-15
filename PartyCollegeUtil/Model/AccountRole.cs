using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_account_roles")]
	public class AccountRole: DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string Id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string AccountId { get; set; }
		[MyAttribute(FromSQL = true)]
		public string PlatformId { get; set; }
		[MyAttribute(FromSQL = true)]
		public string RoleId { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime CreateTime { get; set; }
		[MyAttribute(FromSQL = true)]
		public string CreateUser { get; set; }
	}
}