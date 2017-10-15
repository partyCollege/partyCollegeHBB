using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Web.Security;

namespace PartyCollegeUtil.Tools
{
    public class Encrypt
    {
        private static readonly string keyString = "celap@wlxy";
        public Encrypt()
        { }

        #region TripleDES����
        /// <summary>
        /// TripleDES����
        /// </summary>
        public static string DESEncrypting(string strSource)
        {
            try
            {
                byte[] bytIn = Encoding.Default.GetBytes(strSource);
                byte[] key = Encoding.UTF8.GetBytes(keyString);
                byte[] IV = Encoding.UTF8.GetBytes(keyString);  //����ƫ����
                TripleDESCryptoServiceProvider TripleDES = new TripleDESCryptoServiceProvider();
                TripleDES.IV = IV;
                TripleDES.Padding = PaddingMode.PKCS7;
                TripleDES.Key = key;
                ICryptoTransform encrypto = TripleDES.CreateEncryptor();
                System.IO.MemoryStream ms = new System.IO.MemoryStream();
                CryptoStream cs = new CryptoStream(ms, encrypto, CryptoStreamMode.Write);
                cs.Write(bytIn, 0, bytIn.Length);
                cs.FlushFinalBlock();
                byte[] bytOut = ms.ToArray();
                return System.Convert.ToBase64String(bytOut);
            }
            catch (Exception ex)
            {
                throw new Exception("����ʱ����ִ���!������ʾ:\n" + ex.Message);
            }
        }
        #endregion

        #region TripleDES����
        /// <summary>
        /// TripleDES����
        /// </summary>
        public static string DESDecrypting(string Source)
        {
            try
            {
                byte[] bytIn = System.Convert.FromBase64String(Source);
                byte[] key = Encoding.UTF8.GetBytes(keyString);
                byte[] IV = Encoding.UTF8.GetBytes(keyString);  //����ƫ����
                TripleDESCryptoServiceProvider TripleDES = new TripleDESCryptoServiceProvider();
                TripleDES.IV = IV;
                TripleDES.Key = key;
                ICryptoTransform encrypto = TripleDES.CreateDecryptor();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(bytIn, 0, bytIn.Length);
                CryptoStream cs = new CryptoStream(ms, encrypto, CryptoStreamMode.Read);
                StreamReader strd = new StreamReader(cs, Encoding.Default);
                return strd.ReadToEnd();
            }
            catch (Exception ex)
            {
                throw new Exception("����ʱ����ִ���!������ʾ:\n" + ex.Message);
            }
        }
        #endregion

        /// <summary>
        /// MD5����
        /// </summary>
        /// <param name="input">�����ַ���</param>
        /// <param name="isUpper">32λ��Сд��Ĭ�ϴ�д</param>
        /// <returns></returns>
        public static string GetMD5_32(string input, bool isUpper = true)
        {
            byte[] result = System.Text.Encoding.Default.GetBytes(input);
            System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(result);

            string s1 = BitConverter.ToString(output).Replace("-", "");
            if (isUpper)
                return s1.ToUpper();
            else
                return s1.ToLower();
        }

        /// <summary>
        /// 16λMD5����
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string GetMD5_16(string input, bool isUpper = true)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            string s1 = BitConverter.ToString(md5.ComputeHash(UTF8Encoding.Default.GetBytes(input)), 4, 8).Replace("-", "");
            if (isUpper)
                return s1.ToUpper();
            else
                return s1.ToLower();
        }

        public static string SecurityPassword(string password, string userid)
        {
            //password = Encoding.Default.GetString(Convert.FromBase64String(password));
            //password = GetMD5_16(password, false);

			//string aaa = Encoding.Default.GetString(Convert.FromBase64String());
			string password_16 = Encrypt.GetMD5_32("dreamsoft", false);

			password = password.Substring(8, 16);
            password = GetMD5_32(password + userid, false);
            return password;
        }

    }
}