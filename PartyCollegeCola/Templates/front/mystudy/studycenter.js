app.controller("studyCenterController", ['$scope', '$stateParams', '$rootScope', '$interval', '$timeout', 'getDataSource', 'FilesService', 'CommonService', function ($scope, $stateParams, $rootScope, $interval, $timeout, getDataSource, FilesService, CommonService) {
   
    //查询条件
    $scope.searchparameter = {
        condation: "", searchType: "1", pageIndex: 0, pageSize: 6, isMore: false
    };

    $scope.linkActive = function (aKey) {
          
        $(".right_btnGroup a.active").removeClass("active");
        $("#" + aKey).addClass("active");
        $scope.searchparameter.searchType= aKey.replace("order",'');

        $scope.resetSearch();
    }

  
    $scope.playVideo = function (n) {         
        var href = "../html/indexvideo.html#/beforevideo/" + n.coursewareid;
       window.open(href, "playVideo");         
    }
     
    function doWork(data) {

        for (var i = 0; i < data.length; i++) {
            data[i].photo = FilesService.showFile("coursewarePhoto", data[i].imagephoto, data[i].imagephoto);
        }

        return data;
    }

    $scope.remove = function (n) {
        
        var del = function () {

            var parameter = {
                studentid: $rootScope.user.studentId,
                coursewareid: n.coursewareid,
                status:"-1"
            };
            //getDataSource.getDataSource('deletestudyrecord', parameter, function (data) {
            //    if (data.length > 0 && data[0].crow > 0) {
            //        CommonService.alert("删除记录成功"); 
            //        _.remove($scope.datalist, { wareusrid: n.wareusrid }); 
            //    } else {
            //        CommonService.alert("删除记录失败");
            //    }
            //}, function (error) { });   
            getDataSource.getUrlData("../api/addcoursewareuser", parameter, function (data) {
                if (data.result) {
                    CommonService.alert("删除记录成功");
                    _.remove($scope.datalist, { wareusrid: n.wareusrid });
                } else {
                    CommonService.alert("删除记录失败");
                }
            }, function (errortemp) { });
        }
         
        _.merge($rootScope.confirmOptions, {
            message: "确定要删除该学习记录吗?",
            confirm: function () {
                del();
            }
        });

        $rootScope.confirmOptions.open(); 
    }
   
    $scope.search = function () {
        $scope.searchparameter.isMore = false;
        getDataSource.getUrlData("../api/getallstudylist", $scope.searchparameter, function (data) {
            if (data.result) {
                $scope.datalist = _.union($scope.datalist, doWork(data.list));
                $scope.allcount = data.allcount;

                if ($scope.datalist.length < $scope.allcount && data.list.length > 0)
                    $scope.searchparameter.isMore = true;
            }
        }, function (errortemp) { });

    }

    //回车登录
    $scope.searchKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.resetSearch();
        }
    };

    $scope.resetSearch = function () {

        $scope.datalist = [];
        $scope.searchparameter.pageIndex = 1;
        $scope.searchparameter.isMore = false;
        $scope.search();
    }

    $scope.reset = function () {
        $scope.searchparameter.condation = "";
        $scope.resetSearch();
    }

    $scope.more = function () {
        $scope.searchparameter.pageIndex++;
        $scope.search();
    }

    $scope.allcount = 0;
    $scope.more();

}])