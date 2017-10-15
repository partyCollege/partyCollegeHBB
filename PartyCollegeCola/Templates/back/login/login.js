app.controller("loginController", ['$scope', '$http', '$state', '$stateParams', 'getDataSource', function ($scope, $http,$state, $stateParams, getDataSource) {
	$scope.loginObj = new Object();
	$scope.AccessLogin = function () {
		if ($scope.loginObj.logname.length == 0) { 
			alert("请输入用户名"); 
			return false;
		}
		if ($scope.loginObj.hashpwd.length == 0) {
			alert("请输入密码");  
			return false;
		}

		if ($scope.loginObj.remember) { 
             
		}  

		 

		getDataSource.getUrlData('../api/login', $scope.loginObj, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}

	$scope.GetUser = function () {
		getDataSource.getUrlData('../api/getuser', {userid:111}, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}
	$scope.Logout = function () {
		getDataSource.getUrlData('../api/logout', { userid: 111 }, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}
}])