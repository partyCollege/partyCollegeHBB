angular.module("myApp")
.controller("courseEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.course = { teachers: [] };
    $scope.courseware = {
        tipMessage: "",
        courseInfoShow: false,
        courseExamineShow: false,
        courseDistributionShow: false,
        courseEditShow: false,
        courseEditViewShow: false,
        courseAuthorizationEditShow: false,
        courseAuthorizationViewShow: false,
        courseEdShow: false,
        courseEdViewShow: false,
        coursePerfectEditShow: false,
        coursePerfectViewShow: false,
        courseStorageEditShow: false,
        courseStorageViewShow: false,
        courseDeleteMessageShow: false
    };

    $scope.setCourseWareType = function () {
        switch ($stateParams.type) {
            case "upload":
                $scope.courseware.mainstatus = 0;
                $scope.courseware.courseInfoShow = true;
                break;
            case "distribution":
                $scope.courseware.mainstatus = 1;
                $scope.courseware.courseExamineShow = true;
                break;
            case "examine":
                $scope.courseware.mainstatus = 2;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = true;
                break;
            case "authorization":
                $scope.courseware.mainstatus = 3;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationEditShow = true;
                break;
            case "wareedit":
                $scope.courseware.mainstatus = 4;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdShow = true;
                break;
            case "perfect":
                $scope.courseware.mainstatus = 5;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectEditShow = true;
                break;
            case "storage":
                $scope.courseware.mainstatus = 6;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectViewShow = true;
                $scope.courseware.courseStorageEditShow = true;
                break;
            case "formal":
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectViewShow = true;
                $scope.courseware.courseStorageViewShow = true;
                $scope.courseware.mainstatus = 7;
                break;
            case "waredelete":
                $scope.courseware.mainstatus = -2;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseDeleteMessageShow = true;
                break;
        }
    }

    $scope.setCourseWareType();

    if ($stateParams.id) {
        getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation"], { id: $stateParams.id }, function (data) {
            var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
            $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
            $scope.course.teachers = teachrRelation.data;
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);
            if ($scope.course.source == 1)
                $scope.course.sourcecn = "录制";
            else if ($scope.course.source == 2)
                $scope.course.sourcecn = "定制";

            if ($scope.course.videotype == 0)
                $scope.course.videotypecn = "单视频";
            else if ($scope.course.videotype == 1)
                $scope.course.videotypecn = "双视频";
            else if ($scope.course.videotype == 2)
                $scope.course.videotypecn = "单视频+PPT";
            $scope.course.deletestatuscn = "";
            switch ($scope.course.deletestatus) {
                case 1:
                    $scope.course.deletestatuscn = "待分配";
                    break;
                case 2:
                    $scope.course.deletestatuscn = "待审核";
                    break;
                case 3:
                    $scope.course.deletestatuscn = "待授权";
                    break;
                case 4:
                    $scope.course.deletestatuscn = "待编辑";
                    break;
                case 5:
                    $scope.course.deletestatuscn = "待完善";
                    break;
                case 6:
                    $scope.course.deletestatuscn = "待分类";
                    break;
            }

            $scope.course.teacherscn = "";
            $scope.course.teachercontent = "";
            for (var idx in $scope.course.teachers) {
                if ($scope.course.teachers[idx].name != undefined) {
                    $scope.course.teacherscn += $scope.course.teachers[idx].name + " ";
                }
                if ($scope.course.teachers[idx].comment != undefined)
                    $scope.course.teachercontent += $scope.course.teachers[idx].comment + "<br/>";
            }
        });
    }
    else {
        $scope.course.videotype = 0;
    }



    //推荐
    $scope.recommendCourse = function () {
        //验证课件是否可推荐
        if ($scope.comment != "") {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 3, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件审核", nextstep: "课件授权", operationcontent: ($rootScope.user.name + "已审核成功，等待授权").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '推荐成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    $scope.goback();
                }
                else
                    notify({ message: '推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
        else {
            notify({ message: '请填写课件简介！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }
    }

    //不推荐
    $scope.notRecommendCourse = function () {
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: -2, operationuser: $rootScope.user.name,
            userid: $rootScope.user.accountId, currentstep: "课件审核", nextstep: "课件删除",
            operationcontent: ($rootScope.user.name + "已删除，删除原因：" + $scope.course.deleteContent).toString(),
            deleteContent: $scope.course.deleteContent, laststatus: 2
        }, function (data) {
            if (data) {
                notify({ message: '不推荐成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.goback();
            }
            else
                notify({ message: '不推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '不推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //打开提示框
    $scope.openMessage = function (msg) {
        $scope.courseware.tipMessage = msg;
        $scope.modalInstance = $modal.open({
            templateUrl: 'messagepeview.html',
            size: 'lg',
            scope: $scope
        });
    }
    $scope.textareashow = false;
    $scope.recommendType = "";
    $scope.openRecommendCourse = function () {
        $scope.textareashow = false;
        $scope.recommendType = "recommend";
        $scope.openMessage("是否确认推荐该课件？");
    }

    $scope.openNotRecommendCourse = function () {
        $scope.textareashow = true;
        $scope.recommendType = "notrecommend";
        $scope.openMessage("不推荐理由");
    }
    //推荐和不推荐操作
    $scope.saveRecommendCourse = function () {
        if ($scope.recommendType == "recommend") {
            $scope.recommendCourse();
        }
        else if ($scope.recommendType == "notrecommend") {
            $scope.notRecommendCourse();
        }
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }

}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);