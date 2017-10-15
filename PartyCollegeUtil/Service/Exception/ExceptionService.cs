using PartyCollegeUtil.Model.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace PartyCollegeUtil.Service
{
    public class ExceptionService
    {
        public static void WriteException(Exception exp)
        {
            dynamic dynModel = new System.Dynamic.ExpandoObject();
            System.Diagnostics.StackTrace trace = new System.Diagnostics.StackTrace(exp, true);
            if (trace.FrameCount > 0)
            {
                dynModel.errorline = trace.GetFrame(0).GetFileLineNumber();
                dynModel.methodname = trace.GetFrame(0).GetMethod().Name;
                dynModel.filename = System.IO.Path.GetFileName(trace.GetFrame(0).GetFileName());
            }
            dynModel.errorlevel = "1";
            dynModel.message = exp.Message;
            dynModel.msginfo = exp.ToString();
            dynModel.studentid = HttpContext.Current != null ? Convert.ToString(HttpContext.Current.Session["studentid"]) : "";
            dynModel.arguments = "";

            CacheLog.ExcuteDBLog(dynModel);
        }


    }
}
