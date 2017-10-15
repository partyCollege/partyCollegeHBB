angular.module("myApp")
.controller("courseExamController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.st = {};
    $scope.checkedAnswer = {};
    $scope.gridApiST = {};
    $scope.gridSTOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '试题名称', field: "examtitle", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.oepnST(row)">{{row.entity.examtitle}}</a></div>' },
          { name: '题型', field: "examcategory", cellFilter: "examCategoryFilter" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApiST = gridApi;
        }
    };

    //试题初始化
    $scope.doinitST = function () {
        getDataSource.getDataSource("selectExamByCourse", { id: $stateParams.id }, function (data) {
            $scope.gridSTOptions.data = data;
        })
    }

    $scope.doinitST();

    //删除试题
    $scope.deleteST = function () {
        var selectRows = $scope.gridApiST.selection.getSelectedRows();
        getDataSource.doArray("deleteExam", selectRows, function (data) {
            $scope.doinitST();
        });
    }
    

    //删除一个试题答案
    $scope.deleteAnswer = function (item) {
        _.pull($scope.answers, item);
    }
    //保存一个试题
    $scope.addST = function () {
        if ($scope.st.examcategory == 0) {
            angular.forEach($scope.answers, function (item) {
                if (item.id == $scope.checkedAnswer.checkedID) {
                    item.isright = 1;
                }
                else {
                    item.isright = 0;
                }
            })
        }
        if ($scope.newst) {
            $scope.st.id = getDataSource.getGUID();
            $scope.st.coursewareid = $stateParams.id;
            angular.forEach($scope.answers, function (data) {
                data.examid = $scope.st.id;
            });
            getDataSource.getDataSource("addCourseExam", $scope.st, function (data) {
                getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                    $scope.doinitST();
                    $scope.close();
                });
            });
        }
        else {
            getDataSource.getDataSource("updateCourseExam", $scope.st, function (data) {
                getDataSource.getDataSource("deleteExamAnswer", { examid: $scope.st.id }, function (data) {
                    getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                        $scope.doinitST();
                        $scope.close();
                    });
                });
            });
        }
    }
    //新增一个试题答案
    $scope.addExamAnswer = function () {
        $scope.answers.push({
            id: getDataSource.getGUID(),
            isright: false,
            answer: "",
            examid: $scope.st.id
        });
    }

    //更换试题类型，清空所有课题
    $scope.changeST = function () {
        $scope.answers = [];
    }

    //打开试题编辑窗口
    $scope.oepnST = function (row) {

        //是否是新增试题
        if (row) {
            $scope.newst = false;
            $scope.st = row.entity;
            getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                var checkedid = "";
                angular.forEach(data, function (item) {
                    if (item.isright == 1) {
                        checkedid = item.id;
                        item.isright = true;
                    }
                });
                $scope.answers = data;
                $scope.checkedAnswer.checkedID = checkedid;
            });
        }
        else {
            $scope.newst = true;
            $scope.st = {};
            $scope.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'ST.html',
            size: 'lg',
            scope: $scope
        });
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

}]);