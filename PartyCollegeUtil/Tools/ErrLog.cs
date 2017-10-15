using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;

namespace PartyCollegeUtil.Tools
{
	public class ErrLog
	{
		private static List<string> cacheLogList = new List<string>();
		private static int cacheCount = 10;

		public static int CacheCount
		{
			get
			{
				if (System.Configuration.ConfigurationManager.AppSettings["CacheLogRows"] != null)
				{
					return Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["CacheLogRows"]);
				}
				else
				{
					return cacheCount;
				}
			}
		}

		/// <summary>
		///  增加错误日志
		/// </summary>
		/// <param name="error"></param>
		public static void Log(int v)
		{
			Log(v.ToString());
		}

		public static void Log(Exception ex)
		{
			Log(ex, ex.ToString());
		}

		public static void Log(Exception e, string info)
		{
			StringBuilder s = new StringBuilder();
			s.Append(e.Message);
			s.Append(Environment.NewLine);
			StackTrace st = new StackTrace(true);
			for (int i = 1; i < st.FrameCount; i++)
			{
				//不记录Log函数。
				StackFrame sf = st.GetFrame(i);
				if (sf.GetFileLineNumber() <= 0)
				{
					continue;
				}

				MethodInfo mi = sf.GetMethod() as MethodInfo;
				if (mi == null || mi.Name == "Log")
				{
					continue;
				}
				ParameterInfo[] pi = mi.GetParameters();
				StringBuilder temp = new StringBuilder();
				for (int j = 0; j < pi.Length; j++)
				{
					if (j > 0) temp.Append(", ");
					temp.Append(pi[j].ParameterType.Name + " " + pi[j].Name);
				}
				s.Append(String.Format("	文件{0,-20} 第{1,4:G}行 第{2,4:G}列 {3}({4})",
					System.IO.Path.GetFileName(sf.GetFileName()),
					sf.GetFileLineNumber(),
					sf.GetFileColumnNumber(),
					mi.Name,
					"")); //temp
				s.Append(Environment.NewLine);
			}
			s.Append(info);
			Log(s);
		}


		public static void Log(string error)
		{
			error = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + "App" + " \n" + "" + " " + error;
			//查看是否有启用日志缓存，并默认设置缓存数据行数
			if (System.Configuration.ConfigurationManager.AppSettings["debugSQL"] == "true")
			{
				if (CacheCount < cacheLogList.Count)
				{
					WriteLogFile(cacheLogList);
					cacheLogList.Clear();
				}
				else
				{
					cacheLogList.Add(error);
				}
			}
		}

		/// <summary>
		/// 开始写入文件
		/// </summary>
		/// <param name="error"></param>
		public static void WriteLogFile(List<string> logList)
		{
			
			MyStopWatch.waiteWrite = true;
			string filename = MapPath("~/log/error" + DateTime.Now.ToString("yyyyMMdd") + ".log");
			int length = logList.Count;
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < length; i++)
			{
				sb.Append("\n").Append(logList[i]).Append("\n");
			}
			Console.WriteLine(sb);
			System.IO.TextWriter f = null;
			try
			{
				if (!Directory.Exists(MapPath("~/log")))
				{
					Directory.CreateDirectory(MapPath("~/log"));
				}
				f = new System.IO.StreamWriter(filename, true, System.Text.ASCIIEncoding.Default);
				f = TextWriter.Synchronized(f); //多线程化
				f.WriteLineAsync(sb.ToString());
			}
			catch (Exception ex)
			{

			}
			finally
			{
				f.Close();
				MyStopWatch.waiteWrite = false;
			}
		}

		/// <summary>
		/// 增加错误日志
		/// </summary>
		/// <param name="error"></param>
		public static void Log(object error)
		{
			Log(error.ToString());
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="url"></param>
		/// <returns></returns>
		public static string MapPath(string url)
		{
			string s = url;
			try
			{
				s = System.Web.HttpContext.Current.Server.MapPath(url);
			}
			catch { }
			return s;
		}
	}
}