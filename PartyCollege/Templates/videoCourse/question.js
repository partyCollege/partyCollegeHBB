app.controller("questionController", ["$scope", "$rootScope", "getDataSource", "$stateParams", "CommonService", "DateService", function ($scope, $rootScope, getDataSource, $stateParams, CommonService, DateService) {

    //getDataSource.writeLog("页面访问-问答", "20032");

    $scope.myConfig = [{
        questionTimeSelect: true,
        questionPopularitySelect: false,
        questionTime: "tubiaoicon-48",
        questionPopularity: "",
        questionSort: 1,
        questionDesc: 1,
    },
    {
        questionTimeSelect: true,
        questionPopularitySelect: false,
        questionTime: "tubiaoicon-48",
        questionPopularity: "",
        questionSort: 1,
        questionDesc: 1
    }];


    //我的问题-当前页
    $scope.currentPageIndex = 1;
    //所有问题-当前页
    $scope.currentPageIndex_all = 1;
    //页大小
    $scope.currentPageSize = 5;

    //我的问题
    $scope.myQuestion = [];
    //所有问题
    $scope.questions = [];


    //加载更多我的问题
    $scope.loadMoreMyquestion = function () {
        getMyquestionData("more", 0);
    }


    //加载更多所有问题
    $scope.loadMoreQuestions = function () {
        getquestionsData("more", 1);
    }

    //我的问题
    var getMyquestionData = function (type,index) {
        //我的提问
        getDataSource.getUrlData("../api/searchQuestions",
            {
                accountid: $rootScope.user.accountId,
                coursewareid: $stateParams.coursewareid,
                pageindex: $scope.currentPageIndex,
                pagesize: $scope.currentPageSize,
                sortType: $scope.myConfig[index].questionSort,
                orderType: $scope.myConfig[index].questionDesc,
                searchType : 1

            },
            function (data) {
                var myQuestions = data.questionList;
                var replyList = data.questionReplyList;

                for (var n = 0; n < myQuestions.length; n++)
                {
                    _.merge(myQuestions[n], {
                        //'ismyquestion':myQuestions[n].accountid == $rootScope.user.accountId,
                        'noreply': replyList.filter(function (a) { return a.fid == myQuestions[n].id && a.status == 1 }).length <= 0,
                        'replylist': replyList.filter(function (a) { return a.fid == myQuestions[n].id })
                    });
                }

                if (myQuestions && myQuestions.length > 0) {
                    $scope.myQuestion = _.union($scope.myQuestion, myQuestions);
                    $scope.currentPageIndex++;
                    if (myQuestions.length >= $scope.currentPageSize)
                        $scope.moreshow = true;
                    else
                        $scope.moreshow = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.moreshow = false;
                        CommonService.alert("没有更多数据了");
                    }
            },
            function (error)
            {

            }
         );
    }

    //所有问题
    var getquestionsData = function (type,index) {

        //所有提问
        getDataSource.getUrlData("../api/searchQuestions",
            {
                accountid: $rootScope.user.accountId,
                coursewareid: $stateParams.coursewareid,
                pageindex: $scope.currentPageIndex_all,
                pagesize: $scope.currentPageSize,
                sortType: $scope.myConfig[index].questionSort,
                orderType: $scope.myConfig[index].questionDesc,
                searchType: 2

            },
            function (data) {
                var allQuestions = data.questionList;
                var replyList = data.questionReplyList;
                for (var n = 0; n < allQuestions.length; n++)
                {
                    _.merge(allQuestions[n], {
                        'noreply': replyList.filter(function (a) { return a.fid == allQuestions[n].id && a.status == 1 }).length <= 0,
                        'replylist': replyList.filter(function (a) { return a.fid == allQuestions[n].id })
                    });
                }

                if (allQuestions && allQuestions.length > 0) {
                    $scope.questions = _.union($scope.questions, allQuestions);
                    $scope.currentPageIndex_all++;
                    if (allQuestions.length >= $scope.currentPageSize)
                        $scope.moreshow_all = true;
                    else
                        $scope.moreshow_all = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.moreshow_all = false;
                        CommonService.alert("没有更多数据了");
                    }
            },
            function (error) {

            }
         );




    }

    //排序
    $scope.questionDataOrder = function (type, index) {
        if (type == 1) {
            if ($scope.myConfig[index].questionTime == "tubiaoicon-48") {
                //时间升序
                $scope.myConfig[index].questionTimeSelect = true;
                $scope.myConfig[index].questionPopularitySelect = false;
                $scope.myConfig[index].questionTime = "tubiaoicon-16"
                $scope.myConfig[index].questionPopularity = "";
                $scope.myConfig[index].questionSort = 1;
                $scope.myConfig[index].questionDesc = 2;
            }
            else {
                //时间倒序
                $scope.myConfig[index].questionTimeSelect = true;
                $scope.myConfig[index].questionPopularitySelect = false;
                $scope.myConfig[index].questionTime = "tubiaoicon-48"
                $scope.myConfig[index].questionPopularity = "";
                $scope.myConfig[index].questionSort = 1;
                $scope.myConfig[index].questionDesc = 1;
            }
        }
        else {
            if ($scope.myConfig[index].questionPopularity == "tubiaoicon-48") {
                //人气升序
                $scope.myConfig[index].questionTimeSelect = false;
                $scope.myConfig[index].questionPopularitySelect = true;
                $scope.myConfig[index].questionPopularity = "tubiaoicon-16";
                $scope.myConfig[index].questionTime = "";
                $scope.myConfig[index].questionSort = 2;
                $scope.myConfig[index].questionDesc = 2;
            }
            else {
                //人气倒序
                $scope.myConfig[index].questionTimeSelect = false;
                $scope.myConfig[index].questionPopularitySelect = true;
                $scope.myConfig[index].questionPopularity = "tubiaoicon-48";
                $scope.myConfig[index].questionTime = "";
                $scope.myConfig[index].questionSort = 2;
                $scope.myConfig[index].questionDesc = 1;
            }
        }
        if (index == 0) {
            $scope.myQuestion = [];
            $scope.currentPageIndex = 1;
            getMyquestionData("", index);
        }
        else if (index == 1) {
            $scope.questions = [];
            $scope.currentPageIndex_all = 1;
            getquestionsData("", index);
        }
    }


    //选项卡
    $scope.spanClick = function (ename) {

        if (ename == "myQuestionView") {
            $scope.myQuestion = [];
            $scope.currentPageIndex = 1;
            getMyquestionData("", 0);
        }
        else if (ename == "questionsView") {
            //所有提问
            $scope.questions = [];
            $scope.currentPageIndex_all = 1;
            getquestionsData("", 1);
            //回复框显示隐藏
            $scope.answerShow = function (id) {
                _.find($scope.questions, { "id": id }).answershow = !_.find($scope.questions, { "id": id }).answershow;
            }
            //回答发布
            $scope.answer = function (id) {
                var item = _.find($scope.questions, { "id": id });

                if (item.replycontent == "") {
                    CommonService.alert("请先输入需要回答的内容");
                    return;
                }

                var faq_id = getDataSource.getGUID();
                getDataSource.getDataSource("insert_sy_class_faq", {
                    id: faq_id,
                    accountid: $rootScope.user.accountId,
                    fid: id,
                    content: item.replycontent,
                    coursewareid: $stateParams.coursewareid,
                    usertype: "1",
                    studentid: $rootScope.user.studentId,
                    videostamp: 0,
                    dimension: "参与度",
                    eventname: "回答1个问题",
                    logcontent: "回答问题"
                },
                    function (data) {
                        //隐藏回复框
                        item.answershow = !item.answershow;
                        //插入前台对象
                        item.replylist.push(
                            {
                                "id": faq_id,
                                "accountid": $rootScope.user.accountId,
                                "status": 0,
                                "fid":id,
                                "pcontent": item.replycontent,
                                "createdtime": DateService.format(new Date(), 'yyyy-MM-dd'),
                                "fromtype": 1,
                                "fromuser": $rootScope.user.name,
                                "clickcount": "0",
                                "isclick":0
                            })
                        CommonService.alert("发布成功");
                        //清空输入框
                        item.replycontent = "";
                    },
                    function () {
                        CommonService.alert("发布失败");
                    }
                 );
            }

            //关注
            $scope.attention = function (id) {
                var attention = _.find($scope.questions, { "id": id });
                if (!attention.isattention) {
                    getDataSource.getUrlData("../api/commonAttention",
                        {
                            "eventid": id,
                            "accountid": $rootScope.user.accountId,
                            "passive_classid": attention.classid,
                            "passive_accountid": attention.accountid,
                            "passive_student": attention.studentid
                        }, function (flag) {
                            if (flag == "true") {
                            attention.attentioncount++;
                            attention.isattention = 1;
                        }
                    }, function (errortemp) { });
                }
            }


            //问题点赞
            $scope.clickALike = function (id) {
                var like = _.find($scope.questions, { "id": id });
                if (!like.isclick) {
                    getDataSource.getUrlData("../api/commonPraise",
                    {
                        "eventid": id,
                        "accountid": $rootScope.user.accountId,
                        "passive_classid": like.classid,
                        "passive_accountid": like.accountid,
                        "passive_student": like.studentid,
                        "usertype": "1",  //学员操作
                        "eventtype": like.fromtype,
                        "group": "20032",
                        "tag": "操作-问题点赞"
                    }, function (flag) {
                        if (flag == "true") {
                            like.clickcount++;
                            like.isclick = 1;
                        }
                    }, function (errortemp) { });
                }
            }

            //回答点赞
            $scope.clickALike_reply = function (answerid, replyid) {
                var item = _.find($scope.questions, { "id": answerid });
                var like = _.find(item.replylist, { "id": replyid });
                if (!like.isclick) {
                    getDataSource.getUrlData("../api/commonPraise",
                        {
                            "eventid": replyid,
                            "accountid": $rootScope.user.accountId,
                            "passive_classid": like.classid,
                            "passive_accountid": like.accountid,
                            "passive_student": like.studentid,
                            "usertype": "1",  //学员操作
                            "eventtype": like.fromtype,
                            "group": "20032",
                            "tag": "操作-回答点赞"
                        }, function (flag) {
                            if (flag == "true") {
                            like.clickcount++;
                            like.isclick = 1;
                        }
                    }, function (errortemp) { });
                }
            }



        }

        var selectItem = _.find($rootScope.videoConfig.questionConfig, { "show": true, "select": true });
        selectItem.show = false;
        selectItem.select = false;
        var currentselectItem = _.find($rootScope.videoConfig.questionConfig, { "elementName": ename });
        currentselectItem.show = true;
        currentselectItem.select = true;

        //$rootScope.videoConfig.questionConfig.filter(function (n) { return n.elementName != ename }).forEach(function (n) { n.show = false; n.select = false; });
        //$rootScope.videoConfig.questionConfig.filter(function (n) { return n.elementName == ename }).forEach(function (n) { n.show = true; n.select = true; });

    };


    //删除自己的问题
    $scope.deleQuestion = function (id,type) {
        getDataSource.getDataSource("getAnswercountByQuestionId", { id: id },
            function (data) {
                if (data && data[0].answercount > 0) {
                    CommonService.alert("该问题已有回复，不能删除");
                    return;
                }
                else {
                    getDataSource.getDataSource("delete_sy_class_faq",
                        {
                            id: id,
                            fid: id
                        },
                        function (data) {
                            if (type == 0)
                            {
                                $scope.myQuestion = [];
                                $scope.currentPageIndex = 1;
                                getMyquestionData("", 0);
                            }
                            else if (type == 1) {
                                $scope.questions = [];
                                $scope.currentPageIndex_all = 1;
                                getquestionsData("", 1);
                            }
                            CommonService.alert("问题删除成功");
                        },
                        function (error) {
                            CommonService.alert("问题删除失败");
                        }
                    );
                }
            },
            function (error) { }
        );
    }

    //删除自己的回复
    $scope.deleAnswer = function (answerid,type) {
        getDataSource.getDataSource("getAnswerstatusByAnswerId", { id: answerid },
            function (data) {
                if (data && data[0].status > 0) {
                    CommonService.alert("该答案已被采纳，不能删除");
                    return;
                }
                else {
                    getDataSource.getDataSource("delete_sy_class_faq_answer",
                        {
                            id: answerid
                        },
                        function (data) {
                            if (type == 0) {
                                $scope.myQuestion = [];
                                $scope.currentPageIndex = 1;
                                getMyquestionData("", 0);
                            }
                            else if (type == 1) {
                                $scope.questions = [];
                                $scope.currentPageIndex_all = 1;
                                getquestionsData("", 1);
                            }
                            CommonService.alert("答案删除成功");
                        },
                        function (error) {
                            CommonService.alert("答案删除失败");
                        }
                    );
                }
            },
            function (error) { }
        );
    }

    //默认选中我的问题
    $scope.spanClick("myQuestionView");

    //监控提问数量
    $scope.$watch("videoConfig.questionCount", function (newvalue, oldvalue) {
        if (newvalue > oldvalue) {
            $scope.myQuestion = [];
            $scope.currentPageIndex = 1;
            getMyquestionData("", 0);
        }
        
    });
}]);