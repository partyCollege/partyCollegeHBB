using System;
using System.Data;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.OleDb;
using MySql.Data.MySqlClient;

namespace PartyCollege.Model
{
	public static class SystemConfig
	{
		private static SystemLogicConfig slc = null;
		public static SystemLogicConfig AppSettings
		{
			get { return slc; }
		}
		static SystemConfig()
		{
			if (slc == null)
			{
				slc = new SystemLogicConfig();
			}
		}
	}

	public class SystemLogicConfig
	{

		private static Hashtable _htConfig;
		public SystemLogicConfig()
		{
			if (_htConfig == null)
			{
				_htConfig = new Hashtable();
				this.IniConfig();
			}
		}

		/// <summary>
		/// ��ʼ������
		/// </summary>
		/// <returns></returns>
		public DataTable IniConfig()
		{
			DataTable dtConfig = new DataTable();
			OleDbConnection M_Conn = new OleDbConnection(System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"].ToString());
			try
			{

				M_Conn.Open();
				//OleDbCommand cmd = new OleDbCommand();
				//cmd.Connection = M_Conn;
				//cmd.CommandText = "execute as user= 'dsoa'";
				//cmd.ExecuteNonQuery();

				string strSql = " SELECT CLASS,KEY_NAME,KEY_VALUE,MEMO,VISIBLE FROM SYS_CONFIG ".ToLower();

				OleDbDataAdapter M_Dapt = new OleDbDataAdapter(strSql, M_Conn);
				M_Dapt.Fill(dtConfig);
				foreach (DataRow drConfig in dtConfig.Rows)
				{
					ConfigCase cc = new ConfigCase();
					cc.CLASS = drConfig["CLASS"].ToString();
					cc.KEY_NAME = drConfig["KEY_NAME"].ToString();
					cc.KEY_VALUE = drConfig["KEY_VALUE"].ToString();
					cc.MEMO = drConfig["MEMO"].ToString();
					cc.VISIBLE = drConfig["VISIBLE"].ToString();
					if (!_htConfig.Contains(drConfig["KEY_NAME"]))
					{
						_htConfig.Add(drConfig["KEY_NAME"], cc);
					}
					else
					{
						_htConfig[drConfig["KEY_NAME"]] = cc;
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

		/// <summary>
		/// ��������
		/// </summary>
		/// <param name="alConfig">����ʵ������</param>
		/// <returns></returns>
		public string UpdateConfig(List<ConfigCase> alConfig)
		{
			string strReturn = "";

			OleDbConnection M_Conn = new OleDbConnection(System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"].ToString());
			try
			{
				string strSql = " UPDATE SYS_CONFIG SET KEY_VALUE=? WHERE KEY_NAME =? ";
				M_Conn.Open();
				OleDbCommand M_Comm = new OleDbCommand();
				M_Comm.Connection = M_Conn;
				for (int i = 0; i < alConfig.Count; i++)
				{
					// ConfigCase cc = (ConfigCase)alConfig[i];
					ConfigCase cc = alConfig[i];
					M_Comm.CommandText = strSql;
					M_Comm.Parameters.Clear();

					M_Comm.Parameters.Add(new MySqlParameter("@KEY_VALUE", MySqlDbType.LongText));
					M_Comm.Parameters["@KEY_VALUE"].Value = cc.KEY_VALUE;

					M_Comm.Parameters.Add(new MySqlParameter("@KEY_NAME", MySqlDbType.VarChar));
					M_Comm.Parameters["@KEY_NAME"].Value = cc.KEY_NAME;

					//�������ݿ��ֵ
					M_Comm.ExecuteNonQuery();

					//���¾�̬���ñ��ֵ
					if (_htConfig.Contains(cc.KEY_NAME))
					{
						ConfigCase ccOld = (ConfigCase)_htConfig[cc.KEY_NAME];
						ccOld.KEY_VALUE = cc.KEY_VALUE;
						_htConfig[cc.KEY_NAME] = ccOld;
					}

				}
			}
			catch (Exception ex)
			{
				strReturn = ex.ToString();
			}
			finally
			{
				M_Conn.Close();
			}

			return strReturn;
		}
		public string this[string index]
		{
			get
			{
				return GetValue(index);
			}

		}

		//ͨ�����Ƶõ�ĳ��������Ϣֵ
		public string GetValue(string strKEY_NAME)
		{
			string strReturn = "";

			//����Ϊ�գ����ؿ�
			if (strKEY_NAME == "")
				return strReturn;

			//û�ж�Ӧ���ƣ��ȳ�ʼ��
			//���޸������ݿ��ֵ������������Ч����Ҫ����IIS
			if (!_htConfig.Contains(strKEY_NAME))
			{
				IniConfig();
			}

			//�ж�Ӧ���ƣ���ȡֵ
			if (_htConfig.Contains(strKEY_NAME))
			{
				ConfigCase cc = (ConfigCase)_htConfig[strKEY_NAME];
				strReturn = cc.KEY_VALUE;
			}

			return strReturn;
		}
	}

	/// <summary>
	/// ����ʵ��
	/// </summary>
	public struct ConfigCase
	{
		public string CLASS;           //����
		public string KEY_NAME;        //����
		public string KEY_VALUE;       //ֵ
		public string MEMO;            //��ע
		public string VISIBLE;         //�ɼ�
	}
}
