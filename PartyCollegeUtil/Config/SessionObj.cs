using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Model
{
    [Serializable]
    /// <summary>
    /// session对象，返回给客户端的
    /// </summary>
    public class SessionObj
    {
        public object myEmpty(string key)
        {
            if (HttpContext.Current.Session[key] == null)
            {
                return "";
            }
            return HttpContext.Current.Session[key];
        }
        public static void SetSessionObj(string name, object val)
        {
            HttpContext.Current.Session[name] = val;
        }
        public static object GetSessionObj(string name)
        {
            return HttpContext.Current.Session[name];
        }
        public static void RemoveSessionObj(string name)
        {
            HttpContext.Current.Session.Remove(name);
        }
        public dynamic GetClientSession()
        {
            dynamic returnInfo = new ExpandoObject();

            if (accountId == null || accountId.ToString() == "")
            {
                returnInfo.code = "failed";
                returnInfo.message = "会话超时";
                return returnInfo;
            }

            returnInfo.code = "success";
            //returnInfo.domain = "html";
            returnInfo.accountId = accountId;
            //returnInfo.userid = userid;
            returnInfo.name = name;
            returnInfo.roleList = roleList;
            returnInfo.photopath = photoPath;
            returnInfo.photothumbpath = photoThumbPath;
            returnInfo.classId = classId;
            returnInfo.studentId = studentId;
            returnInfo.btnList = btnList;
            returnInfo.depremark = depremark;
            //returnInfo.branchcode = SyncConfig.PlatformCode;
            
            returnInfo.departmentId = departmentId;
            returnInfo.departmentName = departmentName;
            returnInfo.mdepartmentId = mDepartmentId;
            returnInfo.mdepartmentName = mDepartmentName;
			returnInfo.pids = pids;
            returnInfo.yearplan = yearplan;
            returnInfo.usertype = usertype;
			returnInfo.permissionDic = new Dictionary<string, ViewPermission>();

            if (permissionData != null && permissionData.Count > 0)
            {
                returnInfo.permissionDic = permissionData.Select(n => n.Value).ToList();
            }
			dynamic returnVal = new ExpandoObject();
			returnVal.loginUser = returnInfo;

			if (returnVal.loginUser.code == "success")
			{
				returnVal.code = "success";
				returnVal.message = "正常登录";
			}
			else
			{
				returnVal.code = "failed";
				returnVal.message = "会话超时";
			}
			return returnVal;
        }

        public object depremark
        {
            get { return myEmpty("depremark"); }
        }
        public object usertype
        {
            get { return myEmpty("usertype"); }
        }
        public object departmentId
        {
            get { return myEmpty("departmentId"); }
        }
        public object departmentName
        {
            get { return myEmpty("departmentName"); }
        }

        public object mDepartmentId
        {
            get { return myEmpty("mdepartmentId"); }
        }
        public object mDepartmentName
        {
            get { return myEmpty("mdepartmentName"); }
        }

		public object pids
		{
			get { return myEmpty("pids"); }
		}


        public YearPlan yearplan
        {
            get { return (YearPlan)myEmpty("yearplan"); }
        }

        public object userid
        {
            get { return myEmpty("userid"); }
        }

        public object accountId
        {
            get { return myEmpty("accountId"); }
        }
        public object name
        {
            get { return myEmpty("name"); }
        }
        public object logname
        {
            get { return myEmpty("logname"); }
        }


        public object photoPath
        {
            get { return myEmpty("photoPath"); }
        }
        public object photoThumbPath
        {
            get { return myEmpty("PhotoThumbPath"); }
        }
        public object classId
        {
            get { return myEmpty("classId"); }
        }

        public object studentId
        {
            get { return myEmpty("studentId"); }
        }

        public List<string> btnList
        {
            get { return (List<string>)HttpContext.Current.Session["btnList"]; }
        }
        public List<string> roleList
        {
            get { return (List<string>)HttpContext.Current.Session["roleList"]; }
        }
        public Dictionary<string, ViewPermission> permissionData
        {
            get { return (Dictionary<string, ViewPermission>)HttpContext.Current.Session["permissionDic"]; }
        }
    }

}