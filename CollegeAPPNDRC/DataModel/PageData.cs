using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeAPP.DataModel
{
    public class PageData
    {
        public PageData()
        {
            hasButton = false;
            hasGoBack = false;
        }
        public string title { get; set; }
        public string keyColumn { get; set; }
        public int rows { get; set; }
        public bool nextNoData { get; set; }
        public bool hasDetail { get; set; }
        public bool hasGoBack { set; get; }
        public bool hasButton { set; get; }
        public bool gohref { set; get; }
        public string buttonHref { set; get; }
        public string buttonParams { set; get; }

        public string buttonTitle { set; get; }
        public string doScript { set; get; }
        private List<string> _searchColumn = new List<string>();

        public List<string> searchColumn
        {
            get { return _searchColumn; }
            set { _searchColumn = value; }
        }
        public bool needSearch { get; set; }
        private List<RowData> _listData = new List<RowData>();

        public List<RowData> listData
        {
            get { return _listData; }
            set { _listData = value; }
        }

        private RowData _detailData = new RowData();
        public RowData detailData
        {
            get { return _detailData; }
            set { _detailData = value; }
        }
    }

    public class RowData
    {
        public RowData()
        {
            attachs = new List<attachList>();
            linkParams = string.Empty;
            doScript = string.Empty;
            goHref = string.Empty;
        }
        public object keyData { get; set; }
        public int rownum { get; set; }
        public string goHref{set;get; }
        public string linkParams { set; get; }
        public string doScript { set; get; }
        private List<ListColumn> _rowListColumnData = new List<ListColumn>();

        public List<ListColumn> rowListColumnData
        {
            get { return _rowListColumnData; }
            set { _rowListColumnData = value; }
        }
        public List<attachList> attachs { set; get; }
        private List<DetailColumn> _rowDetailColumnData = new List<DetailColumn>();

        public List<DetailColumn> rowDetailColumnData
        {
            get { return _rowDetailColumnData; }
            set { _rowDetailColumnData = value; }
        }
    }

    public class PJRowData : RowData
    {
        public bool isfinshed { get; set; }
        public int ypItemCount { get; set; }
        public bool noclick { get; set; }
		public string kcid { get; set; }
		public string dyid { get; set; }
		public string formname { get; set; }
    }

    public class ListColumn
    {
        //public string title { get; set; }
        public object value { get; set; }
        public bool istitle { get; set; }
        public string filter { get; set; }
        public string format { get; set; }
        public string columntype { get; set; }
        public bool needPlay { set; get; }
    }

    public class DetailColumn
    {
        public DetailColumn()
        {
            subTitle = false;
            isHTML = false;
            isPic = false;
            src = string.Empty;
            
        }
        //public string title { get; set; }
        public object value { get; set; }

        public string filter { get; set; }
        public string format { get; set; }

        public string title { get; set; }
        public string isTitle { get; set; }

        public string src { get; set; }
        public string dataSource { get; set; }
        public string filename { get; set; }
        public bool isHTML { get; set; }
        public bool subTitle { set; get; }

        public bool isPic { set; get; }
        public string picRoot { set; get; }

        public string height { set; get; }
        public string width { set; get; }
    }

    public class attachList
    {
        public attachList()
        {
            attachs = new List<attach>();
        }
        public string source { set; get; }
        public List<attach> attachs { set; get; }
    }
    public class attach
    {
        public string filename { set; get; }
        public string filePath { set; get; }

        public string category { set; get; }
    }
}