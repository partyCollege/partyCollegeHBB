using MySql.Data.MySqlClient;
using PartyCollegeUtil.Config;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Service
{
	public class DepartmentService
	{
		public dynamic GetDepartmentTree(dynamic postData){
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				string sql=string.Empty;
				dynamic root = new ExpandoObject();
				dynamic item = new ExpandoObject();
				sql="select id,pid,name,pids from sy_department where id=?id";
				MySqlCommand cmd = conn.CreateCommand();
				cmd.Parameters.Add(new MySqlParameter("id", postData.id.ToString()));
				cmd.CommandText = sql;
				string pids = string.Empty;
				string id = string.Empty;
				using (MySqlDataReader reader = cmd.ExecuteReader())
				{
					if (reader.Read())
					{
						pids = reader["pids"].ToString();
						id = reader["id"].ToString();
					}
				}

				cmd.Parameters.Clear();
				sql = "select id,pid,name,pids from sy_department where id in('" + pids.Replace(",", "','") + "') and status>=0 order by sort,id ";
				cmd.CommandText = sql;
				using (MySqlDataReader reader = cmd.ExecuteReader())
				{
					root.parents = new List<dynamic>();
					while (reader.Read())
					{
						//if (id != reader["id"].ToString())
						{
							item = new ExpandoObject();
							item.id = reader["id"].ToString();
							item.pid = reader["pid"].ToString();
							item.name = reader["name"].ToString();
							root.parents.Add(item);
						}
					}
				}

				sql = "select id,pid,name,(case when exists(select * from sy_department b where b.pid=a.id) then 1 else 0 end) as isleaf from sy_department a where pid=?pid  and status>=0 order by sort,id ";
				cmd.Parameters.Clear();
				cmd.CommandText = sql;
				cmd.Parameters.Add(new MySqlParameter("pid", postData.id.ToString()));
				using (MySqlDataReader reader = cmd.ExecuteReader())
				{
					root.children = new List<dynamic>();
					while (reader.Read())
					{
						item = new ExpandoObject();
						item.id = reader["id"].ToString();
						item.pid = reader["pid"].ToString();
						item.name = reader["name"].ToString();
						if (reader["isleaf"].ToString() == "1")
						{
							item.isLeaf = false;
						}
						else
						{
							item.isLeaf = true;
						}
						root.children.Add(item);
					}
				}
				return root;
			}
		}
	}
}
