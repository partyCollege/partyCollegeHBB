app.controller("courseinfoController", ['$scope', '$stateParams', '$rootScope', '$interval', '$timeout', '$document', 'getDataSource', 'FilesService', 'CommonService', function ($scope, $stateParams, $rootScope, $interval, $timeout, $document, getDataSource, FilesService, CommonService) {


    //查询条件
    $scope.searchparameter = {
        coursewareid: $stateParams.id,
        studentid: $rootScope.user.studentId,
        studentid2: $rootScope.user.studentId,
        pageIndex: 1,
        pageSize: 5,
        isMore: false
    };

    $scope.datateacher = [];

    $scope.getCourseInfo = function () {

    	getDataSource.getDataSource(["getCourseInfo_SelectCourse", "getCoursewareTeachers"], $scope.searchparameter, function (datatemp) {
    		var data = _.find(datatemp, { name: "getCourseInfo_SelectCourse" }).data;
    		$scope.datateacher = _.find(datatemp, { name: "getCoursewareTeachers" }).data;

            data[0].photo = FilesService.showFile("coursewarePhoto", data[0].imagephoto, data[0].imagephoto);
            $scope.courseinfo = displayButtonStyle(data[0]);
            $scope.courseinfo.comment = ($scope.courseinfo.comment == null || $scope.courseinfo.comment == undefined || $scope.courseinfo.comment == "") ? "暂无简介" : $scope.courseinfo.comment;
            //是否选修
            $scope.courseinfo.iselective = $scope.courseinfo.relationid == null ? 0 : 1;

            $document[0].title = $scope.courseinfo.coursewarename;


            if ($scope.courseinfo.isrequiredchoose > 0) {
                $scope.getRequiredClass();
            }


        }, function (error) { });

    }

    $scope.getRequiredClass = function () {

        getDataSource.getDataSource("getRequiredClassList_CourseInfo", $scope.searchparameter, function (data) {

            $scope.myClasslist = data;

        }, function (error) { });
    }

    $scope.goClass = function (classid) {

        if ($rootScope.user && $rootScope.user.isLogin == true) {
            $rootScope.user.classId = classid;

            getDataSource.getUrlData("../api/ChangeClass", { classid: classid }, function (data) {

                if (data.result = true) {
                    location.href = "../html/indexfront.html#/main/myclass";
                }
            }, function (errortemp) {

            });

        } else {
            alert("登录时效已过期,请重新登录");
        }
    }


    function displayButtonStyle(n) {

        if (n.isplaycompletion == 1) {
            n.buttontext = "已学";
            n.style = false;
        } else if (n.iselectivechoose == 1 && n.isrequiredchoose) {
            n.buttontext = "已选";
            n.style = false;
        } else if (n.iselectivechoose == 1) {
            n.buttontext = "选修已选";
            n.style = false;
        } else if (n.isrequiredchoose == 1) {
            n.buttontext = "必修已选";
            n.style = false;
        } else {
            n.buttontext = "选课";
            n.style = true;
        }

        return n;
    }

    function doWork(data) {

        for (var i = 0; i < data.length; i++) {
            data[i].userphoto = FilesService.showFile("userPhoto", data[0].photo_serverthumbname, data[0].photo_serverthumbname);
        }

        return data;
    }

    $scope.chooseCourse = function () {

        if ($scope.courseinfo.iselectivechoose > 0 || $scope.courseinfo.isrequiredchoose > 0) return;
        $scope.searchparameter.status = "0";
        var choose = function () {
            getDataSource.getUrlData("../api/addcoursewareuser", $scope.searchparameter, function (data) {
                if (data.result) {
                    $scope.courseinfo.iselectivechoose = 1;
                    $scope.courseinfo.style = false;
                    $scope.courseinfo.buttontext = "选修已选";
                    $scope.courseinfo.jointime = data.data;
                    CommonService.alert("选修课程成功");
                }
            }, function (errortemp) { });

        }

        _.merge($rootScope.confirmOptions, {
            message: "确定选修该课程吗?",
            confirm: function () {
                choose();
            }
        });

        $rootScope.confirmOptions.open();
    }

    $scope.playVideo = function () {

        if ($scope.courseinfo.iselectivechoose > 0 || $scope.courseinfo.isrequiredchoose > 0) {

            var href = "../html/indexvideo.html#/beforevideo/" + $scope.searchparameter.coursewareid;
            window.open(href, "playVideo");

        }
    }

    $scope.search = function () {

        $scope.searchparameter.isMore = false;

        getDataSource.getUrlData("../api/getallcoursecomments", $scope.searchparameter, function (data) {
            if (data.result) {
                $scope.datalist = _.union($scope.datalist, doWork(data.list));;
                $scope.allcount = data.allcount;

                if ($scope.datalist.length < $scope.allcount && data.list.length > 0)
                    $scope.searchparameter.isMore = true;
            }
        }, function (errortemp) { });

    }

    $scope.more = function () {
        $scope.searchparameter.pageIndex++;
        $scope.search();
    }

    $scope.allcount = 0;

    $scope.getCourseInfo();
    $scope.search();

}])
