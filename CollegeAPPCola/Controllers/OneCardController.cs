using CollegeAPP.ServiceReference1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Http;

namespace CollegeAPP.Controllers
{
    public class OneCardController : ApiController
    {
        // GET: api/OneCard


        [HttpGet]
        [Route("api/OneCard/{onecard}")]
        public List<oneCard> Get(string onecard)
        {
            List<oneCard> objList = new List<oneCard>();
            //object obj = new object();
            try
            {
                ServiceReference1.UserWebServiceSoapClient cc = new UserWebServiceSoapClient();
                string returnVal = cc.GetConsumeByCardNo("shswdx", DateTime.Now.AddDays(-28).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "100", "", onecard);
                //string ddd=@"{"code":\"Right","msg":[{"LastAmount":"3865.11","NowAmount":"3833.21","UseDate":"2016-11-02 18:06:49","UseAmount":"31.90","UseUnit":"元","DeviceName":"教育超市扣款","TypeName":"POS机正常交易(金额)","LogicCardNo":"A10136"},{"LastAmount":"3891.11","NowAmount":"3865.11","UseDate":"2016-10-19 11:12:53","UseAmount":"26.00","UseUnit":"元","DeviceName":"中餐厅签单","TypeName":"签单消费(自助餐)","LogicCardNo":"A10136"},{"LastAmount":"3900.51","NowAmount":"3891.11","UseDate":"2016-10-14 18:52:23","UseAmount":"9.40","UseUnit":"元","DeviceName":"教育超市扣款","TypeName":"POS机正常交易(金额)","LogicCardNo":"A10136"},{"LastAmount":"3913.11","NowAmount":"3900.51","UseDate":"2016-10-14 11:26:34","UseAmount":"12.60","UseUnit":"元","DeviceName":"学员扣款机","TypeName":"POS机正常交易(金额)","LogicCardNo":"A10136"}]}";
                var ddd = (JObject)JsonConvert.DeserializeObject(returnVal);
                var retu = ddd.GetValue("msg");

                foreach (var c in retu)
                {
                    objList.Add(new oneCard {address=c["DeviceName"].ToString(), TypeName = c["TypeName"].ToString(), UseDate = Convert.ToDateTime(c["UseDate"]), NowAmount = Convert.ToDouble(c["NowAmount"].ToString()), UseAmount = Convert.ToDouble(c["UseAmount"].ToString()) });
                }
            }
            catch (Exception e)
            {

            }

            //testData
            //objList.Add(new oneCard { NowAmount = 123.32, TypeName = "教育超市扣款", UseDate = DateTime.Now, UseAmount = 16.2 });
            //objList.Add(new oneCard { NowAmount = 123.32, TypeName = "中餐厅签单", UseDate = DateTime.Now, UseAmount = 211.11 });
            //objList.Add(new oneCard { NowAmount = 123.32, TypeName = "签单消费(自助餐)", UseDate = DateTime.Now.AddDays(-1), UseAmount = 23.11 });
            return objList;
        }

        // POST: api/OneCard
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/OneCard/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/OneCard/5
        public void Delete(int id)
        {
        }
    }
    public class oneCard
    {
        public string TypeName { set; get; }
        public DateTime UseDate { set; get; }
        public double NowAmount { set; get; }
        public double UseAmount { set; get; }
        public string address { set; get; }

    }
}
