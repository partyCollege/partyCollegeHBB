using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
namespace CollegeAPP.Controllers
{
    public class testOLEDBController : ApiController
    {
        // GET: api/testOLEDB
        public IEnumerable<string> Get()
        {

            using (MySqlConnection conn = new MySqlConnection(@"Provider=OleMySql.MySqlSource.1;User ID=root;Password=root;Host=192.168.1.123;Port=3306;Database=ultrax;"))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
            }
            return new string[] { "value1", "value2" };
        }

        // GET: api/testOLEDB/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/testOLEDB
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/testOLEDB/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/testOLEDB/5
        public void Delete(int id)
        {
        }
    }
}
