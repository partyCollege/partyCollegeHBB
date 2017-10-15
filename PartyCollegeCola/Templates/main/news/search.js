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