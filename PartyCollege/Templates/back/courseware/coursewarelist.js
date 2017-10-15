angular.module("myApp")
.controller("coursewarelistController", ['$rootScope', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", function ($rootScope, $scope, getDataSource, $state, $stateParams, $modal, notify) {
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
          { name: '课程名称', field: "name", width: '49%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '授课人', field: "teachersname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
          { name: '状态', field: "mainstatus", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "mainStatusFilters" }
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
        if ($stateParams.type == "all") {
            switch (row.entity.mainstatus) {
                case 0:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "upload" });
                    break;
                case 1:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "distribution" });
                    break;
                case 2:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "examine" });
                    break;
                case 3:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "authorization" });
                    break;
                case 4:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "wareedit" });
                    break;
                case 5:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "perfect" });
                    break;
                case 6:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "storage" });
                    break;
                case 7:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "formal" });
                    break;
                case -2:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "waredelete" });
                    break;
            }

        }
        else {
            $state.go("index.courseEdit", { id: row.entity.id, type: $stateParams.type });
        }
    }

    $scope.courseware = {
        functionname: "selectAllCoursewareBymainstatus",
        userid: "",
        mainstatus: 0,
        mainStatusShow: false,
        uploadShow: false,
        distributionShow: false
    };
    $scope.mainstatus = 0;
    $scope.type = $stateParams.type;
    $scope.setCourseWareType = function () {
        switch ($stateParams.type) {
            case "upload":
                $scope.courseware.mainstatus = 0;
                $scope.courseware.uploadShow = true;
                break;
            case "distribution":
                $scope.courseware.mainstatus = 1;
                $scope.courseware.distributionShow = true;
                break;
            case "examine":
                $scope.courseware.mainstatus = 2;
                $scope.courseware.userid = $rootScope.user.accountId;
                $scope.courseware.functionname = "selectAllCoursewareByuserid";
                break;
            case "authorization":
                $scope.courseware.mainstatus = 3;
                break;
            case "wareedit":
                $scope.courseware.mainstatus = 4;
                break;
            case "perfect":
                $scope.courseware.mainstatus = 5;
                break;
            case "storage":
                $scope.courseware.mainstatus = 6;
                break;
            case "formal":
                $scope.courseware.mainstatus = 7;
                break;
            case "waredelete":
                $scope.courseware.mainstatus = -2;
                break;
            case "all":
                $scope.courseware.functionname = "selectCoursewareAll";
                $scope.courseware.mainStatusShow = true;
                break;
        }
    }

    $scope.loadGrid = function () {
        $scope.setCourseWareType();
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList($scope.courseware.functionname, { mainstatus: $scope.courseware.mainstatus, userid: $scope.courseware.userid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }

    $scope.loadGrid();

    //加载审核小组
    $scope.gridExamineOptions = {};
    $scope.loadExamineUser = function () {
        $scope.gridExamineOptions = {
            useExternalPagination: false,
            useExternalSorting: false,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            data: [],
            columnDefs: [
              { name: "姓名", field: "name", width: '99%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridExamineApi = gridApi;
            }
        };
    }
    $scope.loadExamineUser();

    //提交
    $scope.commitCourseInfo = function () {
        var selectCourse = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectCourse) {
            if (ids == "") {
                ids = selectCourse[idx].id;
            } else {
                ids += "','" + selectCourse[idx].id;
            }
        }

        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: ids, mainstatus: 1, operationuser: $rootScope.user.name, currentstep: "课件上传", nextstep: "课件分配", operationcontent: ($rootScope.user.name + "已提交课件，等待分配审核").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //删除
    $scope.delete = function () {
        var selectCourse = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectCourse) {
            if (ids == "") {
                ids = selectCourse[idx].id;
            } else {
                ids += "," + selectCourse[idx].id;
            }
        }
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: ids, mainstatus: -2, operationuser: $rootScope.user.name, currentstep: "课件删除", nextstep: "结束", userid: $rootScope.user.accountId,
            operationcontent: ($rootScope.user.name + "课件删除").toString(), laststatus: 0, deleteContent: ""
        }, function (data) {
            if (data) {
                notify({ message: '删除成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            }
            else
                notify({ message: '删除失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '删除失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //打开选人页面
    $scope.OpenUserInfo = function () {
        getDataSource.getDataSource("select_sy_user_examine", { platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridExamineOptions.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'examinePerview.html',
                size: 'lg',
                scope: $scope
            });
        })
    }

    //分配
    $scope.distributionCourseware = function () {
        var selectCourse = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectCourse) {
            if (ids == "") {
                ids = selectCourse[idx].id;
            } else {
                ids += "','" + selectCourse[idx].id;
            }
        }
        //获取审核人
        var selectUser = $scope.gridExamineApi.selection.getSelectedRows();
        getDataSource.getDataSource("insert_sy_courseware_operation", { ids: ids, userid: selectUser[0].id, username: selectUser[0].name, idss: ids }, function (data) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: ids, mainstatus: 2, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分配", nextstep: "课件审核", operationcontent: ($rootScope.user.name + "已分配课件给" + selectUser[0].name + "，等待审核").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '分配成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadGrid();
                    $scope.close();
                }
                else
                    notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        })

    }

    //关闭
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }



}]).filter('mainStatusFilters', function () {
    var genderHash = {
        "-2": '已删除',
        "0": '未提交',
        "1": '待分配',
        "2": '待审核',
        "3": '待授权',
        "4": '待编辑',
        "5": '待完善',
        "6": '待分类',
        "7": '已入库'
    };
    return function (input) {
        if (input != null && input != undefined)
            return genderHash[input];
        else
            return "";
    };
});