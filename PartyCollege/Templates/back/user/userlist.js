app.controller("userListController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$modal', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $modal, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '登录名', field: "logname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.logname}}</a></div>' },
			  { name: '姓名', field: "name", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '联系方式', field: "cellphone", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '工作单位', field: "company", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					$scope.loadData();
				});
			}
		};

		$scope.ok = function () {
			$scope.isAccept = true;
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			getDataSource.doArray("delSyuserLogic", selectRows, function () {
				notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.loadData();
			}, function (errortemp) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
			$scope.close();
		}
		//关闭模式窗口
		$scope.close = function () {
			$scope.modalInstance.dismiss('cancel');
		}

		$scope.delSyUser = function () {
			$scope.modalInstance = $modal.open({
				templateUrl: 'confirm.html',
				size: 'sm',
				scope: $scope
			});
		}
		$scope.search = {};
		$scope.goDetial = function (row) {
			$state.go("index.useredit", { id: row.entity.id });
		}

		$scope.loadData = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getPlatformUserAccountList"];
			getDataSource.getList(array, { platformid: $rootScope.user.platformid }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort
				, function (data) {
					$scope.gridOptions.totalItems = data[0].allRowCount;
					$scope.gridOptions.data = data[0].data;
				}, function (error) { });
		}
		$scope.loadData();
		$scope.goSearch = function () {
			$scope.loadData();
		}
	}])