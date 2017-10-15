cordova.define("xsf.media", function(require, exports, module) {
	function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}
	function call(callee,args,succees,error){
		succees = succees || onSucceed;
		error = error || error;
		exec(succees,error, "MediaPlugin", callee,args);
	}
	var exec = require('cordova/exec');
	module.exports = {
		play : function(path,succees,error){
			call('play',[path],succees,error);
		},
		pause : function(succees,error){
			call('pause',[],succees,error);
		},
		resume : function(succees,error){
			call('resume',[],succees,error);
		},
		stop : function(succees,error){
			call('stop',[],succees,error);
		}
	};

});
