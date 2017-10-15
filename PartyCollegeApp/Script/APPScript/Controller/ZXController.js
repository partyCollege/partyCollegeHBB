/// <reference path="E:\workplace\sy_works\prj\OA\PartyCollegeHBB\PartyCollegeApp\templates/HbbPJ.html" />
/// <reference path="E:\workplace\sy_works\prj\OA\PartyCollegeHBB\PartyCollegeApp\templates/HbbPJ.html" />
angular.module('app.controllers')
.controller("myController", function ($scope) {
})
.controller("HbbloginController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $http) {
    $scope.rememberPassword = localStorage.rememberPassword === "true";

    $scope.onRememberPasswordClick = function () {
        $scope.rememberPassword = !$scope.rememberPassword;
        localStorage.rememberPassword = "" + $scope.rememberPassword;
        if ($scope.rememberPassword) {
            localStorage.logname = $scope.loginData.logname;
            localStorage.password = $scope.loginData.password;
        } else {
            localStorage.logname = "";
            localStorage.password = "";
        }
        console.log("onRememberPasswordClick localStorage.rememberPassword:", localStorage.rememberPassword);
    }


    $scope.loginData = {
        logname: "",
        password: ""
    }
    //if (localStorage.testMode) {
    //    $scope.loginData.logname = "sysadmin";
    //    $scope.loginData.password = "11111111";
    //}
    

    $scope.login = function () {
        if (!$scope.loginData.logname) {
            showAlert.showToast("用户名不能为空");
            return;
        }
        if (!$scope.loginData.password) {
            showAlert.showToast("密码不能为空");
            return;
        }

        var jsonData = {
            logname: $scope.loginData.logname,
            hashpwd: md5($scope.loginData.password),//Base64.encode($scope.loginData.password),
            verifycode: '',
            fromApp: true
        };
        if (localStorage.debug) {
            console.log("login:", jsonData);
            console.log("login localStorage.rememberPassword:", localStorage.rememberPassword);
        }

        if ($scope.rememberPassword) {
            localStorage.logname = $scope.loginData.logname || "";
            localStorage.password = $scope.loginData.password || "";
        }

        showAlert.showLoading(10000, "登录中...");
        Restangular.all("login").post(jsonData).then(function (data) {
            showAlert.hideLoading();
            if (localStorage.debug) {
                console.log(data);
            }
            if (localStorage.debug) {
                if (data) {
                    console.log("loginUser", data.loginUser);
                }
            }
            if (data && data.result && data.loginUser) {
                if (localStorage.debug) {
                    console.log("登录成功");
                }
                $rootScope.loginUser = data.loginUser.loginUser;
                $rootScope.user = data.loginUser.loginUser;
                go();
            } else {
                var msg = ""
                if (data && data.message) {
                    msg = data.message;
                } else {
                    msg = "登录失败";
                }
                showAlert.showToast(msg);
                if ($rootScope.testMode) {
                    go();
                }
            }
        })["catch"](function (data, status) {
            if ($rootScope.testMode) {
                go();
            }
            console.log(data);
            showAlert.hideLoading();
            showAlert.showToast("登录出错");
        });
    }

    function go() {
        $state.go("HbbMain.maincourse");
    }

    $scope.Zhuce = function () {
    	 var $btn=true;
    	   if($btn){$(".zhuce").css("background","silver");$btn=false;}
        $state.go("HbbRegister");
    }

	$scope.forgetpassword = function() {
		 var $btn=true;
    	   if($btn){$(".pas").css("background","silver");$btn=false;}
		$state.go("HbbForgetPassword");
	}

    function init() {
        localStorage.mainCourseTabIndex = 0;
        localStorage.mainSelectCourseTabIndex = 0;
        localStorage.mainClassTabIndex = 0;
        localStorage.mainRecordTabIndex = 0;

        if ($scope.rememberPassword) {
            $scope.loginData.logname = localStorage.logname || "";
            $scope.loginData.password = localStorage.password || "";
        }
    }
    init();
})
.controller("HbbRegisterController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $timeout, BreadcrumbOrganizeSelect) {
    $scope.registerObject = {
        name: "",
        colleague1: "",
        colleague1: "",
        departmentid: "",
        departmentname: ""
    };
    $scope.goBack = function() {
		$ionicHistory.goBack();
	}

    $scope.disableRegister = true;
    $scope.onRegisterInfoChange = function(){
    	if ($scope.registerObject.name
			&& $scope.registerObject.cellphone
            && $scope.registerObject.colleague1 
            && $scope.registerObject.colleague2
            && $scope.registerObject.departmentname) {
            $scope.disableRegister = false;
        } else {
            $scope.disableRegister = true;
        }
        if (localStorage.debug) {
            console.log("onRegisterInfoChange");
        }
    }

    $scope.validate = function () {
        var jsonData = {
            name: "", //名字
            departmentid: "",//部门ID
            departmentname: "",//可以不传
            colleague1: "",// 同事1
            colleague2: "",//同事2

            rank: "",//职级
            cellphone: "",//手机
            verifycode: "",//验证码
            smscode: "",//短信验证码
            type: 0,  //0验证信息，1注册信息, 2修改密码
            password1: "",//密码
            password2: ""//确认密码
        }

        //if ($rootScope.testMode) {
        //    $scope.registerObject.name = "阚丽萍";
        //    $scope.registerObject.colleague1 = "毛相楠";
        //    $scope.registerObject.colleague2 = "王鑫";
        //    $scope.registerObject.departmentid = "37030000100";
        //    $scope.registerObject.departmentname = "淄博市环境保护局机关";
        //}

        if ($scope.registerObject) {
            angular.extend(jsonData, $scope.registerObject);
        }

        if (localStorage.debug) {
            console.log("$stateParams.registerInfo", $scope.registerObject);
            console.log("register validate:", jsonData);
        }
        
        if (!jsonData.name) {
            showAlert.showToast("姓名不能为空");
            return;
        }
        if (!jsonData.name) {
        	showAlert.showToast("手机号码不能为空");
        	return;
        }
        if (jsonData.name == jsonData.colleague1 || jsonData.name == jsonData.colleague2) {
        	showAlert.showToast("姓名与同事一或同事二不能相同");
        	return;
        }
        if (jsonData.colleague1 == jsonData.colleague2) {
        	showAlert.showToast("同事一和同事二不能相同");
        	return;
        }

        showAlert.showLoading(5000, "加载中...");
        Restangular.all("validate").post(jsonData).then(function (data) {
        	showAlert.hideLoading();
        	console.log(data);
            if (localStorage.debug) {
                console.log(data);
            }
            if (data && data.result) {
                if (localStorage.debug) {
                    console.log("校验成功");
                }
                var logname = "";
                var accountid = "";
                if (data.model) {
                	logname = data.model.logname;
                	accountid = data.model.accountid;
                	cellphone = data.model.cellphone;
                }
                go(logname, accountid,cellphone);
            } else {
                $scope.registerLogname = "";
                var msg = ""
                if (data && data.message) {
                    msg = data.message;
                } else {
                    msg = "校验失败";
                }
                showAlert.showToast(msg);

                if ($rootScope.testMode) {
                    go();
                }
            }
        })["catch"](function (data, status) {
            if ($rootScope.testMode) {
                $state.go("HbbActivate");
            }

            console.log(data);
            showAlert.hideLoading();
            showAlert.showToast("校验出错");
        });
    }

    function go(logname, accountid, cellphone) {
        if (localStorage.debug) {
            console.log("registerObject=", $scope.registerObject);
        }
        
        var registerInfo = {};
        if ($scope.registerObject) {
            angular.extend(registerInfo, $scope.registerObject);
        }
        registerInfo.logname = logname || "";
        registerInfo.accountid = accountid || "";
        registerInfo.cellphone = cellphone || "";
        var activeInfo = JSON.stringify(registerInfo);
        var activeInfoBase64 = Base64.encode(activeInfo);
        $state.go("HbbActivate", { registerInfo: activeInfoBase64 });
    }

    $scope.breadcrumbOrganizeSelectHandle = null;
    $scope.openDepartmentSelect = function () {
        if (localStorage.debug) {
            console.log("openDepartmentSelect");
        }
        $scope.breadcrumbOrganizeSelectHandle = BreadcrumbOrganizeSelect.showPop($timeout, showAlert, 0, true, $scope, function (selectArray) {
            if (localStorage.debug) {
                console.log(selectArray);
            }
            if (selectArray && selectArray.length > 0) {
                var selectedObj = selectArray[0];
                $scope.registerObject.departmentname = selectedObj.name;
                $scope.registerObject.departmentid = selectedObj.id;
                $scope.onRegisterInfoChange();
            }
        })
    }

    $scope.$on('$ionicView.beforeLeave', function () {
        if ($scope.breadcrumbOrganizeSelectHandle) {
            $scope.breadcrumbOrganizeSelectHandle.close();
            $scope.breadcrumbOrganizeSelectHandle = null;
        }
    });
})
.controller("HbbActivateController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $interval) {
    //$scope.onRankClick = function (e) {
    //    console.log(e);
    //    e.stopPropagation();
    //    $('#active-rank').click();
    //}

    //$scope.onRankSelectClick = function ($event) {
    //    console.log("onRankSelectClick");
    //    $event.stopPropagation();
    //    //$event.preventDefault();
	//}

	$scope.goBack = function () {
		//$state.go("HbbLogin");
		$ionicHistory.goBack();
	}

    


    $scope.rankList = [];
    $scope.init = function () {
        showAlert.showLoading(5000, "加载中...");
        getDataSource.getDataSource("getSyCode", { category: "职级" }, function (data) {
            $scope.rankList = data;
            if (localStorage.debug) {
                console.log("职级:", data);
            }
            showAlert.hideLoading();
        }, function (data) {
            console.log("error:", data);
            showAlert.hideLoading();
        });
    }
    $scope.init();
    
    $scope.activeInfo = {
        rank: "",
        cellphone: "",
        verifycode: "",
        smscode: "",
        type: "12",
        password1: "",
        password2: ""
    };
    

    var registerInfo = "";
    try {
        registerInfo = JSON.parse(Base64.decode($stateParams.registerInfo));
        if (localStorage.debug) {
            console.log("registerInfo", registerInfo);
        }
    } catch (e) {
        console.log(e);
    }
    $scope.logname = registerInfo && registerInfo.logname || "";
    $scope.accountid = registerInfo && registerInfo.accountid || "";
    $scope.activeInfo.cellphone = registerInfo && registerInfo.cellphone || "";

    function validatePhone(phone) {
        return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(phone);
    }

    function validatePassword(pwd) {
    	return /^[0-9 | A-Z | a-z|*]{8,16}$/.test(pwd);
    }

    $scope.active = function () {
        var jsonData = {
            name: "", //名字
            departmentid: "",//部门ID
            departmentname: "",//可以不传
            colleague1: "",// 同事1
            colleague2: "",//同事2

            rank: "",//职级
            cellphone: "",//手机
            verifycode: "",//验证码
            smscode: "",//短信验证码
            type: "12",  //0验证信息，1注册信息, 2修改密码
            password1: "",//密码
            password2: ""//确认密码
        }

        if (registerInfo) {
            //logname不需要传到后台
            try{
                delete registerInfo.logname;
            }catch(e){
                if (localStorage.debug) {
                    console.log(e);
                }
            }
            angular.extend(jsonData, registerInfo);
        }
        if ($scope.activeInfo) {
            angular.extend(jsonData, $scope.activeInfo);
        }

        if (!jsonData.cellphone ) {
            showAlert.showToast("手机号不能为空");
            return;
        } else if (!validatePhone(jsonData.cellphone)) {
            showAlert.showToast("手机号格式不正确");
            return;
        }

        jsonData.pass1 = Base64.encode(jsonData.password1);
        jsonData.pass2 = Base64.encode(jsonData.password2);
        if (jsonData.pass1.length <= 0) {
            showAlert.showToast("密码不能为空");
            return;
        }

        if (!validatePassword($scope.activeInfo.password1)) {
        	showAlert.showToast("密码格式错误");
        	return;
        }

        if (localStorage.debug) {
            console.log("validate jsonData:", jsonData);
        }
        showAlert.showLoading(5000, "加载中...");
        Restangular.all("validate").post(jsonData).then(function (data) {
            showAlert.hideLoading();
            if (localStorage.debug) {
                console.log(data);
            }
            if (data.result) {
                if (localStorage.debug) {
                    console.log("激活成功");
                }
                showAlert.showToast("激活成功");
                $state.go("HbbLogin");
            } else {
                var msg = ""
                if (data && data.message) {
                    msg = data.message;
                } else {
                    msg = "激活失败";
                }
                showAlert.showToast(msg);
            }
        })["catch"](function (data, status) {
            console.log(data);
            showAlert.hideLoading();
            showAlert.showToast("激活出错");
        });
    }

    $scope.paracont = "免费获取验证码";
    $scope.sms_disabled = false;
    var second = 90, timePromise = undefined;

    $scope.doSendSMS = function () {
        if (!$scope.activeInfo.cellphone) {
	        showAlert.showToast("手机号不能为空");
	        return;
        } else if (!validatePhone($scope.activeInfo.cellphone)) {
        	showAlert.showToast("手机号格式错误");
            return;
        }
        timePromise = $interval(function () {
            if (second <= 0) {
                $interval.cancel(timePromise);
                timePromise = undefined;

                second = 60;
                $scope.paracont = "重新获取";
                $scope.sms_disabled = false;
            } else {
                $scope.sms_disabled = true;
                $scope.paracont = second + "秒后可重发";
                second--;
            }
        }, 1000, 0);
        sendMsg();
    }

    function sendMsg() {
        var cellphone = $scope.activeInfo.cellphone || '';
        if (localStorage.debug) {
            console.log("cellphone:" + cellphone);
        }

        if (!$scope.activeInfo.cellphone) {
        	showAlert.showToast("手机号不能为空");
        	return;
        } else if (!validatePhone($scope.activeInfo.cellphone)) {
        	showAlert.showToast("手机号格式错误");
        	return;
        }

        showAlert.showLoading(5000, "加载中...");
    	Restangular.all("checkcellphone").post({ cellphone: cellphone, accountid: $scope.accountid }).then(function (data) {
    		if (!data.result) {
    			Restangular.all("getSMSCode").post({ phone: cellphone, keyname: "validatesmscode" }).then(function (data) {
    				showAlert.hideLoading();
    				if (localStorage.debug) {
    					console.log("短信发送", data);
    				}
    				var msg = "";
    				if (data) {
    					msg = data.message;
    				} else {
    					msg = "短信发送成功";
    				}
    				showAlert.showToast(msg);
    			})["catch"](function (data, status) {
    				console.log(data);
    				showAlert.showToast("短信发送出错");
    			});
    		} else {
    			$interval.cancel(timePromise);
    			timePromise = undefined;

    			second = 60;
    			$scope.paracont = "重新获取";
    			$scope.sms_disabled = false;

    			showAlert.showToast(data.message);
    		}
        })["catch"](function (data, status) {
        	console.log(data);
        	showAlert.hideLoading();
        	$interval.cancel(timePromise);
        	timePromise = undefined;
        	second = 60;
        	$scope.paracont = "重新获取";
        	showAlert.showToast("短信发送出错");
        });
    }


    $scope.rankPopupHandle = null;
    $scope.showRankPopup = function() {
       $scope.rankPopupHandle = $ionicPopup.show({
		 template:getPopupTemplate(),
         title: '请选择职级',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>选择</b>',
             type: 'button-positive',
             onTap: function(){
					for(var i=0;i<$scope.rankList.length;i++){
						if($scope.rankList[i].checked==true){
							$scope.activeInfo.rank =$scope.rankList[i].showvalue;
							break;
						}
					}
			}
           },
         ]
       });
    };

    function getPopupTemplate(){
        var resultTemp = "<div class='list'>";
		resultTemp +='<label class="item item-radio"  ng-repeat="item in rankList" ng-click="onRankListItemClick($index)">'+
						'<input type="radio" name="rankGroup"  value="{{item.showvalue}}" >'+
							'<div class="item-content"> {{item.showvalue}} </div>'+
						'<i class="radio-icon ion-checkmark" style="visibility:visible;" ng-if="item.showvalue == activeInfo.rank"></i>' +
                        '<i class="radio-icon ion-checkmark" ng-if="item.showvalue != activeInfo.rank"></i>' +
						'</label>';
		resultTemp += "</div>";
		return resultTemp;
    }

    $scope.onRankListItemClick = function (index) {
       for(var i=0;i<$scope.rankList.length;i++){
			if(index != i){
			    $scope.rankList[i].checked = false;
			}
		}			
       $scope.rankList[index].checked = true;
       $scope.activeInfo.rank = $scope.rankList[index].showvalue;

       $scope.onActiveInfoChange();
    }

    $scope.disableFinishButton = true;
    $scope.onActiveInfoChange = function() {
        if ($scope.activeInfo.rank
            && $scope.activeInfo.cellphone && validatePhone($scope.activeInfo.cellphone)
            && $scope.activeInfo.password1 && validatePassword($scope.activeInfo.password1)
            && $scope.activeInfo.password2
            && $scope.activeInfo.smscode) {

            $scope.disableFinishButton = false;
        } else {
            $scope.disableFinishButton = true;
        }
    }


    function init() {
         $scope.$on('$ionicView.beforeLeave', function () {
            if ($scope.rankPopupHandle) {
                $scope.rankPopupHandle.close();
                $scope.rankPopupHandle = null;
            }
        });
    }

    init();
})//选课
.controller("HbbSelectCoursesController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, FilesService, $debounce, $ionicTabsDelegate) {
	$scope.categoryList = [];           //一级分类
	$scope.categorySecondLevelList = [];//二级分类
	$scope.categoryYearList = [];   //年份
	//课程分类
	$scope.categoryTypeList = [
        { id: 0, type: "0", title: "视频" },
        { id: 1, type: "1", title: "非视频" }
	];

	$scope.selectedCategoryObj = null;
	$scope.selectedCategoryId = "";            //选中的一级分类
	$scope.selectedCategorySecondLevelId = ""; //选中的二级分类
	$scope.selectedCategoryType = "";
	$scope.model = {};
	$scope.model.query = "";


	var defaultStart = 1;
	var limit = 10; //列表数据偏移位 
	var tabIndexHistory = 0;
	var TAB_INDEX_SEARCH_RESULT = 4;

	$scope.onTabClick = function (index) {
		var idx = 0;
		try {
			idx = parseInt(localStorage.mainSelectCourseTabIndex);
		} catch (e) {
			idx = 0;
			console.error(e);
		}
		if (isNaN(idx)) {
			idx = 0;
		}
		tabIndexHistory = idx;

		if (index == TAB_INDEX_SEARCH_RESULT) {
			$scope.classify();
		} else {
			localStorage.mainSelectCourseTabIndex = index;
		}
		$ionicTabsDelegate.$getByHandle('mainselectcourse-tab-handle').select(index);

		if (localStorage.debug) {
			console.log("onTabClick index=", index);
			console.log("$ionicTabsDelegate", $ionicTabsDelegate);
		}
	}

	$scope.onSearch = function () {
		var idx = 0;
		try {
			idx = parseInt(localStorage.mainSelectCourseTabIndex);
		} catch (e) {
			idx = 0;
			console.error(e);
		}
		if (isNaN(idx)) {
			idx = 0;
		}

		if (idx != TAB_INDEX_SEARCH_RESULT) {
			tabIndexHistory = TAB_INDEX_SEARCH_RESULT;
			localStorage.mainSelectCourseTabIndex = TAB_INDEX_SEARCH_RESULT;
			$ionicTabsDelegate.$getByHandle('mainselectcourse-tab-handle').select(TAB_INDEX_SEARCH_RESULT);

			if (localStorage.debug) {
				console.log("onSearch");
			}
		}
	}

	$scope.courseListObject = {
		"1": {
			list: [],
			start: defaultStart,  //列表数据开始位置
			moreDataCanBeLoaded: true
		},
		"2": {
			list: [],
			start: defaultStart,
			moreDataCanBeLoaded: true
		},
		"3": {
			list: [],
			start: defaultStart,
			moreDataCanBeLoaded: true
		},
		"4": {
			list: [],
			start: defaultStart,
			moreDataCanBeLoaded: true
		},
		"SEARCH_RESULT": {
			list: [],
			start: defaultStart,
			moreDataCanBeLoaded: true
		}
	};

	$scope.classifyPopup = null;
	$scope.classify = function () {
		$scope.data = {}
		$scope.classifyPopup = $ionicPopup.show({
			title: "分类筛选",
			template: '<div><button data="0" ng-click="onFilterCatetoryClick()" ng-if="selectedCategoryObj" class="btn btn-default" style="background-color: #ddd;" ng-class="active" >{{selectedCategoryObj.name}}</button><button class="btn btn-default" ng-click="onFilterCatetoryClick()" ng-if="selectedCategoryObj">返回上级分类</button> </div>' +
                    '<p >课程分类</p><div class="courseSort_popupBox" style="height:auto">' +
					'<div ng-repeat="x in categoryListFilter" style="height:auto" >' +
					'<button data="0" class="btn btn-default" id="bbn" ng-click="selectCategory(this)"  >{{x.name}}</button>' + // ng-class=\'{true:"active"}[x.checked]\'
					'</div> <div style="clear:both;"></div>' +
					'</div>' +
					'<div ng-if="selectedCategoryObj" class="reclassify"><i><img src="../img/Hbb/t-arrow.png"/></i>' +
                        '<p></p><p>二级分类</p>' +
                        '<div class="courseSort_popupBox" style="height:auto">' +
                            '<div ng-repeat="x in categorySecondLevelList" style="height:auto">' +
                            '<button data="0" class="btn btn-default" id="bbn" ng-click="selectSecondLevelCategory(this)" ng-class=\'{true:"active"}[x.checked]\'>{{x.name}}</button>' +
                            '</div>' +
                            '<div ng-if="!categorySecondLevelList || categorySecondLevelList.length <= 0"> (暂无二级分类) <p></p></div>' +
                            '<div style="clear:both;"></div>' +
					    '</div>' +
                    '</div>' +

					'<p style="margin-top: 10px;" >所属年份</p><div class="courseSort_popupBox" style="height:auto">' +
					'<div ng-repeat="x in categoryYearList" style="height:auto" >' +
					'<button data="0" class="btn btn-default" id="bbn" ng-click="selectCategoryYear(this)" ng-class=\'{true:"active"}[x.checked]\' >{{x.year}}</button>' +
					'</div><div style="clear:both;"></div>' +
					'</div>' +
					'<p>课程类型</p><div class="courseSort_popupBox" style="height:auto">' +
					'<div ng-repeat="x in categoryTypeList" style="height:auto">' +
					'<button data="0" class="btn btn-default" id="bbn" ng-click="selectCategoryType(this)" ng-class=\'{true:"active"}[x.checked]\' >{{x.title}}</button>' +
					'</div><div style="clear:both;"></div>' +
					'</div>',
			scope: $scope,
			buttons: [
                {
                	text: '<b>关闭</b>',
                	type: 'button-positive',
                	onTap: function (e) {
                		cacelFilterCategory();
                	}
                },
                {
                	text: '<b>确定</b>',
                	type: 'button-positive',
                	onTap: function (e) {
                		doFilterCategory();
                	}
                }
			]
		});
	}

	$scope.onFilterCatetoryClick = function () {
		$scope.categoryListFilter = $scope.categoryList;
		$scope.selectedCategoryObj = null;

		$scope.selectedCategoryId = "";            //选中的一级分类
		$scope.selectedCategorySecondLevelId = ""; //选中的二级分类
	}

	//课程分类
	$scope.selectCategory = function (obj) {
		if (localStorage.debug) {
			console.log(obj);
		}

		$scope.categoryListFilter = [];
		$scope.selectedCategorySecondLevelId = "";
		//if (obj.x.checked) {
		//    obj.x.checked = false;
		//    $scope.selectedCategoryId = "";
		//    $scope.selectedCategoryObj = null;
		//} else {
		obj.x.checked = true;
		$scope.selectedCategoryId = obj.x.id;
		$scope.selectedCategoryObj = obj.x;
		onCategoryFirsLevelSelected($scope.selectedCategoryId);
		//}

		for (var i = 0 ; i < $scope.categoryList.length ; i++) {
			var cate = $scope.categoryList[i];
			if (cate.id == obj.x.id && obj.x.id && cate.id) {
				//do nothing
			} else {
				$scope.categoryList[i].checked = false;
			}
		}
	}

	function onCategoryFirsLevelSelected(categoryId) {
		if (localStorage.debug) {
			console.log("二级分类 fid=", categoryId);
		}
		//一级分类
		getCourseCategoryImpl(categoryId, function (data) {
			if (localStorage.debug) {
				console.log("二级分类:", data);
			}
			if (data) {
				$scope.categorySecondLevelList = data;
			}
		}, function (data) {
			//if (localStorage.test) {
			//	$http.get("../TestJSON/category_secondclass.json").then(function (data) {
			//		$scope.categorySecondLevelList = data.data;
			//	});
			//} else {
			//	console.error("error:", data);
			//}
		})
	}

	//课程二级分类
	$scope.selectSecondLevelCategory = function (obj) {
		if (localStorage.debug) {
			console.log(obj);
		}

		if (obj.x.checked) {
			obj.x.checked = false;
			$scope.selectedCategorySecondLevelId = "";
		} else {
			obj.x.checked = true;
			$scope.selectedCategorySecondLevelId = obj.x.id;
		}

		for (var i = 0 ; i < $scope.categorySecondLevelList.length ; i++) {
			var cate = $scope.categorySecondLevelList[i];
			if (cate.id == obj.x.id && obj.x.id && cate.id) {
				//do nothing
			} else {
				$scope.categorySecondLevelList[i].checked = false;
			}
		}
	}

	//所属年份
	$scope.selectCategoryYear = function (obj) {
		if (obj.x.checked) {
			obj.x.checked = false;
			$scope.selectedCategoryYear = "";
		} else {
			obj.x.checked = true;
			$scope.selectedCategoryYear = obj.x.year || "";
		}

		for (var i = 0; i < $scope.categoryYearList.length; i++) {
			var cate = $scope.categoryYearList[i];
			if (cate.id == obj.x.id && obj.x.id && cate.id) {
				//do nothing
			} else {
				$scope.categoryYearList[i].checked = false;
			}
		}
	}

	//课程类别
	$scope.selectCategoryType = function (obj) {
		if (obj.x.checked) {
			obj.x.checked = false;
			$scope.selectedCategoryType = "";
		} else {
			obj.x.checked = true;
			$scope.selectedCategoryType = obj.x.type;
		}

		for (var i = 0; i < $scope.categoryTypeList.length; i++) {
			var cate = $scope.categoryTypeList[i];
			if (cate.id == obj.x.id) {
				//do nothing
			} else {
				$scope.categoryTypeList[i].checked = false;
			}
		}
	}

	function cacelFilterCategory() {
		$ionicTabsDelegate.$getByHandle('mainselectcourse-tab-handle').select(tabIndexHistory);
	}

	function doFilterCategory() {
		localStorage.mainSelectCourseTabIndex = TAB_INDEX_SEARCH_RESULT;

		//getAllCourse();
		getSearchResult();
		if (localStorage.debug) {
			console.log("ok selected");
		}
	}

	$scope.goCourseDetail = function (item) {
		if (localStorage.debug) {
			console.log("item:", item);
		}

		var vid = Base64.encode(item.teachervideo);
		var courseId = Base64.encode(item.coursewareid);
		if (item.iselectivechoose == "1") {
			$state.go("HbbCourse", { videoId: vid, courseId: courseId });
		} else {
			$state.go("HbbCourseView", { videoId: vid, courseId: courseId });
		}
	}

	$scope.getImageUrl = function (image) {
		var imgurl = FilesService.showFile("coursewarePhoto", image, image);
		return imgurl;
	}

	$scope.chooseCourse = function (item, $event) {
		var courseId = item.coursewareid;
		var postData = { coursewareid: courseId, status: "0" };

		// 选课
		showAlert.showLoading(5000, "加载中...");
		Restangular.all("addcoursewareuser").post(postData).then(function (data) {
			if (localStorage.debug) {
				console.log("选课按钮操作", data);
			}
			showAlert.hideLoading();
			if (data.result) {
				item.iselectivechoose = 1; //已选择。
				showAlert.showToast("操作成功");
				$scope.$emit("chooseCourseEvent", item);
			}
		})["catch"](function (data) {
			showAlert.hideLoading();
			console.error("选课操作", data);
		});

		if (localStorage.debug) {
			console.log("选课");
		}
		$event.stopPropagation();
	}

	function getCourseCategoryImpl(fid, successCallback, errorCallback) {
		getDataSource.getDataSource("mystudy-allcourse-category", { fid: fid }, successCallback, errorCallback);
	}


	//获取分类
	function getCategory() {
		//一级分类
		getCourseCategoryImpl('0', function (data) {
			if (localStorage.debug) {
				console.log("分类:", data);
			}


			if (data) {
				$scope.categoryList = data;
				$scope.categoryListFilter = data;
			}
		}, function (data) {
			//if (localStorage.test) {
			//	$http.get("../TestJSON/category_firstclass.json").then(function (data) {
			//		$scope.categoryList = data.data;
			//	});
			//} else {
			//	console.error("error:", data);
			//}
		})

		//年份
		var curDate = new Date();
		var year = curDate.getFullYear();
		for (var y = year; y > year - 5; y--) {
			var yearObj = {};
			yearObj.year = y;
			yearObj.id = y;
			yearObj.checked = false;
			$scope.categoryYearList.push(yearObj);
		}
	}

	function getCourse(param, queryType, callback) {
		var yearParam = "";
		if ($scope.selectedCategoryYear) {
			yearParam = "=," + $scope.selectedCategoryYear;
		} else {
			yearParam = "";
		}

		var searchType = param.searchType || "";

		var searchP;
		if (searchType == "SEARCH_RESULT") {
			searchP = {
				condation: $scope.model.query, //课程名称、主讲人、课程来源
				onecate: $scope.selectedCategoryId || "", //一级分类ID
				twocate: $scope.selectedCategorySecondLevelId || "", //二级分类ID
				year: yearParam, //年份,按'=,2016',
				courseType: $scope.selectedCategoryType, //课程类型：0：视频，1:非视频
				searchType: "", //查询类别: 全部:'',最新:'1',精品:'2',推荐:'3',排行:'4'
				pageIndex: defaultStart,
				pageSize: limit
			}

			if (param) {
				angular.extend(searchP, param);
			}
			searchP.searchType = ""; //查询全部
		} else {
			searchP = {
				condation: "", //课程名称、主讲人、课程来源
				onecate: "", //一级分类ID
				twocate: "", //二级分类ID
				year: "", //年份,按'=,2016',
				courseType: "", //课程类型：0：视频，1:非视频
				searchType: "", //查询类别: 全部:'',最新:'1',精品:'2',推荐:'3',排行:'4'
				pageIndex: defaultStart,
				pageSize: limit
			}
			searchP.searchType = searchType;
			searchP.pageIndex = param.pageIndex;
		}


		if (localStorage.debug) {
			console.log("课程列表请求参数 " + searchType + ", searchP=", searchP);
		}
		Restangular.all("getcoursewarelist").post(searchP).then(function (data) {
			if (data) {
				if (localStorage.debug) {
					console.log("课程列表 , searchType=" + searchType, data.list);
				}
				callback(searchType, queryType, data.list);
			} else {
				$scope.courseListObject[searchType].moreDataCanBeLoaded = false;
			}
			if (queryType == 'more') {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}
		})["catch"](function (data) {
			$scope.courseListObject[searchType].moreDataCanBeLoaded = false;
			if (queryType == 'more') {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}
			console.log(data);
		});
	}

	function getAllCourse() {
		$scope.doGetCourse('1', 'new');//最新
		$scope.doGetCourse('2', 'new');//精品
		$scope.doGetCourse('3', 'new');//推荐
		$scope.doGetCourse('4', 'new');//排行
		$scope.doGetCourse('SEARCH_RESULT', 'new');//搜索结果
	}

	function getSearchResult() {
		$scope.doGetCourse('SEARCH_RESULT', 'new');//搜索结果
	}


	$scope.doGetCourse = function (searchType, queryType) {
		var startIndex;
		if (queryType == 'more') {
			startIndex = $scope.courseListObject[searchType].start;
		} else {
			startIndex = defaultStart;
			$scope.courseListObject[searchType].start = startIndex;
		}

		var param = {
			searchType: searchType,
			pageIndex: startIndex
		}
		//最新
		getCourse(param, queryType, function (sType, qType, data) {
			if (qType == 'new') {
				$scope.courseListObject[sType].list = data;
			}
			if (data && data.length > 0) {
				if (data.length < limit) {
					$scope.courseListObject[sType].moreDataCanBeLoaded = false;
				} else {
					$scope.courseListObject[sType].moreDataCanBeLoaded = true;
				}

				if (qType == 'more') {
					for (var i = 0; i < data.length; i++) {
						$scope.courseListObject[sType].list.push(data[i]);
					}
				}
				$scope.courseListObject[sType].start++;
				//$scope.courseListObject[sType].start = $scope.courseListObject[sType].start + data.length;
			} else {
				$scope.courseListObject[sType].moreDataCanBeLoaded = false;
			}
			if (localStorage.debug) {
				console.log("qType=" + qType + ",$scope.MoreData" + sType + "CanBeLoaded=", $scope.courseListObject[sType].moreDataCanBeLoaded, ",courseList" + sType + "Start=", $scope.courseListObject[sType].start);
			}
		});
	}


	function init() {
		getCategory();

		$scope.$watch("model.query", function (newValue, oldValue) {
			if (localStorage.debug) {
				console.log("$scope.query=" + $scope.model.query + ",newValue=" + newValue + ",oldValue=" + oldValue);
			}
			if (newValue == oldValue) {
				return;
			}
			$scope.onSearch();
			$debounce(getSearchResult, 500);
		}, true);

		$rootScope.$on("cancelCourseEvent", function (event, data) {
			if (localStorage.debug) {
				console.log("event:" + event.name + ", data=" + data);
			}
			getAllCourse();
		});

		$scope.$on('$ionicView.beforeLeave', function () {
			if ($scope.classifyPopup) {
				$scope.classifyPopup.close();
				$scope.classifyPopup = null;
			}
		});
	}
	init();
})
//课程播放
.controller("HbbCourseController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory
	, getDataSource, showAlert, $ionicPopup, $ionicTabsDelegate, userHelp, $timeout, $interval, $sce, FilesService) {
    $scope.courseId = Base64.decode($stateParams.courseId);   //'72a32176-b5d4-4cb9-adcf-27106703aef2'
    $scope.videoId = Base64.decode($stateParams.videoId);    //'873c41fa751274984da1b58c52467ba5_8'
    $rootScope.showVideoBlock = true;

    //星星评价,默认三颗星
    $scope.starRateList = [
        { id : 1 , isActive: true }, 
        { id : 2 , isActive: true },
        { id : 3 , isActive: true },
        { id : 4 , isActive: false },
        { id : 5 , isActive: false }
    ];

    $scope.onStarClick = function (scitem,item) {
        var id = item.id;
        for (var i = 0 ; i < id; i++) {
        	scitem.starRateList[i].isActive = true;
        }
        for (var j = id ; j < scitem.starRateList.length; j++) {
        	scitem.starRateList[j].isActive = false;
        }
        scitem.rate = id;

        if (localStorage.debug) {
            console.log("$scope.starRateList" , $scope.starRateList);
        }
    }

    $scope.courseInfo = {};

    $scope.commentInfo = {};
    $scope.commentInfoList = [];
	var studentId = "";
	var accountId = "";
	if($rootScope.loginUser) {
		studentId = $rootScope.loginUser.studentId || "";
		accountId = $rootScope.loginUser.accountId || "";
	}
	//课程评价配置
	$scope.scoreConfig = [
		{
			itemid: 1,
			itemname: '观点正确',
			rate: 3,
			max: 5,
			isReadonly: false,
			starRateList:_.cloneDeep($scope.starRateList)
		},
		{
			itemid: 2,
			itemname: '联系实际',
			rate: 3,
			max: 5,
			isReadonly: false,
			starRateList: _.cloneDeep($scope.starRateList)
		},
		{
			itemid: 3,
			itemname: '内容丰富',
			rate: 3,
			max: 5,
			isReadonly: false,
			starRateList: _.cloneDeep($scope.starRateList)
		},
		{
			itemid: 4,
			itemname: '讲授认真',
			rate: 3,
			max: 5,
			isReadonly: false,
			starRateList: _.cloneDeep($scope.starRateList)
		},
		{
			itemid: 5,
			itemname: '互动充分',
			rate: 3,
			max: 5,
			isReadonly: false,
			starRateList: _.cloneDeep($scope.starRateList)
		}
	];
	$scope.submitAppraise = function () {
		var flag = true;
		$scope.sumbitDisabled = true;
		if ($scope.scoreConfig) {
			for (var i = 0; i < $scope.scoreConfig.length; i++) {
				if ($scope.scoreConfig[i].rate == undefined || $scope.scoreConfig[i].rate == null || $scope.scoreConfig[i].rate == 0) {
					flag = false;
					break;
				}
			}
		}
		if (flag) {
			//是否允许打0分
			var data = {
				accountid: $rootScope.user.accountId,
				classcourseid: "",
				studentid: $rootScope.user.studentId,
				coursewareid: $scope.courseId, //课程ID
				classid: $rootScope.user.classId,
				scoreList: $scope.scoreConfig,
				courseAppraiseContent: $scope.commentInfo.content
			};

			showAlert.showLoading(5000, "加载中...");
			Restangular.all("submitAppraise").post(data).then(function (data) {
				showAlert.hideLoading();
				$scope.sumbitDisabled = false;
				if (localStorage.debug) {
					console.log("评论data:", data);
				}
				if (data) {
					showAlert.showToast("评论成功");
					$scope.getComments("new");
				} else {
					showAlert.showToast("评论失败");
				}
			})["catch"](function (data) {
				console.error("评论请求出错", data);
				showAlert.hideLoading();
				showAlert.showToast("评论请求出错");
				$scope.sumbitDisabled = false;
			});
		}
		else {
			$scope.sumbitDisabled = false;
			showAlert.showToast("请评价所有项后再提交");
		}
	}

	//提交评论
	$scope.evaluation = function () {
		if ($scope.courseInfo.isplaycompletion != 1) {
			showAlert.showToast("请先学完课程再评价");
			return;
		}

		getDataSource.getDataSource('geAppraisetFlag', {
			coursewareid: $scope.courseId,
			accountid: $rootScope.user.accountId
		}, function (data) {
			//是否评价
			if (data[0].isappraise <= 0) {

				//提交评价
				$scope.sumbitDisabled = false;
				$scope.submitAppraise();

				//$scope.ratingStates = [
				//  { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
				//  { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
				//  { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
				//  { stateOn: 'glyphicon-heart' },
				//  { stateOff: 'glyphicon-off' }
				//];

				$scope.appraiseShow = !$scope.appraiseShow;
			}
			else {
				//$scope.isappraise[0].isappraise = 1;
				showAlert.showToast("已评价，不能重复评价");
				$scope.sumbitDisabled = false;
				return;
			}
		}, function (error) {
			$scope.sumbitDisabled = false;
		});


		//if ($scope.isAppraise > 0) {
		//	showAlert.showToast("您已评价过改课程");
		//	return;
		//}

	    //if ($scope.commentInfo.content == "" || $scope.commentInfo.content === undefined) {
	    //    showAlert.showToast("请输入评价内容");
	    //    return;
		//}

	    //var rate = getRate();
	    //for (var i = 0 ; i < $scope.scoreConfig.length; i++) {
	    //    $scope.scoreConfig[i].rate = rate;
	    //}

	    //var dataPost = {
	    //    accountid: accountId, //帐号ID
	    //    classcourseid: "", //可以为空
	    //    studentid: studentId, //学员ID
	    //    coursewareid: $scope.courseId, //课程ID
	    //    classid: "", //班级ID
	    //    scoreList: $scope.scoreConfig,//评价配置
	    //    courseAppraiseContent: ($scope.commentInfo.content || "")//评价内容
		//};
		//if (localStorage.debug) {
		//    console.log("评论参数:" , dataPost);
		//}

		   
	}


    var defaultStart = 1;
    var limit = 10;
    var commentStart = 1;
    $scope.commentListMoreDataCanBeLoaded = true;

    $scope.getComments = function (queryType) {
        if (queryType == 'new') {
            commentStart = defaultStart;
        }

        var searchparameter = {
			coursewareid: $scope.courseId,
			pageIndex: commentStart,
			pageSize: limit
        };

        if (localStorage.debug) {
		    console.log("评论列表参数:" , queryType, searchparameter);
		}
	    Restangular.all("getallcoursecomments").post(searchparameter).then(function (data) {
	        if (localStorage.debug) {
	            console.log("课程的评论列表", data);
	        }
	        if (data) {
	            if (data.result) {
	                //$scope.commentInfoList = data.list;
	                var datalist = data.list;
                    if (queryType == 'new') {
                        $scope.commentInfoList = datalist || [];
                    }
                    if (datalist && datalist.length > 0) {
                        if (datalist.length < limit) {
                            $scope.commentListMoreDataCanBeLoaded = false;
                        } else {
                            $scope.commentListMoreDataCanBeLoaded = true;
                        }

                        if (queryType == 'more') {
                            for (var i = 0; i < datalist.length; i++) {
                                $scope.commentInfoList.push(datalist[i]);
                            }
                        }
                        commentStart++;
                        //optionalCourseStart = optionalCourseStart + datalist.length;
                    } else {
                        $scope.commentListMoreDataCanBeLoaded = false;
                    }

	            } else {
                    $scope.commentListMoreDataCanBeLoaded = false;
                    showAlert.showToast("课程评论列表，加载失败");
	            }
	        } else {
                $scope.commentListMoreDataCanBeLoaded = false;
                showAlert.showToast("课程评论列表，加载失败");
	        }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
	    })["catch"](function (data) {
            $scope.commentListMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            console.error(data);
            showAlert.showToast("面授申请列表，请求出错");
        });
	}
	$scope.getComments("new");//预加载一页评论

    $scope.getUserImageUrl = function (image) {
        var imgurl = FilesService.showFile("userPhoto", image, image);
        return imgurl;
    }

    $scope.title = "";
    $scope.goBack = function () {
        $("#mainVideo").html("");//解决视频播放器，返回后仍漂浮显示的问题
        $ionicHistory.goBack();
    }
    //数字四舍五入（保留n位小数）
    $scope.formatNumber = function (number, n) {
        try{
            n = n ? parseInt(n) : 0; 
        }catch(e){
            console.log(e);
        }
        if (n <= 0) return Math.round(number); 
        number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); 
        return number; 
    }

    function getCourseInfo(courseId) {
    	//课程简介
    	var postData = { coursewareid: courseId };
    	getDataSource.getDataSource("getCourseInfo_SelectCourse", postData, function (data) {
    		if (localStorage.debug) {
    			console.log("课程简介", data);
    		}
    		if (data && data.length > 0) {
    			$scope.courseInfo = data[0];
    			$scope.title = $scope.courseInfo.coursewarename;
    			$scope.nowVideoDuration = $scope.courseInfo.realduration;
    			if ($scope.courseInfo.isplaycompletion == 1 && $scope.courseInfo.isappraise>0) {
    				$scope.appraiseShow = false;
    			} else {
    				$scope.appraiseShow = true;
    			}
    			if ($scope.courseInfo.comment) {
    				$scope.courseInfo.commentShow = $sce.trustAsHtml($scope.courseInfo.comment);
    			} else {
    				$scope.courseInfo.commentShow = "(暂无内容)";
    			}
    		}
    	}, function (error) {
    		console.log("error", error);
    	});
    }

    getCourseInfo($scope.courseId);

	// 触发一个按钮点击，或一些其他目标
    $scope.showPopup = function () {
    	$scope.data = {}

    	// 一个精心制作的自定义弹窗
    	var myPopup = $ionicPopup.show({
    		//template: '<input type="password" ng-model="data.wifi">',
    		templateUrl: "../templates/hbbpj.html",
    		title: '课程评价',
    		subTitle: '',
    		scope: $scope,
    		buttons: [
			  { text: '取消' },
			  {
			  	text: '<b>提交评价</b>',
			  	type: 'button-positive',
			  	onTap: function (e) {
			  		$scope.evaluation();

			  		//if (!$scope.data.wifi) {
			  		//	//不允许用户关闭，除非他键入wifi密码
			  		//	e.preventDefault();
			  		//} else {
			  		//	return $scope.data.wifi;
			  		//}
			  	}
			  },
    		]
    	});
    	myPopup.then(function (res) {
    		console.log('Tapped!', res);
    	});
    }

    $scope.appraiseCheck = function () {
    	getCourseInfo($scope.courseId);
    	$ionicTabsDelegate.select(1)
    	//弹出Popup
    	if ($scope.appraiseShow) {
    		if ($scope.courseInfo.isplaycompletion == 0) {
    			//课程还未学完
    			showAlert.showToast("请先学完课程再评价");
    			return;
    		}
    		$scope.showPopup();
    	}
    }
})
//视频课程播放
.controller("HbbVideoController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory
	, getDataSource, showAlert, $ionicPopup, userHelp, $timeout, $interval, $sce, FilesService) {
	var errorMessage = "系统检测到当前网络异常，请刷新页面重试。";

	//视频播放Begin========================================
	var player1 = {};
	//记录最大播放时间点，需从后台读取赋值
	//不是一次播放时，应该赋值成后台数据库记录的最大值
	//如果已经学完，可以赋值成99999
	$scope.maxPlayTime = 0;
	$scope.nowtime = 0;

	var forChangeTime = 0;
	var timer = {};
	$scope.currentPlayID = getDataSource.getGUID();
	var obj = {};
	var checkMaxTimeObj = {};
	var Interval = 30000;
	$scope.isAppraise = false;
	var moethodError = function (message, stack, method, filename, errorline, arguments) {
		try {
			var postdata = {
				filename: filename,
				methodname: method,
				errorline: errorline,
				message: message,
				msginfo: stack,
				arguments: arguments
			};

			$http.post("../api/WriteException", postdata).success(function (data) { });
		}
		catch (ex) { }
	}

	function getCourseInfo(courseId) {
		//取出该学员对于该视频的播放情况
		try {
			var keyArray = new Array();
			keyArray.push("selectStudentPlayDetailCount");
			keyArray.push("selectStudentPlayTime");
			keyArray.push("getStudytimeByCoursewareId");
			keyArray.push("geAppraisetFlag");
			getDataSource.getDataSource(keyArray
			, { coursewareid: $scope.courseId, studentid: $rootScope.user.studentId, currentID: $scope.currentPlayID, courseid: $scope.courseId }
			, function (data) {
				//console.log("data", data);
				var stuPlayTime = _.find(data, { name: "selectStudentPlayTime" }).data;
				var stuPlayDetailCount = _.find(data, { name: "selectStudentPlayDetailCount" }).data;
				var courwareStudytime = _.find(data, { name: "getStudytimeByCoursewareId" }).data;
				var isappraise = _.find(data, { name: "geAppraisetFlag" }).data;
				//是否评价
				if (isappraise[0].isappraise <= 0) {
					$scope.isAppraise = false;
				} else {
					$scope.isAppraise = true;
				}

				$scope.stuPlayDetailCount = stuPlayDetailCount[0].dtlcount;
				$scope.studytime = 0;
				if (stuPlayTime[0]) {
					$scope.lastPlayTime = stuPlayTime[0].timespan;
					$scope.studytime = stuPlayTime[0].studytime;
					$scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
				}
				if (courwareStudytime[0]) {
					$scope.courwarestudytime = courwareStudytime[0].studytime;
				}

				//课程简介
				var postData = { coursewareid: courseId };
				getDataSource.getDataSource("getCourseInfo_SelectCourse", postData, function (data) {
					if (localStorage.debug) {
						console.log("课程简介", data);
					}
					if (data && data.length > 0) {
						$scope.courseInfo = data[0];
						$scope.nowVideoDuration = $scope.courseInfo.realduration;

						if ($scope.courseInfo.comment) {
							$scope.courseInfo.commentShow = $sce.trustAsHtml($scope.courseInfo.comment);
						} else {
							$scope.courseInfo.commentShow = "(暂无内容)";
						}

						//获取sy_video_log主键
					    Restangular.all("getVideoLogPKey").post({ studentid: $rootScope.user.studentId, coursewareid: $scope.courseId, courwarestudytime: $scope.courwarestudytime }).then(function (data) {
							if (data.code) {
								var pkey = data.pkey;
								if (pkey.length > 0) {
									$scope.isGetPKey = true;
									$scope.pkey = pkey;
									if (!$scope.$$phase) {
										$scope.$apply();
									}
								}
							} else {
								//console.log("message", data.message);
							}
						})["catch"](function (data) {
							alert(errorMessage);
						});
						player1Obj = {
							'width': '100%',
							'height': '100%',
							'vid': $scope.videoId,
							'flashvars': {
								"autoplay": "false",
								"teaser_time": "0",
								"setScreen": "16_9",
								"history_video_duration": "10",
								"setVolumeM": "1",
								"ban_ui": "off",
								"ban_control": "off",
								"is_auto_replay": "off",
								"ban_skin_progress_dottween": "on",
								"ban_history_time": "on"
							}
						};

						//代表视频加载完毕后从第几秒开始播放
						//用来实现断点续播
						//如果没有看完需要限制拖动
						if ($scope.isplaycompletion != 1) {
							player1Obj.flashvars.watchStartTime = $scope.studytime;
							//最大播放时间也要放到和watchStartTime一样
							//不是一次播放时，应该赋值成后台数据库记录的最大值
							$scope.maxPlayTime = $scope.studytime;
							player1Obj.flashvars.ban_seek_by_limit_time = "on";
						} else {
							//如果已经学完，可以赋值成99999
							$scope.maxPlayTime = 9999999;
						}
						player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
					}
				}, function (error) {
					console.log("error", error);
				});

			}, function (error) {
				alert(errorMessage);
			});
		}
		catch (ex) {
			alert(errorMessage);
			moethodError(ex.message + "【错误码：001】", ex.stack, "loadVideo", "", 0);
		}
	}

	getCourseInfo($scope.courseId);

	var checkMaxTime = function () {
		$scope.nowtime = player1.j2s_getCurrentTime();
		//如果是未完成全部播放，则在此判断用户是否有拖动，如果拖动了，则跳回到前一次最大播放时间
		if ($scope.nowtime - $scope.maxPlayTime > 10) {
			player1.j2s_seekVideo($scope.maxPlayTime);
			return;
		}
		if ($scope.maxPlayTime <= $scope.nowtime) {
			$scope.maxPlayTime = $scope.nowtime;
		}
	}

	//视频播放
	s2j_onVideoPlay = function () {
		if (player1 != undefined && player1.j2s_resumeVideo != undefined) {

			clearInterval(obj);
			obj = setInterval(O_func, Interval);

			//播放未完成时，客户端每一秒记录1次位置，防止拖拽
			if ($scope.isplaycompletion != 1) {
				clearInterval(checkMaxTimeObj);
				checkMaxTimeObj = setInterval(checkMaxTime, 1000);
			}
			player1.j2s_resumeVideo();
		}
	}

	//视频拖动事件
	s2j_onVideoSeek = function (before, after) {
		if (after > $scope.maxPlayTime) {
			player1.j2s_seekVideo($scope.maxPlayTime);
		}
	}

	//暂停播放
	s2j_onVideoPause = function () {
		clearInterval(obj);
		if (player1 != undefined && player1.j2s_pauseVideo != undefined) {
			player1.j2s_pauseVideo();
		}
	}

	//视频初始化完成
	s2j_onPlayerInitOver = function (vid) {
		
		//日志参数
		var par = {
			studentid: $rootScope.user.studentId,
			coursewareid: $scope.courseId,
			accountid: $rootScope.user.accountId
		};
		console.log("初始化完成", forChangeTime);
		if (player1 != undefined) {
			var mess = "";
			if (player1 == undefined) { mess += " player1 is undefined, "; }
			if (player1.j2s_getCurrentTime == undefined) {
				mess += " player1.j2s_getCurrentTime is undefined, ";
			}
			else {
				mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
				console.log("mess", mess);
			}
			if (player1.j2s_realPlayVideoTime == undefined) {
				mess += " player1 j2s_realPlayVideoTime is undefined, ";
			}
			else {
				mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
			}

			moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. " + mess, "s2j_onPlayerInitOver", "", 0, par);
		}
		else {
			moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. player1 is undefined && player1.j2s_rightpanelBtnSet is undefined", "s2j_onPlayerInitOver", "", 0, par);
		}


		if ($scope.nowtime) {
			$timeout(function () {
				player1.j2s_seekVideo(forChangeTime);
			}, 1000);
		}
	}

	$scope.Msg = {};
	var O_func = function () {

		var postData = {
			pkey: $scope.pkey,
			studentid: $rootScope.user.studentId,
			time: 0,
			currentID: $scope.currentPlayID,
			timestamp: 0,
			videoDuration: $scope.nowVideoDuration,
			coursewareid: $scope.courseId,
			accountid: $rootScope.user.accountId,
			studytime: $scope.studytime,
			studetailcount: $scope.stuPlayDetailCount,
			courwarestudytime: $scope.courwarestudytime,
			coursewarename: $scope.courseInfo.name
		};
		$scope.Msg = postData;
		//todo j2s_realPlayVideoTime is undefined
		if (player1 != undefined && player1.j2s_getCurrentTime != undefined || player1.j2s_realPlayVideoTime != undefined) {
			var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间;
			//记录播放
			if ($scope.studytime <= 0) {
				$scope.studytime = $scope.studytime + Interval / 1000;
			}
			//console.log("postData", postData);
			postData.time = sec1;

			//todo j2s_realPlayVideoTime is undefined
			if (player1.j2s_realPlayVideoTime) {
				postData.timestamp = player1.j2s_realPlayVideoTime();
			} else {
				postData.timestamp = 0;
			}

			try {
				if ($scope.pkey && $scope.pkey.length > 0) {
					$http.post("../api/videoPlay", postData).success(function (data) {
						$scope.Msg = data;
						//console.log("videoPlay", data);
						if (data && !data.code) {
							moethodError("播放参数错误【错误码：002】", data.message, "O_func", "", 0, postData);
							videoError(errorMessage);
						}

						if (sec1) {
							$scope.studytime = sec1;
						}
						$scope.stuPlayDetailCount = 1;

					}).error(function (ex, status) {
						moethodError(ex + "【错误码：003】", ex, "O_func", "", 0, postData);
						if (status && status == 401)
							videoError("会话超时，请重新登陆。");
					});
				}
			}
			catch (ex) {
				moethodError(ex.message + "【错误码：004】", ex.stack, "O_func", "", 0, postData);
				videoError(errorMessage);
			}
		}
		else {
			var mess = "";
			if (player1 == undefined) mess += " player1 is undefined, ";
			if (player1.j2s_getCurrentTime == undefined)
				mess += " player1.j2s_getCurrentTime is undefined, ";
			else
				mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
			if (player1.j2s_realPlayVideoTime == undefined)
				mess += " player1 j2s_realPlayVideoTime is undefined, ";
			else
				mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
			moethodError(mess + "【错误码：005】", "", "O_func", "", 0, postData);
			videoError(errorMessage);
		}
	}

	//视频暂停
	//$scope.pause = function () {
	//	alert(2);
	//	player1.j2s_pauseVideo();
	//	clearInterval(obj);
	//}

	//视频播放
	//$scope.play = function () {
	//	alert(1);
	//	player1.j2s_resumeVideo();
	//	clearInterval(obj);
	//	obj = setInterval(O_func, Interval);
	//}

	var videoError = function (showmessage) {
		clearInterval(obj);
		s2j_onVideoPause();
		alert(showmessage);
		//location.reload(true);
	}
	//视频播放End========================================
})

.controller("HbbPptplayController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory
	, getDataSource, showAlert, $ionicPopup, userHelp, $timeout, $interval, $sce, FilesService) {
	$scope.courseId = Base64.decode($stateParams.courseId);   //'72a32176-b5d4-4cb9-adcf-27106703aef2'
	$scope.videoId = Base64.decode($stateParams.videoId);    //'873c41fa751274984da1b58c52467ba5_8'

	//视频播放开始
	$scope.pageindex = 1;
	$scope.enableGoUppage = false;
	$scope.enableGoDownpage = false;
	$scope.currentPlayID = getDataSource.getGUID();

	var keyArray = new Array();
	keyArray.push("selectStudentPlayDetailCount");
	keyArray.push("selectStudentPlayTime");
	keyArray.push("getStudytimeByCoursewareId");

	getDataSource.getDataSource(keyArray
		, { coursewareid: $scope.courseId, studentid: $rootScope.user.studentId, currentID: $scope.currentPlayID, courseid: $scope.courseId }
		, function (data) {
			//console.log("data", data);
			var stuPlayTime = _.find(data, { name: "selectStudentPlayTime" }).data;
			var stuPlayDetailCount = _.find(data, { name: "selectStudentPlayDetailCount" }).data;
			var courwareStudytime = _.find(data, { name: "getStudytimeByCoursewareId" }).data;

			$scope.stuPlayDetailCount = stuPlayDetailCount[0].dtlcount;
			$scope.studytime = 0;
			if (stuPlayTime[0]) {
				$scope.lastPlayTime = stuPlayTime[0].timespan;
				$scope.studytime = stuPlayTime[0].studytime;
				$scope.pageindex = $scope.studytime;
				if ($scope.pageindex == 0)
				{
				    $scope.pageindex = 1;
				}
				$scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
			}
			if (courwareStudytime[0]) {
				$scope.courwarestudytime = courwareStudytime[0].studytime;
			}

			//Restangular.all("selectCoursewareById").post({ id: $scope.courseId }).then(function (data) {
			getDataSource.getDataSource("selectCoursewareById", { id: $scope.courseId }, function (data) {
				$scope.course = data[0];
				$scope.nowVideoDuration = $scope.course.realduration;
				$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
				$scope.enableGoUppage = false;
				$scope.enableGoDownpage = false;
				$scope.goDownpageText = "下一页";

				//获取sy_video_log主键
				Restangular.all("getVideoLogPKey").post({ studentid: $rootScope.user.studentId, coursewareid: $scope.courseId, courwarestudytime: $scope.courwarestudytime }).then(function (data) {
				//getDataSource.getUrlData("../api/getVideoLogPKey",{ studentid: $rootScope.user.studentId, coursewareid: $scope.courseId }, function (data) {
						if (data.code) {
							var pkey = data.pkey;
							if (pkey.length > 0) {
								$scope.isGetPKey = true;
								$scope.pkey = pkey;
								if (!$scope.$$phase) {
									$scope.$apply();
								}
							}
						}
					}, function (error) {
						alert(errorMessage);
					});
			});
		}, function (error) {
			alert(errorMessage);
		});

	$scope.gouppage = function () {
		showAlert.showLoading(5000, "加载中...");
		$scope.pageindex--;
		if ($scope.pageindex < 1) {
			$scope.pageindex = 1;
			$scope.enableGoUppage = true;
			$scope.enableGoDownpage = false;
		}
		$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
	}

	var waiteSenconds = 5;
	var intervalFunc = function () {
		$scope.$apply(function () {
			$scope.goDownpageText = "等待" + waiteSenconds-- + "s";
		});
		if (waiteSenconds < 0) {
			clearInterval(intervalObj);
			waiteSenconds = 5;
			$scope.$apply(function () {
				$scope.enableGoDownpage = false;
				$scope.goDownpageText = "下一页";
			});
		} else {
			$scope.enableGoUppage = true;
		}
	};
	var intervalObj = {};


	$scope.godownpage = function () {
		showAlert.showLoading(5000, "加载中...");
		if ($scope.enableGoDownpage) {
			return;
		}
		$scope.pageindex++;
		if ($scope.pageindex >= parseInt($scope.course.realduration)) {
			$scope.pageindex = parseInt($scope.course.realduration);
			$scope.enableGoDownpage = true;
		} else {
			$scope.enableGoDownpage = false;
		}

		//第一次未学习完成，则点击下一页，需要等待5s
		//如果没有看完需要限制拖动
		if ($scope.isplaycompletion != 1) {
			if (!$scope.enableGoDownpage) {
				$scope.enableGoDownpage = true;
				clearInterval(intervalObj);
				intervalObj = setInterval(intervalFunc, 1000);
			}
		}
		$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
		O_func();
	}

	$scope.pptimgfileobj = {};

	$scope.loadPPTCoursewareImg = function (pageindex, pptcoursefile_servername) {
		Restangular.all("getPPTVideoCourse").post({ pageindex: pageindex, pptcoursefile_servername: pptcoursefile_servername }).then(function (data) {
			//getDataSource.getUrlData("../api/getPPTVideoCourse", { pageindex: pageindex, pptcoursefile_servername: pptcoursefile_servername }, function (data) {
			showAlert.hideLoading();
			$scope.pptimgfileobj = data;
		}, function (error) {

		});
	}

	//提交数据
	var O_func = function () {
		var postData = {
			pkey: $scope.pkey,
			studentid: $rootScope.user.studentId,
			time: $scope.pageindex,
			currentID: $scope.currentPlayID,
			timestamp: $scope.pageindex,
			videoDuration: $scope.nowVideoDuration,
			coursewareid: $scope.courseId,
			videotype: $scope.course.videotype,
			accountid: $rootScope.user.accountId,
			studytime: $scope.studytime,
			studetailcount: $scope.stuPlayDetailCount,
			courwarestudytime: $scope.courwarestudytime,
			coursewarename: $scope.course.name
		};
		//console.log("postData", postData);
		//return;
		if ($scope.pkey && $scope.pkey.length > 0) {
			$http.post("../api/videoPlay", postData).success(function (data) {
				if (data && !data.code) {
					//videoError(errorMessage);
				}
				$scope.studytime = $scope.pageindex;
				$scope.stuPlayDetailCount = 1;
			}).error(function (ex, status) {
			});
		}
	}
})
//课程查看
.controller("HbbCourseViewController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $timeout, $interval, $sce , FilesService) {
    $scope.courseId = Base64.decode($stateParams.courseId);   //'72a32176-b5d4-4cb9-adcf-27106703aef2'
    $scope.videoId = Base64.decode($stateParams.videoId);    //'873c41fa751274984da1b58c52467ba5_8'


    $rootScope.showVideoBlock = true;
    $scope.courseInfo = {};
    $scope.commentInfo = {};
    $scope.commentInfoList = [];
    $scope.teacherList = [];
	var studentId = "";
	var accountId = "";
	if($rootScope.loginUser) {
		studentId = $rootScope.loginUser.studentId || "";
		accountId = $rootScope.loginUser.accountId || "";
	}

    var defaultStart = 1;
    var limit = 10;
    var commentStart = 1;
    $scope.commentListMoreDataCanBeLoaded = true;

    $scope.getComments = function (queryType) {
        if (queryType == 'new') {
            commentStart = defaultStart;
        }

        var searchparameter = {
			coursewareid: $scope.courseId,
			pageIndex: commentStart,
			pageSize: limit
        };

        if (localStorage.debug) {
		    console.log("评论列表参数:" , queryType, searchparameter);
		}
	    Restangular.all("getallcoursecomments").post(searchparameter).then(function (data) {
	        if (localStorage.debug) {
	            console.log("课程的评论列表", data);
	        }
	        if (data) {
	            if (data.result) {
	                //$scope.commentInfoList = data.list;
	                var datalist = data.list;
                    if (queryType == 'new') {
                        $scope.commentInfoList = datalist || [];
                    }
                    if (datalist && datalist.length > 0) {
                        if (datalist.length < limit) {
                            $scope.commentListMoreDataCanBeLoaded = false;
                        } else {
                            $scope.commentListMoreDataCanBeLoaded = true;
                        }

                        if (queryType == 'more') {
                            for (var i = 0; i < datalist.length; i++) {
                                $scope.commentInfoList.push(datalist[i]);
                            }
                        }
                        commentStart++;
                        //optionalCourseStart = optionalCourseStart + datalist.length;
                    } else {
                        $scope.commentListMoreDataCanBeLoaded = false;
                    }

	            } else {
                    $scope.commentListMoreDataCanBeLoaded = false;
                    showAlert.showToast("课程评论列表，加载失败");
	            }
	        } else {
                $scope.commentListMoreDataCanBeLoaded = false;
                showAlert.showToast("课程评论列表，加载失败");
	        }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
	    })["catch"](function (data) {
            $scope.commentListMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            console.error(data);
            showAlert.showToast("面授申请列表，请求出错");
        });
	}
	$scope.getComments("new");//预加载一页评论

    $scope.getUserImageUrl = function (image) {
        var imgurl = FilesService.showFile("userPhoto", image, image);
        return imgurl;
    }

    $scope.title = "视频";
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }

    //数字四舍五入（保留n位小数）
    $scope.formatNumber = function (number, n) {
        try{
            n = n ? parseInt(n) : 0; 
        }catch(e){
            console.log(e);
        }
        if (n <= 0) return Math.round(number); 
        number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); 
        return number; 
    }

    function getCourseInfo(courseId) {
        //课程简介
        var postData = {
            coursewareid: courseId,
            studentid: studentId,//学员ID
			studentid2: studentId,
			pageIndex: 1,
			pageSize: 5,
			isMore: false
        };
        getDataSource.getDataSource(["getCourseInfo_SelectCourse", "getCoursewareTeachers"], postData, function (data) {
            if (localStorage.debug) {
                console.log("课程简介", data);
            }
            var courseData = _.find(data, { name: "getCourseInfo_SelectCourse" }).data;//课程信息
            var teacherData = _.find(data, { name: "getCoursewareTeachers" }).data;//教师信息
            
            if (courseData && courseData.length > 0) {
                $scope.courseInfo = courseData[0];
                
                if ($scope.courseInfo.comment) {
                    $scope.courseInfo.commentShow = $sce.trustAsHtml($scope.courseInfo.comment);
                } else {
                    $scope.courseInfo.commentShow = "(暂无内容)";
                }
            }

            console.log("teacherData=", teacherData);
            if (teacherData) {
                $scope.teacherList = teacherData;
            }
        }, function (error) {
            console.log("error", error);
        });
    }

    getCourseInfo($scope.courseId);

    $scope.getImageUrl = function (image) {
        var imgurl = FilesService.showFile("coursewarePhoto", image, image);
        return imgurl;
    }

    $scope.chooseCourse = function () {
    	var postData = { coursewareid: $scope.courseId,status:"0" };

    	// 选课
    	showAlert.showLoading(5000, "加载中...");
    	Restangular.all("addcoursewareuser").post(postData).then(function (data) {
    		if (localStorage.debug) {
    			console.log("选课按钮操作", data);
    		}
    		showAlert.hideLoading();
    		if (data.result) {
    			$scope.courseInfo.iselectivechoose = 1; //已选择。
    			showAlert.showToast("操作成功");
    			//$scope.$emit("chooseCourseEvent", item);
    		}
    	})["catch"](function (data) {
    		showAlert.hideLoading();
    		console.error("选课操作", data);
    	});

    	if (localStorage.debug) {
    		console.log("选课");
    	}
    	//$event.stopPropagation();
    }

    $scope.goCourseDetail = function () {
    	var vid = Base64.encode($scope.courseInfo.teachervideo);
    	var coursewareid = Base64.encode($scope.courseInfo.coursewareid);
    	$state.go("HbbCourse", { videoId: vid, courseId: coursewareid });
    }
})
//学档
.controller("HbbFileMainRecordController", function ($rootScope, $filter,$scope, $stateParams, Restangular, $location, $state,$ionicModal, $ionicPopover, $http, cordovaService,
	$ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $ionicTabsDelegate) {
	$scope.yearList = [];
	//年份
	var curDate = new Date();
	var year = curDate.getFullYear();
	for (var y = 2012; y < year + 5; y++) {
		$scope.yearList.push({ showvalue: y, datavalue: y });
	};



	//localStorage.mainRecordTabIndex = 0;
	//$scope.pagefilter.type = 0;

	$scope.info = {};
	$scope.info.year = "" + year;
	$scope.total = {
		totalstutytime: 0,//总学时
		totaltime: 0,//总时长
		totaltimecn: "",//总时长
		isshow: false
	};

	$scope.datalist = [];
	$scope.getArchives = function () {
		var startyear = $scope.info.year;
		var endyear = $scope.info.year-4;
		getDataSource.getDataSource("getarchives", { startyear: startyear ,endyear:endyear}, function (data) {
			if (data && data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					data[i].expand = false;
					data[i].src = "../img/student_file/arrow01.png";
					data[i].keywordsArr = data[i].keywords.split(",");
					data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);

					$scope.total.totalstutytime += data[i].total_studytime;
					$scope.total.totaltime += parseInt(data[i].total_time);
				}
				$scope.total.isshow = true;
				$scope.total.totaltimecn = (parseInt($scope.total.totaltime) / 3600).toFixed(1);

				data[0].expand = true;
				data[0].src = "../img/student_file/arrow02.png";
				$scope.datalistarchives = data;
			}
		}, function (error) { });
	}

	$scope.onExpand = function (n) {
		n.expand = !n.expand;
		n.src = n.expand == false ? "../img/student_file/arrow01.png" : "../img/student_file/arrow02.png";
	}


	$scope.calcData = function () {
		var p = {};
		p.departmentid = $rootScope.user.departmentId;
		p.studentid = $rootScope.user.studentId;
		p.accountid = $rootScope.user.accountId;
		p.rank = $rootScope.user.yearplan.rank;
		Restangular.all("gettotal").post(p).then(function (data) {
		//getDataSource.getUrlData("../api/gettotal", p, function (data) {
			//$rootScope.loadingOptions.isOpened = false;
			if (data.result) {
				$scope.getArchives();
			}
		}, function (errortemp) { });
	}

	$scope.calcData();
	
	$scope.goToTabIndex = function (option,tempyear) {
		//$state.go("HbbMain.mainrecord");
		var index = 0;
		if (option == 'train') {
			index = 3;
		} else if (option == 'syclass') {
			index = 2;
		}
		else if (option == 'choosemyself') {
			index = 1;
		}
		$scope.searchfilter.year = tempyear;
		$scope.info.year = tempyear;
		$scope.onTabClick(index);
	}


	$scope.searchfilter = { year: year, totalscore: 0 };

	$scope.pagefilter = {
		maxSize: 6,
		totalItems: 0,
		pageSize: 10,
		currentPage: 1,
		type: 0,
		reset: function () {
			this.maxSize = 6;
			this.totalItems = 0;
			this.pageSize = 1000;
			this.currentPage = 1;
			$scope.datalist = [];
		}
	};



	$scope.onTabClick = function (index) {
		localStorage.mainRecordTabIndex = index;
		$scope.pagefilter.type = index;

		$ionicTabsDelegate.$getByHandle('mainrecord-tab-handle').select(index);

		if (index == 0) {
			$scope.getArchives();
		} else {
			$scope.inittrain();
		}
		if (localStorage.debug) {
			console.log("onTabClick index=", index);
			console.log("$ionicTabsDelegate", $ionicTabsDelegate);
		}
	}

	$scope.inittrain = function () {
		var parameter = _.merge({}, $scope.searchfilter, $scope.pagefilter);
		Restangular.all("gettrain").post(parameter).then(function (data) {
			//getDataSource.getUrlData("../api/gettrain", parameter, function (data) {
			if (data.result) {
				$scope.datalist = data.items;
				$scope.pagefilter.totalItems = data.rows.totalItems;
				$scope.searchfilter.totalscore = data.rows.totalscore;
			}
		});
	}

	//if ($stateParams.tabindex != "0" && $stateParams.tabindex != "") {
	//	$scope.pagefilter.type = $stateParams.tabindex;
	//	$scope.onTabClick($stateParams.tabindex);
	//}
	

    var defaultStart = 1;
    var limit = 10;
    $scope.studytimeTrain = 0; //面授统计学时
    $scope.delelteTrainId = "";

	//面授申请详情获取
    function getTainingDetail(id) {
    	if (localStorage.debug) {
    		console.log("面授申请详情,id=", id);
    	}
    	$scope.delelteTrainId = id;
    	showAlert.showLoading(5000, "加载中...");
    	getDataSource.getDataSource("gettrain", { id: id }, function (data) {
    		showAlert.hideLoading();
    		if (localStorage.debug) {
    			console.log("面授申请详情,data=", data);
    		}
    		if (data && data.length > 0) {
    			var dt = data[0];
    			$scope.info = dt;

    			var typeList = [];
    			if (dt.categoryone) {
    				typeList.push(dt.categoryone);
    			}
    			if (dt.categorytwo) {
    				typeList.push(dt.categorytwo);
    			}
    			if (dt.categorythree) {
    				typeList.push(dt.categorythree);
    			}
    			if (dt.categoryfour) {
    				typeList.push(dt.categoryfour);
    			}
    			$scope.info.type = typeList.join("、") || "";
    		} else {
    			showAlert.showToast("面授申请详情，加载失败");
    		}
    	}, function (error) {
    		showAlert.hideLoading();
    		console.log("面授申请详情，加载出错", error);
    		showAlert.showToast("面授申请详情，加载出错");
    	});
    }

    $scope.goTainingDetail = function (item) {
        if (localStorage.debug) {
            console.log("面授详情，跳转参数item=" , item);
        }
        getTainingDetail(item.id)
    }

    function getStudytimeTrain() {
        var param = { year: $scope.info.year };
        if (localStorage.debug) {
            console.log("面授统计学时，参数:" , param);
        }
        //获取面授统计学时
        getDataSource.getDataSource("getSumStudytimeTrain",param , function (data) {
            if (localStorage.debug) {
                console.log("面授统计学时", data);
            }
            if (data && data.length > 0) {
                var dt = data[0];
                $scope.studytimeTrain = dt.studytime || 0;
            }
        }, function (error) {
            console.error("面授统计学时", error);
        });
    }




    var tainingStart = 1;
    $scope.tainingListItems = [];//面授申请
    $scope.tainingMoreDataCanBeLoaded = true;

    $scope.onYearSelect = function () {
    	console.log("year = ", $scope.info.year);
    	$scope.pagefilter.type = localStorage.mainRecordTabIndex;
    	$scope.searchfilter.year = $scope.info.year;

    	if ($scope.pagefilter.type == 0) {
    		$scope.getArchives();
    	} else {
    		$scope.inittrain();
    	}

    	//$scope.inittrain();
        //$scope.initTraining("new");
        //getStudytimeTrain();
    }

    $scope.showRankPopup = function () {
    	$scope.rankPopupHandle = $ionicPopup.show({
    		template: getPopupTemplate(),
    		title: '请选择年份',
    		scope: $scope,
    		buttons: [
			  { text: '取消' },
			  {
			  	text: '<b>选择</b>',
			  	type: 'button-positive',
			  	onTap: function () {
			  		for (var i = 0; i < $scope.yearList.length; i++) {
			  			if ($scope.yearList[i].checked == true) {
			  				$scope.info.year = $scope.yearList[i].showvalue;
			  				$scope.onYearSelect();
			  				break;
			  			}
			  		}
			  	}
			  },
    		]
    	});
    };

    function selectCategory(item) {
    	for (var i = 0; i < item.data.length; i++) {
    		if (item.data[i].checked == true) {
    			item.change(item.data[i].showvalue);
    			break;
    		}
    	}
    }

    $scope.showFormRankPopup = function (index) {
    	var item = dropdownModel[index];
    	$scope.rankPopupHandle = $ionicPopup.show({
    		template: getFormPopupTemplate(item.dataname, item.objname, index),
    		title: '请选择' + item.title,
    		scope: $scope,
    		buttons: [
			  { text: '取消' },
			  {
			  	text: '<b>选择</b>',
			  	type: 'button-positive',
			  	onTap: function () {
			  		selectCategory(item);
			  	}
			  },
    		]
    	});
    };

    function getPopupTemplate() {
    	var resultTemp = "<div class='list'>";
    	resultTemp += '<label class="item item-radio"  ng-repeat="item in yearList" ng-click="onRankListItemClick($index)">' +
						'<input type="radio" name="rankGroup"  value="{{item.showvalue}}" >' +
							'<div class="item-content"> {{item.showvalue}} </div>' +
						'<i class="radio-icon ion-checkmark" style="visibility:visible;" ng-if="item.showvalue == info.year"></i>' +
                        '<i class="radio-icon ion-checkmark" ng-if="item.showvalue != info.year"></i>' +
						'</label>';
    	resultTemp += "</div>";
    	return resultTemp;
    }

    function getFormPopupTemplate(dataname, objname, c) {
    	var resultTemp = "<div class='list'>";
    	resultTemp += '<label class="item item-radio"  ng-repeat="item in ' + dataname + '" ng-click="onRankFormListItemClick($index,' + c + ')">' +
						'<input type="radio" name="rankGroup"  value="{{item.showvalue}}" >' +
							'<div class="item-content"> {{item.showvalue}} </div>' +
						'<i class="radio-icon ion-checkmark" style="visibility:visible;" ng-if="item.showvalue == ' + objname + '"></i>' +
                        '<i class="radio-icon ion-checkmark" ng-if="item.showvalue != ' + objname + '"></i>' +
						'</label>';
    	resultTemp += "</div>";
    	return resultTemp;
    }

	//新增
    $scope.train = {
    	title: "",//培训名称
    	categoryone: "",//组织调训，干部选学
    	categorytwo: "", //业务培训,岗位培训,任职培训,初任培训
    	categorythree: "",//面授培训,网络培训
    	categoryfour: "", //境内培训，境外培训
    	starttime: "",//开始时间
    	endtime: "",//结束时间
    	studytime: "",//学习时间
    	year: year,//年份
    	address: "",//地址
    	company: "",//主办单位
    	reference: "",//证明人
    	status: 1,//状态，0保存，1提交
    	remark: ""//备注
    };
    $scope.categoryoneList = [
        { showvalue: "组织调训", datavalue: "组织调训" },
        { showvalue: "干部选学", datavalue: "干部选学" }
    ];
    $scope.categorytwoList = [
        { showvalue: "业务培训", datavalue: "业务培训" },
        { showvalue: "岗位培训", datavalue: "岗位培训" },
        { showvalue: "任职培训", datavalue: "任职培训" },
        { showvalue: "初任培训", datavalue: "初任培训" }
    ];
    $scope.categorythreeList = [
        { showvalue: "面授培训", datavalue: "面授培训" },
        { showvalue: "网络培训", datavalue: "网络培训" }
    ];
    $scope.categoryfourList = [
        { showvalue: "境内培训", datavalue: "境内培训" },
        { showvalue: "境外培训", datavalue: "境外培训" }
    ];

    $scope.train.categoryone = "组织调训";
    $scope.train.categorytwo = "业务培训";
    $scope.train.categorythree = "面授培训";
    $scope.train.categoryfour = "境内培训";

    var dropdownModel = [
        {
        	title: '培训类型1',
        	data: $scope.categoryoneList,
        	dataname: 'categoryoneList',
        	objname: 'train.categoryone',
        	change: function (value) {
        		$scope.train.categoryone = value;
        	}
        },
        {
        	title: '培训类型2',
        	data: $scope.categorytwoList,
        	dataname: 'categorytwoList',
        	objname: 'train.categorytwo',
        	change: function (value) {
        		$scope.train.categorytwo = value;
        	}
        },
        {
        	title: '培训类型3',
        	data: $scope.categorythreeList,
        	dataname: 'categorythreeList',
        	objname: 'train.categorythreeList',
        	change: function (value) {
        		$scope.train.categorythreeList = value;
        	}
        },
        {
        	title: '培训类型4',
        	data: $scope.categoryfourList,
        	dataname: 'categoryfourList',
        	objname: 'train.categoryfour',
        	change: function (value) {
        		$scope.train.categoryfour = value;
        	}
        },
        {
        	title: '申报年份',
        	data: $scope.yearList,
        	dataname: 'yearList',
        	objname: 'train.year',
        	change: function (value) {
        		$scope.train.year = value;
        	}
        }
    ];

    $scope.applyCourse = function () {
    	if (!$scope.train.title) {
    		showAlert.showToast("培训名称不能为空");
    		return;
    	}
    	if (!$scope.train.starttime) {
    		showAlert.showToast("开始时间不能为空");
    		return;
    	}
    	if (!$scope.train.endtime) {
    		showAlert.showToast("结束时间不能为空");
    		return;
    	}

    	if (new Date($scope.train.starttime) > new Date($scope.train.endtime)) {
    		showAlert.showToast("开始时间不能大于结束时间");
    		return;
    	}

    	if (!$scope.train.year) {
    		showAlert.showToast("年份不能为空");
    		return;
    	}
    	if ($scope.train.studytime === "") {
    		showAlert.showToast("学时不能为空");
    		return;
    	}

    	var data = {};
    	angular.extend(data, $scope.train);
    	data.starttime = $filter('date')($scope.train.starttime, "yyyy-MM-dd");
    	data.endtime = $filter('date')($scope.train.endtime, "yyyy-MM-dd");

    	if (localStorage.debug) {
    		console.log("面授申请参数=", data);
    	}

    	showAlert.showLoading(5000, "加载中...");
    	//面授申请保存
    	Restangular.all("addtrain").post(data).then(function (data) {
    		showAlert.hideLoading();
    		if (localStorage.debug) {
    			console.log("面授申请保存", data);
    		}
    		var msg = "";
    		if (data) {
    			if (data.result) {
    				var trainid = data.trainid;
    			}
    			msg = data.message || "面授申请保存失败";
    		} else {
    			msg = "面授申请保存失败";
    		}
    		showAlert.showToast(msg);
    		//进行刷新父页面
    		$scope.onTabClick(3);
    		$scope.closeCreatePopover();
    	})["catch"](function (data) {
    		showAlert.hideLoading();
    		console.log(data);
    		showAlert.showToast("面授申请,保存出错");
    	});
    }

    $scope.onRankFormListItemClick = function (index, c) {

    	var item = dropdownModel[c];
    	for (var i = 0; i < item.data.length; i++) {
    		if (index != i) {
    			item.data[i].checked = false;
    		}
    	}
    	item.data[index].checked = true;
    	item.change(item.data[index].showvalue);
    }

    $scope.onRankListItemClick = function (index) {
    	for (var i = 0; i < $scope.yearList.length; i++) {
    		if (index != i) {
    			$scope.yearList[i].checked = false;
    		}
    	}
    	$scope.yearList[index].checked = true;
    	$scope.info.year = $scope.yearList[index].showvalue;
    }


	// .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('../templates/hbbtrain.html', {
    	scope: $scope
    }).then(function (popover) {
    	$scope.popover = popover;
    });

	// .fromTemplateUrl() method
	$ionicModal.fromTemplateUrl('../templates/HbbTrainCreate.html', {
    	scope: $scope
    }).then(function (popover) {
    	$scope.popoverCreate = popover;
    });

    $scope.openPopoverCreate = function () {
    	$scope.popoverCreate.show();
    };

    $scope.openPopover = function (item) {
    	$scope.goTainingDetail(item);
    	$scope.popover.show();
    };
    
    $scope.closeCreatePopover = function () {
    	$scope.popoverCreate.hide();
    };

    $scope.closePopover = function () {
    	$scope.popover.hide();
    };
	//Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
    	$scope.popover.remove();
    	$scope.popoverCreate.remove();
    });
	// Execute action on hidden popover
    $scope.$on('popover.hidden', function () {
    	// Execute action
    });
	// Execute action on remove popover
    $scope.$on('popover.removed', function () {
    	// Execute action
    });

    $scope.confirmDeleteTrainPopup = null;
    $scope.confirmDeleteTrain = function () {
    	$scope.confirmDeleteTrainPopup = $ionicPopup.confirm({
    		title: '提示',
    		template: '确定删除?',
    		okText: '确定',
    		cancelText: '取消',
    	});

    	$scope.confirmDeleteTrainPopup.then(function (res) {
    		if (res) {
    			deleteTaining();
    		} else {
    			console.log('You are not sure');
    		}
    	});
    }

	//面授申请删除
    function deleteTaining() {
    	showAlert.showLoading(5000, "加载中...");
    	getDataSource.getDataSource("deletetrain", { id: $scope.delelteTrainId }, function (data) {
    		showAlert.hideLoading();
    		if (localStorage.debug) {
    			console.log("面授申请删除,data=", data);
    		}
    		if (data && data.length > 0) {
    			var dt = data[0];
    			if (dt.crow > 0) {
    				showAlert.showToast("面授申请删除成功");
    				$scope.closePopover();
    				$scope.onTabClick(3);
    				//$state.go("HbbMain.mainrecord", { tabindex: 3 });
    			} else {
    				showAlert.showToast("面授申请删除失败");
    			}
    		} else {
    			showAlert.showToast("面授申请删除失败");
    		}
    	}, function (error) {
    		showAlert.hideLoading();
    		console.log("面授申请删除出错", error);
    		showAlert.showToast("面授申请删除出错");
    	});
    }


    //面授申请列表 状态,0 未提交 1 已提交 2 审核通过 -1 驳回
    //$scope.initTraining = function (queryType) {
    //    if (queryType == 'new') {
    //        tainingStart = defaultStart;
    //    }

	//	var pagefilter = {
	//		year: $scope.info.year,
	//		maxSize: 100,
	//		totalItems: 0,
	//		pageSize: limit,
	//		currentPage: tainingStart
	//	};
    //    if(localStorage.debug){
    //    	console.log("面授申请列表参数:", pagefilter);
	//    }
	//	Restangular.all("gettrain").post(pagefilter).then(function (data) {
	//	    if (localStorage.debug) {
    //            console.log("面授申请列表,data=", data);
    //        }

    //        if (data && data.result) {
    //            var datalist = data.items;
    //            for (var i = 0 ; datalist && i < datalist.length; i++){
    //                var dt = datalist[i];
    //                switch(dt.status){
    //                    case 0:
    //                        dt.statusShow = "未提交";
    //                        break;
    //                    case 1:
    //                        dt.statusShow = "已提交";
    //                        break;
    //                    case 2:
    //                        dt.statusShow = "审核通过";
    //                        break;
    //                    case -1:
    //                        dt.statusShow = "驳回";
    //                        break;
    //                    default:
    //                        dt.statusShow = "未知状态";
    //                }
    //            }

    //            if (localStorage.debug) {
    //                console.log("面授申请列表,datalist=", datalist);
    //            }

    //            if (queryType == 'new') {
    //                $scope.tainingListItems = datalist || [];
    //            }
    //            if (datalist && datalist.length > 0) {
    //                if (datalist.length < limit) {
    //                    $scope.tainingMoreDataCanBeLoaded = false;
    //                } else {
    //                    $scope.tainingMoreDataCanBeLoaded = true;
    //                }

    //                if (queryType == 'more') {
    //                    for (var i = 0; i < datalist.length; i++) {
    //                        $scope.tainingListItems.push(datalist[i]);
    //                    }
    //                }
    //                tainingStart++;
    //            } else {
    //                $scope.tainingMoreDataCanBeLoaded = false;
    //            }
    //        } else {
    //            $scope.tainingMoreDataCanBeLoaded = false;
    //            if (localStorage.debug) {
    //                console.log("面授申请列表,失败", data);
    //            }
    //            if (data) {
    //                showAlert.showToast(data.message);
    //            } else {
    //                showAlert.showToast("面授申请列表获取失败");
    //            }
    //        }
    //        if (queryType == 'more') {
    //            $scope.$broadcast('scroll.infiniteScrollComplete');
    //        } else {
    //            $scope.$broadcast('scroll.refreshComplete');
    //        }
	//	})["catch"](function (data) {
    //        $scope.tainingMoreDataCanBeLoaded = false;
    //        if (queryType = 'more') {
    //            $scope.$broadcast('scroll.infiniteScrollComplete');
    //        } else {
    //            $scope.$broadcast('scroll.refreshComplete');
    //        }
    //        console.error(data);
    //        showAlert.showToast("面授申请列表，请求出错");
    //    });
    //}


    //function init() {
    //    getStudytimeTrain();
    //}

    //init();
})
//设置
.controller("HbbSettingCoursesController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
    $scope.goUpdatePassword = function () {
        if (localStorage.debug) {
            console.log("cellphone", $rootScope.cellphone);
        }
        $state.go("HbbUpdatepassword", {cellphone : Base64.encode($rootScope.cellphone)})
    }


    $scope.goChangePhone = function (phone) {
       $state.go("HbbChangePhone")
    }

    $scope.about = function () {
		$state.go("HbbAbout");
    }

    $scope.info = function () {
        $state.go("HbbInfo");
    }
})
//修改密码
.controller("HbbUpdatepasswordController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
    var cellphone = Base64.decode($stateParams.cellphone);
    $scope.info = {};
    $scope.info.password = "";
    $scope.info.passwordConfirm = "";
    $scope.goBack = function () {
		$ionicHistory.goBack();
    }

    //重置密码
    $scope.resetPassword = function () {
    	if (!$scope.info.password) {
    		showAlert.showToast("新密码不能为空");
    		return;
    	}
    	var boolPwd=/^[0-9 | A-Z | a-z|*]{8,16}$/.test($scope.info.password);
    	if (!boolPwd) {
    		showAlert.showToast("新密码格式不正确");
    		return;
    	}

    	if (!$scope.info.passwordConfirm) {
    		showAlert.showToast("确认密码不能为空");
    		return;
    	}
		var parameter = {
		    cellphone: cellphone,
		    password1: Base64.encode($scope.info.password),
		    password2: Base64.encode($scope.info.passwordConfirm)
		};
		showAlert.showLoading(5000, "");
		Restangular.all("resetpassword").post(parameter).then(function (data) {
		    if (localStorage.debug) {
		        console.log("重置密码", data);
		    }
		    var msg = "";
		    if (data ) {
		        if (data.result) {
		            msg = "重置密码成功";
		        } else {
                    msg = data.message;
		        }
		    } else {
		        msg = "重置密码失败";
		    }
            showAlert.hideLoading();
            showAlert.showToast(msg);
		    if (data && data.result) {
                $state.go("HbbLogin");
		    }
		})["catch"](function (data) {
            console.error(data);
            showAlert.hideLoading();
            showAlert.showToast("重置密码，请求出错");
        });
	}
})
//修改手机
.controller("HbbChangePhoneController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, $timeout, $interval) {
    var studentId = "";
    var accountId = "";
    if($rootScope.loginUser){
        studentId = $rootScope.loginUser.studentId;
        accountId = $rootScope.loginUser.accountId;
    }
    $scope.info = {};
    $scope.info.phone = "";

    $scope.confirmPopup = null;

    function validatePhone(phone) {
    	return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(phone);
    }

    $scope.confirmChangePhone = function () {
        if (!$scope.info.phone) {
        	showAlert.showToast("手机号不能为空");
        	return;
        } else if (!validatePhone($scope.info.phone)) {
        	showAlert.showToast("手机号格式不正确");
        	return;
        }

        if (!$scope.info.smscode) {
        	showAlert.showToast("验证码不能为空");
        	return;
        }

        if (!$scope.info.smscode) {
        	showAlert.showToast("手机号验证码不能为空");
        	return;
        }

        $scope.confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确定修改手机号?',
            okText: '确定',
            cancelText: '取消',  
        });

        $scope.confirmPopup.then(function(res) {
            if (res) {
                $scope.changePhone();
            } else {
                console.log('You are not sure');
            }
        });
    }

	//注册验证码
    $scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
    $scope.changeRegVerifyCode = function () {
    	$scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
    }

    $scope.isVerifyCode = true;
    $scope.btnVerifyCode = "获取验证码";
	//发送验证码
    $scope.verifyCodeClick = function () {
    	if ($scope.info.phone.trim().length != 11) {
    		showAlert.showToast("手机号码格式错误");
    		return;
    	}

    	getDataSource.validateCode($scope.info.verifycode, "forgotpwdcode"
		, function () {

			$scope.isVerifyCode = false;

			getDataSource.getUrlData("../api/getSMSCode", { phone: $scope.info.phone, keyname: "forgotpwdsmscode" }, function (datatemp) {
				if (datatemp.code == "success") {
					//alert("发送成功");
				}
			}, function (errortemp) { });

			var i = 90;
			var ptime;
			$scope.timer = $interval(function () {
				i--;
				$scope.btnVerifyCode = i + "秒之后重新发送";
				$scope.isVerifyCode = false;

				if (i == 0) {
					$scope.isVerifyCode = true;
					$scope.btnVerifyCode = "重新获取验证码";
					$interval.cancel($scope.timer);
				}
			}, 1000);

		}
		, function () {
			$scope.changeRegVerifyCode();
			showAlert.showToast("验证码错误"); 
		});

    }

    $scope.changePhone = function () {
        var param = {
		    accountid: accountId,
		    studentid: studentId,
		    cellphone1: $scope.info.phone,
		    cellphone2: $scope.info.phone
        };
        if (localStorage.debug) {
            console.log("修改手机请求参数", param);
        }
        showAlert.showLoading(5000, "加载中...");
        getDataSource.validateCode($scope.info.smscode, "forgotpwdsmscode", function () {
			getDataSource.getDataSource("usercenter-changetel", param, function (data) {
				if (localStorage.debug) {
					console.log("修改成功", data);
				}

				showAlert.hideLoading();
				if (data && data.length > 0) {
					var dt = data[0];
					if (dt && dt.crow > 0){
						showAlert.showToast("手机修改成功");
						$timeout(function () {
							$state.go("HbbMain.mainsetting");
						}, 500);
					}else{
						showAlert.showToast("手机修改失败");
					}
				} else {
					showAlert.showToast("手机修改失败");
				}
			}, function (error) {
				console.log("手机修改失败", error);
				showAlert.hideLoading();
				showAlert.showToast("手机修改失败");
			});
        }, function () {
        	showAlert.showToast("手机验证码输入不正确");
        });
    }

    $scope.goBack = function() {
		$ionicHistory.goBack();
    }

    $scope.$on('$ionicView.beforeLeave', function () {
        if ($scope.confirmPopup) {
            $scope.confirmPopup.close();
            $scope.confirmPopup = null;
        }
    });
})
//关于
.controller("HbbAboutController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
	$scope.goBack = function() {
		$ionicHistory.goBack();
	}
})
//关于
.controller("HbbInfoController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }

    $scope.userPersonalInfo = {};
    function getUesrData() {
        var studentId = "";
        if ($rootScope.loginUser) {
            studentId = $rootScope.loginUser.studentId || "";
        }
        //用户信息
        getDataSource.getDataSource("getUserInfo", { studentid: studentId }, function (data) {
            if (localStorage.debug) {
                console.log("用户信息:", data);
            }
            if (data && data.length > 0) {
                $scope.userPersonalInfo = data[0];
            } else {

            }
        }, function (data) {
            console.log("error:", data);
        });
    }


    getUesrData();

})
//忘记密码
.controller("HbbForgetPasswordController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp , $interval) {
	$scope.goBack = function() {
		$ionicHistory.goBack();
	}
	$scope.info = {};
	$scope.paracont = "获取验证码";
	$scope.sms_disabled = false;
	var second = 90,
		timePromise = undefined;

	function validatePhone(phone) {
		return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(phone);
	}

	$scope.doSendSMS = function () {

        if (!$scope.info.cellphone) {
        	showAlert.showToast("手机号不能为空");
        	return;
        } else if (!validatePhone($scope.info.cellphone)) {
        	showAlert.showToast("手机号格式错误");
        	return;
        }

		timePromise = $interval(function() {
			if(second <= 0) {
				$interval.cancel(timePromise);
				timePromise = undefined;

				second = 60;
				$scope.paracont = "重新获取";
				$scope.sms_disabled = false;
			} else {
				$scope.sms_disabled = true;
				$scope.paracont = second + "秒后可重发";
				second--;
			}
		}, 1000, 0);
		sendMsg();
	}

	function sendMsg() {
		var cellphone = $scope.info.cellphone || '';
		if(localStorage.debug) {
			console.log("cellphone:" + cellphone);
		}

		if (!$scope.info.cellphone) {
			showAlert.showToast("手机号不能为空");
			return;
		} else if (!validatePhone($scope.info.cellphone)) {
			showAlert.showToast("手机号格式错误");
			return;
		}

		showAlert.showLoading(5000, "加载中...");
		Restangular.all("checkcellphone").post({ cellphone: cellphone, accountid: "" }).then(function (data) {
			if (data.result) {
				Restangular.all("getSMSCode").post({
					phone: cellphone,
					keyname: "validatesmscode"
				}).then(function (data) {
					if (localStorage.debug) {
						console.log("短信发送成功", data);
					}

					var msg = "";
					if (data) {
						msg = data.message;
					} else {
						msg = "短信发送成功";
					}
					showAlert.showToast(msg);
				})["catch"](function (data, status) {
					console.log(data);
					showAlert.hideLoading();
					showAlert.showToast("短信发送失败");
				});
			} else {
				$interval.cancel(timePromise);
				timePromise = undefined;
				second = 60;
				$scope.paracont = "重新获取";
				showAlert.showToast(data.message);
			}
		})["catch"](function(data, status) {
			console.log(data);
			showAlert.hideLoading();
			$interval.cancel(timePromise);
			timePromise = undefined;
			second = 60;
			$scope.paracont = "重新获取";
			showAlert.showToast("短信发送失败");
		});
	}

	$scope.next = function () {
	    if (!$scope.info.cellphone) {
	        showAlert.showToast("手机号不能为空");
	        return;
	    }
	    if (!$scope.info.smscode) {
	    	showAlert.showToast("验证码不能为空");
	    	return;
	    }
		var paramObj = {
		    cellphone: $scope.info.cellphone || "",//手机号
		    yzmcode: "",// fromApp:true时，yzmcode可以不传 
		    smsyzmcode: $scope.info.smscode || "",//短信验证码
		    password1: "",//密码
		    password2: "",//密码
		    fromApp: true
		};

        showAlert.showLoading(5000, "加载中...");
		Restangular.all("existscellphone").post(paramObj).then(function (data) {
           
            showAlert.hideLoading();
            if (data.result){
                $state.go("HbbUpdatepassword", {cellphone : Base64.encode($scope.info.cellphone) });
		    } else {
		        showAlert.showToast(data.message);
		    }
        })["catch"](function (data) {
            console.error(data);
            showAlert.hideLoading();
            showAlert.showToast("手机号校验，请求出错");
        });
	}
})
//反馈
.controller("HbbFeedbackController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
	$scope.goBack = function() {
		$ionicHistory.goBack();
	}
})
.controller("HbbMainController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {


})
//学习班
.controller("HbbMainClassController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp , $ionicTabsDelegate) {
    var defaultStart = 0;
    var limit = 10;
    var mainClassStart = 0 , historyClassStart = 0;
    $scope.mainClassItems = [];
    $scope.mainClassMoreDataCanBeLoaded = true;
    $scope.historyClassItems = [];
    $scope.historyClassMoreDataCanBeLoaded = true;
    $scope.myClassCount = 0
    $scope.historyClassCount = 0;

    $scope.onTabClick = function (index) {
        localStorage.mainClassTabIndex = index;
        $ionicTabsDelegate.$getByHandle('mainclass-tab-handle').select(index);
        if (localStorage.debug) {
            console.log("onTabClick index=", index);
            console.log("$ionicTabsDelegate" , $ionicTabsDelegate);
        }
    }

    //首页 => 学习班
    $scope.getMainClassList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = mainClassStart;
        } else {
            startIndex = defaultStart;
            mainClassStart = startIndex;
        }

        $scope.searchparameter = {
            pageindex: startIndex,
			pagesize: limit
        };

        if (localStorage.debug) {
            console.log("学习班请求参数:", $scope.searchparameter);
        }
        // getMyClassList  getMyHistoryClassList
        getDataSource.getDataSource("getMyClassList" , $scope.searchparameter , function (data) {
            if (data) {
                if (localStorage.debug) {
                    console.log("学习班", data);
                }

                var datalist = data;

                for (var k = 0 ; datalist && k < datalist.length; k++) {
                    var dt = datalist[k];
                    var typeList = [];
		            if (dt.categoryone) {
		                typeList.push(dt.categoryone);
		            }
		            if (dt.categorytwo) {
		                typeList.push(dt.categorytwo);
		            }
		            if (dt.categorythree) {
		                typeList.push(dt.categorythree);
		            }
		            if (dt.categoryfour) {
		                typeList.push(dt.categoryfour);
		            }
		            dt.type = typeList.join("、") || "";
                }

                if (queryType == 'new') {
                    $scope.mainClassItems = datalist || [];
                }
                if (datalist && datalist.length > 0) {
                    if (datalist.length < limit) {
                        $scope.mainClassMoreDataCanBeLoaded = false;
                    } else {
                        $scope.mainClassMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < datalist.length; i++) {
                            $scope.mainClassItems.push(datalist[i]);
                        }
                    }
                    //mainClassStart++;
                    mainClassStart = mainClassStart + datalist.length;
                } else {
                    $scope.mainClassMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.mainClassMoreDataCanBeLoaded = false;
                console.log("学习班请求失败", data)
            }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            //getMyClassCount();
        } , function (data) {
            $scope.mainClassMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            console.log(data);
            showAlert.showToast("我的班级,请求出错");
        });
    }

    /*历史*/
    $scope.getHistoryClassList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = historyClassStart;
        } else {
            startIndex = defaultStart;
            historyClassStart = startIndex;
        }

        $scope.searchparameter = {
            pageindex: startIndex,
			pagesize: limit
        };

        if (localStorage.debug) {
            console.log("学习班请求参数:", $scope.searchparameter);
        }
        // getMyClassList  getMyHistoryClassList
        getDataSource.getDataSource("getMyHistoryClassList" , $scope.searchparameter , function (data) {
            if (data) {
                if (localStorage.debug) {
                    console.log("学习班", data);
                }

                var datalist = data;

                for (var k = 0 ; datalist && k < datalist.length; k++) {
                    var dt = datalist[k];
                    var typeList = [];
		            if (dt.categoryone) {
		                typeList.push(dt.categoryone);
		            }
		            if (dt.categorytwo) {
		                typeList.push(dt.categorytwo);
		            }
		            if (dt.categorythree) {
		                typeList.push(dt.categorythree);
		            }
		            if (dt.categoryfour) {
		                typeList.push(dt.categoryfour);
		            }
		            dt.type = typeList.join("、") || "";
                }

                if (queryType == 'new') {
                    $scope.historyClassItems = datalist || [];
                }
                if (datalist && datalist.length > 0) {
                    if (datalist.length < limit) {
                        $scope.historyClassMoreDataCanBeLoaded = false;
                    } else {
                        $scope.historyClassMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < datalist.length; i++) {
                            $scope.historyClassItems.push(datalist[i]);
                        }
                    }
                    //historyClassStart++;
                    historyClassStart = historyClassStart + datalist.length;
                } else {
                    $scope.historyClassMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.historyClassMoreDataCanBeLoaded = false;
                console.log("历史学习班请求失败", data)
            }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            //getHistoryClassCount();
        } , function (data) {
            $scope.historyClassMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            console.log(data);
            showAlert.showToast("历史班级,请求出错");
        });
    }

    function getMyClassCount() {
        getDataSource.getDataSource("getMyClassListCount", {}, function (data) {
            if(localStorage.debug){
                console.log("我的班级数量" ,data);
            }
            if (data && data.length > 0) {
                var dt = data[0];
                if(dt){
                    $scope.myClassCount = dt.classcount;
                }
            }
        } , function (data) {
            console.log("我的班级数量" , data);
        });
    }

    function getHistoryClassCount() {
        getDataSource.getDataSource("getMyHistoryClassListCount", {}, function (data) {
            if(localStorage.debug){
                console.log("历史班级数量" , data);
            }
            if (data && data.length > 0) {
                var dt = data[0];
                if(dt){
                    $scope.historyClassCount = dt.classcount;
                }
            }
        } , function (data) {
            console.log("历史班级数量" , data);
        });
    }



	$scope.goClassDetail = function(item) {
	    $state.go("HbbMainClassDetails", { classId : item.id});
	}

	function init() {
	    getMyClassCount();
	    getHistoryClassCount();
	}
	init();
})
//学习班简介
.controller("HbbMainClassDetailsController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp , FilesService) {
    var classId = $stateParams.classId;
    var defaultStart = 1;
    var limit = 10;
    var detailStartIndex = 1;
    $scope.classDetailList = [];
    $scope.classDetailListMoreDataCanBeLoaded = true;
    $scope.classInfo = {};

	var studentId = "";
	if($rootScope.loginUser){
        studentId = $rootScope.loginUser.studentId;
	}

	$scope.goBack = function() {
		$ionicHistory.goBack();
	}

    $scope.getImageUrl = function (image) {
        var imgurl = FilesService.showFile("coursewarePhoto", image, image);
        //console.log("imgurl=",imgurl);
        return imgurl;
    }

    //班级详情里的课程列表
    $scope.getClassDetailList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = detailStartIndex;
        } else {
            startIndex = defaultStart;
            detailStartIndex = startIndex;
        }

		var postData = {
			classid : classId,
			studentid: studentId,
			currentPage: startIndex,
			pageSize: limit,
			orderType: 1//1按最近学习排序，2按学习进度排序
		};

		if (localStorage.debug) {
		    console.log("班级详情里的课程列表-参数:" , postData);
		}
	    Restangular.all("searchClassCoursewarelist").post(postData).then(function (data) {
	        if (localStorage.debug) {
	            console.log("我的班级里-课程列表", data);
	        }

            if (data) {
                var datalist = data.courseList;
                if (localStorage.debug) {
                    console.log("我的班级里-课程列表-datalist=", datalist);
                }

                if (queryType == 'new') {
                    $scope.classDetailList = datalist || [];
                }
                if (datalist && datalist.length > 0) {
                    if (datalist.length < limit) {
                        $scope.classDetailListMoreDataCanBeLoaded = false;
                    } else {
                        $scope.classDetailListMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < datalist.length; i++) {
                            $scope.classDetailList.push(datalist[i]);
                        }
                    }
                    detailStartIndex++;
                } else {
                    $scope.classDetailListMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.classDetailListMoreDataCanBeLoaded = false;
                console.log("选修课请求失败", data)
            }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.getClassDetailInfo(); 
        })["catch"](function (data) {
            $scope.classDetailListMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            console.log(data);
            showAlert.showToast("选修课,请求出错");
        });
    }

    //班级详情
	$scope.getClassDetailInfo = function(){
		var postClassParam = {
			id: classId //班级Id
		};

		getDataSource.getDataSource("getClassInfoById", postClassParam, function (data) {
		    if (localStorage.debug) {
		        console.log("班级详情data=", data);
		    }
		    if (data && data.length > 0) {
		        $scope.classInfo = data[0];
		        if (localStorage.debug) {
		            console.log("班级详情$scope.classInfo=", $scope.classInfo);
		        }

		        if ($scope.classInfo) {
		            var typeList = [];
		            if ($scope.classInfo.categoryone) {
		                typeList.push($scope.classInfo.categoryone);
		            }
		            if ($scope.classInfo.categorytwo) {
		                typeList.push($scope.classInfo.categorytwo);
		            }
		            if ($scope.classInfo.categorythree) {
		                typeList.push($scope.classInfo.categorythree);
		            }
		            if ($scope.classInfo.categoryfour) {
		                typeList.push($scope.classInfo.categoryfour);
		            }
		            $scope.classInfo.type = typeList.join("、") || "";
		        }
		    }
		}, function (data) {
			console.log("error:", data);
		});
	}

    $scope.goCourseDetail = function (item) {
        if (localStorage.debug) {
            console.log("item:", item);
        }
        var vid = Base64.encode(item.teachervideo);
        var courseId = Base64.encode(item.coursewareid);
        $state.go("HbbCourse", { videoId: vid, courseId: courseId });
    }

})
//面授申请
.controller("HbbFaceController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp , $filter , $timeout) {
	$scope.goBack = function() {
		$ionicHistory.goBack();
	}

    $scope.train = {
		title: "",//培训名称
		categoryone: "",//组织调训，干部选学
		categorytwo: "", //业务培训,岗位培训,任职培训,初任培训
		categorythree: "",//面授培训,网络培训
		categoryfour: "", //境内培训，境外培训
		starttime: "",//开始时间
		endtime: "",//结束时间
		studytime: "",//学习时间
		year: "",//年份
		address: "",//地址
		company: "",//主办单位
		reference: "",//证明人
		status: 1,//状态，0保存，1提交
		remark: ""//备注
    };

    $scope.categoryoneList = [
        { showvalue: "组织调训", datavalue: "组织调训" },
        { showvalue: "干部选学", datavalue: "干部选学" }
    ];
    $scope.categorytwoList = [
        { showvalue: "业务培训", datavalue: "业务培训" },
        { showvalue: "岗位培训", datavalue: "岗位培训" },
        { showvalue: "任职培训", datavalue: "任职培训" },
        { showvalue: "初任培训", datavalue: "初任培训" }
    ];
    $scope.categorythreeList = [
        { showvalue: "面授培训", datavalue: "面授培训" },
        { showvalue: "网络培训", datavalue: "网络培训" }
    ];
    $scope.categoryfourList = [
        { showvalue: "境内培训", datavalue: "境内培训" },
        { showvalue: "境外培训", datavalue: "境外培训" }
    ];

	$scope.train.categoryone = "组织调训";
	$scope.train.categorytwo = "业务培训";
	$scope.train.categorythree = "面授培训";
	$scope.train.categoryfour = "境内培训";

    //年份
	$scope.yearList = [];
	var curDate = new Date();
	var year = curDate.getFullYear();
	for (var y = year; y >= 2012; y--) {
	    //$scope.yearList.push("" + y);
	    $scope.yearList.push({ showvalue: y, datavalue: y });
	};
	$scope.train.year = "" + year;



	var dropdownModel = [
        {
            title: '培训类型1',
            data: $scope.categoryoneList,
            dataname: 'categoryoneList',
            objname: 'train.categoryone',
            change: function (value) {
                $scope.train.categoryone = value;
            }
        },
        {
            title: '培训类型2',
            data: $scope.categorytwoList,
            dataname: 'categorytwoList',
            objname: 'train.categorytwo',
            change: function (value) {
                $scope.train.categorytwo = value;
            }
        },
        {
            title: '培训类型3',
            data: $scope.categorythreeList,
            dataname: 'categorythreeList',
            objname: 'train.categorythreeList',
            change: function (value) {
                $scope.train.categorythreeList = value;
            }
        },
        {
            title: '培训类型4',
            data: $scope.categoryfourList,
            dataname: 'categoryfourList',
            objname: 'train.categoryfour',
            change: function (value) {
                $scope.train.categoryfour = value;
            }
        },
        {
            title: '申报年份',
            data: $scope.yearList,
            dataname: 'yearList',
            objname: 'train.year',
            change: function (value) {
                $scope.train.year = value;
            }
        }
	];

    $scope.applyCourse = function () {
        if (!$scope.train.title) {
            showAlert.showToast("培训名称不能为空");
            return;
        }
        if (!$scope.train.starttime) {
            showAlert.showToast("开始时间不能为空");
            return;
        }
        if (!$scope.train.endtime) {
            showAlert.showToast("结束时间不能为空");
            return;
        }
        if (!$scope.train.year) {
            showAlert.showToast("年份不能为空");
            return;
        }
        if ($scope.train.studytime === "") {
            showAlert.showToast("学时不能为空");
            return;
        }

        var data = {};
        angular.extend(data, $scope.train);
        data.starttime = $filter('date')($scope.train.starttime, "yyyy-MM-dd");
        data.endtime = $filter('date')($scope.train.endtime, "yyyy-MM-dd");

        if (localStorage.debug) {
            console.log("面授申请参数=", data);
        }

        showAlert.showLoading(5000, "加载中...");
        //面授申请保存
        Restangular.all("addtrain").post(data).then(function (data) {
            showAlert.hideLoading();
		    if(localStorage.debug){
		        console.log("面授申请保存", data);
		    }
		    var msg = "";
		    if (data) {
		        if (data.result){
		            var trainid = data.trainid;
		        }
		        msg = data.message || "面授申请保存失败";
		    } else {
		        msg = "面授申请保存失败";
		    }
		    showAlert.showToast(msg);
		    $timeout(function () {
		    	$state.go("HbbMain.mainrecord", {tabindex:3});
		    }, 500);
        })["catch"](function (data) {
            showAlert.hideLoading();
            console.log(data);
            showAlert.showToast("面授申请,保存出错");
        });
    }


    $scope.showRankPopup = function (index) {
        var item = dropdownModel[index];
        $scope.rankPopupHandle = $ionicPopup.show({
            template: getPopupTemplate(item.dataname, item.objname,index),
            title: '请选择' + item.title,
            scope: $scope,
            buttons: [
			  { text: '取消' },
			  {
			      text: '<b>选择</b>',
			      type: 'button-positive',
			      onTap: function () {
			          selectCategory(item);
			      }
			  },
            ]
        });
    };

    function selectCategory(item) {
        for (var i = 0; i < item.data.length; i++) {
            if (item.data[i].checked == true) {
                item.change(item.data[i].showvalue);
                break;
            }
        }
    }

    function getPopupTemplate(dataname,objname,c) {
        var resultTemp = "<div class='list'>";
        resultTemp += '<label class="item item-radio"  ng-repeat="item in ' + dataname + '" ng-click="onRankListItemClick($index,' + c +')">' +
						'<input type="radio" name="rankGroup"  value="{{item.showvalue}}" >' +
							'<div class="item-content"> {{item.showvalue}} </div>' +
						'<i class="radio-icon ion-checkmark" style="visibility:visible;" ng-if="item.showvalue == ' + objname + '"></i>' +
                        '<i class="radio-icon ion-checkmark" ng-if="item.showvalue != ' + objname + '"></i>' +
						'</label>';
        resultTemp += "</div>";
        return resultTemp;
    }

    $scope.onRankListItemClick = function (index, c) {

        var item = dropdownModel[c];
        for (var i = 0; i < item.data.length; i++) {
            if (index != i) {
                item.data[i].checked = false;
            }
        }
        item.data[index].checked = true;
        item.change(item.data[index].showvalue);
    }

})
//面授申请详情
.controller("HbbFaceDetailsController", function($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp) {
	$scope.goBack = function() {
		//$ionicHistory.goBack();
		$state.go("HbbMain.mainrecord", { tabindex: 3 });
	}
	var id = Base64.decode($stateParams.id);

	$scope.info = {};
    //面授申请详情获取
	function getTainingDetail() {
	    if (localStorage.debug) {
	        console.log("面授申请详情,id=", id);
	    }
        showAlert.showLoading(5000, "加载中...");
        getDataSource.getDataSource("gettrain", { id: id }, function (data) {
            showAlert.hideLoading();
	        if (localStorage.debug) {
                console.log("面授申请详情,data=" , data);		
	        }
	        if (data && data.length > 0) {
	            var dt = data[0];
	            $scope.info = dt;

                var typeList = [];
		        if (dt.categoryone) {
		            typeList.push(dt.categoryone);
		        }
		        if (dt.categorytwo) {
		            typeList.push(dt.categorytwo);
		        }
		        if (dt.categorythree) {
		            typeList.push(dt.categorythree);
		        }
		        if (dt.categoryfour) {
		            typeList.push(dt.categoryfour);
		        }
		        $scope.info.type = typeList.join("、") || "";
	        } else {
                showAlert.showToast("面授申请详情，加载失败");
	        }            
        }, function (error) {
            showAlert.hideLoading();
		    console.log("面授申请详情，加载出错", error);
		    showAlert.showToast("面授申请详情，加载出错");
		});
	}

	$scope.confirmDeleteTrainPopup = null;
	$scope.confirmDeleteTrain = function(){
         $scope.confirmDeleteTrainPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确定删除?',
            okText: '确定',
            cancelText: '取消',  
        });

        $scope.confirmDeleteTrainPopup.then(function(res) {
            if (res) {
                deleteTaining();
            } else {
                console.log('You are not sure');
            }
        });
	}

    //面授申请删除
	function deleteTaining() {
	    if (localStorage.debug) {
	        console.log("面授申请详情,id=", id);
	    }
        showAlert.showLoading(5000, "加载中...");
        getDataSource.getDataSource("deletetrain", { id: id }, function (data) {
            showAlert.hideLoading();
	        if (localStorage.debug) {
                console.log("面授申请删除,data=" , data);		
	        }
	        if (data && data.length > 0) {
	            var dt = data[0];
	            if (dt.crow > 0) {
	                showAlert.showToast("面授申请删除成功");
	                $state.go("HbbMain.mainrecord", { tabindex: 3 });
	            } else {
                    showAlert.showToast("面授申请删除失败");
	            }
	        } else {
                showAlert.showToast("面授申请删除失败");
	        }            
        }, function (error) {
            showAlert.hideLoading();
		    console.log("面授申请删除出错", error);
		    showAlert.showToast("面授申请删除出错");
		});
	}

	function init() {
	    getTainingDetail();

        $scope.$on('$ionicView.beforeLeave', function () {
	        if ($scope.confirmDeleteTrainPopup) {
	            $scope.confirmDeleteTrainPopup.close();
	            $scope.confirmDeleteTrainPopup = null;
	        }
        });
	}

	init();
})
//首页-课程
.controller("HbbMainCourseController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, FilesService , $ionicTabsDelegate) {
    var defaultStart = 1;
    var limit = 10;

    $scope.optionalCourseItems = [];//选修课
    $scope.requiredCourseItems = [];//必修课
    $scope.finishedCourseItems = [];//已完成

    var optionalCourseStart = 1;
    var requiredCourseStart = 1;
    var finishedCourseStart = 1;

    $scope.optionalCourseMoreDataCanBeLoaded = true;
    $scope.requiredCourseMoreDataCanBeLoaded = true;
    $scope.finishedCourseMoreDataCanBeLoaded = true;

    $scope.onTabClick = function (index) {
        localStorage.mainCourseTabIndex = index;
        $ionicTabsDelegate.$getByHandle('maincourse-tab-handle').select(index);
        if (localStorage.debug) {
            console.log("onTabClick index=", index);
            console.log("$ionicTabsDelegate" , $ionicTabsDelegate);
        }
    }

    $scope.goCourseDetail = function (item) {
        if (localStorage.debug) {
            console.log("item:", item);
        }
        var vid = Base64.encode(item.teachervideo);
        var courseId = Base64.encode(item.coursewareid);
        $state.go("HbbCourse", { videoId: vid, courseId: courseId });
    }

    $scope.goSelectCourse = function () {
        $state.go("HbbMain.mainselectcourse");
    }

    $scope.cancelCourse = function (item, $event) {
        var courseId = item.coursewareid;
        var postData = { coursewareid: courseId,status:"-1" };

        // 取消选课
        showAlert.showLoading(5000, "加载中...");
        getDataSource.getDataSource("deletestudyrecord", postData, function (data) {
            showAlert.hideLoading();
            if (localStorage.debug) {
                console.log("取消选课", data);
            }
            if (data) {
                showAlert.showToast("取消选课成功");
                getCourseData();
                $scope.$emit("cancelCourseEvent", item);
            }
        }, function (error) {
            showAlert.hideLoading();
            console.log(error);
        });

        $event.stopPropagation();
    }

    $scope.userInfoObject = {
        name: "",
        icon: "",      //头像
        planTime: "无",   //计划学时
        finishTime: "无" //已获学时
    };
    var studentId = "";
    if ($rootScope.loginUser) {
        studentId = $rootScope.loginUser.studentId || "";
        $scope.userInfoObject.name = $rootScope.loginUser.name || "";
        $scope.userInfoObject.icon = $rootScope.loginUser.photopath || "";
    }

    $scope.getUserImageUrl = function (image) {
        var imgurl = FilesService.showFile("userPhoto", image, image);
        return imgurl;
    }

    $scope.getImageUrl = function (image) {
        var imgurl = FilesService.showFile("coursewarePhoto", image, image);
        //console.log("imgurl=",imgurl);
        return imgurl;
    }


    function getUserData(studentid) {
        //用户信息
        getDataSource.getDataSource("getUserInfo", { studentid: studentId }, function (data) {
            if (localStorage.debug) {
                console.log("用户信息:", data);
            }
            if (data && data.length > 0) {
                var userData = data[0];
                $scope.userInfoObject.icon = userData.photo_servername || "";
                $rootScope.cellphone = userData.cellphone || "";
            } else {

            }
        }, function (data) {
            console.log("error:", data);
        });

        //本年度已获得学时
        getDataSource.getDataSource("getUserReportByUserId", {}, function (data) {
            if (localStorage.debug) {
                console.log("本年度已获得学时", data);
            }
            if (data && data.length > 0) {
                var userData = data[0];
                $scope.userInfoObject.finishTime = userData.yearplan_finished || "无";
                if ($rootScope.loginUser.yearplan) {
                	$scope.userInfoObject.planTime = userData.yearplan_total;
                } else {
                	$scope.userInfoObject.planTime = "无";
                }
            }
        }, function (data) {
            console.log("error:", data);
        });
    }

    //课程 => 选修课
    $scope.getOptionalCourseList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = optionalCourseStart;
        } else {
            startIndex = defaultStart;
            optionalCourseStart = startIndex;
        }

        $scope.searchparameter = {
            condation: "", //课程名称、主讲人、课程来源
            searchType: "2",
            pageIndex: startIndex,
            pageSize: limit
        };
	    if(localStorage.debug){
        	    console.log("选修课请求参数:", $scope.searchparameter);
	    }
        Restangular.all("getallstudylist").post($scope.searchparameter).then(function (data) {
            if (data.result) {
                if (localStorage.debug) {
                    console.log("选修课", data);
                }
                //$scope.optionalCourseItems = data.list || [];

                var datalist = data.list;

                if (queryType == 'new') {
                    $scope.optionalCourseItems = datalist || [];
                }
                if (datalist && datalist.length > 0) {
                    if (datalist.length < limit) {
                        $scope.optionalCourseMoreDataCanBeLoaded = false;
                    } else {
                        $scope.optionalCourseMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < datalist.length; i++) {
                            $scope.optionalCourseItems.push(datalist[i]);
                        }
                    }
                    optionalCourseStart = optionalCourseStart + datalist.length;
                } else {
                    $scope.optionalCourseMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.optionalCourseMoreDataCanBeLoaded = false;
                console.log("选修课请求失败", data)
            }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        })["catch"](function (data) {
            $scope.optionalCourseMoreDataCanBeLoaded = false;
            if (queryType = 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            console.log(data);
            showAlert.showToast("选修课,请求出错");
        });
    }

    //必修课
    $scope.getRequiredCourseList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = requiredCourseStart;
        } else {
            startIndex = defaultStart;
            requiredCourseStart = startIndex;
        }

        var postData = {
            classid: "",//给班次id 就是按班查询，不给班就查该学员所有班的必修课。//ce089abf-e59a-415a-82d7-d62ffac43390
            currentPage: startIndex,
            orderType: 1,
            pageSize: limit,
            studentid: studentId
        };
        Restangular.all("searchClassCoursewarelist").post(postData).then(function (data) {
            if (data) {
                if (localStorage.debug) {
                    console.log("必修课 data=", data);
                    if (data) {
                        console.log("必修课 data.courseList=", data.courseList);
                    }
                }

                var datalist = data.courseList;

                if (queryType == 'new') {
                    $scope.requiredCourseItems = datalist || [];
                }
                if (datalist && datalist.length > 0) {
                    if (datalist.length < limit) {
                        $scope.requiredCourseMoreDataCanBeLoaded = false;
                    } else {
                        $scope.requiredCourseMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < datalist.length; i++) {
                            $scope.requiredCourseItems.push(datalist[i]);
                        }
                    }
                    requiredCourseStart = requiredCourseStart + limit;
                } else {
                    $scope.requiredCourseMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.requiredCourseMoreDataCanBeLoaded = false;
                console.log("必修课请求失败", data)
            }

            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        })["catch"](function (data) {
            $scope.requiredCourseMoreDataCanBeLoaded = false;
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            console.log(data);
            showAlert.showToast("必修课,请求出错");
        });
    }

    //已完成:
    $scope.getFinishedCourseList = function (queryType) {
        var startIndex;
        if (queryType == 'more') {
            startIndex = finishedCourseStart;
        } else {
            startIndex = defaultStart;
            finishedCourseStart = startIndex;
        }
        var postData = {
        	pageindex: (startIndex - 1) * limit,
            pagesize: limit
        };

        getDataSource.getDataSource("getfinishedcourseware", postData, function (data) {
            if (localStorage.debug) {
                console.log("已完成课程列表", data);
            }
            if (data) {              
                if (queryType == 'new') {
                    $scope.finishedCourseItems = data || [];
                }
                if (data && data.length > 0) {
                    if (data.length < limit) {
                        $scope.finishedCourseMoreDataCanBeLoaded = false;
                    } else {
                        $scope.finishedCourseMoreDataCanBeLoaded = true;
                    }

                    if (queryType == 'more') {
                        for (var i = 0; i < data.length; i++) {
                            $scope.finishedCourseItems.push(data[i]);
                        }
                    }
                    finishedCourseStart = finishedCourseStart + data.length;
                } else {
                    $scope.finishedCourseMoreDataCanBeLoaded = false;
                }
            } else {
                $scope.finishedCourseMoreDataCanBeLoaded = false;
                console.log("已完成课程列表加载失败。")
            }
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        }, function (error) {
            $scope.finishedCourseMoreDataCanBeLoaded = false;
            if (queryType == 'more') {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
            console.log(error);
        })
    }


    function getCourseData() {
        $scope.getOptionalCourseList('new');
        $scope.getRequiredCourseList('new');
        $scope.getFinishedCourseList('new');
    }

    function init() {
        getUserData();
        //getCourseData();

        $rootScope.$on("chooseCourseEvent", function (event, data) {
            if (localStorage.debug) {
                console.log("event:" + event.name + ", data=" + data);
            }
            getCourseData();
        });
    }

    init();
})
.controller("HbbArchivesController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, FilesService, $ionicTabsDelegate) {
	$scope.datalist = [];
	$scope.getArchives = function () {
		getDataSource.getDataSource("getarchives", {}, function (data) {
			if (data && data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					data[i].expand = false;
					data[i].src = "../img/student_file/arrow01.png";
					data[i].keywordsArr = data[i].keywords.split(",");
					data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);
				}
				data[0].expand = true;
				data[0].src = "../img/student_file/arrow02.png";
				$scope.datalist = data;
			}
		}, function (error) { });
	}

	$scope.onExpand = function (n) {
		n.expand = !n.expand;
		n.src = n.expand == false ? "../img/student_file/arrow01.png" : "../img/student_file/arrow02.png";
	}

	$scope.getArchives();

	$scope.goToTrain = function () {
		$state.go("HbbMain.mainrecord", { tabindex: 3 });
	}
})
;
