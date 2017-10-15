angular.module('app.directive')
.directive('focusOnCondition', ['$timeout',
    function ($timeout) {
        var checkDirectivePrerequisites = function (attrs) {
            if (!attrs.focusOnCondition && attrs.focusOnCondition != "") {
                throw "FocusOnCondition missing attribute to evaluate";
            }
        }

        return {
            restrict: "A",
            link: function (scope, element, attrs, ctrls) {
                checkDirectivePrerequisites(attrs);

                scope.$watch(attrs.focusOnCondition, function (currentValue, lastValue) {
                    if (currentValue == true) {
                        $timeout(function () {
                            element.focus();
                        });
                    }
                });
            }
        };
    }
])
.directive("appLogin", ["$http", "$rootScope", "$timeout", "$interval", "$sce", "$validation", "SessionService", "AccountService", "getDataSource", "CommonService", "dateFilter", "smsService",
	function ($http, $rootScope, $timeout, $interval, $sce, $validation, SessionService, AccountService, getDataSource, CommonService, dateFilter, smsService) {
	    return {
	        restrict: "AE",
	        templateUrl: "../Templates/directive/appLogin.html",
	        replace: true,
	        transclude: true,
	        scope: {},
	        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
	            $scope.CloseDiv = function () {
	                $scope.showChooseMultiClass = { "display": "none" };
	                scope.changeCode();
	            }
	            $scope.selectedItems = [];
	            //$scope.gridStyle=
	            $scope.gridOptions = {
	                data: 'myData',
	                columnDefs: [
						{
						    headerCellTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
						    cellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>'
						},
						{ field: "name", displayName: '班级名称', width: 260 },
						{ field: "starttime", displayName: '开班时间', width: 180, cellFilter: 'date:mediumDate' },
						{ field: "endtime", displayName: '结班时间', width: 180, cellFilter: 'date:mediumDate' }
	                ],
	                showFooter: false,
	                selectedItems: $scope.selectedItems
	            };
	            $scope.loadGrid = function (multiobj) {
	                var array = ["getMultiClassList", "getMultiClassById"];
	                $scope.multiclass = multiobj;
	                getDataSource.getDataSource(array, { multipkgid: multiobj.multipkgid }, function (data) {
	                    $scope.myData = _.find(data, { name: "getMultiClassList" }).data;
	                    $scope.multiClassObj = _.find(data, { name: "getMultiClassById" }).data[0];
	                });
	            }
	        }],
	        link: function (scope, element, attr, ctrl) {
	            scope.studentTemp = new Object();
	            var configSeconds = 90;
	            var timer = null;
	            if (timer != null) {
	                $interval.cancel(timer);
	            }
	            //注册第一步四个文本框验证全部通过，全部为true
	            scope.oneformValidataArray = [
					{ valid: false },
					{ valid: false },
					{ valid: false }];
	            //注册第一步下一步是否可用
	            scope.BtnNextStepDisable = false;
	            //注册检查函数
	            scope.ClickNextStepDisable = function (formValidataArray) {
	                var length = formValidataArray.length;
	                var btndisable = false;
	                for (var i = 0; i < length; i++) {
	                    if (!formValidataArray[i].valid) {
	                        btndisable = true;
	                        break;
	                    }
	                }
	                return btndisable;
	            }

	            //注册第二步四个文本框验证全部通过，全部为true
	            scope.twoformValidataArray = [
					{ valid: false },
					{ valid: false }];
	            //注册第二步下一步是否可用
	            scope.BtnFinishStepDisable = false;


	            scope.confirmerrormsg = { message: '' };
	            //点击登录后，按钮设置成不可用
	            scope.clickLoginDisable = false;
	            scope.clickStuRegistDisable = false;
	            scope.clickForgotpwdStepDisable = false;
	            scope.clickForgotpwdDisable = false;
	            scope.clickNewpwdFormDisable = false;
	            //找回密码
	            scope.resetForm = function () {
	                scope.pwdobject = new Object();
	                scope.loginobj = new Object();
	                scope.loginobj = {
	                    requiredCallback: 'required',
	                    checkValid: $validation.checkValid,
	                    submit: function () {
	                        // angular validation 1.2 can reduce this procedure, just focus on your action
	                        // $validationProvider.validate(form);
	                    },
	                    reset: function () {
	                        // angular validation 1.2 can reduce this procedure, just focus on your action
	                        // $validationProvider.reset(form);
	                    }
	                };
	                scope.loginobj.logname = '';
	                scope.loginobj.hashpwd = '';
	                scope.loginobj.confirmhashpwd = '';
	                scope.loginobj.code = '';//正式上线时清空
	                scope.loginobj.name = '';
	                scope.loginobj.idcard = '';
	                scope.loginobj.cellphone = '';
	                scope.loginobj.smscode = '';//正式上线时清空
	                scope.loginobj.serialno_one = '';
	                scope.loginobj.serialno_two = '';
	                scope.loginobj.serialno_three = '';
	                scope.loginobj.serialno_four = '';
	                scope.loginobj.serialno = '';

	                scope.inValidIdCardMessage = '';
	                scope.registerSeconds = configSeconds;
	                scope.pwdSeconds = configSeconds;
	            }
	            scope.resetForm();
	            scope.registerstyle = { "display": "none" };//蒙版默认为隐藏
	            scope.registerStepPublicStyle = { "display": "none" };
	            scope.step = 0;
	            scope.stusteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            scope.matesteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            scope.pwdsteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            //控制多专班
	            scope.showChooseMultiClass = { "display": "none" };
	            var length = scope.stusteparary.length;

	            //保存已选择的多专班
	            scope.SaveMultiClass = function () {
	                scope.clickMultiClassDisable = true;
	                if (scope.selectedItems.length <= 0) {
	                    CommonService.alert("请选择班级");
	                    scope.clickMultiClassDisable = false;
	                    return;
	                }
	                if (scope.selectedItems.length < scope.multiClassObj.minclassnum) {
	                    CommonService.alert("至少选择" + scope.multiClassObj.minclassnum + "个专题");
	                    scope.clickMultiClassDisable = false;
	                    return;
	                }
	                scope.multiclass.selectedClass = scope.selectedItems;
	                getDataSource.getUrlData("../api/multiclass/SaveMultiClass", scope.multiclass, function (datatemp) {
	                    scope.clickMultiClassDisable = false;
	                    CommonService.alert("保存成功");
	                    var hrefArry = $rootScope.appConfig.loginHref;
	                    var hrefobj = _.find(hrefArry, { usertype: 0 });
	                    location.href = "../" + hrefobj.href;
	                }, function (errortemp) {
	                    CommonService.alert("保存失败");
	                });
	            }

	            //回车登录
	            scope.loginKeyup = function (e) {
	                var keycode = window.event ? e.keyCode : e.which;
	                if (keycode == 13) {
	                    scope.login();
	                }
	            };

	            //登录
	            scope.login = function () {
	                scope.clickLoginDisable = true;
	                //return;
	                //验证数据
	                scope.login_logname_message = '';
	                if (scope.loginobj.logname.length == 0) {
	                    scope.login_logname_message = "请输入账号";
	                    scope.clickLoginDisable = false;
	                    return;
	                }
	                scope.login_pwd_message = '';
	                if (scope.pwdobject.hashpwd.length == 0) {
	                    scope.login_pwd_message = "请输入密码";
	                    scope.clickLoginDisable = false;
	                    return;
	                }
	                scope.login_code_message = '';
	                if (scope.loginobj.code.length == 0) {
	                    scope.login_code_message = "请输入验证码";
	                    scope.clickLoginDisable = false;
	                    return;
	                }

	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var loginform = new Object();
	                loginform.logname = scope.loginobj.logname;
	                loginform.hashpwd = md5pwd;
	                loginform.code = scope.loginobj.code;

	                getDataSource.getUrlData("../api/login", loginform, function (datatemp) {
	                    scope.clickLoginDisable = false;
	                    if (datatemp.code == "success") {
	                        //设置指定信息到 $rootScope
	                        if (typeof ($rootScope.user) != "object") {
	                            $rootScope.user = new Object();
	                        }
	                        $rootScope.user = datatemp.loginUser;
	                        $rootScope.user.isLogin = true;
	                        var hrefArry = $rootScope.appConfig.loginHref;
	                        var hrefobj = _.find(hrefArry, { usertype: $rootScope.user.userType });
	                        location.href = "../" + hrefobj.href;// "../" + datatemp.href;
	                    } else if (datatemp.code == "multiclass") {
	                        scope.showChooseMultiClass = { "display": "block" };
	                        scope.loadGrid(datatemp.multiclass);
	                    }
	                    else {
	                        scope.changeCode();
	                        scope.login_result_message = datatemp.message;
	                        //scope.login_result_message = "登录失败";
	                    }
	                }, function (errortemp) {
	                    scope.changeCode();
	                    scope.clickLoginDisable = false;
	                });
	            }
	            //更换验证码
	            scope.currentSrc = "../api/VerifyCode/" + new Date().getTime();
	            scope.changeCode = function () {
	                scope.currentSrc = "../api/VerifyCode/" + new Date().getTime();
	            }
	            //检查身份证
	            scope.remoteCheckIdCard = function () {
	                scope.inValidIdCardMessage = '';
	                if (scope.loginobj.idcard.length <= 0 || scope.loginobj.name.length <= 0) {
	                    return;
	                }
	                getDataSource.getDataSource(["getStudentByIdCard", "getAccountByIdCard"],
						{ idcard: scope.loginobj.idcard, stuname: scope.loginobj.name }, function (datatemp) {
						    var studata = _.find(datatemp, { name: "getStudentByIdCard" }).data;
						    var accdata = _.find(datatemp, { name: "getAccountByIdCard" }).data;

						    if (accdata.length > 0) {
						        scope.inValidIdCardMessage = "身份证号已被注册.";
						        scope.oneformValidataArray[0].valid = false;
						    } else {
						        scope.oneformValidataArray[0].valid = true;
						    }

						    if (scope.oneformValidataArray[0].valid) {
						        if (studata.length == 0) {
						            scope.inValidIdCardMessage = "系统未匹配到信息，请检查姓名和身份证是否匹配.";
						            scope.oneformValidataArray[0].valid = false;
						        } else {
						            scope.oneformValidataArray[0].valid = true;
						        }
						    }
						    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
						}, function (errortemp) {

						});
	            }
	            scope.idcardInvalidClearMsg = function () {
	                scope.inValidIdCardMessage = '';
	            }
	            //检查手机号码
	            scope.remoteCheckCellphone = function () {
	                scope.cellphoneInvalidMsg = '';
	                if (scope.loginobj.cellphone == undefined || scope.loginobj.cellphone.length < 11 || scope.loginobj.cellphone.length > 11) {
	                    return;
	                }

	                //验证idcard和手机号
	                getDataSource.getDataSource(["getStudentByPhone", "getAccountByCellphone"],
					{ idcard: scope.loginobj.idcard, stuphone: scope.loginobj.cellphone }, function (datatemp) {
					    var stuphonedata = _.find(datatemp, { name: "getStudentByPhone" }).data;
					    var accphonedata = _.find(datatemp, { name: "getAccountByCellphone" }).data;

					    if (accphonedata.length > 0) {
					        scope.cellphoneInvalidMsg = "手机号已被注册.";
					        scope.oneformValidataArray[1].valid = false;
					    } else {
					        scope.oneformValidataArray[1].valid = true;
					    }

					    if (scope.oneformValidataArray[1].valid) {
					        if (stuphonedata.length > 0) {
					            scope.sendRegisterSmsDisabled = false;
					            scope.cellphoneInvalidMsg = "";
					            scope.oneformValidataArray[1].valid = true;
					        } else {
					            scope.cellphoneInvalidMsg = "手机号与报名信息不符";
					            scope.oneformValidataArray[1].valid = false;
					        }
					    }
					    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
					}, function (errortemp) {

					});
	            }
	            scope.cellphoneInvalidMsgClear = function () {
	                $interval.cancel(timer);
	                scope.registerSeconds = configSeconds;
	                scope.registerSecondsString = "获取验证码";
	                scope.cellphoneInvalidMsg = '';
	                scope.sendRegisterSmsDisabled = true;
	            }
	            //注册短信模块,默认按钮不能点击，等验证通过后
	            scope.sendRegisterSmsDisabled = true;
	            scope.registerSeconds = configSeconds;

	            //注册验证码倒计时
	            scope.registerSecondsString = "获取验证码";
	            scope.getRegisterSmsCode = function () {
	                scope.sendRegisterSmsDisabled = true;
	                getDataSource.getUrlData("../api/getSMSCode", { phone: scope.loginobj.cellphone, keyname: "registersmscode" }, function (datatemp) { }, function (errortemp) { });
	                timer = $interval(function () {
	                    scope.registerSeconds = scope.registerSeconds - 1;
	                    scope.registerSecondsString = "获取验证码(" + scope.registerSeconds + ")";
	                    if (scope.registerSeconds <= 0) {
	                        $interval.cancel(timer);
	                        scope.registerSecondsString = "重新获取";
	                        scope.registerSeconds = configSeconds;
	                        scope.sendRegisterSmsDisabled = false;
	                        scope.sendSmsDisabled = false;
	                    }
	                }, 1000);
	            }
	            //验证短信验证码
	            scope.remoteCheckSmsCode = function () {
	                if (scope.loginobj.smscode == undefined || scope.loginobj.smscode.length != 4) {
	                    return;
	                }
	                getDataSource.getUrlData("../api/VerifySMSCode", { smscode: scope.loginobj.smscode, keyname: "registersmscode" }, function (datatemp) {
	                    if (datatemp.code == "success") {
	                        scope.sendSmsDisabled = true;
	                        scope.oneformValidataArray[2].valid = true;
	                        $interval.cancel(timer);
	                    } else {
	                        scope.sendSmsDisabled = false;
	                        //此处上线时应为false
	                        scope.oneformValidataArray[2].valid = true;
	                    }
	                    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
	                }, function (errortemp) {

	                });
	            }
	            //检查账号
	            scope.remoteCheckLogname = function () {
	                scope.lognameInvalidMsg = '';
	                if (scope.loginobj.logname == undefined || scope.loginobj.logname.length < 6 || scope.loginobj.logname.length > 18) {
	                    return;
	                }
	                getDataSource.getDataSource(["getAccountByLogname"], { formlogname: scope.loginobj.logname }, function (datatemp) {
	                    if (datatemp.length > 0) {
	                        scope.lognameInvalidMsg = "该账号已经被使用。";
	                        scope.twoformValidataArray[0].valid = false;
	                    } else {
	                        scope.lognameInvalidMsg = "";
	                        scope.twoformValidataArray[0].valid = true;
	                    }
	                    scope.BtnFinishStepDisable = scope.ClickNextStepDisable(scope.twoformValidataArray);
	                }, function (errortemp) {

	                });
	            }
	            scope.lognameInvalidMsgClear = function () {
	                scope.lognameInvalidMsg = "";
	            }
	            //确认密码
	            scope.checkConfirmHashpwd = function () {
	                scope.inValidConfirmHashpwdMessage = '';
	                if (scope.pwdobject.hashpwd != scope.pwdobject.confirmhashpwd) {
	                    scope.inValidConfirmHashpwdMessage = '两次密码输入不一致';
	                    scope.twoformValidataArray[1].valid = false;
	                } else {
	                    scope.twoformValidataArray[1].valid = true;
	                }
	                scope.BtnFinishStepDisable = scope.ClickNextStepDisable(scope.twoformValidataArray);
	            }
	            scope.confirmHashpwdInvalidMsgClear = function () {
	                scope.inValidConfirmHashpwdMessage = '';
	            }
	            //初始化注册步骤
	            scope.initStep = function (op) {
	                scope.registerStepPublicStyle = { "display": "none" };
	                scope.getPwdStyle = { "display": "none" }//隐藏忘记密码框
	                if (op == "stu" || op == "") {
	                    for (var i = 0; i < length; i++) {
	                        scope.stusteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.stusteparary[i] = { "display": "block" };
	                        }
	                    }
	                } else if (op == "mate") {
	                    for (var i = 0; i < length; i++) {
	                        scope.matesteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.matesteparary[i] = { "display": "block" };
	                        }
	                    }
	                }
	                else if (op == "getpwd") {
	                    for (var i = 0; i < length; i++) {
	                        scope.pwdsteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.pwdsteparary[i] = { "display": "block" };
	                        }
	                    }
	                }
	            }
	            //注册
	            scope.register = function () {
	                scope.registerstyle = { "display": "block" };//蒙版显示
	                scope.initStep('');
	                scope.registerStepPublicStyle = { "display": "none" };
	                scope.stuRegister('stu');
	            }
	            //校友注册
	            scope.mateRegister = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            //学员注册
	            scope.stuRegister = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            scope.upstep = function (op) {
	                scope.step--;
	                scope.initStep(op);
	                scope.registerStepPublicStyle = { "display": "block" };
	            }
	            scope.nextstep = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            //关闭注册
	            scope.closeRegister = function () {
	                scope.resetForm();
	                if (timer != null) {
	                    $interval.cancel(timer);
	                }
	                scope.loginobj.reset();
	                scope.step = 0;
	                for (var i = 0; i < length; i++) {
	                    scope.stusteparary[i] = { "display": "none" };
	                    scope.matesteparary[i] = { "display": "none" };
	                    scope.pwdsteparary[i] = { "display": "none" };
	                }
	                scope.registerstyle = { "display": "none" };

	            }

	            //验证序列号
	            scope.checkSerialNo = function () {
	                if (scope.loginobj.serialno_one == undefined || scope.loginobj.serialno_one.length != 4
						|| scope.loginobj.serialno_two == undefined || scope.loginobj.serialno_two.length != 4
						|| scope.loginobj.serialno_three == undefined || scope.loginobj.serialno_three.length != 4
						|| scope.loginobj.serialno_four == undefined || scope.loginobj.serialno_four.length != 4) {
	                    return;
	                }
	                scope.loginobj.serialno = scope.loginobj.serialno_one + '-' + scope.loginobj.serialno_two + '-' + scope.loginobj.serialno_three + '-' + scope.loginobj.serialno_four;
	                scope.serialerrortext = { message: '' };
	                //无效序列号

	            }
	            //网络学院注册保存
	            scope.saveAccount = function () {
	                scope.clickStuRegistDisable = true;
	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var confirmmd5pwd = md5(scope.pwdobject.confirmhashpwd);
	                var submitform = scope.loginobj;
	                submitform.hashpwd = md5pwd;
	                submitform.confirmhashpwd = confirmmd5pwd;

	                AccountService.saveAccount(submitform, function (data) {
	                    scope.clickStuRegistDisable = false;
	                    CommonService.alert("注册成功");
	                    scope.loginobj.reset();
	                    scope.closeRegister();
	                }, function (error) {
	                    scope.clickStuRegistDisable = false;
	                    scope.pwdobject.hashpwd = '';
	                    scope.pwdobject.confirmhashpwd = '';
	                    CommonService.alert("注册失败");
	                });
	            }
	            //校友注册保存
	            scope.saveMateAccount = function () {

	            }
	            //找回密码
	            scope.getPwd = function () {
	                scope.step = 0;
	                scope.step++;
	                scope.initStep('getpwd');
	                //scope.getPwdStyle = { "display": "block" };
	                scope.registerstyle = { "display": "block" };
	            }
	            //找回密码，下一步
	            scope.getPwdConfirmInfo = function () {
	                scope.clickForgotpwdStepDisable = true;
	                getDataSource.getDataSource(["getAccountByLognameAndPhone"], { formlogname: scope.loginobj.logname, phone: scope.loginobj.cellphone }
					, function (datatemp) {
					    if (datatemp.length <= 0) {
					        CommonService.alert("该账号与手机号不匹配");
					        scope.clickForgotpwdStepDisable = false;
					    } else {
					        //匹配后，再发送短信码
					        scope.nextstep('getpwd');
					        scope.clickForgotpwdStepDisable = false;
					    }
					}, function (errortemp) {
					    scope.clickForgotpwdStepDisable = false;
					});
	            }
	            //发送短信的操作
	            scope.sendSmsDisabled = false;
	            scope.forgotpwdSeconds = configSeconds;

	            //找回密码验证码
	            scope.forgotpwdSecondsString = "获取验证码";
	            scope.getPwdSmsCode = function () {
	                scope.sendSmsDisabled = true;
	                getDataSource.getDataSource(["getAccountByLognameAndPhone"], { formlogname: scope.loginobj.logname, phone: scope.loginobj.cellphone }
						, function (datatemp) {
						    if (datatemp.length <= 0) {
						        CommonService.alert("该账号与手机号不匹配");
						        scope.sendSmsDisabled = false;
						    } else {
						        //匹配后，再发送短信码
						        getDataSource.getUrlData("../api/getSMSCode", { phone: scope.loginobj.cellphone, keyname: "forgotpwdsmscode" }, function (datatemp) { }, function (errortemp) { });
						        timer = $interval(function () {
						            scope.forgotpwdSeconds = scope.forgotpwdSeconds - 1;
						            scope.forgotpwdSecondsString = "获取验证码(" + scope.forgotpwdSeconds + ")";
						            if (scope.forgotpwdSeconds == 0) {
						                $interval.cancel(timer);
						                scope.forgotpwdSecondsString = "重新获取";
						                scope.forgotpwdSeconds = configSeconds;
						                scope.sendSmsDisabled = false;
						            }
						        }, 1000);
						    }
						}, function (errortemp) {
						    scope.sendSmsDisabled = false;
						});
	            }
	            scope.remoteForgotpwdSmscodeMessage = "";
	            scope.remoteForgotPwdCheckSmsCode = function () {
	                if (scope.loginobj.smscode == undefined || scope.loginobj.smscode.length != 4) {
	                    return;
	                }
	                getDataSource.getUrlData("../api/VerifySMSCode", { smscode: scope.loginobj.smscode, keyname: "forgotpwdsmscode" }, function (datatemp) {
	                    if (datatemp.code == "success") {
	                        scope.sendSmsDisabled = true;
	                        scope.clickForgotpwdStepDisable = false;
	                        scope.remoteForgotpwdSmscodeMessage = "";
	                        $interval.cancel(timer);
	                    } else {
	                        scope.remoteForgotpwdSmscodeMessage = "验证码错误";
	                        scope.sendSmsDisabled = false;
	                        scope.clickForgotpwdStepDisable = true;
	                    }
	                }, function (errortemp) {

	                });
	            }
	            scope.clearForgotPwdCheckSmsCodeMessage = function () {
	                scope.remoteForgotpwdSmscodeMessage = "";
	            }
	            //保存新密码
	            scope.saveNewPwd = function () {
	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var lognametemp = scope.loginobj.logname;
	                getDataSource.getUrlData("../api/Forgotpwd", { formlogname: lognametemp, cellphone: scope.loginobj.cellphone, newpwd: md5pwd }
						, function (datatemp) {
						    if (datatemp.code == "success") {
						        //scope.loginobj.logname = lognametemp;
						        CommonService.alert("更新密码成功");
						        scope.loginobj.reset();
						        scope.closeRegister();
						        scope.resetForm();
						    } else {
						        CommonService.alert("更新密码失败");
						    }
						}, function (errortemp) {
						    CommonService.alert("更新密码失败");
						});
	            }
	            //帮助按钮
	            scope.helpDoc = function () {
	                return;
	            }
	        }
	    }
	}])
.directive("apptop", ["$http", "$location", "$timeout", "$sce", '$rootScope', "DateService", 'getDataSource', function ($http, $location, $timeout, $sce, $rootScope, DateService, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/apptop.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
            DateService.getTodayDateSpan(function (data) {
                $scope.todaydatespan = data;
            }, function (error) {
                $scope.todaydatespan = error;
            });
            $scope.user = $rootScope.user;

            $scope.gologin = function () {
            	location.href = "../html/index.html#/main/index";
            }

            $scope.toToSetting = function () {
            	var path = $location.absUrl();

            	var objtemp = _.find($rootScope.mainConfig, { 'select': true });
            	if (typeof (objtemp) == "object") {
            		objtemp.select = false;
            	}

            	var obj = _.find($rootScope.mainConfig, { 'elementName': "usercenter" });
            	if (typeof (obj) == "object") {
            		obj.select = true;
            	}

            	console.log(path);

            	if (path.indexOf('indexfront.html') > -1) {
            		location.href = "indexfront.html#/main/usercenter";
            		console.log(path);
            	}
            	//indexfront.html#/main/usercenter
            }

            $scope.exit = function () {

                getDataSource.getUrlData("../api/Logout", {}, function (datatemp) {
                    if (datatemp.code == "success") {
                        location.href = "../html/login.html"
                    }
                }, function (errortemp) { });
            }

        }],
        link: function (scope, element, attr, ctrl) {

        }
    }
}])
.directive("appfooter", ["$http", "$timeout", "$sce", "getDataSource", "FilesService", function ($http, $timeout, $sce, getDataSource, FilesService) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/appFooter.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {

            $http.get("../config/dataSource.json").then(function (data) {
                $scope.data = data.data;
                $scope.data.infomation.no = $sce.trustAsHtml($scope.data.infomation.no);
            });

            $scope.linkClick = function (n) {
                if (n.url) {
                    window.open(n.url);
                }
            }

            getDataSource.getDataSource("getFooterDownload", {}, function (data) {
                $scope.downloadData = data;
            }, function (e) { })

            //下载文件
            $scope.downFiles = function (item) {
                return FilesService.downApiFiles("download", item.attach_servername, item.attach_clientname);
            }

        }],
        link: function (scope, element, attr, ctrl) {
            if ($(window).height() < $('body').height()) {
                $(element).find(".footer").css({ 'position': 'absolute', 'left': '0px', 'bottom': '0px' });
            }
        }
    }
}])
.directive("floatMenu", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/floatMenu.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
            $(element).find("li").hover(function () {
                $(this).find('i').hide();
                $(this).find('span').show();
            }, function () {
                $(this).find('i').show();
                $(this).find('span').hide();
            })
        }
    }
}])
.directive("sendSmscode", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/sendSmscode.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
        }
    }
}])
.directive("lunbo", ["$http", "$timeout", "$sce", "getDataSource", function ($http, $timeout, $sce, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/lunbo.html",
        replace: true,
        scope: {
            imglist: "=imglist"
        },
        controller: ["$scope", "$element", "$attrs", "$http",function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
            //var promise = getDataSource.queryLunbo(scope.url);
            var step = 0;
            var time = null;
            var length = 1;
            scope.$watch('imglist', function (item) {
                scope.imglist = item;
                //console.log(scope.imglist.length);
                if (scope.imglist.length > 0) {
                    length = scope.imglist.length;
                }
            });
            var stepFun = function () {
                //console.log("element",element.find("li"));
                element.find("li").removeClass("active");
                element.find("li").eq(step + 1).addClass("active");
                scope.pic = step;
                step++;
                //console.log("length", length);
                step = step % length;
                //time = $timeout(function () {
                //	stepFun();
                //}, 5000);
            };
            stepFun();
            /*点击事件*/
            scope.clickEvent = function (number) {
                scope.pic = number;
                element.find("li").removeClass("active");
                element.find("li").eq(number + 1).addClass("active");
                //$timeout.cancel(time);
                step = number;
            };
            /*鼠标移除动画重新开始*/
            scope.start = function () {
                //$timeout.cancel(time);
                stepFun();
            }
        }
    }
}])
.directive("treeDialog", ["$rootScope", "$modal", "$timeout", "getDataSource", function ($rootScope,$modal, $timeout, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/ztree.html",
        scope: {
            ngselect: "=ngSelect",
            ngid: "=ngId",
            ngname: "=ngName",
            ngcheck: "=ngCheck",
            ngcheckArray: "=ngCheckedArray",
            searchflag: "=searchFlag"
        },
        replace: true,
        transclude: true,
        controller: ["$scope", "$element", "$attrs",function ($scope, $element, $attrs) {
            if ($scope.searchflag == undefined || $scope.searchflag) {
                var mid = $rootScope.user.mdepartmentId;
                var mname = $rootScope.user.mdepartmentName;
                if ($rootScope.user.usertype == 2) {
                    mid = $rootScope.user.departmentId;
                    mname = $rootScope.user.departmentName;
                }

                $scope.depname = mname;
                if ($scope.ngid != undefined) $scope.ngid = mid;
                if ($scope.ngname != undefined) $scope.ngname = mname;
            }

            var getSelectDepartment = function (treeNode, checked) {
                var id = treeNode.id;
                if (checked) {
                    if (_.filter($scope.ngcheckArray, function (r) { return r.id == id }).length <= 0) {
                        $scope.ngcheckArray.push({ id: treeNode.id });
                    }
                } else
                    _.remove($scope.ngcheckArray, function (r) { return r.id == id });

                if (treeNode.children && treeNode.children.length > 0) {
                    angular.forEach(treeNode.children, function (item) {
                        getSelectDepartment(item, checked);
                    });
                }
            }
           
            //tree设置
            $scope.treeSetting = {
            	view: {
            		dblClickExpand: false,
            		expandSpeed: "slow"
            	},
            	data: {
            		simpleData: {
            			enable: true,
            			idKey: "id",
            			pIdKey: "pid"
            		}
            	},
            	callback: {
            		beforeClick: function () { },
            		onClick: function (e, treeId, treeNode) {
            			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            			var nodes = zTree.getSelectedNodes();
            			if (nodes.length > 0) {
            				$timeout(function () { 
            					$scope.depname = nodes[0].name;
            					if ($scope.ngid != undefined) $scope.ngid = nodes[0].id;
            					if ($scope.ngname != undefined) $scope.ngname = nodes[0].name;
            					if ($scope.ngselect) $scope.ngselect(nodes[0]); 
            					hideMenu();
            				}, 10);
                           
            			}
            		},
            		onCheck: function (e, treeId, treeNode) {
            			//if (treeNode.isParent) {
            			//	return;
            			//}
            			//if (treeNode.checked) {
            			//	if ($scope.ngcheckArray) {
            			//		$scope.ngcheckArray.push({ id: treeNode.id });
            			//	}
            			//} else {
            			//	_.remove($scope.ngcheckArray, function (o) { return o.id == treeNode.id });
            		    //}

            		    $timeout(function () {
            		        getSelectDepartment(treeNode, treeNode.checked);
            		    }, 1000);
            		}
                }
            };
			
            if ($scope.ngcheck) {
            	
            	var checktemp = {
            		enable: true,
            		chkboxType: { "Y": "s", "N": "s" }
            	};            	$scope.treeSetting.check = checktemp;
            }

            function hideMenu() {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                    hideMenu();
                }
            }

            //显示部门树
            $scope.open = function () {
                var cityObj = $("#txtdepartment");
                var cityOffset = $("#txtdepartment").offset();
                //$("#menuContent").css({ left: cityOffset.left - 75 + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");
                $("#menuContent").slideDown("fast");
                $("body").bind("mousedown", onBodyDown);

                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = zTree.getNodes();
                //if (nodes[0] && nodes[0].children && nodes[0].children.length > 0) {
                //    zTree.expandNode(nodes[0].children[0], true, true, true);
                //}
            }


            //获取部门数据回调
            window.apiCallback.getAllDepartment = function (data) {
                $scope.treeData = data;
                $.fn.zTree.init($("#treeDemo"), $scope.treeSetting, $scope.treeData);
            }


            //获取部门数据
            $scope.getDepartmentArr = function () { 
                //var p = {
                //    url: "getAllDepartment",
                //    parameter: {}
                //};   
                //if ($rootScope.user.usertype == "1") {
                //    p.url = "getDepartment";
                //    p.parameter = { pid: $rootScope.user.departmentId }; 
                //}
                //var p = {
                //    url: "getDepartment",
                //    parameter: { pid: $rootScope.user.departmentId }
                //};
                getDataSource.getDepartment(function (data) {
                    window.apiCallback.getAllDepartment(data);
                }, function (error) { }); 
            }();


        }]
    
    };
}])


app.animation('.fade-in', [function () {
	return {
		enter: function (element, done) {
			var step = 0;
			var time = null;//计时器
			var animationFunc = function () {
				step += 20;
				if (step > 100) {
					done();
					clearInterval(time);
				} else {
					element.css("opacity", step / 100);
				}
			};
			element.css("opacity", 0);
			time = setInterval(animationFunc, 50);
		},
		leave: function (element, done) {
			var step = 100;
			var time = null;
			var animationFun = function () {
				step -= 20;
				if (step < 0) {
					done();
					clearInterval(time);
				} else {
					element.css("opacity", step / 100)
				}
			};
			element.css("opacity", 1);
			time = setInterval(animationFun, 40);
		}
	}
}])
.directive("loading", [function () {
    return {
        restrict: "AE",//<button class="btn btn-warning btn-circle" ng-click="close()" type="button"><i class="fa fa-times tubiaoicon-17"></i></button>
        template: '<div class="dialogMask" ng-show="isOpened"><div class="modal-content" ng-style="dialogStyle" style="height:150px"><div class="modal-header red text-center" >温馨提示</div><div class="modal-body"><h3>{{options.message}}</h3></div></div></div>',
        scope: {
            options: "=ngModel"
        },
        replace: true,
        transclude: true,
        controller: ["$scope", "$element", "$attrs", "$location", function ($scope, $element, $attrs, $location) {
            $scope.isOpened = false;
        }],
        link: function (scope, element, attr, ctrl) {

            scope.$watch("options.isOpened", function () {
                if (scope.options && scope.options.isOpened) {
                    scope.isOpened = true;
                } else {
                    scope.isOpened = false;
                }
            })

        }
    };
}])
;
