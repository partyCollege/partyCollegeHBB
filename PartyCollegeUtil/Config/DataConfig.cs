using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Config
{
	public class DataConfig
	{
		public string KeyName { get; set; }
		public string DataSql { get; set; }
		public string LogTag { get; set; }
		public string LogGroup { get; set; }

		private bool enableSession = false;
		public bool EnableSession
		{
			get { return enableSession; }
			set { enableSession = value; }
		}
	}
}