angular.module("myApp")
.controller("questionnaire_edit_shareController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', '$stateParams', function ($scope, $rootScope, getDataSource, $state, notify, $modal, $stateParams) {
    $scope.quest = {};
    if ($stateParams.coursewareid=="") {
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
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);