using Aspose.Words;
using Aspose.Words.Saving;
using Aspose.Words.Tables;
using MySql.Data.MySqlClient;
using PartyCollege.Model.outdoc;
using PartyCollegeUtil.Config;
using PartyCollegeUtil.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace PartyCollegeUtil.Service
{
	public class ExportService
	{
		public void ExportCoursewareCategory()
		{
			string info_id = ""; //postModel.info_id;
			string category = ""; //postModel.category;
			category = "coursecategory";
			string filename = "课程分类.doc";
			ExportDocHelper dochelper = new ExportDocHelper();
			dochelper.ExportDoc(info_id, category, filename);
		}

		public void ExportStudySense(string parmcategory, string classid, string title, string name, string status, string recommend)
		{
			ExportDocHelper dochelper = new ExportDocHelper();
			string category = parmcategory;
			Hashtable param = new Hashtable();
			param.Add("bcid", classid);
			dochelper.ExportSenseDoc(param, category);
		}

		public void ExportLearnSense(string parmcategory, string classcourseid, string title, string name, string status, string recommend)
		{
			ExportDocHelper dochelper = new ExportDocHelper();
			string category = parmcategory;
			Hashtable param = new Hashtable();
			param.Add("title", title);
			param.Add("stuname", name);
			param.Add("status", status);
			param.Add("recommend", recommend);
			//按课程导出
			if (classcourseid != "undefined")
			{
				param.Add("classcourseid", classcourseid);
				dochelper.ExportSenseDoc(param, category);
			}
		}

		public void ExportBCLearnSense(string parmcategory, string title, string name, string status, string recommend)
		{
			ExportDocHelper dochelper = new ExportDocHelper();
			string category = parmcategory;
			Hashtable param = new Hashtable();
			//按班导出
			param.Add("classid", new SessionObj().classId);
			param.Add("title", title);
			param.Add("stuname", name);
			param.Add("status", status);
			param.Add("recommend", recommend);

			dochelper.ExportBcKcListSenseDoc(param, category);
		}

		public void ExportStudent(string classid, string name, string company, string signstatus, string graduatestatus, string studyrate)
		{
			ExcelHelper excelhelper = new ExcelHelper();
			Hashtable param = new Hashtable();
			param.Add("classid", classid == "undefined" ? "" : classid);
			param.Add("studentname", name == "undefined" ? "" : name);
			param.Add("company", company == "undefined" ? "" : company);
			param.Add("signstatus", signstatus == "undefined" ? "" : signstatus);
			param.Add("graduatestatus", graduatestatus == "undefined" ? "" : graduatestatus);
			param.Add("studyrate", studyrate == "undefined" ? "" : studyrate);
			excelhelper.ExportToExcel("学员列表", "studentlist", param);
		}

		public void StudyReportExport(string name, string company, string status)
		{
			ExcelHelper excelhelper = new ExcelHelper();
			Hashtable param = new Hashtable();
			param.Add("name", name == "undefined" ? "" : name);
			param.Add("company", company == "undefined" ? "" : company);
			param.Add("status", status == "undefined" ? "" : status);
			excelhelper.ExportToExcel("学员学习报表", "studyreportexport", param);
		}

		public void WorkUnitReportExport(string company)
		{
			ExcelHelper excelhelper = new ExcelHelper();
			Hashtable param = new Hashtable();
			param.Add("company", company == "undefined" ? "" : company);
			excelhelper.ExportToExcel("单位学习报表", "workunitreportexport", param);
		}

		public HttpResponseMessage ExportNote(string coursewareid, string studentid, string classcourseid)
		{
			CommonSQL.doLog4net("操作-导出笔记", "20032");

			Aspose.Words.Document doc = new Document(HttpContext.Current.Server.MapPath("~/Doc/笔记模板.doc"));
			Aspose.Words.DocumentBuilder docBuilder = new Aspose.Words.DocumentBuilder(doc);

			//WORD内容
			dynamic dym = getKCINFO(coursewareid, studentid, classcourseid);
			docBuilder.MoveToBookmark("课程名称");
			docBuilder.Write(dym.courseware["name"]);

			docBuilder.MoveToBookmark("课程简介");
			docBuilder.InsertHtml(dym.courseware["comment"]);

			docBuilder.MoveToBookmark("主讲人");
			foreach (var c in dym.teachers)
			{
				//docBuilder.Write(c.name + " " + c.comment);
				docBuilder.Write(c.name);
				docBuilder.InsertHtml(c.comment);
			}

			docBuilder.MoveToBookmark("学习笔记");
			int x = 1;
			foreach (var c in dym.notes)
			{
				docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Left;
				docBuilder.Writeln(x + ")");



				Table tbl = docBuilder.StartTable();
				docBuilder.CellFormat.Borders.LineStyle = LineStyle.None;
				docBuilder.CellFormat.Width = 800;
				docBuilder.InsertCell();
				docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Right;
				docBuilder.Write("记录时间：" + Convert.ToDateTime(c.createtime).ToString("yyyy-MM-dd") + "      视频位置：" + new TimeSpan(0, 0, c.videostamp).ToString());
				tbl.Alignment = TableAlignment.Right;
				docBuilder.EndTable();

				docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//设置单元格内容对齐方式
				HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(c.teacherpic.ToString());
				HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();
				Stream rs = hres.GetResponseStream();
				Image img = Image.FromStream(rs);

				docBuilder.StartTable();
				docBuilder.CellFormat.Borders.LineStyle = LineStyle.None;
				Cell cellteacher = docBuilder.InsertCell();
				docBuilder.CellFormat.Width = 200;
				docBuilder.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;
				docBuilder.InsertImage(img, 200, 120);

				if (!string.IsNullOrEmpty(c.pptpic))
				{
					myRequest = (HttpWebRequest)WebRequest.Create(c.pptpic.ToString());
					hres = (HttpWebResponse)myRequest.GetResponse();
					rs = hres.GetResponseStream();
					Image imgppt = Image.FromStream(rs);

					docBuilder.InsertCell();
					docBuilder.CellFormat.Width = 200;
					docBuilder.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;
					docBuilder.InsertImage(imgppt, 200, 120);

				}

				docBuilder.EndRow();
				docBuilder.EndTable();
				docBuilder.Writeln("      " + c.notecontent);
				docBuilder.Writeln("");
				x++;
			}

			SaveOptions saveOption = SaveOptions.CreateSaveOptions(SaveFormat.Doc);
			HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.OK);

			doc.Save(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), SaveFormat.Doc);
			msg.Content = new StreamContent(new FileStream(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), FileMode.Open));
			//msg.Content.Headers.ContentLength = rs.Length;
			msg.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
			msg.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
			msg.Content.Headers.ContentDisposition.FileName = dym.courseware["name"] + ".doc";
			return msg;
		}

		private dynamic getKCINFO(string coursewareid, string studentid, string classcourseid)
		{
			string name = string.Empty;
			string comment = string.Empty;
			Dictionary<string, string> courseware = new Dictionary<string, string>();
			object teacher = new { name = string.Empty, Comment = string.Empty };
			List<object> teachers = new List<object>();
			List<object> notes = new List<object>();
			object obj = new { courseware = courseware, teachers = teachers, notes = notes };
			dynamic returnVal = obj;
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();

				dynamic dy_courseware = courseware;
				MySqlCommand comm = conn.CreateCommand();
				//查询课程基本信息
				comm.CommandText = "select name,`comment` from sy_courseware where id=@id";
				comm.Parameters.Add(new MySqlParameter("id", coursewareid));
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					if (odr.Read())
					{
						courseware.Add("name", odr["name"].ToString());
						courseware.Add("comment", odr["comment"].ToString());
					}
				}
				//查询教师
				comm.Parameters.Clear();
				comm.CommandText = @"select name,`comment` from sy_teacher
                                                        teacher inner join sy_courseware_relation re
                                                        on teacher.id=re.sourceid
                                                        where re.type=0 and re.coursewareid=@coursewareid
                                                        ";
				comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					while (odr.Read())
					{
						teachers.Add(new { name = odr["name"], comment = odr["comment"] });
					}
				}
				//查询笔记 classcourseid=@classcourseid and
				comm.Parameters.Clear();
				comm.CommandText = "select * from sy_classcourse_note where studentid=?studentid and coursewareid=?coursewareid";
				comm.Parameters.Add(new MySqlParameter("studentid", studentid));
				comm.Parameters.Add(new MySqlParameter("coursewareid", coursewareid));
		
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					while (odr.Read())
					{
						notes.Add(new
						{
							createtime = odr["createdtime"],
							notecontent = odr["notecontent"],
							videostamp = odr["videostamp"],
							teacherpic = odr["teacherpic"],
							pptpic = odr["pptpic"]
						});
					}
				}

			}
			return returnVal;
		}


		public HttpResponseMessage exportArticle(int type, string articleId)
		{
			dynamic article = getMyArticle(articleId, type);

			Aspose.Words.Document doc = new Document();
			Aspose.Words.DocumentBuilder docBuilder = new Aspose.Words.DocumentBuilder(doc);

			if (article != null)
			{
				docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Center;
				docBuilder.Writeln(article.title.ToString());
				docBuilder.Writeln("");
				docBuilder.Writeln("");
				docBuilder.InsertHtml(article.content.ToString());
			}
			SaveOptions saveOption = SaveOptions.CreateSaveOptions(SaveFormat.Doc);
			HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.OK);

			doc.Save(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), SaveFormat.Doc);
			msg.Content = new StreamContent(new FileStream(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), FileMode.Open));
			//msg.Content.Headers.ContentLength = rs.Length;
			msg.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
			msg.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
			msg.Content.Headers.ContentDisposition.FileName = article.title.ToString() + ".doc";
			return msg;
		}

		/// <summary>
		/// 获取我的文章信息
		/// </summary>
		/// <param name="articleId"></param>
		/// <returns></returns>
		private dynamic getMyArticle(string articleId, int type)
		{
			using (MySqlConnection conn = new MySqlConnection(DBConfig.ConnectionString))
			{
				conn.Open();
				MySqlCommand comm = conn.CreateCommand();
				//查询课程基本信息
				if (type == 1) //学后感
					comm.CommandText = "select title,content from sy_classcourse_learningsense where id = ?id limit 1";
				else
					comm.CommandText = "select title,content from sy_studyingsense where id = ?id  limit 1";

				comm.Parameters.Add(new MySqlParameter("id", articleId));
				using (MySqlDataReader odr = comm.ExecuteReader())
				{
					if (odr.Read())
					{
						var article = new
						{
							title = odr["title"],
							content = odr["content"]
						};
						return article;
					}
				}
			}
			return null;
		}
	}
}
