using MySql.Data.MySqlClient;
using PartyCollegeUtil.Service.back;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class backController : ApiController
    {
        [Route("api/batchInsertNewsRelation")]
        [HttpPost]
        public dynamic batchInsertNewsRelation([FromBody]dynamic arrayModel) 
        {
            newsService newsservice = new newsService();
            return newsservice.batchInsertNewsRelation(arrayModel);
        }




        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}