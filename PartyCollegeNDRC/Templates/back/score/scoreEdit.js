angular.module("myApp")
.controller("scoreEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.score = {};
        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("selectDimensionConfigById", { id: $stateParams.id }, function (data) {
                    $scope.score = data[0];
                });
            }
        }();

        $scope.addDisabled = false;
        $scope.save = function () {
        	$scope.addDisabled = true;
        	if ($scope.score.dimension == "" || $scope.score.dimension == undefined || $scope.score.dimension == null) {
        		notify({ message: '请选择维度名称！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        		$scope.addDisabled = false;
                return;
            }
            if ($scope.score.eventname == "" || $scope.score.eventname == undefined || $scope.score.eventname == null) {
            	notify({ message: '加分项不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.score == "" || $scope.score.score == undefined || $scope.score.score == null) {
            	notify({ message: '分值不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.limittype == "" || $scope.score.limittype == undefined || $scope.score.limittype == null) {
            	notify({ message: '请选择限制类型！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.maxscore == "" || $scope.score.maxscore == undefined || $scope.score.maxscore == null) {
            	notify({ message: '最高得分不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($stateParams.id) {
                var msg = '保存成功';
                getDataSource.getDataSource("updateDimensionConfigById", $scope.score, function (data) {
                	$scope.addDisabled = false;
                    notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (error) { $scope.addDisabled = false; });
            }
            else {
                var scoreid = getDataSource.getGUID();
                $scope.score.id = scoreid;
                getDataSource.getDataSource("insertDimensionConfig", $scope.score, function (data) {
                	$scope.addDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.score", {});
                }, function (error) { $scope.addDisabled = false; });
            }
        }

        $scope.goToList = function () {
            $state.go("index.score");
        }

        $scope.inputKeyDown = function (e) {
            var ss = window.event || e;
            if (!((ss.keyCode > 47 && ss.keyCode < 58) || ss.keyCode == 8)) {
                ss.preventDefault();
            }
        }
    }]);