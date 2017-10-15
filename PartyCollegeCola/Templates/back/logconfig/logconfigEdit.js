angular.module("myApp")
.controller("logconfigEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
    	$scope.goToList = function () {
    		$state.go("index.score");
    	}
    }]);