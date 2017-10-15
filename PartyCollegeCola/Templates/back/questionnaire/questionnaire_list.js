angular.module("myApp")
.controller("questionnaire_listController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', function ($scope, $rootScope, getDataSource, $state, notify, $modal) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '问卷名称', width: '54%', field: "title", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>', headerCellClass: 'mycenter' },
          { name: '问卷类型', width: '10%', field: "category", cellFilter: "questCategoryFilter", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '10%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '10%', field: "createtime", cellFilter: "date:'yyyy-MM-dd'", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '题目数', width: '10%', field: "questnum", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_questById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.goDetial = function (item) {
        $state.go("index.questionnaire_edit", { id: item.entity.id });
    }
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_questionnaire", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();
}]);