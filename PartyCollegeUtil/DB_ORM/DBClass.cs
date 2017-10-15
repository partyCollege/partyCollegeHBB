using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Data.SqlClient;
using System.Data.OleDb;
using PartyCollegeUtil.Tools;
using MySql.Data.MySqlClient;

namespace PartyCollegeUtil.DB_ORM
{
    public class DbClass
    {
        public DbClass()
        {

            Type ty = this.GetType();
            foreach (var propertyInfo in ty.GetProperties())
            {
                foreach (var att in propertyInfo.GetCustomAttributes(typeof(MyAttribute), false))
                {
                    MyAttribute mya = att as MyAttribute;
                    if (mya.FromSQL)
                    {
                        SQLmember m = new SQLmember();
                        m.ColumnName = propertyInfo.Name;
                        m.Mytype = propertyInfo.PropertyType;
                        m.isKey = mya.IsKey;
                        m.LinkColumn = mya.LinkColumn;
                        m.LinkTable = mya.LinkTable;
                        m.linkType = mya.linkType;
                        m.TargetColumn = mya.TargetColumn;
                        members.Add(m);
                    }
                }
            }
        }
        private List<SQLmember> members = new List<SQLmember>();

        private List<OtherColumn> otherColumns = new List<OtherColumn>();
        public List<OtherColumn> OtherColumns
        {
            set { otherColumns = value; }
            get { return otherColumns; }
        }
        private string tableName
        {
            get
            {
                string returnVal = string.Empty;
                Type g = this.GetType();
                foreach (var mycu in g.GetCustomAttributes(false))
                {

                    if (mycu.GetType() == typeof(MyAttribute))
                    {
                        MyAttribute myuaa = mycu as MyAttribute;
                        returnVal = myuaa.TableName.ToLower();
                    }
                }
                return returnVal;
            }
        }

        /// <summary>
        /// 获取单个对象
        /// </summary>
        /// <typeparam name="T">传入对象类型</typeparam>
        /// <param name="query">使用SQLQueryMade.Add()传入查询条件</param>
        /// <returns></returns>
		public T getOne<T>(MySqlConnection conn, List<SQLQuery> query, bool needOtrColumn)
        {
            Type d = this.GetType();
            List<T> list = this.get<T>(conn, query, needOtrColumn);
            if (list.Count > 0)
            {
                return list[0];
            }
            else
            {
                T newobj = (T)Assembly.GetAssembly(d).CreateInstance(d.FullName);
                return newobj;
            }
        }
        /// <summary>
        /// 根据传入对象获取整表数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public List<T> get<T>(MySqlConnection conn, bool needOtrColumn)
        {
            return get<T>(conn, new List<SQLQuery>(), needOtrColumn);
        }
        public List<T> get<T>(MySqlConnection conn, List<SQLQuery> query, bool needOtrColumn)
        {
            SQLmember keyM = members.Find(delegate(SQLmember m)
            {
                return m.isKey == true;
            });
            string selectsColumn = string.Empty;
            foreach (var c in members)
            {
                if (!string.IsNullOrEmpty(c.TargetColumn) && c.linkType == LinkType.oneToOne)
                {
                    selectsColumn += c.LinkTable + "." + c.TargetColumn + " as " + c.TargetColumn + ",";
                }
                else
                {
                    selectsColumn += tableName + "." + c.ColumnName + ",";
                }
            }
            selectsColumn = selectsColumn.Trim(",".ToCharArray());
            if (needOtrColumn)
            {
                selectsColumn = " * ";
            }

            List<T> returnVal = new List<T>();
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
			MySqlCommand comm = conn.CreateCommand();
			comm.CommandText = "select " + selectsColumn.ToLower() + " from " + tableName.ToLower();
            List<SQLmember> linkColumn = members.FindAll(delegate(SQLmember memb)
            {
                return memb.linkType == LinkType.oneToOne;
            });
            foreach (var c in linkColumn)
            {
				comm.CommandText += " inner join " + c.LinkTable.ToLower() + " on " + tableName.ToLower() + "." + keyM.ColumnName.ToLower() + "=" + c.LinkTable.ToLower() + "." + c.LinkColumn.ToLower();
            }
            AddPar(comm, query);
			comm.CommandText += getOrderBySQL(query).ToLower();
			MySqlDataAdapter oda = new MySqlDataAdapter(comm);
            DataTable dt = new DataTable();
			try
			{
				oda.Fill(dt);
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex+"\n"+comm.CommandText);
			}
            Type d = typeof(T);

            foreach (DataRow dataRow in dt.Rows)
            {
                T newobj = (T)Assembly.GetAssembly(d).CreateInstance(d.FullName);
                foreach (SQLmember m in members)
                {
                    PropertyInfo pinfo = d.GetProperty(m.ColumnName);
                    SetDataRowValue(pinfo, newobj, dataRow, m);

                }
                SetOtherColumnData(d, newobj, dataRow, dt);
                returnVal.Add(newobj);
            }
            return returnVal;
        }

        private string getOrderBySQL(List<SQLQuery> queryList)
        {
            string returnVal = string.Empty;
            List<SQLQuery> list = queryList.FindAll(delegate(SQLQuery query)
            {
                return query.OrderBy != OrderBy.DEFAULT;
            });
            if (list.Count > 0)
            {
                returnVal += " order by ";
                foreach (var c in list)
                {
                    switch (c.OrderBy)
                    {
                        case OrderBy.ASC:
                            returnVal += c.columnName + " asc,";
                            break;
                        case OrderBy.DESC:
                            returnVal += c.columnName + " desc,";
                            break;
                    }
                }
            }
            returnVal = returnVal.Trim(",".ToCharArray());
            return returnVal;
        }

        private void SetOtherColumnData(Type objectType, object T, DataRow dr, DataTable dt)
        {
            PropertyInfo pinfo = objectType.GetProperty("OtherColumns");
            List<OtherColumn> otherList = new List<OtherColumn>();
            foreach (DataColumn dc in dt.Columns)
            {
                OtherColumn oc = new OtherColumn();
                oc.ColumnName = dc.ColumnName;
                oc.Value = dr[dc.ColumnName];
                otherList.Add(oc);
            }
            pinfo.SetValue(T, otherList, null);
        }

        private void SetDataRowValue(PropertyInfo pinfo, object T, DataRow dr, SQLmember m)
        {
            switch (pinfo.PropertyType.Name)
            {
                case "String":
                    pinfo.SetValue(T, dr[m.ColumnName].ToString(), null);
                    break;
                case "Int32":
					if (dr[m.ColumnName] == DBNull.Value)
					{
						pinfo.SetValue(T, 0, null);
					}
					else
					{
						pinfo.SetValue(T, Convert.ToInt32(dr[m.ColumnName]), null);
					}
                    break;
                case "DateTime":
                    if (dr[m.ColumnName] != DBNull.Value)
                    {
                        pinfo.SetValue(T, Convert.ToDateTime(dr[m.ColumnName]), null);
                    }
                    break;
            }
            if (pinfo.PropertyType.AssemblyQualifiedName.ToLower().IndexOf("nullable") > -1 && pinfo.PropertyType.AssemblyQualifiedName.ToLower().IndexOf("datetime") > -1)
            {
                if (dr[m.ColumnName] != DBNull.Value)
                {
                    pinfo.SetValue(T, Convert.ToDateTime(dr[m.ColumnName]), null);
                }
            }
        }
        private void AddPar(MySqlCommand comm, List<SQLQuery> query)
        {
            List<SQLQuery> onlyOrderByList = query.FindAll(delegate(SQLQuery q)
            {
                return q.OrderBy != OrderBy.DEFAULT && q.Opertion == Opertion.NotDefinition;
            });
            if (onlyOrderByList.Count == query.Count)
            {
                return;
            }
            string opertionS = string.Empty;
            comm.CommandText += " where ";
            foreach (var q in query)
            {
                if (q.Opertion == Opertion.NotDefinition)
                {
                    continue;
                }
                if (q.Opertion == Opertion.intem)
                {
                    if (!string.IsNullOrEmpty(q.value.ToString()))
                    {
						comm.CommandText += q.columnName.ToLower() + " in (" + q.value + ") and";
                    }
                }
                else
                {
					comm.CommandText += q.columnName.ToLower() + q.opertionS + "?" + q.columnName.ToLower() + " and ";
					comm.Parameters.Add(new MySqlParameter(q.columnName.ToLower(), q.value));
                }
                
            }
			//comm.CommandText = comm.CommandText.Trim("and ".ToCharArray()).ToLower();//致命错误 trim 导致sql出错
			int location=comm.CommandText.LastIndexOf("and");
			comm.CommandText = comm.CommandText.Substring(0, location);
            if (comm.CommandText.EndsWith(" where"))
            {
				comm.CommandText = comm.CommandText.Replace(" where", string.Empty).ToLower();
            }
        }


        public void update(MySqlConnection conn, MySqlTransaction tran, List<SQLQuery> queryList)
        {
            string sql = string.Empty;
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            Type ty = this.GetType();
            MySqlCommand comm = conn.CreateCommand();
            if (tran != null)
            {
                comm.Transaction = tran;
            }
            comm.CommandText = "update " + tableName.ToLower() + " set ";
            StringBuilder sb = new StringBuilder();
            List<string> columns = new List<string>();

            members = members.FindAll(delegate(SQLmember sm)
            {
                return sm.linkType != LinkType.oneToOne;
            });
            int num = 0;
            for (int i = 0; i < members.Count; i++)
            {
                if (members[i].isKey)
                {
                    continue;
                }
                //if (num == members.Count - 2)
                //{
                //    sb.Append(members[i].ColumnName);
                //    sb.Append("=");
                //    sb.Append("?");
                //}
                //else
                //{
                //    sb.Append(members[i].ColumnName);
                //    sb.Append("=");
                //    sb.Append("?,");
                //}
				columns.Add(members[i].ColumnName.ToLower());
                MySqlParameter p = new MySqlParameter();
                p.ParameterName = members[i].ColumnName.ToLower();
                PropertyInfo pinfo = ty.GetProperty(members[i].ColumnName);
                p.Value = pinfo.GetValue(this, null);
                comm.Parameters.Add(p);

                num++;
            }
            //跟新额外列，既不在实体列中的列
            if (this.OtherColumns.Count > 0)
            {
                foreach (var c in OtherColumns)
                {
                    if (!members.Exists(delegate(SQLmember mem)
                    {
						return mem.ColumnName.ToLower() == c.ColumnName.ToLower();
                    }))
                    {
                        //sb.Append(c.ColumnName);
                        //sb.Append("=");
                        //sb.Append("?,");
                        columns.Add(c.ColumnName.ToLower());
                        MySqlParameter p = new MySqlParameter();
                        p.ParameterName = c.ColumnName.ToLower();
                        p.Value = c.Value;
                    }
                }
            }
            foreach (var c in columns)
            {
				comm.CommandText += " " + c + "=?" + c + ",";
            }
            comm.CommandText = comm.CommandText.Trim(",".ToCharArray());
            SQLmember keyM = members.Find(delegate(SQLmember m)
            {
                return m.isKey == true;
            });
            if (keyM == null)
            {
                throw new Exception("该实体类尚未定义主键");
            }
            if (queryList.Count == 0)
            {
				sb.Append(" where " + keyM.ColumnName.ToLower() + "=?" + keyM.ColumnName.ToLower());
                MySqlParameter pKey = new MySqlParameter();
				pKey.ParameterName = keyM.ColumnName.ToLower();
                PropertyInfo pinfoKey = ty.GetProperty(keyM.ColumnName);
                pKey.Value = pinfoKey.GetValue(this, null);
                comm.Parameters.Add(pKey);
				comm.CommandText += sb.ToString().ToLower();
            }
            else
            {
				comm.CommandText += sb.ToString().ToLower();
                AddPar(comm, queryList);
            }
            comm.ExecuteNonQuery();
        }

        /// <summary>
        /// 跟新单个实例
        /// </summary>
        /// <param name="conn"></param>
        public void update(MySqlConnection conn)
        {
            update(conn, null, new List<SQLQuery>());
        }

        public void update(MySqlConnection conn, List<SQLQuery> list)
        {
            update(conn, null, list);
        }
        public void update(MySqlConnection conn, MySqlTransaction tran)
        {
            update(conn, tran, new List<SQLQuery>());
        }
        public void deletebyTran(MySqlConnection conn, MySqlTransaction tran)
        {
            SQLmember keyM = members.Find(delegate(SQLmember m)
            {
                return m.isKey == true;
            });
            Type ty = this.GetType();
            PropertyInfo pinfo = ty.GetProperty(keyM.ColumnName);
            MySqlCommand comm = conn.CreateCommand();
            if (tran != null)
            {
                comm.Transaction = tran;
            }
            if (pinfo.GetValue(this, null) != null)
            {
				comm.CommandText = "delete from " + tableName.ToLower() + " where " + keyM.ColumnName.ToLower() + "=?" + keyM.ColumnName.ToLower();//:" + keyM.ColumnName + "
				comm.Parameters.Add(new MySqlParameter(keyM.ColumnName.ToLower(), pinfo.GetValue(this, null).ToString()));
                comm.ExecuteNonQuery();
            }
        }
        public void delete(MySqlConnection conn)
        {
            deletebyTran(conn, null);
        }
        public void delete(MySqlConnection conn, List<SQLQuery> query)
        {
            delete(conn, null, query);
        }
        public void delete(MySqlConnection conn, MySqlTransaction tran, List<SQLQuery> query)
        {
            StringBuilder sb = new StringBuilder();
            using (MySqlCommand comm = conn.CreateCommand())
            {
                if (tran != null)
                {
                    comm.Transaction = tran;
                }
				sb.Append("delete from " + tableName.ToLower() + " ");
                if (query.Count > 0)
                {
                    sb.Append(" where");
                    int rownum = 0;
					string fieldname = string.Empty;
                    for (int i = 0; i < query.Count; i++)
					{
						fieldname = query[i].columnName.ToLower();
                        if (rownum == query.Count - 1)
                        {
							sb.Append(" " + fieldname + query[i].opertionS + "?" + fieldname);//+ query[i].columnName
                        }
                        else
                        {
							sb.Append(" " + fieldname + query[i].opertionS + "?" + fieldname + " and ");// + query[i].columnName
                        }
						comm.Parameters.Add(new MySqlParameter(fieldname, query[i].value));
                        rownum++;
                    }
                }
                string sql = sb.ToString();

				comm.CommandText = sql.ToLower();
                comm.ExecuteNonQuery();
            }
        }
        public void insert(MySqlConnection conn)
        {
            insert(conn, null);
        }
        public void insert(MySqlConnection conn, MySqlTransaction tran)
        {
            string sql = string.Empty;
			string fieldname = string.Empty;
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            Type ty = this.GetType();
            using (MySqlCommand comm = conn.CreateCommand())
            {
                if (tran != null)
                {
                    comm.Transaction = tran;
                }
				comm.CommandText = "insert into " + tableName.ToLower() + "";
                StringBuilder sb = new StringBuilder();
                sb.Append("(");
                int num = 0;

                members = members.FindAll(delegate(SQLmember sm)
                {
                    return sm.linkType != LinkType.oneToOne;
                });
                for (int i = 0; i < members.Count; i++)
                {
					fieldname = members[i].ColumnName.ToLower();
                    if (num == members.Count - 1)
                    {
						sb.Append(fieldname);
                    }
                    else
                    {
						sb.Append(fieldname + ",");
                    }
                    num++;
                }
                sb.Append(")");
                num = 0;
                sb.Append(" values (");
				
                for (int i = 0; i < members.Count; i++)
                {
					fieldname = members[i].ColumnName.ToLower();
                    if (num == members.Count - 1)
                    {
						sb.Append("?" + fieldname);
                    }
                    else
                    {
						sb.Append("?" + fieldname + ",");
                    }
                    MySqlParameter p = new MySqlParameter();
					p.ParameterName = fieldname;
                    string b = string.Empty;
                    PropertyInfo pinfo = ty.GetProperty(members[i].ColumnName);
                    p.Value = pinfo.GetValue(this, null);
                    comm.Parameters.Add(p);
                    num++;
                }
                sb.Append(")");
                sql = sb.ToString();
                comm.CommandText += sql.ToLower();
                comm.ExecuteNonQuery();
            }
        }

    }
}
