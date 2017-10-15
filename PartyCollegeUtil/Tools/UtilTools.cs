using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace PartyCollegeUtil.Tools
{
    public class UtilTools
    {
        public static string GetMd5Hash(string input)
        {
            MD5 md5Hash = MD5.Create();
            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("X2"));
            }
            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public static string IfNotEmpty(string v, string vnew)
        {
            return !string.IsNullOrEmpty(v) ? v : vnew;
        }

        private static bool In(int Lp, int Hp, int v)
        {
            return ((v <= Hp) && (v >= Lp));
        }


        public static String GetFirstChinessPY(String chinese)
        {
            char[] buffer = new char[chinese.Length];
            for (int i = 0; i < chinese.Length; i++)
            {
                buffer[i] = GetPY(chinese[i], "");
                //break;
            }
            return new String(buffer).Trim().ToUpper();
        }

        /// <summary>
        /// 获取一个汉字的拼音声母 
        /// </summary>
        /// <param name="chinese"></param>
        /// <returns></returns>
        private static char GetPY(Char chinese, string encodeformat)
        {
            string format = string.Empty;
            format = IfNotEmpty(encodeformat, "GB2312");
            Encoding gb2312 = Encoding.GetEncoding(format);
            Encoding unicode = Encoding.Unicode;

            // Convert the string into a byte[]. 
            byte[] unicodeBytes = unicode.GetBytes(new Char[] { chinese });
            // Perform the conversion from one encoding to the other. 
            byte[] asciiBytes = Encoding.Convert(unicode, gb2312, unicodeBytes);

            if (asciiBytes.Length <= 1)
            {
                return chinese;
            }
            // 计算该汉字的GB-2312编码 
            int n = (int)asciiBytes[0] << 8;
            n += (int)asciiBytes[1];

            // 根据汉字区域码获取拼音声母 
            if (In(0xB0A1, 0xB0C5, n)) return 'a';
            if (In(0XB0C5, 0XB2C1, n)) return 'b';
            if (In(0xB2C1, 0xB4EE, n)) return 'c';
            if (In(0xB4EE, 0xB6EA, n)) return 'd';
            if (In(0xB6EA, 0xB7A2, n)) return 'e';
            if (In(0xB7A2, 0xB8c1, n)) return 'f';
            if (In(0xB8C1, 0xB9FE, n)) return 'g';
            if (In(0xB9FE, 0xBBF7, n)) return 'h';
            if (In(0xBBF7, 0xBFA6, n)) return 'j';
            if (In(0xBFA6, 0xC0Ac, n)) return 'k';
            if (In(0xC0AC, 0xC2E8, n)) return 'l';
            if (In(0xC2E8, 0xC4C3, n)) return 'm';
            if (In(0xC4C3, 0xC5B6, n)) return 'n';
            if (In(0xC5B6, 0xC5BE, n)) return 'o';
            if (In(0xC5BE, 0xC6DA, n)) return 'p';
            if (In(0xC6DA, 0xC8BB, n)) return 'q';
            if (In(0xC8BB, 0xC8F6, n)) return 'r';
            if (In(0xC8F6, 0xCBFA, n)) return 's';
            if (In(0xCBFA, 0xCDDA, n)) return 't';
            if (In(0xCDDA, 0xCEF4, n)) return 'w';
            if (In(0xCEF4, 0xD1B9, n)) return 'x';
            if (In(0xD1B9, 0xD4D1, n)) return 'y';
            if (In(0xD4D1, 0xD7FA, n)) return 'z';
            return '*';
        }


        public static string SecondsToTime(int seconds)
        {
            // 计算
            int h = 0, i = 0, s = seconds;
            if (s > 60)
            {
                i = Convert.ToInt32(s / 60);
                s = Convert.ToInt32(s % 60);
                if (i > 60)
                {
                    h = Convert.ToInt32(i / 60);
                    i = Convert.ToInt32(i % 60);
                }
                if (s > 0)
                {
                    i = i + 1;
                }
            }
             
            return (h <= 9 ? "0" + h.ToString() : h.ToString()) + "小时" + (i <= 9 ? "0" + i.ToString() : i.ToString()) + "分钟";
        }
    }
}