using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
//down from 51aspx.com
namespace ucApi
{
    public class Func
    {
        /// <summary>
        /// �û�ע��
        /// </summary>
        /// <param name="username">�û���</param>
        /// <param name="password">����</param>
        /// <param name="email">�����ʼ�</param>
        /// <returns>
        /// ���� 0:�����û� ID����ʾ�û�ע��ɹ�
        /// -1:�û������Ϸ�
        /// -2:����������ע��Ĵ���
        /// -3:�û����Ѿ�����
        /// -4:Email ��ʽ����
        /// -5:Email ������ע��
        /// -6:�� Email �Ѿ���ע��
        /// </returns>
        public static int uc_user_register(string username, string password, string email)
        {
            Hashtable ht = new Hashtable();
            ht.Add("username",username);
            ht.Add("password",password);
            ht.Add("email",email);
            string result = client_php.uc_api_post("user", "register", ht);
            ht.Clear();

            return int.Parse(result);
        }

        /// <summary>
        /// �û���¼
        /// </summary>
        /// <param name="username">�û���</param>
        /// <param name="password">����</param>
        /// <returns>
        /// integer [0]:���� 0:�����û� ID����ʾ�û���¼�ɹ� -1:�û������ڣ����߱�ɾ�� -2:�����
        /// string [1]:�û���
        /// string [2]:����
        /// string [3]:Email
        /// bool [4]:�û����Ƿ�����
        /// </returns>
        public static RTN_UserLogin uc_user_login(string username, string password)
        {
            return uc_user_login(username, password, false);            
        }

        /// <summary>
        /// �û���¼
        /// </summary>
        /// <param name="username">�û���</param>
        /// <param name="password">����</param>
        /// <returns>
        /// integer [0]:���� 0:�����û� ID����ʾ�û���¼�ɹ� -1:�û������ڣ����߱�ɾ�� -2:�����
        /// string [1]:�û���
        /// string [2]:����
        /// string [3]:Email
        /// bool [4]:�û����Ƿ�����
        /// </returns>
        public static RTN_UserLogin uc_user_login(string username, string password, bool isuid)
        {
            Hashtable ht = new Hashtable();
            ht.Add("username", username); 
            ht.Add("password", password);                       
            ht.Add("isuid",isuid?1:0);
            string result = client_php.uc_api_post("user", "login", ht);
            ht.Clear();

            ht = client_php.uc_unserialize(result);
            return new RTN_UserLogin(int.Parse((string)ht[0]), (string)ht[1], (string)ht[2], (string)ht[3], "0".Equals((string)ht[4])?false:true);
        }

        /// <summary>
        /// �����û�����
        /// </summary>
        /// <param name="username">�û���</param>
        /// <param name="oldpw">������</param>
        /// <param name="newpw">�����룬�粻�޸�Ϊ��</param>
        /// <param name="email">Email���粻�޸�Ϊ��</param>
        /// <param name="ignoreoldpw">�Ƿ���Ծ����� 1:���ԣ��������ϲ���Ҫ��֤���� 0:(Ĭ��ֵ) �����ԣ�����������Ҫ��֤����
        /// <returns>
        /// 1:���³ɹ�
        /// 0:û�����κ��޸�
        /// -1:�����벻��ȷ
        /// -4:Email ��ʽ����
        /// -5:Email ������ע��
        /// -6:�� Email �Ѿ���ע��
        /// -7:û�����κ��޸�
        /// -8:���û��ܱ�����Ȩ�޸���
        /// </returns>
        public static int uc_user_edit(string username, string oldpw, string newpw, string email, bool ignoreoldpw)
        {
            Hashtable ht = new Hashtable();
            ht.Add("username",username);
            ht.Add("oldpw",oldpw);
            ht.Add("newpw",newpw);
            ht.Add("email",email);
            ht.Add("ignoreoldpw",ignoreoldpw);
            string result = client_php.uc_api_post("user", "edit", ht);
            ht.Clear();
            
            return int.Parse(result);
        }
    }
}
