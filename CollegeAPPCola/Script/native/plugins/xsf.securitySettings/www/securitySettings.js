cordova.define("xsf.securitySettings", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "SecuritySettingsPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		openSecuritySettings : function(options,onSucceed,onError){
            call('openSecuritySettings',[options],onSucceed,onError);
        }
	};

});
