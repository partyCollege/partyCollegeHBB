angular.module("myApp")
.controller("coursewareQuestController", ['$scope', '$rootScope', '$stateParams', 'getDataSource', "$state", 'notify', '$modal', 'CommonService', function ($scope, $rootScope, $stateParams, getDataSource, $state, notify, $modal, CommonService) {
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '问卷名称', field: "title", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },
          { name: '问卷类型', field: "category", cellFilter: "questCategoryFilter" },
          { name: '创建人', field: "createuser" },
          { name: '创建时间', field: "createtime", cellFilter: "date:'yyyy-MM-dd'" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var forDelete = [];
        angular.forEach(selectRows, function (item) {
            forDelete.push({
                id: item.id,
                coursewareid:$stateParams.id
            });
        });
        getDataSource.doArray("delete_sy_course_relationBysourceId", forDelete, function (data) {
            $scope.loadGrid();
        });
    }
    $scope.goNew = function () {
        $state.go("index.questionnaire_edit", {id:'', coursewareid: $stateParams.id });
    }
    $scope.goDetial = function (item) {
        $state.go("index.questionnaire_edit", { id: item.entity.id, coursewareid: $stateParams.id });
    }
    $scope.loadGrid = function () {
    	getDataSource.getDataSource(["select_sy_questionnaire_byCoursewareid", "selectCoursewareById"], { platformid: $rootScope.user.platformid, coursewareid: $stateParams.id, id: $stateParams.id }, function (data) {
    		$scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
    		//console.log("$scope.course", $scope.course);
    		if ($scope.course.isshare == 1) {
    			CommonService.initInputControlDisabled();
    		}
    		$scope.gridOptions.data = _.find(data, function (o) { return o.name == "select_sy_questionnaire_byCoursewareid"; }).data;
        })
    }
    $scope.loadGrid();
}]);