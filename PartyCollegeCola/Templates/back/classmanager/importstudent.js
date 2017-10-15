angular.module("myApp")
.controller("importstudentController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'Upload', '$http', 'CommonService', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, Upload, $http, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    }; 
    $scope.search = {
        name: "",
        departmentid: "",
		pids:"",
        classid: $stateParams.id,
        rank: ""
    };

    var mid = $rootScope.user.mdepartmentId;
    var pids = $rootScope.user.pids;
    if ($rootScope.user.usertype == 2) {
    	mid = $rootScope.user.departmentId;
    	mid = $rootScope.user.pids;
    }
    $scope.search.departmentid = mid;
    $scope.search.pids = pids;

    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        
        getDataSource.getUrlData("../api/getstudent", $scope.search, function (data) {
            if (data.result) {
                $scope.gridOptions.totalItems = data.list.length;
                $scope.gridOptions.data = data.list;
            }
        }, function (errortemp) { });
    }
    
	//$scope.loadGrid();

    $scope.gridOptions = {
        //paginationPageSizes: [25, 50, 100],
        //paginationPageSize: 25,
        //useExternalPagination: true,
        data: [],
        columnDefs: [
            { name: '登录帐号', field: "logname", headerCellClass: "text-center"},
            { name: '姓名', field: "name", headerCellClass: "text-center" },
            { name: '手机号码', headerCellClass: "text-center", field: "cellphone" },
            { name: '职级', headerCellClass: "text-center", field: "rank" },
            { name: "部门名称", headerCellClass: "text-center", field: "departmentname" },
            { name: "状态", headerCellClass: "text-center", field: "status" },
            { name: "注册状态", headerCellClass: "text-center", field: "signstatus" },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            //    paginationOptions.pageNumber = newPage;
            //    paginationOptions.pageSize = pageSize;
            //    $scope.loadGrid();
            //});
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

	//获取职级数据
    $scope.getLevelArr = function () {
    	if (!$scope.levelArr) {
    		getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
    			$scope.levelArr = _.find(data, { type: "职级" }).list;
    			$scope.levelArr.unshift({id:"1",datavalue:"",showvalue:"全部"})
    		}, function (errortemp) { });
    	}
    }

    $scope.getLevelArr();

    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.goReturn = function () {
        $state.go("index.classedit.student", { id: $stateParams.id });
    }
    $scope.selectnode = function (node) {
    	$scope.search.departmentid = node.id;
    	$scope.search.pids = node.pids;
        $scope.loadGrid();
    }
    $scope.ok = function () {
    	
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var parameter = { classid: $stateParams.id ,userid:[]} 
        for (var i = 0; i < selectRows.length; i++) {
            parameter.userid.push(selectRows[i].userid);
        }
         
        getDataSource.getUrlData("../api/insertstudent", parameter, function (data) {
            if (data.result) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
            } else {
            	notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (errortemp) { });

    }

    $scope.ngcheckArray = [];
    $scope.ok_org = function () {
        var parameter = { classid: $stateParams.id, departmentid: $scope.ngcheckArray };

        getDataSource.getUrlData("../api/batchinsertstudent", parameter, function (data) {
            if (data.result) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
            } else {
                notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (errortemp) { });

    }

    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.addStudent_view = function (id) {

        $scope.modalInstance = $modal.open({
            templateUrl: 'confirm.html',
            size: 'md',
            scope: $scope
        });
         
    }

    $scope.addStudent_org = function (id) {
        
        if ($scope.ngcheckArray && $scope.ngcheckArray.length > 0) {
            $scope.modalInstance = $modal.open({
                templateUrl: 'confirm_org.html',
                size: 'md',
                scope: $scope
            });
        } else {
            notify({ message: '请选择要保存的机构', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }

    }

}]);