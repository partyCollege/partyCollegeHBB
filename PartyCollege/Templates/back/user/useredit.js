angular.module("myApp")
.controller("userEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "$validation"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, $validation) {
		$scope.accForm = {
			submit: function () {
				//$scope.saveSyUser();
			}
		};
		$scope.initForm = function (clearidcard,clearpwd) {
			$scope.accForm.rolelist = new Array();
			$scope.accForm.name = '';
			$scope.accForm.sex = 0;
			$scope.accForm.logname = '';
			$scope.accForm.lognameDisabled = false;
			$scope.accForm.pwdDisabled = false;
			$scope.accForm.idcardDisabled = false;
			$scope.accForm.nameDisabled = false;
			if (clearpwd) {
				$scope.accForm.pwd = '';
				$scope.pwd = '';
			}
			$scope.accForm.cellphone = '';
			if (clearidcard) {
				$scope.accForm.idcard = '';
			}
			$scope.accForm.syuserid = '';
			$scope.accForm.status = 0;
			$scope.accForm.checkstatus = false;
			//$scope.accForm.defaultusertype = 0;
			$scope.accForm.accisnew = true;
			$scope.accForm.syuserisnew = true;
		}
		$scope.initForm(true,true);
		var initPwd = '******';

		$scope.goToList = function () {
			$state.go("index.userlist");
		}

		var syuserid = $stateParams.id;

		//先加载下拉框内容
		getDataSource.getDataSource("getRoleList", { platformid: $rootScope.user.platformid }, function (data) {
			var roletemp = new Object();
			var rolearray = new Array();
			var length = data.length;
			for (var i = 0; i < length; i++) {
				roletemp = new Object();
				roletemp.id = data[i].id;
				roletemp.name = data[i].name;
				roletemp.platformid = data[i].platformid;
				//roletemp.platformname = data[i].platformname;
				rolearray.push(roletemp);
			}
			$scope.roles = rolearray;
			//
			if (syuserid) {
				$scope.accForm.syuserisnew = false;
				$scope.accForm.syuserid = syuserid;
				getDataSource.getDataSource(["getSyUserByAccId", "getAccountRoleByUserId"], { syuserid: syuserid, platformid: $rootScope.user.platformid }, function (data) {
					$scope.accForm = _.find(data, { name: "getSyUserByAccId" }).data[0];
					$scope.pwd = initPwd;
					$scope.accForm.pwd = initPwd;
					$scope.accForm.checkstatus = $scope.accForm.status == 1;
					$scope.accForm.accisnew = false;
					$scope.accForm.syuserisnew = false;
					var accroles = _.find(data, { name: "getAccountRoleByUserId" }).data;
					var roles = _.filter(accroles, { syuserid: syuserid });

					//设置不可用
					$scope.accForm.lognameDisabled = true;
					//$scope.accForm.pwdDisabled = true;
					$scope.accForm.nameDisabled = true;
					$scope.accForm.idcardDisabled = true;

					var roletemp = new Object();
					var rolearray = new Array();
					var length = roles.length;
					for (var i = 0; i < length; i++) {
						roletemp = new Object();
						roletemp.id = roles[i].id;
						roletemp.name = roles[i].name;
						roletemp.platformid = roles[i].platformid;
						//roletemp.platformname = roles[i].platformname;
						rolearray.push(roletemp);
					}
					$scope.accForm.rolelist = rolearray;

				}, function (errortemp) { });
			} else {
				$scope.accForm.syuserisnew = true;
				$scope.accForm.lognameDisabled = false;
				$scope.accForm.pwdDisabled = false;
			}
		}, function (errortemp) { });

		$scope.idcardInvalidClearMsg = function () {
			$scope.inValidIdCardMessage = "";
		}
		$scope.remoteCheckIdCard = function (bol) {
			$scope.inValidIdCardMessage = '';
			if ($scope.accForm.idcard.length <= 0) {
				return;
			}
			if (!bol) {
				getDataSource.getDataSource(["getAccountInfoByIdCard", "getAccountRoleByIdcard"],
					{ idcard: $scope.accForm.idcard }, function (datatemp) {
						var accArray = _.find(datatemp, { name: "getAccountInfoByIdCard" }).data;
						var roles = _.find(datatemp, { name: "getAccountRoleByIdcard" }).data;
						if (accArray.length > 0) {
							var accdata = accArray[0];
							$scope.accForm.name = accdata.name;
							$scope.accForm.sex = accdata.sex;
							$scope.accForm.logname = accdata.logname;
							$scope.accForm.pwd = initPwd;
							$scope.pwd = initPwd;
							$scope.accForm.cellphone = accdata.cellphone;
							$scope.accForm.defaultusertype = accdata.defaultusertype;
							//$scope.accForm.idcard = '';
							//$scope.accForm.syuserid = '';
							$scope.accForm.status = 0;
							$scope.accForm.checkstatus = false;
							$scope.accForm.accountid = accdata.id;
							$scope.accForm.accisnew = false;
							//设置不可用
							$scope.accForm.lognameDisabled = true;
							//$scope.accForm.pwdDisabled = true;
							$scope.accForm.nameDisabled = true;

							var rolearray = new Array();
							var length = roles.length;
							for (var i = 0; i < length; i++) {
								roletemp = new Object();
								roletemp.id = roles[i].id;
								roletemp.platformid = roles[i].platformid;
								roletemp.name = roles[i].name;
								rolearray.push(roletemp);
							}
							$scope.accForm.rolelist = rolearray;
						} else {
							$scope.initForm(false,true);
						}
					}, function (errortemp) {});
			}
		}

		//检查账号
		$scope.remoteCheckLogname = function (bol) {
			$scope.lognameInvalidMsg = '';
			if ($scope.accForm.logname == undefined || $scope.accForm.logname.length < 6 || $scope.accForm.logname.length > 18) {
				return;
			}
			if (!bol) {
				getDataSource.getDataSource(["getAccountByLogname"], { formlogname: $scope.accForm.logname }, function (datatemp) {
					if (datatemp.length > 0) {
						$scope.lognameInvalidMsg = "该账号已经被使用。";
					} else {
						$scope.lognameInvalidMsg = "";
					}
				}, function (errortemp) {

				});
			}
		}
		$scope.lognameInvalidMsgClear = function () {
			$scope.lognameInvalidMsg = "";
		}

		$scope.saveButtonDisabled = false;

		$scope.saveSyUser = function () {
			$scope.saveButtonDisabled = true;
			var submitForm = $scope.accForm;
			if ($scope.pwd != initPwd) {
				submitForm.pwd = md5($scope.pwd);
			}
			//console.log("submitForm", submitForm);
			//return;
			getDataSource.getUrlData('../api/account/SaveSyUser', submitForm, function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.useredit", { id: datatemp.id});
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}
]);