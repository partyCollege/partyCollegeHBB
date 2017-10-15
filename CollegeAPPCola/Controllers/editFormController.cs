using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
namespace CollegeAPP.Controllers
{
    public class editFormController : ApiController
    {
        public static string ConnectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        // GET: api/editForm
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        // GET: api/editForm/5
        public object Get(int id, string obj)
        {
            object returnobj = new object();
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                MySqlCommand comm = conn.CreateCommand();

            }
            return returnobj;
        }
        [HttpPost]
        [Route("api/editForm/deleteForm")]
        public string deleteForm([FromBody]string info_id)
        {
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "select objclass from g_infos where id=:info_id";
                comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                string objclass = comm.ExecuteScalar().ToString();

                comm.Parameters.Clear();
                comm.CommandText = "select rel_table from g_obj_forms where objclass=:objclass";
                comm.Parameters.Add(new MySqlParameter("objclass", objclass));
                string tableName = comm.ExecuteScalar().ToString();

                comm.Parameters.Clear();
                comm.CommandText = "delete " + tableName + " where info_id=:info_id";
                comm.Parameters.Add(new MySqlParameter("info_id",info_id));
                comm.ExecuteNonQuery();

                comm.CommandText = "update g_infos set status=-1 where id=:info_id ";
                comm.ExecuteNonQuery();
                
            }
            return "ok";
        }

        // POST: api/editForm
        public string Post([FromBody]JObject json)
        {
            dynamic dm = json;
            string info_id = "";
            Dictionary<string, object> data = new Dictionary<string, object>();
            //来自于页面上不是表单内部的数据
            Dictionary<string, object> otherData = new Dictionary<string, object>();
            try
            {
                foreach (var c in dm.data)
                {
                    data.Add(c.Name, c.Value.ToObject(typeof(object)));
                }
            }
            catch (Exception ex)
            { }

            try
            {
                foreach (var c in dm.otherParams)
                {
                    data.Add(c.Name, c.Value.ToObject(typeof(object)));
                }
            }
            catch (Exception ex)
            { }
            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                MySqlTransaction tran = conn.BeginTransaction();
                try
                {
                    MySqlCommand comm = conn.CreateCommand();
                    comm.Transaction = tran;

                    comm.CommandText = "select rel_tablename from g_objs where objclass=:obj";
                    comm.Parameters.Add(new MySqlParameter("obj", dm.obj.Value.ToUpper()));
                    string tablename = comm.ExecuteScalar().ToString();
                    //新建表单
                    if (Convert.ToBoolean(dm.isnew.Value))
                    {
                        //获取maxvalue
                        info_id = qingjiaController.GetMaxValue("G_INFOS");
                        comm.CommandText = "select maincode from g_users where id=" + dm.userid.Value;
                        string maincode = comm.ExecuteScalar().ToString();
                        data.Add("info_id", info_id);
                        comm.Parameters.Clear();
                        string columns = string.Empty;
                        string paras = string.Empty;
                        foreach (var c in data)
                        {
                            if (c.Key.ToUpper() == "BT"||c.Key.ToUpper()=="FINFO_ID")
                            {
                                continue;
                            }
                            columns += c.Key + ",";
                            paras += ":" + c.Key + ",";
                        }
                        columns = columns.Trim(",".ToCharArray());
                        paras = paras.Trim(",".ToCharArray());
                        comm.CommandText = "insert into " + tablename + " (" + columns + ") values (" + paras + ")";
                        foreach (var c in data)
                        {
                            if (c.Key.ToUpper() == "BT" || c.Key.ToUpper() == "FINFO_ID")
                            {
                                continue;
                            }
                            comm.Parameters.Add(new MySqlParameter(c.Key, c.Value));
                        }
                        comm.ExecuteNonQuery();

                        comm.Parameters.Clear();
                        comm.CommandText = "insert into g_infos(id,objclass,bt,mainunion,user_id,edit_user_id,ngrq) values(:id,:objclass,:bt,:mainunion,:user_id,:edit_user_id,:ngrq)";
                        comm.Parameters.Add(new MySqlParameter("id", info_id));
                        comm.Parameters.Add(new MySqlParameter("objclass", dm.obj.Value.ToUpper()));
                        comm.Parameters.Add(new MySqlParameter("bt", data["bt"]));
                        comm.Parameters.Add(new MySqlParameter("mainunion", maincode));
                        comm.Parameters.Add(new MySqlParameter("user_id", dm.userid.Value));
                        comm.Parameters.Add(new MySqlParameter("edit_user_id", dm.userid.Value));
                        comm.Parameters.Add(new MySqlParameter("ngrq", DateTime.Now));
                        comm.ExecuteNonQuery();

                        if (dm.data.finfo_id!=null)
                        {
                            comm.Parameters.Clear();
                            comm.CommandText = "update g_infos set finfo_id=:finfo_id where id=:id";
                            comm.Parameters.Add(new MySqlParameter("finfo_id", dm.data.finfo_id.Value));
                            comm.Parameters.Add(new MySqlParameter("id", info_id));
                            comm.ExecuteNonQuery();
                        }

                        comm.Parameters.Clear();
                        comm.CommandText = "insert into g_infos_relation(id,fid) values(:id,0)";
                        comm.Parameters.Add(new MySqlParameter("id", info_id));
                        comm.ExecuteNonQuery();

                        tran.Commit();
                    }
                    else
                    {
                        info_id = data["info_id"].ToString();
                        comm.Parameters.Clear();

                        comm.CommandText = "update g_infos set bt=:bt where id=:info_id";
                        comm.Parameters.Add(new MySqlParameter("bt", data["bt"]));
                        comm.Parameters.Add(new MySqlParameter("info_id",info_id));
                        comm.ExecuteNonQuery();

                        comm.Parameters.Clear();
                        string sql = string.Empty;

                        foreach (var c in data)
                        {
                            if (c.Key.ToUpper() == "BT" || c.Key.ToUpper() == "FINFO_ID")
                            {
                                continue;
                            }
                            sql += c.Key + "=:" + c.Key + ",";
                            comm.Parameters.Add(new MySqlParameter(c.Key, c.Value));
                        }
                        sql = sql.Trim(",".ToCharArray());
                        comm.Parameters.Add(new MySqlParameter("info_id", info_id));
                        comm.CommandText = "update " + tablename + " set " + sql + " where info_id=:info_id";
                        comm.ExecuteNonQuery();
                        tran.Commit();
                    }

                }
                catch (Exception e)
                {
                    tran.Rollback();
                }
            }

            return info_id;
        }

        // PUT: api/editForm/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/editForm/5
        public void Delete(int id)
        {
            string s = id.ToString();
        }
    }
}
