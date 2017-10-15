cordova.define("com.phonegap.plugins.fileopener.FileOpener", function(require, exports, module) { /*
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2011, IBM Corporation
 */

/**
 * Constructor
 */
/*
function FileOpener() {
};

FileOpener.prototype.open = function(url) {

};
*/
/**
 * Load Plugin
 */
/*
if(!window.plugins) {
    window.plugins = {};
}

if (!window.plugins.fileOpener) {
    window.plugins.fileOpener = function (url) {
        cordova.exec(null, null, "FileOpener", "openFile", [url]);
    };
}
*/


var fileOpener = {
    open : function (url,contentType,title) {
        if(contentType == null || typeof(contentType)=="undefined"){
               var extName; //= /\.[^\.]+/.exec(url);
               var p = url.lastIndexOf(".");
               if(p > 0){
                    extName = url.substring(p+1);
               }
            if (extName == "doc" || extName == "docx") {
               contentType = "application/msword";
            } else if(extName == "pdf") {
                contentType = "application/pdf";
            } else if(extName == "ppt" || extName == "pptx") {
                contentType = "application/vnd.ms-powerpoint";
            } else if(extName == "xls" || extName == "xlsx") {
                contentType = "application/vnd.ms-excel";
            } else if(extName == "rtf") {
                contentType = "application/rtf";
            } else if(extName == "wav") {
                contentType = "audio/x-wav";
            } else if(extName == "gif") {
                contentType = "image/gif";
            } else if(extName == "jpg" || extName == "jpeg") {
                contentType = "image/jpeg";
            } else if(extName == "png") {
                contentType = "image/png";
            } else if(extName == "txt") {
                contentType = "text/plain";
            } else if(extName == "mpg" || extName == "mpeg" || extName == "mpe" || extName == "mp4" || extName == "avi"){
                contentType = "video/*";
            }               //
        }
        cordova.exec(null, null, "FileOpener", "openFile", [url,contentType,title]);
    }
};

module.exports = fileOpener;
});
