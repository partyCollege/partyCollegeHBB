angular.module("myApp")
.controller("platformEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.platform = new Object();
		$scope.platform.id = '';
		$scope.platform.name = '';
		$scope.platform.category = 0;
		$scope.platform.adminaccount = new Array();//平台管理员
		$scope.platform.cellphone = '';
		$scope.platform.logname = '';
		$scope.platform.pwd = '';
		$scope.platform.starttime = '';
		$scope.platform.endtime = '';
		$scope.platform.status = false;
		$scope.platform.isextend = true;

		$scope.showtotal = $rootScope.user.platformcategory;

		$scope.goback = function () {
			$state.go("index.platformList", {}, { reload: false });
		}

		$scope.goPlatformEdit = function () {
			if ($stateParams.id) {
				$state.go("index.platformEdit", { id: $stateParams.id });
			}
			else {
				$state.go("index.platformEdit");
			}
		}

		$scope.goTabList = function (nowtype) {
			var nowRouter = "";
			switch (nowtype) {
				case 0: nowRouter = "index.platformEdit.courselist"; break;
				case 1:
				case 4:
				case 5:
					nowRouter = "index.platformEdit.teacherlist";
					break;
				case 2: nowRouter = "index.platformEdit.permissionlist"; break;
				case 3: nowRouter = "index.platformEdit.microvideolist"; break;
			}
			$state.go(nowRouter, { type: nowtype });
		}

		if ($stateParams.id) {
			$scope.nowid = $stateParams.id;
			getDataSource.getDataSource(["getPlatformInfo"]
			, { platformid: $scope.nowid, platformid2: $scope.nowid }, function (data) {
				//平台信息
				var pkginfo = data;// _.find(data, { name: "getPlatformInfo" }).data;
				$scope.platform = pkginfo[0];
				var status = $scope.platform.status == 1;
				$scope.platform.status = status;
				var isextend = $scope.platform.isextend == 1;
				$scope.platform.isextend = isextend;
				$scope.platform.pwd = "******";
			}, function (errortemp) { });
		}
		$scope.saveButtonDisabled = false;
		//保存平台
		$scope.savePlatform = function () {
			$scope.saveButtonDisabled = true;
			getDataSource.getUrlData("../api/platform", $scope.platform, function (data) {
				if (data.code == "success") {
					$scope.saveButtonDisabled = false;
					$state.go("index.platformEdit", { id: data.id });
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					$scope.saveButtonDisabled = false;
					notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}]);