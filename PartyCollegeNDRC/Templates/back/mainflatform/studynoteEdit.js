angular.module("myApp")
.controller("studynoteEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.studynoteObj = new Object();
		var id = $stateParams.id;
		$scope.loadData = function () {
			getDataSource.getDataSource(["getStudyingsense"], { id: id }, function (data) {
				$scope.studynoteObj = data[0];
			}, function (errortemp) {
			});
		}
		$scope.loadData();
	}]);