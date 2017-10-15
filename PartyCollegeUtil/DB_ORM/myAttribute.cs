using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PartyCollegeUtil.DB_ORM
{
    /// <summary>
    /// 链接属性，目前支持1对1
    /// </summary>
    public enum LinkType
    {
        None,
        oneToOne
    }

    public class MyAttribute : System.Attribute
    {

        string tableName;

        public string TableName
        {
            set { tableName = value; }
            get { return tableName; }
        }

        public MyAttribute(string tableName)
        {
            this.tableName = tableName;
        }

        public MyAttribute()
        {

        }
        /// <summary>
        /// 是否是主键
        /// </summary>
        public bool IsKey;
        /// <summary>
        /// 是否和数据库绑定
        /// </summary>
        public bool FromSQL;
        /// <summary>
        /// 级联的表名
        /// </summary>
        public string LinkTable;
        /// <summary>
        /// 级联的列，用目前表的主键进行级联
        /// </summary>
        public string LinkColumn;
        /// <summary>
        /// 该字段对应目标表的字段
        /// </summary>
        public string TargetColumn;
        /// <summary>
        /// 链接类型
        /// </summary>
        public LinkType linkType;
    }
}

