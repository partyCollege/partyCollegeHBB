using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Reflection;

namespace PartyCollegeUtil.DB_ORM
{
    public static class OtherColumnExtion
    {
        /// <summary>
        /// 根据列名获取不在实体中的列
        /// </summary>
        /// <param name="list"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        public static OtherColumn getColumn(this List<OtherColumn> list, string columnName)
        {
            return list.Find(delegate(OtherColumn c)
            {
                return c.ColumnName == columnName;
            });
        }
        /// <summary>
        /// 根据列名获取不在实体中的列
        /// </summary>
        /// <param name="list"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        public static T  getValue<T>(this List<OtherColumn> list, string columnName)
        {
            OtherColumn otherColumn= list.Find(delegate(OtherColumn c)
            {
                return c.ColumnName == columnName;
            });
            T newobj;
            newobj =(T) otherColumn.Value;
            return newobj;
        }
    }
    public class OtherColumn
    {
        private string columnName;

        public string ColumnName
        {
            get { return columnName; }
            set { columnName = value; }
        }
        private DbType dbType;

        public DbType DbType
        {
            get { return dbType; }
            set { dbType = value; }
        }
        private object value;

        public object Value
        {
            get { return this.value; }
            set { this.value = value; }
        }
    }
}
