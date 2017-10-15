cordova.define("xsf.store", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "StorePlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		get : function(key,defaultValue,onSucceed,onError){
			if(typeof(defaultValue) == "function"){//考虑兼容
				onSucceed = defaultValue;
				defaultValue = null;
				onError = null;
			}
			call('get',[key,defaultValue],onSucceed,onError);
        },set : function(key,value,onSucceed,onError){
            call('set',[key,value],onSucceed,onError);
        },remove : function(key,onSucceed,onError){
            call('remove',[key],onSucceed,onError);
        },clear : function(onSucceed,onError){
            call('clear',[],onSucceed,onError);
        },save : function(data,onSucceed,onError){
        	call('save',[data],onSucceed,onError);
        },insert : function(data,filter,onSucceed,onError){
        	call('insert',[data],onSucceed,onError);
        },update : function(data,filter,onSucceed,onError){
        	call('update',[data,filter],onSucceed,onError);
        },delete : function(filter,onSucceed,onError){
        	call('delete',[filter],onSucceed,onError);
        },query : function(filter,onSucceed,onError){
        	call('query',[filter],onSucceed,onError);
        }
	};

});
