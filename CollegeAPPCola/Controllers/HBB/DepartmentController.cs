using PartyCollegeUtil.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollegeAPP.Controllers.HBB
{
    public class DepartmentController : ApiController
    {
		/// <summary>
		/// 登录
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[Route("api/GetDepartment")]
		[HttpPost]
		public dynamic GetDepartment([FromBody]dynamic fromModel)
		{
			DepartmentService svc = new DepartmentService();
			dynamic result= svc.GetDepartmentTree(fromModel);
			return result;
		}
    }
}
