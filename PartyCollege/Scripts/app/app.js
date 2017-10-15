function getConfig() {

    var mainjs = document.getElementById("mainjs");
    var baseUrl = mainjs.getAttribute("baseUrl");
    var config = {
        baseUrl: baseUrl,
        paths: {
            "jquery": "bower_components/jquery/dist/jquery.js",
            "ng": "bower_components/angular/angular.min.js"
        }
    }
    return config;
}


window.doAppInit = function (deptList, appName,appInit) {
    function getRootPath_web() {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    }

    function addScript(src)
    {
        var oHead = document.getElementsByTagName('HEAD').item(0);

        var oScript = document.createElement("script");

        oScript.type = "text/javascript";

        oScript.src = src;

        oHead.appendChild(oScript);

    }
    var config = getConfig();
    for (var i = 0; i < deptList.length; i++) {
        if (config.paths[deptList[i]]) {
            var jsSrc = getRootPath_web() + "/" + config.paths[deptList[i]];
            addScript(jsSrc);
        }
    }
    appInit();
    //var myModule = angular.module('myModule', []);
}