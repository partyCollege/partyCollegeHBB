app.controller("accountController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource', 'Base64'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, Base64) {
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
			columnDefs: [
			  { name: '登录名', field: "logname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },//, cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.logname}}</a></div>'
			  { name: '姓名', field: "name", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '性别', field: "sex", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'sexFilter' },
			  { name: '联系方式', field: "cellphone", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '创建时间', field: "createtime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd HH:mm:ss'" },
              { name: '职级', field: "rank", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '所属机构', field: "departmentname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '激活状态', field: "signstatus", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "activeStatus" },
              { name: '登录状态', field: "status", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "lockStatus" }
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
		$scope.goDetial = function (row) {
			$state.go("index.accountedit", { id: row.entity.id });
		}
		$scope.search = {}; 
		$scope.search.signstatus = "1";
		$scope.search.signstatus_dbcolumn = "signstatus";
		$scope.search.signstatus_dbtype = "int";
		$scope.search.signstatus_handle = "equal";

		$scope.loadGrid = function (init) {
		    if (init == 0){
		    	//$scope.search_departmentid = $rootScope.user.departmentId;
		    	$scope.search_departmentid = $rootScope.user.pids;
		    }
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getAllStudent"];
			getDataSource.getList(array, { selectedpids: $scope.search_departmentid, selectedpids2: $scope.search_departmentid }
			//getDataSource.getList(array, {}
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort
				, function (data) {
				$scope.gridOptions.totalItems = data[0].allRowCount;
				$scope.gridOptions.data = data[0].data;
				}, function (error) { console.log(error); });
		}
		//$scope.loadGrid(0);

		$scope.goSearch = function () {
		    $scope.gridOptions.paginationCurrentPage = 1;
		    $scope.gridOptions.totalItems = 0;
		    $scope.gridOptions.data = [];
			$scope.loadGrid();
		}

		//关闭模式窗口
		$scope.close = function () {
			$scope.modalInstance.dismiss('cancel');
		}

		$scope.ok = function () {
			$scope.isAccept = true;
			var lockArray = new Array();
			var temp = new Object();
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var length = selectRows.length;
			for (var i = 0; i < length; i++) {
				temp = new Object();
				temp.id = selectRows[i].id;
				temp.status = 1;
				lockArray.push(temp);
			}
			getDataSource.doArray("lockAccount", lockArray, function () {
				notify({ message: '操作成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.loadGrid();
			}, function (errortemp) {
				notify({ message: '操作失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
			$scope.close();
		}

		$scope.lockUser = function () {
			$scope.modalInstance = $modal.open({
				templateUrl: 'confirm.html',
				size: 'sm',
				scope: $scope
			});
		}
		$scope.unLockUser = function () {
			var unlockArray = new Array();
			var temp = new Object();
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var length = selectRows.length;
			for (var i = 0; i < length; i++) {
				temp = new Object();
				temp.id = selectRows[i].id;
				temp.status = 0;
				unlockArray.push(temp);
			}
			getDataSource.doArray("lockAccount", unlockArray, function () {
				notify({ message: '启用成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.loadGrid();
			}, function (errortemp) {
				notify({ message: '启用失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		//重置密码，支持批量
		$scope.resetUserPwd = function () {
			$scope.modalInstance = $modal.open({
				templateUrl: 'resetpwd.html',
				size: 'lg',
				scope: $scope
			});

			
		}
		$scope.accobj = {
			submit: function () {
				$scope.resetPwd();
			}
		};
		$scope.resetbtn = false;
		$scope.resetPwd = function () {
			$scope.resetbtn = true;
			var newpwdArray = new Array();
			var temp = new Object();
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var length = selectRows.length;
		    //var md5pwd = md5($scope.accobj.hashpwd);
			var md5pwd = Base64.encode($scope.accobj.hashpwd); 
			for (var i = 0; i < length; i++) {
				temp = new Object();
				temp.id = selectRows[i].id;
				temp.newpwd = md5pwd;
				newpwdArray.push(temp);
			}
			getDataSource.getUrlData("../api/account/resetuserpwd", newpwdArray, function () {
				notify({ message: '密码重置成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				//$scope.loadGrid();
				$scope.close();
				$scope.resetbtn = false;
			}, function (errortemp) {
				notify({ message: '密码重置失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.resetbtn = false;
			});
		}

		$scope.close = function () {
			$scope.modalInstance.dismiss('cancel');
		};

		$scope.nodeselect = function (n) {
			//$scope.search_departmentid = n.id;
			$scope.search_departmentid = n.pids;
		}
}])