using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Dynamic;
using System.Net.Http.Headers;
using MySql.Data.MySqlClient;
using System.Text;
using System.Data;
using PartyCollegeUtil.Service;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using Newtonsoft.Json.Linq;

namespace PartyCollege.Controllers
{
    public class coursewareController : ApiController
    {
        /// <summary>
        /// 提交评论
        /// </summary>
        /// <param name="appraiseList"></param>
        /// <returns></returns>
        [Route("api/submitAppraise")]
        [HttpPost]
        public dynamic submitAppraise([FromBody]dynamic appraiseList)
        {
            CommonSQL.doLog4net("操作-提交课程评价", "20038");

            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.submitAppraise(appraiseList);
        }

        /// <summary>
        /// 根据课程id获取每项平均分
        /// </summary>
        /// <param name="coursewareid"></param>
        /// <returns></returns>
        public DataTable getAppraiseitem(string coursewareid)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.getAppraiseitem(coursewareid);
        }


        /// <summary>
        /// 获取课程下面问题列表
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/searchQuestions")]
        [HttpPost]
        public dynamic searchQuestions([FromBody]dynamic queryModel)
        {
            CourseWareService csService = new CourseWareService();
            return csService.searchQuestions(queryModel);
        }


        /// <summary>
        /// 关注
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/commonAttention")]
        [HttpPost]
        public dynamic commonAttention([FromBody]dynamic dataPraise)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.commonAttention(dataPraise);
        }


        /// <summary>
        /// 保存学后感
        /// </summary>
        /// <param name="ExamModel"></param>
        /// <returns></returns>
        [Route("api/InsertClasscourseLearningsense")]
        [HttpPost]
        public dynamic InsertClasscourseLearningsense([FromBody]dynamic classcourseLearningsenseModel)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.InsertClasscourseLearningsense(classcourseLearningsenseModel);
        }


        /// <summary>
        /// 提交学后感
        /// </summary>
        /// <param name="ExamModel"></param>
        /// <returns></returns>
        [Route("api/submitClasscourseLearningsense")]
        [HttpPost]
        public dynamic submitClasscourseLearningsense([FromBody]dynamic classcourseLearningsenseModel)
        {

            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.submitClasscourseLearningsense(classcourseLearningsenseModel);
        }


        /// <summary>
        /// 课程分类信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/courseMove")]
        [HttpPost]
        public dynamic courseMove([FromBody]dynamic dataPraise)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.courseMove(dataPraise);
        }


        /// <summary>
        /// 课程多分类信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/courseMoveRelatiion")]
        [HttpPost]
        public dynamic courseMoveRelatiion([FromBody]dynamic dataPraise)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.courseMoveRelatiion(dataPraise);
        }


        /// <summary>
        /// 保存课程评价
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/saveCourseExamine")]
        [HttpPost]
        public dynamic saveCourseExamine([FromBody]dynamic dataPraise)
        {
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.saveCourseExamine(dataPraise);
        }

        /// <summary>
        /// 课程状态提交
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/courseMainStatus")]
        [HttpPost]
        public dynamic courseMainStatus([FromBody]dynamic dataPraise)
        {
            //日志提交
            CommonSQL.doLog4net("操作-课件:" + dataPraise.operationcontent.Value, "40017");
            CourseWareService courseWareService = new CourseWareService();
            return courseWareService.courseMainStatus(dataPraise);
        }


        [Route("api/getRealDuration")]
        [HttpPost]
        public dynamic getRealDuration([FromBody]dynamic postData)
        {
            HttpRequestHelper hrhelper = new HttpRequestHelper();
            string vid = postData.vid;
            string responseMessage = hrhelper.GetHttp("http://v.polyv.net/uc/video/info?vids=" + vid, "", "application/json");
            dynamic respObj = JsonConvert.DeserializeObject(responseMessage);
            //执行更新操作。

            CourseWareService courseWareService = new CourseWareService();
            courseWareService.getRealDuration(Convert.ToString(respObj[0].duration), vid);

            return respObj;
        }

		[Route("api/getPPTVideoCourse")]
		[HttpPost]
		[SessionFilter]
		public dynamic getPPTVideoCourse([FromBody]dynamic data)
		{
			CourseWareService courseWareService = new CourseWareService();
			string category = "pptCourseFile";
			string pptcoursefile_servername = data.pptcoursefile_servername;
			int pageIndex = data.pageindex;
			if (pageIndex == 0) pageIndex = 1;
			dynamic pptobj = new ExpandoObject();
			pptobj.pptimgfilepath = courseWareService.getPPTVideoCourse(category, pptcoursefile_servername.Replace(".pptx", "").Replace(".ppt", ""), pageIndex);
			return pptobj;
		}
    }

}