using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace PartyCollege
{
    public class WebApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            try
            {
                Exception exp = actionExecutedContext.Exception.InnerException != null ? actionExecutedContext.Exception.InnerException : actionExecutedContext.Exception;
                if (exp is OperationCanceledException) return;
                WriteException(actionExecutedContext, exp);
                HttpResponseMessage msg = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("An unhandled exception"),
                    ReasonPhrase = "An unhandled exception" 
                };
                actionExecutedContext.Response = msg;

            }
            catch (Exception ex)
            {
                ErrLog.Log("日志异常：" + ex);
            }

        }
        public static void WriteException(HttpActionExecutedContext actionExecutedContext, Exception exp)
        {
            dynamic dynModel = new System.Dynamic.ExpandoObject();
            System.Diagnostics.StackTrace trace = new System.Diagnostics.StackTrace(exp, true);
            if (trace.FrameCount > 0)
            {
                dynModel.errorline = trace.GetFrame(0).GetFileLineNumber();
            }
            dynModel.methodname = actionExecutedContext.ActionContext.ControllerContext.ControllerDescriptor.ControllerName;
            dynModel.filename = actionExecutedContext.ActionContext.ControllerContext.Controller.ToString();
            dynModel.message = exp.Message;
            dynModel.msginfo = exp.ToString();
            dynModel.studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);
            dynModel.errorlevel = "1";

            var arr = actionExecutedContext.ActionContext.ActionArguments.ToArray();
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            for (int i = 0; i < arr.Length; i++)
            {
                sb.Append("[" + i.ToString() + "]--" + arr[i].ToString() + ";");
            }
            dynModel.arguments = sb.ToString();

            PartyCollegeUtil.Model.Cache.CacheLog.ExcuteDBLog(dynModel);
        }


        //public static void WriteException(Exception exp)
        //{
        //    dynamic dynModel = new System.Dynamic.ExpandoObject();
        //    System.Diagnostics.StackTrace trace = new System.Diagnostics.StackTrace(exp, true);
        //    if (trace.FrameCount > 0)
        //    {
        //        dynModel.errorline = trace.GetFrame(0).GetFileLineNumber();
        //        dynModel.methodname = trace.GetFrame(0).GetMethod().Name;
        //        dynModel.filename = System.IO.Path.GetFileName(trace.GetFrame(0).GetFileName());
        //    }
        //    dynModel.errorlevel = "1";
        //    dynModel.message = exp.Message;
        //    dynModel.msginfo = exp.ToString();
        //    dynModel.studentid = Convert.ToString(HttpContext.Current.Session["studentid"]);
        //    dynModel.arguments = "";

        //    PartyCollege.Model.Cache.CacheLog.ExcuteDBLog(dynModel);
        //}


    }
}
