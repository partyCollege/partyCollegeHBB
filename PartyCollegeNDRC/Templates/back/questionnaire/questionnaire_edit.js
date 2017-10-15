angular.module("myApp")
.controller("questionnaire_editController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', '$stateParams', function ($scope, $rootScope, getDataSource, $state, notify, $modal, $stateParams) {
    $scope.quest = {};
    if ($stateParams.coursewareid == "") {
        $scope.quest.category = 1;
    }
    else {
        $scope.quest.category = 0;

    }
    $scope.quests = [];
    $scope.answers = [];
    $scope.load = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource(["selectquestionnaireById", "selectquestionnaire_detailById", "select_sy_questionnaire_detail_subjectById"]
                , { id: $stateParams.id }, function (data) {
                    //console.log(data);
                    $scope.quest = _.find(data, function (item) {
                        return item.name == "selectquestionnaireById";
                    }).data[0];
                    $scope.quests = _.find(data, function (item) {
                        return item.name == "selectquestionnaire_detailById";
                    }).data;
                    var answers = _.find(data, function (item) {
                        return item.name == "select_sy_questionnaire_detail_subjectById";
                    }).data;
                    angular.forEach($scope.quests, function (item) {
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
    $scope.load();

    $scope.saveButtonDisabled = false;
    $scope.save = function () {
        $scope.saveButtonDisabled = true;
        var answersArray = [];
        if ($stateParams.id) {
            getDataSource.getDataSource(["update_sy_questionnaire", "delete_sy_questionnaire_detail", "delete_sy_questionnaire_subject"]
                , $scope.quest, function (data) {
                    angular.forEach($scope.quests, function (item, index) {
                        item.questionnaireid = $scope.quest.id
                        item.id = getDataSource.getGUID();
                        item.sort = index + 1;
                        angular.forEach(item.answers, function (answer, index1) {
                            answer.id = getDataSource.getGUID();
                            answer.sort = index1;
                            answer.fid = item.id;
                            answer.questionnaireid = $scope.quest.id;
                            answersArray.push(answer);
                        })
                    });
                    $scope.saveButtonDisabled = false;
                    getDataSource.doArray("insert_sy_questionnaire_detail", $scope.quests, function (item) {
                        getDataSource.doArray("insert_sy_questionnaire_subject", answersArray, function (data1) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        });
                    });
                }, function (error) { $scope.saveButtonDisabled = false; });
        }
        else {
            $scope.quest.id = getDataSource.getGUID();
            $scope.quest.createuser = $rootScope.user.name;
            $scope.quest.createtime = new Date();
            angular.forEach($scope.quests, function (item, index) {
                item.questionnaireid = $scope.quest.id
                item.id = getDataSource.getGUID();
                item.sort = index + 1;
                angular.forEach(item.answers, function (answer, index1) {
                    answer.id = getDataSource.getGUID();
                    answer.sort = index1;
                    answer.fid = item.id;
                    answer.questionnaireid = $scope.quest.id;
                    answersArray.push(answer);
                })
            });
            if ($stateParams.coursewareid) {
                getDataSource.getDataSource("insert_sy_course_relation",
                    {
                        id: getDataSource.getGUID(),
                        coursewareid: $stateParams.coursewareid,
                        sourceid: $scope.quest.id,
                        type: 3
                    }, function (data) { })
            }
            getDataSource.getDataSource("insert_sy_questionnaire", $scope.quest, function (data) {
                $scope.saveButtonDisabled = false;
                getDataSource.doArray("insert_sy_questionnaire_detail", $scope.quests, function (item) {
                    getDataSource.doArray("insert_sy_questionnaire_subject", answersArray, function (data1) {
                        $state.go("index.questionnaire_edit", { id: $scope.quest.id, coursewareid: $stateParams.coursewareid });
                        notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                });
            }, function (error) { $scope.saveButtonDisabled = false; });
        }
    }
    //删除一道问题
    $scope.deleteQuest = function (item) {
        $scope.quests.pop(item);
    }
    //删除一个问题的一个答案
    $scope.deleteAnswer = function (item) {
        $scope.nowanswers.answers.pop(item);
    }
    //新增一个问题
    $scope.addquest = function () {
        $scope.quests.push({
            sort: $scope.quests.length + 1,
            title: ""

        });
    }
    //新增一个问题的一个答案
    $scope.addanswer = function () {

        $scope.nowanswers.answers.push({
            order: $scope.answers.length + 1,
            title: ""
        });
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.saveAnswer = function () {
        //$scope.nowanswers.answers = $scope.answers;
        $scope.close();
    }
    //编辑一个问题的答案
    $scope.editDetail = function (item) {
        $scope.nowanswers = item;
        if (!$scope.nowanswers.answers) {
            $scope.nowanswers.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'quest_detail.html',
            size: 'lg',
            scope: $scope
        });
    }
}]);