using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace PartyCollegeUtil.Service
{
	public class AccountService
	{

		//
		public bool cancerManager(string accountid, string roleid, string userid, string departmentid)
		{
			bool result = false;
			string sql = string.Empty;			
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlTransaction tran = conn.BeginTransaction();
				MySqlCommand cmd = conn.CreateCommand();
				try
				{
					cmd.Parameters.Clear();
					sql = "delete from sy_account_roles where accountid =?accountid and roleid =?roleid";
					cmd.CommandText = sql;
					cmd.Parameters.Add(new MySqlParameter("accountid", accountid));
					cmd.Parameters.Add(new MySqlParameter("roleid", roleid));
					cmd.ExecuteNonQuery();

					cmd.Parameters.Clear();

					sql = "delete from sy_department_admin where userid=?accountid and departmentid=?departmentid";
					cmd.Parameters.Add(new MySqlParameter("accountid", accountid));
					cmd.Parameters.Add(new MySqlParameter("departmentid", departmentid));
					cmd.CommandText = sql;
					cmd.ExecuteNonQuery();

					cmd.Parameters.Clear();
					sql = "update sy_user set usertype =0 where id = ?userid";
					cmd.CommandText = sql;
					cmd.Parameters.Add(new MySqlParameter("userid", userid));
					cmd.ExecuteNonQuery();
					tran.Commit();
					result = true;
				}
				catch (Exception ex)
				{
					ErrLog.Log("取消管理员异常"+ex);
					tran.Rollback();
				}
			}
			return result;
		}
		public string getDoubleMd5String(string password)
		{
			string soltVal = "celap.com";
			Byte[] bytes = Encoding.Unicode.GetBytes(soltVal);
			string base64Str = Convert.ToBase64String(bytes);
			//获取要加密的字段，并转化为Byte[]数组   
			byte[] data = System.Text.Encoding.Unicode.GetBytes((password + base64Str).ToCharArray());
			//建立加密服务   
			System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
			//加密Byte[]数组   
			byte[] result = md5.ComputeHash(data);
			//将加密后的数组转化为字段
			StringBuilder sTemp = new StringBuilder();
			for (int i = 0; i < result.Length; i++)
			{
				sTemp.Append(result[i].ToString("x").PadLeft(2, '0'));
			}
			return sTemp.ToString();
		}

		public StringBuilder GetMd5String(string passwordStr)
		{
			//获取要加密的字段，并转化为Byte[]数组   
			byte[] data = System.Text.Encoding.Unicode.GetBytes((passwordStr).ToCharArray());
			//建立加密服务   
			System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
			//加密Byte[]数组   
			byte[] result = md5.ComputeHash(data);
			//将加密后的数组转化为字段
			StringBuilder sTemp = new StringBuilder();
			for (int i = 0; i < result.Length; i++)
			{
				sTemp.Append(result[i].ToString("x").PadLeft(2, '0'));
			}
			return sTemp;
		}
	}
}