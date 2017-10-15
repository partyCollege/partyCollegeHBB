angular.module("myApp")
.controller("planListController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService) {

	var start = new Date().getFullYear();
    var end = new Date().getFullYear() + 5;
    $scope.yearArr = [];
    for (var i = 2016; i <= end; i++) {
        $scope.yearArr.push(i);
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {
        year:start,
        orgcode: "",
        orgname: ""
    }
    //检索
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.goClear = function () {
        $scope.search.orgcode = "";
        $scope.search.orgname = "";
        $scope.search.year = new Date().getFullYear();
        $scope.loadGrid();
    }
    //$scope.goEdit = function () {
    //    var selectRows = $scope.gridApi.selection.getSelectedRows();
        
    //    $state.go("index.planedit", { id: item.entity.id });
    //}

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var parameter = [];
        for (var i = 0; i < selectRows.length; i++) {
            parameter.push({
                year: selectRows[i].year,
                departmentid: selectRows[i].depid,
                studytime: selectRows[i].studytime
            });
        }
        getDataSource.getUrlData("../api/deleteplan", parameter, function (data) {
            if (data.result) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } $scope.loadGrid();
        }, function (errortemp) { });

    }

    $scope.gridOptions = {
        //paginationPageSizes: [25, 50, 75],
        //paginationPageSize: 25,
        columnDefs: [
          { name: '年份', width: '10%', field: "year", headerCellClass: 'mycenter' },
          { name: '组织机构', width: '30%', field: "depname", headerCellClass: 'mycenter' },
          { name: '职务级别', width: '46%', field: "rank", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '总学时', width: '10%', field: "studytime", cellClass: "mycenter", headerCellClass: 'mycenter' },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            //    paginationOptions.pageNumber = newPage;
            //    paginationOptions.pageSize = pageSize;
            //    $scope.loadGrid();
            //});
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
        //var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        //var pageSize = paginationOptions.pageSize;

        getDataSource.getUrlData("../api/getplans", $scope.search, function (data) {
            if (data.result) {
                $scope.gridOptions.totalItems = data.list.length;
                $scope.gridOptions.data = data.list;
            }
        }, function (errortemp) { });
    } 
    $scope.loadGrid();
     
}]);