angular.module("myApp")
.controller("questionController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter) {

    $scope.goQuestionList = function (nowtype) {
        var nowRouter = "";
        switch (nowtype) {
            case 0: nowRouter = "index.question.noanswered"; break;
            case 1: nowRouter = "index.question.answered"; break;
            case 2: nowRouter = "index.question.shield"; break;
        }
        $state.go(nowRouter);
    }
}]);