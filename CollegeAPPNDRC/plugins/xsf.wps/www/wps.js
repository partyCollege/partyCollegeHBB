cordova.define("xsf.wps", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
        onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "WPSPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		open : function(url,fileName,id,readOnly,revision,succeedCallback,errorCallback){
			call('open',[url,fileName,id,readOnly,revision],succeedCallback,errorCallback);
		}
	};

});
