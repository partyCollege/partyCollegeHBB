using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model.Cache
{
	public class SlErrLog
	{
		public string username { get; set; }
		public string userid { get; set; }
		public string classid { get; set; }
		public string platformid { get; set; }
		public string usertype { get; set; }
		public string classname { get; set; }
		public string handle { get; set; }
		public DateTime handletime { get; set; }
		public string handlecategory { get; set; }
	}
	public static class CacheLog
	{
		private static string sqlTemplet = @"INSERT INTO sl_log_[tablename] (username ,userid ,classid ,platformid ,usertype ,classname ,handle ,handletime ,handlecategory ) VALUES (?username,?userid,?classid,?platformid,?usertype,?classname,?handle,?handletime,?handlecategory)";
		private static List<SlErrLog> logtable = new List<SlErrLog>();
		private static int maxRows = 60;
		private static bool IsExcute = false;

		public static int MaxRows
		{
			get
			{
				if (System.Configuration.ConfigurationManager.AppSettings["CacheBusinessRows"] != null)
				{
					return Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["CacheBusinessRows"]);
				}
				else
				{
					return CacheLog.maxRows;
				}
			}
		}
		public static void SaveLog(dynamic msg)
		{
			//当日期跨天，则执行完当天的任务。
			string now = DateTime.Now.ToString("yyyy-MM-dd");
			SlErrLog log = new SlErrLog();
			log.username = Convert.ToString(msg.username);
			log.userid = Convert.ToString(msg.userid);
			log.classid = Convert.ToString(msg.classid);
			log.platformid = Convert.ToString(msg.platformid);
			log.usertype = Convert.ToString(msg.usertype);
			log.classname = Convert.ToString(msg.classname);
			log.handle = Convert.ToString(msg.handle);
			log.handletime = Convert.ToDateTime(msg.handletime);
			log.handlecategory = Convert.ToString(msg.handlecategory);
			logtable.Add(log);
			//当容器超过5分钟就执行一次。
			if (!IsExcute)
			{
				//当容器已满，执行插入。
				ExcuteDBLog();
			}
		}


		private static void ExcuteDBLog()
		{
			IsExcute = true;
			string tablename = string.Empty;
			List<SlErrLog> list = logtable.Where(u => u.handletime <= DateTime.Now.AddSeconds(-maxRows)).ToList<SlErrLog>();
			int length = list.Count;
			if (length <= 0)
			{
				IsExcute = false;
				return;
			}
			using (MySqlConnection conn = new MySqlConnection(DBConfig.LogConnectionString))
			{
				conn.Open();
				MySqlCommand cmmd = conn.CreateCommand();
				try
				{
					List<SlErrLog> templist = new List<SlErrLog>();
					SlErrLog dataobj = null;
					for (int i = 0; i < length; i++)
					{
						dataobj = list[i];
						tablename = Convert.ToDateTime(dataobj.handletime).ToString("yyyy_MM");
						cmmd.CommandText = sqlTemplet.Replace("[tablename]", tablename);
						cmmd.Parameters.Clear();
						cmmd.Parameters.Add(new MySqlParameter("username", dataobj.username));
						cmmd.Parameters.Add(new MySqlParameter("userid", dataobj.userid));
						cmmd.Parameters.Add(new MySqlParameter("classid", dataobj.classid));
						cmmd.Parameters.Add(new MySqlParameter("platformid", dataobj.platformid));
						cmmd.Parameters.Add(new MySqlParameter("usertype", dataobj.usertype));
						cmmd.Parameters.Add(new MySqlParameter("classname", dataobj.classname));
						cmmd.Parameters.Add(new MySqlParameter("handle", dataobj.handle));
						cmmd.Parameters.Add(new MySqlParameter("handletime", dataobj.handletime));
						cmmd.Parameters.Add(new MySqlParameter("handlecategory", dataobj.handlecategory));
						int count = cmmd.ExecuteNonQuery();
						templist.Add(dataobj);
					}

					int cclength = templist.Count;
					for (int i = 0; i < length; i++)
					{
						dataobj = templist[i];
						logtable.Remove(dataobj);
					}
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex);
				}
			}
			IsExcute = false;
		}

		public static void ExcuteDBLog(dynamic dynModel)
		{
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmmd = conn.CreateCommand();
				try
				{
					cmmd.CommandText = "insert into sy_error_info(id,filename,methodname,errorline,message,msginfo,createtime,errorlevel,studentid,arguments) values(uuid(),?filename,?methodname,?errorline,?message,?msginfo,now(),?errorlevel,?studentid,?arguments)";
					cmmd.Parameters.Clear();
					cmmd.Parameters.Add(new MySqlParameter("filename", Convert.ToString(dynModel.filename)));
					cmmd.Parameters.Add(new MySqlParameter("methodname", Convert.ToString(dynModel.methodname)));
					cmmd.Parameters.Add(new MySqlParameter("errorline", Convert.ToString(dynModel.errorline)));
					cmmd.Parameters.Add(new MySqlParameter("message", Convert.ToString(dynModel.message)));
					cmmd.Parameters.Add(new MySqlParameter("msginfo", Convert.ToString(dynModel.msginfo)));
					cmmd.Parameters.Add(new MySqlParameter("studentid", Convert.ToString(dynModel.studentid)));
					cmmd.Parameters.Add(new MySqlParameter("arguments", Convert.ToString(dynModel.arguments)));
					cmmd.Parameters.Add(new MySqlParameter("errorlevel", Convert.ToString(dynModel.errorlevel)));
					int exec = cmmd.ExecuteNonQuery();
				}
				catch (Exception ex)
				{
					ErrLog.Log("日志异常：" + ex);
				}
			}
		}

		public static void ExcuteDBLog(string gKey, string message, string msgInfo)
		{
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmmd = conn.CreateCommand();
				try
				{
					cmmd.CommandText = "insert into sy_error_info(id,filename,message,msginfo,createtime,errorlevel) values(uuid(),?filename,?message,?msginfo,now(),3)";
					cmmd.Parameters.Clear();
					cmmd.Parameters.Add(new MySqlParameter("filename", gKey));
					cmmd.Parameters.Add(new MySqlParameter("message", message));
					cmmd.Parameters.Add(new MySqlParameter("msginfo", msgInfo));
					int exec = cmmd.ExecuteNonQuery();
				}
				catch (Exception ex)
				{
					ErrLog.Log("日志异常：" + ex);
				}
			}
		}

	}
}