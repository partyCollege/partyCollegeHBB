using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_permission")]
	public class PermissionInfo : DbClass
	{
		[MyAttribute(FromSQL = true,IsKey=true)]
		public string Id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Name { get; set; }
		[MyAttribute(FromSQL = true)]
		public string GroupName { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Comment { get; set; }
		[MyAttribute(FromSQL = true)]
		public int SysLevel { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime CreateTime { get; set; }
		[MyAttribute(FromSQL = true)]
		public string CreateUser { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime LastUpdateTime { get; set; }
		[MyAttribute(FromSQL = true)]
		public string LastUpdateUser { get; set; }
		public bool Checked { get; set; }
        public bool IsNew { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Category { get; set; }
	}

	public static class PermissionInfo_Extension
	{
		public static List<PermissionInfo> get(this PermissionInfo pinfo)
		{
			List<PermissionInfo> permissionList = new List<PermissionInfo>();
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				permissionList = DB_ORM.DBHelp.Query<PermissionInfo>(conn, false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return permissionList;
		}
		public static List<PermissionInfo> get(this PermissionInfo pinfo, params SQLQuery[] query)
		{
			List<PermissionInfo> permissionList = null;
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				permissionList = DB_ORM.DBHelp.Query<PermissionInfo>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return permissionList;
		}
	}
}