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