using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Service.back
{
    public class newsService
    {

        public dynamic batchInsertNewsRelation(dynamic arrayModel)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    //int forlength = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(arrayModel.Count) / 200));
                    StringBuilder sbsql = new StringBuilder();
                    for (int i = 0; i < arrayModel.Count; i++)
                    {
                        dynamic item =arrayModel[i];
                        sbsql.AppendFormat("('{0}','{1}','{2}',0),", item.id, item.newsid, item.sourceid);

                    }
                   comm.CommandText = " insert into sy_news_relation values  " + sbsql.ToString().TrimEnd(',');
                   comm.ExecuteNonQuery();

                }
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
