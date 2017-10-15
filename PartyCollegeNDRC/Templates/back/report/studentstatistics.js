angular.module("myApp")
.controller("studentstatisticsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {


    getDataSource.getDataSource("getAllCourseCategory", { platformid: $rootScope.user.platformid },
        function (data) {
            $scope.categorylist = data;
            $scope.maincategorylist = _.filter(data, function (n) { return n.fid == 0 });
        }, function (error) { })

    $scope.selectCategory = function () {
        $scope.search.subcategory = "";
        $scope.subcategorylist = _.filter($scope.categorylist, function (n) { return n.fid == _.find($scope.maincategorylist, { "name": $scope.search.category }).id });
    }

    var date = new Date();
    $scope.yearlist = [
         { year: date.getFullYear() - 1 },
         { year: date.getFullYear() },
         { year: date.getFullYear() + 1}];

    $scope.search = {
        platformid: $rootScope.user.platformid,
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        category: 0,
        datacategory : 0
    };


    $scope.gridOptions = {
        useExternalPagination: false,
        useExternalSorting: true,
        enablePaginationControls: false,
        enableSorting: false,
        data: [],
        columnDefs: [
          { name: '职级/班级', field: "item", width: '25%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '总计', field: "itemcount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '报到', field: "signcount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '0%-20%', field: "level1", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '20%-40%', field: "level2", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '40%-60%', field: "level3", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '60%-80%', field: "level4", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '80%-100%', field: "level5", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '100%以上', field: "level6", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '未报到', field: "unsigncount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '已结业', field: "graduatecount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
        ],
    };


    $scope.goSearch = function () {
        //$scope.gridOptions.columnDefs[0].name = $scope.search.category == 0 ? "职级" : "班级";
        $scope.search.datacategory = 0;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        getDataSource.getUrlData("../api/getStudentStatistics",
            $scope.search,
            function (data) {
                $scope.studentstatisticsData = data;
                $scope.gridOptions.data = $scope.studentstatisticsData;
            },
            function (error) { })
    }
    $scope.loadGrid();

    var getrate = function (a, b) {
        return  ((b == 0 || a == 0) ? 0 : (parseFloat(a) / parseFloat(b) * 100).toFixed(1)) + "%";
    }

    $scope.changeDataCategory = function (type) {
        if (type == 0) {
            $scope.gridOptions.data = $scope.studentstatisticsData;
        }
        else {
            var data = angular.copy($scope.studentstatisticsData);
            for (var i = 0; i < data.length ; i++) {
                data[i].level1 = getrate(data[i].level1, data[i].signcount);
                data[i].level2 = getrate(data[i].level2, data[i].signcount);
                data[i].level3 = getrate(data[i].level3, data[i].signcount);
                data[i].level4 = getrate(data[i].level4, data[i].signcount);
                data[i].level5 = getrate(data[i].level5, data[i].signcount);
                data[i].level6 = getrate(data[i].level6, data[i].signcount);
                data[i].unsigncount = getrate(data[i].unsigncount, data[i].itemcount);
                data[i].graduatecount = getrate(data[i].graduatecount, data[i].signcount);
                data[i].signcount = getrate(data[i].signcount, data[i].itemcount);
            }
            $scope.gridOptions.data = data;
        }
    }


}]);