angular.module("myApp")
.controller("recommendcourseController", ['$rootScope', '$http', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", "smsService", function ($rootScope, $http, $scope, getDataSource, $state, $stateParams, $modal, notify, smsService) {
    $scope.class = { forAddCourse: [] };

    //----------------------------------------------

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
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', width: '45%', field: "coursewarename", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.coursewarename}}</div>', headerCellClass: 'mycenter' },
          //{ name: '课程名称', width: '50%', field: "coursewarename", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', width: '20%', field: "teachersname", cellClass: "mycenter", headerCellClass: 'mycenter' },
          //{ name: '点击次数', width: '8%', field: "clickrate", cellClass: "mycenter", headerCellClass: 'mycenter' },
          //{ name: '发布状态', width: '10%', field: "status", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status == 0 ? "未发布":"已发布"}}</div>', headerCellClass: 'mycenter' },
          //{ name: '首页显示', width: '10%', field: "ismain", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.ismain == 0 ? "否":"是"}}</div>', headerCellClass: 'mycenter' },
          //{ name: '创建人', width: '8%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '25%', field: "createtime", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" }
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

    $scope.goDetial = function (row) {
        $state.go("index.recommendcourseEdit", { id: row.entity.coursewareid, opencourseid: row.entity.id });
    }


    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;

        getDataSource.getList("selectOpenCourseware", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }

    //----------------------------------------------


    $scope.load = function () {
        getDataSource.getDataSource("selectNoOpenCourseware", { platformid: $rootScope.user.platformid, platformid1: $rootScope.user.platformid, classid: $stateParams.id, classid1: $stateParams.id }, function (data) {
            $scope.class.courseList = data;
        });
        $scope.goSearch();
    }();

    //删除课程
    $scope.delCourseware = function () {
        if (confirm("确定要删除选中的课程吗")) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            getDataSource.doArray("delete_sy_courseware_public", selectRows, function (data) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }

    $scope.addCourseDisabled = true;
    $scope.addCourse = function () {
        if ($scope.class.forAddCourse && $scope.class.forAddCourse.length > 0) {
            $scope.addCourseDisabled = true;
            angular.forEach($scope.class.forAddCourse, function (item) {
                item.coursewareid = item.id;
            });
            getDataSource.doArray("insert_sy_courseware_public", $scope.class.forAddCourse, function (data) {
                notify({ message: '添加成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                angular.forEach($scope.class.forAddCourse, function (item) {
                    _.remove($scope.class.courseList, { id: item.id });
                });
                $scope.class.forAddCourse = [];
                $scope.loadGrid();
            });
        }
    }

    $scope.$watch("class.forAddCourse", function (newValue) {
        if (newValue.length > 0)
            $scope.addCourseDisabled = false;
        else
            $scope.addCourseDisabled = true;
    })

    $scope.publish = function (type) {
        var mess = type == 0 ? "撤销发布" : "发布";
        if (confirm("确定要"+mess+"选中的课程吗")) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var publishlist = [];
            for (var i = 0; i < selectRows.length; i++) {
                publishlist.push({
                    id: selectRows[i].id,
                    status: type
                });
            }
            getDataSource.doArray("publish_sy_courseware_public", publishlist, function (data) {
                notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }
    $scope.ismain = function (type) {
        var mess = type == 1 ? "设置首页显示" : "取消首页显示";
        if (confirm("确定要将选中的课程" +mess)) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var publishlist = [];
            for (var i = 0; i < selectRows.length; i++) {
                publishlist.push({
                    id: selectRows[i].id,
                    ismain: type
                });
            }
            getDataSource.doArray("ismain_sy_courseware_public", publishlist, function (data) {
                notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }
}]);