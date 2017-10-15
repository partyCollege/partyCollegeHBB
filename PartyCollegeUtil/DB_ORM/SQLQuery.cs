using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PartyCollegeUtil.DB_ORM
{
    public static class SQLQueryMade
    {
        public static List<SQLQuery> list=new List<SQLQuery>(); 
        public static void clear()
        {
            list.Clear();
        }
        public static List<SQLQuery> Add(params SQLQuery[] query)
        {
            list.Clear();
            list.AddRange(query);
            return list;
        }
    }

    public enum Opertion
    {
        like = 0,
        equal = 1,
		notEqual,
        greater,
        greaterEqual,
        less,
        lessEqual,
        intem,
        /// <summary>
        /// 未定义，只做排序用
        /// </summary>
        NotDefinition

    }

    public enum OrderBy
    {
        /// <summary>
        /// 升序
        /// </summary>
        ASC=0,
        /// <summary>
        /// 降序
        /// </summary>
        DESC=1,
        /// <summary>
        /// 默认排序
        /// </summary>
        DEFAULT=2
    }
    public class SQLQuery
    {
        public SQLQuery(string columnName, Opertion op, object value)
        {
            this.columnName = columnName;
            this.Opertion = op;
            this.value = value;
            this.OrderBy = OrderBy.DEFAULT;
        }
        public SQLQuery(string columnName, Opertion op, object value,OrderBy orderBy)
        {
            this.columnName = columnName;
            this.Opertion = op;
            this.value = value;
            this.OrderBy = orderBy;
        }
        public SQLQuery(string columnName, OrderBy orderBy)
        {
            this.columnName = columnName;
            this.Opertion = Opertion.NotDefinition;
            this.value = null;
            this.OrderBy = orderBy;
        }
        private OrderBy orderBy;

        public OrderBy OrderBy
        {
            get { return orderBy; }
            set { orderBy = value; }
        }

        public string columnName;
        private Opertion op;

        public Opertion Opertion
        {
            set
            {
                switch (value)
                {
                    case Opertion.equal:
                        opertionS = "=";
                        break;
					case Opertion.notEqual:
						opertionS = "<>";
						break;
                    case Opertion.greater:
                        opertionS = ">";
                        break;
                    case Opertion.greaterEqual:
                        opertionS = ">=";
                        break;
                    case Opertion.less:
                        opertionS = "<";
                        break;
                    case Opertion.lessEqual:
                        opertionS = "<=";
                        break;
                    case Opertion.like:
                        opertionS = "like";
                        break;
                }
                op = value;
            }
            get { return op; }
        }

        public string opertionS;
        public object value;

    }
}
