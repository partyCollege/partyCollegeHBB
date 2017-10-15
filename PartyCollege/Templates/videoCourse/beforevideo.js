app.controller("beforevideoController", ["$scope", "$rootScope", "$state", "$location", "$document"
	, "$stateParams", "$modal", "getDataSource", "FilesService", "CommonService", "DateService", "$timeout", "SessionService"
	, function ($scope, $rootScope, $state, $location, $document, $stateParams, $modal, getDataSource, FilesService, CommonService, DateService, $timeout, SessionService) {
		var platformcode = "html";
		var coursewareid = $stateParams.coursewareid;
		SessionService.RenovatSession(platformcode, function (data) {
			$state.go("videoCourse", { coursewareid: coursewareid });
		}, function (error) {

		});
	}]);
