angular.module("myApp")
.controller("shieldController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
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



    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.questionInfo = row;
        $scope.questionInfo.entity.answercontent = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'answer.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.goDetial = function (row) {
        $state.go("index.questionDetail", { id: row.entity.id });
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '问题', field: "content", width: '30%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '提问人', width: '7%', field: "studentname" },
          { name: '提问人单位', field: "departmentname", width: "12%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '提问时间', width: '13%', field: "createtime" },
          { name: '来自课程', width: '20%', field: "coursewarename" },
          { name: '主讲人', width: '8%', field: "teachersname" },
          { name: '答案', field: "answertcount", width: "8%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.answertcount}}</a>' },
          { name: '操作', width: '10%', cellTemplate: '<div class="ui-grid-cell-contents"><a style="padding-left:20px;" ng-click="grid.appScope.cancelShield(row)">取消屏蔽</a></div>' },

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
        getDataSource.getList("getShieldQuestion", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

   
	//保存回答
    $scope.saveDisabled = false;
    $scope.saveAnswer = function () {
    	$scope.saveDisabled = true;

    	if ($scope.questionInfo.entity.answerContent == undefined || $scope.questionInfo.entity.answerContent == "" || $scope.questionInfo.entity.answerContent.length <= 0) {
    		notify({ message: '请输入回复内容。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		$scope.saveDisabled = false;
    		return;
    	}

        var param = {
            id: getDataSource.getGUID(),
            accountid: $rootScope.user.accountId,
            fid: $scope.questionInfo.entity.id,
            content: $scope.questionInfo.entity.answerContent,
            coursewareid: $scope.questionInfo.entity.coursewareid,
            usertype: 2,
            classid: $rootScope.user.classId,
            faqid: $scope.questionInfo.entity.id
        };

        getDataSource.getDataSource("classmanager-faq-teacheranswer", param, function (data) {
        	if (data[0].crow && data[0].crow >= 1) {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
        	} else {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (e) {
        	$scope.saveDisabled = false;
            notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //取消屏蔽
    $scope.cancelShield = function (row) {
        var param = {
            id: row.entity.id,
            shielding: 0,
            reason: "",
            accountid: $rootScope.user.accountId
        };

        getDataSource.getDataSource("classmanager-faq-shielding-update", param,
        function (data) {
            if (data[0].crow && data[0].crow >= 1) {
                $scope.loadGrid();
                notify({ message: '取消屏蔽问题成功', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } else {
                notify({ message: '取消屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        },
        function (e) {
            notify({ message: '取消屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

}]);