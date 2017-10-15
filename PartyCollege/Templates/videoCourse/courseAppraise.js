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