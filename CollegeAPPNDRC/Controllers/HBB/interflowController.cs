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
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Service.Class;

namespace PartyCollege.Controllers
{
    public class interflowController : ApiController
    {
        /// <summary>
        /// 插入班级交流信息
        /// </summary>
        /// <param name="classexchangeData"></param>
        /// <returns></returns>
        [Route("api/InsertInterflow")]
        [HttpPost]
        public dynamic InsertInterflow([FromBody]dynamic classexchangeData)
        {
			classService classervice = new classService();
			return classervice.InsertInterflow(classexchangeData);
        }


        /// <summary>
        /// 获取学员说信息
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/getStudentsSay")]
        [HttpPost]
        public dynamic getStudentsSay([FromBody]dynamic queryModel)
        {
			classService classervice = new classService();
			return classervice.getStudentsSay(queryModel);
        }



        /// <summary>
        /// 获取学员说详情
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/getStudentsSayById")]
        [HttpPost]
        public dynamic getStudentsSayById([FromBody]dynamic queryModel)
        {
			classService classervice = new classService();
			return classervice.getStudentsSayById(queryModel);
        }




        /// <summary>
        /// 点赞
        /// </summary>
        /// <param name="dataPraise"></param>
        /// <returns></returns>
        [Route("api/commonPraise")]
        [HttpPost]
        public dynamic commonPraise([FromBody]dynamic dataPraise)
        {
			if (dataPraise.tag != null && dataPraise.group != null)
			{
				CommonSQL.doLog4net("操作-" + Convert.ToString(dataPraise.tag), Convert.ToString(dataPraise.group));
			}

			classService classervice = new classService();
			return classervice.commonPraise(dataPraise);
        }


        /// <summary>
        /// 评论发布
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/interflowComment")]
        [HttpPost]
        public dynamic interflowComment([FromBody]dynamic dataComment)
		{
			CommonSQL.doLog4net("操作-评论发布", "20015001");

			classService classervice = new classService();
			return classervice.interflowComment(dataComment);
        }


        /// <summary>
        /// 分页获取必修课程
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/searchClassCoursewarelist")]
        [HttpPost]
        public dynamic searchClassCoursewarelist([FromBody]dynamic queryModel)
        {
			classService classervice = new classService();
			return classervice.searchClassRequireCoursewarelist(queryModel);
        }
    }
}