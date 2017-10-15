angular.module("myApp")
.controller("platformPermissionController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.platform = new Object();
		$scope.platform.adminaccount = new Array();//平台管理员

		$scope.loadform = function () {
			if ($stateParams.id) {
				$scope.nowid = $stateParams.id;
				getDataSource.getDataSource(["getPlatformInfo", "getPkgAdmin", "getPlatformPermission"]
				, { platformid: $scope.nowid, platformid2: $scope.nowid }, function (data) {
					//平台信息
					var pkginfo = _.find(data, { name: "getPlatformInfo" }).data;
					$scope.platform = pkginfo[0];

					//平台管理员
					var pkgadmin = _.find(data, { name: "getPkgAdmin" }).data;
					$scope.platform.pwd = "******";
					$scope.platform.adminaccount = pkgadmin[0];
					//分平台权限
					var pkgpermission = _.find(data, { name: "getPlatformPermission" }).data;
					//console.log("pkgpermission", pkgpermission);
					
					$scope.platform.permissionGroupList = $scope.permissionGroupList;
					///console.log("$scope.permissionGroupList", $scope.permissionGroupList);
					var length = $scope.platform.permissionGroupList.length;
					for (var i = 0; i < length; i++) {
						var groupPermission = $scope.platform.permissionGroupList[i].permissionArray;
						var templength = groupPermission.length;
						for (var j = 0; j < templength; j++) {
							if (pkgpermission.length > 0) {
								var chkobj = _.find(pkgpermission, { id: groupPermission[j].id });
								if (chkobj != null && chkobj != undefined) {
									groupPermission[j].selected = true;
								} else {
									groupPermission[j].selected = false;
								}
							} else {
								groupPermission[j].selected = false;
							}
						}
					}

				}, function (errortemp) { });
			} else {
				$scope.platform.permissionGroupList = $scope.permissionGroupList;
			}
		}
		
		$scope.adminctrl = new Object();
		$scope.adminctrl.disabled = false;
		$scope.adminctrl.onSelectCallback = function ($item, $model) {
			$scope.platform.cellphone = $item.cellphone;
			$scope.platform.logname = $item.logname;
			$scope.platform.pwd = "******";
		}

		$scope.loadpage = function () {
			getDataSource.getDataSource(["selectPlatformAdmin", "selectPlatformPermission", "getAllPermissionGroup"], 
			{ platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.admins = _.find(data, { name: 'selectPlatformAdmin' }).data;
				var groupdata = _.find(data, { name: 'getAllPermissionGroup' }).data;
				var permissiondata = _.find(data, { name: 'selectPlatformPermission' }).data;
				var length = groupdata.length;
				var groupname = '';
				var category = '';

				$scope.permissionGroupList = new Array();
				for (var i = 0; i < length; i++) {
					groupname = groupdata[i].groupname;
					category = groupdata[i].category;
					var permissionTemp = _.filter(permissiondata, { groupname: groupname });
					var templength = permissionTemp.length;
					if (templength == 0) {
						continue;
					}
					for (var j = 0; j < templength; j++) {
						permissionTemp[j].selected = false;
					}
					$scope.permissionGroupList.push({ groupname: groupname,category:category, permissionArray: permissionTemp });
				}

				$scope.loadform();

			}, function (errortemp) { });
		}();

		$scope.saveButtonDisabled = false;
		$scope.savePlatformAdmin = function () {
			$scope.saveButtonDisabled = true;
			//console.log($scope.platform);
			//return;
			getDataSource.getUrlData("../api/savePlatformAdmin", $scope.platform, function (data) {
				if (data.code == "success") {
					$scope.saveButtonDisabled = false;
					//$state.go("index.platformEdit", { id: data.id });
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					$scope.saveButtonDisabled = false;
					notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}]);