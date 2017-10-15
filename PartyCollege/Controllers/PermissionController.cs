
using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class PermissionController : ApiController
	{
		#region 权限
		/// <summary>
		/// 保存权限
		/// </summary>
		/// <param name="formModel"></param>
		/// <returns></returns>
		[Route("api/Permission/SavePermission")]
		[HttpPost]
		public dynamic SavePermission([FromBody]dynamic formModel)
		{
			PermissionService pSrv = new PermissionService();
			return pSrv.SaveSinglePermission(formModel);
		}

		/// <summary>
		/// 同步检查所有的权限
		/// </summary>
		/// <param name="formModel"></param>
		/// <returns></returns>
		[Route("api/Permission/SyncPermission")]
		[HttpPost]
		public dynamic SyncPermission()
		{
			dynamic returnInfo = new ExpandoObject();
			PermissionService pservice = new PermissionService();
			bool result=pservice.SyncPermission();
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

		/// <summary>
		/// 获取所有的权限
		/// </summary>
		/// <param name="formModel"></param>
		/// <returns></returns>
		[Route("api/Permission/GetAllPermission")]
		[HttpPost]
		public dynamic GetAllPermission()
		{
			//dynamic returnInfo = new ExpandoObject();
			PermissionService pservice = new PermissionService();
			List<PermissionInfo> permissionList = pservice.getAllPermissionList();
			return permissionList;
		}

		/// <summary>
		/// 获取所有的权限通过RoleId
		/// </summary>
		/// <param name="formModel"></param>
		/// <returns></returns>
		[Route("api/Permission/GetPermissionRoleId")]
		[HttpPost]
		public dynamic GetAllPermissionRoleId([FromBody]dynamic formModel)
		{
			//dynamic returnInfo = new ExpandoObject();
			PermissionService pservice = new PermissionService();
			List<PermissionInfo> permissionList = pservice.getAllPermissionList();
			return permissionList;
		}
		#endregion

		#region 角色

		/// <summary>
		/// 保存角色
		/// </summary>
		/// <param name="formModel"></param>
		/// <returns></returns>
		[Route("api/Permission/SaveRole")]
		[HttpPost]
		public dynamic InsertRole([FromBody]dynamic formModel)
		{
			PermissionService pservice = new PermissionService();
			return pservice.InsertRole(formModel);
		}
		#endregion
	}
}

