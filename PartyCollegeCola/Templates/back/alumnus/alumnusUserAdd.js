angular.module("myApp")
.controller("alumnusUserAddController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
	    $scope.accForm = new Object();
	    $scope.accForm.name = '';
	    $scope.accForm.companyaddress = '';
	    $scope.accForm.company = '';
	    $scope.accForm.cellphone = '';
	    $scope.accForm.idcard = '';
	    $scope.accForm.sex = 0;
	    $scope.accForm.id = '';

	    $scope.formInput = new Object();
	    $scope.formBtn = new Object();

	    var accid = $stateParams.id;

	    $scope.goToList = function () {
	        $state.go("index.alumnusUserlist");
	    }

	    if ($stateParams.id) {
	        getDataSource.getDataSource("select_sy_alumnus_studentbyid", { id: $stateParams.id }, function (data) {
	            $scope.accForm.id = data[0].id;
	            $scope.accForm.name = data[0].name;
	            $scope.accForm.companyaddress = data[0].companyaddress;
	            $scope.accForm.company = data[0].company;
	            $scope.accForm.cellphone = data[0].cellphone;
	            $scope.accForm.idcard = data[0].idcard;
	            $scope.accForm.sex = data[0].sex;
	        });
	    }

	    $scope.saveDisabled = false;
	    $scope.saveAccount = function () {
	    	$scope.saveDisabled = true;
	    	if ($scope.accForm.name == '') {
	            notify({ message: '请输入姓名！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            $scope.saveDisabled = false;
	            return;
	        }
	        if ($scope.accForm.idcard == '') {
	        	notify({ message: '请输入身份证！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	        	$scope.saveDisabled = false;
	            return;
	        }
	        if ($scope.accForm.cellphone == '') {
	        	notify({ message: '请输入联系方式！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	        	$scope.saveDisabled = false;
	            return;
	        }
	        getDataSource.getUrlData('../api/poststudent', $scope.accForm, function (datatemp) {
	        	if (datatemp.status == "success") {
	        		$scope.saveDisabled = false;
	                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	                $scope.goToList();
	        	} else {
	        		$scope.saveDisabled = false;
	                notify({ message: datatemp.errorMessage, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            }
	        }, function (errortemp) {
	        	$scope.saveDisabled = false;
	        });
	    }
	}
]);