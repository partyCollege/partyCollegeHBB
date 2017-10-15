angular.module("myApp")
.controller("classlistController", ['$rootScope', '$scope', 'getDataSource', "$state", "notify", function ($rootScope, $scope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.node = {};
    $scope.node.selectNode = {};
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '班级名称', field: "name", width: '35%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '年份', field: "starttime", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.starttime|date:"yyyy"}}</div>' },
          { name: "起始时间", field: "starttime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
          { name: "结束时间", field: "endtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
		  { name: "班级人数", field: "studentnum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: "所属机构", field: "departmentname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
			//删除班级时，需要清空sy_account表里的defaultclassid字段。
            getDataSource.doArray(["delete_classById"], selectRows, function (data) {
                $scope.loadGrid();
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }
    $scope.goDetial = function (row) {
        $state.go("index.classedit", { id: row.entity.id });
    }
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid(1);
    }
    $scope.loadGrid = function (init) {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
		//初始化按机构查询
        $scope.search.departmentid_dbcolumn = "departmentid";
        $scope.search.departmentid_dbtype = "string";
        $scope.search.departmentid_handle = "like";

        //console.log("$rootScope.user", $rootScope.user);
        if (init == 0) {
            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            $scope.search.departmentid = mid;
        } else {
            $scope.search.departmentid = $scope.search.departmentid;
        }
        //console.log("$scope.search", $scope.search);
        getDataSource.getList("selectClassList", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }
			, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
			}, function (error) {
			    //console.log(error);
			});
    }
    $scope.loadGrid(0);

    //$scope.selectnode = function (node) {
    //    $scope.search.departmentid = node.id;  
    //}


}]);