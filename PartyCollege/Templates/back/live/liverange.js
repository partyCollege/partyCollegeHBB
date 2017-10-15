angular.module("myApp")
.controller("platformLiveRelationController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.live = { ispublic: false, forPlatform: [], forSyClass: [] };

		$scope.ChangePublic = function () {
			if ($scope.live.ispublic) {

			}
		}

		$scope.initTable = function () {
			getDataSource.getDataSource("getPlatformLiveRelation", { liveid: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource(["selectPlatformList","selectSyClassList"], {}, function (data) {
				$scope.live.platformList = _.find(data, { name: "selectPlatformList" }).data;
				$scope.live.classList = _.find(data, { name: "selectSyClassList" }).data;
			});
			$scope.initTable();
		};

		$scope.load();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '直播范围', field: "name"},
				{ name: '限制类型', field: "category" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除课程
		$scope.delPlatformLiveRelation = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			getDataSource.doArray("deletePlatformLiveRelation", selectRows, function (data) {
				$scope.load();
				$scope.initTable();
				notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		// 2 全平台，0，班级，1，某平台
		$scope.addPlatformLiveRelation = function () {
			if ($scope.live.ispublic) {
				getDataSource.getDataSource("deletePlatformLiveRelationByLiveId", { liveid: $stateParams.id }, function (data) {
					getDataSource.getDataSource("insertPlatformLiveRelation", { liveid2: $stateParams.id, eventid2: "2", liveid: $stateParams.id, eventid: "2", category: 2 }, function (data) {
						$scope.initTable();
					});
				}, function (error) {
				});
			} else {
				angular.forEach($scope.live.forPlatform, function (item) {
					item.liveid = $stateParams.id;
					item.liveid2 = $stateParams.id;
					item.eventid = item.id;
					item.eventid2 = item.id;
					item.category = 1;
				});
				angular.forEach($scope.live.forSyClass, function (item) {
					item.liveid = $stateParams.id;
					item.liveid2 = $stateParams.id;
					item.eventid = item.id;
					item.eventid2 = item.id;
					item.category = 0;
				});
				getDataSource.getDataSource("deletePlatformPublicLiveRelationByLiveId", { liveid: $stateParams.id }, function (data) {
					if ($scope.live.forPlatform.length > 0) {
						getDataSource.doArray("insertPlatformLiveRelation", $scope.live.forPlatform, function (data) {
							angular.forEach($scope.live.forPlatform, function (item) {
								_.remove($scope.live.platformList, { id: item.id });
							});
							$scope.live.forPlatform = [];
							$scope.initTable();
						});
					}
					if ($scope.live.forSyClass.length > 0) {
						getDataSource.doArray("insertPlatformLiveRelation", $scope.live.forSyClass, function (data) {
							angular.forEach($scope.live.forSyClass, function (item) {
								_.remove($scope.live.classList, { id: item.id });
							});
							$scope.live.forSyClass = [];
							$scope.initTable();
						});
					}
				}, function (error) {
				});
			}
		}
}]);