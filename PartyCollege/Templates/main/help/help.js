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