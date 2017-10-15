using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml.Serialization;
using System.Xml;

namespace PartyCollegeUtil.config
{

    public sealed class XmlSerializerData
    {

        private XmlSerializerData() { }
        #region 序列化/反序列化

        #region 序列化
        /// <summary>
        /// 序列化
        /// </summary>
        /// <param name="cfg">序列化类型</param>
        /// <param name="cfg1">序列化对像</param>
        /// <param name="fileName">文件名称</param>
        public static void SerializerWriterXML(Type cfg, object cfg1, string path)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(cfg);
            TextWriter writer = new StreamWriter(path);
            xmlSerializer.Serialize(writer, cfg1);
            writer.Close();
        }
        /// <summary>
        /// 序列化
        /// </summary>
        /// <param name="cfg1">源(DataTable)</param>
        /// <param name="fileName">文件名</param>
        public static void SerializerWriterXML(object cfg1, string path)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(System.Data.DataTable));
            using (FileStream writer = new FileStream(path, FileMode.Create, FileAccess.ReadWrite))
            {
                xmlSerializer.Serialize(writer, cfg1);
            }
        }
        #endregion

        #region 序列化
        /// <summary>
        /// 序列化
        /// </summary>
        /// <param name="T">类型标识</param>
        /// <param name="objvalue">序列化对像</param>
        /// <param name="absPath">文件路径</param>
        public static bool SerializeItem<T>(T objvalue, string absPath)
        {
            try
            {
                // System.Runtime.Serialization.Formatters.Soap.SoapFormatter xmlSerializer = new System.Runtime.Serialization.Formatters.Soap.SoapFormatter();
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));

                if (!Directory.Exists(absPath.Substring(0, absPath.LastIndexOf("\\"))))
                {
                    Directory.CreateDirectory(absPath.Substring(0, absPath.LastIndexOf("\\")));
                }

                using (FileStream writer = new FileStream(absPath, FileMode.Create, FileAccess.ReadWrite))
                {
                    xmlSerializer.Serialize(writer, objvalue);
                }

            }
            catch
            {
                throw;
            }
            return true;
        }

        public static bool SerializeItems<T>(T objvalue, string absPath)
        {
            try
            {
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
                using (FileStream writer = new FileStream(absPath, FileMode.Create, FileAccess.ReadWrite))
                {
                    xmlSerializer.Serialize(writer, objvalue);
                }

            }
            catch
            {
                throw;
            }
            return true;
        }
        #endregion

        #region 反序列化
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <typeparam name="T">类型标识 class</typeparam>
        /// <param name="filePath">文件路径</param>
        /// <returns>类实体</returns>
        public static T DeserializeItem<T>(string str)
        {
            try
            {
                // System.Runtime.Serialization.Formatters.Soap.SoapFormatter xmlSerializer = new System.Runtime.Serialization.Formatters.Soap.SoapFormatter();
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));

                using (Stream reader = new MemoryStream(Encoding.Default.GetBytes(str)))
                {
                    T obj = (T)xmlSerializer.Deserialize(reader);
                    return obj;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// 从xml转化为对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="xml"></param>
        /// <returns></returns>
        public static T DeserializeXml<T>(string xml) where T : class
        {
            if (xml == null || xml == string.Empty)
            {
                return default(T);
            }
            XmlSerializer xs = new XmlSerializer(typeof(T));
            XmlTextReader xtr = new XmlTextReader(new StringReader(xml));
            object obj = xs.Deserialize(xtr);

            return obj as T;
        }

        #endregion

        #region 反序列化
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <param name="cfg">反序列化类型</param>
        /// <param name="fileName">文件名称</param>
        /// <returns>返回反序列化结果</returns>
        public static object SerializerReaderXML(Type cfg, string path)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(cfg);
            TextReader reader = new StreamReader(path);
            object cfg1 = xmlSerializer.Deserialize(reader);
            reader.Close();
            return cfg1;
        }
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <param name="fileName">文件名</param>
        /// <returns>返回DataTable</returns>
        public static System.Data.DataTable SerializerReaderXML(string path)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(System.Data.DataTable));
            System.Xml.XmlTextReader xtr = new System.Xml.XmlTextReader(path);
            System.Data.DataTable cfg1 = xmlSerializer.Deserialize(xtr) as System.Data.DataTable;
            xtr.Close();
            return cfg1;
        }
        /// <summary>
        /// 获取Config文件转成DataSet
        /// </summary>
        /// <param name="fileName">文件名</param>
        /// <returns>返回DataSet</returns>
        public static System.Data.DataSet SerializerReaderConfig(string path)
        {
            System.Data.DataSet ds = new System.Data.DataSet();
            ds.ReadXml(path);
            return ds;
        }
        #endregion

        #endregion


        /// <summary>
        /// 序列化对象
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="t">对象</param>
        /// <returns></returns>
        public static string Serialize<T>(T t)
        {
            string xml = string.Empty;
            //using (StringWriter sw = new StringWriter())
            //{
                XmlSerializer xz = new XmlSerializer(t.GetType());
                //xz.Serialize(sw, t);
                //return sw.ToString();
                using (MemoryStream mem = new MemoryStream())
                {
                    using (XmlTextWriter writer = new XmlTextWriter(mem, Encoding.UTF8))
                    {
                        writer.Formatting = Formatting.Indented;
                        XmlSerializerNamespaces n = new XmlSerializerNamespaces();
                        n.Add("", "");
                        xz.Serialize(writer, t, n);

                        mem.Seek(0, SeekOrigin.Begin);
                        using (StreamReader reader = new StreamReader(mem))
                        {
                            xml = reader.ReadToEnd();
                        }
                    }
                }

            //}
            return xml;
        }


        /// <summary>
        /// 反序列化
        /// </summary>
        /// <typeparam name="T">类型标识 class</typeparam>
        /// <param name="filePath">文件路径</param>
        /// <returns>类实体</returns>
        public static T DeserializeCofing<T>(string filePath)
        {
            try
            {
                // System.Runtime.Serialization.Formatters.Soap.SoapFormatter xmlSerializer = new System.Runtime.Serialization.Formatters.Soap.SoapFormatter();
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
                using (Stream reader = File.OpenRead(filePath))
                {
                    T obj = (T)xmlSerializer.Deserialize(reader);
                    return obj;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
