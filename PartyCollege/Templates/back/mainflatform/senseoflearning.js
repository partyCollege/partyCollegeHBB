app.controller("senseoflearningController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '标题', field: "title", width: '25%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },

              { name: '班级', field: "classname", width: '25%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '学员', field: "stuname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐人', field: "recommenduser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐时间', field: "recommendtime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },

              { name: '平台', field: "platformname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '操作', field: "id", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><button  ng-if="row.entity.auditstatus==0" ng-click="grid.appScope.doRecommendFlatform(row,1)">审核</button></div>' }
			]
		};

		$scope.gridOptionsRecommend = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '标题', field: "title", width: '25%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },


              { name: '班级', field: "classname", width: '25%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '学员', field: "stuname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐人', field: "recommenduser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐时间', field: "recommendtime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '审核人', field: "audituser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '审核时间', field: "audittime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },

              { name: '平台', field: "platformname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '操作', field: "id", width: '20%', cellClass: "myleft", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><button  ng-if="row.entity.auditstatus==1" ng-click="grid.appScope.doRecommendFlatform(row,0)">取消审核</button>&nbsp;&nbsp;<button ng-click="grid.appScope.doCancelRecommendFlatform(row)" ng-if="row.entity.recommendstatus>=2 && row.entity.count > 0">取消推荐</button><button ng-click="grid.appScope.doRecommendGeneralFlatform(row)" ng-if="row.entity.category==0 && row.entity.count==0">推荐到总平台</button></div>' }
			]
		};

		$scope.gridOptionsSubplatform = {
		    paginationPageSizes: [25, 50, 75],
		    paginationPageSize: 25,
		    data: [],
		    columnDefs: [
              { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '标题', field: "title", width: '25%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },

              { name: '班级', field: "classname", width: '25%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '学员', field: "studentname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐人', field: "recommenduser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '推荐时间', field: "recommendtime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '审核人', field: "audituser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '审核时间', field: "audittime", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },

              { name: '推荐平台', field: "platformname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '操作', field: "id", width: '20%', cellClass: "myleft", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><button  ng-if="row.entity.auditstatus==1" ng-click="grid.appScope.doAuditSubplatform(row,2)">审核通过</button>&nbsp;&nbsp;<button ng-click="grid.appScope.doAuditSubplatform(row,1)" ng-if="row.entity.auditstatus==2">取消审核</button><button ng-click="grid.appScope.doCancelRecommendSubplatform(row)" ng-if="row.entity.auditstatus==1">忽略推荐</button></div>' }
		    ]
		};

		$scope.goDetial = function (row) {
			$state.go("index.senselearningedit", { id: row.entity.id });
		}

		$scope.doRecommendFlatform = function (row, action) {
			var platform = new Object();
			platform.category = "learningsense";
			platform.op = action;
			platform.tableid = row.entity.id;
			platform.platformid = $rootScope.user.platformid;
			if (action == 1)
			    platform.AuditUser = $rootScope.user.name

			getDataSource.getUrlData('../api/Platform/RecommendPush', platform, function (data) { 
				if (data.code == "success") {
					var title = "审核成功";
					if (action == 0) {
						title = "取消审核成功";
					}
					$scope.loadData();
					notify({ message: title, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					var title = "审核失败";
					if (action == 0) {
						title = "取消审核失败";
					}
					notify({ message: title, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				notify({ message: "操作失败", classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

        //推荐到总平台
		$scope.doRecommendGeneralFlatform = function (row) {
		    var param = new Object();
		    param.platformid = $rootScope.user.platformid;
		    param.eventid = row.entity.id;;

		    getDataSource.getUrlData('../api/dorecommendgeneralflatform', param, function (data) {
		        if (data.result) {
		            $scope.loadData(); 
		        }
		        notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    }, function (errortemp) {
		        notify({ message: "操作失败", classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    });
		}

        //自己平台取消推荐
		$scope.doCancelRecommendFlatform = function (row) { 
		    var param = {};
		    param.platformid = $rootScope.user.platformid;
		    param.eventid = row.entity.id;;
		    param.canceltype = "1";

		    getDataSource.getUrlData('../api/docancelrecommendflatform', param, function (data) {
		        if (data.result) {
		            $scope.loadData();
		        }
		        notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    }, function (errortemp) {
		        notify({ message: "操作失败", classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    });
             
		}

        //推荐到总平台审批
		$scope.doAuditSubplatform = function (row, action) {
		    var param = {};
		    param.id = row.entity.id;;
		    param.status = action;

		    var key = "";
		    if (action == 2) {
		        key = "back_AuditPassSubplatformRecommend";
		        param.audituser = $rootScope.user.name;
		    }
		    else {
		        key = "back_AuditUnPassSubplatformRecommend";
		    }


		    getDataSource.getDataSource(key, param, function (data) {
		        if (data[0] && data[0].crow > 0) {
		            $scope.loadData();
		            var title = action == 2 ? "审批成功" : "取消审核成功";
		            notify({ message: title, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        }
		    }, function (errortemp) {
		        notify({ message: "操作失败", classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    });
		}

        //忽略推荐
		$scope.doCancelRecommendSubplatform = function (row) {
		    var param = {};
		    param.id = row.entity.id;;

		    getDataSource.getDataSource("doCancelRecommendSubplatform", param, function (data) {
		        if (data[0] && data[0].crow > 0) {
		            $scope.loadData();
		            notify({ message: "忽略成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        } 
		    }, function (errortemp) {
		        notify({ message: "操作失败", classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    });
		}

		$scope.loadData = function () { 
		    var param = {};
		    param.platformid1 = $rootScope.user.platformid;
		    param.platformid2 = $rootScope.user.platformid;
		    param.platformid3 = $rootScope.user.platformid;
		    
		    getDataSource.getDataSource(["getWaiteRecommendLearningSense", "getRecommendLearningSense", "getAuditSubplatformLearningSense"], param, function (data) {
				if (data.length > 0) {
					$scope.gridOptions.data = _.find(data, { name: "getWaiteRecommendLearningSense" }).data;
					$scope.gridOptionsRecommend.data = _.find(data, { name: "getRecommendLearningSense" }).data;
					$scope.gridOptionsSubplatform.data = _.find(data, { name: "getAuditSubplatformLearningSense" }).data;
				}
			}, function (errortemp) {

			});
		}
		$scope.loadData();
	}])