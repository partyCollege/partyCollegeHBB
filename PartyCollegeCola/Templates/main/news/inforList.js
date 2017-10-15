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