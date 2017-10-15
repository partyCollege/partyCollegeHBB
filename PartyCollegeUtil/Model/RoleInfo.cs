using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_role")]
	public class RoleInfo : DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string Id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Name { get; set; }
		[MyAttribute(FromSQL = true)]
		public int Status { get; set; }
		[MyAttribute(FromSQL = true)]
		public string PlatformId { get; set; }
		[MyAttribute(FromSQL = true)]
		public int SysLevel { get; set; }
		[MyAttribute(FromSQL = true)]
		public string CreateUser { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime CreateTime { get; set; }
		[MyAttribute(FromSQL = true)]
		public string LastUpdateUser { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime LastUpdateTime { get; set; }
	}
	public static class RoleInfo_Extension
	{
		public static List<RoleInfo> get(this RoleInfo pinfo, params SQLQuery[] query)
		{
			List<RoleInfo> roleList = new List<RoleInfo>();
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				roleList = DB_ORM.DBHelp.Query<RoleInfo>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return roleList;
		}
	}
}