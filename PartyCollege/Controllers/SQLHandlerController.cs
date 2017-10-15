using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class SQLHandlerController : ApiController
    {
        // GET: api/SQLHandler
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/SQLHandler/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/SQLHandler
        public void Post([FromBody]string value)
        {
            getConfig.refalshSQLConfig();
        }

        // PUT: api/SQLHandler/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/SQLHandler/5
        public void Delete(int id)
        {
        }
    }
}
