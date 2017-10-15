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