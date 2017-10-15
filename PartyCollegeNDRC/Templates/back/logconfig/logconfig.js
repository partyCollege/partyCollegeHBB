app.controller("logconfigController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		//
		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
			  { name: '编码', field: "code" },
			  { name: '名称', field: "name" },
			  { name: '状态', field: "status" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					$scope.loadGrid();
				});
				gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
					if (sortColumns.length == 0) {
						paginationOptions.sort = null;
					} else {
						var array = [];
						angular.forEach(sortColumns, function (c) {
							array.push({ sort: c.sort, name: c.field });
						});
						paginationOptions.sort = array;
					}
					$scope.loadGrid();
				});
			}
		};
		//$scope.goDetial = function (row) {
		//	$state.go("index.accountedit", { id: row.entity.id });
		//}
		$scope.search = {};
		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["selectLogConfig"];
			getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid, tablerule: new Date() }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort, { connectionKey: "LogConnectionString" }
				, function (data) {
					$scope.gridOptions.totalItems = data[0].allRowCount;
					$scope.gridOptions.data = data[0].data;
				}, function (error) { });
		}
		$scope.loadGrid();

		$scope.goSearch = function () {
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.loadGrid();
		}
	}])