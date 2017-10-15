
using PartyCollegeUtil.Service.uploadFile;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class uploadAvatarController : ApiController
    {
        // GET: api/uploadAvatar
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/uploadAvatar/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/uploadAvatar
        [Route("api/uploadAvatar/{upcategory}")]
        [HttpPost]
        public dynamic Post(string upcategory)
        {
            uploadfileService uploadfileservice = new uploadfileService();
            return uploadfileservice.uploadAvatar(upcategory);
        }

        // PUT: api/uploadAvatar/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/uploadAvatar/5
        public void Delete(int id)
        {
        }
    }
}
