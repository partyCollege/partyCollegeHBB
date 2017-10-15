cordova.define("xsf.mobile", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;
		exec(callback,onError, "MobilePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		telto : function(tel){
			call('telto',[tel]);
		},
		smsto : function(tel){
			call('smsto',[tel]);
		}
	};

});
