using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.OleDb;
using Model;
using MySql.Data.MySqlClient;

namespace CollegeAPP.Controllers
{
    public class DefaultController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/Default
        public IEnumerable<JWYJS_BCGL> Get()
        {
            List<JWYJS_BCGL> bcgllist=new List<JWYJS_BCGL>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
               //bcgllist=  DB_ORM.DBHelp.Query<JWYJS_BCGL>(conn, false);
               JWYJS_BCGL bcgl = new JWYJS_BCGL();
               bcgllist = bcgl.get<JWYJS_BCGL>(conn, false);
            }
            return bcgllist;
        }

        // GET: api/Default/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Default
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Default/5
        public void Put(int id, [FromBody]string value)
        {
        }
        [HttpPost]
        [Route("api/Default/action/PostNew")]
        public void addNew()
        {
            
        }
        // DELETE: api/Default/5
        public void Delete(int id)
        {
        }
    }
}
