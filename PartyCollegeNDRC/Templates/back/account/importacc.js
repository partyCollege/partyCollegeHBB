app.controller("importaccController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, CommonService) {
	$scope.acclist = new Array();
	$scope.textareastr = '';
	$scope.disableBtn = false;
	$scope.errorlist = new Array();
	$scope.importAccount = function () {
		$scope.disableBtn = true;
		$scope.beginLoading = !$scope.beginLoading;
		var data = $scope.textareastr.replace(new RegExp(/(	)/g), ',');
		var dataarray = data.split('\n');
		var length = dataarray.length;
		var datarow = new Array();
		//var submitrow = new Object();
		var submitdata = new Array();
		for (var i = 0; i < length; i++) {
			datarow = dataarray[i].split(',');
			datarow[2]=md5(datarow[2]);
			submitdata.push(datarow);
		}

		getDataSource.getUrlData("../api/account/importAccount", { submitdata: submitdata }, function (datatemp) {
			$scope.disableBtn = false;
			$scope.beginLoading = false;
			if (datatemp.code == "success") {
				CommonService.alert(datatemp.message);
				//console.log(datatemp.errorlist);
				$scope.errorlist = datatemp.errorlist;
			} else {
				CommonService.alert(datatemp.message);
			}
		}, function (errortemp) {
			
			$scope.disableBtn = false;
			CommonService.alert("注册失败");
		});
	}
}]);