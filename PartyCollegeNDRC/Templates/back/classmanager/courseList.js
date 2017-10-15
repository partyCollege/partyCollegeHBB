angular.module("myApp")
.controller("classCourseController", ['$rootScope','$http', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", "smsService", function ($rootScope,$http, $scope, getDataSource, $state, $stateParams, $modal, notify, smsService) {
    $scope.class = { forAddCourse: [] };
    $scope.zhname = "必修课";
    $scope.copyCategory = { xxk: false, bxk: false, aljx: false };
    $scope.initTable = function () {
        getDataSource.getDataSource("selectClassCourseware", { classid: $stateParams.id, category: $stateParams.type }, function (gridData) {
            $scope.gridOptions.data = gridData;
        });
    }
    $scope.load = function () {
        switch ($stateParams.type) {
            case 0: $scope.zhname = "必修课"; break;
            case 1: $scope.zhname = "选修课"; break;
            case 2: $scope.zhname = "案例教学"; break;
        }
        getDataSource.getDataSource("selectCoursewareForClass", { platformid: $rootScope.user.platformid, platformid1: $rootScope.user.platformid, classid: $stateParams.id, classid1: $stateParams.id }, function (data) {
            $scope.class.courseList = data;
        });
        $scope.initTable();
    }();
    //打开课程配置窗口
    $scope.goManage = function (row) {
        //是否统一配置
        $scope.allManage = false;
        getDataSource.getDataSource("selectClassCourseById", { id: row.entity.id }, function (data) {
            $scope.nowCourse = data[0];
            $scope.modalInstance = $modal.open({
                templateUrl: 'courseManage.html',
                size: 'lg',
                scope: $scope
            });
        });
    }
    $scope.copyCourse = function () {
        getDataSource.getDataSource("selectCopyClassCourse", { classid: $stateParams.id, platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridOptions1.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'copyCourse.html',
                size: 'lg',
                scope: $scope
            });
        });

    }
    $scope.sendSMS = function () {
        //smsService.send({ phone: "13818305910", content: "6934(欢迎参加网络学院培训，您的注册验证码是，有效时间为454365分钟，请尽快验证)" }, function () { })
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }
    //保存班级单课程配置
    $scope.saveCourse = function () {
        //统一配置的保存
        if ($scope.allManage) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var forUpdateArray = [];
            angular.forEach(selectRows, function (data) {
                var nowid = data.id;
                data = _.cloneDeep($scope.nowCourse);
                data.id = nowid;
                forUpdateArray.push(data);
            });
            getDataSource.doArray("updateClassCourseById", forUpdateArray, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.initTable();
            }, function (error) { });
        }
        else {
            getDataSource.getDataSource("updateClassCourseById", $scope.nowCourse, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
    }
    $scope.manageCourse = function () {
        $scope.selectedCourse = $scope.gridApi.selection.getSelectedRows();
        //是否统一配置
        $scope.allManage = true;
        $scope.nowCourse = {};
        $scope.modalInstance = $modal.open({
            templateUrl: 'courseManage.html',
            size: 'lg',
            scope: $scope
        });
    }
    $scope.setExamNumZero = function () {
        if ($scope.nowCourse.exam == 0) {
            $scope.nowCourse.examnum = 0;
        }
    }
    $scope.gridOptions = {
        useExternalPagination: true,
        data: [],
        columnDefs: [
          //{ name: '课程名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goManage(row)">{{row.entity.name}}</a></div>' },
          { name: '课程名称', width: '57%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.name}}</div>' },
          { name: '主讲人', width: '10%', field: "teachersname" },
          { name: "课程类型", width: '10%', field: "starttime", cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.appScope.zhname"></div>' },
          { name: "学时", width: '10%', field: "score" },
          { name: "状态", width: '10%', field: "mainstatus", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.mainstatus==-2 ? "已下架" : "正常" }}</div>' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.gridOptions1 = {
        useExternalPagination: true,
        data: [],
        multiSelect:false,
        columnDefs: [
          { name: '班次名称', field: "name" },
        { name: '开班时间', field: "starttime",maxWidth:100, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.starttime|date:"yyyy-MM-dd"}}</div>' },
          { name: '必修课程', field: "xxk", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.bxk}}</div>' },
          { name: "选修课程", field: "bxk", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.xxk}}</div>' },
        { name: "案例教学", field: "aljx", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.aljx}}</div>' },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi1 = gridApi;
        }
    };
    //复制班级课程
    $scope.copyNewCourse = function () {
        ///console.log($scope.copyCategory);
        var selectRows = $scope.gridApi1.selection.getSelectedRows();
        var q = $http.post("../api/copyClassCourse", { classid: $stateParams.id, forCopyClass: selectRows[0].id, copyCategory: $scope.copyCategory });
        q.then(function (data) {
            $scope.modalInstance.dismiss('cancel');
            $scope.initTable();
        });
    }
    //删除课程
    $scope.delCourseware = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("deleteClassCourseware", selectRows, function (data) {
            getDataSource.getDataSource("update_sy_class_studytime", { classid: $stateParams.id }, function (data) { }, function (e) { })
            $scope.updatescore();
            $scope.initTable();
        });
    }
    $scope.addCourseDisabled = true;

    $scope.addCourse = function () {
        if ($scope.class.forAddCourse && $scope.class.forAddCourse.length > 0) {
            $scope.addCourseDisabled = true;
            angular.forEach($scope.class.forAddCourse, function (item) {
                item.classid = $stateParams.id;
                item.coursewareid = item.id;
                item.category = $stateParams.type;
            });
            getDataSource.doArray("insertClassCourseware", $scope.class.forAddCourse, function (data) {
                angular.forEach($scope.class.forAddCourse, function (item) {
                    _.remove($scope.class.courseList, { id: item.id });
                    //item.classid = $stateParams.id;
                    //item.coursewareid = item.id;
                    //item.category = $stateParams.type;
                });
                getDataSource.getDataSource("update_sy_class_studytime", { classid: $stateParams.id }, function (data) { }, function (e) { })

                $scope.class.forAddCourse = [];
                $scope.initTable();
            });
            //$scope.updatescore();
             
        }
    }

    $scope.updatescore = function (p) {

        getDataSource.getDataSource("updateClassStudytime", { classid: $stateParams.id }, function (data) {
            console.log(data);
        });

    }


    $scope.$watch("class.forAddCourse", function (newValue) {
        if (newValue.length > 0)
            $scope.addCourseDisabled = false;
        else
            $scope.addCourseDisabled = true;
    })
}]);