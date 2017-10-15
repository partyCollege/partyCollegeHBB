angular.module("myApp")
.controller("questionnaireController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter) {

    $scope.goQuestionnaiseList = function (nowtype) {
        var nowRouter = "";
        switch (nowtype) {
            case 0: nowRouter = "index.questionnaire.questionnaire_list"; break;
        }
        $state.go(nowRouter);
    }
}]);