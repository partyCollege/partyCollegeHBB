APPController
.controller("appraiseListController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser,
	$ionicScrollDelegate, $state, $stateParams, $ionicModal, $ionicPopover, $ionicTabsDelegate, $document, $rootScope
	, $ionicPopup, showAlert, $ionicSideMenuDelegate, $ionicHistory, $interval) {

    $scope.stu_info_id = sessionStorage.stu_info_id;
    $scope.bcinfo_id = sessionStorage.bcinfo_id;
    $scope.usertype = sessionStorage.usertype;
    //$scope.title = $stateParams.title;
    //$scope.category = $stateParams.category;
    $scope.crrentTab = new Object();
    $scope.crrentTab.id = $stateParams.tabid;
    $scope.crrentTab.bcorclass = $stateParams.tabclass;

    $scope.moreDataCanBeLoaded = true;
    // 浙江红色学府评价选择项，距离底部
    $scope.marginbottom = "margin-bottom:0px;";
    if ($rootScope.AppConfig.showBottomButton) {
        $scope.marginbottom = "margin-bottom:47px;";
    }
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    $scope.marTop = "";
    if (isAndroid) {
        $scope.marTop = "";
    }
    if (isIOS) {
        //$scope.marTop = "margin-top:10px";
    }
    $scope.goMain = function () {
        if ($rootScope.AppConfig.hasMain == true) {
            $state.go("app.index");
        }
        else {
            $ionicSideMenuDelegate.toggleLeft();
        }
    };
    $scope.goBack = function () {
        var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
        if (gopage) {
            $state.go("app.index");
        } else {
            $ionicHistory.goBack();
        }
    }
    //默认未评
    $scope.ispj = "-1";
    //
    $scope.query = false;
    //加载课程列表
    $scope.list = [];
    //切换已评

    $scope.loadMore = function (tabtemp, ispj) {
        $interval.cancel(timer);
        //console.log("loadMore")
        $scope.list = new Array();
        var url = "Appraise/action/GetPJInfoList/" + tabtemp.id + "/" + ispj + "/" + tabtemp.bcorclass + "/" + $scope.bcinfo_id + "/" + $scope.stu_info_id;
        var getmoreData = Restangular.one(url);
        getmoreData.get().then(function (data) {
            $scope.returnJson = data;
            var returndata = data.listData;
            //$scope.PJCurrentItemList = data.pjItemList;
            // console.log(returndata.length);
            for (var c = 0; c < returndata.length; c++) {
                var kcobj = new Object();
                kcobj = returndata[c];
                kcobj.noclick = returndata[c].noclick;
                //kcobj.PJCurrentItemList = data.pjItemList;
                kcobj.formname = returndata[c].formname;
                kcobj.kcid = returndata[c].kcid;
                if (tabtemp.bcorclass == "dy") {
                    kcobj.dyid = returndata[c].dyid;
                }
                $scope.list.push(kcobj);
            }
            //$scope.moreDataCanBeLoaded = false;
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.loadMore($scope.crrentTab, $scope.ispj);
    $scope.CheckToggle = function () {
        $scope.query = !$scope.query;
        if ($scope.query) {
            $scope.ispj = "1";
        } else {
            $scope.ispj = "-1";
        }
        $scope.loadMore($scope.crrentTab, $scope.ispj);
    };

    //获取所有的tab
    //var getTabsData = Restangular.one("Appraise/action/GetPjTabs/" + $scope.bcinfo_id);
    //getTabsData.get().then(function (tabdata) {
    //    $scope.tabs = new Array();
    //    for (var c = 0; c < tabdata.length; c++) {
    //        //console.log(tabdata[c]);
    //        //$scope.LoadPj(tabdata[c]);
    //        $scope.tabs.push(tabdata[c]);
    //    }
    //    $scope.crrentTab = $scope.tabs[0];
    //    $scope.loadMore($scope.crrentTab, $scope.ispj);
    //});

    //$scope.ChooseTab = function (tabtemp, ispj) {
    //    $scope.crrentTab = tabtemp;
    //    $scope.loadMore(tabtemp, $scope.ispj);
    //    $scope.displayProp();
    //}

    $scope.getGUID = function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    $scope.SavePJData = function (act) {
        $scope.ShowSubmitBtn = false;
        var pjDataJson = $scope.kcitem.PJCurrentItemList;
        var itemlength = pjDataJson.length;
        var elementid = "";        

        for (var j = 0; j < itemlength; j++) {
        	elementid = pjDataJson[j].elementid;
            if (pjDataJson[j].type == "radio") {
                pjDataJson[j].selectValue = $("#" + elementid + "").find("input[class*='hide-ngmode-val']").val();
            } else if (pjDataJson[j].type == "check") {
                var levelobj = pjDataJson[j].PJLevelList;
                var lth = levelobj.length;
                var selval = '';
                for (var k = 0; k < lth; k++) {
                    if (levelobj[k].checked) {
                        selval = selval + "," + levelobj[k].point;
                    }
                }
                pjDataJson[j].selectValue = selval;
            } else if (pjDataJson[j].type == "selectsourse") {
            	pjDataJson[j].selectValue=pjDataJson[j].selectValue.Value;
            }
            pjDataJson[j].ispost = 1;
            //检查数据是不是都有填写，不填写不能提交，根据pjsetting.xml 配置是否必填。
            if (pjDataJson[j].notNull.toLowerCase() != "false") {
                if (pjDataJson[j].selectValue == "0" || pjDataJson[j].selectValue == "" || pjDataJson[j].selectValue == null) {
                    //alert("您第" + (j + 1) + "个评价项未评。");
                    showAlert.alert("您第" + (j + 1) + "个评价项未评。");
                    $scope.ShowSubmitBtn = true;
                    return false;
                }
            }
        }
        //return;
        if (act) {
            $scope.submitData = function () {
                var loginData = Restangular.one('Appraise/action/');
                loginData.post("SavePJData", pjDataJson).then(function (data) {
                    if (data.msgStatus) {
                        //alert("保存成功");

                        $ionicPopup.alert({
                            okType: "button-assertive",
                            okText: "确定",
                            title: "提示",
                            template: "保存成功"
                        })
                    }
                });
            }
            //$scope.ShowSubmitBtn = false;
            $ionicPopup.confirm({
                title: "消息确认",
                template: "评价提交后，将不能再修改，确定要提交吗？",
                buttons: [
                    {
                        text: '取消',
                        type: 'button-stable',
                        onTap: function () {
                            $scope.ShowSubmitBtn = true;
                        }
                    },
                    {
                        text: '<b>确认</b>',
                        type: 'button-positive',
                        onTap: function () {
                            $("div div.popup-buttons").attr("style", "display:none;");
                            $scope.submitData();
                            $scope.loadMore($scope.crrentTab, $scope.ispj);
                            $scope.closeModal();
                        }
                    }
                ]
            });

            //if (!confirm("评价提交后，将不能再修改，确定要提交吗？")) return false;

        } else {
            //$scope.closePopover();
        }
    };

    $scope.GetKCWHInfo = function (kc, tabtemp) {
        $scope.ShowSubmitBtn = false;
        $scope.ShowSubmitBtnArray = new Array();
        var url = "Appraise/action/GetPJDataList/" + tabtemp.id + "/-1/"
			+ tabtemp.bcorclass + "/" + $scope.bcinfo_id + "/"
			+ $scope.stu_info_id + "/" + kc.keyData;
        var tempformname = 'undefined';
        if (kc.formname != undefined && kc.formname.length > 0) {
            tempformname = kc.formname;
        }
        url = url + "/" + tempformname;
        var getmoreData = Restangular.one(url);
        getmoreData.get().then(function (kcdata) {
            //已经评价的项
            var data = kcdata.PJedItemList;
            //未评的项
            $scope.PJCurrentItemList = kcdata.PjItemList;
            var itemlength = $scope.PJCurrentItemList.length;
            $scope.showTotalScore = false;

            for (var j = 0; j < itemlength; j++) {
                var yp = false;
                $scope.PJCurrentItemList[j].yp = yp;
                $scope.PJCurrentItemList[j].selectValue = "";
                var displayPoint = $scope.PJCurrentItemList[j].displayPoint;
                var Point = $scope.PJCurrentItemList[j].point;
                if (Point != undefined) {
                    var PJLevelList = new Array();
                    var length = displayPoint.length;
                    for (var i = 0; i < length; i++) {
                        var levelobj = new Object();
                        levelobj.discription = displayPoint[i];
                        levelobj.point = Point[i];
                        levelobj.tip = "";
                        levelobj.checked = false;
                        PJLevelList.push(levelobj);
                    }
                    $scope.PJCurrentItemList[j].PJLevelList = PJLevelList;
                }
                //是否已评


                var pjitemfilter = {
                    pjtype: tabtemp.bcorclass,
                    pjtypeid: tabtemp.id,
                    bcid: $scope.bcinfo_id,
                    userid: $scope.stu_info_id,
                    level1Id: $scope.PJCurrentItemList[j].level1Id,
                    level2Id: $scope.PJCurrentItemList[j].level2Id
                };
                if (tabtemp.bcorclass == "class") {
                    pjitemfilter.kwid = kc.keyData;
                } else if (tabtemp.bcorclass == "jxxs") {
                    pjitemfilter.jxxs = kc.keyData;
                } else if (tabtemp.bcorclass == "zcr") {
                    pjitemfilter.zcrid = kc.keyData;
                }
                var pjitem = _.filter(data, pjitemfilter);

                var defaultvalue = "";
                if (pjitem.length > 0) {
                    if (pjitem[0].type == "textarea") {
                        defaultvalue = pjitem[0].selectValue;
                    } else {
                        defaultvalue = pjitem[0].selectValue;
                    }
                    if (pjitem[0].ispost != 1 && pjitem[0].ispost != 0) {
                        //$scope.ShowSubmitBtn = true;					    
                        $scope.ShowSubmitBtnArray.push({ btn: true });
                    } else {
                        $scope.ShowSubmitBtnArray.push({ btn: false });
                    }
                } else {
                    $scope.ShowSubmitBtnArray.push({ btn: true });
                    if (defaultvalue.length == 0) {
                        if ($scope.PJCurrentItemList[j].type != "textarea") {
                            defaultvalue = "0";
                        }
                    }
                }

                if ((defaultvalue != "0" && defaultvalue != "" && defaultvalue != null)) {
                    yp = true;
                }

                //未评的课程，如果有默认值，需加载默认值
                if (data.length == 0) {
                    var pjitemdefaultvalue = $scope.PJCurrentItemList[j].defaultvalue;
                    if (pjitemdefaultvalue != null && pjitemdefaultvalue.length > 0) {
                        defaultvalue = pjitemdefaultvalue;
                    }
                }

                $scope.PJCurrentItemList[j].pjtypeid = tabtemp.id;
                $scope.PJCurrentItemList[j].pjtype = tabtemp.bcorclass;
                $scope.PJCurrentItemList[j].selectValue = defaultvalue;

                if ($scope.PJCurrentItemList[j].type == "check") {
                    var templist = $scope.PJCurrentItemList[j].PJLevelList;
                    var length = templist.length;
                    for (var k = 0; k < length; k++) {
                        if (("," + defaultvalue + ",").indexOf("," + templist[k].point + ",") > -1) {
                            $scope.PJCurrentItemList[j].PJLevelList[k].checked = true;
                        }
                    }
                }

                //存在打分的
                if ($scope.PJCurrentItemList[j].type == "text") {
                    $scope.showTotalScore = true;
                }

                $scope.PJCurrentItemList[j].yp = yp;
                //设置默
                $scope.PJCurrentItemList[j].userid = $scope.stu_info_id;
                $scope.PJCurrentItemList[j].bcid = $scope.bcinfo_id;
                $scope.PJCurrentItemList[j].kwid = kc.keyData;
                if (tabtemp.bcorclass == "jxxs") {
                    $scope.PJCurrentItemList[j].jxxs = kc.keyData;
                } else if (tabtemp.bcorclass == "zcr") {
                    $scope.PJCurrentItemList[j].zcrid = kc.keyData;
                }
                $scope.PJCurrentItemList[j].kcid = kc.kcid;
                $scope.PJCurrentItemList[j].dyid = kc.dyid;
                $scope.PJCurrentItemList[j].elementid = "element" + $scope.getGUID();
                $scope.PJCurrentItemList[j].name = $scope.PJCurrentItemList[j].level1Title;
                if ($scope.PJCurrentItemList[j].level2Title != undefined && $scope.PJCurrentItemList[j].level2Title.length > 0) {
                    $scope.PJCurrentItemList[j].name = $scope.PJCurrentItemList[j].name + "，" + $scope.PJCurrentItemList[j].level2Title;
                }
                kc.PJCurrentItemList = $scope.PJCurrentItemList;
                $scope.kcitem = kc;
                var btn = _.filter($scope.ShowSubmitBtnArray, { btn: false });
                if (btn.length > 0) {
                    $scope.ShowSubmitBtn = false;
                } else {
                    $scope.ShowSubmitBtn = true;
                }

                console.log("PJCurrentItemList[j].rangekeyval", $scope.PJCurrentItemList[j].rangekeyval);
            }
        });
        $ionicScrollDelegate.scrollTop();
    };



    //$scope.doRefresh = function (tabtemp) {
    //	//$scope.loadMore(tabtemp, $scope.ispj);
    //	//$ionicTabsDelegate.select(1);
    //	//$scope.$broadcast('scroll.refreshComplete');
    //};
    //console.log("kc.PJCurrentItemList", $scope.kcitem.PJCurrentItemList);




    $scope.OpenPopoverPJ = function () {
        $ionicModal.fromTemplateUrl('../templates/pjitems.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (pjmodal) {
            $scope.pjmodal = pjmodal;
            $scope.pjmodal.show();
        });
    }

    $scope.displayProp = function () {
        $scope.pjmodal.hide();
    };


    var timer = null;
    $scope.openModal = function (kc, tab) {
        if (!kc.noclick && $scope.ispj == -1) {
            $ionicPopup.alert({
                okType: "button-assertive",
                okText: "确定",
                title: "提示",
                template: "该课程不能评价，因未到评价时间或已请假或超时。"
            });
            return;
        }
        //点击课程弹出评价项
        $ionicModal.fromTemplateUrl('../templates/PJDetail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            //console.log(tab);
            $scope.GetKCWHInfo(kc, tab);
            timer = $interval(function () {
                $scope.TotalScore = 0;
                var length = $scope.kcitem.PJCurrentItemList.length;
                var tp = null;
                for (var i = 0; i < length; i++) {
                    tp = $scope.kcitem.PJCurrentItemList[i];
                    if (tp.type == 'text') {
                        $scope.TotalScore = parseFloat($scope.TotalScore) + parseFloat(tp.selectValue);
                    }
                }
            }, 1000);
        });
    };
    $scope.closeModal = function () {
        //$scope.modal.hide();
        $scope.modal.remove();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
})
.controller("studentSettingController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicPopup, $ionicTabsDelegate, $document) {
    $scope.stu_info_id = sessionStorage.stu_info_id;
    $scope.bcinfo_id = sessionStorage.bcinfo_id;
    $scope.usertype = sessionStorage.usertype;
    Restangular.setDefaultRequestParams(['remove', 'post', "put", "get"], { formAPP: true });

    var getmoreData = Restangular.one("studentSetting/action/GetStudent/" + $scope.bcinfo_id + "/" + $scope.stu_info_id);
    getmoreData.get().then(function (data) {
        $scope.returnJson = data;
    });

    $scope.showPopup = function () {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '输入新密码<input type="password" ng-model="data.password">再输入一次<input type="password" ng-model="data.pwdagain">',
            title: '修改密码',
            subTitle: '请输入复杂度较高的密码',
            scope: $scope,
            buttons: [
			  { text: '取消' },
			  {
			      text: '<b>保存</b>',
			      type: 'button-positive',
			      onTap: function (e) {
			          if (!$scope.data.password || !$scope.data.pwdagain) {
			              //don't allow the user to close unless he enters wifi password
			              e.preventDefault();
			          } else if ($scope.data.password != $scope.data.pwdagain) {
			              $scope.showAlert('两次输入密码不一致，请重新输入');
			              $scope.data.password = '';
			              $scope.data.pwdagain = '';
			              e.preventDefault();
			          } else if ($scope.data.password.length < 6) {
			              $scope.showAlert('密码长度不能少于6位');
			              $scope.data.password = '';
			              $scope.data.pwdagain = '';
			              e.preventDefault();
			          } else {
			              var loginData = Restangular.one('studentSetting/action/');

			              $scope.data.info_id = $scope.stu_info_id;
			              $scope.data.bcid = $scope.bcinfo_id;

			              loginData.post("UpdateStudentPwd", $scope.data).then(function (data) {
			                  if (data.msgStatus) {
			                      $scope.showAlert('修改成功');
			                      $scope.closePopover();
			                  }
			              });
			              return $scope.data.pwd;
			          }
			      }
			  },
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
        //$timeout(function () {
        //	myPopup.close(); //close the popup after 3 seconds for some reason
        //}, 3000);

        //$scope.showConfirm = function () {
        //	var confirmPopup = $ionicPopup.confirm({
        //		title: 'Consume Ice Cream',
        //		template: 'Are you sure you want to eat this ice cream?'
        //	});
        //	confirmPopup.then(function (res) {
        //		if (res) {
        //			console.log('You are sure');
        //		} else {
        //			console.log('You are not sure');
        //		}
        //	});
        //};

        // An alert dialog
        $scope.showAlert = function (mesg) {
            var alertPopup = $ionicPopup.alert({
                title: mesg,
                //template: 'It might taste good'
                okText: '确定' // String (default: 'OK'). The text of the OK button.
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
    };
})
.controller("indexController", function (showAlert,$rootScope, $scope, $timeout, Restangular, userHelp, getDataSource, $location, $ionicModal, getUser, $document, $http, $state, $stateParams, cordovaService, menuService, getBadge, $ionicSlideBoxDelegate) {
    
    $scope.datameSource = [];
    //主页下部分通用提醒模块判断展示
    $scope.mainModule = {};
    
    $timeout(
       function () {
           $scope.$watch('user.uname', function () {
               $scope.uname = $rootScope.user.uname;
               //$scope.doRefresh();
               $scope.mainModule = {};
               $scope.loadTzggData();
               //$ionicSlideBoxDelegate.update();
           });
           $scope.$watch('user.bcname', function () {
               if ($rootScope.user.bcname) {
                   $scope.title = $rootScope.user.bcname;

               }
               else {
                   $scope.title = $rootScope.AppConfig.title;
               }
           });

           var h1_len = $("#indextitle").outerWidth() - 96;
           var label_len = $("#indextitle label").eq(0).outerWidth();
           if (label_len >= h1_len) {
               //$("#indextitle label").addClass("animate_left");
               $("#indextitle label").css("padding-left", h1_len + "px");
           } else {
               $("#indextitle").css("text-align", "center");
           }
       }, 800);
    $scope.exit = function () {
        cordovaService.exitApp();
    }

    $scope.blankMenu = [];

    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    $scope.myStyle = { margin: '40px 0px 0px 0px' };
    if (isAndroid) {
        $scope.myStyle = { margin: '40px 0px 0px 0px' };
        $scope.personIdentity = "margin-top:40px;text-align:center;color:#fff;"
    }
    if (isIOS) {
        $scope.myStyle = { margin: '40px 0px 0px 0px' };
        $scope.personIdentity = "margin-top:65px;text-align:center;color:#fff;"
    }
    if ($rootScope.fromweixin) {
        $scope.personIdentity = "margin-top:50px;text-align:center;color:#fff;"
    }

    $scope.loadTzggData = function () {
        angular.forEach($rootScope.AppConfig.mainModule, function (item) {
            //身份判断
            if (item.usertype == "bzr") {
                if (!$rootScope.user.bcinfo_id) {
                    return;
                }
            }
            else if (item.usertype.indexOf($rootScope.user.usertype) == -1) {
                return;
            }
            $scope.mainModule[item.type] = { link: item.link };
        });
    }
    $scope.loadTzggData();
    $scope.flash = function () {
        $scope.$broadcast("indexReflash", {});

        //showAlert.showLoading(5000, "加载中...");
        $scope.doRefresh();
        //$scope.$broadcast('scroll.refreshComplete');
    }
    $scope.$on("reLogin", function () {
        $scope.doRefresh();
    });
    $scope.doRefresh = function () {
        $scope.bclist = [];
        getDataSource.getDataSource("getTeacherClass", {
            userid: sessionStorage.userid
        }, function (classdata) {
            if (classdata.length > 0) {
                $scope.bclist = classdata;
            }
        })
        $scope.datameSource = [];
        //$ionicSlideBoxDelegate.update();
        $http.get("../config/menus.json").then(function (data) {
            $scope.quickmenus = data.data;

            var mainpages = _.filter($scope.quickmenus, function (item) {
                var returnVal = false;
                var badgeScript = item.badgeUrl;
                if (badgeScript != "" && badgeScript) {
                    try {
                        eval("getBadge.getNum(item)");
                    }
                    catch (e) { }
                }
                if (item.usertype == "bzr" && $rootScope.user.usertype == "teacher") {
                    if ($rootScope.user.bcinfo_id) {
                        returnVal = true;
                    }
                    else {
                        returnVal = false;
                    }
                }
                else if (item.usertype == sessionStorage.usertype && item.display) {
                    returnVal = true;
                }
                else {
                    returnVal = false;
                }
                //判断菜单权限
                if (item.role) {
                    if (item.role.length != 0) {
                        if (sessionStorage.roles) {
                            var hasrole = _.indexOf(JSON.parse(sessionStorage.roles), item.role);
                            if (hasrole == -1) {
                                returnVal = false;
                            }
                            else {
                                returnVal = true;
                            }
                        }
                    }
                }
                $scope.$broadcast('scroll.refreshComplete');
                return returnVal;
            });
            //SlideBox分页
            var pages = (mainpages.length % 6) > 0 ? parseInt(mainpages.length / 6) + 1 : parseInt(mainpages.length / 6);//一页可以放9个，计算总共有几页

            for (var i = 0; i < pages; i++) {
                //初始化datapage数据格式
                var dataPage = {
                    "index": i, "data": [
                        {
                            "data": []
                        },
                        {
                            "data": []
                        }]
                };
                $scope.datameSource.push(dataPage);
            }
            var pageIndex = 0;
            var rowIndex = 0;
            var dataRowIndex = 0;
            _.forEach(mainpages, function (m, key) {
                if (pageIndex != parseInt(key / 6)) {
                    pageIndex = parseInt(key / 6);
                    rowIndex = 0;
                    dataRowIndex = 0;
                }
                if (rowIndex > 1) {
                    rowIndex = 0;
                }

                if (dataRowIndex > 2) {
                    dataRowIndex = 0;
                    rowIndex++;
                }
                $scope.datameSource[pageIndex].data[rowIndex].data[dataRowIndex] = m;
                dataRowIndex++;
            });
            showAlert.hideLoading();
            $ionicSlideBoxDelegate.update();
            $scope.loadTzggData();
        });
    }
    $scope.doRefresh();

    function success(data) {

    }
    $scope.exitApp = function () {
        cordovaService.exitApp();
    };
    $scope.goChaoXing = function () {
        cordovaService.checkAppInstall();
    };
    $scope.goNowMenu = function (menu) {
        //进入超星
        if (menu.category == "chaoxing") {
            $scope.goChaoXing();
            return;
        }
        if (menu.subMenus && menu.subMenus.length > 0) {
            $state.go('app.subindex', { title: menu.title, category: menu.category });
        }
        else {
            if (menu.webUrl) {
                var weburl = menu.webUrl.replace('[phone]', sessionStorage.decphone).replace('[bcid]', sessionStorage.bcinfo_id);
                $state.go("app.iosfile", { url: weburl });
                //window.location.href = menu.webUrl.replace('[phone]', sessionStorage.decphone).replace('[bcid]', sessionStorage.bcinfo_id);
            }
            else if (menu.category) {
                if (menu.category == "kcpj") {
                    $state.go(menu.state, { tabid: menu.tabid, tabclass: menu.tabclass });
                }
                else {
                    $state.go(menu.state, { title: menu.title, category: menu.category });
                }
            }
            else {
                $state.go(menu.state, { title: menu.title });
            }
        }
    }
    //进入菜单
    $scope.gomenu = function (menuname) {
        if (menuname.length > 0) {
            for (var i = 0; i < $scope.quickmenus.length; i++) {
                var menu = $scope.quickmenus[i];
                if (menu.title == menuname) {
                    //有二级菜单
                    if (menu.subMenus.length > 0) {
                        $state.go('app.subindex', { title: menu.title, category: menu.category });
                    } else {
                        if (menu.webUrl) {
                            //$state.go(menu.state, { title: menu.title, category: menu.category });
                            window.location.href = menu.webUrl.replace('[phone]', sessionStorage.decphone).replace('[bcid]', sessionStorage.bcinfo_id);
                        }
                        else if (menu.category) {
                            $state.go(menu.state, { title: menu.title, category: menu.category });
                        }
                        else {
                            $state.go(menu.state, { title: menu.title });
                        }
                    }
                }
            }
        }
    }


    $scope.classShow = false;
    
    $scope.dropDown = function () {
        $scope.classShow = !$scope.classShow;
    }
    $scope.selectbc = function () {
        if ($rootScope.user.type == "student") {
            return;
        }
        $ionicModal.fromTemplateUrl('../templates/selectAllbc.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

        $scope.displayProp = function () {
            $scope.modal.hide();
        };
    }

    $scope.checked = function (item) {
        $scope.title = item.bt;
        sessionStorage.bcinfo_id = item.classid;
        sessionStorage.bcname = item.bt;

        // 重新设置班级名称
        //$("#indextitle label").eq(0).append($scope.title);
        var h1_len = $("#indextitle").outerWidth() - 96;
        var label_len = $("#indextitle label").eq(0).outerWidth();
        if (label_len >= h1_len) {
            $("#indextitle label").addClass("animate_left");
            $("#indextitle label").css("padding-left", h1_len + "px");
        } else {
            $("#indextitle").css("text-align", "center");
        }

        userHelp.setSession(function () { });
        $rootScope.user = sessionStorage;
        localStorage.user = JSON.stringify($rootScope.user);
        $scope.modal.hide();
    }
})
.controller("subindexController", function ($scope, $timeout, Restangular, $location, getUser, $document, $http, $state, $stateParams, $ionicNavBarDelegate,getBadge) {
    $scope.category = $stateParams.category;
    $scope.title = $stateParams.title;
    $scope.subMenus = new Object();

    $scope.goBack = function () {
        $state.go("app.index");
        //alert(1);
        //$ionicNavBarDelegate.back();
    };
    $scope.doSubRefresh = function () {
        $scope.items = new Array();
        $http.get("../config/menus.json").then(function (data) {
            $scope.quickmenus = data.data;
            for (var i = 0; i < $scope.quickmenus.length; i++) {
                var menu = $scope.quickmenus[i];
                if (menu.title == $scope.title) {
                    console.log(menu.title);
                    //有二级菜单
                    if (menu.subMenus.length > 0) {
                        $scope.subMenus = menu.subMenus;
                        var mainpages = _.filter($scope.subMenus, function (item) {
                            var badgeScript = item.badgeUrl;
                            if (badgeScript != "" && badgeScript) {
                                try {
                                    eval("getBadge.getNum(item)");
                                }
                                catch (e) { }
                            }
                        })
                        //补齐18格，多出来的补空
                        if ($scope.subMenus.length < 18) {
                            for (var j = 0; j < (18 - $scope.subMenus.length) ; j++) {
                                $scope.items.push(j);
                            }
                        }
                    }
                }
            }
        });
    }

    $scope.doSubRefresh();

    $scope.flash = function () {
        $scope.$broadcast("indexReflash", {});

        $scope.doSubRefresh();
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.gomenu = function (menuname, submenuname) {
        if (menuname.length > 0) {
            for (var i = 0; i < $scope.quickmenus.length; i++) {
                var menu = $scope.quickmenus[i];
                if (menu.title == menuname) {
                    $scope.sourceMenu = menu;
                    break;
                }
            }
            //有二级菜单
            for (var j = 0; j < $scope.sourceMenu.subMenus.length; j++) {
                var submenu = $scope.sourceMenu.subMenus[j];
                if (submenu.title == submenuname) {
                    if (submenu.category) {
                        if (submenu.category == "kcpj") {
                            $state.go(submenu.state, { tabid: submenu.tabid, tabclass: submenu.tabclass });
                        }
                        else {
                            $state.go(submenu.state, { title: submenu.title, category: submenu.category });
                        }
                    }
                    else {
                        $state.go(submenu.state, { title: submenu.title });
                    }
                    break;
                }
            }

        }
    }
})
.controller("zjpjdetailController", function ($rootScope, $scope, $stateParams, Restangular, $location, $state, $ionicPopover
	, $http, cordovaService, $ionicPlatform, $ionicHistory, getDataSource, showAlert, $ionicPopup) {
    var kwid = $stateParams.infoid;
    var jsid = sessionStorage.userid;

    $scope.totalScore = 0;
    $scope.pjFormList = new Array();
    var formItem = new Object();
    formItem.title = "政治方向（评分范围：1分-25分）";
    formItem.name = "item";
    formItem.id = "1";
    formItem.placeholder = "1-25";
    formItem.minval = 1;
    formItem.maxval = 25;
    formItem.val = "0";
    formItem.valtext = "";
    formItem.inputtype = "text";
    formItem.scorerate = 1;
    formItem.notnull = true;
    $scope.pjFormList.push(formItem);

    formItem = new Object();
    formItem.name = "item";
    formItem.title = "框架结构（评分范围：1分-15分）";
    formItem.id = "2";
    formItem.placeholder = "1-15";
    formItem.minval = 1;
    formItem.maxval = 15;
    formItem.val = "0";
    formItem.valtext = "";
    formItem.inputtype = "text";
    formItem.scorerate = 1;
    formItem.notnull = true;
    $scope.pjFormList.push(formItem);

    formItem = new Object();
    formItem.name = "item";
    formItem.title = "专业深度（评分范围：1分-45分）";
    formItem.id = "3";
    formItem.placeholder = "1-45";
    formItem.minval = 1;
    formItem.maxval = 45;
    formItem.val = "0";
    formItem.valtext = "";
    formItem.inputtype = "text";
    formItem.scorerate = 1;
    formItem.notnull = true;
    $scope.pjFormList.push(formItem);

    formItem = new Object();
    formItem.name = "item";
    formItem.title = "联系实际（评分范围：1分-15分）";
    formItem.id = "4";
    formItem.placeholder = "1-15";
    formItem.minval = 1;
    formItem.maxval = 15;
    formItem.val = "0";
    formItem.valtext = "";
    formItem.inputtype = "text";
    formItem.scorerate = 1;
    formItem.notnull = true;
    $scope.pjFormList.push(formItem);

    formItem = new Object();
    formItem.name = "item";
    formItem.title = "您对课程的总体感觉如何？请填写不少于3条修改意见";
    formItem.id = "5";
    formItem.placeholder = "";
    formItem.minval = 0;
    formItem.maxval = 0;
    formItem.val = "";
    formItem.valtext = "";
    formItem.inputtype = "textarea";
    formItem.scorerate = 1;
    formItem.notnull = true;
    $scope.pjFormList.push(formItem);

    getDataSource.getDataSource(['GetZJPJKWInfo'], { kwid: kwid }, function (datatemp) {
        var data = datatemp[0];
        $scope.kcwh = new Object();
        $scope.kcwh.id = data.id;
        $scope.kcwh.bt = data.bt;
        $scope.kcwh.kssj = data.kssj;
        $scope.kcwh.jssj = data.jssj;
        $scope.kcwh.zjr = data.zjr;
    });

    $scope.changeRow = function () {
        var length = $scope.pjFormList.length;
        $scope.totalScore = 0;
        var tempval = 0;
        var tempminval = 0;
        var tempmaxval = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.pjFormList[i].inputtype != 'textarea') {
                if ($scope.pjFormList[i].val == null || $scope.pjFormList[i].val == undefined) {
                    tempval = 0;
                } else {
                    tempval = parseInt($scope.pjFormList[i].val);
                }
                $scope.totalScore = $scope.totalScore + tempval;
            }
            //if (isNaN(tempval) || tempval.indexOf('.') > -1) {
            //	//showAlert.alert();
            //	alert("只能输入整数");
            //	$scope.pjFormList[i].val = "";
            //	break;
            //}
            //tempminval = $scope.pjFormList[i].minval;
            //tempmaxval = $scope.pjFormList[i].maxval;
            //if (tempval != "" && tempval != undefined) {

            //	if (tempminval <= tempval && tempval <= tempmaxval) {

            //	} else {
            //		//showAlert.alert();
            //		alert("分值超过设定范围");
            //		$scope.pjFormList[i].val = "";
            //		break;
            //	}
            //}
        }
    }

    $scope.saveData = function () {
        var length = $scope.pjFormList.length;
        var tempnotnull = false;
        var tempval = "";
        var issubmit = true;
        for (var i = 0; i < length; i++) {
            tempnotnull = $scope.pjFormList[i].notnull;
            if (tempnotnull) {
                if ($scope.pjFormList[i].inputtype == "textarea") {
                    tempval = $scope.pjFormList[i].valtext;
                    if (tempval == "" || tempval == "0" || tempval == undefined) {
                        var msg = "'" + $scope.pjFormList[i].title + "'项为必填项，提交失败";
                        showAlert.alert(msg);
                        //alert(msg);
                        issubmit = false;
                        break;
                    }
                } else {
                    tempval = $scope.pjFormList[i].val;
                    if (tempval == "" || tempval == "0" || tempval == undefined || tempval <= 0) {
                        var msg = "'" + $scope.pjFormList[i].title + "'项为必填项，提交失败";
                        showAlert.alert(msg);
                        //alert(msg);
                        issubmit = false;
                        break;
                    }
                    if (isNaN(tempval)) {
                        var msg = "'" + $scope.pjFormList[i].title + "'项只能输入数字，提交失败";
                        showAlert.alert(msg);
                        //alert(msg);
                        issubmit = false;
                        break;
                    }
                }
            }
        }
        if (!issubmit) {
            return;
        }
        //保存数据
        if (!confirm("评价提交后，将不能再修改，确定要提交吗？")) return false;

        var pjFormObj = new Object();
        pjFormObj.kwid = kwid;
        pjFormObj.zjid = jsid;
        pjFormObj.totalscore = $scope.totalScore;
        pjFormObj.ListPJItem = $scope.pjFormList;

        var loginData = Restangular.one('Appraise/action/');
        loginData.post("SaveZJPJData", pjFormObj).then(function (data) {
            if (data.msgStatus) {
                //alert("保存成功");
                $ionicPopup.alert({
                    title: "信息提示",
                    template: "保存成功！",
                    buttons: [
                                   {
                                       text: '<b>确认</b>',
                                       type: 'button-positive'
                                   }
                    ]
                });
                $state.go('app.default_list', { title: '专家评审', category: 'zjpjlist' });
            } else {
                showAlert.alert(data.msgContent);
                //alert(data.msgContent)
            }
        });
    }
})
.controller("appraise_defaultController", function ($scope, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userid = sessionStorage.userid;
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
        $scope.list = new Array();
        $scope.nowpageIndex = 0;
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.loadMore = function () {
        $scope.nowpageIndex++;
        var getmoreData = Restangular.one("ListData/action/GetPageData/" + $scope.category + "/" + $scope.nowpageIndex + "/" + $scope.userid + "/" + $scope.onecard + "/" + $scope.finfo_id);
        getmoreData.get().then(function (data) {
            $scope.returnJson = data;
            console.log("data", $scope.returnJson);
            var returndata = data.listData;
            if (returndata.length == 0) {
                $scope.moreDataCanBeLoaded = false;
            }
            for (var c = 0; c < returndata.length; c++) {
                $scope.list.push(returndata[c]);
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
    $scope.$on('$stateChangeSuccess', function () {
        //$scope.loadMore();
    });
    $scope.showDetial = function (item) {
        console.log("showDetial", item);
        if ($scope.returnJson.hasDetail) {
            var kecolumn = $scope.returnJson.keyColumn;
            if (item.doScript && item.doScript.length > 0) {
                eval("defaultList." + item.doScript + "(" + item.keyData + ")");
            }
            $state.go('app.default_detial', { id: item.keyData, category: $scope.category, title: $scope.title });
        }
        else if (item.goHref) {
            //console.log("item", item);
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

    $scope.ispj = $stateParams.ispj;
    $scope.pjstatus = false;
    if ($scope.ispj == "1") {
        $scope.pjstatus = true;
        $scope.pjstatustext = "已评";
    } else {
        $scope.pjstatustext = "未评";
    }
    $scope.marginbottom = "";
    if ($rootScope.AppConfig.showBottomButton) {
        $scope.marginbottom = "margin-bottom:47px;";
    }
    $scope.CheckToggle = function () {
        var queryParam;
        if ($scope.ispj == "-1") {
            queryParam = { title: $scope.title, category: 'zjpjlist_yp', ispj: "1", finfo_id: '' };
        } else {
            queryParam = { title: $scope.title, category: 'zjpjlist', ispj: "-1", finfo_id: '' };
        }
        $state.go("app.appraise_default", queryParam);
        //$scope.loadMore($scope.crrentTab, $scope.ispj);
    }
}).controller("studentUserInfoController", function ($scope, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, getDataSource, showAlert, checkidcard) {

    $scope.goBack = function () {
        $state.go("app.index");
    }
    $scope.showSave = true;
    if ($rootScope.AppConfig.showSave != undefined && !$rootScope.AppConfig.showSave)
    {
        $scope.showSave = false;
    }
    $scope.stu_info_id = sessionStorage.stu_info_id;
    $scope.stuinfo = {};
    $scope.mzlist = [];
    $scope.dplist = [];

    getDataSource.getDataSource(['getmzlist', 'getdplist', 'GetStuInfoById'], { info_id: $scope.stu_info_id }, function (datamz) {
        $scope.mzlist = datamz[1].data;
        $scope.dplist = datamz[2].data;
        $scope.stuinfo = datamz[0].data[0];
        $("#csny").val($scope.stuinfo.csny);
    });
    //退出系统
    $scope.exit = function () {
        cordovaService.exitApp();
    }
    $scope.checkdata = function () {
        if ($.trim($scope.stuinfo.mz) == "") {
            showAlert.alert("民族不能为空!");
            return false;
        }
        $scope.stuinfo.csny = $.trim($("#csny").val());
        if ($.trim($scope.stuinfo.csny) == "") {
            showAlert.alert("出生日期不能为空!");
            return false;
        }
        if ($.trim($scope.stuinfo.dp) == "") {
            showAlert.alert("党派不能为空!");
            return false;
        }
        if ($.trim($scope.stuinfo.sfzh) == "") {
            showAlert.alert("身份证不能为空!");
            return false;
        }
        if (!checkidcard.IdCardValidate($.trim($scope.stuinfo.sfzh))) {
            showAlert.alert("身份证号格式错误!");
            return false;
        }
        if (!(/^1[3|5|8][0-9]\d{8}$/.test($scope.stuinfo.sjhm))) {
            showAlert.alert("手机号码填写错误!");
            return false;
        }
        if ($.trim($scope.stuinfo.dwdh) == "") {
            showAlert.alert("办公电话不能为空!");
            return false;
        }
        if (!(/^0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}$/.test($scope.stuinfo.dwdh))) {
            showAlert.alert("办公电话格式错误!");
            return false;
        }
        if ($.trim($scope.stuinfo.szdw) == "") {
            showAlert.alert("所在单位不能为空!");
            return false;
        }
        if ($.trim($scope.stuinfo.zw) == "") {
            showAlert.alert("职务不能为空!");
            return false;
        }
        return true;
    }


    $scope.updateStuInfo = function () {
        if ($scope.checkdata()) {
            //console.log($scope.stuinfo);
            getDataSource.getDataSource(['UpdateStuInfoById'], { mz: $scope.stuinfo.mz, csny: $scope.stuinfo.csny, dp: $scope.stuinfo.dp, sjhm: $scope.stuinfo.sjhm, sfzh: $scope.stuinfo.sfzh, szdw: $scope.stuinfo.szdw, zw: $scope.stuinfo.zw, dwdh: $scope.stuinfo.dwdh, info_id: $scope.stu_info_id }, function (datatemp) {
                showAlert.alert("修改成功!");
            }, function (error) {
                showAlert.alert("修改失败!");
            });
        }
    }
})
.controller("studentQdMsgController", function ($scope, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, getDataSource, showAlert, checkidcard) {


    $scope.stu_info_id = sessionStorage.stu_info_id;
    $scope.iscd = 1; //是否已经迟到 0 为 迟到  1为 签到
    $scope.qddate = [];


    $scope.saoma = function () {

        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();

        if (isIOS) {
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                xsfBarcode.scan(
                           function (result) {
                               if (result.cancelled == 1) {
                                   return;
                               }
                               $scope.kwaddress = $.trim(result.text);
                               //根据 教室名称和学员ID取不到学员信息---该学员不是该班级的学员
                               getDataSource.getDataSource(['getStuQdMsg'], { kwaddress: $scope.kwaddress, info_id: $scope.stu_info_id }, function (data) {
                                   //showAlert.alert(JSON.stringify(data));
                                   if (data && data.length > 0) {
                                       //存在三天内没有评价的课程
                                       getDataSource.getDataSource(['getWpkcCount'], { bcid: data[0].bcid, info_id: $scope.stu_info_id }, function (wpdata) {
                                           if (wpdata && wpdata.length > 0) {
                                               var wpkc = "";
                                               for (var i = 0; i < wpdata.length; i++) {
                                                   wpkc += "《"+wpdata[i].bt+"》,";
                                               }
                                               showAlert.alert("请先评价" + wpkc + "课程以后再扫描二维码考勤！");
                                           }
                                           else {
                                               //是否已经签到
                                               getDataSource.getDataSource(['getStuIsQdMsg'], { bcid: data[0].bcid, kcid: data[0].kcid, info_id: $scope.stu_info_id }, function (dataisstu) {
                                                   if (dataisstu && dataisstu[0].cnt > 0) {
                                                       showAlert.alert("您已签到，无须再次签到！");
                                                   } else {
                                                       //扫码时间再开始时间之后30以内为正常签到
                                                       //超过30分钟之后扫码签到为迟到
                                                       getDataSource.getDataSource(['isQdTime'], { kwaddress: $scope.kwaddress, info_id: $scope.stu_info_id }, function (dataqd) {
                                                           if (dataqd && dataqd[0].cnt > 0) {
                                                               $scope.iscd = 1;//1
                                                           } else {
                                                               $scope.iscd = 0;
                                                           }
                                                           getDataSource.getDataSource(['insertjw_smkq'], { bcid: data[0].bcid, kcid: data[0].kcid, info_id: $scope.stu_info_id, qdstatus: $scope.iscd }, function (datatemp) {
                                                               showAlert.alert("签到成功！");
                                                               //执行刷新签到信息列表
                                                               $scope.doRefresh();
                                                           })
                                                           // 插入考勤机数据
                                                           getDataSource.getDataSource(['insertSmKq'], { userid: $rootScope.user.userid, kwaddress: data[0].kwaddress }, function (datatemp) {
                                                           })
                                                       })
                                                   }
                                               })
                                           }
                                       })
                                   } else {
                                       showAlert.alert("您当前不在班级考勤时间段内！")
                                   }
                               })
                           },
                           function (error) {
                               showAlert.alert("Scanning failed: " + error);
                           }
               );
            }
        }

        if (isAndroid) {
            cordova.plugins.barcodeScanner.scan(
               function (result) {
                   //alert("We got a barcode\n" +
                   //      "Result: " + result.text + "\n" +
                   //      "Format: " + result.format + "\n" +
                   //      "Cancelled: " + result.cancelled);
                   if (result.cancelled == 1) {
                       return;
                   }
                   $scope.kwaddress = $.trim(result.text);
                   //根据 教室名称和学员ID取不到学员信息---该学员不是该班级的学员
                   getDataSource.getDataSource(['getStuQdMsg'], { kwaddress: $scope.kwaddress, info_id: $scope.stu_info_id }, function (data) {
                       //showAlert.alert(JSON.stringify(data));
                       if (data && data.length > 0) {
                           //存在三天内没有评价的课程
                           getDataSource.getDataSource(['getWpkcCount'], { bcid: data[0].bcid, info_id: $scope.stu_info_id }, function (wpdata) {
                               if (wpdata && wpdata.length > 0) {
                                   var wpkc = "";
                                   for (var i = 0; i < wpdata.length; i++) {
                                       wpkc += "《" + wpdata[i].bt + "》,";
                                   }
                                   showAlert.alert("请先评价" + wpkc + "课程以后再扫描二维码考勤！");
                               }
                               else {
                                   //是否已经签到
                                   getDataSource.getDataSource(['getStuIsQdMsg'], { bcid: data[0].bcid, kcid: data[0].kcid, info_id: $scope.stu_info_id }, function (dataisstu) {
                                       if (dataisstu && dataisstu[0].cnt > 0) {
                                           showAlert.alert("您已签到，无须再次签到！");
                                       } else {
                                           //扫码时间再开始时间之后30以内为正常签到
                                           //超过30分钟之后扫码签到为迟到
                                           getDataSource.getDataSource(['isQdTime'], { kwaddress: $scope.kwaddress, info_id: $scope.stu_info_id }, function (dataqd) {
                                               if (dataqd && dataqd[0].cnt > 0) {
                                                   $scope.iscd = 1;//1
                                               } else {
                                                   $scope.iscd = 0;
                                               }
                                               getDataSource.getDataSource(['insertjw_smkq'], { bcid: data[0].bcid, kcid: data[0].kcid, info_id: $scope.stu_info_id, qdstatus: $scope.iscd }, function (datatemp) {
                                                   showAlert.alert("签到成功！");
                                                   //执行刷新签到信息列表
                                                   $scope.doRefresh();
                                               })
                                               // 插入考勤机数据
                                               getDataSource.getDataSource(['insertSmKq'], { userid: $rootScope.user.userid, kwaddress: data[0].kwaddress }, function (datatemp) {
                                               })
                                           })
                                       }
                                   })
                               }
                           })

                       } else {
                           showAlert.alert("您当前不在班级考勤时间段内！")
                       }
                   })

               },
               function (error) {
                   alert("扫描失败: " + error);
               }
            );
        }

    }




    //$scope.pagelen = 5;
    //$scope.pageindex = 0;

    //$scope.doLoadMore = function () {
    //    $scope.startnum = $scope.pagelen * $scope.pageindex;
    //    $scope.endnum = ($scope.pageindex + 1) * $scope.pagelen;
    //    getDataSource.getDataSource(['getqdinfo'], { info_id: $scope.stu_info_id, startnum: $scope.startnum, endnum: $scope.endnum }, function (data) {
    //        if (data.length == 0) {
    //            return;
    //        }
    //        $scope.pageindex += 1;
    //        $.each(data, function (i, obj) {
    //            $scope.qddate.push(obj);
    //        })
    //    })
    //    $scope.$broadcast('scroll.refreshComplete');
    //};
    //$scope.doLoadMore();

    $scope.doRefresh = function () {
        getDataSource.getDataSource(['getqdinforefresh'], { info_id: $scope.stu_info_id }, function (data) {
            $scope.qddate = [];
            $.each(data, function (i, obj) {
                $scope.qddate.push(obj);
            })
        }, function (e) { });
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
})
.controller("meetingListController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser,
	$ionicScrollDelegate, $state, $stateParams, $ionicModal, $ionicPopover, $ionicTabsDelegate, getDataSource, $document, $rootScope) {

    $scope.meetinglist = [];

    getDataSource.getDataSource(['getMeetingInfo'], {}, function (datatemp) {
        $scope.meetinglist = datatemp;
    });

    $scope.openModal = function (item) {
        $state.go("app.meeting_detail", { info_id: item.id });
    }

})
.controller("meetingDetailController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser,
	$ionicScrollDelegate, $state, $stateParams, $ionicModal, $ionicPopover, $ionicTabsDelegate, getDataSource, $document, $rootScope, downService, $http) {

    $scope.meetingdetail = [];
    $scope.attachlist = [];

    $http.get("../config/AppConfig.json").then(function (data) {
        var nowdata = data.data;
        $scope.preFileurl = nowdata.getOAAttachFile;
    });

    getDataSource.getDataSource(['getMeetingDetailInfo'], { info_id: $stateParams.info_id }, function (datatemp) {
        $scope.meetingdetail = datatemp;
    });
    getDataSource.getDataSource(['getMeetingAttach'], { info_id: $stateParams.info_id }, function (datatemp) {
        $scope.attachlist = datatemp;
    });

    $scope.downfile = function (attach) {
        var filepath = $scope.preFileurl + attach.filepath.replace(new RegExp("\\\\", "gi"), "/");
        var filename = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length);
        downService.cordovaDown(filepath, filename);
    };

})
.controller("moiveListController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser,
	$ionicScrollDelegate, $state, $stateParams, $ionicModal, $ionicPopover, $ionicTabsDelegate, getDataSource, $document, $rootScope) {

    $scope.moivelist = [];

    getDataSource.getDataSource(['getMoiveInfo'], { info_id: $stateParams.info_id }, function (datatemp) {
        $scope.moivelist = datatemp;
    });

    $scope.openModal = function (item) {
        $state.go("app.moive_detail", { info_id: item.id });
    }

})
.controller("moiveDetailController", function ($scope, $timeout, $ionicListDelegate, Restangular, $location, getUser,
	$ionicScrollDelegate, $state, $stateParams, $ionicModal, $ionicPopover, $ionicTabsDelegate, getDataSource, $document, $rootScope, downService, $http) {


    $scope.moivedetail = [];
    $scope.attachlist = [];

    $http.get("../config/AppConfig.json").then(function (data) {
        var nowdata = data.data;
        $scope.preFileurl = nowdata.getOAAttachFile;
    });

    getDataSource.getDataSource(['getMoiveDetailInfo'], { info_id: $stateParams.info_id }, function (datatemp) {
        $scope.moivedetail = datatemp;
    });

    getDataSource.getDataSource(['getMoiveAttach'], { info_id: $stateParams.info_id }, function (datatemp) {
        $scope.attachlist = datatemp;
    });

    $scope.downfile = function (attach) {
        var filepath = $scope.preFileurl + attach.filepath.replace(new RegExp("\\\\", "gi"), "/");
        var filename = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length);
        downService.cordovaDown(filepath, filename);
    };

})
.controller("loadingPageController", function ($scope, $rootScope, $timeout, $ionicListDelegate, Restangular, $location, getUser, $ionicScrollDelegate, $state, $stateParams, $ionicNavBarDelegate, cordovaService, defaultList, getDataSource, showAlert, checkidcard, $http, $ionicSlideBoxDelegate) {
    $scope.goMain = function () {
        $state.go("login");
    };

    $http.get("../config/loadPages.json").then(function (data) {
        $scope.loadimgs = data.data;
        $ionicSlideBoxDelegate.update();
        $scope.slideHasChanged = function (index) {
            if (index == $scope.loadimgs.length - 1) {
                $scope.ishow = true;
                $(".slider-pager").hide();
            }
            else {
                $scope.ishow = false;
                $(".slider-pager").show();
            }
        }
    })


    if (window.localStorage.IsFirstStart) {
        $state.go("login");
    } else {
        window.localStorage.IsFirstStart = true;
    }
})

