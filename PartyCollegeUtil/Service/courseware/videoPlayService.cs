using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model;
using PartyCollegeUtil.Tools;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyCollegeUtil.Service.courseware
{
    public class videoPlayService
    {
        public dynamic getVideoLogPKey(JObject data)
        {
            dynamic returnInfo = new ExpandoObject();
            returnInfo.code = true;
            returnInfo.message = "";
            string id = string.Empty;
            int studytime = 0;
            int timespan = 0;
            string isfinished = "0";
			//SessionObj.RemoveSessionObj("videoplaytime");
			//SessionObj.RemoveSessionObj("videomaxtime");
            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                conn.Open();
                MySqlCommand comm = conn.CreateCommand();
                string sql = string.Empty;
                sql = "select id,studytime,isfinished,timespan from sy_video_log where studentid=@studentid and coursewareid=@coursewareid";
                comm.CommandText = sql;
                comm.Parameters.Add(new MySqlParameter("studentid", data.GetValue("studentid")));
                comm.Parameters.Add(new MySqlParameter("coursewareid", data.GetValue("coursewareid")));
                using (MySqlDataReader reader = comm.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id = reader["id"].ToString();
                        studytime = Convert.ToInt32("0" + reader["studytime"].ToString());
                        timespan = Convert.ToInt32("0" + reader["timespan"].ToString());
                        isfinished = reader["isfinished"].ToString();
                    }
                }

                //只有未完成的需要防止进度丢失，已完成的不记录上次进度
                if (isfinished == "1")
                {
                    if (studytime == timespan && studytime > 0)
                    {
                        SessionObj.SetSessionObj("videomaxtime", "0");
                    }
                    else
                    {
                        SessionObj.SetSessionObj("videomaxtime", studytime);
                    }
                }
                else
                {
                    SessionObj.SetSessionObj("videomaxtime", studytime);
                }

                //没有主键，则新增记录
                if (string.IsNullOrEmpty(id))
                {
                    int nowtime = 0;
                    int maxtime = 0;
                    comm.Parameters.Clear();
                    nowtime = Convert.ToInt32(data.GetValue("time"));
                    id = Guid.NewGuid().ToString();
                    comm.CommandText = "insert into sy_video_log (id,studentid,coursewareid,timespan,studytime,lasttime,playpercentage,score,starttime) values (@id,@studentid,@coursewareid,@nowtime,@studytime,@studydate,@playpercentage,@score,@starttime)";
                    comm.Parameters.Add(new MySqlParameter("id", id));
                    comm.Parameters.Add(new MySqlParameter("studentid", data.GetValue("studentid")));
                    comm.Parameters.Add(new MySqlParameter("coursewareid", data.GetValue("coursewareid")));
                    comm.Parameters.Add(new MySqlParameter("nowtime", nowtime));
                    comm.Parameters.Add(new MySqlParameter("studytime", maxtime));
                    comm.Parameters.Add(new MySqlParameter("studydate", DateTime.Now));
                    comm.Parameters.Add(new MySqlParameter("playpercentage", (0.00 * 100) + "%"));
                    comm.Parameters.Add(new MySqlParameter("score", data.GetValue("courwarestudytime")));
                    comm.Parameters.Add(new MySqlParameter("starttime", DateTime.Now));
                    comm.ExecuteNonQuery();
                    //debugstr.Append("8,");
                }
            }
            returnInfo.pkey = id;
            return returnInfo;
        }

		public dynamic videoplay(dynamic data)
        {
            dynamic msg = new ExpandoObject();
            try
            {
				if (data.videotype == 3)
				{
					//纯ppt播放
					msg = DealPPTCourse(data);
				}
				else
				{
					msg = DealVedioPlay(data);
				}
                if (!msg.code)
                {
                    ErrLog.Log("SaveVideoInfo=" + msg.message);
                }
            }
            catch (Exception ex)
            {
                ExceptionService.WriteException(ex);
            }
            return msg;
        }

		private dynamic DealPPTCourse(dynamic data)
		{
			dynamic returnInfo = new ExpandoObject();
			returnInfo.code = false;
			returnInfo.message = "notfinished";
			string messageTemplet = "视频播放异常未能记录学习进度,需要参数:{0}.";
			returnInfo = CheckPostParam(data, messageTemplet);
			if (!returnInfo.code)
			{
				return returnInfo;
			}
			string currentid = data.GetValue("currentID").ToString();
			string pkey = data.GetValue("pkey").ToString();
			int videoDuration = Convert.ToInt32(data.GetValue("videoDuration").ToString());
			int videoTimespan = Convert.ToInt32(data.GetValue("timestamp").ToString());
			if (videoTimespan > videoDuration)
			{
				videoTimespan = videoDuration;
			}
			int studytime = Convert.ToInt32("0" + data.GetValue("studytime").ToString());
			int studyDetailCount = Convert.ToInt32("0" + data.GetValue("studetailcount").ToString());
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				try
				{
					//debugstr.Append("1,");
					conn.Open();
					//debugstr.Append("2,");
					MySqlCommand comm = conn.CreateCommand();

					int hasRecord = 0;
					int maxtime = 0;

					if (!string.IsNullOrEmpty(pkey))
					{
						hasRecord = 1;
					}

					if (studytime > 0)
					{
						//页面缓存本视频最大时间
						object sessMaxTime = SessionObj.GetSessionObj("videomaxtime");
						int SessMaxTime = Convert.ToInt32(sessMaxTime);
						if (studytime <= SessMaxTime)
						{
							maxtime = SessMaxTime;
						}
						else
						{
							maxtime = studytime;
							SessionObj.SetSessionObj("videomaxtime", maxtime);
						}
					}
					//debugstr.Append("3,");

					//当新开页面时，页面会自动生成currentid.
					int hasVideoDetial = 0;
					if (studyDetailCount > 0)
					{
						hasVideoDetial = studyDetailCount;
					}
					//debugstr.Append("4,");


					if (hasRecord > 0)
					{
						int nowtime = Convert.ToInt32(data.GetValue("time"));
						if (nowtime >= maxtime)
						{
							maxtime = nowtime;
						}
						double playpercentage = (double)maxtime / (double)videoDuration;
						double playpercentage2 = Math.Round(playpercentage, 2);
						comm.CommandText = "update sy_video_log set timespan=@nowtime,studytime=@studytime,lasttime=@studydate,playpercentage=@playpercentage where id=?pkey";
						comm.Parameters.Add(new MySqlParameter("nowtime", nowtime));
						comm.Parameters.Add(new MySqlParameter("studytime", maxtime));
						comm.Parameters.Add(new MySqlParameter("studydate", DateTime.Now));
						comm.Parameters.Add(new MySqlParameter("playpercentage", (playpercentage2 * 100) + "%"));
						comm.Parameters.Add(new MySqlParameter("pkey", pkey));
						comm.ExecuteNonQuery();
						//debugstr.Append("5,");
						if (maxtime == videoDuration)
						{
							comm.Parameters.Clear();
							comm.CommandText = "select isfinished,starttime from sy_video_log where id=?pkey";
							comm.Parameters.Add(new MySqlParameter("pkey", pkey));
							int finshed = 0;
							string starttime = string.Empty;
							using (MySqlDataReader reader = comm.ExecuteReader())
							{
								if (reader.Read())
								{
									finshed = Convert.ToInt32("0" + reader["isfinished"].ToString());
									starttime = reader["starttime"].ToString();
								}
							}
							//debugstr.Append("5,pkey=" + data.GetValue("pkey") + ",starttime=" + starttime + ",");
							bool isfinished = finshed > 0 ? true : false;
							if (isfinished)
							{
								returnInfo.code = true;
								returnInfo.message = "success";
								return returnInfo;
							}

							//debugstr.Append("5,isfinished=" + isfinished + ",");

							comm.Parameters.Clear();
							DateTime enddate = DateTime.Now;
							comm.CommandText = "update sy_video_log set isplaycompletion=1,isfinished=1,endtime=?endtime where id=?pkey";
							comm.Parameters.Add(new MySqlParameter("endtime", enddate));
							comm.Parameters.Add(new MySqlParameter("pkey", data.GetValue("pkey")));
							comm.ExecuteNonQuery();
							//debugstr.Append("6,");

							//完成时调用学分计算
							CalcScore();
						}
					}

					comm.Parameters.Clear();
					if (hasVideoDetial > 0)
					{
						comm.CommandText = "update sy_video_detail set timestamp=@timestamp,playtime=now() where id=@id";
						comm.Parameters.Add(new MySqlParameter("timestamp", videoTimespan));
						comm.Parameters.Add(new MySqlParameter("id", currentid));
						comm.ExecuteNonQuery();
						//debugstr.Append("9,");
					}
					else
					{
						comm.CommandText = "insert into sy_video_detail (id,timestamp,playtime,studentid,accountid,coursewareid) values (@id,@timestamp,@playtime,@studentid,@accountid,@coursewareid)";
						comm.Parameters.Add(new MySqlParameter("id", currentid));
						comm.Parameters.Add(new MySqlParameter("timestamp", videoTimespan));
						comm.Parameters.Add(new MySqlParameter("playtime", DateTime.Now));
						comm.Parameters.Add(new MySqlParameter("studentid", data.GetValue("studentid")));
						comm.Parameters.Add(new MySqlParameter("accountid", data.GetValue("accountid")));
						comm.Parameters.Add(new MySqlParameter("coursewareid", data.GetValue("coursewareid")));
						comm.ExecuteNonQuery();
						//debugstr.Append("10,");
					}
					//ErrLog.Log("debugstr=" + debugstr);

					returnInfo.code = true;
					returnInfo.message = "success";
				}
				catch (Exception ex)
				{
					//debugstr.Append("观看视频进度错误\n" + ex);
					ExceptionService.WriteException(ex);
					returnInfo.code = false;
					returnInfo.message = string.Format(messageTemplet, "进度保存失败");
				}
				return returnInfo;
			}
		}

		private dynamic DealVedioPlay(dynamic data)
		{
			dynamic msg = new ExpandoObject();
			//object sessVal = SessionObj.GetSessionObj("videoplaytime");
			//DateTime pastTime = DateTime.Now;
			//if (sessVal == null)
			//{
			//	SessionObj.SetSessionObj("videoplaytime", pastTime);
			//}
			//else
			//{
			//	pastTime = (DateTime)sessVal;
			//	TimeSpan tspan = DateTime.Now - pastTime;
			//	if (tspan.TotalSeconds < 60)
			//	{
			//		//此处前段特殊放行
			//		Console.WriteLine("tspan.TotalSeconds=" + tspan.TotalSeconds);
			//		msg.code = true;
			//		msg.message = "请求间隔小于60秒，忽略";
			//		//return msg;
			//	}
			//	else
			//	{
			//		SessionObj.SetSessionObj("videoplaytime", pastTime);
			//	}
			//}
			msg = SaveVideoInfo(data);
			return msg;
		}

        private dynamic SaveVideoInfo(JObject data)
        {
			dynamic returnInfo=new ExpandoObject();
			string messageTemplet = "视频播放异常未能记录学习进度,需要参数:{0}.";
			returnInfo= CheckPostParam(data, messageTemplet);
			if (!returnInfo.code)
			{
				return returnInfo;
			}

            StringBuilder debugstr = new StringBuilder();
            string currentid = data.GetValue("currentID").ToString();
            string pkey = data.GetValue("pkey").ToString();
            DateTime videoDuration = Convert.ToDateTime(data.GetValue("videoDuration").ToString());
            int Second = videoDuration.Hour * 3600 + videoDuration.Minute * 60 + videoDuration.Second;
            int videoTimespan = Convert.ToInt32(data.GetValue("timestamp").ToString());
            if (videoTimespan > Second)
            {
                videoTimespan = Second;
            }
            int studytime = Convert.ToInt32("0" + data.GetValue("studytime").ToString());//获取前台提交的studytime，减少服务器端的数据库压力
            int studyDetailCount = Convert.ToInt32("0" + data.GetValue("studetailcount").ToString());

            using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
            {
                try
                {
                    debugstr.Append("1,");
                    conn.Open();
                    debugstr.Append("2,");
                    MySqlCommand comm = conn.CreateCommand();

                    int hasRecord = 0;
                    int maxtime = 0;

                    if (!string.IsNullOrEmpty(pkey))
                    {
                        hasRecord = 1;
                    }

					//if (studytime > 0)
					//{
					//	//页面缓存本视频最大时间
					//	object sessMaxTime = SessionObj.GetSessionObj("videomaxtime");
					//	int SessMaxTime = Convert.ToInt32(sessMaxTime);
					//	if (studytime <= SessMaxTime)
					//	{
					//		maxtime = SessMaxTime;
					//	}
					//	else
					//	{
					//		maxtime = studytime;
					//		SessionObj.SetSessionObj("videomaxtime", maxtime);
					//	}
					//}
					//debugstr.Append("3,");

                    //当新开页面时，页面会自动生成currentid.
                    int hasVideoDetial = 0;
                    if (studyDetailCount > 0)
                    {
                        hasVideoDetial = studyDetailCount;
                    }
                    debugstr.Append("4,");


                    if (hasRecord > 0)
                    {
                        int nowtime = Convert.ToInt32(data.GetValue("time"));
                        if (nowtime >= maxtime)
                        {
                            maxtime = nowtime;
                        }
                        double playpercentage = (double)maxtime / (double)Second;
                        double playpercentage2 = Math.Round(playpercentage, 2);
                        comm.CommandText = "update sy_video_log set timespan=@nowtime,studytime=@studytime,lasttime=@studydate,playpercentage=@playpercentage where id=?pkey";
                        comm.Parameters.Add(new MySqlParameter("nowtime", nowtime));
                        comm.Parameters.Add(new MySqlParameter("studytime", maxtime));
                        comm.Parameters.Add(new MySqlParameter("studydate", DateTime.Now));
                        comm.Parameters.Add(new MySqlParameter("playpercentage", (playpercentage2 * 100) + "%"));
                        comm.Parameters.Add(new MySqlParameter("pkey", pkey));
                        comm.ExecuteNonQuery();
                        debugstr.Append("5,");

						//2400 表示最小视频长度，以最后保留2分钟的策略制定
						bool UpdateVideoLog = false;
						if (Second >= 2400)
						{
							UpdateVideoLog = (maxtime >= Second * 0.95);
						}
						else
						{
							UpdateVideoLog = (maxtime >= Second - 120);
						}

						if (UpdateVideoLog)
						{
                            comm.Parameters.Clear();
                            comm.CommandText = "select isfinished,starttime from sy_video_log where id=?pkey";
                            comm.Parameters.Add(new MySqlParameter("pkey", pkey));
                            int finshed = 0;
                            string starttime = string.Empty;
                            using (MySqlDataReader reader = comm.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    finshed = Convert.ToInt32("0" + reader["isfinished"].ToString());
                                    starttime = reader["starttime"].ToString();
                                }
                            }
                            debugstr.Append("5,pkey=" + data.GetValue("pkey") + ",starttime=" + starttime + ",");
                            bool isfinished = finshed > 0 ? true : false;
                            if (isfinished)
                            {
                                returnInfo.code = true;
                                returnInfo.message = "success";
                                return returnInfo;
                            }

                            debugstr.Append("5,isfinished=" + isfinished + ",");

                            comm.Parameters.Clear();
                            DateTime enddate = DateTime.Now;
                            comm.CommandText = "update sy_video_log set isplaycompletion=1,isfinished=1,endtime=?endtime where id=?pkey";
                            comm.Parameters.Add(new MySqlParameter("endtime", enddate));
                            comm.Parameters.Add(new MySqlParameter("pkey", data.GetValue("pkey")));
                            comm.ExecuteNonQuery();
                            debugstr.Append("6,");

							//完成时调用学分计算
							CalcScore();
                        }
                    }

                    comm.Parameters.Clear();
                    if (hasVideoDetial > 0)
                    {
                        comm.CommandText = "update sy_video_detail set timestamp=@timestamp,playtime=now() where id=@id";
                        comm.Parameters.Add(new MySqlParameter("timestamp", videoTimespan));
                        comm.Parameters.Add(new MySqlParameter("id", currentid));
                        comm.ExecuteNonQuery();
                        debugstr.Append("9,");
                    }
                    else
                    {
                        comm.CommandText = "insert into sy_video_detail (id,timestamp,playtime,studentid,accountid,coursewareid) values (@id,@timestamp,@playtime,@studentid,@accountid,@coursewareid)";
                        comm.Parameters.Add(new MySqlParameter("id", currentid));
                        comm.Parameters.Add(new MySqlParameter("timestamp", videoTimespan));
                        comm.Parameters.Add(new MySqlParameter("playtime", DateTime.Now));
                        comm.Parameters.Add(new MySqlParameter("studentid", data.GetValue("studentid")));
                        comm.Parameters.Add(new MySqlParameter("accountid", data.GetValue("accountid")));
                        comm.Parameters.Add(new MySqlParameter("coursewareid", data.GetValue("coursewareid")));
                        comm.ExecuteNonQuery();
                        debugstr.Append("10,");
                    }
                    ErrLog.Log("debugstr=" + debugstr);

                    returnInfo.code = true;
                    returnInfo.message = "success";
                }
                catch (Exception ex)
                {
                    debugstr.Append("观看视频进度错误\n" + ex);
                    ExceptionService.WriteException(ex);
                    returnInfo.code = false;
                    returnInfo.message = string.Format(messageTemplet, "进度保存失败");
                }
                return returnInfo;
            }
        }

		private static void CalcScore()
		{
			dynamic dynParameter = new System.Dynamic.ExpandoObject();
			dynParameter.departmentid = Convert.ToString(SessionObj.GetSessionObj("departmentid"));
			dynParameter.rank = Convert.ToString(((YearPlan)SessionObj.GetSessionObj("yearplan")).rank);
			dynParameter.studentid = Convert.ToString(SessionObj.GetSessionObj("studentid"));
			dynParameter.accountid = Convert.ToString(SessionObj.GetSessionObj("accountid"));

			Task.Factory.StartNew(() =>
			{
				TotalService service = new TotalService();
				return service.AddHistoryUserTotal(dynParameter);
			});
		}

		private static dynamic CheckPostParam(JObject data, string messageTemplet)
		{
			dynamic returnInfo = new ExpandoObject();
			returnInfo.code = false;
			returnInfo.message = "notfinished";
			

			if (data.GetValue("currentID") == null || data.GetValue("currentID").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "currentID");
				//return Newtonsoft.Json.JsonConvert.SerializeObject(returnInfo);
				return returnInfo;
			}
			if (data.GetValue("pkey") == null || data.GetValue("pkey").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "pkey");
				return returnInfo;
			}

			if (data.GetValue("accountid") == null || data.GetValue("accountid").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "accountid");
				return returnInfo;
			}

			if (data.GetValue("studentid") == null || data.GetValue("studentid").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "studentid");
				return returnInfo;
			}
			if (data.GetValue("coursewareid") == null || data.GetValue("coursewareid").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "coursewareid");
				return returnInfo;
			}
			if (data.GetValue("videoDuration") == null || data.GetValue("videoDuration").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "videoDuration");
				return returnInfo;
			}
			if (data.GetValue("time") == null || data.GetValue("time").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "time");
				return returnInfo;
			}
			if (data.GetValue("timestamp") == null || data.GetValue("timestamp").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "timestamp");
				return returnInfo;
			}
			if (data.GetValue("studytime") == null || data.GetValue("studytime").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "studytime");
				return returnInfo;
			}
			if (data.GetValue("studetailcount") == null || data.GetValue("studetailcount").ToString() == "")
			{
				returnInfo.message = string.Format(messageTemplet, "studetailcount");
				return returnInfo;
			}
			returnInfo.code = true;
			return returnInfo;
		}
    }
}
