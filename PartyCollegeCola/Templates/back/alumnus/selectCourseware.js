angular.module("myApp")
.controller("selectCoursewareController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
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
          { name: '课程名称', field: "name" },
          { name: '授课人', field: "teachersname" },
          { name: '授课时间', field: "teachtime" }
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
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("selectcourseware-listall", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    $scope.saveAlumnusCourseware = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            var ids = "";
            for (var idx in selectRows) {
                if (ids == "")
                    ids = selectRows[idx].id;
                else {
                    ids += "," + selectRows[idx].id;
                }
            }
            getDataSource.getUrlData('../api/saveAlumnusCourseware', { createuser: $rootScope.user.name, createuserid: $rootScope.user.accountId, ids: ids }, function (datatemp) {
                if (datatemp.status == "success") {
                    notify({ message: '保存成功，共新增' + selectRows.length + '条记录！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.alumnusCourseware", {});
                }
                else {
                    notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            });
        }
    }
}]);