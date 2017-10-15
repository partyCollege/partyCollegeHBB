using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class TotalService
    {
        /// <summary>
        /// 生成当年度学习档案
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic AddUserTotal(dynamic queryModel, MySqlCommand cmd)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "failed";

            dynamic dynModel = new System.Dynamic.ExpandoObject();
            try
            {
                string sql = string.Empty;

                //年度计划
                //年度计划年份
                dynModel.year = DateTime.Now.Year.ToString();
                //年度计划职级
                dynModel.rank = queryModel.rank;
                //学员ID
                dynModel.studentid = Convert.ToString(queryModel.studentid);


                //自主选学
                sql = @"select cwur.coursewareid,ware.studytime,ifnull(vlog.isfinished,0) isfinished,cwur.status from sy_courseware_user cwur
                                inner join sy_courseware ware on cwur.coursewareid=ware.id
                                left join sy_video_log vlog on vlog.studentid=cwur.studentid and vlog.coursewareid=cwur.coursewareid
                                where cwur.studentid=?studentid and DATE_FORMAT(cwur.createtime,'%Y')=?year";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new MySqlParameter("studentid", dynModel.studentid));
                cmd.Parameters.Add(new MySqlParameter("year", dynModel.year));
                cmd.CommandText = sql;
                DataTable dt = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.choose_courseallcount = 0;
                dynModel.choose_coursefinishedcount = 0;
                dynModel.choose_allstudytime = 0;
                dynModel.choose_finishedstutytime = 0;
                dynModel.choose_progess = "0%";
                if (dt.Rows.Count > 0)
                {
                    //选学课程总数
                    dynModel.choose_courseallcount = dt.Select(" status=0").Count();
                    //选学总学时 
                    dynModel.choose_allstudytime = dt.Select(" status=0").Sum(n => Convert.ToDecimal(n["studytime"]));
                    //选学已完成课程总数
                    dynModel.choose_coursefinishedcount = dt.Select(" isfinished=1").Length;
                    //选学已完成课程所获得学时 
                    dynModel.choose_finishedstutytime = dt.Select(" isfinished=1").Sum(n => Convert.ToDecimal(n["studytime"]));

                    //选学完成进度  
                    dynModel.choose_progess = "0%";
                    if (Convert.ToDecimal(dynModel.choose_courseallcount) > 0)
                    {
                        string r2 = (Convert.ToDecimal(dynModel.choose_coursefinishedcount) / Convert.ToDecimal(dynModel.choose_courseallcount) * 100).ToString("#0.00") + "%";
                        dynModel.class_progess = r2;
                    }

                }

                //学习班
                sql = @"select csur.classid,ccs.coursewareid,ware.studytime,ifnull(vlog.isfinished,0) isfinished from sy_class_user csur
                                inner join sy_classcourse ccs on ccs.classid=csur.classid
                                inner join sy_courseware ware on ccs.coursewareid=ware.id
                                left join sy_video_log vlog on vlog.studentid=csur.userid and vlog.coursewareid=ccs.coursewareid
                                where csur.userid=?studentid and DATE_FORMAT(ccs.createtime,'%Y')=?year";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.class_classcount = 0;
                dynModel.class_courseallcount = 0;
                dynModel.class_coursefinishedcount = 0;
                dynModel.class_allstudytime = 0;
                dynModel.class_finishedstudytime = 0;
                dynModel.class_progess = "0%";
                if (dt.Rows.Count > 0)
                {
                    //学习班总数
                    dynModel.class_classcount = dt.Select().Select(n => Convert.ToString(n["classid"])).Distinct().Count();
                    //学习班课程总数
                    dynModel.class_courseallcount = dt.Rows.Count;
                    //学习班已完成课程总数
                    dynModel.class_coursefinishedcount = dt.Select(" isfinished=1").Length;
                    //学习班课程总学时
                    dynModel.class_allstudytime = dt.Select().Sum(n => Convert.ToDecimal(n["studytime"]));
                    //学习班已完成课程所获总学时
                    dynModel.class_finishedstudytime = dt.Select(" isfinished=1").Sum(n => Convert.ToDecimal(n["studytime"]));

                    //学习班完成进度  
                    dynModel.class_progess = "0%";
                    if (Convert.ToDecimal(dynModel.class_courseallcount) > 0)
                    {
                        string r2 = (Convert.ToDecimal(dynModel.class_coursefinishedcount) / Convert.ToDecimal(dynModel.class_courseallcount) * 100).ToString("#0.00") + "%";
                        dynModel.class_progess = r2;
                    }
                }


                sql = "select  IFNULL(sum(studytime),0) studytime from sy_train where studentid=?studentid and year=?year and status=2";
                cmd.CommandText = sql;
                //面授培训
                dynModel.train_studytime = Convert.ToDecimal(cmd.ExecuteScalar());


                sql = "select MAX(createtime) lastlogin,MIN(createtime) minlogin,count(1) logincount from sy_user_logininfo where studentid=?studentid and year=?year";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.time_logincount = 0;
                dynModel.time_firstlogintime = 0;
                dynModel.time_lastlogintime = 0;
                if (dt.Rows.Count > 0)
                {
                    //登录次数
                    dynModel.time_logincount = Convert.ToInt32(dt.Rows[0]["logincount"]);
                    //年度第一次登录时间
                    dynModel.time_firstlogintime = Convert.ToDateTime(dt.Rows[0]["minlogin"]).ToString("MM月dd日");
                    //年度最后一次登录时间
                    dynModel.time_lastlogintime = Convert.ToDateTime(dt.Rows[0]["lastlogin"]).ToString("MM月dd日");
                }

                sql = @"select 
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=6 and DATE_FORMAT(vdet.playtime,'%k')<12 then 1 else 0 end),0) morning, 
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=12 and DATE_FORMAT(vdet.playtime,'%k')<18 then 1 else 0 end),0) noon,
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=18 and DATE_FORMAT(vdet.playtime,'%k')<6 then 1 else 0 end),0) night
                                from sy_video_detail vdet
                                where vdet.studentid=?studentid and DATE_FORMAT(vdet.playtime,'%Y')=?year";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.time_morning = "0%";
                dynModel.time_noon = "0%";
                dynModel.time_night = "0%";
                if (dt.Rows.Count > 0)
                {
                    decimal morning = Convert.ToDecimal(dt.Rows[0]["morning"]);
                    decimal noon = Convert.ToDecimal(dt.Rows[0]["noon"]);
                    decimal night = Convert.ToDecimal(dt.Rows[0]["night"]);
                    decimal total = morning + noon + night;
                    //学习时间上午所占百分比
                    dynModel.time_morning = total == 0 ? "0%" : Convert.ToInt32((morning / total * 100)).ToString() + "%";
                    //学习时间中午所占百分比
                    dynModel.time_noon = total == 0 ? "0%" : Convert.ToInt32((noon / total * 100)).ToString() + "%";
                    //学习时间晚上所占百分比
                    dynModel.time_night = total == 0 ? "0%" : Convert.ToInt32((night / total * 100)).ToString() + "%";
                }

                sql = "select count(1) from sy_classcourse_note where studentid=?studentid and DATE_FORMAT(createdtime,'%Y')=?year";
                cmd.CommandText = sql;
                //笔记数
                dynModel.appraise_notecount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = @"select coursewareid from sy_courseware_appraisedetail  where studentid=?studentid and DATE_FORMAT(createtime,'%Y')=?year group by coursewareid  ";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                //课程评价数
                dynModel.appraise_appraisecount = dt.Rows.Count;

                sql = "select count(1) from sy_class_faq where accountid=?accountid and DATE_FORMAT(createtime,'%Y')=?year and LENGTH(IFNULL(fid,''))=0";
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("accountid", queryModel.accountid));
                //课程提问数
                dynModel.appraise_coursecount = Convert.ToInt32(cmd.ExecuteScalar());


                sql = @"select rela.categoryid,cate.name from sy_video_log vlog
                                inner join sy_courseware_category_relatiion rela on rela.coursewareid=vlog.coursewareid
                                inner join sy_courseware_category cate on rela.categoryid=cate.id
                                where vlog.studentid=?studentid and DATE_FORMAT(starttime,'%Y')=?year -- and vlog.isfinished=1
                                group by rela.categoryid order by count(1) desc limit 3";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.keywords = "";
                if (dt.Rows.Count > 0)
                {
                    //学习关键字
                    dynModel.keywords = string.Join(",", dt.Select().Select(n => Convert.ToString(n["name"])).ToArray());
                }


                sql = "select IFNULL(sum(timestamp),0) from sy_video_detail where studentid=?studentid and DATE_FORMAT(playtime,'%Y')=?year";
                cmd.CommandText = sql;
                //年度学习总时长
                dynModel.total_time = Convert.ToInt32(cmd.ExecuteScalar());
                //年度获得总学时
                dynModel.total_studytime = dynModel.class_finishedstudytime + dynModel.choose_finishedstutytime + dynModel.train_studytime;


                sql = "select studytime,id from sy_yearplan where year=?year and departmentid=?departmentid and rank_cn=?rank";
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("departmentid", queryModel.departmentid));
                cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(queryModel.rank)));
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.yearplan_total = 0;
                if (dt.Rows.Count > 0)
                {
                    //年度计划学时
                    dynModel.yearplan_total = Convert.ToInt32(dt.Rows[0]["studytime"]);
                }
                //年度计划已完成学时
                dynModel.yearplan_finished = dynModel.total_studytime;
                //年度计划完成百分比
                dynModel.yearplan_progess = "0%";
                if (dynModel.yearplan_total > 0)
                {
                    string p1 = (Convert.ToDecimal(dynModel.total_studytime) / Convert.ToDecimal(dynModel.yearplan_total) * 100).ToString("#0.00") + "%";
                    dynModel.yearplan_progess = p1;
                }
                sql = "select id from sy_user_totalreport where studentid=?studentid and year=?year";
                cmd.CommandText = sql;
                object objValue = cmd.ExecuteScalar();
                bool hasRow = objValue != DBNull.Value && objValue != null ? true : false;

                cmd.Parameters.Clear();
                foreach (var property in (IDictionary<String, Object>)dynModel)
                {
                    cmd.Parameters.Add(new MySqlParameter(property.Key, property.Value));
                }
                if (hasRow)
                {
                    cmd.Parameters.Add(new MySqlParameter("id", objValue));
                    sql = "update sy_user_totalreport set   yearplan_total = ?yearplan_total,yearplan_finished = ?yearplan_finished,yearplan_progess = ?yearplan_progess,class_classcount =?class_classcount,class_courseallcount = ?class_courseallcount,class_coursefinishedcount = ?class_coursefinishedcount,class_allstudytime = ?class_allstudytime,class_finishedstudytime = ?class_finishedstudytime,class_progess = ?class_progess,train_studytime = ?train_studytime,choose_courseallcount = ?choose_courseallcount,choose_coursefinishedcount = ?choose_coursefinishedcount,choose_allstudytime = ?choose_allstudytime,choose_finishedstutytime = ?choose_finishedstutytime,choose_progess = ?choose_progess,keywords = ?keywords,time_morning = ?time_morning,time_noon = ?time_noon,time_night = ?time_night,time_logincount = ?time_logincount,time_firstlogintime =?time_firstlogintime,time_lastlogintime = ?time_lastlogintime,appraise_appraisecount = ?appraise_appraisecount,appraise_coursecount = ?appraise_coursecount,appraise_notecount = ?appraise_notecount,total_time = ?total_time,total_studytime = ?total_studytime ,lastupdatetime =now() where id = ?id";
                }
                else
                {
                    sql = @"INSERT INTO sy_user_totalreport(id,studentid,year,rank,yearplan_total,yearplan_finished,yearplan_progess,class_classcount,class_courseallcount,class_coursefinishedcount,class_allstudytime,class_finishedstudytime,class_progess,train_studytime,choose_courseallcount,choose_coursefinishedcount,choose_allstudytime,choose_finishedstutytime,choose_progess,keywords,time_morning,time_noon,time_night,time_logincount,time_firstlogintime,time_lastlogintime,appraise_appraisecount,appraise_coursecount,appraise_notecount,total_time,total_studytime,createtime,lastupdatetime) VALUES(uuid(),?studentid,?year,?rank,?yearplan_total,?yearplan_finished,?yearplan_progess,?class_classcount,?class_courseallcount,?class_coursefinishedcount,?class_allstudytime,?class_finishedstudytime,?class_progess,?train_studytime,?choose_courseallcount,?choose_coursefinishedcount,?choose_allstudytime,?choose_finishedstutytime,?choose_progess,?keywords,?time_morning,?time_noon,?time_night,?time_logincount,?time_firstlogintime,?time_lastlogintime,?appraise_appraisecount,?appraise_coursecount,?appraise_notecount,?total_time,?total_studytime, now(),now());";
                }
                cmd.CommandText = sql;
                int exec = cmd.ExecuteNonQuery();


                sql = @"update sy_class_user clur,(
	                                select clur.classid
	                                ,sum(ware.studytime) allstudytime
	                                ,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 end) mystudytime
	                                from sy_class_user clur
	                                inner join sy_classcourse cc on clur.classid=cc.classid
	                                inner join sy_courseware ware on ware.id=cc.coursewareid
	                                left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=clur.userid and vlog.isfinished=1 
	                                where clur.userid=?studentid and ware.mainstatus>=0
	                                group by clur.classid
                                 ) tmp set clur.studyrate=ifnull(mystudytime/allstudytime,0) where clur.classid=tmp.classid 
                                and clur.userid=?studentid";
                cmd.CommandText = sql;
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new MySqlParameter("studentid", dynModel.studentid));
                exec = cmd.ExecuteNonQuery();

                sql = @" update sy_class clur,(
	                                select clur.classid
	                                ,sum(ware.studytime) allstudytime
	                                ,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 end) mystudytime
	                                from sy_class_user clur
	                                inner join sy_classcourse cc on clur.classid=cc.classid
	                                inner join sy_courseware ware on ware.id=cc.coursewareid
	                                left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=clur.userid and vlog.isfinished=1 
 	                                where 1=1 and ware.mainstatus>=0
	                                and clur.classid in(select classid from sy_class_user where userid=?studentid)
	                                group by clur.classid 
                                ) tmp set clur.studyrate=ifnull(mystudytime/allstudytime,0) where clur.id=tmp.classid ";

                cmd.CommandText = sql;
                exec = cmd.ExecuteNonQuery();

                dyn.result = true;
                dyn.message = "success";
            }
            catch (Exception ex)
            {
                ExceptionService.WriteException(ex);
            }

            return dyn;
        }

        /// <summary>
        /// 生成当年度学习档案
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic AddUserTotal(dynamic queryModel)
        {
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                return AddUserTotal(queryModel, cmd);
            }
        }







        /// <summary>
        /// 生成当年年度向前推五年的学习档案
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic AddHistoryUserTotal(dynamic queryModel)
        {
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();

                //计算学员所有班级中的学时
                string sql = @"update sy_class_user clur,(
                                select clur.userid,clur.classid,cc.coursewareid,sum(ware.studytime) studytime from sy_class_user clur
                                inner join sy_classcourse cc on cc.classid=clur.classid
                                inner join sy_courseware ware on ware.id=cc.coursewareid
                                inner join sy_video_log vlog on vlog.studentid=clur.userid and vlog.coursewareid=cc.coursewareid and vlog.isfinished=1
                                where clur.userid=?studentid group by clur.classid 
                                ) tmp set clur.studytime=tmp.studytime where clur.userid=tmp.userid and clur.classid=tmp.classid";
                cmd.CommandText = sql;
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new MySqlParameter("studentid", queryModel.studentid));
                cmd.ExecuteNonQuery();


                sql = string.Format(@"select tmp.year, IFNULL(utr.rank,'{1}') rank from 
                            (select studentid,year from sy_train where studentid='{0}' and status=2 group by studentid,year) tmp
                            left join sy_user_totalreport utr on utr.`year`=tmp.year and utr.studentid=tmp.studentid where tmp.studentid='{0}' ", Convert.ToString(queryModel.studentid), Convert.ToString(queryModel.rank));
                cmd.CommandText = sql;
                DataTable dataTable = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dataTable);
                string nowYear = DateTime.Now.Year.ToString();
                List<dynamic> listYears = dataTable.Select().Select(n => new
                {
                    year = Convert.ToString(n["year"]),
                    rank = Convert.ToString(n["rank"])
                }).ToList<dynamic>();

                if (listYears.Where(n => n.year.Equals(nowYear)).Count() == 0)
                {
                    listYears.Add(new
                    {
                        year = nowYear,
                        rank = queryModel.rank
                    });
                }

                foreach (dynamic item in listYears)
                {
                    queryModel.year = item.year;
                    queryModel.rank = item.rank;
                    AddHistoryUserTotal(queryModel, cmd);
                }
            }
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = true;
            dyn.message = "success";
            return dyn;
        }

        /// <summary>
        /// 生成当年年度向前推五年的学习档案
        /// </summary>
        /// <param name="queryModel"></param>
        /// <param name="cmd"></param>
        /// <returns></returns>
        public dynamic AddHistoryUserTotal(dynamic queryModel, MySqlCommand cmd)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "failed";

            dynamic dynModel = new System.Dynamic.ExpandoObject();
            try
            {
                string sql = string.Empty;

                //年度计划
                //年度计划年份
                dynModel.year = Convert.ToString(queryModel.year);
                //年度计划职级
                dynModel.rank = Convert.ToString(queryModel.rank);
                //学员ID
                dynModel.studentid = Convert.ToString(queryModel.studentid);


                //自主选学
                sql = @"select cwur.coursewareid,ware.studytime,ifnull(vlog.isfinished,0) isfinished,cwur.status from sy_courseware_user cwur
                                inner join sy_courseware ware on cwur.coursewareid=ware.id
                                left join sy_video_log vlog on vlog.studentid=cwur.studentid and vlog.coursewareid=cwur.coursewareid
                                where cwur.studentid=?studentid and DATE_FORMAT(cwur.createtime,'%Y')=?year and cwur.status>=0 ";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new MySqlParameter("studentid", dynModel.studentid));
                cmd.Parameters.Add(new MySqlParameter("year", dynModel.year));
                cmd.CommandText = sql;
                DataTable dt = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.choose_courseallcount = 0;
                dynModel.choose_coursefinishedcount = 0;
                dynModel.choose_allstudytime = 0;
                dynModel.choose_finishedstutytime = 0;
                dynModel.choose_progess = "0%";
                if (dt.Rows.Count > 0)
                {
                    //选学课程总数
                    dynModel.choose_courseallcount = dt.Select(" status=0").Count();
                    //选学总学时 
                    dynModel.choose_allstudytime = dt.Select(" status=0").Sum(n => Convert.ToDecimal(n["studytime"]));
                    //选学已完成课程总数
                    dynModel.choose_coursefinishedcount = dt.Select(" isfinished=1").Length;
                    //选学已完成课程所获得学时 
                    dynModel.choose_finishedstutytime = dt.Select(" isfinished=1").Sum(n => Convert.ToDecimal(n["studytime"]));

                    //选学完成进度  
                    dynModel.choose_progess = "0%";
                    if (Convert.ToDecimal(dynModel.choose_courseallcount) > 0)
                    {
                        string r2 = (Convert.ToDecimal(dynModel.choose_coursefinishedcount) / Convert.ToDecimal(dynModel.choose_courseallcount) * 100).ToString("#0.00") + "%";
                        dynModel.choose_progess = r2;
                    }

                }

                //学习班
                sql = @"select csur.classid,ccs.coursewareid,ware.studytime,ifnull(vlog.isfinished,0) isfinished from sy_class_user csur
                                inner join sy_class cls on cls.id=csur.classid
                                inner join sy_classcourse ccs on ccs.classid=csur.classid
                                inner join sy_courseware ware on ccs.coursewareid=ware.id
                                left join sy_video_log vlog on vlog.studentid=csur.userid and vlog.coursewareid=ccs.coursewareid
                                where csur.userid=?studentid and DATE_FORMAT(ccs.createtime,'%Y')=?year and cls.status>=0";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.class_classcount = 0;
                dynModel.class_courseallcount = 0;
                dynModel.class_coursefinishedcount = 0;
                dynModel.class_allstudytime = 0;
                dynModel.class_finishedstudytime = 0;
                dynModel.class_progess = "0%";
                if (dt.Rows.Count > 0)
                {
                    //学习班总数
                    dynModel.class_classcount = dt.Select().Select(n => Convert.ToString(n["classid"])).Distinct().Count();
                    //学习班课程总数
                    dynModel.class_courseallcount = dt.Rows.Count;
                    //学习班已完成课程总数
                    dynModel.class_coursefinishedcount = dt.Select(" isfinished=1").Length;
                    //学习班课程总学时
                    dynModel.class_allstudytime = dt.Select().Sum(n => Convert.ToDecimal(n["studytime"]));
                    //学习班已完成课程所获总学时
                    dynModel.class_finishedstudytime = dt.Select(" isfinished=1").Sum(n => Convert.ToDecimal(n["studytime"]));

                    //学习班完成进度  
                    dynModel.class_progess = "0%";
                    if (Convert.ToDecimal(dynModel.class_courseallcount) > 0)
                    {
                        string r2 = (Convert.ToDecimal(dynModel.class_coursefinishedcount) / Convert.ToDecimal(dynModel.class_courseallcount) * 100).ToString("#0.00") + "%";
                        dynModel.class_progess = r2;
                    }
                }


                sql = "select  IFNULL(sum(studytime),0) studytime from sy_train where studentid=?studentid and year=?year and status=2";
                cmd.CommandText = sql;
                //面授培训
                dynModel.train_studytime = Convert.ToDecimal(cmd.ExecuteScalar());


                sql = "select MAX(createtime) lastlogin,MIN(createtime) minlogin,count(1) logincount from sy_user_logininfo where studentid=?studentid and year=?year";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.time_logincount = 0;
                dynModel.time_firstlogintime = 0;
                dynModel.time_lastlogintime = 0;
                if (dt.Rows.Count > 0)
                {
                    //登录次数
                    dynModel.time_logincount = Convert.ToInt32(dt.Rows[0]["logincount"]);
                    //年度第一次登录时间
                    dynModel.time_firstlogintime = dt.Rows[0]["minlogin"] != DBNull.Value ? Convert.ToDateTime(dt.Rows[0]["minlogin"]).ToString("MM月dd日") : "-";
                    //年度最后一次登录时间
                    dynModel.time_lastlogintime = dt.Rows[0]["lastlogin"] != DBNull.Value ? Convert.ToDateTime(dt.Rows[0]["lastlogin"]).ToString("MM月dd日") : "-";
                }

                sql = @"select 
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=6 and DATE_FORMAT(vdet.playtime,'%k')<12 then 1 else 0 end),0) morning, 
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=12 and DATE_FORMAT(vdet.playtime,'%k')<18 then 1 else 0 end),0) noon,
                                ifnull(sum(case when DATE_FORMAT(vdet.playtime,'%k')>=18 and DATE_FORMAT(vdet.playtime,'%k')<6 then 1 else 0 end),0) night
                                from sy_video_detail vdet
                                where vdet.studentid=?studentid and DATE_FORMAT(vdet.playtime,'%Y')=?year";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dynModel.time_morning = "0%";
                dynModel.time_noon = "0%";
                dynModel.time_night = "0%";
                if (dt.Rows.Count > 0)
                {
                    decimal morning = Convert.ToDecimal(dt.Rows[0]["morning"]);
                    decimal noon = Convert.ToDecimal(dt.Rows[0]["noon"]);
                    decimal night = Convert.ToDecimal(dt.Rows[0]["night"]);
                    decimal total = morning + noon + night;
                    //学习时间上午所占百分比
                    dynModel.time_morning = total == 0 ? "0%" : Convert.ToInt32((morning / total * 100)).ToString() + "%";
                    //学习时间中午所占百分比
                    dynModel.time_noon = total == 0 ? "0%" : Convert.ToInt32((noon / total * 100)).ToString() + "%";
                    //学习时间晚上所占百分比
                    dynModel.time_night = total == 0 ? "0%" : Convert.ToInt32((night / total * 100)).ToString() + "%";
                }

                sql = "select count(1) from sy_classcourse_note where studentid=?studentid and DATE_FORMAT(createdtime,'%Y')=?year";
                cmd.CommandText = sql;
                //笔记数
                dynModel.appraise_notecount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = @"select coursewareid from sy_courseware_appraisedetail  where studentid=?studentid and DATE_FORMAT(createtime,'%Y')=?year group by coursewareid  ";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                //课程评价数
                dynModel.appraise_appraisecount = dt.Rows.Count;

                sql = "select count(1) from sy_class_faq where accountid=?accountid and DATE_FORMAT(createtime,'%Y')=?year and LENGTH(IFNULL(fid,''))=0";
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("accountid", queryModel.accountid));
                //课程提问数
                dynModel.appraise_coursecount = Convert.ToInt32(cmd.ExecuteScalar());


                sql = @"select rela.categoryid,cate.name from sy_video_log vlog
                                inner join sy_courseware_category_relatiion rela on rela.coursewareid=vlog.coursewareid
                                inner join sy_courseware_category cate on rela.categoryid=cate.id
                                where vlog.studentid=?studentid and DATE_FORMAT(starttime,'%Y')=?year -- and vlog.isfinished=1
                                group by rela.categoryid order by count(1) desc limit 3";
                cmd.CommandText = sql;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.keywords = "";
                if (dt.Rows.Count > 0)
                {
                    //学习关键字
                    dynModel.keywords = string.Join(",", dt.Select().Select(n => Convert.ToString(n["name"])).ToArray());
                }


                sql = "select IFNULL(sum(timestamp),0) from sy_video_detail where studentid=?studentid and DATE_FORMAT(playtime,'%Y')=?year";
                cmd.CommandText = sql;
                //年度学习总时长
                dynModel.total_time = Convert.ToInt32(cmd.ExecuteScalar());
                //年度获得总学时
                dynModel.total_studytime = dynModel.class_finishedstudytime + dynModel.choose_finishedstutytime + dynModel.train_studytime;


                sql = "select studytime,id from sy_yearplan where year=?year and departmentid=?departmentid and rank_cn=?rank";
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("departmentid", queryModel.departmentid));
                cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(queryModel.rank)));
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dynModel.yearplan_total = 0;
                if (dt.Rows.Count > 0)
                {
                    //年度计划学时
                    dynModel.yearplan_total = Convert.ToInt32(dt.Rows[0]["studytime"]);
                }
                //年度计划已完成学时
                dynModel.yearplan_finished = dynModel.total_studytime;
                //年度计划完成百分比
                dynModel.yearplan_progess = "0%";
                if (dynModel.yearplan_total > 0)
                {
                    string p1 = (Convert.ToDecimal(dynModel.total_studytime) / Convert.ToDecimal(dynModel.yearplan_total) * 100).ToString("#0.00") + "%";
                    dynModel.yearplan_progess = p1;
                }
                sql = "select id from sy_user_totalreport where studentid=?studentid and year=?year";
                cmd.CommandText = sql;
                object objValue = cmd.ExecuteScalar();
                bool hasRow = objValue != DBNull.Value && objValue != null ? true : false;

                cmd.Parameters.Clear();
                foreach (var property in (IDictionary<String, Object>)dynModel)
                {
                    cmd.Parameters.Add(new MySqlParameter(property.Key, property.Value));
                }
                if (hasRow)
                {
                    cmd.Parameters.Add(new MySqlParameter("id", objValue));
                    sql = "update sy_user_totalreport set   yearplan_total = ?yearplan_total,yearplan_finished = ?yearplan_finished,yearplan_progess = ?yearplan_progess,class_classcount =?class_classcount,class_courseallcount = ?class_courseallcount,class_coursefinishedcount = ?class_coursefinishedcount,class_allstudytime = ?class_allstudytime,class_finishedstudytime = ?class_finishedstudytime,class_progess = ?class_progess,train_studytime = ?train_studytime,choose_courseallcount = ?choose_courseallcount,choose_coursefinishedcount = ?choose_coursefinishedcount,choose_allstudytime = ?choose_allstudytime,choose_finishedstutytime = ?choose_finishedstutytime,choose_progess = ?choose_progess,keywords = ?keywords,time_morning = ?time_morning,time_noon = ?time_noon,time_night = ?time_night,time_logincount = ?time_logincount,time_firstlogintime =?time_firstlogintime,time_lastlogintime = ?time_lastlogintime,appraise_appraisecount = ?appraise_appraisecount,appraise_coursecount = ?appraise_coursecount,appraise_notecount = ?appraise_notecount,total_time = ?total_time,total_studytime = ?total_studytime ,lastupdatetime =now() where id = ?id";
                }
                else
                {
                    sql = @"INSERT INTO sy_user_totalreport(id,studentid,year,rank,yearplan_total,yearplan_finished,yearplan_progess,class_classcount,class_courseallcount,class_coursefinishedcount,class_allstudytime,class_finishedstudytime,class_progess,train_studytime,choose_courseallcount,choose_coursefinishedcount,choose_allstudytime,choose_finishedstutytime,choose_progess,keywords,time_morning,time_noon,time_night,time_logincount,time_firstlogintime,time_lastlogintime,appraise_appraisecount,appraise_coursecount,appraise_notecount,total_time,total_studytime,createtime,lastupdatetime) VALUES(uuid(),?studentid,?year,?rank,?yearplan_total,?yearplan_finished,?yearplan_progess,?class_classcount,?class_courseallcount,?class_coursefinishedcount,?class_allstudytime,?class_finishedstudytime,?class_progess,?train_studytime,?choose_courseallcount,?choose_coursefinishedcount,?choose_allstudytime,?choose_finishedstutytime,?choose_progess,?keywords,?time_morning,?time_noon,?time_night,?time_logincount,?time_firstlogintime,?time_lastlogintime,?appraise_appraisecount,?appraise_coursecount,?appraise_notecount,?total_time,?total_studytime, now(),now());";
                }
                cmd.CommandText = sql;
                int exec = cmd.ExecuteNonQuery();


                sql = @"update sy_class_user clur,(
	                                select clur.classid
	                                ,sum(ware.studytime) allstudytime
	                                ,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 end) mystudytime
	                                from sy_class_user clur
	                                inner join sy_classcourse cc on clur.classid=cc.classid
	                                inner join sy_courseware ware on ware.id=cc.coursewareid
	                                left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=clur.userid and vlog.isfinished=1 
	                                where clur.userid=?studentid and ware.mainstatus>=0
	                                group by clur.classid
                                 ) tmp set clur.studyrate=ifnull(mystudytime/allstudytime,0) where clur.classid=tmp.classid 
                                and clur.userid=?studentid";
                cmd.CommandText = sql;
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new MySqlParameter("studentid", dynModel.studentid));
                exec = cmd.ExecuteNonQuery();

                sql = @" update sy_class clur,(
	                                select clur.classid
	                                ,sum(ware.studytime) allstudytime
	                                ,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 end) mystudytime
	                                from sy_class_user clur
	                                inner join sy_classcourse cc on clur.classid=cc.classid
	                                inner join sy_courseware ware on ware.id=cc.coursewareid
	                                left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=clur.userid and vlog.isfinished=1 
 	                                where 1=1 and ware.mainstatus>=0
	                                and clur.classid in(select classid from sy_class_user where userid=?studentid)
	                                group by clur.classid 
                                ) tmp set clur.studyrate=ifnull(mystudytime/allstudytime,0) where clur.id=tmp.classid ";

                cmd.CommandText = sql;
                exec = cmd.ExecuteNonQuery();

                dyn.result = true;
                dyn.message = "success";
            }
            catch (Exception ex)
            {
                ExceptionService.WriteException(ex);
            }

            return dyn;
        }



    }
}






