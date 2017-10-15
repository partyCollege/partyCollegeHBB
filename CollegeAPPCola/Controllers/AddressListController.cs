using CollegeAPP.DataModel;
using CollegeAPP.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class AddressListController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/AddressList
        [HttpGet]
        [Route("api/AddressList/action/getList/{maindept}")]
        public IEnumerable<DataGUser> getList(string maindept)
        {
            List<DataGUser> listDataUsers = new List<DataGUser>();
            List<G_USERS> listUsers = new List<G_USERS>();
            G_USERS g = new G_USERS();
            listUsers = g.getGUserDepartInfo(maindept);
            int length = listUsers.Count;
            DataGUser dguser = null;
            for (int i = 0; i < length; i++)
            {
                G_USERS guser = listUsers[i];
                dguser = new DataGUser();
                dguser.id = guser.id;
                dguser.name = guser.uname;
                dguser.mobileNumber = guser.mobile_email;
                dguser.department = guser.department;
                dguser.py = UtilTools.GetFirstChinessPY(guser.uname.Trim().Substring(0, 1));
                listDataUsers.Add(dguser);
            }
            return listDataUsers;
        }

        // GET: api/AddressList/5
        public G_USERS Get(string id)
        {
            G_USERS g = new G_USERS();
            g = g.getOne(id);
            return g;
        }
        [HttpGet]
        [Route("api/AddressList/action/GetStudentList/{bcid}")]
        public IEnumerable<object> GetStudentList(string bcid)
        {
            IEnumerable<object> returnList;
            Student stu = new Student();
            returnList= stu.getStudentList(bcid);
            return returnList;
        }
        [HttpGet]
        [Route("api/AddressList/action/GetImg/{id}")]
        public HttpResponseMessage GetImg(string id)
        {
            G_USERS u = new G_USERS();
            byte[] imgByte = u.getimg(id);

            MemoryStream imgStream = new MemoryStream(imgByte);
            Image img = Image.FromStream(imgStream);
            MemoryStream ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(ms.ToArray());
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            return result;
        }
        [HttpGet]
        [Route("api/AddressList/action/GetImgUrl/{id}")]
        public string GetImgUrl(string id)
        {
            G_USERS u = new G_USERS();
            string path = u.getimgUrl(id);
            return path;
        }
        // POST: api/AddressList
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/AddressList/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/AddressList/5
        public void Delete(int id)
        {
        }
    }
}
