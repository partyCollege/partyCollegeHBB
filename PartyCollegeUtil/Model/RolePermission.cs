using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_role_permission")]
	public class RolePermission : DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string Id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string RoleId { get; set; }
		[MyAttribute(FromSQL = true)]
		public string PermissionId { get; set; }
	}
	public static class RolePermission_Extension
	{
		/// <summary>
		/// 获取
		/// </summary>
		/// <param name="accout"></param>
		/// <param name="query"></param>
		/// <returns></returns>
		
	}
}