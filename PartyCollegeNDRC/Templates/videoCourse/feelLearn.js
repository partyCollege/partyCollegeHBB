app.controller("feelLearnController", ["$scope", "$rootScope", "$stateParams", "$modal", "getDataSource", "CommonService", 'StudyService', function ($scope, $rootScope, $stateParams, $modal, getDataSource, CommonService, StudyService) {


    //getDataSource.writeLog("页面访问-学后感", "20033");
    //选项卡
    $scope.spanClick = function (ename) {
        if (ename == "myfeelLearnView") {
            //我的学后感
            $scope.ueditorConfig = {
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                toolbars: [
                    [
                        'undo', //撤销
                        'redo', //重做
                        'bold', //加粗
                        'indent', //首行缩进
                        'italic', //斜体
                        'underline', //下划线
                        'strikethrough', //删除线
                        'subscript', //下标
                        'fontborder', //字符边框
                        'superscript', //上标
                        'formatmatch', //格式刷
                        'time', //时间
                        'date', //日期
                        'fontfamily', //字体
                        'fontsize', //字号
                        'paragraph', //段落格式
                        'justifyleft', //居左对齐
                        'justifyright', //居右对齐
                        'justifycenter', //居中对齐
                        'justifyjustify', //两端对齐
                        'forecolor', //字体颜色
                    ]
                ],
                //focus时自动清空初始化时的内容
                autoClearinitialContent: true,
                //关闭字数统计
                wordCount: false,
                //关闭elementPath
                elementPathEnabled: false,
                enableAutoSave: false,
                autoSyncData:false
            }

            $scope.myConfig.orderShow = false;
            getMyfeelLearns();
        }
        else if (ename == "feelLearnsView") {
            //所有学后感
            //if ($scope.myFeelLearn == undefined || $scope.myFeelLearn.issubmit == undefined || $scope.myFeelLearn.issubmit == 0) {
            //    CommonService.alert("请先提交学后感");
            //    return;
            //}
            //else {
                $scope.myConfig.orderShow = true;
                getAllFeelLearns();
            //}
        }
        var selectCurrentItem = _.find($rootScope.videoConfig.feelLearnConfig, { "show": true, "select": true });
        selectCurrentItem.show = false;
        selectCurrentItem.select = false;
        var selectItem = _.find($rootScope.videoConfig.feelLearnConfig, { "elementName": ename });
        selectItem.show = true;
        selectItem.select = true;   
    };

    $scope.myConfig = {
        feellearnTimeSelect: true,
        feellearnPopularitySelect: false,
        orderShow :false,
        feellearnTime: "tubiaoicon-48",
        feellearnPopularity: "",
        feellearnSort: "createdtime",
        feellearnDesc: "desc",
    };


    //获取我的学后感
    var getMyfeelLearns = function ()
    {
        getDataSource.getDataSource("videoCourse-myFeelLearn", {
            studentid: $rootScope.user.studentId,
            coursewareid: $stateParams.coursewareid,
            accountid: $rootScope.user.accountId,
        }, function (data) {
            if (data.length > 0)
                $scope.myFeelLearn = data[0];
            else {
                $scope.myFeelLearn = {
                    issubmit: 0
                };
            }
        }, function (errortemp) { });
    }

    //获取所有学后感
    var getAllFeelLearns = function () {
        getDataSource.getDataSource("videoCourse-feelLearn", {
            coursewareid: $stateParams.coursewareid,
            accountid: $rootScope.user.accountId,
        }, function (data) {
            $scope.feelLearns = _.sortByOrder(data, $scope.myConfig.feellearnSort, $scope.myConfig.feellearnDesc);
        }, function (errortemp) { });
    }

    //排序
    $scope.feellearnDataOrder = function (type) {
        if (type == 1) {
            if ($scope.myConfig.feellearnTime == "tubiaoicon-48") {
                //时间升序
                $scope.myConfig.feellearnTime = "tubiaoicon-16"
                $scope.myConfig.feellearnPopularity = "";
                $scope.myConfig.feellearnSort = "createdtime";
                $scope.myConfig.feellearnDesc = "asc";
                $scope.myConfig.feellearnTimeSelect = true;
                $scope.myConfig.feellearnPopularitySelect = false;
            }
            else {
                //时间倒序
                $scope.myConfig.feellearnTime = "tubiaoicon-48"
                $scope.myConfig.feellearnPopularity = "";
                $scope.myConfig.feellearnSort = "createdtime";
                $scope.myConfig.feellearnDesc = "desc";
                $scope.myConfig.feellearnTimeSelect = true;
                $scope.myConfig.feellearnPopularitySelect = false;
            }
        }
        else {
            if ($scope.myConfig.feellearnPopularity == "tubiaoicon-48") {
                //人气升序
                $scope.myConfig.feellearnPopularity = "tubiaoicon-16";
                $scope.myConfig.feellearnTime = "";
                $scope.myConfig.feellearnSort = "clickcount";
                $scope.myConfig.feellearnDesc = "asc";
                $scope.myConfig.feellearnTimeSelect = false;
                $scope.myConfig.feellearnPopularitySelect = true;
            }
            else {
                //人气倒序
                $scope.myConfig.feellearnPopularity = "tubiaoicon-48";
                $scope.myConfig.feellearnTime = "";
                $scope.myConfig.feellearnSort = "clickcount";
                $scope.myConfig.feellearnDesc = "desc";
                $scope.myConfig.feellearnTimeSelect = false;
                $scope.myConfig.feellearnPopularitySelect = true;
            }
        }
        getAllFeelLearns();
    }

    //提交按钮是否可用
    $scope.submitdisabled = false;

    //保存
    $scope.save = function (type,issubmit) {
        var mess = type == "save" ? "保存" : "提交";

        if ($rootScope.Videolog == undefined || $rootScope.Videolog.isplaycompletion == "0")
        {
            CommonService.alert("请先学完课程");
            return;
        }

        if ($scope.myFeelLearn == undefined) {
            CommonService.alert("请先编辑学后感后再进行" + mess);
        }
        else {
            if ($scope.myFeelLearn.fltitle == undefined || _.trim($scope.myFeelLearn.fltitle) == "")
            {
                CommonService.alert("请输入标题后再进行" + mess);
                return;
            }
            if ($scope.myFeelLearn.flcontent == undefined || _.trim($scope.myFeelLearn.flcontent) == "") {
                CommonService.alert("请输入内容后再进行" + mess);
                return;
            }
            if ($scope.myFeelLearn.id == undefined) {
                var newid = getDataSource.getGUID();
                $scope.myFeelLearn.id = newid;
                $scope.myFeelLearn.issubmit = issubmit;

                var par = {
                    learningsenseModel: {
                        id: newid,
                        studentid: $rootScope.user.studentId,
                        title: $scope.myFeelLearn.fltitle,
                        content: $scope.myFeelLearn.flcontent,
                        coursewareid: $stateParams.coursewareid,
                        recommendedstatus: 0,
                        status: issubmit,
                        classid: $rootScope.user.classId,
                        logcontent: mess
                    }
                };


                getDataSource.getUrlData("../api/InsertClasscourseLearningsense", par,
                    function (flag) {
                        if (flag == "true") {
                            if (issubmit == 1) {
                                $scope.submitdisabled = true;
                            }
                        CommonService.alert(mess + "成功");
                    }
                }, function (error) {
                    $scope.submitdisabled = false;
                    CommonService.alert(mess + "失败");
                });
            }
            else {
                var par = {
                    learningsenseModel: {
                        id: $scope.myFeelLearn.id,
                        title: $scope.myFeelLearn.fltitle,
                        content: $scope.myFeelLearn.flcontent,
                        status: issubmit
                    }
                };

      
                getDataSource.getUrlData("../api/submitClasscourseLearningsense", par,
                    function (flag) {
                        if (flag == "true") {
                        $scope.myFeelLearn.issubmit = issubmit;
                        
                        CommonService.alert(mess + "成功");
                    }
                }, function (error) {
                    CommonService.alert(mess + "失败");
                });
            }
        }
    }
    //提交
    $scope.submit = function (type, issubmit) {
        $scope.save(type, issubmit);
    }

    $scope.spanClick("myfeelLearnView");


    //点赞
    $scope.clickALike = function (id, accountid, studentid,classid) {
        var like = _.find($scope.feelLearns, { "id": id });
        if (!like.isclick) {
            getDataSource.getUrlData("../api/commonPraise",
            {
                "eventid": id,
                "accountid": $rootScope.user.accountId,
                "passive_classid": classid,
                "passive_accountid": accountid,
                "passive_student": studentid,
                "usertype": "1",  //学员操作
                "eventtype": "1", 
                "group": "20033",
                "tag":"操作-学后感点赞"

            }, function (flag) {
                if (flag == "true") {
                    like.clickcount++;
                    like.isclick = 1;
                }
            }, function (errortemp) { });
        }
    }

    function delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }

    $scope.getLen = function(str){
        return delHtmlTag(str).length;
    }

    //展开，收起学后感明细
    $scope.openDetail = function (id) {
        var currentItem = _.find($scope.feelLearns, { "id": id });
        var flag = currentItem.isdetail ? 0 : 1;

        for (var i = 0; i < $scope.feelLearns.length; i++)
        {
            $scope.feelLearns[i].isdetail = 0;
        }
        currentItem.isdetail = flag;
    }
}]);

