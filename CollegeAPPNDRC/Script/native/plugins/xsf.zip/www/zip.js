cordova.define("xsf.zip", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "ZipPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		zip : function(from,to,onSucceed,onError){
			call('zip',[from,to],onSucceed,onError);
        },unzip : function(from,to,onSucceed,onError){
            call('unzip',[from,to],onSucceed,onError);
        }
	};

});
