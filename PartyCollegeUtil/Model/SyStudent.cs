using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
	[MyAttribute(TableName = "sy_student")]
	public class SyStudent : DbClass
	{
		[MyAttribute(FromSQL = true, IsKey = true)]
		public string Id { get; set; }
		[MyAttribute(FromSQL = true)]
		public string IdCard { get; set; }
		[MyAttribute(FromSQL = true)]
		public string AccountId { get; set; }
	}
	public static class SyStudent_Extension
	{
		/// <summary>
		/// 获取单个学员信息
		/// </summary>
		/// <param name="student"></param>
		/// <returns></returns>
		public static SyStudent get(this SyStudent student, params SQLQuery[] query)
		{
			SyStudent stuTemp = null;
			MySqlConnection conn=null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				stuTemp = DB_ORM.DBHelp.QueryOne<SyStudent>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return stuTemp;
		}
		public static void myUpdate(this SyStudent student,MySqlConnection conn,MySqlTransaction tran)
		{
			bool result = false;
			string sql = string.Empty;
			sql = "update sy_student set accountid=?accountid where id=?id";
			MySqlCommand mycmd = new MySqlCommand(sql, conn);
			mycmd.Parameters.Clear();
			mycmd.Parameters.Add(new MySqlParameter("accountid",student.AccountId));
			mycmd.Parameters.Add(new MySqlParameter("id", student.Id));
			mycmd.ExecuteNonQuery();
		}
		public static List<SyStudent> getList(this SyStudent student, params SQLQuery[] query)
		{
			List<SyStudent> stuTempList = null;
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				stuTempList = DB_ORM.DBHelp.Query<SyStudent>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return stuTempList;
		}
		/// <summary>
		/// 
		/// </summary>
		/// <param name="student"></param>
		/// <param name="idcard"></param>
		/// <returns></returns>
		public static DataTable getListByIdCard(this SyStudent student, string idcard)
		{
			MySqlConnection conn = null;
			DataTable dtdata = new DataTable();
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				string sql = string.Empty;
				//注册不用关心班级时间是否超过。
				sql = @"select stu.id,c.platformid,c.id as classid from sy_student stu inner join sy_class c on stu.classid=c.id where stu.idcard=?idcard
						union all
						select stu.id,c.platformid,c.id as classid from sy_student stu inner join sy_multiclass c on stu.classid=c.id where stu.idcard=?idcard2 ";
				MySqlCommand mycmd = new MySqlCommand(sql, conn);
				mycmd.Parameters.Add(new MySqlParameter("idcard", idcard));
				mycmd.Parameters.Add(new MySqlParameter("idcard2", idcard));
				MySqlDataAdapter adpt = new MySqlDataAdapter(mycmd);
				adpt.Fill(dtdata);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return dtdata;
		}

		public static DataTable getList(this SyStudent student, string idcard,string platformid)
		{
			string sql = string.Empty;
			sql = "select stu.id,c.platformid,c.id as classid from sy_student stu inner join sy_class c on stu.classid=c.id where stu.idcard=?idcard and c.platformid=?platformid";
			DataTable dtdata = new DataTable();
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand mycmd = new MySqlCommand(sql, conn);
				mycmd.Parameters.Add(new MySqlParameter("idcard", idcard));
				mycmd.Parameters.Add(new MySqlParameter("platformid", platformid));
				MySqlDataAdapter adpt = new MySqlDataAdapter(mycmd);
				adpt.Fill(dtdata);
			}
			return dtdata;
		}

		public static DataTable getGraduationList(this SyStudent student,string accountid)
		{
			string sql = string.Empty;
			sql = "select stu.* from sy_student stu inner join sy_class c on stu.classid=c.id where stu.accountid=?accountid order by stu.createtime desc limit 1";
			DataTable dtdata = new DataTable();
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand mycmd = new MySqlCommand(sql, conn);
				mycmd.Parameters.Add(new MySqlParameter("accountid", accountid));
				MySqlDataAdapter adpt = new MySqlDataAdapter(mycmd);
				adpt.Fill(dtdata);
			}
			return dtdata;
		}
	}
}