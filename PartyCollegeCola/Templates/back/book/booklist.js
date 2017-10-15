app.controller("booklistController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource','DateService'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, DateService) {
	    var paginationOptions = {
	        pageNumber: 1,
	        pageSize: 25,
	        sort: null
	    };

	    //
	    $scope.gridOptions = {
	        paginationPageSizes: [25, 50, 75],
	        paginationPageSize: 25, 
	        useExternalPagination: true,
	        data: [],
            multiSelect:true,
            columnDefs: [
              { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '教材标题', field: "bookname", width: '34%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.bookname}}" ><a ng-click="grid.appScope.modifybook(row)">{{row.entity.bookname}}</a></div>' },
			  { name: '作者', field: "author", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '出版社', field: "publishcompany", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '出版日期', field: "publishtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
              { name: '是否置顶', field: "istop", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.istop==0 ? "未置顶" : "置顶"}}</div>' },
			  //{ name: '创建人', field: "createuser", width: 90 },
			  { name: '创建时间', field: "createdate", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'", width: '10%' },
	          //{ name: '发布人', field: "publishuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  //{ name: '发布时间', field: "publishdate", cellFilter: "date:'yyyy-MM-dd'", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
	        ],
	        onRegisterApi: function (gridApi) {
	            $scope.gridApi = gridApi;
	            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	                paginationOptions.pageNumber = newPage;
	                paginationOptions.pageSize = pageSize;
	                $scope.loadGrid();
	            });
	        }
	    };
        //新增
	    $scope.addbook = function () {
	        $state.go("index.addbook");
	    }
        //修改
	    $scope.modifybook = function (row) {
	        $state.go("index.addbookparameter", { id: row.entity.id });
	    }
        //删除
	    $scope.deletebook = function () {
	        var selectRows = $scope.gridApi.selection.getSelectedRows(); 
	        getDataSource.doArray("back_deletebook", selectRows, function (data) {
	            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            $scope.loadGrid();
	        });
	    }

        //发布
	    $scope.publishbook = function () {
	    	var selectRows = $scope.gridApi.selection.getSelectedRows();
	    	//console.log(selectRows);
	        var parameters = [];
	        for (var i = 0; i < selectRows.length; i++) {
	            parameters.push({
	                id: selectRows[i].id,
	                status: 1,
	                istop:selectRows[i].istop,
	                publishuser: $rootScope.user.name
	            });
	        }

	        getDataSource.doArray("back_submitbook", parameters, function (data) {
	            notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            $scope.loadGrid();
	        });
	    }


	    $scope.search = {};
	    $scope.loadGrid = function () {
	        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
	        var pageSize = paginationOptions.pageSize;
	        var array = ["back_getbooklist"];

	        if ($scope.search.begincreatedate)
	            $scope.search.begincreatedate = DateService.format($scope.search.begincreatedate, "yyyy-MM-dd") + " 00:00:00";
	        if ($scope.search.endcreatedate)
	            $scope.search.endcreatedate = DateService.format($scope.search.endcreatedate, "yyyy-MM-dd") + " 23:59:59";

	        getDataSource.getList(array, { platformid: $rootScope.user.platformid }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort
				, function (data) {
				    $scope.gridOptions.totalItems = data[0].allRowCount;
				    $scope.gridOptions.data = data[0].data;
				}, function (error) { });
	    }
	    $scope.loadGrid();

	    $scope.goSearch = function () {
	    	$scope.gridOptions.paginationCurrentPage = 1;
	        $scope.loadGrid();
	    }
	}])