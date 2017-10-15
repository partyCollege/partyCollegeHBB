using CollegeAPP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class WeekClassController : ApiController
    {
        // GET: api/WeekClass
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        [HttpGet]
        [Route("api/WeekClass/action/GetWeekClass/{nowWeek}/{handeler?}/{bcinfo_id?}")]
        public IEnumerable<object> GetWeekClass(DateTime nowWeek, string handeler = "", int bcinfo_id = 0)
        {
            WeekClass weekClass = new WeekClass();

            IEnumerable<object> returnVal = new List<object>();
            return weekClass.getWeekClass(nowWeek, handeler, bcinfo_id);
        }

        [HttpPost]
        [Route("api/WeekClass/action/GetWeekKQ/{onecard}/{info_ids?}")]
        public List<kqData> GetWeekClass(string onecard, string info_ids = "")
        {
            List<kqData> kqList = new List<kqData>();

            Dictionary<string, string> dic = new Dictionary<string, string>();
            if (info_ids.Length > 0)
            {
                info_ids = info_ids.Trim(",".ToCharArray());
            }
            if (info_ids.Length > 0)
            {
                Student stu = new Student();
                dic = stu.getKQ(onecard, info_ids);
                foreach(var c in dic)
                {
                    kqData kq=new kqData();
                    kq.info_id = c.Key;
                    kq.status = c.Value;
                    kqList.Add(kq);
                }
            }
            return kqList;
        }
        // GET: api/WeekClass/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/WeekClass
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/WeekClass/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/WeekClass/5
        public void Delete(int id)
        {
        }
    }
}
