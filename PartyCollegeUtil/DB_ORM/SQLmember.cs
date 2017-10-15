using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PartyCollegeUtil.DB_ORM
{
    public class SQLmember
    {
        private string columnName;

        public string ColumnName
        {
            set { columnName = value; }
            get { return columnName; }
        }

        public bool isKey;
        private Type mytype;

        public Type Mytype
        {
            set { mytype = value; }
            get { return mytype; }
        }
        public string LinkColumn
        {
            set;
            get;
        }
        public string LinkTable
        {
            set;
            get;
        }
        public LinkType linkType
        {
            set;
            get;
        }
        public string TargetColumn
        {
            set;
            get;
        }
    }
}
