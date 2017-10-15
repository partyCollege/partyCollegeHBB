using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Config
{
	public class DBConfig
	{
		public static readonly string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
		public static readonly string LogConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["LogConnectionString"].ConnectionString;
		public static string getConnectionString(string keyName){
			return System.Configuration.ConfigurationManager.ConnectionStrings[keyName].ConnectionString;
		}
	}
}