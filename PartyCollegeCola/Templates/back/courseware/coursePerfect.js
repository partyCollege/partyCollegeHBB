angular.module("myApp")
.controller("coursePerfectsController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.fale = false;
    //保存主讲人介绍
    $scope.saveTeacherContent = function () {
        getDataSource.getDataSource("update_sy_courseware_teachercontent", { id: $stateParams.id, teachercontent: $scope.course.teachercontent }, function (data) {
            if (!$scope.fale)
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.fale = false;
        });
    }


    $scope.commitPerfectCourse = function () {
        $scope.fale = true;
        $scope.saveTeacherContent();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 6, operationuser: $rootScope.user.name,userid: $rootScope.user.accountId, currentstep: "课件完善", nextstep: "课件分类入库", operationcontent: ($rootScope.user.name + "已完善课件信息，等待分类入库").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }
}]);