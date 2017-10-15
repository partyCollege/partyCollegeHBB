var APPController = angular.module('app.controllers', ['ngSanitize', 'restangular'])
.controller("autoLoginController", function ($rootScope, $stateParams, $scope, Restangular, $http, $state) {
    $scope.phone = $stateParams.phone;
    $scope.bcid = $stateParams.bcid;
    //进入菜单
    $scope.gomenu = function (menu) {
        if (menu.length > 0) {
            menu = menu[0];
            if (menu.category) {
                $state.go(menu.state, { title: menu.title, category: menu.category });
            }
            else {
                $state.go(menu.state, { title: menu.title });
            }
        }
    }



    $scope.StudentLogin = function () {
        //$scope.setRemberPSD();
        //实现登录
        var loginData = Restangular.one('Gusers/action/AutoLogin/' + $scope.phone + '/' + $scope.bcid);
        loginData.post().then(function (data) {

            if (data.errorMessage == "") {
                sessionStorage.userid = data.onecard;
                sessionStorage.usertype = "student";
                sessionStorage.bcinfo_id = data.bcinfo;
                sessionStorage.stu_info_id = data.info_id;
                sessionStorage.uname = data.uname;
                sessionStorage.decphone = $scope.phone;
                sessionStorage.bcname = data.bcname;
                sessionStorage.onecard = data.onecard;


                // 新增手势密码
                sessionStorage.ishandpsd = data.ishandpsd;
                sessionStorage.handpsd = data.handpsd;

                $rootScope.user = sessionStorage;
                localStorage.user = JSON.stringify($rootScope.user);
                $http.get("../config/menus.json").then(function (data) {
                    $scope.menus = data.data;
                    var nowmenus = _.filter($scope.menus, { 'usertype': "student" });
                    $scope.gomenu(nowmenus);

                });
            } else {
                //alert(data.errorMessage);
            }

        });
    }();
})
.controller("loginController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup, userHelp, BreadcrumbOrganizeSelect, $timeout) {
    showAlert.hideLoading();
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false)

    var q = $location.search();
    //$ionicPlatform.ready(function () {
    //    if (window.localStorage.userid && !$rootScope.fromweixin) {
    //        cordovaService.notification.add(window.localStorage.userid);
    //    }
    //});
    $scope.winHeight75 = window.screen.height / 100 * 80;

    $scope.exitApp = function () {
        cordovaService.exitApp();
    };
    $scope.checkapp = function () {
        cordovaService.checkAppInstall();
    }
    $scope.gosuper = function () {
        window.plugins.launcher.launch({ uri: "mobilelib://mobilelib/login?unitid=1595&username=1120121119130&password=123456" }, function () { }, function () {
        });
    }
    $scope.notice = function () {
        cordovaService.notification.add();
    };
    $scope.xiaoxi = function () {
        //window.cordova.plugins.FileOpener.openFile("http://192.168.0.105/CollegeAPP/APK/hello-debug-unaligned.apk");
        //cordovaService.checkVersion();
    }
    $scope.down = function () {
        //$("#myframe").attr("src", "http://192.168.1.72/collegeApp/APK/hello-debug-unaligned.apk");
        //window.location.href = "http://192.168.1.72/collegeApp/APK/hello-debug-unaligned.apk";
        //window.cordova.plugins.FileOpener.openFile("https://61.139.79.231/collegeapp/APK/hello-debug-unaligned.apk", function () { alert("1") }, function (error) {
        //    alert('message: ' + error.message);

        //});
        cordovaService.cordovaDown("https://61.139.79.234/api/getAttach/action/getAttach/XEJJQU5RSUFOXDIwMTUtMDFcNzhkMmJiN2RkOWQ3NGQ0YmFjY2VhNDIzMDBlM2Q4YzUuZG9j", "78d2bb7dd9d74d4baccea42300e3d8c5.doc");
        //window.open("https://61.139.79.231/api/getAttach/action/getAttach/XEJJQU5RSUFOXDIwMTQtMTJcNGJiYmNlMjZmOGU5NDhmNTk1ODlhNDExMDExMWUzYzguZG9jeA==", "_system");
        //window.location.href = "https://61.139.79.231/collegeapp/APK/hello-debug-unaligned.apk";
    }
    $scope.video = function () {
        cordovaService.playVideo("rtsp://61.139.79.231:554/03.mp4");
    };
    $scope.barCode = function () {
    }
    if (q.fromNotice) {
        var rest = Restangular.one("updateNotice/" + q.userid);
        rest.post();
    }

    $scope.info = null;

    $scope.pic = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });

        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            image.src = imageURI;
        }

        function onFail(message) {
            //alert('Failed because: ' + message);
            $ionicPopup.alert({
                title: "信息提示",
                template: 'Failed because: ' + message,
                buttons: [
                               {
                                   text: '<b>确认</b>',
                                   type: 'button-positive'
                               }
                ]
            });
        }
    };
    $scope.loginImg = [];
    $scope.showVister = false;
    $(function () {
        $(".ion-record").css("font-size", "12px");
        $http.get("../config/AppConfig.json").then(function (data) {
            var nowdata = data.data;
            $rootScope.AppConfig = nowdata;
            $scope.showVister = $rootScope.AppConfig.showVister;
            $scope.needShowImage = nowdata.loginPageShowImg;
            $scope.showLogo = nowdata.showLogo;
            $scope.LogoPath = nowdata.LogoPath;
            $scope.showjsLoginButton = true;
            $scope.showxyLoginButton = true;
            if ($rootScope.AppConfig.showLoginButton) {
                if ($rootScope.AppConfig.showLoginButton.indexOf("0") == -1) {
                    $scope.showjsLoginButton = false;
                }
                if ($rootScope.AppConfig.showLoginButton.indexOf("1") == -1) {
                    $scope.showxyLoginButton = false;
                }
            }
            if (!$scope.showLogo) {
                $("#logoImg").css("display", "none");
            }
            for (var i = 1; i <= 5; i++) {
                var obj = new Object();
                obj.imgSrc = i + ".jpg";
                $scope.loginImg.push(obj);
            }
        });


    });
    if (window.localStorage.logname) {
        $scope.logname = window.localStorage.logname;
        $scope.password = window.localStorage.password;
    }
    $scope.xiazai = function () {
        var loginData = Restangular.one("getattach");
        loginData.get().then(function () {
        });
    };
    $ionicPopover.fromTemplateUrl('../templates/appraiseDetail.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.openPo = function () {

        $scope.popover.show();
    }
    $http.get("../config/menus.json").then(function (data) {
        $scope.menus = data.data;
    });
    //进入菜单
    $scope.gomenu = function (menu) {
        if (menu.length > 0) {
            menu = menu[0];
            if (menu.category) {
                $state.go(menu.state, {
                    title: menu.title, category: menu.category
                });
            }
            else {
                $state.go(menu.state, {
                    title: menu.title
                });
            }
        }
    }
    $scope.visterLogin = function () {
        sessionStorage.usertype = "vister";
        var nowmenus = _.filter($scope.menus, {
            'usertype': "vister"
        });
        $scope.gomenu(nowmenus);
    };
    //$("body").append("<div id='debuginfo' style='position:fixed; left: 0px; right: 0px;top:0px;z-index:99999;min-height:100px;background-color:#333;color:#fff'></div>")
    $rootScope.bclist = [];
    $scope.login = function () {
        $("#debuginfo").empty().append("<div>教职工登陆DebugInfo：</div>");
        $("#debuginfo").append("<div>开始登陆时间戳:" + new Date().getTime() + "</div>");
        //    if (window.localStorage.userid) {
        //        cordovaService.notification.add(window.localStorage.userid);
        //}
        if (!$rootScope.fromweixin) {
            cordovaService.checkVersion();
        }

        if ($scope.logname == "" || $scope.password == "") {
            return;
        }
        window.localStorage.IsFirstStart = false;
        window.localStorage.logname = $scope.logname;
        window.localStorage.password = $scope.password;
        $scope.setRemberPSD();
        $("#debuginfo").append("<div>开始请求后台:" + new Date().getTime() + "</div>");
        //实现登录
        var loginData = Restangular.one('Gusers/action/Login/' + $scope.logname + '/' + $scope.password);
        loginData.post().then(function (data) {
            $("#debuginfo").append("<div>后台请求完毕返回:" + new Date().getTime() + "</div>");
            if (data.msgStatus) {
                window.localStorage.userid = data.userid;
                sessionStorage.userid = data.userid;
                sessionStorage.usertype = "teacher";
                sessionStorage.maincode = data.mainDept;
                sessionStorage.uname = data.uname;
                sessionStorage.onecard = data.onecard;
                // 记录手势密码
                sessionStorage.ishandpsd = data.ishandpsd;
                sessionStorage.handpsd = data.handpsd;


                $("#debuginfo").append("<div>开始getTeacherClass:" + new Date().getTime() + "</div>");
                getDataSource.getDataSource("getTeacherClass", {
                    userid: sessionStorage.userid
                }, function (classdata) {
                    if (classdata.length > 0) {
                        $rootScope.bclist = classdata;
                        sessionStorage.bcinfo_id = classdata[0].classid;
                        sessionStorage.bcname = classdata[0].bt;
                    }
                    else {
                        delete sessionStorage.bcname;
                        delete $rootScope.user.bcname;
                        delete sessionStorage.bcinfo_id;
                        delete $rootScope.user.bcinfo_id;
                    }
                    userHelp.setSession(function () { });
                })
                sessionStorage.roles = JSON.stringify(data.roles);

                $rootScope.user = sessionStorage;
                localStorage.user = JSON.stringify($rootScope.user);
                var nowmenus = _.filter($scope.menus, {
                    'usertype': "teacher"
                });
                startPushMessage();
                $("#debuginfo").append("<div>信息初始化完毕开始跳转:" + new Date().getTime() + "</div>");
                var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
                if (gopage) {
                    $location.path(gopage).replace();
                } else {
                    $scope.gomenu(nowmenus);
                }
            } else {
                //alert(data.msgContent);
                $ionicPopup.alert({
                    title: "信息提示",
                    template: data.msgContent,
                    buttons: [
                {
                    text: '<b>确认</b>',
                    type: 'button-positive'
                }
                    ]
                });
            }
        });
    };
    function startPushMessage() {

        data = {
            "action": sessionStorage.userid + "/" + sessionStorage.usertype,
            "refreshTime": 1000 * 5 //刷新时间 不传默认60s
        }
        //注：action 地址返回数据格式
        /* {
                "messageId" : "1cfa31dd47de6f8a485aac405a694974",
                "title":"你有一条新的消息",
                "content":"你有一条新的消息"
        } */
        if (!$rootScope.fromweixin) {
            xsfPushMessage.startPushMessage(data, onSuccess, onError);
        }
        function onSuccess(data) {
            console.log(data.message + " - " + data.data);
        }

        function onError(e) {
            console.log(e.message + " - " + e.data);
        }
    }
    $scope.setRemberPSD = function () {

    }
    $scope.StudentLogin = function () {
        $("#debuginfo").empty().append("<div>学员登陆DebugInfo：</div>");
        $("#debuginfo").append("<div>开始登陆时间戳:" + new Date().getTime() + "</div>");
        //console.log("1：" + new Date().getTime());
        if ($scope.logname == "" || $scope.password == "") {
            return;
        }
        $scope.setRemberPSD();

        window.localStorage.logname = $scope.logname.toLocaleUpperCase();
        window.localStorage.password = $scope.password;



        $("#debuginfo").append("<div>开始请求后台:" + new Date().getTime() + "</div>");
        //console.log("2：" + new Date().getTime());
        //实现登录
        var loginData = Restangular.one('Gusers/action/StudentLogin/' + $scope.logname.toLocaleUpperCase() + '/' + $scope.password);
        loginData.post().then(function (data) {

            $("#debuginfo").append("<div>后台请求完毕返回:" + new Date().getTime() + "</div>");
            //console.log("3：" + new Date().getTime());
            if (data.errorMessage == "") {
                sessionStorage.userid = data.onecard;
                sessionStorage.usertype = "student";
                sessionStorage.bcinfo_id = data.bcinfo;
                sessionStorage.stu_info_id = data.info_id;
                sessionStorage.uname = data.uname;
                sessionStorage.phone = data.phone;
                sessionStorage.bcname = data.bcname;
                // 记录手势密码
                sessionStorage.ishandpsd = data.ishandpsd;
                sessionStorage.handpsd = data.handpsd;

                if (!$rootScope.fromweixin) {
                    startPushMessage();
                }

                $("#debuginfo").append("<div>开始decphone:" + new Date().getTime() + "</div>");
                var decphone = Restangular.one('Gusers/action/decPhone/' + data.phone);
                decphone.post().then(function (data) {
                    sessionStorage.decphone = data.phone;
                });

                $rootScope.user = sessionStorage;
                userHelp.setSession(function () { });
                localStorage.user = JSON.stringify($rootScope.user);
                //console.log(sessionStorage)
                var nowmenus = _.filter($scope.menus, {
                    'usertype': "student"
                });
                $("#debuginfo").append("<div>信息初始化完毕开始跳转:" + new Date().getTime() + "</div>");
                var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
                if (gopage) {
                    $location.path(gopage).replace();
                } else {
                    $scope.gomenu(nowmenus);
                }
            } else {
                //alert(data.errorMessage);
                //$ionicPopup.alert({
                //    title: "信息提示",
                //    template: data.errorMessage,
                //    buttons: [
                //                   {
                //                       text: '<b>确认</b>',
                //                       type: 'button-positive'
                //                   }
                //    ]
                //});
                // 老师登录方法
                $scope.login();
            }
        });
    };
})

.controller("zjloginController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover
	, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert) {

    //$http.get("../config/menus.json").then(function (data) {
    //	$scope.menus = data.data;
    //});
    //进入菜单
    //$scope.gomenu = function (menu) {
    //	if (menu.length > 0) {
    //		menu = menu[0];
    //		if (menu.category) {
    //			$state.go(menu.state, { title: menu.title, category: menu.category });
    //		}
    //		else {
    //			$state.go(menu.state, { title: menu.title });
    //		}
    //	}
    //}
    $scope.zjlogin = function () {

        if ($scope.logname == "" || $scope.password == "") {
            return;
        }
        window.localStorage.logname = $scope.logname;
        window.localStorage.password = $scope.password;
        //$scope.setRemberPSD();
        //实现校外登录
        var loginData = Restangular.one('Gusers/action/ZJLogin/' + $scope.logname + '/' + $scope.password);
        loginData.post().then(function (data) {

            if (data.msgStatus) {
                window.localStorage.userid = data.userid;
                sessionStorage.userid = data.userid;
                sessionStorage.usertype = "zj";
                sessionStorage.uname = data.uname;

                //var nowmenus = _.filter($scope.menus, { 'usertype': "zj" });
                //$scope.gomenu(nowmenus);
                $state.go('app.appraise_default', { title: '专家评审', category: 'zjpjlist', ispj: "-1" });
            } else {
                //校内登录
                //校外登录失败后，继续进行校内登录
                var loginData = Restangular.one('Gusers/action/Login/' + $scope.logname + '/' + $scope.password);
                loginData.post().then(function (data) {
                    if (data.msgStatus) {
                        getDataSource.getDataSource(['GetZJInSchool'], { oauserid: data.userid }, function (datatemp) {
                            var data = datatemp[0];
                            window.localStorage.userid = data.info_id;
                            sessionStorage.userid = data.info_id;
                            sessionStorage.usertype = "zj";
                            sessionStorage.uname = data.bt;

                            $state.go('app.appraise_default', { title: '专家评审', category: 'zjpjlist', ispj: "-1" });
                        });
                    } else {
                        //alert(data.msgContent);
                        showAlert.alert(data.msgContent);
                        return;
                    }
                });
            }
        });
    };
})

.controller("menuController", function ($rootScope, $scope, $state, $stateParams, $http, $ionicNavBarDelegate, $ionicSideMenuDelegate, cordovaService, $ionicHistory, showAlert) {
    showAlert.hideLoading();
    $http.get("../config/menus.json").then(function (data) {
        $scope.menus = _.filter(data.data, { 'usertype': sessionStorage.usertype });
        $scope.nowMenus = $scope.menus[0];
        $scope.nowSubMenus = $scope.menus[0].subMenus;
        $scope.isSub = false;
        for (var i = 0; i < $scope.menus.length; i++) {
            if ($scope.menus[i].subMenus.length == 0) {
                $scope.menus[i].closeMenu = "menu-close";
            }
        }
    });
    $scope.gotab = function (tab) {
        $state.go(tab.link);

    }
    $(function () {
        $http.get("../config/AppConfig.json").then(function (data) {
            var h = $("#headBar").height();
            $("#logoImg").width(h);
            $("#logoImg").height(h);
            var nowdata = data.data;
            $rootScope.AppConfig = nowdata;
            $scope.showChaoxing = nowdata.showChaoxing;
            $scope.LogoPath = nowdata.LogoPath;
            $scope.showLogo = nowdata.showLogo;
            $scope.hasLeftMenu = nowdata.hasLeftMenu;
            $scope.hasTabMenu = nowdata.hasTabMenu;
            $scope.hasMainBottomTab = nowdata.hasMainBottomTab;
            $scope.mainTab = nowdata.mainTab;
            if (!$scope.showLogo) {
                $("#logoImg").css("display", "none");
            }
        });
    });
    $scope.openSuper = function () {
        try {
            cordovaService.checkAppInstall();
            //box.openApp('com.superlib', 'com.fanzhou.ui.Logo');
        }
        catch (ex) {
            alert(ex);
        }
    }
    $scope.goMain = function () {
        if ($rootScope.AppConfig.hasMain == true) {
            $state.go("app.index");
        }
        else {
            $ionicSideMenuDelegate.toggleLeft();
        }
    }

    // tab页跳转红色学府
    $scope.goRedSchool = function (index) {
        if (index == 1) {
            window.location.href = $rootScope.AppConfig.mainTab.replace('[phone]', sessionStorage.decphone);
        }
        else if (index == 2) {
            window.location.href = $rootScope.AppConfig.mainStudy.replace('[phone]', sessionStorage.decphone);
        }
        else if (index == 3) {
            window.location.href = $rootScope.AppConfig.mainExpro.replace('[phone]', sessionStorage.decphone);
        }
        else if (index == 4) {
            window.location.href = $rootScope.AppConfig.mainTran.replace('[phone]', sessionStorage.decphone);
        }
        else if (index == 5) {
            window.location.href = $rootScope.AppConfig.mainMe.replace('[phone]', sessionStorage.decphone);
        }
    }
    $scope.goMenu = function (id, menu) {
        $($scope.menus).each(function () {
            var ischildChecked = false;
            $(this)[0].checked = false;
            if ($(this)[0].subMenus.length > 0) {
                $($(this)[0].subMenus).each(function () {
                    $(this)[0].checked = false;
                    if ($(this)[0] == menu) {
                        ischildChecked = true;
                    }
                });
                if (ischildChecked) {
                    $(this)[0].checked = true;
                }
            }
        });
        menu.checked = true;
        if (menu.subMenus.length > 0) {
            return;
        }
        $ionicSideMenuDelegate.toggleLeft();
        if (menu.category) {
            $state.go(menu.state, { title: menu.title, category: menu.category });
        }
        else {
            $state.go(menu.state, { title: menu.title });
        }
        window.event.cancelBubble = true;
    }
    $scope.showSubMenu = function () {
        if ($scope.nowMenus) {
            if ($scope.nowSubMenus.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    $scope.usertype = sessionStorage.usertype;
    $scope.goMysettings = function () {
        if (sessionStorage.usertype == "student") {
            $state.go("app.studentSetting");
        }
        else {
            cordovaService.exitApp();
        }
    }
})
.controller("qnaController", function (getDataSource, $scope, $http, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, showAlert) {

})
.controller("oneCardListController", function (getDataSource, $scope, $http, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, showAlert) {
    $scope.canserch = false;
    $scope.canserch = $stateParams.canserch;
    $scope.list = [];
    if (!$scope.canserch) {
        var p = $http.get("../api/OneCard/" + $rootScope.user.userid);
        if ($rootScope.user.usertype != "student") {
            getDataSource.getDataSource("getTeacherOnecard", { userid: $rootScope.user.userid }, function (data) {
                if (data[0].workno) {
                    var pro = $http.get("../api/OneCard/" + data[0].workno);
                    pro.then(function (data) {
                        $scope.list = data.data;
                    });
                }
            });
        }
        else {
            p.then(function (data) {
                $scope.list = data.data;
            })
        }
    }
    $scope.sea = function () {
        var pro = $http.get("../api/OneCard/" + $("#txt_onecard").val());
        pro.then(function (data) {
            $scope.list = data.data;
        });
    }
})
.controller("default_listController", function ($scope, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, showAlert) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userid = sessionStorage.userid;
    $scope.buttonTitle = "新增";
    $scope.listneedPlay = false;
    $scope.onecard = sessionStorage.onecard;
    $scope.title = $stateParams.title;
    $scope.category = $stateParams.category;
    $scope.finfo_id = "null";
    if ($stateParams.finfo_id) {
        $scope.finfo_id = $stateParams.finfo_id;
    }
    Restangular.setDefaultRequestParams(['remove', 'post', "put", "get"], { formAPP: true });
    $scope.list = new Array();
    $scope.nowpageIndex = 0;
    $scope.returnJson = new Object();
    $scope.moreDataCanBeLoaded = true;
    $scope.doRefresh = function () {
        delete $rootScope.perPosition;
        $scope.list = new Array();
        $scope.nowpageIndex = 0;
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.loadMore = function () {
        $scope.nowpageIndex++;
        var getmoreData = Restangular.one("ListData/action/GetPageData/" + $scope.category + "/" + $scope.nowpageIndex + "/" + $scope.userid + "/" + $scope.onecard + "/" + $scope.finfo_id);
        getmoreData.get().then(function (data) {
            if (data.buttonTitle) {
                $scope.buttonTitle = data.buttonTitle;
            }
            $scope.returnJson = data;
            //console.log("data", $scope.returnJson);
            var returndata = data.listData;
            $scope.title = data.title;
            if (returndata.length == 0) {
                $scope.moreDataCanBeLoaded = false;
            }
            for (var c = 0; c < returndata.length; c++) {
                $scope.list.push(returndata[c]);
            }
            if ($rootScope.perPosition) {
                $timeout(function () {
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $rootScope.perPosition.top);
                }, 200);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.goNew = function () {
        eval("var obj=" + $scope.returnJson.buttonParams);
        $state.go($scope.returnJson.buttonHref, obj);
    }
    $scope.checkNeedPlay = function (item) {
        if (item.needPlay) {
            $scope.listneedPlay = true;
        };
    }
    $scope.showDetial = function (item) {
        $rootScope.perPosition = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition();
        //console.log("showDetial", item);
        if ($scope.returnJson.hasDetail) {
            var kecolumn = $scope.returnJson.keyColumn;
            if (item.doScript && item.doScript.length > 0) {
                eval("defaultList." + item.doScript + "(" + item.keyData + ")");
            }
            $state.go('app.default_detial', { id: item.keyData, category: $scope.category, title: $scope.title });
        }
        else if (item.doScript && item.doScript.length > 0) {
            eval("defaultList." + item.doScript + "(" + item.keyData + ")");
        }
        else if (item.goHref) {
            item.linkParams = item.linkParams.replace("[keyColumn]", item.keyData);
            eval("var obj=" + item.linkParams);
            $state.go(item.goHref, obj);
        }
    };
    $scope.palyVideo = function (item) {
        try {
            cordovaService.playVideo(item.value);
        }
        catch (E) {
            showAlert.alert("播放视频失败");
            //alert("播放视频失败");
        };
    };


})
.controller("default_detialController", function ($window, $rootScope, $scope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $sce, $ionicNavBarDelegate, cordovaService, $ionicHistory, downService) {
    $scope.id = $stateParams.id;
    $scope.category = $stateParams.category;
    $scope.title = $stateParams.title;
    var rest = Restangular.one("ListData/action/GetPageDetailData/" + $scope.category + "/" + $scope.id + "/" + sessionStorage.userid);
    rest.get().then(function (data) {
        $scope.title = data.title;
        $scope.data = data.detailData.rowDetailColumnData;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].src != "") {
                $scope.data[i].filename = $scope.data[i].filename;
                $scope.data[i].attrSrc = "/api/getAttach/action/getAttach/" + Base64.encode($scope.data[i].src);
            }
            if ($scope.data[i].dataSource) {
                //var ddSource = _.result(_.find(data.detailData.attachs, { "source": $scope.data[i].dataSource }));

                var ddSource = _.find(data.detailData.attachs, function (bc) {
                    return bc.source == $scope.data[i].dataSource;
                });
                for (var s = 0; s < ddSource.attachs.length; s++) {
                    //var index1 = ddSource.attachs[s].filePath.lastIndexOf(".");
                    //var index2 = ddSource.attachs[s].filePath.length;
                    //var postf = ddSource.attachs[s].filePath.substring(index1, index2);//后缀名  
                    //var filename = $scope.id + postf;
                    //console.log("ddscource",ddSource.attachs[s]);
                    if (ddSource.attachs[s].category == "oaAttach") {
                        ddSource.attachs[s].filePath = "/api/getAttach/action/getAttach/" + Base64.encode(ddSource.attachs[s].filePath);
                    }
                    else {
                        var fpath = {
                            type: ddSource.attachs[s].category,
                            id: ddSource.attachs[s].filePath,
                            bcid: $rootScope.user.bcinfo_id
                        }
                        var fPath = JSON.stringify(fpath);
                        ddSource.attachs[s].filePath = "/api/getAttach/action/getAttach/xy/" + Base64.encode(fPath);
                    }

                    //ddSource.attachs[s].filePath = "/api/getAttach/action/getAttach/" + Base64.encode(filename);
                }
                $scope.data[i].attachs = ddSource;
            }
            //如果是图片项
            if ($scope.data[i].isPic) {
                $scope.data[i].contentPic = "../api/getAttach/action/getContent/" + $scope.data[i].picRoot + "/" + Base64.encode($scope.data[i].value);
            }
            if ($scope.data[i].isHTML == true) {
                $scope.data[i].value = $scope.data[i].value.replace(/{PE.SiteConfig.ApplicationPath\/}{PE.SiteConfig.uploaddir\/}/g, "http://www.scge.gov.cn/UploadFiles/");
            }
        }
    });
    $scope.downfile = function (url, filename) {
        downService.cordovaDown(downService.getRootPath() + url, filename);
    };
})
.controller("rmgpDemoController", function ($scope, $interval, $http, getDataSource, $ionicHistory, $sce, $timeout, $rootScope, $ionicListDelegate, $stateParams, $ionicNavBarDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $ionicLoading, $ionicActionSheet, $ionicModal) {
    $scope.controller = {
        pause: function () {
            $scope.mediaApi.playPause();
        },
        play: function () {
            $scope.mediaApi.playPause();
        },
        seek: function () {

            var nowTT = parseInt(localStorage.nowPlayer);
            alert(nowTT);
            $scope.mediaApi.play();
            $timeout(function () {
                $scope.mediaApi.seekTime(nowTT);
            }, 1000);
        }
    };

    $scope.loadPlayer = function () {
        $scope.mediatype = "video";
        var mediaType = "video/mp4";
        $scope.mediaApi = {};
        //alert($scope.AppConfig.videoPlayLocalPath + $scope.form.videopath);
        $scope.nowSrc = $sce.trustAsResourceUrl("http://192.168.1.122/CollegeApp/video/2.mp4");
        $scope.config = {
            sources: [
                {
                    src: $sce.trustAsResourceUrl("http://192.168.1.122/CollegeApp/video/2.mp4"), type: mediaType
                }
            ],
            onPlayerReady: function (api) {

                $scope.mediaApi = api;
                //$interval(function () {
                //    console.log(parseInt($scope.mediaApi.currentTime / 1000));
                //    localStorage.setItem("nowPlayer", parseInt($scope.mediaApi.currentTime / 1000));
                //}, 2000)
            },
            updatetime: function (ct, duration) {
                if ($scope.mediaApi.currentTime != 0)
                    localStorage.setItem("nowPlayer", parseInt($scope.mediaApi.currentTime / 1000));
            },
            mediatype: $scope.mediatype,
            theme: "../bower_components/videogular-themes-default/videogular.css"
            , plugins: {
                //poster: $scope.AppConfig.loadVideoPicPath + $scope.form.title_pic,//"http://www.videogular.com/assets/images/videogular.png",// 
                analytics: {
                    category: "Videogular",
                    label: "Main",
                    events: {
                        ready: true,
                        play: true,
                        pause: true,
                        stop: true,
                        complete: true,
                        progress: 10
                    }
                }
            }
        };
    }();

})
.controller("videoPlayController", function ($scope, $http, getDataSource, $ionicHistory, $sce, $timeout, $rootScope, $ionicListDelegate, $stateParams, $ionicNavBarDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $ionicLoading, $ionicActionSheet, $ionicModal) {
    $scope.video = {};
    $scope.load = function () {
        var id = $stateParams.id;
        getDataSource.getDataSource("getVideoDemo", { id: id }, function (data) {
            $scope.video = data[0];
            $scope.loadPlayer();
        });
    }();

    $scope.loadPlayer = function () {
        $scope.mediatype = "video";
        var mediaType = "video/mp4";
        //alert($scope.AppConfig.videoPlayLocalPath + $scope.form.videopath);
        $scope.nowSrc = $sce.trustAsResourceUrl($scope.AppConfig.videoPlayLocalPath + $scope.video.path);
        $scope.config = {
            sources: [
                {
                    src: $sce.trustAsResourceUrl($scope.AppConfig.videoPlayLocalPath + $scope.video.path), type: mediaType
                }
            ],
            mediatype: $scope.mediatype,
            theme: "../bower_components/videogular-themes-default/videogular.css"
            , plugins: {
                //poster: $scope.AppConfig.loadVideoPicPath + $scope.form.title_pic,//"http://www.videogular.com/assets/images/videogular.png",// 
                analytics: {
                    category: "Videogular",
                    label: "Main",
                    events: {
                        ready: true,
                        play: true,
                        pause: true,
                        stop: true,
                        complete: true,
                        progress: 10
                    }
                }
            }
        };
    }
})
.controller("videoPlayGxyController", function ($scope, $http, getDataSource, $ionicHistory, $sce, $timeout, $rootScope, $ionicListDelegate, $stateParams, $ionicNavBarDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $ionicLoading, $ionicActionSheet, $ionicModal) {
    $scope.video = {};
    $scope.nowtab = "简介";
    $scope.changeTab = function (tabName) {
        $scope.nowtab = tabName;
    }
    $scope.videos = [
        {
            name: "第一讲：探索中国"
        },
        {
            name: "第二讲：探索中国"
        },
        {
            name: "第三讲：探索中国"
        },
                {
                    name: "第四讲：探索中国"
                },
                        {
                            name: "第五讲：探索中国"
                        }
    ];
    $scope.load = function () {
        var id = $stateParams.id;
        getDataSource.getDataSource("getVideoDemo", { id: id }, function (data) {
            $scope.video = data[0];
            $scope.loadPlayer();
        });
    }();

    $scope.loadPlayer = function () {
        $scope.mediatype = "video";
        var mediaType = "video/mp4";
        //alert($scope.AppConfig.videoPlayLocalPath + $scope.form.videopath);
        $scope.nowSrc = $sce.trustAsResourceUrl($scope.AppConfig.videoPlayLocalPath + $scope.video.path);
        $scope.config = {
            sources: [
                {
                    src: $sce.trustAsResourceUrl($scope.AppConfig.videoPlayLocalPath + $scope.video.path), type: mediaType
                }
            ],
            mediatype: $scope.mediatype,
            theme: "../bower_components/videogular-themes-default/videogular.css"
            , plugins: {
                //poster: $scope.AppConfig.loadVideoPicPath + $scope.form.title_pic,//"http://www.videogular.com/assets/images/videogular.png",// 
                analytics: {
                    category: "Videogular",
                    label: "Main",
                    events: {
                        ready: true,
                        play: true,
                        pause: true,
                        stop: true,
                        complete: true,
                        progress: 10
                    }
                }
            }
        };
    }
})
.controller("addresslist", function ($scope, $http, $ionicHistory, $timeout, $rootScope, $ionicListDelegate, $stateParams, $ionicNavBarDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $ionicLoading, $ionicActionSheet, $ionicModal) {
    var getmoreData = Restangular.one('AddressList/action/getList/' + sessionStorage.maincode);
    $ionicLoading.show({
        template: '加载中...',
        duration: 1000
    });
    $scope.checkedList = [];
    $scope.checkAll = {};
    $scope.cantChoose = true;
    $scope.selectUsers = function () {
        cantChoose = true;
        var list = [];
        list.push({ userid: $rootScope.user.userid, username: $rootScope.user.uname, usertype: $rootScope.user.usertype });
        for (var c in $scope.checkedList) {
            if ($scope.checkedList[c]) {
                var obj = _.find($scope.items, function (item) {
                    return item.id == c;
                });
                list.push({ userid: c, username: obj.name, usertype: 'teacher' });

            }
        }
        var p = $http.post("../api/chat/createNormalChat", { users: list, creater: $rootScope.user.userid });
        p.then(function (data) {
            $ionicHistory.goBack();
        });
    }
    $scope.canChoose = false;
    if ($stateParams.forchoose) {
        $scope.canChoose = true;
    }
    $scope.items = [];
    $scope.pyitems = [];
    $scope.query = "";
    getmoreData.getList().then(function (data) {
        $scope.addressUser = data;
        var nowDepartment = $scope.addressUser[0].department;
        var deepFirst = _.cloneDeep($scope.addressUser[0]);
        deepFirst.isdept = true;
        deepFirst.name = "";
        deepFirst.myheight = 32;
        deepFirst.isShow = true;
        $scope.items.push(deepFirst);
        $($scope.addressUser).each(function (index) {
            this.isdept = false;
            this.myheight = 0;
            this.isShow = false;
            if (this.department != nowDepartment) {
                var deep = _.cloneDeep(this);
                deep.isdept = true;
                deep.name = "";
                deep.myheight = 32;
                deep.isShow = true;
                $scope.items.push(deep);
                $scope.items.push(this);
                nowDepartment = this.department;
            }
            else {
                $scope.items.push(this);

            }
        });
        angular.forEach($scope.items, function (dept) {
            if (dept.isdept) {
                $scope.$watch("checkAll.group" + dept.id, function (d) {
                    if (d == true) {
                        angular.forEach($scope.items, function (c) {
                            if (c.department == dept.department)
                                $scope.checkedList[c.id] = true;
                        });
                    }
                    else {
                        angular.forEach($scope.items, function (c) {
                            if (c.department == dept.department)
                                delete $scope.checkedList[c.id];
                        });

                        //$scope.checkedList.push(eval("{" + c.id + ":true}"));
                    }
                });
            }
        });
        $scope.addressUser = _.cloneDeep(data);;
        $scope.addressUser = _.sortBy($scope.addressUser, function (user) { return user.py; });
        var nowPy = $scope.addressUser[0].py;
        var deepFirst = _.cloneDeep($scope.addressUser[0]);
        deepFirst.isdept = true;
        deepFirst.name = "";
        deepFirst.myheight = 32;
        deepFirst.isShow = true;
        $scope.pyitems.push(deepFirst);
        $($scope.addressUser).each(function (index) {
            this.isdept = false;
            this.myheight = 0;
            this.isShow = false;
            if (this.py != nowPy) {
                var deep = _.cloneDeep(this);
                deep.isdept = true;
                deep.name = "";
                deep.myheight = 32;
                deep.isShow = true;
                $scope.pyitems.push(deep);
                $scope.pyitems.push(this);
                nowPy = this.py;
            }
            else {
                $scope.pyitems.push(this);

            }
        });
    });
    $scope.getItemHeight = function (item, index) {
        return item.myheight;
    };
    $scope.showUserByDept = function (dept) {
        for (var i = 0; i < $scope.items.length; i++) {
            if (dept.department == $scope.items[i].department) {
                if ($scope.items[i].isShow) {
                    $scope.items[i].isShow = false;
                }
                else {
                    $scope.items[i].isShow = true;
                }
            }
        }
        $ionicScrollDelegate.resize();
    }
    $scope.showUserByPy = function (dept) {
        for (var i = 0; i < $scope.pyitems.length; i++) {
            if (dept.py == $scope.pyitems[i].py) {
                if ($scope.pyitems[i].isShow) {
                    $scope.pyitems[i].isShow = false;
                }
                else {
                    $scope.pyitems[i].isShow = true;
                }
            }
        }
        $ionicScrollDelegate.resize();
    }
    $scope.zhankai = function (dept) {
        if (!dept.isdept) {
            return;
        }
        else {
            $("div[dept='" + dept.department + "']").each(function () {
                $(this).css("display", "block").css("height", "35px");
            });
        }
    }
    $scope.showActionSheet = function (phone) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '<b>通话</b>' },
              { text: '<b>短信</b>' }
            ],
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        try {
                            window.location.href = "tel:" + phone;
                        }
                        catch (E) { } break;
                    case 1:
                        try {
                            window.location.href = "sms:" + phone;
                        }
                        catch (E) { } break;
                }
                this.hideSheet();
            }
        });
    }
    $scope.goDetial = function (id) {
        // delegate.rememberScrollPosition('my-scroll-id');
        $state.go("app.addresslistInfo", { id: id });
    };
    $scope.change = function (items, query) {
        if (query != "") {
            for (var i = 0; i < items.length; i++) {
                if (items[i].name.indexOf(query) > -1) {
                    items[i].isShow = true;
                }
                else {
                    items[i].isShow = false;
                }
            }
        }
        else {
            for (var i = 0; i < items.length; i++) {
                items[i].isShow = false;
            }
        }
    };
})
.controller("addresslistInfo", function ($rootScope, $scope, $stateParams, Restangular, $ionicNavBarDelegate, $ionicActionSheet) {
    $scope.id = $stateParams.id;
    var rest = Restangular.one("AddressList/" + $scope.id);
    rest.get().then(function (data) {
        $scope.user = data;
    });
    $scope.goBack = function () {
        $ionicNavBarDelegate.back();
    };
    $scope.phone = function (phonenumber) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '<b>通话</b>' },
              { text: '<b>短信</b>' }
            ],
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        try {
                            window.location.href = "tel:" + phonenumber;
                        }
                        catch (E) { } break;
                    case 1:
                        try {
                            window.location.href = "sms:" + phonenumber;
                        }
                        catch (E) { } break;
                }
                this.hideSheet();
            }
        });
    }
})
.controller("qingjiaListController", function ($scope, $stateParams, Restangular, $ionicNavBarDelegate, $state, getDataSource, $ionicPopup) {
    var j = sessionStorage;
    $scope.width = document.body.scrollWidth;
    var rest = Restangular.one("qingjia/action/get/" + j.stu_info_id + "/" + j.bcinfo_id + "");
    rest.get().then(function (data) {
        $scope.qingjiaData = data;
    });
    getDataSource.getDataSource("updateQingJiaRead", { xyid: j.stu_info_id, bcid: j.bcinfo_id }, function () {
    });
    $scope.chexiao = function (item) {
        if (item.SPZT == 0) {
            getDataSource.getDataSource("chexiaoQingjia", { info_id: item.INFO_ID }, function (data) {
                item.SQCX = 1;
                item.SPZT = "-2";
            });
            getDataSource.getDataSource(["chexiaoGinfo", "deleteGox"], { info_id: item.INFO_ID }, function (data) {
            });
        }
        else {
            //alert("该假条已无法撤销！");
            $ionicPopup.alert({
                title: "信息提示",
                template: "该假条已无法撤销！",
                buttons: [
                               {
                                   text: '<b>确认</b>',
                                   type: 'button-positive'
                               }
                ]
            });
        }
    }
    $scope.goBack = function () {
        $state.go("app.qingjia_Detial");
    }
    $scope.no = function () { };

    $scope.YesNo = function (functionYes, functionNo, item) {
        var confirmPopup = $ionicPopup.confirm({
            title: "撤销请假申请",
            template: "您确定要撤销该请假记录吗？",
            buttons: [
                {
                    text: '取消',
                    type: 'button-stable',
                    onTap: function () {
                        if (functionNo !== undefined)
                            functionNo();
                    }
                },
                {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: function () {
                        if (functionYes !== undefined)
                            functionYes(item);
                    }
                }
            ]
        });
    }
})
.controller("chooseAllClassController", function ($rootScope, $scope, $stateParams, Restangular, $ionicNavBarDelegate, $state, $http, cordovaService, $ionicPopup, getDataSource) {
    $scope.changeCheck = function (row, item) {
        row.checked = true;
        _.forEach(row.xxkdata, function (n, key) {
            n.checked = false;
        });
        item.checked = true;
    }
    $scope.subchoose = function (item) {
        $ionicPopup.confirm({
            okType: "button-assertive",
            okText: "确定",
            cancelText: "取消",
            title: "提示",
            template: "提交不可修改，确定要提交吗？"
        })
        .then(function (res) {
            if (res) {

                angular.forEach(item.xxkdata, function (data) {
                    if (data.checked) {
                        getDataSource.getDataSource("insertAllClassXXK", { id: getDataSource.getGUID(), userid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id, jxkc_id: data.kcid, dyid: data.xxkid }, function () {

                            _.remove($scope.notchoosexxk, function (nowdata) {
                                return nowdata == item;
                            });
                            $scope.haschoosexxk.push(item);
                        });
                    }
                });
            }
        });

    }
    getDataSource.getDataSource(["selectAllClass", "selectAllClassDetial"], { bcid: sessionStorage.bcinfo_id, bcid1: sessionStorage.bcinfo_id, userid: sessionStorage.stu_info_id }, function (data) {
        var xxk = _.find(data, function (d) {
            return d.name == "selectAllClass";
        }).data;
        var haschoosexxk = _.filter(xxk, function (d) {
            return d.ischoose == 1
        });
        var notchoosexxk = _.filter(xxk, function (d) {
            return d.ischoose == 0 && d.intime == 1
        });
        var xxkDetial = _.find(data, function (d) {
            return d.name == "selectAllClassDetial";
        }).data;
        angular.forEach(xxkDetial, function (item) {
            if (item.ischoose >= 1) {
                item.checked = true;
            }
        });
        angular.forEach(haschoosexxk, function (data) {
            data.xxkdata = [];
            angular.forEach(xxkDetial, function (xxkDetial) {
                if (xxkDetial.xxkid == data.info_id) {
                    data.xxkdata.push(xxkDetial);
                }
            });
        });
        angular.forEach(notchoosexxk, function (data) {
            data.xxkdata = [];
            angular.forEach(xxkDetial, function (xxkDetial) {
                if (xxkDetial.xxkid == data.info_id) {
                    data.xxkdata.push(xxkDetial);
                }
            });
        });
        $scope.haschoosexxk = haschoosexxk;
        $scope.notchoosexxk = notchoosexxk;
    });
})
.controller("qingjia_DetialController", function ($rootScope, $scope, $stateParams, Restangular, $ionicNavBarDelegate, $state, $http, cordovaService, $ionicPopup) {
    $(function () {
        $('#s-date').mobiscroll().date({
            theme: 'android',
            lang: 'zh',
            display: 'modal',
            mode: 'scroller',
            dateFormat: 'yy-mm-dd'
        });
        $('#s-time').mobiscroll().time({
            theme: 'android',
            lang: 'zh',
            display: 'modal',
            mode: 'scroller'
        });
        $('#e-date').mobiscroll().date({
            theme: 'android',
            lang: 'zh',
            display: 'modal',
            mode: 'scroller',
            dateFormat: 'yy-mm-dd'
        });
        $('#e-time').mobiscroll().time({
            theme: 'android',
            lang: 'zh',
            display: 'modal',
            mode: 'scroller'
        });
    })
    $scope.nowDate = new Date();
    $scope.qingjia = new Object();
    $scope.qingjia.BCINFO_ID = sessionStorage.bcinfo_id;
    $scope.qingjia.XYINFO_ID = sessionStorage.stu_info_id;
    $scope.qingjia.CREATEUSER = sessionStorage.uname;
    $scope.qingjia.BCMC = sessionStorage.bcname;
    $scope.SDATE = new Date();
    $scope.EDATE = new Date();
    $scope.qingjia.SDATE = "";
    $scope.qingjia.EDATE = "";
    $scope.qingjia.SDATETIME = "";
    $scope.qingjia.EDATETIME = "";
    $scope.qingjiatitme = [];
    var time = "";
    for (var i = 7; i <= 22; i++) {
        time = i;
        if (i < 10) {
            time = "0" + i;
        }
        $scope.qingjiatitme.push({ text: time + " 点", value: time });
    }

    $scope.newQingjia = function () {
        $state.go("app.qingjiaList");
    }
    $scope.uploadPic = function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                $scope.uploadIMG = res.localIds[0];
                //var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $("#qingjiaIMG").attr("src", res.localIds[0]);
            }
        });
    }
    $scope.save = function () {
        $("#btnSave").attr("style", "display:none;");
        var alertMes = "";
        if (!$scope.qingjia.CONTENT) {
            alertMes = "请输入请假事由!<br/>";
        }
        if (!$scope.qingjia.QJLX) {
            alertMes += "请选择请假请假类型!<br/>";
        }
        if (!$("#s-date").val()) {
            alertMes += "请选择开始日期!<br/>";
        }
        if (!$("#s-time").val()) {
            alertMes += "请选择开始时间!<br/>";
        }
        if (!$("#e-date").val()) {
            alertMes += "请选择结束日期!<br/>";
        }
        if (!$("#e-time").val()) {
            alertMes += "请选择结束时间!<br/>";
        }

        $scope.sdate = $("#s-date").val() + " " + $("#s-time").val();
        $scope.edate = $("#e-date").val() + " " + $("#e-time").val();
        $scope.qingjia.SDATE = new Date(Date.parse($scope.sdate.replace(/-/g, "/")));
        $scope.qingjia.EDATE = new Date(Date.parse($scope.edate.replace(/-/g, "/")));
        if ($scope.qingjia.SDATE > $scope.qingjia.EDATE) {
            alertMes += "结束日期不能小于开始日期!";
        }
        if ($scope.qingjia.EDATE - $scope.qingjia.SDATE > 14400000) {
            alertMes += "通过网络的请假时长必须在4个小时之内，超过4个小时请走书面的请假流程！";
        }

        if (alertMes != "") {
            $("#btnSave").attr("style", "");
            $ionicPopup.alert({
                title: "信息提示",
                template: alertMes,
                buttons: [
                               {
                                   text: '<b>确认</b>',
                                   type: 'button-positive'
                               }
                ]
            });
        }
        else {
            var c = $scope.qingjia;

            if ($rootScope.fromweixin && $rootScope.AppConfig.showQingJiaPic == true && $scope.uploadIMG) {
                wx.uploadImage({
                    localId: $scope.uploadIMG, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1,// 默认为1，显示进度提示
                    success: function (res) {
                        //$scope.qingjiaImgserverId = res.serverId; // 返回图片的服务器端ID
                        $scope.qingjia.ImgserverId = res.serverId;
                        $scope.postSave();
                    }
                });
            }
            else {
                $scope.postSave();
            }

        }
    }
    $scope.postSave = function () {

        var rest = Restangular.one("qingjia");
        $http.post("../api/qingjia", $scope.qingjia).then(function (data) {
            var data = data.data;
            //cordovaService.toast("已提交班主任审核");
            //alert("已提交班主任审核");
            $ionicPopup.alert({
                title: "信息提示",
                template: "已提交班主任审核！",
                buttons: [
                               {
                                   text: '<b>确认</b>',
                                   type: 'button-positive'
                               }
                ]
            });
            $state.go("app.index");
        });
    }
})
.controller("qingjiaDisplayController", function ($ionicHistory, $http, $scope, $rootScope, getDataSource, showAlert, $stateParams) {
    var info_id = $stateParams.info_id;
    var option = "同意";
    $scope.formData = {};
    getDataSource.getDataSource("getQingjiaDisplay", { id: info_id }, function (data) {
        $scope.data = data[0];

    }, function () {
    });
    $scope.saveNo = function () {
        option = "不同意";
        $scope.save();
    }
    $scope.save = function () {
        var postData = { option: option, info_id: info_id };
        var p = $http.post("../api/qingjia/action/qingjiasp", postData);
        p.then(function () {
            if (option = "同意") {
                showAlert.alert("您已经批准了该请假。");
            }
            else {
                showAlert.alert("您已经拒绝了该请假。");
            }
            $ionicHistory.goBack();
        })

    }

})
.controller("editStudentController", function ($scope, $rootScope, getDataSource, showAlert) {
    $scope.user = {};
    $scope.save = function () {
        if ($scope.user.newPassword1 != $scope.user.newPassword2) {
            showAlert.alert("两次密码输入不一致");
            return;
        }
        if ($scope.user.oldPassword == "") {
            showAlert.alert("请输入原密码");
            return;
        }

        if (sessionStorage.usertype == "teacher") {
            $scope.md5password = hex_md5($scope.user.oldPassword);
            getDataSource.getDataSource("checkTeacherPSD", { password: $scope.user.oldPassword, onecard: sessionStorage.userid }, function (data) {
                if (data[0].hasuser == 0) {
                    showAlert.alert("原密码填写错误");
                }
                else {
                    getDataSource.getDataSource("updateTeacherPSD", { password: $scope.user.newPassword1, md5psd: $scope.md5password, onecard: sessionStorage.userid }, function (data) {
                        showAlert.alert("密码修改成功");
                    });
                }
            });
        }
        else {
            getDataSource.getDataSource("checkPSD", { password: $scope.user.oldPassword, onecard: sessionStorage.userid }, function (data) {
                if (data[0].hasuser == 0) {
                    showAlert.alert("原密码填写错误");
                }
                else {
                    getDataSource.getDataSource("updateStudentPSD", { password: $scope.user.newPassword1, onecard: sessionStorage.userid }, function (data) {
                        showAlert.alert("密码修改成功");
                    });
                }
            });
        }
    }

})
.controller("index_videoController", function ($scope) {
    $scope.datameSource = [
        { src: "1e653389-c007-435a-8135-ce867ec9c2cf.jpg" },
        { src: "290e8aec-5bc9-496c-af1e-e2ea7323be8d.jpg" },
        { src: "a330060e-3db8-4740-84aa-65ec705cbf5f.jpg" },
        { src: "f92c44e4-bbd6-498d-864b-62ab0f331bf4.jpg" }
    ]

})
.controller("studentSbfController", function ($scope, $stateParams, Restangular, $ionicActionSheet, getDataSource) {
    //大类
    $scope.dataStyle = [];
    //相关分类
    $scope.dataItem = [];

    $scope.keyword = "";

    getDataSource.getDataSource(["getDL", "getAllScore", "getScoreDt"], { bcid: sessionStorage.bcinfo_id, onecard: sessionStorage.userid }, function (data) {
        $scope.dataItem = _.find(data, function (d) {
            return d.name == "getAllScore";
        }).data;
        $scope.dataStyle = _.find(data, function (d) {
            return d.name == "getDL";
        }).data;
        $scope.dataScoreDt = _.find(data, function (d) {
            return d.name == "getScoreDt";
        }).data;
    });
})
.controller("studentListController", function ($rootScope, $http, $scope, $stateParams, Restangular, $ionicActionSheet, getDataSource, $state, showAlert, $ionicHistory) {
    //学员
    $scope.dataStu = [];
    //小组
    $scope.dataXZ = [];

    $scope.keyword = "";
    $scope.checkedList = [];
    //是否带选择框
    $scope.canchoose = false;
    if ($stateParams.canchoose) {
        $scope.canchoose = true;
    }
    $scope.checkAll = {};
    $scope.$watch("checkAll.bzr", function (data) {
        if (data == true) {
            angular.forEach($scope.dataBzr, function (c) {
                $scope.checkedList[c.id] = true;
            });
        }
        else {
            angular.forEach($scope.dataBzr, function (c) {
                delete $scope.checkedList[c.id];
            });

            //$scope.checkedList.push(eval("{" + c.id + ":true}"));
        }
    });
    $scope.$watch("checkAll.classTeacher", function (data) {
        if (data == true) {
            angular.forEach($scope.dataClassTeacher, function (c) {
                $scope.checkedList[c.id] = true;
            });
        }
        else {
            angular.forEach($scope.dataClassTeacher, function (c) {
                delete $scope.checkedList[c.id];
            });

            //$scope.checkedList.push(eval("{" + c.id + ":true}"));
        }
    })
    $scope.selectUsers = function () {
        $scope.cantChoose = true;
        var list = [];
        var userid = $rootScope.user.userid;
        if ($rootScope.user.usertype == 'student') {
            userid = $rootScope.user.stu_info_id;
        }
        list.push({ userid: userid, username: $rootScope.user.uname, usertype: $rootScope.user.usertype });
        for (var c in $scope.checkedList) {
            if ($scope.checkedList[c]) {
                var obj = _.find($scope.dataStu, function (item) {
                    return item.id == c;
                });
                if (obj) {
                    list.push({ userid: c, username: obj.bt, usertype: 'student' });
                }
                obj = _.find($scope.dataClassTeacher, function (item) {
                    return item.id == c;
                });
                if (obj) {
                    list.push({ userid: c, username: obj.uname, usertype: 'teacher' });
                }
                obj = _.find($scope.dataBzr, function (item) {
                    return item.id == c;
                });
                if (obj) {
                    list.push({ userid: c, username: obj.bt, usertype: 'teacher' });
                }
            }
        }

        var p = $http.post("../api/chat/createNormalChat", { users: list, creater: userid });
        p.then(function (data) {
            $ionicHistory.goBack();
        });
    }

    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    $scope.marTop = "margin-top:0px";
    if (isAndroid) {
        $scope.marTop = "margin-top:0px";
    }
    if (isIOS) {
        $scope.marTop = "margin-top:15px";
    }

    getDataSource.getDataSource(["getXZ", "getAllStu", "getBzrXx", "getClassTeacher"], { classid: sessionStorage.bcinfo_id }, function (data) {
        $scope.dataStu = _.find(data, function (d) {
            return d.name == "getAllStu";
        }).data;
        $scope.dataXZ = _.find(data, function (d) {
            return d.name == "getXZ";
        }).data;
        angular.forEach($scope.dataXZ, function (d) {
            $scope.$watch("checkAll.group" + d.id, function (newD) {
                var xzName = _.find($scope.dataXZ, function (xnN) {
                    return xnN.id == d.id;
                }).name;
                if (newD == true) {
                    angular.forEach($scope.dataStu, function (c) {
                        if (c.xz != xzName) {
                            return;
                        }
                        $scope.checkedList[c.id] = true;
                    });
                }
                else {
                    angular.forEach($scope.dataStu, function (c) {
                        if (c.xz != xzName) {
                            return;
                        }
                        delete $scope.checkedList[c.id];
                    });
                }
            })
        })
        $scope.dataBzr = _.find(data, function (d) {
            return d.name == "getBzrXx";
        }).data;
        $scope.dataClassTeacher = _.find(data, function (d) {
            return d.name == "getClassTeacher";
        }).data;
    });

    $scope.showgroup = function (rowData, keyword) {
        if (keyword == "") {
            return true;
        } else {
            var stugroup = _.filter($scope.dataStu, function (d) {
                return rowData.name == d.xz;
            });
            if (stugroup != null && stugroup.length > 0) {
                var stus = _.filter(stugroup, function (d) {
                    return d.bt.indexOf(keyword) > -1;
                });
                if (stus != null && stus.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    $scope.show = function (phoneNumber) {
        if (phoneNumber == null || phoneNumber == "") {
            showAlert.alert("暂无手机号");
            //alert("暂无手机号");
            return;
        }
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '<b>通话</b>' },
              { text: '<b>短信</b>' }
            ],
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        try {
                            window.location.href = "tel:" + phoneNumber;
                        }
                        catch (E) { } break;
                    case 1:
                        try {
                            window.location.href = "sms:" + phoneNumber;
                        }
                        catch (E) { } break;
                }
                this.hideSheet();
            }
        });
    };
    $scope.phone = function (phoneNumber) {
        window.event.cancelBubble = true;
    };
    $scope.mail = function (phoneNumber) {
        try {
            box.smsto(phoneNumber);
        }
        catch (e) { };
    };

    $scope.gotoDetial = function (info_id) {
        $state.go("app.studentListInfo", { studentid: info_id });
    }
})
    .controller("studentListInfoController", function ($scope, $stateParams, Restangular, $ionicActionSheet, getDataSource, showAlert, $rootScope) {
        // 学员头像路径
        $scope.userphotoPath = $rootScope.AppConfig.userphotoPath;
        getDataSource.getDataSource("getStudentInfo", { id: $stateParams.studentid }, function (data) {
            $scope.dataStu = data;
        });
        $scope.phone = function (phoneNumber) {
            window.event.cancelBubble = true;
            try {
                box.telto(phoneNumber);
            }
            catch (e) { };
        };
        $scope.mail = function (phoneNumber) {
            window.location.href = "sms:" + phoneNumber;
        };
    })
.controller("calendarController", function ($scope, $document, Restangular) {
    var today = new Date();
    $scope.today = today;
    $scope.nowDayData = [];
    $scope.minDate = new Date(today.getFullYear(), 0, 1);
    $scope.maxDate = new Date(today.getFullYear(), 11, 31);
    $scope.changeDay = function (s) {
        var rest = Restangular.one("Calendar/action/getCalendar/" + sessionStorage.userid + "/" + s._value.toDateString());
        rest.getList().then(function (date) {
            $scope.nowDayData = date;
        });
    };
    $scope.format = function (date, element) {
        var j = "";
    };
    $scope.updateMonth = function () {
        var c = "";
    };
    $scope.wijimo = new Object();
    $document.ready(function () {
        var calendar = new wijmo.input.Calendar("#theCalendar", {
            firstDayOfWeek: 1,
            itemFormatter: function (d, element) {
                var rest = Restangular.one("Calendar/action/getCalendar/" + sessionStorage.userid + "/" + d.toDateString());
                rest.getList().then(function (date) {
                    if (date.length > 0) {
                        wijmo.addClass(element, 'red');
                    }
                    else {
                        wijmo.removeClass(element, 'red');
                    }
                });
            }
        });
        calendar.valueChanged.addHandler($scope.changeDay);
    });
})
.controller("xinlangController", function ($scope, $document, Restangular) {
    var getmoreData = Restangular.one('AddressList');
    $scope.users = [];
    getmoreData.getList().then(function (data) {
        $scope.users = data;
    });
})
.controller("testpageController", function ($scope, $document, Restangular, cordovaService) {
    $scope.opennewFile = function (url) {
        $("#myframe").attr("src", "https://61.139.79.231/collegeapp/apk/移动图书馆V6.1.1.apk");
    }
    //$("#myframe").attr("src", "https://61.139.79.231/collegeapp/apk/移动图书馆V6.1.1.apk");
})
.controller("mapController", function ($scope, $http, $rootScope, $timeout) {
    var map;
    var pointPeoplesSquare = new BMap.Point(121.479394, 31.238743);//People's Square of Shanghai
    var labelCELAP = $rootScope.AppConfig.title;
    var pointCELAP = new BMap.Point($rootScope.AppConfig.map.x, $rootScope.AppConfig.map.y); //new BMap.Point(121.549004, 31.201835);//CELAP
    var pointCurrent = null;
    var pointDest = pointCELAP;
    var currentRouteType = 'transit';
    var loadFlag = false;

    $scope.load = function () {
        map = new BMap.Map("l-map");
        initNavigate();
    };
    $scope.load();

    function initNavigate() {
        locateToDest();
        getPosition();
    }

    function locateToDest(isDelay) {
        var timeout = 0;
        if (isDelay) {
            timeout = 1500;
        }
        setTimeout(function () {
            var marker = new BMap.Marker(pointDest);
            var label = new BMap.Label(labelCELAP, { offset: new BMap.Size(20, -10) });
            marker.setLabel(label);
            map.addOverlay(marker);
            map.centerAndZoom(pointDest, 12);
        }, timeout);
    }

    $scope.switchMapType = function (type) {
        if (type) {
            currentRouteType = type;
        }
        console.log(currentRouteType);
        if (pointCurrent) {
            console.log("pointCurrent:" + pointCurrent.lng + "," + pointCurrent.lat);
        } else {
            console.log("pointCurrent:" + "null" + "," + "null");
        }
        if (pointDest) {
            console.log("pointDest:" + pointDest.lng + "," + pointDest.lat);
        } else {
            console.log("pointDest:" + "null" + "," + "null");
        }
        getPosition();
    }

    function onPositionSuccess(point, status) {
        if (status == BMAP_STATUS_SUCCESS) {
            //showAlert.alert("定位成功");
            if (point) {
                console.log("定位成功:" + point.lng + "," + point.lat);
            }
            var mk = new BMap.Marker(point);
            map.panTo(point);
            pointCurrent = point;

            searchRoute();

            //$scope.switchMapType(currentRouteType);
        } else {
            pointCurrent = null;
            showAlert.alert("定位失败，错误代码(" + status + ")");
            locateToDest(true);
        }
    }

    function searchRoute() {
        var cacheLoadFlag = loadFlag;
        if (pointCurrent) {
            map.clearOverlays();
            var route;
            var options = {
                renderOptions: { map: map, panel: "r-result", autoViewport: true },
                onSearchComplete: function (results) {
                    if (route.getStatus() == BMAP_STATUS_SUCCESS) {
                        $timeout(
                        function () {
                            $("a").each(function (index) {
                                if ($(this).html() == "到百度地图查看»") {
                                    $(this).css("display", "none");
                                }
                            });
                        }, 200);

                        //showAlert.alert("");
                    } else {
                        if (cacheLoadFlag) {
                            showAlert.showToast("没有合适线路");//
                        }
                        locateToDest(true);
                    }
                }
            };
            if (currentRouteType == "driving") {//驾车
                route = new BMap.DrivingRoute(map, options);
            } else if (currentRouteType == "walking") {//步行
                route = new BMap.WalkingRoute(map, options);
            } else {//公交
                route = new BMap.TransitRoute(map, options);
            }
            route.search(pointCurrent, pointDest);
        } else {
            showAlert.alert("当前位置获取失败");
        }
    }

    function getPosition() {
        //浏览器自带定位
        var geo = new BMap.Geolocation();
        geo.getCurrentPosition(function (r) {
            var status = this.getStatus();
            onPositionSuccess(r, status);
        }, { enableHighAccuracy: true });
        //关于状态码
        //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
        //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
        //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
        //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
        //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
        //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
        //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
        //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
        //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
    }
})
.controller("chatuserinfoController", function ($http, getDataSource, showAlert, $ionicActionSheet, $ionicHistory, cordovaService, $rootScope, $scope, $state, $stateParams, $ionicScrollDelegate, $timeout, $interval) {
    var userid = $stateParams.userid;
    var usertype = $stateParams.usertype;
    var p = $http.post("../api/chat/getUserInfo", { userid: userid, usertype: usertype });
    $scope.user = {};
    p.then(function (data) {
        var user = data.data;
        if (user.avatar) {
            user.avatarpath = "../formImg/" + user.avatar;
        }
        else {
            user.avatarpath = "../formImg/touxiang.jpg";
        }
        $scope.user = user;
    });
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
})
.controller("VhallVideoTestController", function ($http, $timeout, $scope, getDataSource, showAlert, $interval) {
    $scope.title = "视频测试";
    var player1 = {};
    var forChangeTime = 0;
    $timeout(function () {
        player1Obj = {
            'width': '100%',
            'height': '100%',
            'vid': '873c41fa751274984da1b58c52467ba5_8',
            'flashvars': {
                "autoplay": "false",
                "teaser_time": "0",
                "setScreen": "16_9",
                "history_video_duration": "10",
                "setVolumeM": "1",
                "ban_ui": "off",
                "ban_control": "off",
                "is_auto_replay": "off",
                "ban_skin_progress_dottween": "on"
            }
        };

        player1Obj.flashvars.watchStartTime = 500;
        //player1Obj.flashvars.ban_seek_by_limit_time = "on";
        player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
    }, 1000);

    var timer = {};
    s2j_onVideoPlay = function () {
        $interval.cancel(timer);
        timer = $interval(function () {

            $scope.nowtime = player1.j2s_getCurrentTime();
            console.log($scope.nowtime);
        }, 1000);
    }
    s2j_onPlayerInitOver = function () {
        console.log("初始化完成");
        if ($scope.nowtime) {
            $timeout(function () {
                player1.j2s_seekVideo(forChangeTime);
            }, 1000);
        }
    }
    $scope.pause = function () {
        player1.j2s_pauseVideo();
    }
    $scope.play = function () {
        player1.j2s_resumeVideo();
    }
    $scope.changeVid1 = function () {
        forChangeTime = player1.j2s_getCurrentTime();
        player1.j2s_resumeVideo();
        player1.changeVid("873c41fa756635bf24debea5bcc226e5_8");
    }
    $scope.changeVid2 = function () {
        forChangeTime = player1.j2s_getCurrentTime();
        player1.j2s_resumeVideo();
        player1.changeVid("873c41fa751274984da1b58c52467ba5_8");
    }
})
.controller("chatsettingController", function ($http, getDataSource, showAlert, $ionicActionSheet, $ionicHistory, cordovaService, $rootScope, $scope, $state, $stateParams, $ionicScrollDelegate, $timeout, $interval) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    //如果是该聊天组创建人，则允许修改聊天组名称
    $scope.canEditChatName = false;
    var chatgroupid = $stateParams.chatid;
    var tempName = $stateParams.chatName;
    $scope.chat = { chatName: tempName };
    $scope.userList = [];
    var nowuserid = $rootScope.user.userid;
    if ($rootScope.user.usertype == 'student') {
        nowuserid = $rootScope.user.stu_info_id;
    }
    $scope.goInfo = function (item) {
        $state.go("chatuserinfo", { userid: item.userid, usertype: item.usertype }, function () {

        });
    }
    $scope.saveName = function () {
        getDataSource.getDataSource("updateChatGroupName", { name: $scope.chat.chatName, groupid: chatgroupid }, function (data) {
            showAlert.showLoading(1000, "保存成功");
        });
    }
    $scope.getAvatar = function () {
        getDataSource.getDataSource("getChatAdmin", { groupid: chatgroupid }, function (data) {
            var info = data[0];
            var userid = $rootScope.user.userid;
            if ($rootScope.user.usertype == "student") {
                userid = $rootScope.user.stu_info_id;
            }
            if (info.adminid == userid && info.category != 2) {
                $scope.canEditChatName = true;
            }
        });
        getDataSource.getDataSource("getChatUserInfo", { groupid: chatgroupid, nowuser: nowuserid }, function (data) {
            angular.forEach(data, function (item) {
                if (item.avatarpath) {
                    item.avatar = "../formImg/" + data[0].avatarpath;
                }
                else {
                    item.avatar = "../formImg/touxiang.jpg";
                }
            });
            $scope.userList = data;
        });
    }();
})
.controller("chatlistController", function ($ionicPopup, $http, getDataSource, showAlert, $ionicActionSheet, $ionicHistory, cordovaService, $rootScope, $scope, $state, $stateParams, $ionicScrollDelegate, $timeout, $interval) {
    var uid = $rootScope.user.userid;
    if ($rootScope.user.usertype == "student") {

        uid = $rootScope.user.stu_info_id;
    }
    $scope.uid = uid;
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    $scope.chatList = [];
    $scope.selectUser = function () {
        $state.go("app.addresslist", { title: '选择人员', forchoose: 'true' });
    }
    $scope.isteacher = false;
    if ($rootScope.user.usertype != "student") {
        $scope.isteacher = true;
    }
    $scope.selectStudent = function () {
        $state.go("app.studentList", { canchoose: true });
    }
    $scope.goSetting = function (item) {
        $state.go("chatsetting", { chatid: item.id, chatName: item.name });
    }
    $scope.doRefresh = function () {
        Load();
    }
    $scope.showConform = function (item) {
        $ionicPopup.confirm({
            title: "删除聊天组",
            template: "该操作将解散该聊天组，您确认要这么做?",
            buttons: [
                {
                    text: '取消',
                    type: 'button-stable',
                    onTap: function () {
                    }
                },
                {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: function () {
                        $scope.deleteGroup(item);
                    }
                }
            ]
        });
    }

    $scope.deleteGroup = function (item) {
        getDataSource.getDataSource(["deleteChatGroup", "deleteChatGroupUser"], { id: item.id, id1: item.id }, function () {
            $scope.chatList = _.remove($scope.chatList, function (n) {
                return n != item;
            });
        });
    }
    $scope.exitGroup = function (item) {
        getDataSource.getDataSource("deleteChatUser", { userid: uid, groupid: item.id }, function (data) {
            Load();
        });
    }
    var Load = function () {


        if ($rootScope.user.bcinfo_id) {
            var p = $http.post("../api/chat", { bcid: $rootScope.user.bcinfo_id, userid: uid, username: $rootScope.user.uname, usertype: $rootScope.user.usertype });
            p.then(function (info) {
                getDataSource.getDataSource("getChatGroup", { userid: uid }, function (newuser) {
                    $scope.chatList = newuser;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            })
        }
        else {
            getDataSource.getDataSource("getChatGroup", { userid: uid }, function (newuser) {
                $scope.chatList = newuser;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }
    Load();

    $scope.goChat = function (item) {
        $state.go("classChat", { chatgroupid: item.id });
    }
})
.controller("classChatController", function ($http, $state, $ionicHistory, $ionicLoading, getDataSource, showAlert, $ionicActionSheet, cordovaService, $rootScope, $scope, $stateParams, $ionicScrollDelegate, $timeout, $interval) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var txtInput; // ^^^
    var chatgroupid = $stateParams.chatgroupid;
    //是否滚动到顶部，可以继续获取新的历史聊天记录
    var canGetNewMessage = true;
    //是否已经获取了所有的历史聊天记录
    $scope.isGetAllMessage = false;

    var connection = {};
    $scope.avatarList = [];
    $scope.goBack = function () {
        var userid = $rootScope.user.userid;
        if ($rootScope.user.usertype == "student") {
            userid = $rootScope.user.stu_info_id;
        }
        //记录离开聊天室
        getDataSource.getDataSource("leaveChat", { userid: userid, leavetime: new Date() }, function (data) {
            chat.server.disConnection();
            chat.connection.stop();
            $ionicHistory.goBack();
        });

    }
    var nowUserid = $rootScope.user.userid;
    if ($rootScope.user.usertype == "student") {
        nowUserid = $rootScope.user.stu_info_id;
    }
    showAlert.showLoading(10000, "正在加载聊天信息");

    $scope.nowUser = {
        userid: nowUserid
    }
    function replace_em(str) {
        str = str.replace(/</g, '<；');
        str = str.replace(/>/g, '>；');
        str = str.replace(/ /g, '<；br/>；');
        str = str.replace("[\[em_([0-9]*)\]]", "<img src=\"/arclist/$1.gif\" />");
        return str;
    }
    //页面离开前
    $scope.$on("$ionicView.beforeLeave", function () {
        //chat.server.disConnection();
        //chat.connection.stop();
    });
    //页面进入
    $scope.$on('$ionicView.enter', function () {

        //getMessages();

        $timeout(function () {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        messageCheckTimer = $interval(function () {
            // here you could check for new messages if your app doesn't use push notifications or user disabled them
        }, 20000);
    });
    //离开页面
    $scope.$on('$ionicView.leave', function () {
        //var userid = $rootScope.user.userid;
        //if ($rootScope.user.usertype == "student") {
        //    userid = $rootScope.user.stu_info_id;
        //}
        //getDataSource.getDataSource("leaveChat", { userid: userid, leavetime: new Date() }, function (data) {
        //});
    });

    $scope.getAvatar = function () {
        getDataSource.getDataSource("getChatAvatar", { groupid: chatgroupid }, function (data) {
            $scope.avatarList = data;
        });
    }();


    var chat = {};
    //加载聊天
    $timeout(function () {
        $(function () {
            //$("#saytext").bind("input propertychange change", function (data) {
            //    $scope.input.message = $("#saytext").val();
            //});

            //获取本聊天室的过去消息
            getDataSource.getDataSource("getNewMessage", { chatid: chatgroupid }, function (data) {
                angular.forEach(data, function (c) {
                    var newMessage = {
                        userId: c.senduserid,
                        date: c.sendtime,
                        text: c.messagecontent,
                        id: c.id,
                        username: c.sendusername,
                        messageType: c.messagetype,
                        avatarPath: c.avatarpath
                    };
                    if (newMessage.messageType == "picture") {
                        newMessage.text = "../formImg/" + newMessage.text;
                    }
                    //查找头像
                    putAvatar(newMessage);
                    $scope.messages.push(newMessage);




                });
                $timeout(function () {
                    viewScroll.resize();
                    viewScroll.scrollBottom(true);
                }, 0);
                $timeout(function () {
                    $("#myContent").css("overflow", "auto");
                }, 1000);
            });
            //获取本人头像
            getDataSource.getDataSource("getAvatar", { userid: nowUserid }, function (data) {
                if (data.length > 0) {
                    $scope.nowUser.avatar = "../formImg/" + data[0].avatarpath;
                }
                else {
                    $scope.nowUser.avatar = "../formImg/touxiang.jpg";
                }
            });
            $.getScript($rootScope.AppConfig.signalRHub)
            .done(function (script, textStatus) {
                connection = $.connection;
                $.connection.hub.url = $rootScope.AppConfig.signalRHub;
                chat = $.connection.chatHub;
                //接受信息
                chat.client.broadcastMessage = function (data) {
                    var newMessage = {
                        userId: data.userid,
                        date: data.dateTime,
                        text: data.message,
                        username: data.name,
                        id: data.id,
                        messageType: data.messageType
                    };
                    if (newMessage.messageType == "picture") {
                        newMessage.text = "../formImg/" + newMessage.text;
                    }
                    putAvatar(newMessage);
                    $scope.messages.push(newMessage);
                    $scope.$apply();
                    var view = viewScroll.getScrollView();
                    var p = viewScroll.getScrollPosition();
                    //有新消息时用户在滚动屏幕，滚动条不在最底部，则给出新消息提示
                    if (view.__contentHeight - p.top > 1200) {
                        $ionicLoading.show({
                            template: "您有新消息",
                            noBackdrop: true,
                            duration: 2000
                        });
                    }
                    else {
                        $timeout(function () {

                            viewScroll.scrollBottom(true);
                        }, 0);
                    }
                };
                chat.client.repeatLogin = function () {
                    //var j = window.confirm("您已重复登录")
                    //if (j || !j) {
                    //    window.close();
                    //}
                    console.log("已重复登陆");
                }
                $.connection.hub.start(function () {

                    chat.server.addConnection(nowUserid);
                    //加入聊天室，同一个班级一个聊天室
                    chat.server.joinRoom(chatgroupid);
                    showAlert.hideLoading();
                }, function (data) {
                    showAlert.alert("聊天组件存在错误");
                });
            });

        });
    }, 0);

    $scope.doAvatar = function () {
        if (!$rootScope.fromweixin) {
            cordovaService.takePicture(function (fileurl) {
                cordovaService.upLoadPic(fileurl, nowUserid, function (fileName) {
                    getDataSource.getDataSource("selectHasAvatar", { userid: nowUserid }, function (data) {
                        var hasAvatar = data[0].hasavatar;
                        if (hasAvatar > 0) {
                            getDataSource.getDataSource("updateAvatar", { userid: nowUserid, avatarpath: fileName }, function () { });
                        }
                        else {
                            getDataSource.getDataSource("insertAvatar", { userid: nowUserid, avatarpath: fileName }, function () { });
                        }
                    });
                    $scope.nowUser.avatar = "../formImg/" + fileName;
                })
            });
        }
        else {
            wx.chooseImage({

                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    var firstPic = localIds[0];
                    wx.uploadImage({
                        localId: firstPic, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1,// 默认为1，显示进度提示
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            //alert(serverId);
                            //alert("../Api/uploadPic/" + serverId + "/" + $rootScope.user.info_id + "/" + $rootScope.user.type);
                            $http.get("../Api/uploadPic/" + serverId + "/" + nowUserid).then(function (result) {
                                $scope.nowUser.avatar = "../formImg/" + result.data.fileName;
                            });
                        }
                    });
                }
            });
        }
    }
    //加载一条消息的头像
    var putAvatar = function (message) {
        var avatarMarch = _.find($scope.avatarList, function (item) {
            return item.userid == message.userId;
        });
        if (avatarMarch) {
            message.avatarpath = avatarMarch.avatarpath;
        }
        else {
            message.avatarpath = "../formImg/touxiang.jpg";
        }
    }

    $scope.chooseImg = function () {

        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '<b>拍照</b>' },
              { text: '<b>视频</b>' },
              { text: '<b>附件</b>' }
            ],
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        try {
                            cordovaService.takePicture(function (fileurl) {
                                cordovaService.upLoadPic(fileurl, nowUserid, function (fileName) {
                                    chat.server.send($rootScope.user.uname, fileName, chatgroupid, "picture");

                                })
                            });
                        }
                        catch (E) { } break;
                    case 1:
                        try {
                            cordovaService.takeVideo(function (fileurl) {
                                cordovaService.upLoadPic(fileurl, nowUserid, function (fileName) {
                                    chat.server.send($rootScope.user.uname, fileName, chatgroupid, "picture");

                                })
                            });
                        }
                        catch (E) { } break;
                }
                hideSheet();
            }
        });

    }
    //复制信息
    $scope.onMessageHold = function (e, itemIndex, message) {
        $ionicActionSheet.show({
            buttons: [{
                text: '复制内容'
            }, {
                text: '删除消息'
            }],
            buttonClicked: function (index) {
                switch (index) {
                    case 0: // Copy Text
                        cordova.plugins.clipboard.copy(message.text);
                        break;
                    case 1: // Delete
                        // no server side secrets here :~)
                        $scope.messages.splice(itemIndex, 1);
                        $timeout(function () {
                            viewScroll.resize();
                        }, 0);

                        break;
                }

                return true;
            }
        });
    };
    //加载过去历史消息
    $scope.scrollContent = function () {
        if ($scope.messages.length == 0) {
            return;
        }
        var view = viewScroll.getScrollView();
        var p = viewScroll.getScrollPosition();
        var nowId = $scope.messages[0].id;
        //如果用户滚动到头部了，则可以获取新数据
        if (p.top < 10 && canGetNewMessage == true && $scope.isGetAllMessage == false && $scope.messages.length > 1) {
            showAlert.showLoading(10000, "正在加载聊天信息");
            canGetNewMessage = false;
            getDataSource.getDataSource("getNewMessageOver", { chatid: chatgroupid, lastsendtime: $scope.messages[0].date, lastid: $scope.messages[0].id }, function (data) {
                angular.forEach(data, function (c) {
                    var newMessage = {
                        userId: c.senduserid,
                        date: c.sendtime,
                        text: c.messagecontent,
                        username: c.sendusername,
                        messageType: c.messagetype,
                        avatarPath: c.avatarpath
                    };
                    if (newMessage.messageType == "picture") {
                        newMessage.text = "../formImg/" + newMessage.text;
                    }
                    //查找头像
                    putAvatar(newMessage);
                    $scope.messages.unshift(newMessage);
                });
                //如果数据少于30条说明该聊天组已经获取完所有聊天记录了
                if (data.length < 30) {
                    $scope.isGetAllMessage = true;

                }

                canGetNewMessage = true;
                $timeout(function () {
                    var lastEle = $("#" + nowId).position();
                    viewScroll.scrollBy(0, lastEle.top, false);
                    showAlert.hideLoading();
                    viewScroll.resize();

                }, 100);

            });

        }
    }
    $scope.loadMoreData = function () {
        console.log("loadMore");
    }
    //查看对方信息
    $scope.viewProfile = function () {
        console.log("查看个人信息");
    }
    $scope.messages = [];
    $scope.doneLoading = true;
    //发送消息
    $scope.sendMsg = function () {
        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        keepKeyboardOpen();

        //$scope.messages.push({
        //    userId: '534b8fb2aa5e7afc1b23e69c',
        //    date: new Date(),
        //    text: $scope.input.message
        //});

        //$scope.messages.push({
        //    userId: '534b8e5aaa5e7afc1b23e69b',
        //    date: new Date(),
        //    text: 'ceshixiaoxi'
        //});
        var inputVal = $("#saytext").val();
        chat.server.send($rootScope.user.uname, inputVal, chatgroupid, "text");
        $scope.input.message = "";
        $("#saytext").val("");
        //$timeout(function () {
        //    keepKeyboardOpen();
        //    viewScroll.scrollBottom(true);
        //}, 0);
    }
    //预览图片
    $scope.previewPic = function (message) {
        $state.go("previewImg", { id: message.id });
    }
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
        //console.log('keepKeyboardOpen');
        txtInput.one('blur', function () {

            txtInput[0].focus();
        });
    }
})
.controller("previewImgController", function ($scope, getDataSource, $stateParams, $ionicHistory) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    $scope.img = "";
    $scope.h = window.screen.height;


    $scope.w = document.body.clientWidth;
    var id = $stateParams.id;
    getDataSource.getDataSource("testHBB", {  }, function (data) {
        console.log(data);
    });

})
.controller("weekClassController", function ($scope, $stateParams, Restangular, $ionicActionSheet, $ionicPopup, $timeout, $location, $http, $ionicPopover, $ionicScrollDelegate, $rootScope, getDataSource, downService) {
    var d = $stateParams;
    $scope.nowbc = new Object();
    $scope.bclist = [];
    $scope.nowBCid = 0;

    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    $scope.marTop = "margin-top:0px";
    $scope.marConTop = "top:170px;";
    if (isAndroid) {
        $scope.marTop = "margin-top:0px";
    }
    if (isIOS) {
        $scope.marTop = "margin-top:15px";
        $scope.marConTop = "top:183px;";
    }

    $scope.weekDayClass = [];
    $scope.nowClass = {};
    var nowDate = new Date();
    //添加备注
    $scope.dobz = function (data) {
        $scope.nowclass = data;
        if ($scope.nowBCid != $rootScope.user.bcinfo_id) {
            return;
        }
        if (sessionStorage.usertype == "student") {
            return;
        };
        $scope.popoverbz.show();
    };
    $scope.saveBZ = function () {
        getDataSource.getDataSource("updateKCWHBZ", $scope.nowclass, function (data) {
            $scope.displayPropbz();
        });
    }
    $scope.usertype = sessionStorage.usertype;
    $scope.nowday = new Date(nowDate.getFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate());
    var s = $scope.nowday.Format("yyyy-MM-dd HH:mm:ss");
    $scope.nowWeekStart = $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay()));
    $scope.nowWeekEnd = $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1);
    // 成都党校APP 一周课表 切换班级
    $scope.changeClass = $rootScope.AppConfig.changeClass;
    $scope.gonext = function () {
        $scope.weekDayClass = [];
        $scope.nowbc = [];
        $scope.bclist = [];
        $scope.nowday = $scope.nowday.DateAdd("w", 1);
        $scope.getDate();
        $scope.nowWeekStart = $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay()));
        $scope.nowWeekEnd = $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1);
        $ionicScrollDelegate.scrollTop();
    };
    var sddd = sessionStorage;
    $scope.goprev = function () {
        $scope.weekDayClass = [];
        $scope.nowbc = [];
        $scope.bclist = [];
        $scope.nowday = $scope.nowday.DateAdd("w", -1);
        $scope.getDate();
        $scope.nowWeekStart = $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay()));
        $scope.nowWeekEnd = $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1);
        $ionicScrollDelegate.scrollTop();
    };
    var prop = null;
    var myPopup = null;
    $ionicPopover.fromTemplateUrl('../templates/selectbc.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $ionicPopover.fromTemplateUrl('../templates/setKCBZ.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popoverbz = popover;
    });
    $scope.showPopup = function ($event) {
        if (sessionStorage.usertype == "student") {
            return;
        };
        $scope.data = {}
        $scope.popover.show();
    };
    $scope.displayProp = function () {
        $scope.popover.hide();
    };
    $scope.displayPropbz = function () {
        $scope.popoverbz.hide();
    }
    $scope.selectOne = function (c) {
        $scope.showNull = false;
        $scope.nowbc = _.find($scope.bclist, function (bc) {
            return bc.info_id == c;
        });
        $scope.weekDayClass = _.sortBy($scope.weekDayClass, function (item) {
            return item[0].kssj;
        });
        $scope.weekDayClass = _.groupBy($scope.nowbc.dayclass, function (weekclass) {
            return weekclass.dayWeek;
        });
        for (var i in $scope.weekDayClass) {
            $scope.showNull = true;
        }
        //当前选中的班次ID
        $scope.nowBCid = c;
        $scope.popover.hide();
    };
    $scope.getDate = function () {
        $scope.showNull = false;
        //var rest = Restangular.one("WeekClass/action/GetWeekClass/" + $scope.nowday.toDateString());
        var rest = $http.get("../api/WeekClass/action/GetWeekClass/" + $scope.nowday.toDateString());
        rest.then(function (data1) {
            var data = data1.data;
            $scope.bclist = data;
            if (data.length > 0) {
                if ($rootScope.user.usertype == "student") {
                    var list = _.find(data, function (bc) {
                        return bc.info_id == sessionStorage.bcinfo_id;
                    });
                    if (list) {
                        $scope.nowbc = list;
                    }
                }
                else {
                    if ($scope.nowBCid != 0) {
                        var list = _.find(data, function (bc) {
                            return bc.info_id == $scope.nowBCid;
                        });
                        if (list) {
                            $scope.nowbc = list;
                        }
                    }
                    else {
                        $scope.nowbc = data[0];
                    }
                }
            }
            else {
                $scope.nowbc = new Object();
            }
            $scope.weekDayClass = _.sortBy($scope.weekDayClass, function (item) { return item; });
            $scope.weekDayClass = _.groupBy($scope.nowbc.dayclass, function (weekclass) {
                return weekclass.dayWeek;
            });
            for (var i in $scope.weekDayClass) {
                $scope.showNull = true;
            }

            if (sessionStorage.usertype == "student") {
                $scope.is_stu = true;
                var stuid = sessionStorage.userid;

                var info_ids = "";
                if ($scope.nowbc.dayclass) {
                    for (var i = 0; i < $scope.nowbc.dayclass.length; i++) {
                        info_ids += $scope.nowbc.dayclass[i].info_id + ",";
                    }
                    var kqRest = Restangular.one("WeekClass/action/GetWeekKQ/" + stuid + "/" + info_ids);
                    kqRest.post().then(function (data) {
                        for (var i = 0; i < $scope.nowbc.dayclass.length; i++) {
                            var nowclass = $scope.nowbc.dayclass[i];
                            var findOne = _.find(data, function (chr) {
                                return chr.info_id == nowclass.info_id;
                            });
                            if (findOne) {
                                nowclass.chuqin = findOne.status;
                            }
                            else {
                                nowclass.chuqin = "未上";
                            }
                        }
                        $scope.weekDayClass = _.sortBy($scope.weekDayClass, function (item) { return item; });
                        $scope.weekDayClass = _.groupBy($scope.nowbc.dayclass, function (weekclass) {
                            return weekclass.dayWeek;
                        });
                    });
                }
            }
            else {
                $scope.is_stu = false;
            }

            //$scope.nowWeekStart = $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay()));
            //$scope.nowWeekEnd = $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1);
        });
    }
    $scope.getDate();
    $scope.DownFile = function (file) {
        downService.cordovaDown(downService.getRootPath() + "/api/getAttach/action/getAttach/" + Base64.encode(file.filepath), file.nrbt);
    }
});