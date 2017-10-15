angular.module("myApp")
.controller("scoreController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
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
            { name: "序号", field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "维度", field: "dimension", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: '加分项', field: "eventname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.eventname}}</a></div>' },
			{ name: "分值", field: "score", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "最高得分", field: "maxscore", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "限制类型", field: "limittype", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "limittypeFilters" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.loadSource = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getDimensionConfigAll", { }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }

    $scope.loadSource();


    $scope.goSearch = function () {
        $scope.loadSource();
    }

    $scope.goDetial = function (row) {
        //console.log(row);
        $state.go("index.scoreEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("deleteDimensionConfigById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}])





