cordova.define("com.ue.box", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		/**
		 * 一共5个参数
		   第一个 :成功会掉
		   第二个 :失败回调
		   第三个 :将要调用的类的配置名字(在config.xml中配置 稍后在下面会讲解)
		   第四个 :调用的方法名(一个类里可能有多个方法 靠这个参数区分)
		   第五个 :传递的参数  以json的格式
		 */
		exec(callback,onError, "BoxPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		getDeviceId : function(){
			call('getDeviceId',[],function(deviceId){
				//return(deviceId);
			});
		},set : function(key,value){
			call('set',[key,value]);
		},get : function(key,defaultValue,callback){
		    call('get', [key, defaultValue], callback);
		},openApp : function(packageName,className,params){
			call('openApp',[packageName,className,params||{}]);
		},startService : function(ation,params){
			call('startService',[ation,params||{}]);
		},open : function(url){
			call('open',[url]);
		},playVideo : function(url){
			call('playVideo',[url]);
		},telto : function(phoneNum){
			call('telto',[phoneNum]);
		},smsto : function(phoneNum){
			call('smsto',[phoneNum]);
		}
	};

});
