angular.module("myApp")
.controller("questionDetailController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", "$stateParams", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, $stateParams, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    
    $scope.acceptAnswer = function (id) {
        var param = { id:id };

        getDataSource.getDataSource("classmanager-faq-acceptanswer", param
            , function (data) {
                if (data[0].crow && data[0].crow >= 1) {
                    $scope.loadGrid();
                     notify({ message: '采纳答案成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                 } else {
                    notify({
                        message: '采纳答案失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl
                });
                 }
                 },
                 function (e) {
                     notify({ message: '采纳答案失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
             });
    }

    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.answerInfo = row;
        $scope.modalInstance = $modal.open({
            templateUrl: 'answerDetail.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '回答', field: "content", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '回答人', field: "username", width: '10%' },
          { name: '回答时间', field: "createtime", width: '15%' },
          { name: '回答来自', field: "usertype", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.usertype == "1" ? "学员":"老师"}}</div>' },
          { name: '是否采纳', field: "status", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{!row.entity.status ? "未采纳":"已采纳"}}</div>' },
          { name: '操作', width: '10%', cellTemplate: '<div class="ui-grid-cell-contents" ng-if="!row.entity.status"><a ng-click="grid.appScope.acceptAnswer(row.entity.id)">采纳</a>' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $scope.loadGrid();
            });
            gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length == 0) {
                    paginationOptions.sort = null;
                } else {
                    var array = [];
                    angular.forEach(sortColumns, function (c) {
                        array.push({ sort: c.sort, name: c.field });
                    });
                    paginationOptions.sort = array;
                }
                $scope.loadGrid();
            });
        }
    };
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("getQuestionAnswers", {fid:$stateParams.id}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();
}]);