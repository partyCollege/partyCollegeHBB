angular.module("myApp")
.controller("coursewareclickController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    var date = new Date();
    $scope.yearlist = [
         { year: date.getFullYear() - 1 },
         { year: date.getFullYear() },
         { year: date.getFullYear() + 1 }];

    $scope.search = {
        platformid: $rootScope.user.platformid,
        year: date.getFullYear(),
        month: date.getMonth() + 1
    };

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "coursewarename", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', field: "teachersname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: "8%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.teachtime | date:"yyyy-MM-dd"}}</div>' },
          { name: '一级分类', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', field: "subcategory", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '点击次数', field: "clickcount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '最后调用时间', field: "lastusetime", width: "10%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.lastusetime | date:"yyyy-MM-dd"}}</div>' }
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
        if (paginationOptions.pageNumber == 1) {
            getDataSource.getDataSource("getCoursewareCategoryClickReport",
                {
                    platformid: $rootScope.user.platformid,
                    platformid1: $rootScope.user.platformid,
                    starttime: $scope.search.year.toString() + "-01",
                    endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
                }, function (data) {
                    //$scope.coursewareCategoryscheduling = data;
                    var xdata = new Array();
                    var ydata = new Array();
                    var clickcountTotal = 0;
                    angular.forEach(data, function (n) { clickcountTotal += n.clickcount });
                    for (var i = 0; i < data.length ; i++) {
                        xdata.push(data[i].category);
                        ydata.push(parseFloat((data[i].clickcount / parseFloat(clickcountTotal) * 100).toFixed(2)));
                    }
                    bindchart(xdata, ydata);
                }, function (error) { })
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getCoursewareClickReport",
            {
                platformid: $rootScope.user.platformid,
                platformid1: $rootScope.user.platformid,
                starttime: $scope.search.year.toString() + "-01",
                endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
            },
            { firstRow: firstRow, pageSize: pageSize }, null, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    //---------------

    var bindchart = function (xdata,ydata) {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '课程点击情况分析图'
            },
            xAxis: {
                categories: xdata,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{point.x}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: "一级分类",
                data: ydata
            }]
        });
    }



}]);