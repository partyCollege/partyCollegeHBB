angular.module("myApp")
.controller("renewlogController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '序列号', field: "title", width: '29%', headerCellClass: 'mycenter' },
          { name: "有效时长", field: "enableddays", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "开始时间", field: "begindate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "结束时间", field: "enddate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "使用用户", field: "studentname", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建时间", field: "createdate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "操作人", field: "createuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.loadSource = function () {

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_alumnus_renew_log", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadSource();

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource();
    }


    $scope.goDetial = function (row) {
        $state.go("index.cardEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_alumnus_card", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}]);





