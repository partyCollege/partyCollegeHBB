angular.module("myApp")
.controller("statisticsIndexroleController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {

    $scope.gridOptions = {
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "平台", field: "name", width: '34%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "用户人数", field: "studentcount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "在线人数", field: "onlineusercount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "当前班次", field: "onlineclasscount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "历史班次", field: "historyclasscount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
  
    $scope.loadIndexData = function () {
        getDataSource.getDataSource("statistics-platformindexall", {}, function (data) {
            $scope.gridOptions.data = data;
        });

        $scope.statisticsdata = {};
        getDataSource.getDataSource("statistics-indexall", {}, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.statisticsdata = data[0];
        });
    }
    $scope.loadIndexData();
    setInterval(function () { $scope.loadIndexData(); }, 10000);

}]);





