angular.module("myApp")
.controller("planEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {

    var start = new Date().getFullYear();
    var end = start + 5;
    $scope.yearArr = [];
    for (var i = start; i <= end; i++) {
        $scope.yearArr.push(i);
    }


    $scope.plan = {
        id: "",
        year: start,
        orgcode: "",
        orgname: "",
        rankarr: [],
        stutytime: ""
    };

    //获取职级数据
    $scope.getLevelArr = function () {

        getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
            $scope.levelArr = _.find(data, { type: "职级" }).list;
        }, function (errortemp) { });

    }();

    $scope.checkRank = function (r) {
        var idx = $scope.plan.rankarr.indexOf(r.id);
        if (idx >= 0) {
            //alert("1");
            $scope.plan.rankarr.splice(idx, 1);
        } else {
            //alert("2");
            $scope.plan.rankarr.push(r.id);
        }
    }

    $scope.save = function () {

        $scope.exists(function () {

            getDataSource.getUrlData("../api/addplan", $scope.plan, function (data) {
                if (data.result) {
                    notify({ message: '添加成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                   // $timeout(function () {
                        $scope.golist();
                    //}, 1000);
                } else {
                    notify({ message: '添加失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }, function (errortemp) { });

        });
    }

    $scope.exists = function (callback) {

        getDataSource.getUrlData("../api/existsplan", $scope.plan, function (data) {
            if (data.result) { 
                if (callback) {
                    callback();
                }
            } else {
                var item = _.find($scope.levelArr, { id: data.rank });
                if (item) {
                    var msg = "[" + $scope.plan.orgname + "]" + $scope.plan.year + "[" + item.showvalue + "]" + "年度计划已制定";
                    notify({ message: msg, classes: 'warning', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        }, function (errortemp) { });
    }




    $scope.golist = function () {
        var nowRouter = "index.planlist";
        $state.go(nowRouter);
    }

    $scope.selectnode = function (node) {
        $scope.plan.orgcode = node.id;
        $scope.plan.orgname = node.name; 
    }

    
}]);