angular.module("myApp")
.controller("newsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', '$timeout', '$modal', 'CommonService', function ($scope, $rootScope, getDataSource, $state, notify, $timeout, $modal, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        multiSelect:false,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: "新闻类型", field: "category", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "newsCategoryFilter" },
          { name: '标题', field: "title", width: '25%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>', headerCellClass: 'mycenter' },
          { name: "创建人", field: "createname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建机构", field: "name", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建时间", field: "createtime", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "发布时间", field: "publishtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          //{ name: '发布范围', field: "ispublic", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status == "已发布" ? (row.entity.ispublic == 1 ?"全部机构":"部分机构"):""}}</div>', headerCellClass: 'mycenter' },
          { name: "状态", field: "status", width: '8%', cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) { if (grid.getCellValue(row, col) === '已发布') { return 'blue'; } }, cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "是否置顶", field: "istop", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '操作', field: "id", width: '9%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="../html/index.html#/main/news/{{row.entity.id}}" target="_blank">预览</a></div>', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $scope.loadSource();
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
                $scope.loadSource();
            });
        }
    };

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource(1);
    }

    $scope.searchdepartmentid = "";
    $scope.loadSource = function (init) {

        //初始化按机构查询
        //$scope.search.departmentid_dbcolumn = "departmentid";
        //$scope.search.departmentid_dbtype = "string";
        //$scope.search.departmentid_handle = "like";
        if (init == 0) {
            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            $scope.searchdepartmentid = mid;
        } 

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search); platformid: $rootScope.user.platformid
        getDataSource.getList("selectAllNews-listall", {
            accountid: $rootScope.user.accountId,
            departmentid: $scope.searchdepartmentid
        }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadSource(0);



    $scope.goDetial = function (row) {
        //console.log(row);
        $state.go("index.newsEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("deleteNewsById", selectRows, function (data) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadSource();
            });
        }
    }

    $scope.alert = function (mess) {
        notify({ message: mess, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    }

    //打开发布
    $scope.publish = function () {

        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            //全部机构
            getDataSource.getDataSource("updateNewsPublishAlldepartment", { id: selectRows[0].id }, function (data) {
                alert('发布成功');
                //CommonService.alert('发布成功');
                $scope.loadSource();
            }, function (e) {
                alert("发布失败");
                //CommonService.alert("发布失败");
            });
        }
        else {
            alert("请选择要发布的数据");
            //CommonService.alert("请选择要发布的数据");
        }





        
        //var selectRows = $scope.gridApi.selection.getSelectedRows();
        //if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            
        //    if (selectRows[0].status == "已发布") {
        //        notify({ message: '不能重复发布', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //        return;
        //    }
        //    else {
        //        var modalInstance = $modal.open({
        //            animation: false,
        //            templateUrl: 'publish.html',
        //            controller: 'publishCtrl',
        //            size: 'lg',
        //            resolve: {
        //                alldepartment: function () {
        //                    return $scope.alldepartment;
        //                },
        //                gridApi: function () {
        //                    return $scope.gridApi;
        //                },
        //                loadSource: function () {
        //                    return $scope.loadSource;
        //                },
        //                alert: function () {
        //                    return $scope.alert;
        //                }
        //            }
        //        });

        //    }
        //}
    }



    //推荐recommend
    $scope.recommend = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("updateNewsRecommend", selectRows, function (data) {
                notify({ message: '置顶成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadSource();
            });
        }
    }

    //取消推荐recommend
    $scope.unrecommend = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("updateNewsCancelRecommend", selectRows, function (data) {
                notify({ message: '撤销置顶成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadSource();
            });
        }
    }

    //撤销发布
    $scope.unpublishnews = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.getDataSource("delete_sy_news_relation", { newsid: selectRows[0].id }, function (a) {
                getDataSource.doArray("updateNewsCancelPublish", selectRows, function (data) {
                    //notify({ message: '撤销发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    alert('撤销发布成功');
                    $scope.loadSource();
                });
            }, function (e) {
                //notify({ message: '撤销发布失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                alert('撤销发布失败');
            })

        }
        else {
            //notify({ message: '请选择要撤销发布的数据', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            alert('请选择要撤销发布的数据');
        }
    }

    $scope.alldepartment = [];

    //获取部门数据
    $scope.getDepartmentArr = function () {

        getDataSource.getDepartmentAdmin(function (data) {
            if ($rootScope.user.usertype == 2) {
                angular.forEach(data, function (item) {
                    if (item.id == "100000")
                        item.nocheck = 1;
                    else
                        item.nocheck = 0;
                });
            }
            $scope.alldepartment = data;
        }, function (error) { });

    }();


}])
.filter('topFilters', function () {
    var genderHash = {
        0: '未置顶',
        1: '已置顶'
    };

    return function (input) {
        if (!input) {
            return '未置顶';
        } else {
            return genderHash[input];
        }
    };
});





app.controller("publishCtrl", ['$rootScope', '$scope', '$http', '$timeout', "$modalInstance", 'getDataSource', 'SessionService', 'DateService', 'alldepartment', 'gridApi', 'loadSource', 'alert'
	, function ($rootScope, $scope, $http, $timeout, $modalInstance, getDataSource, SessionService, DateService, alldepartment, gridApi, loadSource, alert) {
	    $scope.ispublic = $rootScope.user.usertype == 2 ? 1 :0;
	    $scope.saveTitle = "发布";
	    $scope.department = [];
	    $scope.saveDisabled = false;
	    $scope.loadSource = loadSource;
	    $scope.gridApi = gridApi;

	    var getSelectDepartment = function (treeNode, checked) {
	        var id = treeNode.id;
	        if (checked) {
	            if (_.filter($scope.department, function (r) { return r.departmentId == id }).length <= 0) {
	                $scope.department.push({
	                    departmentId: id,
	                    departmentName: treeNode.name,
	                });
	            }
	        } else
	            _.remove($scope.department, function (r) { return r.departmentId == id });

	        if (treeNode.children && treeNode.children.length > 0) {
	            angular.forEach(treeNode.children, function (item) {
	                getSelectDepartment(item, checked);
	            });
	        }
	    }




	    //tree设置
	    $scope.treeSetting = {
	        view: {
	            dblClickExpand: false,
	            expandSpeed: "slow"
	        },
	        data: {
	            simpleData: {
	                enable: true,
	                idKey: "id",
	                pIdKey: "pid"
	            }
	        },
	        check: {
	            enable: true,
	            chkStyle: "checkbox",
	            chkboxType: { "Y": "s", "N": "s" }
	        },
	        callback: {
	            onCheck: function (event, treeId, treeNode) {
	                $timeout(function () {
	                    getSelectDepartment(treeNode, treeNode.checked);
	                }, 1000);
	            }

	        }
	    };

	    $scope.saveDisabled = false;
	    $scope.saveTitle = "发布";
	    $scope.treeData = alldepartment;
	    $timeout(function () {
	        $.fn.zTree.init($("#treeDemo_admin"), $scope.treeSetting, $scope.treeData);

	        var treeObj = $.fn.zTree.getZTreeObj("treeDemo_admin");
	        var nodes = treeObj.getNodes();
	        if (nodes.length > 0) {
	            treeObj.expandNode(nodes[0], true, false, true);
	        }
	    }, 200);


	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	        if ($scope.ispublic == 0)
	            $.fn.zTree.getZTreeObj("treeDemo_admin").expandAll(false);
	    };



	    //发布到机构
	    $scope.publishnews = function () {
	        var selectRows = $scope.gridApi.selection.getSelectedRows();
	        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
	            $scope.saveDisabled = true;
	            $scope.saveTitle = "发布中...";

	            if ($scope.ispublic == 0) {

	                if ($scope.department.length <= 0) {
	                    alert('请选择要发布的机构');
	                    return;
	                }
	                else {
	                    //部分机构
	                    var postdata = [];
	                    angular.forEach($scope.department, function (item) {
	                        postdata.push({
	                            id: getDataSource.getGUID(),
	                            newsid: selectRows[0].id,
	                            sourceid: item.departmentId,
	                            type: 0
	                        });
	                    });

	                    getDataSource.getUrlData("../api/batchInsertNewsRelation", postdata, function (data) {
	                        getDataSource.doArray("updateNewsPublish", selectRows, function (data) {
	                            $scope.saveTitle = "发布";
	                            alert('发布成功');
	                            $scope.loadSource();
	                            $scope.cancel();
	                            $scope.saveDisabled = false;
	                        });
	                    }, function (e) {
	                        $scope.saveTitle = "发布";
	                        alert('发布失败');
	                    });

	                    //getDataSource.doArray("insert_sy_news_relation", postdata, function (a) {
	                    //    getDataSource.doArray("updateNewsPublish", selectRows, function (data) {
	                    //        $scope.saveTitle = "发布";
	                    //        alert('发布成功');
	                    //        $scope.loadSource();
	                    //        $scope.cancel();
	                    //        $scope.saveDisabled = false;
	                    //    });
	                    //}, function (e) {
	                    //    $scope.saveTitle = "发布";
	                    //    alert('发布失败');
	                    //})
	                }
	            }
	            else {
	                //全部机构
	                getDataSource.getDataSource("updateNewsPublishAlldepartment", { id: selectRows[0].id }, function (data) {
	                    $scope.saveTitle = "发布";
	                    alert('发布成功');
	                    $scope.loadSource();
	                    $scope.saveDisabled = false;
	                    $scope.cancel();
	                }, function (e) {
	                    $scope.saveTitle = "发布";
	                    alert('发布失败');
	                });
	            }

	        }
	        else {
	            alert('请选择要发布的数据');
	        }
	    }

	}]);