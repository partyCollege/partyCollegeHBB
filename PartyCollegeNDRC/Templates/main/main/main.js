app.controller("mainController", ['$rootScope',"$state", '$scope', '$http', '$location', 'getDataSource', 'SessionService', "DateService", "GetFileService", "CommonService",
	function ($rootScope,$state, $scope, $http, $location, getDataSource, SessionService, DateService, GetFileService, CommonService) {
         
        //得到默认班级
	    var getdefaultClass = function () {
	        getDataSource.getDataSource("getDefaultClassIdByUserId", { userid: $rootScope.user.studentId },
                function (data) {
                    if (data && data.length > 0) {
                        var classid = data[0].classid;
                        getDataSource.getUrlData("../api/ChangeClass", { classid: classid }, function (data) { }, function (errortemp) {});
                    }
                }, function (e) { })
	    }();

	    $scope.changetab = function (idx) {
	        for (var i = 0; i < $rootScope.mainConfig.length; i++) {
	            $rootScope.mainConfig[i].select = false;
	        }
	        $rootScope.mainConfig[idx].select = true;
	    }


	    $scope.userpermission = [true,false]; 
	    if ($rootScope.user.permissionDic.length > 0) {
	        $scope.userpermission[1] = true;
	    }

	    $scope.exit = function () {
	        getDataSource.getUrlData("../api/Logout", {}, function (datatemp) {
	            if (datatemp.code == "success") {
	                location.href = "../html/login.html"
	            }
	        }, function (errortemp) { });
	    }

	    $scope.chooseMenu = function () {
	        var path = $location.$$path;
	        for (var i = 0; i < $rootScope.mainConfig.length; i++) {
	            var n = $rootScope.mainConfig[i];
	            n.select = false;
	            for (var a = 0; a < n.childMenus.length ; a++) {
	                if (path.indexOf(n.childMenus[a]) >= 0) {
	                    n.select = true;
	                    break;
	                }
	            }
	        }
	    }

	    $scope.toToSetting = function () {
	    	var path = $location.absUrl();
	    	var obj = _.find($rootScope.mainConfig, { 'elementName': "usercenter" });
	    	if (typeof (obj) == "object") {
	    		obj.select = true;
	    	}

	    	console.log(path);

	    	if (path.indexOf('index.html') > -1) {
	    		location.href = "indexfront.html#/main/usercenter";
	    		console.log(path);
	    	}
	    	//indexfront.html#/main/usercenter
	    }


	    //选项卡
	    $scope.aClick = function (menu, ename) {

	        var objtemp = _.find($rootScope.mainConfig, { 'select': true });
	        if (typeof (objtemp) == "object") {
	            objtemp.select = false;
	        }
	        var obj = _.find($rootScope.mainConfig, { 'elementName': ename });
	        if (typeof (obj) == "object") {
	            obj.select = true;
	    	}

	    	
	        if (ename == "allcourse") {
	        	location.href = "indexfront.html#/main/allcourse/0";
	        } else {
	        	if (menu.routeparam != null) {
	        		$state.go(menu.rounteName, menu.routeparam);
	        	} else {
	        		$state.go(menu.rounteName);
	        	}
	        }
	    };

	    $scope.searchKeyup = function (e) {
	        var keycode = window.event ? e.keyCode : e.which;
	        if (keycode == 13) {
	            $scope.searchNews();
	        }
	    }

	    $scope.searchKeys = "";
	    $scope.searchNews = function () {

	        if ($rootScope.user && $rootScope.user.isLogin) {
	            if ($scope.searchKeys == "") {
	                CommonService.alert("请输入关键字后再搜索");
	                return;
	            }
	            location.href = "../html/index.html#/main/search/" + $scope.searchKeys;
	        }
	        else {
	            $scope.mateshowlogintip = false;
	            CommonService.alert("请登录");
	        }
	    }

        //后台链接
	    $scope.backurl = "../html/indexback.html";
	    var menu = _.find($rootScope.user.permissionDic, { GroupName: '资源库管理', Name: '课程分类' });
	    if (menu) {
	        $scope.backurl = "../html/indexback.html#/index/coursewarecategory";
	    }
	    else {
	        menu = _.find($rootScope.user.permissionDic, { GroupName: '教学管理', Name: '班级管理' });
	        if (menu)
	            $scope.backurl = "../html/indexback.html#/index/classlist";
	    }
	}])