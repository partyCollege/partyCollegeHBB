angular.module("myApp")
.controller("platformCourseListController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forAddCourse: [] };

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgCourse", { platformid: $stateParams.id, platformid2: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformCourse", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.class.courseList = data;
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: '课程名称', field: "name", width: '28%' },
				{ name: '授课人', field: "teachersname", width: '8%' },
				{ name: '授课时间', field: "teachtime", width: '10%' },
				{ name: '分配时间', field: "createtime", width: '10%', cellFilter: "date:'yyyy-MM-dd'", },
				{ name: '分配人', field: "createuser", width: '8%' },
				{ name: '选用次数', field: "sybs", width: '6%' },
				{ name: '来源', field: "teachersname", width: '8%' },
				{ name: '状态', field: "mainstatus", cellFilter: "coursewareStatusFilter", width: '8%' },
				{ name: "共享", width: '6%', field: "isshare", cellFilter: "isShareFilter", cellClass: "mycenter", headerCellClass: 'mycenter' }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除课程
		$scope.delCourseware = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var checkCourse = { platformid: $stateParams.id, selectRows: selectRows };
			getDataSource.getUrlData("../api/checkDelPkgCourse", checkCourse, function (data) {
				if (data.code == "success") {
					getDataSource.doArray(["deletePkgCourseware", "deletePkgMicroVideoByCourseId"], selectRows, function (data) {
						$scope.initTable();
						notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}, function (error) {
						notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					});
				} else {
					notify({ message: '删除失败,存在课程已被使用。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function () {

			})
		}

		$scope.addDisabled = false;
		$scope.addCourse = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forAddCourse, function (item) {
				item.platformid = $stateParams.id;
				item.coursewareid = item.id;
				item.coursewarename = item.name;
				item.isshare = 1;
			});

			getDataSource.getUrlData("../api/savePkgCourse", $scope.class.forAddCourse, function (data) {
				$scope.addDisabled = false;
				if (data.code == "success") {
					angular.forEach($scope.class.forAddCourse, function (item) {
						_.remove($scope.class.courseList, { id: item.id });
					});
					$scope.class.forAddCourse = [];
					$scope.initTable();
				} else {
					notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (error) { $scope.addDisabled = false; });
			//插入课程。
			//getDataSource.doArray("insertPkgCourseware", $scope.class.forAddCourse, function (data) {
			//	angular.forEach($scope.class.forAddCourse, function (item) {
			//		_.remove($scope.class.courseList, { id: item.id });
			//	});
			//	$scope.class.forAddCourse = [];
			//	$scope.initTable();
			//});
		}
}]);