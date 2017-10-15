app.controller('IeTest2Ctrl', ['$rootScope', '$http', '$scope', '$timeout', '$state', '$stateParams'
, function ($rootScope, $http, $scope, $timeout, $state, $stateParams) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ id: i, name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000 / 2; i++) {
			$scope.datalist.push({ id: i, name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k('Btn2_'); 
	$scope.HrefTo = function (statename) {
		//console.log(statename);
		$state.go(statename)
	}
}])