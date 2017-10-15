angular.module("myApp")
.controller("senselearningEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.senselearningObj = new Object();
		var id = $stateParams.id;
		$scope.loadData = function () {
			getDataSource.getDataSource(["getClasscourseLearningsense"], { id: id }, function (data) {
				$scope.senselearningObj = data[0];
			}, function (errortemp) {
			});
		}
		$scope.loadData();
}]);