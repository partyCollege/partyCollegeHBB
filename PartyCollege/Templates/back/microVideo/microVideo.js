angular.module("myApp")
.controller("microVideoController", ['$scope', '$rootScope', 'getDataSource', "$state", "notify", function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: "序号", width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '微视频名称', width: '30%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>', headerCellClass: 'mycenter' },
          { name: "主讲人", width: '8%', field: "teacher", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '分类', width: '8%', field: "category", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '8%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建时间", width: '8%', field: "createtime", cellFilter: "date:'yyyy-MM-dd'", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "是否可用", width: '8%', field: "status", cellFilter: "statusGender", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "是否推荐", width: '8%', field: "ismain", cellFilter: "istopGender", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "点击次数", width: '8%', field: "clickrate", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
        	//当为共享数据时，则不能被删除
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            	var msg = 'row selected ' + row.isSelected;
            	if (row.entity.isshare) {
            		row.isSelected = false;
            		notify({ message: '该视频为共享资源，不能被操作。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	}
            });
        }
    };
    $scope.goDetial = function (row) {
        $state.go("index.microVideoEdit", { id: row.entity.id });
    }
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_microVideoById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        var key = "selectAllMicroVideo";
        if ($rootScope.user.platformcategory == 0) {
        	key = "selectPlatformAllMicroVideo";
        }
        getDataSource.getList(key, {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();
}]);