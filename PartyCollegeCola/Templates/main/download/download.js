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
	    	return FilesService.downApiFiles("download", item.attach_servername, item.attach_clientname);
	    }
	}])