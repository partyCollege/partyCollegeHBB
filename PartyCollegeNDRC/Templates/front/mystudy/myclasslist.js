app.controller("myclasslistController", ['$scope', '$location', '$rootScope', '$interval', 'getDataSource', 'FilesService', 'CommonService', function ($scope, $location, $rootScope, $interval, getDataSource, FilesService, CommonService) {

    $scope.config = {
        pageIndex: 1,
        pageSize: 3,
        moreShow:false,
        pageIndex_history: 1,
        pageSize_history: 3,
        moreShow: [false , false],
        type : 0
    };

    $scope.classStatistics = { classcount: 0 , historyclasscount: 0 };
    getDataSource.getDataSource("getMyClassCount", { studentid: $rootScope.user.studentId }, function (data) {
        if (data && data.length > 0) {
            var item = _.find(data, { type: 0 });
            if (item)
                $scope.classStatistics.classcount = item.classcount;
            var item1 = _.find(data, { type: 1 });
            if (item1)
                $scope.classStatistics.historyclasscount = item1.classcount;

        }
    }, function (e) { })
    
    $scope.myClasslist = [[],[]];
    var getMyclasslist = function (type) {
        getDataSource.getDataSource("getMyClassList",
            {
                pageindex: ($scope.config.pageIndex - 1) * $scope.config.pageSize ,
                pagesize: $scope.config.pageSize,
                userid: $rootScope.user.studentId
            },
            function (data) {
                if (data && data.length > 0) {
                    $scope.myClasslist[0] = _.union($scope.myClasslist[0], data);
                    $scope.config.pageIndex++;
                    if (data.length >= $scope.config.pageSize)
                        $scope.config.moreShow[0] = true;
                    else
                        $scope.config.moreShow[0] = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.config.moreShow[0] = false;
                        CommonService.alert("没有更多数据了");
                    }
            }, function (error) { })
    }
    getMyclasslist();

    var getMyHistotyclasslist = function (type) {
        getDataSource.getDataSource("getMyHistoryClassList",
            {
                pageindex: ($scope.config.pageIndex_history - 1) * $scope.config.pageSize_history,
                pagesize: $scope.config.pageSize_history,
                userid: $rootScope.user.studentId
            },
            function (data) {
                if (data && data.length > 0) {
                    $scope.myClasslist[1] = _.union($scope.myClasslist[1], data);
                    $scope.config.pageIndex_history++;
                    if (data.length >= $scope.config.pageSize_history)
                        $scope.config.moreShow[1] = true;
                    else
                        $scope.config.moreShow[1] = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.config.moreShow[1] = false;
                        CommonService.alert("没有更多数据了");
                    }
            }, function (error) { })
    }
    getMyHistotyclasslist();

    $scope.more = function () {
        if ($scope.config.type == 0)
            getMyclasslist("more");
        else if ($scope.config.type == 1)
            getMyHistotyclasslist("more");
    }

    $scope.selecttype = function (type) {
        $scope.config.type = type;
        if (type == 0) {
            if ($scope.config.pageIndex == 1)
                getMyclasslist();
        }
        else if (type == 1) {
            if ($scope.config.pageIndex_history == 1)
                getMyHistotyclasslist();
        }
    }

    $scope.goClass = function (classid) {

        if ($rootScope.user && $rootScope.user.isLogin == true) {
            $rootScope.user.classId = classid;

            getDataSource.getUrlData("../api/ChangeClass", { classid: classid  }, function (data) {

                if (data.result = true) {
                    location.href = "../html/indexfront.html#/main/myclass";
                }
            }, function (errortemp) {

            });

        } else {
            alert("登录时效已过期,请重新登录");
        }
    }
}])