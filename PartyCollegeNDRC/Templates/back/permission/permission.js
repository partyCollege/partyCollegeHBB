app.controller("permissionController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state'
	, function ($scope,$rootScope, $http, getDataSource, $state) {
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
				{ name: '权限名称', field: "name", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
				{ name: '分组名称', field: "groupname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: '级别', field: "syslevel", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'sysLevelFilter' },
				{ name: '说明', field: "comment", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
			$state.go("index.permissionEdit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getAllPermission"];
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
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.loadGrid();
		}
}])