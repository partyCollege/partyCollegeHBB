using CollegeAPP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using CollegeAPP.ServiceReference1;

namespace CollegeAPP.Controllers
{
    public class GinboxController : ApiController
    {
		public IEnumerable<G_INBOX> Get(int userid)
		{
			List<G_INBOX> ginboxlist = new List<G_INBOX>();
			G_INBOX g = new G_INBOX();
			g.USER_ID = userid.ToString();
			ginboxlist = g.getModule();
			return ginboxlist;
        }


        // POST: api/Ginbox
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Ginbox/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Ginbox/5
        public void Delete(int id)
        {
        }
    }
}
