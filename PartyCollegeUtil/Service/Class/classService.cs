using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Service.Class
{
    public class classService
    {

        /// <summary>
        /// 插入班级交流信息
        /// </summary>
        /// <param name="classexchangeData"></param>
        /// <returns></returns>
        public dynamic InsertInterflow(dynamic classexchangeData)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    StringBuilder sbsql = new StringBuilder();
                    sbsql.AppendFormat(" insert into sy_classexchange(id,classid,content,accountid,fid,createtime,studentid,usertype) select '{0}','{1}','{2}','{3}','{4}',now(),'{5}','{6}'; ",
                            classexchangeData.classexchange.id,
                            classexchangeData.classexchange.classid,
                            classexchangeData.classexchange.content,
                            classexchangeData.classexchange.accountid,
                            classexchangeData.classexchange.fid,
                            classexchangeData.classexchange.studentid,
                            classexchangeData.classexchange.usertype
                        );

                    if (classexchangeData.photolist != null)
                    {
                        foreach (var item in classexchangeData.photolist)
                        {
                            string[] nameList = item.servername.ToString().Split('.');
                            //缩略图
                            string smallName = nameList[0] + "_small." + nameList[1];
                            sbsql.Append(" insert into sy_event_picture(id,eventid,picturename,picture_servername,picture_serverthumbname,uploadtime) ");
                            sbsql.AppendFormat(" select uuid(),'{0}','{1}','{2}','{3}',now(); ", classexchangeData.classexchange.id, item.filename, item.servername, smallName);
                        }
                    }

                    comm.Transaction = tran;
                    comm.CommandText = sbsql.ToString();
                    comm.ExecuteNonQuery();
                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                ErrLog.Log(ex);
                tran.Rollback();
            }
            finally
            {
                conn.Close();
            }
            return result;
        }


        /// <summary>
        /// 获取学员说信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic getStudentsSay(dynamic queryModel)
        {


            int pageSize = Convert.ToInt32(queryModel.pagesize.ToString());
            int currentPage = Convert.ToInt32(queryModel.pageindex.ToString());
            int currentIndex = (currentPage - 1) * pageSize;
            string classid = queryModel.classid.ToString();
            string accountid = queryModel.accountid.ToString();
            string searchText = queryModel.searchText.ToString();

            string sql = @"select id,studentname,city,photo_servername,title,content talkcontent,count clickcount,isclick,createdtime,classname,type from (	select cl_learn.id,stu.name as studentname,stu.city,cl_learn.title,cl_learn.content,acc.photo_servername,(select count(1) from sy_praise where eventid = cl_learn.id) as count,(select count(1) from sy_praise where eventid = cl_learn.id and accountid= ?accountid) as isclick,date_format(cl_learn.createdtime,'%Y-%m-%d %H:%i:%s') createdtime,(select name from sy_class where id = cl_learn.classid) classname,0 type from sy_classcourse_learningsense cl_learn inner join sy_student stu on stu.id = cl_learn.studentid inner join sy_account acc on acc.id = stu.accountid where cl_learn.classid = ?classid and cl_learn.recommendstatus in(1,3) union select studynote.id,stu.name as studentname,stu.city,studynote.title,studynote.content,acc.photo_servername,(select count(1) from sy_praise where eventid = studynote.id) as count,(select count(1) from sy_praise where eventid = studynote.id and accountid= ?accountid ) as isclick,date_format(studynote.createdtime,'%Y-%m-%d %H:%i:%s') createdtime,(select name from sy_class where id = studynote.classid) classname,1 type from sy_studyingsense studynote inner join sy_student stu on stu.id = studynote.studentid inner join sy_account acc on acc.id = stu.accountid where studynote.classid = ?classid and studynote.recommendstatus in(1,3) ) a where 1=1   ";

            string where = "";
            List<MySqlParameter> paramCollection = new List<MySqlParameter>();
            paramCollection.Add(new MySqlParameter("classid", classid));
            paramCollection.Add(new MySqlParameter("accountid", accountid));

            if (!string.IsNullOrEmpty(searchText.Trim()))
            {
                where += " and (title like concat('%',?searchText,'%') or content like concat('%',?searchText,'%') )";
                paramCollection.Add(new MySqlParameter("searchText", searchText));
            }

            sql += where + " order by a.createdtime desc limit " + currentIndex.ToString() + "," + pageSize.ToString() + ";";

            DataSet ds = new DataSet();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(ds);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }

            List<dynamic> talkList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
            return talkList;
        }



        /// <summary>
        /// 获取学员说详情
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic getStudentsSayById(dynamic queryModel)
        {
            string id = queryModel.id.ToString();
            string accountid = queryModel.accountid.ToString();
            string searchText = queryModel.searchText.ToString();

            string sql = @"select id,studentname,city,photo_servername,title,content talkcontent,count clickcount,isclick,createdtime,classname,type from (	select cl_learn.id,stu.name as studentname,stu.city,cl_learn.title,cl_learn.content,acc.photo_servername,(select count(1) from sy_praise where eventid = cl_learn.id) as count,(select count(1) from sy_praise where eventid = cl_learn.id and accountid= ?accountid) as isclick,date_format(cl_learn.createdtime,'%Y-%m-%d %H:%i:%s') createdtime,(select name from sy_class where id = cl_learn.classid) classname,0 type from sy_classcourse_learningsense cl_learn inner join sy_student stu on stu.id = cl_learn.studentid inner join sy_account acc on acc.id = stu.accountid where cl_learn.id = ?id  union select studynote.id,stu.name as studentname,stu.city,studynote.title,studynote.content,acc.photo_servername,(select count(1) from sy_praise where eventid = studynote.id) as count,(select count(1) from sy_praise where eventid = studynote.id and accountid= ?accountid ) as isclick,date_format(studynote.createdtime,'%Y-%m-%d %H:%i:%s') createdtime,(select name from sy_class where id = studynote.classid) classname,1 type from sy_studyingsense studynote inner join sy_student stu on stu.id = studynote.studentid inner join sy_account acc on acc.id = stu.accountid where studynote.id = ?id ) a where 1=1 limit 1  ";

            List<MySqlParameter> paramCollection = new List<MySqlParameter>();
            paramCollection.Add(new MySqlParameter("id", id));
            paramCollection.Add(new MySqlParameter("accountid", accountid));

            DataSet ds = new DataSet();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(ds);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }

            List<dynamic> talkList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
            return talkList;
        }




        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="dataPraise"></param>
        /// <returns></returns>
        public dynamic commonPraise(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    string sql = " insert into sy_praise(id,eventid,accountid,createtime) select UUID(),?eventid,?accountid,NOW() ; ";
                    List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                    paramCollection.Add(new MySqlParameter("eventid", dataPraise.eventid));
                    paramCollection.Add(new MySqlParameter("accountid", dataPraise.accountid));

                    comm.Parameters.AddRange(paramCollection.ToArray());
                    comm.CommandText = sql;
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


        /// <summary>
        /// 评论发布
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic interflowComment(dynamic dataComment)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    string sql = " insert into sy_classexchange(id,classid,content,accountid,fid,createtime,studentid,usertype) select ?id,?classid,?content,?accountid,?fid,now(),?studentid,?usertype; ";
                    List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                    paramCollection.Add(new MySqlParameter("id", dataComment.id));
                    paramCollection.Add(new MySqlParameter("classid", dataComment.classid));
                    paramCollection.Add(new MySqlParameter("content", Convert.ToString(dataComment.content)));
                    paramCollection.Add(new MySqlParameter("accountid", dataComment.accountid));
                    paramCollection.Add(new MySqlParameter("fid", dataComment.fid));
                    paramCollection.Add(new MySqlParameter("studentid", dataComment.studentid));
                    paramCollection.Add(new MySqlParameter("usertype", dataComment.usertype));

                    comm.Parameters.AddRange(paramCollection.ToArray());
                    comm.CommandText = sql;
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


        /// <summary>
        /// 分页获取班级必修课程
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic searchClassCoursewarelist(dynamic queryModel)
        {
            int pageSize = Convert.ToInt32(queryModel.pageSize.ToString());
            int currentPage = Convert.ToInt32(queryModel.currentPage.ToString());
            int currentIndex = (currentPage - 1) * pageSize;

            string classid = queryModel.classid.ToString();
            string studentid = queryModel.studentid.ToString();


			string sql = @"select cw.teachervideo,cw.pptvideo,cw.pptcoursefile_servername,cc.coursewareid,cw.name,cw.teachersname,cw.imagephoto,cc.id classcourseid,cw.courseyear,cw.studytime 
						,cw.grade,ifnull(vl.playpercentage,'0%') playpercentage,ifnull(vl.isplaycompletion,0) isplaycompletion 
						,(select count(1) from sy_classcourse_note where coursewareid = cw.id and  studentid = ?studentid ) notecount 
						,(select count(1) from sy_class_faq where coursewareid = cw.id and studentid = ?studentid  and (fid is null or fid='')) faqcount 
						from sy_classcourse cc inner join sy_courseware cw on cw.id = cc.coursewareid 
						left join (select * from sy_video_log where studentid = ?studentid) vl on vl.coursewareid = cw.id 
						where 1>0 and cw.mainstatus >=0 ";

            string sql_count = @"select count(1) totalServerItems from sy_classcourse cc 
								inner join sy_courseware cw on cw.id = cc.coursewareid  where 1>0 ";

            string where = "";
            List<MySqlParameter> paramCollection = new List<MySqlParameter>();
			if (!string.IsNullOrEmpty(classid))
			{
                sql = sql + " and cc.classid = ?classid ";
                sql_count = sql_count + " and cc.classid = ?classid ";
                paramCollection.Add(new MySqlParameter("classid", classid));
			}
			else
			{
				sql = sql + " and exists(select * from sy_class_user scu where scu.classid=cc.classid and scu.userid=?studentid) ";
				sql_count = sql_count + " and exists(select * from sy_class_user scu where scu.classid=cc.classid and scu.userid=?studentid)  ";
			}
            paramCollection.Add(new MySqlParameter("studentid", studentid));

            string order = queryModel.orderType == 1 ? " order by vl.lasttime desc " : " order by CAST(REPLACE(vl.playpercentage,'%','') AS SIGNED) desc";
            sql += where + order + "  limit " + currentIndex.ToString() + "," + pageSize.ToString() + ";";
            sql_count += where + ";";

            DataSet ds = new DataSet();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                if (currentPage == 1)
                    cmd.CommandText = sql + sql_count;
                else
                    cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(ds);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + sql_count + ex);
            }
            finally
            {
                conn.Close();
            }

            int datacount = 0;
            if (currentPage == 1)
            {
                datacount = Convert.ToInt32(ds.Tables[1].Rows[0][0]);
            }
            List<dynamic> courseList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
            dynamic model = new
            {
                courseList = courseList,
                datacount = datacount
            };
            return model;
        }


		/// <summary>
        /// 分页所有必修课去掉重复，获取班级必修课程
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
		public dynamic searchClassRequireCoursewarelist(dynamic queryModel)
		{
			int pageSize = Convert.ToInt32(queryModel.pageSize.ToString());
			int currentPage = Convert.ToInt32(queryModel.currentPage.ToString());
			int currentIndex = (currentPage - 1) * pageSize;

			string classid = queryModel.classid.ToString();
			string studentid = queryModel.studentid.ToString();

			string fieldlist = @"cw.id as coursewareid,cw.teachervideo,cw.pptvideo,cw.pptcoursefile_servername,cw.name,cw.teachersname,cw.imagephoto,cw.courseyear,cw.studytime 
						,cw.grade,ifnull(vl.playpercentage,'0%') playpercentage,ifnull(vl.isplaycompletion,0) isplaycompletion 
						,(select count(1) from sy_classcourse_note where coursewareid = cw.id and  studentid =?studentid ) notecount 
						,(select count(1) from sy_class_faq where coursewareid = cw.id and studentid =?studentid and ifnull(fid,'') <> '') faqcount ";
			string sql = string.Empty;
			string sqltemplet = @"select {0} 
						from sy_courseware cw  
						left join (select * from sy_video_log where studentid =?studentid) vl on vl.coursewareid = cw.id 
						where cw.mainstatus >=0 
						and exists(select * from sy_classcourse cc where cw.id = cc.coursewareid {1}
						and exists(select * from sy_class_user scu where scu.classid=cc.classid and scu.userid=?studentid))";

			string sql_count = string.Empty;

			string where = "";
			List<MySqlParameter> paramCollection = new List<MySqlParameter>();
			paramCollection.Add(new MySqlParameter("studentid", studentid));
			if (!string.IsNullOrEmpty(classid))
			{
				sql = string.Format(sqltemplet, fieldlist, " and cc.classid = ?classid  ");
				sql_count = string.Format(sqltemplet, " count(1) as totalServerItems ", " and cc.classid = ?classid ");
				paramCollection.Add(new MySqlParameter("classid", classid));
			}
			else
			{
				sql = string.Format(sqltemplet, fieldlist, " ");
				sql_count = string.Format(sqltemplet, " count(1) as totalServerItems ", " ");
			}
			
			string order = queryModel.orderType == 1 ? " order by vl.lasttime desc " : " order by CAST(REPLACE(vl.playpercentage,'%','') AS SIGNED) desc";
			sql += where + order + "  limit " + currentIndex.ToString() + "," + pageSize.ToString() + ";";
			sql_count += where + ";";

			DataSet ds = new DataSet();
			MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
			try
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
				if (currentPage == 1)
					cmd.CommandText = sql + sql_count;
				else
					cmd.CommandText = sql;
				cmd.Parameters.AddRange(paramCollection.ToArray());
				MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
				adpt.Fill(ds);
			}
			catch (Exception ex)
			{
				ErrLog.Log(sql + sql_count + ex);
			}
			finally
			{
				conn.Close();
			}

			int datacount = 0;
			if (currentPage == 1)
			{
				datacount = Convert.ToInt32(ds.Tables[1].Rows[0][0]);
			}
			List<dynamic> courseList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
			dynamic model = new
			{
				courseList = courseList,
				datacount = datacount
			};
			return model;
		}


        /// <summary>
        /// 获取学员通讯录
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic GetStudentContacts(dynamic queryModel)
        {
            int pageSize = Convert.ToInt32(queryModel.pageSize.ToString());
            int currentPage = Convert.ToInt32(queryModel.currentPage.ToString());
            int currentIndex = (currentPage - 1) * pageSize;
            string classid = queryModel.classid.ToString();
            string searchText = queryModel.searchText.ToString();

            string sql = @"select us.id,us.name as studentname,us.rank,dm.name departmentname,us.cellphone phonenum from sy_class_user cu  inner join sy_user us on cu.userid = us.id inner join sy_department dm on us.departmentid = dm.id where cu.classid = ?classid";
            string sql_count = @"select count(1) totalServerItems from sy_class_user cu inner join sy_user us on cu.userid = us.id inner join sy_department dm on us.departmentid = dm.id  where cu.classid = ?classid ";

            string where = "";
            List<MySqlParameter> paramCollection = new List<MySqlParameter>();
            paramCollection.Add(new MySqlParameter("classid", classid));

            if (!string.IsNullOrEmpty(searchText.Trim()))
            {
                where += " and (us.name like concat('%',?searchText,'%') or dm.name like concat('%',?searchText,'%') or us.rank like concat('%',?searchText,'%') )";
                paramCollection.Add(new MySqlParameter("searchText", searchText));
            }

            sql += where + " limit " + currentIndex.ToString() + "," + pageSize.ToString() + ";";
            sql_count += where + ";";

            DataSet ds = new DataSet();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                if (currentPage == 1)
                    cmd.CommandText = sql + sql_count;
                else
                    cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(ds);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + sql_count + ex);
            }
            finally
            {
                conn.Close();
            }

            int datacount = 0;
            if (currentPage == 1)
            {
                datacount = Convert.ToInt32(ds.Tables[1].Rows[0][0]);
            }
            List<dynamic> stuList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
            dynamic model = new
            {
                stuList = stuList,
                datacount = datacount
            };
            return model;
        }
    }
}
