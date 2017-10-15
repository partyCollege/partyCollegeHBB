using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class StudentService
    {
        public dynamic DeleteStudent(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "删除学员失败";

            string sql = string.Empty;
            string classid = Convert.ToString(queryModel.classid);
            var userids = queryModel.userid;

            MySqlTransaction tran = null;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                MySqlCommand cmd = conn.CreateCommand();
                sql = "delete from sy_class_user where classid=?classid and userid=?userid";
                cmd.CommandText = sql;

                for (int i = 0; i < userids.Count; i++)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("classid", classid));
                    cmd.Parameters.Add(new MySqlParameter("userid", Convert.ToString(userids[i])));
                    int exec = cmd.ExecuteNonQuery();
                }
                tran.Commit();
                dyn.result = true;
                dyn.message = "删除学员成功";

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);

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


        public dynamic InsertStudent(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "新增学员失败";

            string sql = string.Empty;

            string classid = Convert.ToString(queryModel.classid);
            var userids = queryModel.userid;

			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				//读取班的人数信息
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
                sql = "select studentlimit from sy_class where id=?classid";
				cmd.CommandText = sql;
				cmd.Parameters.Add(new MySqlParameter("classid", classid));
				int studentlimit =Convert.ToInt32("0" + cmd.ExecuteScalar());
				int currentStuNum = userids.Count;
				if (studentlimit > 0)
				{
					cmd.Parameters.Clear();
					sql = "select count(1) from sy_class_user where classid=?classid";
					cmd.CommandText = sql;
					cmd.Parameters.Add(new MySqlParameter("classid", classid));
					int studentNum = Convert.ToInt32("0" + cmd.ExecuteScalar());
					//当前学员数量+已有学员数量>限制数
					if (studentlimit < (currentStuNum + studentNum))
					{
						int result = studentlimit - studentNum;
						dyn.result = false;
						dyn.message = string.Format("超过人数限制，限制人数为：{0}，当前班级剩余人数：{1}", studentlimit.ToString(), (result <= 0 ? 0 : result).ToString());
						return dyn;
					}
				}

				MySqlTransaction tran = null;
				try
				{
					tran = conn.BeginTransaction();
					for (int i = 0; i < currentStuNum; i++)
					{
						cmd.Parameters.Clear();
						sql = "select count(1) from sy_class_user where classid=?classid and userid=?userid ";
						cmd.CommandText = sql;
						cmd.Parameters.Add(new MySqlParameter("classid", classid));
						cmd.Parameters.Add(new MySqlParameter("userid", Convert.ToString(userids[i])));
						int count = Convert.ToInt32(cmd.ExecuteScalar());
						if (count == 0)
						{
							sql = "insert into sy_class_user(id,classid,userid,createtime) values(uuid(),?classid,?userid,now())";
							cmd.CommandText = sql;
							int exec = cmd.ExecuteNonQuery();
						}
					}
					tran.Commit();
					dyn.result = true;
					dyn.message = "新增学员成功";
				}
				catch (Exception ex)
				{
					ErrLog.Log(sql + ex);

					if (tran != null)
					{
						tran.Rollback();
					}
				}

				/// 重新统计学员人数
				UpdateClassStudentNum(cmd, classid);
			}
            return dyn;

        }

		/// <summary>
		/// 重新统计学员人数
		/// </summary>
		/// <param name="mycmd"></param>
		/// <param name="classid"></param>
		public void UpdateClassStudentNum(MySqlCommand mycmd, string classid) {
			string sql = string.Empty;
			sql = @"select count(1) stunum from sy_class_user scu 
					inner join sy_user su on scu.userid=su.id 
					INNER JOIN sy_account acc on su.accountid=acc.id and acc.`status`>=0 
					where scu.classid=?classid";
			mycmd.CommandText = sql;
			mycmd.Parameters.Clear();
			mycmd.Parameters.Add(new MySqlParameter("classid", classid));
			int stunum=Convert.ToInt32("0"+ mycmd.ExecuteScalar());
			sql = "update sy_class set studentnum=?studentnum where id=?classid";
			mycmd.CommandText = sql;
			mycmd.Parameters.Clear();
			mycmd.Parameters.Add(new MySqlParameter("studentnum", stunum));
			mycmd.Parameters.Add(new MySqlParameter("classid", classid));
			mycmd.ExecuteNonQuery();
		}

		public dynamic BatchInsertStudent(dynamic queryModel)
		{
			dynamic dyn = new System.Dynamic.ExpandoObject();
			dyn.result = false;
			dyn.message = "新增学员失败";

			string sql = string.Empty;

			string classid = Convert.ToString(queryModel.classid);
			string departmentid = string.Empty;// Convert.ToString(queryModel.departmentid);
			//List<dynamic> departmentArray = (List<dynamic>)queryModel.departmentid;
			JArray departArray = queryModel.departmentid;
			List<string> idlist = new List<string>();
			foreach (dynamic c in departArray)
			{
				idlist.Add("'"+Convert.ToString(c.id)+"'");
			}
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();

				sql = "select studentlimit from sy_class where id=?classid";
				cmd.CommandText = sql;
				cmd.Parameters.Add(new MySqlParameter("classid", classid));
				int studentlimit = Convert.ToInt32("0" + cmd.ExecuteScalar());
				int currentStuNum =0;
				if (studentlimit > 0)
				{
					//得到本次要加载的人数
					cmd.Parameters.Clear();
					sql =string.Format( @"select count(1) from sy_user usr where usr.departmentid in({0})
							and not exists(select * from sy_class_user clur where usr.id=clur.userid and clur.classid=?classid )", string.Join(",", idlist));
					cmd.CommandText = sql;
					//cmd.Parameters.Add(new MySqlParameter("departmentid", departmentid));
					cmd.Parameters.Add(new MySqlParameter("classid", classid));
					currentStuNum = Convert.ToInt32("0" + cmd.ExecuteScalar());

					//and id not in (select usr.id from  sy_user usr inner join sy_class_user clur on clur.userid=usr.id where clur.classid=?classid and usr.departmentid=?departmentid)
					cmd.Parameters.Clear();
					sql = "select count(1) from sy_class_user where classid=?classid";
					cmd.CommandText = sql;
					cmd.Parameters.Add(new MySqlParameter("classid", classid));
					int studentNum = Convert.ToInt32("0" + cmd.ExecuteScalar());
					//当前学员数量+已有学员数量>限制数
					if (studentlimit < (currentStuNum + studentNum))
					{
						int result=studentlimit - studentNum;
						dyn.result = false;
						dyn.message = string.Format("超过人数限制，限制人数为：{0}，当前班级剩余人数：{1}", studentlimit.ToString(), (result <= 0 ? 0 : result).ToString());
						return dyn;
					}
				}

				MySqlTransaction tran = null;
				try
				{
					tran = conn.BeginTransaction();
					cmd.Parameters.Clear();
					cmd.Parameters.Add(new MySqlParameter("classid", classid));
					//cmd.Parameters.Add(new MySqlParameter("departmentid", departmentid));
					sql =string.Format(@"insert into sy_class_user(id,classid,userid,createtime) 
								select uuid(),?classid,usr.id,now() from sy_user usr where usr.departmentid in({0}) 
								and not exists(select * from sy_class_user clur where usr.id=clur.userid and clur.classid=?classid )", string.Join(",", idlist));
					cmd.CommandText = sql;
					int exec = cmd.ExecuteNonQuery();

					tran.Commit();
					dyn.result = true;
					dyn.message = "新增学员成功";
				}
				catch (Exception ex)
				{
					ErrLog.Log(sql + ex);

					if (tran != null)
					{
						tran.Rollback();
					}
				}
				/// 重新统计学员人数
				UpdateClassStudentNum(cmd, classid);
			}
			return dyn;

		}

        public dynamic GetStudent(dynamic queryModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "获取学员失败";

            string sql = string.Empty;

            string departmentid = Convert.ToString(queryModel.departmentid);
			string pids = Convert.ToString(queryModel.pids);
            string classid = Convert.ToString(queryModel.classid);
            string name = Convert.ToString(queryModel.name);
			string rank = Convert.ToString(queryModel.rank);
            string tmp = string.Empty;

            List<MySqlParameter> list = new List<MySqlParameter>();
            //list.Add(new MySqlParameter("departmentid", departmentid));
			list.Add(new MySqlParameter("pids", pids));
            list.Add(new MySqlParameter("classid", classid));
            if (!string.IsNullOrEmpty(name))
            {
                tmp = " and usr.name like @name";
                list.Add(new MySqlParameter("name", "" + name + "%"));
            }
			if (!string.IsNullOrEmpty(rank)&&rank!="全部")
			{
				tmp = " and usr.rank like @rank";
				list.Add(new MySqlParameter("rank", "%" + rank + "%"));
			}

            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                //sql = "select usr.id userid,acc.logname,acc.cellphone,usr.name,usr.rank,usr.departmentid,dep.name departmentname,case when acc.status='0' then '启用' else '禁用' end status,case when acc.signstatus='1' then '已注册' else '未注册' end signstatus from sy_user usr inner join sy_account acc on acc.id=usr.accountid inner join sy_department dep on dep.id=usr.departmentid where usr.departmentid=?departmentid and  not EXISTS(select 1 from sy_class_user cur where cur.classid=?classid and cur.userid=usr.id ) " + tmp;
				sql = @"select usr.id userid,acc.logname,acc.cellphone,usr.name,usr.rank,usr.departmentid,usr.departmentname
						,case when acc.status='0' then '启用' else '禁用' end status,case when acc.signstatus='1' then '已注册' else '未注册' end signstatus 
						from sy_user usr inner join sy_account acc on acc.id=usr.accountid 
						where usr.pids like concat(?pids,'%')
						and  not EXISTS(select 1 from sy_class_user cur where cur.classid=?classid and cur.userid=usr.id ) " + tmp;
				//inner join sy_department dep on dep.id=usr.departmentid 
				//where usr.departmentid in (select id from sy_department where `status`>=0 and concat(',',pids,',') like concat('%,',?departmentid,',%')) 
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(list.ToArray());

                DataTable dt = new DataTable();
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);

                dyn.result = true;
                dyn.message = "获取学员成功";
                dyn.list = dt;

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }

    }
}