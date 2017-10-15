cordova.define("xsf.contactsList", function(require, exports, module) {
               function onSucceed(args){
               //alert("succeed:" + args);
               }
               function onError(err){
               //alert("error:" + err);
               }
               function call(callee,args,succeedCallback,errorCallback){
               onSucceed = succeedCallback || onSucceed;
               onError = errorCallback || onError;
               exec(onSucceed,onError, "ShowContactsList", callee,args);
               }
               var exec = require('cordova/exec');
               module.exports = {
               showContactsList : function(options,onSucceed,onError){
               call('showContactsList',[options],onSucceed,onError);
               }
               
               };
               
               });
