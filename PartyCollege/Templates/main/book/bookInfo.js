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