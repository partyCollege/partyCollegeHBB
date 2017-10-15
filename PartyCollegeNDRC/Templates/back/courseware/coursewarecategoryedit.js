angular.module("myApp")
.controller("coursewarecategoryeditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "$validation"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, $validation) {
		$scope.parentCategory = [];
		$scope.categoryForm=new Object();
		$scope.saveButtonDisabled = false;
		var id = $stateParams.id;
		$scope.loadCourseCategoryParent = function () {
			getDataSource.getDataSource("select_courseCategoryParent", {}, function (datatemp) {
				$scope.parentCategory = datatemp;
				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
					getDataSource.getDataSource("getcourseCategoryById", { id: id }, function (datatemp) {
						$scope.categoryForm = datatemp[0];
					}, function (errortemp) { });
				} 
				//var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.parentid }).id + "," + newid;
				
			}, function (errortemp) { });
		}

		$scope.loadCourseCategoryParent();

		$scope.saveCourseCategory = function () {
			$scope.saveButtonDisabled = true;
			var newid = getDataSource.getGUID();

			if (id != "" && id != undefined && id != null) {
				var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + id;
				getDataSource.getDataSource("updateCourseCategoryById",
					{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, fids: fids },
					function (datatemp) {
						//console.log(datatemp);
						$scope.saveButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$state.go("index.coursewarecategoryedit", { id: id });
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveButtonDisabled = false;
					});
			} else {
				var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + newid;
				getDataSource.getDataSource("insert_courseCategory",
					{ id: newid, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, platformid: $rootScope.user.platformid, fids: fids },
					function (datatemp) {
						$scope.saveButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$state.go("index.coursewarecategoryedit", { id: newid });
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveButtonDisabled = false;
					});
			}
		}
}]);