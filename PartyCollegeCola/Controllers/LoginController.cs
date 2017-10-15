using PartyCollege.Model;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Dynamic;
using PartyCollege.Model.Filter;
using PartyCollegeUtil.Service;
using PartyCollegeUtil.Model;
using System.IO;
using Newtonsoft.Json;

namespace PartCollege.Controllers
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


        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [Route("api/Login")]
        [HttpPost]
        public dynamic Login([FromBody]dynamic loginModel)
        {
            dynamic returnInfo = new ExpandoObject();
            returnInfo.isVerify = false;
            //表单验证
            //验证码验证
            object verifycode = HttpContext.Current.Session["loginverify"];
            if (verifycode == null)
            {
                returnInfo.message = "验证码错误";
                returnInfo.result = false;
                returnInfo.isVerify = true;
                return returnInfo;
            }
            string formcode = loginModel.verifycode;
            if (verifycode.ToString().ToLower() != formcode.ToLower())
            {
                returnInfo.result = false;
                returnInfo.message = "验证码错误";
                returnInfo.isVerify = true;
                return returnInfo;
            }

            /*webservice域登陆
            PartyCollegeCola.com.cofcoko.bpm.WebService domainAuthen = new PartyCollegeCola.com.cofcoko.bpm.WebService();
            domainAuthen.Url = "http://bpm.cofcoko.com/DomainAuthenticate/WebService.asmx";
            PartyCollegeCola.com.cofcoko.bpm.ADLoginRequest req = new PartyCollegeCola.com.cofcoko.bpm.ADLoginRequest();
            req.Password = "";
            req.UserAD = "";
            req.Domain = "";
            PartyCollegeCola.com.cofcoko.bpm.UserAuthenticateResponse resp = domainAuthen.ADLogin(req);
            string mes = resp.ReturnMessage;
            if (resp.ReturnFlag)
            {
                mes = "登陆成功";
            }
            else
            {

                //提示用户登录失败信息：userAuthenticateResponseService.ReturnMessage
                mes = "LOGIN_USER_PASSWORD_INCORRECT";   //未知的用户名或错误密码
                mes = "LOGIN_USER_NO_EXIST";             //用户不存在
                mes = "LOGIN_USER_ACCOUNT_INACTIVE";     //帐号未激活
                mes = "LOGIN_DOMAIN_INCORRECT";          //域服务器不存在
                mes = "LOGIN_USER_FAIL";                 //认证失败
            }
            */

            LoginService loginSvc = new LoginService();
            dynamic result = loginSvc.Login(loginModel);
            return result;
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
            return loginSvc.Logout(loginModel);
        }



        /// <summary>
        /// session 心跳
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [Route("api/HeartBeat")]
        [HttpPost]
        public dynamic HeartBeat([FromBody]dynamic loginModel)
        {
            dynamic returnInfo = new ExpandoObject();
            loginModel.platformcode = "";
            return GetClientSession(loginModel);
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
            SessionObj clientSesObj = new SessionObj();
            return clientSesObj.GetClientSession();
        }





        /// <summary>
        /// 切换班级，更新session中的班级id和学员id
        /// </summary>
        /// <param name="classModel"></param>
        /// <returns></returns>
        [Route("api/ChangeClass")]
        [HttpPost]
        public dynamic ChangeClass([FromBody]dynamic classModel)
        {
            LoginService loginService = new LoginService();
            return loginService.ChangeClass(classModel);
        }


        [Route("api/changeuserphoto")]
        [HttpPost]
        public dynamic ChangeUserPhoto([FromBody]dynamic classModel)
        {
            LoginService loginService = new LoginService();
            return loginService.ChangeUserPhoto(classModel);

        }


        [Route("api/changepassword")]
        [HttpPost]
        public dynamic ChangePassword([FromBody]dynamic userModel)
        {
            LoginService loginService = new LoginService();
            dynamic dyn = loginService.ChangePassword(userModel);
            return dyn;
        }

        /// <summary>
        /// 用户忘记密码
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [Route("api/Forgotpwd")]
        [HttpPost]
        public dynamic ForgotPwd([FromBody]dynamic objModel)
        {
            //dynamic dyn = new ExpandoObject();
            //LoginService loginService = new LoginService();
            //dyn = loginService.ForgotPwd(objModel);
            //return dyn;

            return null;
        }

        /// <summary>
        /// 重置用户密码
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [Route("api/account/resetuserpwd")]
        [HttpPost]
        public dynamic ResetUserPwd([FromBody]dynamic objModel)
        {
            dynamic dyn = new ExpandoObject();
            LoginService loginService = new LoginService();
            dyn = loginService.ResetUserPwd(objModel);
            return dyn;
        }

        [Route("api/cancerMananger")]
        [HttpPost]
        public dynamic cancerMananger([FromBody]dynamic objModel)
        {
            dynamic dyn = new ExpandoObject();
            AccountService accSerice = new AccountService();
            string accountid = objModel.accountid;
            string userid = objModel.userid;
            string departmentid = objModel.departmentid;
            bool result = accSerice.cancerManager(accountid, "22928341-b8f9-41c4-9c0f-114eadcc444d", userid, departmentid);
            if (result)
            {
                dyn.code = result;
                dyn.message = "取消成功";
            }
            else
            {
                dyn.code = result;
                dyn.message = "取消失败";
            }
            return dyn;
        }


        [Route("api/GetUser")]
        //[SessionCheckFilter]
        [HttpGet]
        public dynamic GetUser()
        {
            return new { username = HttpContext.Current.Session["userid"] };
        }

        [Route("api/getverifycode")]
        [HttpGet]
        public dynamic GetVerifyCode()
        {
            return new { verifycode = HttpContext.Current.Session["VerifyCode"] };
        }

        /// <summary>
        /// 验证信息校验
        /// </summary>
        /// <param name="objModel"></param>
        /// <returns></returns>
        [Route("api/validate")]
        [HttpPost]
        public dynamic Validate(dynamic objModel)
        {
            LoginService loginService = new LoginService();
            dynamic dyn = loginService.Validate(objModel);
            return dyn;

        }


        [Route("api/existscellphone")]
        [HttpPost]
        public dynamic ExistsCellphone(dynamic objModel)
        {
            LoginService loginService = new LoginService();
            dynamic dyn = loginService.ExistsCellphone(objModel);
            return dyn;

        }

        [Route("api/resetpassword")]
        [HttpPost]
        public dynamic ResetPassword(dynamic objModel)
        {
            LoginService loginService = new LoginService();
            dynamic dyn = loginService.ResetPassword(objModel);
            return dyn;

        }

        [Route("api/InsertAccount")]
        [HttpPost]
        public dynamic InsertAccount(dynamic objModel)
        {
            LoginService loginService = new LoginService();
            dynamic dyn = loginService.InsertAccount(objModel);
            return dyn;
        }

    }
}
