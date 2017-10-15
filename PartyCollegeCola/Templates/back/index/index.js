angular.module("myApp")
.controller("indexController", ["$http", "$scope", "$state", "SessionService", "getDataSource", "$rootScope", function ($http, $scope, $state, SessionService, getDataSource, $rootScope) {
    $http.get("../config/menus.json").success(function (data) {
        //var groupByMenus = _.groupBy(data, function (val) {
        //    return val.group;
        //});
        //$scope.allMenus = data;
        //$scope.maps = _.uniq(_.map(data, "group"));
        //var menus = groupByMenus;
        //angular.forEach(groupByMenus, function (item) {
        //    item = _.sortBy(item, function (o) { return o.order; });
    	//});
    	$scope.backIndexUrl = "../html/index.html";//$rootScope.user.firstpage;
        //console.log($rootScope.user);
        var menus = _.sortBy(data, function (o) { return o.order; });
        angular.forEach(menus, function (item) {
            item.submenus = _.sortBy(item.submenus, function (o) { return o.order; });
            var displayNumber = 0;
            angular.forEach(item.submenus, function (submenu) {
                var hasPermission = false;
                angular.forEach($rootScope.user.permissionDic, function (permission) {
                    if (submenu.permission) {
                        if (permission.Name == submenu.permission) {
                            hasPermission = true;
                        }
                    }
                    else {
                        hasPermission = true;
                    }
                });
                if (hasPermission == false) {
                    submenu.display = false;
                }
                else {
                    displayNumber++;
                    submenu.display = true;
                }
            });
            if (displayNumber == 0) {
                item.display = false;
            }
            else {
                item.display = true;
            }
        });
        $scope.menus = menus;

    });

    //$scope.currentPlatformId = $rootScope.user.platformid;
    $scope.changePlatform = function (platform) {
    	if (platform.id == $rootScope.user.platformid) {
    		return;
    	}
    	getDataSource.getUrlData("../api/RefreshSession", { accountid: $rootScope.user.accountId, platformid: platform.id }, function (data) {
    		$rootScope.user = data.loginUser;
    	    //location.href = "../html/indexback.html";

    		var hrefArry = $rootScope.appConfig.loginHref;
    		var hrefobj = _.find(hrefArry, { usertype: parseInt($rootScope.user.userType) });
    		location.href = "../" + hrefobj.href.replace("[domain]", $rootScope.user.domain);
    	})
    };

    $scope.logOut = function () {
        SessionService.Logout();
    }
    //getDataSource.getDataSource("getNowUserPlatform", { accountid: $rootScope.user.accountId }, function (data) {
    //    $scope.platforms = data;
    //})
    $scope.goMenu = function (menu, group) {
        angular.forEach(group.submenus, function (m) {
            m.active = false;
        });
        menu.active = true;
        $state.go(menu.state, menu.parameter);
    }
    $scope.getActiveClass = function (group) {
        var returnVal = false;
        var nowstate = $state.$current.name;
        var obj = _.find($scope.allMenus, function (o) { return o.state == nowstate });
        if (obj && obj.group == group) {
            returnVal = true;
        }
        //return returnVal;
    }
}]);