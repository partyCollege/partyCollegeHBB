using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model.Cache
{
	public class CacheSmsTemplet
	{
		private static CacheSmsTempletConfig slc = null;
		public static CacheSmsTempletConfig AppSettings
		{
			get { return slc; }
		}
		static CacheSmsTemplet()
		{
			if (slc == null)
			{
				slc = new CacheSmsTempletConfig();
			}
		}
	}

	public class CacheSmsTempletConfig
	{
		private static Hashtable _htConfig;
		public CacheSmsTempletConfig()
		{
			if (_htConfig == null||true)
			{
				_htConfig = new Hashtable();
				this.IniConfig();
			}
		}

		private DataTable IniConfig()
		{
			DataTable dtConfig = new DataTable();
			MySqlConnection M_Conn = new MySqlConnection(DBConfig.ConnectionString);
			try
			{
				M_Conn.Open();
				string strSql = " SELECT * FROM sy_sms_template ".ToLower();
				MySqlDataAdapter M_Dapt = new MySqlDataAdapter(strSql, M_Conn);
				M_Dapt.Fill(dtConfig);
				string keyVal = string.Empty;
				foreach (DataRow drConfig in dtConfig.Rows)
				{
					SySmsTemplate cc = new SySmsTemplate();
					cc.id = drConfig["id"].ToString();
					cc.category = drConfig["category"].ToString();
					cc.comment = drConfig["comment"].ToString();
					cc.content = drConfig["content"].ToString();
					keyVal = cc.category;
					if (!_htConfig.Contains(keyVal))
					{
						_htConfig.Add(keyVal, cc);
					}
					else
					{
						_htConfig[keyVal] = cc;
					}
				}
			}
			catch { }
			finally
			{
				M_Conn.Close();
			}
			return dtConfig;
		}

		public SySmsTemplate this[string index]
		{
			get
			{
				return GetValue(index);
			}

		}

		public SySmsTemplate GetValue(string strKEY_NAME)
		{
			SySmsTemplate strReturn = new SySmsTemplate();

			//名称为空，返回空
			if (strKEY_NAME == "")
				return strReturn;

			//没有对应名称，先初始化
			//若修改了数据库的值，不会马上生效；需要重启IIS
			if (!_htConfig.Contains(strKEY_NAME) || true)
			{
				IniConfig();
			}

			//有对应名称，获取值
			if (_htConfig.Contains(strKEY_NAME))
			{
				SySmsTemplate cc = (SySmsTemplate)_htConfig[strKEY_NAME];
				//strReturn = CacheDimension.GetKeyVal(cc.Dimension,cc.Eventname);
				strReturn = cc;
			}

			return strReturn;
		}

		public void ReSetCacheDimension()
		{
			this.IniConfig();
		}
	}
}