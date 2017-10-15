using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace PartyCollegeUtil.Tools
{
	public class MyStopWatch
	{
		private static Stopwatch stopwatch;
		private static string TSname = string.Empty;

		private static List<string> cacheWatchLogList = new List<string>();
		private static int cacheWatchCount = 10;

		public static int CacheWatchCount
		{
			get
			{
				if (System.Configuration.ConfigurationManager.AppSettings["CacheStopWatchRows"] != null)
				{
					return Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["CacheStopWatchRows"]);
				}
				else
				{
					return cacheWatchCount;
				}
			}
		}

		private static DateTime? endTime = null;
		private static DateTime? queryTime = null;

		public static bool waiteWrite = false;

		/// <summary>
		/// 开始计时
		/// </summary>
		/// <param name="name"></param>
		public static void start(string name)
		{
			TSname = name;
			stopwatch = Stopwatch.StartNew();
		}

		private static DateTime? GetEndTime()
		{
			string sql = string.Empty;
			sql = "select * from sy_config where key_name=?key_name";
			DateTime? key_value = null;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
				cmd.CommandText = sql;
				cmd.Parameters.Add(new MySqlParameter("key_name", "stopwatchendtime"));
				DataTable dt = new DataTable();
				MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
				adpt.Fill(dt);
				
				if (dt.Rows.Count > 0)
				{
					if(!string.IsNullOrEmpty(dt.Rows[0]["key_value"].ToString())){
						key_value = Convert.ToDateTime(dt.Rows[0]["key_value"].ToString());
					}
					
				}
			}
			return key_value;
		}
		/// <summary>
		/// 结束计时
		/// </summary>
		public static void stop()
		{
			stopwatch.Stop();
			if (cacheWatchLogList.Count > CacheWatchCount)
			{
				ErrLog.WriteLogFile(cacheWatchLogList);
			}
			else
			{
				cacheWatchLogList.Add(string.Format("[{0}] [{1}]耗时:{2}毫秒 {3}", DateTime.Now.ToString(), TSname, stopwatch.ElapsedMilliseconds, HttpContext.Current.Request.Url.ToString()));
			}
		}

		public static void stop(string strlog)
		{
			stopwatch.Stop();
			//执行时间
			if ((queryTime==null||queryTime < DateTime.Now) && (endTime == null || endTime < DateTime.Now))
			{
				endTime = GetEndTime();
				queryTime = DateTime.Now.AddMinutes(1);
			}

			if (endTime != null)
			{
				DateTime excuteEndTime = Convert.ToDateTime(endTime);
				if (endTime > DateTime.Now)
				{
					if (cacheWatchLogList.Count > CacheWatchCount)
					{
						if (!waiteWrite)
						{
							ErrLog.WriteLogFile(cacheWatchLogList);
							cacheWatchLogList.Clear();
						}
					}
					else
					{
						cacheWatchLogList.Add(string.Format("[{0}] [{1}]耗时:{2}毫秒 {3} \n {4}", DateTime.Now.ToString(), TSname, stopwatch.ElapsedMilliseconds, HttpContext.Current.Request.Url.ToString(), strlog));
					}
				}
				else
				{
					if (cacheWatchLogList.Count > 0)
					{
						if (!waiteWrite)
						{
							ErrLog.WriteLogFile(cacheWatchLogList);
							cacheWatchLogList.Clear();
						}
					}
				}
			}
		}
		public static long ElapsedMilliseconds
		{
			get { return stopwatch.ElapsedMilliseconds; }
		}
	}
}