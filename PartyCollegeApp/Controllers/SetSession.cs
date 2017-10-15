using CollegeAPP.Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class SetSessionController : ApiController
    {
        
        // POST: api/Calendar
        public void Post([FromBody]JObject jobj)
        {
            foreach (var attr in jobj)
            {
                try
                {
                    string val = attr.Value.ToString();
                    HttpContext.Current.Session[attr.Key] = val;
                }
                catch (Exception e)
                {
                    continue;
                }

            }
            string obj = "";
        }

        // PUT: api/Calendar/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Calendar/5
        public void Delete(int id)
        {
        }
    }
}
