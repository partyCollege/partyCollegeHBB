APPController.controller("myController", function ($scope) {

})
.controller("myplaceController", function ($scope, $stateParams, Restangular, $ionicNavBarDelegate, $ionicActionSheet, getDataSource) {
    $scope.userid = sessionStorage.stu_info_id;
    $scope.usertype = sessionStorage.usertype = "student";
    $scope.bcid = sessionStorage.bcinfo_id;
    $scope.uname = sessionStorage.uname;
    $scope.isshow = true;
    //获取座位
    getDataSource.getDataSource("getSeat", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {

        if (data.length == 0) {
            $scope.isshow = false;
            $("#showSeat").attr("style", "display:none");
        } else {
            $scope.pai = data[0].pai;
            $scope.zuo = data[0].zuo;
            $("#showNoSeat").attr("style", "display:none");
        }
    });
})
    // 班级共享 
.controller("sharefileController", function ($timeout, $http, $scope, Restangular, $state, $rootScope, $stateParams, cordovaService, getDataSource) {
    getDataSource.getDataSource("getShareFile", { bcid: sessionStorage.bcinfo_id }, function (data) {
        //console.log(data);
        if (data != null) {
            $scope.dataZpywSource = data;
        }
    });

    $scope.loadData = function (item) {
        var url = decodeURI("1a3d4931-825f-4729-b9d3-b5d4f461e191.xlsx");//  item.FILENAME
        $scope.url = url;
        //cordovaService.downFile(url);
        $state.go("app.other", { url: url });
    }
})
   // 下载页面 
.controller("otherController", function ($timeout, $http, $scope, Restangular, $state, $rootScope, $stateParams) {
    var url = decodeURI($stateParams.url);
    $scope.url = $rootScope.AppConfig.getShareFile + url;
    //window.open($scope.url);
    $(function () {
        $timeout(function () {
            //alert(document.body.scrollHeight);
            var height = document.body.scrollHeight - 43;
            $("#myiframe").css("height", height);
            $("#myiframe").css("width", "100%");
            //alert(height);
            $("#myiframe").attr("src", $scope.url);
        }, 1500);
    })
})
.controller("iosfileController", function ($timeout, $http, $scope, Restangular, $state, $rootScope, $stateParams) {
    var url = decodeURI($stateParams.url);
    $scope.url = url;
    //window.open($scope.url);
    $(function () {
        $timeout(function () {
            //alert(document.body.scrollHeight);
            //var height = document.body.scrollHeight - 43;
            //$("#myiframe").css("height", height);
            //$("#myiframe").css("width", "100%");
            //alert(height);
            $("#myiframe").attr("src", $scope.url);
            //$("#mydivFile").load($scope.url);
        }, 500);
    })
})
.controller("weburlController", function ($timeout, $http, $scope, Restangular, $state, $rootScope, $stateParams, $ionicHistory, getDataSource) {
    var url = decodeURI($stateParams.url);
    document.domain = $rootScope.AppConfig.getDCWJIP;
    getDataSource.getDataSource(["getAnsCount", "getAnsId"], { userid: sessionStorage.stu_info_id, dataflag: url }, function (data) {
        $scope.AnsCount = _.find(data, function (d) {
            return d.name == "getAnsCount";
        }).data;
        $scope.AnsId = _.find(data, function (d) {
            return d.name == "getAnsId";
        }).data;

        if ($scope.AnsCount[0].acount == 0) {
            $scope.url = $rootScope.AppConfig.getDCWJpath + "pad=1&uid=" + sessionStorage.stu_info_id + "&cid=" + sessionStorage.bcinfo_id + "#/question/" + url + "/f4196c7c7daf718daaaba4a48bf226dc//";
        }
        else {
            $scope.url = $rootScope.AppConfig.getDCWJpath + "token=1&uid=" + sessionStorage.stu_info_id + "&cid=" + sessionStorage.bcinfo_id + "#/goWj/" + url + "/" + $scope.AnsId[0].id + "/";
        }
    });

    //window.open($scope.url);
    $(function () {
        $timeout(function () {
            var height = document.body.scrollHeight - 43;
            $("#myiframe").css("height", height);
            $("#myiframe").attr("src", $scope.url);
        }, 1000);
    })

    window.goHisBack = function () {
        $ionicHistory.goBack();
    }
})
.controller("chooseclassController", function ($scope, $state, $rootScope, $ionicModal, $ionicPopup, $filter, $ionicScrollDelegate, getDataSource, $timeout) {

    //减去首页角标的方法
    // _.find($rootScope.iconvalArray, function (d) {
    //     return d.key == "wpnum";
    //}).val--;
    $scope.undisplay = false;//控制显示有无数据的提示
    $scope.unchoosed = "(0)";
    $scope.choosed = "(0)";
    $scope.loaddata = function () {
        $scope.dataSource = [];
        $scope.dataHasSource = [];

        //学员选修数量
        $scope.dataCount = 0;
        var unchoosed = 0;
        var choosed = 0;
        //加载待选的选修课
        getDataSource.getDataSource(["getXXKChoose", "getClassDY"], { bcid: sessionStorage.bcinfo_id, classid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
            //console.log(data);
            if (data != null) {
                var getXXK = _.find(data, function (d) {
                    return d.name == "getXXKChoose";
                }).data;
                var getClassDY = _.find(data, function (d) {
                    return d.name == "getClassDY";
                }).data;
                var isAgain = true;
                //单元
                _.forEach(getClassDY, function (n, key) {
                    var xxkDY = {
                        title: n.dymc, time: $filter('date')(n.kssj, 'MM月dd日') + "~" + $filter('date')(n.jssj, 'MM月dd日'), kcnum: n.gxzkcsl, info_id: n.id, show: true, xxkdata: []
                    };
                    // 单元下的选修课
                    _.forEach(getXXK, function (y, key) {
                        if (n.id == y.dyid) {
                            var datarow = { id: y.id, kcmc: y.kcmc, jsmc: y.jsmc, mkid: y.mkid, dyid: y.dyid, checked: false, disabled: false, mark: "" };
                            if (y.sfbs == 1) {
                                datarow.mark = "必讲课程";
                                datarow.disabled = true;
                            }
                            xxkDY.xxkdata.push(datarow);

                            if (isAgain) {
                                unchoosed++;
                                $scope.unchoosed = "(" + unchoosed + ")";
                                isAgain = false;
                            }
                        }
                    })
                    $scope.dataSource.push(xxkDY);
                });
            }
        });
        getDataSource.getDataSource(["getClassMK", "getMkXXKChoose"], { bcid: sessionStorage.bcinfo_id, classid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
            //console.log(data);
            if (data != null) {
                var getMkXXKChoose = _.find(data, function (d) {
                    return d.name == "getMkXXKChoose";
                }).data;
                var getClassMK = _.find(data, function (d) {
                    return d.name == "getClassMK";
                }).data;
                //var mkCount = 0;               
                //单元
                _.forEach(getClassMK, function (n, key) {
                    //mkCount++;
                    var isAgain = true;
                    var xxkMK = {
                        title: n.mkmc, time: $filter('date')(n.kssj, 'MM月dd日') + "~" + $filter('date')(n.jssj, 'MM月dd日'), kcnum: n.gxzkcsl, info_id: n.id, show: true, xxkdata: []
                    };
                    // 模块下的选修课
                    _.forEach(getMkXXKChoose, function (y, key) {
                        if (n.id == y.mkid) {
                            var datarow = { id: y.id, kcmc: y.kcmc, jsmc: y.jsmc, mkid: y.mkid, dyid: y.dyid, checked: false, disabled: false, mark: "" };
                            if (y.sfbs == 1) {
                                datarow.mark = "必讲课程";
                                datarow.disabled = true;
                            }
                            xxkMK.xxkdata.push(datarow);
                            if (isAgain) {
                                unchoosed++;
                                $scope.unchoosed = "(" + unchoosed + ")";
                                isAgain = false;
                            }
                        }
                    })
                    $scope.dataSource.push(xxkMK);
                    //if (mkCount == getClassMK.length)
                    //{
                    //    _.forEach($scope.dataSource, function (x, key) {
                    //        if (x.xxkdata.length > 0) {
                    //            unchoosed++;
                    //        }
                    //    })
                    //    //$scope.unchoosed = "(" + unchoosed + ")";$scope.unchoosed = "(" + unchoosed + ")";
                    //}
                });
            }

        });

        //加载已选的选修课
        getDataSource.getDataSource(["getHasNoMKXXKChoose", "getClassDY", "getClassKC"], { bcid: sessionStorage.bcinfo_id, classid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
            //console.log(data);
            if (data != null) {
                var getXXK = _.find(data, function (d) {
                    return d.name == "getHasNoMKXXKChoose";
                }).data;
                var getClassDY = _.find(data, function (d) {
                    return d.name == "getClassDY";
                }).data;
                var getClassKC = _.find(data, function (d) {
                    return d.name == "getClassKC";
                }).data;
                var isAgain = true;
                //单元
                _.forEach(getClassDY, function (n, key) {
                    var xxkDY = {
                        title: n.dymc, time: $filter('date')(n.kssj, 'MM月dd日') + "~" + $filter('date')(n.jssj, 'MM月dd日'), kcnum: n.gxzkcsl, info_id: n.id, show: true, xxkdata: []
                    };
                    // 单元下的选修课
                    _.forEach(getXXK, function (y, key) {
                        if (n.id == y.dyid) {
                            var datarow = { id: y.id, kcmc: y.kcmc, jsmc: y.jsmc, mkid: y.mkid, dyid: y.dyid, checked: false, mark: "" };
                            if (y.sfbs == 1) {
                                datarow.mark = "必讲课程";
                            }
                            _.forEach(getClassKC, function (x, key) {
                                if (y.id == x.jxkc_id) {
                                    datarow.checked = true;
                                }
                            })
                            xxkDY.xxkdata.push(datarow);
                            if (isAgain) {
                                choosed++;
                                $scope.choosed = "(" + choosed + ")";
                                isAgain = false;
                            }
                        }
                    })
                    $scope.dataHasSource.push(xxkDY);
                });
            }
        });
        getDataSource.getDataSource(["getClassMK", "getHasMKXXKChoose", "getClassKC"], { bcid: sessionStorage.bcinfo_id, classid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
            //console.log(data);
            if (data != null) {
                var getMkXXKChoose = _.find(data, function (d) {
                    return d.name == "getHasMKXXKChoose";
                }).data;
                var getClassMK = _.find(data, function (d) {
                    return d.name == "getClassMK";
                }).data;
                var getClassKC = _.find(data, function (d) {
                    return d.name == "getClassKC";
                }).data;
                //var mkCount = 0;                
                //单元
                _.forEach(getClassMK, function (n, key) {
                    //mkCount++;
                    var isAgain = true;
                    var xxkMK = {
                        title: n.mkmc, time: $filter('date')(n.kssj, 'MM月dd日') + "~" + $filter('date')(n.jssj, 'MM月dd日'), kcnum: n.gxzkcsl, info_id: n.id, show: true, xxkdata: []
                    };
                    // 模块下的选修课
                    _.forEach(getMkXXKChoose, function (y, key) {
                        if (n.id == y.mkid) {
                            var datarow = { id: y.id, kcmc: y.kcmc, jsmc: y.jsmc, mkid: y.mkid, dyid: y.dyid, checked: false };
                            if (y.sfbs == 1) {
                                datarow.mark = "必讲课程";
                            }
                            _.forEach(getClassKC, function (x, key) {
                                if (y.id == x.jxkc_id) {
                                    datarow.checked = true;
                                }
                            })
                            xxkMK.xxkdata.push(datarow);
                            if (isAgain) {
                                choosed++;
                                $scope.choosed = "(" + choosed + ")";
                                isAgain = false;
                            }
                        }
                    })
                    $scope.dataHasSource.push(xxkMK);
                    //if (mkCount == getClassMK.length) {
                    //    _.forEach($scope.dataHasSource, function (z, key) {
                    //        if (z.xxkdata.length > 0) {
                    //            choosed++;
                    //        }
                    //    })
                    //    $scope.choosed = "(" + choosed + ")";
                    //}
                });
            }
        });
    };
    $scope.loaddata();
    //选择事件，因为是复选框所以做特殊处理，无法取消选中的操作
    $scope.changeCheck = function (e1, e2) {
        _.forEach(e1.data, function (n, key) {
            if (n.info_id != e2.info_id) {
                n.checked = false;
            } else {
                e2.checked = true;
            }
        });
    }

    //提交选学操作
    $scope.subchoose = function (dyid, kcnum) {
        $scope.chooseList = [];//已选课程列表

        $scope.chooseParentList = [];//已选课程父节点列表

        _.forEach($scope.dataSource, function (n, key) {
            if (n.show) {
                // 添加该区块的所选择的课程
                if (n.info_id == dyid) {
                    _.forEach(n.xxkdata, function (m, key) {
                        if (m.checked) {
                            $scope.chooseList.push(m);
                            $scope.chooseParentList.push(n);
                        }
                    });
                }
            }
        });
        if ($scope.chooseList.length == 0) {
            $scope.showAlert();
        } else {
            if ($scope.chooseList.length <= kcnum || kcnum == 0) {
                $scope.showConfirm();
            }
            else {

                $ionicPopup.alert({
                    okType: "button-assertive",
                    okText: "确定",
                    title: "提示",
                    template: "您只能选择其中" + kcnum + "门课程"
                })
                .then(function (res) {

                });
            }
        }
    }
    // 确认弹出框
    $scope.showConfirm = function () {
        $ionicPopup.confirm({
            okType: "button-assertive",
            okText: "确定",
            cancelText: "取消",
            title: "提示",
            template: "提交不可修改，确定要提交吗？"
        })
        .then(function (res) {
            if (res) {
                // 先删除原有模块数据
                _.forEach($scope.chooseList, function (m, key) {
                    if (m.checked) {
                        getDataSource.getDataSource(["deleteMK", "deleteKC"], { xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id, mkid: m.mkid, kcid: m.id, dyid: m.dyid }, function (data) {

                        });
                    }
                });
                var isInsertMK = true;
                var isReload = true;
                var dataRows = 0;
                //已选学课程入库操作
                _.forEach($scope.chooseList, function (m, key) {
                    if (m.checked) {
                        $scope.dataCount++;
                        dataRows++;
                        m.disabled = true;
                        // 判断该模块是否已被选择
                        if (isInsertMK) {
                            getDataSource.getDataSource("selectMK", { xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id, mkid: m.mkid, kcid: m.id, dyid: m.dyid }, function (data) {
                                if (data.length == 0) {
                                    getDataSource.getDataSource("insertXXKMK", { xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id, mkid: m.mkid, kcid: m.id, dyid: m.dyid }, function (data) {

                                    });
                                }
                            });
                            isInsertMK = false;
                        }
                        getDataSource.getDataSource("insertXXK", { xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id, mkid: m.mkid, kcid: m.id, dyid: m.dyid }, function (data) {
                            if (isReload && dataRows == $scope.chooseList.length) {
                                $scope.loaddata();
                                isReload = false;
                            }
                        });
                    }
                });

                $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();//滚动条自动回到顶部

                //设置已选课程列表不可再次选择
                _.forEach($scope.chooseParentList, function (m, key) {
                    m.show = false;
                    _.forEach(m.data, function (n, key) {
                        n.disabled = true;
                    });
                });
                //$scope.loaddata();
                //$state.reload();
            } else {
                //取消不做任何操作
            }
        });
    };
    //警告弹出框
    $scope.showAlert = function () {
        $ionicPopup.alert({
            okType: "button-assertive",
            okText: "确定",
            title: "提示",
            template: "请选择一门选修课！"
        })
        .then(function (res) {

        });
    };


})

.controller("weekReportController", function ($scope, $stateParams, Restangular, $ionicActionSheet, $ionicPopup, $timeout, $location, $http, $ionicPopover, $ionicScrollDelegate, $rootScope, getDataSource) {
    var d = $stateParams;
    $scope.weekType = new Object();
    $scope.bclist = [];
    $scope.nowBCid = 0;
    $scope.chooseWeek = "";
    $scope.chooseMonth = "";
    $scope.weekDayClass = [];
    $scope.brithdayMonth = [];
    $scope.queryByMonth = [];
    var nowDate = new Date();
    $scope.title = $stateParams.title;

    // 获取是当年第几周
    var d1 = new Date();
    var d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1 - d2;
    var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
    var s2 = Math.ceil(s1 / 7);
    var nowMonth = nowDate.getUTCMonth() + 1;
    //alert("这是第" + s2 + "周");
    $scope.nowday = new Date(nowDate.getFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate());

    $http.get("../config/menus.json").then(function (data) {
        $scope.quickmenus = data.data;
        for (var i = 0; i < $scope.quickmenus.length; i++) {
            var menu = $scope.quickmenus[i];
            if (menu.title == $scope.title) {
                console.log(menu.category);
                $scope.weekType = menu;
            }
        }
    });
    // 加载日期
    for (var i = 1; i <= s2; i++) {
        $scope.nowWeekStart = $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay()));
        var start = $scope.nowWeekStart.getFullYear() + "年";
        var week = "";
        if ($scope.nowWeekStart.getUTCMonth() + 1 < 10) {
            start += parseInt($scope.nowWeekStart.getUTCMonth()) + 1 + "-" + $scope.nowday.DateAdd("d", -($scope.nowday.getUTCDay())).Format("dd") + "~";
        }
        $scope.nowWeekEnd = $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1);
        if ($scope.nowWeekEnd.getUTCMonth() + 1 < 10) {
            start += parseInt($scope.nowWeekEnd.getUTCMonth()) + 1 + "-" + $scope.nowWeekStart.DateAdd("w", 1).DateAdd("s", -1).Format("dd");
        }
        week = s2 - i + 1;
        start += "  第" + week + "周";
        $scope.brithdayMonth.push({ text: start, value: $scope.nowWeekStart });
        console.log(start);
        $scope.nowday = $scope.nowday.DateAdd("w", -1);
    }
    // 加载月份    
    for (var i = 1; i <= nowMonth; i++) {
        var queryMonth = $scope.nowday.getFullYear() + 1 + "年";
        var queryMonthValue = $scope.nowday.getFullYear() + 1 + "-";
        if ((nowMonth - i + 1) < 10) {
            queryMonth += "0" + (nowMonth - i + 1) + "月";
            queryMonthValue += "0" + (nowMonth - i + 1);
        }
        else {
            queryMonth += (nowMonth - i + 1) + "月";
            queryMonthValue += (nowMonth - i + 1);
        }
        $scope.queryByMonth.push({ text: queryMonth, value: queryMonthValue });
    }
    $scope.queryData = function () {
        $scope.weekDayClass = [];
        if ($scope.weekType.querytype == 1) {
            if ($scope.chooseWeek) {
                var month = parseInt($scope.chooseWeek.value.getUTCMonth()) + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                var date = $scope.chooseWeek.value.getFullYear() + "-" + month + "-" + $scope.chooseWeek.value.getUTCDate();
                $scope.nowWeekEnd = $scope.chooseWeek.value.DateAdd("w", 1).DateAdd("s", -1);
                var endmonth = parseInt($scope.nowWeekEnd.getUTCMonth()) + 1;
                if (endmonth < 10) {
                    endmonth = "0" + endmonth;
                }
                var enddate = $scope.nowWeekEnd.getFullYear() + "-" + endmonth + "-" + $scope.nowWeekEnd.getUTCDate();
                if ($scope.weekType.countitem2 && $scope.weekType.category2) {
                    getSql = "getReportByUnionData";
                }
                else {
                    getSql = "getReportData";
                }
                getDataSource.getDataSource(getSql, { startTime: date, endTime: enddate, countitem: $scope.weekType.countitem, objclass: $scope.weekType.category, countitem2: $scope.weekType.countitem2, objclass2: $scope.weekType.category2 }, function (data) {
                    //console.log(data);
                    if (data != null) {
                        $scope.dataZpywSource = data;
                        for (var i = 0; i < $scope.dataZpywSource.length; i++) {
                            var bc = $scope.dataZpywSource[i].bt;
                            var pjf = $scope.dataZpywSource[i].avgnum.toFixed(2);
                            var mc = "第" + (i + 1) + "名";
                            $scope.weekDayClass.push({ bcname: bc, mc: mc, pjf: pjf });
                        }
                    }
                });
            }
        }
        else {
            if ($scope.chooseMonth) {
                getDataSource.getDataSource("getReportByMonthData", { startTime: $scope.chooseMonth.value, endTime: "", countitem: $scope.weekType.countitem, objclass: $scope.weekType.category }, function (data) {
                    //console.log(data);
                    if (data != null) {
                        $scope.dataZpywSource = data;
                        for (var i = 0; i < $scope.dataZpywSource.length; i++) {
                            var bc = $scope.dataZpywSource[i].bt;
                            var pjf = $scope.dataZpywSource[i].avgnum.toFixed(2);
                            var mc = "第" + (i + 1) + "名";
                            $scope.weekDayClass.push({ bcname: bc, mc: mc, pjf: pjf });
                        }
                    }
                });
            }
        }
    }
    $scope.queryData();
    $scope.gonext = function () {
        alert($scope.chooseWeek.value);
    };
})

.controller("collegeGuideController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {
    var map;
    var pointPeoplesSquare = new BMap.Point(121.479394, 31.238743);//People's Square of Shanghai
    var labelCELAP = "上海行政学院";
    var pointCELAP = new BMap.Point(121.419041, 31.165144); //new BMap.Point(121.549004, 31.201835);//CELAP
    var pointCurrent = null;
    var pointDest = pointCELAP;
    var currentRouteType = 'transit';
    var loadFlag = false;

    $scope.tabs = [{ name: "学员须知", active: true }, { name: "地图导航", active: false }];
    $scope.nowtab = '学员须知';
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    $scope.go = function (tab) {
        angular.forEach($scope.tabs, function (now) {
            now.active = false;
        });
        tab.active = true;
        $scope.nowtab = tab.name;

        if (map && $scope.nowtab == "地图导航") {
            loadFlag = true;
            if (pointCurrent) {
                $scope.switchMapType();
            } else {
                if (pointDest) {
                    locateToDest();
                }
            }
        }
    }

    console.log("guidelineCollegeController");

    $scope.load = function () {
        console.log("load");
        map = new BMap.Map("l-map");
        initNavigate();
    };

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

    function initNavigate() {
        locateToDest();
        console.log("initNavigate");
        getPosition();
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



    $scope.dataGuidelineCollegeSource = [
          //{"id" : "1" , "title" : "中央组织部《关于在干部教育培训中进一步加强学员管理的规定》（摘录）"} , 
          //{"id" : "2" , "title" : "中国浦东干部学院学员管理工作条例（办法）"}
    ];

    $scope.dataLoad = function () {
        getDataSource.getDataSource("getNewList", { category: "学员须知" }, function (data) {
            $scope.dataGuidelineCollegeSource = data;
        });
    }();

    $scope.onGuidelineClick = function (item) {
        //console.log(item);
        $state.go("guidelineCollegeDetail", { id: item.info_id });
    };
})
.controller("collegeLifeGuideController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {

})
    .controller("xyxzController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $http) {
        $http.get("../config/xyxz.json").then(function (data) {
            var nowdata = data.data;
            $scope.xyxz = nowdata;
        });

        $scope.changeDisplay = function (id) {
            if ($("#" + id).attr("style") == "display:none;") {
                $("#" + id).attr("style", "display:online;");
            }
            else {
                $("#" + id).attr("style", "display:none;");
            }
            if ($("#i" + id).attr("class") == "ion-arrow-up-b") {
                $("#i" + id).attr("class", "ion-arrow-down-b");
            }
            else {
                $("#i" + id).attr("class", "ion-arrow-up-b");
            }
        }
    })
.controller("baoxiuController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {
    $scope.changeDisplay = function (id) {
        if ($("#" + id).attr("style") == "display:none;") {
            $("#" + id).attr("style", "display:online;");
        }
        else {
            $("#" + id).attr("style", "display:none;");
        }
        if ($("#i" + id).attr("class") == "ion-arrow-up-b") {
            $("#i" + id).attr("class", "ion-arrow-down-b");
        }
        else {
            $("#i" + id).attr("class", "ion-arrow-up-b");
        }
    }
})
.controller("jxzyController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {
    $scope.goDetial = function () {
        $state.go("app.jxzyDe");
    }
})
.controller("jxzyDeController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {

}).controller("swdxtsgController", function ($rootScope, $scope, $state, $ionicHistory, showAlert, getDataSource, $timeout) {

})
.controller("noticelistController", function ($scope, $state, $rootScope, $ionicHistory, $ionicModal, $ionicPopup, getDataSource) {
    $scope.goback = function () {
        $ionicHistory.goBack();
    }
    $scope.undisplay = false;
    $scope.showAdd = false;
    $scope.dataSource = [];
    if (sessionStorage.usertype == "teacher") {
        $scope.showAdd = true;
    }
    //{ noticeid: "1", noticetitle: "我校哲学", releasetime: "2015-9-9 08:30", isread: "5" }, { noticeid: "2", noticetitle: "我校哲学111", releasetime: "2015-9-19 08:30", isread: null }, { noticeid: "3", noticetitle: "我校哲学2222", releasetime: "2015-9-29 08:30", isread: null }, { noticeid: "1", noticetitle: "我校哲学", releasetime: "2015-9-9 08:30", isread: "5" }, { noticeid: "2", noticetitle: "我校哲学111", releasetime: "2015-9-19 08:30", isread: null }, { noticeid: "3", noticetitle: "我校哲学2222", releasetime: "2015-9-29 08:30", isread: null }, { noticeid: "1", noticetitle: "我校哲学", releasetime: "2015-9-9 08:30", isread: "5" }, { noticeid: "2", noticetitle: "我校哲学111", releasetime: "2015-9-19 08:30", isread: null }, { noticeid: "3", noticetitle: "我校哲学2222", releasetime: "2015-9-29 08:30", isread: null }
    $scope.load = function () {
        var datakey = "getNoticeListTeacher";
        if (sessionStorage.usertype == "student") {
            datakey = "getNoticeList";
        }
        getDataSource.getDataSource(datakey, { xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id
        }, function (data) {
            $scope.dataSource = data;
            if ($scope.dataSource.length == 0) {
                $scope.undisplay = true;
            }
        });
    }
    $scope.load();
    $ionicModal.fromTemplateUrl('addnotice', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        if (sessionStorage.bcinfo_id) {
            $state.go("app.noticeAdd");
        }
        else {
            $ionicPopup.alert({
                title: "信息提示",
                template: "<div style='text-align:center;'>暂无班级！</div>",
                buttons: [
                                   {
                                       text: '<b>确认</b>',
                                       type: 'button-positive'
                                   }
                ]
            });
        }
    };

    $scope.deletenotice = function (e) {
        // 确认弹出框
        $ionicPopup.confirm({
            okType: "button-assertive",
            okText: "确定",
            cancelText: "取消",
            title: "提示",
            template: "<div style='text-align:center;'>确定要删除吗？</div>"
        }).then(function (res) {
            if (res) {
                getDataSource.getDataSource("delNotice", { ggid: e.noticeid }, function (data) {
                    _.remove($scope.dataSource, function (n) {
                        return n.noticeid == e.noticeid;
                    });
                });
            } else {
                //取消不做任何操作
            }
        });
    }

    $scope.godetail = function (e) {
        $state.go("app.noticedetail", { id: e.noticeid });
    }

})
.controller("noticedetailController", function ($scope, $state, $rootScope, $ionicHistory, $stateParams, getDataSource, downService) {
    $scope.goback = function () {
        $ionicHistory.goBack();
    }
    $scope.dataSource = {};
    $scope.load = function () {
        getDataSource.getDataSource(["getNotice","getAttach"], { ggid: $stateParams.id, xyid: $rootScope.user.stu_info_id, bcid: $rootScope.user.bcinfo_id }, function (data) {
            //console.log(data);
            var getNotice = _.find(data, function (d) {
                return d.name == "getNotice";
            }).data;            
            $scope.getAttach = _.find(data, function (d) {
                return d.name == "getAttach";
            }).data;
            $scope.dataSource = getNotice[0];
            if (sessionStorage.usertype == "student") {
                getDataSource.getDataSource("getNoticeRead", { ggid: $stateParams.id, xyid: $rootScope.user.stu_info_id, bcid: $rootScope.user.bcinfo_id }, function (data) {
                    var getNoticeRead = data;
                    if (getNoticeRead[0].total == 0) {
                        getDataSource.getDataSource("addNoticeRead", { ggid: $stateParams.id, xyid: $rootScope.user.stu_info_id, bcid: $rootScope.user.bcinfo_id }, function (data) {
                            _.find($rootScope.iconvalArray, function (d) {
                                return d.key == "numUnReader";
                            }).val--;
                        });
                    }
                });
            }            
            for (var i = 0; i < $scope.getAttach.length; i++) {
                var fpath = {
                    type: "bcgg",
                    id: $scope.getAttach[i].id,
                    bcid: $rootScope.user.bcinfo_id
                }
                var fPath = JSON.stringify(fpath);
                $scope.getAttach[i].filepath = "/api/getAttach/action/getAttach/xy/" + Base64.encode(fPath);
            }
        });
    }();
    $scope.downfile = function (url, filename) {
        downService.cordovaDown(downService.getRootPath() + url, filename);
    };
})
    .controller("noticeAddController", function ($http,$scope, $state, $rootScope, $ionicHistory, $stateParams, getDataSource, $ionicPopup) {

        $scope.addnotice = { content: "", title: "", userid: sessionStorage.userid, ggid: "", bcid: sessionStorage.bcinfo_id };
        $scope.uploadPic = function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    $scope.uploadIMG = res.localIds[0];
                    //var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    $("#tzggIMG").attr("src", res.localIds[0]);
                }
            });
        }
        $scope.addNewNotice = function () {
            if ($scope.addnotice.content == "" || $scope.addnotice.title == "") {
                $ionicPopup.alert({
                    title: "信息提示",
                    template: "请补充完整公告内容！",
                    buttons: [
                                   {
                                       text: '<b>确认</b>',
                                       type: 'button-positive'
                                   }
                    ]
                });
            }
            else {
                getDataSource.getDataSource("getNoticeNum", {}, function (data) {
                    $scope.addnotice.ggid = data[0].nextval;
                    getDataSource.getDataSource(["addNotice", "addNotice2"], $scope.addnotice, function (data) {
                        if ($rootScope.fromweixin && $rootScope.AppConfig.showTZGGPic == true) {
                            wx.uploadImage({
                                localId: $scope.uploadIMG, // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1,// 默认为1，显示进度提示
                                success: function (res) {
                                    //$scope.qingjiaImgserverId = res.serverId; // 返回图片的服务器端ID
                                    //$scope.qingjia.ImgserverId = res.serverId;
                                    //$scope.postSave();
                                    var proim = $http.post("../api/tzggUploadImg", { serverid: res.serverId, ggid: $scope.addnotice.ggid });
                                    proim.then(function () { });
                                }
                            });
                        }
                        $ionicHistory.goBack();
                    });
                });
            }
        }
    })
.controller("handSetController", function ($scope, $state, $ionicHistory, $rootScope, $timeout, getDataSource, $ionicPopup) {

    $scope.goback = function () {
        $ionicHistory.goBack();
    }
    var _MM_R = 0, _MM_CW = 0, _MM_CH = 0, _MM_OffsetX = 0, _MM_OffsetY = 100;
    $scope.setStep = "1";
    $scope.maksurePsd = "";
    $scope.firstPsd = "";
    $scope.secondPsd = "";
    $scope.buttonTitle = "下一步";
    if (!sessionStorage.handpsd) {
        $scope.buttonSecTitle = "请设置手势密码";
        $scope.setStep = "2";
    }
    else {
        //$scope.buttonSecTitle = "请输入原手势密码"; // 重置密码时候不需要输入原密码
        $scope.buttonSecTitle = "请设置手势密码";
        $scope.setStep = "2";
    }

    $scope.gotoNext = function () {
        var c = document.getElementById("myCanvas");
        var cxt = c.getContext("2d");
        if ($scope.setStep == "1") {
            if ($scope.maksurePsd == sessionStorage.handpsd) {
                if (sessionStorage.ishandpsd == 1) {
                    sessionStorage.ishandpsd = 0;
                    if (sessionStorage.usertype == "teacher") {
                        getDataSource.getDataSource("updateHandpsd", { handpsd: $scope.maksurePsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.userid }, function () { })
                    }
                    else {
                        getDataSource.getDataSource("updateStuHandpsd", { handpsd: $scope.maksurePsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.stu_info_id }, function () { })
                    }
                    // 确认弹出框
                    $ionicPopup.alert({
                        title: "信息提示",
                        template: '您已关闭手势登录',
                        buttons: [
                                       {
                                           text: '<b>确认</b>',
                                           type: 'button-positive'
                                       }
                        ]
                    });
                    localStorage.user = JSON.stringify(sessionStorage);
                    $ionicHistory.goBack();
                }
                else {
                    // 确认弹出框
                    $ionicPopup.confirm({
                        okType: "button-assertive",
                        okText: "是",
                        cancelText: "否",
                        title: "提示",
                        template: "<div style='text-align:center;'>您已开启手势登录,是否重新设置密码？</div>"
                    }).then(function (res) {
                        if (res) {
                            $scope.buttonSecTitle = "请设置手势密码";
                            $scope.setStep = "2";
                        } else {
                            sessionStorage.ishandpsd = 1;
                            if (sessionStorage.usertype == "teacher") {
                                getDataSource.getDataSource("updateHandpsd", { handpsd: $scope.maksurePsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.userid }, function () { })
                            }
                            else {
                                getDataSource.getDataSource("updateStuHandpsd", { handpsd: $scope.maksurePsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.stu_info_id }, function () { })
                            }
                            localStorage.user = JSON.stringify(sessionStorage);
                            $ionicHistory.goBack();
                        }
                    });
                }

            }
            $scope.refreshRect(cxt, _MM_CW, _MM_CH, _MM_R);
        }
        else if ($scope.setStep == "2") {
            if ($scope.firstPsd.length > 0 && $scope.firstPsd.length < 4) {
                //showAlert.showToast("至少需要4个链接点！");
                //alert("至少需要4个链接点！");
                $ionicPopup.alert({
                    title: "信息提示",
                    template: '至少需要4个链接点',
                    buttons: [
            {
                text: '<b>确认</b>',
                type: 'button-positive'
            }
                    ]
                });
            }
            else {
                $scope.buttonTitle = "完成";
                $scope.buttonSecTitle = "请确认手势密码";
                $scope.setStep = "3";
            }
            $scope.refreshRect(cxt, _MM_CW, _MM_CH, _MM_R);
        }
        else {
            if ($scope.firstPsd == $scope.secondPsd && $scope.secondPsd && $scope.firstPsd) {
                // 如果一开始就设置密码，这里要做判断
                if (sessionStorage.ishandpsd == 1) {
                    sessionStorage.ishandpsd = 0;
                }
                else {
                    sessionStorage.ishandpsd = 1;
                }
                if (sessionStorage.usertype == "teacher") {
                    getDataSource.getDataSource("updateHandpsd", { handpsd: $scope.secondPsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.userid }, function () {

                    });
                }
                else {
                    getDataSource.getDataSource("updateStuHandpsd", { handpsd: $scope.secondPsd, ishandpsd: sessionStorage.ishandpsd, id: sessionStorage.stu_info_id }, function () {

                    });
                }
                sessionStorage.handpsd = $scope.secondPsd;
                localStorage.user = JSON.stringify(sessionStorage);
                $ionicHistory.goBack();
            }
            else {
                //alert("确认密码错误");
                $ionicPopup.alert({
                    title: "信息提示",
                    template: '确认密码错误',
                    buttons: [
                {
                    text: '<b>确认</b>',
                    type: 'button-positive'
                }
                    ]
                });
                //showAlert.showToast("确认密码错误！");
                $scope.refreshRect(cxt, _MM_CW, _MM_CH, _MM_R);
            }
        }
    }

    var PointLocationArr = [];
    $scope.onMyLoad = function () {

        _MM_CW = document.body.clientWidth;
        //_MM_CW = window.innerWidth;
        //alert(_MM_CW + ';;'+ window.innerWidth);
        _MM_CH = document.documentElement.clientHeight;
        //_MM_CH = window.innerHeight;
        /* setTimeout(function(){
             alert(window.innerHeight);
         },500);*/
        //alert(window.innerHeight);

        //_MM_OffsetY = document.getElementById("loginImg").height;
        _MM_OffsetX = _MM_CW * 1 / 10;
        _MM_CH = _MM_CH - _MM_OffsetY;

        var c = document.getElementById("myCanvas");
        c.width = _MM_CW;
        c.height = _MM_CH;

        R1 = (_MM_CH - 2 * _MM_OffsetY) / 8;
        R2 = (_MM_CW - 2 * _MM_OffsetX) / 8;

        if (R1 < R2) {
            _MM_R = R1;
        } else {
            _MM_R = R2;
        }

        document.getElementById("myCanvas").style.marginTop = -_MM_OffsetY + "px";
        //document.getElementById("myCanvas").style.marginBottom = - (_MM_OffsetY/2) + "px";

        var cxt = c.getContext("2d");
        //两个圆之间的外距离 就是说两个圆心的距离去除两个半径
        var X = (_MM_CW - 2 * _MM_OffsetX - _MM_R * 2 * 3) / 2;
        var Y = (_MM_CH - 2 * _MM_OffsetY - _MM_R * 2 * 3) / 2;

        PointLocationArr = $scope.CaculateNinePointLotion(X, Y, _MM_OffsetX, _MM_OffsetY, _MM_R);
        $scope.InitEvent(c, cxt, _MM_CW, _MM_CH, _MM_R);//InitEvent(canvasContainer, cxt, _MM_CW, _MM_CH, _MM_R)
        //_MM_CW=2*offsetX+_MM_R*2*3+2*X
        $scope.Draw(cxt, PointLocationArr, [], null, _MM_CW, _MM_CH, _MM_R);

        //document.getElementById("noButton").innerHTML = '重新绘制';
        //document.getElementById("okButton").innerHTML = '确定';
    };

    $scope.CaculateNinePointLotion = function (diffX, diffY, _MM_OffsetX, _MM_OffsetY, _MM_R) {
        var Re = [];
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var Point = {
                    X: (_MM_OffsetX + col * diffX + (col * 2 + 1) * _MM_R),
                    Y: (_MM_OffsetY + row * diffY + (row * 2 + 1) * _MM_R)
                };
                Re.push(Point);
            }
        }
        return Re;
    }
    $scope.Draw = function (cxt, _PointLocationArr, _LinePointArr, touchPoint, _MM_CW, _MM_CH, _MM_R) {
        if (_LinePointArr.length > 0) {
            cxt.beginPath();
            for (var i = 0; i < _LinePointArr.length; i++) {
                var pointIndex = _LinePointArr[i];
                cxt.lineTo(_PointLocationArr[pointIndex].X, _PointLocationArr[pointIndex].Y);
            }
            cxt.lineWidth = 10;
            cxt.strokeStyle = "#627eed";
            cxt.stroke();
            cxt.closePath();
            if (touchPoint != null) {
                var lastPointIndex = _LinePointArr[_LinePointArr.length - 1];
                var lastPoint = _PointLocationArr[lastPointIndex];
                cxt.beginPath();
                cxt.moveTo(lastPoint.X, lastPoint.Y);
                cxt.lineTo(touchPoint.X, touchPoint.Y);
                cxt.stroke();
                cxt.closePath();
            }
        }
        for (var i = 0; i < _PointLocationArr.length; i++) {
            var Point = _PointLocationArr[i];
            cxt.fillStyle = "#627eed";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, _MM_R, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillStyle = "#ffffff";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, _MM_R - 3, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            if (_LinePointArr.indexOf(i) >= 0) {
                cxt.fillStyle = "#627eed";
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, _MM_R - 16, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
            }

        }
    }
    $scope.IsPointSelect = function (touches, LinePoint, _MM_R) {
        for (var i = 0; i < PointLocationArr.length; i++) {
            var currentPoint = PointLocationArr[i];
            var xdiff = Math.abs(currentPoint.X - touches.pageX);
            var ydiff = Math.abs(currentPoint.Y - touches.pageY);
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            if (dir < _MM_R) {
                if (LinePoint.indexOf(i) < 0) { LinePoint.push(i); }
                break;
            }
        }
    }
    $scope.InitEvent = function (canvasContainer, cxt, _MM_CW, _MM_CH, _MM_R) {
        var LinePoint = [];
        canvasContainer.addEventListener("touchstart", function (e) {
            $scope.IsPointSelect(e.touches[0], LinePoint, _MM_R);
        }, false);
        canvasContainer.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touches = e.touches[0];
            $scope.IsPointSelect(touches, LinePoint, _MM_R);
            cxt.clearRect(0, 0, _MM_CW, _MM_CH);
            $scope.Draw(cxt, PointLocationArr, LinePoint, { X: touches.pageX, Y: touches.pageY }, _MM_CW, _MM_CH, _MM_R);
        }, false);
        canvasContainer.addEventListener("touchend", function (e) {
            cxt.clearRect(0, 0, _MM_CW, _MM_CH);
            $scope.Draw(cxt, PointLocationArr, LinePoint, null, _MM_CW, _MM_CH, _MM_R);
            if (LinePoint.length > 0 && LinePoint.length < 4) {
                //showAlert.showToast("至少需要4个链接点！");
                //alert("至少需要4个链接点！");
                $ionicPopup.alert({
                    title: "信息提示",
                    template: '至少需要4个链接点',
                    buttons: [
                {
                    text: '<b>确认</b>',
                    type: 'button-positive'
                }
                    ]
                });
                setTimeout(function () {
                    $scope.refreshRect(cxt, _MM_CW, _MM_CH, _MM_R);
                }, 500);
            } else {
                //alert("密码结果是："+LinePoint.join("->"));  
                if ($scope.setStep == "3") {
                    $scope.secondPsd = "";
                    for (var i = 0; i < LinePoint.length; i++) {
                        $scope.secondPsd += LinePoint[i];
                    }
                }
                if ($scope.setStep == "2") {
                    $scope.firstPsd = "";
                    for (var i = 0; i < LinePoint.length; i++) {
                        $scope.firstPsd += LinePoint[i];
                    }
                }
                if ($scope.setStep == "1") {
                    $scope.maksurePsd = "";
                    for (var i = 0; i < LinePoint.length; i++) {
                        $scope.maksurePsd += LinePoint[i];
                    }
                }
            }
            LinePoint = [];
        }, false);
    }
    $scope.refreshRect = function (cxt, _MM_CW, _MM_CH, _MM_R) {
        cxt.clearRect(0, 0, _MM_CW, _MM_CH);
        $scope.Draw(cxt, PointLocationArr, [], {}, _MM_CW, _MM_CH, _MM_R);
    }
    $scope.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }

    $(function () {
        $scope.onMyLoad();
    })
})
 .controller("LoginHandController", function ($scope, $state, $ionicHistory, $rootScope, $timeout, showAlert, getDataSource, $ionicPopup) {
     /*获取原来数据*/
     var user = JSON.parse(localStorage.user);
     if (user.usertype == "student") {
         sessionStorage.userid = user.userid;
         sessionStorage.usertype = "student";
         sessionStorage.bcinfo_id = user.bcinfo_id;
         sessionStorage.stu_info_id = user.stu_info_id;
         sessionStorage.uname = user.uname;
         sessionStorage.phone = user.phone;
         sessionStorage.bcname = user.bcname;
         // 记录手势密码
         sessionStorage.ishandpsd = user.ishandpsd;
         sessionStorage.handpsd = user.handpsd;
         sessionStorage.decphone = user.decphone;
     }
     else {
         sessionStorage.userid = user.userid;
         sessionStorage.usertype = "teacher";
         sessionStorage.maincode = user.maincode;
         sessionStorage.uname = user.uname;
         sessionStorage.onecard = user.onecard;
         // 记录手势密码
         sessionStorage.ishandpsd = user.ishandpsd;
         sessionStorage.handpsd = user.handpsd;
         sessionStorage.bcinfo_id = user.bcinfo_id;
         sessionStorage.roles = JSON.stringify(user.roles);
         sessionStorage.onecard = user.onecard;
     }
     showAlert.hideLoading();
     document.addEventListener('deviceready', function () {
         navigator.splashscreen.hide();
     }, false)
     var _MM_R = 0, _MM_CW = 0, _MM_CH = 0, _MM_OffsetX = 0, _MM_OffsetY = 80;
     $rootScope.user = JSON.parse(localStorage.user);
     //showAlert.hideLoading();
     var PointLocationArr = [];
     $scope.onMyLoad = function () {

         _MM_CW = window.screen.width;
         //_MM_CW = document.body.clientWidth;
         //_MM_CW = window.innerWidth;
         //alert(_MM_CW + ';;'+ window.innerWidth);

         _MM_CH = window.screen.height;
         //_MM_CH = document.documentElement.clientHeight;
         //_MM_CH = window.innerHeight;
         /* setTimeout(function(){
              alert(window.innerHeight);
          },500);*/
         //alert(window.innerHeight);

         //_MM_OffsetY = document.getElementById("loginImg").height;
         _MM_OffsetX = _MM_CW * 1 / 10;
         _MM_CH = _MM_CH - _MM_OffsetY;

         var c = document.getElementById("myCanvas");
         c.width = _MM_CW;
         c.height = _MM_CH;

         R1 = (_MM_CH - 2 * _MM_OffsetY) / 8;
         R2 = (_MM_CW - 2 * _MM_OffsetX) / 8;

         if (R1 < R2) {
             _MM_R = R1;
         } else {
             _MM_R = R2;
         }

         document.getElementById("myCanvas").style.marginTop = -_MM_OffsetY + "px";
         //document.getElementById("myCanvas").style.marginBottom = - (_MM_OffsetY/2) + "px";

         var cxt = c.getContext("2d");
         //两个圆之间的外距离 就是说两个圆心的距离去除两个半径
         var X = (_MM_CW - 2 * _MM_OffsetX - _MM_R * 2 * 3) / 2;
         var Y = (_MM_CH - 2 * _MM_OffsetY - _MM_R * 2 * 3) / 2;

         PointLocationArr = $scope.CaculateNinePointLotion(X, Y, _MM_OffsetX, _MM_OffsetY, _MM_R);

         $scope.InitEvent(c, cxt, _MM_CW, _MM_CH, _MM_R);//InitEvent(canvasContainer, cxt, _MM_CW, _MM_CH, _MM_R)

         //_MM_CW=2*offsetX+_MM_R*2*3+2*X
         $scope.Draw(cxt, PointLocationArr, [], null, _MM_CW, _MM_CH, _MM_R);

         //document.getElementById("noButton").innerHTML = '重新绘制';
         //document.getElementById("okButton").innerHTML = '确定';
         //if (!$rootScope.formweixin) {
         //    document.addEventListener("deviceready", function () {
         //        xsfSplashscreen.hide();
         //    }, false);

         //}
         //showAlert.hideLoading();

     };

     $scope.gotoLogin = function () {
         $state.go("login");
     }

     $scope.CaculateNinePointLotion = function (diffX, diffY, _MM_OffsetX, _MM_OffsetY, _MM_R) {
         var Re = [];
         for (var row = 0; row < 3; row++) {
             for (var col = 0; col < 3; col++) {
                 var Point = {
                     X: (_MM_OffsetX + col * diffX + (col * 2 + 1) * _MM_R),
                     Y: (_MM_OffsetY + row * diffY + (row * 2 + 1) * _MM_R)
                 };
                 Re.push(Point);
             }
         }
         return Re;
     }
     $scope.Draw = function (cxt, _PointLocationArr, _LinePointArr, touchPoint, _MM_CW, _MM_CH, _MM_R) {

         if (_LinePointArr.length > 0) {
             cxt.beginPath();
             for (var i = 0; i < _LinePointArr.length; i++) {
                 var pointIndex = _LinePointArr[i];
                 cxt.lineTo(_PointLocationArr[pointIndex].X, _PointLocationArr[pointIndex].Y);
             }
             cxt.lineWidth = 10;
             cxt.strokeStyle = "#627eed";
             cxt.stroke();
             cxt.closePath();
             if (touchPoint != null) {
                 var lastPointIndex = _LinePointArr[_LinePointArr.length - 1];
                 var lastPoint = _PointLocationArr[lastPointIndex];
                 cxt.beginPath();
                 cxt.moveTo(lastPoint.X, lastPoint.Y);
                 cxt.lineTo(touchPoint.X, touchPoint.Y);
                 cxt.stroke();
                 cxt.closePath();
             }
         }
         for (var i = 0; i < _PointLocationArr.length; i++) {
             var Point = _PointLocationArr[i];
             cxt.fillStyle = "#627eed";
             cxt.beginPath();
             cxt.arc(Point.X, Point.Y, _MM_R, 0, Math.PI * 2, true);
             cxt.closePath();
             cxt.fill();
             cxt.fillStyle = "#ffffff";
             cxt.beginPath();
             cxt.arc(Point.X, Point.Y, _MM_R - 3, 0, Math.PI * 2, true);
             cxt.closePath();
             cxt.fill();
             if (_LinePointArr.indexOf(i) >= 0) {
                 cxt.fillStyle = "#627eed";
                 cxt.beginPath();
                 cxt.arc(Point.X, Point.Y, _MM_R - 16, 0, Math.PI * 2, true);
                 cxt.closePath();
                 cxt.fill();
             }

         }
     }
     $scope.IsPointSelect = function (touches, LinePoint, _MM_R) {
         for (var i = 0; i < PointLocationArr.length; i++) {
             var currentPoint = PointLocationArr[i];
             var xdiff = Math.abs(currentPoint.X - touches.pageX);
             var ydiff = Math.abs(currentPoint.Y - touches.pageY);
             var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
             if (dir < _MM_R) {
                 if (LinePoint.indexOf(i) < 0) { LinePoint.push(i); }
                 break;
             }
         }
     }
     $scope.InitEvent = function (canvasContainer, cxt, _MM_CW, _MM_CH, _MM_R) {
         var LinePoint = [];
         canvasContainer.addEventListener("touchstart", function (e) {
             $scope.IsPointSelect(e.touches[0], LinePoint, _MM_R);
         }, false);
         canvasContainer.addEventListener("touchmove", function (e) {
             e.preventDefault();
             var touches = e.touches[0];
             $scope.IsPointSelect(touches, LinePoint, _MM_R);
             cxt.clearRect(0, 0, _MM_CW, _MM_CH);
             $scope.Draw(cxt, PointLocationArr, LinePoint, { X: touches.pageX, Y: touches.pageY }, _MM_CW, _MM_CH, _MM_R);
         }, false);
         canvasContainer.addEventListener("touchend", function (e) {
             cxt.clearRect(0, 0, _MM_CW, _MM_CH);
             $scope.Draw(cxt, PointLocationArr, LinePoint, null, _MM_CW, _MM_CH, _MM_R);

             //alert("密码结果是："+LinePoint.join("->"));  
             $scope.secondPsd = "";
             for (var i = 0; i < LinePoint.length; i++) {
                 $scope.secondPsd += LinePoint[i];
             }
             if ($scope.secondPsd == $rootScope.user.handpsd) {
                 sessionStorage = $rootScope.user;
                 $state.go("app.index");
             }
             else {
                 //alert("密码错误！");
                 $ionicPopup.alert({
                     title: "信息提示",
                     template: "密码错误！",
                     buttons: [
                                    {
                                        text: '<b>确认</b>',
                                        type: 'button-positive'
                                    }
                     ]
                 });
                 setTimeout(function () {
                     $scope.refreshRect(cxt, _MM_CW, _MM_CH, _MM_R);
                 }, 500);
             }
             LinePoint = [];
         }, false);
     }
     $scope.refreshRect = function (cxt, _MM_CW, _MM_CH, _MM_R) {
         cxt.clearRect(0, 0, _MM_CW, _MM_CH);
         $scope.Draw(cxt, PointLocationArr, [], {}, _MM_CW, _MM_CH, _MM_R);
     }
     $scope.getQueryString = function (name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
         var r = window.location.search.substr(1).match(reg);
         if (r != null) return decodeURI(r[2]); return null;
     }

     $(function () {
         setTimeout(function () {
             $scope.onMyLoad();
         }, 100);
     })
 })
 .controller("viewAllClassController", function ($scope, $state, $rootScope, $ionicHistory, $stateParams, getDataSource, $ionicPopup) {
     getDataSource.getDataSource("getAllClass", { userid: $rootScope.user.userid }, function (data) {
         $scope.bcxx = data;
     });

     $scope.gotoViewKc = function (item) {
         $state.go("app.viewAllKC", { bcid: item.classid });
     }
 })
 .controller("viewAllKCController", function ($scope, $state, $rootScope, $ionicHistory, $stateParams, getDataSource, $ionicPopup) {
     getDataSource.getDataSource("getKcList", { bcid: $stateParams.bcid }, function (data) {
         $scope.kcxx = data;
     });

     $scope.gotoViewKaoqin = function (item) {
         $state.go("app.viewKaoqin", { bcid: $stateParams.bcid, kcid: item.info_id });
     }
 })
.controller("viewKaoqinController", function ($scope, $state, $rootScope, $ionicHistory, $stateParams, getDataSource, $ionicPopup) {
    getDataSource.getDataSource("getkqList", { bcid: $stateParams.bcid, kcid: $stateParams.kcid }, function (data) {
        $scope.kqxx = data;
    });

    $scope.save = function (stateValue, item) {
        getDataSource.getDataSource("updateKqstate", { state: stateValue, id: item.id }, function (data) {
            item.state = stateValue;
        });
    }
})
.controller("weekMeetController", function ($scope, Restangular, $state, $ionicModal, $ionicHistory, $dateService, $rootScope, $ionicSlideBoxDelegate, $ionicScrollDelegate, getDataSource) {

    $scope.goback = function () {
        $ionicHistory.goBack();
    }
    //当前模式，默认周
    $scope.weekpage = true;
    //页面切换事件
    $scope.changePageView = function () {
        $scope.weekpage = !$scope.weekpage;
        $scope.styleString = $scope.weekpage ? parseInt($scope.styleString) + 81 : parseInt($scope.styleString) - 81;
        $(".week-timetable-content .scroll").removeAttr("style");
    };
    if ($rootScope.user == null) {
        $state.go("loginUserMobile");
        return;
    }
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    $scope.styleString = "120";
    $scope.styleTopString = "74";
    if (isAndroid) {
        $scope.styleString = "120";
        $scope.styleTopString = "74";
    }
    if (isIOS) {
        //$scope.styleString = "95";
        $scope.styleTopString = "94";
    }

    $scope.isshowloading = true;
    // 日期转换
    $scope.parseDate = function (dataString) {
        if (dataString) {
            return $dateService.parse(dataString);
        }
        else {
            return "";
        }
    }
    $scope.titleYearMonth = $dateService.format(new Date(), "yyyy-mm");
    $scope.loadDatas = function () {
        //取出所有数据，包括服务器时间，开班开始时间和开班结束时间，所有课程
        getDataSource.getDataSource("getWeekMeet", {}, function (data) {
            if (data !== null) {
                $scope.kclist = data;

                $scope.SYSDATE = $dateService.format(new Date(), "yyyy-mm-dd hh:mm:ss");
                $scope.sysdate = new Date();//系统时间
                $scope.today = $dateService.format(new Date(), "yyyy-mm-dd");//今日
                $scope.activeDate = $scope.today;//当前选中日期
                $scope.titleYearMonth = $dateService.format($scope.sysdate, "yyyy-mm");//选中日期的月份

                var now = new Date;
                var day = now.getDay();
                var week = "7123456";
                var first = 0 - week.indexOf(day);
                var f = new Date;
                f.setDate(f.getDate() + first);
                var last = 6 - week.indexOf(day);
                var l = new Date;
                l.setDate(l.getDate() + last);

                $scope.old_startdate = new Date(f);
                $scope.old_enddate = new Date(l);
                //根据开班开始时间的周几通过开班开始时间减去开始时间的周几索引（0-6）为新的开班开始时间
                $scope.startdate = new Date($scope.old_startdate.getTime() - ((7 + $scope.old_startdate.getDay()) * 24 * 60 * 60 * 1000));
                //根据开班结束时间的周几通过开班结束时间加上结束时间的周几索引（6减去0-6）为新的开班结束时间
                $scope.enddate = new Date($scope.old_enddate.getTime() + ((7 - $scope.old_enddate.getDay()) * 24 * 60 * 60 * 1000));
                //
                $scope.slideNum = (($scope.enddate.getTime() - $scope.startdate.getTime()) / 1000 / 60 / 60 / 24 + 1) / 7;
                //重新组织JSON格式：                

                //周日历
                var eachList = [
                    {
                        ym1: '2014-12',
                        ym2: '2015-01',//跨月只能一个月
                        index: 0,
                        solarData: [
                            {
                                date: '2014-12-31', day: 31, ym: '2014-12'
                            },
                            {
                                date: '2015-01-01', day: 1
                            },
                            {
                                date: '2015-01-02', day: 2
                            },
                            {
                                date: '2015-01-03', day: 3
                            },
                            {
                                date: '2015-01-04', day: 4
                            },
                            {
                                date: '2015-01-05', day: 5
                            },
                            { date: '2015-01-06', day: 6 }
                        ],
                        lunarData: [
                            {
                                date: '2014-12-31', day: "三十", data: [{ title: "" }, { title: "" }], ym: '2014-12'
                            },
                            {
                                date: '2015-01-01', day: "初一", data: []
                            },
                            {
                                date: '2015-01-02', day: "初二", data: []
                            },
                            {
                                date: '2015-01-03', day: "初三", data: []
                            },
                            {
                                date: '2015-01-04', day: "初四", data: []
                            },
                            {
                                date: '2015-01-05', day: "初五", data: [{ title: "" }, { title: "" }]
                            },
                            { date: '2015-01-06', day: "初六", data: [{ title: "" }, { title: "" }] }
                        ]
                    }];
                var calendarList = [], lsarry = new Array();
                $scope.monthlist = [];
                //通过新的开班开始时间-结束时间的天数除以七（得出结果一定是整数）来循环输出每周的日期，即有多少个tab页
                for (var i = 0; i < $scope.slideNum; i++) {
                    var slideArry = {}, lsdate, lstimetable, lssarry = new Array();
                    slideArry.index = i;
                    slideArry.solarData = [];
                    slideArry.lunarData = [];
                    for (var wk = 0; wk < 7; wk++) {
                        lsdate = new Date($scope.startdate.getTime() + (((i * 7) + wk) * 24 * 60 * 60 * 1000));
                        var ftdate = $dateService.format(lsdate, "yyyy-mm-dd"), ym = $dateService.format(lsdate, "yyyy-mm");
                        slideArry.solarData.push({
                            date: ftdate, day: parseInt($dateService.format(lsdate, "dd")), ym: ym
                        });
                        //找出当前日期的所有课程数据
                        lstimetable = [];
                        if ($scope.kclist) {
                            _.forEach($scope.kclist, function (m, key) {
                                if (m.sdate == ftdate) {
                                    lstimetable.push(m);
                                }
                            });
                        }
                        if ($scope.activeDate == ftdate) {
                            $scope.timetable = lstimetable;
                            $scope.pageIndex = i;
                        }
                        var lspdata = {
                            date: ftdate, day: GetLunarDay($dateService.format(lsdate, "yyyy"), $dateService.format(lsdate, "mm"), $dateService.format(lsdate, "dd")).day, data: lstimetable, ym: ym
                        };
                        slideArry.lunarData.push(lspdata);

                        //全局
                        if (lsarry.indexOf(ym) == -1) {
                            lsarry.push(ym);
                            $scope.monthlist.push({
                                date: ym, month: $dateService.format(lsdate, "mm")
                            });
                        }
                        //周
                        if (lssarry.indexOf(ym) == -1) {
                            lssarry.push(ym);
                            if (slideArry.ym1) {
                                slideArry.ym2 = ym;
                            } else {
                                slideArry.ym1 = ym;
                            }
                        }
                    }
                    calendarList.push(slideArry);
                }
                $scope.calendarList = calendarList;
                $ionicSlideBoxDelegate.update();
                if ($scope.pageIndex) {
                    setTimeout(function () { $ionicSlideBoxDelegate.slide($scope.pageIndex, 1); $scope.isshowloading = false; }, 10)
                } else {
                    $scope.isshowloading = false;
                }
            }
            else {
                //showToast.show($rootScope.appcontent.noData);
            }
        });
    };
    setTimeout(function () {
        $scope.loadDatas();
    }, 500);
    $scope.slideHasChanged = function ($index) {
        //获取当前选中的日期，算出星期几
        var weekIndex = new Date($scope.activeDate).getDay();
        try {
            $scope.activeDate = $scope.calendarList[$index].lunarData[weekIndex].date;
            $scope.timetable = $scope.calendarList[$index].lunarData[weekIndex].data;
        } catch (e) {

        }
        $scope.titleYearMonth = $dateService.format(new Date($scope.activeDate), "yyyy-mm");

        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    }
    $scope.changeTimeTableView = function (objdata, sobjdata, changePageView) {
        $scope.activeDate = sobjdata.date;
        $scope.titleYearMonth = $dateService.format(new Date($scope.activeDate), "yyyy-mm");
        if (!changePageView) {
            $scope.changePageView();
            $ionicSlideBoxDelegate.slide(objdata.index, 300);
        }
        for (var i in objdata.lunarData) {
            if (objdata.lunarData[i].date == $scope.activeDate) {
                $scope.timetable = objdata.lunarData[i].data;
            }
        }

        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    }
    $scope.changeTodayView = function () {
        $scope.activeDate = $scope.today;
        $scope.titleYearMonth = $dateService.format(new Date($scope.activeDate), "yyyy-mm");
        var weekIndex = new Date($scope.activeDate).getDay();
        try {
            $scope.timetable = $scope.calendarList[$scope.pageIndex].lunarData[weekIndex].data;
        } catch (e) {

        }
        if ($scope.pageIndex != null && $scope.pageIndex != undefined) {
            $ionicSlideBoxDelegate.slide($scope.pageIndex, 300);
        }

        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    }
    $scope.goTotechEvaluation = function (obj) {
        if (!$scope.isDisable(obj.lessonid, obj.ispost)) {
            $state.go("app.techEvaluation", {
                id: obj.lessonid, type: obj.evaluatetype, lessontype: obj.lessontype, isback: 1
            });
        }
        //$state.go("app.notices");
    }

    //是否已过期样式
    $scope.isDisable = function (etime, ispost) {
        //注意：5是配置,代表时限推后5天
        if ($scope.calculationObsolete(etime) && ispost != "1") {
            return "i_disable";
        }
    }
    //计算是否过期
    $scope.calculationObsolete = function ($edate) {
        var $delay = $rootScope.AppConfig.evaluateouttime;
        //获取系统时间
        var sysDate = new Date($scope.SYSDATE.replace(/-/g, "/")),
            newDate = new Date($edate.replace(/-/g, "/"));
        newDate = new Date(newDate.setDate(newDate.getDate() + parseInt($delay)));
        var minuteNum = (newDate.getTime() - sysDate.getTime()) / 60 / 1000;//分钟
        if (parseInt(minuteNum) <= 0) {
            return true;
        } else {
            return false;
        }
    }
})
.controller("kqaddinfoController", function ($scope, $state, $interval, $ionicHistory, $dateService, $stateParams, $rootScope, getDataSource, showAlert, $ionicPopup) {
    $scope.showddl = true;
    $scope.showMess = true;
    $scope.showKcArea = true;
    $scope.showQdArea = true;
    $scope.formData = { dm: 'kc' };
    $scope.addfqqd = { info_id: '', classid: $rootScope.user.bcinfo_id, lessonid: "", lessonname: "", signbegin: "", signend: "", iskq: 0, fqr: $rootScope.user.userid, fqrname: $rootScope.user.uname };
    getDataSource.getDataSource("getNowQd", { lessonid: $stateParams.kcid, classid: $rootScope.user.bcinfo_id }, function (data) {
        if (data.length > 0) {
            $scope.showQdArea = false;
            $scope.kqdata = data;
            $scope.addfqqd.info_id = data[0].info_id;
        }
    });
    getDataSource.getDataSource("getTodayKCListById", { pagecount: undefined, classid: $rootScope.user.bcinfo_id }, function (data) {
        if (data.length > 0) {
            $scope.kclist = data;
            $scope.showMess = false;
        }
        else {
            $scope.showddl = false;
        }
    });

    function flashText() {
        getDataSource.getDataSource("getNowQd", { lessonid: $stateParams.kcid, classid: $rootScope.user.bcinfo_id }, function (data) {
            if (data.length > 0) {
                $scope.showQdArea = false;
                $scope.kqdata = data;
                $scope.addfqqd.info_id = data[0].info_id;
                if (data[0].xycount - data[0].yqcount == 0) {
                    $ionicPopup.confirm({
                        okType: "button-assertive",
                        okText: "是",
                        cancelText: "否",
                        title: "确认",
                        template: "<div style='text-align:center;'>学员已到齐，结束点名?</div>"
                    }).then(function (res) {
                        if (res) {
                            $scope.addfqqd.iskq = 1;
                            getDataSource.getDataSource("updateKqinfo", $scope.addfqqd, function (data) {
                                $scope.showQdArea = true;
                                //$state.go("kqlist", { id: $scope.addfqqd.lessonid });
                            });
                        }
                    });
                }
            }
        });
    }
    // 5秒刷新数据
    $interval(flashText, 50000);

    $scope.reflashData = function () {
        flashText();
    }

    $scope.changeType = function () {
        if ($scope.formData.dm == "sj") {
            $scope.showKcArea = false;
        }
        else {
            $scope.showKcArea = true;
        }
    }

    $scope.AddKq = function () {
        $scope.addfqqd.iskq = 0;
        $scope.tabTxt = "";

        if ($scope.formData.dm == "sj") {
            getDataSource.getDataSource("getTodayQdCount", { classid: $rootScope.user.bcinfo_id }, function (data) {
                if (data[0].todayqd < 10) {
                    $scope.tabTxt = "临时点名 0" + (parseInt(data[0].todayqd) + 1) + '(' + $dateService.format(new Date(), "mm-dd") + ')';
                }
                else {
                    $scope.tabTxt = "临时点名 " + data[0].todayqd + '(' + $dateService.format(new Date(), "mm-dd") + ')';
                }
                $scope.addfqqd.lessonname = $scope.tabTxt;
                $scope.addfqqd.lessonid = "";
                // 确认弹出框
                $ionicPopup.confirm({
                    okType: "button-assertive",
                    okText: "是",
                    cancelText: "否",
                    title: "确认",
                    template: "<div style='text-align:center;'>" + $scope.tabTxt + "?</b>"
                }).then(function (res) {
                    if (res) {
                        getDataSource.getDataSource("insertKqinfo", $scope.addfqqd, function (data) {
                            $scope.showQdArea = false;
                            getDataSource.getDataSource("getNowQd", { classid: $rootScope.user.bcinfo_id }, function (data) {
                                if (data.length > 0) {
                                    $scope.kqdata = data;
                                    $scope.addfqqd.info_id = data[0].info_id;
                                }
                            });
                        });
                    }
                });
            });
        }
        else {
            if ($("#data_select").val() == null) {
                $scope.addfqqd.lessonid = $stateParams.kcid;
            }
            else {
                $scope.addfqqd.lessonid = $("#data_select").val();
            }
            if ($("#data_select").find("option:selected").text() == "") {
                showAlert.showToast("今日无课程，无法发起点名!");
                return;
            }
            else {
                $scope.tabTxt = $("#data_select").find("option:selected").text();
                $scope.addfqqd.lessonname = $scope.tabTxt;
            }
            // 确认弹出框
            $ionicPopup.confirm({
                okType: "button-assertive",
                okText: "是",
                cancelText: "否",
                title: "确认",
                template: "<div style='text-align:center;'>" + $scope.tabTxt + "?</b>"
            }).then(function (res) {
                if (res) {
                    getDataSource.getDataSource("insertKqinfo", $scope.addfqqd, function (data) {
                        $scope.showQdArea = false;
                        getDataSource.getDataSource("getNowQd", { classid: $rootScope.user.bcinfo_id }, function (data) {
                            if (data.length > 0) {
                                $scope.kqdata = data;
                                $scope.addfqqd.info_id = data[0].info_id;
                            }
                        });
                    });
                }
            });
        }
    };

    $scope.closeDm = function () {
        $scope.addfqqd.iskq = 1;
        // 确认弹出框
        $ionicPopup.confirm({
            okType: "button-assertive",
            okText: "是",
            cancelText: "否",
            title: "确认",
            template: "<div style='text-align:center;'>确认结束点名?</b>"
        }).then(function (res) {
            if (res) {
                getDataSource.getDataSource("updateKqinfo", $scope.addfqqd, function (data) {
                    $scope.showQdArea = true;
                    //$state.go("kqlist", { id: $scope.addfqqd.lessonid });
                });
            }
        });
    };
    $scope.viewStudent = function (que) {
        $state.go("kqlist", { id: $scope.addfqqd.info_id, type: que });
    }
    $scope.historyDm = function () {
        $state.go("yddm");
    }
})
.controller("yddmController", function ($timeout, $http, $scope, Restangular, $ionicHistory, $state, $rootScope, $stateParams, getDataSource) {

    $scope.qDlist = [];
    $scope.index2 = 0;
    $scope.moreDataCanBeLoaded2 = true;

    $scope.goback = function () {
        $ionicHistory.goBack();
    }

    $scope.loadMoreQdList = function () {
        $scope.index2 = $scope.index2 + 1;

        getDataSource.getDataSource("getHistoryKQListById", { pagecount: $scope.index2, classid: $rootScope.user.bcinfo_id }, function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $scope.qDlist.push(data[i]);
                }
                $scope.moreDataCanBeLoaded2 = false;
            }
            else {
                $scope.moreDataCanBeLoaded2 = false;
            }
        });
    }

    $scope.viewStudent = function (item, que) {
        $state.go("kqlist", { id: item.info_id, type: que });
    }
})
.controller("kqlistController", function ($scope, $state, $ionicHistory, $stateParams, $ionicModal, $dateService, $rootScope, getDataSource, $ionicPopup) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    var queryList = "getweiQiandaoList";
    $scope.showTitle = "未到";
    $scope.showW = true;
    $scope.loadData = function () {
        if ($stateParams.type == 1) {
            queryList = "getweiQiandaoList";
        }
        else {
            queryList = "getQiandaoList";
            $scope.showW = false;
            $scope.showTitle = "已到";
        }
        getDataSource.getDataSource(queryList, { id: $stateParams.id, bcid: $rootScope.user.bcinfo_id }, function (data) {
            $scope.dataStu = data;
        });
    }

    $scope.cellPhone = function (item, index) {
        item.phonestatus = 1;

        switch (index) {
            case 0:
                location.href = "tel:" + item.sjhm;
                break;
            case 1:
                location.href = "sms:" + item.sjhm;
                break;
        }
    }

    $scope.loadData();

})
.controller("kqStudentController", function ($scope, $state, $ionicHistory, $dateService, showAlert, $rootScope, getDataSource, $ionicPopup) {

    $scope.qdlist = [];
    $scope.nowQd = [];
    $scope.index = 0;

    $scope.doRefresh = function () {
        $scope.qdlist = [];
        $scope.index = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.loadMoreQdList();
        $scope.$broadcast("scroll.refreshComplete");
    };
    $scope.loadData = function () {
        getDataSource.getDataSource("getNowQdStudent", { stuid: $rootScope.user.stu_info_id, classid: $rootScope.user.bcinfo_id }, function (data) {
            $scope.nowQd = data;
        });
    }
    $scope.loadData();
    $scope.moreDataCanBeLoaded = true;
    $scope.loadMoreQdList = function () {
        $scope.index = $scope.index + 1;

        getDataSource.getDataSource("getQdList", { pagecount: $scope.index, stuid: $rootScope.user.stu_info_id, classid: $rootScope.user.bcinfo_id }, function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $scope.qdlist.push(data[i]);
                }
            }
            else {
                $scope.moreDataCanBeLoaded = false;
            }
        });
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }

    $scope.qiandao = function (item) {
        $ionicPopup.confirm({
            okType: "button-assertive",
            okText: "是",
            cancelText: "否",
            title: "确认",
            template: "<div style='text-align:center;'>确认签到?</div>"
        }).then(function (res) {
            if (res) {
                getDataSource.getDataSource("insertQdData", { lessonid: item.lessonid, studentid: $rootScope.user.stu_info_id, classid: $rootScope.user.bcinfo_id, info_id: item.info_id }, function (data) {
                    $scope.loadData();
                    $scope.doRefresh();
                    showAlert.showToast("签到成功!");
                });
            }
        });
    }
})
.controller("changePsdController", function ($scope, $rootScope, $timeout, $ionicHistory, $ionicScrollDelegate, $state, getDataSource, showAlert) {

    $scope.changePsd = { firstPsd: "", secondPsd: "" };

    $scope.checkdata = function () {
        if ($.trim($scope.changePsd.firstPsd) == "") {
            showAlert.alert("请输入密码!");
            return false;
        }
        if ($.trim($scope.changePsd.secondPsd) == "") {
            showAlert.alert("请输入确认密码!");
            return false;
        }
        if ($scope.changePsd.firstPsd != $scope.changePsd.secondPsd) {
            showAlert.alert("输入的密码不一致!");
            return false;
        }

        return true;
    }


    $scope.updateStuInfo = function () {
        if ($scope.checkdata()) {
            //console.log($scope.stuinfo);
            $scope.UpperMd5 = hex_md5($scope.changePsd.secondPsd).toLocaleUpperCase();
            if (sessionStorage.usertype == "student") {
                $scope.changePsdType = "changePsdStudent";
                getDataSource.getDataSource("changePsdStudent", { userid: sessionStorage.stu_info_id, password: $scope.changePsd.secondPsd, md5psd: $scope.UpperMd5 }, function (datatemp) {
                    window.localStorage.password = $scope.changePsd;
                    showAlert.alert("修改成功!");
                    $ionicHistory.goBack();
                }, function (error) {
                    showAlert.alert("修改失败!");
                });
            }
            else {
                getDataSource.getDataSource("changePsdTeacher", { userid: sessionStorage.userid, password: $scope.changePsd.secondPsd, md5psd: $scope.UpperMd5 }, function (datatemp) {
                    window.localStorage.password = $scope.changePsd;
                    showAlert.alert("修改成功!");
                    $ionicHistory.goBack();
                }, function (error) {
                    showAlert.alert("修改失败!");
                });
            }
        }
    }
})
.controller("editFormController", function ($scope, $rootScope, $state, Restangular, $http, $stateParams, getDataSource, $ionicHistory, downService, $ionicPopup, editFormService, cordovaService, showAlert, $timeout) {
    $scope.formdata = {};
    $scope.doPicture = function () {
        cordovaService.takePicture(function (imageData) {
            cordovaService.upLoadPic(imageData, $scope.formdata.info_id, function (data) {
                $scope.formdata.imgpath = data;
                //alert($scope.formdata._imgPath = "../formImg/" + data);
            }, function (error) {
                showAlert.alert("An error has occurred: Code = " + error.code);
                //alert("An error has occurred: Code = " + error.code);
            });
        }, function () {
        });
    }
    $scope.isnew = true;
    $scope.isview = false;
    $scope.hasData = true;
    $scope.allUser = [];
    $scope.fileData = [];
    $scope.fileCount = 0;
    $scope.class = { zdArray: [] };
    getDataSource.getDataSource("getAllUser", {}, function (data) {
        $scope.allUser = data;
    });

    if ($stateParams.isview == "true") {
        $scope.isview = true;
    }
    if ($stateParams.info_id) {
        $scope.isnew = false;
        //不通用功能2016年10月9日注释
        //getDataSource.getDataSource("getPunish", { id: $stateParams.info_id, punishname: $stateParams.obj }, function (data) {
        //    for (var i = 0; i < data.length; i++) {
        //        $scope.class.zdArray.push(data[i]);
        //    }
        //});
        //不通用功能2016年10月9日注释
        // 获取附件

    }
    getDataSource.getDataSource("getFileData", { info_id: $stateParams.info_id }, function (data) {
        $scope.fileData = data;
        $scope.fileCount = $scope.fileData.length;

        for (var i = 0; i < $scope.fileData.length; i++) {
            $scope.fileData[i].url = "/api/getAttach/action/getAttach/" + Base64.encode($scope.fileData[i].url);
        }
    });
    $scope.goPic = function (c) {
        PhotoViewer.show($(c).attr("src"), '照片');
    }
    var p = $http.get("../config/formConfig.json");
    p.then(function (data) {
        $scope.formConfig = data.data;
        $scope.loadForm();
    });
    $scope.loadForm = function () {

        $scope.dataSource = _.find($scope.formConfig, { obj: $stateParams.obj, formid: $stateParams.formid });//obj: $stateParams.obj, formid: $stateParams.formid
        $scope.showButtons = {};
        $scope.dataSource.buttons;
        if ($scope.dataSource.buttonNeedRole) {
            var roles = "," + sessionStorage.roles + ",";
            if (roles.indexOf($scope.dataSource.buttons.zc) > -1) {
                $scope.showButtons.zc = true;
            }
            if (roles.indexOf($scope.dataSource.buttons.tj) > -1) {
                $scope.showButtons.tj = true;
            }
            if (roles.indexOf($scope.dataSource.buttons.yy) > -1) {
                $scope.showButtons.yy = true;
            }
            if (roles.indexOf($scope.dataSource.buttons.sc) > -1) {
                $scope.showButtons.sc = true;
            }
        }
        else {
            $scope.showButtons.tj = true; $scope.showButtons.sc = true;
        }
        if ($scope.dataSource.needPicture == true) {

        }
        if ($stateParams.info_id) {
            var columns = "";
            angular.forEach($scope.dataSource.items, function (item) {
                columns += item.column + ",";
            });
            if ($scope.dataSource.needPicture) {
                columns += "imgpath,";
            }
            columns = columns.substr(0, columns.length - 1);
            //不通用功能2016年10月9日注释
            //getDataSource.getDataSource("getTableStatus", { info_id: $stateParams.info_id }, function (data) {
            //    if (data[0].num != 0) {
            //        $scope.hasData = false;
            //    }
            //    else {
            //        $scope.hasData = true;
            //    }
            //});
            //不通用功能2016年10月9日注释
            getDataSource.getDataSource("getFormData", { columns: columns, info_id: $stateParams.info_id, tablename: $scope.dataSource.tableName }, function (data) {
                $scope.formdata = data[0];
                for (var i in $scope.formdata) {
                    if (typeof ($scope.formdata[i]) == "string") {
                        if ($scope.formdata[i].indexOf("T") > -1 && $scope.formdata[i].indexOf("+08") > -1) {
                            $scope.formdata[i] = new Date($scope.formdata[i]);
                        }
                    }
                }
                $scope.loadRcode();
            });
        }
        //console.log($scope.dataSource);

        $scope.loadRcode();
    }
    $scope.loadRcode = function () {
        angular.forEach($scope.dataSource.items, function (item) {
            if (item.inputType == "drp") {
                getDataSource.getDataSource("getR_CODE", { code: item.dataSource }, function (rcode) {
                    item.rcode = rcode;
                });
            }
            if (item.defaultVal) {
                if (item.defaultVal == "nowUserName") {
                    $scope.formdata[item.column] = sessionStorage["uname"];
                    $scope.formdata[item.column + "_uid"] = sessionStorage["userid"];
                }
                else {
                    $scope.formdata[item.column] = item.defaultVal;
                }
            }
        });
    }
    $scope.goback = function () {
        $ionicHistory.goBack();
    }
    $scope.delete = function () {
        if ($stateParams.info_id) {
            var confirmPopup = $ionicPopup.confirm({
                title: '删除操作',
                template: "<div style='text-align:center;'>您确定要删除这条记录么?</div>",
                cancelText: "取消",
                okText: "确定",
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $scope.deleteForm();
                } else {

                }
            });
        }
    }
    $scope.deleteForm = function () {
        if ($stateParams.info_id) {
            var po = $http.post("../api/editForm/deleteForm", $stateParams.info_id);
            po.then(function (data) {
                $ionicHistory.goBack();
            });
        }
    }
    $scope.save = function (doSaveAfter) {
        var postForm = { data: $scope.formdata, obj: $stateParams.obj, formid: $stateParams.formid, isnew: $scope.isnew, userid: sessionStorage["userid"] };
        if ($stateParams.info_id) {
            postForm.data.info_id = $stateParams.info_id;
        }
        else {
            //getDataSource.getDataSource("getMaxInfo", {}, function (data) {
            //    postForm.data.info_id = data[0].maxid;
            //});
        }
        if ($stateParams.finfo_id) {
            postForm.data.finfo_id = $stateParams.finfo_id;
        }

        if ($stateParams.otherParams) {
            var otherParams = JSON.parse($stateParams.otherParams);
            postForm.otherParams = otherParams;
        }
        var po = $http.post("../api/editForm", postForm);
        //console.log(postForm);
        po.then(function (data) {
            if (doSaveAfter && $scope.dataSource.doSaveAfter) {
                if (doSaveAfter == 'doSaveAfter') {
                    setTimeout(function () {
                        eval("editFormService." + $scope.dataSource.doSaveAfter + "(" + postForm.data.info_id + ")");
                    }, 1000);
                }
                else {
                    setTimeout(function () {
                        eval("editFormService." + doSaveAfter + "(" + postForm.data.info_id + ")");
                    }, 100);
                }
            }
            //***不通用功能2016年10月9日注释
            //getDataSource.getDataSource("deletePunish", {
            //    id: postForm.data.info_id, punishname: $stateParams.obj
            //}, function (data) {
            //    for (var i = 0; i < $scope.class.zdArray.length; i++) {
            //        getDataSource.getDataSource("insertPunish", {
            //            id: postForm.data.info_id, uname: $scope.class.zdArray[i].bt, logname: $scope.class.zdArray[i].logname, punishname: $stateParams.obj
            //        }, function (data) {
            //            //$scope.allUser = data;
            //        });
            //    }
            //});
            //不通用功能2016年10月9日注释
            $scope.$broadcast("defaultListReflash");
            showAlert.alert("提交成功");
            $ionicHistory.goBack();
        });
    }

    $scope.downfile = function (url, filename) {
        downService.cordovaDown(downService.getRootPath() + url, filename);
    }
    $timeout(function () {

        $("input[type='date']").each(function () {
            $(this).mobiscroll().date({
                theme: 'android',
                lang: 'zh',
                display: 'modal',
                mode: 'scroller',
                dateFormat: 'yy-mm-dd'
            });
        })

        $("input[type='time']").each(function () {
            $(this).mobiscroll().time({
                theme: 'android',
                lang: 'zh',
                display: 'modal',
                mode: 'scroller'
            });
        })
    }, 300);
    $timeout(function () {
        /*Javascript代码片段*/
        (function ($, window, document, undefined) {
            var state = false;
            //定义menu构造函数
            var Menu = function (ele, opt) {
                this.$element = ele,
                this.defaults = {},
                this.options = $.extend({}, this.defaults, opt);
            }

            //定义menu方法
            Menu.prototype = {
                //设置a展开的样式
                setStyle: function () {
                    var len = this.$element.find("a").length;
                    $.each(this.$element.find("a"), function (i, obj) {
                        if (i != len - 1) {
                            $(this).css({
                                'opacity': 1,
                                'bottom': 40 + (i * 38),
                                'transform': 'rotate(0)'
                            });
                        }
                    });
                },
                //恢复a原来的样式
                resetStyle: function () {
                    var len = this.$element.find("a").length;
                    $.each(this.$element.find("a"), function (i, obj) {
                        if (i != len - 1) {
                            $(this).css({
                                'opacity': 0,
                                'left': 0,
                                'transform': 'rotate(360deg)'
                            });
                        }
                    });
                },
                open: function () {
                    this.$element.find("a.more").css({
                        'border-radius': 5,
                        'width': 80,
                    });
                    //font-awesome 用的官网的，各位大大莫心急
                    this.$element.find("a.more").html("<i class='ion-close-round'></i>");
                    this.setStyle();
                },
                close: function () {
                    this.$element.find("a.more").css({
                        'border-radius': 5,
                        'width': 80,
                    });
                    this.$element.find("a.more").html("操 作</i");
                    this.resetStyle();
                },
                toggle: function (obj) {
                    if (state == false) { obj.open(); state = true; }
                    else { obj.close(); state = false; }
                },
                boot: function () {
                    var t = this;
                    var tt = this.toggle;
                    this.$element.find("a.more").on("click", function () {
                        tt(t);
                    });
                    return this;
                }
            }
            //调用menu的对象
            $.fn.popupMenu = function (options) {
                //创建Menu对象实体
                var menu = new Menu(this, options);
                //调用驱动方法
                return menu.boot();
            }
        })
        (jQuery, window, document);
        $('#menu').popupMenu();
    }, 500);
})
.controller("mainshdxController", function ($scope, $rootScope, $state, $http, getDataSource, $timeout) {
    $scope.doRefresh = function () {
        // 通知公告
        var tzgg = $http.get("../api/Appraise/action/Getdiscuz/39/1");
        tzgg.then(function (data) {
            $scope.tzgg = data.data;
        });
        // 决策咨询
        var jczx = $http.get("../api/Appraise/action/Getdiscuz/2/2");
        jczx.then(function (data) {
            $scope.topggxx = data.data;
        });
        // 学员天地
        var xytd = $http.get("../api/Appraise/action/Getdiscuz/36/2");
        xytd.then(function (data) {
            $scope.bjxx = data.data;
        });
    }
    $scope.flash = function () {
        $scope.doRefresh();
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.goDetail = function (item) {
        $state.go("app.iosfile", { url: $rootScope.AppConfig.DiscuzPath + "forum.php?mod=viewthread&tid=" + item.tid });
    }

    $scope.goMore = function (fid) {
        $state.go("app.iosfile", { url: $rootScope.AppConfig.DiscuzPath + "forum.php?mod=forumdisplay&fid=" + fid });
    }
    $scope.doRefresh();
    $(function () {
        $timeout(function () {
            $("#discuzUrl").attr("src", $rootScope.AppConfig.DiscuzPath + "member.php?mod=logging&action=login&loginsubmit=yes&lssubmit=yes&username=" + sessionStorage.userid + "&password=" + localStorage.password);
        }, 500);
    })
    //$scope.datameSource = [
    //    {
    //        row: "1", data: [
    //            { image: "../img/bjgx.png", title: "时事要闻", url: "teachactivity" },
    //            { image: "../img/bjgxtsym.png", title: "决策咨询", url: "teachappraise" },
    //            { image: "../img/bx.png", title: "社区悦读", url: "notice" },
    //            { image: "../img/jxpj.png", title: "资料下载", url: "notice" }
    //        ]
    //    }
    //];
    //$scope.topggxx = [
    //    {
    //        "id": "1",
    //        "subject": "中青班学员报道"
    //    },
    //    {
    //        "id": "2",
    //        "subject": "中青班学员报道"
    //    }
    //];
    //$scope.bjxx = [
    //{
    //    "name": "52中青班",
    //    "subject": "第一期上海党校，行政学院系统青年干部",
    //    "title_pic": "../img/3.jpg",
    //    "dateline": "2016-11-15"
    //},
    //{
    //    "name": "16年党外中青班",
    //    "subject": "第一期上海党校，行政学院系统青年干部",
    //    "title_pic": "../img/4.jpg",
    //    "dateline": "2016-11-15"
    //},
    //{
    //    "name": "中国浦东干部学院",
    //    "subject": "第一期上海党校，行政学院系统青年干部",
    //    "title_pic": "../img/5.jpg",
    //    "dateline": "2016-11-15"
    //}
    //];
})
;