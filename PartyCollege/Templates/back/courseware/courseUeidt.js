angular.module("myApp")
.controller("courseUeidtController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {
    $(function () {
        $('.inputmask').inputmask({
            mask: '99:99:99'
        })
    });
    //加载编辑信息
    $scope.gridEditOptions = {};
    $scope.loadEditInfo = function () {
        $scope.gridEditOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            data: [],
            columnDefs: [
              { name: '起始时间', field: "starttime", width: '15%' },
              { name: "截止时间", field: "endtime", width: '15%' },
              { name: "起始文字", field: "startword", width: '20%' },
              { name: "截止文字", field: "endword", width: '20%' },
              { name: "意见", field: "opinion", width: '25%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
    }
    $scope.loadEditInfo();


    //获取课件编辑数据
    $scope.loadEditData = function () {
        getDataSource.getDataSource("select_sy_courseware_edit", { coursewareid: $stateParams.id }, function (data) {
            $scope.gridEditOptions.data = data;
        })

    }
    $scope.loadEditData();


    //课程编辑
    $scope.coursewareedit = {
        coursewareid: $stateParams.id
    }
    //打开课件编辑
    $scope.openUeidt = function () {
        $scope.modalInstance = $modal.open({
            templateUrl: 'eidtInfo.html',
            size: 'lg',
            scope: $scope
        });
    }

    //保存课件编辑信息
    $scope.saveUeidt = function () {
        if ($scope.coursewareedit.starttime != undefined && $scope.coursewareedit.starttime != "") {
            getDataSource.getDataSource("insert_sy_courseware_edit", {
                coursewareid: $stateParams.id,
                starttime: $scope.coursewareedit.starttime,
                endtime: $scope.coursewareedit.endtime,
                startword: $scope.coursewareedit.startword,
                endword: $scope.coursewareedit.endword,
                opinion: $scope.coursewareedit.opinion
            }, function (data) {
                notify({ message: '添加成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadEditData();
                $scope.close();
                $scope.coursewareedit = {};
            })
        }
        else {
            notify({ message: '请输入起始时间！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }
    }

    //删除课件编辑信息
    $scope.deleteUeidt = function () {
        var selectUeidt = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectUeidt) {
            if (ids == "") {
                ids = selectUeidt[idx].id;
            } else {
                ids += "','" + selectUeidt[idx].id;
            }
        }
        getDataSource.getDataSource("delete_sy_courseware_editbyid", {
            ids: ids
        }, function (data) {
            notify({ message: '删除成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadEditData();
        })
    }

    //保存描述信息
    $scope.saveComment = function () {
        getDataSource.getDataSource("update_sy_courseware_comment", {
            id: $stateParams.id,
            comment: $scope.course.comment
        }, function (data) {
            notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        })
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);