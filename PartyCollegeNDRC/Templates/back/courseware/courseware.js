angular.module("myApp")
.controller("coursewareController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', 'CommonService', function ($scope, $rootScope, getDataSource, $state, notify, $modal, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $(function () {
        //alert($(".row.form-horizontal").height());
        //var height=$('.navbar.navbar-static-top').height() + 60;
        //alert( document.documentElement.clientHeight);
        //CommonService.autoHeight([$('.navbar.navbar-static-top')], $("#nowGrid"));
    });

    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', width: '45%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>', headerCellClass: 'mycenter' },
          { name: '授课人', width: '10%', field: "teachersname", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '10%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '10%', field: "createtime", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
          { name: '选用次数', width: '10%', field: "cwcount", cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: "状态", width: '10%', field: "mainstatus", cellFilter: "coursewareStatusFilter", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
			//当为共享数据时，则不能被删除
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            	var msg = 'row selected ' + row.isSelected;
            	if (row.entity.isshare) {
            		row.isSelected = false;
            		notify({ message: '该课程为共享课程，不能被操作。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	}
            });
        }
    };
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.goDetial = function (row) {
        $state.go("index.coursewareEdit", { id: row.entity.id });
    }


    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
		
        var key="selectAllCourseware";
        if ($rootScope.user.platformcategory == 0) {
        	key="selectPlatformAllCourseware";
        }
        getDataSource.getList(key, { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();

    $scope.coursewareCategoryRoot = {};
    $scope.coursewareCategoryData = {};
    $scope.Category = {};
    $scope.coursewareMove = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {       
            //获取分类信息
            getDataSource.getDataSource("select_sy_courseware_category_root", {
                platformid: $rootScope.user.platformid
                }, function (data) {
                $scope.coursewareCategoryRoot = data;
                if (data != null && data != undefined && data.length > 0) {
                    $scope.Category.selectedCategoryRoot ="";
                    $scope.categoryRootChange();
                }
                $scope.modalInstance = $modal.open({
                    templateUrl: 'coursewaremoveinfo.html',
                    size: 'lg',
                    scope: $scope
                });
            }, function (data) {
                notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
    }

    $scope.categoryRootChange = function () {
        getDataSource.getDataSource("select_sy_courseware_categorybyfid", { fid: $scope.Category.selectedCategoryRoot, platformid: $rootScope.user.platformid }, function (data) {
            $scope.coursewareCategoryData = data;
            $scope.Category.selectedCategoryInfo = "";
            if (data != null && data != undefined && data.length > 0) {
                $scope.Category.selectedCategoryInfo ="";
            }
        }, function (data) {
            notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    };

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.coursewareMoveSave = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            var ids = "";
            for (var idx in selectRows) {
                if (ids != "")
                    ids += "," + selectRows[idx].id;
                else
                    ids = selectRows[idx].id;
            }
            if ($scope.Category.selectedCategoryRoot == "") {
            	notify({ message: '请选择分类！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	return;
            }
            if ($scope.Category.selectedCategoryInfo == "") {
                $scope.Category.selectedCategoryInfo = $scope.Category.selectedCategoryRoot;
            }
            getDataSource.getUrlData("../api/courseMove", {
                categoryids: ids, categoryid: $scope.Category.selectedCategoryInfo, rootCategoryid: $scope.Category.selectedCategoryRoot
            }, function (data) {
                if (data)
                    notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                else
                    notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
            }, function (errortemp) {
                notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
            });
        }
    };

    $scope.ok = function () {
    	$scope.isAccept = true;
    	var selectCourse = $scope.gridApi.selection.getSelectedRows();
    	var ids = "";
    	for (var idx in selectCourse) {
    		if (ids == "") {
    			ids = selectCourse[idx].id;
    		} else {
    			ids += "," + selectCourse[idx].id;
    		}
    	}
    	getDataSource.getUrlData("../api/courseMainStatus", {
    		coursewareids: ids, mainstatus: -2, operationuser: $rootScope.user.name, currentstep: "课件删除", userid: $rootScope.user.accountId,
    		nextstep: "结束", operationcontent: ($rootScope.user.name + "课件删除").toString(), laststatus: 0, deleteContent: ""
    	}, function (data) {
    		if (data) {
    			notify({ message: '删除成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    			$scope.loadGrid();
    		}
    		else
    			notify({ message: '删除失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    	}, function (errortemp) {
    		notify({ message: '删除失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    	});
    	$scope.close();
    }
	//关闭模式窗口
    $scope.close = function () {
    	$scope.modalInstance.dismiss('cancel');
    }

    //删除
    $scope.delete = function () {
    	$scope.modalInstance = $modal.open({
    		templateUrl: 'confirm.html',
    		size: 'sm',
    		scope: $scope
    	});
    }

	//导出目录
    $scope.ExportToc = function () {
    	window.location.href = "../api/outdoc";
    }
}]);