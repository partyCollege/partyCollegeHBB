using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Aspose.Words;
using Newtonsoft.Json.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using PartyCollege.Model;
using Aspose.Words.Saving;
using System.IO;
using System.Net.Http.Headers;
using System.Drawing;
using Aspose.Words.Tables;
using PartyCollegeUtil.Service;
namespace PartyCollege.Controllers
{
    public class exportNoteController : ApiController
    {
        [Route("api/exportNote/{coursewareid}/{studentid}/{classcourseid}")]
        public HttpResponseMessage Get(string coursewareid, string studentid, string classcourseid)
        {
			ExportService exportSrv = new ExportService();
			return exportSrv.ExportNote(coursewareid, studentid, classcourseid);

			//PartyCollege.Model.CommonSQL.doLog4net("操作-导出笔记", "20032");

			//Aspose.Words.Document doc = new Document(HttpContext.Current.Server.MapPath("~/Doc/笔记模板.doc"));
			//Aspose.Words.DocumentBuilder docBuilder = new Aspose.Words.DocumentBuilder(doc);

			////WORD内容
			//dynamic dym = getKCINFO(coursewareid, studentid, classcourseid);
			//docBuilder.MoveToBookmark("课程名称");
			//docBuilder.Write(dym.courseware["name"]);

			//docBuilder.MoveToBookmark("课程简介");
			//docBuilder.InsertHtml(dym.courseware["comment"]);

			//docBuilder.MoveToBookmark("主讲人");
			//foreach (var c in dym.teachers)
			//{
			//	//docBuilder.Write(c.name + " " + c.comment);
			//	docBuilder.Write(c.name);
			//	docBuilder.InsertHtml(c.comment);
			//}

			//docBuilder.MoveToBookmark("学习笔记");
			//int x = 1;
			//foreach (var c in dym.notes)
			//{
			//	docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Left;
			//	docBuilder.Writeln(x + ")");



			//	Table tbl = docBuilder.StartTable();
			//	docBuilder.CellFormat.Borders.LineStyle = LineStyle.None;
			//	docBuilder.CellFormat.Width = 800;
			//	docBuilder.InsertCell();
			//	docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Right;
			//	docBuilder.Write("记录时间：" + Convert.ToDateTime(c.createtime).ToString("yyyy-MM-dd") + "      视频位置：" + new TimeSpan(0, 0, c.videostamp).ToString());
			//	tbl.Alignment = TableAlignment.Right;
			//	docBuilder.EndTable();

			//	docBuilder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//设置单元格内容对齐方式
			//	HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(c.teacherpic.ToString());
			//	HttpWebResponse hres = (HttpWebResponse)myRequest.GetResponse();
			//	Stream rs = hres.GetResponseStream();
			//	Image img = Image.FromStream(rs);

			//	docBuilder.StartTable();
			//	docBuilder.CellFormat.Borders.LineStyle = LineStyle.None;
			//	Cell cellteacher = docBuilder.InsertCell();
			//	docBuilder.CellFormat.Width = 200;
			//	docBuilder.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;
			//	docBuilder.InsertImage(img, 200, 120);

			//	if (!string.IsNullOrEmpty(c.pptpic))
			//	{
			//		myRequest = (HttpWebRequest)WebRequest.Create(c.pptpic.ToString());
			//		hres = (HttpWebResponse)myRequest.GetResponse();
			//		rs = hres.GetResponseStream();
			//		Image imgppt = Image.FromStream(rs);

			//		docBuilder.InsertCell();
			//		docBuilder.CellFormat.Width = 200;
			//		docBuilder.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;
			//		docBuilder.InsertImage(imgppt, 200, 120);

			//	}

			//	docBuilder.EndRow();
			//	docBuilder.EndTable();
			//	docBuilder.Writeln("      " + c.notecontent);
			//	docBuilder.Writeln("");
			//	x++;
			//}

			//SaveOptions saveOption = SaveOptions.CreateSaveOptions(SaveFormat.Doc);
			//HttpResponseMessage msg = new HttpResponseMessage(HttpStatusCode.OK);

			//doc.Save(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), SaveFormat.Doc);
			//msg.Content = new StreamContent(new FileStream(HttpContext.Current.Server.MapPath("~/Doc/temp.doc"), FileMode.Open));
			////msg.Content.Headers.ContentLength = rs.Length;
			//msg.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
			//msg.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
			//msg.Content.Headers.ContentDisposition.FileName = dym.courseware["name"] + ".doc";
            
        }
        /// <summary>
        /// 导出我的文章
        /// </summary>
        /// <param name="type"></param>
        /// <param name="articleId"></param>
        /// <returns></returns>
		[Route("api/exportArticle/{type}/{articleId}")]
		public HttpResponseMessage Get(int type, string articleId)
		{
			ExportService exportSrv = new ExportService();
			return exportSrv.exportArticle(type, articleId);
		}
    }
}
