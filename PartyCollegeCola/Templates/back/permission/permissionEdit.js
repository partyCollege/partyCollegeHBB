app.controller("permissionEditController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state', '$stateParams', '$validation', 'notify'
	, function ($scope, $rootScope, $http, getDataSource, $state, $stateParams, $validation, notify) {
		//console.log(1);
		$scope.roleForm = new Object();
		$scope.roleForm.name = '';
		$scope.roleForm.groupname = '';
		$scope.roleForm.comment = '';
		$scope.roleForm.syslevel = false;
		$scope.roleForm.id = '';
		$scope.roleForm.category = '';
		var permissionId = $stateParams.id;
		if (permissionId!=undefined&& permissionId != "") {
			$scope.roleForm.id = permissionId;
			//编辑，获取表单信息
			getDataSource.getDataSource("getSinglePermission", { permissionid: permissionId }, function (data) {
				$scope.roleForm = data[0];
				$scope.roleForm.syslevel = (data[0].syslevel == 1) ? true : false;
			}, function (errortemp) { });
		}
		$scope.goToList = function () {
			$state.go("index.permission");
		}
		$scope.savePermssion = function () {
			getDataSource.getUrlData('../api/Permission/SavePermission', $scope.roleForm, function (datatemp) {
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.permissionEdit", { id: datatemp.id });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}
	}
]);