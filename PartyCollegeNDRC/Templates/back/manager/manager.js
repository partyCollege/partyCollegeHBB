
angular.module("myApp")
.controller("managerController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService', '$timeout', 'Base64',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService, $timeout, Base64) {

        //$scope.treeSearch = {
        //	departmentid: "",
        //	departmentname: "", 
        //};

        $scope.search = {};
        $scope.search_admin = {};

        $scope.haschild = false;

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null
        };

        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 100],
            paginationPageSize: 25,
            useExternalPagination: true,
            multiSelect: false,
            data: [],
            columnDefs: [
              { name: "序号", field: "rownum", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "用户", field: "name", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: "登录名", field: "logname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "职级", field: "rank", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "部门", field: "departmentname", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
               { name: '分级管理员', field: "usertype", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.usertype == 1 ? "是" :"否"}}</div>' }

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

        $scope.goSearch = function (flag) {

            if (!flag) { 
                $scope.gridOptionsAdmin.totalItems = 0;
                $scope.gridOptionsAdmin.data = [];
                $scope.gridOptionsAdmin.paginationCurrentPage = 1;
                $scope.loadGridAdmin();

                $scope.gridOptions.totalItems = 0;
                $scope.gridOptions.data = [];
                $scope.gridOptions.paginationCurrentPage = 1;
                $scope.loadGrid();
            } else if (flag == 1) {
                $scope.gridOptionsAdmin.totalItems = 0;
                $scope.gridOptionsAdmin.data = [];
                $scope.gridOptionsAdmin.paginationCurrentPage = 1;
                $scope.loadGridAdmin();
            }
            else if (flag == 2) {
                $scope.gridOptions.totalItems = 0;
                $scope.gridOptions.data = [];
                $scope.gridOptions.paginationCurrentPage = 1;
                $scope.loadGrid();
            }
        }
        $scope.departmentnode = {};
        //$scope.departmentname = "";
        $scope.loadGrid = function () { 
            if ($scope.departmentid == "") return;
            var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
            var pageSize = paginationOptions.pageSize;
            getDataSource.getList("getAllUserByDepartmentId", { pids: $scope.departmentnode.pids, departmentid: $scope.departmentnode.id }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
                $scope.gridOptions.totalItems = data[0].allRowCount;
                $scope.gridOptions.data = data[0].data;
            });
        }


        
        $scope.addAdmin = function () {
            $scope.addAdminInfo = {
                logname: "",
                password: ""
            };
            $scope.modalInstance = $modal.open({
                templateUrl: 'addAdmin.html',
                size: 'md',
                scope: $scope
            });


        }

        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        $scope.saveUser = function () {
            if (confirm("确定要将用户保存在该机构下面吗？")) {
                getDataSource.getUrlData('../api/InsertAccount', {
                    logname: $scope.addAdminInfo.logname,
                    pwd: Base64.encode($scope.addAdminInfo.password),
                    departmentid: $scope.departmentid,
                    departmentname: $scope.departmentname

                }, function (data) {
                    if (data.result) {
                        $scope.loadGrid();
                        notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        $scope.close();
                    }
                    else {
                        notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    }
                }, function (e) { })
            }
        }


        $scope.gridOptionsAdmin = {
            data: [],
            multiSelect: false,
            columnDefs: [
              { name: "序号", field: "rownum", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "用户", field: "name", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: "登录名", field: "logname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "职级", field: "rank", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "部门", field: "departmentname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: "分管部门", field: "mdepartmentname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApiAdmin = gridApi; 
            }
        };
        $scope.loadGridAdmin = function () {
            if ($scope.departmentid == "") return;
            getDataSource.getList("getAdminUserByDepartmentId", { pids: $scope.departmentnode.pids, departmentid: $scope.departmentnode.id }, { firstRow: 0, pageSize: 100 }, $scope.search_admin, paginationOptions.sort, function (data) {
                $scope.gridOptionsAdmin.totalItems = data[0].allRowCount;
                $scope.gridOptionsAdmin.data = data[0].data;
            });
        }


        $timeout(function () {
            $scope.loadGridAdmin();
        }, 1000);

        $timeout(function () {
            $scope.loadGrid();
        }, 2000);





        $scope.setAdminAttr = {
            isOpen: false,
            departmentId: "",
            departmentName:"",
            isSaving: false,
            change: function (flag) {
                this.isOpen = flag;
                this.departmentId = "";
                this.isSaving = false;
                if (flag) {
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo_admin");
                    var nodes = treeObj.getNodes();
                    if (nodes.length > 0) {
                        treeObj.expandNode(nodes[0], true, false, true);
                    }
                } else {
                    $.fn.zTree.getZTreeObj("treeDemo_admin").expandAll(false);
                }
            }
        }


        $scope.setAdmin = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                if (selectRows[0].usertype == "1") {
                    notify({ message: '设置失败，该用户已经是管理员了', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }
                $scope.setAdminAttr.change(true);
            }

          
        }

        $scope.saveSetAdmin = function (type) {
            $scope.setAdminAttr.isSaving = true;
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                var mess ="设置管理员"; 
                getDataSource.getDataSource(["insert_sy_account_roles", "updateUserTypeById"], {
                    accountid: selectRows[0].accountid,
                    userid: selectRows[0].id,
                    createuser: $rootScope.user.name,
                    usertype: 1,
                    departmentid: $scope.setAdminAttr.departmentId,
                    departmentname: $scope.setAdminAttr.departmentName,
                    accountid2: selectRows[0].accountid
                }, function (data) { 
                    notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.setAdminAttr.change(false);
                    $scope.setAdminAttr.isSaving = false; 
                    $scope.loadGrid();
                    $scope.loadGridAdmin();
                }, function (e) {
                    notify({ message: mess + '失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                })
            }
        }

        $scope.cacelAdmin = function () {

            var selectRows = $scope.gridApiAdmin.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) { 
            	var mess = "取消管理员";
            	getDataSource.getUrlData("../api/cancerMananger", { accountid: selectRows[0].accountid, userid: selectRows[0].id, usertype: 0, departmentid: selectRows[0].mdepartmentid }, function (data) {
            		if (data.code) {
            			notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            			$scope.loadGrid();
            			$scope.loadGridAdmin();
            		} else {
            			notify({ message: mess + '失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            		}
            	}, function (error) {
            		notify({ message: mess + '失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	});
                //getDataSource.getDataSource(["delete_sy_account_roles", "updateUserTypeById"], {
                //    accountid: selectRows[0].accountid,
                //    userid: selectRows[0].id, 
                //    usertype: 0,
                //    departmentid: selectRows[0].mdepartmentid,
                //    accountid2: selectRows[0].accountid
                //}, function (data) {
                //    $scope.loadGrid();
                //    $scope.loadGridAdmin();
                //    notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl }); 
                //}, function (e) {
                //    notify({ message: mess + '失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                //})
            }
        }


        //tree设置
        $scope.treeSetting_admin = {
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
            callback: {
                beforeClick: function () { },
                onClick: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo_admin");
                    var nodes = zTree.getSelectedNodes();
                    if (nodes.length > 0) {
                        $timeout(function () {
                            $scope.setAdminAttr.departmentId = nodes[0].id;
                            $scope.setAdminAttr.departmentName = nodes[0].name; 
                        }, 10);
                    }
                },
                onDblClick: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo_admin");
                    var nodes = zTree.getSelectedNodes();
                    if (nodes.length > 0) {
                        $timeout(function () {
                            $scope.setAdminAttr.departmentId = nodes[0].id; 
                            $scope.saveSetAdmin();
                        }, 10);
                    }
                }

            }
        };
         

        //获取部门数据
        $scope.getDepartmentArr = function () {

            $timeout(function () {
                getDataSource.getDepartmentAdmin(function (data) {
                    $scope.treeData = data;
                    $.fn.zTree.init($("#treeDemo_admin"), $scope.treeSetting_admin, $scope.treeData);
                }, function (error) { });

            }, 3000);
        }();

    }]);