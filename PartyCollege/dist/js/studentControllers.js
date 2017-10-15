app.controller("loginController", ['$scope', '$state', '$rootScope', '$document', '$timeout', '$interval', 'getDataSource', 'DateService', 'SessionService', 'smsService', 'CommonService', 'CookieService', 'Base64'
    , function ($scope,$state, $rootScope, $document, $timeout, $interval, getDataSource, DateService, SessionService, smsService, CommonService, CookieService, Base64) {

        $scope.loginPanelStyle = [true, false, false, false, false, false, false,false];
        $scope.loginError = {
            isnamenull: false, ispwdnull: false, isverifynull: false, isverifyfailed: false, isloginfailed: false, islogining: false, message: "",
            reset: function () {
                this.isloginfailed = false;
                this.isverifyfailed = false;
                this.ispwdnull = false;
                this.isnamenull = false;
                this.isverifynull = false;
                this.message = "";
            }
        };

        $scope.goBackIndex = function () {
        	$state.reload();
        }

        //注册错误消息
        $scope.registerError = {
            idx: 0,
            message: "",
            style: [false, false, false, false, false, false, false, false, false, false, false,false],
            reset: function () {
                for (var i = 0; i < this.style.length; i++) {
                    this.style[i] = false;
                }
            }
        };
        $scope.registerObj = {
            name: "", departmentid: "", departmentname: "", colleague1: "", colleague2: ""
            , rank: "", cellphone: "", verifycode: "", smscode: "", type: 0 //0验证信息，1注册信息,2 修改密码
            ,password1:"",password2:"",logname:""
            , reset: function () {
                this.name = "";
                this.departmentid = "";
                this.departmentname = "";//可以不传
                this.colleague1 = "";
                this.colleague2 = "";
                this.rank = "";
                this.cellphone = "";
                this.verifycode = "";
                this.smscode = "";
                this.type = 0;
                this.password1 = "";
                this.password2 = "";
                this.logname = "";
            }
        };
        $scope.loginObj = {
            logname: "", logpwd: "", secretpwd: "", verifycode: "", isremember: false, reset: function () {
                this.logname = "";
                this.logpwd = "";
                this.secretpwd = "";
                this.verifycode = "";
                this.isremember = false;
            }
        };
        $scope.findpwdObj = {
            cellphone: "", yzmcode: "", smsyzmcode: "", password1: "", password2: "",fromApp:false, reset: function () {
                this.cellphone = "";
                this.yzmcode = "";
                this.smsyzmcode = "";
                this.password1 = "";
                this.password2 = "";
            }
        };


        var loginStr = CookieService.get("loginObj");
        if (loginStr) {
            var rememberObj = JSON.parse(loginStr);
            if (rememberObj) {
                $scope.loginObj.isremember = true;
                $scope.loginObj.logname = rememberObj.logname;
            }
        }


        //tree设置
        $scope.treeSetting = {
            view: {
                dblClickExpand: false
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
                            $scope.registerObj.departmentid = nodes[0].id;
                            $scope.registerObj.departmentname = nodes[0].name;
                        }, 100);
                        hideMenu();
                    }
                }
            }
        };


        $scope.registerStep = [
            {
                title: "登录", result: false, index: 0,
                event: function () { $scope.changePanel(0); }
            },
            {
                title: "二维码", result: false, index: 1,
                event: function () { $scope.changePanel(1); }
            },
            {
                title: "注册", result: false, index: 2,
                event: function () { 
                    $scope.changePanel(2);
                    $scope.getDepartmentArr();
                }
            },
            {
                title: "填写验证信息", result: false, index: 3,
                event: function () {

                    if ($scope.registerObj.name == $scope.registerObj.colleague1) {
                        $scope.registerError.message = "同事(一)不能是自己";
                        $scope.registerError.idx = 2;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }
                    if ($scope.registerObj.name == $scope.registerObj.colleague2) {
                        $scope.registerError.message = "同事(二)不能是自己";
                        $scope.registerError.idx = 3;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }
                    if ($scope.registerObj.colleague1 == $scope.registerObj.colleague2) {
                        $scope.registerError.message = "同事(一)和同事(二)不能一致";
                        $scope.registerError.idx = 3;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }
                    $scope.registerObj.type = 0;

                    $scope.validateInfo(function (data) {                       
                        if (data.model) {
                            $scope.registerObj.cellphone = data.model.cellphone;
                            $scope.registerObj.logname = data.model.logname;
                        }
                        $scope.changePanel(3);
                        $scope.getLevelArr();
                    });
                }
            },
            {
                title: "填写注册信息", result: false, index: 4,
                event: function () {

                    $scope.registerObj.type = 1;

                    $scope.validateInfo(function (data) {
                        $scope.changePanel(7);
                        $scope.loginObj.reset();
                        $scope.findpwdObj.reset();
                        $scope.timerInterval.reset();
                    });
                }
            },
            {
                title: "设置密码", result: false, index: 7, 
                event: function () {

                    if ($scope.registerObj.password1.length==0) {
                        $scope.registerError.message = "密码不能为空";
                        $scope.registerError.idx = 0;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }

                    if ($scope.registerObj.password2.length == 0) {
                        $scope.registerError.message = "确认密码不能为空";
                        $scope.registerError.idx = 1;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }

                    if ($scope.registerObj.password2 != $scope.registerObj.password2) {
                        $scope.registerError.message = "两次输入密码不一致";
                        $scope.registerError.idx = 1;
                        $scope.registerError.style[$scope.registerError.idx] = true;
                        return;
                    }

                    $scope.registerObj.type = 2;
                    $scope.registerObj.pass1 = Base64.encode($scope.registerObj.password1);
                    $scope.registerObj.pass2 = Base64.encode($scope.registerObj.password2);
                     
                    $scope.validateInfo(function (data) {
                        $scope.changePanel(4);
                        $scope.registerObj.reset();
                        $scope.loginObj.reset();
                        $scope.findpwdObj.reset();
                        $scope.timerInterval.reset();
                    });
                }
            }
            ,
            {
                title: "完成注册", result: false, index: 5,
                event: function () { }
            },
            {
                title: "找回密码验证", result: false, index: 6,
                event: function () {
                    $scope.existscellphone(function () {
                        $scope.changePanel(6);
                    });
                }
            },
            {
                title: "重置密码", result: false, index: 8 ,
                event: function () {
                    $scope.resetpwd(function () {
                        alert("密码已找回,请重新登录"); 
                        $scope.changePanel(0);
                        $scope.registerObj.reset();
                        $scope.loginObj.reset();
                        $scope.findpwdObj.reset();
                        $scope.timerInterval.reset();
                    });
                }
            }
        ];


    	//获取部门数据
        window.apiCallback.getAllDepartment = function (data) {
        	$scope.treeData = data;
        	$.fn.zTree.init($("#treeDemo"), $scope.treeSetting, $scope.treeData);
        }
        $scope.getDepartmentArr = function () { 
            if (!$scope.treeData) { 
                getDataSource.getDataSource('getAllDepartment', {}, function (data) {
                	window.apiCallback.getAllDepartment(data);
                }, function (error) { }, { key: "getAllDepartment", folder: "", callback: "apiCallback.getAllDepartment" });
            }
        }

        //获取职级数据
        $scope.getLevelArr = function () {
            if (!$scope.levelArr) { 
                getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
                    $scope.levelArr = _.find(data, { type: "职级" }).list;
                }, function (errortemp) { });
            }
        }

        $scope.changePanel = function (idx) {
            for (var i = 0; i < $scope.loginPanelStyle.length; i++) {
                $scope.loginPanelStyle[i] = false;
            }
            $scope.loginPanelStyle[idx] = true;
        }

        //面板切换
        $scope.nextStep = function (idx, isback) {

            $scope.registerError.reset();

            if (isback) {
                $scope.changePanel(idx);
            } else {                
                var step = _.find($scope.registerStep, { index: idx });
                if (step != undefined) {
                    step.event();
                }
            }
        }

        //显示部门树
        $scope.departmentShow = function () {
            var cityObj = $("#txtdepartment");
            var cityOffset = $("#txtdepartment").offset();
            $("#menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");
            $("body").bind("mousedown", onBodyDown);
        }

        //验证用户信息
        $scope.validateInfo = function (callback) {

            getDataSource.getUrlData("../api/validate", $scope.registerObj, function (data) {
                if (data.result) {
                    callback(data);
                } else {
                    $scope.registerError.message = data.message;
                    $scope.registerError.idx = data.validateIndex;
                    $scope.registerError.style[data.validateIndex] = true;
                    $scope.changeRegVerifyCode();
                }
            }, function (errortemp) { });
        }

        //判断手机号码
        $scope.existscellphone = function (callback) {
            getDataSource.getUrlData("../api/existscellphone", $scope.findpwdObj, function (data) {
                if (data.result) {
                    callback(data);
                } else {
                    $scope.registerError.message = data.message;
                    $scope.registerError.idx = data.validateIndex;
                    $scope.registerError.style[data.validateIndex] = true;
                    $scope.changefindpwdVerifyCode();
                }
            }, function (errortemp) { });
        }

        //重置密码
        $scope.resetpwd = function (callback) {

            if ($scope.findpwdObj.password1.length == 0) {
                $scope.registerError.message = "新密码不能为空";
                $scope.registerError.idx = 4;
                $scope.registerError.style[$scope.registerError.idx] = true;
                return;
            }
            if ($scope.findpwdObj.password2.length == 0) {
                $scope.registerError.message = "确认密码不能为空";
                $scope.registerError.idx = 5;
                $scope.registerError.style[$scope.registerError.idx] = true;
                return;
            }
            if ($scope.findpwdObj.password2 != $scope.findpwdObj.password1) {
                $scope.registerError.message = "两次输入密码不一致";
                $scope.registerError.idx = 5;
                $scope.registerError.style[$scope.registerError.idx] = true;
                return;
            }

            var parameter = {
                cellphone: $scope.findpwdObj.cellphone,
                yzmcode: $scope.findpwdObj.yzmcode,
                smsyzmcode: $scope.findpwdObj.smsyzmcode,
                password1: Base64.encode($scope.findpwdObj.password1),
                password2: Base64.encode($scope.findpwdObj.password2)
            };

            getDataSource.getUrlData("../api/resetpassword", parameter, function (data) {
                if (data.result) {
                    callback(data);
                } else {
                    $scope.registerError.message = data.message;
                    $scope.registerError.idx = data.validateIndex;
                    $scope.registerError.style[data.validateIndex] = true;
                }
            }, function (errortemp) { });
        }

        //验证服务器端code{clientcode输入的验证码，servercode验证码名称}
        $scope.verifySMSCode = function (clientcode, servercode, success, failed) {

            getDataSource.getUrlData("../api/VerifySMSCode", { smscode: clientcode, keyname: servercode }, function (datatemp) {
                if (datatemp.code == "success") {
                    success();
                } else {
                    failed();
                }
            }, function (errortemp) { });
        }

        //发送验证码{cellphone手机号，verifycode输入的验证码，key验证码名称，index错误索引}
        $scope.verifyCodeClick = function (cellphone, verifycode, key, index) {

            if (cellphone.trim().length != 11) {
                //CommonService.alert("手机号码格式不正确");
                return;
            }
            if (!$scope.isVerifyCode)
                return;

            $scope.registerError.reset();
            $scope.verifySMSCode(verifycode, key, function () {
                $scope.isVerifyCode = false;
                getDataSource.getUrlData("../api/getSMSCode", { phone: cellphone, keyname: "validatesmscode" }, function (datatemp) {
                    if (datatemp.code == "success") { }
                }, function (errortemp) { });
                $scope.timerInterval.interval();
            }
            , function () {
                //$scope.changeRegVerifyCode();
                $scope.registerError.message = "验证码不正确";
                $scope.registerError.idx = index;
                $scope.registerError.style[index] = true;
            });

        }
        

        $scope.btnVerifyCode = "获取验证码";
        $scope.isVerifyCode = true;
        $scope.timerInterval = {
            interval: function () {
                var i = 90;
                var ptime;
                $scope.timer = $interval(function () {
                    i--;
                    $scope.btnVerifyCode = i + "秒";
                    $scope.isVerifyCode = false;

                    if (i == 0) {
                        $scope.isVerifyCode = true;
                        $scope.btnVerifyCode = "获取验证码";
                        $scope.timerInterval.reset();
                    }
                }, 1000);
            },
            reset: function () {
                $scope.btnVerifyCode = "获取验证码";
                $scope.isVerifyCode = true;
                $interval.cancel($scope.timer);
            }
        };

        function hideMenu() {
            $("#menuContent").fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
        }
        function onBodyDown(event) {
            if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                hideMenu();
            }
        }

        //登录验证码
        $scope.loginVerifyCodeSrc = "../api/VerifyCode/loginverify/" + new Date().getTime();
        $scope.changeLoginVerifyCode = function () {
            $scope.loginVerifyCodeSrc = "../api/VerifyCode/loginverify/" + new Date().getTime();
        }
        //注册验证码
        $scope.regVerifyCodeSrc = "../api/VerifyCode/regverify/" + new Date().getTime();
        $scope.changeRegVerifyCode = function () {
            $scope.regVerifyCodeSrc = "../api/VerifyCode/regverify/" + new Date().getTime();
        }
        //找回密码验证码
        $scope.findpwdVerifyCodeSrc = "../api/VerifyCode/findpwdverify/" + new Date().getTime();
        $scope.changefindpwdVerifyCode = function () {
            $scope.findpwdVerifyCodeSrc = "../api/VerifyCode/findpwdverify/" + new Date().getTime();
        }



        $scope.login = function () {

            $scope.loginError.reset();

            if ($scope.loginObj.logname == "" || $scope.loginObj.logname.trim().length == 0) {
                $scope.loginError.isnamenull = true;
                return;
            }
            if ($scope.loginObj.logpwd == "" || $scope.loginObj.logpwd.trim().length == 0) {
                $scope.loginError.ispwdnull = true;
                return;
            }
            if ($scope.loginObj.verifycode == "" || $scope.loginObj.verifycode.trim().length == 0) {
                $scope.loginError.isverifynull = true;
                return;
            }

            $scope.beginLoading = !$scope.beginLoading;
            $scope.loginError.islogining = true;
            console.log("$scope.loginObj.logpwd", md5($scope.loginObj.logpwd));

            var loginparam = {
                logname: $scope.loginObj.logname,
                hashpwd: md5($scope.loginObj.logpwd),
                verifycode: $scope.loginObj.verifycode
            };

            getDataSource.getUrlData("../api/Login", loginparam, function (data) {
                if (data.result) {
                    if ($scope.loginObj.isremember) {
                        var rememberObj = { logname: $scope.loginObj.logname, time: DateService.format(new Date(), "yyyy-MM-dd hh:mm:ss") };
                        CookieService.save("loginObj", JSON.stringify(rememberObj));
                    }
                    else {
                        CookieService.remove("loginObj");
                    }
                    $rootScope.user = data.loginUser;
                    location.href = "../html/index.html"
                    //location.href = "indexfront.html#/main/myclasslist";
                } else {
                    $scope.loginError.isverifyfailed = data.isVerify;
                    $scope.loginError.isloginfailed = !data.result;
                    $scope.loginError.islogining = false;
                    $scope.beginLoading = false;
                    $scope.changeLoginVerifyCode();
                    $scope.loginError.message = data.message;
                }
            }, function (errortemp) {
                $scope.loginError.islogining = false;
                $scope.beginLoading = false;
            });


        }

    }])
app.controller("mainController", ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.gologin = function () {          
        location.href = "../html/login.html";
    }

}])