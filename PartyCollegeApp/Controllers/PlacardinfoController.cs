using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CollegeAPP.Model;
using System.Data.OleDb;
using PartyCollegeUtil.DB_ORM;
using MySql.Data.MySqlClient;
namespace CollegeAPP.Controllers
{
    public class PlacardinfoController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/Placardinfo
        public IEnumerable<PLACARDINFO> Get()
        {
            List<PLACARDINFO> PLACARDINFO=new List<PLACARDINFO>();
            using(MySqlConnection conn=new MySqlConnection(ConnectionString))
            {
                PLACARDINFO=DBHelp.Query<PLACARDINFO>(conn,false);
            }
            List<PLACARDINFO> newlist = new List<PLACARDINFO>();
            for (int i = 0; i < 50; i++)
            {
                newlist.Add(PLACARDINFO[i]);
            }
            return newlist;
        }

		// api/控制器名/action/函数名称/参数名/...
        [HttpGet]
        [Route("api/PLACARDINFO/action/getmore/{userid}/{pageindex}/{pagerow}")]
        public IEnumerable<PLACARDINFO> getmore(int userid,int pageindex=0, int pagerow=50)
        {
            List<PLACARDINFO> PLACARDINFO = new List<PLACARDINFO>();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                PLACARDINFO = DBHelp.Query<PLACARDINFO>(conn, false);
            }
            List<PLACARDINFO> newlist = new List<PLACARDINFO>();
            int startrow = 0;
            int endrow = 0;
            startrow = (pageindex - 1) * pagerow;
            endrow = startrow + pagerow;
            for (int i =startrow; i <= endrow-1; i++)
            {
                if(i<PLACARDINFO.Count)
                {
                    newlist.Add(PLACARDINFO[i]);
                }
            }
            return newlist;
        }
        // GET: api/Placardinfo/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Placardinfo
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Placardinfo/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Placardinfo/5
        public void Delete(int id)
        {
        }
    }
}
