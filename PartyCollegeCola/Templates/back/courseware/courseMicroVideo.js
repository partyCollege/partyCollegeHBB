angular.module("myApp")
.controller("courseMicroVideoController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '微视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewMicroVideo(row)">{{row.entity.name}}</a></div>' },
          { name: '提供者', field: "provider" }
        ]
    };

    $scope.doinitMicroVideo = function () {
        getDataSource.getDataSource("getAllMicroVideo", { id: $stateParams.id }, function (data) {
            $scope.allMicroVideo = data;
        });

        getDataSource.getDataSource("getCourseMicroVideo", { courseid: $stateParams.id }, function (data) {
            $scope.gridOptions.data = data;
        })
    }
    $scope.doinitMicroVideo();

    $scope.addMicroVideo = function () {

        getDataSource.getDataSource("delete_sy_course_relation", { id: $scope.course.id, type: 2 }, function () {
            var forInsert = [];
            angular.forEach($scope.course.microVideo, function (item) {
                forInsert.push({
                    id: getDataSource.getGUID(),
                    coursewareid: $scope.course.id,
                    sourceid: item.id,
                    type: 2
                });
            });
            getDataSource.doArray("insert_sy_course_relation", forInsert, function (data) {
                $scope.course.microVideo = [];
                $scope.doinitMicroVideo();
            });
        });
    };

    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);