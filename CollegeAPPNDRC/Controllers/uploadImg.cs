using CollegeAPP.DataModel;
using CollegeAPP.Model;
using Newtonsoft.Json.Linq;
using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.Containers;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace CollegeAPP.Controllers
{

    public class uploadImgController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
        public string Get()
        {
            //using (Presentation pres = new Presentation("C:\\abc.pptx"))
            //{

            //    //Saving the PPTX presentation to PPTX format
            //    pres.Save("D:\\abc.pdf", SaveFormat.Pdf);
            //}
            return "123";
        }
        public string Post([FromBody]JObject json)
        {
            dynamic dm = json;
            var key = dm.file;
            byte[] arr = Convert.FromBase64String(key.Value);
            MemoryStream ms = new MemoryStream(arr);
            Bitmap bmp = new Bitmap(ms);
            string dic = HttpContext.Current.Server.MapPath("~/formImg");
            if (!Directory.Exists(dic))
            {
                Directory.CreateDirectory(dic);
            }
            string filename = Guid.NewGuid().ToString() + ".png";
            string filepath = dic + "/" + filename;
            bmp.Save(filepath);
            return filename;

        }
        [HttpPost]
        [Route("api/tzggUploadImg")]
        public bool tzggUploadImg([FromBody]JObject json)
        {

            string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            MemoryStream ms = new MemoryStream();
            MediaApi.Get(token, json.GetValue("serverid").ToString(), ms);
            System.Drawing.Image img1 = System.Drawing.Image.FromStream(ms);
            string path = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + @"\img\tzgg\";
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            img1.Save(path + json.GetValue("ggid").ToString() + ".jpg");
            return true;
        }
        
    }
}
