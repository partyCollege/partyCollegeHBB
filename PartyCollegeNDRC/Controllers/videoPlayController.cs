using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
using System.Text;
using System.Data;
using System.Threading.Tasks;
using System.Web;
using System.Dynamic;
using PartyCollegeUtil.Service;
using PartyCollegeUtil.Service.courseware;

namespace PartyCollege.Controllers
{
    public class videoPlayController : ApiController
    {
        // GET: api/videoPlay
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/videoPlay/5
        public string Get(int id)
        {
            return "value";
        }

        [Route("api/getVideoLogPKey")]
        [HttpPost]
        [SessionFilter]
        public dynamic getVideoLogPKey([FromBody]JObject data)
        {
            videoPlayService videoPlayservice = new videoPlayService();
            return videoPlayservice.getVideoLogPKey(data);
        }

        // POST: api/videoPlay
        [SessionFilter]
        public dynamic Post([FromBody]JObject data)
        {
            videoPlayService videoPlayservice = new videoPlayService();
            return videoPlayservice.videoplay(data);
        }


        // PUT: api/videoPlay/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/videoPlay/5
        public void Delete(int id)
        {
        }
    }
}
