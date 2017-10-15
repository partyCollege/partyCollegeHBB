using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.OleDb;
using CollegeAPP.DataModel;
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Tools;

namespace CollegeAPP.Model
{
    public static class Student_Extension
    {
        static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];

        public static List<Student> getStudentList(this Student student, string bcid)
        {
            List<Student> returnList = new List<Student>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select g.bt as uname,xy.sjhm as phone,szdw,c.name
                                                          from sub_file_relation re
                                                         inner join g_infos g
                                                            on g.id = re.info_id
                                                         inner join jw_xyxx xy
                                                            on xy.info_id = g.id
                                                        inner join sub_file_relation sr on xy.info_id=sr.info_id
                                                        left join jw_classframework_rel jwcl on xy.info_id=jwcl.rel_id
                                                        left join jw_classframework_rel b on jwcl.fid=b.id
                                                        left join jw_classframework c on b.rel_id=c.id
                                                        left join (select d.*,e.name from jw_classrole_rel d 
                                                        inner join jw_classrole e on d.fid=e.id
                                                        where d.bcinfo_id=:bcid and e.bcinfo_id=:bcid) t  on t.rel_id=xy.info_id
                                                        where sr.finfo_id=:bcid and g.deleted > -1 order by jwcl.ord_no asc,xy.info_id asc";
                comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                returnList = UtilDataTableToList<Student>.ConvertToList(dt);

            }
            return returnList;
        }


        public static Student get(this Student student, string bcid, string info_id)
        {
            Student returnObj = new Student();
            List<Student> returnList = new List<Student>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select g.bt as uname,xy.sjhm as phone,(case when xy.xb=0 then '男' else '女' end) as xb
							,gbc.bt as bcname,bc.bzr,xy.szdw,xy.info_id,re.onecard
                            from sub_file_relation re
                            inner join g_infos g on g.id = re.info_id
                            inner join jw_bcgl bc on re.finfo_id=bc.info_id
                            inner join g_infos gbc on gbc.id = bc.info_id
                            inner join jw_xyxx xy on xy.info_id = g.id
                            where g.deleted > -1 and gbc.deleted>-1 and re.info_id=:info_id and re.finfo_id=:bcid";
                comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                comm.Parameters.Add(new MySqlParameter("bcid", bcid));
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                returnList = UtilDataTableToList<Student>.ConvertToList(dt);
                returnObj = returnList[0];
            }
            return returnObj;
        }

        public static bool UpdateStudentPwd(this Student student)
        {
            bool result = false;
            string sql = "update sub_file_relation set password=:pwd where info_id=:info_id and finfo_id=:bcid";
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = sql;
                comm.Parameters.Add(new MySqlParameter("pwd", student.password));
                comm.Parameters.Add(new MySqlParameter("info_id", student.info_id));
                comm.Parameters.Add(new MySqlParameter("bcid", student.bcid));
                int rows = comm.ExecuteNonQuery();
                if (rows > 0)
                {
                    result = true;
                }
            }
            return result;
        }
        public static Dictionary<string, string> getKQ(this Student stu, string onecard, string info_ids)
        {
            Dictionary<string, string> returnDic = new Dictionary<string, string>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select kcid,state from jw_querykaoqing where stuid=:onecard and kcid in (" + info_ids + ")";
                comm.Parameters.Add(new MySqlParameter("onecard", onecard));
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                DataTable dt = new DataTable();
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    returnDic.Add(dr["kcid"].ToString(), dr["state"].ToString());
                }
            }
            return returnDic;
        }
        public static Student autoLogin(this Student student)
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select g.bt       xyname,
                                                           g2.bt      as bcname,
                                                           bc.pxsj,
                                                           bc.pxsj_js,
                                                           re.onecard,
                                                           xy.info_id,
                                                           g2.id      as bcinfo_id,
                                                           g.id       as info_id
                                                      from sub_file_relation re
                                                     inner join jw_xyxx xy
                                                        on re.info_id = xy.info_id
                                                     inner join jw_bcgl bc
                                                        on bc.info_id = re.finfo_id
                                                     inner join g_infos g
                                                        on g.id = xy.info_id
                                                     inner join g_infos g2
                                                        on g2.id = bc.info_id
                                                     where xy.sjhm=:sjhm
                                                       and g2.id =:bcid
                                                       and g.deleted > -1
                                                       and g2.deleted > -1
                                                       order by pxsj desc
                                                    ";
                comm.Parameters.Add(new MySqlParameter("sjhm", student.phone));
                comm.Parameters.Add(new MySqlParameter("bcid", student.bcid));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        student.bcinfo = odr["bcinfo_id"].ToString();
                        student.info_id = odr["info_id"].ToString();
                        student.uname = odr["xyname"].ToString();
                        student.bcname = odr["bcname"].ToString();
                        student.onecard = odr["onecard"].ToString();
                        student.errorMessage = string.Empty;
                    }
                    else
                    {
                        student.errorMessage = "用户名或密码错误";
                    }
                }
            }
            return student;
        }
        public static Student Login(this Student student)
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"select * from (
select rownum as rowindex, xyname,sjhm,bcname,pxsj,pxsj_js,onecard,bcinfo_id,info_id,ishandpsd,handpsd from (select g.bt       xyname,xy.sjhm,
                                                           g2.bt      as bcname,
                                                           bc.pxsj,
                                                           bc.pxsj_js,
                                                           re.onecard,
                                                           xy.info_id,
                                                           g2.id as bcinfo_id,
                                                           xy.ishandpsd,
                                                           xy.handpsd
                                                      from sub_file_relation re
                                                     inner join jw_xyxx xy
                                                        on re.info_id = xy.info_id
                                                     inner join jw_bcgl bc
                                                        on bc.info_id = re.finfo_id
                                                     inner join g_infos g
                                                        on g.id = xy.info_id
                                                     inner join g_infos g2
                                                        on g2.id = bc.info_id
                                                     where (onecard =:onecard OR XY.SFZH=:sfzh OR XY.SJHM=:phone)
                                                       and password =:psd
                                                       and g.deleted > -1
                                                       and g2.deleted > -1 order by bc.pxsj desc))
                                                       where rowindex=1
                                                    ";
                comm.Parameters.Add(new MySqlParameter("onecard", student.onecard));
                comm.Parameters.Add(new MySqlParameter("sfzh", student.onecard));
                comm.Parameters.Add(new MySqlParameter("phone", student.onecard));
                comm.Parameters.Add(new MySqlParameter("psd", student.password.Trim()));
                using (MySqlDataReader odr = comm.ExecuteReader())
                {
                    if (odr.Read())
                    {
                        student.bcinfo = odr["bcinfo_id"].ToString();
                        student.info_id = odr["info_id"].ToString();
                        student.uname = odr["xyname"].ToString();
                        student.phone = odr["sjhm"].ToString();
                        student.bcname = odr["bcname"].ToString();
                        student.onecard = odr["onecard"].ToString();
                        student.ishandpsd = odr["ishandpsd"].ToString();
                        if (odr["handpsd"] != DBNull.Value)
                        {
                            student.handpsd = odr["handpsd"].ToString();
                        }
                        else
                        {
                            student.handpsd = "";
                        }
                        SessionModel sessionModel = new SessionModel();
                        sessionModel.userid = student.info_id;
                        sessionModel.usertype = "student";
                        sessionModel.username = student.uname;
                        HttpContext.Current.Session["user"] = sessionModel;
                        student.errorMessage = string.Empty;
                    }
                    else
                    {
                        student.errorMessage = "用户名或密码错误";
                    }
                }
            }
            return student;
        }
    }
}