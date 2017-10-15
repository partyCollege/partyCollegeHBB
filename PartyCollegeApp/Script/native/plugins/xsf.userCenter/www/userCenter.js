cordova.define("xsf.userCenter", function(require, exports, module) {
               function onSucceed(args){
               //alert("succeed:" + args);
               }
               function onError(err){
               //alert("error:" + err);
               }
               function call(callee,args,succeedCallback,errorCallback){
               onSucceed = succeedCallback || onSucceed;
               onError = errorCallback || onError;
               exec(onSucceed,onError, "UserCenterPlugin", callee,args);
               }
               var exec = require('cordova/exec');
               module.exports = {
               showUserCenter : function(options,onSucceed,onError){
               call('showUserCenter',[options],onSucceed,onError);
               }
               
               };
               
               });
