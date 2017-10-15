using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Tools
{
    public static class Brack
    {
        //获取配对括号中的内容
        public static List<SQLBracketPair> GetBracketList(string strIn)
        {
            List<SQLBracketPair> list2 = new List<SQLBracketPair>();
            List<SQLBracket> list = new List<SQLBracket>();
            bool isStartValue = false;
            int i = 0;

            //将所有的括号按照前后顺序找出来，放到一个List里边
            foreach (char str in strIn)
            {
                //如果遇到单引号，则不添加到List,除非单引号成对出现以后
                if (str.ToString() == "'")
                {
                    isStartValue = !isStartValue;
                }

                if (str.ToString() == "{" || str.ToString() == "}")
                {
                    //单引号成对出现之后，才允许添加到list
                    if (!isStartValue)
                    {
                        list.Add(new SQLBracket(str.ToString(), i));
                    }
                }

                i++;
            }

            //如果左、右括号不是成对出现的,返回null
            if (list.Count % 2 != 0)
            {
                return null;
            }

            //获取左、右括号对
            if (list.Count > 0)
			{
				SQLBracketPair item = null;
                //使用一个双遍历，首先获取左括号，然后查找右括号
                for (int k = 0; k < list.Count; k++)
                {
                    //如果是左括号
                    if (list[k].Code == "{")
                    {
                        //考虑到括号嵌套的可能性，需要计算配对括号之间还有多少括号需要配对
                        int distanceleft = 0;
                        int distanceRight = 0;

                        for (int j = k + 1; j < list.Count; j++)
                        {
                            //如果在左括号之后发现右括号之前又发现左括号，计数
                            if (list[j].Code == "{")
                            {
                                distanceleft++;
                            }

                            //如果发现右括号
							if (list[j].Code == "}")
							{
								//检查右括号是否和左括号级次相等，如相等将左括号和右括号添加到配对表中，并跳出查找右括号的循环
								if (distanceRight == distanceleft)
								{
									item = new SQLBracketPair(list[k], list[j], strIn.Substring(list[k].Index + 1, list[j].Index - list[k].Index - 1));
									if (list2.Where(u => u.Include.ToLower() == item.Include.ToLower()).Count<SQLBracketPair>() <= 0)
									{
										list2.Add(item);
									}
									break;
								}
								//如果还不是匹配的右括号，计数
								distanceRight++;
							}
                        }
                    }
                }
            }

            return list2;
        }
        public static List<SQLBracketPair> GetFangList(string strIn)
        {
            List<SQLBracketPair> list2 = new List<SQLBracketPair>();
            List<SQLBracket> list = new List<SQLBracket>();
            bool isStartValue = false;
            int i = 0;

            //将所有的括号按照前后顺序找出来，放到一个List里边
            foreach (char str in strIn)
            {
                //如果遇到单引号，则不添加到List,除非单引号成对出现以后
                if (str.ToString() == "'")
                {
                    isStartValue = !isStartValue;
                }

                if (str.ToString() == "[" || str.ToString() == "]")
                {
                    //单引号成对出现之后，才允许添加到list
                    if (!isStartValue)
                    {
                        list.Add(new SQLBracket(str.ToString(), i));
                    }
                }

                i++;
            }

            //如果左、右括号不是成对出现的,返回null
            if (list.Count % 2 != 0)
            {
                return null;
            }

            //获取左、右括号对
            if (list.Count > 0)
			{
				SQLBracketPair item = null;
                //使用一个双遍历，首先获取左括号，然后查找右括号
                for (int k = 0; k < list.Count; k++)
                {
                    //如果是左括号
                    if (list[k].Code == "[")
                    {
                        //考虑到括号嵌套的可能性，需要计算配对括号之间还有多少括号需要配对
                        int distanceleft = 0;
                        int distanceRight = 0;

                        for (int j = k + 1; j < list.Count; j++)
                        {
                            //如果在左括号之后发现右括号之前又发现左括号，计数
                            if (list[j].Code == "[")
                            {
                                distanceleft++;
                            }

                            //如果发现右括号
                            if (list[j].Code == "]")
                            {
                                //检查右括号是否和左括号级次相等，如相等将左括号和右括号添加到配对表中，并跳出查找右括号的循环
                                if (distanceRight == distanceleft)
                                {
									item = new SQLBracketPair(list[k], list[j], strIn.Substring(list[k].Index + 1, list[j].Index - list[k].Index - 1));
									if (list2.Where(u => u.Include.ToLower() == item.Include.ToLower()).Count<SQLBracketPair>() <= 0)
									{
										list2.Add(item);
									}
                                    break;
                                }
                                //如果还不是匹配的右括号，计数
                                distanceRight++;
                            }
                        }
                    }
                }
            }

            return list2;
        }
        ///
        /// 定义一个括号
        ///
        public class SQLBracket
        {
            public SQLBracket(string code, int index)
            {
                Code = code;
                Index = index;
            }

            public string Code { get; set; }
            public int Index { get; set; }
        }

        ///
        /// 定义一个括号对
        ///
        public class SQLBracketPair
        {
            public SQLBracketPair(SQLBracket leftBracket, SQLBracket rightBracket, string include)
            {
                LeftBracket = leftBracket;
                RightBracket = rightBracket;
                Include = include;
            }

            public SQLBracket LeftBracket { get; set; }
            public SQLBracket RightBracket { get; set; }
            public string Include { get; set; }
        }

    }
}