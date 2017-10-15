using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web.Http;
using System.Text;
using SmsLib;
using System.Web;
using System.Data;
using MySql.Data.MySqlClient;
using System.IO;
using PartyCollegeUtil.Service;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Tools;

namespace CollegeAPP.Controllers
{
    public class SMSController : ApiController
    {
        [Route("api/getSMSCode")]
        [HttpPost]
        public dynamic verifySMSCode([FromBody]dynamic formModel)
        {
            //即将启用代码
            SmsService smsSrv = new SmsService();
            return smsSrv.SendSmsMessage(formModel);
        }

        [Route("api/sendClassSMS")]
        [HttpPost]
        public dynamic sendClassSMS([FromBody]dynamic formModel)
        {
            //即将启用代码
            SmsService smsSrv = new SmsService();
            return smsSrv.sendClassSMS(formModel);
        }

        public DataTable getStudentPhoneData(string sql, List<MySqlParameter> paramCollection)
        {
            DataTable dt = new DataTable();
            MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString);
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddRange(paramCollection.ToArray());
                MySqlDataAdapter adpt = new MySqlDataAdapter(cmd);
                adpt.Fill(dt);
            }
            catch (Exception ex)
            {
                ErrLog.Log(sql + ex);
            }
            finally
            {
                conn.Close();
            }
            return dt;
        }
        // POST: api/SMS
        public string Post(SMSContent content)
        {
            return content.sendSMS();
        }
    }
}
