angular.module("myApp")
.controller("trainlistController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "DateService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, DateService) {

    var start = new Date().getFullYear() - 5;
    var end = new Date().getFullYear();
    $scope.yearArr = [];
    for (var i = start; i <= end; i++) {
        $scope.yearArr.push(i);
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    var inityear = new Date().getFullYear();
    $timeout(function () {
        $scope.search.year = inityear;
        var mid = $rootScope.user.mdepartmentId;
        if ($rootScope.user.usertype == 2) {
            mid = $rootScope.user.departmentId;
        }
        $scope.search.departmentid = mid;
    	$scope.loadGrid();
    }, 500);
      
    //检索
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
     
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        columnDefs: [
           { name: '培训名称', width: '30%', field: "title", cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAudit(row)">{{row.entity.title}}</a>' },
           { name: '姓名', width: '10%', field: "name", headerCellClass: 'mycenter' },
          { name: '组织机构', width: '20%', field: "departmentname", headerCellClass: 'mycenter' },        
          { name: '一级分类', width: '10%', field: "categoryone", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', width: '10%', field: "categorytwo", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '三级分类', width: '10%', field: "categorythree", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '四级分类', width: '10%', field: "categoryfour", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '申报年份', width: '10%', field: "year", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '拟报学时', width: '10%', field: "studytime", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '状态', width: '10%', field: "status", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'trainStatuFilters' }
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
     
    $scope.goAudit = function (row) {
        //$scope.rowentity = row;
        $scope.train = row.entity;
        $scope.modalInstance = $modal.open({
            templateUrl: 'audit.html',
            size: 'lg',
            scope: $scope
        });
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.saveDisabled = false;
    $scope.goSubmitAudia = function (n, sta) {
    	var parameter = { status: sta, id: n.id, remark: n.remark };
    	if (parameter.remark == null || parameter.remark == '') {
    		notify({ message: '请输入审核意见', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		return;
    	}
        $scope.saveDisabled = true;
        getDataSource.getDataSource("submitrain", parameter, function (data) {
            if (data[0] && data[0].crow > 0) {
                notify({ message: '操作成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });          
                //$scope.rowentity.entity.status = sta;
                //$scope.rowentity.entity.remark = n.remark;
                $scope.train.status = sta;
                $scope.train.remark = n.remark;
                $scope.close();
                $scope.loadGrid();
            }
            $scope.saveDisabled = false;
        }, function (error) { });

    }


    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;

        var array = ["back_gettrain"];
        getDataSource.getList(array, $scope.search, { firstRow: firstRow, pageSize: pageSize }, {}, paginationOptions.sort
            , function (data) {
                $scope.gridOptions.totalItems = data[0].allRowCount;
                $scope.gridOptions.data = data[0].data; 
            }, function (error) {
                var e = error;
            });
        
    }


    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray(["delete_sy_train"], selectRows, function (data) {
                $scope.loadGrid();
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }
    

}]);