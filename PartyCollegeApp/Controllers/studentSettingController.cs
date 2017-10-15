using CollegeAPP.DataModel;
using CollegeAPP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class studentSettingController : ApiController
    {
        // GET: api/studentSetting
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

		// GET: api/studentSetting/5
		public string Get(int id)
		{
			return "value";
		}

		[HttpGet]
		[Route("api/studentSetting/action/GetStudent/{bcid}/{info_id}")]
        // GET: api/studentSetting/5
		public Student GetStudent(string bcid,string info_id)
        {
			Student stu = new Student();
			stu = stu.get(bcid,info_id);
			return stu;
        }

		[HttpPost]
		[Route("api/studentSetting/action/UpdateStudentPwd")]
		public AppMessage UpdateStudentPwd(Student stu)
		{
			AppMessage appmsg = new AppMessage();
			if (stu.UpdateStudentPwd())
			{
				appmsg.msgStatus = true;
				appmsg.msgContent = "";
			}
			else
			{
				appmsg.msgStatus = false;
				appmsg.msgContent = "修改失败";
			}
			return appmsg;
		}

        // POST: api/studentSetting
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/studentSetting/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/studentSetting/5
        public void Delete(int id)
        {
        }
    }
}
