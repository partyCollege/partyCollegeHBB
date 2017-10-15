cordova.define("xsf.recognition", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succees,error){
		succees = succees || onSucceed;
		error = error || error;
		exec(succees,error, "RecognitionPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		start : function(succees,error){
			call('start',[],succees,error);
		}
	};

});
