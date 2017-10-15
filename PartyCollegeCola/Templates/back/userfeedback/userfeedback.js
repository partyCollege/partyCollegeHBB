angular.module("myApp")
.controller("userfeedbackController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    //打开反馈明细窗口
    $scope.goDetial = function (row) {
        $scope.feedback = row;
        $scope.modalInstance = $modal.open({
            templateUrl: 'feedbackDetail.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: "6%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '标题', field: "title", width: "24%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a>' },
          { name: '内容', field: "content", width: "50%", headerCellClass: 'mycenter' },
          { name: '反馈人', field: "username", width: "10%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '反馈时间', field: "createtime", width: "10%", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("get_sy_user_feedback", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();
}]);