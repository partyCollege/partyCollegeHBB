app.controller("videoCouresController", ["$scope", "$rootScope", "$anchorScroll", "$location", "$document", "$stateParams", "$modal", "getDataSource", "FilesService", "CommonService", "DateService", function ($scope, $rootScope, $anchorScroll, $location, $document, $stateParams, $modal, getDataSource, FilesService, CommonService, DateService) {
    //$document[0].title = "课程播放";

    //评价是否显示
    $scope.appraiseShow = false;


    $scope.decRound = function (num) {
        return parseFloat(num).toFixed(1);
    }


    //课程评价配置
    $scope.scoreConfig = [
        {
            itemid: 1,
            itemname: '观点正确',
            rate: 3,
            max: 5,
            isReadonly: false
        },
        {
            itemid: 2,
            itemname: '联系实际',
            rate: 3,
            max: 5,
            isReadonly: false
        },
        {
            itemid: 3,
            itemname: '内容丰富',
            rate: 3,
            max: 5,
            isReadonly: false
        },
        {
            itemid: 4,
            itemname: '讲授认真',
            rate: 3,
            max: 5,
            isReadonly: false
        },
        {
            itemid: 5,
            itemname: '互动充分',
            rate: 3,
            max: 5,
            isReadonly: false
        }
    ];

    //关闭或者打开评价页面
    $scope.showAppraise = function () {
        getDataSource.getDataSource("getVideolog", {
            studentid: $rootScope.user.studentId,
            coursewareid: $stateParams.coursewareid
        }, function (data) {
            $rootScope.Videolog = data[0];
            //学后感和考题，需要判断是否已学完课程
            if (data && data[0] && data[0].isplaycompletion == "1") {
                if (!$scope.appraiseShow) {

                    getDataSource.getDataSource('geAppraisetFlag', {
                        coursewareid31: $stateParams.coursewareid,
                        accountid: $rootScope.user.accountId
                    }, function (data) {
                        //是否评价
                        if (data[0].isappraise <= 0) {
                            $scope.hoveringOver = function (index, value) {
                                $scope.scoreConfig[index].overStar = value;
                                $scope.scoreConfig[index].percent = (value / $scope.scoreConfig[index].max) * 10;
                            };

                            $scope.leaveingOver = function (index) {
                                $scope.scoreConfig[index].overStar = null;
                                $scope.scoreConfig[index].percent = $scope.scoreConfig[index].rate * 2;
                            };
                            //清除
                            $scope.clearAppraise = function () {
                                if ($scope.scoreConfig) {
                                    for (var i = 0; i < $scope.scoreConfig.length; i++)
                                    {
                                        $scope.scoreConfig[i].rate = 0;
                                        $scope.scoreConfig[i].percent = 0;
                                    }
                                }
                            };
                        	//提交评价
                            $scope.sumbitDisabled = false;
                            $scope.submitAppraise = function () {
                                var flag = true;
                                $scope.sumbitDisabled = true;
                                if ($scope.scoreConfig) {
                                    for (var i = 0; i < $scope.scoreConfig.length; i++) {
                                        if ($scope.scoreConfig[i].rate == undefined || $scope.scoreConfig[i].rate == null ||  $scope.scoreConfig[i].rate == 0)
                                        {
                                            flag = false;
                                            break;
                                        }
                                    }
                                }
                                if (flag) {
                                    //是否允许打0分
                                    var courseAppraiseContent = $("#courseAppraiseContent").val();

                                    var data = {
                                        accountid: $rootScope.user.accountId,
                                        classcourseid: "",
                                        studentid: $rootScope.user.studentId,
                                        coursewareid: $stateParams.coursewareid,
                                        classid: $rootScope.user.classId,
                                        scoreList: $scope.scoreConfig,
                                        courseAppraiseContent: courseAppraiseContent
                                    };

                                    getDataSource.getUrlData("../api/submitAppraise", data, function (flag) {
                                        if (flag == "true") {
                                            //+1
                                            $scope.coursewareCommentData.gradecount++;
                                            //清空
                                            $scope.clearAppraise();
                                            //获取评分
                                            getAppraiset();
                                            //隐藏评价窗口
                                            $scope.appraiseShow = !$scope.appraiseShow;
                                            CommonService.alert("提交成功");
                                            $scope.sumbitDisabled = false;
                                        }
                                    }, function (error) {
                                    	CommonService.alert("提交失败");
                                    	$scope.sumbitDisabled = false;
                                    });
                                }
                                else {
                                	$scope.sumbitDisabled = false;
                                    CommonService.alert("请评价所有项后再提交");
                                }
                            };

                            $scope.ratingStates = [
                              { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
                              { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
                              { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
                              { stateOn: 'glyphicon-heart' },
                              { stateOff: 'glyphicon-off' }
                            ];

                            $scope.appraiseShow = !$scope.appraiseShow;
                        }
                        else {
                            $scope.isappraise[0].isappraise = 1;
                            CommonService.alert("已评价，不能重复评价");
                            $scope.sumbitDisabled = false;
                            return;
                        }
                    }, function (error) { $scope.sumbitDisabled = false; });
                }
                else {
                    if ($scope.scoreConfig) {
                        for (var i in $scope.scoreConfig) {
                            $scope.scoreConfig[i].rate = null;
                            $scope.scoreConfig[i].percent = null;
                        }
                    }
                    $scope.ratingStates = [
                      { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
                      { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
                      { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
                      { stateOn: 'glyphicon-heart' },
                      { stateOff: 'glyphicon-off' }
                    ];

                    $scope.appraiseShow = !$scope.appraiseShow;
                }
            }
            else {
                CommonService.alert("请先学完课程");
                return;
            }

        }, function (error) {

        });

    }


    //选项卡
    $rootScope.feelLearnEditdisable = false;
    $scope.aClick = function (ename) {
        if (ename == "examinationView") {
            //考题，需要判断是否已学完课程
            getDataSource.getDataSource("getVideolog", {
                studentid: $rootScope.user.studentId,
                coursewareid: $stateParams.coursewareid
            }, function (data) {
                $rootScope.Videolog = data[0];
                //考题，需要判断是否已学完课程
                if (data && data[0] && data[0].isplaycompletion == "1") {
                    var selectCurrentItem = _.find($rootScope.videoConfig.mainConfig, { "select": true });
                    selectCurrentItem.show = false;
                    selectCurrentItem.select = false;
                    var selectItem = _.find($rootScope.videoConfig.mainConfig, { "elementName": ename });
                    selectItem.show = true;
                    selectItem.select = true;
                }
                else {
                    CommonService.alert("请先学完课程");
                    return;
                }

            }, function (error) {

            });
        }
        else if (ename == "feelLearnsView") {
            //学后感，需要判断是否已学完课程
            getDataSource.getDataSource("getVideolog", {
                studentid: $rootScope.user.studentId,
                coursewareid: $stateParams.coursewareid
            }, function (data) {
                $rootScope.Videolog = data[0];
                //学后感，需要判断是否已学完课程
                if (data && data[0] && data[0].isplaycompletion == "1") {
                    var selectCurrentItem = _.find($rootScope.videoConfig.mainConfig, { "select": true });
                    selectCurrentItem.show = false;
                    selectCurrentItem.select = false;
                    var selectItem = _.find($rootScope.videoConfig.mainConfig, { "elementName": ename });
                    selectItem.show = true;
                    selectItem.select = true;
                    $rootScope.feelLearnEditdisable = true;
                }
                else {
                    var selectCurrentItem = _.find($rootScope.videoConfig.mainConfig, { "select": true });
                    selectCurrentItem.show = false;
                    selectCurrentItem.select = false;
                    var selectItem = _.find($rootScope.videoConfig.mainConfig, { "elementName": ename });
                    selectItem.show = true;
                    selectItem.select = true;
                    $rootScope.feelLearnEditdisable = false;
                }

            }, function (error) {

            });
        
        }
        else {
            var selectCurrentItem = _.find($rootScope.videoConfig.mainConfig, { "select": true });
            selectCurrentItem.show = false;
            selectCurrentItem.select = false;
            var selectItem = _.find($rootScope.videoConfig.mainConfig, { "elementName": ename });
            selectItem.show = true;
            selectItem.select = true;
        }
    }

    //获取课程相关信息
    getDataSource.getDataSource(["videoCourse-coursewareComment",
                        "videoCourse-teachersComment",
                        "get_sy_courseware_information",
                        "geAppraisetFlag",
                        "getAppraiseAvgScorelist",
                        "getGradeByCoursewareid",
                        "updateCoursewareClickrate"],
                    {
                        coursewareid20: $stateParams.coursewareid,
                        coursewareid11: $stateParams.coursewareid,
                        coursewareid12: $stateParams.coursewareid,
                        coursewareid31: $stateParams.coursewareid,
                        accountid: $rootScope.user.accountId,
                        coursewareid32: $stateParams.coursewareid,
                        coursewareid1: $stateParams.coursewareid,
                        id: $stateParams.coursewareid

         }, function (data) {
        if (data && data.length > 0) {
            $scope.coursewareCommentData = _.find(data, { "name": "videoCourse-coursewareComment" }).data[0];
            $document[0].title = $scope.coursewareCommentData ? $scope.coursewareCommentData.csname : "课程播放";
            //老师简介
            $scope.teachersComment = _.find(data, { "name": "videoCourse-teachersComment" }).data;
            //获取评分 // getAppraiset();

            //是否评价状态
            $scope.isappraise = _.find(data, { "name": "geAppraisetFlag" }).data;
            //获取每项平均分
            $scope.avgscorelist = _.find(data, { "name": "getAppraiseAvgScorelist" }).data;
            //获取课程总平均分和总评价人
            $scope.avgTotalscore = _.find(data, { "name": "getGradeByCoursewareid" }).data[0];
            $scope.avgscore = $scope.decRound(_.find(data, { "name": "getGradeByCoursewareid" }).data[0].grade);

            //获取教学资料  //getinformation();
            var information = _.find(data, { "name": "get_sy_courseware_information" }).data;
            if (information.length > 0) {
                var types = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "jpg", "png", "gif", "bmp", "txt"];
                for (var i in information) {
                    if (_.indexOf(types, information[i].type) < 0) {
                        data[i].type = "other";
                    }
                }
            }
            $scope.informationData = information;

        }


    }, function (errortemp) { });



    //获取评分信息
    var getAppraiset = function () {
        getDataSource.getDataSource(['geAppraisetFlag', 'getAppraiseAvgScorelist', 'getGradeByCoursewareid'], {
            coursewareid31: $stateParams.coursewareid,
            accountid: $rootScope.user.accountId,
            coursewareid32: $stateParams.coursewareid,
            coursewareid1: $stateParams.coursewareid
        }, function (data) {
            //是否评价状态
            $scope.isappraise = _.find(data, { "name": "geAppraisetFlag" }).data;
            //获取每项平均分
            $scope.avgscorelist = _.find(data, { "name": "getAppraiseAvgScorelist" }).data;
            //获取课程总平均分和总评价人
            $scope.avgTotalscore = _.find(data, { "name": "getGradeByCoursewareid" }).data[0];
            $scope.avgscore = $scope.decRound(_.find(data, { "name": "getGradeByCoursewareid" }).data[0].grade);
        }, function (error) { });
    }

    

    //默认选择
    if ($stateParams.type) {


        var item = $rootScope.videoConfig.mainConfig[$stateParams.type - 1];
        if (item) {
            var ename = item.elementName;
            $scope.aClick(ename);
        }
        else {
            if ($stateParams.type == 0) {
                //显示评价
                $scope.showAppraise();
            }
        }
        $location.hash("courseware");
        $anchorScroll();
        //document.getElementsByTagName('body')[0].scrollTop = 400;
    }


    //下载文件
    $scope.downFiles = function (id, attachservername, attachname, type) {

        getDataSource.getDataSource("dowdloadFile",
            {
                id: id,
                dimension: "学习度",
                eventname: "下载1次"
            },
            function (data) { },
            function (error) { }
        );
        return FilesService.downFiles(type, attachservername, attachname);
    }


    //打开提问界面
    $scope.showQuestionView = function (size, videoPlay, videoTime) {

        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'question.html',
            controller: 'questionCtrl',
            size: size,
            resolve: {
                videoPlay: function () {
                    return videoPlay;
                },
                videoTime: function () {
                    return videoTime;
                }
            }
        });
    };


    //笔记配置
    $scope.studynoteConfig = {
        studynoteContent: "",
        videoTime: 0,
        studynoteImg1: "",
        studynoteImg2: ""
    };


    //打开笔记界面
    $scope.showStudynoteView = function (size, videoPlay, videoTime) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'studynote.html',
            controller: 'studynoteCtrl',
            size: size,
            resolve: {
                videoPlay: function () {
                    return videoPlay;
                },
                videoTime: function () {
                    return videoTime;
                },
                coursewareCommentData: function () {
                    return $scope.coursewareCommentData;
                },
                studynoteConfig: function () {
                    return $scope.studynoteConfig;
                }
            }
        });
    }


}]);

//提问
app.controller('questionCtrl', ["$rootScope", "$scope", "$modalInstance", "$stateParams", "getDataSource", "CommonService", "videoPlay", "videoTime", function ($rootScope, $scope, $modalInstance, $stateParams, getDataSource, CommonService, videoPlay, videoTime) {

    //提问已输入字符个数
    $scope.currentCount = 0;
    $scope.$watch("questionContent", function (newvalue) {
        if (newvalue)
            $scope.currentCount = newvalue.length;
        else
            $scope.currentCount = 0;

    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        //播放回调
        if (videoPlay)
            videoPlay();
    };


	//保存问题
    $scope.disableSaveQuestion = false;
    $scope.saveQuestion = function () {
    	$scope.disableSaveQuestion = true;
        if (_.trim($scope.questionContent) == "") {
        	CommonService.alert("请先输入问题内容");
        	$scope.disableSaveQuestion = false;
            return;
        }
        var faq_id = getDataSource.getGUID();
        getDataSource.getDataSource("insert_sy_class_faq",
            {
                id: faq_id,
                accountid: $rootScope.user.accountId,
                fid: "",
                content: $scope.questionContent,
                coursewareid: $stateParams.coursewareid,
                usertype: "1",
                studentid: $rootScope.user.studentId,
                videostamp:videoTime,
                dimension: "参与度",
                eventname: "提出1个问题",
                logcontent: "提出1个问题"
            },
            function (data) {
            	
                //隐藏提问框
                $scope.cancel();
                //提问数量+1
                $rootScope.videoConfig.questionCount++;
                //清空输入框
                $scope.questionContent = "";
                CommonService.alert("提问成功");
                $scope.disableSaveQuestion = false;
                //播放回调
                if (videoPlay)
                    videoPlay();
            },
            function () {
            	$scope.disableSaveQuestion = false;
                CommonService.alert("提问失败");
            }
         );
    }

}]);

//笔记
app.controller('studynoteCtrl', ["$rootScope", "$scope", "$modalInstance", "$stateParams", "getDataSource", "DateService", "CommonService", "videoPlay", "videoTime", "coursewareCommentData", "studynoteConfig", function ($rootScope, $scope, $modalInstance, $stateParams, getDataSource, DateService, CommonService, videoPlay, videoTime, coursewareCommentData, studynoteConfig) {

    //转换时间格式
    $scope.secondsToHHmmss = function (seconds) {
        return DateService.secondsToHHmmss(seconds);
    }

    $scope.coursewareCommentData = coursewareCommentData

    //笔记配置
    $scope.studynoteConfig = studynoteConfig;
    $scope.studynoteConfig.videoTime = videoTime;


    //提问已输入字符个数
    $scope.studynote_currentCount = 0;
    $scope.$watch("studynoteConfig.studynoteContent", function (newvalue) {
        if (newvalue)
            $scope.studynote_currentCount = newvalue.length;
        else
            $scope.studynote_currentCount = 0;

    });
    

    //关闭
    $scope.cancel = function () {

        //清空输入框和图片
        $scope.studynoteConfig.studynoteContent = "";
        $scope.studynoteConfig.studynoteImg1 = "";
        $scope.studynoteConfig.studynoteImg2 = "";

        $modalInstance.dismiss('cancel');
        //播放回调
        if (videoPlay)
            videoPlay();
    };


	//保存笔记
    $scope.saveNoteDisabled = false;
    $scope.saveStudynote = function () {
    	$scope.saveNoteDisabled = true;
        if (_.trim($scope.studynoteConfig.studynoteContent) == "") {
        	CommonService.alert("请先输入笔记内容");
        	$scope.saveNoteDisabled = false;
            return;
        }

        var id = getDataSource.getGUID();
        getDataSource.getDataSource("insert_sy_classcourse_note",
            {
                id: id,
                coursewareid: $stateParams.coursewareid,
                teacherpic: $scope.studynoteConfig.studynoteImg1,
                pptpic: $scope.studynoteConfig.studynoteImg2,
                videostamp: $scope.studynoteConfig.videoTime,
                studentid: $rootScope.user.studentId,
                notecontent: $scope.studynoteConfig.studynoteContent,
                dimension: "学习度",
                eventname: "做1次笔记"
            },
            function (data) {
                //隐藏笔记输入框
                $scope.cancel();
                //笔记数量+1
                $rootScope.videoConfig.coursewarenoteCount++;

                //清空输入框和图片
                $scope.studynoteConfig.studynoteContent = "";
                $scope.studynoteConfig.studynoteImg1 = "";
                $scope.studynoteConfig.studynoteImg2 = "";

                //播放回调
                if (videoPlay)
                    videoPlay();
                CommonService.alert("笔记保存成功");
                $scope.saveNoteDisabled = false;
            },
            function () {
            	CommonService.alert("笔记保存失败");
            	$scope.saveNoteDisabled = false;
            }
         );

    }

}]);
