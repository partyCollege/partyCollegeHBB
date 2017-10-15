app.controller('IeTest6Ctrl', ['$rootScope', '$http', '$scope', '$timeout'
, function ($rootScope, $http, $scope, $timeout) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
}])
