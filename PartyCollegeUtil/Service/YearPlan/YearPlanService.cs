using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class YearPlanService
    {
        /// <summary>
        /// 判断是否存在年度计划
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic ExistsPlan(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "校验失败";

            string s1 = Newtonsoft.Json.JsonConvert.SerializeObject(queryModel.rankarr);
            string[] ranks = Newtonsoft.Json.JsonConvert.DeserializeObject<string[]>(s1);
            string year = Convert.ToString(queryModel.year);
            string departmentid = Convert.ToString(queryModel.orgcode);

            string sql = string.Empty;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                sql = "select count(1) from sy_yearplan where departmentid=?departmentid and rank=?rank and year=?year";
                cmd.CommandText = sql;
                foreach (string rank in ranks)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("departmentid", departmentid));
                    cmd.Parameters.Add(new MySqlParameter("year", year));
                    cmd.Parameters.Add(new MySqlParameter("rank", rank));
                    int count = Convert.ToInt32(cmd.ExecuteScalar());

                    if (count > 0)
                    {
                        dyn.result = false;
                        dyn.message = "已存在";
                        dyn.rank = rank;

                        return dyn;
                    }
                }

                dyn.result = true;
                dyn.message = "校验成功";
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql.ToString() + ex);
                ExceptionService.WriteException(ex);

                dyn.result = false;
                dyn.message = "校验失败";
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }

        /// <summary>
        /// 新增年度计划
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic AddPlan(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "添加年度计划失败";

            string s1 = Newtonsoft.Json.JsonConvert.SerializeObject(queryModel.rankarr);
            string[] ranks = Newtonsoft.Json.JsonConvert.DeserializeObject<string[]>(s1);
            string year = Convert.ToString(queryModel.year);
            string studytime = Convert.ToString(queryModel.studytime);
            string departmentid = Convert.ToString(queryModel.orgcode);

            string sql = string.Empty;
            MySqlTransaction tran = null;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                MySqlCommand cmd = conn.CreateCommand();

                //找到该机构下面所有的子机构
                sql = string.Format("select id from sy_department where pids like '%{0}%'", departmentid);
                cmd.CommandText = sql;
                DataTable dt = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                DataRow[] dataRows = new DataRow[dt.Rows.Count];
                dt.Rows.CopyTo(dataRows, 0);
                List<string> children_dep = dataRows.Select(n => n["id"].ToString()).ToList();
                if (children_dep.IndexOf(departmentid) == -1)
                    children_dep.Add(departmentid);
                string did = string.Format("'{0}'", string.Join("','", children_dep));//部门组字符串
                string rid = string.Format("'{0}'", string.Join("','", ranks));//职级组字符串

                //删除当前节点下面所有的子节点的年度计划
                sql = string.Format("delete from sy_yearplan where departmentid in({0}) and year={1} and rank in ({2})", did, year, rid);
                cmd.CommandText = sql;
                cmd.Parameters.Clear();
                int exec2 = cmd.ExecuteNonQuery();


                DataTable dt_ranks = GetRanks(cmd);

                foreach (string dep in children_dep)
                {
                    foreach (string rank in ranks)
                    {
                        sql = "insert into sy_yearplan(id,departmentid,rank,rank_cn,year,studytime,createuser,createtime)values(uuid(),?departmentid,?rank,?rank_cn,?year,?studytime,?createuser,now())";
                        cmd.Parameters.Clear();
                        cmd.Parameters.Add(new MySqlParameter("year", year));
                        cmd.Parameters.Add(new MySqlParameter("rank", rank));
                        cmd.Parameters.Add(new MySqlParameter("rank_cn", GetRankCN(dt_ranks, rank)));
                        cmd.Parameters.Add(new MySqlParameter("departmentid", dep));
                        cmd.Parameters.Add(new MySqlParameter("studytime", studytime));
                        cmd.Parameters.Add(new MySqlParameter("createuser", HttpContext.Current.Session["accountid"]));
                        cmd.CommandText = sql;

                        int exec3 = cmd.ExecuteNonQuery();
                    }
                }

                tran.Commit();
                dyn.result = true;
                dyn.message = "添加成功";
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql.ToString() + ex);
                ExceptionService.WriteException(ex);

                dyn.result = false;
                dyn.message = "添加失败";

                if (tran != null)
                {
                    tran.Rollback();
                }
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }

        /// <summary>
        /// 获取职级列表
        /// </summary>
        /// <param name="cmd"></param>
        /// <returns></returns>
        DataTable GetRanks(MySqlCommand cmd)
        {
            cmd.CommandText = "select id,showvalue,datavalue from sy_code where category='职级'";
            DataTable dt = new DataTable();
            MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
            adpt.Fill(dt);

            return dt;
        }

        string GetRankCN(DataTable dataTable, string id)
        {
            return dataTable.Select(string.Format(" id='{0}'", id)).First()["showvalue"].ToString();
        }

        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic GetPlan(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "获取年度计划失败";

            List<MySqlParameter> parameters = new List<MySqlParameter>();

            string year = Convert.ToString(queryModel.year);
            string departmentid = Convert.ToString(queryModel.orgcode);
            string sqlTmp = string.Empty;

            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();

                DataTable dt = null;
                MySqlDataAdapter adpt = null;

                sqlTmp += " and plan.`year`=@year";
                parameters.Add(new MySqlParameter("year", year));

                var session = HttpContext.Current.Session;
                if (string.IsNullOrEmpty(departmentid))
                    departmentid = Convert.ToString(session["mdepartmentid"]);
                //标识不是超级管理员
                if (Convert.ToString(session["usertype"]) != "2")
                {
                    sql = string.Format("select id from sy_department WHERE CONCAT(',',pids,',') like '%,{0},%'", departmentid);
                    cmd.CommandText = sql;
                    dt = new DataTable();
                    adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        string ids = string.Format("'{0}'", string.Join("','", dt.Select().Select(n => Convert.ToString(n["id"])).ToArray()));
                        sqlTmp += string.Format(" and  plan.departmentid in({0})", ids);
                    }
                }

                sql = "select plan.id planid,dep.`name` depname,dep.id depid,plan.`year`,plan.studytime,scode.showvalue rank from sy_yearplan plan inner join sy_department dep on dep.id=plan.departmentid inner join sy_code scode on plan.rank=scode.id and scode.category='职级' where 1=1 " + sqlTmp;
                cmd.CommandText = sql;
                if (parameters.Count > 0)
                    cmd.Parameters.AddRange(parameters.ToArray());

                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                List<dynamic> list = UtilDataTableToList<dynamic>.ToDynamicList(dt);

                var q = list.GroupBy(n => new { n.year, n.depname, n.studytime }).Select(n => new
                {
                    year = n.Key.year,
                    depname = n.Key.depname,
                    studytime = n.Key.studytime,
                    depid = n.First().depid,
                    rank = string.Join(",", n.Select(n1 => n1.rank).ToArray())
                }).ToList();

                dyn.result = true;
                dyn.message = "获取年度计划成功";
                dyn.list = q;


                return dyn;
            }
        }

        /// <summary>
        /// 删除年度计划
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        public dynamic DeletePlan(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "删除年度计划失败";

            string sql = string.Empty;
            MySqlTransaction tran = null;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                MySqlCommand cmd = conn.CreateCommand();
                sql = "delete from sy_yearplan  where departmentid=?departmentid and year=?year and studytime=?studytime";
                cmd.CommandText = sql;

                for (int i = 0; i < queryModel.Count; i++)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("departmentid", Convert.ToString(queryModel[i].departmentid)));
                    cmd.Parameters.Add(new MySqlParameter("year", Convert.ToString(queryModel[i].year)));
                    cmd.Parameters.Add(new MySqlParameter("studytime", Convert.ToString(queryModel[i].studytime)));
                    int exec = cmd.ExecuteNonQuery();
                }
                tran.Commit();
                dyn.result = true;
                dyn.message = "删除年度计划成功";
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql.ToString() + ex);
                ExceptionService.WriteException(ex);
                if (tran != null)
                {
                    tran.Rollback();
                }
                dyn.result = false;
                dyn.message = "删除年度计划失败";
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }


        public dynamic AddTrain(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = (Convert.ToInt32(queryModel.status) == 0 ? "保存" : "提交") + "面授培训失败";


            string trainid = Convert.ToString(queryModel.id);

            var session = HttpContext.Current.Session;
            string studentid = Convert.ToString(session["studentid"]);
            string departmentid = Convert.ToString(session["departmentid"]);

            string sql = string.Empty;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();

                if (!string.IsNullOrEmpty(trainid))
                {
                    sql = "select status from sy_train where id=?id";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("id", trainid));
                    int status = Convert.ToInt32(cmd.ExecuteScalar());
                    //状态,0 未提交 1 已提交 2 审核通过 -1 驳回
                    if (status != 0)
                    {
                        dyn.result = false;
                        dyn.message = (Convert.ToInt32(queryModel.status) == 0 ? "保存" : "提交") + "失败,该面授培训已提交";
                        return dyn;
                    }
                }
                //values(?id,?title,?categoryone,?categorytwo,?categorythree,?categoryfour,?starttime,?endtime,?studytime,?year,?address,?company,?reference,?studentid,?status
                List<MySqlParameter> parameters = new List<MySqlParameter>();
                List<string> columns = new List<string>();
                parameters.Add(new MySqlParameter("title", Convert.ToString(queryModel.title)));
                columns.Add("title=?title");
                parameters.Add(new MySqlParameter("categoryone", Convert.ToString(queryModel.categoryone)));
                columns.Add("categoryone=?categoryone");
                parameters.Add(new MySqlParameter("categorytwo", Convert.ToString(queryModel.categorytwo)));
                columns.Add("categorytwo=?categorytwo");
                parameters.Add(new MySqlParameter("categorythree", Convert.ToString(queryModel.categorythree)));
                columns.Add("categorythree=?categorythree");
                parameters.Add(new MySqlParameter("categoryfour", Convert.ToString(queryModel.categoryfour)));
                columns.Add("categoryfour=?categoryfour");
                parameters.Add(new MySqlParameter("starttime", Convert.ToString(queryModel.starttime)));
                columns.Add("starttime=?starttime");
                parameters.Add(new MySqlParameter("endtime", Convert.ToString(queryModel.endtime)));
                columns.Add("endtime=?endtime");
                parameters.Add(new MySqlParameter("studytime", Convert.ToString(queryModel.studytime)));
                columns.Add("studytime=?studytime");
                parameters.Add(new MySqlParameter("year", Convert.ToString(queryModel.year)));
                columns.Add("year=?year");
                parameters.Add(new MySqlParameter("address", Convert.ToString(queryModel.address)));
                columns.Add("address=?address");
                parameters.Add(new MySqlParameter("company", Convert.ToString(queryModel.company)));
                columns.Add("company=?company");
                parameters.Add(new MySqlParameter("reference", Convert.ToString(queryModel.reference)));
                columns.Add("reference=?reference");
                parameters.Add(new MySqlParameter("status", Convert.ToString(queryModel.status)));
                columns.Add("status=?status");
                parameters.Add(new MySqlParameter("studentid", studentid));
                columns.Add("studentid=?studentid");

                if (Convert.ToInt32(queryModel.status) == 1)
                {
                    columns.Add("submittime=now()");
                }

                if (!string.IsNullOrEmpty(trainid))
                {
                    parameters.Add(new MySqlParameter("id", trainid));
                    string column = string.Join(",", columns);
                    sql = string.Format("update sy_train set {0} where id=?id", column);
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddRange(parameters.ToArray());
                }
                else
                {
                    trainid = Guid.NewGuid().ToString();
                    parameters.Add(new MySqlParameter("id", trainid));
                    sql = string.Format("insert into sy_train(id,title,categoryone,categorytwo,categorythree,categoryfour,starttime,endtime,studytime,year,address,company,reference,studentid,status,createtime)values(?id,?title,?categoryone,?categorytwo,?categorythree,?categoryfour,?starttime,?endtime,?studytime,?year,?address,?company,?reference,?studentid,?status ,now())");
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddRange(parameters.ToArray());
                }

                int exec = cmd.ExecuteNonQuery();

                dyn.result = true;
                dyn.trainid = trainid;
                dyn.message = (Convert.ToInt32(queryModel.status) == 0 ? "保存" : "提交") + "面授培训成功";
            }
            catch (Exception ex)
            {
                ExceptionService.WriteException(ex);
                dyn.result = false;

            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }



        public dynamic GetTrain(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "获取面授培训失败";

            string year = Convert.ToString(queryModel.year);
            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.currentPage);
            int totalIndex = (pageIndex - 1) * pageSize;

            var session = HttpContext.Current.Session;
            string studentid = Convert.ToString(session["studentid"]);


            List<MySqlParameter> parameters = new List<MySqlParameter>();
            parameters.Add(new MySqlParameter("studentid", studentid));
            parameters.Add(new MySqlParameter("year", year));

            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();


                string clmTmp = "  id,title,categoryone,categorytwo,categorythree,categoryfour,studytime,status ";
                string cntTmp = " count(1) ";

                string sql = string.Format("select {0} from sy_train where studentid=?studentid and year=?year", cntTmp);
                cmd.CommandText = sql;
                cmd.Parameters.Clear();
                cmd.Parameters.AddRange(parameters.ToArray());
                dyn.allcount = Convert.ToInt32(cmd.ExecuteScalar());

                sql = string.Format("select {0} from sy_train where studentid=?studentid and year=?year limit {1},{2}", clmTmp, totalIndex, pageSize);
                cmd.CommandText = sql;
                DataTable dt = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dyn.items = dt;

                dyn.result = true;
                dyn.message = "获取面授培训成功";
            }
            catch (Exception ex)
            {
                ExceptionService.WriteException(ex);
                dyn.result = false;
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }
        public dynamic GetReportDetail(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "failed";

            string classid = Convert.ToString(queryModel.classid);
            string type = Convert.ToString(queryModel.type);
            string year = Convert.ToString(queryModel.year);
            string ctype = Convert.ToString(queryModel.ctype);
            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.currentPage);
            int totalIndex = (pageIndex - 1) * pageSize;

            var session = HttpContext.Current.Session;
            string studentid = Convert.ToString(session["studentid"]);


            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {

                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.Parameters.Add(new MySqlParameter("studentid", studentid));
                cmd.Parameters.Add(new MySqlParameter("year", year));
                cmd.Parameters.Add(new MySqlParameter("classid", classid));

                string clmTmp = string.Empty;
                string sqlCount = string.Empty;
                string sqlExec = string.Empty;
                string sqlExecCount = string.Empty;
                string sqlExecList = string.Empty;
                string sqlLimit = string.Format(" limit {0},{1} ", totalIndex, pageSize);
                string sqlOrder = string.Empty;
                string sqlWhere = string.Empty;

                DataTable dt = null;
                MySqlDataAdapter adpt = null;

                //总体情况统计   
                if (type == "0")
                {
                    clmTmp = " year,yearplan_total,yearplan_finished,yearplan_progess,class_coursefinishedcount,train_studytime,choose_finishedstutytime ";
                    sqlExec = "select {0}  from sy_user_totalreport where studentid=?studentid  and year=?year";
                    sqlCount = "1 count,0 score";

                    sqlExecCount = string.Format(sqlExec, sqlCount);
                    sqlExecList = string.Format(sqlExec, clmTmp);

                }
                //在线选学
                else if (type == "1")
                {
                    sqlExecCount = "SELECT count(1) count,ifnull(sum(ware.studytime),0)  score FROM sy_courseware_user cwur  inner join sy_courseware ware on ware.id=cwur.coursewareid LEFT JOIN sy_video_log vlog ON vlog.studentid = cwur.studentid AND vlog.coursewareid = cwur.coursewareid  and vlog.isfinished=1  where cwur.studentid =?studentid and  DATE_FORMAT(cwur.createtime, '%Y') =?year and cwur.status>=0";
                    sqlExecList = "SELECT ware.name coursewarename,DATE_FORMAT(cwur.createtime,'%Y-%m-%d') createtime,DATE_FORMAT(vlog.endtime,'%Y-%m-%d') endtime,ifnull(vlog.isfinished,0)isfinished,ifnull(ware.studytime,0) score FROM sy_courseware_user cwur INNER JOIN sy_courseware ware ON cwur.coursewareid = ware.id LEFT JOIN sy_video_log vlog ON vlog.studentid = cwur.studentid AND vlog.coursewareid = cwur.coursewareid  where cwur.studentid =?studentid and  DATE_FORMAT(cwur.createtime, '%Y') =?year and cwur.status>=0";

                    if (ctype == "1")
                    {
                        sqlExecCount += " and vlog.isfinished=1";
                        sqlExecList += " and vlog.isfinished=1";
                    }

                    sqlExecList += sqlLimit;
                }
                //学习班
                else if (type == "2")
                {
                    sqlExecCount = "select count(1) count,ifnull(sum(cus.studytime),0) score from sy_class_user cus inner join sy_class cls on cus.classid=cls.id  where cus.userid =?studentid and  DATE_FORMAT(cus.createtime, '%Y') =?year and cls.status>=0 ";
                    sqlExecList = "SELECT  cls.id classid,	cls. NAME classname,	cls.categoryone,	cls.categorytwo,	cls.categorythree,	cls.categoryfour,DATE_FORMAT(cls.starttime, '%Y-%m-%d') starttime,	DATE_FORMAT(cls.endtime, '%Y-%m-%d') endtime,	sum(ware.studytime) allstudytime,  cus.studytime FROM	sy_class_user cus INNER JOIN sy_classcourse cc ON cus.classid = cc.classid INNER JOIN sy_class cls ON cls.id = cus.classid INNER JOIN sy_courseware ware ON ware.id = cc.coursewareid WHERE	cus.userid =?studentid AND DATE_FORMAT(cus.createtime, '%Y') =?year and cls.status>=0 group by cus.classid " + sqlLimit;
                }
                //面授培训
                else if (type == "3")
                {
                    clmTmp = "  id,title,categoryone,categorytwo,categorythree,categoryfour,studytime,status,(case when status=0 then '未提交' when status=1 then '已提交' when status=2 then '审核通过' when status=-1 then '驳回' else '未知' end) as statusShow";
                    sqlExec = "select {0} from sy_train where studentid=?studentid and year=?year ";
                    sqlCount = " count(1) count,sum(case when  status=2 then studytime else 0 end ) score ";
                    //sqlWhere = " and status=2";

                    sqlOrder = " order by createtime desc";
                    sqlExecCount = string.Format(sqlExec, sqlCount);
                    sqlExecList = string.Format(sqlExec + sqlOrder, clmTmp);
                }
                //学习班课程列表
                else if (type == "4")
                {
                    clmTmp = "  cc.coursewareid,ware.name coursewarename,ware.studytime score,ifnull(vlog.isfinished,0) isfinished,DATE_FORMAT(vlog.endtime,'%Y-%m-%d') endtime ";
                    sqlExec = "select  {0} from sy_class_user csur inner join sy_classcourse cc on csur.classid=cc.classid inner JOIN sy_courseware ware on ware.id=cc.coursewareid left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=csur.userid where csur.classid=?classid and csur.userid=?studentid";
                    sqlCount = " count(1) count,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 END) score";

                    sqlExecCount = string.Format(sqlExec, sqlCount);
                    sqlExecList = string.Format(sqlExec, clmTmp);
                }
                cmd.CommandText = sqlExecCount;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dyn.rows = new { totalscore = 0, totalItems = 0 };
                if (dt.Rows.Count > 0)
                    dyn.rows = new { totalscore = dt.Rows[0]["score"], totalItems = dt.Rows[0]["count"] };

                cmd.CommandText = sqlExecList;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dyn.items = dt;

                dyn.result = true;
                dyn.message = "success";
                return dyn;
            }
        }



        public dynamic GetReportDetail_ndrc(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "failed";

            string classid = Convert.ToString(queryModel.classid);
            string type = Convert.ToString(queryModel.type);
            string year = Convert.ToString(queryModel.year);
            string ctype = Convert.ToString(queryModel.ctype);
            int pageSize = Convert.ToInt32(queryModel.pageSize);
            int pageIndex = Convert.ToInt32(queryModel.currentPage);
            int totalIndex = (pageIndex - 1) * pageSize;

            var session = HttpContext.Current.Session;
            string studentid = Convert.ToString(session["studentid"]);


            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {

                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.Parameters.Add(new MySqlParameter("studentid", studentid));
                cmd.Parameters.Add(new MySqlParameter("classid", classid));

                string clmTmp = string.Empty;
                string sqlCount = string.Empty;
                string sqlExec = string.Empty;
                string sqlExecCount = string.Empty;
                string sqlExecList = string.Empty;
                string sqlLimit = string.Format(" limit {0},{1} ", totalIndex, pageSize);
                string sqlOrder = string.Empty;
                string sqlWhere = string.Empty;

                DataTable dt = null;
                MySqlDataAdapter adpt = null;

                //总体情况统计   
                if (type == "0")
                {
                    clmTmp = " yearplan_total,yearplan_finished,yearplan_progess,class_coursefinishedcount,train_studytime,choose_finishedstutytime ";
                    sqlExec = "select {0}  from sy_user_totalreport where studentid=?studentid ";
                    sqlCount = "1 count,0 score";

                    sqlExecCount = string.Format(sqlExec, sqlCount);
                    sqlExecList = string.Format(sqlExec, clmTmp);

                }
               
                //必修课
                else if (type == "1")
                {
                    clmTmp = "  cc.coursewareid,ware.name coursewarename,ware.studytime score,ifnull(vlog.isfinished,0) isfinished,DATE_FORMAT(vlog.endtime,'%Y-%m-%d') endtime ";
                    sqlExec = "select  {0} from sy_class_user csur inner join sy_classcourse cc on csur.classid=cc.classid inner JOIN sy_courseware ware on ware.id=cc.coursewareid left join sy_video_log vlog on vlog.coursewareid=cc.coursewareid and vlog.studentid=csur.userid where csur.classid=?classid and csur.userid=?studentid";
                    //sqlCount = " count(1) count,sum(case when ifnull(vlog.isfinished,0)=1 then ware.studytime else 0 END) score";
                    sqlCount = " count(1) count,sum(ware.studytime) score";

                    sqlExecCount = string.Format(sqlExec, sqlCount);
                    sqlExecList = string.Format(sqlExec, clmTmp);
                    if (ctype == "1")
                    {
                        sqlExecCount += " and vlog.isfinished=1";
                        sqlExecList += " and vlog.isfinished=1";
                    }
                }

                //选修课
                else if (type == "2")
                {
                    sqlExecCount = "SELECT count(1) count,ifnull(sum(ware.studytime),0)  score FROM sy_courseware_user cwur  inner join sy_courseware ware on ware.id=cwur.coursewareid LEFT JOIN sy_video_log vlog ON vlog.studentid = cwur.studentid AND vlog.coursewareid = cwur.coursewareid  where cwur.studentid =?studentid and cwur.status>=0";
                    sqlExecList = "SELECT ware.name coursewarename,DATE_FORMAT(cwur.createtime,'%Y-%m-%d') createtime,DATE_FORMAT(vlog.endtime,'%Y-%m-%d') endtime,ifnull(vlog.isfinished,0)isfinished,ifnull(ware.studytime,0) score FROM sy_courseware_user cwur INNER JOIN sy_courseware ware ON cwur.coursewareid = ware.id LEFT JOIN sy_video_log vlog ON vlog.studentid = cwur.studentid AND vlog.coursewareid = cwur.coursewareid  where cwur.studentid =?studentid and cwur.status>=0";

                    if (ctype == "1")
                    {
                        sqlExecCount += " and vlog.isfinished=1";
                        sqlExecList += " and vlog.isfinished=1";
                    }

                    sqlExecList += sqlLimit;
                }
                cmd.CommandText = sqlExecCount;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dyn.rows = new { totalscore = 0, totalItems = 0 };
                if (dt.Rows.Count > 0)
                    dyn.rows = new { totalscore = dt.Rows[0]["score"], totalItems = dt.Rows[0]["count"] };

                cmd.CommandText = sqlExecList;
                dt = new DataTable();
                adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                dyn.items = dt;

                dyn.result = true;
                dyn.message = "success";
                return dyn;
            }
        }

    }
}