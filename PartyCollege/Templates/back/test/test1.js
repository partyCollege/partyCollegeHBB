app.controller('IeTest1Ctrl', ['$rootScope', '$http', '$scope', '$timeout', '$state', '$stateParams'
, function ($rootScope, $http, $scope, $timeout, $state, $stateParams) {
	$scope.datalist = new Array();
	$scope.showtable = false;    
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			//$scope.datalist.push({ id:i, name: "test_" + btnname + "_1wsss_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
	    //var list = [];
	    //console.log(Date.now());
		$scope.datalist = new Array();
		//for (var i = 0; i < 1000/2; i++) {
		//    list.push({ id: i, name: btnname, sex: "男", age: "20" });
		//}
		$http.get("../testJSON/json1.json").success(function (data) {
		    $scope.datalist = data;
		})
		//$scope.datalist = list;
	}
	$scope.goSQL = function () {
	    $state.go("getSQL");
	};
	$scope.Change = function () {
		$scope.showtable = !$scope.showtable;
	}
	$scope.open1k('Btn1_');
	$scope.HrefTo = function (statename) {
		//console.log(statename);
		$state.go(statename)
	}
}])