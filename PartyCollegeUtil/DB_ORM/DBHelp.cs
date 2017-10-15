using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using System.Data.OleDb;
using MySql.Data.MySqlClient;

namespace PartyCollegeUtil.DB_ORM
{
    public static class DBHelp
    {
        /// <summary>
        /// 带检索条件查询
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conn"></param>
        /// <param name="query"></param>
        /// <param name="needOtrColumn">是否需要额外的列</param>
        /// <returns></returns>
		public static List<T> Query<T>(MySqlConnection conn, List<SQLQuery> query, bool needOtrColumn)
        {
            List<T> t = new List<T>();
            Type newtype = typeof(T);
            T newobj = (T)Assembly.GetAssembly(newtype).CreateInstance(newtype.FullName);
			MethodInfo pinfo = newtype.GetMethod("get", BindingFlags.Public | BindingFlags.Instance, null, new Type[] { typeof(MySqlConnection), typeof(List<SQLQuery>), typeof(bool) }, null);
            List<object> param = new List<object>();
            param.Add(conn);
            param.Add(query);
            param.Add(needOtrColumn);
            t= (List<T>)pinfo.MakeGenericMethod(new Type[] { typeof(T) }).Invoke(newobj,param.ToArray());
            return t;
        }
        /// <summary>
        /// 查询
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conn"></param>
        /// <param name="needOtrColumn">是否需要额外的列</param>
        /// <returns></returns>
		public static List<T> Query<T>(MySqlConnection conn, bool needOtrColumn)
        {
            List<T> t = new List<T>();
            Type newtype = typeof(T);
            T newobj = (T)Assembly.GetAssembly(newtype).CreateInstance(newtype.FullName);
			MethodInfo pinfo = newtype.GetMethod("get", BindingFlags.Public | BindingFlags.Instance, null, new Type[] { typeof(MySqlConnection), typeof(bool) }, null);
            List<object> param = new List<object>();
            param.Add(conn);
            param.Add(needOtrColumn);
            t = (List<T>)pinfo.MakeGenericMethod(new Type[] { typeof(T) }).Invoke(newobj, param.ToArray());
            return t;
        }
        /// <summary>
        /// 获取一个对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conn"></param>
        /// <param name="query"></param>
        /// <param name="needOtrColumn">是否需要额外的列</param>
        /// <returns></returns>
		public static T QueryOne<T>(MySqlConnection conn, List<SQLQuery> query, bool needOtrColumn)
        {
            Type newtype = typeof(T);
            T newobj = (T)Assembly.GetAssembly(newtype).CreateInstance(newtype.FullName);
			MethodInfo pinfo = newtype.GetMethod("getOne", BindingFlags.Public | BindingFlags.Instance, null, new Type[] { typeof(MySqlConnection), typeof(List<SQLQuery>), typeof(bool) }, null);
            List<object> param = new List<object>();
            param.Add(conn);
            param.Add(query);
            param.Add(needOtrColumn);
            newobj = (T)pinfo.MakeGenericMethod(new Type[] { typeof(T) }).Invoke(newobj, param.ToArray());
            return newobj;
            
        }
    }
}