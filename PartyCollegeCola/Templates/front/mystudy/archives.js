app.controller("archivesController", ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $timeout, $state, $stateParams, getDataSource, CommonService) {

    $scope.getArchives = function () {
        getDataSource.getDataSource("getarchives", { studentid: $rootScope.user.studentId }, function (data) { 
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].expand = false;
                    data[i].src = "../img/arrow01.png";
                    data[i].keywordsArr = data[i].keywords.split(",");
                    data[i].total_time_cn = (parseInt(data[i].total_time) / 3600).toFixed(1);
                }
                data[0].expand = true;
                data[0].src = "../img/arrow02.png";
                $scope.datalist = data;
            }
        }, function (error) { });
    }

    $scope.onExpand = function (n) {
        n.expand = !n.expand;
        n.src = n.expand == false ? "../img/arrow01.png" : "../img/arrow02.png";
    }

    $scope.goTrain = function (pIndex) {
        var url = "indexfront.html#/main/studytotal/" + pIndex;
        location.href = url;
    }

    $scope.getArchives();

}])
