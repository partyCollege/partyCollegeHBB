cordova.define("xsf.http", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "HttpPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		get : function(url,params,onSucceed,onError){
			call('get',[url,params,'text'],onSucceed,onError);
        },getJSON : function(url,params,onSucceed,onError){
            call('get',[url,params,'json'],onSucceed,onError);
        },post : function(url,params,onSucceed,onError){
            call('post',[url,params,'text'],onSucceed,onError);
        },postJSON : function(url,params,onSucceed,onError){
            call('post',[url,params,'json'],onSucceed,onError);
        },postData : function(url,data,onSucceed,onError){
            call('postData',[url,data,'json'],onSucceed,onError);
        },download : function(url,filePath,onSucceed,onError){
            //call('download',[url],onSucceed,onError);
            var fileTransfer = new xsf.FileTransfer();
            fileTransfer.download(
                url,
                filePath,
                onSucceed,
                onError,
                false,{}
            );
            return fileTransfer;
        },upload : function(path,url,onSucceed,onError){
            //call('upload',[path,url],onSucceed,onError);
            var fileTransfer = new xsf.FileTransfer();
            fileTransfer.upload(
                path,
                url,
                onSucceed,
                onError,
                {}
            );
            return fileTransfer;
        },ajax : function(options){
            if(options.dataType == 'jsonp'){
               options.dataType = 'json';
            }
            if(options.type == null ||
            	typeof(options.type) == "undefined"){
            	options.type = "get"
            }
            if(options.type == "GET" || options.type == "get" ){
                call('get',[options.url,options.data,options.dataType],options.success,options.error);
            }else if(options.type == "POST" || options.type == "post" ){
                call('post',[options.url,options.data,options.dataType],options.success,options.error);
            }
        }
        
	};

});
