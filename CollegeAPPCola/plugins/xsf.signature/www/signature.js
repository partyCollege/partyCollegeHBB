cordova.define("xsf.signature", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "SignaturePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		show : function(onSucceed,onError){
			call('show',[],onSucceed,onError);
        }
	};

});
