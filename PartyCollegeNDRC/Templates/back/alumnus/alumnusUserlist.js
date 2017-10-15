angular.module("myApp")
.controller("alumnusUserlistController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '姓名', field: "name", width: '24%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAddUser(row)">{{row.entity.name}}</a></div>' },
          { name: "登录名", field: "logname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "手机号码", field: "cellphone", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "身份证号码", field: "idcard", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '续费', width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">续费</a></div>' },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $scope.loadSource();
            });
        }
    };

    $scope.loadSource = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_alumnus_account", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadSource();

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource();
    }

    $scope.goAddUser = function (row) {
        $state.go("index.alumnusUserAdd", { id: row.entity.id });
    }

    $scope.goDetial = function (row) {
        $state.go("index.alumnusUserEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_alumnus_student", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}]);





