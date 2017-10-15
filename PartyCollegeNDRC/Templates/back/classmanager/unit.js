angular.module("myApp")
.controller("unitController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'Upload', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, Upload) {
	var paginationOptions = {
		pageNumber: 1,
		pageSize: 25,
		sort: null
	};
	$scope.gridOptions = {
		paginationPageSizes: [25, 50, 75],
		paginationPageSize: 25,
		columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: '班级单元名称', field: "packagename", width: '64%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewLive(row)">{{row.entity.packagename}}</a></div>' },
		  { name: '专题数量', field: "classnum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: '创建人', field: "createuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: '创建时间', field: "createtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" }
		],
		onRegisterApi: function (gridApi) {
			$scope.gridApi = gridApi;
			gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				paginationOptions.pageNumber = newPage;
				paginationOptions.pageSize = pageSize;
				$scope.load();
			});
		}
	};

	$scope.load = function () {
		var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
		var pageSize = paginationOptions.pageSize;
		var array = ["selectSymulticlass"];
		getDataSource.getList(array, { platformid: $rootScope.user.platformid }
			, { firstRow: firstRow, pageSize: pageSize }
			, $scope.search, paginationOptions.sort
			, function (data) {
				$scope.gridOptions.totalItems = data[0].allRowCount;
				$scope.gridOptions.data = data[0].data;
			}, function (error) { });
    };
    $scope.viewLive = function (item) {
        $state.go("index.unitEdit", { id: item.entity.id });
    }

    $scope.delUnit = function () {
    	//删除单元前，要先检查单元下是否存在专题和学员
    	$scope.modalInstance = $modal.open({
    		templateUrl: 'confirm.html',
    		size: 'sm',
    		scope: $scope
    	});
    }
    $scope.load();

    $scope.goSearch = function () {
    	$scope.load();
    }

    $scope.ok = function () {
    	$scope.isAccept = true;
    	var selectRows = $scope.gridApi.selection.getSelectedRows();
    	getDataSource.getUrlData("../api/deleteMultUnit", selectRows, function (data) {
    		if (data.code == "failed") {
    			notify({ message: '删除失败,' + data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		} else {
    			notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    			$scope.load();
    		}
    	}, function (error) {
    		notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    	});
    	$scope.close();
    }
	//关闭模式窗口
    $scope.close = function () {
    	$scope.modalInstance.dismiss('cancel');
    }
}]);