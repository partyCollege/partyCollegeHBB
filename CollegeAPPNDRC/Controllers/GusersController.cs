using CollegeAPP.DataModel;
using CollegeAPP.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class GusersController : ApiController
    {
        // GET: api/Gusers
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Gusers/5
        public string Get(int id)
        {
            return "value";
        }
        [HttpGet]
        [Route("api/Gusers/action/getSuperPSD/{onecard}")]
        public string GetSuper(string onecard)
        {
            G_USERS guser = new G_USERS();
           return  guser.getSUPERPSD(onecard);
        }

		[HttpPost]
		[Route("api/Gusers/action/ZJLogin/{username}/{pwd}")]
		public AppMessage ZJLogin(string username, string pwd)
		{
			AppMessage appmsg = new AppMessage();
			G_USERS guser = new G_USERS();
			guser.logname = username.ToUpper();
			string md5pwd = UtilTools.GetMd5Hash(pwd);
			G_USERS nguser= guser.ZJLogin();
			if (nguser != null)
			{
				if (md5pwd.Equals(nguser.md5psd))
				{
					appmsg.msgStatus = true;
					appmsg.userid = nguser.id;
					appmsg.uname = nguser.uname;
				}
				else
				{
					appmsg.msgStatus = false;
					appmsg.msgContent = "密码错误。";
				}
			}
			else
			{
				appmsg.msgStatus = false;
				appmsg.msgContent = "用户名不存在。";
			}
			return appmsg;
		}

		[HttpPost]
		[Route("api/Gusers/action/Login/{username}/{pwd}")]
		public AppMessage Login(string username, string pwd)
		{
			AppMessage appmsg = new AppMessage();
			G_USERS guser = new G_USERS();
			guser.logname = username.ToUpper();
			string md5pwd =UtilTools.GetMd5Hash(pwd);
			
			G_USERS nguser= guser.Login();
			if (nguser != null)
			{
				if (md5pwd.Equals(nguser.md5psd))
				{
					if (nguser.status == 4)
					{
						appmsg.msgStatus = false;
						appmsg.msgContent = "该用户已被锁定，无法登陆。请与系统管理员联系！";
					}
					else
					{
						appmsg.msgStatus = true;
                        appmsg.userid = nguser.id;
                        appmsg.onecard = nguser.onecard;
						appmsg.msgContent = string.Empty;
                        appmsg.mainDept = nguser.mainCode;
						appmsg.uname = nguser.uname;
                        appmsg.roles = nguser.roles;
					}
				}
				else
				{
					appmsg.msgStatus = false;
					appmsg.msgContent = "密码错误。";
				}
			}
			else
			{
				appmsg.msgStatus = false;
				appmsg.msgContent = "用户名不存在。";
			}
			return appmsg;
		}

        [HttpPost]
        [Route("api/Gusers/action/StudentLogin/{username}/{pwd}")]
        public Student StudentLogin(string username, string pwd)
        {
            Student stu = new Student();
            stu.password = pwd;
            stu.onecard = username;
            stu.Login();
            return stu;
        }

        [HttpPost]
        [Route("api/Gusers/action/AutoLogin/{phone}/{bcid}")]
        public Student StudentAutoLogin(string phone,string bcid)
        {
            Student stu = new Student();
            stu.phone = DES.DESDeCode(phone, System.Configuration.ConfigurationManager.AppSettings["screctKey"]);
            stu.bcid = DES.DESDeCode(bcid, System.Configuration.ConfigurationManager.AppSettings["screctKey"]);
            string s = DES.DESEnCode("18919313058", System.Configuration.ConfigurationManager.AppSettings["screctKey"]);
            stu.autoLogin();
            return stu;
        }

        [HttpPost]
        [Route("api/Gusers/action/decPhone/{phone}")]
        public Student decPhone(string phone)
        {
            Student stu = new Student();
            stu.phone = DES.DESEnCode(phone, System.Configuration.ConfigurationManager.AppSettings["screctKey"]);
            //string s = DES.DESEnCode("18919313058", System.Configuration.ConfigurationManager.AppSettings["screctKey"]);
            stu.autoLogin();
            return stu;
        }

        // POST: api/Gusers
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Gusers/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Gusers/5
        public void Delete(int id)
        {
        }
    }
}
