angular.module("myApp")
.controller("platformListController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", "notify",
	function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 25,
		sort: null
	};

	$scope.gridOptions = {
        enableFiltering: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '平台名称', field: "name", width: '50%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: "状态", field: "status", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'mapGender' },
          { name: "平台分类", field: "category", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "platformCategory" }
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

	$scope.search = {};
	$scope.loadGrid = function () {
		var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
		var pageSize = paginationOptions.pageSize;
		var array = ["selectAllPlatform"];
		getDataSource.getList(array, {}
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

	$scope.deletePlatform = function () {
		$scope.modalInstance = $modal.open({
			templateUrl: 'confirm.html',
			size: 'sm',
			scope: $scope
		});
	}

	$scope.ok = function () {
		$scope.isAccept = true;
		var selectRows = $scope.gridApi.selection.getSelectedRows();
		getDataSource.doArray("deletePlatform", selectRows, function () {
			notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			$scope.loadGrid();
		}, function (errortemp) {
			notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		});
		$scope.close();
	}
	//关闭模式窗口
	$scope.close = function () {
		$scope.modalInstance.dismiss('cancel');
	}

	//getDataSource.getDataSource("selectAllPlatform", {}, function (data) {
	//	$scope.gridOptions.data = data;
	//});
    $scope.goDetial = function (row) {
        $state.go("index.platformEdit", { id: row.entity.id });
    }
}]);