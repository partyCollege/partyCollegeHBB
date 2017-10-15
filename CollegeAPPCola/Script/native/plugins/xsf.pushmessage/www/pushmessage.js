cordova.define("xsf.pushmessage", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "PushMessagePlugin", callee,args);
	}
	
	
	var exec = require('cordova/exec');
	module.exports = {
		startPushMessage : function(data,onSucceed,onError){
			call('startPushMessage',[data],onSucceed,onError);
        },stopPushMessage : function(onSucceed,onError){
			call('stopPushMessage',[],onSucceed,onError);
        }
	};
});
