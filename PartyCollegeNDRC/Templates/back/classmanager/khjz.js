angular.module("myApp")
.controller("classAssessmentController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify) {
    $scope.dimensions = [
        { name: "必修课" },
        { name: "选修课" },
        { name: "案例教学" },
        { name: "小结" }
    ];
    $scope.class = { dimensions: [] };

    $scope.saveButtonDisabled = false;
    $scope.save = function () {
    	//保存
    	$scope.saveButtonDisabled = true;
        $scope.class.classid = $stateParams.id;
        var dimension = "";
        angular.forEach($scope.class.dimensions, function (data) {
            dimension += data.name + ",";
        });
        if (dimension.length > 0) {
            dimension = dimension.substring(0, dimension.length - 1);
        }
        $scope.class.dimension = dimension;
        if ($scope.class.id) {
            getDataSource.getDataSource("updateClassAssessment", $scope.class, function () {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            }, function (error) { $scope.saveButtonDisabled = false;});
        }
        else {
            $scope.class.id = getDataSource.getGUID();
            getDataSource.getDataSource("insertClassAssessment", $scope.class, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            }, function (error) { $scope.saveButtonDisabled = false; });
        }

    }
    $scope.checkMax = function (now, max) {
       var scopenow=  now.split(".")
       if ($scope[scopenow[0]][scopenow[1]] >= max)
        {
           $scope[scopenow[0]][scopenow[1]] = max;
        }
    }
    $scope.load = function () {
        getDataSource.getDataSource("selectClassScoreSum", { classid: $stateParams.id }, function (data) {
            var groupby = _.groupBy(data, function (item) {
                return item.category;
            })
            $scope.requiredpassmark = _.sumBy(_.filter(data, function (item) { return item.category == 0 }),
                function (item)
                { return item.score; }
                );
            $scope.electivepassmark = _.sumBy(_.filter(data, function (item) { return item.category == 1 }),
                function (item)
                { return item.score; }
                );
            $scope.casepassmark = _.sumBy(_.filter(data, function (item) { return item.category == 2 }),
                function (item)
                { return item.score; }
                );
        });
        getDataSource.getDataSource("selectClassAssessment", { classid: $stateParams.id }, function (data) {
            if (data.length > 0) {
                $scope.class = data[0];
                $scope.class.dimensions = [];
                angular.forEach($scope.class.dimension.split(","), function (item) {
                    $scope.class.dimensions.push({ name: item });
                });
            }
        })
    }();
}]);