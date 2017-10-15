app.controller("coursewarenoteController", ["$scope", "$rootScope", "$stateParams", "$modal", "getDataSource", "CommonService", "FilesService", '$http', function ($scope, $rootScope, $stateParams, $modal, getDataSource, CommonService, FilesService, $http) {

    getDataSource.writeLog("页面访问-笔记", "20034");

    $scope.currentPageIndex = 1;
    $scope.currentPageSize = 5;
    //笔记信息
    $scope.coursewareNotes = [];
    //更多按钮是否显示
    $scope.moreShow = false;


    //获取图片全路径
    $scope.getImg = function (photoserverfilename, photofilename, type) {
        return FilesService.showFile(type, photoserverfilename, photofilename);

    }

    //回放
    $scope.stutynotePlay = function (notetime) {
        window.stutynotePlay(notetime);
    }

    //加载更多我的问题
    $scope.loadMore = function () {
        getCoursewarenotes("more");
    }

    var getCoursewarenotes = function (type) {
        getDataSource.getDataSource("getCoursewarenotes",
            {
                coursewareid: $stateParams.coursewareid,
                studentid: $rootScope.user.studentId,
                pageindex: ($scope.currentPageIndex - 1) * $scope.currentPageSize,
                pagesize: $scope.currentPageSize
            },
            function (data) {
                if (data && data.length > 0) {
                    $scope.coursewareNotes = _.union($scope.coursewareNotes, data);
                    $scope.currentPageIndex++;
                    if (data.length >= $scope.currentPageSize)
                        $scope.moreShow = true;
                    else
                        $scope.moreShow = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.moreShow = false;
                        CommonService.alert("没有更多数据了");
                    }
            },
            function (error) { }
        );
    }
    getCoursewarenotes();
    $scope.output = function () {
        window.open("../api/exportNote/" + $stateParams.coursewareid + "/" + $rootScope.user.studentId + "/" + $stateParams.classcourseid);
    }



    //监控提问数量
    $scope.$watch("videoConfig.coursewarenoteCount", function (newvalue, oldvalue) {
        if (newvalue > oldvalue) {
            $scope.coursewareNotes = [];
            $scope.currentPageIndex = 1;
            getCoursewarenotes();
        }

    });

    //删除笔记
    $scope.deletenote = function (id) {
        if (confirm("确定要删除吗")) {
            getDataSource.getDataSource("delete_sy_classcourse_note",
                {
                    id: id
                },
                function (data) {
                    $scope.coursewareNotes = [];
                    $scope.currentPageIndex = 1;
                    getCoursewarenotes();
                    CommonService.alert("删除成功");
                },
                function (error) {
                    CommonService.alert("删除失败");
                }
            );
        }
    }
}]);