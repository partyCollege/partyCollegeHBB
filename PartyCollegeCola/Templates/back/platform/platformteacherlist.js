angular.module("myApp")
.controller("platformTeacherListController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forAddTeacher: [] };
		$scope.placeholder = '班主任';
		var category = 0;
		//1:班主任，4 班助理，5 指导老师
		switch ($stateParams.type) {
			case 1:
				category = 0;
				$scope.placeholder = '班主任';
				break;
			case 4:
				category = 1;
				$scope.placeholder = '班主任助理';
				break;
			case 5:
				category = 2;
				$scope.placeholder = '班部指导老师';
				break;
		}

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgUsers", { platformid: $stateParams.id, category: category }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformUser", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id, category: category }, function (data) {
				$scope.class.teacherList = data;
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '教师姓名', field: "uname", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.uname}}</div>' },
				{ name: '工作单位', field: "company" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除老师
		$scope.delTeacher = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var checkUser = {category:category, platformid: $stateParams.id, selectRows: selectRows };

			getDataSource.getUrlData("../api/checkDelPkgUser", checkUser, function (data) {
				if (data.code == "success") {
					$scope.initTable();
					notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.addDisabled = false;
		$scope.addTeacher = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forAddTeacher, function (item) {
				item.platformid = $stateParams.id;
				item.userid = item.id;
				item.uname = item.uname;
				item.category = category;
			});
			getDataSource.getUrlData("../api/insertPkgUser", $scope.class.forAddTeacher, function (data) {
				$scope.addDisabled = false;
				angular.forEach($scope.class.forAddTeacher, function (item) {
					_.remove($scope.class.teacherList, { id: item.id });
				});
				$scope.class.forAddTeacher = [];
				$scope.initTable();
			}, function (error) { $scope.addDisabled = false; });
		}
}]);