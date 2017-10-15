cordova.define("xsf", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "XSFPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		getDeviceId : function(callback){
			call('getDeviceId',[],callback);
		},getDeviceInfo : function(callback){
			call('getDeviceInfo',[],callback);
		},set : function(key,value){
			xsfStore.set(key,value);
		},get : function(key,defaultValue,callback){
			xsfStore.get(key,defaultValue,callback);
		},openApp : function(packageName,className,params){
			call('openApp',[packageName,className,params||{}]);
		},startService : function(ation,params){
			call('startService',[ation,params||{}]);
		},playVideo : function(url){
			call('playVideo',[url]);
		},openUrl : function(url){
			call('openUrl',[path]);
		},open:function(path){
			xsfFileOpener.open(path);
		},install:function(path,packageUri,onSucceed,onError){
			if(packageUri == undefined || packageUri == null || packageUri == ""){
				call('install',[path]);
			}else{
				call('install',[path,packageUri]);
			}
		},kill:function(){
			//call('kill',[]);
			exec(onSucceed,onError, "ChatPlugin", "kill",[]);
		}
	};
	//

});
