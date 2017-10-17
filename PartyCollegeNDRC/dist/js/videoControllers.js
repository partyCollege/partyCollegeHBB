app.controller("beforevideoController", ["$scope", "$rootScope", "$state", "$location", "$document"
	, "$stateParams", "$modal", "getDataSource", "FilesService", "CommonService", "DateService", "$timeout", "SessionService"
	, function ($scope, $rootScope, $state, $location, $document, $stateParams, $modal, getDataSource, FilesService, CommonService, DateService, $timeout, SessionService) {
		var platformcode = "html";
		var coursewareid = $stateParams.coursewareid;
		SessionService.RenovatSession(platformcode, function (data) {
			$state.go("videoCourse", { coursewareid: coursewareid });
		}, function (error) {

		});
	}]);

app.controller("courseAppraiseController", ["$scope", "$rootScope", "$stateParams", "$modal", "getDataSource", "CommonService", "FilesService", '$http', function ($scope, $rootScope, $stateParams, $modal, getDataSource, CommonService, FilesService, $http) {

    function doWork(data) {

        for (var i = 0; i < data.length; i++) {
            data[i].userphoto = FilesService.showFile("userPhoto", data[0].photo_serverthumbname, data[0].photo_serverthumbname);
        }

        return data;
    }

    //查询条件
    $scope.searchparameter = {
        coursewareid: $stateParams.coursewareid,
        pageIndex: 0,
        pageSize: 5,
        isMore: false
    };

    $scope.search = function () {

        $scope.searchparameter.isMore = false;
        getDataSource.getUrlData("../api/getallcoursecomments", $scope.searchparameter, function (data) {
            if (data.result) {
                $scope.datalist = _.union($scope.datalist, doWork(data.list));;
                $scope.allcount = data.allcount;

                if ($scope.datalist.length < $scope.allcount && data.list.length > 0)
                    $scope.searchparameter.isMore = true;
            }
        }, function (errortemp) { });

    }

    $scope.more = function () {
        $scope.searchparameter.pageIndex++;
        $scope.search();
    }

    $scope.allcount = 0;
     
    $scope.more();

}]);
app.controller("coursewareCommentController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "CommonService", function ($scope, $rootScope, $stateParams, getDataSource, CommonService) {
    //getDataSource.getDataSource("videoCourse-coursewareComment", {
    //        coursewareid: $stateParams.coursewareid,
    //        classid:$rootScope.user.classId
    //    }, function (data) {
    //        $rootScope.coursewareCommentData = data[0];
    //    }, function (errortemp) { });
}]);
app.controller("coursewarenoteController", ["$scope", "$rootScope", "$stateParams", "$modal", "getDataSource", "CommonService", "FilesService", '$http', function ($scope, $rootScope, $stateParams, $modal, getDataSource, CommonService, FilesService, $http) {

    getDataSource.writeLog("页面访问-笔记", "20034");

    $scope.currentPageIndex = 1;
    $scope.currentPageSize = 5;
    //笔记信息
    $scope.coursewareNotes = [];
    //更多按钮是否显示
    $scope.moreShow = false;


    //获取图片全路径
    $scope.getImg = function (photoserverfilename, photofilename, type) {
        return FilesService.showFile(type, photoserverfilename, photofilename);

    }

    //回放
    $scope.stutynotePlay = function (notetime) {
        window.stutynotePlay(notetime);
    }

    //加载更多我的问题
    $scope.loadMore = function () {
        getCoursewarenotes("more");
    }

    var getCoursewarenotes = function (type) {
        getDataSource.getDataSource("getCoursewarenotes",
            {
                coursewareid: $stateParams.coursewareid,
                studentid: $rootScope.user.studentId,
                pageindex: ($scope.currentPageIndex - 1) * $scope.currentPageSize,
                pagesize: $scope.currentPageSize
            },
            function (data) {
                if (data && data.length > 0) {
                    $scope.coursewareNotes = _.union($scope.coursewareNotes, data);
                    $scope.currentPageIndex++;
                    if (data.length >= $scope.currentPageSize)
                        $scope.moreShow = true;
                    else
                        $scope.moreShow = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.moreShow = false;
                        CommonService.alert("没有更多数据了");
                    }
            },
            function (error) { }
        );
    }
    getCoursewarenotes();
    $scope.output = function () {
        window.open("../api/exportNote/" + $stateParams.coursewareid + "/" + $rootScope.user.studentId + "/" + $stateParams.classcourseid);
    }



    //监控提问数量
    $scope.$watch("videoConfig.coursewarenoteCount", function (newvalue, oldvalue) {
        if (newvalue > oldvalue) {
            $scope.coursewareNotes = [];
            $scope.currentPageIndex = 1;
            getCoursewarenotes();
        }

    });

    //删除笔记
    $scope.deletenote = function (id) {
        if (confirm("确定要删除吗")) {
            getDataSource.getDataSource("delete_sy_classcourse_note",
                {
                    id: id
                },
                function (data) {
                    $scope.coursewareNotes = [];
                    $scope.currentPageIndex = 1;
                    getCoursewarenotes();
                    CommonService.alert("删除成功");
                },
                function (error) {
                    CommonService.alert("删除失败");
                }
            );
        }
    }
}]);
angular.module("myApp")
.controller("course_questionnaireController", ["$scope", "$rootScope", "$anchorScroll", "$location", "$document", "$stateParams", "$modal", "getDataSource", "FilesService", "CommonService", "DateService", function ($scope, $rootScope, $anchorScroll, $location, $document, $stateParams, $modal, getDataSource, FilesService, CommonService, DateService) {
    $scope.quests = [];

    getDataSource.writeLog("页面访问-问卷调查", "20031");

    getDataSource.getDataSource("select_sy_questionnaire_byCoursewareid", { accountid: $rootScope.user.accountId, coursewareid: $stateParams.coursewareid }, function (data) {
        $scope.quests = data;

    });
    $scope.save = function (q) {
        var array = [];
        angular.forEach(q.questionnaires, function (quest) {
            var obj = {
                id: getDataSource.getGUID(),
                questionnaireid: q.id,
                accountid: $rootScope.user.accountId,
                studentid: $rootScope.user.studentId,
                questionnaire_detailid: quest.id,
                answer: ""
            };
            var checkBoxVal = "";
            if (quest.category == 0 || quest.category == 2) {
                obj.answer = quest.checked;
            }
            else if (quest.category == 1) {
                angular.forEach(quest.answers, function (data) {
                    if (data.checked == true) {
                        checkBoxVal += data.id + ",";
                    }
                });
                if (checkBoxVal.length > 0) {
                    checkBoxVal = checkBoxVal.substring(0, checkBoxVal.length - 1);
                }
                obj.answer = checkBoxVal;
            }
            array.push(obj);
        });
        getDataSource.getDataSource("insert_sy_questionnaire_reply", {
            id: getDataSource.getGUID(),
            questionnaireid: q.id,
            studentid: $rootScope.user.studentId,
            accountid: $rootScope.user.accountId
        }, function () {
            getDataSource.doArray("insert_sy_questionnaire_answer", array, function (item) {
                CommonService.alert("保存成功");
                q.isanswer = 1;
            });
        });


        //积分
        getDataSource.getDataSource("sibmitQuestionnaireByVideoCourse",
          {
              dimension: "参与度",
              eventname: "调查问卷提交1份"
          },
          function (data) {

          },
          function (error) {
          });
    }
    $scope.initOneQuest = function (status, quest) {
        if (quest.isanswer > 0)
        {
            status.open = false;
        }
        if (status) {
            if (status.open) {
                if (quest.questionnaires) { return; }
                getDataSource.getDataSource(["selectquestionnaireById", "selectquestionnaire_detailById", "select_sy_questionnaire_detail_subjectById"]
                    , { id: quest.id }, function (data) {
                        quest.questionnaires = _.find(data, function (item) {
                            return item.name == "selectquestionnaire_detailById";
                        }).data;
                        var answers = _.find(data, function (item) {
                            return item.name == "select_sy_questionnaire_detail_subjectById";
                        }).data;
                        angular.forEach(quest.questionnaires, function (item) {
                            item.answers = [];
                            angular.forEach(answers, function (c) {
                                if (c.fid == item.id) {
                                    item.answers.push(c);
                                }
                            });
                        })
                    });
            }
        }
    }
}]);
app.controller("examinationController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "DateService", "CommonService", "StudyService", function ($scope, $rootScope, $stateParams, getDataSource, DateService, CommonService, StudyService) {
    $scope.examShow = true; //考题是否显示
    $scope.passStatus = 0;//考题是否通过  1：未通过  2：已通过  0：未考试

    $scope.passStyle = { display: "none" };
    $scope.nopassStyle = { display: "none" };

    $scope.submitShow = true; //提交显示

    $scope.itemNoList = ["A", "B", "C", "D", "E", "F"]; 


    getDataSource.writeLog("页面访问-考试", "20035");

    getDataSource.getDataSource("getExamnum",
        {
            classcourseid: $stateParams.classcourseid
        },
        function (data) {
            //考试限制次数
            $scope.sumexamcount = data[0] ? (data[0].examnum ? data[0].examnum : 0) : 0;

            getDataSource.getDataSource("getExamStatusByStudent",
                {
                    classid: $rootScope.user.classId,
                    coursewareid: $stateParams.coursewareid,
                    studentid: $rootScope.user.studentId
                },
                function (data) {
                    if (data && data.length > 0) {
                        var passItem = _.find(data, { "status": 1 });
                        if (passItem && passItem.status > 0) {
                            //考试通过，考题不显示
                            $scope.examShow = false;
                            $scope.passStyle = { display: "block" };
                            $scope.nopassStyle = { display: "none" };
                        }
                        else {
                            //未考试，获取试题信息
                            var passItem = _.find(data, { "status": 0 });
                            //已考试次数
                            $scope.examcount = passItem ? passItem.examcount : 0;
                            //未限制考试次数获取考试次数还未达到
                            if ($scope.sumexamcount == 0 || $scope.examcount < $scope.sumexamcount) {
                                //考题显示
                                $scope.examShow = true;
                                getExamlist();
                            }
                            else {
                                //考试已达到次数，考题不显示
                                $scope.examShow = false;
                                $scope.passStyle = { display: "none" };
                                $scope.nopassStyle = { display: "block" };
                            }
                        }
                    }
                    else {
                        //考试显示
                        $scope.examShow = true;
                        //已考试次数
                        $scope.examcount = 0;
                        getExamlist();
                    }
                },
                function (error) { }
            );
        },
        function (error) { }
    );




    //重置考题
    $scope.retakeExam = function () {
        getDataSource.getDataSource("getStudentLastExamTime",
            {
                coursewareid: $stateParams.coursewareid,
                classid: $rootScope.user.classId,
                studentid: $rootScope.user.studentId
            },
            function (data) {
                if (data.length > 0 && parseInt(data[0].timediff) < 1) {
                    CommonService.alert("您考试过于频繁，请休息一分钟后再考试");
                }
                else {
                    getExamlist();
                }
            },
            function (error) { }
        );
    }

    //获取考题
    var getExamlist = function () {
        getDataSource.getDataSource(["getExaminations", "getExaminationAnswers"],
       {
           coursewareid: $stateParams.coursewareid,
           coursewareid1: $stateParams.coursewareid
       },
       function (data) {
           if (data && data.length > 0) {
               var examlist = _.find(data, { "name": "getExaminations" }).data;
               var answerList = _.find(data, { "name": "getExaminationAnswers" }).data;

               for (var n = 0; n < examlist.length; n++)
               {
                   _.merge(examlist[n], {
                       'answerList': answerList.filter(function (a) { return a.examid == examlist[n].id })
                   });
               }

               $scope.examList = examlist;
               $scope.submitShow = true; //提交显示，重考不显示
           }
       },
       function (error) { });
    }



    //提交考题
    $scope.submitExam = function () {

        getDataSource.getDataSource("getStudentLastExamTime",
            {
                coursewareid: $stateParams.coursewareid,
                classid: $rootScope.user.classId,
                studentid: $rootScope.user.studentId
            },
            function (data) {
                if (data.length > 0 && parseInt(data[0].timediff) < 1) {
                    CommonService.alert("您考试过于频繁，请休息一分钟后再考试");
                }
                else {
                    submit();
                }
            },
            function (error) { }
        );
    }

    //提交
    var submit = function () {
        var vailSelect = true; //是否每项都已选择答案
        var errorCount = 0;

        for (var i = 0; i < $scope.examList.length; i++)
        {
            var item = $scope.examList[i];
            if (item.examcategory == 1) {
                //选中的项(多选)
                var selectItem = _.filter(item.answerList, function (n) {
                    return n.isselect == 1;
                });
                if (selectItem.length <= 0) {
                    CommonService.alert("请选择题目" + (parseInt(i) + 1).toString() + "的答案");
                    vailSelect = false;
                    return;
                }
                else {
                    //正确答案
                    var rightItem = _.filter(item.answerList, function (n) {
                        return n.isright == 1;
                    });

                    if (rightItem.length == selectItem.length) {

                        for (var a = 0; a < rightItem.length; a++)
                        {
                            var answerid = rightItem[a].answerid;
                            if (_.find(selectItem, { answerid: answerid }) == undefined) {
                                errorCount++;
                            }
                        }
                    }
                    else {
                        errorCount++;
                    }
                }
            }
            else {
                if (_.trim(item.selectid) == "") {
                    CommonService.alert("请选择题目" + (parseInt(i) + 1).toString() + "的答案");
                    vailSelect = false;
                    return;
                }
                else {
                    //正确答案
                    var rightItem = _.find(item.answerList, { "isright": 1 });
                    if (rightItem) {
                        if (rightItem.answerid != item.selectid)
                            errorCount++;
                    }
                    else
                        errorCount++;
                }

            }
        }
        if (vailSelect) {
            if (errorCount == 0) {
                //getDataSource.getDataSource("insert_sy_student_exam",

                var par = {
                    examModel: {
                        coursewareid: $stateParams.coursewareid,
                        classid: $rootScope.user.classId,
                        studentid: $rootScope.user.studentId,
                        status: 1
                    },
                    queryModel :{
                        classcourseid: $stateParams.classcourseid,
                        coursewareid: $stateParams.coursewareid,
                        studentid: $rootScope.user.studentId,
                        classid: $rootScope.user.classId,
                        accountid: $rootScope.user.accountId,
                        type: "2", 
                        category:$scope.coursewareCommentData.category
                    }
                };
                getDataSource.getUrlData("../api/InsertStudenExam", par,
                    function (flag) {
                        if (flag == "true") {
                            $scope.passStyle = { display: "block" };
                            $scope.nopassStyle = { display: "none" };
                            $scope.passStatus = 2;  //通过考试
                            $scope.examShow = false; //考试不显示
                            $scope.examcount++; // 考试次数+1
                            CommonService.alert("考试通过");
                        }
                        else {
                            CommonService.alert("提交失败");
                        }
                    },
                    function (error) { }
                );
            }
            else {
                getDataSource.getDataSource("insert_sy_student_exam",
                    {
                        coursewareid: $stateParams.coursewareid,
                        classid: $rootScope.user.classId,
                        studentid: $rootScope.user.studentId,
                        status: 0
                    },
                    function (data) {
                        CommonService.alert("考试不通过");
                        if ($scope.sumexamcount == 0 || ($scope.examcount + 1) < $scope.sumexamcount) {
                            //未超过考试次数
                            $scope.examcount++; // 考试次数+1
                            //重新加载
                            $scope.submitShow = false; //提交不显示，重考显示
                        }
                        else {
                            //通过未考试
                            $scope.passStyle = { display: "none" };
                            $scope.nopassStyle = { display: "block" };
                            $scope.examShow = false; //考题不显示
                        }
                    },
                    function (error) { }
                );
            }
        }
        else {
            CommonService.alert("请选择所有题目答案后在交卷");
        }
    }
}]);
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


//app.controller("myQuestionController", ["$scope", "$rootScope", "getDataSource", "$stateParams", "CommonService", function ($scope, $rootScope, getDataSource, $stateParams, CommonService) {

//}]);
app.controller("pptplayController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService", "GetFileService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService, GetFileService) {
		$scope.pageindex = 1;
		$scope.enableGoUppage = false;
		$scope.enableGoDownpage = false;

		$scope.currentPlayID = getDataSource.getGUID();

		var keyArray = new Array();
		keyArray.push("selectStudentPlayDetailCount");
		keyArray.push("selectStudentPlayTime");
		keyArray.push("getStudytimeByCoursewareId");

		getDataSource.getDataSource(keyArray
			, { coursewareid: $stateParams.coursewareid, studentid: $rootScope.user.studentId, currentID: $scope.currentPlayID, courseid: $stateParams.coursewareid }
			, function (data) {
				//console.log("data", data);
				var stuPlayTime = _.find(data, { name: "selectStudentPlayTime" }).data;
				var stuPlayDetailCount = _.find(data, { name: "selectStudentPlayDetailCount" }).data;
				var courwareStudytime = _.find(data, { name: "getStudytimeByCoursewareId" }).data;

				$scope.stuPlayDetailCount = stuPlayDetailCount[0].dtlcount;
				$scope.studytime = 0;
				if (stuPlayTime[0]) {
					$scope.lastPlayTime = stuPlayTime[0].timespan;
					$scope.studytime = stuPlayTime[0].studytime;
					$scope.pageindex = $scope.studytime;
					if ($scope.pageindex == 0) $scope.pageindex = 1;
					$scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
				}
				if (courwareStudytime[0]) {
					$scope.courwarestudytime = courwareStudytime[0].studytime;
				}
				getDataSource.getDataSource("selectCoursewareById", { id: $stateParams.coursewareid }, function (data) {
					$scope.course = data[0];
					$scope.nowVideoDuration = $scope.course.realduration;
					$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
					$scope.enableGoUppage = false;
					$scope.enableGoDownpage = false;
					$scope.goDownpageText = "下一页";

					//获取sy_video_log主键
					getDataSource.getUrlData("../api/getVideoLogPKey",
						{ studentid: $rootScope.user.studentId, coursewareid: $stateParams.coursewareid }
						, function (data) {
							if (data.code) {
								var pkey = data.pkey;
								if (pkey.length > 0) {
									$scope.isGetPKey = true;
									$scope.pkey = pkey;
									if (!$scope.$$phase) {
										$scope.$apply();
									}
								}
							}
						}, function (error) {
							alert(errorMessage);
						});
				});
		}, function (error) {
			alert(errorMessage);
		});

		$scope.gouppage = function () {
			$scope.pageindex--;
			if ($scope.pageindex < 1) {
				$scope.pageindex = 1;
				$scope.enableGoUppage = true;
				$scope.enableGoDownpage = false;
			}
			$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
		}

		var waiteSenconds=5;
		var intervalFunc = function () {
			$scope.$apply(function () {
				$scope.goDownpageText = "等待" + waiteSenconds-- + "s";
			});
			if (waiteSenconds < 0) {
				clearInterval(intervalObj);
				waiteSenconds = 5;
				$scope.$apply(function () {
					$scope.enableGoDownpage = false;
					$scope.goDownpageText = "下一页";
				});
			} else {
				$scope.enableGoUppage = true;
			}
		};
		var intervalObj = {};
		

		$scope.godownpage = function () {

			if ($scope.enableGoDownpage) {
				return;
			}
			$scope.pageindex++;
			if ($scope.pageindex >= parseInt($scope.course.realduration)) {
				$scope.pageindex = parseInt($scope.course.realduration);
				$scope.enableGoDownpage = true;
			} else {
				$scope.enableGoDownpage = false;
			}

			//第一次未学习完成，则点击下一页，需要等待5s
			//如果没有看完需要限制拖动
			if ($scope.isplaycompletion != 1) {
				if (!$scope.enableGoDownpage) {
					$scope.enableGoDownpage = true;
					clearInterval(intervalObj);
					intervalObj = setInterval(intervalFunc, 1000);
				}
			}

			$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
			O_func();
		}

		$scope.pptimgfileobj = {};

		$scope.loadPPTCoursewareImg = function (pageindex, pptcoursefile_servername) {
			getDataSource.getUrlData("../api/getPPTVideoCourse", { pageindex: pageindex, pptcoursefile_servername: pptcoursefile_servername }, function (data) {
				$scope.pptimgfileobj = data;
			}, function (error) {

			});
		}

		//提交数据
		var O_func = function () {
			var postData = {
				pkey: $scope.pkey,
				studentid: $rootScope.user.studentId,
				time: $scope.pageindex,
				currentID: $scope.currentPlayID,
				timestamp: $scope.pageindex,
				videoDuration: $scope.nowVideoDuration,
				coursewareid: $stateParams.coursewareid,
				videotype: $scope.course.videotype,
				accountid: $rootScope.user.accountId,
				studytime: $scope.studytime,
				studetailcount: $scope.stuPlayDetailCount,
				courwarestudytime: $scope.courwarestudytime,
				coursewarename: $scope.course.name
			};
			//console.log("postData", postData);
			//return;
			if ($scope.pkey && $scope.pkey.length > 0) {
				$http.post("../api/videoPlay", postData).success(function (data) {
					if (data && !data.code) {
						//videoError(errorMessage);
					}
					$scope.studytime = $scope.pageindex;
					$scope.stuPlayDetailCount = 1;
				}).error(function (ex, status) {
				});
			}
		}
	}]);
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
//app.controller("questionsController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "DateService", "CommonService", function ($scope, $rootScope, $stateParams, getDataSource, DateService, CommonService) {

//}]);
app.controller("testvideoController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService) {
		var player1 = {};
		var player2 = {};

		var getVideoInfo = function (data) {
			$scope.nowVideoDuration = data.data[0].duration;
		}
		window.getVideoInfo = getVideoInfo;

		var player1Obj = {};
		var player2Obj = {};

		player1Obj = {
			'width': '100%',
			'height': '100%',
			'vid': '873c41fa7561027fb25cf2c6797f5252_8',
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
		player2Obj = {
			'width': '100%',
			'height': '100%',
			'vid': '873c41fa7561027fb25cf2c6797f5252_8',
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
		player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
		player2 = polyvObject('#mainVideo').videoPlayer(player2Obj);



		s2j_onVideoPlay = function () {
			player1.j2s_resumeVideo();
			//if ($scope.course.videotype > 0) {
			//	player2.j2s_resumeVideo();
			//}
			//clearInterval(obj);
			obj = setInterval(O_func, 6000);
		}

		var O_func = function () {

			var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间;
			//console.log("视屏播放时间" + sec1);
			//console.log("视屏播放时间" + new Date());
			//记录播放

			//校友观看视频是 studentid为null,calssid 为空。
			$http.post("../api/videoPlay", {
				studentid: $rootScope.user.studentId,
				time: sec1, classcourseid: $stateParams.classcourseid,
				currentID: $scope.currentPlayID,
				timestamp: player1.j2s_realPlayVideoTime(),
				videoDuration: $scope.nowVideoDuration,
				coursewareid: $stateParams.coursewareid,
				accountid: $rootScope.user.accountId,
				usertype: $rootScope.user.userType
			}, function () {

			});

			//console.log("time=" + sec1);
			//console.log("timestamp=" + player1.j2s_realPlayVideoTime());
			//console.log("videoDuration=" + $scope.nowVideoDuration);

			if ($scope.course.videotype > 0) {
				var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
				if (sec1 != sec2) {
					player2.j2s_seekVideo(sec1);
				}
			}

		}
	}]);
app.controller("videoController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService) {
	    var obj = {};
	    $scope.course = {};
	    $scope.lastPlayTime = 0;
	    $scope.courwarestudytime = 0;//课程学时
	    var player1 = {};
	    var player2 = {};

	    var errorMessage = "系统检测到当前网络异常，请刷新页面重试。";

	    var moethodError = function (message, stack, method, filename, errorline, arguments) {
	        try {
	            var postdata = {
	                filename: filename,
	                methodname: method,
	                errorline: errorline,
	                message: message,
	                msginfo: stack,
	                arguments: arguments
	            };

	            $http.post("../api/WriteException", postdata).success(function (data) { });
	        }
	        catch (ex) { }
	    }

	    $scope.currentPlayID = getDataSource.getGUID();

	    $scope.load = function () {
	        $timeout(function () {
	            $scope.open = s2j_onChapterBtnClick;
	            $scope.open = function () {
	            };
	            $scope.open = s2j_onChapterBtnClick;
	        }, 0)
	    }();
	    //加载聊天 

	    //$timeout(function () {
	    //	$(function () {
	    //		$("#emotion").SinaEmotion($("#message"));
	    //		var chat = {};
	    //		$.getScript($rootScope.appConfig.signalRHub)
	    //		.done(function (script, textStatus) {
	    //			$.connection.hub.url = $rootScope.appConfig.signalRHub;
	    //			chat = $.connection.chatHub;
	    //			 //接受信息
	    //			chat.client.broadcastMessage = function (data) {
	    //				// Html encode display name and message.
	    //				var encodedName = $('<div />').text(data.name).html();
	    //				//// Add the message to the page.
	    //				$('#chartDiv').append('<li><strong>' + encodedName
	    //					+ ':</strong>' + "<div>" + AnalyticEmotion(data.message) + "</div>" + "<span class='time'>" + data.dateTime + '</span></li>');

	    //			};
	    //			chat.client.repeatLogin = function () {
	    //			    player1.j2s_pauseVideo();
	    //			    if ($scope.course.videotype > 0) {
	    //			        if (player2 != undefined && player2.j2s_pauseVideo != undefined) {
	    //			            player2.j2s_pauseVideo();
	    //			        }
	    //			    }
	    //				var j = window.confirm("您已重复登录")
	    //				if (j || !j) {
	    //					window.close();
	    //				}
	    //			}
	    //			$.connection.hub.start(function () {

	    //				chat.server.addConnection($rootScope.user.accountId);
	    //				//加入聊天室，同一门课程一个聊天室
	    //				chat.server.joinRoom($stateParams.coursewareid);
	    //				//发送信息
	    //				$('#sendmessage').click(function () {
	    //					// Call the Send method on the hub.
	    //					chat.server.send($rootScope.user.name, $('#message').val(), $stateParams.coursewareid);
	    //					// Clear text box and reset focus for next comment.
	    //					$('#message').val('').focus();
	    //				});
	    //			}, function (data) {
	    //				alert(errorMessage);
	    //			});
	    //		});

	    //	});
	    //}, 0);

	    var player1Obj = {};
	    var player2Obj = {};

	    $scope.isGetPKey = false;
	    $scope.pkey = "";

	    $scope.loadVideo = function () {
	        try {

	            var keyArray = new Array();
	            keyArray.push("selectStudentPlayDetailCount");
	            keyArray.push("selectStudentPlayTime");
	            keyArray.push("getStudytimeByCoursewareId");

	            getDataSource.getDataSource(keyArray
                    , { coursewareid: $stateParams.coursewareid, studentid: $rootScope.user.studentId, currentID: $scope.currentPlayID, courseid: $stateParams.coursewareid }
                    , function (data) {
                        //console.log("data", data);
                        var stuPlayTime = _.find(data, { name: "selectStudentPlayTime" }).data;
                        var stuPlayDetailCount = _.find(data, { name: "selectStudentPlayDetailCount" }).data;
                        var courwareStudytime = _.find(data, { name: "getStudytimeByCoursewareId" }).data;

                        $scope.stuPlayDetailCount = stuPlayDetailCount[0].dtlcount;
                        $scope.studytime = 0;
                        if (stuPlayTime[0]) {
                            $scope.lastPlayTime = stuPlayTime[0].timespan;
                            $scope.studytime = stuPlayTime[0].studytime;
                            $scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
                        }
                        if (courwareStudytime[0]) {
                            $scope.courwarestudytime = courwareStudytime[0].studytime;
                        }


                        getDataSource.getDataSource("selectCoursewareById", { id: $stateParams.coursewareid }, function (data) {
                            $scope.course = data[0];
                            $scope.nowVideoDuration = $scope.course.realduration;

                            //获取sy_video_log主键
                            getDataSource.getUrlData("../api/getVideoLogPKey",
                                { studentid: $rootScope.user.studentId, coursewareid: $stateParams.coursewareid, courwarestudytime: $scope.courwarestudytime }
                                , function (data) {
                                    //console.log("data", data);
                                    if (data.code) {
                                        var pkey = data.pkey;
                                        if (pkey.length > 0) {
                                            $scope.isGetPKey = true;
                                            $scope.pkey = pkey;
                                            if (!$scope.$$phase) {
                                                $scope.$apply();
                                            }
                                        }
                                    } else {
                                        //console.log("message", data.message);
                                    }
                                }, function (error) {
                                    alert(errorMessage);
                                });

                            player1Obj = {
                                'width': '100%',
                                'height': '100%',
                                'vid': $scope.course.teachervideo,
                                'flashvars': {
                                    "autoplay": "false",
                                    "teaser_time": "0",
                                    "setScreen": "16_9",
                                    "ban_history_time": "on",
                                    "history_video_duration": "10",
                                    "setVolumeM": "1",
                                    "ban_ui": "off",
                                    "ban_control": "off",
                                    "is_auto_replay": "off",
                                    "ban_skin_progress_dottween": "on"
                                }
                            };
                            //如果没有看完需要限制拖动
                            if ($scope.isplaycompletion != 1) {
                                player1Obj.flashvars.watchStartTime = $scope.studytime;
                                player1Obj.flashvars.ban_seek_by_limit_time = "on";
                            }
                            player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
                            //单视频样式调整
                            if ($scope.course.videotype == 0) {
                                $(".video-box.video-f").attr("class", "video-box video-f video_only");
                                $(".video-box.video-s").css("display", "none");
                                $(".exchange").css("display", "none");
                            }
                            if ($scope.course.videotype > 0) {
                                player2Obj = {
                                    'width': '100%',
                                    'height': '100%',
                                    'vid': $scope.course.pptvideo,
                                    'flashvars': {
                                        "autoplay": "false",
                                        "teaser_time": "0",
                                        "ban_history_time": "on",
                                        "history_video_duration": "10",
                                        "setVolumeM": "0",
                                        "ban_ui": "off",
                                        "ban_control": "off",
                                        "is_auto_replay": "off",
                                        "ban_skin_progress_dottween": "on"
                                    }
                                }
                                //如果没有看完需要限制拖动
                                if ($scope.isplaycompletion != 1) {
                                    player2Obj.flashvars.watchStartTime = $scope.studytime;
                                    player2Obj.flashvars.ban_seek_by_limit_time = "on";
                                }
                                player2 = polyvObject('#smallVideo').videoPlayer(player2Obj);
                            }
                        }, function (error) {
                            alert(errorMessage);
                        });
                    }, function (error) {
                        alert(errorMessage);
                    });
                }
	        catch (ex) {
	            alert(errorMessage);
	            moethodError(ex.message + "【错误码：001】", ex.stack, "loadVideo", "", 0);
	        }
	    }();

	    s2j_onChapterBtnClick = function () {
	    };

	    //视频初始化
	    s2j_onPlayerInitOver = function (vid) {

	        //日志参数
	        var par = {
	            studentid: $rootScope.user.studentId,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId
	        };

	        if (player1 != undefined && player1.j2s_rightpanelBtnSet != undefined) {
	            player1.j2s_rightpanelBtnSet();
	            if ($scope.course.videotype > 0) {
	                if (player2 != undefined && player2.j2s_rightpanelBtnSet != undefined && player2.j2s_banUI != undefined && player2.j2s_hideRightPanel != undefined) {
	                    player2.j2s_rightpanelBtnSet();
	                    player2.j2s_banUI();
	                    player2.j2s_hideRightPanel();
	                }
	            }

	            var mess = "";
	            if (player1 == undefined) { mess += " player1 is undefined, "; }
	            if (player1.j2s_getCurrentTime == undefined) {
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            }
	            if (player1.j2s_realPlayVideoTime == undefined) {
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            }

	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. " + mess, "s2j_onPlayerInitOver", "", 0, par);
	        }
	        else {
	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. player1 is undefined && player1.j2s_rightpanelBtnSet is undefined", "s2j_onPlayerInitOver", "", 0, par);
	        }
	    }

	    //播放结束
	    s2j_onPlayOver = function (vid) {
	        //看主视频才调用此方法。
	    	if ($scope.course.teachervideo == vid) {
	    		//视频播放完成触发，再一次提交数据。
	    		O_func();
	            clearInterval(obj);

	            //日志参数
	            var par = {
	                studentid: $rootScope.user.studentId,
	                coursewareid: $stateParams.coursewareid,
	                accountid: $rootScope.user.accountId
	            };

	            var mess = "";
	            if (player1 == undefined) {
	                mess += " player1 is undefined, ";
	            }
	            if (player1.j2s_getCurrentTime == undefined) {
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            } else {
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            }
	            if (player1.j2s_realPlayVideoTime == undefined) {
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            }
	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed." + mess, "s2j_onPlayOver", "", 0, par);
	        }
	    }

	    s2j_onPlayerError = function (type, vid) {
	        clearInterval(obj);
	        //日志参数
	        var par = {
	            studentid: $rootScope.user.studentId,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId,
	            type: type
	        };

	        var mess = "";
	        if (player1 == undefined) { mess += " player1 is undefined, "; }
	        if (player1.j2s_getCurrentTime == undefined){
	            mess += " player1.j2s_getCurrentTime is undefined, ";
	        } else{
	        	mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	        }
	        if (player1.j2s_realPlayVideoTime == undefined){
	            mess += " player1 j2s_realPlayVideoTime is undefined, ";
	        } else{
	            mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	        }
	        moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed." + mess, "s2j_onPlayerError", "", 0, par);
	    }

	    // 点击章节按钮
	    s2j_onChapterBtnClick = function () {
	        //目前暂没有章节
	        CommonService.alert("章节功能暂未开放");
	        return;

	        if (player1 != undefined && player1.j2s_pauseVideo != undefined) {
	            player1.j2s_pauseVideo();
	        }
	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined && player2.j2s_pauseVideo != undefined) {
	                player2.j2s_pauseVideo();
	            }
	        }
	    }

	    // 点击笔记按钮
	    s2j_onNoteBtnClick = function () {
	        //暂停
	        s2j_onVideoPause();
	        if (player1 != undefined && player1.j2s_screenShot != undefined) {
	            //截图
	            player1.j2s_screenShot();
	        }
	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined && player2.j2s_screenShot != undefined) {
	                player2.j2s_screenShot();
	            }
	        }
	    }

	    //定位播放
	    window.stutynotePlay = function (notetime) {
	        if (player1 != undefined) {
	            player1.j2s_seekVideo(notetime);
	        }

	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined) {
	                player2.j2s_seekVideo(notetime);
	            }
	        }
	    }

	    //笔记截图
	    window.s2j_onScreenShotComplete = function (data) {
	        var ImgData = JSON.parse(data);
	        if (ImgData.vid == $scope.course.teachervideo) {
	            $scope.studynoteConfig.studynoteImg1 = ImgData.url;
	            if ($scope.course.videotype <= 0) {
	                if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	                    //视频1播放时间
	                    var sec1 = player1.j2s_getCurrentTime();
	                    //打开笔记界面
	                    $scope.showStudynoteView("lg", s2j_onVideoPlay, sec1);
	                }
	            }
	        }
	        else if (ImgData.vid == $scope.course.pptvideo) {
	            $scope.studynoteConfig.studynoteImg2 = ImgData.url;
	            if ($scope.course.videotype > 0) {
	                if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	                    //视频1播放时间
	                    var sec1 = player1.j2s_getCurrentTime();
	                    //打开笔记界面
	                    $scope.showStudynoteView("lg", s2j_onVideoPlay, sec1);
	                }
	            }
	        }
	    }

	    // 点击提问按钮
	    s2j_onQuestionBtnClick = function () {
	        //暂停
	        s2j_onVideoPause();
	        //视频1播放时间
	        if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	            var sec1 = player1.j2s_getCurrentTime();
	            $scope.showQuestionView("lg", s2j_onVideoPlay, sec1);
	        }
	    }



	    // 点击交流按钮
	    s2j_onCommunicationBtnClick = function () {
	        if ($(".courseFile .chat_box").hasClass("show")) {
	            $(".courseFile .chat_box").removeClass("show");
	        } else {
	            $(".courseFile .chat_box").addClass("show");
	        }
	    }

		//视频播放
	    s2j_onVideoPlay = function (vid) {
	    	//看主视频才调用此方法。
	    	if (player1 != undefined && player1.j2s_resumeVideo != undefined) {
	    		player1.j2s_resumeVideo();
	    		if ($scope.course.videotype > 0) {
	    			if (player2 != undefined && player2.j2s_resumeVideo != undefined) {
	    				player2.j2s_resumeVideo();
	    			}
	    		}
	    		if ($scope.course.teachervideo == vid) {
	    			clearInterval(obj);
	    			//视频一播放就提交一次，解决定时器时间不够的问题
	    			O_func();
	    			obj = setInterval(O_func, 60000);
	    		}

	    		if (player1 != undefined && player1.j2s_rightpanelBtnSet != undefined) {
	    		    player1.j2s_rightpanelBtnSet(_chapterString = "off", _noteString = "on", _questionString = "on", _communicationString = "off");
	    		    if ($scope.course.videotype > 0) {

	    		        if (player2 != undefined && player2.j2s_rightpanelBtnSet != undefined) {
	    		            player2.j2s_rightpanelBtnSet(_chapterString = "off", _noteString = "on", _questionString = "on", _communicationString = "off");
	    		        }
	    		    }
	    		}
	    	}

	    }

	    var O_func = function () {
	        var postData = {
	            pkey: $scope.pkey,
	            studentid: $rootScope.user.studentId,
	            time: 0,
	            currentID: $scope.currentPlayID,
	            timestamp: 0,
	            videoDuration: $scope.nowVideoDuration,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId,
	            studytime: $scope.studytime,
	            studetailcount: $scope.stuPlayDetailCount,
	            courwarestudytime: $scope.courwarestudytime,
	            coursewarename: $scope.course.name
	        };

	        if (player1 != undefined && player1.j2s_getCurrentTime != undefined && player1.j2s_realPlayVideoTime != undefined) {
	            var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间;
	            //console.log("视屏播放时间" + new Date());
	            //记录播放
	            //校友观看视频是 studentid为null,calssid 为空。
	            if ($scope.studytime <= 0) {
	                $scope.studytime = $scope.studytime + 60;
	            }
	            //console.log("postData", postData);
	            postData.time = sec1;
	            postData.timestamp = player1.j2s_realPlayVideoTime();

	            try {

	                if ($scope.pkey && $scope.pkey.length > 0) {
	                    $http.post("../api/videoPlay", postData).success(function (data) {
	                        //console.log("videoPlay", data);
	                        if (data && !data.code) {
	                            moethodError("播放参数错误【错误码：002】", data.message, "O_func", "", 0, postData);
	                            videoError(errorMessage);
	                        }
	                        //console.log("sec1", sec1);
	                        if (sec1) {
	                            $scope.studytime = sec1;
	                        }
	                        $scope.stuPlayDetailCount = 1;
	                        //console.log("$scope.stuPlayDetailCount", $scope.stuPlayDetailCount);
	                    }).error(function (ex, status) {
	                        moethodError(ex + "【错误码：003】", ex, "O_func", "", 0, postData);
	                        if (status && status == 401)
	                            videoError("会话超时，请重新登陆。");
	                    });
	                }

	                //console.log("$scope.studytime", $scope.studytime);
	                //console.log("$scope.stuPlayDetailCount=" + $scope.stuPlayDetailCount);
	                //console.log("time=" + sec1);
	                //console.log("timestamp=" + player1.j2s_realPlayVideoTime());
	                //console.log("videoDuration=" + $scope.nowVideoDuration);
	                //console.log("$scope.course.videotype", $scope.course.videotype);
	                if ($scope.course.videotype > 0) {
	                    var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
	                    if (sec1 != sec2) {
	                        player2.j2s_seekVideo(sec1);
	                    }
	                }
	            }
	            catch (ex) {
	                moethodError(ex.message + "【错误码：004】", ex.stack, "O_func", "", 0, postData);
	                videoError(errorMessage);
	            }
	        }
	        else {
	            var mess = "";
	            if (player1 == undefined) mess += " player1 is undefined, ";
	            if (player1.j2s_getCurrentTime == undefined)
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            else
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            if (player1.j2s_realPlayVideoTime == undefined)
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            else
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            moethodError(mess + "【错误码：005】", "", "O_func", "", 0, postData);
	            videoError(errorMessage);
	        }
	    }

		//视频暂停
	    s2j_onVideoPause = function () {
	        if (player1 != undefined && player1.j2s_pauseVideo != undefined) {
	            player1.j2s_pauseVideo();
	            if ($scope.course.videotype > 0) {
	                if (player2 != undefined && player2.j2s_pauseVideo != undefined)
	                    player2.j2s_pauseVideo();
	            }
	            clearInterval(obj);
	        }
	    }

	    //定义全局暂停,打开微视频时停止课程视频播放
	    $rootScope.stopVideo = function () {
	        s2j_onVideoPause();
	    }

	    $scope.change = function () {
	        if ($(".video-f").hasClass("change")) {
	            //视频变大屏
	            player1.j2s_showUI();//显示皮肤
	            player1.j2s_showRightPanel();//显示右侧栏
	            player2.j2s_banUI();//隐藏皮肤
	            player2.j2s_hideRightPanel();//隐藏右侧栏
	            $(".video-f").removeClass('change');
	        } else {
	            //视频变小屏
	            player1.j2s_banUI();
	            player2.j2s_showUI();
	            player1.j2s_hideRightPanel();
	            player2.j2s_showRightPanel();
	            $(".video-f").addClass('change');
	        }
	        if ($(".video-s").hasClass("change")) {
	            //ppt变大屏
	            $(".video-s").removeClass('change');
	        } else {
	            //ppt变小屏
	            $(".video-s").addClass('change');
	        }
	    };

	    var videoError = function (showmessage) {
	        clearInterval(obj);
	        s2j_onVideoPause();
	        alert(showmessage);
	        location.reload(true);
	    }
	}]);
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
