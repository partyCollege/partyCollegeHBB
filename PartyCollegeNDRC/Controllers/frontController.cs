using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Dynamic;
using System.Net.Http.Headers;
using MySql.Data.MySqlClient;
using System.Text;
using System.Data;
using PartyCollegeUtil.Service.Class;

namespace PartyCollege.Controllers
{
    public class frontController : ApiController
    {

        /// <summary>
        /// 获取学员通讯录
        /// </summary>
        /// <param name="queryModel"></param>
        /// <returns></returns>
        [Route("api/GetStudentContacts")]
        [HttpPost]
        public dynamic GetStudentContacts([FromBody]dynamic queryModel)
        {
            classService classervice = new classService();
            return classervice.GetStudentContacts(queryModel);
        }



    }
}