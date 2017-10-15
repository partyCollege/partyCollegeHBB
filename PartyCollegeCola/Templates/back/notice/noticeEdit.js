app.controller("noticeEditController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state', '$stateParams', '$validation', 'notify'
	, function ($scope, $rootScope, $http, getDataSource, $state, $stateParams, $validation, notify) {
        
	    $scope.currentConfig = {
	        btnSaveShow: false,
	        btnPublishShow: false,
	        btnUnPublishShow: false,
	    };

		$scope.noticeData = {
		    id:"",
		    title: "",
		    content: "",
		    category: 0,
		    createuser: $rootScope.user.name,
		    createdate: "",
		    publishuser: "",
		    publishdate: "",
		    publishstate : 0,
		    isclose: 0,

		};

		var noticeId = $stateParams.id;
		if (noticeId != undefined && noticeId != "") {
		    $scope.noticeData.id = noticeId;
		    //编辑，获取表单信息
		    getDataSource.getDataSource("getNoticeById", { id: noticeId }, function (data) {
		        $scope.noticeData = data[0];
		        if ($scope.noticeData.publishstate == 0) {
		            $scope.currentConfig.btnSaveShow = true;
		            $scope.currentConfig.btnPublishShow = true;
		            $scope.currentConfig.btnUnPublishShow = false;
		        }
		        else {
		            $scope.currentConfig.btnSaveShow = false;
		            $scope.currentConfig.btnPublishShow = false;
		            $scope.currentConfig.btnUnPublishShow = true;
		        }
		    }, function (errortemp) { });
		}
		else {
		    $scope.currentConfig.btnSaveShow = true;
		    $scope.currentConfig.btnPublishShow = false;
		    $scope.currentConfig.btnUnPublishShow = false;
		}



		$scope.goToList = function () {
		    $state.go("index.notice");
		}

		$scope.saveDisabled = false;
		$scope.savePermssion = function () {
			$scope.saveDisabled = true;
			getDataSource.getUrlData('../api/saveNotice', $scope.noticeData, function (datatemp) {
				$scope.saveDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.noticeEdit", { id: datatemp.id });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveDisabled = false;
				notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.publishNotice = function () {
		    getDataSource.getDataSource("publishNotice",
                {
                    publishuser: $rootScope.user.name,
                    publishstate: 1,
                    id: $scope.noticeData.id,
                    title: $scope.noticeData.title,
                    content: $scope.noticeData.content,
                    category: $scope.noticeData.category,
                    isclose: $scope.noticeData.isclose
                }, function (data) {
		        notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        $scope.currentConfig.btnSaveShow = false;
		        $scope.currentConfig.btnPublishShow = false;
		        $scope.currentConfig.btnUnPublishShow = true;
		    }, function (error) {
		        notify({ message: '发布失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    })
		}

		$scope.unpublishNotice = function () {
		    getDataSource.getDataSource("publishUnNotice", { id: $scope.noticeData.id }, function (data) {false
		        notify({ message: '撤销发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        $scope.currentConfig.btnSaveShow = true;
		        $scope.currentConfig.btnPublishShow = true;
		        $scope.currentConfig.btnUnPublishShow = false;
		    }, function (error) {
		        notify({ message: '撤销发布失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    })
		}
	}
]);