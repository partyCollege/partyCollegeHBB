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

    $scope.allCourseCategory = [
        { id: "search_xyg", showtext: "新员工", datavalue: "1" },
        { id: "search_zyl", showtext: "专业力", datavalue: "2" },
        { id: "search_tyl", showtext: "通用力", datavalue: "3" },
        { id: "search_ldl", showtext: "领导力", datavalue: "4" }
    ];

    $scope.allCourseLevel = [
        { id: "search_ygj", showtext: "员工级", datavalue: "1" },
        { id: "search_zrj", showtext: "主任级", datavalue: "2" },
        { id: "search_jlj", showtext: "经理级", datavalue: "3" },
        { id: "search_zjj", showtext: "总监级", datavalue: "4" },
        { id: "search_zjlj", showtext: "总经理级", datavalue: "5" }
    ];

    //coursecategory 1新员工 2专业力 3通用力 4领导力
    //courselevel 1员工级 2主任级 3经理级 4总监级 5总经理级


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

        $activeLink = $(".pull-right a.pull-courseCategory.active");
        if ($activeLink)
            $scope.searchparameter.courseCategory = $currentLink.attr("data-value");

        $activeLink = $(".pull-right a.pull-courseLevel.active");
        if ($activeLink)
            $scope.searchparameter.courseLevel = $currentLink.attr("data-value");


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
        } else if (linkType == "pull-courseCategory") {
            //$arr = $(".pull-right a.pull-searchType");
            aKey = ".pull-right a.pull-courseCategory";
            $scope.searchparameter.courseCategory = $currentLink.attr("data-value");
        } else if (linkType == "pull-courseLevel") {
            //$arr = $(".pull-right a.pull-searchType");
            aKey = ".pull-right a.pull-courseLevel";
            $scope.searchparameter.courseLevel = $currentLink.attr("data-value");
        }
         
         
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