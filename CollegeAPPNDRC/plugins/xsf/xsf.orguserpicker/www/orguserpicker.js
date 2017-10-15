cordova.define("xsf.orguserpicker", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "OrgUserPickerPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
			pick : function(dataJson, parameterJson,onSucceed,onError){
			call('pick',[dataJson, parameterJson],onSucceed,onError);
        }
	};
});
