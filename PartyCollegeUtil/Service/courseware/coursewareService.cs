using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Text;
using System.Dynamic;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using Newtonsoft.Json.Linq;

namespace PartyCollegeUtil.Service
{
    public class CourseWareService
    {

        /// <summary>
        /// 根据筛选条件获取符合条件的所有课程
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic GetAllCourseWareList(dynamic queryModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.message = "请求失败";
            dynObj.result = false;

            string condation = Convert.ToString(queryModel.condation);
            string onecate = Convert.ToString(queryModel.onecate);
            string twocate = Convert.ToString(queryModel.twocate);
            string year = Convert.ToString(queryModel.year);
            string courseType = Convert.ToString(queryModel.courseType);
            string searchType = Convert.ToString(queryModel.searchType);
            string courseCategory = Convert.ToString(queryModel.courseCategory);
            string courseLevel = Convert.ToString(queryModel.courseLevel);
            string studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);
            string sqlTemp = string.Empty;

            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.pageIndex);
            int totalIndex = (pageIndex - 1) * pageSize;

            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("studentid", HttpContext.Current.Session["studentid"]));

            //如果一级分类和二级分类同时选择，条件以二级分类为主
            if (!string.IsNullOrEmpty(onecate) && !string.IsNullOrEmpty(twocate))
            {
                parameters.Add(new MySqlParameter("twocate", twocate));
                sqlTemp += " and cate.id=?twocate";
            }//如果一级分类选择，二级分类未选择，查询该一级分类下面所有的二级分类数据
            else if (!string.IsNullOrEmpty(onecate) && string.IsNullOrEmpty(twocate))
            {
                parameters.Add(new MySqlParameter("onecate1", onecate + "%"));
                parameters.Add(new MySqlParameter("onecate2", onecate));
                sqlTemp += " and (cate.fids like @onecate1 or cate.id=@onecate2)";
            }
            else if (string.IsNullOrEmpty(onecate) && !string.IsNullOrEmpty(twocate))
            {
                parameters.Add(new MySqlParameter("twocate", twocate));
                sqlTemp += " and cate.id=@twocate";
            }

            if (!string.IsNullOrEmpty(year))
            {
                string[] sp = year.Split(',');
                parameters.Add(new MySqlParameter("year", sp[1]));
                //sqlTemp += " and ware.courseyear " + sp[0] + " @year";
                sqlTemp += " and DATE_FORMAT(ware.createtime,'%Y') " + sp[0] + " @year";
            }
            if (!string.IsNullOrEmpty(courseType))
            {
                parameters.Add(new MySqlParameter("coursetype", courseType));
                sqlTemp += " and coursetype=@coursetype";
            }


            if (!string.IsNullOrEmpty(courseCategory))
            {
                parameters.Add(new MySqlParameter("coursecategory", courseCategory));
                sqlTemp += " and ware.coursecategory=@coursecategory";
            }
            if (!string.IsNullOrEmpty(courseLevel))
            {
                parameters.Add(new MySqlParameter("courselevel", courseLevel));
                sqlTemp += " and ware.courselevel=@courselevel";
            }

             

            if (!string.IsNullOrEmpty(condation))
            {
                parameters.Add(new MySqlParameter("condation", "%" + condation + "%"));
                sqlTemp += " and (ware.`name` like @condation)";
                //sqlTemp += " and (ware.teachersname like @condation or ware.`name` like @condation or ware.source like @condation )";
            }

            if (searchType == "3")
            {
                sqlTemp += " and exists(select 1 from sy_courseware_recommend where coursewareid = ware.id) ";
            }

            string orderby = " order by ware.createtime desc ";
            if (!string.IsNullOrEmpty(searchType))
            {
                switch (searchType)
                {
                    case "1"://最新
                        orderby = " order by ware.createtime desc";
                        break;
                    case "2"://精品
                        orderby = " order by ware.grade desc";
                        break;
                    case "3"://推荐
                        orderby = " order by ware.name ";
                        break;
                    case "4"://排行
                        orderby = " order by ware.choosecount desc";
                        break;
                    default://最新
                        orderby = " order by ware.createtime desc";
                        break;
                }
            }

            //string sqlCount = " count(1) ";
            //string sqlColumn = " cate.id categoryid,cate.`name` categoryname ,ware.id coursewareid,ware.`name` coursewarename,ware.teachersname,DATE_FORMAT(ware.createtime,'%Y.%m.%d') createtime,ware.studytime,ware.coursetype,ware.courseyear,ware.source,ware.grade,ware.imagephoto,(select count(1) from sy_courseware_user where coursewareid=ware.id and studentid='" + studentid + "') ischoose  ";
            //string sqlExec = "select {0} from sy_courseware_category_relatiion rela inner JOIN sy_courseware_category cate on rela.categoryid=cate.id INNER JOIN sy_courseware ware on rela.coursewareid=ware.id where 1=1 ";
            //string sqlLimit = " limit " + totalIndex + "," + pageSize;

            string sqlCount = " count(1) ";
            string sqlColumn = " cate.id categoryid,cate.`name` categoryname ,cate.fid,ware.id coursewareid,ware.`name` coursewarename,ware.teachersname,ware.teachervideo,ware.pptvideo,ware.pptcoursefile_servername,DATE_FORMAT(ware.createtime,'%Y.%m.%d') uploadtime,ware.studytime,ware.coursetype,ware.source,ware.grade,ware.imagephoto,case when wareuser.id is null then 0 else 1 end iselectivechoose,DATE_FORMAT(wareuser.createtime,'%Y.%m.%d') jointime ,IFNULL((select isplaycompletion from sy_video_log where studentid=wareuser.studentid and coursewareid=ware.id),0) isplaycompletion,(select count(1) from sy_classcourse classcourse where classid in(select classid from sy_class_user cuser where userid=?studentid) and coursewareid=ware.id) isrequiredchoose  ";
            string sqlExec = "select {0} from sy_courseware_category_relatiion rela inner JOIN sy_courseware_category cate on rela.categoryid=cate.id INNER JOIN sy_courseware ware on rela.coursewareid=ware.id  left join sy_courseware_user wareuser on ware.id=wareuser.coursewareid and wareuser.studentid=?studentid and wareuser.status>=0 where 1=1 and ware.mainstatus >= 0  and not EXISTS(select 1 from sy_class_user scu inner join sy_classcourse sc on sc.classid=scu.classid where scu.userid=?studentid and ware.id=sc.coursewareid)";
            string sqlLimit = " limit " + totalIndex + "," + pageSize;






            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                sql = string.Format(sqlExec + sqlTemp, sqlCount);
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(parameters.ToArray());
                dynObj.allcount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = string.Format(sqlExec + sqlTemp + orderby + sqlLimit, sqlColumn);
                cmd.CommandText = sql;
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                DataTable dtdata = new DataTable();
                adpt.Fill(dtdata);

                dynObj.message = "请求成功";
                dynObj.result = true;
                dynObj.list = UtilDataTableToList<dynamic>.ToDynamicList(dtdata);
            }
            return dynObj;
        }

        /// <summary>
        /// 获取学习记录
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic GetAllStudyList(dynamic queryModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.message = "请求失败";
            dynObj.result = false;

            string condation = Convert.ToString(queryModel.condation);
            string searchType = Convert.ToString(queryModel.searchType);
            string studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);
            string sqlTemp = string.Empty;

            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.pageIndex);
            int totalIndex = (pageIndex - 1) * pageSize;

            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("studentid", studentid));

            if (!string.IsNullOrEmpty(condation))
            {
                parameters.Add(new MySqlParameter("condation", "%" + condation + "%"));
                sqlTemp += " and ware.`name` like @condation";
            }

            string orderby = string.Empty;
            string sqlCTemp = string.Empty;
            if (!string.IsNullOrEmpty(searchType))
            {
                switch (searchType)
                {
                    case "1"://最近学习
                        orderby = " order by log.lasttime desc";
                        break;
                    case "2"://选择时间
                        orderby = " order by wareusr.createtime desc";
                        break;
                    case "3"://学习进度
                        orderby = " order by  CAST(REPLACE(log.playpercentage,'%','') AS SIGNED) desc";
                        break;
                    default://最新
                        orderby = " order by ware.createtime desc";
                        break;
                }
            }

            //string sqlCount = " count(1) ";
            //string sqlColumn = " ware.id coursewareid,ware.`name`,ware.courseyear,ware.studytime,ware.grade,ware.imagephoto,log.isplaycompletion,log.isfinished,log.playpercentage,log.id,0 notecount,0 quecount,wareusr.id wareusrid";
            //string sqlExec = "select {0} from sy_courseware_user wareusr inner join  sy_video_log log on wareusr.studentid=log.studentid and wareusr.coursewareid=log.coursewareid inner join sy_courseware ware on log.coursewareid=ware.id where log.studentid=@studentid ";
            //string sqlLimit = " limit " + totalIndex + "," + pageSize;

            string sqlCount = " count(1) ";
            string sqlColumn = @" ware.id coursewareid,ware.`name`,ware.teachersname,ware.courseyear,ware.studytime,ware.grade,ware.imagephoto,IFNULL(log.isplaycompletion,0) isplaycompletion
								,ware.teachervideo,ware.pptvideo,ware.pptcoursefile_servername
								,IFNULL(log.isfinished,0)isfinished,IFNULL(log.playpercentage,'0%') playpercentage,log.id
								,(select count(1) from sy_classcourse_note where studentid=wareusr.studentid and coursewareid=wareusr.coursewareid) notecount
								,(select count(1) from sy_class_faq where studentid=wareusr.studentid and coursewareid=wareusr.coursewareid and IFNULL(fid,'')='') quecount,wareusr.id wareusrid ";
            string sqlExec = "select {0} from sy_courseware_user wareusr inner join sy_courseware ware on wareusr.coursewareid=ware.id left join  sy_video_log log on wareusr.coursewareid=log.coursewareid  and log.studentid=@studentid where wareusr.studentid=@studentid and ware.mainstatus >= 0  and wareusr.status>=0";
            string sqlLimit = " limit " + totalIndex + "," + pageSize;


            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                sql = string.Format(sqlExec + sqlTemp, sqlCount);
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(parameters.ToArray());
                dynObj.allcount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = string.Format(sqlExec + sqlTemp + orderby + sqlLimit, sqlColumn);
                cmd.CommandText = sql;
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                DataTable dtdata = new DataTable();
                adpt.Fill(dtdata);

                dynObj.message = "请求成功";
                dynObj.result = true;
                dynObj.list = UtilDataTableToList<dynamic>.ToDynamicList(dtdata);
            }
            return dynObj;
        }


        /// <summary>
        /// 获取课程评价
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic GetAllCourseComments(dynamic queryModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.message = "请求失败";
            dynObj.result = false;


            string coursewareid = Convert.ToString(queryModel.coursewareid);
            string studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);


            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.pageIndex);
            int totalIndex = (pageIndex - 1) * pageSize;

            List<MySqlParameter> parameters = new List<MySqlParameter>();
            //parameters.Add(new MySqlParameter("studentid", studentid));
            parameters.Add(new MySqlParameter("coursewareid", coursewareid));

            string sqlCount = " count(1) ";
            string sqlColumn = " usr.name,usr.photo_serverthumbname,DATE_FORMAT(com.createtime,'%Y.%m.%d') submittime,com.* ";
            //string sqlExec = "select {0} from sy_courseware_comment  com inner join sy_user usr on com.studentid=usr.id where com.studentid=?studentid and com.coursewareid=?coursewareid ";
            string sqlExec = "select {0} from sy_courseware_comment  com inner join sy_user usr on com.studentid=usr.id where com.coursewareid=?coursewareid ";
            string sqlOrder = " order by com.createtime desc";
            string sqlLimit = " limit " + totalIndex + "," + pageSize;


            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                sql = string.Format(sqlExec, sqlCount);
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(parameters.ToArray());
                dynObj.allcount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = string.Format(sqlExec + sqlOrder + sqlLimit, sqlColumn);
                cmd.CommandText = sql;
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                DataTable dtdata = new DataTable();
                adpt.Fill(dtdata);

                dynObj.message = "请求成功";
                dynObj.result = true;
                dynObj.list = UtilDataTableToList<dynamic>.ToDynamicList(dtdata);
            }
            return dynObj;
        }


        public dynamic AddCourseWareUser(dynamic queryModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.message = "请求失败";
            dynObj.result = false;

            string coursewareid = Convert.ToString(queryModel.coursewareid);
            string status = Convert.ToString(queryModel.status);
            string studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);
            DateTime createtime = DateTime.Now;

            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("studentid", studentid));
            parameters.Add(new MySqlParameter("coursewareid", coursewareid));
            parameters.Add(new MySqlParameter("createtime", createtime));


            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.Parameters.Clear();
                cmd.Parameters.AddRange(parameters.ToArray());

                sql = "select id from sy_courseware_user where studentid=?studentid and coursewareid=?coursewareid";
                cmd.CommandText = sql;
                object objValue = cmd.ExecuteScalar();


                List<string> sqlTmpList = new List<string>(); 
                sqlTmpList.Add(string.Format("status={0}", status));
                if (status=="0")
                    sqlTmpList.Add("createtime=now()"); 
                string sqlTmp = string.Join(",", sqlTmpList.ToArray()); 
                if (objValue != null && objValue != DBNull.Value)
                {
                    sql = string.Format("update sy_courseware_user set {1} where id='{0}';", objValue.ToString(), sqlTmp);
                }
                else
                {
                    sql = "insert into sy_courseware_user(id,studentid,coursewareid,createtime,status) values(uuid(),?studentid,?coursewareid,?createtime,0);";
                    //课程库选课次数+1
                    sql += " update sy_courseware set choosecount = choosecount + 1 where id = ?coursewareid ;";
                }
                cmd.CommandText = sql;
                int exec = cmd.ExecuteNonQuery();
                 
                dynObj.message = "请求成功";
                dynObj.result = true;
                dynObj.data = createtime.ToString("yyyy.MM.dd");
            }
            return dynObj;
        }



        //修复数据用
        public dynamic fixedCourse()
        {
            dynamic returnInfo = new ExpandoObject();
            string sql = string.Empty;
            sql = @"select * from sy_courseware sc where not exists(select * from sy_platform_package_course pkgc where sc.id=pkgc.coursewareid and sc.createplatformid=pkgc.platformid)";
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            MySqlTransaction tran = null;

            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adpt.Fill(dt);
                foreach (DataRow item in dt.Rows)
                {
                    sql = @"insert into sy_platform_package_course(id,coursewareid,coursewarename,platformid,createtime,createuser,category)values
							(uuid(),?coursewareid,?coursewarename,?platformid,now(),'sysadmin',?category)";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("coursewareid", item["id"]));
                    cmd.Parameters.Add(new MySqlParameter("coursewarename", item["name"]));
                    cmd.Parameters.Add(new MySqlParameter("platformid", item["createplatformid"]));
                    cmd.Parameters.Add(new MySqlParameter("category", "0"));
                    cmd.ExecuteNonQuery();
                }
                tran.Commit();
                returnInfo.code = "success";
                returnInfo.message = "";
            }
            catch (Exception ex)
            {
                returnInfo.code = "failed";
                returnInfo.message = "";
                tran.Rollback();
            }
            finally
            {
                conn.Close();
            }
            return returnInfo;
        }

        //获取课程下面问题列表
        public dynamic searchQuestions(dynamic queryModel)
        {
            int pageSize = Convert.ToInt32(queryModel.pagesize.ToString());
            int currentPage = Convert.ToInt32(queryModel.pageindex.ToString());
            int currentIndex = (currentPage - 1) * pageSize;

            int sortType = Convert.ToInt32(queryModel.sortType.ToString());
            int orderType = Convert.ToInt32(queryModel.orderType.ToString());


            int searchType = Convert.ToInt32(queryModel.searchType.ToString());

            string accountid = queryModel.accountid.ToString();
            string coursewareid = queryModel.coursewareid.ToString();


            string sql = @"select faq.id,faq.accountid,faq.classid,faq.usertype fromtype,faq.studentid,faq.content qcontent,date_format(faq.createtime,'%Y-%m-%d %H:%i:%s') createdtime,acc.name quser,(select count(1) FROM sy_praise where eventid = faq.id) as clickcount,(select count(1) FROM sy_praise where eventid = faq.id and accountid = ?accountid) as isclick,(select count(1) FROM sy_attention where eventid = faq.id) as attentioncount,(select count(1) FROM sy_attention where eventid = faq.id and accountid = ?accountid ) as isattention from sy_class_faq faq left join sy_user acc on faq.studentid = acc.id where faq.coursewareid = ?coursewareid and ifnull(faq.fid,'')='' {2} and faq.shielding = 0  {0} {1}  ";
            string sql_reply = @"select faq.id,faq.accountid,faq.status,faq.fid,faq.content pcontent,date_format(faq.createtime,'%Y-%m-%d %H:%i:%s') createdtime,acc.name fromuser,faq.classid,faq.usertype fromtype,faq.studentid,(select count(1) FROM sy_praise where eventid = faq.id) as clickcount,(select count(1) FROM sy_praise where eventid = faq.id and accountid = ?accountid ) as isclick from sy_class_faq faq left join sy_user acc on faq.studentid = acc.id where faq.coursewareid = ?coursewareid and faq.fid in ( select id FROM (select faq.id from sy_class_faq faq where faq.coursewareid = ?coursewareid and ifnull(faq.fid,'')='' {2} and faq.shielding = 0  {0} {1} ) a ) and (faq.status =1 or faq.accountid = ?accountid) order by faq.createtime ";

            //排序字段
            string sorts = " order by  faq.createtime ";
            if (sortType == 1)
            {
                //时间排序
                sorts = " order by faq.createtime ";
            }
            else if (sortType == 2)
            {
                sorts = " order by (select count(1) FROM sy_praise where eventid = faq.id) ";
            }
            //排序顺序
            string orders = " desc ";
            if (orderType == 1)
            {
                //降序
                orders = " desc ";
            }
            else if (orderType == 2)
            {
                //升序
                orders = " asc ";
            }

            sql = string.Format(sql, sorts + orders, " limit " + currentIndex.ToString() + "," + pageSize.ToString() + "; ", searchType == 1 ? " and faq.accountid = ?accountid " : "");
            sql_reply = string.Format(sql_reply, sorts + orders, " limit " + currentIndex.ToString() + "," + pageSize.ToString() + " ", searchType == 1 ? " and faq.accountid = ?accountid " : "");

            DataSet ds = new DataSet();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = (sql + sql_reply);

                List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                paramCollection.Add(new MySqlParameter("accountid", accountid));
                paramCollection.Add(new MySqlParameter("coursewareid", coursewareid));

                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(ds);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + sql_reply + ex);
            }
            finally
            {
                conn.Close();
            }

            List<dynamic> questionList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[0]);
            List<dynamic> questionReplyList = UtilDataTableToList<dynamic>.ToDynamicList(ds.Tables[1]);
            dynamic model = new
            {
                questionList = questionList,
                questionReplyList = questionReplyList
            };
            return model;
        }



        /// <summary>
        /// 提交评论
        /// </summary>
        /// <param name="appraiseList"></param>
        /// <returns></returns>
        public dynamic submitAppraise(dynamic appraiseList)
        {

            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    //获取课程评价的项平均分
                    DataTable dtScore = getAppraiseitem(appraiseList.coursewareid.ToString());

                    decimal sumscore = 0;
                    StringBuilder sbsql = new StringBuilder();
                    foreach (var item in appraiseList.scoreList)
                    {
                        //项评分明细
                        decimal score = Convert.ToDecimal(item.rate) * 2;
                        sumscore += score;
                        sbsql.Append(" insert into sy_courseware_appraisedetail(id,accountid,itemname,itemid,itemscore,createtime,studentid,classid,coursewareid,classcourseid) ");
                        sbsql.AppendFormat(" select uuid(),'{0}','{1}','{2}',{3},NOW(),'{4}','{5}','{6}','{7}'; ",
                            appraiseList.accountid, item.itemname, item.itemid, score, appraiseList.studentid, appraiseList.classid, appraiseList.coursewareid, appraiseList.classcourseid);

                        //计算项平均分
                        if (dtScore != null && dtScore.Rows.Count > 0)
                        {
                            DataRow[] dtRows = dtScore.Select(string.Format("itemid='{0}'", item.itemid));
                            if (dtRows.Length > 0)
                                sbsql.AppendFormat("update sy_courseware_appraiseitem set gradetotal = (gradetotal + {0}),gradecount = gradecount + 1,itemscore = gradetotal / gradecount where id = '{1}';", score, dtRows[0]["id"]);
                            else
                                sbsql.AppendFormat("insert into sy_courseware_appraiseitem(id,coursewareid,itemid,itemname,itemscore,gradecount,gradetotal) select UUID(),'{0}','{1}','{2}',{3},{4},{5};",
                                     appraiseList.coursewareid, item.itemid, item.itemname, score, 1, score);
                        }
                        else
                        {
                            sbsql.AppendFormat("insert into sy_courseware_appraiseitem(id,coursewareid,itemid,itemname,itemscore,gradecount,gradetotal) select UUID(),'{0}','{1}','{2}',{3},{4},{5};",
                                 appraiseList.coursewareid, item.itemid, item.itemname, score, 1, score);
                        }

                    }

                    //个人评价总分
                    sbsql.AppendFormat(" insert into sy_courseware_appraise(id,accountid,createtime,sumscore,studentid,classid,coursewareid,classcourseid) ");
                    sbsql.AppendFormat(" select uuid(),'{0}',now(),{1},'{2}','{3}','{4}','{5}'; ", appraiseList.accountid, sumscore, appraiseList.studentid, appraiseList.classid, appraiseList.coursewareid, appraiseList.classcourseid);

                    //课程平均分，总分，评价人数 
                    sbsql.AppendFormat(" update sy_courseware set gradecount = ifnull(gradecount,0)+1, gradetotal = gradetotal + {1},grade = gradetotal/gradecount /5 where id = '{0}';  ", appraiseList.coursewareid, sumscore);

                    //评论
                    if (appraiseList.courseAppraiseContent != null && appraiseList.courseAppraiseContent.ToString() != "")
                    {
                        sbsql.AppendFormat("insert into sy_courseware_comment(id,studentid,coursewareid,comments,createtime,status) select uuid(),'{0}','{1}','{2}',now(),0;", appraiseList.studentid, appraiseList.coursewareid, appraiseList.courseAppraiseContent);
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
        /// 根据课程id获取每项平均分
        /// </summary>
        /// <param name="coursewareid"></param>
        /// <returns></returns>
        public DataTable getAppraiseitem(string coursewareid)
        {
            string sql = @"select * from sy_courseware_appraiseitem where coursewareid = ?coursewareid; ";

            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                paramCollection.Add(new MySqlParameter("coursewareid", coursewareid));
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }
            return dt;
        }


        /// <summary>
        /// 关注
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic commonAttention(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    string sql = " insert into sy_attention(id,eventid,accountid,createtime) select UUID(),?eventid,?accountid,NOW() ; ";
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
        /// 保存学后感
        /// </summary>
        /// <param name="ExamModel"></param>
        /// <returns></returns>
        public dynamic InsertClasscourseLearningsense(dynamic classcourseLearningsenseModel)
        {
            dynamic learningsenseModel = classcourseLearningsenseModel.learningsenseModel;
            dynamic queryModel = classcourseLearningsenseModel.queryModel;

            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    string sql = " insert into sy_classcourse_learningsense(id,studentid,title,content,classcourseid,recommendstatus,createdtime,status,score,classid,coursewareid,platformid) select ?id,?studentid,?title,?content,?classcourseid,?recommendstatus,now(),?status,0,?classid,?coursewareid,?platformid ; ";
                    List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                    paramCollection.Add(new MySqlParameter("id", learningsenseModel.id));
                    paramCollection.Add(new MySqlParameter("studentid", learningsenseModel.studentid));
                    paramCollection.Add(new MySqlParameter("title", Convert.ToString(learningsenseModel.title)));
                    paramCollection.Add(new MySqlParameter("content", Convert.ToString(learningsenseModel.content)));
                    paramCollection.Add(new MySqlParameter("classcourseid", learningsenseModel.classcourseid));
                    paramCollection.Add(new MySqlParameter("recommendstatus", learningsenseModel.recommendedstatus));
                    paramCollection.Add(new MySqlParameter("status", learningsenseModel.status));
                    paramCollection.Add(new MySqlParameter("classid", learningsenseModel.classid));
                    paramCollection.Add(new MySqlParameter("coursewareid", learningsenseModel.coursewareid));
                    paramCollection.Add(new MySqlParameter("platformid", HttpContext.Current.Session["platformid"]));

                    comm.Parameters.AddRange(paramCollection.ToArray());
                    comm.CommandText = sql;
                    int resultCount = comm.ExecuteNonQuery();
                    //if (resultCount > 0 && learningsenseModel.status.ToString() == "1")
                    //{
                    //    SyVideoLogService service = new SyVideoLogService();
                    //    service.UpdateStudyStatus(queryModel);
                    //    service.UpdateStudentStudyStatus(queryModel);
                    //}

                    //PartyCollege.Model.CommonSQL.doLog4net(string.Format("操作-{0}学后感", learningsenseModel.status.ToString() == "0" ? "保存" : "提交"), "20035");

                    result = true;
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conn.Close();
            }
            return result;
        }


        /// <summary>
        /// 提交学后感
        /// </summary>
        /// <param name="ExamModel"></param>
        /// <returns></returns>
        public dynamic submitClasscourseLearningsense(dynamic classcourseLearningsenseModel)
        {
            dynamic learningsenseModel = classcourseLearningsenseModel.learningsenseModel;
            dynamic queryModel = classcourseLearningsenseModel.queryModel;


            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    string sql = " update sy_classcourse_learningsense set title = ?title,content=?content,status=?status where id=?id ; ";
                    List<MySqlParameter> paramCollection = new List<MySqlParameter>();
                    paramCollection.Add(new MySqlParameter("id", learningsenseModel.id));
                    paramCollection.Add(new MySqlParameter("title", Convert.ToString(learningsenseModel.title)));
                    paramCollection.Add(new MySqlParameter("content", Convert.ToString(learningsenseModel.content)));
                    paramCollection.Add(new MySqlParameter("status", learningsenseModel.status));

                    comm.Parameters.AddRange(paramCollection.ToArray());
                    comm.CommandText = sql;
                    int resultCount = comm.ExecuteNonQuery();
                    //if (resultCount > 0 && learningsenseModel.status.ToString() == "1")
                    //{
                    //    SyVideoLogService service = new SyVideoLogService();
                    //    service.UpdateStudyStatus(queryModel);
                    //    service.UpdateStudentStudyStatus(queryModel);
                    //}


                    ////日志
                    //PartyCollege.Model.CommonSQL.doLog4net(string.Format("操作-{0}学后感", learningsenseModel.status.ToString() == "0" ? "保存" : "提交"), "20035");

                    result = true;
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conn.Close();
            }
            return result;
        }


        /// <summary>
        /// 课程分类信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic courseMove(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    comm.Transaction = tran;
                    //String categorysid = String.Empty;
                    DataTable dt = new DataTable();
                    foreach (String coursewareid in dataPraise.categoryids.ToString().Split(','))
                    {
                        //先清掉课程关联的分类，（一个课程只属于一个分类）
						
						dt = new DataTable();
						comm.Parameters.Clear();
						comm.CommandText = "select id,categoryid,coursewareid from sy_courseware_category_relatiion where coursewareid=?coursewareid";
						comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
						MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
						adpt.Fill(dt);
						foreach (DataRow item in dt.Rows)
						{
							comm.Parameters.Clear();
							comm.CommandText = "delete from sy_courseware_category_relatiion where coursewareid = ?coursewareid and categoryid=?categoryid";
							comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
							comm.Parameters.Add(new MySqlParameter("categoryid", item["categoryid"].ToString()));
							comm.ExecuteNonQuery();

							//updateCourseCategoryCacheNumber(comm,item["categoryid"].ToString());
						}

						comm.Parameters.Clear();
						comm.CommandText = "insert into sy_courseware_category_relatiion(id,categoryid,coursewareid) values(uuid(),?categoryid,?coursewareid)";
						comm.Parameters.Add(new MySqlParameter("categoryid", dataPraise.categoryid));
						comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
						comm.ExecuteNonQuery();

						//updateCourseCategoryCacheNumber(comm, Convert.ToString(dataPraise.categoryid));
						SetQuantity(comm);
                        //categorysid = dataPraise.rootCategoryid + "." + dataPraise.categoryid + "." + coursewareid;
					   // dt = new DataTable();
					   // comm.CommandText = "select id from sy_courseware_category_relatiion where categoryid='" +
					   //dataPraise.categoryid + "' and coursewareid='" + coursewareid + "'";
					   // MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
					   // adpt.Fill(dt);
					   // if (dt != null && dt.Rows.Count > 0)
					   //	 break;
                    }
                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ErrLog.Log(ex);
            }
            finally
            {
                conn.Close();
            }
            return result;
        }


		private void SetQuantity(MySqlCommand cmd)
		{
			cmd.Parameters.Clear();
			//清空现有的统计
			cmd.CommandText = "update sy_courseware_category set coursecount=0,onecoursecount=0,twocoursecount=0 ";
			int exec1 = cmd.ExecuteNonQuery();

			//将所有分类下面所挂的课程数量更新
			//cmd.CommandText = "UPDATE  sy_courseware_category c1 inner join (select rela.categoryid,count(rela.coursewareid) coursecount from sy_courseware_category cate inner join sy_courseware_category_relatiion rela on rela.categoryid=cate.id where cate.fid<>'0' group by rela.categoryid ) c2 on c1.id=c2.categoryid set c1.coursecount=c2.coursecount";
			cmd.CommandText = @"UPDATE  sy_courseware_category c1 inner join (
									select rela.categoryid,count(rela.coursewareid) coursecount from sy_courseware_category cate 
									inner join sy_courseware_category_relatiion rela on rela.categoryid=cate.id 
									INNER JOIN sy_courseware ware on rela.coursewareid=ware.id 
									where 1=1 and ware.mainstatus >= 0  group by rela.categoryid 
									) c2 on c1.id=c2.categoryid set c1.coursecount=c2.coursecount";
			int exec2 = cmd.ExecuteNonQuery();

			cmd.CommandText = "select id,name,coursecount from sy_courseware_category where fid='0'";
			DataTable dt = new DataTable();
			MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
			adpt.Fill(dt);
			string categoryid = string.Empty;
			foreach (DataRow dataRow in dt.Rows)
			{
				cmd.CommandText = string.Format("select sum(coursecount) from sy_courseware_category where fids like '{0}%'", dataRow["id"].ToString());
				object obj = cmd.ExecuteScalar();
				//二级分类数量
				int twocoursecount = obj == DBNull.Value ? 0 : Convert.ToInt32(obj);
				//一级分类数量
				int onecoursecount = Convert.ToInt32(dataRow["coursecount"]);
				//一级分类的课程数=所有二级分类的课程和+一级分类的课程数 
				//int coursecount = onecoursecount + twocoursecount; 

				cmd.CommandText = string.Format("update sy_courseware_category set coursecount={0},twocoursecount={2},onecoursecount={3} where id='{1}'"
					, twocoursecount, dataRow["id"].ToString(), twocoursecount - onecoursecount, onecoursecount);
				int exec3 = Convert.ToInt32(cmd.ExecuteNonQuery());
			}
		}


//		public void updateCourseCategoryCacheNumber(MySqlCommand comm ,string categoryid)
//		{
//			DataTable dttemp = new DataTable();
//			//计算当前分类下的课程数量，包换根节点fid=0的。
//			comm.Parameters.Clear();
//			comm.CommandText = @"select rela.categoryid,count(rela.coursewareid) coursecount from sy_courseware_category cate 
//								inner join sy_courseware_category_relatiion rela on rela.categoryid=cate.id 
//								INNER JOIN sy_courseware ware on rela.coursewareid=ware.id 
//								where 1=1 and ware.mainstatus >= 0 and rela.categoryid=?categoryid group by rela.categoryid ";
//			comm.Parameters.Add(new MySqlParameter("categoryid", categoryid));
//			MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
//			adpt.Fill(dttemp);
//			foreach (DataRow item in dttemp.Rows)
//			{
//				comm.Parameters.Clear();
//				comm.CommandText = "update sy_courseware_category set coursecount=?coursecount where id=?categoryid";
//				comm.Parameters.Add(new MySqlParameter("coursecount", item["coursecount"].ToString()));
//				comm.Parameters.Add(new MySqlParameter("categoryid", item["categoryid"].ToString()));
//				comm.ExecuteNonQuery();
//			}


//			comm.CommandText = string.Format("update sy_courseware_category set coursecount=0 where  fid<>'0'");
//			comm.ExecuteNonQuery();

//			comm.CommandText = "select id,name,coursecount from sy_courseware_category where fid='0'";
//			DataTable dt = new DataTable();
//			adpt = new MySqlDataAdapter(comm);
//			adpt.Fill(dt);
//			int rows = 0, twocoursecount = 0, onecoursecount = 0;
//			int coursecountTemp = 0;
//			foreach (DataRow dataRow in dt.Rows)
//			{
//				//统计除了fid=0 的节点外的课程数量
//				rows = 0;
//				twocoursecount = 0;
//				onecoursecount = 0;
//				comm.CommandText = string.Format("select sum(coursecount) as coursecount,count(*) as rows from sy_courseware_category where fids like '{0}.%'", dataRow["id"].ToString());
//				using (MySqlDataReader reader = comm.ExecuteReader())
//				{
//					if (reader.Read())
//					{
//						rows = Convert.ToInt32(reader["rows"].ToString());
//						coursecountTemp = reader["coursecount"] == DBNull.Value ? 0 : Convert.ToInt32(reader["coursecount"]);
//					}
//				}

//				if (rows > 0)
//				{
//					//二级分类数量
//					twocoursecount = coursecountTemp;
//					//一级分类数量
//					onecoursecount = Convert.ToInt32(dataRow["coursecount"]);
//					//一级分类的课程数=所有二级分类的课程和+一级分类的课程数 
//					//int coursecount = onecoursecount + twocoursecount; 

//					comm.CommandText = string.Format("update sy_courseware_category set coursecount=coursecount+{0},twocoursecount={2},onecoursecount={3} where id='{1}'"
//						, twocoursecount, dataRow["id"].ToString(), twocoursecount - onecoursecount, onecoursecount);
//					comm.ExecuteNonQuery();
//				}
//			}
//		}


        /// <summary>
        /// 课程多分类信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic courseMoveRelatiion(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    String coursewareid = dataPraise.coursewareid;
                    comm.Transaction = tran;
                    //DataTable dt = new DataTable();
                    //comm.CommandText = "select * from sy_courseware_category";
                    //MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
                    //adpt.Fill(dt);

                    comm.CommandText = "delete from sy_courseware_category_relatiion where coursewareid=?coursewareid";
                    comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                    comm.ExecuteNonQuery();
                    comm.Parameters.Clear();

                    foreach (String categoryid in dataPraise.categoryids.ToString().Split(','))
                    {

                        //String golbeid = String.Empty;
                        //foreach (DataRow dr in dt.Rows)
                        //{
                        //    if (dr["id"].ToString().Equals(categoryid))
                        //    {
                        //        golbeid = String.Format("{0}.{1}.{2}", dr["fid"].ToString(), categoryid, coursewareid);
                        //        break;
                        //    }
                        //}

                        comm.CommandText = "insert into sy_courseware_category_relatiion(id,categoryid,coursewareid) values(uuid(),?categoryid,?coursewareid)";
                        comm.Parameters.Add(new MySqlParameter("categoryid", categoryid));
                        comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                        comm.ExecuteNonQuery();
                        comm.Parameters.Clear();
                    }
                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ErrLog.Log(ex);
            }
            finally
            {
                conn.Close();
            }
            return result;
        }


        /// <summary>
        /// 保存课程评价
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic saveCourseExamine(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    comm.Transaction = tran;
                    comm.CommandText = "update sy_courseware set rate=@rate where id=@id;delete from sy_courseware_rate where coursewareid=@id;";
                    comm.Parameters.Add(new MySqlParameter("rate", dataPraise.rate != null ? dataPraise.rate.Value : ""));
                    comm.Parameters.Add(new MySqlParameter("id", dataPraise.coursewareid));
                    comm.ExecuteNonQuery();
                    comm.Parameters.Clear();

                    if (dataPraise.coursewareeidt != null)
                    {
                        if (dataPraise.coursewareeidt.evaluateData != null)
                        {
                            for (int i = 0; i < dataPraise.coursewareeidt.evaluateData.Count; i++)
                            {
                                comm.CommandText = "INSERT INTO sy_courseware_rate(id, coursewareid, category, rate) VALUES(UUID(), @coursewareid, @category, @rate);";
                                comm.Parameters.Add(new MySqlParameter("coursewareid", dataPraise.coursewareid));
                                comm.Parameters.Add(new MySqlParameter("category", dataPraise.coursewareeidt.evaluateData[i].showvalue.Value));
                                comm.Parameters.Add(new MySqlParameter("rate", dataPraise.coursewareeidt.evaluateData[i].datavalue.Value));
                                comm.ExecuteNonQuery();
                                comm.Parameters.Clear();
                            }
                        }
                        if (dataPraise.coursewareeidt.keyData != null)
                        {
                            for (int i = 0; i < dataPraise.coursewareeidt.keyData.Count; i++)
                            {
                                comm.CommandText = "INSERT INTO sy_courseware_rate(id, coursewareid, category, rate, codetype) VALUES(UUID(), @coursewareid, @category, @rate, @codetype);";
                                comm.Parameters.Add(new MySqlParameter("coursewareid", dataPraise.coursewareid));
                                comm.Parameters.Add(new MySqlParameter("category", dataPraise.coursewareeidt.keyData[i].showvalue.Value));
                                comm.Parameters.Add(new MySqlParameter("rate", dataPraise.coursewareeidt.keyData[i].datavalue.Value));
                                comm.Parameters.Add(new MySqlParameter("codetype", 1));
                                comm.ExecuteNonQuery();
                                comm.Parameters.Clear();
                            }

                        }
                    }

                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ErrLog.Log(ex);
            }
            finally
            {
                conn.Close();
            }
            return result;
        }

        /// <summary>
        /// 课程状态提交
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic courseMainStatus(dynamic dataPraise)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlTransaction tran = conn.BeginTransaction();
            try
            {
                using (MySqlCommand comm = conn.CreateCommand())
                {
                    int mainstatus = dataPraise.mainstatus;
                    comm.Transaction = tran;
                    foreach (String coursewareid in dataPraise.coursewareids.ToString().Split(','))
                    {
                        comm.Parameters.Clear();
                        #region "修改上次节点记录"
                        DataTable dt = new DataTable();
                        comm.CommandText = "select * from sy_courseware_flow where coursewareid=?coursewareid order by createtime desc";
                        comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                        MySqlDataAdapter adpt = new MySqlDataAdapter(comm);
                        adpt.Fill(dt);
                        comm.Parameters.Clear();

                        if (dt != null && dt.Rows.Count > 0)
                        {
                            //获取最后一次流程信息
                            DataRow lastDataRow = dt.Rows[0];
                            comm.CommandText = "update sy_courseware_flow set userid=?userid,username=?username,status=1,examinetime=sysdate() where coursewareid=?coursewareid";
                            comm.Parameters.Add(new MySqlParameter("userid", dataPraise.userid.Value));
                            comm.Parameters.Add(new MySqlParameter("username", dataPraise.operationuser.Value));
                            comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                            comm.ExecuteNonQuery();
                            comm.Parameters.Clear();
                        }
                        #endregion

                        #region "插入流程信息"
                        comm.CommandText = "INSERT INTO sy_courseware_flow(id, coursewareid, operationuser, operationtime, nextstep, operationcontent, currentstep,createtime) VALUES (UUID(), ?coursewareid, ?operationuser, sysdate(), ?nextstep, ?operationcontent, ?currentstep,sysdate());";
                        comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                        comm.Parameters.Add(new MySqlParameter("operationuser", dataPraise.operationuser.Value));
                        comm.Parameters.Add(new MySqlParameter("nextstep", dataPraise.nextstep.Value));
                        comm.Parameters.Add(new MySqlParameter("operationcontent", dataPraise.operationcontent.Value));
                        comm.Parameters.Add(new MySqlParameter("currentstep", dataPraise.currentstep.Value));
                        comm.ExecuteNonQuery();
                        comm.Parameters.Clear();
                        #endregion

                        #region "更新课件状态"
                        if (mainstatus == -2)
                        {
                            comm.CommandText = "update sy_courseware set mainstatus=?mainstatus,deletestatus=?laststatus,deleteContent=?deleteContent where id=?coursewareid";
                            comm.Parameters.Add(new MySqlParameter("mainstatus", mainstatus));
                            comm.Parameters.Add(new MySqlParameter("laststatus", dataPraise.laststatus));
                            comm.Parameters.Add(new MySqlParameter("deleteContent", dataPraise.deleteContent.Value));
                            comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                            comm.ExecuteNonQuery();
                        }
                        else
                        {
                            comm.CommandText = "update sy_courseware set mainstatus=?mainstatus where id=?coursewareid";
                            comm.Parameters.Add(new MySqlParameter("mainstatus", mainstatus));
                            comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
                            comm.ExecuteNonQuery();
                        }
                        #endregion

                    }
                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ErrLog.Log(ex);
            }
            finally
            {
                conn.Close();
            }
            return result;
        }


        public void getRealDuration(string duration, string vid)
        {
            //执行更新操作。
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = "update sy_courseware set realduration=?realduration,issync=1 where teachervideo=?teachervideo";
                cmd.Parameters.Clear();
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("realduration", duration));
                cmd.Parameters.Add(new MySqlParameter("teachervideo", vid));
                cmd.ExecuteNonQuery();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="category">pptCourseFile</param>
        /// <param name="coursewareId"></param>
        public string getPPTVideoCourse(string category, string pptcoursefile_servername, int pageIndex)
        {
            JObject jobject = getConfig.getAppConfig();
            string httpRoot = jobject["fileServer"]["rootPath"].ToString() + "/";
            //http://222.204.170.113/FileDownload/
			string filesDic = string.Empty;
			string filepath = string.Empty;
			//http://123.125.127.160:80/FileDownload//file/pptCourseFile/2017/07/file/pptCourseFile/010f4a04-93ee-4e4f-8f31-83fd2448ced1.pdf/2017/07/file/pptCourseFile/010f4a04-93ee-4e4f-8f31-83fd2448ced1.pdf_004.jpg
			if (pptcoursefile_servername.IndexOf('/')< 0)
			{
				filesDic = httpRoot + jobject["fileServer"][category].ToString();
				filepath = filesDic + "/" + pptcoursefile_servername + "/" + pptcoursefile_servername + "_" + pageIndex.ToString().PadLeft(3, '0') + ".jpg";
			}
			else
			{
				filesDic = httpRoot + pptcoursefile_servername;
				string pdffilename = pptcoursefile_servername.Substring(pptcoursefile_servername.LastIndexOf('/'));
				filepath = filesDic.Replace(".pdf", "") + "/" + pdffilename.Replace(".pdf", "") + "_" + pageIndex.ToString().PadLeft(3, '0') + ".jpg";
			}
            return filepath;
        }

    }
}