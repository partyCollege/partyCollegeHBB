using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class SyCodeService
    {


        /// <summary>
        /// 批量获取sycode的数据
        /// </summary>
        /// <param name="syCodes">class集合</param>
        /// <returns></returns>
        public List<dynamic> getSyCodes(string[] syCodes)
        {
            string sql = @"select id,datavalue,showvalue from sy_code where category=?class order by orderby";
             
            List<dynamic> codeList = new List<dynamic>();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                MySqlDataAdapter adpt;
              
                foreach (var code in syCodes)
                {
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("class", code));
                    DataTable dt = new DataTable();
                    adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);

                    dynamic dyn = new
                    {
                        type = code,
                        list = UtilDataTableToList<dynamic>.ToDynamicList(dt)
                    };
                    codeList.Add(dyn);
                }

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }
            return codeList;
        }
    }
}