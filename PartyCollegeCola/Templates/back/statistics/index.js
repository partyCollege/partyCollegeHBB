angular.module("myApp")
.controller("statisticsIndexController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    $scope.statisticsdata = {};
    $scope.loadData = function () {
        getDataSource.getDataSource("statistics-index", {
            platformid1: $rootScope.user.platformid,
            platformid2: $rootScope.user.platformid,
            platformid3: $rootScope.user.platformid,
            platformid4: $rootScope.user.platformid
        }, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.statisticsdata = data[0];
        });
    }
    $scope.loadData();
    setInterval(function () { $scope.loadData();}, 5000);
}]);





