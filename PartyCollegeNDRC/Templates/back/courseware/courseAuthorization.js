angular.module("myApp")
.controller("courseAuthorizationController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.authorizationinfo = {
        id: "",
        authorizedate: null,
        authorizefile_servername: "",
        coursewareid: $stateParams.id,
        teachername: "",
        authorizefilename: "",
        examination: "",
        examdate: null,
        examfile_servername: "",
        examfilename: "",
        files: {}
    }

    $scope.loadAuth = function () {
        getDataSource.getDataSource("select_sy_courseware_authbycoursewareid", { coursewareid: $scope.authorizationinfo.coursewareid }, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.authorizationinfo = data[0];
        })
    }

    $scope.loadAuth();

    //上传审批文件
    $scope.uploadAuthFiles = function (files) {
        FilesService.upLoadFiles(files[0], "authAttach", function (data) {
            $scope.authorizationinfo.authorizefilename = data.data[0].filename;
            $scope.authorizationinfo.authorizefile_servername = data.data[0].servername;
        });
    }

    //上传批准文件
    $scope.uploadExamFiles = function (files) {
        FilesService.upLoadFiles(files[0], "authAttach", function (data) {
            $scope.authorizationinfo.examfilename = data.data[0].filename;
            $scope.authorizationinfo.examfile_servername = data.data[0].servername;
        });
    }

    //保存
    $scope.saveAuth = function () {
        //if ($scope.authorizationinfo.teachername == undefined || $scope.authorizationinfo.teachername == "" || $scope.authorizationinfo.examination == "") {
        //    notify({ message: '授权人和批准人必须填写一个！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        ////判断文件是否上传
        //if ($scope.authorizationinfo.authorizefilename == undefined || $scope.authorizationinfo.authorizefilename == "") {
        //    notify({ message: '请上传授权文件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        //if ($scope.authorizationinfo.examfile_servername == undefined || $scope.authorizationinfo.examfile_servername == "") {
        //    notify({ message: '请上传批准文件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        if ($scope.authorizationinfo.id) {
            //更新
            getDataSource.getDataSource("update_sy_courseware_auth", {
                id: $scope.authorizationinfo.id,
                authorizedate: $scope.authorizationinfo.authorizedate,
                authorizefile_servername: $scope.authorizationinfo.authorizefile_servername,
                coursewareid: $scope.authorizationinfo.coursewareid,
                teachername: $scope.authorizationinfo.teachername,
                authorizefilename: $scope.authorizationinfo.authorizefilename,
                examination: $scope.authorizationinfo.examination,
                examdate: $scope.authorizationinfo.examdate,
                examfile_servername: $scope.authorizationinfo.examfile_servername,
                examfilename: $scope.authorizationinfo.examfilename,
            }, function (data) {
                if (!$scope.savefase)
                    notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
        else {
            $scope.authorizationinfo.id = getDataSource.getGUID();
            //新增
            getDataSource.getDataSource("insert_sy_courseware_auth", {
                id: $scope.authorizationinfo.id,
                authorizedate: $scope.authorizationinfo.authorizedate,
                authorizefile_servername: $scope.authorizationinfo.authorizefile_servername,
                coursewareid: $scope.authorizationinfo.coursewareid,
                teachername: $scope.authorizationinfo.teachername,
                authorizefilename: $scope.authorizationinfo.authorizefilename,
                examination: $scope.authorizationinfo.examination,
                examdate: $scope.authorizationinfo.examdate,
                examfile_servername: $scope.authorizationinfo.examfile_servername,
                examfilename: $scope.authorizationinfo.examfilename,
            }, function (data) {
                if (!$scope.savefase)
                    notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }

    $scope.authMessage = "";
    $scope.authmessageshow = false;
    $scope.savefase = false;
    //授权
    $scope.saveAuthSuccess = function () {
        $scope.savefase = true;
        $scope.saveAuth();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 4, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件授权", nextstep: "课件编辑", operationcontent: ($rootScope.user.name + "授权成功，等待编辑课件").toString()
        }, function (data) {
            if (data) {
                notify({ message: '授权成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '授权失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '授权失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //授权失败
    $scope.saveAuthError = function () {
        $scope.savefase = true;
        $scope.saveAuth();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: -2, operationuser: $rootScope.user.name,
            userid: $rootScope.user.accountId, currentstep: "课件授权", nextstep: "课件删除",
            operationcontent: ($rootScope.user.name + "已删除，删除原因：" + $scope.course.deleteContent).toString(),
            deleteContent: $scope.course.deleteContent, laststatus: 3
        }, function (data) {
            if (data) {
                notify({ message: '授权失败成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '授权失败失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '授权失败失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //弹出授权消息
    $scope.saveAuthMessage = function () {
        $scope.authmessageshow = true;
        $scope.authMessage = "失败理由";
        $scope.modalInstance = $modal.open({
            templateUrl: 'authmessagepeview.html',
            size: 'lg',
            scope: $scope
        });
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    //查看授权文件
    $scope.openSFile = function () {
        FilesService.downFiles("authAttach", $scope.authorizationinfo.authorizefile_servername, $scope.authorizationinfo.authorizefile_servername);
    }
    //查看批准文件
    $scope.openPFile = function () {
        FilesService.downFiles("authAttach", $scope.authorizationinfo.examfile_servername, $scope.authorizationinfo.examfile_servername);
    }
}]);