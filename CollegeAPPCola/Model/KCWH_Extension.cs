using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Data;

namespace CollegeAPP.Model
{

    public static class KCWH_Extension
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];

        /// <summary>
        /// 获取未评价课程
        /// </summary>
        /// <param name="kcwh"></param>
        /// <param name="onecard"></param>
        /// <returns></returns>
        public static List<KCWH> getStudentPJ(this KCWH kcwh, string onecard)
        {
            List<KCWH> returnKCWH = new List<KCWH>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select kcwh.*,g1.bt from jw_kcwh kcwh
                                                    inner join jw_kck kck on kcwh.kc_id=kck.info_id
                                                    inner join g_infos g1 on g1.id=kcwh.info_id and g1.deleted<>-1
                                                    inner join jw_kcfb fb on fb.kwinfo_id=kcwh.info_id
                                                    inner join jw_kcfbindex indx on indx.id=fb.fid
                                                    inner join jw_bcgl bc on bc.info_id=indx.info_id
                                                    inner join g_infos g2 on g2.id=bc.info_id and g2.deleted<>-1
                                                    where 1>0 
                                                    and bc.info_id=(select finfo_id from sub_file_relation where onecard=:onecard)
                                                    and fb.kwtype is not null 
                                                    and kcwh.kc_id is not null
                                                    and kcwh.jssj<sysdate
                                                    and not exists(select * from jw_appraise ja 
                                                    inner join sub_file_relation sub on ja.userid=sub.info_id and sub.finfo_id=ja.bcid where ja.bcid=bc.info_id and ja.kwid=g1.id
                                                    and ja.version=bc.pjversion
                                                    and ja.plan=bc.pjplanedition
                                                    and sub.xxzt=0
                                                    --and ja.pjtypeid='[pjtypeid]'
                                                    and ja.pjtype='class'
                                                    AND sub.onecard=:onecard1
                                                    )
                                                    ";
                comm.Parameters.Add(new MySqlParameter("onecard", onecard));
                comm.Parameters.Add(new MySqlParameter("onecard1", onecard));
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    KCWH kw = new KCWH();
                    kw.address = dr["kcdd"].ToString();
                    kw.KSSJ = Convert.ToDateTime(dr["kssj"]);
                    kw.JSSJ = Convert.ToDateTime(dr["jssj"]);
                    kw.kcname = dr["bt"].ToString();
                    returnKCWH.Add(kw);
                }

            }
            return returnKCWH;
        }
        /// <summary>
        /// 获取当天大于当前时间的课程列表
        /// </summary>
        /// <param name="kcwh"></param>
        /// <param name="onecard"></param>
        /// <returns></returns>
        public static List<KCWH> getStudentKC(this KCWH kcwh, string onecard)
        {
            List<KCWH> returnKCWH = new List<KCWH>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select g.bt,kw.zjr,kw.kcdd,kw.kssj,kw.jssj from sub_file_relation re1
                                                        inner join sub_file_relation re2
                                                        on re2.finfo_id=re1.finfo_id
                                                        inner join jw_kcwh kw
                                                        on kw.info_id=re2.info_id
                                                        inner join g_infos g
                                                        on g.id=kw.info_id
                                                        where re1.onecard=:onecard and to_char(kw.kssj,'yyyy-MM-dd')=:nowday
                                                        and kw.kssj>:now
                                                        order by kssj";
                comm.Parameters.Add(new MySqlParameter("onecard", onecard));
                comm.Parameters.Add(new MySqlParameter("nowday", DateTime.Now.ToString("yyyy-MM-dd")));
                comm.Parameters.Add(new MySqlParameter("now", DateTime.Now));

                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    KCWH kw = new KCWH();
                    kw.address = dr["kcdd"].ToString();
                    kw.KSSJ = Convert.ToDateTime(dr["kssj"]);
                    kw.JSSJ = Convert.ToDateTime(dr["jssj"]);
                    kw.kcname = dr["bt"].ToString();
                    returnKCWH.Add(kw);
                }

            }
            return returnKCWH;
        }
        public static List<KCWH> getKCDB(this KCWH kcwh,string userid)
        {
            string jsid=string.Empty;
            List<KCWH> returnKCWH=new List<KCWH>();
            using(MySqlConnection conn=new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm=conn.CreateCommand();
                comm.CommandText = "select info_id from jw_jsxx where oauser_uid=:oauserid";
                comm.Parameters.Add(new MySqlParameter("oauserid",userid));
                using(MySqlDataReader odr=comm.ExecuteReader())
                {
                    if(odr.Read())
                    {
                        jsid=odr["info_id"].ToString();
                    }
                }
                if(!string.IsNullOrEmpty(jsid))
                {
                    comm.Parameters.Clear();
                    comm.CommandText=@"select g.bt, kw.kssj, kw.jssj, kw.kcdd
                                                              from jw_kcfb fb
                                                             inner join jw_kcwh kw
                                                                on fb.kwinfo_id = kw.info_id
                                                             inner join g_infos g
                                                                on g.id = kw.info_id
                                                             where kw.js_id like '%"+jsid+@"%'
                                                               and to_char(kw.kssj, 'yyyy-MM-dd') = '"+DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")+"'";
                    DataTable dt=new DataTable();
                    MySqlDataAdapter oda=new MySqlDataAdapter(comm);
                    oda.Fill(dt);
                    foreach(DataRow dr in dt.Rows)
                    {
                        KCWH kw=new KCWH();
                        kw.address=dr["kcdd"].ToString();
                        kw.KSSJ=Convert.ToDateTime(dr["kssj"]);
                        kw.JSSJ=Convert.ToDateTime(dr["jssj"]);
                        kw.kcname=dr["bt"].ToString();
                        returnKCWH.Add(kw);
                    }
                }
            }
            return returnKCWH;
        }
    }
}