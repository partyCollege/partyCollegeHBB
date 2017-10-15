using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Service
{
	public class CommonSqlService
	{
		public dynamic GetPostData(dynamic json) {
			try
			{
				List<dynamic> errors = new List<dynamic>();
				List<dynamic> returnVal = new List<dynamic>();
				dynamic dm = json;
				var key = dm.key;
				JObject postData = dm.postData;
				JObject pageInfo = dm.pageInfo;
				JObject search = dm.search;
				JArray orderBy = dm.orderBy;
				JObject connectionKey = dm.connectionKey;//特殊情况下使用
				Dictionary<string, object> data = new Dictionary<string, object>();
				try
				{
					foreach (var c in postData)
					{
						data.Add(c.Key, c.Value.ToObject(typeof(object)));
					}
				}
				catch (Exception ex)
				{
					ErrLog.Log("db param error" + ex);
					errors.Add(new { error = "参数读取出错" });
				}

				List<string> source = new List<string>();
				try
				{
					CommonSQL sql = new CommonSQL();
					if (key.Type == JTokenType.Array)
					{
						JArray jarray = key;
						foreach (var c in jarray)
						{
							source.Add(c.ToString());
						}

						string connString = DBConfig.ConnectionString;
						if (connectionKey != null)
						{
							connString = connectionKey["connectionKey"].ToString();
							connString = DBConfig.getConnectionString(connString);
						}

						using (MySqlConnection conn = new MySqlConnection(connString))
						{
							conn.Open();
							MySqlCommand comm = conn.CreateCommand();
							returnVal = sql.getDataSource(source, data,comm, pageInfo, search, orderBy, connectionKey);
						}
					}
				}
				catch (Exception ex)
				{
					ErrLog.Log(string.Join(",", source) + "db sql error" + ex);
					//errors.Add(new { error = "数据库执行出错" });
					errors.Add(new { error = "数据库执行出错," + (ex.InnerException != null ? ex.InnerException.Message : ex.Message) });
				}
				if (errors.Count > 0)
				{
					return new { error = errors };
				}
				else
				{
					return returnVal;
				}
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
				return null;
			}
		}

		public dynamic GetPostArrayData(dynamic json)
		{
			List<dynamic> errors = new List<dynamic>();
			List<dynamic> returnVal = new List<dynamic>();
			dynamic dm = json;
			var key = dm.key;
			JObject pageInfo = dm.pageInfo;
			JObject search = dm.search;
			JArray orderBy = dm.orderBy;
			JArray postData = dm.postData;
			List<Dictionary<string, object>> dic = new List<Dictionary<string, object>>();
			//Dictionary<string, object> data = new Dictionary<string, object>();
			try
			{
				foreach (var d in postData)
				{
					Dictionary<string, object> data = new Dictionary<string, object>();
					foreach (var c in d as JObject)
					{
						data.Add(c.Key, c.Value.ToObject(typeof(object)));
					}
					dic.Add(data);
				}

			}
			catch (Exception ex)
			{
				errors.Add(new { error = "参数读取出错" });
			}


			try
			{
				CommonSQL sql = new CommonSQL();
				if (key.Type == JTokenType.Array)
				{
					JArray jarray = key;
					List<string> source = new List<string>();
					foreach (var c in jarray)
					{
						source.Add(c.ToString());
					}
					string connString = DBConfig.ConnectionString;
					using (MySqlConnection conn = new MySqlConnection(connString))
					{
						conn.Open();
						MySqlCommand comm = conn.CreateCommand();
						foreach (var c in dic)
						{
							returnVal = sql.getDataSource(source, c,comm, pageInfo, search, orderBy, null);
						}
					}
				}
			}
			catch (Exception ex)
			{
				ErrLog.Log(ex);
				errors.Add(new { error = "数据库执行出错" });
			}
			if (errors.Count > 0)
			{
				return new { error = errors };
			}
			else
			{
				return returnVal;
			}
		}
	}
}
