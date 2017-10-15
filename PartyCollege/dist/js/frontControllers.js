app.controller("mainController", ['$scope', '$rootScope', '$state', '$http', '$location', '$document', 'getDataSource', 'DateService', 'SessionService', 'FilesService'
	, function ($scope, $rootScope, $state, $http, $location, $document, getDataSource, DateService, SessionService, FilesService) {

	    $scope.defaultUserPhoto = "../img/default_img.png";

	    $scope.userHeadphoto = FilesService.getUserPhoto();
	    $scope.departmentname = $rootScope.user.departmentName;
	    $scope.yearplanStudytimeRate = 0;
	    $scope.userReportData = {
	        id: '',
	        userid: '',
	        classcount: 0,
	        waitcoursecount: 0,
	        finishedcoursecount: 0,
	        totalstudytime: 0,
	        electivestudytime: 0
	    };
	    var parameter= { studentid: $rootScope.user.studentId,year: new Date().getFullYear() };
	    getDataSource.getDataSource("getUserReportByUserId", parameter,
            function (data) {
                if (data && data.length > 0) {
                    $scope.userReportData = data[0];
                    $scope.showYeaplan = false;
                    var totalstudytime = $scope.userReportData.totalstudytime;
                    if ($rootScope.user.yearplan && $rootScope.user.yearplan.departmentname != "") {
                    	$scope.departmentname = $rootScope.user.yearplan.departmentname;

                        var yearplanstudytime = $rootScope.user.yearplan.studytime;
                        if (yearplanstudytime != "无") {
                            $scope.showYeaplan = true;
                            $scope.yearplanStudytimeRate = $scope.userReportData.yearplan_progess;
                        }
                    }
                } else {
                    $scope.userReportData.classcount = 0; 
                    $scope.userReportData.finishedcoursecount = 0; 
                    $scope.userReportData.totalstudytime = 0;
                }
                setTimeout(function () {
                    var radObj = $('#indicatorContainer').data('radialIndicator');
                    radObj.animate($scope.yearplanStudytimeRate);
                }, 300);

            }, function (error) { })

        
	    $rootScope.confirmOptions = {
	        message: "提示",
	        isOpened: false,
	        open: function () {
	            this.isOpened = true;
	        },
	        closed: function () {
	            this.isOpened = false;
	        }
	    };

	    //弧形进度条
	    $(function () {
	        $('#indicatorContainer').radialIndicator({
	            barColor: '#84d849',
	            barWidth: 5,
	            initValue: 100,
	            roundCorner: true,
	            percentage: true,
	            displayNumber: false,
	            radius: 50
	        });
	    });


	    var path = $location.$$path;
	    var pArr = path.split("/");
	    var currentView = pArr[pArr.length - 1];
	    for (var i = 0; i < $rootScope.mainConfig.length; i++) {
	        var n = $rootScope.mainConfig[i];
	        n.select = false;
	        for (var a = 0; a < n.childMenus.length ; a++) {
	            if (path.indexOf(n.childMenus[a]) >= 0) {
	                n.select = true;
	                break;
	            }
	        }
	    }

	    //选项卡
	    $scope.aClick = function (ename) {

	        _.find($rootScope.mainConfig, { 'select': true }).select = false;;
	        _.find($rootScope.mainConfig, { 'elementName': ename }).select = true;

	    };

	    $rootScope.loadingOptions = {
	        message: "正在处理中,请稍候",
	        isOpened: false
	    };

	    //$scope.settotal = function () {
             
	    //    var p = {};
	    //    p.departmentid = $rootScope.user.departmentId;
	    //    p.studentid = $rootScope.user.studentId;
	    //    p.accountid = $rootScope.user.accountId;
	    //    p.rank = $rootScope.user.yearplan.rank;
	    //    return;
	    //    getDataSource.getUrlData("../api/gettotal", p, function (data) {
	    //        alert(JSON.stringify(data));
	    //    }, function (errortemp) { });
	    //}(); 
	    //console.log($rootScope.user); 
	}])
app.controller("archivesController", ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $timeout, $state, $stateParams, getDataSource, CommonService) {

    $scope.getArchives = function () {
        getDataSource.getDataSource("getarchives", { studentid: $rootScope.user.studentId }, function (data) { 
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].expand = false;
                    data[i].src = "../img/arrow01.png";
                    data[i].keywordsArr = data[i].keywords.split(",");
                    data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);
                }
                data[0].expand = true;
                data[0].src = "../img/arrow02.png";
                $scope.datalist = data;
            }
        }, function (error) { });
    }

    $scope.onExpand = function (n) {
        n.expand = !n.expand;
        n.src = n.expand == false ? "../img/arrow01.png" : "../img/arrow02.png";
    }

    $scope.goTrain = function (pIndex) {
        var url = "indexfront.html#/main/studytotal/" + pIndex;
        location.href = url;
    }

    $scope.getArchives();

}])

app.controller("containerController", ['$scope', '$rootScope', '$http', '$document', 'getDataSource', function ($scope, $rootScope, $http, $document, getDataSource) {
    $document[0].title = _.find($rootScope.myStudyLinks, { id: "1002" }).title;

}])

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

app.controller("allCourseController", ['$scope', '$stateParams', '$rootScope', '$interval', '$timeout', 'getDataSource', 'FilesService', 'CommonService', function ($scope, $stateParams, $rootScope, $interval, $timeout, getDataSource, FilesService, CommonService) {

    var date = new Date();
    var currentYear = date.getFullYear();
    $scope.allYears = [
        { id: "firstyear", showtext: (currentYear) + "年", datavalue: " =," + date.getFullYear() },
        { id: "twoyear", showtext: (currentYear - 1) + "年", datavalue: " =," + (currentYear - 1) },
        { id: "thridyear", showtext: (currentYear - 2) + "年", datavalue: " =," + (currentYear - 2) },
        { id: "fouryear", showtext: (currentYear - 3) + "年", datavalue: " =," + (currentYear - 3) },
        { id: "fiveyear", showtext: (currentYear - 4) + "年以前", datavalue: " <=," + (currentYear - 4) }
    ];
    $scope.allCourseType = [
         { id: "type_sp", showtext: "视频", datavalue: "0" },
         { id: "type_fsp", showtext: "非视频", datavalue: "1" }
    ];
    $scope.allSearchType = [
        { id: "search_zx", showtext: "最新", datavalue: "1" },
        { id: "search_jp", showtext: "精品", datavalue: "2" },
        { id: "search_tj", showtext: "推荐", datavalue: "3" },
        { id: "search_ph", showtext: "排行", datavalue: "4" }
    ];
    //查询条件
    $scope.searchparameter = {
        condation: "", onecate: "", twocate: "", year: "", courseType: "", searchType: "", pageIndex: 0, pageSize: 6, isMore: false
    };

    if ($stateParams.param) {
        var st = _.find($scope.allSearchType, { datavalue: $stateParams.param });
        if (st) {
            $scope.searchparameter.searchType = $stateParams.param;
            $timeout(function () {
                $(".pull-right a.pull-searchType.active").removeClass("active");
                $("#" + st.id).addClass("active");
            }, 1000);
        }
    }


    //获取一级分类或者二级分类
    function getCategory(id, callback) {
        getDataSource.getDataSource('mystudy-allcourse-category', { fid: id }, function (data) {
            if (callback) {
                callback(data);
            }
        }, function (error) { });
    }

    ////获取所有的二级分类
    //function getAllTwoCategory(callback) {
    //    getDataSource.getDataSource('mystudy-allcourse-alltwocategory', {}, function (data) {
    //        if (callback) {
    //            callback(data);
    //        }
    //    }, function (error) { });
    //}

    //默认获取课程的一级分类
    getCategory("0", function (onecategory) {
        $scope.oneCategory = onecategory;
        //getAllTwoCategory(function (twocategory) {
        //    $scope.twoCategory = twocategory;
        //});
    });

    function getParameter() {

        var $activeLink = {};

        $activeLink = $(".pull-right a.pull-one.active");
        if ($activeLink)
            $scope.searchparameter.onecate = $currentLink.attr("data-value");

        $activeLink = $(".pull-right a.pull-two.active");
        if ($activeLink)
            $scope.searchparameter.twocate = $currentLink.attr("data-value");

        $activeLink = $(".pull-right a.pull-courseType.active");
        if ($activeLink)
            $scope.searchparameter.year = $currentLink.attr("data-value");

        $activeLink = $(".pull-right a.pull-courseType.active");
        if ($activeLink)
            $scope.searchparameter.courseType = $currentLink.attr("data-value");

        $activeLink = $(".pull-right a.pull-searchType.active");
        if ($activeLink)
            $scope.searchparameter.searchType = $currentLink.attr("data-value");


        return searchParameter;
    }

    $scope.selectCourse = function (n) {
        var url = "indexfront.html#/main/courseinfo/" + n.coursewareid;
        window.open(url);
    }

   

    $scope.linkActive = function (linkType, eleid) {
        var $arr = [];
        var aKey = "";
        var $currentLink = $("#" + eleid);
        if (linkType == "pull-one") {
            //$arr = $(".pull-right a.pull-one");
            aKey = ".pull-right a.pull-one";
            $(".pull-right a.pull-two:eq(0)").addClass("active");;
            $scope.searchparameter.onecate = $currentLink.attr("data-value");
            //如果选中一级分类，查询该一级分类下的二级分类
            if ($scope.searchparameter.onecate) {
                $scope.searchparameter.twocate = "";
                getCategory($scope.searchparameter.onecate, function (twocategory) {
                    $scope.twoCategory = twocategory;
                });
                //选中全部，则查询所有的二级分类 
            }
            else {
                //getAllTwoCategory(function (twocategory) {
                //    $scope.twoCategory = twocategory;
                //});
                $scope.twoCategory = [];
            }

        } else if (linkType == "pull-two") {

            //$arr = $(".pull-right a.pull-two");
            aKey = ".pull-right a.pull-two";
            $scope.searchparameter.twocate = $currentLink.attr("data-value");

        } else if (linkType == "pull-year") {

            //$arr = $(".pull-right a.pull-year");
            aKey = ".pull-right a.pull-year";
            $scope.searchparameter.year = $currentLink.attr("data-value");

        } else if (linkType == "pull-courseType") {

            //$arr = $(".pull-right a.pull-courseType");
            aKey = ".pull-right a.pull-courseType";
            $scope.searchparameter.courseType = $currentLink.attr("data-value");


        } else if (linkType == "pull-searchType") {
            //$arr = $(".pull-right a.pull-searchType");
            aKey = ".pull-right a.pull-searchType";
            $scope.searchparameter.searchType = $currentLink.attr("data-value");
        }

        //$arr.each(function () {
        //    $(this).removeClass("active");
        //});   
        $(aKey + ".active").removeClass("active");
        $currentLink.addClass("active");

        $scope.resetSearch();
    }

    $scope.search = function () {
    	//console.log("$scope.searchparameter", $scope.searchparameter);
        $scope.searchparameter.isMore = false;
        getDataSource.getUrlData("../api/getcoursewarelist", $scope.searchparameter, function (data) {
            if (data.result) {
                $scope.datalist = _.union($scope.datalist, doWork(data.list));;
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

    $scope.more = function () {
        $scope.searchparameter.pageIndex++;
        $scope.search();
    }

    function doWork(data) {

        for (var i = 0; i < data.length; i++) {
            displayButtonStyle(data[i]);
        }

        return data;
    }
   
    function displayButtonStyle(n) {

        n.photo = FilesService.showFile("coursewarePhoto", n.imagephoto, n.imagephoto);
     
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
     
    $scope.allcount = 0;
    $scope.more();

}])
app.controller("menuController", ['$scope', '$location', '$rootScope', '$interval', 'getDataSource', 'FilesService', 'CommonService', function ($scope, $location, $rootScope, $interval, getDataSource, FilesService, CommonService) {

}])
app.controller("myclassController", ['$scope', '$rootScope', '$document', '$http', 'getDataSource', 'FilesService', 'CommonService', 'DateService', function ($scope, $rootScope, $document, $http, getDataSource, FilesService, CommonService, DateService) {
    //我的班级
    $document[0].title = _.find($rootScope.myStudyLinks, { id: "1005" }).title;
    //弧形进度条
    $(function () {
        $('#class_indicatorContainer').radialIndicator({
            barColor: '#227700',
            barBgColor: '#FFFFFF',
            barWidth: 3,
            initValue: 100,
            roundCorner: true,
            percentage: true,
            displayNumber: false,
            radius: 77
        });


        $('#my_indicatorContainer').radialIndicator({
            barColor: '#EE8800',
            barBgColor: '#FFFFFF',
            barWidth: 6,
            initValue: 100,
            roundCorner: true,
            percentage: true,
            displayNumber: false,
            radius: 54
        });
    });

    $scope.myConfig = {
        imgShow: false,
        img: {},
        imgUrl: "",
        imgList: [],
        moreShow: false,
        imageType: "",
        interflowBtnShow :false,
        showStudentList: { look: false, select: function () { this.look = !this.look; } },
        coursemoreShow:false
    };

    //----------班级信息,班级资料，学员进度排名-------

    $scope.classAndMyStudyRate = { class_rate: 0, student_rate: 0 };
    var postData = {
    	id: $rootScope.user.classId,
    	studentid: $rootScope.user.studentId,
    	classid: $rootScope.user.classId,
    	classid1: $rootScope.user.classId,
    	classid2: $rootScope.user.classId,
    	classid3: $rootScope.user.classId,
    };

    getDataSource.getDataSource(["getClassInfoById", "getClassStudyRateTop4", "myclass-studyMaterials", "getClassAndMyStudyRate"],
        postData,
        function (data) {
            $scope.classInfo = _.find(data, { name: "getClassInfoById" }).data[0];
            $scope.studyrateTop4 = _.find(data, { name: "getClassStudyRateTop4" }).data;

            //学习资料
            var studyMaterials = _.find(data, { "name": "myclass-studyMaterials" }).data;
            if (studyMaterials.length > 0) {
                var types = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "jpg", "png", "gif", "bmp", "txt"];
                for (var i = 0; i < studyMaterials.length; i++) {
                    if (_.indexOf(types, studyMaterials[i].type) < 0) {
                        studyMaterials[i].type = "other";
                    }
                }
            }
            $scope.studyMaterialsData = studyMaterials;

            //班级，我的学习进度

            $scope.classAndMyStudyRate = _.find(data, { "name": "getClassAndMyStudyRate" }).data[0];

            setTimeout(function () {
                var class_radObj = $('#class_indicatorContainer').data('radialIndicator');
                class_radObj.animate(($scope.classAndMyStudyRate.class_rate * 100).toFixed(0));
                var my_radObj = $('#my_indicatorContainer').data('radialIndicator');
                my_radObj.animate(($scope.classAndMyStudyRate.student_rate * 100).toFixed(0));
            }, 300);
        },
        function (error) { })

    //下载文件
    $scope.downFiles = function (id, attachservername, attachname, type) {
    	return FilesService.downApiFiles(type, attachservername, attachname);
    }


    //----------黑板报-------
    $scope.myInterval = 5000;
    var slideblackboard = $scope.slideblackboard = [];
    $scope.addSlide = function () {
        getDataSource.getDataSource("getClassBloackBoard", { classid: $rootScope.user.classId }, function (datatemp) {
            if (datatemp.length <= 0) {
                slideblackboard.push({ id: new Date().getTime(), src: '../img/myClass_banner.jpg' });
            }
            for (var i = 0; i < datatemp.length; i++) {
                var blackboardimg = FilesService.showFile("blackboard", datatemp[i].boardimg_servername, datatemp[i].boardimg_servername);
                slideblackboard.push({
                    id: datatemp[i].id,
                    src: blackboardimg
                });
            }
        }, function (errortemp) {

        });
    }
    $scope.addSlide();

    //------------------班级交流---------------

    //绑定表情
    $("#aCountenance").SinaEmotion($("#txtContent"));

    //解析表情
    function getCountenance(inputText) {
        return AnalyticEmotion(inputText);
    }

    //解析表情(回调)
    function getCountenanceCallback(inputText, type, id, fid, callback) {
        return AnalyticEmotionCallback(inputText, type, id, fid, callback);
    }

    //表情赋值(回调)
    var setModelValue = function (inputText, type, id, fid) {
        if (type == 1)
            _.find(_.find($scope.interflowData, { id: fid }).commentlist, { id: id }).commentcontent = inputText;
        else if (type == 0)
            _.find($scope.interflowData, { id: id }).content = inputText;
    }


    //默认头像
    $scope.defaultUserPhoto = "../img/default_img.png";
    $scope.defaultEventPhoto = "../img/course_img.jpg";

    //获取图片全路径
    $scope.getImg = function (photoserverfilename, photofilename, type) {
        return FilesService.showFile(type, photoserverfilename, photofilename);

    }

    //当前登录用户默认头像
    $scope.headImg = $rootScope.user.photopath ? $scope.getImg($rootScope.user.photopath, $rootScope.user.photopath, 'userPhoto') : $scope.defaultUserPhoto;

    $scope.files = [];
    $scope.selectFiles = function (files, errorfiles) {
        if ($scope.files.length > 6 || ($scope.files.length + files.length) > 6) {
            CommonService.alert("最多只能上传6张图片");
        }
        else {
            //console.log($scope.files);
            $scope.files = _.union($scope.files, files);
        }

        if (errorfiles && errorfiles.length > 0) {
            CommonService.alert("您选择的" + errorfiles.length.toString() + "张图片可能超过了大小限制,无法上传,单张图片最大为2MB", 3000);
        }

    };

    //删除已选择的图片
    $scope.deleFile = function (file) {
        _.remove($scope.files, function (n) {
            return n.$$hashKey == file.$$hashKey;
        });
    }
    //计算过去多久
    $scope.getDateDiff = function (dateTime) {
        return DateService.getDateDiff(DateService.getDateTimeStamp(dateTime));
    };


    //当前页
    $scope.currentPageIndex = 1;
    //页大小
    $scope.currentPageSize = 5;
    //班级交流数据
    $scope.interflowData = [];

    //加载更多
    $scope.loadMore = function () {
        loadInterflow("more");
    }


    //发布数量
    var insertCount = 0;

    var loadInterflow = function (type) {
        //班级交流
        getDataSource.getDataSource(["myclass-interflow", "myclass-interflow-commentList", "myclass-interflow-imgList"],
            {
                pageindex: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize: $scope.currentPageSize,
                pageindex1: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize1: $scope.currentPageSize,
                pageindex2: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize2: $scope.currentPageSize,
                accountid: $rootScope.user.accountId,
                accountid1: $rootScope.user.accountId,
                accountid2: $rootScope.user.accountId,
                classid: $rootScope.user.classId,
                classid1: $rootScope.user.classId,
                classid2: $rootScope.user.classId,
                classid3: $rootScope.user.classId,
            }, function (data) {
                var interflow = _.find(data, { "name": "myclass-interflow" }).data;
                var commentList = _.find(data, { "name": "myclass-interflow-commentList" }).data;
                var imgList = _.find(data, { "name": "myclass-interflow-imgList" }).data;

                for (var n = 0; n < commentList.length; n++) {
                    if (commentList[n].headimg)
                        commentList[n].headimg = $scope.getImg(commentList[n].headimg, commentList[n].headimg, 'userPhoto');
                    else
                        commentList[n].headimg = $scope.defaultUserPhoto;

                    //解析表情
                    //commentList[n].commentcontent = getCountenance(commentList[n].commentcontent);
                    commentList[n].commentcontent = getCountenanceCallback(commentList[n].commentcontent, 1, commentList[n].id, commentList[n].fid, setModelValue);
                }

                for (var n = 0; n < interflow.length; n++) {
                    if (interflow[n].headimg)
                        interflow[n].headimg = $scope.getImg(interflow[n].headimg, interflow[n].headimg, 'userPhoto');
                    else
                        interflow[n].headimg = $scope.defaultUserPhoto;
                    //解析表情
                    //interflow[n].content = getCountenance(interflow[n].content);
                    interflow[n].content = getCountenanceCallback(interflow[n].content, 0, interflow[n].id, "", setModelValue);

                    _.merge(interflow[n], {
                        'commentlist': commentList.filter(function (a) { return a.fid == interflow[n].id }),
                        'imglist': imgList.filter(function (a) { return a.fid == interflow[n].id })
                    });
                }
                if (interflow && interflow.length > 0) {
                    $scope.interflowData = _.union($scope.interflowData, interflow);
                    $scope.currentPageIndex++;
                    if (interflow.length >= $scope.currentPageSize)
                        $scope.myConfig.moreShow = true;
                    else
                        $scope.myConfig.moreShow = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.myConfig.moreShow = false;
                        CommonService.alert("没有更多数据了");
                    }
            }, function (errortemp) { });
    };

    loadInterflow();

    //交流点赞
    $scope.clickALike = function (id) {
        var like = _.find($scope.interflowData, { "id": id });
        if (!like.isclick) {
            like.isclick = 1;
            getDataSource.getUrlData("../api/commonPraise",
            {
                "eventid": id,
                "accountid": $rootScope.user.accountId,
                "passive_classid": $rootScope.user.classId,
                "passive_accountid": like.accountid,
                "passive_student": like.studentid,
                "usertype": "1", //学员操作
                "eventtype": like.usertype,
                "group": "20015001",
                "tag": "操作-班级交流点赞"
            }, function (flag) {
                if (flag == "true") {
                    like.clickcount++;
                    like.isclick = 1;
                }
            }, function (errortemp) { });
        }
    }

    //绑定表情
    var bindCountenance = function (id) {
        var a = $("#" + id);
        var text = $(a).prev();
        $(a).SinaEmotion($(text));
    }

    //评论显示
    $scope.commentShow = function (id) {

        _.find($scope.interflowData, { "id": id }).commentshow = !_.find($scope.interflowData, { "id": id }).commentshow;
        bindCountenance(id);
    }

    //评论发布
    $scope.comment = function (id) {
        var item = _.find($scope.interflowData, { "id": id });

        var text = $("#" + id).prev().val();
        item.commentcontent = text;

        if (item.commentcontent == "") {
            CommonService.alert("请先输入需要评论的内容");
            return;
        }

        var newid = getDataSource.getGUID();

        getDataSource.getUrlData("../api/interflowComment", {
            "id": newid,
            "classid": $rootScope.user.classId,
            "content": $scope.ReplaceAll(item.commentcontent, "\n", "<br/>"),
            "accountid": $rootScope.user.accountId,
            "fid": id,
            "studentid": $rootScope.user.studentId,
            "passive_classid": $rootScope.user.classId,
            "passive_accountid": item.accountid,
            "passive_student": item.studentid,
            "usertype": "1",  //学员操作
            "eventtype": item.usertype
        }, function (falg) {
            if (falg == "true") {
                //隐藏回复框
                item.commentshow = !item.commentshow;
                //插入前台对象
                item.commentlist.push(
                    {
                        "id": newid,
                        "commentcontent": getCountenance($scope.ReplaceAll(item.commentcontent, "\n", "<br/>")),
                        "commentuserid": $rootScope.user.accountId,
                        "commentuser": $rootScope.user.name,
                        "headimg": $scope.headImg,
                        "createdtime": DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                        "isdelete": 1,
                        "usertype": "1",
                        "studentid": $rootScope.user.studentId,
                    })
                //清空输入框
                item.commentcontent = "";
            }
        }, function (errortemp) { });
    }

    //交流内容输入框
    $scope.interflowcontent = "";



    var insertInterflow = function (newid) {
        getDataSource.getUrlData("../api/InsertInterflow", $scope.classexchangeData, function (flag) {
            if (flag == "true") {
                var imglist = [];
                if ($scope.classexchangeData.photolist) {

                    for (var i = 0; i < $scope.classexchangeData.photolist.length; i++) {
                        if ($scope.classexchangeData.photolist[i].servername) {
                            var strlist = $scope.classexchangeData.photolist[i].servername.split('.');
                            var servername = strlist[0] + "_small." + strlist[1];
                            imglist.push({
                                picture_serverthumbname: servername,
                                picturename: $scope.classexchangeData.photolist[i].filename,
                                pictureservername: $scope.classexchangeData.photolist[i].servername,
                                uploadTime: DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S')
                            });
                        }
                    }
                }
                $scope.interflowData.unshift(
                {
                    "id": newid,
                    "accountid": $rootScope.user.accountId,
                    "studentid": $rootScope.user.studentId,
                    "studentname": $rootScope.user.name,
                    "headimg": $scope.headImg,
                    "createdtime": DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    "content": getCountenance($scope.ReplaceAll($scope.interflowcontent, "\n", "<br/>")),
                    "imglist": imglist,
                    "commentlist": [],
                    "commentcontent": "",
                    "commentshow": 0,
                    "clickcount": 0,
                    "isdelete": 1,
                    "isclick": 0,
                    "usertype": "1"
                })

                insertCount++;

                //清空输入框
                $scope.interflowcontent = "";
                //清空图片list
                $scope.files = [];
                $scope.myConfig.interflowBtnShow = false;
                CommonService.alert("发布成功");
            }
        });
    };




    $scope.ReplaceAll = function (str, sptr, sptr1) {
        while (str.indexOf(sptr) >= 0) {
            str = str.replace(sptr, sptr1);
        }
        return str;
    }

    //交流内容发布
    $scope.interflow = function () {
        $scope.interflowcontent = $("#txtContent").val();

        if ($scope.interflowcontent == "") {
            CommonService.alert("请先输入需要发布的内容");
            return;
        }

        $scope.myConfig.interflowBtnShow = true;
        var newid = getDataSource.getGUID();

        $scope.classexchangeData =
            {
                classexchange: {
                    "id": newid,
                    "classid": $rootScope.user.classId,
                    "content": $scope.ReplaceAll($scope.interflowcontent, "\n", "<br/>"),
                    "accountid": $rootScope.user.accountId,
                    "usertype": "1",
                    "studentid": $rootScope.user.studentId,
                    "fid": ''
                }
            };


        if ($scope.files) {
            FilesService.upLoadPicture($scope.files, { upcategory: "interflowPhoto", width: 180, height: 180 }, function (data) {
                $scope.classexchangeData = _.merge($scope.classexchangeData, { photolist: data.data });
                insertInterflow(newid);

            }, function (error) {
                CommonService.alert("发布失败");
            });
        }
        else {
            insertInterflow(newid);
        }
    };


    //删除自己的交流内容
    $scope.deleteInterflow = function (id) {
        if (confirm("确定要删除吗？")) {
            getDataSource.getDataSource(['delete_sy_classexchange', 'delete_sy_classexchange_picture', 'delete_sy_classexchange_praise'],
                {
                    id: id,
                    fid: id,
                    exchangeid: id,
                    eventid: id
                }, function (data) {
                    _.remove($scope.interflowData, { "id": id });
                    insertCount--;
                    CommonService.alert("删除成功");
                }, function (data) {
                    CommonService.alert("删除失败，请重试");
                });
        }
    }

    //删除自己的评论
    $scope.deleteComent = function (id, fid) {
        if (confirm("确定要删除吗？")) {
            getDataSource.getDataSource(['delete_sy_classexchange_coment'],
                {
                    id: id
                }, function (data) {
                    var item = _.find($scope.interflowData, { "id": fid }).commentlist;
                    _.remove(item, { "id": id });
                    CommonService.alert("删除成功");
                }, function (data) {
                    CommonService.alert("删除失败，请重试");
                });
        }
    }

    //点击放大或者关闭图片
    $scope.showImg = function (imglist, img, type) {

        if (!$scope.myConfig.imgShow) {
            $scope.myConfig.imageType = type;
            if (imglist == undefined || imglist.length == 0) return;

            $scope.myConfig.imgUrl = $scope.getImg(img.pictureservername, img.pictureservername, type);
            $scope.myConfig.img = img;
            $scope.myConfig.imgList = imglist;

            $scope.myConfig.imgShow = !$scope.myConfig.imgShow;
            $(function () {
                $scope.ImgHeight = { "line-height": $(window).height() + "px" };
            });
        }
        else {
            $scope.myConfig.imgShow = !$scope.myConfig.imgShow;
            $scope.myConfig.img = {};
            $scope.myConfig.imgUrl = "";
            $scope.myConfig.imgList = [];
        }

    }

    //左右切换图片
    $scope.nextImg = function (type) {
        if ($scope.myConfig.imgList.length > 0) {
            var index = _.findIndex($scope.myConfig.imgList, function (n) {
                return n == $scope.myConfig.img;
            });
            var maxLength = $scope.myConfig.imgList.length;
            if (type == 2) {
                if ((index + 1) < maxLength) {
                    var nextImg = $scope.myConfig.imgList[index + 1];
                    $scope.myConfig.img = nextImg;
                    $scope.myConfig.imgUrl = $scope.getImg(nextImg.pictureservername, nextImg.pictureservername, $scope.myConfig.imageType);
                }
                else
                    CommonService.alert("已经是最后一张");
            }
            else {
                if ((index - 1) >= 0) {
                    var nextImg = $scope.myConfig.imgList[index - 1];
                    $scope.myConfig.img = nextImg;
                    $scope.myConfig.imgUrl = $scope.getImg(nextImg.pictureservername, nextImg.pictureservername, $scope.myConfig.imageType);
                } else
                    CommonService.alert("已经是第一张");
            }
        }
    }

    //---------必修课----------------------

    $scope.maxSize = 10;
    $scope.totalItems = 0;
    $scope.pageSize = 6;
    $scope.currentPage = 1;
    $scope.searchText = "";
    $scope.ordertype = 1;

    $scope.pageChanged = function () {
    	var postData = {
    		classid: $rootScope.user.classId,
    		studentid: $rootScope.user.studentId,
    		currentPage: $scope.currentPage,
    		pageSize: $scope.pageSize,
    		orderType: $scope.ordertype
    	};

        getDataSource.getUrlData("../api/searchClassCoursewarelist",postData,
            function (data) {
                if ($scope.currentPage == 1)
                    $scope.totalItems = data.datacount;
                if (data && data.courseList && data.courseList.length > 0)
                    $scope.myConfig.coursemoreShow = true;
                var coursedata = data.courseList;
                for (var i = 0; i < coursedata.length; i++) {
                    coursedata[i].imagephoto = FilesService.showFile("coursewarePhoto", coursedata[i].imagephoto, coursedata[i].imagephoto);
                }
                $scope.courseList = coursedata;

            },
            function () { }
         );
    }


    $scope.pageChanged();

    $scope.selectOrderType = function (type) {
        $scope.ordertype = type;
        $scope.currentPage = 1;
        $scope.pageChanged();
    }



    var openWindow = function (href, name) {

        if ($scope.windowObj) {
            $scope.windowObj.close();
        }

        $scope.windowObj = window.open("about:blank", name);
        if ($scope.windowObj) {
            $scope.windowObj.location = href;
        }
    }

    $scope.ContinueStudy = function (coursewareid) {
        var href = "../html/indexvideo.html#/beforevideo/" + coursewareid;
        openWindow(href, "playVideo");
    }

}])
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
app.controller("mystudyController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce) {

	}])
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
app.controller("studytotalController", ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $timeout, $state, $stateParams, getDataSource, CommonService) {


    $scope.tabs = [
        { id: "1000", title: "总体情况统计", selected: false, isshow: true, index: 0, init: function () { $scope.goAutoCompute(); } },
        { id: "1001", title: "选修学时", selected: false, isshow: true, index: 1, init: function () { $scope.inittrain(); } },
        { id: "1002", title: "学习班", selected: false, isshow: true, index: 2, init: function () { $scope.inittrain(); } },
        { id: "1003", title: "面授培训", selected: false, isshow: true, index: 3, init: function () { $scope.inittrain(); } }
    ];

    $scope.changetab = function (n, cyear,ctype) {
        for (var i = 0; i < $scope.tabs.length; i++) {
            $scope.tabs[i].selected = false;
        }
        n.selected = true;
        $scope.pIndex = n.index;
        $scope.pagefilter.type = n.index;
        $scope.pagefilter.reset();
        $scope.searchfilter.year = yearInt;
        $scope.searchfilter.ctype = 0;
        if (cyear) {
            $scope.searchfilter.year = cyear;
        }
        if (ctype) {
            $scope.searchfilter.ctype = ctype;
        }
        if (n.init) n.init();
    }

    $scope.selectchanged = function (pIndex) {
        $scope.pagefilter.reset();
        $scope.pIndex = pIndex;
        var n = $scope.tabs[$scope.pIndex];
        if (n.init) n.init();
    }


    var date = new Date();
    var yearInt = date.getFullYear();
    $scope.yearArr = [];
    var start = 2012;
    for (var i = start; i <= yearInt; i++) {
        $scope.yearArr.push(i);
    }

    $scope.searchfilter = { year: yearInt, totalscore: 0, classid: "" };
    $timeout(function () {
        $scope.searchfilter.year = yearInt;
        $scope.pageinit();
    }, 500);
    $scope.pIndex = 0;

    $scope.pagefilter = {
        maxSize: 6,
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        type: 0,
        reset: function () {
            this.maxSize = 6;
            this.totalItems = 0;
            this.pageSize = 10;
            this.currentPage = 1;
            $scope.datalist = [];
            $scope.ClassAttr.isclassattr = false;
            $scope.searchfilter.totalscore = 0;
            $scope.total.isshow = false;
        }
    };

    $scope.pageChanged = function () {
        var n = $scope.tabs[$scope.pIndex];
        if (n.init) n.init();
    }

    $scope.gotrain = function () {
        $state.go('main.train1');
    }

    $scope.inittrain = function () {

        var parameter = _.merge({}, $scope.searchfilter, $scope.pagefilter);

        getDataSource.getUrlData("../api/gettrain", parameter, function (data) {
            if (data.result) {
                $scope.datalist = data.items;
                $scope.pagefilter.totalItems = data.rows.totalItems;
                $scope.searchfilter.totalscore = data.rows.totalscore;
            }

        }, function (errortemp) { });
    }

    //提交或取消提交面授
    $scope.submittrain = function (n, sta) {

        var tips = sta == 0 ? "确定要取消提交该面授培训吗?" : "确定要提交该面授培训吗";
        var submit = function () {
            //var parameter = { status: sta, id: n.id };
            var parameter = { status: sta, id: n.id, remark: "" };
            getDataSource.getDataSource("submitrain", parameter, function (data) {
                if (data[0] && data[0].crow > 0) {
                    CommonService.alert("操作成功");
                    $scope.tabs[$scope.pIndex].init();
                }
            }, function (error) { });
        }
        _.merge($rootScope.confirmOptions, {
            message: tips,
            confirm: function () {
                submit();
            }
        });

        $rootScope.confirmOptions.open();
    }

    //删除面授
    $scope.deletetrain = function (n) {

        var deltrain = function () {
            var parameter = { id: n.id };
            getDataSource.getDataSource("deletetrain", parameter, function (data) {
                if (data[0] && data[0].crow > 0) {
                    CommonService.alert("操作成功");
                    $scope.tabs[$scope.pIndex].init();
                }
            }, function (error) { });
        }

        _.merge($rootScope.confirmOptions, {
            message: "确定要删除该面授培训吗",
            confirm: function () {
                deltrain();
            }
        });

        $rootScope.confirmOptions.open();

    }

    //编辑面授
    $scope.edittrain = function (n) {
        $state.go('main.train2', { id: n.id });
    }

    $scope.ClassAttr = {
        isclassattr: false,
        classname: ""
    };
    $scope.goClassAttr = function (n) {
        $scope.ClassAttr.isclassattr = true;
        $scope.ClassAttr.classname = n.classname;
        $scope.searchfilter.classid = n.classid;
        $scope.pagefilter.type = 4;

        $scope.inittrain();
    } 
    $scope.total = {
        totalstutytime: 0.0,//总学时
        totaltime: 0,//总时长
        totaltimecn: "",//总时长
        isshow:false
    };

    $scope.getArchives = function () {
        var parameter = {};
        parameter.studentid = $rootScope.user.studentId;
        parameter.startyear = $scope.searchfilter.year;
        parameter.endyear = $scope.searchfilter.year - 4;
        getDataSource.getDataSource("getarchives", parameter, function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].expand = false;
                    data[i].src = "../img/arrow01.png";
                    data[i].keywordsArr = data[i].keywords.split(",");
                    data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);

                    $scope.total.totalstutytime += data[i].total_studytime;
                    $scope.total.totaltime += parseInt(data[i].total_time);
                }
                $scope.total.isshow = true;
                $scope.total.totaltimecn = (parseInt($scope.total.totaltime) / 3600).toFixed(1); 
                data[0].expand = true;
                data[0].src = "../img/arrow02.png";
                $scope.datalist = data;
            }
        }, function (error) { });
    }


    $scope.onExpand = function (n) {
        n.expand = !n.expand;
        n.src = n.expand == false ? "../img/arrow01.png" : "../img/arrow02.png";
    }

    $scope.goChange = function (no, year,ctype) {
        var n = $scope.tabs[parseInt(no)];
        if (n.isshow) {
            $scope.changetab(n, year, ctype);
        }
    }

    $scope.goCompute = function () {

        _.merge($rootScope.confirmOptions, {
            message: "确定要重新生成学习档案吗，这将花费您一定的时间?",
            confirm: function () {
                $scope.goAutoCompute();
            }
        });

        $rootScope.confirmOptions.open();
    }

    $scope.goAutoCompute = function () {
        $rootScope.loadingOptions.message = "正在重新生成学习档案,请稍候....";
        $rootScope.loadingOptions.isOpened = true;

        var p = {};
        p.departmentid = $rootScope.user.departmentId;
        p.studentid = $rootScope.user.studentId;
        p.accountid = $rootScope.user.accountId;
        p.rank = $rootScope.user.yearplan.rank;
        getDataSource.getUrlData("../api/gettotal", p, function (data) {
            $rootScope.loadingOptions.isOpened = false;
            if (data.result) {
                $scope.getArchives();
            }
        }, function (errortemp) { });
    }

    $scope.pageinit = function () {
        var no = $stateParams.no;
        if (no) {
            if (parseInt(no) < $scope.tabs.length) {
                var n = $scope.tabs[parseInt(no)];
                if (n.isshow) {
                    $scope.changetab(n,0);
                }
            }
        }
    }
}])

app.controller("trainController", ['$scope', '$rootScope', '$state', '$timeout', '$stateParams', 'getDataSource', 'DateService', 'CommonService'
 , function ($scope, $rootScope, $state,$timeout, $stateParams, getDataSource, DateService, CommonService) {

     $scope.train = {
         title: "", categoryone: "组织调训", categorytwo: "业务培训", categorythree: "面授培训", categoryfour: "境内培训", starttime: "", endtime: "", studytime: "", year: "",
         address: "", company: "", reference: "",status:0,remark:"" };

     $scope.buttonCtrl = {
         btnSaveStatu: false,
         btnSubmitStatus: false,
         btnSaveDisplay:true,
         btnSubmitDisplay: true,
         enableEdited:false
     };

     var date = new Date();
     var yearInt = date.getFullYear();
     $scope.yearArr = [];
     //var start = yearInt;
     for (var i = 2012; i < yearInt + 2; i++) {
         $scope.yearArr.push(i);
     }

     $scope.pageinit = function () {
     	$scope.train.year = yearInt;
         if ($stateParams.id) {

             $scope.buttonCtrl.btnSaveDisplay = false;
             $scope.buttonCtrl.btnSubmitDisplay = false;

             getDataSource.getDataSource("gettrain", { id: $stateParams.id }, function (data) {
                 if (data[0]) {
                     $scope.train = data[0];
                     $scope.train.starttime = DateService.format(data[0].starttime, "yyyy-MM-dd");
                     $scope.train.endtime = DateService.format(data[0].endtime, "yyyy-MM-dd");
                 }
                 if ($scope.train.status==0) {
                     $scope.buttonCtrl.btnSaveDisplay = true;
                     $scope.buttonCtrl.btnSubmitDisplay = true;
                 } else if ($scope.train.status == 1) {
                     $scope.buttonCtrl.btnSaveDisplay = false;
                     $scope.buttonCtrl.btnSubmitDisplay = false;
                 }
                 if ($scope.train.status != 0) {
                     $scope.buttonCtrl.enableEdited = true;
                 }

             }, function (error) { });
         }
     }

     $scope.submit = function (sta) {

         if (new Date($scope.train.starttime) > new Date($scope.train.endtime)) {
             CommonService.alert("面授的开始时间不能大于结束时间");
             return;
         }
          
         $scope.buttonCtrl.btnSubmitStatus = true;
         $scope.buttonCtrl.btnSaveStatu = true;
         //$scope.buttonCtrl.btnSaveDisplay = false;
         //$scope.buttonCtrl.btnSubmitDisplay = false;

         $scope.train.status = sta;
         getDataSource.getUrlData("../api/addtrain", $scope.train, function (data) {
             CommonService.alert(data.message);
             if (data.result) {
                 $scope.train.id = data.trainid;

                 if (sta == 0) {
                     $scope.buttonCtrl.btnSubmitStatus = false;
                     $scope.buttonCtrl.btnSaveStatu = false;
                 } else if (sta == 1) {
                     $scope.buttonCtrl.btnSaveDisplay = false;
                     $scope.buttonCtrl.btnSubmitDisplay = false;
                 }
             } else {
                 $scope.buttonCtrl.btnSubmitStatus = false;
                 $scope.buttonCtrl.btnSaveStatu = false;
                 //$scope.buttonCtrl.btnSaveDisplay = true;
                 //$scope.buttonCtrl.btnSubmitDisplay = true;
             }
         }, function (errortemp) { });

     }

     $scope.cancel = function () {
         $state.go("main.studytotal", { no: 3 });
     }
     $timeout(function () {
     	$scope.pageinit();
     }, 500);
 }])


app.controller("usercenterController", ['$scope', '$rootScope', '$document', function ($scope, $rootScope, $document) {
     
    $document[0].title = "个人中心";
}])
//app.controller("usercentermenuController", ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {

//    var path = $location.$$path;
//    var pArr = path.split("/");
//    var currentView = pArr[pArr.length - 1];

//    for (var i in $rootScope.userCenterLinks)
//    {
//        var n = $rootScope.userCenterLinks[i];
//        if (n.sref.indexOf(currentView) >= 0)
//            n.isSelected = true;
//        else
//            n.isSelected = false;
//    }

//    $scope.selectMenu = function (iid) {

//        var current = _.find($rootScope.userCenterLinks, { isSelected: true });
//        current.isSelected = false;
//        current = _.find($rootScope.userCenterLinks, { id: iid });
//        current.isSelected = true;

//    }

//}])
app.controller("userinfoController", ['$scope', '$rootScope', '$document', '$http', '$timeout', '$interval', 'getDataSource', 'DateService', 'FilesService', 'CommonService', 'smsService', 'UserPhotoService', 'Base64'
    , function ($scope, $rootScope, $document, $http, $timeout, $interval, getDataSource, DateService, FilesService, CommonService, smsService, UserPhotoService, Base64) {
        $scope.showAvatar = false;
        $scope.showZJPhoto = false;
        $scope.showIDContainer = false; 
        $scope.uploadTitle = "上传头像";
        $document[0].title = _.find($rootScope.userCenterLinks, { id: "3001" }).title;

        $scope.ischangepwd = false;
        $scope.ischangetel = false;
        $scope.isuserchange = false;


        $scope.getSysCode = function (callback) {

            getDataSource.getUrlData("../api/getsycodes", { categorys: "职级,政治面貌,民族" }, function (data) {

                $scope.politicalArr = _.find(data, { type: "政治面貌" }).list;
                $scope.levelArr = _.find(data, { type: "职级" }).list;
                $scope.nations = _.find(data, { type: "民族" }).list;

                //获取城市数据对象
                $http.get("../config/usercenter-city.json").then(function (data) {
                    $scope.allCity = data.data;

                    if (callback) {
                        callback();
                    }
                })

            }, function (errortemp) { });
        }


        $scope.getSysCode(function () {
            //获取用户对象
            getDataSource.getDataSource("getUserInfo", {
                studentid: $rootScope.user.studentId,
            }, function (data) {
                var _data = data[0];
                //模糊身份证号码和手机号码 
                _data.telphone = _.fill(_data.cellphone.split(''), '*', 3, 7).join('');
                //组装照片
                if (_data.photo_servername) {
                    _data.photo = FilesService.getUserPhoto();
                    _data.photoObj = _data.photo;
                } else {
                    _data.defaultphoto = "../img/default_img.png";
                }
                $scope.userinfo = _data;
                //备份原始数据，用于恢复原始数据
                $scope.sourceUserInfo = angular.copy(_data);
            });
        });

        //监控下拉框值变动
        $scope.$watch("userinfo.provice", function (newVal) {

            if (newVal && $scope.allCity) {
                $scope.currentCities = _.filter($scope.allCity, { name: newVal })[0].city;
                $scope.currentCounties = [];
                if ($scope.isuserchange) {
                    $scope.userinfo.city = $scope.currentCities[0].name;
                }
            }
        });
        //监控下拉框值变动
        $scope.$watch("userinfo.city", function (newVal) {

            if (newVal && $scope.currentCities) {
                $scope.currentCounties = _.filter($scope.currentCities, { name: newVal })[0].area;
                if ($scope.isuserchange) {
                    $scope.userinfo.area = $scope.currentCounties[0];
                }
            }
        });




        $scope.userInfoEdited = true;
        $scope.workPlaceEdited = true;
        //控制是否编辑
        $scope.editedClick = function (type) {
            $scope.showIDContainer = !$scope.showIDContainer;
            if (type == 1) {
                $scope.workPlaceEdited = !$scope.workPlaceEdited;
                if ($scope.workPlaceEdited) {
                    $scope.userinfo = angular.copy($scope.sourceUserInfo);
                    $scope.isuserchange = false;
                }
            } else if (type == 0) {
                $scope.userInfoEdited = !$scope.userInfoEdited;
                if ($scope.userInfoEdited) {
                    $scope.userinfo = angular.copy($scope.sourceUserInfo);
                }
            }
        }

        //下拉框是否变动
        $scope.userChanged = function () {
            $scope.isuserchange = true;
        }


        $scope.pwdObj = { sourcepassword: "", password: "", confirmpassword: "", message: "" };
        $scope.telObj = { accountid: $rootScope.user.accountId, telphone: "", syscode: "", inputcode: "", message: "" };
        $scope.btnVerifyCode = "获取验证码";
        $scope.isVerifyCode = true;
        $scope.isChangePwd = false;
        $scope.isChangeTel = false;

        //弹框-修改密码
        $scope.pwdDialogClick = function (flag) {

            $scope.isChangePwd = flag;

            if (!flag) {
                $scope.pwdObj = { sourcepassword: "", password: "", confirmpassword: "", message: "" };
            }

        }

        //弹框-修改手机号码
        $scope.telDialogClick = function (flag) {

            $scope.isChangeTel = flag;

            if (!flag) {
                $scope.telObj = { accountid: $rootScope.user.accountId, telphone: "", code: "" };
                $scope.btnVerifyCode = "获取验证码";
                $scope.isVerifyCode = true;
                $interval.cancel($scope.timer);
            }
        }


        //发送验证码
        $scope.verifyCodeClick = function () {
             
            $scope.updateCellPhoneErrorStyle.reset();

            if ($scope.telObj.telphone.trim().length != 11) { 
                $scope.updateCellPhoneErrorStyle.idx[0] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机号码格式不正确";
                return;
            }

            getDataSource.validateCode($scope.telObj.verifycode, "forgotpwdcode"
            , function () {

                $scope.isVerifyCode = false;

                getDataSource.getUrlData("../api/getSMSCode", { phone: $scope.telObj.telphone, keyname: "forgotpwdsmscode" }, function (datatemp) {
                    if (datatemp.code == "success") {
                        //alert("发送成功");
                    }
                }, function (errortemp) { });

                var i = 90;
                var ptime;
                $scope.timer = $interval(function () {
                    i--;
                    $scope.btnVerifyCode = i + "秒之后重新发送";
                    $scope.isVerifyCode = false;

                    if (i == 0) {
                        $scope.isVerifyCode = true;
                        $scope.btnVerifyCode = "重新获取验证码";
                        $interval.cancel($scope.timer);
                    }
                }, 1000);

            }
            , function () {
                $scope.changeRegVerifyCode();
                $scope.updateCellPhoneErrorStyle.idx[1] = true;
                $scope.updateCellPhoneErrorStyle.message = "验证码不正确";
            });

        }



        //修改密码
        $scope.modifyPwdDisabled = false;
        $scope.modifyPwd = function () {
            $scope.modifyPwdDisabled = true;
            var param = {
                accountid: $rootScope.user.accountId,
                sourcepassword: Base64.encode($scope.pwdObj.sourcepassword),
                confirmpassword: Base64.encode($scope.pwdObj.confirmpassword),
                password: Base64.encode($scope.pwdObj.password)
            };


            getDataSource.getUrlData("../api/changepassword", param, function (data) {
                $scope.modifyPwdDisabled = false;
                CommonService.alert(data);
                if (data.result) {
                    $scope.pwdDialogClick(false);
                    getDataSource.writeLog("操作-登录密码修改", "20019");
                }
            }, function (errortemp) {
                $scope.modifyPwdDisabled = false;
                CommonService.error(errortemp);
            });
        }

        $scope.updateCellPhoneBtnDisabled = false;

        //修改错误消息
        $scope.updateCellPhoneErrorStyle = {
            idx: [false, false, false], message: "", reset: function () {
                this.idx = [false, false, false];
            }
        };
        //修改手机号码
        $scope.modifyTel = function () {
            $scope.updateCellPhoneBtnDisabled = true;
            $scope.updateCellPhoneErrorStyle.reset();
            if ($scope.telObj.telphone.trim().length == 0) { 
                $scope.updateCellPhoneErrorStyle.idx[0] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机号码不能为空";
                $scope.updateCellPhoneBtnDisabled = false;
                return;
            }

            if ($scope.telObj.inputcode.trim().length == 0) { 
                $scope.updateCellPhoneErrorStyle.idx[2] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机验证码不能为空";
                $scope.updateCellPhoneBtnDisabled = false;
                return;
            }

            
            getDataSource.validateCode($scope.telObj.inputcode, "forgotpwdsmscode", function () {

                var p = {
                    accountid: $rootScope.user.accountId, studentid: $rootScope.user.studentId,
                    cellphone1: $scope.telObj.telphone, cellphone2: $scope.telObj.telphone
                };

                getDataSource.getDataSource("usercenter-changetel", p, function (data) {
                    if (data.length > 0 && data[0].crow > 1) {
                        $scope.userinfo.telphone = _.fill($scope.telObj.telphone.split(''), '*', 3, 7).join('');
                        $scope.telDialogClick(false);
                        CommonService.alert("手机号码修改成功");
                        $scope.updateCellPhoneBtnDisabled = false;
                        getDataSource.writeLog("操作-手机号码修改", "20019"); 
                    } else {
                        CommonService.alert("手机号码修改失败");
                        $scope.updateCellPhoneBtnDisabled = false;
                    }
                }, function (error) {
                    CommonService.error(error);
                    $scope.updateCellPhoneBtnDisabled = false;
                });

            }, function () {
                $scope.updateCellPhoneErrorStyle.idx[2] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机验证码输入不正确";
                $scope.updateCellPhoneBtnDisabled = false;
            });

            
        }

        //保存
        $scope.saveInfoDisabled = false;
        $scope.submit = function (type) {
            $scope.saveInfoDisabled = true;

            if (!$scope.userInfoEdited && type == 0) {

                var param = {
                    sex: $scope.userinfo.sex,
                    nation: $scope.userinfo.nation,
                    political: $scope.userinfo.political,
                    rank: $scope.userinfo.rank,
                    positions: $scope.userinfo.positions,
                    email: $scope.userinfo.email,
                    studentid: $scope.user.studentId
                };

                getDataSource.getDataSource("updateUserInfoBaseInfo", param,
                function (data) {
                    $scope.saveInfoDisabled = false;
                    $scope.sourceUserInfo = angular.copy($scope.userinfo);
                    $scope.userInfoEdited = true;
                    CommonService.alert("保存基本信息成功！");
                    getDataSource.writeLog("操作-基本信息修改", "20019");
                },
                function (e) {
                    $scope.saveInfoDisabled = false;
                    CommonService.alert("保存基本信息失败！");
                });
            } else if (!$scope.workPlaceEdited && type == 1) {

                var param = {
                    provice: $scope.userinfo.provice,
                    city: $scope.userinfo.city,
                    area: $scope.userinfo.area,
                    company: $scope.userinfo.company,
                    companyaddress: $scope.userinfo.companyaddress,
                    officetel: $scope.userinfo.officetel,
                    studentid: $scope.user.studentId
                };
                getDataSource.getDataSource("updateUserInfoCompanyInfo", param, function (data) {
                    $scope.sourceUserInfo = angular.copy($scope.userinfo);
                    $scope.workPlaceEdited = true;
                    CommonService.alert("保存单位信息成功！");
                    $scope.saveInfoDisabled = false;
                    getDataSource.writeLog("操作-单位信息修改", "20019");
                }, function (e) {
                    CommonService.alert("保存单位信息失败！");
                    $scope.saveInfoDisabled = false;
                });
            }
        }

        //弹出上传证件照弹框
        $scope.showZJpopup = false;
        $scope.showZJPhotoBox = function (flag) {
            $scope.showZJpopup = !$scope.showZJpopup;
            if (flag)
                $scope.uploadTitle = "上传证件照";
            else
                $scope.uploadTitle = "上传头像";
        };

        //注册验证码
        $scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
        $scope.changeRegVerifyCode = function () {
            $scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
        }

        $scope.showAvatarUpload = function () {
            if ($("#showAvatarDiv").css("display") == "none") {
                $("#showAvatarDiv").css("display", "block");
            }
            else {
                $("#showAvatarDiv").css("display", "none");
            }

        }
        $timeout(function () {
            var swf = new fullAvatarEditor("../bower_components/fullAvatarEditor-2.3/fullAvatarEditor.swf", "../bower_components/fullAvatarEditor-2.3/expressInstall.swf", "swfContainer", {
                id: "swf",
                upload_url: "../api/uploadAvatar/userPhoto",
                method: "post",
                tab_visible: false,
                src_upload: 1,
                tab_active: "upload",
                avatar_sizes: "80*80",
                avatar_sizes_desc: "80*80像素",
                src_size: "1MB",
                src_size_over_limit: "文件大小超出限制（1MB）\n请重新上传",
                browse_tip: "仅支持JPG、JPEG、GIF、PNG格式的图片文件\n文件不能大于1MB"
            }, function (msg) {
                if (msg.code == 5) {
                    $scope.showAvatar = false;
                    $scope.userinfo.photoObj = FilesService.showFile("userPhoto", msg.content.avatarUrls, msg.content.avatarUrls);

                    var param = { studentid: $rootScope.user.studentId, idphoto: msg.content.avatarUrls, thumbname: msg.content.avatarUrls };

                    getDataSource.getDataSource("updateUserInfoHeadImage", param, function (data) {

                        CommonService.alert("修改图像成功！"); 
                        getDataSource.changeUserPhoto(msg.content.avatarUrls, msg.content.avatarUrls);
                    }, function (e) {
                        CommonService.alert("修改图像失败！");
                    });
                    getDataSource.writeLog("操作-头像修改", "20019");

                    $scope.$apply();
                    $("#showAvatarDiv").css("display", "none");
                }
            }
            );
            
        }, 1000);


        $scope.validation = {
            confirmpassword: {
                message: "",
                valid: false,
                comfirm: function (password1, password2) {
                    if (password1 != password2) {
                        this.message = "两次输入密码不一致";
                        this.valid = false;
                    } else {
                        this.message = "";
                        this.valid = true;
                    }
                },
                reset: function () {
                    this.message = "";
                }
            },
            validtelphone: {
                message: "",
                valid: false,
                remotetelphone: function (oldtel, newtel) {
                    if (oldtel == newtel) {
                        this.valid = false;
                        this.message = "新手机号码不能和原手机号码一样";
                    } else {
                        this.message = "";
                        var self = this;
                        getDataSource.getDataSource("usercenter-telphone-valid", { cellphone: newtel }, function (data) {
                            if (data.length>0 && data[0].count > 0) {
                                self.valid = false;
                                self.message = "新手机号码已经存在";
                            } else {
                                self.valid = true;
                                self.message = "";
                            }
                        }, function (error) {
                            CommonService.error(error);
                        });
                    }
                },
                reset: function () {
                    this.message = "";
                }
            }


        };

    }])
