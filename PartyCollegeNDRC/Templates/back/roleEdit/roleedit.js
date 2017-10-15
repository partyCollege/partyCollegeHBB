angular.module("myApp")
.controller("roleEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
	$scope.roleForm = new Object();
	$scope.roleForm.name = '';
	$scope.roleForm.enable = false;
	$scope.roleForm.syslevel = false;
	$scope.roleForm.platform = new Object();//存放平台
	$scope.saveButtonDisabled = false;

	//如果是分平台，则不能修改角色所属平台。
	if ($rootScope.user.platformcategory == "0") {
		$scope.choosePlatform = true;
		$scope.chooseSysLevel = true;
	}
	
	var roleid = $stateParams.id;
	if (roleid!=undefined&& roleid != "") {
		//编辑，获取表单信息
		getDataSource.getDataSource("getSigleRole", { roleid: roleid }, function (data) {
			$scope.roleForm = data[0];
			$scope.roleForm.enable = (data[0].enable == 1) ? true : false;
			$scope.roleForm.syslevel = (data[0].syslevel == 1) ? true : false;
			var tempplatform = new Array();
			var length = data.length;
			var platobj = new Object();
			for (var i = 0; i < length; i++) {
				platobj = new Object();
				platobj.id = data[i].platformid;
				platobj.name = data[i].platformname;
			}
			$scope.roleForm.platform = platobj;

		}, function (errortemp) { });
	} else {
		var platobj = new Object();
		platobj.id = $rootScope.user.platformid;
		platobj.name = $rootScope.user.platformname;
		$scope.roleForm.platform = platobj;
	}
		//选择管理员
	getDataSource.getDataSource("selectAllPlatform", {}, function (data) {
		var tempplatform = new Array();
		var length = data.length;
		for (var i = 0; i < length; i++) {
			tempplatform.push({ id: data[i].id, name: data[i].name });
		}
		$scope.platforms = tempplatform;
	}, function (errortemp) { });

	$scope.goToList = function () {
		$state.go("index.role");
	}

	$scope.saveRole = function () {
		$scope.saveButtonDisabled = true;
		//console.log( $scope.roleForm);
		if ($scope.roleForm.name == "" || $scope.roleForm.name.length <= 0) {
			$scope.saveButtonDisabled = false;
			notify({ message: '角色名称不能为空', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			return;
		}

		getDataSource.getUrlData('../api/Permission/SaveRole', $scope.roleForm, function (datatemp) {
			$scope.saveButtonDisabled = false;
			if (datatemp.code == "success") {
				notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			} else {
				notify({ message: datatemp.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}
		}, function (errortemp) {
			$scope.saveButtonDisabled = false;
		});
	}

	getDataSource.getDataSource(["getAllPermission", "getAllPermissionGroup", "getRolePermission"], { roleid: roleid }, function (data) {
		var groupdata = _.find(data, { name: 'getAllPermissionGroup' }).data;
		var permissiondata = _.find(data, { name: 'getAllPermission' }).data;
		var rolePermission = _.find(data, { name: 'getRolePermission' }).data;
		var length = groupdata.length;
		var groupname = '';
		$scope.roleForm.permissionGroupList = new Array();
		for (var i = 0; i < length; i++) {
			groupname = groupdata[i].groupname;
			category = groupdata[i].category;
			var permissionTemp = _.filter(permissiondata, { groupname: groupname });
			var templength = permissionTemp.length;
			for (var j = 0; j < templength; j++) {
				var chkobj = _.find(rolePermission, { permissionid: permissionTemp[j].id });
				if (chkobj != null) {
					permissionTemp[j].selected = true;
				}
			}
			$scope.roleForm.permissionGroupList.push({ groupname: groupname,category:category, permissionArray: permissionTemp });
		}
	}, function (errortemp) { });
}]);