﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.34209
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace CollegeAPP.ServiceReference1 {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ServiceReference1.UserWebServiceSoap")]
    public interface UserWebServiceSoap {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/GetUserInfo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string GetUserInfo(string DateTime);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/GetConsumeByCardNo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string GetConsumeByCardNo(string password, string startTime, string endTime, string recordCnt, string PhyCardNo, string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/UpdateUserInfoByUserID", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string UpdateUserInfoByUserID(string UserInfo);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/UpdateUserInfo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string UpdateUserInfo(string password, string UserInfo);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/DeleteUserInfoByUserID", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string DeleteUserInfoByUserID(string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/DeleteUserInfo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string DeleteUserInfo(string password, string UserID);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface UserWebServiceSoapChannel : CollegeAPP.ServiceReference1.UserWebServiceSoap, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class UserWebServiceSoapClient : System.ServiceModel.ClientBase<CollegeAPP.ServiceReference1.UserWebServiceSoap>, CollegeAPP.ServiceReference1.UserWebServiceSoap
    {
        
        public UserWebServiceSoapClient() {
        }
        
        public UserWebServiceSoapClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public UserWebServiceSoapClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public UserWebServiceSoapClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public UserWebServiceSoapClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string GetUserInfo(string DateTime) {
            return base.Channel.GetUserInfo(DateTime);
        }
        
        public string GetConsumeByCardNo(string password, string startTime, string endTime, string recordCnt, string PhyCardNo, string UserID) {
            return base.Channel.GetConsumeByCardNo(password, startTime, endTime, recordCnt, PhyCardNo, UserID);
        }
        
        public string UpdateUserInfoByUserID(string UserInfo) {
            return base.Channel.UpdateUserInfoByUserID(UserInfo);
        }
        
        public string UpdateUserInfo(string password, string UserInfo) {
            return base.Channel.UpdateUserInfo(password, UserInfo);
        }
        
        public string DeleteUserInfoByUserID(string UserID) {
            return base.Channel.DeleteUserInfoByUserID(UserID);
        }
        
        public string DeleteUserInfo(string password, string UserID) {
            return base.Channel.DeleteUserInfo(password, UserID);
        }
    }
}
