using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.OleDb;
using System.Data;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Tools;

namespace CollegeAPP.Model
{
    public static class DayClass_Extension
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public static List<WeekClass> getWeekClass(this WeekClass nowclass, DateTime datetime, string handler, int bcinfo_id)
        {
            List<WeekClass> returnVal = new List<WeekClass>();
            int dayOfWeek = Convert.ToInt32(datetime.DayOfWeek);
            int daydiff = (-1) * dayOfWeek + 1;
            if (dayOfWeek == 0)
            {
                daydiff = -6;
            }
            int dayadd = 5 - dayOfWeek;

            DateTime st = datetime.AddDays(daydiff);
            DateTime et = st.AddDays(6);
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select g.bt as bcname,bc.info_id from jw_bcgl bc inner join g_infos g on g.id=bc.info_id where to_char(bc.pxsj,'yyyy-MM-dd') <= to_char(to_date(:et,'yyyy-MM-dd'),'yyyy-MM-dd') and to_char(bc.pxsj_js,'yyyy-MM-dd') >=  to_char(to_date(:st,'yyyy-MM-dd'),'yyyy-MM-dd') and g.deleted>-1";
                comm.Parameters.Add(new MySqlParameter("et", et.ToString("yyyy-MM-dd")));
                comm.Parameters.Add(new MySqlParameter("st", st.ToString("yyyy-MM-dd")));
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable classTable = new DataTable();
                oda.Fill(classTable);
                returnVal = UtilDataTableToList<WeekClass>.ConvertToList(classTable);
                foreach (var c in returnVal)
                {
                    comm.Parameters.Clear();
                    comm.CommandText = @"select '星期' as dayOfWeek, g.bt as kcname,kw.bz2,kw.zjr||kw.js as teacher, kw.kcdd as address, kw.kssj, kw.jssj,kw.info_id,kw.kc_id
                                                              from jw_kcfb fb
                                                             inner join jw_kcfbindex ind
                                                                on fb.fid = ind.id
                                                             inner join jw_kcwh kw
                                                                on kw.info_id = fb.kwinfo_id
                                                             inner join g_infos g
                                                                on g.id = kw.info_id where ind.info_id=:bcid
                                                              and to_char(kw.kssj,'yyyy-MM-dd')<=to_char(to_date(:et,'yyyy-MM-dd'),'yyyy-MM-dd') and to_char(kw.jssj,'yyyy-MM-dd')>=to_char(to_date(:st,'yyyy-MM-dd'),'yyyy-MM-dd') and g.deleted>-1 order by kw.kssj asc";
                    comm.Parameters.Add(new MySqlParameter("bcid", c.info_id));
                    comm.Parameters.Add(new MySqlParameter("et", et.ToString("yyyy-MM-dd")));
                    comm.Parameters.Add(new MySqlParameter("st", st.ToString("yyyy-MM-dd")));
                    oda = new MySqlDataAdapter(comm);
                    DataTable classWeekTable = new DataTable();
                    oda.Fill(classWeekTable);
                    List<DayClass> DayClass = UtilDataTableToList<DayClass>.ConvertToList(classWeekTable);
                    List<DayClass> forAdd = new List<DayClass>();

                    //var forRemove = new DayClass();
                    List<DayClass> forRemoveList = new List<DayClass>();
                    foreach (var d in DayClass)
                    {

                        var t = d.jssj - d.kssj;
                        if (t.Days >= 1)
                        {
                            for (int i = 0; i <= t.Days; i++)
                            {
                                var nowKssj = d.kssj.AddDays(i);
                                var nowJssj = d.jssj.AddDays(i);
                                if (nowKssj > et.AddDays(1) || nowKssj < st)
                                {
                                    continue;
                                }
                                forAdd.Add(new DayClass()
                                {
                                    address = d.address,
                                    bz2 = d.bz2,
                                    dayOfWeek = d.dayOfWeek + getCNXQ(nowKssj),
                                    info_id = d.info_id,
                                    jssj = nowJssj,
                                    kssj = nowKssj,
                                    kcname = d.kcname,
                                    teacher = d.teacher,
                                    dayWeek = getXQ(nowKssj)                                    
                                });
                            }
                            forRemoveList.Add(d);
                        }
                        else
                        {

                            d.dayOfWeek = d.dayOfWeek + getCNXQ(d.kssj);
                            d.dayWeek = getXQ(d.kssj);
                        }
                        // 添加附件
                        if (d.kc_id != null)
                        {
                            comm.Parameters.Clear();
                            comm.CommandText = @"select info_id,nrbt,user_id,rq,filepath from g_nr where info_id=:info_id";
                            comm.Parameters.Add(new MySqlParameter("info_id", d.kc_id.ToString()));
                            oda = new MySqlDataAdapter(comm);
                            DataTable classfile = new DataTable();
                            oda.Fill(classfile);
                            List<ClassFile> classFile = UtilDataTableToList<ClassFile>.ConvertToList(classfile);
                            d.classFile = classFile;
                        }
                    }
                    foreach (var forAddDayClass in forAdd)
                    {
                        DayClass.Add(forAddDayClass);
                    }
                    foreach (var forRemoveDayClass in forRemoveList)
                    {
                        DayClass.Remove(forRemoveDayClass);
                    }


                    c.dayclass = DayClass;
                }
            }
            return returnVal;
        }

        public static int getXQ(DateTime dt)
        {
            int returnVal = 0;
            switch (dt.DayOfWeek)
            {
                case DayOfWeek.Friday:
                    returnVal = 5;
                    break;
                case DayOfWeek.Monday:
                    returnVal = 1;
                    break;
                case DayOfWeek.Saturday:
                    returnVal = 6;
                    break;
                case DayOfWeek.Sunday:
                    returnVal = 7;
                    break;
                case DayOfWeek.Thursday:
                    returnVal = 4;
                    break;
                case DayOfWeek.Tuesday:
                    returnVal = 2;
                    break;
                case DayOfWeek.Wednesday:
                    returnVal = 3;
                    break;

            }
            return returnVal;
        }
        public static string getCNXQ(DateTime dt)
        {
            string returnVal = string.Empty;
            switch (dt.DayOfWeek)
            {
                case DayOfWeek.Friday:
                    returnVal = "五";
                    break;
                case DayOfWeek.Monday:
                    returnVal = "一";
                    break;
                case DayOfWeek.Saturday:
                    returnVal = "六";
                    break;
                case DayOfWeek.Sunday:
                    returnVal = "日";
                    break;
                case DayOfWeek.Thursday:
                    returnVal = "四";
                    break;
                case DayOfWeek.Tuesday:
                    returnVal = "二";
                    break;
                case DayOfWeek.Wednesday:
                    returnVal = "三";
                    break;

            }
            return returnVal;
        }
    }

}