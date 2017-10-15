cordova.define("xsf.datasync", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "DataSyncPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
		dataSync : function(onSucceed,onError){
			call('dataSync',[],onSucceed,onError);
        }, upload : function(onSucceed,onError){
        	call('upload',[],onSucceed,onError);
        }
	};
});
