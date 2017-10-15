using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_onlineuser")]
	public class OnlineUser : DbClass
	{
		[MyAttribute(FromSQL =true, IsKey = true)]
		public string AccountId { get; set; }
		[MyAttribute(FromSQL = true)]
		public DateTime LoginTime { get; set; }
		[MyAttribute(FromSQL = true)]
		public string SessionId { get; set; }
		[MyAttribute(FromSQL = true)]
		public int ExpireTime { get; set; }

		[MyAttribute(FromSQL = true)]
		public string BrowerVersion { get; set; }
		[MyAttribute(FromSQL = true)]
		public string BrowerCore { get; set; }
		[MyAttribute(FromSQL = true)]
		public string UserAgent { get; set; }

		[MyAttribute(FromSQL = true)]
		public string ClientType { get; set; }
		[MyAttribute(FromSQL = true)]
		public string ClientIp { get; set; }
		[MyAttribute(FromSQL = true)]
		public int Isonline { get; set; }
		[MyAttribute(FromSQL = true)]
		public string PlatformId { get; set; }
	}

	public static class OnlineUser_Extension
	{
		static string ConnectionString = DBConfig.ConnectionString;
		public static OnlineUser get(this OnlineUser onlineuser)
		{
			OnlineUser onlineuserTemp = null;
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				conn.Open();
				onlineuserTemp = DB_ORM.DBHelp.QueryOne<OnlineUser>(conn, SQLQueryMade.Add(new SQLQuery("accountid", Opertion.equal, onlineuser.AccountId)
				), false);
			}
			return onlineuserTemp;
		}

		public static void Save(this OnlineUser onlineuser)
		{
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				conn.Open();
				onlineuser.insert(conn);
			}
		}

		public static void Update(this OnlineUser onlineuser)
		{
			using (MySqlConnection conn = new MySqlConnection(ConnectionString))
			{
				conn.Open();
				List<SQLQuery> list = new List<SQLQuery>();
				list.Add(new SQLQuery("logintime", Opertion.equal, onlineuser.LoginTime));
				list.Add(new SQLQuery("sessionid", Opertion.equal, onlineuser.SessionId));
				onlineuser.update(conn);
			}
		}
	}
}