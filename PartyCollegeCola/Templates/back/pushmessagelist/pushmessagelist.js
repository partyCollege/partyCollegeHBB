angular.module("myApp")
.controller("pushmessagelistController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, notify, getDataSource, DateService, CommonService) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.gridOptions = {
			enableFiltering: false,
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
                { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: '标题', field: "title", width: '34%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },
				{ name: "点击数", field: "clicknum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: "发布状态", field: "status", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "publishStatusFilter" },
				{ name: "创建人", field: "createuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: "创建时间", field: "createtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd HH:mm:ss'" },
				{ name: "发布人", field: "publishuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: "发布时间", field: "publishtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" }
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

		$scope.search = {};
		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["selectAllPushMessage"];
			getDataSource.getList(array, {}
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

		$scope.goDetial = function (row) {
			$state.go("index.pushmessageEdit", { id: row.entity.id });
		}

		$scope.doPublish = function (ispublish) {
			var items = $scope.gridApi.selection.getSelectedRows();
			var length = items.length;
			var postArray = new Array();
			for (var i = 0; i < length; i++) {
				var temp = new Object();
				temp.id = items[i].id;
				temp.publishuser = $rootScope.user.name;
				temp.publishtime = new Date();
				temp.status = ispublish;
				postArray.push(temp);
			}
			getDataSource.doArray("publishPushMessage", postArray, function (data) {
				notify({ message: "发布成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.loadGrid();
			}, function (error) {
				notify({ message: "发布失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}
}]);