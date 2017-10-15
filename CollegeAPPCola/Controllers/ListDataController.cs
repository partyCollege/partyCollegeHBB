using CollegeAPP.config;
using CollegeAPP.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class ListDataController : ApiController
    {
        // GET: api/ListData
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ListData/5
        public string Get(int id)
        {
            return "value";
        }

		[HttpGet]
		[Route("api/ListData/action/GetPageData/{category}/{pageindex}/{userid}/{onecard}/{finfo_id}")] 
		public PageData GetPageData(string category,string pageindex,string userid,string onecard="123",string finfo_id="null")
		{
			int currentPage = 1;
			ConfigXml cfgxml = new ConfigXml();
            
			Dictionary<string, string> sqlParam = new Dictionary<string, string>();
			sqlParam.Add("userid", userid);
            sqlParam.Add("onecard", onecard);
            if (finfo_id != "null")
            {
                sqlParam.Add("finfo_id", finfo_id);
            }
            foreach (var c in HttpContext.Current.Session.Keys)
            {
                string s = c.ToString();
                try
                {
                    sqlParam.Add(c.ToString(), HttpContext.Current.Session[c.ToString()].ToString());
                }
                catch (Exception e)
                {
                    continue;
                }
            }
			if (!string.IsNullOrEmpty(pageindex))
			{
				currentPage = Convert.ToInt32(pageindex);
			}
			PageData temp = cfgxml.GetPageListData(category, currentPage, sqlParam);
			return temp;
		}

		[HttpGet]
		[Route("api/ListData/action/GetPageData/{category}/{pageindex}")]
		public PageData GetPageData(string category, string pageindex)
		{
			int currentPage = 1;
			ConfigXml cfgxml = new ConfigXml();
			if (!string.IsNullOrEmpty(pageindex))
			{
				currentPage = Convert.ToInt32(pageindex);
			}
			PageData temp = cfgxml.GetPageListData(category, currentPage,null);
			return temp;
		}

		[HttpGet]
		[Route("api/ListData/action/GetPageDetailData/{category}/{id}/{userid}")]
		public PageData GetPageDetailData(string category, string id,string userid)
		{
            Dictionary<string, string> sqlParam = new Dictionary<string, string>();
            //sqlParam.Add("userid", userid);
            foreach (var c in HttpContext.Current.Session.Keys)
            {
                string s = c.ToString();
                try
                {
                    sqlParam.Add(c.ToString(), HttpContext.Current.Session[c.ToString()].ToString());
                }
                catch (Exception e)
                {
                    continue;
                }
            }
			ConfigXml cfgxml = new ConfigXml();
			PageData temp = cfgxml.GetPageDetailData(category, id,userid,sqlParam);
			return temp;
		}

        // POST: api/ListData
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/ListData/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ListData/5
        public void Delete(int id)
        {
        }
    }
}
