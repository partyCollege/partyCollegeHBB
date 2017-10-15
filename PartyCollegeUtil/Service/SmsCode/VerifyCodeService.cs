using PartyCollegeUtil.Tools;
using System.Dynamic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class VerifyCodeService
    {
        public HttpResponseMessage VerifyCode(string key)
        {
            var validateCodeType = new ValidateCode_Style9();
            string code = "6666";
            validateCodeType.ImageHeight = 40;
            byte[] bytes = validateCodeType.CreateImage(out code);
            HttpContext.Current.Session[key] = code;
            var resp = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
                //或者  
                //Content = new StreamContent(stream)  
            };
            resp.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpg");
            return resp;
        }

        public dynamic VerifySMSCode(dynamic loginModel)
        {
            dynamic returnInfo = new ExpandoObject();
            string code = "";
            string keyname = string.Empty;
            keyname = loginModel.keyname;
            //HttpContext.Current.Session["VerifyCode"] = code;
            if (HttpContext.Current.Session[keyname] != null)
            {
                code = HttpContext.Current.Session[keyname].ToString();
            }
            string clientcode = loginModel.smscode;
            if (clientcode == code)
            {
                //HttpContext.Current.Session.Remove(keyname);
                returnInfo.code = "success";
                returnInfo.message = "验证通过";
            }
            else
            {
                returnInfo.code = "failed";
                returnInfo.message = "验证码错误";
            }
            return returnInfo;
        }
    }

}
