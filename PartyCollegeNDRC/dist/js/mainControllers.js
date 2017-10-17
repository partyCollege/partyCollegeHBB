app.controller("downloadController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce", "FilesService",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce, FilesService) {

	    $scope.chooseMenu();


	    getDataSource.getDataSource("getIndexMaterial", {}, function (data) {
	        $scope.materialdata = _.filter(data, function (r) { return r.category == 1 });
	        var soft = _.filter(data, function (r) { return r.category == 2 });
	        for (var i = 0; i < soft.length; i++) {
	            soft[i].attach_logo = GetFileService.showFile("download", soft[i].attach_logo, soft[i].attach_logo);
	        }
	        $scope.softdata = soft;
	    }, function (e) { })

        	    //下载文件
	    $scope.downFiles = function (item) {
	    	if (item.linkurl.length > 0) {
	    		return window.open(item.linkurl);
	    	} else if (item.attach_servername.length>0) {
	    		return FilesService.downApiFiles("download", item.attach_servername, item.attach_clientname);
	    	}
	    }
	}])
app.controller("bookInfoController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce) {

	    $scope.chooseMenu();
	    var bookid = $stateParams.id;
	    getDataSource.getDataSource("getBookInfo", { id: bookid }, function (data) {
	        $scope.bookinfo = data[0];
	        $scope.bookinfo.comment = $sce.trustAsHtml($scope.bookinfo.comment);
	        $scope.bookinfo.cover_servername = GetFileService.showFile("bookPhoto", $scope.bookinfo.cover_servername, $scope.bookinfo.cover_servername);
	    }, function (e) { })

	    $scope.tobooklist = function () {
	        location.href = "../html/index.html#/main/booklist";
	    }

	}]);
app.controller("bookListController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce) {

	    $scope.chooseMenu();
	    //当前页
	    $scope.currentPageIndex = 1;
	    //页大小
	    $scope.currentPageSize = 12;
	    //图书数据
	    $scope.bookData = [];
	    //更多是否显示
	    $scope.moreShow = false;

	    //加载更多
	    $scope.loadMore = function () {
	        getBookList("more");
	    }

	    //获取图片全路径
	    $scope.getImg = function (photoserverfilename, photofilename, type) {
	        return GetFileService.showFile(type, photoserverfilename, photofilename);

	    }

	    var getBookList = function (type) {
	        getDataSource.getDataSource("getBookList",
                {
                    pageindex: parseInt(($scope.currentPageIndex - 1) * $scope.currentPageSize),
                    pagesize: parseInt($scope.currentPageSize),
                    platformid: $rootScope.user.platformid,
                	keywords:''
                }, function (data) {
                	//console.log("getBookList", data);
                    if (data && data.length > 0) {
                        $scope.bookData = _.union($scope.bookData, data);
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
                }, function (errortemp) {
                	//console.log("getBookList", errortemp);
                });
	    }

	    getBookList();

	    //图书
	    $scope.openBookinfo = function (id) {

	        if ($rootScope.user && $rootScope.user.isLogin) {
	            location.href = "../html/index.html#/main/bookInfo/" + id;
	        }
	        else {
	            CommonService.alert("请登录");
	        }
	    }


	}])
app.controller("helpController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce) {

	    $scope.chooseMenu();
	    var operationManualImgCount = $rootScope.appConfig.operationManualImgCount;
	    $scope.maxSize = operationManualImgCount;
	    $scope.totalItems = operationManualImgCount;
	    $scope.pageSize = 1;
	    $scope.currentPage = 1;

	    $scope.pageChanged = function () {
	    	//$scope.helpimg = GetFileService.showFile("operationManual", $scope.currentPage + ".png", $scope.currentPage + ".png")
	    	$scope.helpimg = GetFileService.showFile("operationManual", $scope.currentPage + ".jpg", $scope.currentPage + ".jpg")
	    }

	    $scope.pageChanged();


	    $scope.downloadpdf = function () {
	        var filepath = GetFileService.showFile("operationManual", "help.pdf", "help.pdf");
	        window.open(filepath);
	    }

	}])
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
	    getDataSource.getDataSource(['getIndexNews', 'getPlatformData', 'getIndexCoursewarelist'],//, 'selectSyBook'
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

                //var books = _.find(data, { name: "selectSyBook" }).data;
                //for (var i = 0; i < books.length ; i++) {
                //    books[i].cover_servername = (books[i].cover_servername != undefined && books[i].cover_servername != "") ? GetFileService.showFile("bookPhoto", books[i].cover_servername, books[i].cover_servername) : "";
                //}
                //$scope.booklist = books;
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
app.controller("mainController", ['$rootScope',"$state", '$scope', '$http', '$location', 'getDataSource', 'SessionService', "DateService", "GetFileService", "CommonService",
	function ($rootScope,$state, $scope, $http, $location, getDataSource, SessionService, DateService, GetFileService, CommonService) {
         
	    $scope.changetab = function (idx) {
	        for (var i = 0; i < $rootScope.mainConfig.length; i++) {
	            $rootScope.mainConfig[i].select = false;
	        }
	        $rootScope.mainConfig[idx].select = true;
	    }


	    $scope.userpermission = [true,false]; 
	    if ($rootScope.user.permissionDic.length > 0) {
	        $scope.userpermission[1] = true;
	    }

	    $scope.exit = function () {
	        getDataSource.getUrlData("../api/Logout", {}, function (datatemp) {
	            if (datatemp.code == "success") {
	                location.href = "../html/login.html"
	            }
	        }, function (errortemp) { });
	    }

	    $scope.chooseMenu = function () {
	        var path = $location.$$path;
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
	    }

	    $scope.toToSetting = function () {
	    	var path = $location.absUrl();
	    	var obj = _.find($rootScope.mainConfig, { 'elementName': "usercenter" });
	    	if (typeof (obj) == "object") {
	    		obj.select = true;
	    	}

	    	console.log(path);

	    	if (path.indexOf('index.html') > -1) {
	    		location.href = "indexfront.html#/main/usercenter";
	    		console.log(path);
	    	}
	    	//indexfront.html#/main/usercenter
	    }


	    //选项卡
	    $scope.aClick = function (menu, ename) {

	        var objtemp = _.find($rootScope.mainConfig, { 'select': true });
	        if (typeof (objtemp) == "object") {
	            objtemp.select = false;
	        }
	        var obj = _.find($rootScope.mainConfig, { 'elementName': ename });
	        if (typeof (obj) == "object") {
	            obj.select = true;
	    	}

	    	
	        if (ename == "allcourse") {
	        	location.href = "indexfront.html#/main/allcourse/0";
	        } else {
	        	if (menu.routeparam != null) {
	        		$state.go(menu.rounteName, menu.routeparam);
	        	} else {
	        		$state.go(menu.rounteName);
	        	}
	        }
	    };

	    $scope.searchKeyup = function (e) {
	        var keycode = window.event ? e.keyCode : e.which;
	        if (keycode == 13) {
	            $scope.searchNews();
	        }
	    }

	    $scope.searchKeys = "";
	    $scope.searchNews = function () {

	        if ($rootScope.user && $rootScope.user.isLogin) {
	            if ($scope.searchKeys == "") {
	                CommonService.alert("请输入关键字后再搜索");
	                return;
	            }
	            location.href = "../html/index.html#/main/search/" + $scope.searchKeys;
	        }
	        else {
	            $scope.mateshowlogintip = false;
	            CommonService.alert("请登录");
	        }
	    }

        //后台链接
	    $scope.backurl = "../html/indexback.html";
	    var menu = _.find($rootScope.user.permissionDic, { GroupName: '资源库管理', Name: '课程分类' });
	    if (menu) {
	        $scope.backurl = "../html/indexback.html#/index/coursewarecategory";
	    }
	    else {
	        menu = _.find($rootScope.user.permissionDic, { GroupName: '教学管理', Name: '班级管理' });
	        if (menu)
	            $scope.backurl = "../html/indexback.html#/index/classlist";
	    }
	}])
app.controller("inforInfoController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams", "$sce",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService, $stateParams, $sce) {
	    var newsid = $stateParams.id;
	    getDataSource.getDataSource("getNewsDetailById",
            {
                newsid: newsid
            },
            function (data) {
                $scope.newsInfo = data[0];
                $scope.newsInfo.content = $sce.trustAsHtml($scope.newsInfo.content);
            }, function (error) { })
	}])
app.controller("inforListController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService","$stateParams",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService,$stateParams) {
	    $scope.newstype = $stateParams.type;
	   
	    //$scope.changetab(5);

	    $scope.config =[
	        {
	            pagesize : 5,
	            pageindex: 1,
                newstype : false,
	            moreShow: false,
                newslist:[]
	        },
            {
                pagesize : 5,
                pageindex: 1,
                newstype: false,
                moreShow: false,
                newslist: []
            },
            {
                pagesize : 5,
                pageindex: 1,
                newstype: false,
                moreShow: false,
                newslist: []
            }
	    ];
	   
	    $scope.config[$scope.newstype - 2].newstype = true;

	    var getNewslist = function(type){
	        var index = $scope.newstype - 2;

	        getDataSource.getDataSource('getNewsByCategory',
           {
               category: $scope.newstype,
               pageindex: ($scope.config[index].pageindex - 1) * $scope.config[index].pagesize,
               pagesize: $scope.config[index].pagesize,
               departmentid1: $rootScope.user.departmentId
           },
           function (data) {
               if (data && data.length > 0) {
                   $scope.config[index].newslist = _.union($scope.config[index].newslist, data);
                   $scope.config[index].pageindex++;
                   if (data.length >= $scope.config[index].pagesize)
                       $scope.config[index].moreShow = true;
                   else
                       $scope.config[index].moreShow = false;
               }
               else
                   if (type && type == 'more') {
                       $scope.config[index].moreShow = false;
                       CommonService.alert("没有更多数据了");
                   }
           },
           function (error) { })
	    }

	    $scope.selectNewsType = function (category) {
	        $scope.newstype = category;
	        var index = $scope.newstype - 2;
	        angular.forEach($scope.config, function (n) {
	            n.newstype = false;
	        })
	        $scope.config[index].newstype = true;
	        if ($scope.config[index].pageindex == 1) {
	            getNewslist();
	        }
	    }
	   
	    $scope.selectNewsType($scope.newstype);

	    $scope.loadMore = function () {
	        getNewslist("more");
	    }

	    $scope.openNewsDetail = function (id) {
	        window.open("../html/index.html#/main/news/" + id);
	    }
	}])
app.controller("searchController", ['$rootScope', '$scope', '$http', '$location', 'getDataSource', "DateService", "GetFileService", "CommonService", "$stateParams",
	function ($rootScope, $scope, $http, $location, getDataSource, DateService, GetFileService, CommonService,$stateParams) {
		$scope.newstype = $stateParams.type;

		//搜索tab配置
		$rootScope.mainSearchConfig = [
				{ "elementName": "news", "select": true },
				{ "elementName": "courseware", "select": false },
				{ "elementName": "book", "select": false }
		];

		//选项卡
		$scope.aClick = function (ename) {
			_.find($rootScope.mainSearchConfig, { 'select': true }).select = false;;
			_.find($rootScope.mainSearchConfig, { 'elementName': ename }).select = true;

		};

	    $scope.config = {
	        pagesize: 5,
	        pageindex: 1,
	        newstype: false,
	        moreShow: false,
	        newslist: []
	    };

	    $scope.bookconfig = {
	    	pagesize: 5,
	    	pageindex: 1,
	    	newstype: false,
	    	moreShow: false,
	    	newslist: []
	    };

	    $scope.courseconfig = {
	    	pagesize:8,
	    	pageindex: 1,
	    	newstype: false,
	    	moreShow: false,
	    	newslist: []
	    };

	    function doWork(data) {

	    	for (var i = 0; i < data.length; i++) {
	    		displayButtonStyle(data[i]);
	    	}

	    	return data;
	    }
		//获取图片全路径
	    $scope.getImg = function (photoserverfilename, photofilename, type) {
	    	return GetFileService.showFile(type, photoserverfilename, photofilename);

	    }
		//图书
	    $scope.openBookinfo = function (id) {

	    	if ($rootScope.user && $rootScope.user.isLogin) {
	    		//location.href = 
	    		window.open("../html/index.html#/main/bookInfo/" + id);
	    	}
	    	else {
	    		CommonService.alert("请登录");
	    	}
	    }

	    $scope.selectCourse = function (n) {
	    	var url = "indexfront.html#/main/courseinfo/" + n.coursewareid;
	    	window.open(url);
	    }

	    function displayButtonStyle(n) {

	    	n.photo = GetFileService.showFile("coursewarePhoto", n.imagephoto, n.imagephoto);

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

	    var getBooklist = function (type) {
	    	getDataSource.getDataSource('getBookList', {
	    		keywords: $stateParams.keywords,
	    		pageindex: ($scope.bookconfig.pageindex - 1) * $scope.bookconfig.pagesize,
	    		pagesize: $scope.bookconfig.pagesize
	    	},
           function (data) {
           	if (data && data.length > 0) {
           		$scope.bookconfig.newslist = _.union($scope.bookconfig.newslist, data);
           		$scope.bookconfig.pageindex++;
           		if (data.allcount >= $scope.bookconfig.pagesize){
           			if (data.list.length < $scope.courseconfig.pagesize) {
           				$scope.bookconfig.moreShow = false;
           			} else {
           				$scope.bookconfig.moreShow = true;
           			}
           		}
           			
           		else
           			$scope.bookconfig.moreShow = false;
           	}
           	else
           		if (type && type == 'more') {
           			$scope.bookconfig.moreShow = false;
           			CommonService.alert("没有更多数据了");
           		}
           },
           function (error) { })
	    }

	    var getCourselist = function (type) {
	    	var searchparameter = {
	    		condation: $stateParams.keywords, onecate: "", twocate: "", year: "", courseType: "", searchType: "", pageIndex: $scope.courseconfig.pageindex, pageSize: 8, isMore: false
	    	};
	    	getDataSource.getUrlData("../api/getcoursewarelist", searchparameter, function (data) {
	    		console.log(data)
	    		if (data && data.list.length > 0) {
	    			$scope.courseconfig.newslist = _.union($scope.courseconfig.newslist, doWork(data.list));
	    			$scope.courseconfig.pageindex++;
	    			if (data.allcount >= $scope.courseconfig.pagesize) {
	    				if (data.list.length < $scope.courseconfig.pagesize) {
	    					$scope.courseconfig.moreShow = false;
	    				} else {
	    					$scope.courseconfig.moreShow = true;
	    				}
	    				
	    			} else
	    				$scope.courseconfig.moreShow = false;
	    		}
	    		else{
	    			if (type && type == 'more') {
	    				$scope.courseconfig.moreShow = false;
	    				CommonService.alert("没有更多数据了");
	    			}
	    		}
	    	}, function (errortemp) { });

	    	
	    }

	    var getNewslist = function(type){

	        getDataSource.getDataSource('getNewsByKeywords',
           {
               keywords: $stateParams.keywords,
               pageindex: ($scope.config.pageindex - 1) * $scope.config.pagesize,
               pagesize: $scope.config.pagesize,
               departmentid1: $rootScope.user.departmentId
           },
           function (data) {
               if (data && data.length > 0) {
                   $scope.config.newslist = _.union($scope.config.newslist, data);
                   $scope.config.pageindex++;
                   if (data.allcount >= $scope.config.pagesize){
                   
                   	if (data.list.length < $scope.courseconfig.pagesize) {
                   		$scope.config.moreShow = false;
                   	} else {
                   			$scope.config.moreShow = true;
                   	}
                   }else
                       $scope.config.moreShow = false;
               }
               else
                   if (type && type == 'more') {
                       $scope.config.moreShow = false;
                       CommonService.alert("没有更多数据了");
                   }
           },
           function (error) { })
	    }


	    getNewslist();
	    getCourselist();
	    getBooklist();

	    $scope.loadBookMore = function () {
	    	getBooklist("more");
	    }
	    $scope.loadMore = function () {
	    	getNewslist("more");
	    }
	    $scope.loadCoursewareMore = function () {
	    	getCourselist("more");
	    }

	    $scope.openNewsDetail = function (id) {
	        window.open("../html/index.html#/main/news/" + id);
	    }

	    $scope.toNewsBycategory = function (category) {
	         location.href = "../html/index.html#/main/newslist/" + category;
	    }
	}])