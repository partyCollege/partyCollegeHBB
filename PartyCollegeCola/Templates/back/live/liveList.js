angular.module("myApp")
.controller("liveListController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    //检索
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_LiveById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }

        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            columnDefs: [
              { name: '序号', field: "rownum", width: '6%',cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '直播名称', width: '64%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewLive(row)">{{row.entity.name}}</a></div>', headerCellClass: 'mycenter' },
              { name: '直播开始时间', width: '10%', field: "starttime", cellFilter: "date:'yyyy-MM-dd HH:mm'", cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '直播结束时间', width: '10%', field: "endtime", cellFilter: "date:'yyyy-MM-dd HH:mm'", cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '主讲人', width: '10%', field: "teachername", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("selectLive", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.viewLive = function (item)
    {
        $state.go("index.liveEdit", { id: item.entity.id });
    }
    $scope.loadGrid();
}]);