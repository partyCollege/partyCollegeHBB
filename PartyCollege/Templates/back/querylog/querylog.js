app.controller("querylogController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
		$scope.years = [];
		$scope.currenty = new Date().getFullYear();
		$scope.currentm = new Date().getMonth()+1;
		for (var i = 2016; i < $scope.currenty + 1; i++) {
			$scope.years.push(i);
		}
		$scope.tblobj = {};
		$scope.tblobj.year = $scope.currenty;
		$scope.tblobj.month = $scope.currentm;
		//
		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '登录名', field: "username", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '班级名称', field: "classname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '操作', field: "handle", cellClass: "mycenter", width: '20%', headerCellClass: 'mycenter' },
			  { name: '操作时间', field: "handletime", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd HH:mm:ss'" },
			  { name: '操作分类', field: "handlecategory", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
			var array = ["getMonthLog"];
			var date = null;
			if ($scope.tblobj.year == "" || $scope.tblobj.month == "") {
				date = new Date();
			} else {
				date = new Date(Date.parse(($scope.tblobj.year + "-" + $scope.tblobj.month+"-01").replace(/-/g, "/")));
			}
			getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid, tablerule: date }
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