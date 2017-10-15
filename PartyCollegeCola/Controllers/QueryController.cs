using PartyCollegeUtil.Model;
using PartyCollegeUtil.Service;
using System;
using System.Web;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class QueryController : ApiController
    {
        /// <summary>
        ///  写入操作日志
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/writeoptlog")]
        [HttpPost]
        public dynamic WriteLog([FromBody]dynamic queryModel)
        {
            string tag = Convert.ToString(queryModel.tag);
            string group = Convert.ToString(queryModel.group);
            CommonSQL.doLog4net(tag, group);

            return new { result = true, message = "success" };
        }



        [Route("api/WriteException")]
        [HttpPost]
        public dynamic WriteException([FromBody]dynamic data)
        {

            //访客浏览器系统
            string UserAgent = Request.Headers.UserAgent.ToString();

            dynamic dynModel = new System.Dynamic.ExpandoObject();

            dynModel.filename = Convert.ToString(data.filename);
            dynModel.methodname = Convert.ToString(data.methodname);
            dynModel.errorline = Convert.ToString(data.errorline);
            dynModel.message = Convert.ToString(data.message);
            dynModel.msginfo = Convert.ToString(data.msginfo) + ",UserAgent:" + UserAgent;
            dynModel.errorlevel = "0";
            dynModel.arguments = getarguments(data.arguments); ;
            dynModel.studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);

            PartyCollegeUtil.Model.Cache.CacheLog.ExcuteDBLog(dynModel);
            return null;
        }

        public string getarguments(object obj)
        {
            try
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(obj); ;
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        [Route("api/getsycodes")]
        [HttpPost]
        public dynamic getSyCodes(dynamic dynObj)
        {
            string[] syCodes = Convert.ToString(dynObj.categorys).Split(',');
            SyCodeService syCodeService = new SyCodeService();
            return syCodeService.getSyCodes(syCodes);
        }

        [Route("api/getcoursewarelist")]
        [HttpPost]
        public dynamic GetAllCourseWareList(dynamic dynObj)
        {
            CourseWareService service = new CourseWareService();
            return service.GetAllCourseWareList(dynObj);
        }

        [Route("api/getallstudylist")]
        [HttpPost]
        public dynamic GetAllStudyList(dynamic dynObj)
        {
            CourseWareService service = new CourseWareService();
            return service.GetAllStudyList(dynObj);
        }


        [Route("api/getallcoursecomments")]
        [HttpPost]
        public dynamic GetAllCourseComments(dynamic dynObj)
        {
            CourseWareService service = new CourseWareService();
            return service.GetAllCourseComments(dynObj);
        }


        [Route("api/addcoursewareuser")]
        [HttpPost]
        public dynamic AddCourseWareUser(dynamic dynObj)
        {
            CourseWareService service = new CourseWareService();
            return service.AddCourseWareUser(dynObj);
        }


        [Route("api/getplans")]
        [HttpPost]
        public dynamic GetPlan(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            return service.GetPlan(dynObj);
        }

        [Route("api/addplan")]
        [HttpPost]
        public dynamic AddPlan(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            return service.AddPlan(dynObj);
        }

        [Route("api/deleteplan")]
        [HttpPost]
        public dynamic DeletePlan(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            return service.DeletePlan(dynObj);
        }

        [Route("api/existsplan")]
        [HttpPost]
        public dynamic ExistsPlan(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            return service.ExistsPlan(dynObj);
        }



        [Route("api/deletestudent")]
        [HttpPost]
        public dynamic DeleteStudent(dynamic dynObj)
        {
            StudentService service = new StudentService();
            return service.DeleteStudent(dynObj);
        }
        [Route("api/insertstudent")]
        [HttpPost]
        public dynamic InsertStudent(dynamic dynObj)
        {
            StudentService service = new StudentService();
            return service.InsertStudent(dynObj);
        }

        [Route("api/getstudent")]
        [HttpPost]
        public dynamic GetStudent(dynamic dynObj)
        {
            StudentService service = new StudentService();
            return service.GetStudent(dynObj);
        }

        [Route("api/batchinsertstudent")]
        [HttpPost]
        public dynamic BatchInsertStudent(dynamic dynObj)
        {
            StudentService service = new StudentService();
            return service.BatchInsertStudent(dynObj);
        }




        [Route("api/addtrain")]
        [HttpPost]
        public dynamic AddTrain(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            return service.AddTrain(dynObj);
        }

        [Route("api/gettrain")]
        [HttpPost]
        public dynamic GetTrain(dynamic dynObj)
        {
            YearPlanService service = new YearPlanService();
            //return service.GetTrain(dynObj);
            return service.GetReportDetail(dynObj);
        }


        [Route("api/gettotal")]
        [HttpPost]
        public dynamic AddUserTotal(dynamic dynObj)
        {
            TotalService service = new TotalService();
            return service.AddHistoryUserTotal(dynObj);
        }

    }
}
