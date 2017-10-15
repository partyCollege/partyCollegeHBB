app.controller("studytotalController", ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $timeout, $state, $stateParams, getDataSource, CommonService) {


    $scope.tabs = [
        { id: "1000", title: "总体情况统计", selected: false, isshow: true, index: 0, init: function () { $scope.goAutoCompute(); } },
        { id: "1001", title: "选修学时", selected: false, isshow: true, index: 1, init: function () { $scope.inittrain(); } },
        { id: "1002", title: "学习班", selected: false, isshow: true, index: 2, init: function () { $scope.inittrain(); } },
        { id: "1003", title: "面授培训", selected: false, isshow: true, index: 3, init: function () { $scope.inittrain(); } }
    ];

    $scope.changetab = function (n, cyear,ctype) {
        for (var i = 0; i < $scope.tabs.length; i++) {
            $scope.tabs[i].selected = false;
        }
        n.selected = true;
        $scope.pIndex = n.index;
        $scope.pagefilter.type = n.index;
        $scope.pagefilter.reset();
        $scope.searchfilter.year = yearInt;
        $scope.searchfilter.ctype = 0;
        if (cyear) {
            $scope.searchfilter.year = cyear;
        }
        if (ctype) {
            $scope.searchfilter.ctype = ctype;
        }
        if (n.init) n.init();
    }

    $scope.selectchanged = function (pIndex) {
        $scope.pagefilter.reset();
        $scope.pIndex = pIndex;
        var n = $scope.tabs[$scope.pIndex];
        if (n.init) n.init();
    }


    var date = new Date();
    var yearInt = date.getFullYear();
    $scope.yearArr = [];
    var start = 2012;
    for (var i = start; i <= yearInt; i++) {
        $scope.yearArr.push(i);
    }

    $scope.searchfilter = { year: yearInt, totalscore: 0, classid: "" };
    $timeout(function () {
        $scope.searchfilter.year = yearInt;
        $scope.pageinit();
    }, 500);
    $scope.pIndex = 0;

    $scope.pagefilter = {
        maxSize: 6,
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        type: 0,
        reset: function () {
            this.maxSize = 6;
            this.totalItems = 0;
            this.pageSize = 10;
            this.currentPage = 1;
            $scope.datalist = [];
            $scope.ClassAttr.isclassattr = false;
            $scope.searchfilter.totalscore = 0;
            $scope.total.isshow = false;
        }
    };

    $scope.pageChanged = function () {
        var n = $scope.tabs[$scope.pIndex];
        if (n.init) n.init();
    }

    $scope.gotrain = function () {
        $state.go('main.train1');
    }

    $scope.inittrain = function () {

        var parameter = _.merge({}, $scope.searchfilter, $scope.pagefilter);

        getDataSource.getUrlData("../api/gettrain", parameter, function (data) {
            if (data.result) {
                $scope.datalist = data.items;
                $scope.pagefilter.totalItems = data.rows.totalItems;
                $scope.searchfilter.totalscore = data.rows.totalscore;
            }

        }, function (errortemp) { });
    }

    //提交或取消提交面授
    $scope.submittrain = function (n, sta) {

        var tips = sta == 0 ? "确定要取消提交该面授培训吗?" : "确定要提交该面授培训吗";
        var submit = function () {
            //var parameter = { status: sta, id: n.id };
            var parameter = { status: sta, id: n.id, remark: "" };
            getDataSource.getDataSource("submitrain", parameter, function (data) {
                if (data[0] && data[0].crow > 0) {
                    CommonService.alert("操作成功");
                    $scope.tabs[$scope.pIndex].init();
                }
            }, function (error) { });
        }
        _.merge($rootScope.confirmOptions, {
            message: tips,
            confirm: function () {
                submit();
            }
        });

        $rootScope.confirmOptions.open();
    }

    //删除面授
    $scope.deletetrain = function (n) {

        var deltrain = function () {
            var parameter = { id: n.id };
            getDataSource.getDataSource("deletetrain", parameter, function (data) {
                if (data[0] && data[0].crow > 0) {
                    CommonService.alert("操作成功");
                    $scope.tabs[$scope.pIndex].init();
                }
            }, function (error) { });
        }

        _.merge($rootScope.confirmOptions, {
            message: "确定要删除该面授培训吗",
            confirm: function () {
                deltrain();
            }
        });

        $rootScope.confirmOptions.open();

    }

    //编辑面授
    $scope.edittrain = function (n) {
        $state.go('main.train2', { id: n.id });
    }

    $scope.ClassAttr = {
        isclassattr: false,
        classname: ""
    };
    $scope.goClassAttr = function (n) {
        $scope.ClassAttr.isclassattr = true;
        $scope.ClassAttr.classname = n.classname;
        $scope.searchfilter.classid = n.classid;
        $scope.pagefilter.type = 4;

        $scope.inittrain();
    } 
    $scope.total = {
        totalstutytime: 0.0,//总学时
        totaltime: 0,//总时长
        totaltimecn: "",//总时长
        isshow:false
    };

    $scope.getArchives = function () {
        var parameter = {};
        parameter.studentid = $rootScope.user.studentId;
        parameter.startyear = $scope.searchfilter.year;
        parameter.endyear = $scope.searchfilter.year - 4;
        getDataSource.getDataSource("getarchives", parameter, function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].expand = false;
                    data[i].src = "../img/arrow01.png";
                    data[i].keywordsArr = data[i].keywords.split(",");
                    data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);

                    $scope.total.totalstutytime += data[i].total_studytime;
                    $scope.total.totaltime += parseInt(data[i].total_time);
                }
                $scope.total.isshow = true;
                $scope.total.totaltimecn = (parseInt($scope.total.totaltime) / 3600).toFixed(1); 
                data[0].expand = true;
                data[0].src = "../img/arrow02.png";
                $scope.datalist = data;
            }
        }, function (error) { });
    }


    $scope.onExpand = function (n) {
        n.expand = !n.expand;
        n.src = n.expand == false ? "../img/arrow01.png" : "../img/arrow02.png";
    }

    $scope.goChange = function (no, year,ctype) {
        var n = $scope.tabs[parseInt(no)];
        if (n.isshow) {
            $scope.changetab(n, year, ctype);
        }
    }

    $scope.goCompute = function () {

        _.merge($rootScope.confirmOptions, {
            message: "确定要重新生成学习档案吗，这将花费您一定的时间?",
            confirm: function () {
                $scope.goAutoCompute();
            }
        });

        $rootScope.confirmOptions.open();
    }

    $scope.goAutoCompute = function () {
        $rootScope.loadingOptions.message = "正在重新生成学习档案,请稍候....";
        $rootScope.loadingOptions.isOpened = true;

        var p = {};
        p.departmentid = $rootScope.user.departmentId;
        p.studentid = $rootScope.user.studentId;
        p.accountid = $rootScope.user.accountId;
        p.rank = $rootScope.user.yearplan.rank;
        getDataSource.getUrlData("../api/gettotal", p, function (data) {
            $rootScope.loadingOptions.isOpened = false;
            if (data.result) {
                $scope.getArchives();
            }
        }, function (errortemp) { });
    }

    $scope.pageinit = function () {
        var no = $stateParams.no;
        if (no) {
            if (parseInt(no) < $scope.tabs.length) {
                var n = $scope.tabs[parseInt(no)];
                if (n.isshow) {
                    $scope.changetab(n,0);
                }
            }
        }
    }
}])
