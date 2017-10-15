using CollegeAPP.config;
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
    public class AppraiseController : ApiController
    {
        // GET: api/Appraise
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Appraise/5
        public string Get(int id)
        {
            return "value";
        }

		[HttpGet]
		[Route("api/Appraise/action/GetAppraiseInfoData/{itemid}/{ispj}/{bcorclass}/{bcinfoid}/{userid}")]
		public appraiseInfo GetAppraiseInfoData(string itemid, string ispj,string bcorclass, string bcinfoid, string userid)
		{
			//获取班次里的评价版本信息
			JW_BCGL bcinfo = new JW_BCGL();
			bcinfo.info_id = bcinfoid;
			bcinfo=bcinfo.get();

			ReqData req = new ReqData();
			req.bcid = bcinfo.info_id;
			req.version = bcinfo.pjVersion;
			req.edition = bcinfo.pjPlanEdition;
			req.isyjs = string.IsNullOrEmpty(bcinfo.isyjs) ? "0" : bcinfo.isyjs;
			req.itemid = itemid;// item的编号
			req.role = "student";
			//req.tabid = "1";//tab页的编号
			req.ispj = ispj;//未评
			req.bcorclass = bcorclass;
			req.userid = userid;
			configAppraise cfgapp = new configAppraise();
			appraiseInfo pgdata = cfgapp.GetAppraisePageData(req);
			return pgdata;
		}

		[HttpGet]
		[Route("api/Appraise/action/GetPjTabs/{bcinfoid}")]
		public List<PjTab> GetPjTabs(string bcinfoid)
		{
			JW_BCGL bcinfo = new JW_BCGL();
			bcinfo.info_id = bcinfoid;
			bcinfo = bcinfo.get();

			ReqData req = new ReqData();
			req.bcid = bcinfo.info_id;
			req.version = bcinfo.pjVersion;
			req.edition = bcinfo.pjPlanEdition;
			req.isyjs = bcinfo.isyjs;
			configAppraise cfgapp = new configAppraise();
			return cfgapp.GetXmlItemList(req);
		}

		[HttpGet]
		[Route("api/Appraise/action/GetPJInfoList/{itemid}/{ispj}/{bcorclass}/{bcinfoid}/{userid}")]
		public appraiseInfo GetPJInfoList(string itemid, string ispj, string bcorclass, string bcinfoid, string userid)
		{
			//获取班次里的评价版本信息
			JW_BCGL bcinfo = new JW_BCGL();
			bcinfo.info_id = bcinfoid;
			bcinfo = bcinfo.get();

			ReqData req = new ReqData();
			req.bcid = bcinfo.info_id;
			req.version = bcinfo.pjVersion;
			req.edition = bcinfo.pjPlanEdition;
			req.isyjs = string.IsNullOrEmpty(bcinfo.isyjs) ? "0" : bcinfo.isyjs;
			req.itemid = itemid;// item的编号
			req.role = "student";

			req.ispj = ispj;//未评
			req.bcorclass = bcorclass;
			req.userid = userid;
			configAppraise cfgapp = new configAppraise();
			return cfgapp.GetPJInfoList(req);
		}

		[HttpGet]
		[Route("api/Appraise/action/GetPJDataList/{itemid}/{ispj}/{bcorclass}/{bcinfoid}/{userid}/{keydata}/{formname}")]
		public PJKCInfo GetPJDataList(string itemid, string ispj, string bcorclass, string bcinfoid, string userid, string keydata, string formname)
		{
			//获取班次里的评价版本信息
			JW_BCGL bcinfo = new JW_BCGL();
			bcinfo.info_id = bcinfoid;
			bcinfo = bcinfo.get();

			ReqData req = new ReqData();
			req.bcid = bcinfo.info_id;
			req.version = bcinfo.pjVersion;
			req.edition = bcinfo.pjPlanEdition;
			req.isyjs = string.IsNullOrEmpty(bcinfo.isyjs) ? "0" : bcinfo.isyjs;
			req.itemid = itemid;// item的编号
			req.role = "student";
			if (formname != "undefined")
			{
				req.formname = formname;
			}

			if(bcorclass=="class"){
				req.kwid = keydata;
			}
			else if (bcorclass == "dy")
			{
				req.dyid = keydata;
			}
			else if (bcorclass == "jxxs")
			{
				req.jxxs = keydata;
			}
			else if (bcorclass == "zcr")
			{
				req.zcrid = keydata;
			}
			req.ispj = ispj;//未评
			req.bcorclass = bcorclass;
			req.userid = userid;
			configAppraise cfgapp = new configAppraise();
			return cfgapp.GetPJDataList(req);
		}

		[HttpPost]
		[Route("api/Appraise/action/SavePJData")]
		public AppMessage SavePJData(List<pjListPjItemPjData> jumpDataList) //List<pjListPjItemPjData> AppMessage jumpDataList
		{
			AppMessage appmsg = new AppMessage();
			
			configAppraise cfgapp = new configAppraise();
			if (cfgapp.DoPJJson(jumpDataList))
			{
				appmsg.msgStatus = true;
			}
			else
			{
				appmsg.msgStatus = false;
			}
			return appmsg;
		}
		[HttpPost]
		[Route("api/Appraise/action/SaveZJPJData")]
		public AppMessage SaveZJPJData(PJFormData formdata)
		{
			AppMessage appmsg = new AppMessage();
			configAppraise cfgapp = new configAppraise();
			appmsg=cfgapp.SaveZJPJJson(formdata);
			return appmsg;
		}
        // POST: api/Appraise
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Appraise/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Appraise/5
        public void Delete(int id)
        {
        }
    }
}
