using PartyCollege.Model;
using PartyCollege.Model.outdoc;
using PartyCollegeUtil.Service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class DocExportController : ApiController
    {
        /// <summary>
        /// 课程体系目录导出
        /// </summary>
        /// <param name="postModel"></param>
        /// <returns></returns>
        [Route("api/outdoc")]
        [HttpGet]
        public dynamic OutDoc([FromBody]dynamic postModel)
        {
			ExportService exportSrv = new ExportService();
			exportSrv.ExportCoursewareCategory();
            return "success";
        }

        /// <summary>
        /// 学习心得目录导出
        /// </summary>
        /// <param name="postModel"></param>
        /// <returns></returns>
        [Route("api/exportstudysense/{parmcategory}/{classid}/{title}/{name}/{status}/{recommend}")]
        [HttpGet]
        public dynamic ExportStudySense(string parmcategory, string classid, string title, string name, string status, string recommend)
        {
			ExportService exportSrv = new ExportService();
			exportSrv.ExportStudySense(parmcategory,classid,title,name,status,recommend);
            return "success";
        }
        /// <summary>
        /// 学后感目录导出
        /// </summary>
        /// <param name="postModel"></param>
        /// <returns></returns>
        [Route("api/exportlearnsense/{parmcategory}/{classcourseid}/{title}/{name}/{status}/{recommend}")]
        [HttpGet]
        public dynamic ExportLearnSense(string parmcategory, string classcourseid, string title, string name, string status, string recommend)
        {
			ExportService exportSrv = new ExportService();
			exportSrv.ExportLearnSense(parmcategory, classcourseid, title, name, status, recommend);
            return "success";
        }

		/// <summary>
        /// 学后感目录导出
        /// </summary>
        /// <param name="postModel"></param>
        /// <returns></returns>
		[Route("api/exportbclearnsense/{parmcategory}/{title}/{name}/{status}/{recommend}")]
		[HttpGet]
		public dynamic ExportBCLearnSense(string parmcategory, string title, string name, string status, string recommend)
		{
			ExportService exportSrv = new ExportService();
			exportSrv.ExportBCLearnSense(parmcategory, title, name, status, recommend);
			return "success";
		}

        /// <summary>
        /// 导出学员
        /// </summary>
        /// <param name="postModel"></param>
        /// <returns></returns>
        [Route("api/exportstudent/{classid}/{name}/{company}/{signstatus}/{graduatestatus}/{studyrate}")]
        [HttpGet]
        public dynamic ExportStudent(string classid, string name, string company, string signstatus, string graduatestatus, string studyrate)
		{
			ExportService exportSrv = new ExportService();
			exportSrv.ExportStudent(classid, name, company, signstatus, graduatestatus, studyrate);
            return "success";
        }
        //name: "",
        //  status: "",
        //  company: "",

        [Route("api/studyreportexport/{name}/{company}/{status}")]
        [HttpGet]
        public dynamic StudyReportExport(string name, string company, string status)
		{
			ExportService exportSrv = new ExportService();
			exportSrv.StudyReportExport(name,company,status);
            return "success";
        }

        [Route("api/workunitreportexport/{company}")]
        [HttpGet]
        public dynamic WorkUnitReportExport(string company)
        {
			ExportService exportSrv = new ExportService();
			exportSrv.WorkUnitReportExport(company);
            return "success";
        }
    }
}
