using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CollegeAPP.Model;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using PartyCollegeUtil.Config;
using MySql.Data.MySqlClient;
namespace CollegeAPP.Controllers
{
    public class CommonSQLController : ApiController
    {
        // GET: api/CommonSQL
        public dynamic Post([FromBody]JObject json)
        {
            List<dynamic> errors = new List<dynamic>();
            List<dynamic> returnVal = new List<dynamic>();
            dynamic dm = json;
            var key = dm.key;
            JObject postData = dm.postData;
            Dictionary<string, object> data = new Dictionary<string, object>();
            try
            {
                foreach (var c in postData)
                {
                    data.Add(c.Key, c.Value.ToObject(typeof(object)));
                }
            }
            catch (Exception ex) {
                errors.Add(new { error="参数读取出错"});
            }
            try
            {
				CommonSQL sql = new CommonSQL();
                if (key.Type == JTokenType.Array)
                {
                    JArray jarray = key;
                    List<string> source = new List<string>();
                    foreach (var c in jarray)
                    {
                        source.Add(c.ToString());
                    }
					string connString = DBConfig.ConnectionString;
					using (MySqlConnection conn = new MySqlConnection(connString))
					{
						conn.Open();
						MySqlCommand comm = conn.CreateCommand();
						returnVal = sql.getDataSource(source, data, comm);
					}
                }
            }
            catch (Exception ex)
            {
				ErrLog.Log(ex);
                errors.Add(new { error = "数据库执行出错" });
            }
            if (errors.Count > 0)
            {
                return new { error=errors};
            }
            else
            {
                return returnVal;
            }
        }

        // GET: api/CommonSQL/5
        public string Get(int id)
        {
            return "value";
        }


        // PUT: api/CommonSQL/5
        public void Put(int id, [FromBody]string value)
        {
        } 

        // DELETE: api/CommonSQL/5
        public void Delete(int id)
        {
        }
    }
}
