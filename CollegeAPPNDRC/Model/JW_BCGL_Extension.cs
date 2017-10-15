using MySql.Data.MySqlClient;
using PartyCollegeUtil.DB_ORM;
using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
	public static class JW_BCGL_Extension
	{
		static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
		public static JW_BCGL get(this JW_BCGL bc)
        {
			JW_BCGL bctemp = null;
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
				bctemp = DBHelp.QueryOne<JW_BCGL>(conn, SQLQueryMade.Add(new SQLQuery("info_id", Opertion.equal, bc.info_id)
                ), false);
            }
			return bctemp;
        }
	}
}