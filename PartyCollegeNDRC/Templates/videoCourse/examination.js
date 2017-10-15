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