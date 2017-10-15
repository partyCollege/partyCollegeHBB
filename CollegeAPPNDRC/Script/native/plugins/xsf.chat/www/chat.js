cordova.define("xsf.chat", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "ChatPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		openChat : function(options,onSucceed,onError){
			call('openChat',[options],onSucceed,onError);
        },openChatList : function(options,onSucceed,onError){
            call('openChatList',[options],onSucceed,onError);
        },syncChat : function(options,onSucceed,onError){
            call('syncChat',[options],onSucceed,onError);
        }
	};

});
