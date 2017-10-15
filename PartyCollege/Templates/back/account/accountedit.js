angular.module("myApp")
.controller("accountEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.accForm = new Object();
		$scope.accForm.rolelist = new Array();
		$scope.accForm.name = '';
		$scope.accForm.logname = '';
		$scope.accForm.pwd = '';
		$scope.accForm.cellphone = '';
		$scope.accForm.idcard = '';
		$scope.accForm.accountid = '';

		$scope.formInput = new Object();
		$scope.formInput.lognameDisabled = true;
		$scope.formInput.pwdDisabled = true;
		$scope.formInput.idcardDisabled = true;
		$scope.formInput.nameDisabled = true;
		$scope.formInput.cellphoneDisabled = true;

		$scope.formBtn = new Object();
		$scope.formBtn.saveButtonDisabled = false;

		var accid = $stateParams.id;
		if (accid != "") {
			$scope.accForm.accountid = accid;
			getDataSource.getDataSource(["getAccountById", "getAccountRole"], { accid: accid }, function (data) {
				$scope.accForm = _.find(data, { name: "getAccountById" }).data[0];
				$scope.accForm.accountid = accid;
				$scope.accForm.pwd = '******';

				var accroles = _.find(data, { name: "getAccountRole" }).data;

				var roles = _.filter(accroles, { accountid: accid });
				var roletemp = new Object();
				var rolearray = new Array();
				var length = roles.length;
				for (var i = 0; i < length; i++) {
					roletemp = new Object();
					roletemp.id = roles[i].id;
					roletemp.name = roles[i].name;
					roletemp.platformname = roles[i].platformname;
					rolearray.push(roletemp);
				}
				$scope.accForm.rolelist = rolearray;

			}, function (errortemp) { });
		}
		//else {
		//	$scope.accForm.lognameDisabled = false;
		//	$scope.accForm.pwdDisabled = false;
		//}

		getDataSource.getDataSource("getRoleList", { platformid: $rootScope.user.platformid}, function (data) {
			var roletemp = new Object();
			var rolearray = new Array();
			var length = data.length;
			for (var i = 0; i < length; i++) {
				roletemp = new Object();
				roletemp.id = data[i].id;
				roletemp.name = data[i].name;
				roletemp.platformname = data[i].platformname;
				rolearray.push(roletemp);
			}
			$scope.roles = rolearray;
		}, function (errortemp) { });

		$scope.goToList = function () {
			$state.go("index.account");
		}

		$scope.saveAccount = function () {
			$scope.saveButtonDisabled = true;
			getDataSource.getUrlData('../api/account/SaveAccount', $scope.accForm, function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}
]);