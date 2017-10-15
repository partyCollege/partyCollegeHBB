app.controller("noticeController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state'
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
				{ name: '标题', field: "title", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },
				{ name: '内容', field: "content", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
                { name: '类型', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 0 ? "系统升级" :"系统提醒"}}</div>' },
				{ name: '发布状态', field: "publishstate", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.publishstate == 0 ? "未发布" :"已发布"}}</div>' },
                { name: '发布时间', field: "publishdate", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.publishdate | date:"yyyy-MM-dd hh:mm:ss"}}</div>' },
                { name: '发布人', field: "publishuser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
                { name: '类型', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 0 ? "系统升级" :"系统提醒"}}</div>' },
                { name: '创建时间', field: "createdate", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.createdate | date:"yyyy-MM-dd hh:mm:ss"}}</div>' },
                { name: '创建人', field: "createuser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
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
			$state.go("index.noticeEdit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getAllNotice"];
			getDataSource.getList(array, {  }
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