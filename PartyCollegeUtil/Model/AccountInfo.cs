using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
    [MyAttribute(TableName = "sy_account")]
    public class AccountInfo : DbClass
    {
        [MyAttribute(FromSQL = true, IsKey = true)]
        public string Id { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Logname { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Pwd { get; set; }
        [MyAttribute(FromSQL = true)]
        public DateTime CreateTime { get; set; }
        [MyAttribute(FromSQL = true)]
        public string CreateUser { get; set; }
        [MyAttribute(FromSQL = true)]
        public string LastUpdateUser { get; set; }
        [MyAttribute(FromSQL = true)]
        public DateTime LastUpdateTime { get; set; }
        //[MyAttribute(FromSQL = true)]
        public string IdCard { get; set; }
        //[MyAttribute(FromSQL = true)]
        public string Name { get; set; }
        //[MyAttribute(FromSQL = true)]
        public int Sex { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Cellphone { get; set; }
        //[MyAttribute(FromSQL = true)]
        public int DefaultUserType { get; set; }
       //[MyAttribute(FromSQL = true)]
        public string DefaultClassId { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Photo_Servername { get; set; }
        [MyAttribute(FromSQL = true)]
        public string Photo_Serverthumbname { get; set; }

        [MyAttribute(FromSQL = true)]
        public int Status { get; set; }

        public bool IsNew { get; set; }
    }

	public static class AccountInfo_Extension
	{
        /// <summary>
        /// 获取
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public static AccountInfo get(this AccountInfo account, MySqlConnection conn, params SQLQuery[] query)
        {
            AccountInfo accountTemp = new AccountInfo();
            accountTemp = DB_ORM.DBHelp.QueryOne<AccountInfo>(conn, SQLQueryMade.Add(query), false);
            return accountTemp;
        }
		/// <summary>
		/// 获取,用于登录
		/// </summary>
		/// <param name="accout"></param>
		/// <param name="query"></param>
		/// <returns></returns>
		public static AccountInfo get(this AccountInfo account,MySqlConnection conn)
		{
			AccountInfo accountTemp = new AccountInfo();
			string sql = string.Empty;
			sql = "select * from sy_account acc where logname=?logname or cellphone=?logname";
			MySqlCommand cmd= conn.CreateCommand();
			cmd.CommandText = sql;
			cmd.Parameters.Add(new MySqlParameter("logname", account.Logname));
			MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
			DataTable dtdata = new DataTable();
			adpt.Fill(dtdata);
			if (dtdata.Rows.Count!=1)
			{
				return null;
			}

			DataRow row = dtdata.Rows[0];
			accountTemp.Id = row["id"].ToString();
			accountTemp.Cellphone = row["cellphone"].ToString();
			accountTemp.CreateTime =Convert.ToDateTime(row["createtime"].ToString());
			accountTemp.CreateUser = row["createuser"].ToString();
			accountTemp.DefaultClassId = row["defaultclassid"].ToString();
			accountTemp.DefaultUserType = Convert.ToInt32("0" + row["defaultusertype"].ToString());
			accountTemp.IdCard = row["idcard"].ToString();
			accountTemp.LastUpdateTime =Convert.ToDateTime( row["LastUpdateTime"].ToString());
			accountTemp.LastUpdateUser = row["LastUpdateUser"].ToString();
			accountTemp.Logname = row["logname"].ToString();
			accountTemp.Name = row["name"].ToString();
			accountTemp.Photo_Servername = row["photo_servername"].ToString();
			accountTemp.Photo_Serverthumbname = row["photo_serverthumbname"].ToString();
			accountTemp.Pwd = row["pwd"].ToString();
			accountTemp.Sex =Convert.ToInt32("0"+ row["sex"].ToString());
			accountTemp.Status = Convert.ToInt32("0"+ row["status"].ToString());
			return accountTemp;
		}

		/// <summary>
		/// 获取
		/// </summary>
		/// <param name="accout"></param>
		/// <param name="query"></param>
		/// <returns></returns>
		public static AccountInfo get(this AccountInfo account, params SQLQuery[] query)
		{
			AccountInfo accountTemp = null;
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				accountTemp = DB_ORM.DBHelp.QueryOne<AccountInfo>(conn, SQLQueryMade.Add(query), false);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return accountTemp;
		}

		//public static AccountInfo checkIdCard(this AccountInfo account)
		//{
		//	account

		//	return accountTemp;
		//}
		public static bool Save(this AccountInfo accout)
		{
			bool result = false;
			MySqlConnection conn = null;
			try
			{
				conn = new MySqlConnection(DBConfig.ConnectionString);
				conn.Open();
				accout.insert(conn);
				result = true;
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
			}
			finally
			{
				conn.Close();
			}
			return result;
		}
	}
}