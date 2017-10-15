angular.module("myApp")
.controller("coursestatisticsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {


    getDataSource.getDataSource("getAllCourseCategory", { platformid: $rootScope.user.platformid },
        function (data) {
            $scope.categorylist = data;
            $scope.maincategorylist = _.filter(data, function (n) { return n.fid == 0 });
        }, function (error) { })

    $scope.selectCategory = function () {
        $scope.search.subcategory = "";
        $scope.subcategorylist = _.filter($scope.categorylist, function (n) { return n.fid == _.find($scope.maincategorylist, { "name": $scope.search.category }).id });
    }

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
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "coursewarename", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', field: "teachersname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: "8%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.teachtime | date:"yyyy-MM-dd"}}</div>' },
          { name: '一级分类', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', field: "subcategory", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '排课次数', field: "classscheduling", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '点击次数', field: "clickcount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '学习次数', field: "studycount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
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
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getCoursewareReport", { platformid1: $rootScope.user.platformid, platformid2: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();


}]);