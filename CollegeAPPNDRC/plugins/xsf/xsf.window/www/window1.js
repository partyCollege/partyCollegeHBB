cordova.define("xsf.window", function(require, exports, module) {
               var exec = require('cordova/exec');
               var channel = require('cordova/channel');
               var modulemapper = require('cordova/modulemapper');
               var urlutil = require('cordova/urlutil');
               
               
               function onSucceed(args){
		//alert("succeed:" + args);
	}
	function onError(err){
		//alert("error:" + err);
	}

	function InAppBrowser() {
   		this.channels = {
	        'loadstart': channel.create('loadstart'),
	        'loadstop' : channel.create('loadstop'),
	        'loaderror' : channel.create('loaderror'),
	        'exit' : channel.create('exit')
   		};
	}	

	InAppBrowser.prototype = {
	    _eventHandler: function (event) {
	        if (event.type in this.channels) {
	            this.channels[event.type].fire(event);
	        }
	    },
	    addEventListener: function (eventname,f) {
	        if (eventname in this.channels) {
	            this.channels[eventname].subscribe(f);
	        }
	    },
	    removeEventListener: function(eventname, f) {
	        if (eventname in this.channels) {
	            this.channels[eventname].unsubscribe(f);
	        }
	    }
	}
	function call(callee,args,callback){
		callback = callback || onSucceed;

		exec(callback,onError, "WindowPlugin", callee,args);
	}

	//var exec = require('cordova/exec');
	module.exports = {
		open : function(url,title){
			if(url.indexOf(":")<0){
				var href = window.location.href;
				var p = href.lastIndexOf("/");
				if(p > 0){
					url = href.substring(0,p+1) + url;
				}
			}
			//alert(url);
			//call('open',[url,title]);
			var iab = new InAppBrowser();
	    	var cb = function(eventname) {
	       		iab._eventHandler(eventname);
	    	};
	    	exec(cb, cb, "WindowPlugin", "open", [url]);
    		return iab;
            //return window.open(url, '_blank', 'location=no,closebuttoncaption=关闭');
		},
        close : function(n,callback){
            call('close',n?[n]:[],callback);
        }
               
	};

});
