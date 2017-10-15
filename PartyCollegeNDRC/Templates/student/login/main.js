app.controller("mainController", ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.gologin = function () {          
        location.href = "../html/login.html";
    }

}])