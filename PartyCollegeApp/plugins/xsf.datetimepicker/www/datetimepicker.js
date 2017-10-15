cordova.define("xsf.datetimepicker", function(require, exports, module) {

	function onSucceed(args){
		alert("succeed:" + args);
	}
	function onError(err){
		alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError,"DateTimePickerPlugin", callee,args);
	}	
	var exec = require('cordova/exec');
	module.exports = {
    		pick:function(dateType,defauleDate,startDate,endDate,onSucceed,onError){	
    			call("pick", [dateType,defauleDate,startDate,endDate],onSucceed,onError);
			}
	};
});