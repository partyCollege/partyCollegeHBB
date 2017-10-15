app.controller("indexController", ['$scope', '$timeout', '$interval', '$validation', '$rootScope', '$state',
	'$http', '$modal', 'getDataSource', 'SessionService', 'GetFileService', 'CommonService', 'AccountService', 'dateFilter', 'smsService'
	, function ($scope, $timeout, $interval, $validation, $rootScope, $state,
		$http, $modal, getDataSource, SessionService, GetFileService, CommonService, AccountService, dateFilter, smsService) {
	    //首页逻辑代码

		$scope.HrefAllcourse = function () {
			location.href = "indexfront.html#/main/allcourse/0";
		}

	    $scope.yearplanstudytime = "无";
	    if ($rootScope.user.yearplan && $rootScope.user.yearplan.studytime != "") {
	        $scope.yearplanstudytime = $rootScope.user.yearplan.studytime;
	    }

	    $scope.myInterval = 5000;
	    $scope.newtype = 3;
	    getDataSource.getDataSource(['getIndexNews', 'getPlatformData', 'getIndexCoursewarelist', 'selectSyBook'],
            {
                departmentid: $rootScope.user.departmentId,
                departmentid1: $rootScope.user.departmentId,
                departmentid2: $rootScope.user.departmentId,
                departmentid3: $rootScope.user.departmentId,
                departmentid4: $rootScope.user.departmentId
	        },
            function (data) {
                var news = _.find(data, { name: "getIndexNews" }).data;
                for (var i = 0; i < news.length;i++) {
                    news[i].file_servername = GetFileService.showFile("newsPhoto", news[i].file_servername, news[i].file_servername);
                    news[i].file_serverthumbname = GetFileService.showFile("newsPhoto", news[i].file_serverthumbname, news[i].file_serverthumbname);
                }
                $scope.newlist = [
                    _.filter(news, function (n) { return n.category == "1" }),
                    _.filter(news, function (n) { return n.category == "2" }),
                    _.filter(news, function (n) { return n.category == "3" }),
                    _.filter(news, function (n) { return n.category == "4" })
                ];
               
                $scope.platformData = _.find(data, { name: "getPlatformData" }).data[0];;
             
                var coursewares = _.find(data, { name: "getIndexCoursewarelist" }).data;
                for (var i = 0; i < coursewares.length ; i++) {
                    coursewares[i].imagephoto = (coursewares[i].imagephoto != undefined && coursewares[i].imagephoto != "") ? GetFileService.showFile("coursewarePhoto", coursewares[i].imagephoto, coursewares[i].imagephoto) : "../img/course_img.jpg";
                }

                $scope.coursewarelist = [
                    _.filter(coursewares, function (n) { return n.category == "1" }),
                    [
                        _.filter(coursewares, function (n) { return n.category == "2" }).slice(0, 5),
                        _.filter(coursewares, function (n) { return n.category == "2" }).slice(5, 10)
                    ],
                    _.filter(coursewares, function (n) { return n.category == "3" }),
                    _.filter(coursewares, function (n) { return n.category == "4" })
                ];

                var books = _.find(data, { name: "selectSyBook" }).data;
                for (var i = 0; i < books.length ; i++) {
                    books[i].cover_servername = (books[i].cover_servername != undefined && books[i].cover_servername != "") ? GetFileService.showFile("bookPhoto", books[i].cover_servername, books[i].cover_servername) : "";
                }
                $scope.booklist = books;
            },
            function (error) { })

	    $scope.newsdetail = function (id) {
	        return "../html/index.html#/main/news/" + id;
	    }

	    $scope.selectnews = function (type) {
	        $scope.newtype = type;
	    }
	    $scope.openNewsdetail = function (id, type) {
	        window.open("../html/index.html#/main/news/" + id);
	    }
        
	    $scope.openCoursedetail = function (id) {
	        window.open("../html/indexfront.html#/main/courseinfo/" + id);
	    }
	    //图书
	    $scope.openBookinfo = function (id) {

	        if ($rootScope.user && $rootScope.user.isLogin) {
	            location.href = "../html/index.html#/main/bookInfo/" + id;
	        }
	        else {
	            CommonService.alert("请登录");
	        }
	    }

    }]);