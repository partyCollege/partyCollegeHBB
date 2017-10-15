using PartyCollegeUtil.Model;
using PartyCollegeUtil.Service;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CollegeAPP.Controllers.HBB
{
    public class LoginController : ApiController
    {
        /// <summary>
        /// 获取登录验证码
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [Route("api/VerifyCode/{key}/{id}")]
        [HttpGet]
        public HttpResponseMessage VerifyCode(string key, string id)
        {
            VerifyCodeService service = new VerifyCodeService();
            return service.VerifyCode(key);
        }
		/// <summary>
		/// 登录
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[Route("api/Login")]
		[HttpPost]
		public dynamic Login([FromBody]dynamic loginModel)
		{
			LoginService loginSvc = new LoginService();
			dynamic result = loginSvc.Login(loginModel);
			return result;
		}

		/// <summary>
		/// 检查注册短信验证码
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[HttpPost]
		public dynamic VerifySMSCode([FromBody]dynamic loginModel)
		{
			LoginService loginService = new LoginService();
			dynamic returnInfo = loginService.VerifySmsCode(loginModel);
			return returnInfo;
		}

		/// <summary>
		/// 验证信息校验
		/// </summary>
		/// <param name="objModel"></param>
		/// <returns></returns>
		/*
		 {
			name: "", //名字
			departmentid: "",//部门ID
			departmentname: "",//可以不传
			colleague1: "",// 同事1
			colleague2: "",//同事2
			rank: "",//职级
			cellphone: "",//手机
			verifycode: "",//验证码
			smscode: "",//短信验证码
			type: 0  //0验证信息，1注册信息, 2修改密码
			password1: "",//密码
			password2: ""//确认密码
		}
		*/
		[Route("api/validate")]
		[HttpPost]
		public dynamic Validate(dynamic objModel)
		{
			LoginService loginService = new LoginService();
			dynamic dyn = loginService.Validate(objModel);
			return dyn;
		}

		/// <summary>
		/// 判断是否存在手机号码
		/// </summary>
		/// <param name="objModel"></param>
		/// <returns></returns>
		[Route("api/checkcellphone")]
		[HttpPost]
		public dynamic CheckCellphone(dynamic objModel)
		{
			LoginService loginService = new LoginService();
			string cellphone = objModel.cellphone;
			string accountid = objModel.accountid;
			dynamic dyn = loginService.CheckExistsCellphone(cellphone, accountid);
			return dyn;

		}

		/// <summary>
		/// 判断是否存在手机号码
		/// </summary>
		/// <param name="objModel"></param>
		/// <returns></returns>
		[Route("api/existscellphone")]
		[HttpPost]
		public dynamic ExistsCellphone(dynamic objModel)
		{
			LoginService loginService = new LoginService();
			dynamic dyn = loginService.ExistsCellphone(objModel);
			return dyn;

		}

		/// <summary>
		/// 重置密码
		/// </summary>
		/// <param name="objModel"></param>
		/// <returns></returns>
		[Route("api/resetpassword")]
		[HttpPost]
		public dynamic ResetPassword(dynamic objModel)
		{
			LoginService loginService = new LoginService();
            dynamic dyn= loginService.ResetPassword(objModel);
			return dyn;

		}

		/// <summary>
		/// 处理客户端获取session的问题
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[Route("api/Session")]
		[HttpPost]
		public dynamic GetClientSession([FromBody]dynamic loginModel)
		{
			dynamic returnInfo = new ExpandoObject();
			SessionObj clientSesObj = new SessionObj();
			returnInfo.loginUser = clientSesObj.GetClientSession();

			if (returnInfo.loginUser.code == "success")
			{
				returnInfo.code = "success";
				returnInfo.message = "正常登录";
			}
			else
			{
				returnInfo.code = "failed";
				returnInfo.message = "会话超时";
			}
			return returnInfo;
		}

		/// <summary>
		/// 安全退出
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[Route("api/Logout")]
		[HttpPost]
		public dynamic Logout([FromBody]dynamic loginModel)
		{
			LoginService loginSvc = new LoginService();
			dynamic returnInfo = new ExpandoObject();
            bool result = loginSvc.Logout(loginModel);
			if (result)
			{
				HttpContext.Current.Session.Abandon();
			}
			returnInfo.code = "success";
			returnInfo.message = "退出成功";
			return returnInfo;
		}
    }
}
