angular.module("myApp")
.controller("platformMicroVideoController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forMicroVideo: [] };

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgMicroVideo", { platformid: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			}, function (error) {
				alert(1)
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformMicroVideo", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.class.microvideoList = data;
			}, function (error) {
				
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.name}}</div>' },
				{ name: '授课人', field: "teacher" },
				{ name: '分类', field: "category" },
				{ name: '分配时间', field: "createtime" },
				{ name: '分配人', field: "createuser" },
				{ name: '关联课程', field: "linkcourse", cellFilter: "isShareFilter" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				//当为关联数据时，则不能被删除
				gridApi.selection.on.rowSelectionChanged($scope, function (row) {
					var msg = 'row selected ' + row.isSelected;
					if (row.entity.linkcourse) {
						row.isSelected = false;
						notify({ message: '该视频已关联课程，不能被操作。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				});
			}
		};

		//删除微视频
		$scope.delMicroVideo = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			getDataSource.doArray("deletePkgMicroVideo", selectRows, function (data) {
				$scope.initTable();
				notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.addDisabled = false;
		$scope.addMicroVideo = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forMicroVideo, function (item) {
				item.platformid = $stateParams.id;
				item.microvideoid = item.id;
				item.isshare = 1;
			});
			getDataSource.doArray(["insertPkgMicroVideo"], $scope.class.forMicroVideo, function (data) {
				$scope.addDisabled = false;
				angular.forEach($scope.class.forMicroVideo, function (item) {
					_.remove($scope.class.microvideoList, { id: item.id });
				});
				$scope.class.forMicroVideo = [];
				$scope.initTable();
			}, function (error) { $scope.addDisabled = false; });
		}
	}]);