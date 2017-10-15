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