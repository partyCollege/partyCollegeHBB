using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Senparc.Weixin.QY;
using Senparc.Weixin.QY.AdvancedAPIs;
using Senparc.Weixin.QY.CommonAPIs;
using Senparc.Weixin.QY.AdvancedAPIs.MailList;
using Senparc.Weixin.QY.AdvancedAPIs.Chat;
using System.Data.OleDb;
using Senparc.Weixin.Entities;
using System.Data;
using Senparc.Weixin.QY.Containers;
using PartyCollegeUtil.Tools;
using MySql.Data.MySqlClient;

namespace CollegeAPP.Controllers.wxController
{
    public class WXNoticeController : ApiController
    {
        public string corpId = System.Configuration.ConfigurationManager.AppSettings["_corpId"];
        public string connectionString = System.Configuration.ConfigurationManager.AppSettings["OLEDB_connString"];
        public string _corpSecret = System.Configuration.ConfigurationManager.AppSettings["_corpSecret"];
        // GET: api/WXNotice
        public string Post([FromBody]string value)
        {
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @" select g.bt, kw.kcdd, kw.kssj, kw.jssj, tk.*
   from jw_tkjl tk
  inner join g_infos g
     on g.id = tk.kwid
    and g.status > -1
  inner join jw_kcwh kw
     on kw.info_id = g.id
  where tksj >= (select lastreadtime from app_notice where userid = '0' and objclass='tkgl')
";
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    var kcname = dr["bt"].ToString();
                    var kcdd = dr["kcdd"].ToString();
                    var kwid = dr["kwid"].ToString();
                    var bcid = dr["bcid"].ToString();

                    var kssj = Convert.ToDateTime(dr["kssj"]).ToString("MM-dd HH:mm");
                    string content = "班级课程【" + kcname + "】发生了调课：现在该课程授课地点为【" + kcdd + "】，上课时间为【" + kssj + "】";
                    comm.CommandText = @"  select xy.sjhm,xy.info_id from sub_file_relation re
                                                                inner join jw_xyxx xy
                                                                on re.info_id=xy.info_id and re.finfo_id=" + bcid;
                    DataTable stu = new DataTable();
                    MySqlDataAdapter odaa = new MySqlDataAdapter(comm);
                    odaa.Fill(stu);
                    foreach (DataRow drr in stu.Rows)
                    {
                        try
                        {
                            //MassApi.SendText(token, drr["info_id"].ToString(), string.Empty, string.Empty, "0", content);
                            ErrLog.Log(content);
                        }
                        catch (Exception e)
                        {
                            continue;
                        }


                    }
                }
                comm.CommandText = "update app_notice set lastreadtime=sysdate where userid='0' and objclass='tkgl'";
                comm.ExecuteNonQuery();
            }
            return "";
        }

        /// <summary>
        /// 通知公告实时推送
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/WXNotice/TZGG")]
        public string TzggService([FromBody]string value)
        {
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"   select gg.ggbt,gg.ggsj,br.bcinfo_id from JW_BCGG gg inner join jw_bcgg_relations br on gg.id=br.ggid 
  where ggsj > (select lastreadtime from app_notice where userid = '0' and objclass='tzgg')";
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    var ggname = dr["ggbt"].ToString();
                    var bcid = dr["bcinfo_id"].ToString();

                    string content = "新班级公告【" + ggname + "】，注意查看";
                    comm.CommandText = @"  select xy.sjhm,xy.info_id from sub_file_relation re
                                                                inner join jw_xyxx xy
                                                                on re.info_id=xy.info_id and re.finfo_id=" + bcid;
                    DataTable stu = new DataTable();
                    MySqlDataAdapter odaa = new MySqlDataAdapter(comm);
                    odaa.Fill(stu);
                    foreach (DataRow drr in stu.Rows)
                    {
                        try
                        {
                            //MassApi.SendText(token, drr["info_id"].ToString(), string.Empty, string.Empty, "0", content);
                            ErrLog.Log(content);
                        }
                        catch (Exception e)
                        {
                            continue;
                        }


                    }
                }
                comm.CommandText = "update app_notice set lastreadtime=sysdate where userid='0' and objclass='tzgg'";
                comm.ExecuteNonQuery();
            }
            return "";
        }

        /// <summary>
        /// 课件资源实时推送
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/WXNotice/KJZY")]
        public string KjzyService([FromBody]string value)
        {
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @"   select info_id,nrbt,rq from g_nr where rq > (select lastreadtime from app_notice where userid = '0' and objclass='kjzy')";
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    var kcname = dr["nrbt"].ToString();
                    var bcid = dr["info_id"].ToString();

                    string content = "您收到课件资源：【" + kcname + "】，您可以进入学员管理服务系统下载查看。";
                    comm.CommandText = @"  select xy.sjhm,xy.info_id from sub_file_relation re
                                                                inner join jw_xyxx xy
                                                                on re.info_id=xy.info_id and re.finfo_id=" + bcid;
                    DataTable stu = new DataTable();
                    MySqlDataAdapter odaa = new MySqlDataAdapter(comm);
                    odaa.Fill(stu);
                    foreach (DataRow drr in stu.Rows)
                    {
                        try
                        {
                            //MassApi.SendText(token, drr["info_id"].ToString(), string.Empty, string.Empty, "0", content);
                            ErrLog.Log(content);
                        }
                        catch (Exception e)
                        {
                            continue;
                        }


                    }
                }
                comm.CommandText = "update app_notice set lastreadtime=sysdate where userid='0' and objclass='kjzy'";
                comm.ExecuteNonQuery();
            }
            return "";
        }

        /// <summary>
        /// 教学评估实时推送
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/WXNotice/JXPG")]
        public string JxpgService([FromBody]string value)
        {
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @" select kc.info_id,g.bt,kc.bcid,kc.zjr from jw_kcwh kc inner join G_INFOS g on kc.info_id=g.id
 where kc.jssj > (select lastreadtime from app_notice where userid = '0' and objclass='jxpg') and jssj <sysdate ";
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    var kcname = dr["bt"].ToString();
                    var bcid = dr["bcid"].ToString();
                    var kcid = dr["info_id"].ToString();
                    var zjr = dr["zjr"].ToString();

                    string content = "您有新的课程需要评估，课程：【" + kcname + "】，授课教师：【" + zjr + "】，请您尽快对该课程进行评估。";
                    comm.CommandText = @"  select xy.sjhm,xy.info_id from sub_file_relation re
                                                                inner join jw_xyxx xy
                                                                on re.info_id=xy.info_id and re.finfo_id=" + bcid;
                    DataTable stu = new DataTable();
                    MySqlDataAdapter odaa = new MySqlDataAdapter(comm);
                    odaa.Fill(stu);
                    foreach (DataRow drr in stu.Rows)
                    {
                        try
                        {
                            comm.CommandText = @" select g1.id as kwid,g1.bt,kcwh.jxxs,kcwh.kssj,to_char(kcwh.kssj,'mm-dd hh24:mi') sksj,kcwh.jssj,kcwh.kc_id from jw_kcwh kcwh inner join g_infos g1 on g1.id=kcwh.info_id 
and g1.deleted<>-1 and kcwh.jxxs is not null and kcwh.jxxs <>'讲座' inner join jw_kcfb fb on fb.kwinfo_id=kcwh.info_id inner join jw_kcfbindex indx on indx.id=fb.fid 
inner join jw_bcgl bc on bc.info_id=indx.info_id inner join g_infos g2 on g2.id=bc.info_id and g2.deleted<>-1 where g1.objclass='KCWH' and bc.info_id="+bcid+@" and fb.kwtype is not null 
and kcwh.kc_id is not null and kcwh.sfpj=1 and SYSDATE-kcwh.jssj>1 and kcwh.jssj<sysdate  and not exists(select * from jw_appraise ja where ja.bcid=bc.info_id and ja.kwid=kcwh.info_id 
AND ja.userid=" + drr["info_id"].ToString() + @") and kcwh.info_id=" + kcid + " and fb.kwedate<SYSDATE and kcwh.jxxs <>'互动研讨' ";
                            DataTable wpkc = new DataTable();
                            MySqlDataAdapter wpdata = new MySqlDataAdapter(comm);
                            wpdata.Fill(wpkc);
                            if (wpkc.Rows.Count > 0)
                            {
                                //MassApi.SendText(token, drr["info_id"].ToString(), string.Empty, string.Empty, "0", content);
                                ErrLog.Log(content);
                            }
                        }
                        catch (Exception e)
                        {
                            continue;
                        }


                    }
                }
                comm.CommandText = "update app_notice set lastreadtime=sysdate where userid='0' and objclass='jxpg'";
                comm.ExecuteNonQuery();
            }
            return "";
        }

        /// <summary>
        /// 教学评估定时推送
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/WXNotice/JXPGDS")]
        public string JxpgdsService([FromBody]string value)
        {
            string token = AccessTokenContainer.GetToken(corpId, _corpSecret);
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = @" select g.bt,kc.bcid,kc.info_id from jw_kcwh kc inner join G_INFOS g on kc.info_id=g.id
 where sysdate> kc.kssj and  kc.jssj > sysdate ";
                DataTable dt = new DataTable();
                MySqlDataAdapter oda = new MySqlDataAdapter(comm);
                oda.Fill(dt);
                foreach (DataRow dr in dt.Rows)
                {
                    var kcname = dr["bt"].ToString();
                    var bcid = dr["bcid"].ToString();
                    var kcid = dr["info_id"].ToString();

                    string content = "";
                    comm.CommandText = @"  select xy.sjhm,xy.info_id from sub_file_relation re
                                                                inner join jw_xyxx xy
                                                                on re.info_id=xy.info_id and re.finfo_id=" + bcid;
                    DataTable stu = new DataTable();
                    MySqlDataAdapter odaa = new MySqlDataAdapter(comm);
                    odaa.Fill(stu);
                    foreach (DataRow drr in stu.Rows)
                    {
                        try
                        {
                            comm.CommandText = @" select count(1) from jw_kcwh kcwh inner join g_infos g1 on g1.id=kcwh.info_id 
and g1.deleted<>-1 and kcwh.jxxs is not null and kcwh.jxxs <>'讲座' inner join jw_kcfb fb on fb.kwinfo_id=kcwh.info_id inner join jw_kcfbindex indx on indx.id=fb.fid 
inner join jw_bcgl bc on bc.info_id=indx.info_id inner join g_infos g2 on g2.id=bc.info_id and g2.deleted<>-1 where g1.objclass='KCWH' 
and bc.info_id=" + bcid + @" and fb.kwtype is not null and kcwh.kc_id is not null and kcwh.sfpj=1 and SYSDATE-kcwh.jssj>1 and kcwh.jssj<sysdate  
and not exists(select * from jw_appraise ja where ja.bcid=bc.info_id and ja.kwid=kcwh.info_id AND ja.userid=" + drr["info_id"].ToString() + ") and fb.kwedate<SYSDATE and kcwh.jxxs <>'互动研讨'  ";
                            if (int.Parse(comm.ExecuteScalar().ToString()) > 0)
                            {
                                content = "当前您有" + comm.ExecuteScalar().ToString() + "门课程尚未评估，请您尽快评估。";
                                //MassApi.SendText(token, drr["info_id"].ToString(), string.Empty, string.Empty, "0", content);
                                ErrLog.Log(content);
                            }
                        }
                        catch (Exception e)
                        {
                            continue;
                        }
                    }
                }
                comm.CommandText = "update app_notice set lastreadtime=sysdate where userid='0' and objclass='jxpg'";
                comm.ExecuteNonQuery();
            }
            return "";
        }

        // GET: api/WXNotice/5
        public string Get(int id)
        {
            return "value";
        }


        // PUT: api/WXNotice/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/WXNotice/5
        public void Delete(int id)
        {
        }
    }
}
