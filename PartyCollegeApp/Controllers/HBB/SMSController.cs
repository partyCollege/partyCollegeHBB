using PartyCollegeUtil.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollegeAPP.Controllers.HBB
{
    public class SMSController : ApiController
    {
		[Route("api/getSMSCode")]
		[HttpPost]
		public dynamic getSMSCode([FromBody]dynamic formModel)
		{
			SmsService smsSrv = new SmsService();
			return smsSrv.SendSmsMessage(formModel);
		}

		/// <summary>
		/// 检查注册短信验证码
		/// </summary>
		/// <param name="loginModel"></param>
		/// <returns></returns>
		[Route("api/VerifySMSCode")]
		[HttpPost]
		public dynamic VerifySMSCode([FromBody]dynamic loginModel)
		{
			VerifyCodeService service = new VerifyCodeService();
			return service.VerifySMSCode(loginModel);
		}
    }
}
