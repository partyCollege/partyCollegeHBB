app.controller("syroleController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '角色名称', field: "name", width: '55%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
			  { name: '级别', field: "syslevel", width: '35%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'sysLevelFilter' }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					$scope.loadGrid();
				});
			}
		};
		$scope.goDetial = function (row) {
			$state.go("index.roleedit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getRoleList"];
			getDataSource.getList(array, { platformid: $rootScope.user.platformid }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort
				, function (data) {
					$scope.gridOptions.totalItems = data[0].allRowCount;
					$scope.gridOptions.data = data[0].data;

				}, function (error) { });
		}
		$scope.loadGrid();
		$scope.goSearch = function () {
			$scope.loadGrid();
		}
}])