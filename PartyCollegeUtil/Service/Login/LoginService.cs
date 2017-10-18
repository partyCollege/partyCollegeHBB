using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class LoginService
    {
        /// <summary>
        /// 获取客户端的信息
        /// </summary>
        /// <returns></returns>
        public String GetClientIp()
        {
            String clientIP = "";
            if (System.Web.HttpContext.Current != null)
            {
                clientIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(clientIP) || (clientIP.ToLower() == "unknown"))
                {
                    clientIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_REAL_IP"];
                    if (string.IsNullOrEmpty(clientIP))
                    {
                        clientIP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                    }
                }
                else
                {
                    clientIP = clientIP.Split(',')[0];
                }
            }
            return clientIP;
        }

        /// <summary>
        /// 所有有关平台的sessiona初始化
        /// </summary>
        /// <param name="accountid"></param>
        /// <param name="row"></param>
        public void InitSessionPlatformInfo(string accountid, DataRow row)
        {
            PermissionService pservice = new PermissionService();
            //获取权限
            Dictionary<string, ViewPermission> permissionList = pservice.getAllPermission(accountid);
            SessionObj.SetSessionObj("permissionDic", permissionList);
            //用户角色
            SessionObj.SetSessionObj("roleList", pservice.getRoleNameList(accountid));
            //获取用户的切换中心的按钮
            SessionObj.SetSessionObj("btnList", pservice.getBtnList(accountid));
        }


        public dynamic ForgotPwd(dynamic objModel)
        {
            AccountService accService = new AccountService();
            dynamic returnInfo = new ExpandoObject();
            string logname = objModel.formlogname;
            string cellphone = objModel.cellphone;
            string newpwd = objModel.newpwd;
            string sql = string.Empty;
            //sql = @"select * from sy_account where logname=?logname";
            sql = @"select acc.id,acc.cellphone from sy_account acc where (acc.logname=?logname or acc.cellphone=?logname or acc.idcard=?logname)";
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            conn.Open();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = sql;
            cmd.Parameters.Add(new MySqlParameter("logname", logname));
            string readPhone = string.Empty;
            string readId = string.Empty;
            bool existsAcc = false;
            try
            {
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        readPhone = reader["cellphone"].ToString();
                        readId = reader["id"].ToString();
                        existsAcc = true;
                    }
                }
                if (existsAcc)
                {
                    if (readPhone == cellphone)
                    {
                        cmd.Parameters.Clear();
                        sql = "update sy_account set pwd=?pwd where id=?id";
                        cmd.CommandText = sql;
                        cmd.Parameters.Add(new MySqlParameter("pwd", accService.getDoubleMd5String(newpwd)));
                        cmd.Parameters.Add(new MySqlParameter("id", readId));
                        cmd.ExecuteNonQuery();
                        returnInfo.code = "success";
                        returnInfo.message = "操作成功";
                    }
                    else
                    {
                        returnInfo.code = "failed";
                        returnInfo.message = "与注册手机号不匹配";
                    }

                }
                else
                {
                    returnInfo.code = "failed";
                    returnInfo.message = "登录名不存在";
                }
            }
            catch (Exception ex)
            {
            }
            finally
            {
                conn.Close();
            }
            return returnInfo;
        }

		public dynamic CheckExistsCellphone(string cellphone,string accountid)
		{
			string sql = "select count(1) from sy_account where cellphone=?cellphone";
			dynamic dynObj = new ExpandoObject();
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();
				cmd.Parameters.Clear();
				if (!string.IsNullOrEmpty(accountid))
				{
					sql = sql + "  and id<>?id ";
					cmd.Parameters.Add(new MySqlParameter("id", accountid));
				}
				cmd.CommandText = sql;
				cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
				int count = Convert.ToInt32(cmd.ExecuteScalar());
				if (count > 0)
				{
					dynObj.message = "手机号码已存在";
					dynObj.result = true;
					return dynObj;
				}
				else
				{
					dynObj.message = "手机号不存在";
					dynObj.result = false;
				}
				
			}
			return dynObj;
		}

        public dynamic ExistsCellphone(dynamic objModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.result = false;
            dynObj.message = "验证失败";

            var session = HttpContext.Current.Session;
            string cellphone = objModel.cellphone.ToString();
            string verifycode = Convert.ToString(session["findpwdverify"]);
            //来自app端不需要验证码
            bool fromApp = Convert.ToBoolean(objModel.fromApp);
            if (!fromApp)
            {
                if (!verifycode.Equals(Convert.ToString(objModel.yzmcode)))
                {
                    dynObj.validateIndex = 0;
                    dynObj.message = "安全码错误";
                    dynObj.result = false;
					HttpContext.Current.Session.Remove("findpwdverify");
                    return dynObj;
                }
            }

            //手机验证码验证
            verifycode = Convert.ToString(session["validatesmscode_telphone"]);
            if (!verifycode.Equals(Convert.ToString(objModel.cellphone)))
            {
                dynObj.validateIndex = 1;
                dynObj.message = "手机号码与验证码不符";
                dynObj.result = false;
				//HttpContext.Current.Session.Remove("validatesmscode_telphone");
                return dynObj;
            }

            string smscode = Convert.ToString(session["validatesmscode"]);
            if (!smscode.Equals(Convert.ToString(objModel.smsyzmcode)))
            {
                dynObj.validateIndex = 2;
                dynObj.message = "验证码错误";
                dynObj.result = false;
				//HttpContext.Current.Session.Remove("validatesmscode");
                return dynObj;
            }
            try
            {
				//清空session里的code
				HttpContext.Current.Session.Remove("findpwdverify");
				//HttpContext.Current.Session.Remove("validatesmscode_telphone");
				//HttpContext.Current.Session.Remove("validatesmscode");

                using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
                {
                    conn.Open();
                    MySqlCommand cmd = conn.CreateCommand();
                    DataTable dataTable = GetUserInfo(cellphone, cmd);
                    if (dataTable.Rows.Count > 0)
                    {
                        dynObj.message = "验证成功";
                        dynObj.result = true;
                        return dynObj;
                    }
                    else
                    {
                        dynObj.validateIndex = 1;
                        dynObj.message = "用户不存在";
                        dynObj.result = false;
                        return dynObj;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrLog.Log(ex);
                dynObj.validateIndex = 1;
                dynObj.result = false;
                dynObj.message = "验证失败";
            }
            return dynObj;
        }

        public dynamic ResetUserPwd(dynamic objModel)
        {
            dynamic returnInfo = new ExpandoObject();
            AccountService accService = new AccountService();
            AccountInfo accinfo = new AccountInfo();
            JArray array = objModel;
            dynamic dm;
            string newpwd = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                try
                {
                    conn.Open();

                    foreach (var item in array)
                    {
                        dm = item;
                        newpwd = Encrypt.SecurityPassword(Convert.ToString(dm.newpwd), Convert.ToString(dm.id)); ;
                        accinfo = accinfo.get(conn, new SQLQuery[] { new SQLQuery("id", Opertion.equal, dm.id) });
                        accinfo.Pwd = newpwd;
                        accinfo.update(conn);
                    }
                    returnInfo.msg = "success";
                }
                catch (Exception ex)
                {
                    returnInfo.msg = "failed";
                }
            }
            return returnInfo;
        }

        public dynamic VerifySmsCode(dynamic loginModel)
        {
            dynamic returnInfo = new ExpandoObject();
            string code = "";
            string keyname = string.Empty;
            keyname = loginModel.keyname;
            //HttpContext.Current.Session["VerifyCode"] = code;
            if (HttpContext.Current.Session[keyname] != null)
            {
                code = HttpContext.Current.Session[keyname].ToString();
            }
            string clientcode = loginModel.smscode;
            if (clientcode == code)
            {
                
                returnInfo.code = "success";
                returnInfo.message = "验证通过";
            }
            else
            {
                returnInfo.code = "failed";
                returnInfo.message = "验证码错误";
            }
			HttpContext.Current.Session.Remove(keyname);
            return returnInfo;
        }

        public dynamic ResetPassword(dynamic objModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.result = false;
            dynObj.message = "找回失败";

            var session = HttpContext.Current.Session;
            string cellphone = objModel.cellphone.ToString();
            string password1 = objModel.password1.ToString();
            string password2 = objModel.password2.ToString();

            if (!password1.Equals(password2))
            {
                dynObj.validateIndex = 5;
                dynObj.message = "两次输入密码不一致";
                dynObj.result = false;
                return dynObj;
            }

            string sql = string.Empty;
            DataTable dt = new DataTable();

            try
            {
                using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
                {
                    conn.Open();
                    MySqlCommand cmd = conn.CreateCommand();
                    dt = GetUserInfo(cellphone, cmd);

                    if (dt.Rows.Count == 0)
                    {
                        dynObj.validateIndex = 4;
                        dynObj.message = "密码找回失败，用户不存在!";
                        return dynObj;
                    }

                    string accountid = Convert.ToString(dt.Rows[0]["id"]);
                    string newpassword = Encrypt.SecurityPassword(password1, accountid);

                    sql = "update sy_account set pwd=?password where id=?accountid";
                    cmd.Parameters.Clear();
                    cmd.CommandText = sql;
                    cmd.Parameters.Add(new MySqlParameter("accountid", accountid));
                    cmd.Parameters.Add(new MySqlParameter("password", newpassword));
                    int count = cmd.ExecuteNonQuery();

                    if (count > 0)
                    {
                        dynObj.result = true;
                        dynObj.message = "找回密码成功";
                    }
                }

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
                dynObj.validateIndex = 4;
                dynObj.message = "密码找回异常";
            }

            return dynObj;
        }

        public DataTable GetUserInfo(string logname, MySqlCommand cmd)
        {

            cmd.Parameters.Clear();
            cmd.CommandText = "select * from sy_account where cellphone=?logname or logname=?logname;";
            cmd.Parameters.Add(new MySqlParameter("logname", logname));

            DataTable dt = new DataTable();
            MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
            adpt.Fill(dt);

            return dt;
        }


        /// <summary>
        /// 登录后修改密码；
        /// </summary>
        /// <param name="objModel"></param>
        /// <returns></returns>
        public dynamic ChangePassword(dynamic objModel)
        {
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.result = false;
            dyn.message = "修改密码失败";

            var session = HttpContext.Current.Session;

            //AccountService accService = new AccountService();
            //string sourcepassword = accService.getDoubleMd5String(objModel.sourcepassword.ToString()); 
            string accountid = Convert.ToString(session["accountId"]);
            string sourcepassword = Encrypt.SecurityPassword(Convert.ToString(objModel.sourcepassword), accountid);


            string confirmpassword = objModel.confirmpassword.ToString();
            string newpassword = objModel.password.ToString();

            if (string.IsNullOrEmpty(newpassword) || !newpassword.Equals(confirmpassword))
            {
                dyn.result = false;
                dyn.message = "两次输入的密码不一致";
                return dyn;
            }
            //newpassword = accService.getDoubleMd5String(objModel.password.ToString());
            newpassword = Encrypt.SecurityPassword(Convert.ToString(objModel.password), accountid);

            List<MySqlParameter> paramCollection = new List<MySqlParameter>();

            string sql = string.Empty;

            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                sql = "select id,pwd from sy_account where id=?accountid";
                paramCollection.Add(new MySqlParameter("accountid", accountid));

                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());

                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    string dbpwd = Convert.ToString(dt.Rows[0]["pwd"]);

                    if (!dbpwd.Equals(sourcepassword))
                    {

                        dyn.result = false;
                        dyn.message = "原始密码不正确";
                        return dyn;
                    }

                    if (dbpwd.Equals(newpassword))
                    {
                        dyn.result = false;
                        dyn.message = "新密码不能和原始密码一致";
                        return dyn;
                    }

                    sql = "update sy_account set pwd=?password where id=?accountid";
                    cmd.Parameters.Clear();
                    paramCollection.Clear();
                    paramCollection.Add(new MySqlParameter("accountid", accountid));
                    paramCollection.Add(new MySqlParameter("password", newpassword));

                    cmd.CommandText = sql;
                    cmd.Parameters.AddRange(paramCollection.ToArray());
                    int count = cmd.ExecuteNonQuery();


                    if (count > 0)
                    {
                        dyn.result = true;
                        dyn.message = "修改密码成功";
                    }
                }
                else
                {
                    dyn.result = false;
                    dyn.message = "修改密码失败，用户不存在";
                }
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
                dyn.message = ex.Message;
            }
            finally
            {
                conn.Close();
            }

            return dyn;

        }


        /// <summary>
        /// 处理登录逻辑
        /// </summary>
        /// <param name="accinfo"></param>
        /// <returns></returns>
        public dynamic Register(AccountInfo accinfo)
        {
            dynamic returnInfo = new ExpandoObject();
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();

                //检查账号是否存在
                AccountInfo accTemp = accinfo.get(conn, new SQLQuery("logname", Opertion.equal, accinfo.Logname));
                if (!string.IsNullOrEmpty(accTemp.Id))
                {
                    returnInfo.code = "exists";
                    returnInfo.message = "该帐号已经存在";
                    return returnInfo;
                }

                accTemp = accinfo.get(conn, new SQLQuery("idcard", Opertion.equal, accinfo.IdCard));
                if (!string.IsNullOrEmpty(accTemp.Id))
                {
                    returnInfo.code = "exists";
                    returnInfo.message = "该身份证已经注册";
                    return returnInfo;
                }
                accTemp = accinfo.get(conn, new SQLQuery("cellphone", Opertion.equal, accinfo.Cellphone));
                if (!string.IsNullOrEmpty(accTemp.Id))
                {
                    returnInfo.code = "exists";
                    returnInfo.message = "该手机号码已经注册";
                    return returnInfo;
                }
                //创建账号
                //1)按身份证检查是否已经有学员记录,可能当时注册时同时参加多个班，返回的多条记录,都同时关联到同一个账号ID
                //
                SyStudent paramstu = new SyStudent();
                paramstu.IdCard = accinfo.IdCard;
                DataTable stuList = paramstu.getListByIdCard(accinfo.IdCard);
                if (stuList.Rows.Count == 0)
                {
                    returnInfo.code = "notexists";
                    returnInfo.message = "该用户资料不存在";
                    return returnInfo;
                }

                //MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
                MySqlTransaction tran = null;
                AccountService accService = new AccountService();
                try
                {
                    //conn.Open();
                    tran = conn.BeginTransaction();
                    accinfo.Id = Guid.NewGuid().ToString();
                    accinfo.CreateTime = DateTime.Now;
                    accinfo.LastUpdateTime = DateTime.Now;
                    //密码双重加密
                    accinfo.Pwd = accService.getDoubleMd5String(accinfo.Pwd);
                    //插入账号记录
                    accinfo.insert(conn, tran);
                    //更新到 sy_student
                    SyStudent updatestu = null;
                    string platformId = string.Empty;
                    string classid = string.Empty;
                    foreach (DataRow student in stuList.Rows)
                    {
                        updatestu = new SyStudent();
                        updatestu.Id = student["id"].ToString();
                        updatestu.AccountId = accinfo.Id;
                        platformId = student["platformid"].ToString();
                        classid = student["classid"].ToString();
                        updatestu.myUpdate(conn, tran);//, new List<SQLQuery>() { new SQLQuery("AccountId", Opertion.equal, accinfo.Id) }
                    }
                    //获取默认普通学员权限,插入权限记录;

                    //string defaultRole = "普通学员";
                    //RoleInfo roleParam = new RoleInfo();
                    //List<SQLQuery> sqlparam = new List<SQLQuery>();
                    //sqlparam.Add(new SQLQuery("name", Opertion.equal, defaultRole));
                    //sqlparam.Add(new SQLQuery("syslevel", Opertion.equal, 1));
                    //RoleInfo roleObj = roleParam.getOne<RoleInfo>(conn, sqlparam, false);

                    //if (string.IsNullOrEmpty(roleObj.Id))
                    //{
                    //	tran.Rollback();
                    //	returnInfo.code = "failed";
                    //	returnInfo.message = "注册失败";
                    //	return returnInfo;
                    //}

                    //AccountRole accRole = new AccountRole();
                    //accRole.AccountId = accinfo.Id;
                    //accRole.Id = Guid.NewGuid().ToString();
                    //accRole.RoleId = roleObj.Id;
                    //accRole.PlatformId = platformId;
                    //accRole.insert(conn, tran);

                    tran.Commit();
                    returnInfo.code = "success";
                    returnInfo.message = "注册成功";
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                }
                finally
                {
                    conn.Close();
                }
            }
            return returnInfo;
        }

        /// <summary>
        /// 保存在线用户记录
        /// </summary>
        /// <param name="accTemp"></param>
        private bool SaveOnlineUser(AccountInfo accTemp, dynamic clientinfo)
        {
            bool NewDayOnline = false;
            //HttpBrowserCapabilities hbc = HttpContext.Current.Request.Browser;
            OnlineUser olu = new OnlineUser();
            olu.AccountId = accTemp.Id;
            olu.ClientType = clientinfo.sys;
            olu.BrowerCore = clientinfo.browser;
            olu.BrowerVersion = clientinfo.version;
            olu.UserAgent = clientinfo.useragent;
            olu.ExpireTime = 1200;
            olu.LoginTime = DateTime.Now;
            olu.SessionId = HttpContext.Current.Session.SessionID;
            olu.ClientIp = GetClientIp();
            olu.Isonline = 1;
            ///检查是否有登录历史
            OnlineUser chkolu = olu.get();
            if (string.IsNullOrEmpty(chkolu.AccountId))
            {
                //无登录历史，直接插入客户端信息，登录流程结束
                olu.Save();
                NewDayOnline = true;
            }
            else
            {
                if (chkolu.LoginTime.ToString("yyyy-MM-dd") != DateTime.Now.ToString("yyyy-MM-dd"))
                {
                    NewDayOnline = true;
                }
                chkolu.Isonline = 1;
                chkolu.ClientType = clientinfo.sys;
                chkolu.BrowerCore = clientinfo.browser;
                chkolu.BrowerVersion = clientinfo.version;
                chkolu.UserAgent = clientinfo.useragent;
                chkolu.ClientIp = GetClientIp();
                chkolu.LoginTime = DateTime.Now;
                chkolu.SessionId = HttpContext.Current.Session.SessionID;
                chkolu.Update();
            }
            return NewDayOnline;
        }


        public dynamic Logout(dynamic loginMode)
        {
            dynamic returnInfo = new ExpandoObject();

            //bool result = false;
            SessionObj sesObj = new SessionObj();
            OnlineUser olu = new OnlineUser();
            if (sesObj.accountId != null)
            {
                using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
                {
                    conn.Open();
                    olu.AccountId = sesObj.accountId.ToString();
                    olu = olu.get();
                    olu.Isonline = 0;
                    olu.update(conn, new List<SQLQuery>() { new SQLQuery("accountid", Opertion.equal, sesObj.accountId) });
                    CommonSQL.doLog4net("正常退出", "10002");
                    //result = true;
                }
            }
            HttpContext.Current.Session.Abandon();
            returnInfo.code = "success";
            returnInfo.message = "退出成功";
            return returnInfo;
        }

        /// <summary>
        /// 用户验证信息激活
        /// </summary>
        /// <param name="objModel"></param>
        /// <returns></returns>
        public dynamic Validate(dynamic objModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.validateIndex = 0;
            dynObj.message = "";
            dynObj.result = false;


            string sql = string.Empty;
            string studentid = string.Empty;
            string accountid = string.Empty;
            string departmentid = string.Empty;
            string cellphone = string.Empty;
            string signstatus = string.Empty;
            string logname = string.Empty;


            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();

                //验证信息
                if (Convert.ToString(objModel.type) == "0")
                {
                    sql = "select acc.id accountid,acc.cellphone,acc.logname,acc.signstatus,usr.rank,usr.id studentid,usr.departmentid from sy_account acc inner join sy_user usr on acc.id=usr.accountid where name=?name";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("name", Convert.ToString(objModel.name)));
                    dt = new DataTable();
                    MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);
                    if (dt.Rows.Count <= 0)
                    {
                        dynObj.validateIndex = 0;
                        dynObj.message = "输入姓名与系统登记不一致.";
                        dynObj.result = false;
                        return dynObj;
                    }

                    DataRow[] dataRows = dt.Select(string.Format(" departmentid='{0}'", Convert.ToString(objModel.departmentid)));
                    DataRow dataRow = dataRows.FirstOrDefault();
                    if (dataRow == null)
                    {
                        dynObj.validateIndex = 1;
                        dynObj.message = "输入姓名与系统登记不一致.";
                        dynObj.result = false;
                        return dynObj;
                    }

					dataRows = dt.Select(string.Format(" cellphone='{0}'", Convert.ToString(objModel.cellphone)));
					dataRow = dataRows.FirstOrDefault();
					if (dataRow == null)
					{
						dynObj.validateIndex = 11;
						dynObj.message = "输入手机号与系统登记不一致.";
						dynObj.result = false;
						return dynObj;
					}

                    studentid = Convert.ToString(dataRow["studentid"]);
                    accountid = Convert.ToString(dataRow["accountid"]);
                    cellphone = Convert.ToString(dataRow["cellphone"]);
                    signstatus = Convert.ToString(dataRow["signstatus"]);
                    logname = Convert.ToString(dataRow["logname"]);
                    departmentid = Convert.ToString(objModel.departmentid);



                    //查找该用户所有部门（包含兼职部门）
                    //sql = "select usr.id,usr.`name`,case when usr.departmentid=dep.id then 1 else 0 end ismaindepartment ,dep.id departmentid,dep.name departmentname from sy_user_department udep inner join sy_department dep on dep.id=udep.departmentid inner join sy_user usr on udep.userid=usr.id where 1=1 and usr.id=?studentid";
                    //cmd.CommandText = sql;
                    //cmd.Parameters.Clear();
                    //cmd.Parameters.Add(new MySqlParameter("studentid", studentid));
                    //dt = new DataTable();
                    //adpt = new MySqlDataAdapter(cmd);
                    //adpt.Fill(dt);

                    //if (dt.Select(string.Format(" departmentid='{0}'", Convert.ToString(objModel.departmentid))).Length == 0)
                    //{
                    //    dynObj.validateIndex = 1;
                    //    dynObj.message = "用户与所在机构不符";
                    //    dynObj.result = false;
                    //    return dynObj;
                    //}
                    //DataRow[] dataRows = dt.Select();
                    //string departmentids = string.Format("'{0}'", string.Join("','", dataRows.Select(dr => Convert.ToString(dr["departmentid"])).ToArray()));




                    ////查找该用户所有部门下所有的用户
                    //sql = "select DISTINCT usr.id,usr.name,usr.departmentid from sy_user_department udep inner join sy_user usr on udep.userid=usr.id where udep.departmentid in (" + departmentids + ") ";
                    //需要本部门的人才可以2016.12.27
                    sql = string.Format("select name from sy_user where departmentid='{2}'  and name in('{0}','{1}')", Convert.ToString(objModel.colleague1), Convert.ToString(objModel.colleague2), departmentid);
                    ////客户已确认，只要是环保系统的人都可以2016.12.07
                    //sql = string.Format("select name from sy_user where name in('{0}','{1}')", Convert.ToString(objModel.colleague1), Convert.ToString(objModel.colleague2));
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    dt = new DataTable();
                    adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);
                    if (dt.Select(string.Format(" name='{0}'", Convert.ToString(objModel.colleague1))).Length == 0)
                    {
                        dynObj.validateIndex = 2;
                        dynObj.message = "输入同事姓名与系统登记不一致";
                        dynObj.result = false;
                        return dynObj;
                    }

                    if (dt.Select(string.Format(" name='{0}'", Convert.ToString(objModel.colleague2))).Length == 0)
                    {
                        dynObj.validateIndex = 3;
                        dynObj.message = "输入同事姓名与系统登记不一致";
                        dynObj.result = false;
                        return dynObj;
                    }

                    if (Convert.ToInt32(signstatus) == 1)
                    {
                        dynObj.validateIndex = 0;
                        dynObj.message = "该学员已激活";
                        dynObj.result = false;
                        return dynObj;
                    }

                    dynObj.model = new
                    {
                        cellphone = cellphone,
                        logname = logname,
						accountid = accountid
                    };
                    dynObj.result = true;
                }
                else if (Convert.ToString(objModel.type) == "1")
                {
                    string verifycode = Convert.ToString(HttpContext.Current.Session["regverify"]);
                    if (!verifycode.Equals(Convert.ToString(objModel.verifycode)))
                    {
                        dynObj.validateIndex = 5;
                        dynObj.message = "安全码错误，请重新输入";
                        dynObj.result = false;
						HttpContext.Current.Session.Remove("regverify");
                        return dynObj;
                    }

					HttpContext.Current.Session.Remove("regverify");

                    //手机验证码验证
                    verifycode = Convert.ToString(HttpContext.Current.Session["validatesmscode_telphone"]);
                    if (!verifycode.Equals(Convert.ToString(objModel.cellphone)))
                    {
                        dynObj.validateIndex = 7;
                        dynObj.message = "手机号码与验证码不符";
                        dynObj.result = false;
						//HttpContext.Current.Session.Remove("validatesmscode_telphone");
                        return dynObj;
                    }

                    string smscode = Convert.ToString(HttpContext.Current.Session["validatesmscode"]);
                    if (!smscode.Equals(Convert.ToString(objModel.smscode)))
                    {
                        dynObj.validateIndex = 6;
                        dynObj.message = "验证码错误，请重新输入";
                        dynObj.result = false;
						//HttpContext.Current.Session.Remove("validatesmscode");
                        return dynObj;
                    }

                    sql = "select * from sy_user where name=?name and departmentid=?departmentid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("name", Convert.ToString(objModel.name)));
                    cmd.Parameters.Add(new MySqlParameter("departmentid", Convert.ToString(objModel.departmentid)));
                    //cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(objModel.rank)));
                    dt = new DataTable();
                    MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);
                    //if (dt.Rows.Count <= 0)
                    //{
                    //	dynObj.validateIndex = 4;
                    //	dynObj.message = "所选的职务级别与本人不符";
                    //	dynObj.result = false;
                    //	return dynObj;
                    //}
                    DataRow dataRow = dt.Rows[0];
                    studentid = Convert.ToString(dataRow["id"]);
                    accountid = Convert.ToString(dataRow["accountid"]);
                    cellphone = Convert.ToString(objModel.cellphone);


                    sql = "select count(1) from sy_account where cellphone=?cellphone and id<>?id";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
                    cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    int count = Convert.ToInt32(cmd.ExecuteScalar());

                    if (count > 0)
                    {
                        dynObj.validateIndex = 7;
                        dynObj.message = "手机号码已存在";
                        dynObj.result = false;
                        return dynObj;
                    }

                    sql = "update sy_account set cellphone=?cellphone where id=?id;update sy_user set cellphone=?cellphone,rank=?rank where id=?studentid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
                    cmd.Parameters.Add(new MySqlParameter("studentid", studentid));
                    cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(objModel.rank)));
                    int exec = cmd.ExecuteNonQuery();

                    dynObj.result = true;
                }
                else if (Convert.ToString(objModel.type) == "2")
                {
                    string password1 = Convert.ToString(objModel.pass1);
                    string password2 = Convert.ToString(objModel.pass2);
                    if (!password1.Equals(password2))
                    {
                        dynObj.validateIndex = 1;
                        dynObj.message = "两次输入密码不一致";
                        dynObj.result = false;
                        return dynObj;
                    }

                    sql = "select id from sy_account where cellphone=?cellphone";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("cellphone", Convert.ToString(objModel.cellphone)));
                    dt = new DataTable();
                    MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);

                    accountid = Convert.ToString(cmd.ExecuteScalar());
                    string newpassword = Encrypt.SecurityPassword(password1, accountid);

                    sql = "update sy_account set pwd=?pwd,signstatus=1,activedtime=now() where id=?id;update sy_user set isactive=1 where accountid=?id;";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    cmd.Parameters.Add(new MySqlParameter("pwd", newpassword));
                    int exec = cmd.ExecuteNonQuery();

                    dynObj.result = true;
                }
                else if (Convert.ToString(objModel.type) == "12")
                {
                    string verifycode = string.Empty;
                    //verifycode=Convert.ToString(HttpContext.Current.Session["regverify"]);
                    //if (!verifycode.Equals(Convert.ToString(objModel.verifycode)))
                    //{
                    //	dynObj.validateIndex = 5;
                    //	dynObj.message = "安全码错误，请重新输入";
                    //	dynObj.result = false;
                    //	return dynObj;
                    //}

                    //手机验证码验证
                    verifycode = Convert.ToString(HttpContext.Current.Session["validatesmscode_telphone"]);
                    if (!verifycode.Equals(Convert.ToString(objModel.cellphone)))
                    {
                        dynObj.validateIndex = 7;
                        dynObj.message = "手机号码与验证码不符";
                        dynObj.result = false;
                        return dynObj;
                    }

                    string smscode = Convert.ToString(HttpContext.Current.Session["validatesmscode"]);
                    if (!smscode.Equals(Convert.ToString(objModel.smscode)))
                    {
                        dynObj.validateIndex = 6;
                        dynObj.message = "验证码错误，请重新输入";
                        dynObj.result = false;
                        return dynObj;
                    }

                    string password1 = Convert.ToString(objModel.pass1);
                    string password2 = Convert.ToString(objModel.pass2);
                    if (!password1.Equals(password2))
                    {
                        dynObj.validateIndex = 1;
                        dynObj.message = "两次输入密码不一致";
                        dynObj.result = false;
                        return dynObj;
                    }


                    sql = "select * from sy_user where name=?name and departmentid=?departmentid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("name", Convert.ToString(objModel.name)));
                    cmd.Parameters.Add(new MySqlParameter("departmentid", Convert.ToString(objModel.departmentid)));
                    //cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(objModel.rank)));
                    dt = new DataTable();
                    MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    adpt.Fill(dt);
                    //if (dt.Rows.Count <= 0)
                    //{
                    //	dynObj.validateIndex = 4;
                    //	dynObj.message = "所选的职务级别与本人不符";
                    //	dynObj.result = false;
                    //	return dynObj;
                    //}
                    DataRow dataRow = dt.Rows[0];
                    studentid = Convert.ToString(dataRow["id"]);
                    accountid = Convert.ToString(dataRow["accountid"]);
                    cellphone = Convert.ToString(objModel.cellphone);


                    sql = "select count(1) from sy_account where cellphone=?cellphone and id<>?id";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
                    cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    int count = Convert.ToInt32(cmd.ExecuteScalar());

                    if (count > 0)
                    {
                        dynObj.validateIndex = 7;
                        dynObj.message = "手机号码已存在";
                        dynObj.result = false;
                        return dynObj;
                    }

                    sql = @"update sy_account set cellphone=?cellphone,pwd=?pwd,signstatus=1,activedtime=now() where id=?id;
							update sy_user set cellphone=?cellphone,rank=?rank,isactive=1 where id=?studentid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    string newpassword = Encrypt.SecurityPassword(password1, accountid);
                    cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
                    cmd.Parameters.Add(new MySqlParameter("pwd", newpassword));
                    cmd.Parameters.Add(new MySqlParameter("studentid", studentid));
                    cmd.Parameters.Add(new MySqlParameter("rank", Convert.ToString(objModel.rank)));
                    int exec = cmd.ExecuteNonQuery();



                    //sql = "select id from sy_account where cellphone=?cellphone";
                    //cmd.CommandText = sql;
                    //cmd.Parameters.Clear();
                    //cmd.Parameters.Add(new MySqlParameter("cellphone", Convert.ToString(objModel.cellphone)));
                    //dt = new DataTable();
                    //MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    //adpt.Fill(dt);

                    //accountid = Convert.ToString(cmd.ExecuteScalar());
                    //string newpassword = Encrypt.SecurityPassword(password1, accountid);

                    //sql = "update sy_account set pwd=?pwd,signstatus=1,activedtime=now() where id=?id;";
                    //cmd.CommandText = sql;
                    //cmd.Parameters.Clear();
                    //cmd.Parameters.Add(new MySqlParameter("id", accountid));
                    //cmd.Parameters.Add(new MySqlParameter("pwd", newpassword));
                    //int exec = cmd.ExecuteNonQuery();

                    dynObj.result = true;
                }

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql.ToString() + ex);

                dynObj.validateIndex = 4;
                dynObj.result = false;
                dynObj.message = "验证失败";
            }
            finally
            {
                conn.Close();
            }


            return dynObj;

        }

        /// <summary>
        /// 处理登录逻辑
        /// </summary>
        /// <param name="accinfo"></param>
        /// <returns></returns>
        public dynamic Login(dynamic loginModel)
        {
            dynamic returnInfo = new ExpandoObject();
            returnInfo.isVerify = false;
            //表单验证
            //验证码验证
            if (!Convert.ToBoolean(loginModel.fromApp))
            {
                object verifycode = HttpContext.Current.Session["loginverify"];
                if (verifycode == null)
                {
                    returnInfo.message = "验证码错误";
                    returnInfo.result = false;
                    returnInfo.isVerify = true;
					HttpContext.Current.Session.Remove("loginverify");
                    return returnInfo;
                }
                string formcode = loginModel.verifycode;
                if (verifycode.ToString().ToLower() != formcode.ToLower())
                {
                    returnInfo.result = false;
                    returnInfo.message = "验证码错误";
                    returnInfo.isVerify = true;
					HttpContext.Current.Session.Remove("loginverify");
                    return returnInfo;
                }
            }

            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.message = "登录帐号信息异常";
            dynObj.result = false;
            dynObj.isVerify = false;
			HttpContext.Current.Session.Remove("loginverify");

            string sql = string.Empty;
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                try
                {
                    conn.Open();

                    MySqlCommand cmd = conn.CreateCommand();
                    DataTable dtdata = GetUserInfo(Convert.ToString(loginModel.logname), cmd);
                    if (dtdata.Rows.Count != 1)
                    {
                        dynObj.message = "登录名或密码错误";
                        dynObj.result = false;
                        return dynObj;
                    }
                    DataRow row = dtdata.Rows[0];

                    string dbpwd = Convert.ToString(row["pwd"]);
                    string password = Encrypt.SecurityPassword(Convert.ToString(loginModel.hashpwd), Convert.ToString(row["id"]));

                    if (string.IsNullOrEmpty(Convert.ToString(loginModel.hashpwd)) || (dbpwd != password))
                    {
                        dynObj.message = "登录名或密码错误";
                        dynObj.result = false;
                        return dynObj;
                    }

                    //检查平台是否有过期，过期则不能登录。
                    //账号已被锁定，不能登录
                    if (Convert.ToInt32(row["status"].ToString()) < 0)
                    {
                        dynObj.message = "账号已被锁定";
                        dynObj.result = false;
                        return dynObj;

                    }

                    if (Convert.ToInt32(row["signstatus"].ToString()) <= 0)
                    {
                        dynObj.message = "账号尚未注册";
                        dynObj.result = false;
                        return dynObj;
                    }

                    sql = @"select acc.id,acc.cellphone,acc.pwd,acc.logname,acc.createtime,acc.createuser,acc.lastupdateuser,acc.lastupdatetime,usr.photo_servername,usr.photo_serverthumbname,
							acc.status,acc.signstatus,acc.activedtime,usr.id studentid,usr.name,usr.departmentid,dep.pids,dep.name departmentname,usr.rank,usr.usertype,
							depadmin.departmentid mdepartmentid,depadmin.departmentname mdepartmentname from sy_account acc 
							inner join sy_user usr on acc.id=usr.accountid 
							inner join sy_department dep on usr.departmentid=dep.id 
							left join sy_department_admin depadmin on depadmin.userid=acc.id where acc.id=?accountid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("accountid", Convert.ToString(row["id"])));
                    MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                    dtdata = new DataTable();
                    adpt.Fill(dtdata);
                    row = dtdata.Rows[0];
                    if (dtdata.Rows.Count == 0)
                    {
                        dynObj.message = "登录帐号信息异常";
                        dynObj.result = false;
                        return dynObj;
                    }

                    string accountid = row["id"].ToString();
                    PermissionService pservice = new PermissionService();
                    var permissionList = pservice.getAllPermission(accountid);
                    var roleList = pservice.getRoleNameList(accountid);
                    var btnList = pservice.getBtnList(row["usertype"].ToString());

                    SessionObj.SetSessionObj("permissionDic", permissionList);
                    SessionObj.SetSessionObj("roleList", roleList);
                    SessionObj.SetSessionObj("btnList", btnList);
                    SessionObj.SetSessionObj("logname", row["logname"]);
                    SessionObj.SetSessionObj("name", row["name"]);
                    SessionObj.SetSessionObj("accountId", accountid);
                    SessionObj.SetSessionObj("studentId", row["studentid"]);
                    SessionObj.SetSessionObj("PhotoPath", row["photo_servername"]);
                    SessionObj.SetSessionObj("PhotoThumbPath", row["photo_serverthumbname"]);
                    SessionObj.SetSessionObj("departmentId", row["departmentid"]);
                    SessionObj.SetSessionObj("pids", row["pids"]);
                    SessionObj.SetSessionObj("departmentName", row["departmentname"]);
                    SessionObj.SetSessionObj("mdepartmentId", row["mdepartmentid"]);
                    SessionObj.SetSessionObj("mdepartmentName", row["mdepartmentname"]);
                    SessionObj.SetSessionObj("usertype", row["usertype"]);
                    SessionObj.SetSessionObj("depremark", row["departmentname"]);

                    sql = @"select dep1.name,IFNULL(dep2.name,'') pname from sy_department dep1 LEFT JOIN sy_department dep2 on dep1.pid=dep2.id where dep1.id=?departmentid";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("departmentid", row["departmentid"]));
                    adpt = new MySqlDataAdapter(cmd);
                    dtdata = new DataTable();
                    adpt.Fill(dtdata);
                    if (dtdata.Rows.Count > 0)
                    {
                        //List<string> listRemark = new List<string>();
                        //listRemark.Add(Convert.ToString(dtdata.Rows[0]["pname"]));
                        //listRemark.Add(Convert.ToString(dtdata.Rows[0]["name"]));
                        //string s = string.Join(" ", listRemark = listRemark.Where(n => n.Length > 0).ToList());

                        string s = Convert.ToString(dtdata.Rows[0]["pname"]) + "  " + Convert.ToString(dtdata.Rows[0]["name"]);
                        SessionObj.SetSessionObj("depremark",s);
                    }


                    sql = "select * from sy_yearplan where departmentid=?departmentid and rank_cn=?rank and year=?year";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("departmentid", row["departmentid"]));
                    cmd.Parameters.Add(new MySqlParameter("rank", row["rank"]));
                    cmd.Parameters.Add(new MySqlParameter("year", DateTime.Now.Year.ToString()));
                    adpt = new MySqlDataAdapter(cmd);
                    dtdata = new DataTable();
                    adpt.Fill(dtdata);

                    YearPlan planObj = new YearPlan();
                    planObj.year = DateTime.Now.Year.ToString();
                    planObj.rank = row["rank"].ToString();
                    planObj.departmentid = row["departmentid"].ToString();
                    planObj.departmentname = row["departmentname"].ToString();
                    planObj.studytime = dtdata.Rows.Count > 0 ? dtdata.Rows[0]["studytime"].ToString() : "无";

                    SessionObj.SetSessionObj("yearplan", planObj);


                    sql = "insert into sy_user_logininfo(id,accountid,studentid,year,message,createtime) values(uuid(),?accountid,?studentid,?year,?message,now())";
                    cmd.CommandText = sql;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new MySqlParameter("accountid", row["id"]));
                    cmd.Parameters.Add(new MySqlParameter("studentid", row["studentid"]));
                    cmd.Parameters.Add(new MySqlParameter("message", "登录"));
                    cmd.Parameters.Add(new MySqlParameter("year", DateTime.Now.Year.ToString()));
                    int exec = cmd.ExecuteNonQuery();


                    dynamic dynParameter = new System.Dynamic.ExpandoObject();
                    dynParameter.departmentid = Convert.ToString(row["departmentid"]);
                    dynParameter.rank = Convert.ToString(row["rank"]);
                    dynParameter.studentid = Convert.ToString(row["studentid"]);
                    dynParameter.accountid = Convert.ToString(accountid);
                    dynParameter.context = HttpContext.Current;
                    Task.Factory.StartNew(() =>
                    {
                        TotalService service = new TotalService();
                        if (loginModel.systemcode != null && Convert.ToString(loginModel.systemcode) == "10001")
                        {
                            //发改委
                            return service.AddUserTotal_ndrc(dynParameter);
                        }
                        else
                        {
                            //环保
                            return service.AddHistoryUserTotal(dynParameter);
                        }

                    });


                    //写入登录日志
                    //CommonSQL.doLog4net("正常登录", "10001");
                    SessionObj client = new SessionObj();
                    dynObj.loginUser = client.GetClientSession();
                    dynObj.message = "正常登录";
                    dynObj.result = true;
                }
                catch (Exception ex)
                {
                    ErrLog.Log(ex);
                }
            }
            return dynObj;
        }

        public dynamic ChangeClass(dynamic classModel)
        {
            //SessionObj obj = new SessionObj();
            //LoginService loginService = new LoginService();
            SessionObj.SetSessionObj("classid", classModel.classid.ToString());
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.message = "切班成功";
            dyn.result = true;
            return dyn;
        }

        public dynamic ChangeUserPhoto(dynamic classModel)
        {
            SessionObj.SetSessionObj("photopath", classModel.photopath.ToString());
            SessionObj.SetSessionObj("photothumbpath", classModel.photothumbpath.ToString());
            dynamic dyn = new System.Dynamic.ExpandoObject();
            dyn.message = "切换成功";
            dyn.result = true;
            return dyn;

        }

        /// <summary>
        /// 添加虚拟用户
        /// </summary>
        /// <param name="objModel"></param>
        /// <returns></returns>
        public dynamic InsertAccount(dynamic objModel)
        {
            dynamic dynObj = new System.Dynamic.ExpandoObject();
            dynObj.result = false;
            dynObj.message = "保存失败";

            var session = HttpContext.Current.Session;
            string logname = objModel.logname.ToString();
            string pwd = objModel.pwd.ToString();
            string departmentid = objModel.departmentid.ToString();
            string departmentname = objModel.departmentname.ToString();


            string sql = string.Empty;
            DataTable dt = new DataTable();

            try
            {
                using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
                {
                    conn.Open();
                    MySqlCommand cmd = conn.CreateCommand();
                    sql = "select count(1) count from sy_account where logname =?logname";
                    cmd.CommandText = sql;
                    cmd.Parameters.Add(new MySqlParameter("logname", logname));
                    int studentlimit = Convert.ToInt32("0" + cmd.ExecuteScalar());
                    if (studentlimit > 0)
                    {
                        dynObj.result = false;
                        dynObj.message = "系统已存在该账号";
                    }
                    else
                    {
                        string accountid = Guid.NewGuid().ToString();
                        string newpassword = Encrypt.SecurityPassword(pwd, accountid);
                        sql = "insert into sy_account(id,pwd,logname,createtime,sourceuserid,accounttype,signstatus) select ?accountid,?password,?logname,now(),?sourceuserid,1,1;";
                        sql += "insert into sy_user(id,accountid,usertype,departmentid,departmentname,createtime) select uuid(),?accountid,1,?departmentid,?departmentname,NOW();";
                        sql += "insert into sy_account_roles(id,accountid,roleid,createtime) select uuid(),?accountid,'22928341-b8f9-41c4-9c0f-114eadcc444d',now();";
                        cmd.Parameters.Clear();
                        cmd.CommandText = sql;
                        cmd.Parameters.Add(new MySqlParameter("accountid", accountid));
                        cmd.Parameters.Add(new MySqlParameter("password", newpassword));
                        cmd.Parameters.Add(new MySqlParameter("logname", logname));
                        cmd.Parameters.Add(new MySqlParameter("sourceuserid", accountid));
                        cmd.Parameters.Add(new MySqlParameter("departmentid", departmentid));
                        cmd.Parameters.Add(new MySqlParameter("departmentname", departmentname));
                        int count = cmd.ExecuteNonQuery();

                        if (count > 0)
                        {
                            dynObj.result = true;
                            dynObj.message = "保存成功";
                        }
                    }



                }

            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
                dynObj.result = false;
                dynObj.message = "保存失败";
            }

            return dynObj;
        }

		/// <summary>
		/// 可口可乐注册调用
		/// </summary>
		/// <param name="objModel"></param>
		/// <returns></returns>
		public dynamic RegisterValidate(dynamic objModel)
		{
			dynamic dynObj = new System.Dynamic.ExpandoObject();
			dynObj.validateIndex = 0;
			dynObj.message = "注册失败";
			dynObj.result = false;

			string sql = string.Empty;
			string cellphone = objModel.cellphone;
			string logname = objModel.logname;
			string name = objModel.name;
			string provice = objModel.provice;
			string city = objModel.city;
			string area = objModel.area;
			string category = objModel.category;
			string smscode = objModel.smscode;

			DataTable dt = new DataTable();
			
			MySqlTransaction tran = null;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				tran = conn.BeginTransaction();
				MySqlCommand cmd = conn.CreateCommand();

				sql = "select MYDES_ENCRYPT(?cellphone)";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
				string desCellphone = Convert.ToString(cmd.ExecuteScalar());


				sql = "select count(1) from sy_account where cellphone=?descellphone";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				cmd.Parameters.Add(new MySqlParameter("descellphone", desCellphone));
				int count = Convert.ToInt32(cmd.ExecuteScalar());

				if (count > 0)
				{
					dynObj.validateIndex = 0;
					dynObj.message = "手机号码已被使用";
					dynObj.result = false;
					return dynObj;
				}

				sql = "select count(1) from sy_account where logname=?logname";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				cmd.Parameters.Add(new MySqlParameter("logname", logname));
				int lognamecount = Convert.ToInt32(cmd.ExecuteScalar());

				if (lognamecount > 0)
				{
					dynObj.validateIndex = 2;
					dynObj.message = "登录名已被使用";
					dynObj.result = false;
					return dynObj;
				}

				string password1 = Convert.ToString(objModel.password1);
				string password2 = Convert.ToString(objModel.password2);
				if (!password1.Equals(password2))
				{
					dynObj.validateIndex = 4;
					dynObj.message = "两次输入密码不一致";
					dynObj.result = false;
					return dynObj;
				}

				//手机验证码验证
				//string verifycode = string.Empty;
				//verifycode = Convert.ToString(HttpContext.Current.Session["validatesmscode_telphone"]);
				//if (!verifycode.Equals(cellphone))
				//{
				//	dynObj.validateIndex = 6;
				//	dynObj.message = "手机号码与验证码不符";
				//	dynObj.result = false;
				//	return dynObj;
				//}

				//string sessionSmscode = Convert.ToString(HttpContext.Current.Session["validatesmscode"]);
				//if (!sessionSmscode.Equals(smscode))
				//{
				//	dynObj.validateIndex = 6;
				//	dynObj.message = "验证码错误，请重新输入";
				//	dynObj.result = false;
				//	return dynObj;
				//}

				sql = "select id from sy_department where pid=0";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				string  departmentid =Convert.ToString( cmd.ExecuteScalar());

				//注册先保存sy_account,sy_user;
				cmd.Parameters.Clear();
				sql = "insert into sy_account(id,cellphone,logname,pwd,createtime,status,signstatus,accounttype)values(?id,?cellphone,?logname,?pwd,?createtime,0,1,0)";
				cmd.CommandText = sql;
				string accountid = Guid.NewGuid().ToString();
				cmd.Parameters.AddWithValue("id", accountid);
				cmd.Parameters.AddWithValue("cellphone", desCellphone);
				cmd.Parameters.AddWithValue("logname", logname);
				string newHashPwd= Encrypt.SecurityPassword(Convert.ToString(password1), accountid);
				cmd.Parameters.AddWithValue("pwd", newHashPwd);
				cmd.Parameters.AddWithValue("createtime", DateTime.Now);
				cmd.Transaction = tran;
				cmd.ExecuteNonQuery();

				cmd.Parameters.Clear();
				sql = "insert into sy_user(id,accountid,departmentid,pids,createtime,cellphone,name,provice,city,area,companycategory)values(?id,?accountid,?departmentid,?pids,?createtime,?cellphone,?name,?provice,?city,?area,?companycategory)";
				cmd.CommandText = sql;
				cmd.Parameters.AddWithValue("id", Guid.NewGuid().ToString());
				cmd.Parameters.AddWithValue("accountid", accountid);
				cmd.Parameters.AddWithValue("departmentid", departmentid);
				cmd.Parameters.AddWithValue("pids", departmentid);
				cmd.Parameters.AddWithValue("createtime",DateTime.Now);
				cmd.Parameters.AddWithValue("cellphone", desCellphone);
				cmd.Parameters.AddWithValue("name", name);
				cmd.Parameters.AddWithValue("provice", provice);
				cmd.Parameters.AddWithValue("city", city);
				cmd.Parameters.AddWithValue("area", area);
				cmd.Parameters.AddWithValue("companycategory", category);
				cmd.Transaction = tran;
				cmd.ExecuteNonQuery();

				tran.Commit();
				dynObj.message = "注册成功";
				dynObj.result = true;
			}
			return dynObj;
		}

		public dynamic RegisterExistsCellphone(dynamic objModel)
		{
			dynamic dynObj = new System.Dynamic.ExpandoObject();
			dynObj.validateIndex = 0;
			dynObj.result = true;
			dynObj.message = "";
			string sql = string.Empty;
			string cellphone = objModel.cellphone;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand cmd = conn.CreateCommand();


				sql = "select MYDES_ENCRYPT(?cellphone)";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				cmd.Parameters.Add(new MySqlParameter("cellphone", cellphone));
				string desCellphone = Convert.ToString(cmd.ExecuteScalar());

				sql = "select count(1) from sy_account where cellphone=?cellphone";
				cmd.CommandText = sql;
				cmd.Parameters.Clear();
				cmd.Parameters.Add(new MySqlParameter("cellphone", desCellphone));
				int count = Convert.ToInt32(cmd.ExecuteScalar());

				if (count > 0)
				{
					dynObj.validateIndex = 0;
					dynObj.message = "手机号码已被使用";
					dynObj.result = false;
					return dynObj;
				}
			}
			return dynObj;
		}
	}
}