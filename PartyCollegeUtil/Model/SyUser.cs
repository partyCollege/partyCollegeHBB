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
	[MyAttribute(TableName = "sy_user")]
	public class SyUser : DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string Id { get; set; }
		
		[MyAttribute(FromSQL = true)]
		public string CreateUser { set; get; }
		[MyAttribute(FromSQL = true)]
		public DateTime CreateTime { set; get; }
		[MyAttribute(FromSQL = true)]
		public DateTime LastUpdateTime { set; get; }
		[MyAttribute(FromSQL = true)]
		public string LastUpdateUser { set; get; }
		[MyAttribute(FromSQL = true)]
		public int Status { set; get; }
		[MyAttribute(FromSQL = true)]
		public string AccountId { set; get; }
		[MyAttribute(FromSQL = true)]
		public string PlatformId { set; get; }
		[MyAttribute(FromSQL = true)]
		public string Name { set; get; }
		[MyAttribute(FromSQL = true)]
		public string Cellphone { set; get; }

		[MyAttribute(FromSQL = true)]
		public string Nation { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Political { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Rank { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Positions { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Officetel { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Provice { get; set; }
		[MyAttribute(FromSQL = true)]
		public string City { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Area { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Email { get; set; }
		[MyAttribute(FromSQL = true)]
		public string Company { set; get; }
		[MyAttribute(FromSQL = true)]
		public string CompanyAddress { get; set; }
		public bool IsNew { get; set; }
		
	}
	public static class SyUser_Extension
	{
		public static SyUser get(this SyUser syuser,MySqlConnection conn, params SQLQuery[] query)
		{
			SyUser syuserTemp = null;
			try
			{
				syuserTemp = DB_ORM.DBHelp.QueryOne<SyUser>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return syuserTemp;
		}
		/// <summary>
		/// 获取
		/// </summary>
		/// <param name="accout"></param>
		/// <param name="query"></param>
		/// <returns></returns>
		public static SyUser get(this SyUser syuser, params SQLQuery[] query)
		{
			SyUser syuserTemp = null;
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				syuserTemp = DB_ORM.DBHelp.QueryOne<SyUser>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return syuserTemp;
		}
	}
}