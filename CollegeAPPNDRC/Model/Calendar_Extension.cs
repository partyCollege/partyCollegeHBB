using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Web;

namespace CollegeAPP.Model
{
    public static class Calendar_Extension
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];

        public static List<Calendar> getCalendar(this Calendar cel, DateTime st, DateTime et, string userid)
        {
            List<Calendar> returnList = new List<Calendar>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                string strSql = "select A.id,A.userid,A.title as name,A.sdt as st,A.edt as et,A.addr,A.cyusernames,A.edttimeshow,B.utype,nvl(C.fjsl,0) fjsl,A.ZY,A.BMRCSTATUS " +
                " from rc_infos A join G_users B on A.userid = B.id " +
                " left join (select rcid, count(id) fjsl from rc_fj group by rcid) C on A.id = C.rcid " +
                " where (A.status <> -1) " +
                " and ( " +
                "( A.id in ( select rcid from rc_cyuser where cyuserid in (" + userid+ ")  ) )" +
                " ) and ( :st <=A.edt and A.sdt<= :et) " +
                " order by A.sdt";
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = strSql;
                cmd.Parameters.Add(new MySqlParameter("st", st));
                cmd.Parameters.Add(new MySqlParameter("et", et));
                MySqlDataAdapter oda = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                returnList=UtilDataTableToList<Calendar>.ConvertToList(dt);
            }
            return returnList;
        }
        //public void LoadData()
        //{
        //    DateTime sd = CDate;
        //    DateTime ed = CDate.AddDays(1);

        //    DataTable table = null;
        //    List<string> mark = new List<string>();

        //    using (MySqlConnection cn = new MySqlConnection(DSOA.Common.DSOAConfiguration.ConnectionString_OleDb))
        //    {
        //        try
        //        {
        //            cn.Open();
        //            string strSql = "select A.id,A.userid,A.title,A.sdt,A.edt,A.addr,A.cyusernames,A.edttimeshow,B.utype,nvl(C.fjsl,0) fjsl,A.ZY,A.BMRCSTATUS " +
        //                            " from rc_infos A join G_users B on A.userid = B.id " +
        //                            " left join (select rcid, count(id) fjsl from rc_fj group by rcid) C on A.id = C.rcid " +
        //                            " where (A.status <> -1) " +
        //                            " and ( " +
        //                            "( A.id in ( select rcid from rc_cyuser where cyuserid in (" + Session["userid"] + ")  ) )" +
        //                            " ) and ( to_date('" + sd.ToString("yyyy-MM-dd") + "','yyyy-mm-dd') <=A.edt and A.sdt<= to_date('" + ed.ToString("yyyy-MM-dd") + "','yyyy-mm-dd')) " +
        //                            " order by A.sdt";
        //            MySqlCommand cmd = cn.CreateCommand();
        //            cmd.CommandText = strSql;
        //            MySqlDataAdapter da = new MySqlDataAdapter(cmd);
        //            table = new DataTable();
        //            da.Fill(table);

        //            DateTime st = new DateTime(CDate.Year, CDate.Month, 1);
        //            DateTime et = st.AddMonths(1);
        //            strSql = "select A.id,A.userid,A.title,A.sdt,A.edt,A.addr,A.cyusernames,A.edttimeshow,B.utype,nvl(C.fjsl,0) fjsl,A.ZY,A.BMRCSTATUS " +
        //                        " from rc_infos A join G_users B on A.userid = B.id " +
        //                        " left join (select rcid, count(id) fjsl from rc_fj group by rcid) C on A.id = C.rcid " +
        //                        " where (A.status <> -1) " +
        //                        " and ( " +
        //                        "( A.id in ( select rcid from rc_cyuser where cyuserid in (" + Session["userid"] + ")  ) )" +
        //                        " ) and ( to_date('" + st.ToString("yyyy-MM-dd") + "','yyyy-mm-dd') <=A.edt and A.sdt<= to_date('" + et.ToString("yyyy-MM-dd") + "','yyyy-mm-dd')) " +
        //                        " order by A.sdt";
        //            cmd.CommandText = strSql;
        //            using (MySqlDataReader reader = cmd.ExecuteReader())
        //            {
        //                while (reader.Read())
        //                {
        //                    DateTime d = reader["sdt"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["sdt"]);
        //                    string datestr = d == DateTime.MinValue ? string.Empty : d.Year + "-" + d.Month + "-" + d.Day;

        //                    DateTime e = reader["edt"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["edt"]);

        //                    TimeSpan ts = e - d;
        //                    int dt = ts.Days;
        //                    if (dt > 0)
        //                    {
        //                        int j = 0;
        //                        DateTime dTemp;
        //                        for (int i = 0; i <= dt; i++)
        //                        {

        //                            dTemp = d.AddDays(j);
        //                            datestr = d == DateTime.MinValue ? string.Empty : dTemp.Year + "-" + dTemp.Month + "-" + dTemp.Day;
        //                            if (!string.IsNullOrEmpty(datestr) && !mark.Contains(datestr))
        //                            {
        //                                mark.Add(datestr);
        //                            }
        //                            j++;
        //                        }
        //                    }
        //                    else
        //                    {
        //                        if (!string.IsNullOrEmpty(datestr) && !mark.Contains(datestr))
        //                        {
        //                            mark.Add(datestr);
        //                        }
        //                    }
        //                }
        //            }

        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //    List<RCData> list = new List<RCData>();
        //    if (table != null)
        //    {
        //        for (int i = 0; i < table.Rows.Count; i++)
        //        {
        //            DataRow r = table.Rows[i];
        //            RCData data = new RCData();
        //            data.Id = Convert.ToInt32(r["ID"]);
        //            data.Date = Convert.ToDateTime(r["SDT"]).ToString("HH:mm");
        //            data.Name = Convert.ToString(r["TITLE"]);
        //            list.Add(data);
        //        }
        //    }

        //    json = Newtonsoft.Json.JsonConvert.SerializeObject(list);

        //    markJson = Newtonsoft.Json.JsonConvert.SerializeObject(mark);
        //}
    }
    public class RCData
    {
        private int id = 0;
        private string date = string.Empty;
        private string name = string.Empty;
        public string Date
        {
            get
            {
                return date;
            }
            set
            {
                date = value;
            }
        }
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }
        public int Id
        {
            get
            {
                return id;
            }
            set
            {
                id = value;
            }
        }

    }
}