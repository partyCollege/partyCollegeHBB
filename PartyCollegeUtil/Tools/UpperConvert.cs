using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartyCollegeUtil.Tools
{
public class UpperConvert
{
    public  UpperConvert()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    //把数字转换为大写
        public static string numtoUpper(int num)
        {
            String str=num.ToString();
            string rstr = "";
            int n;
            for (int i = 0; i < str.Length; i++) 
            {
                n =Convert.ToInt16(str[i].ToString());//char转数字,转换为字符串，再转数字
                switch (n) 
                {
                    case 0:rstr=rstr+"零";break;
                    case 1:rstr=rstr+"一";break;
                    case 2:rstr=rstr+"二";break;
                    case 3:rstr=rstr+"三";break;
                    case 4:rstr=rstr+"四";break;
                    case 5:rstr=rstr+"五";break;
                    case 6:rstr=rstr+"六";break;
                    case 7:rstr=rstr+"七";break;
                    case 8:rstr=rstr+"八";break;
                    default:rstr=rstr+"九";break;
                }
            }
            return rstr;
        }
        //月转化为大写
        public static string monthtoUpper(int month)
        {
            if (month < 10)
            {
                return numtoUpper(month);
            }
            else
                if (month == 10) { return "十"; }
                else
                {
                    return "十" + numtoUpper(month - 10);
                }
        }
        //日转化为大写
        public static string daytoUpper(int day)
        {
            if (day < 20)
            {
                return monthtoUpper(day);
            }
            else
            {
                String str = day.ToString();
                if (str[1] == '0')
                {
                    return numtoUpper(Convert.ToInt16(str[0].ToString()))+"十" ;
                }
                else
                {
                    return numtoUpper(Convert.ToInt16(str[0].ToString())) + "十" 
                        + numtoUpper(Convert.ToInt16(str[1].ToString())); 
                }
            }
        }
        //日期转换为大写
        public static string  dateToUpper(System.DateTime date)
        { 
            int year = date.Year;
            int month = date.Month;
            int day = date.Day;
            return numtoUpper(year) + "年" + monthtoUpper(month) + "月" + daytoUpper(day) + "日";
        }
}
/// <summary>
/// MoneyConvert 的摘要说明
/// </summary>
public class MoneyConvert
{
    public MoneyConvert()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    public string GetUpper(string numstr)
    {
        try
        {
            decimal num = Convert.ToDecimal(numstr);
            return GetUpper(num);
        }
        catch
        {
            return "非数字形式！";
        }
    }
    public string GetUpper(int numint)
    {
        try
        {
            decimal num = Convert.ToDecimal(numint);
            return GetUpper(num);
        }
        catch
        {
            return "非数字形式！";
        }
    }
    /**/
    /// <summary> 
    /// 转换人民币大小金额 
    /// </summary> 
    /// <param name="num">金额</param> 
    /// <returns>返回大写形式</returns> 
    public string GetUpper(decimal num)
    {
        string strUpperMum = "零壹贰叁肆伍陆柒捌玖";            //0-9所对应的汉字 
        string strNumUnit = "万仟佰拾亿仟佰拾万仟佰拾元角分"; //数字位所对应的汉字 
        string strOfNum = "";    //从原num值中取出的值 
        string strNum = "";    //数字的字符串形式 
        string strReturnUpper = "";  //人民币大写金额形式 
        int i;    //循环变量 
        int sumLength;    //num的值乘以100的字符串长度 
        string ch1 = "";    //数字的汉语读法 
        string ch2 = "";    //数字位的汉字读法 
        int nzero = 0;  //用来计算连续的零值是几个 
        int temp;            //从原num值中取出的值
        num = Math.Round(Math.Abs(num), 2);    //将num取绝对值并四舍五入取2位小数 
        strNum = ((long)(num * 100)).ToString();        //将num乘100并转换成字符串形式 
        sumLength = strNum.Length;      //找出最高位 
        if (sumLength > 15) { return "溢出"; }
        strNumUnit = strNumUnit.Substring(15 - sumLength);   //取出对应位数的strNumUnit的值。如：200.55,sumLength为5所以strNumUnit=佰拾元角分
        //循环取出每一位需要转换的值 
        for (i = 0; i < sumLength; i++)
        {
            strOfNum = strNum.Substring(i, 1);          //取出需转换的某一位的值 
            temp = Convert.ToInt32(strOfNum);      //转换为数字 
            if (i != (sumLength - 3) && i != (sumLength - 7) && i != (sumLength - 11) && i != (sumLength - 15))
            {
                //当所取位数不为元、万、亿、万亿上的数字时 
                if (strOfNum == "0")
                {
                    ch1 = "";
                    ch2 = "";
                    nzero = nzero + 1;
                }
                else
                {
                    if (strOfNum != "0" && nzero != 0)
                    {
                        ch1 = "零" + strUpperMum.Substring(temp * 1, 1);
                        ch2 = strNumUnit.Substring(i, 1);
                        nzero = 0;
                    }
                    else
                    {
                        ch1 = strUpperMum.Substring(temp * 1, 1);
                        ch2 = strNumUnit.Substring(i, 1);
                        nzero = 0;
                    }
                }
            }
            else
            {
                //该位是万亿，亿，万，元位等关键位 
                if (strOfNum != "0" && nzero != 0)
                {
                    ch1 = "零" + strUpperMum.Substring(temp * 1, 1);
                    ch2 = strNumUnit.Substring(i, 1);
                    nzero = 0;
                }
                else
                {
                    if (strOfNum != "0" && nzero == 0)
                    {
                        ch1 = strUpperMum.Substring(temp * 1, 1);
                        ch2 = strNumUnit.Substring(i, 1);
                        nzero = 0;
                    }
                    else
                    {
                        if (strOfNum == "0" && nzero >= 3)
                        {
                            ch1 = "";
                            ch2 = "";
                            nzero = nzero + 1;
                        }
                        else
                        {
                            if (sumLength >= 11)
                            {
                                ch1 = "";
                                nzero = nzero + 1;
                            }
                            else
                            {
                                ch1 = "";
                                ch2 = strNumUnit.Substring(i, 1);
                                nzero = nzero + 1;
                            }
                        }
                    }
                }
            }
            if (i == (sumLength - 11) || i == (sumLength - 3))
            {
                //如果该位是亿位或元位，则必须写上 
                ch2 = strNumUnit.Substring(i, 1);
            }
            strReturnUpper = strReturnUpper + ch1 + ch2;
            if (i == sumLength - 1 && strOfNum == "0")
            {
                //最后一位（分）为0时，加上“整” 
                strReturnUpper = strReturnUpper + '整';
            }
        }
        if (num == 0)
        {
            strReturnUpper = "零元整";
        }
        return strReturnUpper;
    }
}
}