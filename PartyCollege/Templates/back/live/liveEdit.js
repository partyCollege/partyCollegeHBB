angular.module("myApp")
.controller("liveEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {
    $scope.live = {};
    $(function () {
        $('.clockpicker').clockpicker({
            default: "now"
        });
    });
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }	
    if ($stateParams.id)
    {
    	$scope.nowid = $stateParams.id;
        getDataSource.getDataSource("selectLiveById", { id: $stateParams.id }, function (data) {
            $scope.live = data[0];
            $scope.live.starttime_min = $filter('date')($scope.live.starttime, 'HH:mm');
            $scope.live.endtime_min = $filter('date')($scope.live.endtime, 'HH:mm');
            $scope.nowfile = FilesService.showFile("livePhoto", $scope.live.pic_servername, $scope.live.pic_servername);
        });
    }
    $scope.saveButtonDisabled = false;
    $scope.save = function () {
    	$scope.saveButtonDisabled = true;
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "livePhoto", width: 200, height: 150 }, function (data) {
                $scope.live.pic_servername = data.data[0].servername;
                doSaveData();
            });
        }
        else {
            doSaveData();
        }
    }
    var doSaveData = function () {

        if ($stateParams.id) {
            var p = $http.post("../api/Live", $scope.live);
            p.then(function (data) {
            	$scope.saveButtonDisabled = false;
                //getDataSource.getDataSource("deleteLiveRelation", { id: $stateParams.id}, function () {
                //    getDataSource.getDataSource("insertLiveRelation", { id: getDataSource.getGUID(), liveid: $scope.live.id, category: $scope.live.area }, function (d) {
                //    });
                //});
                getDataSource.getDataSource("updateLive", $scope.live, function (data) {
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                });
            });
        }
        else {
            $scope.live.starttime = CommonService.addMiniuts($scope.live.starttime, $scope.live.starttime_min);
            $scope.live.endtime = CommonService.addMiniuts($scope.live.endtime, $scope.live.endtime_min);
            var p = $http.post("../api/Live", $scope.live);
            p.then(function (data) {
            	$scope.saveButtonDisabled = false;
                $scope.live.sourceurl = data.data.sourceUrl;
                $scope.live.playurl = "http://e.vhall.com/" + data.data.id;
                $scope.live.vhallid = data.data.id;
                $scope.live.id = getDataSource.getGUID();
                //getDataSource.getDataSource("insertLiveRelation", { id: getDataSource.getGUID(), liveid: $scope.live.id, category: $scope.live.area }, function (d) {
                //});
                getDataSource.getDataSource("insertLive", $scope.live, function (data) {
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });

                    $state.go("index.liveEdit", { id: $scope.live.id });
                });
            });
        }
    }

    $scope.goPlatformEdit = function () {
    	if ($stateParams.id) {
    		$state.go("index.liveEdit", { id: $stateParams.id });
    	}
    	else {
    		$state.go("index.liveEdit");
    	}
    }

    $scope.goTabList = function () {
    	var nowRouter = "index.liveEdit.liverange";
    	$state.go(nowRouter);
    }
}]);