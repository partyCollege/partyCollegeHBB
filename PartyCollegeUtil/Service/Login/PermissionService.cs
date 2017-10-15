using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.DB_ORM;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;

namespace PartyCollegeUtil.Service
{
    public class PermissionService
    {
        private const string permissionJsonFilePath = "config/permission.json";
        #region 获取角色信息
        /// <summary>
        /// 保存角色信息
        /// </summary>
        /// <param name="roleparam"></param>
        /// <returns></returns>
        public bool saveRole(RoleInfo roleparam, bool isNew, List<RolePermission> permissionList)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            MySqlTransaction tran = null;
            RolePermission temp = new RolePermission();
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                if (isNew)
                {
                    roleparam.insert(conn, tran);
                    foreach (RolePermission item in permissionList)
                    {
                        item.insert(conn, tran);
                    }
                    CommonSQL.doLog4net("操作-新增角色维护", "40007");
                }
                else
                {
                    roleparam.update(conn);
                    //先删除再新增
                    temp.delete(conn, tran, new List<SQLQuery>() { new SQLQuery("roleid", Opertion.equal, roleparam.Id) });
                    foreach (RolePermission item in permissionList)
                    {
                        item.insert(conn, tran);
                    }
                    CommonSQL.doLog4net("操作-保存角色维护", "40007");
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
        /// 按账号得到角色初始化列表，用于下拉框填充
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        //public List<RoleInfo> getInitRoleInfoList(string accountId)
        //{
        //	string sql = string.Empty;
        //	DataTable dt = new DataTable();
        //	MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
        //	try
        //	{
        //		conn.Open();
        //		//先获取账号已经获得得角色
        //		sql = @"select * from sy_role sr where exists(select * from sy_account_roles sar where sr.id=sar.roleid and sar.accountid=?)";
        //		MySqlCommand cmd = conn.CreateCommand();
        //		cmd.CommandText = sql;
        //		cmd.Parameters.Add(new MySqlParameter("accountid", accountId));
        //		MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
        //		adpt.Fill(dt);
        //		//再查询满足条件下可以获取的其他角色列表
        //		sql = "select * from sy_user su where su.accountid=?";
        //		sql = @"select * from sy_role sr where exists(select * from sy_account_roles sar where sr.id=sar.roleid and sar.accountid=?)";
        //	}
        //	catch (Exception ex)
        //	{
        //		ErrLog.Log(sql + ex);
        //	}
        //	finally
        //	{
        //		conn.Close();
        //	}
        //	List<RoleInfo> roleList = UtilDataTableToList<RoleInfo>.ConvertToList(dt);
        //	return roleList;
        //}
        public List<RoleInfo> getRoleInfoList(string accountId)
        {
            string sql = @"select * from sy_role sr where exists(select * from sy_account_roles sar where sr.id=sar.roleid and sar.accountid=?accountid)";
            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("accountid", accountId));
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
            List<RoleInfo> roleList = UtilDataTableToList<RoleInfo>.ConvertToList(dt);
            return roleList;
        }

        public List<string> getRoleNameList(string accountId)
        {
            List<string> roleNameList = new List<string>();
            List<RoleInfo> roleList = getRoleInfoList(accountId);
            RoleInfo role = null;
            for (int i = 0; i < roleList.Count; i++)
            {
                role = roleList[i];
                roleNameList.Add(role.Name);
            }
            return roleNameList;
        }
        #endregion

        #region 权限

        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public Dictionary<string, PermissionInfo> getAllPermission()
        {
            Dictionary<string, PermissionInfo> permissionDic = new Dictionary<string, PermissionInfo>();
            List<PermissionInfo> permissionList = getAllPermissionList();
            foreach (PermissionInfo item in permissionList)
            {
                permissionDic.Add(item.Name, item);
            }
            return permissionDic;
        }
        /// <summary>
        /// 按账号ID获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public Dictionary<string, PermissionInfo> getPermission(string accountId)
        {
            Dictionary<string, PermissionInfo> permissionDic = new Dictionary<string, PermissionInfo>();
            List<PermissionInfo> permissionList = getPermissionList(accountId);
            foreach (PermissionInfo item in permissionList)
            {
                permissionDic.Add(item.Name, item);
            }
            return permissionDic;
        }

        public Dictionary<string, ViewPermission> getAllPermission(string accountId)
        {
            Dictionary<string, ViewPermission> permissionDic = new Dictionary<string, ViewPermission>();
            List<PermissionInfo> permissionList = getPermissionList(accountId);
            ViewPermission temp = null;
            foreach (var item in permissionList)
            {
                temp = new ViewPermission();
                temp.Name = item.Name;
                temp.GroupName = item.GroupName;
                if (!permissionDic.ContainsKey(item.Name))
                    permissionDic.Add(item.Name, temp);
            }
            return permissionDic;
        }

        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        //public List<PermissionInfo> getAllPermissionList(string accountId)
        //{
        //	PermissionInfo pinfo = new PermissionInfo();
        //	return pinfo.get(new SQLQuery("accoutid", Opertion.equal, accountId));
        //}

        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        //public List<ViewPermission> getAllViewPermissionList(string accountId, string platformid)
        //{
        //	PermissionInfo pinfo = new PermissionInfo();
        //	List<PermissionInfo> permissionList = getPermissionList(accountId, platformid);
        //	List<ViewPermission> viewList = new List<ViewPermission>();
        //	ViewPermission temp = null;

        //	return viewList;
        //}
        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public List<PermissionInfo> getPermissionList(string accountId)
        {
            string sql = @"select distinct spm.id,spm.name,spm.comment,spm.groupname from sy_permission spm
						inner join sy_role_permission srp on spm.id=srp.permissionid
						inner join sy_role sr on srp.roleid=sr.id
						inner join sy_account_roles sar on sar.roleid=sr.id
						where sar.accountid=?accountid";
            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.Add(new MySqlParameter("accountid", accountId));
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
            List<PermissionInfo> permissionList = UtilDataTableToList<PermissionInfo>.ConvertToList(dt);
            return permissionList;
        }

        /// <summary>
        /// 获取权限信息
        /// </summary>
        /// <param name="accout"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public List<PermissionInfo> getAllPermissionList()
        {
            PermissionInfo pinfo = new PermissionInfo();
            return pinfo.get();
        }

        public bool SyncPermission()
        {
            bool result = false;
            List<PermissionInfo> dbPermissionList = getAllPermissionList();
            List<PermissionInfo> jsonPermissionList = GetPermissionFromJson();
            MySqlConnection conn = null;
            MySqlTransaction tran = null;
            try
            {
                conn = new MySqlConnection(DBConfig.ConnectionString);
                conn.Open();
                tran = conn.BeginTransaction();
                PermissionInfo temp = null;
                foreach (PermissionInfo item in jsonPermissionList)
                {
                    temp = dbPermissionList.Find(m => m.Name == item.Name);
                    if (temp == null)
                    {
                        item.Id = Guid.NewGuid().ToString();
                        item.CreateTime = DateTime.Now;
                        item.CreateUser = "";
                        item.insert(conn, tran);
                    }
                    else
                    {
                        temp.LastUpdateTime = DateTime.Now;
                        temp.LastUpdateUser = "";
                        temp.update(conn, tran);
                    }
                }
                tran.Commit();
                result = true;
            }
            catch (Exception ex)
            {
                tran.Rollback();
            }
            finally
            {
                conn.Close();
            }
            return result;
        }

		public dynamic SaveSinglePermission(dynamic formModel)
		{
			PermissionInfo param = new PermissionInfo();
			dynamic returnInfo = new ExpandoObject();
			SessionObj sesobj = new SessionObj();

			string id = formModel.id;
			bool IsNew = true;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				if (!string.IsNullOrEmpty(id))
				{
					IsNew = false;
					PermissionInfo pinfo = new PermissionInfo().getOne<PermissionInfo>(conn, new List<SQLQuery>() { new SQLQuery("id", Opertion.equal, id) }, false);
					param = pinfo;
				}
				else
				{
					param.Id = Guid.NewGuid().ToString();
					param.CreateTime = DateTime.Now;
					param.CreateUser = sesobj.logname.ToString();
					param.IsNew = IsNew;

					List<PermissionInfo> pinfoList = new PermissionInfo().get(new SQLQuery("name", Opertion.equal, formModel.name));
					if (pinfoList.Count > 0)
					{
						returnInfo.code = "failed";
						returnInfo.message = "权限名称已经存在";
					}
				}

				param.Name = formModel.name;
				param.GroupName = formModel.groupname;
				param.Comment = formModel.comment;
				param.SysLevel = Convert.ToBoolean(formModel.syslevel) ? 1 : 0;
				param.Category = formModel.category;

				PermissionService pservice = new PermissionService();
				bool result = pservice.SavePermission(param);
				if (result)
				{
					returnInfo.code = "success";
					returnInfo.id = param.Id;
					returnInfo.message = "保存成功";
				}
				else
				{
					returnInfo.code = "failed";
					returnInfo.message = "保存失败";
				}
			}
			return returnInfo;
		}
        public bool SavePermission(PermissionInfo permission)
        {
            bool result = false;
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                if (permission.IsNew)
                {
                    permission.insert(conn);
                    //PlatformPackagePermission pppm = new PlatformPackagePermission();
                    //pppm.Id = Guid.NewGuid().ToString();
                    //pppm.Isshare = 0;
                    //pppm.PermissionId = permission.Id;
                    //pppm.PlatformId = new SessionObj().platformId.ToString();
                    //pppm.insert(conn);
                }
                else
                {
                    permission.update(conn);
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

        public bool SavePermission(MySqlConnection conn, PermissionInfo permission)
        {
            bool result = false;
            if (permission.IsNew)
            {
                permission.insert(conn);
                //PlatformPackagePermission pkgPermission = new PlatformPackagePermission();
                //pkgPermission.Id = Guid.NewGuid().ToString();
                //pkgPermission.PermissionId = permission.Id;
                //pkgPermission.PlatformId = new SessionObj().platformId.ToString();
                //pkgPermission.Isshare = 0;
                //pkgPermission.insert(conn);
            }
            else
            {
                permission.update(conn);
            }
            result = true;
            return result;
        }

        private static List<PermissionInfo> GetPermissionFromJson()
        {
            StringBuilder configpath = new StringBuilder(HttpRuntime.AppDomainAppPath.ToString());
            List<PermissionInfo> permissionList = new List<PermissionInfo>();
            configpath.Append(permissionJsonFilePath);
            using (StreamReader sr = new StreamReader(configpath.ToString()))
            {
                try
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Converters.Add(new JavaScriptDateTimeConverter());
                    serializer.NullValueHandling = NullValueHandling.Ignore;

                    //构建Json.net的读取流
                    JsonReader reader = new JsonTextReader(sr);
                    //对读取出的Json.net的reader流进行反序列化，并装载到模型中  
                    permissionList = serializer.Deserialize<List<PermissionInfo>>(reader);
                }
                catch (Exception ex)
                {
                    ErrLog.Log(ex);
                }
            }
            return permissionList;
        }
        #endregion

        #region 后台账号维护
        /// <summary>
        /// 控制器调用初始化账号信息
        /// </summary>
        /// <param name="accountModel"></param>
        /// <returns></returns>
        public AccountInfo InitAccountInfo(dynamic accountModel)
        {
            AccountService accService = new AccountService();
            SessionObj sessObj = new SessionObj();
            AccountInfo accTemp = new AccountInfo();
            AccountInfo paramAccinfo = new AccountInfo();
            paramAccinfo.Logname = accountModel.logname;
            paramAccinfo.Name = accountModel.name;
            paramAccinfo.IdCard = accountModel.idcard;
            if (accountModel.status != null)
                paramAccinfo.Status = accountModel.status;
            else
                paramAccinfo.Status = 0;
            if (accountModel.defaultusertype != null)
                paramAccinfo.DefaultUserType = accountModel.defaultusertype;
            else
                paramAccinfo.DefaultUserType = 0;
            paramAccinfo.Cellphone = accountModel.cellphone;
            paramAccinfo.Sex = Convert.ToInt32("0" + accountModel.sex);

            string accid = accountModel.accountid;
            if (string.IsNullOrEmpty(accid))
            {
                paramAccinfo.Id = Guid.NewGuid().ToString();
                paramAccinfo.CreateTime = DateTime.Now;
                paramAccinfo.CreateUser = sessObj.logname.ToString();
                paramAccinfo.IsNew = true;
            }
            else
            {
                accTemp = accTemp.get(new SQLQuery("id", Opertion.equal, accid));
                accTemp.Id = accid;
                accTemp.LastUpdateTime = DateTime.Now;
                accTemp.LastUpdateUser = sessObj.logname.ToString();
                accTemp.Sex = paramAccinfo.Sex;
                accTemp.DefaultUserType = paramAccinfo.DefaultUserType;
                accTemp.IsNew = false;
                paramAccinfo = accTemp;
            }
            string PwdTemp = Convert.ToString(accountModel.pwd);
            if (PwdTemp != "******")
            {
                paramAccinfo.Pwd = accService.getDoubleMd5String(Convert.ToString(accountModel.pwd));
            }
            return paramAccinfo;
        }
        /// <summary>
        /// 控制器调用初始化角色信息
        /// </summary>
        /// <param name="accinfo"></param>
        /// <param name="templist"></param>
        /// <returns></returns>
        public List<AccountRole> GetRoleList(AccountInfo accinfo, dynamic templist)
        {
            SessionObj sessObj = new SessionObj();
            AccountRole roletemp = null;
            List<AccountRole> accRolelist = new List<AccountRole>();
            foreach (dynamic role in templist)
            {
                roletemp = new AccountRole();
                roletemp.Id = Guid.NewGuid().ToString();
                roletemp.PlatformId = role.platformid;
                roletemp.RoleId = role.id;
                roletemp.AccountId = accinfo.Id;
                roletemp.CreateTime = DateTime.Now;
                roletemp.CreateUser = sessObj.logname.ToString();
                accRolelist.Add(roletemp);
            }
            return accRolelist;
        }


        public dynamic CheckAccountExists(AccountInfo accinfo)
        {
            dynamic returnInfo = new ExpandoObject();
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                AccountInfo chkTemp = accinfo.get(conn, new SQLQuery("id", Opertion.equal, accinfo.Id));
                AccountInfo accTemp = null;
                if (chkTemp != null && chkTemp.Logname != accinfo.Logname)
                {
                    //检查账号是否存在
                    if (accinfo.IsNew)
                    {
                        accTemp = accinfo.get(conn, new SQLQuery("logname", Opertion.equal, accinfo.Logname));
                        if (!string.IsNullOrEmpty(accTemp.Id))
                        {
                            returnInfo.code = "exists";
                            returnInfo.message = "该帐号已经存在";
                            return returnInfo;
                        }
                    }
                }

                if (chkTemp != null && chkTemp.IdCard != accinfo.IdCard)
                {
                    if (accinfo.IsNew)
                    {
                        accTemp = accinfo.get(conn, new SQLQuery("idcard", Opertion.equal, accinfo.IdCard));
                        if (!string.IsNullOrEmpty(accTemp.Id))
                        {
                            returnInfo.code = "exists";
                            returnInfo.message = "该身份证已经注册";
                            return returnInfo;
                        }
                    }
                }
            }
            returnInfo.code = "success";
            returnInfo.message = "";
            return returnInfo;
        }

        public dynamic saveAccountInfo(List<AccountRole> rolelist, AccountInfo accinfo)
        {
            dynamic returnInfo = new ExpandoObject();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            MySqlTransaction tran = null;
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                if (accinfo.IsNew)
                {
                    accinfo.insert(conn, tran);
                }
                else
                {
                    accinfo.update(conn, tran);
                }
                AccountRole accrole = new AccountRole();
                accrole.delete(conn, tran, new List<SQLQuery>() { new SQLQuery("accountid", Opertion.equal, accinfo.Id) });
                for (int i = 0; i < rolelist.Count; i++)
                {
                    rolelist[i].insert(conn, tran);
                }

                tran.Commit();
                returnInfo.code = "success";
                returnInfo.message = "保存成功";
            }
            catch (Exception ex)
            {
                returnInfo.code = "success";
                returnInfo.message = "保存失败";
                tran.Rollback();
            }
            finally
            {
                conn.Close();
            }
            return returnInfo;
        }
        #endregion


        public dynamic saveSyUserInfo(List<AccountRole> accRolelist, AccountInfo accinfo, SyUser syuser)
        {
            dynamic returnInfo = new ExpandoObject();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            MySqlTransaction tran = null;
            try
            {
                conn.Open();
                tran = conn.BeginTransaction();
                if (accinfo.IsNew)
                {
                    accinfo.insert(conn, tran);
                }
                else
                {
                    accinfo.update(conn, tran);
                }

                AccountRole accrole = new AccountRole();
                accrole.delete(conn, tran, new List<SQLQuery>() { 
					new SQLQuery("accountid", Opertion.equal, accinfo.Id)
					, new SQLQuery("platformid", Opertion.equal, syuser.PlatformId), });
                for (int i = 0; i < accRolelist.Count; i++)
                {
                    accRolelist[i].insert(conn, tran);
                }

                if (syuser.IsNew)
                {
                    syuser.insert(conn, tran);
                }
                else
                {
                    syuser.update(conn, tran);
                }

                //更新student表
                List<SyStudent> listStu = new SyStudent().get<SyStudent>(conn, new List<SQLQuery>() { new SQLQuery("idcard", Opertion.equal, accinfo.IdCard) }, false);
                foreach (SyStudent item in listStu)
                {
                    item.AccountId = accinfo.Id;
                    item.update(conn);
                }

                tran.Commit();
                if (syuser.IsNew)
                {
                    CommonSQL.doLog4net("操作-新增平台用户 ID:" + syuser.Id, "40009001");
                }
                else
                {
                    CommonSQL.doLog4net("操作-保存平台用户 ID:" + syuser.Id, "40009001");
                }
                returnInfo.code = "success";
                returnInfo.id = syuser.Id;
                returnInfo.message = "保存成功";
            }
            catch (Exception ex)
            {
                returnInfo.code = "failed";
                returnInfo.message = "保存失败";
                tran.Rollback();
            }
            finally
            {
                conn.Close();
            }
            return returnInfo;
        }

        public List<string> getBtnList(string accountid)
        {
//            List<string> btnlist = new List<string>();
//            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
//            {
//                conn.Open();

//                btnlist.Add("学习中心");
                 
//                string sql = string.Empty;
//                //检查平台用户是否有权限
//                sql = @"select count(*) from sy_account_roles sar inner join sy_role_permission srp on sar.roleid=srp.roleid 
//							inner join sy_permission sp on srp.permissionid=sp.id where sp.category=2 and sar.accountid=?accountid";
//                MySqlCommand cmd = conn.CreateCommand();
//                cmd.CommandText = sql; 
//                cmd.Parameters.Clear();
//                cmd.CommandText = sql;
//                cmd.Parameters.Add(new MySqlParameter("accountid", accountid));
//                int result = Convert.ToInt32("0" + cmd.ExecuteScalar());
//                if (result > 0)
//                {
//                    btnlist.Add("管理中心");
//                }
//                return btnlist;
//            }

            List<string> btnlist = new List<string>();
            btnlist.Add("学习中心");
            if (accountid == "1" || accountid=="2")
                btnlist.Add("管理中心");
            return btnlist;
        }

		public dynamic InsertRole(dynamic formModel)
		{
			dynamic returnInfo = new ExpandoObject();
			SessionObj sessObj = new SessionObj();
			RoleInfo roleinfo = new RoleInfo();
			List<RolePermission> permissionList = new List<RolePermission>();
			string roleid = formModel.id;
			bool isNew = false;
			dynamic platformArray = formModel.platform;
			dynamic rolePermissionGroupArry = formModel.permissionGroupList;

			if (string.IsNullOrEmpty(roleid))
			{
				roleinfo.Id = Guid.NewGuid().ToString();
				isNew = true;
			}
			else
			{
				roleinfo.Id = roleid;
			}
			roleinfo.Name = formModel.name;
			roleinfo.PlatformId = platformArray.id;
			roleinfo.Status = Convert.ToBoolean(formModel.enable) ? 1 : 0;
			roleinfo.SysLevel = Convert.ToBoolean(formModel.syslevel) ? 1 : 0;
			roleinfo.CreateTime = DateTime.Now;
			roleinfo.CreateUser = sessObj.logname.ToString();

			//同一平台下的角色名称不能重复
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				List<SQLQuery> param = new List<SQLQuery>() { 
						new SQLQuery("name", Opertion.equal, roleinfo.Name),
						new SQLQuery("syslevel", Opertion.equal, 1)
				};
				if (!isNew)
				{
					param.Add(new SQLQuery("id", Opertion.notEqual, roleinfo.Id));
				}
				RoleInfo rinfo = new RoleInfo().getOne<RoleInfo>(conn
					, param, false);
				if (!string.IsNullOrEmpty(rinfo.Id))
				{
					returnInfo.code = "failed";
					returnInfo.message = "角色名称已经存在";
					return returnInfo;
				}
			}
			object checkTemp = null;
			RolePermission rolePerTemp = null;
			//处理权限
			foreach (var group in rolePermissionGroupArry)
			{
				foreach (var per in group.permissionArray)
				{
					checkTemp = per.selected;
					if (checkTemp != null && Convert.ToBoolean(checkTemp))
					{
						rolePerTemp = new RolePermission();
						rolePerTemp.Id = Guid.NewGuid().ToString();
						rolePerTemp.PermissionId = per.id;
						rolePerTemp.RoleId = roleinfo.Id;
						permissionList.Add(rolePerTemp);
					}
				}
			}

			PermissionService pservice = new PermissionService();
			bool result = pservice.saveRole(roleinfo, isNew, permissionList);
			if (result)
			{
				returnInfo.code = "success";
				returnInfo.message = "保存成功";
			}
			else
			{
				returnInfo.code = "failed";
				returnInfo.message = "保存失败";
			}
			return returnInfo;
		}
	}
}