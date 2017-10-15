angular.module("myApp")
.controller("teacherListController", ["$rootScope", "$scope", "getDataSource", "$state", "notify", function ($rootScope, $scope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    //检索
    $scope.goSearch = function () {
        $scope.loadGrid();
    }

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '教师姓名', width: '15%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '性别', width: '10%', field: "sexshowvalue", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "专业方向", width: '15%', field: "subject", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "最高学历", width: '11%', field: "education", cellFilter: "educationFilter", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "职称", width: '15%', field: "position", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "单位", width: '20%', field: "company", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "关联课程数", width: '6%', field: "scount", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
        getDataSource.doArray("delete_sy_TeacherById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("selectAllTeacher", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();

    $scope.goDetial = function (row) {
        //console.log(row);
        $state.go("index.teacherEdit", { id: row.entity.id });
    }
}]);