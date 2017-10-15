using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Service.uploadFile;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class uploadfileController : ApiController
    {
        // GET: api/uploadfile
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [Route("api/uploadfile/{category}/{fileServername}/{filename}")]
        [HttpGet]
        public HttpResponseMessage Get(string category, string fileServername, string filename)
        {
            uploadfileService uploadfileservice = new uploadfileService();
            return uploadfileservice.Get(category, fileServername, filename);
        }


        public HttpResponseMessage Post()
        {
            // Check if the request contains multipart/form-data.
            // 检查该请求是否含有multipart/form-data
            List<object> returnObjs = new List<object>();
            dynamic returnVal = returnObjs;
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            uploadfileService uploadfileservice = new uploadfileService();
            return uploadfileservice.Post();
            
        }

        // PUT: api/uploadfile/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/uploadfile/5
        public void Delete(int id)
        {
        }
    }
}
