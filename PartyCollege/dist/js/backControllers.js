angular.module("myApp")
.controller("alumnusCoursewareController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "name", width: '49%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '授课人', field: "teachersname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', field: "createtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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

    $scope.goDetial = function (row) {
        $state.go("index.coursewareEdit", { id: row.entity.coursewareid, type: "1" });
    }

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("alumnuscourseware-listall", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("delete_sy_alumnus_coursewarebycoursewareid", selectRows, function (data) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }
}]);
angular.module("myApp")
.controller("alumnusUserAddController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
	    $scope.accForm = new Object();
	    $scope.accForm.name = '';
	    $scope.accForm.companyaddress = '';
	    $scope.accForm.company = '';
	    $scope.accForm.cellphone = '';
	    $scope.accForm.idcard = '';
	    $scope.accForm.sex = 0;
	    $scope.accForm.id = '';

	    $scope.formInput = new Object();
	    $scope.formBtn = new Object();

	    var accid = $stateParams.id;

	    $scope.goToList = function () {
	        $state.go("index.alumnusUserlist");
	    }

	    if ($stateParams.id) {
	        getDataSource.getDataSource("select_sy_alumnus_studentbyid", { id: $stateParams.id }, function (data) {
	            $scope.accForm.id = data[0].id;
	            $scope.accForm.name = data[0].name;
	            $scope.accForm.companyaddress = data[0].companyaddress;
	            $scope.accForm.company = data[0].company;
	            $scope.accForm.cellphone = data[0].cellphone;
	            $scope.accForm.idcard = data[0].idcard;
	            $scope.accForm.sex = data[0].sex;
	        });
	    }

	    $scope.saveDisabled = false;
	    $scope.saveAccount = function () {
	    	$scope.saveDisabled = true;
	    	if ($scope.accForm.name == '') {
	            notify({ message: '请输入姓名！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            $scope.saveDisabled = false;
	            return;
	        }
	        if ($scope.accForm.idcard == '') {
	        	notify({ message: '请输入身份证！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	        	$scope.saveDisabled = false;
	            return;
	        }
	        if ($scope.accForm.cellphone == '') {
	        	notify({ message: '请输入联系方式！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	        	$scope.saveDisabled = false;
	            return;
	        }
	        getDataSource.getUrlData('../api/poststudent', $scope.accForm, function (datatemp) {
	        	if (datatemp.status == "success") {
	        		$scope.saveDisabled = false;
	                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	                $scope.goToList();
	        	} else {
	        		$scope.saveDisabled = false;
	                notify({ message: datatemp.errorMessage, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
	            }
	        }, function (errortemp) {
	        	$scope.saveDisabled = false;
	        });
	    }
	}
]);
angular.module("myApp")
.controller("alumnusUserEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    '$modal',
    "FilesService",
    '$state', '$filter', function ($scope, $rootScope, getDataSource, $stateParams, notify, $modal, FilesService, $state, $filter) {

        $scope.renewCardShow = false;
        $scope.user = {};
        $scope.gridOptions = {
            data: [],
            columnDefs: [
              { name: '序列号', field: "title", width: '28%' },
              { name: "有效时长", field: "enableddays", width: '19%' },
              { name: "开始时间", field: "begindate", width: '16%' },
              { name: "结束时间", field: "enddate", width: '16%' },
              { name: "操作人", field: "createuser", width: '20%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };


        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("select_sy_alumnus_accountbyid", { id: $stateParams.id }, function (data) {
                    $scope.user = data[0];
                    if ($scope.user.photo_serverthumbname != null && $scope.user.photo_serverthumbname != undefined && $scope.user.photo_serverthumbname != '')
                        $scope.user.filename = FilesService.showFile("userPhoto", $scope.user.photo_serverthumbname, $scope.user.photo_serverthumbname);
                    else
                        $scope.user.filename = "../img/default_img.png";
                    if ($scope.user.enddate != undefined) {
                        $scope.renewCardShow = true;
                    }
                });
                //获取序列号
                getDataSource.getDataSource("select_sy_alumnus_renew_logbystudentid", { studentid: $stateParams.id }, function (data) {
                    $scope.gridOptions.data = data;
                });

            }
        }();


        $scope.modalInstance = null;
        $scope.renew = {};
        //续费
        $scope.getRenewCard = function () {
            getDataSource.getUrlData('../api/getRenewCard', { id: $stateParams.id }, function (datatemp) {
                $scope.renew = datatemp;
                $scope.modalInstance = $modal.open({
                    templateUrl: 'renewcard.html',
                    size: 'lg',
                    scope: $scope
                });
            }, function (errortemp) {

            });
        }

    	//续费
        $scope.saveDisabled = false;
        $scope.saveRenewCard = function () {
        	$scope.saveDisabled = true;
        	$scope.renew.studentid = $stateParams.id;
            $scope.renew.studentname = $scope.user.name;
            $scope.renew.createuser = $rootScope.user.name;
            $scope.renew.createuserid = "";
            getDataSource.getUrlData('../api/RenewCard', $scope.renew, function (datatemp) {
            	if (datatemp.status == "success") {
            		$scope.saveDisabled = false;
                    notify({ message: '续费成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    getDataSource.getDataSource("select_sy_alumnus_renew_logbystudentid", { studentid: $stateParams.id }, function (data) {
                        $scope.gridOptions.data = data;
                    });
                }
            	else {
            		$scope.saveDisabled = false;
                    notify({ message: '续费失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }, function (errortemp) {
            	$scope.saveDisabled = false;
            });
        }

        $scope.$watch("renew.begindate", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });
        $scope.$watch("renew.reffectivetime", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });
        $scope.$watch("renew.reffectiveunit", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });

        $scope.format = function (date, format) {
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }

        $scope.changeDate = function () {
            var date = new Date($filter('date')($scope.renew.begindate, "yyyy-MM-dd"));
            if ($scope.renew.reffectiveunit == 0) {
                date.setFullYear(date.getFullYear() + parseInt($scope.renew.reffectivetime))
            }
            else {
                date.setMonth(date.getMonth() + parseInt($scope.renew.reffectivetime))
            }
            date.setDate(date.getDate() - 1);
            $scope.renew.enddate = $scope.format(date, 'yyyy-MM-dd');
        }

        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        }
        $scope.goToList = function () {
            $state.go("index.alumnusUserlist");
        }


    }
]);
angular.module("myApp")
.controller("alumnusUserlistController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
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
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '姓名', field: "name", width: '24%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAddUser(row)">{{row.entity.name}}</a></div>' },
          { name: "登录名", field: "logname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "手机号码", field: "cellphone", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "身份证号码", field: "idcard", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '续费', width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">续费</a></div>' },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $scope.loadSource();
            });
        }
    };

    $scope.loadSource = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_alumnus_account", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadSource();

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource();
    }

    $scope.goAddUser = function (row) {
        $state.go("index.alumnusUserAdd", { id: row.entity.id });
    }

    $scope.goDetial = function (row) {
        $state.go("index.alumnusUserEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_alumnus_student", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}]);






angular.module("myApp")
.controller("cardEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.card = {};
        $scope.serialShow = false;
        $scope.cardid = $stateParams.id;
        $scope.opationConfig = {
            saveCardShow: true,
            serialCardShow: false,
            useCardShow: false,
            exportCardShow: false,
            useCardExitShow: false
        }

        $scope.gridOptions = {
            data: [],
            columnDefs: [
              { name: '序列号', field: "serialno", width: '25%' },
              { name: "有效时长", width: '19%', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.card.effectivetime}}{{grid.appScope.card.effectiveunitcn}}</div>' },
              { name: "状态", field: "statuscn", width: '15%' },
              { name: "开始时间", field: "begindate", width: '16%' },
              { name: "结束时间", field: "enddate", width: '12%' },
              { name: "使用用户", field: "studentname", width: '10%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.dataload = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("select_sy_alumnus_card_byid", { id: $stateParams.id }, function (data) {
                    $scope.card = data[0];
                    //获取序列号
                    if ($scope.card.state == 1) {
                        $scope.opationConfig.saveCardShow = false;
                        $scope.opationConfig.exportCardShow = true;
                        $scope.opationConfig.useCardExitShow = true;
                    }
                    else {
                        $scope.opationConfig.useCardShow = true;
                        $scope.opationConfig.serialCardShow = true;
                    }
                    getDataSource.getDataSource("select_sy_alumnus_serial", { pid: $stateParams.id }, function (data) {
                        if (data.length > 0) {
                            $scope.opationConfig.serialCardShow = false;
                            $scope.serialShow = true;
                            $scope.gridOptions.data = data;
                        }
                    });
                });
            }
        };

        $scope.dataload();

    	//生成序列号
        $scope.saveDisabled = false;
        $scope.serialCard = function () {
        	$scope.saveDisabled = true;
        	if ($stateParams.id) {
                getDataSource.getUrlData("../api/serialcard", {
                    id: $stateParams.id, enableddays: $scope.card.effectivetime,
                    dayuint: $scope.card.effectiveunit, createuser: $rootScope.user.name, sequenceCount: $scope.card.sequencecount
                }, function (data) {
                	$scope.saveDisabled = false;
                	$scope.opationConfig.serialCardShow = false;
                    getDataSource.getDataSource("select_sy_alumnus_serial", { pid: $stateParams.id }, function (data) {
                        if (data.length > 0) {
                            $scope.opationConfig.serialCardShow = false;
                            $scope.serialShow = true;
                            $scope.gridOptions.data = data;
                        }
                    });
                }, function (errortemp) {
                	$scope.saveDisabled = false;
                });
            }
        }

        //导出
        $scope.exportCard = function () {
            if ($stateParams.id) {
                window.location = "../api/exportcard/" + $stateParams.id + "/" + $scope.card.name;
            }
        }

    	//保存
        $scope.saveDisabled = false;
        $scope.saveCard = function () {
        	$scope.saveDisabled = true;
            if ($scope.card.name == "" || $scope.card.name == undefined || $scope.card.name == null) {
                notify({ message: '批次名称不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveDisabled = false;
                return;
            }
            if ($scope.card.effectivetime == undefined || $scope.card.effectiveunit == undefined) {
            	notify({ message: '请选择有效时长！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.courselength == "" || $scope.card.courselength == undefined || $scope.card.courselength == null) {
            	notify({ message: '课程数为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.price == "" || $scope.card.price == undefined || $scope.card.price == null) {
            	notify({ message: '价格不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.sequencecount == "" || $scope.card.sequencecount == undefined || $scope.card.sequencecount == null) {
            	notify({ message: '序列号数不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($stateParams.id) {
                var msg = '保存成功';
                getDataSource.getDataSource("save_sy_alumnus_card", $scope.card, function (data) {
                	$scope.saveDisabled = false;
                    notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (error) { $scope.saveDisabled = false; });
            }
            else {
                var newid = getDataSource.getGUID();
                $scope.card.id = newid;
                getDataSource.getDataSource("insert_sy_alumnus_card", $scope.card, function (data) {
                	$scope.saveDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.cardEdit", { id: newid });
                }, function (error) { $scope.saveDisabled = false; });
            }
        }

        //制卡
        $scope.useCard = function () {
            getDataSource.getDataSource("use_sy_alumnus_card", { useuserid: $rootScope.user.accountId, state: 1, userusername: $rootScope.user.name, id: $scope.card.id, pid: $scope.card.id }, function (data) {
                notify({ message: '制卡成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.dataload();
            });
        }

        //作废
        $scope.useCardExit = function () {
            getDataSource.getDataSource("use_sy_alumnus_card_zh", { useuserid: $rootScope.user.accountId, state: -1, userusername: $rootScope.user.name, id: $scope.card.id, pid: $scope.card.id }, function (data) {
                notify({ message: '作废成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.dataload();
            });
        }

        $scope.goToList = function () {
            $state.go("index.cardList");
        }

        $scope.inputKeyDown = function (e) {
            var ss = window.event || e;
            if (!((ss.keyCode > 47 && ss.keyCode < 58) || ss.keyCode == 8)) {
                ss.preventDefault();
            }
        }
    }
]);
angular.module("myApp")
.controller("cardListController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '批次名称', field: "name", width: '39%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: "有效时长", field: "effectivetime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.effectivetime}}{{row.entity.effectiveunicn}}</div>' },
          { name: "课程数", field: "courselength", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "价格", field: "price", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "序列号数", field: "sequencecount", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "状态", field: "statecn", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.loadSource = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_alumnus_card", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadSource();

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource();
    }

    $scope.goDetial = function (row) {
        $state.go("index.cardEdit", { id: row.entity.id }); 
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_alumnus_card", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}]);






angular.module("myApp")
.controller("renewlogController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '序列号', field: "title", width: '29%', headerCellClass: 'mycenter' },
          { name: "有效时长", field: "enableddays", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "开始时间", field: "begindate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "结束时间", field: "enddate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "使用用户", field: "studentname", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建时间", field: "createdate", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "操作人", field: "createuser", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.loadSource = function () {

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_alumnus_renew_log", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadSource();

    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadSource();
    }


    $scope.goDetial = function (row) {
        $state.go("index.cardEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_alumnus_card", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}]);






angular.module("myApp")
.controller("selectCoursewareController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '课程名称', field: "name" },
          { name: '授课人', field: "teachersname" },
          { name: '授课时间', field: "teachtime" }
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
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("selectcourseware-listall", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    $scope.saveAlumnusCourseware = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            var ids = "";
            for (var idx in selectRows) {
                if (ids == "")
                    ids = selectRows[idx].id;
                else {
                    ids += "," + selectRows[idx].id;
                }
            }
            getDataSource.getUrlData('../api/saveAlumnusCourseware', { createuser: $rootScope.user.name, createuserid: $rootScope.user.accountId, ids: ids }, function (datatemp) {
                if (datatemp.status == "success") {
                    notify({ message: '保存成功，共新增' + selectRows.length + '条记录！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.alumnusCourseware", {});
                }
                else {
                    notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            });
        }
    }
}]);
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
angular.module("myApp")
.controller("accountEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.accForm = new Object();
		$scope.accForm.rolelist = new Array();
		$scope.accForm.name = '';
		$scope.accForm.logname = '';
		$scope.accForm.pwd = '';
		$scope.accForm.cellphone = '';
		$scope.accForm.idcard = '';
		$scope.accForm.accountid = '';

		$scope.formInput = new Object();
		$scope.formInput.lognameDisabled = true;
		$scope.formInput.pwdDisabled = true;
		$scope.formInput.idcardDisabled = true;
		$scope.formInput.nameDisabled = true;
		$scope.formInput.cellphoneDisabled = true;

		$scope.formBtn = new Object();
		$scope.formBtn.saveButtonDisabled = false;

		var accid = $stateParams.id;
		if (accid != "") {
			$scope.accForm.accountid = accid;
			getDataSource.getDataSource(["getAccountById", "getAccountRole"], { accid: accid }, function (data) {
				$scope.accForm = _.find(data, { name: "getAccountById" }).data[0];
				$scope.accForm.accountid = accid;
				$scope.accForm.pwd = '******';

				var accroles = _.find(data, { name: "getAccountRole" }).data;

				var roles = _.filter(accroles, { accountid: accid });
				var roletemp = new Object();
				var rolearray = new Array();
				var length = roles.length;
				for (var i = 0; i < length; i++) {
					roletemp = new Object();
					roletemp.id = roles[i].id;
					roletemp.name = roles[i].name;
					roletemp.platformname = roles[i].platformname;
					rolearray.push(roletemp);
				}
				$scope.accForm.rolelist = rolearray;

			}, function (errortemp) { });
		}
		//else {
		//	$scope.accForm.lognameDisabled = false;
		//	$scope.accForm.pwdDisabled = false;
		//}

		getDataSource.getDataSource("getRoleList", { platformid: $rootScope.user.platformid}, function (data) {
			var roletemp = new Object();
			var rolearray = new Array();
			var length = data.length;
			for (var i = 0; i < length; i++) {
				roletemp = new Object();
				roletemp.id = data[i].id;
				roletemp.name = data[i].name;
				roletemp.platformname = data[i].platformname;
				rolearray.push(roletemp);
			}
			$scope.roles = rolearray;
		}, function (errortemp) { });

		$scope.goToList = function () {
			$state.go("index.account");
		}

		$scope.saveAccount = function () {
			$scope.saveButtonDisabled = true;
			getDataSource.getUrlData('../api/account/SaveAccount', $scope.accForm, function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}
]);
app.controller("importaccController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource', 'CommonService'
, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, CommonService) {
	$scope.acclist = new Array();
	$scope.textareastr = '';
	$scope.disableBtn = false;
	$scope.errorlist = new Array();
	$scope.importAccount = function () {
		$scope.disableBtn = true;
		$scope.beginLoading = !$scope.beginLoading;
		var data = $scope.textareastr.replace(new RegExp(/(	)/g), ',');
		var dataarray = data.split('\n');
		var length = dataarray.length;
		var datarow = new Array();
		//var submitrow = new Object();
		var submitdata = new Array();
		for (var i = 0; i < length; i++) {
			datarow = dataarray[i].split(',');
			datarow[2]=md5(datarow[2]);
			submitdata.push(datarow);
		}

		getDataSource.getUrlData("../api/account/importAccount", { submitdata: submitdata }, function (datatemp) {
			$scope.disableBtn = false;
			$scope.beginLoading = false;
			if (datatemp.code == "success") {
				CommonService.alert(datatemp.message);
				//console.log(datatemp.errorlist);
				$scope.errorlist = datatemp.errorlist;
			} else {
				CommonService.alert(datatemp.message);
			}
		}, function (errortemp) {
			
			$scope.disableBtn = false;
			CommonService.alert("注册失败");
		});
	}
}]);
angular.module("myApp")
.controller("addbookController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    '$modal',
    '$timeout',
    '$state',
    'notify',
    "FilesService", 'DateService', function ($scope, $rootScope, getDataSource, $stateParams, $modal, $timeout, $state, notify, FilesService, DateService) {

        $scope.book = {
            defaultCover: "../img/defaultcover.jpg",
            coverObj: null,
            cover_servername: null,
            cover_serverthumbname: null,
            bookname: "",
            author: "",
            comment: "",
            foreword: "",
            authorcomment: "",
            catalog: "",
            publishtime: "",
            publishcompany: "",
            videopath: "",
            videoname:"",
            status: 0,
            istop:false,
            platformid: $rootScope.user.platformid,
            id: getDataSource.getGUID()
        };



        $scope.videofile = {
            files: [], 
            process: 0
        };

        //操作状态
        $scope.optstatus = {
            issuccess: false,//视频是否上传成功
            issave: false,//是否保存,
            iscoverchanged: false,//图书封面是否改变 
        };

        var sid = $stateParams.id; 
        if (sid) {
            $scope.optstatus.ismodify = true;

            getDataSource.getDataSource("getBookInfo", {id : sid}, function (data) {
                $scope.book = _.merge($scope.book, data[0]);
                $scope.book.coverObj = FilesService.showFile("bookPhoto", $scope.book.cover_servername, $scope.book.cover_servername);
                $scope.book.istop = $scope.book.istop == 0 ? false : true;
                $scope.optstatus.issave = true;
                $scope.optstatus.issuccess = true;

            }, function (e) { CommonService.alert("数据加载失败！"); });
        }

        var popupAlert = function (msg) { 
            notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }

        //选择图书封面
        $scope.changedCover = function (files, errors) {

            if (files.length > 0) {
                if ($scope.book.coverObj) {
                    $scope.optstatus.iscoverchanged = true;
                }
                $scope.book.coverObj = files[0];
            }

        }
        //选择视频
        $scope.uploadvideoFiles = function (files, errors) {

            if (files.length > 0) {
                $scope.videofile.files = files;
            }

        }

        //上传视频文件
        $scope.uploadvideo = function () {
            if ($scope.videofile.files.length > 0) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec($scope.videofile.files.name)[1];
                var options = {
                    endpoint: 'http://v.polyv.net:1080/files/',
                    resetBefore: $('#reset_before').prop('checked'),
                    resetAfter: false,
                    title: "title",
                    desc: "desc",
                    ext: ext,
                    writeToken: $rootScope.appConfig.vhallConfig.writeToken
                };


                $('.progress').addClass('active');

                upload = polyv.upload($scope.videofile.files[0], options)
              .fail(function (error) {
                  alert('Failed because: ' + error);
              })
              .always(function () {
                  //$input.val('');
                  //$('.js-stop').addClass('disabled');
                  //$('.progress').removeClass('active');
              })
              .progress(function (e, bytesUploaded, bytesTotal) {
                  var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                  //$('.progress .bar').css('width', percentage + '%');
                  $scope.videofile.process = percentage;
                  $scope.$apply();
                  //console.log(bytesUploaded, bytesTotal, percentage + '%');
              })
              .done(function (url, file) {
                  $scope.optstatus.issuccess = true;
                  $scope.book.videoname = file.name;
                  $scope.book.videopath = url.substring(url.lastIndexOf("/") + 1);  
                  $scope.$apply();
              });
            }
        }
        //关闭弹出窗口
        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //视频预览
        $scope.openVideoPerview = function () {
            $scope.modalInstance = $modal.open({
                templateUrl: 'videoPerview.html',
                size: 'lg',
                scope: $scope,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $timeout(function () {
                player = polyvObject('#divVideo').videoPlayer({
                    'width': '850',
                    'height': '490',
                    'vid': $scope.book.videopath
                });

            }, 0);
        }

        //回到列表
        $scope.golist = function () {
            $state.go("index.booklist");
            //$scope.videofile.issuccess = !$scope.videofile.issuccess;
        }

        //上传图书封面
        $scope.uploadCover = function (callaback) {

            FilesService.upLoadPicture($scope.book.coverObj, { upcategory: "bookPhoto", width: 130, height: 184 }, function (data) {
                //上传成功，并且服务器返回有数据
                if (data.status == "200" && data.data.length >= 1) {

                    var fArr = data.data[0].servername.split(".");
                    $scope.book.cover_serverthumbname = fArr[0] + "_small." + fArr[1];
                    $scope.book.cover_servername = fArr[0] + "." + fArr[1];
                    $scope.optstatus.iscoverchanged = false;

                    if (callaback) {
                        callaback();
                    }
                } else {
                    CommonService.alert("教材封面照片上传失败");
                }
            });
        }

    	//保存
        $scope.saveDisabled = false;
        $scope.save = function () {
        	$scope.saveDisabled = true;

            var dosave = function () {

                $scope.book.createuser = $rootScope.user.name;
                $scope.book.createdate = DateService.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                $scope.book.status = 1;
                var exec = !$scope.optstatus.issave ? "back_savebook" : "back_updatebook";
                getDataSource.getDataSource(exec, $scope.book, function (data) {
                	$scope.saveDisabled = false;
                    if (data && data[0].crow > 0) {
                        $scope.optstatus.issave = true;
                        popupAlert("保存成功！");
                    }

                }, function (e) {
                	$scope.saveDisabled = false;
                    popupAlert("保存失败！");
                });
            }

            if ($scope.optstatus.iscoverchanged) {
                $scope.uploadCover(function () { dosave(); });
            } else {
                dosave();
            }
        }

        //发布
        $scope.submit = function () {

            $scope.book.publishuser = $rootScope.user.name;
            $scope.book.publishdate = DateService.format(new Date(), "yyyy-MM-dd hh:mm:ss");
            $scope.book.status = 1;

            getDataSource.getDataSource("back_submitbook", $scope.book, function (data) {

                if (data && data[0].crow > 0) {
                    popupAlert("发布成功！");
                    //$scope.golist();
                }

            }, function (e) {
                popupAlert("发布失败！");
            });

        }

        $scope.cancelsubmit = function () {

            $scope.book.publishuser = null;
            $scope.book.publishdate = null;
            $scope.book.status = 0;

            getDataSource.getDataSource("back_cancelsubmitbook", { id: $scope.book.id }, function (data) {

                if (data && data[0].crow > 0) {
                    popupAlert("取消发布成功！"); 
                }

            }, function (e) {
                popupAlert("取消发布失败！");
            });
        }
    }
]);





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
angular.module("myApp")
.controller("attachController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService','DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
        var coursewareid = $stateParams.id;
        $scope.maxorderby = 0;
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
              { name: "序号", field: "orderby", width: '5%' },//ng-click="grid.appScope.goDetial(row)"
            { name: '资料名称', field: "attach_clientname", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.attach_servername, row.entity.attach_clientname, \'classAttach\')">{{row.entity.attach_clientname}}</a></div>' },
              { name: "创建人", field: "username", width: '15%' },
              { name: "创建时间", field: "createtime", width: '15%' },
              { name: "状态", field: "status", width: '15%' },
              

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("selectAttachByCid", { coursewareid: coursewareid }, function (data) {
                $scope.gridOptions.data = data;
                $scope.maxorderby = data.length;
            });
        }
        $scope.loadSource();


        //打开课程资料窗口
        $scope.oepnAD = function (row) {
            //是否是新增课程资料
            if (row) {
                //$scope.newst = false;
                //$scope.st = row.entity;
                //getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                //    $scope.answers = data;
                //});
            }
            else {
                //$scope.newst = true;
                //$scope.st = {};
                //$scope.answers = [];
                //新增
                $scope.classattachInfo = {
                    id: '',
                    attach_clientname: '',
                    attach_servername: '',
                    createtime: DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    status: 0,
                    createuser: $rootScope.user.accountId,
                    coursewareid: coursewareid,
                    orderby: $scope.maxorderby+1
                };
                $scope.selectFile = null;
            }
            $scope.modalInstance = $modal.open({
                templateUrl: 'AttachDetail.html',
                size: 'lg',
                scope: $scope
            });
        }


        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //下载文件
        $scope.downFiles = function (attachservername, attachname, type) {
            return FilesService.downFiles(type, attachservername, attachname);
        }

        $scope.selectFiles = function (files) {
            if (files && files.length > 0) {
                //当前选择的文件
                var strlist = files[0].name.split('.');
                if (_.indexOf($rootScope.appConfig.attachTypes, strlist[strlist.length - 1]) < 0) {
                    notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
                else {
                    $scope.selectFile = files[0];
                    //console.log($scope.selectFile);
                }
            }
        };

        $scope.saveAttachDisabled = false;
        $scope.Addattach = function () {
        	$scope.saveAttachDisabled = true;
        	if ($scope.classattachInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadFiles($scope.selectFile, "classAttach", function (data) {
                       
                        var newid = getDataSource.getGUID();
                        $scope.classattachInfo.id = newid;
                        //$scope.classattachInfo.attach_clientname = escape(data.data[0].filename);
                        $scope.classattachInfo.attach_clientname = $scope.selectFile.name;
                        $scope.classattachInfo.attach_servername = data.data[0].servername;
                      

                        getDataSource.getDataSource("insertCoursewareAttach", $scope.classattachInfo, function (data) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                            $scope.loadSource();
                            $scope.modalInstance.dismiss('cancel');
                            $scope.saveAttachDisabled = false;
                            //$state.go("index.newsEdit", { id: newid });
                        });


                    }, function (error) {
                    	$scope.saveAttachDisabled = false;
                        notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                }
                else {
                	$scope.saveAttachDisabled = false;
                    notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        	else {
        		$scope.saveAttachDisabled = false;
                notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }

        //发布
        $scope.publish = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("publishCoursewareAttach", selectRows, function (data) {
                    notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deleteCoursewareAttach", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);
//angular.module("myApp")
//.controller("blackboardController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
//    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
//        var classid = $stateParams.id;


//        //黑板报
//        $scope.myInterval = 5000;
//        //var slideblackboard =
//        $scope.slideblackboard = [];
//        $scope.slideblackboardEdit = [];
//        $scope.addSlide = function () {
//            getDataSource.getDataSource("getClassBloackBoard", { classid: classid }, function (datatemp) {
//                $scope.slideblackboard = [];
//                if (datatemp.length <= 0) {
//                    $scope.slideblackboard.push({ id: new Date().getTime(), blackboardimg: "", src: '../img/myClass_banner.jpg', sortnum: 1 });
//                }
//                for (var i = 0; i < datatemp.length; i++) {
//                    var blackboardimg = FilesService.showFile("blackboard", datatemp[i].boardimg_servername, datatemp[i].boardimg_servername);
//                    $scope.slideblackboard.push({
//                        id: datatemp[i].id,
//                        blackboardimg: datatemp[i].boardimg_servername,
//                        src: blackboardimg,
//                        sortnum: datatemp[i].sortnum
//                    });
//                }
//                $scope.slideblackboardEdit = angular.copy($scope.slideblackboard);

//            }, function (errortemp) { });
//        }
//        $scope.addSlide();
//    }]);



angular.module("myApp")
.controller("blackboardController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
        var classid = $stateParams.id;
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
            { name: '照片名称', field: "boardimg_clientname", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.boardimg_servername, row.entity.boardimg_clientname, \'blackboard\')">{{row.entity.boardimg_clientname}}</a></div>' },
              { name: "创建人", field: "createuser", width: '25%' },
              { name: "创建时间", field: "createtime", width: '20%' }


            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("getAllblackboard", { classid: classid }, function (data) {
                $scope.gridOptions.data = data;
            });
        }
        $scope.loadSource();


        $scope.oepnAD = function (row) {

            $scope.blackboardInfo = {
                id: '',
                boardimg_clientname: '',
                boardimg_servername: '',
                createuser: $rootScope.user.name,
                classid: classid
            };
            $scope.selectFile = null;

            $scope.modalInstance = $modal.open({
                templateUrl: 'AttachDetail.html',
                size: 'lg',
                scope: $scope
            });
        }


        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //下载文件
        $scope.downFiles = function (attachservername, attachname, type) {
            return FilesService.downFiles(type, attachservername, attachname);
        }

        $scope.selectFiles = function (files, errorfiles) {
            if (files && files.length > 0) {

                if (errorfiles && errorfiles.length > 0) {
                    notify({ message: "您选择的" + errorfiles.length.toString() + "张图片可能超过了大小限制,无法上传,单张图片最大为2MB", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }


                if ($scope.gridOptions.data.length > 5 || ($scope.gridOptions.data.length + files.length) > 5) {
                    notify({ message: "最多只能上传5张图片", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                } else {
                    $scope.selectFile = files[0];
                }

            }
        };

        $scope.saveAttachDisabled = false;
        $scope.Addattach = function () {
            $scope.saveAttachDisabled = true;
            if ($scope.blackboardInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadPicture($scope.selectFile, { upcategory: "blackboard", width: 640, height: 400 }, function (data) {

                        var newid = getDataSource.getGUID();
                        $scope.blackboardInfo.id = newid;
                        $scope.blackboardInfo.boardimg_clientname = $scope.selectFile.name;
                        $scope.blackboardInfo.boardimg_servername = data.data[0].servername;


                        getDataSource.getDataSource("insert_sy_blackboard", $scope.blackboardInfo, function (data) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                            $scope.loadSource();
                            $scope.modalInstance.dismiss('cancel');
                            $scope.saveAttachDisabled = false;
                            //$state.go("index.newsEdit", { id: newid });
                        });


                    }, function (error) {
                        $scope.saveAttachDisabled = false;
                        notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                }
                else {
                    $scope.saveAttachDisabled = false;
                    notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
            else {
                $scope.saveAttachDisabled = false;
                notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }


        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("delete_sy_blackboard", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);
angular.module("myApp")
.controller("classAttachController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService','DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
        var classid = $stateParams.id;
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
            { name: '资料名称', field: "attach_clientname", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.attach_servername, row.entity.attach_clientname, \'classAttach\')">{{row.entity.attach_clientname}}</a></div>' },
              { name: "创建人", field: "username", width: '20%' },
              { name: "发布时间", field: "publishtime", width: '15%' },
              { name: "状态", field: "status", width: '15%' },
              

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("selectClassAttachByCid", { classid: classid }, function (data) {
                $scope.gridOptions.data = data;
            });
        }
        $scope.loadSource();


        //打开课程资料窗口
        $scope.oepnAD = function (row) {
            //是否是新增课程资料
            if (row) {
                //$scope.newst = false;
                //$scope.st = row.entity;
                //getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                //    $scope.answers = data;
                //});
            }
            else {
                //$scope.newst = true;
                //$scope.st = {};
                //$scope.answers = [];
                //新增
                $scope.classattachInfo = {
                    id: '',
                    attach_clientname: '',
                    attach_servername: '',
                    status: 0,
                    createuser: $rootScope.user.name,
                    classid: classid
                };
                $scope.selectFile = null;
            }
            $scope.modalInstance = $modal.open({
                templateUrl: 'AttachDetail.html',
                size: 'lg',
                scope: $scope
            });
        }


        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //下载文件
        $scope.downFiles = function (attachservername, attachname, type) {
            return FilesService.downFiles(type, attachservername, attachname);
        }

        $scope.selectFiles = function (files) {
            if (files && files.length > 0) {
                //当前选择的文件
                var strlist = files[0].name.split('.');
                if (_.indexOf($rootScope.appConfig.attachTypes, strlist[strlist.length - 1]) < 0) {
                    notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
                else {
                    $scope.selectFile = files[0];
                    //console.log($scope.selectFile);
                }
            }
        };

        $scope.saveAttachDisabled = false;
        $scope.Addattach = function () {
        	$scope.saveAttachDisabled = true;
        	if ($scope.classattachInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadFiles($scope.selectFile, "classAttach", function (data) {
                       
                        var newid = getDataSource.getGUID();
                        $scope.classattachInfo.id = newid;
                        //$scope.classattachInfo.attach_clientname = escape(data.data[0].filename);
                        $scope.classattachInfo.attach_clientname = $scope.selectFile.name;
                        $scope.classattachInfo.attach_servername = data.data[0].servername;
                      

                        getDataSource.getDataSource("insertClassCoursewareAttach", $scope.classattachInfo, function (data) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                            $scope.loadSource();
                            $scope.modalInstance.dismiss('cancel');
                            $scope.saveAttachDisabled = false;
                            //$state.go("index.newsEdit", { id: newid });
                        });


                    }, function (error) {
                    	$scope.saveAttachDisabled = false;
                        notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                }
                else {
                	$scope.saveAttachDisabled = false;
                    notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        	else {
        		$scope.saveAttachDisabled = false;
                notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }

        //发布
        $scope.publish = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("publishClassCoursewareAttach", selectRows, function (data) {
                    notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deleteClassCoursewareAttach", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);
angular.module("myApp")
.controller("classeditController", ['$previousState', '$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', "$window", '$timeout', function ($previousState, $rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter, $window, $timeout) {
	$scope.class = {};
	$scope.class.studentnum = 0;
	$scope.class.comment = "";
	$scope.class.signupstatus = 0;
	$scope.isedit = false;
    
	if ($stateParams.id)
	    $scope.isedit = true;
	else {
	    var mid = $rootScope.user.mdepartmentId;
	    if ($rootScope.user.usertype == 2) {
	        mid = $rootScope.user.departmentId;
	    }
	    $scope.class.departmentid = mid;
	}


    var previous = $previousState.get();
    $previousState.memo("caller");
    $scope.goback = function () {
        $state.go("index.classlist", {}, {reload:false});
    }
    $scope.goCourse = function () {
        if ($stateParams.id) {
            $state.go("index.classedit", { id: $stateParams.id });
        }
        else {
            $state.go("index.classedit");
        }
    }
    var padLeft = function (number, length, char) {
        return (Array(length).join(char || "0") + number).slice(-length);
    };
    $scope.goCourseList = function (nowtype) {
        var nowRouter = "";
        switch (nowtype) {
            case 0: nowRouter = "index.classedit.bxk"; break;
            //case 1: nowRouter = "index.classedit.xxk"; break;
            //case 2: nowRouter = "index.classedit.aljx"; break;
            //case 3: nowRouter = "index.classedit.khjz"; break;
            case 4: nowRouter = "index.classedit.student"; break;
            case 5: nowRouter = "index.classedit.classattach"; break;
            case 6: nowRouter = "index.classedit.blackboard"; break;
        }
        $state.go(nowRouter, { type: nowtype });
    }
    $scope.saveButtonDisabled = false;
    $scope.load = function () {

        if ($stateParams.id) {
            getDataSource.getDataSource("selectClassById", { id: $stateParams.id }, function (classdata) {
                $timeout(function () {
                    $scope.class = classdata[0];
                    $("#txtdepartment").val($scope.class.departmentname);
                },200);
            });

            $scope.nowid = $stateParams.id;
        }
    }();

    $scope.save = function () {
        var classid = getDataSource.getGUID();
        if ($stateParams.id) {
            classid = $stateParams.id;
        }
        $scope.saveButtonDisabled = true;
        
        //var mid = $rootScope.user.mdepartmentId;
        //if ($rootScope.user.usertype == 2) {
        //    mid = $rootScope.user.departmentId;
        //}
        //$scope.class.departmentid = mid;

        //$scope.class.departmentid = $rootScope.user.departmentId;;
        if ($stateParams.id) {
            getDataSource.getDataSource("updateClassById", $scope.class, function (data) {
            	$scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function () {
                $scope.saveButtonDisabled = false;
                notify({ message: '保存失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
        else {
            $scope.class.id = classid;
            $scope.class.status = 0;
            getDataSource.getDataSource("insertClass", $scope.class, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
                $state.go("index.classedit", { id: classid });
            });
        }
    }
}]);
angular.module("myApp")
.controller("classlistController", ['$rootScope', '$scope', 'getDataSource', "$state", "notify", function ($rootScope, $scope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.node = {};
    $scope.node.selectNode = {};
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '班级名称', field: "name", width: '35%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '年份', field: "starttime", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.starttime|date:"yyyy"}}</div>' },
          { name: "起始时间", field: "starttime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
          { name: "结束时间", field: "endtime", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
		  { name: "班级人数", field: "studentnum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
		  { name: "所属机构", field: "departmentname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
			//删除班级时，需要清空sy_account表里的defaultclassid字段。
            getDataSource.doArray(["delete_classById"], selectRows, function (data) {
                $scope.loadGrid();
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }
    $scope.goDetial = function (row) {
        $state.go("index.classedit", { id: row.entity.id });
    }
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid(1);
    }
    $scope.loadGrid = function (init) {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
		//初始化按机构查询
        $scope.search.departmentid_dbcolumn = "departmentid";
        $scope.search.departmentid_dbtype = "string";
        $scope.search.departmentid_handle = "like";

        //console.log("$rootScope.user", $rootScope.user);
        if (init == 0) {
            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            $scope.search.departmentid = mid;
        } else {
            $scope.search.departmentid = $scope.search.departmentid;
        }
        //console.log("$scope.search", $scope.search);
        getDataSource.getList("selectClassList", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }
			, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
			}, function (error) {
			    //console.log(error);
			});
    }
    $scope.loadGrid(0);

    //$scope.selectnode = function (node) {
    //    $scope.search.departmentid = node.id;  
    //}


}]);
angular.module("myApp")
.controller("classCourseController", ['$rootScope','$http', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", "smsService", function ($rootScope,$http, $scope, getDataSource, $state, $stateParams, $modal, notify, smsService) {
    $scope.class = { forAddCourse: [] };
    $scope.zhname = "必修课";
    $scope.copyCategory = { xxk: false, bxk: false, aljx: false };
    $scope.initTable = function () {
        getDataSource.getDataSource("selectClassCourseware", { classid: $stateParams.id, category: $stateParams.type }, function (gridData) {
            $scope.gridOptions.data = gridData;
        });
    }
    $scope.load = function () {
        switch ($stateParams.type) {
            case 0: $scope.zhname = "必修课"; break;
            case 1: $scope.zhname = "选修课"; break;
            case 2: $scope.zhname = "案例教学"; break;
        }
        getDataSource.getDataSource("selectCoursewareForClass", { platformid: $rootScope.user.platformid, platformid1: $rootScope.user.platformid, classid: $stateParams.id, classid1: $stateParams.id }, function (data) {
            $scope.class.courseList = data;
        });
        $scope.initTable();
    }();
    //打开课程配置窗口
    $scope.goManage = function (row) {
        //是否统一配置
        $scope.allManage = false;
        getDataSource.getDataSource("selectClassCourseById", { id: row.entity.id }, function (data) {
            $scope.nowCourse = data[0];
            $scope.modalInstance = $modal.open({
                templateUrl: 'courseManage.html',
                size: 'lg',
                scope: $scope
            });
        });
    }
    $scope.copyCourse = function () {
        getDataSource.getDataSource("selectCopyClassCourse", { classid: $stateParams.id, platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridOptions1.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'copyCourse.html',
                size: 'lg',
                scope: $scope
            });
        });

    }
    $scope.sendSMS = function () {
        //smsService.send({ phone: "13818305910", content: "6934(欢迎参加网络学院培训，您的注册验证码是，有效时间为454365分钟，请尽快验证)" }, function () { })
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }
    //保存班级单课程配置
    $scope.saveCourse = function () {
        //统一配置的保存
        if ($scope.allManage) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var forUpdateArray = [];
            angular.forEach(selectRows, function (data) {
                var nowid = data.id;
                data = _.cloneDeep($scope.nowCourse);
                data.id = nowid;
                forUpdateArray.push(data);
            });
            getDataSource.doArray("updateClassCourseById", forUpdateArray, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.initTable();
            }, function (error) { });
        }
        else {
            getDataSource.getDataSource("updateClassCourseById", $scope.nowCourse, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
    }
    $scope.manageCourse = function () {
        $scope.selectedCourse = $scope.gridApi.selection.getSelectedRows();
        //是否统一配置
        $scope.allManage = true;
        $scope.nowCourse = {};
        $scope.modalInstance = $modal.open({
            templateUrl: 'courseManage.html',
            size: 'lg',
            scope: $scope
        });
    }
    $scope.setExamNumZero = function () {
        if ($scope.nowCourse.exam == 0) {
            $scope.nowCourse.examnum = 0;
        }
    }
    $scope.gridOptions = {
        useExternalPagination: true,
        data: [],
        columnDefs: [
          //{ name: '课程名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goManage(row)">{{row.entity.name}}</a></div>' },
          { name: '课程名称', width: '57%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.name}}</div>' },
          { name: '主讲人', width: '10%', field: "teachersname" },
          { name: "课程类型", width: '10%', field: "starttime", cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.appScope.zhname"></div>' },
          { name: "学时", width: '10%', field: "score" },
          { name: "状态", width: '10%', field: "mainstatus", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.mainstatus==-2 ? "已下架" : "正常" }}</div>' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.gridOptions1 = {
        useExternalPagination: true,
        data: [],
        multiSelect:false,
        columnDefs: [
          { name: '班次名称', field: "name" },
        { name: '开班时间', field: "starttime",maxWidth:100, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.starttime|date:"yyyy-MM-dd"}}</div>' },
          { name: '必修课程', field: "xxk", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.bxk}}</div>' },
          { name: "选修课程", field: "bxk", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.xxk}}</div>' },
        { name: "案例教学", field: "aljx", maxWidth: 100, cellTemplate: '<div class="ui-grid-cell-contents">&nbsp;{{row.entity.aljx}}</div>' },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi1 = gridApi;
        }
    };
    //复制班级课程
    $scope.copyNewCourse = function () {
        ///console.log($scope.copyCategory);
        var selectRows = $scope.gridApi1.selection.getSelectedRows();
        var q = $http.post("../api/copyClassCourse", { classid: $stateParams.id, forCopyClass: selectRows[0].id, copyCategory: $scope.copyCategory });
        q.then(function (data) {
            $scope.modalInstance.dismiss('cancel');
            $scope.initTable();
        });
    }
    //删除课程
    $scope.delCourseware = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("deleteClassCourseware", selectRows, function (data) {
            getDataSource.getDataSource("update_sy_class_studytime", { classid: $stateParams.id }, function (data) { }, function (e) { })
            $scope.updatescore();
            $scope.initTable();
        });
    }
    $scope.addCourseDisabled = true;

    $scope.addCourse = function () {
        if ($scope.class.forAddCourse && $scope.class.forAddCourse.length > 0) {
            $scope.addCourseDisabled = true;
            angular.forEach($scope.class.forAddCourse, function (item) {
                item.classid = $stateParams.id;
                item.coursewareid = item.id;
                item.category = $stateParams.type;
            });
            getDataSource.doArray("insertClassCourseware", $scope.class.forAddCourse, function (data) {
                angular.forEach($scope.class.forAddCourse, function (item) {
                    _.remove($scope.class.courseList, { id: item.id });
                    //item.classid = $stateParams.id;
                    //item.coursewareid = item.id;
                    //item.category = $stateParams.type;
                });
                getDataSource.getDataSource("update_sy_class_studytime", { classid: $stateParams.id }, function (data) { }, function (e) { })

                $scope.class.forAddCourse = [];
                $scope.initTable();
            });
            //$scope.updatescore();
             
        }
    }

    $scope.updatescore = function (p) {

        getDataSource.getDataSource("updateClassStudytime", { classid: $stateParams.id }, function (data) {
            console.log(data);
        });

    }


    $scope.$watch("class.forAddCourse", function (newValue) {
        if (newValue.length > 0)
            $scope.addCourseDisabled = false;
        else
            $scope.addCourseDisabled = true;
    })
}]);
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
angular.module("myApp")
.controller("classAssessmentController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify) {
    $scope.dimensions = [
        { name: "必修课" },
        { name: "选修课" },
        { name: "案例教学" },
        { name: "小结" }
    ];
    $scope.class = { dimensions: [] };

    $scope.saveButtonDisabled = false;
    $scope.save = function () {
    	//保存
    	$scope.saveButtonDisabled = true;
        $scope.class.classid = $stateParams.id;
        var dimension = "";
        angular.forEach($scope.class.dimensions, function (data) {
            dimension += data.name + ",";
        });
        if (dimension.length > 0) {
            dimension = dimension.substring(0, dimension.length - 1);
        }
        $scope.class.dimension = dimension;
        if ($scope.class.id) {
            getDataSource.getDataSource("updateClassAssessment", $scope.class, function () {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            }, function (error) { $scope.saveButtonDisabled = false;});
        }
        else {
            $scope.class.id = getDataSource.getGUID();
            getDataSource.getDataSource("insertClassAssessment", $scope.class, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            }, function (error) { $scope.saveButtonDisabled = false; });
        }

    }
    $scope.checkMax = function (now, max) {
       var scopenow=  now.split(".")
       if ($scope[scopenow[0]][scopenow[1]] >= max)
        {
           $scope[scopenow[0]][scopenow[1]] = max;
        }
    }
    $scope.load = function () {
        getDataSource.getDataSource("selectClassScoreSum", { classid: $stateParams.id }, function (data) {
            var groupby = _.groupBy(data, function (item) {
                return item.category;
            })
            $scope.requiredpassmark = _.sumBy(_.filter(data, function (item) { return item.category == 0 }),
                function (item)
                { return item.score; }
                );
            $scope.electivepassmark = _.sumBy(_.filter(data, function (item) { return item.category == 1 }),
                function (item)
                { return item.score; }
                );
            $scope.casepassmark = _.sumBy(_.filter(data, function (item) { return item.category == 2 }),
                function (item)
                { return item.score; }
                );
        });
        getDataSource.getDataSource("selectClassAssessment", { classid: $stateParams.id }, function (data) {
            if (data.length > 0) {
                $scope.class = data[0];
                $scope.class.dimensions = [];
                angular.forEach($scope.class.dimension.split(","), function (item) {
                    $scope.class.dimensions.push({ name: item });
                });
            }
        })
    }();
}]);
angular.module("myApp")
.controller("classStudentController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'Upload', '$http', 'CommonService', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, Upload, $http, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.nowfile = {};
    $scope.isAccept = false;
    $scope.isDelAccept = false;
    $scope.student = {};
    $scope.search = {};
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("selectClassStudent", { classid: $stateParams.id }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    
    $scope.loadGrid();

	//获取职级数据
    $scope.getLevelArr = function () {
    	if (!$scope.levelArr) {
    		getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
    			$scope.levelArr = _.find(data, { type: "职级" }).list;
    		}, function (errortemp) { });
    	}
    }

    $scope.getLevelArr();

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        data: [],
        columnDefs: [
            { name: '登录帐号', field: "logname", headerCellClass: "text-center" },
            { name: '姓名', field: "name", headerCellClass: "text-center" },
            { name: '手机号码', headerCellClass: "text-center", field: "cellphone" },
            { name: '职级', headerCellClass: "text-center", field: "rank" },
            { name: "部门名称", headerCellClass: "text-center", field: "departmentname" },
            { name: "状态", headerCellClass: "text-center", field: "status" },
            { name: "注册状态", headerCellClass: "text-center", field: "signstatus" },
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
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.deleteStudent = function () {
    	$scope.modalInstance = $modal.open({
    		templateUrl: 'delconfirm.html',
    	    size: 'md',
    	    scope: $scope
    	});
    }
    $scope.okDel = function () {
    	 

        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var parameter = { classid: $stateParams.id, userid: [] }
        for (var i = 0; i < selectRows.length; i++) {
            parameter.userid.push(selectRows[i].userid);
        }
        getDataSource.getUrlData("../api/deletestudent", parameter, function (data) {
    		notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		$scope.closeDel();
    		$scope.loadGrid();
    	}, function (error) { }); 
    }
    $scope.closeDel = function () {
    	$scope.modalInstance.dismiss('cancel');
    }
    $scope.ok = function () {
        $scope.isAccept = true;
        $scope.close();
        $scope.upload();
    }
    $scope.uploadFiles = function (files, invalidFiles) {
        $scope.files = files;

    }
    $scope.$watch("files", function (val) {
        if (val && val.length > 0) {
            //$scope.modalInstance = $modal.open({
            //    templateUrl: 'confirm.html',
            //    size: 'md',
            //    scope: $scope
            //});
            $scope.isAccept = true;
            $scope.upload();
        }
    });
    $scope.upload = function () {
        var upload = Upload.upload({
            url: '../api/importStudent',
            file: $scope.files,
            data: { classid: $stateParams.id }
        });
        upload.then(function (data) {
            ///console.log(data);
            $scope.studentSuccess= _.filter(data.data.studentList, function (o) { return o.success == true; }).length;
            
            $scope.studentFail = _.filter(data.data.studentList, function (o) { return o.success == false; }).length;
            
            $scope.importStudent =data.data.studentList;
            $scope.modalInstance = $modal.open({
                templateUrl: 'studentImport.html',
                size: 'lg',
                scope: $scope
            });
            //notify({ message: '导入成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }

	//导出失败的学员记录
    //$scope.exportfailed = function () {
    //	getDataSource.getUrlData("../api/exportFailedStudent", $scope.studentFail, function (data) {

    //	}, function (error) {

    //	});
    //}

    $scope.nations = [];
    var p = $http.get("../config/dataSource.json");
    p.then(function (data) {

        $scope.nations = data.data.nations;
    });
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }
    $scope.addStudent = function (id) {

        $state.go("index.import", { id: $stateParams.id });
        //$state.go("index.classedit.import", { id: $stateParams.id });
        
        //$scope.student = {};
        //if (!id) {
        //    $scope.isnew = true;

        //}
        //else {
        //    getDataSource.getDataSource("selectClassStudentById", { id: id }, function (data) {
        //        $scope.student = data[0];
        //    });
        //    $scope.isnew = false;
        //}
        //$scope.modalInstance = $modal.open({
        //    templateUrl: 'studentInfo.html',
        //    size: 'lg',
        //    scope: $scope
        //});
    }
    $scope.goDetial = function (row) {
        $scope.addStudent(row.entity.id)

    }
	//保存学员
    $scope.saveStudentDisabled = false;
    $scope.saveStudent = function () {
    	$scope.saveStudentDisabled = true;
        if (CommonService.checkIDCard($scope.student.idcard)==false) {
        	notify({ message: '身份证号填写不正确', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        	$scope.saveStudentDisabled = false;
        }
        else {
            var idcard =  $scope.student.idcard;
            var sex = idcard.substr(idcard.length - 2, 1);
            if ((sex % 2) == $scope.student.sex) {
                $scope.student.classid = $stateParams.id;
                var postStudent = $http.post("../api/student", { student: $scope.student });
                postStudent.then(function (data) {
                	if (data.data.status == "success") {
                		$scope.saveStudentDisabled = false;
                        notify({ message: '新增成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        $scope.close();
                        $scope.loadGrid();
                	} else {
                		$scope.saveStudentDisabled = false;
                        notify({ message: data.data.errorMessage, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    }
                });
            }
            else {
            	$scope.saveStudentDisabled = false;
                notify({ message: '身份证号识别的性别和选择的性别不一致', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }
    }
}]);
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
angular.module("myApp")
.controller("unitEditController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'Upload', 'CommonService', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, Upload, CommonService) {
    $scope.class = {selectedClass:[]};
    if ($stateParams.id)
    {
        $scope.formid = $stateParams.id;
    }
    $scope.goStudentList = function () {
        $state.go("index.unitEdit.studentlist", { id: $stateParams.id });
    };
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '专题名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewLive(row)">{{row.entity.name}}</a></div>' },
          { name: '年份', field: "starttime",cellFilter:"date:'yyyy'" },
            { name: '必修课数', field: "bxk" },
            { name: '选修课数', field: "xxk" },
            { name: "操作", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.deleteClass(row)">删除</a></div>' }
        ]
    };
    $scope.load = function () {
    	//alert($stateParams.id);
    	getDataSource.getDataSource("selectAllMultClass", { mulid: $stateParams.id, platformid: $rootScope.user.platformid }, function (data) {
            $scope.allClass = data;

            if ($stateParams.id) {
                getDataSource.getDataSource(["selectMultClass", "selectMultClassForClass"], { id: $stateParams.id }, function (data) {
                    $scope.class = _.filter(data, function (o) { return o.name == "selectMultClass" })[0].data[0];
                    $scope.gridOptions.data = _.filter(data, function (o) { return o.name == "selectMultClassForClass" })[0].data;
                    $scope.class.selectedClass = [];
                    //angular.forEach($scope.gridOptions.data, function (item) {
                    //    $scope.class.selectedClass.push({ id: item.classid });
                    //});
                });
            }
        })

    }
    $scope.load();
	//新增班次到多专题班
    $scope.addDisabled = false;
    $scope.addClass = function () {
    	$scope.addDisabled = true;
        var selectedClasss = [];
        var newid = $stateParams.id;
        angular.forEach($scope.class.selectedClass,function (data) {
            selectedClasss.push({
                id: getDataSource.getGUID(),
                classid: data.id,
                multiclassid: newid
            });
        });
        //删除原来多专和班次的关系
        //getDataSource.getDataSource("deleteMultClassSelectedClass", { id: $stateParams.id }, function () {
        getDataSource.doArray("insertintoMultClassRelation", selectedClasss, function (data) {
        	$scope.addDisabled = false;
            $scope.class.classnum = selectedClasss.length;
            //清空了已选中的班
            //angular.forEach(selectedClasss, function (item) {
            //	_.remove($scope.allClass, { id: item.classid });
            //});
            	
            $scope.class.selectedClass = [];
            getDataSource.getDataSource("updateMultClass", $scope.class, function (data) {
                $scope.load();
            })
        }, function (error) { $scope.addDisabled = false; });
       // })
    }
    $scope.checkNum = function () {
        if (isNaN($scope.class.minclassnum)) {
            notify({ message: '必须输入数字', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        else {
            if ($scope.class.minclassnum > $scope.gridOptions.data.length)
            {
                notify({ message: '最少选择班次数不能超过班次总数', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.class.minclassnum = $scope.gridOptions.data.length
            }
        }
    }


	//关闭模式窗口
    $scope.close = function () {
    	$scope.modalInstance.dismiss('cancel');
    }

    $scope.ok = function (row) {
    	$scope.isAccept = true;
    	//先检查该班是否有人报名，若有，则不能删除。
    	getDataSource.getDataSource("checkStuChooseMultClass", { classid: row.entity.id }, function (data) {
    		if (data.length > 0) {
    			notify({ message: '该多专班已被使用，不能删除', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		} else {
    			getDataSource.getDataSource("deleteMultClassSelectedClassById", { id: row.entity.id }, function () {
    				getDataSource.getDataSource("updateMultClassCount", { sy_multiclassid: $scope.formid }, function (data) {
    					$scope.load();
    				}, function (error) { })
    			});
    		}
    	}, function () { });
    	$scope.close();
    }

    $scope.deleteClass = function (row)
    {
    	$scope.row = row;
    	$scope.modalInstance = $modal.open({
    		templateUrl: 'confirm.html',
    		size: 'sm',
    		scope: $scope
    	});
    }
    $scope.changeCharge = function () {
        $scope.class.expenses = 0;
    }

    $scope.goback = function () {
    	$state.go("index.unit");
    }
	//保存
    $scope.saveButtonDisabled = false;
    $scope.save = function () {
    	$scope.saveButtonDisabled = true;
    	if ($stateParams.id) {
            getDataSource.getDataSource("updateMultClass", $scope.class, function () {
            	$scope.load();
            	$scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (error) { $scope.saveButtonDisabled = false; });
        }
        else {
            $scope.class.id = getDataSource.getGUID();
            $scope.class.platformid = $rootScope.user.platformid;
            $scope.class.createuser = $rootScope.user.name;
            $scope.class.createtime = new Date();
            getDataSource.getDataSource("insertMultClass", $scope.class, function () {
            	$state.go("index.unitEdit", { id: $scope.class.id });
            	$scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (error) { $scope.saveButtonDisabled = false; });
        }
    }
}]);
app.controller("contentController", ['$scope', '$http', "getDataSource", "$rootScope","$modal", function ($scope, $http, getDataSource, $rootScope,$modal) {
    getDataSource.getDataSource("gettbl", {}, function (data) {
        //console.log(data);

    });
    $scope.peoples = [
  { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States' },
  { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
  { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
  { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
  { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
  { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
  { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
  { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
  { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
  { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    ];

    $scope.itemArray = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
        { id: 4, name: 'fourth' },
        { id: 5, name: 'fifth' },
    ];

    $scope.selected = { value: $scope.itemArray[0] };
    $scope.open = function (size) {
        window.open("http://www.baidu.com");
        //var modalInstance = $modal.open({
        //    templateUrl: 'myModalContent.html',
        //    size: size,
        //    resolve: {
        //        items: function () {
        //            return $scope.items;
        //        }
        //    }
        //});

        //modalInstance.result.then(function (selectedItem) {
        //    $scope.selected = selectedItem;
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };
    $scope.gridOptions = {
        data: 'data1',
        enableCellSelection: true,
        enablePaging: true,
        showFooter: true,
        enablePinning: true,
        columnDefs: [
                { field: "classroom", width: 120, pinned: true },
                 { field: "id", width: 120 },
                 { field: "name", width: 300 },
                 { field: "createtime", width: 300 }
        ], 
        pagingOptions: $scope.pagingOptions,
    };

    getDataSource.getDataSource("gettbl", {}, function (data1) {
        //var d1 = [];
        //for (var c = 0; c < 200; c++) {
        //    d1.push({ id: c, classroom: "教室123" + c, createtime: (new Date()), name: "课程" + c, myname: '中国' + c, wow: c, wow1: c, wow2: c, wow3: c });
        //}



        //$scope.gridOptions.columnDefs = [
        //   { name: 'id', width: 200, enablePinning: false },
        //  { name: 'name', width: 200, pinnedLeft: true },
        //   { name: 'classsroom', width: 200, pinnedRight: true },
        //   { name: 'myname', width: 150, enableCellEdit: true },
        //   { name: 'wow', width: 150 },
        //    { name: 'wow1', width: 150 },
        //                { name: 'wow2', width: 300 },
        //                        { name: 'wow3', width: 300 }
        //];

        $scope.data1 = data1;

        //$scope.gridOptions = { data: $scope.myData};
    });

    //$scope.gridOptions = {};
    //$scope.gridOptions.enableCellEditOnFocus = true;

    //$scope.gridOptions.columnDefs = [
    //  { name: 'id', enableCellEdit: false },
    //  { name: 'age', enableCellEditOnFocus: false, displayName: 'age (f2/dblClick edit)', width: 200 },
    //  { name: 'address.city', enableCellEdit: true, width: 300 },
    //  { name: 'name', displayName: 'Name (editOnFocus)', width: 200 }
    //];
    //var d1 = [];
    //for (var c = 0; c < 200; c++) {
    //    d1.push({ id: c, classroom: "教室123" + c, createtime: (new Date()), name: "课程" + c, myname: '中国' + c, wow: c, wow1: c, wow2: c, wow3: c });
    //}

    //      $scope.gridOptions.data = d1;

    //$scope.currentFocused = "";

    //$scope.getCurrentFocus = function () {
    //    var rowCol = $scope.gridApi.cellNav.getFocusedCell();
    //    if (rowCol !== null) {
    //        $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
    //    }
    //}

    //$scope.gridOptions.onRegisterApi = function (gridApi) {
    //    $scope.gridApi = gridApi;
    //};
}])
angular.module("myApp")
.controller("courseAuthorizationController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.authorizationinfo = {
        id: "",
        authorizedate: null,
        authorizefile_servername: "",
        coursewareid: $stateParams.id,
        teachername: "",
        authorizefilename: "",
        examination: "",
        examdate: null,
        examfile_servername: "",
        examfilename: "",
        files: {}
    }

    $scope.loadAuth = function () {
        getDataSource.getDataSource("select_sy_courseware_authbycoursewareid", { coursewareid: $scope.authorizationinfo.coursewareid }, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.authorizationinfo = data[0];
        })
    }

    $scope.loadAuth();

    //上传审批文件
    $scope.uploadAuthFiles = function (files) {
        FilesService.upLoadFiles(files[0], "authAttach", function (data) {
            $scope.authorizationinfo.authorizefilename = data.data[0].filename;
            $scope.authorizationinfo.authorizefile_servername = data.data[0].servername;
        });
    }

    //上传批准文件
    $scope.uploadExamFiles = function (files) {
        FilesService.upLoadFiles(files[0], "authAttach", function (data) {
            $scope.authorizationinfo.examfilename = data.data[0].filename;
            $scope.authorizationinfo.examfile_servername = data.data[0].servername;
        });
    }

    //保存
    $scope.saveAuth = function () {
        //if ($scope.authorizationinfo.teachername == undefined || $scope.authorizationinfo.teachername == "" || $scope.authorizationinfo.examination == "") {
        //    notify({ message: '授权人和批准人必须填写一个！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        ////判断文件是否上传
        //if ($scope.authorizationinfo.authorizefilename == undefined || $scope.authorizationinfo.authorizefilename == "") {
        //    notify({ message: '请上传授权文件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        //if ($scope.authorizationinfo.examfile_servername == undefined || $scope.authorizationinfo.examfile_servername == "") {
        //    notify({ message: '请上传批准文件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        //    return;
        //}
        if ($scope.authorizationinfo.id) {
            //更新
            getDataSource.getDataSource("update_sy_courseware_auth", {
                id: $scope.authorizationinfo.id,
                authorizedate: $scope.authorizationinfo.authorizedate,
                authorizefile_servername: $scope.authorizationinfo.authorizefile_servername,
                coursewareid: $scope.authorizationinfo.coursewareid,
                teachername: $scope.authorizationinfo.teachername,
                authorizefilename: $scope.authorizationinfo.authorizefilename,
                examination: $scope.authorizationinfo.examination,
                examdate: $scope.authorizationinfo.examdate,
                examfile_servername: $scope.authorizationinfo.examfile_servername,
                examfilename: $scope.authorizationinfo.examfilename,
            }, function (data) {
                if (!$scope.savefase)
                    notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
        else {
            $scope.authorizationinfo.id = getDataSource.getGUID();
            //新增
            getDataSource.getDataSource("insert_sy_courseware_auth", {
                id: $scope.authorizationinfo.id,
                authorizedate: $scope.authorizationinfo.authorizedate,
                authorizefile_servername: $scope.authorizationinfo.authorizefile_servername,
                coursewareid: $scope.authorizationinfo.coursewareid,
                teachername: $scope.authorizationinfo.teachername,
                authorizefilename: $scope.authorizationinfo.authorizefilename,
                examination: $scope.authorizationinfo.examination,
                examdate: $scope.authorizationinfo.examdate,
                examfile_servername: $scope.authorizationinfo.examfile_servername,
                examfilename: $scope.authorizationinfo.examfilename,
            }, function (data) {
                if (!$scope.savefase)
                    notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }

    $scope.authMessage = "";
    $scope.authmessageshow = false;
    $scope.savefase = false;
    //授权
    $scope.saveAuthSuccess = function () {
        $scope.savefase = true;
        $scope.saveAuth();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 4, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件授权", nextstep: "课件编辑", operationcontent: ($rootScope.user.name + "授权成功，等待编辑课件").toString()
        }, function (data) {
            if (data) {
                notify({ message: '授权成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '授权失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '授权失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //授权失败
    $scope.saveAuthError = function () {
        $scope.savefase = true;
        $scope.saveAuth();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: -2, operationuser: $rootScope.user.name,
            userid: $rootScope.user.accountId, currentstep: "课件授权", nextstep: "课件删除",
            operationcontent: ($rootScope.user.name + "已删除，删除原因：" + $scope.course.deleteContent).toString(),
            deleteContent: $scope.course.deleteContent, laststatus: 3
        }, function (data) {
            if (data) {
                notify({ message: '授权失败成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '授权失败失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '授权失败失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //弹出授权消息
    $scope.saveAuthMessage = function () {
        $scope.authmessageshow = true;
        $scope.authMessage = "失败理由";
        $scope.modalInstance = $modal.open({
            templateUrl: 'authmessagepeview.html',
            size: 'lg',
            scope: $scope
        });
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    //查看授权文件
    $scope.openSFile = function () {
        FilesService.downFiles("authAttach", $scope.authorizationinfo.authorizefile_servername, $scope.authorizationinfo.authorizefile_servername);
    }
    //查看批准文件
    $scope.openPFile = function () {
        FilesService.downFiles("authAttach", $scope.authorizationinfo.examfile_servername, $scope.authorizationinfo.examfile_servername);
    }
}]);
angular.module("myApp")
.controller("courseEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.course = { teachers: [] };
    $scope.courseware = {
        tipMessage: "",
        courseInfoShow: false,
        courseExamineShow: false,
        courseDistributionShow: false,
        courseEditShow: false,
        courseEditViewShow: false,
        courseAuthorizationEditShow: false,
        courseAuthorizationViewShow: false,
        courseEdShow: false,
        courseEdViewShow: false,
        coursePerfectEditShow: false,
        coursePerfectViewShow: false,
        courseStorageEditShow: false,
        courseStorageViewShow: false,
        courseDeleteMessageShow: false
    };

    $scope.setCourseWareType = function () {
        switch ($stateParams.type) {
            case "upload":
                $scope.courseware.mainstatus = 0;
                $scope.courseware.courseInfoShow = true;
                break;
            case "distribution":
                $scope.courseware.mainstatus = 1;
                $scope.courseware.courseExamineShow = true;
                break;
            case "examine":
                $scope.courseware.mainstatus = 2;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = true;
                break;
            case "authorization":
                $scope.courseware.mainstatus = 3;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationEditShow = true;
                break;
            case "wareedit":
                $scope.courseware.mainstatus = 4;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdShow = true;
                break;
            case "perfect":
                $scope.courseware.mainstatus = 5;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectEditShow = true;
                break;
            case "storage":
                $scope.courseware.mainstatus = 6;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectViewShow = true;
                $scope.courseware.courseStorageEditShow = true;
                break;
            case "formal":
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseAuthorizationViewShow = true;
                $scope.courseware.courseEdViewShow = true;
                $scope.courseware.coursePerfectViewShow = true;
                $scope.courseware.courseStorageViewShow = true;
                $scope.courseware.mainstatus = 7;
                break;
            case "waredelete":
                $scope.courseware.mainstatus = -2;
                $scope.courseware.courseEditShow = true;
                $scope.courseware.courseEditViewShow = false;
                $scope.courseware.courseDeleteMessageShow = true;
                break;
        }
    }

    $scope.setCourseWareType();

    if ($stateParams.id) {
        getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation"], { id: $stateParams.id }, function (data) {
            var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
            $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
            $scope.course.teachers = teachrRelation.data;
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);
            if ($scope.course.source == 1)
                $scope.course.sourcecn = "录制";
            else if ($scope.course.source == 2)
                $scope.course.sourcecn = "定制";

            if ($scope.course.videotype == 0)
                $scope.course.videotypecn = "单视频";
            else if ($scope.course.videotype == 1)
                $scope.course.videotypecn = "双视频";
            else if ($scope.course.videotype == 2)
                $scope.course.videotypecn = "单视频+PPT";
            $scope.course.deletestatuscn = "";
            switch ($scope.course.deletestatus) {
                case 1:
                    $scope.course.deletestatuscn = "待分配";
                    break;
                case 2:
                    $scope.course.deletestatuscn = "待审核";
                    break;
                case 3:
                    $scope.course.deletestatuscn = "待授权";
                    break;
                case 4:
                    $scope.course.deletestatuscn = "待编辑";
                    break;
                case 5:
                    $scope.course.deletestatuscn = "待完善";
                    break;
                case 6:
                    $scope.course.deletestatuscn = "待分类";
                    break;
            }

            $scope.course.teacherscn = "";
            $scope.course.teachercontent = "";
            for (var idx in $scope.course.teachers) {
                if ($scope.course.teachers[idx].name != undefined) {
                    $scope.course.teacherscn += $scope.course.teachers[idx].name + " ";
                }
                if ($scope.course.teachers[idx].comment != undefined)
                    $scope.course.teachercontent += $scope.course.teachers[idx].comment + "<br/>";
            }
        });
    }
    else {
        $scope.course.videotype = 0;
    }



    //推荐
    $scope.recommendCourse = function () {
        //验证课件是否可推荐
        if ($scope.comment != "") {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 3, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件审核", nextstep: "课件授权", operationcontent: ($rootScope.user.name + "已审核成功，等待授权").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '推荐成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    $scope.goback();
                }
                else
                    notify({ message: '推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
        else {
            notify({ message: '请填写课件简介！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }
    }

    //不推荐
    $scope.notRecommendCourse = function () {
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: -2, operationuser: $rootScope.user.name,
            userid: $rootScope.user.accountId, currentstep: "课件审核", nextstep: "课件删除",
            operationcontent: ($rootScope.user.name + "已删除，删除原因：" + $scope.course.deleteContent).toString(),
            deleteContent: $scope.course.deleteContent, laststatus: 2
        }, function (data) {
            if (data) {
                notify({ message: '不推荐成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.goback();
            }
            else
                notify({ message: '不推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '不推荐失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //打开提示框
    $scope.openMessage = function (msg) {
        $scope.courseware.tipMessage = msg;
        $scope.modalInstance = $modal.open({
            templateUrl: 'messagepeview.html',
            size: 'lg',
            scope: $scope
        });
    }
    $scope.textareashow = false;
    $scope.recommendType = "";
    $scope.openRecommendCourse = function () {
        $scope.textareashow = false;
        $scope.recommendType = "recommend";
        $scope.openMessage("是否确认推荐该课件？");
    }

    $scope.openNotRecommendCourse = function () {
        $scope.textareashow = true;
        $scope.recommendType = "notrecommend";
        $scope.openMessage("不推荐理由");
    }
    //推荐和不推荐操作
    $scope.saveRecommendCourse = function () {
        if ($scope.recommendType == "recommend") {
            $scope.recommendCourse();
        }
        else if ($scope.recommendType == "notrecommend") {
            $scope.notRecommendCourse();
        }
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }

}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
angular.module("myApp")
.controller("courseExamController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.st = {};
    $scope.checkedAnswer = {};
    $scope.gridApiST = {};
    $scope.gridSTOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '试题名称', field: "examtitle", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.oepnST(row)">{{row.entity.examtitle}}</a></div>' },
          { name: '题型', field: "examcategory", cellFilter: "examCategoryFilter" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApiST = gridApi;
        }
    };

    //试题初始化
    $scope.doinitST = function () {
        getDataSource.getDataSource("selectExamByCourse", { id: $stateParams.id }, function (data) {
            $scope.gridSTOptions.data = data;
        })
    }

    $scope.doinitST();

    //删除试题
    $scope.deleteST = function () {
        var selectRows = $scope.gridApiST.selection.getSelectedRows();
        getDataSource.doArray("deleteExam", selectRows, function (data) {
            $scope.doinitST();
        });
    }
    

    //删除一个试题答案
    $scope.deleteAnswer = function (item) {
        _.pull($scope.answers, item);
    }
    //保存一个试题
    $scope.addST = function () {
        if ($scope.st.examcategory == 0) {
            angular.forEach($scope.answers, function (item) {
                if (item.id == $scope.checkedAnswer.checkedID) {
                    item.isright = 1;
                }
                else {
                    item.isright = 0;
                }
            })
        }
        if ($scope.newst) {
            $scope.st.id = getDataSource.getGUID();
            $scope.st.coursewareid = $stateParams.id;
            angular.forEach($scope.answers, function (data) {
                data.examid = $scope.st.id;
            });
            getDataSource.getDataSource("addCourseExam", $scope.st, function (data) {
                getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                    $scope.doinitST();
                    $scope.close();
                });
            });
        }
        else {
            getDataSource.getDataSource("updateCourseExam", $scope.st, function (data) {
                getDataSource.getDataSource("deleteExamAnswer", { examid: $scope.st.id }, function (data) {
                    getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                        $scope.doinitST();
                        $scope.close();
                    });
                });
            });
        }
    }
    //新增一个试题答案
    $scope.addExamAnswer = function () {
        $scope.answers.push({
            id: getDataSource.getGUID(),
            isright: false,
            answer: "",
            examid: $scope.st.id
        });
    }

    //更换试题类型，清空所有课题
    $scope.changeST = function () {
        $scope.answers = [];
    }

    //打开试题编辑窗口
    $scope.oepnST = function (row) {

        //是否是新增试题
        if (row) {
            $scope.newst = false;
            $scope.st = row.entity;
            getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                var checkedid = "";
                angular.forEach(data, function (item) {
                    if (item.isright == 1) {
                        checkedid = item.id;
                        item.isright = true;
                    }
                });
                $scope.answers = data;
                $scope.checkedAnswer.checkedID = checkedid;
            });
        }
        else {
            $scope.newst = true;
            $scope.st = {};
            $scope.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'ST.html',
            size: 'lg',
            scope: $scope
        });
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

}]);
angular.module("myApp")
.controller("courseExamineController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    //评分项目
    $scope.coursewareeidt = {
        //评分项
        evaluateData: {},
        //关键字
        keyData: {}
    };

    //获取评价信息
    $scope.loadCodeData = function () {
        getDataSource.getDataSource("select_sy_courseware_ratebycoursewareid", { coursewareid: $stateParams.id }, function (ratedata) {
            if (ratedata != null && ratedata != undefined) {
                var edata = new Array();
                var keydata = new Array();
                for (var idx in ratedata) {
                    if (ratedata[idx].codetype == 0) {
                        edata.push(ratedata[idx]);
                    }
                    else {
                        keydata.push(ratedata[idx]);
                    }
                }
            }
            getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "课件评价等级" }, function (data) {
                if (edata != null && edata.length > 0 && data != null && data.length > 0) {
                    for (var i in data) {
                        for (var inx in edata) {
                            if (data[i].showvalue == edata[inx].category) {
                                data[i].datavalue = edata[inx].rate;
                            }
                        }
                    }
                }
                $scope.coursewareeidt.evaluateData = data;
            })
            getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "关键词" }, function (data) {
                getDataSource.getDataSource("select_sy_code_getall", {}, function (tempdata) {
                    if (data != null && data != undefined && data.length > 0 && tempdata != null && tempdata != undefined && tempdata.length > 0) {
                        for (var idx in data) {
                            var itemData = new Array();
                            for (var inx in tempdata) {
                                if (tempdata[inx].category == data[idx].showvalue) {
                                    itemData.push(tempdata[inx]);
                                }
                            }
                            if (keydata != null && keydata != undefined && keydata.length > 0) {
                                for (var i in keydata) {
                                    if (keydata[i].category == data[idx].showvalue)
                                        data[idx].datavalue = keydata[i].rate;
                                }
                            }
                            data[idx].itemData = itemData;
                        }
                    }
                    $scope.coursewareeidt.keyData = data;
                });

            })
        })
    }

    //加载信息
    $scope.loadRateData = function () {
        getDataSource.getDataSource("select_sy_courseware_ratebycoursewareid", { coursewareid: $stateParams.id }, function (data) {
            var edata = new Array();
            var keydata = new Array();
            for (var idx in data) {
                if (data[idx].codetype == 0) {
                    edata.push(data[idx]);
                }
                else {
                    keydata.push(data[idx]);
                }
            }
            $scope.coursewareeidt.keyData = keydata;
            $scope.coursewareeidt.evaluateData = edata;

            if (keydata.length == 0) {
                getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "课件评价等级" }, function (data) {
                    for (var inx in data) {
                        data[inx].category = data[inx].showvalue;
                        data[inx].rate = "未评";
                    }
                    $scope.coursewareeidt.evaluateData = data;
                })
            }
            if (edata.length == 0) {
                getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "关键词" }, function (data) {
                    for (var inx in data) {
                        data[inx].category = data[inx].showvalue;
                        data[inx].rate = "无";
                    }
                    $scope.coursewareeidt.keyData = data;
                });
            }
        });
    }

    //获取CODE数据
    if ($scope.courseware.courseEditViewShow)
        $scope.loadCodeData();
    else
        $scope.loadRateData();

    //保存课程评价信息
    $scope.saveExamine = function () {
        //保存课件评价信息
        getDataSource.getUrlData("../api/saveCourseExamine", {
            coursewareeidt: $scope.coursewareeidt, rate: $scope.course.rate, coursewareid: $stateParams.id
        }, function (data) {
            if (data)
                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            else
                notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }
}]);
angular.module("myApp")
.controller("courseInforController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    var obj = {};
    $scope.nowid = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.typeShow = true;
    if ($scope.type == "1")
        $scope.typeShow = false;
    $scope.saveButtonDisabled = false;
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }
    getDataSource.getDataSource("selectAllTeacher", { platformid: $rootScope.user.platformid }, function (data) {
        $scope.allTeachers = data;
    });
    $scope.gridOptions = {};
    $scope.gridXXOptions = {};


    $scope.uploadpptFiles = function (file, errFiles) {
        $scope.course.temppptfile = file;
        $scope.process_pptfile = 0;
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }
    $scope.saveCourseInfo = function () {
        //保存封面图
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 200, height: 120 }, function (data) {
                $scope.course.imagephoto = data.data[0].servername;
                doSave();
            });
        }
        else {
            doSave();
        }

    }
    var doSave = function () {
        $scope.saveButtonDisabled = true;

        if ($scope.course.name == undefined || $scope.course.name == "") {
            notify({ message: '请输入课件名称！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        if ($scope.course.tempteachervideofilename == undefined || $scope.course.tempteachervideofilename == "") {
            notify({ message: '请选择课件信息！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }

        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
            getDataSource.getDataSource("update_sy_coursewareById", $scope.course, function (data) {
                $scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            });
        }
        else {
            var newid = getDataSource.getGUID();
            $scope.course.id = newid;
            insertCourseRelation(newid);
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            $scope.course.createtime = new Date();
            getDataSource.getDataSource("insert_sy_courseware_info", $scope.course, function (data) {
                $scope.saveButtonDisabled = false;
                $state.go("index.courseEdit", { id: newid });
                //$state.go("index.coursewareEdit", { id: newid });
            });
        }
    }

    $scope.commitCourseInfo = function () {
        if ($scope.course.id) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 1, operationuser: $rootScope.user.name, currentstep: "课件上传", nextstep: "课件分配", operationcontent: ($rootScope.user.name + "已提交课件，等待分配审核").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.goback();
                }
                else
                    notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
    }


    var insertCourseRelation = function (coursewareid) {
        var teachers = [];
        angular.forEach($scope.course.teachers, function (item) {
            teachers.push({
                id: getDataSource.getGUID(),
                coursewareid: coursewareid,
                sourceid: item.id,
                type: 0
            });
        });

        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 0 }, function (data) {
            if (data) {
                getDataSource.doArray("insert_sy_course_relation", teachers, function (data) {
                });
            }
        });
    }
    //加载审核小组
    $scope.gridExamineOptions = {};
    $scope.loadExamineUser = function () {
        $scope.gridExamineOptions = {
            useExternalPagination: false,
            useExternalSorting: false,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            data: [],
            columnDefs: [
              { name: "姓名", field: "name", width: '99%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridExaminesApi = gridApi;
            }
        };
    }
    $scope.loadExamineUser();
    //获取审核小组用户
    $scope.loadExamineData = function () {
        getDataSource.getDataSource("select_sy_user_examine", { coursewareid: $stateParams.id }, function (data) {
            $scope.gridExamineOptions.data = data;
        })
    }
    //加载审核用户
    if ($scope.courseware.courseExamineShow)
        $scope.loadExamineData();


    //打开选人页面
    $scope.OpenUserInfo = function () {
        getDataSource.getDataSource("select_sy_user_examine", { platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridExamineOptions.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'examinePerview.html',
                size: 'lg',
                scope: $scope
            });
        })
    }

    //分配
    $scope.distributionCourseware = function () {
        var ids = $stateParams.id;
        //获取审核人
        var selectUser = $scope.gridExaminesApi.selection.getSelectedRows();
        getDataSource.getDataSource("insert_sy_courseware_operation", { ids: ids, userid: selectUser[0].id, username: selectUser[0].name, idss: ids }, function (data) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 2, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分配", nextstep: "课件审核", operationcontent: ($rootScope.user.name + "已分配课件给" + selectUser[0].name + "，等待审核").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '分配成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    $scope.goback();
                }
                else
                    notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        })

    }

    //打开视频预览弹窗
    $scope.openVideoPerview = function (type, vid) {
        if ($scope.course.videotype == 0) {
            perviewVideo(vid);
        }
        else {
            perviewDoubleVideo($scope.course);
        }

    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }

    var perviewDoubleVideo = function (course) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.tempteachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.temppptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.course.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        if (type == 'videofile') {
            $scope.nowfile = $scope.course.videofile[0];
        }
        else {
            $scope.nowfile = $scope.course.pptfile[0];
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var options = {
            endpoint: 'http://v.polyv.net:1080/files/',
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ext: ext,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
          if (type == "videofile") {
              $scope.course.tempteachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.tempteachervideofilename = file.name;
          }
          else {
              $scope.course.temppptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.temppptvideofilename = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
angular.module("myApp")
.controller("courseMicroVideoController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '微视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewMicroVideo(row)">{{row.entity.name}}</a></div>' },
          { name: '提供者', field: "provider" }
        ]
    };

    $scope.doinitMicroVideo = function () {
        getDataSource.getDataSource("getAllMicroVideo", { id: $stateParams.id }, function (data) {
            $scope.allMicroVideo = data;
        });

        getDataSource.getDataSource("getCourseMicroVideo", { courseid: $stateParams.id }, function (data) {
            $scope.gridOptions.data = data;
        })
    }
    $scope.doinitMicroVideo();

    $scope.addMicroVideo = function () {

        getDataSource.getDataSource("delete_sy_course_relation", { id: $scope.course.id, type: 2 }, function () {
            var forInsert = [];
            angular.forEach($scope.course.microVideo, function (item) {
                forInsert.push({
                    id: getDataSource.getGUID(),
                    coursewareid: $scope.course.id,
                    sourceid: item.id,
                    type: 2
                });
            });
            getDataSource.doArray("insert_sy_course_relation", forInsert, function (data) {
                $scope.course.microVideo = [];
                $scope.doinitMicroVideo();
            });
        });
    };

    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);
angular.module("myApp")
.controller("coursePerfectsController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.fale = false;
    //保存主讲人介绍
    $scope.saveTeacherContent = function () {
        getDataSource.getDataSource("update_sy_courseware_teachercontent", { id: $stateParams.id, teachercontent: $scope.course.teachercontent }, function (data) {
            if (!$scope.fale)
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.fale = false;
        });
    }


    $scope.commitPerfectCourse = function () {
        $scope.fale = true;
        $scope.saveTeacherContent();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 6, operationuser: $rootScope.user.name,userid: $rootScope.user.accountId, currentstep: "课件完善", nextstep: "课件分类入库", operationcontent: ($rootScope.user.name + "已完善课件信息，等待分类入库").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }
}]);
angular.module("myApp")
.controller("courseStorageController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {

    $scope.categoryData = {};
    //获取分类信息
    $scope.loadCategory = function () {
        //获取课程分类
        getDataSource.getDataSource("select_sy_courseware_category_relatiionbycourseid", { coursewareid: $stateParams.id }, function (reldata) {
            //获取根分类
            getDataSource.getDataSource("select_sy_courseware_category_root", {}, function (data) {
                //获取除根之外的分类
                getDataSource.getDataSource("select_sy_courseware_category_all", {}, function (tempdata) {
                    if (data != null && data != undefined && data.length > 0 && tempdata != null && tempdata != undefined && tempdata.length > 0) {
                        //遍历根分类
                        for (var idx in data) {
                            var arrayData = new Array();
                            //遍历子分类
                            for (var i in tempdata) {
                                if (data[idx].id == tempdata[i].fid) {
                                    if (reldata != null && reldata != undefined && reldata.length > 0) {
                                        for (var j in reldata) {
                                            if (reldata[j].categoryid == tempdata[i].id) {
                                                tempdata[i].checked = true;
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        tempdata[i].checked = false;
                                    }
                                    arrayData.push(tempdata[i]);
                                }
                            }
                            data[idx].categoryData = arrayData;
                        }
                    }
                    $scope.categoryData = data;
                }, function (data) { });
            }, function (data) {
                notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        });
    }

    $scope.loadCategory();


    $scope.saveCategory = function () {
        if ($scope.categoryData != null && $scope.categoryData != undefined && $scope.categoryData.length > 0) {
            var ids = "";
            for (var idx in $scope.categoryData) {
                var itemData = $scope.categoryData[idx].categoryData;
                if (itemData != null && itemData != undefined && itemData.length > 0) {
                    for (var i in itemData) {
                        if (itemData[i].checked) {
                            if (ids != "") {
                                ids += "," + itemData[i].id;
                            }
                            else {
                                ids = itemData[i].id;
                            }
                        }
                    }
                }
            }
            if (ids != "") {
                getDataSource.getUrlData("../api/courseMoveRelatiion", {
                    categoryids: ids, coursewareid: $stateParams.id
                }, function (data) {
                    if (data) {
                        getDataSource.getUrlData("../api/courseMainStatus", {
                            coursewareids: $stateParams.id, mainstatus: 7, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分类入库", nextstep: "结束", operationcontent: ($rootScope.user.name + "已完成分类入库，流程结束").toString()
                        }, function (data) {
                            if (data) {
                                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                                $scope.goback();
                            }
                            else
                                notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        }, function (errortemp) {
                            notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        });
                    }
                    else
                        notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (errortemp) {
                    notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                });
            }
            else {
                notify({ message: '请先选择课件分类！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }
    }
}]);
angular.module("myApp")
.controller("courseUeidtController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {
    $(function () {
        $('.inputmask').inputmask({
            mask: '99:99:99'
        })
    });
    //加载编辑信息
    $scope.gridEditOptions = {};
    $scope.loadEditInfo = function () {
        $scope.gridEditOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            data: [],
            columnDefs: [
              { name: '起始时间', field: "starttime", width: '15%' },
              { name: "截止时间", field: "endtime", width: '15%' },
              { name: "起始文字", field: "startword", width: '20%' },
              { name: "截止文字", field: "endword", width: '20%' },
              { name: "意见", field: "opinion", width: '25%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
    }
    $scope.loadEditInfo();


    //获取课件编辑数据
    $scope.loadEditData = function () {
        getDataSource.getDataSource("select_sy_courseware_edit", { coursewareid: $stateParams.id }, function (data) {
            $scope.gridEditOptions.data = data;
        })

    }
    $scope.loadEditData();


    //课程编辑
    $scope.coursewareedit = {
        coursewareid: $stateParams.id
    }
    //打开课件编辑
    $scope.openUeidt = function () {
        $scope.modalInstance = $modal.open({
            templateUrl: 'eidtInfo.html',
            size: 'lg',
            scope: $scope
        });
    }

    //保存课件编辑信息
    $scope.saveUeidt = function () {
        if ($scope.coursewareedit.starttime != undefined && $scope.coursewareedit.starttime != "") {
            getDataSource.getDataSource("insert_sy_courseware_edit", {
                coursewareid: $stateParams.id,
                starttime: $scope.coursewareedit.starttime,
                endtime: $scope.coursewareedit.endtime,
                startword: $scope.coursewareedit.startword,
                endword: $scope.coursewareedit.endword,
                opinion: $scope.coursewareedit.opinion
            }, function (data) {
                notify({ message: '添加成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadEditData();
                $scope.close();
                $scope.coursewareedit = {};
            })
        }
        else {
            notify({ message: '请输入起始时间！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }
    }

    //删除课件编辑信息
    $scope.deleteUeidt = function () {
        var selectUeidt = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectUeidt) {
            if (ids == "") {
                ids = selectUeidt[idx].id;
            } else {
                ids += "','" + selectUeidt[idx].id;
            }
        }
        getDataSource.getDataSource("delete_sy_courseware_editbyid", {
            ids: ids
        }, function (data) {
            notify({ message: '删除成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadEditData();
        })
    }

    //保存描述信息
    $scope.saveComment = function () {
        getDataSource.getDataSource("update_sy_courseware_comment", {
            id: $stateParams.id,
            comment: $scope.course.comment
        }, function (data) {
            notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        })
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);
angular.module("myApp")
.controller("courseUploadController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }

    $scope.saveviewfale = false;

    //保存课件
    $scope.saveVideoInfo = function () {
        if ($scope.course.teachervideo == "") {
            notify({ message: '请上传编辑后的课件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        getDataSource.getDataSource("update_sy_courseware_video_info", {
            coursewareid: $stateParams.id, teachervideo: $scope.course.teachervideo,
            pptvideo: $scope.course.pptvideo, teachervideoname: $scope.course.teachervideoname,
            pptvideoname: $scope.course.pptvideoname
        }, function (data) {
            if ($scope.saveviewfale) {
                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
            $scope.saveviewfale = true;
        })
    }

    //课件提交
    $scope.commitEditCourse = function () {
        $scope.saveviewfale = false;
        $scope.saveVideoInfo();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 5, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件编辑", nextstep: "课件完善", operationcontent: ($rootScope.user.name + "已提交编辑后的课件，等待完善课件").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }
    //打开视频预览弹窗
    $scope.openVideoPerview = function (type, vid) {
        if ($scope.course.videotype == 0) {
            perviewVideo(vid);
        }
        else {
            perviewDoubleVideo($scope.course);
        }

    }
    var perviewVideo = function (vid) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }

    var perviewDoubleVideo = function (course) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.teachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.pptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.course.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        if (type == 'videofile') {
            $scope.nowfile = $scope.course.videofile[0];
        }
        else {
            $scope.nowfile = $scope.course.pptfile[0];
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var options = {
            endpoint: 'http://v.polyv.net:1080/files/',
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ext: ext,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
          if (type == "videofile") {
              $scope.course.teachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.teachervideoname = file.name;
          }
          else {
              $scope.course.pptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.pptvideoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}]).controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
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
app.controller("coursewarecategoryController"
	, ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', "$modal", 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, $modal,notify, getDataSource, DateService, CommonService) {
		var apple_selected, tree, treedata_avm, treedata_geography;
		var id = 0;
		$scope.parentDisabled = false;
		$scope.nameDisabled = false;
		//$scope.childnameDisabled = false;
		$scope.saveCurrentButtonDisabled = false;
		//$scope.saveButtonDisabled = false;
		$scope.deleteDisabled = false;
		$scope.sortsDisabled = false;

		$scope.categoryForm = { sortnum: 0 };
		//选中事件
		$scope.my_tree_handler = function (branch) {
			$scope.output = ""; //"You selected: " + branch.label + ",rowid:" + branch.rowid+",fid="+branch.fid;
			//if ((_ref = branch.data) != null ? _ref.description : void 0) {
			//	return $scope.output += '(' + branch.data.description + ')';
		    //}
			//$scope.saveButtonDisabled = false;
			if (branch.rowid == "0") {
				$scope.parentDisabled = true;
				$scope.nameDisabled = true;
				$scope.categoryForm = { sortnum: 0 };

				$scope.saveCurrentButtonDisabled = true;
				$scope.deleteDisabled = true;
			} else {
				$scope.parentDisabled = false;
				$scope.nameDisabled = false;
				$scope.saveCurrentButtonDisabled = false;
				$scope.deleteDisabled = false;
				$scope.sortsDisabled = false;
				//$scope.childnameDisabled = false;
			}
			if (branch.isedit == 1) {
				$scope.parentDisabled = true;	 
				//$scope.childnameDisabled = true;
				$scope.nameDisabled = true;
				$scope.parentDisabled = true;
				$scope.sortsDisabled = true;

				$scope.saveCurrentButtonDisabled = true;
				$scope.deleteDisabled = true;
				//$scope.saveButtonDisabled = true;

			} else if (branch.isedit == 2) {
				if (branch.rowid == "0") {
					$scope.parentDisabled = true;
					$scope.nameDisabled = true;
					$scope.sortsDisabled = false;
					//$scope.childnameDisabled = false;
					//$scope.saveButtonDisabled = false;
				} else {
					$scope.parentDisabled = false;
					$scope.nameDisabled = false;
					$scope.sortsDisabled = false;
					//$scope.childnameDisabled = false;
				}
			}
			$scope.loadCourseCategoryParent(branch);
		};


		function drawDropChild(datatemp, fobj, str) {
			var tempobj = { id: fobj.id, fid: fobj.fid, name: fobj.name};
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			
			tempobj.name = str + '┕━' + fobj.name;
			$scope.parentCategory.push(tempobj);
			if (length > 0) {
				str = str + "　";
				for (var i = 0; i < length; i++) {
					drawDropChild(datatemp, childlist[i], str);
				}
			}
		}

		$scope.loadCourseCategoryParent = function (branch) {
			id = branch.rowid;
			getDataSource.getDataSource("select_courseCategoryParent", { platformid: $rootScope.user.platformid }, function (datatemp) {
				$scope.parentCategory = new Array();
				$scope.parentCategory.push({ id: "0", fid: "0", name: "根目录" });

				var fidData = _.filter(datatemp, { fid: "0" });
				var length = _.filter(fidData, { fid: "0" }).length;
				var str = '　';
				for (var i = 0; i < length; i++) {
					drawDropChild(datatemp, fidData[i], str);
				}

				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
					getDataSource.getDataSource("getcourseCategoryById", { id: id }, function (datatemp) {
						if (datatemp.length > 0) {
							$scope.categoryForm = datatemp[0];
						}
					}, function (errortemp) { });
				}
			}, function (errortemp) { });
		}

		$scope.ok = function () {
			$scope.isAccept = true;
			$scope.deleteDisabled = true;
			getDataSource.getDataSource("select_courseCategoryChildren", { fid: id }, function (datatemp) {
				var childrencount = datatemp.length;
				//id不为空，则认为为修改
				if (childrencount <= 0) {
					getDataSource.getDataSource("deletecourseCategoryById", { id: id }, function (datatemp) {
						if (datatemp.length > 0) {
							notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$scope.my_data = [];
							$scope.categoryForm = { sortnum: 0 };
							$scope.deleteDisabled = true;
							$scope.loadCategoryTree();
						} else {
							$scope.deleteDisabled = false;
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) { });
				} else {
					notify({ message: '删除失败，请先删除分类下子分类。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.deleteDisabled = false;
				}
			}, function (errortemp) { });
			$scope.close();
		}
	    //打开新增窗口
		$scope.OpenNewForm = function () {
		    $scope.modalInstance = $modal.open({
		        templateUrl: 'newcategory.html',
		        size: 'bg',
		        scope: $scope
		    });
		}
		//关闭模式窗口
		$scope.close = function () {
			$scope.modalInstance.dismiss('cancel');
		}

		//删除
		$scope.deleteCourseCategory = function () {
			$scope.modalInstance = $modal.open({
				templateUrl: 'confirm.html',
				size: 'sm',
				scope: $scope
			});
		}

		$scope.saveCurrentCourseCategory = function () {
			$scope.saveCurrentButtonDisabled = true;
			var newid = getDataSource.getGUID();
			if (id != undefined && id != "0" && id != undefined && id != null) {

			    var newid = getDataSource.getGUID();

			    fids = $scope.categoryForm.id;
			    $scope.getFids($scope.categoryForm.fid);
			    if (fids) {
			        //反转
			        var fidsArray = fids.split('.');
			        _.reverse(fidsArray)
			        var length = fidsArray.length;
			        fids = _.join(fidsArray, '.');
			    }
			    if (fids == undefined) {
			        fids = newid;
			    }
			    var fid = "";
			    if ($scope.categoryForm.fid == "" || $scope.categoryForm.fid == undefined) {
			        fid = "0";
			    }

				//var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
				//var fids = "";
				//if (temp != null) {
				//	fids = temp.id + "." + id;
				//} else {
				//	fids = id;
				//}

				getDataSource.getDataSource("updateCourseCategoryById",
					{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids },
					function (datatemp) {
						$scope.saveCurrentButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$scope.my_data = [];
							$scope.categoryForm = { sortnum: 0 };
							//id = 0;
							$scope.loadCategoryTree();
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveCurrentButtonDisabled = false;
					});
			}
		}

		var fids = "";
		$scope.getFids = function (fid) {
		    var temp = _.find($scope.parentCategory, { id: fid });
		    if (temp != null && temp.id!="0") {
		        fids = fids + "." + temp.id;
		        $scope.getFids(temp.fid);
		    }
		}

		//$scope.test = function () {
		//    var newid = getDataSource.getGUID();
		//    fids = $scope.categoryForm.id;
		//    $scope.getFids($scope.categoryForm.fid);
		//    if (fids) {
		//        //反转
		//        var fidsArray = fids.split('.');
		//        _.reverse(fidsArray)
		//        var length = fidsArray.length;
		//        fids = _.join(fidsArray,'.');
		//    }
		//    console.log("fids", fids);
		//}
		
		

		$scope.saveCourseCategory = function () {
			//$scope.saveButtonDisabled = true;
		    var newid = getDataSource.getGUID();

		    fids = $scope.categoryForm.id;
		    $scope.getFids($scope.categoryForm.fid);
		    if (fids) {
		        //反转
		        var fidsArray = fids.split('.');
		        _.reverse(fidsArray)
		        var length = fidsArray.length;
		        fids = _.join(fidsArray, '.');
		    }
		    if (fids == undefined) {
		        fids = newid;
		    }

			//fids = $scope.categoryForm.id;
			//$scope.getFids($scope.categoryForm.fid);

			//var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
			//if (temp != null) {
			//	fids = temp.id + "." + newid;
			//} else {
			//	fids = newid;
			//}

			var fid = id;
			if (fid == undefined || fid == "0") {
				fid = "0";
			}

			var postObj = {};
			postObj.id=newid;
			postObj.fid=fid; 
			postObj.name=$scope.categoryForm.childname;
			postObj.sortnum=$scope.categoryForm.sortnum;
			postObj.platformid=$rootScope.user.platformid
			postObj.fids=fids;
			postObj.categoryid = newid;
			//var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + newid;
			getDataSource.getDataSource(["insert_courseCategory"], postObj,
				function (datatemp) {
					//$scope.saveButtonDisabled = false;
					if (datatemp.length > 0) {
						notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.categoryForm = { sortnum: 0 };
						id = 0;
						$scope.loadCategoryTree();
						$scope.close();
					} else {
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) {
					//$scope.saveButtonDisabled = false;
				});
			//}
		}


		$scope.my_data = new Array();
		$scope.my_tree = tree = {};

        //分平台分类数据获取
		$scope.loadCategoryTree = function () {
			getDataSource.getDataSource("select_courseCategoryParent", { platformid: $rootScope.user.platformid }, function (data) {
				var allplatform = data;

				var root = new Object();
				root.label = "总平台课程分类";
				root.rowid = "0";
				root.children = new Array();
				root.isedit = 1;
				for (var i = 0; i < allplatform.length; i++) {
					if (allplatform[i].fid == '0') {
						drawChild(root, allplatform, allplatform[i])
					}
				}
				$scope.my_data.push(root);
				$scope.doing_async = false;
				tree.expand_all();
			}, function (errortemp) {

			});
		}

		function drawChild(root, datatemp, fobj) {
			var tempobj = { label: fobj.name,rowid:fobj.id, children: [],isedit:fobj.category };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length=childlist.length;
			if (length > 0) {
				for (var i = 0; i < length; i++) {
					drawChild(tempobj, datatemp, childlist[i]);
				}
			}
			root.children.push(tempobj);
		}
		$scope.try_async_load = function () {
			$scope.my_data = new Array();
			$scope.doing_async = true;
			$scope.loadCategoryTree();

		};
		$scope.try_async_load();
}])
angular.module("myApp")
.controller("coursewarecategoryeditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "$validation"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, $validation) {
		$scope.parentCategory = [];
		$scope.categoryForm=new Object();
		$scope.saveButtonDisabled = false;
		var id = $stateParams.id;
		$scope.loadCourseCategoryParent = function () {
			getDataSource.getDataSource("select_courseCategoryParent", {}, function (datatemp) {
				$scope.parentCategory = datatemp;
				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
					getDataSource.getDataSource("getcourseCategoryById", { id: id }, function (datatemp) {
						$scope.categoryForm = datatemp[0];
					}, function (errortemp) { });
				} 
				//var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.parentid }).id + "," + newid;
				
			}, function (errortemp) { });
		}

		$scope.loadCourseCategoryParent();

		$scope.saveCourseCategory = function () {
			$scope.saveButtonDisabled = true;
			var newid = getDataSource.getGUID();

			if (id != "" && id != undefined && id != null) {
				var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + id;
				getDataSource.getDataSource("updateCourseCategoryById",
					{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, fids: fids },
					function (datatemp) {
						//console.log(datatemp);
						$scope.saveButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$state.go("index.coursewarecategoryedit", { id: id });
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveButtonDisabled = false;
					});
			} else {
				var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + newid;
				getDataSource.getDataSource("insert_courseCategory",
					{ id: newid, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, platformid: $rootScope.user.platformid, fids: fids },
					function (datatemp) {
						$scope.saveButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$state.go("index.coursewarecategoryedit", { id: newid });
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveButtonDisabled = false;
					});
			}
		}
}]);
angular.module("myApp")
.controller("coursewarelistController", ['$rootScope', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", function ($rootScope, $scope, getDataSource, $state, $stateParams, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "name", width: '49%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '授课人', field: "teachersname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
          { name: '状态', field: "mainstatus", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "mainStatusFilters" }
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
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.goDetial = function (row) {
        if ($stateParams.type == "all") {
            switch (row.entity.mainstatus) {
                case 0:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "upload" });
                    break;
                case 1:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "distribution" });
                    break;
                case 2:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "examine" });
                    break;
                case 3:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "authorization" });
                    break;
                case 4:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "wareedit" });
                    break;
                case 5:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "perfect" });
                    break;
                case 6:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "storage" });
                    break;
                case 7:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "formal" });
                    break;
                case -2:
                    $state.go("index.courseEdit", { id: row.entity.id, type: "waredelete" });
                    break;
            }

        }
        else {
            $state.go("index.courseEdit", { id: row.entity.id, type: $stateParams.type });
        }
    }

    $scope.courseware = {
        functionname: "selectAllCoursewareBymainstatus",
        userid: "",
        mainstatus: 0,
        mainStatusShow: false,
        uploadShow: false,
        distributionShow: false
    };
    $scope.mainstatus = 0;
    $scope.type = $stateParams.type;
    $scope.setCourseWareType = function () {
        switch ($stateParams.type) {
            case "upload":
                $scope.courseware.mainstatus = 0;
                $scope.courseware.uploadShow = true;
                break;
            case "distribution":
                $scope.courseware.mainstatus = 1;
                $scope.courseware.distributionShow = true;
                break;
            case "examine":
                $scope.courseware.mainstatus = 2;
                $scope.courseware.userid = $rootScope.user.accountId;
                $scope.courseware.functionname = "selectAllCoursewareByuserid";
                break;
            case "authorization":
                $scope.courseware.mainstatus = 3;
                break;
            case "wareedit":
                $scope.courseware.mainstatus = 4;
                break;
            case "perfect":
                $scope.courseware.mainstatus = 5;
                break;
            case "storage":
                $scope.courseware.mainstatus = 6;
                break;
            case "formal":
                $scope.courseware.mainstatus = 7;
                break;
            case "waredelete":
                $scope.courseware.mainstatus = -2;
                break;
            case "all":
                $scope.courseware.functionname = "selectCoursewareAll";
                $scope.courseware.mainStatusShow = true;
                break;
        }
    }

    $scope.loadGrid = function () {
        $scope.setCourseWareType();
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList($scope.courseware.functionname, { mainstatus: $scope.courseware.mainstatus, userid: $scope.courseware.userid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }

    $scope.loadGrid();

    //加载审核小组
    $scope.gridExamineOptions = {};
    $scope.loadExamineUser = function () {
        $scope.gridExamineOptions = {
            useExternalPagination: false,
            useExternalSorting: false,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            data: [],
            columnDefs: [
              { name: "姓名", field: "name", width: '99%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridExamineApi = gridApi;
            }
        };
    }
    $scope.loadExamineUser();

    //提交
    $scope.commitCourseInfo = function () {
        var selectCourse = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectCourse) {
            if (ids == "") {
                ids = selectCourse[idx].id;
            } else {
                ids += "','" + selectCourse[idx].id;
            }
        }

        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: ids, mainstatus: 1, operationuser: $rootScope.user.name, currentstep: "课件上传", nextstep: "课件分配", operationcontent: ($rootScope.user.name + "已提交课件，等待分配审核").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //删除
    $scope.delete = function () {
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
            coursewareids: ids, mainstatus: -2, operationuser: $rootScope.user.name, currentstep: "课件删除", nextstep: "结束", userid: $rootScope.user.accountId,
            operationcontent: ($rootScope.user.name + "课件删除").toString(), laststatus: 0, deleteContent: ""
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
    }

    //打开选人页面
    $scope.OpenUserInfo = function () {
        getDataSource.getDataSource("select_sy_user_examine", { platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridExamineOptions.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'examinePerview.html',
                size: 'lg',
                scope: $scope
            });
        })
    }

    //分配
    $scope.distributionCourseware = function () {
        var selectCourse = $scope.gridApi.selection.getSelectedRows();
        var ids = "";
        for (var idx in selectCourse) {
            if (ids == "") {
                ids = selectCourse[idx].id;
            } else {
                ids += "','" + selectCourse[idx].id;
            }
        }
        //获取审核人
        var selectUser = $scope.gridExamineApi.selection.getSelectedRows();
        getDataSource.getDataSource("insert_sy_courseware_operation", { ids: ids, userid: selectUser[0].id, username: selectUser[0].name, idss: ids }, function (data) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: ids, mainstatus: 2, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分配", nextstep: "课件审核", operationcontent: ($rootScope.user.name + "已分配课件给" + selectUser[0].name + "，等待审核").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '分配成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadGrid();
                    $scope.close();
                }
                else
                    notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        })

    }

    //关闭
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }



}]).filter('mainStatusFilters', function () {
    var genderHash = {
        "-2": '已删除',
        "0": '未提交',
        "1": '待分配',
        "2": '待审核',
        "3": '待授权',
        "4": '待编辑',
        "5": '待完善',
        "6": '待分类',
        "7": '已入库'
    };
    return function (input) {
        if (input != null && input != undefined)
            return genderHash[input];
        else
            return "";
    };
});
angular.module("myApp")
.controller("coursewareEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable"
	, "CommonService", "FilesService", "DateService", "$timeout", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state,
		drawTable, CommonService, FilesService,DateService, $timeout) {
		$scope.course = { teachers: [], videotype: 0, createtime: DateService.format(new Date(), "yyyy-MM-dd") };

	
    
    $scope.courseware = { coursePerfectEditShow: true };
    var obj = {};
    //getDataSource.getDataSource("selectLive", {}, function (data) {
    //    $scope.items = data;
    //    angular.forEach($scope.items, function (item) {
    //        item.nowsrc = FilesService.showFile('livePhoto', item.pic_servername, item.pic_servername);
    //        //item.nowsrc = "http://192.168.1.119/fileTest/img/livePhoto/" + item.pic_servername;
    //    })
    //})
    $scope.st = {};
    $scope.checkedAnswer = {};
    $scope.nowid = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.typeShow = true;
    if ($scope.type == "1")
        $scope.typeShow = false;
    $scope.saveButtonDisabled = false;
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }
    getDataSource.getDataSource("selectAllTeacher", { platformid: $rootScope.user.platformid}, function (data) {
        $scope.allTeachers = data;
    });

    $scope.GetRealDuration = function () {
        getDataSource.getUrlData("../api/getRealDuration", { vid: $scope.course.teachervideo }, function (data) {
            $scope.course.realduration = data[0].duration;
        }, function (error) { })
    }




    $scope.gridOptions = {};
    $scope.gridSTOptions = {};
    $scope.gridApiST = {};
    $scope.gridXXOptions = {};
    $scope.answers = [];

    //getDataSource.getDataSource("getAllMicroVideoByNotCourse", { coursewareid: $scope.nowid }, function (data) {
    //    $scope.allMicroVideo = data;
    //});

    //$scope.doinitMicroVideo = function () {
    //    getDataSource.getDataSource("getCourseMicroVideo", { courseid: $scope.course.id }, function (data) {
    //        $scope.gridOptions.data = data;
    //    })
    //}
    //$scope.doinitMicroVideo();
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '微视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewMicroVideo(row)">{{row.entity.name}}</a></div>' },
          { name: '提供者', field: "provider" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridMicrApiST = gridApi;
        }
    };

    //删除试题
    $scope.deleteST = function () {
        var selectRows = $scope.gridApiST.selection.getSelectedRows();
        getDataSource.doArray("deleteExam", selectRows, function (data) {
            $scope.doinitST();
        });
    }
    //试题初始化
    $scope.doinitST = function () {
        getDataSource.getDataSource("selectExamByCourse", { id: $stateParams.id }, function (data) {
            $scope.gridSTOptions.data = data;
        })
    }
    $scope.doinitST();
    $scope.gridSTOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '试题名称', field: "examtitle", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.oepnST(row)">{{row.entity.examtitle}}</a></div>' },
          { name: '题型', field: "examcategory", cellFilter: "examCategoryFilter" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApiST = gridApi;
        }
    };

    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }

    $scope.addMicroDisabled = false;
    $scope.addMicroVideo = function () {
    	$scope.addMicroDisabled = true;
        //getDataSource.getDataSource("delete_sy_course_relation", { id: $scope.course.id, type: 2 }, function () {
        var forInsert = [];
        angular.forEach($scope.course.microVideo, function (item) {
            forInsert.push({
                id: getDataSource.getGUID(),
                coursewareid: $scope.course.id,
                sourceid: item.id,
                type: 2
            });
        });
        getDataSource.doArray("insert_sy_course_relation", forInsert, function (data) {
            angular.forEach($scope.course.microVideo, function (item) {
                _.remove($scope.allMicroVideo, { id: item.id });
            });
            $scope.course.microVideo = [];
            $scope.doinitMicroVideo();
            $scope.addMicroDisabled = false;
        }, function (error) {
        	$scope.addMicroDisabled = false;
        });
        //});
    };

    $scope.delMicroVideo = function () {
        var selectRows = $scope.gridMicrApiST.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("deleteCourseMicroVideo", selectRows, function (data) {
                $scope.doinitMicroVideo(); 
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }


    $scope.coursewareCategoryRoot = {};
    $scope.coursewareCategoryData = {};
    $scope.Category = {
        selectedCategoryRoot: "",
        selectedCategoryInfo: "",
    };

    //获取分类信息
    getDataSource.getDataSource("select_sy_courseware_category_root", {}, function (data) {
        $scope.coursewareCategoryRoot = data;


        if ($stateParams.id) {
            getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation", "getCategoryByCourse"],
                {
                    id: $stateParams.id,
                    coursewareid: $stateParams.id,
                    courseid: $stateParams.id
                }, function (data) {
                var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
                $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
                $scope.course.teachers = teachrRelation.data;
                $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);
                var courseCategory = _.find(data, function (o) { return o.name == "getCategoryByCourse"; }).data[0];
                if (courseCategory.fid == "0" || courseCategory.fid == "") {
                    $scope.Category.selectedCategoryRoot = courseCategory.id;
                    $scope.Category.selectedCategoryInfo = "";
                } else {
                    $scope.Category.selectedCategoryRoot = courseCategory.fid;
                    $scope.categoryRootChange(courseCategory.id);
                }
            });
        }
        else {
            if (data != null && data != undefined && data.length > 0) {
                $scope.Category.selectedCategoryRoot = data[0].id;
                $scope.categoryRootChange();
            }
        }
    }, function (data) {
        notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    });


    $scope.categoryRootChange = function (categoryid) {
        getDataSource.getDataSource("select_sy_courseware_categorybyfid", { fid: $scope.Category.selectedCategoryRoot, platformid: $rootScope.user.platformid }, function (data) {
            $scope.coursewareCategoryData = data;
            if (categoryid && categoryid != "") {
                $timeout(function () {
                    $scope.Category.selectedCategoryInfo = categoryid;
                }, 500);
            }
            else {
                if (data != null && data != undefined && data.length > 0) {
                    $scope.Category.selectedCategoryInfo = data[0].id;
                }
            }
        }, function (data) {
            notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    };

    //删除一个试题答案
    $scope.deleteAnswer = function (item) {
        _.pull($scope.answers, item);
    }
	//保存一个试题
    $scope.saveExamDisabled = false;
    $scope.addST = function () {
    	$scope.saveExamDisabled = true;
        if ($scope.st.examcategory == 0) {
            angular.forEach($scope.answers, function (item) {
                if (item.id == $scope.checkedAnswer.checkedID) {
                    item.isright = 1;
                }
                else {
                    item.isright = 0;
                }
            })
        }
        var stRight = 0;
        angular.forEach($scope.answers, function (item) {
            if (item.isright == true) {
                stRight++;
            }
        });
        if (stRight == 0)
        {
            notify({ message: '必须选择一个正确答案', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        if ($scope.newst) {
            $scope.st.id = getDataSource.getGUID();
            $scope.st.coursewareid = $stateParams.id;
            angular.forEach($scope.answers, function (data) {
                data.examid = $scope.st.id;
            });
            getDataSource.getDataSource("addCourseExam", $scope.st, function (data) {
            	$scope.saveExamDisabled = false;
                getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                    $scope.doinitST();
                    $scope.close();
                });
            }, function (error) {
            	$scope.saveExamDisabled = false;
            });
        }
        else {
        	getDataSource.getDataSource("updateCourseExam", $scope.st, function (data) {
        		$scope.saveExamDisabled = false;
                getDataSource.getDataSource("deleteExamAnswer", { examid: $scope.st.id }, function (data) {
                    getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                        $scope.doinitST();
                        $scope.close();
                    });
                });
        	}, function (error) { $scope.saveExamDisabled = false; });
        }
    }
    //新增一个试题答案
    $scope.addExamAnswer = function () {
        $scope.answers.push({
            id: getDataSource.getGUID(),
            isright: false,
            answer: "",
            examid: $scope.st.id
        });
    }
    $scope.uploadpptFiles = function (file, errFiles) {
        $scope.course.pptfile = file;
        $scope.process_pptfile = 0;
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.goback = function () {
        if ($scope.type == "1")
            $state.go("index.alumnusCourseware");
        else
            $state.go("index.courseware");
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }
    $scope.save = function () {
        //保存封面图
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 200, height: 120 }, function (data) {
                $scope.course.imagephoto = data.data[0].servername;
                doSave();
            });
        }
        else {
            doSave();
        }

    }


    var saveCategory = function (courseid) {

        if ($scope.Category.selectedCategoryInfo == "") {
            $scope.Category.selectedCategoryInfo = $scope.Category.selectedCategoryRoot;
        }
        getDataSource.getUrlData("../api/courseMove", {
            categoryids: courseid, categoryid: $scope.Category.selectedCategoryInfo, rootCategoryid: $scope.Category.selectedCategoryRoot
        }, function (data) {}, function (errortemp) {});
    }

    var doSave = function () {
        $scope.saveButtonDisabled = true;
        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
        	//insertCourseKeyWordRelation($stateParams.id);
            if ($scope.course.videotype == 3) {
            	$scope.course.coursetype = 1;
            }
            else
                $scope.course.coursetype = 0;
            getDataSource.getDataSource("updateCoursewareById", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	insertPptCoursewareQueue($scope.course.id);
            	saveCategory($scope.course.id);
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            });
        }
        else {
            var newid = getDataSource.getGUID();
            $scope.course.id = newid;
            insertCourseRelation(newid);
            //insertCourseKeyWordRelation($stateParams.id);
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            //$scope.course.createtime = new Date();
            $scope.course.mainstatus = 7;
            if ($scope.course.videotype!=3) {
                $scope.course.mainstatus = 0;
                $scope.course.coursetype = 0;
            } else {
            	$scope.course.coursetype = 1;
            }
            getDataSource.getDataSource("insertCourseware", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	insertPptCoursewareQueue($scope.course.id);
            	saveCategory($scope.course.id);
            	//var pkgcse = new Object();
            	//pkgcse.platformid = $rootScope.user.platformid;
            	//pkgcse.coursewareid = newid;
            	//pkgcse.coursewarename = $scope.course.name;
            	//pkgcse.isshare = 0;
            	$state.go("index.coursewareEdit", { id: newid });
            	//getDataSource.getDataSource("insertPkgCourseware", pkgcse, function (data) {
            		
            	//}, function (error) { });
            });
        }
    }

	//插入PPT转换队列记录
    var insertPptCoursewareQueue = function (coursewareid) {
    	var Queues = [];
    	//angular.forEach($scope.course.teachers, function (item) {
    	//	teachers.push({
    	//		id: getDataSource.getGUID(),
    	//		coursewareid: coursewareid,
    	//		sourceid: item.id,
    	//		type: 0
    	//	});
    	//});

    	getDataSource.getDataSource("delete_sy_pptcourseware_queue", { coursewareid: coursewareid }, function () {
    		$scope.course.foldername = "pptCourseFile";
    		getDataSource.getDataSource("insert_sy_pptcourseware_queue", $scope.course, function (data) {
    			//console.log("$scope.course", $scope.course);
    		});
    	});
    }

    //插入班级课程关系
    var insertCourseRelation = function (coursewareid) {
        var teachers = [];
        angular.forEach($scope.course.teachers, function (item) {
            teachers.push({
                id: getDataSource.getGUID(),
                coursewareid: coursewareid,
                sourceid: item.id,
                type: 0
            });
        });

        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 0 }, function () {
            getDataSource.doArray("insert_sy_course_relation", teachers, function (data) {
            });
        });
    }

    ////插入课程关键词关系
    //var insertCourseKeyWordRelation = function (coursewareid) {
    //    var keyWords = [];
    //    angular.forEach($scope.course.courseKeywordOne, function (item) {
    //        keyWords.push({
    //            id: getDataSource.getGUID(),
    //            coursewareid: coursewareid,
    //            sourceid: item.id,
    //            type: 4
    //        });
    //    });

    //    angular.forEach($scope.course.courseKeywordTwo, function (item) {
    //        keyWords.push({
    //            id: getDataSource.getGUID(),
    //            coursewareid: coursewareid,
    //            sourceid: item.id,
    //            type: 5
    //        });
    //    });

    //    getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 4 }, function () {
    //        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 5 }, function () {
    //            getDataSource.doArray("insert_sy_course_relation", keyWords, function (data) {
    //            });
    //        });
    //    });
    //}


    //打开视频预览弹窗
    $scope.openVideoPerview = function (type, vid) {
        if ($scope.course.videotype == 0) {
            perviewVideo(vid);
        }
        else {
            perviewDoubleVideo($scope.course);
        }

    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }
    //更换试题类型，清空所有课题
    $scope.changeST = function () {
        $scope.answers = [];
    }

    //打开试题编辑窗口
    $scope.oepnST = function (row) {
        //是否是新增试题
        if (row) {
            $scope.newst = false;
            $scope.st = row.entity;
            getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                var checkedid = "";
                angular.forEach(data, function (item) {
                    if (item.isright == 1) {
                        checkedid = item.id;
                        item.isright = true;
                    }
                });
                $scope.answers = data;
                $scope.checkedAnswer.checkedID = checkedid;
            });
        }
        else {
            $scope.newst = true;
            $scope.st = {};
            $scope.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'ST.html',
            size: 'lg',
            scope: $scope
        });
        $scope.stPlatformDisabled = false;
        if ($scope.course.isshare == 1) {
        	$scope.stPlatformDisabled = true;
        }
    }

    var perviewDoubleVideo = function (course) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.teachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.pptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.course.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        if (type == 'videofile') {
            $scope.nowfile = $scope.course.videofile[0];
        }
        else {
            $scope.nowfile = $scope.course.pptfile[0];
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var ts = new Date().getTime();
        var newhash=md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
        var options = {
            endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ts: ts,
            hash: newhash,
            userid: $rootScope.appConfig.vhallConfig.userid,
            ext: ext,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
          if (type == "videofile") {
              $scope.course.teachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.teachervideoname = file.name;
          }
          else {
              $scope.course.pptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.pptvideoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }

	//上传PPT
    $scope.selectFiles = function (files) {
    	if (files && files.length > 0) {
    		//当前选择的文件
    		var strlist = files[0].name.split('.');
    		//var attachEx = ["ppt", "pptx"];
    		var attachEx = ["pdf"];
    		if (_.indexOf(attachEx, strlist[strlist.length - 1]) < 0) {
    			notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		}
    		else {
    			$scope.selectFile = files[0];
    			if ($scope.selectFile) {
    				FilesService.upLoadFiles($scope.selectFile, "pptCourseFile", function (data) {
    					$scope.course.pptcoursefile_servername = data.data[0].servername;
    					$scope.course.pptcoursefile_clientname = $scope.selectFile.name;
    					//doSave();
    				});
    			}
    		}
    	}
    };
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
angular.module("myApp")
.controller("coursewareQuestController", ['$scope', '$rootScope', '$stateParams', 'getDataSource', "$state", 'notify', '$modal', 'CommonService', function ($scope, $rootScope, $stateParams, getDataSource, $state, notify, $modal, CommonService) {
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '问卷名称', field: "title", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },
          { name: '问卷类型', field: "category", cellFilter: "questCategoryFilter" },
          { name: '创建人', field: "createuser" },
          { name: '创建时间', field: "createtime", cellFilter: "date:'yyyy-MM-dd'" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var forDelete = [];
        angular.forEach(selectRows, function (item) {
            forDelete.push({
                id: item.id,
                coursewareid:$stateParams.id
            });
        });
        getDataSource.doArray("delete_sy_course_relationBysourceId", forDelete, function (data) {
            $scope.loadGrid();
        });
    }
    $scope.goNew = function () {
        $state.go("index.questionnaire_edit", {id:'', coursewareid: $stateParams.id });
    }
    $scope.goDetial = function (item) {
        $state.go("index.questionnaire_edit", { id: item.entity.id, coursewareid: $stateParams.id });
    }
    $scope.loadGrid = function () {
    	getDataSource.getDataSource(["select_sy_questionnaire_byCoursewareid", "selectCoursewareById"], { platformid: $rootScope.user.platformid, coursewareid: $stateParams.id, id: $stateParams.id }, function (data) {
    		$scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
    		//console.log("$scope.course", $scope.course);
    		if ($scope.course.isshare == 1) {
    			CommonService.initInputControlDisabled();
    		}
    		$scope.gridOptions.data = _.find(data, function (o) { return o.name == "select_sy_questionnaire_byCoursewareid"; }).data;
        })
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("departmentController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService', '$timeout',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService, $timeout) {

    }]);
angular.module("myApp")
.controller("downloadController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {

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
            { name: '资料名称', field: "attach", width: '30%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.attach_servername, row.entity.attach_clientname, \'download\')">{{row.entity.attach}}</a></div>' },
			 { name: "资料说明", field: "remark", width: '10%' },
            { name: '资料类型', field: "category", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 1 ?"常用资源":"常用软件"}}</div>' },
            { name: '首页显示', field: "bottomshow", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bottomshow == 0 ?"不显示":"显示"}}</div>' },
            { name: '首页排序', field: "bottomsort", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bottomsort}}</div>' },
              { name: "创建人", field: "username", width: '10%' },
              { name: "发布时间", field: "publishtime", width: '15%' },
              { name: "状态", field: "status", width: '15%' },
              

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("getMaterial", {}, function (data) {
                $scope.gridOptions.data = data;
            });
        }
        $scope.loadSource();


        //打开课程资料窗口
        $scope.files = [];

        $scope.saveAttachDisabled = false;
        $scope.addmaterial = function (row) {
            $scope.saveAttachDisabled = false;

            $scope.files = [];
            $scope.uploadFiles = function (files) {
                $scope.files = files;
            }

            //新增
            $scope.downloadInfo = {
                id: '',
                attach: '',
                attach_clientname: '',
                attach_servername: '',
                status: 0,
                createuser: $rootScope.user.name,
                category: 1,
                attach_logo: "",
                bottomshow: 0,
                bottomsort: "0"

            };
            $scope.selectFile = null;

            $scope.modalInstance = $modal.open({
                templateUrl: 'AttachDetail.html',
                size: 'lg',
                scope: $scope
            });
        }


        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //下载文件
        $scope.downFiles = function (attachservername, attachname, type) {
            return FilesService.downFiles(type, attachservername, attachname);
        }

        $scope.selectFiles = function (files) {
            if (files && files.length > 0) {
                //当前选择的文件
                //var strlist = files[0].name.split('.');
                //if (_.indexOf($rootScope.appConfig.attachTypes, strlist[strlist.length - 1]) < 0) {
                //    notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                //}
                //else {
                //    $scope.selectFile = files[0];
                //    //console.log($scope.selectFile);
                //}

                $scope.selectFile = files[0];
            }
        };


        $scope.doSave = function () {
            var newid = getDataSource.getGUID();
            $scope.downloadInfo.id = newid;
            if ($scope.downloadInfo.attach == "")
                $scope.downloadInfo.attach = $scope.downloadInfo.attach_clientname


            getDataSource.getDataSource("insert_sy_material", $scope.downloadInfo, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadSource();
                $scope.modalInstance.dismiss('cancel');
                $scope.saveAttachDisabled = false;
                //$state.go("index.newsEdit", { id: newid });
            });
        }
        $scope.Addattach = function () {

            if ($scope.downloadInfo.category == 2) {
                if ($scope.files.length <= 0) {
                    notify({ message: '请选择软件图标', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }
            }

        	$scope.saveAttachDisabled = true;
        	if ($scope.downloadInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadFiles($scope.selectFile, "download", function (data) {

                        $scope.downloadInfo.attach_clientname = $scope.selectFile.name;
                        $scope.downloadInfo.attach_servername = data.data[0].servername;

                        if ($scope.downloadInfo.category == 2) {
                            if ($scope.files) {
                                FilesService.upLoadPicture($scope.files[0], { upcategory: "download", width: 500, height: 300 }, function (data) {
                                    $scope.downloadInfo.attach_logo = data.data[0].servername;

                                    $scope.doSave();

                                }, function (error) { $scope.saveDisabled = false; });
                            }
                            else
                                notify({ message: '请选择软件图标', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        }
                        else
                            $scope.doSave();
                    }, function (error) {
                    	$scope.saveAttachDisabled = false;
                        notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                }
                else {
                	$scope.saveAttachDisabled = false;
                    notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        	else {
        		$scope.saveAttachDisabled = false;
                notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }

        //发布
        $scope.publish = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("publishmaterial", selectRows, function (data) {
                    notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deletematerial", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.unpageshow = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deletematerial", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);
app.controller("getSQLController", ["$scope", "$state", "getDataSource", "$http", "$timeout", "$filter", function ($scope, $state, getDataSource, $http, $timeout, $filter) {
    $scope.alerts = [
  { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];
    $scope.alert1 = function () {
        var d = $filter('date')($scope.mydate, "yyyy-MM-dd");
    };
    $scope.addAlert = function () { 
        $scope.alerts.push({ msg: 'Another alert!' });
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.mytbl = {};
    $scope.mytbl.get = function (index, count, success) {
        getDataSource.getDataSource("gettbl", {}, function (data) {
            $scope.datasouce = data;
        });
        $timeout(function () {
            var result = [];
            for (var i = index; i <= index + count - 1; i++) {
                if ($scope.datasouce[i])
                    result.push($scope.datasouce[i]);
            }
            success(result);
        }, 100);
    };

    $scope.ng_grid = function () {
        $state.go("main.content");
    }
    $scope.refalshSQL = function () {
        $http.post("../api/SQLHandler", {}).success(function () {
        });
    }
    $scope.vm = {}; 
    $scope.vm.countries = [ // Taken from https://gist.github.com/unceus/6501985
   { name: 'Afghanistan', code: 'AF' },
   { name: 'Åland Islands', code: 'AX' },
   { name: 'Albania', code: 'AL' },
   { name: 'Algeria', code: 'DZ' },
   { name: 'American Samoa', code: 'AS' },
   { name: 'Andorra', code: 'AD' },
   { name: 'Angola', code: 'AO' },
   { name: 'Anguilla', code: 'AI' },
   { name: 'Antarctica', code: 'AQ' },
   { name: 'Antigua and Barbuda', code: 'AG' },
   { name: 'Argentina', code: 'AR' },
   { name: 'Armenia', code: 'AM' },  
   { name: 'Aruba', code: 'AW' },
   { name: 'Australia', code: 'AU' }, 
   { name: 'Austria', code: 'AT' },
   { name: 'Azerbaijan', code: 'AZ' },
   { name: 'Bahamas', code: 'BS' },
   { name: 'Bahrain', code: 'BH' },
   { name: 'Bangladesh', code: 'BD' },
   { name: 'Barbados', code: 'BB' },
   { name: 'Belarus', code: 'BY' },
   { name: 'Belgium', code: 'BE' }, 
   { name: 'Belize', code: 'BZ' },
   { name: 'Benin', code: 'BJ' },
   { name: 'Bermuda', code: 'BM' },
   { name: 'Bhutan', code: 'BT' },
   { name: 'Bolivia', code: 'BO' },
   { name: 'Bosnia and Herzegovina', code: 'BA' },
   { name: 'Botswana', code: 'BW' },
   { name: 'Bouvet Island', code: 'BV' },
   { name: 'Brazil', code: 'BR' },
   { name: 'British Indian Ocean Territory', code: 'IO' },
   { name: 'Brunei Darussalam', code: 'BN' },
   { name: 'Bulgaria', code: 'BG' },
   { name: 'Burkina Faso', code: 'BF' },
   { name: 'Burundi', code: 'BI' },
   { name: 'Cambodia', code: 'KH' },
   { name: 'Cameroon', code: 'CM' },
   { name: 'Canada', code: 'CA' },
   { name: 'Cape Verde', code: 'CV' },
   { name: 'Cayman Islands', code: 'KY' },
   { name: 'Central African Republic', code: 'CF' },
   { name: 'Chad', code: 'TD' },
   { name: 'Chile', code: 'CL' },
   { name: 'China', code: 'CN' },
   { name: 'Christmas Island', code: 'CX' },
   { name: 'Cocos (Keeling) Islands', code: 'CC' },
   { name: 'Colombia', code: 'CO' },
   { name: 'Comoros', code: 'KM' },
   { name: 'Congo', code: 'CG' },
   { name: 'Congo, The Democratic Republic of the', code: 'CD' },
   { name: 'Cook Islands', code: 'CK' },
   { name: 'Costa Rica', code: 'CR' },
   { name: 'Cote D\'Ivoire', code: 'CI' },
   { name: 'Croatia', code: 'HR' },
   { name: 'Cuba', code: 'CU' },
   { name: 'Cyprus', code: 'CY' },
   { name: 'Czech Republic', code: 'CZ' },
   { name: 'Denmark', code: 'DK' },
   { name: 'Djibouti', code: 'DJ' },
   { name: 'Dominica', code: 'DM' },
   { name: 'Dominican Republic', code: 'DO' },
   { name: 'Ecuador', code: 'EC' },
   { name: 'Egypt', code: 'EG' },
   { name: 'El Salvador', code: 'SV' },
   { name: 'Equatorial Guinea', code: 'GQ' },
   { name: 'Eritrea', code: 'ER' },
   { name: 'Estonia', code: 'EE' },
   { name: 'Ethiopia', code: 'ET' },
   { name: 'Falkland Islands (Malvinas)', code: 'FK' },
   { name: 'Faroe Islands', code: 'FO' },
   { name: 'Fiji', code: 'FJ' },
   { name: 'Finland', code: 'FI' },
   { name: 'France', code: 'FR' },
   { name: 'French Guiana', code: 'GF' },
   { name: 'French Polynesia', code: 'PF' },
   { name: 'French Southern Territories', code: 'TF' },
   { name: 'Gabon', code: 'GA' },
   { name: 'Gambia', code: 'GM' },
   { name: 'Georgia', code: 'GE' },
   { name: 'Germany', code: 'DE' },
   { name: 'Ghana', code: 'GH' },
   { name: 'Gibraltar', code: 'GI' },
   { name: 'Greece', code: 'GR' },
   { name: 'Greenland', code: 'GL' },
   { name: 'Grenada', code: 'GD' },
   { name: 'Guadeloupe', code: 'GP' },
   { name: 'Guam', code: 'GU' },
   { name: 'Guatemala', code: 'GT' },
   { name: 'Guernsey', code: 'GG' },
   { name: 'Guinea', code: 'GN' },
   { name: 'Guinea-Bissau', code: 'GW' },
   { name: 'Guyana', code: 'GY' },
   { name: 'Haiti', code: 'HT' },
   { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
   { name: 'Holy See (Vatican City State)', code: 'VA' },
   { name: 'Honduras', code: 'HN' },
   { name: 'Hong Kong', code: 'HK' },
   { name: 'Hungary', code: 'HU' },
   { name: 'Iceland', code: 'IS' },
   { name: 'India', code: 'IN' },
   { name: 'Indonesia', code: 'ID' },
   { name: 'Iran, Islamic Republic Of', code: 'IR' },
   { name: 'Iraq', code: 'IQ' },
   { name: 'Ireland', code: 'IE' },
   { name: 'Isle of Man', code: 'IM' },
   { name: 'Israel', code: 'IL' },
   { name: 'Italy', code: 'IT' },
   { name: 'Jamaica', code: 'JM' },
   { name: 'Japan', code: 'JP' },
   { name: 'Jersey', code: 'JE' },
   { name: 'Jordan', code: 'JO' },
   { name: 'Kazakhstan', code: 'KZ' },
   { name: 'Kenya', code: 'KE' },
   { name: 'Kiribati', code: 'KI' },
   { name: 'Korea, Democratic People\'s Republic of', code: 'KP' },
   { name: 'Korea, Republic of', code: 'KR' },
   { name: 'Kuwait', code: 'KW' },
   { name: 'Kyrgyzstan', code: 'KG' },
   { name: 'Lao People\'s Democratic Republic', code: 'LA' },
   { name: 'Latvia', code: 'LV' },
   { name: 'Lebanon', code: 'LB' },
   { name: 'Lesotho', code: 'LS' },
   { name: 'Liberia', code: 'LR' },
   { name: 'Libyan Arab Jamahiriya', code: 'LY' },
   { name: 'Liechtenstein', code: 'LI' },
   { name: 'Lithuania', code: 'LT' },
   { name: 'Luxembourg', code: 'LU' },
   { name: 'Macao', code: 'MO' },
   { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
   { name: 'Madagascar', code: 'MG' },
   { name: 'Malawi', code: 'MW' },
   { name: 'Malaysia', code: 'MY' },
   { name: 'Maldives', code: 'MV' },
   { name: 'Mali', code: 'ML' },
   { name: 'Malta', code: 'MT' },
   { name: 'Marshall Islands', code: 'MH' },
   { name: 'Martinique', code: 'MQ' },
   { name: 'Mauritania', code: 'MR' },
   { name: 'Mauritius', code: 'MU' },
   { name: 'Mayotte', code: 'YT' },
   { name: 'Mexico', code: 'MX' },
   { name: 'Micronesia, Federated States of', code: 'FM' },
   { name: 'Moldova, Republic of', code: 'MD' },
   { name: 'Monaco', code: 'MC' },
   { name: 'Mongolia', code: 'MN' },
   { name: 'Montserrat', code: 'MS' },
   { name: 'Morocco', code: 'MA' },
   { name: 'Mozambique', code: 'MZ' },
   { name: 'Myanmar', code: 'MM' },
   { name: 'Namibia', code: 'NA' },
   { name: 'Nauru', code: 'NR' },
   { name: 'Nepal', code: 'NP' },
   { name: 'Netherlands', code: 'NL' },
   { name: 'Netherlands Antilles', code: 'AN' },
   { name: 'New Caledonia', code: 'NC' },
   { name: 'New Zealand', code: 'NZ' },
   { name: 'Nicaragua', code: 'NI' },
   { name: 'Niger', code: 'NE' },
   { name: 'Nigeria', code: 'NG' },
   { name: 'Niue', code: 'NU' },
   { name: 'Norfolk Island', code: 'NF' },
   { name: 'Northern Mariana Islands', code: 'MP' },
   { name: 'Norway', code: 'NO' },
   { name: 'Oman', code: 'OM' },
   { name: 'Pakistan', code: 'PK' },
   { name: 'Palau', code: 'PW' },
   { name: 'Palestinian Territory, Occupied', code: 'PS' },
   { name: 'Panama', code: 'PA' },
   { name: 'Papua New Guinea', code: 'PG' },
   { name: 'Paraguay', code: 'PY' },
   { name: 'Peru', code: 'PE' },
   { name: 'Philippines', code: 'PH' },
   { name: 'Pitcairn', code: 'PN' },
   { name: 'Poland', code: 'PL' },
   { name: 'Portugal', code: 'PT' },
   { name: 'Puerto Rico', code: 'PR' },
   { name: 'Qatar', code: 'QA' },
   { name: 'Reunion', code: 'RE' },
   { name: 'Romania', code: 'RO' },
   { name: 'Russian Federation', code: 'RU' },
   { name: 'Rwanda', code: 'RW' },
   { name: 'Saint Helena', code: 'SH' },
   { name: 'Saint Kitts and Nevis', code: 'KN' },
   { name: 'Saint Lucia', code: 'LC' },
   { name: 'Saint Pierre and Miquelon', code: 'PM' },
   { name: 'Saint Vincent and the Grenadines', code: 'VC' },
   { name: 'Samoa', code: 'WS' },
   { name: 'San Marino', code: 'SM' },
   { name: 'Sao Tome and Principe', code: 'ST' },
   { name: 'Saudi Arabia', code: 'SA' },
   { name: 'Senegal', code: 'SN' },
   { name: 'Serbia and Montenegro', code: 'CS' },
   { name: 'Seychelles', code: 'SC' },
   { name: 'Sierra Leone', code: 'SL' },
   { name: 'Singapore', code: 'SG' },
   { name: 'Slovakia', code: 'SK' },
   { name: 'Slovenia', code: 'SI' },
   { name: 'Solomon Islands', code: 'SB' },
   { name: 'Somalia', code: 'SO' },
   { name: 'South Africa', code: 'ZA' },
   { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
   { name: 'Spain', code: 'ES' },
   { name: 'Sri Lanka', code: 'LK' },
   { name: 'Sudan', code: 'SD' },
   { name: 'Suriname', code: 'SR' },
   { name: 'Svalbard and Jan Mayen', code: 'SJ' },
   { name: 'Swaziland', code: 'SZ' },
   { name: 'Sweden', code: 'SE' },
   { name: 'Switzerland', code: 'CH' },
   { name: 'Syrian Arab Republic', code: 'SY' },
   { name: 'Taiwan, Province of China', code: 'TW' },
   { name: 'Tajikistan', code: 'TJ' },
   { name: 'Tanzania, United Republic of', code: 'TZ' },
   { name: 'Thailand', code: 'TH' },
   { name: 'Timor-Leste', code: 'TL' },
   { name: 'Togo', code: 'TG' },
   { name: 'Tokelau', code: 'TK' },
   { name: 'Tonga', code: 'TO' },
   { name: 'Trinidad and Tobago', code: 'TT' },
   { name: 'Tunisia', code: 'TN' },
   { name: 'Turkey', code: 'TR' },
   { name: 'Turkmenistan', code: 'TM' },
   { name: 'Turks and Caicos Islands', code: 'TC' },
   { name: 'Tuvalu', code: 'TV' },
   { name: 'Uganda', code: 'UG' },
   { name: 'Ukraine', code: 'UA' },
   { name: 'United Arab Emirates', code: 'AE' },
   { name: 'United Kingdom', code: 'GB' },
   { name: 'United States', code: 'US' },
   { name: 'United States Minor Outlying Islands', code: 'UM' },
   { name: 'Uruguay', code: 'UY' },
   { name: 'Uzbekistan', code: 'UZ' },
   { name: 'Vanuatu', code: 'VU' },
   { name: 'Venezuela', code: 'VE' },
   { name: 'Vietnam', code: 'VN' },
   { name: 'Virgin Islands, British', code: 'VG' },
   { name: 'Virgin Islands, U.S.', code: 'VI' },
   { name: 'Wallis and Futuna', code: 'WF' },
   { name: 'Western Sahara', code: 'EH' },
   { name: 'Yemen', code: 'YE' },
   { name: 'Zambia', code: 'ZM' },
   { name: 'Zimbabwe', code: 'ZW' }
    ];
}])
angular.module("myApp")
.controller("indexController", ["$http", "$scope", "$state", "SessionService", "getDataSource", "$rootScope", function ($http, $scope, $state, SessionService, getDataSource, $rootScope) {
    $http.get("../config/menus.json").success(function (data) {
        //var groupByMenus = _.groupBy(data, function (val) {
        //    return val.group;
        //});
        //$scope.allMenus = data;
        //$scope.maps = _.uniq(_.map(data, "group"));
        //var menus = groupByMenus;
        //angular.forEach(groupByMenus, function (item) {
        //    item = _.sortBy(item, function (o) { return o.order; });
    	//});
    	$scope.backIndexUrl = "../html/index.html";//$rootScope.user.firstpage;
        //console.log($rootScope.user);
        var menus = _.sortBy(data, function (o) { return o.order; });
        angular.forEach(menus, function (item) {
            item.submenus = _.sortBy(item.submenus, function (o) { return o.order; });
            var displayNumber = 0;
            angular.forEach(item.submenus, function (submenu) {
                var hasPermission = false;
                angular.forEach($rootScope.user.permissionDic, function (permission) {
                    if (submenu.permission) {
                        if (permission.Name == submenu.permission) {
                            hasPermission = true;
                        }
                    }
                    else {
                        hasPermission = true;
                    }
                });
                if (hasPermission == false) {
                    submenu.display = false;
                }
                else {
                    displayNumber++;
                    submenu.display = true;
                }
            });
            if (displayNumber == 0) {
                item.display = false;
            }
            else {
                item.display = true;
            }
        });
        $scope.menus = menus;

    });

    //$scope.currentPlatformId = $rootScope.user.platformid;
    $scope.changePlatform = function (platform) {
    	if (platform.id == $rootScope.user.platformid) {
    		return;
    	}
    	getDataSource.getUrlData("../api/RefreshSession", { accountid: $rootScope.user.accountId, platformid: platform.id }, function (data) {
    		$rootScope.user = data.loginUser;
    	    //location.href = "../html/indexback.html";

    		var hrefArry = $rootScope.appConfig.loginHref;
    		var hrefobj = _.find(hrefArry, { usertype: parseInt($rootScope.user.userType) });
    		location.href = "../" + hrefobj.href.replace("[domain]", $rootScope.user.domain);
    	})
    };

    $scope.logOut = function () {
        SessionService.Logout();
    }
    //getDataSource.getDataSource("getNowUserPlatform", { accountid: $rootScope.user.accountId }, function (data) {
    //    $scope.platforms = data;
    //})
    $scope.goMenu = function (menu, group) {
        angular.forEach(group.submenus, function (m) {
            m.active = false;
        });
        menu.active = true;
        $state.go(menu.state, menu.parameter);
    }
    $scope.getActiveClass = function (group) {
        var returnVal = false;
        var nowstate = $state.$current.name;
        var obj = _.find($scope.allMenus, function (o) { return o.state == nowstate });
        if (obj && obj.group == group) {
            returnVal = true;
        }
        //return returnVal;
    }
}]);
angular.module("myApp")
.controller("liveEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {
    $scope.live = {};
    $(function () {
        $('.clockpicker').clockpicker({
            default: "now"
        });
    });
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }	
    if ($stateParams.id)
    {
    	$scope.nowid = $stateParams.id;
        getDataSource.getDataSource("selectLiveById", { id: $stateParams.id }, function (data) {
            $scope.live = data[0];
            $scope.live.starttime_min = $filter('date')($scope.live.starttime, 'HH:mm');
            $scope.live.endtime_min = $filter('date')($scope.live.endtime, 'HH:mm');
            $scope.nowfile = FilesService.showFile("livePhoto", $scope.live.pic_servername, $scope.live.pic_servername);
        });
    }
    $scope.saveButtonDisabled = false;
    $scope.save = function () {
    	$scope.saveButtonDisabled = true;
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "livePhoto", width: 200, height: 150 }, function (data) {
                $scope.live.pic_servername = data.data[0].servername;
                doSaveData();
            });
        }
        else {
            doSaveData();
        }
    }
    var doSaveData = function () {

        if ($stateParams.id) {
            var p = $http.post("../api/Live", $scope.live);
            p.then(function (data) {
            	$scope.saveButtonDisabled = false;
                //getDataSource.getDataSource("deleteLiveRelation", { id: $stateParams.id}, function () {
                //    getDataSource.getDataSource("insertLiveRelation", { id: getDataSource.getGUID(), liveid: $scope.live.id, category: $scope.live.area }, function (d) {
                //    });
                //});
                getDataSource.getDataSource("updateLive", $scope.live, function (data) {
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                });
            });
        }
        else {
            $scope.live.starttime = CommonService.addMiniuts($scope.live.starttime, $scope.live.starttime_min);
            $scope.live.endtime = CommonService.addMiniuts($scope.live.endtime, $scope.live.endtime_min);
            var p = $http.post("../api/Live", $scope.live);
            p.then(function (data) {
            	$scope.saveButtonDisabled = false;
                $scope.live.sourceurl = data.data.sourceUrl;
                $scope.live.playurl = "http://e.vhall.com/" + data.data.id;
                $scope.live.vhallid = data.data.id;
                $scope.live.id = getDataSource.getGUID();
                //getDataSource.getDataSource("insertLiveRelation", { id: getDataSource.getGUID(), liveid: $scope.live.id, category: $scope.live.area }, function (d) {
                //});
                getDataSource.getDataSource("insertLive", $scope.live, function (data) {
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });

                    $state.go("index.liveEdit", { id: $scope.live.id });
                });
            });
        }
    }

    $scope.goPlatformEdit = function () {
    	if ($stateParams.id) {
    		$state.go("index.liveEdit", { id: $stateParams.id });
    	}
    	else {
    		$state.go("index.liveEdit");
    	}
    }

    $scope.goTabList = function () {
    	var nowRouter = "index.liveEdit.liverange";
    	$state.go(nowRouter);
    }
}]);
angular.module("myApp")
.controller("liveListController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    //检索
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_LiveById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }

        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            columnDefs: [
              { name: '序号', field: "rownum", width: '6%',cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '直播名称', width: '64%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewLive(row)">{{row.entity.name}}</a></div>', headerCellClass: 'mycenter' },
              { name: '直播开始时间', width: '10%', field: "starttime", cellFilter: "date:'yyyy-MM-dd HH:mm'", cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '直播结束时间', width: '10%', field: "endtime", cellFilter: "date:'yyyy-MM-dd HH:mm'", cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '主讲人', width: '10%', field: "teachername", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("selectLive", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.viewLive = function (item)
    {
        $state.go("index.liveEdit", { id: item.entity.id });
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("platformLiveRelationController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.live = { ispublic: false, forPlatform: [], forSyClass: [] };

		$scope.ChangePublic = function () {
			if ($scope.live.ispublic) {

			}
		}

		$scope.initTable = function () {
			getDataSource.getDataSource("getPlatformLiveRelation", { liveid: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource(["selectPlatformList","selectSyClassList"], {}, function (data) {
				$scope.live.platformList = _.find(data, { name: "selectPlatformList" }).data;
				$scope.live.classList = _.find(data, { name: "selectSyClassList" }).data;
			});
			$scope.initTable();
		};

		$scope.load();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '直播范围', field: "name"},
				{ name: '限制类型', field: "category" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除课程
		$scope.delPlatformLiveRelation = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			getDataSource.doArray("deletePlatformLiveRelation", selectRows, function (data) {
				$scope.load();
				$scope.initTable();
				notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		// 2 全平台，0，班级，1，某平台
		$scope.addPlatformLiveRelation = function () {
			if ($scope.live.ispublic) {
				getDataSource.getDataSource("deletePlatformLiveRelationByLiveId", { liveid: $stateParams.id }, function (data) {
					getDataSource.getDataSource("insertPlatformLiveRelation", { liveid2: $stateParams.id, eventid2: "2", liveid: $stateParams.id, eventid: "2", category: 2 }, function (data) {
						$scope.initTable();
					});
				}, function (error) {
				});
			} else {
				angular.forEach($scope.live.forPlatform, function (item) {
					item.liveid = $stateParams.id;
					item.liveid2 = $stateParams.id;
					item.eventid = item.id;
					item.eventid2 = item.id;
					item.category = 1;
				});
				angular.forEach($scope.live.forSyClass, function (item) {
					item.liveid = $stateParams.id;
					item.liveid2 = $stateParams.id;
					item.eventid = item.id;
					item.eventid2 = item.id;
					item.category = 0;
				});
				getDataSource.getDataSource("deletePlatformPublicLiveRelationByLiveId", { liveid: $stateParams.id }, function (data) {
					if ($scope.live.forPlatform.length > 0) {
						getDataSource.doArray("insertPlatformLiveRelation", $scope.live.forPlatform, function (data) {
							angular.forEach($scope.live.forPlatform, function (item) {
								_.remove($scope.live.platformList, { id: item.id });
							});
							$scope.live.forPlatform = [];
							$scope.initTable();
						});
					}
					if ($scope.live.forSyClass.length > 0) {
						getDataSource.doArray("insertPlatformLiveRelation", $scope.live.forSyClass, function (data) {
							angular.forEach($scope.live.forSyClass, function (item) {
								_.remove($scope.live.classList, { id: item.id });
							});
							$scope.live.forSyClass = [];
							$scope.initTable();
						});
					}
				}, function (error) {
				});
			}
		}
}]);
app.controller("logconfigController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
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
			  { name: '编码', field: "code" },
			  { name: '名称', field: "name" },
			  { name: '状态', field: "status" }
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
		//$scope.goDetial = function (row) {
		//	$state.go("index.accountedit", { id: row.entity.id });
		//}
		$scope.search = {};
		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["selectLogConfig"];
			getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid, tablerule: new Date() }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort, { connectionKey: "LogConnectionString" }
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
angular.module("myApp")
.controller("logconfigEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
    	$scope.goToList = function () {
    		$state.go("index.score");
    	}
    }]);
angular.module("myApp")
.controller("logconfigtreeController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, notify, getDataSource, DateService, CommonService) {
		var apple_selected, tree, treedata_avm, treedata_geography;
		var id = 0;
		$scope.parentDisabled = false;
		$scope.nameDisabled = false;
		$scope.childnameDisabled = false;
		$scope.saveCurrentButtonDisabled = false;
		$scope.saveButtonDisabled = false;
		$scope.deleteDisabled = false;
		//选中事件
		$scope.my_tree_handler = function (branch) {
			//var _ref;
			//console.log(branch);
			$scope.output = ""; //"You selected: " + branch.label + ",rowid:" + branch.rowid+",fid="+branch.fid;
			//if ((_ref = branch.data) != null ? _ref.description : void 0) {
			//	return $scope.output += '(' + branch.data.description + ')';
			//}
			if (branch.rowid == "0") {
				$scope.parentDisabled = true;
				$scope.nameDisabled = true;
				$scope.saveCurrentButtonDisabled = true;
				$scope.deleteDisabled = true;
			} else {
				$scope.parentDisabled = false;
				$scope.nameDisabled = false;
				$scope.saveCurrentButtonDisabled = false;
				$scope.deleteDisabled = false;
			}
			$scope.loadPushMessageCategoryParent(branch);
		};

		$scope.loadPushMessageCategoryParent = function (branch) {
			id = branch.rowid;
			var array = ["select_logconfigParent"];
			getDataSource.getConnKeyList(array, {}
						, null
						, null, null, { connectionKey: "LogConnectionString" }
						, function (datatemp) {
				$scope.parentCategory = datatemp;
				$scope.parentCategory.push({ id: "", fid: "0", name: "" });
				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
						getDataSource.getConnKeyList(["getLogConfigById"], { id: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {

						$scope.categoryForm = datatemp[0];
					}, function (errortemp) { });
				}
			}, function (errortemp) { });
		}

		$scope.deletePushMessageCategory = function () {
			$scope.deleteDisabled = true;
				getDataSource.getConnKeyList(["getLogConfigChildrenByFId"], { fid: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {

				var childrencount = datatemp.length;
				//id不为空，则认为为修改
				if (childrencount <= 0) {
					getDataSource.getConnKeyList(["deleteLogConfig"], { id: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {
						if (datatemp.length > 0) {
							notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$scope.my_data = [];
							$scope.deleteDisabled = true;
							$scope.loadCategoryTree();
						} else {
							$scope.deleteDisabled = false;
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) { });
				} else {
					notify({ message: '删除失败，请先删除分类下子分类。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.deleteDisabled = false;
				}
			}, function (errortemp) { });
		}

		function saveCurrent(postData) {
			getDataSource.getConnKeyList(["updateLogConfig"],
			postData
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {

				$scope.saveCurrentButtonDisabled = false;
				if (datatemp.length > 0) {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.my_data = [];
					$scope.loadCategoryTree();
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveCurrentButtonDisabled = false;
			});
		}

		function saveCategory(postObj) {
			var array = ["insertLogConfig"];
			getDataSource.getConnKeyList(array, postObj
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {

				$scope.saveButtonDisabled = false;
				if (datatemp.length > 0) {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.my_data = [];
					id = 0;
					$scope.loadCategoryTree();
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
		$scope.checkCode = function () {
			var postData = { id: id, code: $scope.categoryForm.code };
			getDataSource.getConnKeyList(["selectLogConfigCode"],
			postData
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {
				if (datatemp.length > 0) {
					notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.saveCurrentButtonDisabled = true;
				} else {
					$scope.saveCurrentButtonDisabled = false;
					//saveCurrent(postData);
				}
			}, function (errortemp) {

			});
		}

		$scope.saveCurrentPushMessageCategory = function () {
			$scope.saveCurrentButtonDisabled = true;
			var newid = getDataSource.getGUID();
			if (id != undefined && id != "0" && id != undefined && id != null) {
				var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
				var fids = "";
				if (temp != null) {
					fids = temp.id + "." + id;
				} else {
					fids = id;
				}


				var postData={ id: id, fid: $scope.categoryForm.fid, code: $scope.categoryForm.code, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids };
				saveCurrent(postData);
				//getDataSource.getConnKeyList(["selectLogConfigCode"],
				//postData
				//, null
				//, null, null, { connectionKey: "LogConnectionString" }
				//, function (datatemp) {
				//	if (datatemp.length > 0) {
				//		notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				//	} else {
						
				//	}
				//}, function (errortemp) {

				//});
			}
		}

		$scope.savePushMessageCategory = function () {
			$scope.saveButtonDisabled = true;
			var newid = getDataSource.getGUID();

			var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
			var fids = "";
			if (temp != null) {
				fids = temp.id + "." + newid;
			} else {
				fids = newid;
			}

			var fid = id;
			if (fid == undefined || fid == "0") {
				fid = "0";
			}

			var postObj = { id: newid, fid: fid, name: $scope.categoryForm.childname, code: $scope.categoryForm.code, sortnum: $scope.categoryForm.sortnum, fids: fids }
			saveCategory(postObj);
			//getDataSource.getConnKeyList(["selectLogConfigCode"],
			//postObj
			//, null
			//, null, null, { connectionKey: "LogConnectionString" }
			//, function (datatemp) {
			//	if (datatemp.length > 0) {
			//		notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			//	} else {
					
			//	}
			//}, function (errortemp) {

			//});
		}

		$scope.my_data = new Array();
		$scope.my_tree = tree = {};
		$scope.loadCategoryTree = function () {
			var array = ["select_logconfigParent"];
			getDataSource.getConnKeyList(array, { }
				, null
				, null, null, { connectionKey: "LogConnectionString" }
				, function (datatemp) {
				var len = datatemp.length;
				var root = new Object();
				root.label = "日志分类";
				root.rowid = "0";
				root.children = new Array()
				for (var i = 0; i < len; i++) {
					if (datatemp[i].fid == '0') {
						drawChild(root, datatemp, datatemp[i])
					}
				}

				$scope.my_data.push(root);
				$scope.doing_async = false;
				//console.log("tree", tree);
				//tree.expand_branch(tree.get_first_branch());
				//tree.expand_all();
			}, function (errortemp) {

			});
		}
		function drawChild(root, datatemp, fobj) {
			var tempobj = { label: fobj.name, rowid: fobj.id, children: [] };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			if (length > 0) {
				for (var i = 0; i < length; i++) {
					drawChild(tempobj, datatemp, childlist[i]);
				}
			}
			root.children.push(tempobj);
		}
		$scope.try_async_load = function () {
			$scope.my_data = new Array();
			$scope.doing_async = true;
			$scope.loadCategoryTree();
		};
		$scope.try_async_load();
	}]);
app.controller("loginController", ['$scope', '$http', '$state', '$stateParams', 'getDataSource', function ($scope, $http,$state, $stateParams, getDataSource) {
	$scope.loginObj = new Object();
	$scope.AccessLogin = function () {
		if ($scope.loginObj.logname.length == 0) { 
			alert("请输入用户名"); 
			return false;
		}
		if ($scope.loginObj.hashpwd.length == 0) {
			alert("请输入密码");  
			return false;
		}

		if ($scope.loginObj.remember) { 
             
		}  

		 

		getDataSource.getUrlData('../api/login', $scope.loginObj, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}

	$scope.GetUser = function () {
		getDataSource.getUrlData('../api/getuser', {userid:111}, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}
	$scope.Logout = function () {
		getDataSource.getUrlData('../api/logout', { userid: 111 }, function (datatemp) {
			//console.log(datatemp);
		}, function (errortemp) {

		});
	}
}])
app.controller("mainController", ['$scope','$rootScope', '$http', 'getDataSource', function ($scope,$rootScope, $http, getDataSource) {
	//console.log("$rootScope.user",$rootScope.user);
}])
angular.module("myApp")
.controller("senselearningEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.senselearningObj = new Object();
		var id = $stateParams.id;
		$scope.loadData = function () {
			getDataSource.getDataSource(["getClasscourseLearningsense"], { id: id }, function (data) {
				$scope.senselearningObj = data[0];
			}, function (errortemp) {
			});
		}
		$scope.loadData();
}]);
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
app.controller("studynoteController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		//
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
			  { name: '操作', field: "id", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter',cellTemplate: '<div class="ui-grid-cell-contents"><button  ng-if="row.entity.auditstatus==0" ng-click="grid.appScope.doRecommendFlatform(row,1)">审核</button></div>' }
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
			  { name: '操作', field: "id", width: '20%', cellClass: "myleft", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><button ng-if="row.entity.auditstatus==1" ng-click="grid.appScope.doRecommendFlatform(row,0)">取消审核</button>&nbsp;&nbsp;<button ng-click="grid.appScope.doRecommendGeneralFlatform(row)" ng-if="row.entity.category==0 && row.entity.count==0">推荐到总平台</button></div>' }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
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
			$state.go("index.studynoteedit", { id: row.entity.id });
		}
		$scope.doRecommendFlatform = function (row, action) {
			var platform = new Object();
			platform.category = "studyingsense";
			platform.op = action;
			platform.tableid = row.entity.id;
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
		    param.canceltype = "0";

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

		    getDataSource.getDataSource(["getWaiteRecommendStudyNote", "getRecommendStudyNote", "getAuditSubplatformStudyNote"], param, function (data) {
				if (data.length > 0) {
					$scope.gridOptions.data = _.find(data, { name: "getWaiteRecommendStudyNote" }).data;
					$scope.gridOptionsRecommend.data = _.find(data, { name: "getRecommendStudyNote" }).data;
					$scope.gridOptionsSubplatform.data = _.find(data, { name: "getAuditSubplatformStudyNote" }).data;
				}
			}, function (errortemp) {

			});
		}
		$scope.loadData();
	}])
angular.module("myApp")
.controller("studynoteEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.studynoteObj = new Object();
		var id = $stateParams.id;
		$scope.loadData = function () {
			getDataSource.getDataSource(["getStudyingsense"], { id: id }, function (data) {
				$scope.studynoteObj = data[0];
			}, function (errortemp) {
			});
		}
		$scope.loadData();
	}]);

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
angular.module("myApp")
.controller("microVideoController", ['$scope', '$rootScope', 'getDataSource', "$state", "notify", function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: "序号", width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '微视频名称', width: '30%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>', headerCellClass: 'mycenter' },
          { name: "主讲人", width: '8%', field: "teacher", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '分类', width: '8%', field: "category", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '8%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "创建时间", width: '8%', field: "createtime", cellFilter: "date:'yyyy-MM-dd'", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "是否可用", width: '8%', field: "status", cellFilter: "statusGender", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "是否推荐", width: '8%', field: "ismain", cellFilter: "istopGender", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "点击次数", width: '8%', field: "clickrate", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
            		notify({ message: '该视频为共享资源，不能被操作。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	}
            });
        }
    };
    $scope.goDetial = function (row) {
        $state.go("index.microVideoEdit", { id: row.entity.id });
    }
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_microVideoById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        var key = "selectAllMicroVideo";
        if ($rootScope.user.platformcategory == 0) {
        	key = "selectPlatformAllMicroVideo";
        }
        getDataSource.getList(key, {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("microVideoEditController", ['$window', '$scope', '$rootScope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "FilesService", "CommonService",
function ($window, $scope, $rootScope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, FilesService, CommonService) {
    $scope.saveButtonDisabled = false;
    $scope.microVideo = {};
    $scope.uploadvideoFiles = function (file, valfile) {
        $scope.microVideo.videofile = file;
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }

	//如果是共享的课程，那么分平台是不能删除和修改的。
    $scope.saveIsShareButtonDisabled = false;

    if ($stateParams.id)
    {
        getDataSource.getDataSource("select_sy_microVideoById", { id: $stateParams.id }, function (data) {
            $scope.microVideo = data[0];
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.microVideo.photo_servername, $scope.microVideo.photo_servername);

            if ($scope.microVideo.isshare == 1) {
            	$scope.saveIsShareButtonDisabled = true;
            	CommonService.initInputControlDisabled();
            }
        });
    }
    //上传文件
    $scope.uploadvideo = function () {
        if ($scope.microVideo.videofile.length>0) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec($scope.microVideo.videofile.name)[1];
            var ts = new Date().getTime();
            var newhash = md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
            var options = {
                endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
                resetBefore: $('#reset_before').prop('checked'),
                resetAfter: false,
                title: "title",
                desc: "desc",
                ext: ext,
                ts: ts,
                hash: newhash,
                userid: $rootScope.appConfig.vhallConfig.userid,
                writeToken: $rootScope.appConfig.vhallConfig.writeToken
            };


            $('.progress').addClass('active');

            upload = polyv.upload($scope.microVideo.videofile[0], options)
          .fail(function (error) {
              alert('Failed because: ' + error);
          })
          .always(function () {
              //$input.val('');
              //$('.js-stop').addClass('disabled');
              //$('.progress').removeClass('active');
          })
          .progress(function (e, bytesUploaded, bytesTotal) {
              var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
              //$('.progress .bar').css('width', percentage + '%');
              $scope.process = percentage;
              $scope.$apply();
              //console.log(bytesUploaded, bytesTotal, percentage + '%');
          })
          .done(function (url, file) {
              $scope.microVideo.videoname = file.name;
              $scope.microVideo.videopath= url.substring(url.lastIndexOf("/") + 1);
          });
        }
    }
    //关闭弹出窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    //视频预览
    $scope.openVideoPerview = function () {
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': $scope.microVideo.videopath
            });

        }, 0);
    }
    $scope.goback = function () {
        $state.go("index.microVideo");
    }
    $scope.save = function () {
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 310, height: 190 }, function (data) {
                $scope.microVideo.photo_servername = data.data[0].servername;
                doSaveData();
            });
        }
        else {
            doSaveData();
        }


    }
    var doSaveData = function () {
        
        $scope.saveButtonDisabled = true;
        if ($stateParams.id) {
        	getDataSource.getDataSource("update_sy_microVideo", $scope.microVideo, function (data) {
        		$scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        	}, function (error) {
        		$scope.saveButtonDisabled = false;
        	});
        }
        else {
            $scope.microVideo.createtime = new Date();
            $scope.microVideo.id = getDataSource.getGUID();
            $scope.microVideo.createuser = $rootScope.user.name;
            $scope.microVideo.platformid = $rootScope.user.platformid;
            $scope.microVideo.microvideoid = $scope.microVideo.id;
            $scope.microVideo.isshare = 0;

            getDataSource.getDataSource(["insert_sy_microVideo"], $scope.microVideo, function (data) {
                $scope.saveButtonDisabled = false;
                $state.go("index.microVideoEdit", { id: $scope.microVideo.id });
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (error) {
            	$scope.saveButtonDisabled = false;
            });
        }
    }
}]);
angular.module("myApp")
.controller("newsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', '$timeout', '$modal', function ($scope, $rootScope, getDataSource, $state, notify, $timeout, $modal) {
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
          { name: '发布范围', field: "ispublic", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status == "已发布" ? (row.entity.ispublic == 1 ?"全部机构":"部分机构"):""}}</div>', headerCellClass: 'mycenter' },
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
            
            if (selectRows[0].status == "已发布") {
                notify({ message: '不能重复发布', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                return;
            }
            else {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'publish.html',
                    controller: 'publishCtrl',
                    size: 'lg',
                    resolve: {
                        alldepartment: function () {
                            return $scope.alldepartment;
                        },
                        gridApi: function () {
                            return $scope.gridApi;
                        },
                        loadSource: function () {
                            return $scope.loadSource;
                        },
                        alert: function () {
                            return $scope.alert;
                        }
                    }
                });

            }
        }
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
angular.module("myApp")
.controller("newsEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.news = { file_servername: "", videofile: {}, videotype: 0, category: 1, istop: 1 };

    $scope.ueditorConfig = {
    	//这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
    	toolbars: [
            [
                //'undo', //撤销
                //'redo', //重做
                //'bold', //加粗
                //'indent', //首行缩进
                //'snapscreen', //截图
                //'italic', //斜体
                //'underline', //下划线
                //'strikethrough', //删除线
                //'subscript', //下标
                //'fontborder', //字符边框
                //'superscript', //上标
                //'formatmatch', //格式刷
                //'source', //源代码
                //'blockquote', //引用
                //'pasteplain', //纯文本粘贴模式
                //'selectall', //全选
                //'horizontal', //分隔线
                //'removeformat', //清除格式
                //'time', //时间
                //'date', //日期
                //'fontfamily', //字体
                //'fontsize', //字号
                //'paragraph', //段落格式
                ////'simpleupload', //单图上传
                //'insertimage', //多图上传
                ////'edittable', //表格属性

                //'inserttable', 'edittable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols',

                //'edittd', //单元格属性
                //'link', //超链接
                //'justifyleft', //居左对齐
                //'justifyright', //居右对齐
                //'justifycenter', //居中对齐
                //'justifyjustify', //两端对齐
                //'forecolor', //字体颜色
                //'insertorderedlist', //有序列表
                //'insertunorderedlist', //无序列表
                //'directionalityltr', //从左向右输入
                //'directionalityrtl', //从右向左输入
                //'rowspacingtop', //段前距
                //'rowspacingbottom', //段后距
                //'imagenone', //默认
                //'imageleft', //左浮动
                //'imageright', //右浮动
                //'attachment', //附件
                //'imagecenter', //居中
                //'wordimage', //图片转存
                //'lineheight', //行间距
                //'edittip ', //编辑提示
                //'touppercase', //字母大写
                //'tolowercase', //字母小写

                'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'edittable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
            ]
    	],
    	//focus时自动清空初始化时的内容
    	autoClearinitialContent: true,
    	//关闭字数统计
    	wordCount: false,
    	//关闭elementPath
    	elementPathEnabled: false,
    	enableAutoSave: false,
    	autoSyncData: false
    }

    $scope.uploadFiles = function (files) {
        $scope.files = files;
        //$scope.save();
    }
    var load = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource("selectNewsById", { id: $stateParams.id }, function (data) {
                $scope.news = data[0];
                $scope.nowfile = FilesService.showFile("newsPhoto", $scope.news.file_servername, $scope.news.file_servername);
            });
        }
    };

    $scope.ready = function (editor) {
    	//$scope.loadSyCodeData();
    	load();
    }

    $scope.saveDisabled = false;
    $scope.save = function (optype) {
    	$scope.saveDisabled = true;
    	if ($scope.files) {

            //FilesService.upLoadFiles($scope.files[0], "newsPhoto", function (data) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "newsPhoto", width: 585, height: 361 }, function (data) {
                $scope.news.file_servername = data.data[0].servername;
                $scope.news.file_serverthumbname = data.data[0].servername.replace('.', '_small.');
                doSaveData(optype);
            }, function (error) { $scope.saveDisabled = false; });

        }
        else {
            //notify({ message: '请上传封面图片', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            doSaveData(optype);
        }
    }


    $scope.getFile = function () {
        if ($scope.news.file_servername != "") {
        }
    }
    var doSaveData = function (optype) {

        if ($stateParams.id) {
            //发布
            var msg = '保存成功';
            if (optype == "1") {
                $scope.news.status = 1;
                $scope.news.publishtime = new Date();
                msg = '发布成功';
            }
            //else {
            //    $scope.news.publishtime = null;
            //}
            getDataSource.getDataSource("updateNewsById", $scope.news, function (data) {
            	notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
            }, function (error) { $scope.saveDisabled = false; });
        }
        else {

            if ($scope.news.category == 1) {
                if ($scope.news.file_servername == "") {
                    notify({ message: '请上传封面图片', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.saveDisabled = false;
                    return;
                }
            }

            var newid = getDataSource.getGUID();
            $scope.news.id = newid;
            $scope.news.createuser = $rootScope.user.accountId;
            $scope.news.createtime = new Date();
            $scope.news.status = 0; //未发布
            $scope.news.clicknum = 0;
            $scope.news.platformid = $rootScope.user.platformid;

            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            $scope.news.departmentid = mid;

            // $scope.currentDate = DateService.format(date, "yyyy年MM月dd日") + "   " + DateService.getWeek(date);
            //id,title,content,creatuser,creattime,publishtime,status,filepath,abstract,source
            getDataSource.getDataSource("insertNews", $scope.news, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveDisabled = false;
                $state.go("index.newsEdit", { id: newid });
            }, function (error) { $scope.saveDisabled = false; });
        }
    }
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.news.videofile = file;
        $scope.process_videofile = 0;
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.openVideoPerview = function (type, vid) {
        perviewVideo(vid);
    }
    var perviewVideo = function (vid) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }

    var perviewDoubleVideo = function (news) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': news.teachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': news.pptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.news.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.news.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.news.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        $scope.nowfile = $scope.news.videofile[0];
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var ts = new Date().getTime();
        var newhash = md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
        var options = {
            endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ext: ext,
            ts: ts,
            hash: newhash,
            userid: $rootScope.appConfig.vhallConfig.userid,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
          if (type == "videofile") {
              $scope.news.videopath = url.substring(url.lastIndexOf("/") + 1);
              $scope.news.videoname = file.name;
          }
          else {
              $scope.news.videopath = url.substring(url.lastIndexOf("/") + 1);
              $scope.news.videoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}]).controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
app.controller("noticeController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state'
	, function ($scope,$rootScope, $http, getDataSource, $state) {
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
				{ name: '标题', field: "title", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>' },
				{ name: '内容', field: "content", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
                { name: '类型', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 0 ? "系统升级" :"系统提醒"}}</div>' },
				{ name: '发布状态', field: "publishstate", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.publishstate == 0 ? "未发布" :"已发布"}}</div>' },
                { name: '发布时间', field: "publishdate", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.publishdate | date:"yyyy-MM-dd hh:mm:ss"}}</div>' },
                { name: '发布人', field: "publishuser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
                { name: '类型', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 0 ? "系统升级" :"系统提醒"}}</div>' },
                { name: '创建时间', field: "createdate", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.createdate | date:"yyyy-MM-dd hh:mm:ss"}}</div>' },
                { name: '创建人', field: "createuser", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
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
			$state.go("index.noticeEdit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getAllNotice"];
			getDataSource.getList(array, {  }
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
app.controller("noticeEditController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state', '$stateParams', '$validation', 'notify'
	, function ($scope, $rootScope, $http, getDataSource, $state, $stateParams, $validation, notify) {
        
	    $scope.currentConfig = {
	        btnSaveShow: false,
	        btnPublishShow: false,
	        btnUnPublishShow: false,
	    };

		$scope.noticeData = {
		    id:"",
		    title: "",
		    content: "",
		    category: 0,
		    createuser: $rootScope.user.name,
		    createdate: "",
		    publishuser: "",
		    publishdate: "",
		    publishstate : 0,
		    isclose: 0,

		};

		var noticeId = $stateParams.id;
		if (noticeId != undefined && noticeId != "") {
		    $scope.noticeData.id = noticeId;
		    //编辑，获取表单信息
		    getDataSource.getDataSource("getNoticeById", { id: noticeId }, function (data) {
		        $scope.noticeData = data[0];
		        if ($scope.noticeData.publishstate == 0) {
		            $scope.currentConfig.btnSaveShow = true;
		            $scope.currentConfig.btnPublishShow = true;
		            $scope.currentConfig.btnUnPublishShow = false;
		        }
		        else {
		            $scope.currentConfig.btnSaveShow = false;
		            $scope.currentConfig.btnPublishShow = false;
		            $scope.currentConfig.btnUnPublishShow = true;
		        }
		    }, function (errortemp) { });
		}
		else {
		    $scope.currentConfig.btnSaveShow = true;
		    $scope.currentConfig.btnPublishShow = false;
		    $scope.currentConfig.btnUnPublishShow = false;
		}



		$scope.goToList = function () {
		    $state.go("index.notice");
		}

		$scope.saveDisabled = false;
		$scope.savePermssion = function () {
			$scope.saveDisabled = true;
			getDataSource.getUrlData('../api/saveNotice', $scope.noticeData, function (datatemp) {
				$scope.saveDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.noticeEdit", { id: datatemp.id });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveDisabled = false;
				notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.publishNotice = function () {
		    getDataSource.getDataSource("publishNotice",
                {
                    publishuser: $rootScope.user.name,
                    publishstate: 1,
                    id: $scope.noticeData.id,
                    title: $scope.noticeData.title,
                    content: $scope.noticeData.content,
                    category: $scope.noticeData.category,
                    isclose: $scope.noticeData.isclose
                }, function (data) {
		        notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        $scope.currentConfig.btnSaveShow = false;
		        $scope.currentConfig.btnPublishShow = false;
		        $scope.currentConfig.btnUnPublishShow = true;
		    }, function (error) {
		        notify({ message: '发布失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    })
		}

		$scope.unpublishNotice = function () {
		    getDataSource.getDataSource("publishUnNotice", { id: $scope.noticeData.id }, function (data) {false
		        notify({ message: '撤销发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		        $scope.currentConfig.btnSaveShow = true;
		        $scope.currentConfig.btnPublishShow = true;
		        $scope.currentConfig.btnUnPublishShow = false;
		    }, function (error) {
		        notify({ message: '撤销发布失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		    })
		}
	}
]);
app.controller("permissionController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state'
	, function ($scope,$rootScope, $http, getDataSource, $state) {
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
				{ name: '权限名称', field: "name", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
				{ name: '分组名称', field: "groupname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: '级别', field: "syslevel", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'sysLevelFilter' },
				{ name: '说明', field: "comment", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
			$state.go("index.permissionEdit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getAllPermission"];
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
app.controller("permissionEditController", ['$scope', '$rootScope', '$http', 'getDataSource', '$state', '$stateParams', '$validation', 'notify'
	, function ($scope, $rootScope, $http, getDataSource, $state, $stateParams, $validation, notify) {
		//console.log(1);
		$scope.roleForm = new Object();
		$scope.roleForm.name = '';
		$scope.roleForm.groupname = '';
		$scope.roleForm.comment = '';
		$scope.roleForm.syslevel = false;
		$scope.roleForm.id = '';
		$scope.roleForm.category = '';
		var permissionId = $stateParams.id;
		if (permissionId!=undefined&& permissionId != "") {
			$scope.roleForm.id = permissionId;
			//编辑，获取表单信息
			getDataSource.getDataSource("getSinglePermission", { permissionid: permissionId }, function (data) {
				$scope.roleForm = data[0];
				$scope.roleForm.syslevel = (data[0].syslevel == 1) ? true : false;
			}, function (errortemp) { });
		}
		$scope.goToList = function () {
			$state.go("index.permission");
		}
		$scope.savePermssion = function () {
			getDataSource.getUrlData('../api/Permission/SavePermission', $scope.roleForm, function (datatemp) {
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.permissionEdit", { id: datatemp.id });
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}
	}
]);
angular.module("myApp")
.controller("planEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "$http", "FilesService", "$filter", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, $http, FilesService, $filter) {

    var start = new Date().getFullYear();
    var end = start + 5;
    $scope.yearArr = [];
    for (var i = start; i <= end; i++) {
        $scope.yearArr.push(i);
    }


    $scope.plan = {
        id: "",
        year: start,
        orgcode: "",
        orgname: "",
        rankarr: [],
        stutytime: ""
    };

    //获取职级数据
    $scope.getLevelArr = function () {

        getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
            $scope.levelArr = _.find(data, { type: "职级" }).list;
        }, function (errortemp) { });

    }();

    $scope.checkRank = function (r) {
        var idx = $scope.plan.rankarr.indexOf(r.id);
        if (idx >= 0) {
            //alert("1");
            $scope.plan.rankarr.splice(idx, 1);
        } else {
            //alert("2");
            $scope.plan.rankarr.push(r.id);
        }
    }

    $scope.save = function () {

        $scope.exists(function () {

            getDataSource.getUrlData("../api/addplan", $scope.plan, function (data) {
                if (data.result) {
                    notify({ message: '添加成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                   // $timeout(function () {
                        $scope.golist();
                    //}, 1000);
                } else {
                    notify({ message: '添加失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }, function (errortemp) { });

        });
    }

    $scope.exists = function (callback) {

        getDataSource.getUrlData("../api/existsplan", $scope.plan, function (data) {
            if (data.result) { 
                if (callback) {
                    callback();
                }
            } else {
                var item = _.find($scope.levelArr, { id: data.rank });
                if (item) {
                    var msg = "[" + $scope.plan.orgname + "]" + $scope.plan.year + "[" + item.showvalue + "]" + "年度计划已制定";
                    notify({ message: msg, classes: 'warning', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        }, function (errortemp) { });
    }




    $scope.golist = function () {
        var nowRouter = "index.planlist";
        $state.go(nowRouter);
    }

    $scope.selectnode = function (node) {
        $scope.plan.orgcode = node.id;
        $scope.plan.orgname = node.name; 
    }

    
}]);
angular.module("myApp")
.controller("planListController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService) {

	var start = new Date().getFullYear();
    var end = new Date().getFullYear() + 5;
    $scope.yearArr = [];
    for (var i = 2016; i <= end; i++) {
        $scope.yearArr.push(i);
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {
        year:start,
        orgcode: "",
        orgname: ""
    }
    //检索
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.goClear = function () {
        $scope.search.orgcode = "";
        $scope.search.orgname = "";
        $scope.search.year = new Date().getFullYear();
        $scope.loadGrid();
    }
    //$scope.goEdit = function () {
    //    var selectRows = $scope.gridApi.selection.getSelectedRows();
        
    //    $state.go("index.planedit", { id: item.entity.id });
    //}

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        var parameter = [];
        for (var i = 0; i < selectRows.length; i++) {
            parameter.push({
                year: selectRows[i].year,
                departmentid: selectRows[i].depid,
                studytime: selectRows[i].studytime
            });
        }
        getDataSource.getUrlData("../api/deleteplan", parameter, function (data) {
            if (data.result) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } $scope.loadGrid();
        }, function (errortemp) { });

    }

    $scope.gridOptions = {
        //paginationPageSizes: [25, 50, 75],
        //paginationPageSize: 25,
        columnDefs: [
          { name: '年份', width: '10%', field: "year", headerCellClass: 'mycenter' },
          { name: '组织机构', width: '30%', field: "depname", headerCellClass: 'mycenter' },
          { name: '职务级别', width: '46%', field: "rank", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '总学时', width: '10%', field: "studytime", cellClass: "mycenter", headerCellClass: 'mycenter' },
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
    $scope.loadGrid = function () {
        //var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        //var pageSize = paginationOptions.pageSize;

        getDataSource.getUrlData("../api/getplans", $scope.search, function (data) {
            if (data.result) {
                $scope.gridOptions.totalItems = data.list.length;
                $scope.gridOptions.data = data.list;
            }
        }, function (errortemp) { });
    } 
    $scope.loadGrid();
     
}]);
angular.module("myApp")
.controller("pushmessageController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope,$state, $http,$timeout, $document,notify, getDataSource, DateService, CommonService) {
	var apple_selected, tree, treedata_avm, treedata_geography;
	var id = 0;
	$scope.parentDisabled = false;
	$scope.nameDisabled = false;
	$scope.childnameDisabled = false;
	$scope.saveCurrentButtonDisabled = false;
	$scope.saveButtonDisabled = false;
	$scope.deleteDisabled = false;
	//选中事件
	$scope.my_tree_handler = function (branch) {
		//var _ref;
		//console.log(branch);
		$scope.output = ""; //"You selected: " + branch.label + ",rowid:" + branch.rowid+",fid="+branch.fid;
		//if ((_ref = branch.data) != null ? _ref.description : void 0) {
		//	return $scope.output += '(' + branch.data.description + ')';
		//}
		if (branch.rowid == "0") {
			$scope.parentDisabled = true;
			$scope.nameDisabled = true;
			$scope.saveCurrentButtonDisabled = true;
			$scope.deleteDisabled = true;
		} else {
			$scope.parentDisabled = false;
			$scope.nameDisabled = false;
			$scope.saveCurrentButtonDisabled = false;
			$scope.deleteDisabled = false;
		}
		$scope.loadPushMessageCategoryParent(branch);
	};

	$scope.loadPushMessageCategoryParent = function (branch) {
		id = branch.rowid;
		getDataSource.getDataSource("select_pushMessageParent", {}, function (datatemp) {
			$scope.parentCategory = datatemp;
			$scope.parentCategory.push({ id: "", fid: "0", name: "====根目录====" });
			//id不为空，则认为为修改
			if (id != "" && id != undefined && id != null) {
				getDataSource.getDataSource("getPushMessageCategoryById", { id: id }, function (datatemp) {
					$scope.categoryForm = datatemp[0];
					//console.log($scope.categoryForm);
				}, function (errortemp) { });
			}
		}, function (errortemp) { });
	}

	$scope.deletePushMessageCategory = function () {
		$scope.deleteDisabled = true;
		getDataSource.getDataSource("select_pushMessageChildren", { fid: id }, function (datatemp) {
			var childrencount = datatemp.length;
			//id不为空，则认为为修改
			if (childrencount <= 0) {
				getDataSource.getDataSource("deletePushMessageCategoryById", { id: id }, function (datatemp) {
					if (datatemp.length > 0) {
						notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.deleteDisabled = true;
						$scope.loadCategoryTree();
					} else {
						$scope.deleteDisabled = false;
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) { });
			} else {
				notify({ message: '删除失败，请先删除分类下子分类。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.deleteDisabled = false;
			}
		}, function (errortemp) { });
	}

	$scope.saveCurrentPushMessageCategory = function () {
		$scope.saveCurrentButtonDisabled = true;
		var newid = getDataSource.getGUID();
		if (id != undefined && id != "0" && id != undefined && id != null) {
			var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
			var fids = "";
			if (temp != null) {
				fids = temp.id + "." + id;
			} else {
				fids = id;
			}
			getDataSource.getDataSource("updatePushMessageCategoryById",
				{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids },
				function (datatemp) {
					$scope.saveCurrentButtonDisabled = false;
					if (datatemp.length > 0) {
						notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.loadCategoryTree();
					} else {
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) {
					$scope.saveCurrentButtonDisabled = false;
				});
		}
	}

	$scope.savePushMessageCategory = function () {
		$scope.saveButtonDisabled = true;
		var newid = getDataSource.getGUID();

		var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
		var fids = "";
		if (temp != null) {
			fids = temp.id + "." + newid;
		} else {
			fids = newid;
		}

		var fid = id;
		if (fid == undefined || fid == "0") {
			fid = "0";
		}

		var postObj = { id: newid, fid: fid, name: $scope.categoryForm.childname,sortnum:$scope.categoryForm.sortnum, platformid: $rootScope.user.platformid, fids: fids }
		getDataSource.getDataSource("insert_pushMessageCategory", postObj,
			function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.length > 0) {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.my_data = [];
					id = 0;
					$scope.loadCategoryTree();
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		//}
	}

	$scope.my_data = new Array();
	$scope.my_tree = tree = {};
	$scope.loadCategoryTree = function () {
		getDataSource.getDataSource("select_pushMessageParent", {}, function (datatemp) {
			var len = datatemp.length;
			var root = new Object();
			root.label = "消息推送分类";
			root.rowid = "0";
			root.children = new Array()
			for (var i = 0; i < len; i++) {
				if (datatemp[i].fid == '0') {
					drawChild(root, datatemp, datatemp[i])
				}
			}

			$scope.my_data.push(root);
			$scope.doing_async = false;
			///console.log("tree", tree);
			//tree.expand_branch(tree.get_first_branch());
			tree.expand_all();
		}, function (errortemp) {

		});
	}
	function drawChild(root, datatemp, fobj) {
		var tempobj = { label: fobj.name, rowid: fobj.id, children: [] };
		var childlist = _.filter(datatemp, { fid: fobj.id });
		var length = childlist.length;
		if (length > 0) {
			for (var i = 0; i < length; i++) {
				drawChild(tempobj, datatemp, childlist[i]);
			}
		}
		root.children.push(tempobj);
	}
	$scope.try_async_load = function () {
		$scope.my_data = new Array();
		$scope.doing_async = true;
		$scope.loadCategoryTree();
	};
	$scope.try_async_load();
}]);
angular.module("myApp")
.controller("platformCourseListController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forAddCourse: [] };

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgCourse", { platformid: $stateParams.id, platformid2: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformCourse", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.class.courseList = data;
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
				{ name: '课程名称', field: "name", width: '28%' },
				{ name: '授课人', field: "teachersname", width: '8%' },
				{ name: '授课时间', field: "teachtime", width: '10%' },
				{ name: '分配时间', field: "createtime", width: '10%', cellFilter: "date:'yyyy-MM-dd'", },
				{ name: '分配人', field: "createuser", width: '8%' },
				{ name: '选用次数', field: "sybs", width: '6%' },
				{ name: '来源', field: "teachersname", width: '8%' },
				{ name: '状态', field: "mainstatus", cellFilter: "coursewareStatusFilter", width: '8%' },
				{ name: "共享", width: '6%', field: "isshare", cellFilter: "isShareFilter", cellClass: "mycenter", headerCellClass: 'mycenter' }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除课程
		$scope.delCourseware = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var checkCourse = { platformid: $stateParams.id, selectRows: selectRows };
			getDataSource.getUrlData("../api/checkDelPkgCourse", checkCourse, function (data) {
				if (data.code == "success") {
					getDataSource.doArray(["deletePkgCourseware", "deletePkgMicroVideoByCourseId"], selectRows, function (data) {
						$scope.initTable();
						notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}, function (error) {
						notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					});
				} else {
					notify({ message: '删除失败,存在课程已被使用。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function () {

			})
		}

		$scope.addDisabled = false;
		$scope.addCourse = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forAddCourse, function (item) {
				item.platformid = $stateParams.id;
				item.coursewareid = item.id;
				item.coursewarename = item.name;
				item.isshare = 1;
			});

			getDataSource.getUrlData("../api/savePkgCourse", $scope.class.forAddCourse, function (data) {
				$scope.addDisabled = false;
				if (data.code == "success") {
					angular.forEach($scope.class.forAddCourse, function (item) {
						_.remove($scope.class.courseList, { id: item.id });
					});
					$scope.class.forAddCourse = [];
					$scope.initTable();
				} else {
					notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (error) { $scope.addDisabled = false; });
			//插入课程。
			//getDataSource.doArray("insertPkgCourseware", $scope.class.forAddCourse, function (data) {
			//	angular.forEach($scope.class.forAddCourse, function (item) {
			//		_.remove($scope.class.courseList, { id: item.id });
			//	});
			//	$scope.class.forAddCourse = [];
			//	$scope.initTable();
			//});
		}
}]);
angular.module("myApp")
.controller("platformEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.platform = new Object();
		$scope.platform.id = '';
		$scope.platform.name = '';
		$scope.platform.category = 0;
		$scope.platform.adminaccount = new Array();//平台管理员
		$scope.platform.cellphone = '';
		$scope.platform.logname = '';
		$scope.platform.pwd = '';
		$scope.platform.starttime = '';
		$scope.platform.endtime = '';
		$scope.platform.status = false;
		$scope.platform.isextend = true;

		$scope.showtotal = $rootScope.user.platformcategory;

		$scope.goback = function () {
			$state.go("index.platformList", {}, { reload: false });
		}

		$scope.goPlatformEdit = function () {
			if ($stateParams.id) {
				$state.go("index.platformEdit", { id: $stateParams.id });
			}
			else {
				$state.go("index.platformEdit");
			}
		}

		$scope.goTabList = function (nowtype) {
			var nowRouter = "";
			switch (nowtype) {
				case 0: nowRouter = "index.platformEdit.courselist"; break;
				case 1:
				case 4:
				case 5:
					nowRouter = "index.platformEdit.teacherlist";
					break;
				case 2: nowRouter = "index.platformEdit.permissionlist"; break;
				case 3: nowRouter = "index.platformEdit.microvideolist"; break;
			}
			$state.go(nowRouter, { type: nowtype });
		}

		if ($stateParams.id) {
			$scope.nowid = $stateParams.id;
			getDataSource.getDataSource(["getPlatformInfo"]
			, { platformid: $scope.nowid, platformid2: $scope.nowid }, function (data) {
				//平台信息
				var pkginfo = data;// _.find(data, { name: "getPlatformInfo" }).data;
				$scope.platform = pkginfo[0];
				var status = $scope.platform.status == 1;
				$scope.platform.status = status;
				var isextend = $scope.platform.isextend == 1;
				$scope.platform.isextend = isextend;
				$scope.platform.pwd = "******";
			}, function (errortemp) { });
		}
		$scope.saveButtonDisabled = false;
		//保存平台
		$scope.savePlatform = function () {
			$scope.saveButtonDisabled = true;
			getDataSource.getUrlData("../api/platform", $scope.platform, function (data) {
				if (data.code == "success") {
					$scope.saveButtonDisabled = false;
					$state.go("index.platformEdit", { id: data.id });
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					$scope.saveButtonDisabled = false;
					notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}]);
angular.module("myApp")
.controller("platformMicroVideoController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forMicroVideo: [] };

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgMicroVideo", { platformid: $stateParams.id }, function (gridData) {
				$scope.gridOptions.data = gridData;
			}, function (error) {
				alert(1)
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformMicroVideo", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.class.microvideoList = data;
			}, function (error) {
				
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.name}}</div>' },
				{ name: '授课人', field: "teacher" },
				{ name: '分类', field: "category" },
				{ name: '分配时间', field: "createtime" },
				{ name: '分配人', field: "createuser" },
				{ name: '关联课程', field: "linkcourse", cellFilter: "isShareFilter" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				//当为关联数据时，则不能被删除
				gridApi.selection.on.rowSelectionChanged($scope, function (row) {
					var msg = 'row selected ' + row.isSelected;
					if (row.entity.linkcourse) {
						row.isSelected = false;
						notify({ message: '该视频已关联课程，不能被操作。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				});
			}
		};

		//删除微视频
		$scope.delMicroVideo = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			getDataSource.doArray("deletePkgMicroVideo", selectRows, function (data) {
				$scope.initTable();
				notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.addDisabled = false;
		$scope.addMicroVideo = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forMicroVideo, function (item) {
				item.platformid = $stateParams.id;
				item.microvideoid = item.id;
				item.isshare = 1;
			});
			getDataSource.doArray(["insertPkgMicroVideo"], $scope.class.forMicroVideo, function (data) {
				$scope.addDisabled = false;
				angular.forEach($scope.class.forMicroVideo, function (item) {
					_.remove($scope.class.microvideoList, { id: item.id });
				});
				$scope.class.forMicroVideo = [];
				$scope.initTable();
			}, function (error) { $scope.addDisabled = false; });
		}
	}]);
angular.module("myApp")
.controller("platformPermissionController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.platform = new Object();
		$scope.platform.adminaccount = new Array();//平台管理员

		$scope.loadform = function () {
			if ($stateParams.id) {
				$scope.nowid = $stateParams.id;
				getDataSource.getDataSource(["getPlatformInfo", "getPkgAdmin", "getPlatformPermission"]
				, { platformid: $scope.nowid, platformid2: $scope.nowid }, function (data) {
					//平台信息
					var pkginfo = _.find(data, { name: "getPlatformInfo" }).data;
					$scope.platform = pkginfo[0];

					//平台管理员
					var pkgadmin = _.find(data, { name: "getPkgAdmin" }).data;
					$scope.platform.pwd = "******";
					$scope.platform.adminaccount = pkgadmin[0];
					//分平台权限
					var pkgpermission = _.find(data, { name: "getPlatformPermission" }).data;
					//console.log("pkgpermission", pkgpermission);
					
					$scope.platform.permissionGroupList = $scope.permissionGroupList;
					///console.log("$scope.permissionGroupList", $scope.permissionGroupList);
					var length = $scope.platform.permissionGroupList.length;
					for (var i = 0; i < length; i++) {
						var groupPermission = $scope.platform.permissionGroupList[i].permissionArray;
						var templength = groupPermission.length;
						for (var j = 0; j < templength; j++) {
							if (pkgpermission.length > 0) {
								var chkobj = _.find(pkgpermission, { id: groupPermission[j].id });
								if (chkobj != null && chkobj != undefined) {
									groupPermission[j].selected = true;
								} else {
									groupPermission[j].selected = false;
								}
							} else {
								groupPermission[j].selected = false;
							}
						}
					}

				}, function (errortemp) { });
			} else {
				$scope.platform.permissionGroupList = $scope.permissionGroupList;
			}
		}
		
		$scope.adminctrl = new Object();
		$scope.adminctrl.disabled = false;
		$scope.adminctrl.onSelectCallback = function ($item, $model) {
			$scope.platform.cellphone = $item.cellphone;
			$scope.platform.logname = $item.logname;
			$scope.platform.pwd = "******";
		}

		$scope.loadpage = function () {
			getDataSource.getDataSource(["selectPlatformAdmin", "selectPlatformPermission", "getAllPermissionGroup"], 
			{ platformid: $rootScope.user.platformid, childplatformid: $stateParams.id }, function (data) {
				$scope.admins = _.find(data, { name: 'selectPlatformAdmin' }).data;
				var groupdata = _.find(data, { name: 'getAllPermissionGroup' }).data;
				var permissiondata = _.find(data, { name: 'selectPlatformPermission' }).data;
				var length = groupdata.length;
				var groupname = '';
				var category = '';

				$scope.permissionGroupList = new Array();
				for (var i = 0; i < length; i++) {
					groupname = groupdata[i].groupname;
					category = groupdata[i].category;
					var permissionTemp = _.filter(permissiondata, { groupname: groupname });
					var templength = permissionTemp.length;
					if (templength == 0) {
						continue;
					}
					for (var j = 0; j < templength; j++) {
						permissionTemp[j].selected = false;
					}
					$scope.permissionGroupList.push({ groupname: groupname,category:category, permissionArray: permissionTemp });
				}

				$scope.loadform();

			}, function (errortemp) { });
		}();

		$scope.saveButtonDisabled = false;
		$scope.savePlatformAdmin = function () {
			$scope.saveButtonDisabled = true;
			//console.log($scope.platform);
			//return;
			getDataSource.getUrlData("../api/savePlatformAdmin", $scope.platform, function (data) {
				if (data.code == "success") {
					$scope.saveButtonDisabled = false;
					//$state.go("index.platformEdit", { id: data.id });
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					$scope.saveButtonDisabled = false;
					notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}]);
angular.module("myApp")
.controller("platformTeacherListController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		$scope.class = { forAddTeacher: [] };
		$scope.placeholder = '班主任';
		var category = 0;
		//1:班主任，4 班助理，5 指导老师
		switch ($stateParams.type) {
			case 1:
				category = 0;
				$scope.placeholder = '班主任';
				break;
			case 4:
				category = 1;
				$scope.placeholder = '班主任助理';
				break;
			case 5:
				category = 2;
				$scope.placeholder = '班部指导老师';
				break;
		}

		$scope.initTable = function () {
			getDataSource.getDataSource("getPkgUsers", { platformid: $stateParams.id, category: category }, function (gridData) {
				$scope.gridOptions.data = gridData;
			});
		}

		$scope.load = function () {
			getDataSource.getDataSource("selectPlatformUser", { platformid: $rootScope.user.platformid, childplatformid: $stateParams.id, category: category }, function (data) {
				$scope.class.teacherList = data;
			});
			$scope.initTable();
		}();

		$scope.gridOptions = {
			useExternalPagination: true,
			data: [],
			columnDefs: [
				{ name: '教师姓名', field: "uname", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.uname}}</div>' },
				{ name: '工作单位', field: "company" }
			],
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};

		//删除老师
		$scope.delTeacher = function () {
			var selectRows = $scope.gridApi.selection.getSelectedRows();
			var checkUser = {category:category, platformid: $stateParams.id, selectRows: selectRows };

			getDataSource.getUrlData("../api/checkDelPkgUser", checkUser, function (data) {
				if (data.code == "success") {
					$scope.initTable();
					notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				} else {
					notify({ message: data.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (error) {
				notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.addDisabled = false;
		$scope.addTeacher = function () {
			$scope.addDisabled = true;
			angular.forEach($scope.class.forAddTeacher, function (item) {
				item.platformid = $stateParams.id;
				item.userid = item.id;
				item.uname = item.uname;
				item.category = category;
			});
			getDataSource.getUrlData("../api/insertPkgUser", $scope.class.forAddTeacher, function (data) {
				$scope.addDisabled = false;
				angular.forEach($scope.class.forAddTeacher, function (item) {
					_.remove($scope.class.teacherList, { id: item.id });
				});
				$scope.class.forAddTeacher = [];
				$scope.initTable();
			}, function (error) { $scope.addDisabled = false; });
		}
}]);
angular.module("myApp")
.controller("platformListController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", "notify",
	function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
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
          { name: "序号", field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '平台名称', field: "name", width: '50%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: "状态", field: "status", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'mapGender' },
          { name: "平台分类", field: "category", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "platformCategory" }
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
		var array = ["selectAllPlatform"];
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

	$scope.deletePlatform = function () {
		$scope.modalInstance = $modal.open({
			templateUrl: 'confirm.html',
			size: 'sm',
			scope: $scope
		});
	}

	$scope.ok = function () {
		$scope.isAccept = true;
		var selectRows = $scope.gridApi.selection.getSelectedRows();
		getDataSource.doArray("deletePlatform", selectRows, function () {
			notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			$scope.loadGrid();
		}, function (errortemp) {
			notify({ message: '删除失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
		});
		$scope.close();
	}
	//关闭模式窗口
	$scope.close = function () {
		$scope.modalInstance.dismiss('cancel');
	}

	//getDataSource.getDataSource("selectAllPlatform", {}, function (data) {
	//	$scope.gridOptions.data = data;
	//});
    $scope.goDetial = function (row) {
        $state.go("index.platformEdit", { id: row.entity.id });
    }
}]);
angular.module("myApp")
.controller("pushmessageEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "FilesService"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, FilesService) {

		$scope.allcategory = [];
		$scope.levelonelist = [];
		$scope.leveltwolist = [];
		$scope.levelthreelist = [];
		$scope.news = new Object();
		$scope.showPublishBtn = false;

		var editid = $stateParams.id;

		$scope.selectOnly1Or2 = function (item, selectedItems) {
			//console.log("item",item);
			if (selectedItems !== undefined && selectedItems.length >= 20) {
				return false;
			} else {
				return true;
			}
		};

		$scope.goback = function () {
			$state.go("index.pushmessagelist");
		}

		$scope.switchViewCallback = function (scopeObj) {
			//console.log("scopeObj",scopeObj);
			//if (scopeObj.switchViewLabel == 'test2') {
			//	scopeObj.switchViewLabel = 'test1';
			//	scopeObj.inputModel = data1;
			//	scopeObj.selectOnlyLeafs = true;
			//} else {
			//	scopeObj.switchViewLabel = 'test2';
			//	scopeObj.inputModel = data3;
			//	scopeObj.selectOnlyLeafs = false;
			//}
		}

		function drawChild(root,datatemp, fobj) {
			var tempobj = { name: fobj.name, id: fobj.id, children: [] };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			for (var i = 0; i < length; i++) {
				drawChild(tempobj,datatemp, childlist[i]);
			}
			root.children.push(tempobj);
		}

		function checkChildSelected(roottemp, selectlist) {
			var objArray = _.filter(selectlist, { id: roottemp.id })
			//console.log("objArray", objArray)
			if (objArray.length>0) {
				for (var i = 0; i < objArray.length; i++) {
					roottemp.selected = true;
					roottemp.isActive = true;
				}
				$scope.news.selectedItem.push(roottemp);
			} else {
				var length = roottemp.children.length;
				for (var i = 0; i < length; i++) {
					checkChildSelected(roottemp.children[i], selectlist)
				}
			}
		}

		$scope.LoadData = function () {
			getDataSource.getDataSource(["selectAllPushMessageCategory"], {}, function (data) {
				$scope.allcategory = [];
				var len = data.length;

				var root = new Object();
				root.label = "信息分类";
				root.rowid = "0";
				root.children = new Array()
				for (var i = 0; i < len; i++) {
					if (data[i].fid == '0') {
						drawChild(root,data, data[i])
					}
				}
				
				//加载表单数据
				if (editid != null && editid != "") {
					$scope.showPublishBtn = true;
					getDataSource.getDataSource(["getPushMessageById", "getPushMessageCategoryByMessageId"], { id: editid }, function (data) {
						$scope.news = _.find(data, { name: "getPushMessageById" }).data[0];
						//console.log($scope.news);
						$scope.news.selectedItem = new Array();
						var selectlist = _.find(data, { name: "getPushMessageCategoryByMessageId" }).data;
						var categorylength = root.children.length;

						//var selectlength = selectlist.length;
						//for (var i = 0; i < selectlength; i++) {
							
						//}

						//console.log("root", root);
						for (var i = 0; i < categorylength; i++) {
							checkChildSelected(root.children[i], selectlist);
						}
						$scope.allcategory = root.children;
					}, function (error) { });
				} else {
					$scope.allcategory = root.children;
				}
				
			}, function (errortemp) { });
		}

		$scope.uploadFiles = function (files) {
			$scope.files = files;
			$scope.news.pdfname = $scope.files[0].name;
		}

		$scope.saveNew = function () {
			var newid = getDataSource.getGUID();
			$scope.news.id = newid;
			var selectlist = $scope.news.selectedItem;
			var length = selectlist.length;
			var categorylist = new Array();
			for (var i = 0; i < length; i++) {
				var temp = new Object();
				temp.categoryid = selectlist[i].id;
				temp.messageid = newid;
				categorylist.push(temp);
			}
			$scope.news.pdfname = "";
			$scope.news.pdfservername = "";
			$scope.news.platformid = $rootScope.user.platformid;
			$scope.news.categorylist = categorylist;
			$scope.news.createuser = $rootScope.user.name;
			$scope.news.createtime = new Date();

			if ($scope.files!=undefined&& $scope.files.length > 0) {
				FilesService.upLoadPicture($scope.files[0], { upcategory: "pushMessagePdf" }, function (data) {
					$scope.news.pdfname = $scope.files[0].name;
					$scope.news.pdfservername = data.data[0].servername;
					//console.log("$scope.news", $scope.news)
					//文件上传成功后，再保存数据
					getDataSource.getDataSource(["insertPushMessage"], $scope.news, function (datatemp) {
						//console.log("$scope.news.categorylist", $scope.news.categorylist);
						getDataSource.doArray("insertPushMessageRelation", $scope.news.categorylist, function (data) {
							$scope.saveDisabled = false;
							notify({ message: "保存成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}, function (error) {
							$scope.saveDisabled = false;
							notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						});
					}, function (error) {
						$scope.saveDisabled = false;
						notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					});
				});
			} else {
				$scope.saveDisabled = false;
				notify({ message: "请选择附件上传", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}
		}

		function SaveData() {
			getDataSource.getDataSource(["updatePushMessage","deletePushMessageRelationByMessageId"], $scope.news, function (datatemp) {
				//console.log(" $scope.news.categorylist", $scope.news.categorylist);
				getDataSource.doArray("insertPushMessageRelation", $scope.news.categorylist, function (data) {
					$scope.saveDisabled = false;
					notify({ message: "保存成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}, function (error) {
					$scope.saveDisabled = false;
					notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				});
			}, function (error) {
				$scope.saveDisabled = false;
				notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.saveForm = function () {
			
			var selectlist = $scope.news.selectedItem;
			var length = selectlist.length;
			var categorylist = new Array();
			for (var i = 0; i < length; i++) {
				var temp = new Object();
				temp.categoryid = selectlist[i].id;
				temp.messageid = editid;
				categorylist.push(temp);
			}
			$scope.news.id = editid;
			$scope.news.categorylist = categorylist;
			$scope.news.publishuser = $rootScope.user.name;
			$scope.news.publishtime = new Date();
			if ($scope.files != undefined && $scope.files.length > 0) {
				FilesService.upLoadPicture($scope.files[0], { upcategory: "pushMessagePdf" }, function (data) {
					$scope.news.pdfname = $scope.files[0].name;
					$scope.news.pdfservername = data.data[0].servername;
					SaveData();
				});
			} else {
				SaveData();
			}
		}

		$scope.saveDisabled = false;
		$scope.save = function (act) {
			//console.log($scope.news);
			$scope.saveDisabled = true;
			if (editid == null || editid == "") {
				$scope.saveNew();
			} else {
				$scope.saveForm();
			}
		}
		$scope.LoadData();

		//发布
		$scope.publish = function () {
			var temp = new Object();
			temp.id = editid;
			temp.publishuser = $rootScope.user.name;
			temp.publishtime = new Date();
			temp.status = 1;
			
			getDataSource.getDataSource("publishPushMessage", temp, function (data) {
				$scope.saveDisabled = false;
				notify({ message: "发布成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				$scope.saveDisabled = false;
				notify({ message: "发布失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}
}]);
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
app.controller("querylogController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null
		};

		$scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
		$scope.years = [];
		$scope.currenty = new Date().getFullYear();
		$scope.currentm = new Date().getMonth()+1;
		for (var i = 2016; i < $scope.currenty + 1; i++) {
			$scope.years.push(i);
		}
		$scope.tblobj = {};
		$scope.tblobj.year = $scope.currenty;
		$scope.tblobj.month = $scope.currentm;
		//
		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
			paginationPageSize: 25,
			useExternalPagination: true,
			data: [],
			columnDefs: [
              { name: '序号', field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '登录名', field: "username", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '班级名称', field: "classname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			  { name: '操作', field: "handle", cellClass: "mycenter", width: '20%', headerCellClass: 'mycenter' },
			  { name: '操作时间', field: "handletime", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd HH:mm:ss'" },
			  { name: '操作分类', field: "handlecategory", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' }
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
		//$scope.goDetial = function (row) {
		//	$state.go("index.accountedit", { id: row.entity.id });
		//}
		
		$scope.search = {};
		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getMonthLog"];
			var date = null;
			if ($scope.tblobj.year == "" || $scope.tblobj.month == "") {
				date = new Date();
			} else {
				date = new Date(Date.parse(($scope.tblobj.year + "-" + $scope.tblobj.month+"-01").replace(/-/g, "/")));
			}
			getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid, tablerule: date }
				, { firstRow: firstRow, pageSize: pageSize }
				, $scope.search, paginationOptions.sort, { connectionKey: "LogConnectionString" }
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
angular.module("myApp")
.controller("answeredController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.questionInfo = row;
        $scope.questionInfo.entity.answercontent = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'answer.html',
            size: 'lg',
            scope: $scope
        });
    }

    //打开屏蔽窗口
    $scope.goShield = function (row) {
        $scope.questionShieldInfo = row;
        $scope.questionShieldInfo.entity.reason = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'shield.html',
            size: 'lg',
            scope: $scope
        });
    }

    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.goDetial = function (row) {
        $state.go("index.questionDetail", { id: row.entity.id });
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '问题', field: "content", width: "30%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '提问人', field: "studentname", width: "8%" },
          { name: '提问人单位', field: "departmentname", width: "12%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '提问时间', field: "createtime", width: "13%" },
          { name: '来自课程', field: "coursewarename", width: "20%" },
          { name: '主讲人', field: "teachersname", width: "10%" },
          { name: '答案', field: "answertcount", width: "8%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.answertcount}}</a>' },
          { name: '操作', width: "10%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">回答</a><a style="padding-left:20px;" ng-click="grid.appScope.goShield(row)">屏蔽</a></div>' },

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
    $scope.goSearch = function () {
    	$scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("getAnsweredQuestion", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();

	//保存回答
    $scope.saveDisabled = false;
    $scope.saveAnswer = function () {
    	$scope.saveDisabled = true;
		
    	if ($scope.questionInfo.entity.answerContent == undefined || $scope.questionInfo.entity.answerContent == "" || $scope.questionInfo.entity.answerContent.length <= 0) {
    		notify({ message: '请输入回复内容。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		$scope.saveDisabled = false;
    		return;
    	}

        var param = {
            id: getDataSource.getGUID(),
            accountid: $rootScope.user.accountId,
            fid: $scope.questionInfo.entity.id,
            content: $scope.questionInfo.entity.answerContent,
            coursewareid: $scope.questionInfo.entity.coursewareid,
            usertype: 2,
            classid: $rootScope.user.classId,
            faqid: $scope.questionInfo.entity.id
        };

        getDataSource.getDataSource("classmanager-faq-teacheranswer", param, function (data) {
        	if (data[0].crow && data[0].crow >= 1) {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
        	} else {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (e) {
        	$scope.saveDisabled = false;
            notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //保存屏蔽
    $scope.saveShield = function () {
        var param = {
            id: $scope.questionShieldInfo.entity.id,
            shielding: 1,
            reason: $scope.questionShieldInfo.entity.reason,
            accountid: $rootScope.user.accountId
        };

        getDataSource.getDataSource("classmanager-faq-shielding-update", param,
        function (data) {
            if (data[0].crow && data[0].crow >= 1) {
                $scope.close();
                $scope.loadGrid();
                notify({ message: '屏蔽问题成功', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } else {
                notify({ message: '屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        },
        function (e) {
            notify({ message: '屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

}]);
angular.module("myApp")
.controller("noansweredController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.questionInfo = row;
        $scope.questionInfo.entity.answercontent = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'answer.html',
            size: 'lg',
            scope: $scope
        });
    }

    //打开屏蔽窗口
    $scope.goShield = function (row) {
        $scope.questionShieldInfo = row;
        $scope.questionShieldInfo.entity.reason = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'shield.html',
            size: 'lg',
            scope: $scope
        });
    }

    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.goDetial = function (row) {
        $state.go("index.questionDetail", { id: row.entity.id });
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
            { name: '序号', field: "rownum", width: "6%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '问题', field: "content", width: "24%", headerCellClass: 'mycenter' ,cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '提问人', field: "studentname", width: "8%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '提问人单位', field: "departmentname", width: "12%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '提问时间', field: "createtime", width: "13%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '来自课程', field: "coursewarename", width: "20%", headerCellClass: 'mycenter' },
          { name: '主讲人', field: "teachersname", width: "8%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '答案', field: "answertcount", width: "8%", cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.answertcount}}</a>' },
          { name: '操作', width: "10%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">回答</a><a style="padding-left:20px;" ng-click="grid.appScope.goShield(row)">屏蔽</a></div>' },

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
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getNoAnsweredQuestion", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

	//保存回答
    $scope.saveDisabled = false;
    $scope.saveAnswer = function () {
    	$scope.saveDisabled = true;

    	if ($scope.questionInfo.entity.answerContent == undefined || $scope.questionInfo.entity.answerContent == "" || $scope.questionInfo.entity.answerContent.length <= 0) {
    		notify({ message: '请输入回复内容。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		$scope.saveDisabled = false;
    		return;
    	}
    	var param = {
            id: getDataSource.getGUID(),
            accountid: $rootScope.user.accountId,
            fid: $scope.questionInfo.entity.id,
            content: $scope.questionInfo.entity.answerContent,
            coursewareid: $scope.questionInfo.entity.coursewareid,
            usertype: 2,
            classid: $rootScope.user.classId,
            faqid: $scope.questionInfo.entity.id
        };

        getDataSource.getDataSource("backsys_classmanager-faq-teacheranswer", param, function (data) {
        	if (data[0].crow && data[0].crow >= 1) {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
        	} else {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (e) {
        	$scope.saveDisabled = false;
            notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //保存屏蔽
    $scope.saveShield = function () {
        var param = {
            id: $scope.questionShieldInfo.entity.id,
            shielding: 1,
            reason: $scope.questionShieldInfo.entity.reason,
            accountid: $rootScope.user.accountId
        };

        getDataSource.getDataSource("classmanager-faq-shielding-update", param,
        function (data) {
            if (data[0].crow && data[0].crow >= 1) {
                $scope.close();
                $scope.loadGrid();
                notify({ message: '屏蔽问题成功', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } else {
                notify({ message: '屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        },
        function (e) {
            notify({ message: '屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

}]);
angular.module("myApp")
.controller("questionController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter) {

    $scope.goQuestionList = function (nowtype) {
        var nowRouter = "";
        switch (nowtype) {
            case 0: nowRouter = "index.question.noanswered"; break;
            case 1: nowRouter = "index.question.answered"; break;
            case 2: nowRouter = "index.question.shield"; break;
        }
        $state.go(nowRouter);
    }
}]);
angular.module("myApp")
.controller("questionDetailController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", "$stateParams", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, $stateParams, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    
    $scope.acceptAnswer = function (id) {
        var param = { id:id };

        getDataSource.getDataSource("classmanager-faq-acceptanswer", param
            , function (data) {
                if (data[0].crow && data[0].crow >= 1) {
                    $scope.loadGrid();
                     notify({ message: '采纳答案成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                 } else {
                    notify({
                        message: '采纳答案失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl
                });
                 }
                 },
                 function (e) {
                     notify({ message: '采纳答案失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
             });
    }

    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.answerInfo = row;
        $scope.modalInstance = $modal.open({
            templateUrl: 'answerDetail.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '回答', field: "content", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '回答人', field: "username", width: '10%' },
          { name: '回答时间', field: "createtime", width: '15%' },
          { name: '回答来自', field: "usertype", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.usertype == "1" ? "学员":"老师"}}</div>' },
          { name: '是否采纳', field: "status", width: '8%', cellTemplate: '<div class="ui-grid-cell-contents">{{!row.entity.status ? "未采纳":"已采纳"}}</div>' },
          { name: '操作', width: '10%', cellTemplate: '<div class="ui-grid-cell-contents" ng-if="!row.entity.status"><a ng-click="grid.appScope.acceptAnswer(row.entity.id)">采纳</a>' }
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
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("getQuestionAnswers", {fid:$stateParams.id}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("shieldController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };



    //打开回答窗口
    $scope.goAnswer = function (row) {
        $scope.questionInfo = row;
        $scope.questionInfo.entity.answercontent = "";
        $scope.modalInstance = $modal.open({
            templateUrl: 'answer.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.goDetial = function (row) {
        $state.go("index.questionDetail", { id: row.entity.id });
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '问题', field: "content", width: '30%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAnswer(row)">{{row.entity.content}}</a>' },
          { name: '提问人', width: '7%', field: "studentname" },
          { name: '提问人单位', field: "departmentname", width: "12%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '提问时间', width: '13%', field: "createtime" },
          { name: '来自课程', width: '20%', field: "coursewarename" },
          { name: '主讲人', width: '8%', field: "teachersname" },
          { name: '答案', field: "answertcount", width: "8%", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.answertcount}}</a>' },
          { name: '操作', width: '10%', cellTemplate: '<div class="ui-grid-cell-contents"><a style="padding-left:20px;" ng-click="grid.appScope.cancelShield(row)">取消屏蔽</a></div>' },

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
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("getShieldQuestion", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

   
	//保存回答
    $scope.saveDisabled = false;
    $scope.saveAnswer = function () {
    	$scope.saveDisabled = true;

    	if ($scope.questionInfo.entity.answerContent == undefined || $scope.questionInfo.entity.answerContent == "" || $scope.questionInfo.entity.answerContent.length <= 0) {
    		notify({ message: '请输入回复内容。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		$scope.saveDisabled = false;
    		return;
    	}

        var param = {
            id: getDataSource.getGUID(),
            accountid: $rootScope.user.accountId,
            fid: $scope.questionInfo.entity.id,
            content: $scope.questionInfo.entity.answerContent,
            coursewareid: $scope.questionInfo.entity.coursewareid,
            usertype: 2,
            classid: $rootScope.user.classId,
            faqid: $scope.questionInfo.entity.id
        };

        getDataSource.getDataSource("classmanager-faq-teacheranswer", param, function (data) {
        	if (data[0].crow && data[0].crow >= 1) {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.close();
                $scope.loadGrid();
        	} else {
        		$scope.saveDisabled = false;
                notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }, function (e) {
        	$scope.saveDisabled = false;
            notify({ message: '回复问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

    //取消屏蔽
    $scope.cancelShield = function (row) {
        var param = {
            id: row.entity.id,
            shielding: 0,
            reason: "",
            accountid: $rootScope.user.accountId
        };

        getDataSource.getDataSource("classmanager-faq-shielding-update", param,
        function (data) {
            if (data[0].crow && data[0].crow >= 1) {
                $scope.loadGrid();
                notify({ message: '取消屏蔽问题成功', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            } else {
                notify({ message: '取消屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        },
        function (e) {
            notify({ message: '取消屏蔽问题失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }

}]);
angular.module("myApp")
.controller("recommendcourseController", ['$rootScope', '$http', '$scope', 'getDataSource', "$state", "$stateParams", "$modal", "notify", "smsService", function ($rootScope, $http, $scope, getDataSource, $state, $stateParams, $modal, notify, smsService) {
    $scope.class = { forAddCourse: [] };

    //----------------------------------------------

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', width: '45%', field: "coursewarename", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.coursewarename}}</div>', headerCellClass: 'mycenter' },
          //{ name: '课程名称', width: '50%', field: "coursewarename", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', width: '20%', field: "teachersname", cellClass: "mycenter", headerCellClass: 'mycenter' },
          //{ name: '点击次数', width: '8%', field: "clickrate", cellClass: "mycenter", headerCellClass: 'mycenter' },
          //{ name: '发布状态', width: '10%', field: "status", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status == 0 ? "未发布":"已发布"}}</div>', headerCellClass: 'mycenter' },
          //{ name: '首页显示', width: '10%', field: "ismain", cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.ismain == 0 ? "否":"是"}}</div>', headerCellClass: 'mycenter' },
          //{ name: '创建人', width: '8%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '25%', field: "createtime", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" }
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
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }

    $scope.goDetial = function (row) {
        $state.go("index.recommendcourseEdit", { id: row.entity.coursewareid, opencourseid: row.entity.id });
    }


    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;

        getDataSource.getList("selectOpenCourseware", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }

    //----------------------------------------------


    $scope.load = function () {
        getDataSource.getDataSource("selectNoOpenCourseware", { platformid: $rootScope.user.platformid, platformid1: $rootScope.user.platformid, classid: $stateParams.id, classid1: $stateParams.id }, function (data) {
            $scope.class.courseList = data;
        });
        $scope.goSearch();
    }();

    //删除课程
    $scope.delCourseware = function () {
        if (confirm("确定要删除选中的课程吗")) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            getDataSource.doArray("delete_sy_courseware_public", selectRows, function (data) {
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }

    $scope.addCourseDisabled = true;
    $scope.addCourse = function () {
        if ($scope.class.forAddCourse && $scope.class.forAddCourse.length > 0) {
            $scope.addCourseDisabled = true;
            angular.forEach($scope.class.forAddCourse, function (item) {
                item.coursewareid = item.id;
            });
            getDataSource.doArray("insert_sy_courseware_public", $scope.class.forAddCourse, function (data) {
                notify({ message: '添加成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                angular.forEach($scope.class.forAddCourse, function (item) {
                    _.remove($scope.class.courseList, { id: item.id });
                });
                $scope.class.forAddCourse = [];
                $scope.loadGrid();
            });
        }
    }

    $scope.$watch("class.forAddCourse", function (newValue) {
        if (newValue.length > 0)
            $scope.addCourseDisabled = false;
        else
            $scope.addCourseDisabled = true;
    })

    $scope.publish = function (type) {
        var mess = type == 0 ? "撤销发布" : "发布";
        if (confirm("确定要"+mess+"选中的课程吗")) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var publishlist = [];
            for (var i = 0; i < selectRows.length; i++) {
                publishlist.push({
                    id: selectRows[i].id,
                    status: type
                });
            }
            getDataSource.doArray("publish_sy_courseware_public", publishlist, function (data) {
                notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }
    $scope.ismain = function (type) {
        var mess = type == 1 ? "设置首页显示" : "取消首页显示";
        if (confirm("确定要将选中的课程" +mess)) {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            var publishlist = [];
            for (var i = 0; i < selectRows.length; i++) {
                publishlist.push({
                    id: selectRows[i].id,
                    ismain: type
                });
            }
            getDataSource.doArray("ismain_sy_courseware_public", publishlist, function (data) {
                notify({ message: mess + '成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadGrid();
            });
        }
    }
}]);
angular.module("myApp")
.controller("recommendcourseEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify'
	, '$state', '$http', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state
		, $http, drawTable, CommonService, FilesService) {
	$scope.course = { teachers: [], videotype: 0 };
	$scope.isNew = true;

	
    
    $scope.st = {};
    $scope.checkedAnswer = {};
    $scope.nowid = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.typeShow = true;
    if ($scope.type == "1")
        $scope.typeShow = false;
    $scope.saveButtonDisabled = false;
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }


    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }

    


    if ($stateParams.id) {
    	$scope.isNew = false;
        getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation", "getKeywordByCourseId"], { id: $stateParams.id, coursewareid: $stateParams.id }, function (data) {
            var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
            $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
            $scope.course.teachers = teachrRelation.data;
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);

            var courseKeyword = _.find(data, function (o) { return o.name == "getKeywordByCourseId"; }).data;

            $scope.course.courseKeywordOne = _.filter(courseKeyword, function (n) { return n.category == '关键词（一级）' });
            $scope.course.courseKeywordTwo = _.filter(courseKeyword, function (n) { return n.category == '关键词（二级）' });

        	//如果是共享的课程，那么分平台是不能删除和修改的。
            $scope.saveIsShareButtonDisabled = false;
            if ($scope.course.isshare == 1) {
            	$scope.saveIsShareButtonDisabled = true;
            	CommonService.initInputControlDisabled();
            }
        });
    }

  
    $scope.goback = function () {
        if ($scope.type == "1")
            $state.go("index.alumnusCourseware");
        else
            $state.go("index.courseware");
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }
    $scope.save = function () {
        //保存封面图
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 200, height: 120 }, function (data) {
                $scope.course.imagephoto = data.data[0].servername;
                doSave();
            });
        }
        else {
            doSave();
        }

    }
    var doSave = function () {
        $scope.saveButtonDisabled = true;
        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
            insertCourseKeyWordRelation($stateParams.id);
            getDataSource.getDataSource("updateCoursewareById", $scope.course, function (data) {
                $scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            });
        }
        else {
            var newid = getDataSource.getGUID();
            $scope.course.id = newid;
            insertCourseRelation(newid);
            insertCourseKeyWordRelation($stateParams.id);
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            $scope.course.createtime = new Date();
            getDataSource.getDataSource("insertCourseware", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	
            	var pkgcse = new Object();
            	pkgcse.platformid = $rootScope.user.platformid;
            	pkgcse.coursewareid = newid;
            	pkgcse.coursewarename = $scope.course.name;
            	pkgcse.isshare = 0;

            	getDataSource.getDataSource("insertPkgCourseware", pkgcse, function (data) {
            		$state.go("index.coursewareEdit", { id: newid });
            	}, function (error) { });
            });
        }
    }
    


    //打开视频预览弹窗
    $scope.openVideoPerview = function (type, vid) {
        if ($scope.course.videotype == 0) {
            perviewVideo(vid);
        }
        else {
            perviewDoubleVideo($scope.course);
        }

    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }
  


    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    var perviewDoubleVideo = function (course) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.teachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.pptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.course.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        if (type == 'videofile') {
            $scope.nowfile = $scope.course.videofile[0];
        }
        else {
            $scope.nowfile = $scope.course.pptfile[0];
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var ts = new Date().getTime();
        var newhash=md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
        var options = {
            endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ts: ts,
            hash: newhash,
            userid: $rootScope.appConfig.vhallConfig.userid,
            ext: ext,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
      		//console.log(file);
          if (type == "videofile") {
              $scope.course.teachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.teachervideoname = file.name;
          }
          else {
              $scope.course.pptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.pptvideoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);
angular.module("myApp")
.controller("questionnaireController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter) {

    $scope.goQuestionnaiseList = function (nowtype) {
        var nowRouter = "";
        switch (nowtype) {
            case 0: nowRouter = "index.questionnaire.questionnaire_list"; break;
        }
        $state.go(nowRouter);
    }
}]);
angular.module("myApp")
.controller("questionnaire_editController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', '$stateParams', function ($scope, $rootScope, getDataSource, $state, notify, $modal, $stateParams) {
    $scope.quest = {};
    if ($stateParams.coursewareid == "") {
        $scope.quest.category = 1;
    }
    else {
        $scope.quest.category = 0;

    }
    $scope.quests = [];
    $scope.answers = [];
    $scope.load = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource(["selectquestionnaireById", "selectquestionnaire_detailById", "select_sy_questionnaire_detail_subjectById"]
                , { id: $stateParams.id }, function (data) {
                    //console.log(data);
                    $scope.quest = _.find(data, function (item) {
                        return item.name == "selectquestionnaireById";
                    }).data[0];
                    $scope.quests = _.find(data, function (item) {
                        return item.name == "selectquestionnaire_detailById";
                    }).data;
                    var answers = _.find(data, function (item) {
                        return item.name == "select_sy_questionnaire_detail_subjectById";
                    }).data;
                    angular.forEach($scope.quests, function (item) {
                        item.answers = [];
                        angular.forEach(answers, function (c) {
                            if (c.fid == item.id) {
                                item.answers.push(c);
                            }
                        });
                    })
                });
        }
    }
    $scope.load();

    $scope.saveButtonDisabled = false;
    $scope.save = function () {
        $scope.saveButtonDisabled = true;
        var answersArray = [];
        if ($stateParams.id) {
            getDataSource.getDataSource(["update_sy_questionnaire", "delete_sy_questionnaire_detail", "delete_sy_questionnaire_subject"]
                , $scope.quest, function (data) {
                    angular.forEach($scope.quests, function (item, index) {
                        item.questionnaireid = $scope.quest.id
                        item.id = getDataSource.getGUID();
                        item.sort = index + 1;
                        angular.forEach(item.answers, function (answer, index1) {
                            answer.id = getDataSource.getGUID();
                            answer.sort = index1;
                            answer.fid = item.id;
                            answer.questionnaireid = $scope.quest.id;
                            answersArray.push(answer);
                        })
                    });
                    $scope.saveButtonDisabled = false;
                    getDataSource.doArray("insert_sy_questionnaire_detail", $scope.quests, function (item) {
                        getDataSource.doArray("insert_sy_questionnaire_subject", answersArray, function (data1) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        });
                    });
                }, function (error) { $scope.saveButtonDisabled = false; });
        }
        else {
            $scope.quest.id = getDataSource.getGUID();
            $scope.quest.createuser = $rootScope.user.name;
            $scope.quest.createtime = new Date();
            angular.forEach($scope.quests, function (item, index) {
                item.questionnaireid = $scope.quest.id
                item.id = getDataSource.getGUID();
                item.sort = index + 1;
                angular.forEach(item.answers, function (answer, index1) {
                    answer.id = getDataSource.getGUID();
                    answer.sort = index1;
                    answer.fid = item.id;
                    answer.questionnaireid = $scope.quest.id;
                    answersArray.push(answer);
                })
            });
            if ($stateParams.coursewareid) {
                getDataSource.getDataSource("insert_sy_course_relation",
                    {
                        id: getDataSource.getGUID(),
                        coursewareid: $stateParams.coursewareid,
                        sourceid: $scope.quest.id,
                        type: 3
                    }, function (data) { })
            }
            getDataSource.getDataSource("insert_sy_questionnaire", $scope.quest, function (data) {
                $scope.saveButtonDisabled = false;
                getDataSource.doArray("insert_sy_questionnaire_detail", $scope.quests, function (item) {
                    getDataSource.doArray("insert_sy_questionnaire_subject", answersArray, function (data1) {
                        $state.go("index.questionnaire_edit", { id: $scope.quest.id, coursewareid: $stateParams.coursewareid });
                        notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                });
            }, function (error) { $scope.saveButtonDisabled = false; });
        }
    }
    //删除一道问题
    $scope.deleteQuest = function (item) {
        $scope.quests.pop(item);
    }
    //删除一个问题的一个答案
    $scope.deleteAnswer = function (item) {
        $scope.nowanswers.answers.pop(item);
    }
    //新增一个问题
    $scope.addquest = function () {
        $scope.quests.push({
            sort: $scope.quests.length + 1,
            title: ""

        });
    }
    //新增一个问题的一个答案
    $scope.addanswer = function () {

        $scope.nowanswers.answers.push({
            order: $scope.answers.length + 1,
            title: ""
        });
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.saveAnswer = function () {
        //$scope.nowanswers.answers = $scope.answers;
        $scope.close();
    }
    //编辑一个问题的答案
    $scope.editDetail = function (item) {
        $scope.nowanswers = item;
        if (!$scope.nowanswers.answers) {
            $scope.nowanswers.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'quest_detail.html',
            size: 'lg',
            scope: $scope
        });
    }
}]);
angular.module("myApp")
.controller("questionnaire_edit_shareController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', '$stateParams', function ($scope, $rootScope, getDataSource, $state, notify, $modal, $stateParams) {
    $scope.quest = {};
    if ($stateParams.coursewareid=="") {
        $scope.quest.category = 1;
    }
    else {
        $scope.quest.category = 0;

    }
    $scope.quests = [];
    $scope.answers = [];
    $scope.load = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource(["selectquestionnaireById", "selectquestionnaire_detailById", "select_sy_questionnaire_detail_subjectById"]
                , { id: $stateParams.id }, function (data) {
                    //console.log(data);
                    $scope.quest = _.find(data, function (item) {
                        return item.name == "selectquestionnaireById";
                    }).data[0];
                    $scope.quests = _.find(data, function (item) {
                        return item.name == "selectquestionnaire_detailById";
                    }).data;
                    var answers = _.find(data, function (item) {
                        return item.name == "select_sy_questionnaire_detail_subjectById";
                    }).data;
                    angular.forEach($scope.quests, function (item) {
                        item.answers = [];
                        angular.forEach(answers, function (c) {
                            if (c.fid == item.id) {
                                item.answers.push(c);
                            }
                        });
                    })
                });
        }
    }
    $scope.load();
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
}]);
angular.module("myApp")
.controller("questionnaire_listController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', function ($scope, $rootScope, getDataSource, $state, notify, $modal) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '问卷名称', width: '54%', field: "title", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>', headerCellClass: 'mycenter' },
          { name: '问卷类型', width: '10%', field: "category", cellFilter: "questCategoryFilter", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '10%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '10%', field: "createtime", cellFilter: "date:'yyyy-MM-dd'", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '题目数', width: '10%', field: "questnum", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_questById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.goDetial = function (item) {
        $state.go("index.questionnaire_edit", { id: item.entity.id });
    }
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_questionnaire", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("questionnaire_list_shareController", ['$scope', '$rootScope', 'getDataSource', "$state", 'notify', '$modal', function ($scope, $rootScope, getDataSource, $state, notify, $modal) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '问卷名称', width: '54%', field: "title", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a></div>', headerCellClass: 'mycenter' },
          { name: '问卷类型', width: '10%', field: "category", cellFilter: "questCategoryFilter", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建人', width: '10%', field: "createuser", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '创建时间', width: '10%', field: "createtime", cellFilter: "date:'yyyy-MM-dd'", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '题目数', width: '10%', field: "questnum", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_questById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.goDetial = function (item) {
        $state.go("index.questionnaire_edit_share", { id: item.entity.id });
    }
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("select_sy_questionnaireByShare", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();
}]);
angular.module("myApp")
.controller("coursestatisticsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {


    getDataSource.getDataSource("getAllCourseCategory", { platformid: $rootScope.user.platformid },
        function (data) {
            $scope.categorylist = data;
            $scope.maincategorylist = _.filter(data, function (n) { return n.fid == 0 });
        }, function (error) { })

    $scope.selectCategory = function () {
        $scope.search.subcategory = "";
        $scope.subcategorylist = _.filter($scope.categorylist, function (n) { return n.fid == _.find($scope.maincategorylist, { "name": $scope.search.category }).id });
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "coursewarename", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', field: "teachersname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: "8%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.teachtime | date:"yyyy-MM-dd"}}</div>' },
          { name: '一级分类', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', field: "subcategory", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '排课次数', field: "classscheduling", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '点击次数', field: "clickcount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '学习次数', field: "studycount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '最后调用时间', field: "lastusetime", width: "10%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.lastusetime | date:"yyyy-MM-dd"}}</div>' }
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


    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getCoursewareReport", { platformid1: $rootScope.user.platformid, platformid2: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();


}]);
angular.module("myApp")
.controller("coursewareclickController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    var date = new Date();
    $scope.yearlist = [
         { year: date.getFullYear() - 1 },
         { year: date.getFullYear() },
         { year: date.getFullYear() + 1 }];

    $scope.search = {
        platformid: $rootScope.user.platformid,
        year: date.getFullYear(),
        month: date.getMonth() + 1
    };

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "coursewarename", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', field: "teachersname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: "8%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.teachtime | date:"yyyy-MM-dd"}}</div>' },
          { name: '一级分类', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', field: "subcategory", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '点击次数', field: "clickcount", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '最后调用时间', field: "lastusetime", width: "10%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.lastusetime | date:"yyyy-MM-dd"}}</div>' }
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


    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        if (paginationOptions.pageNumber == 1) {
            getDataSource.getDataSource("getCoursewareCategoryClickReport",
                {
                    platformid: $rootScope.user.platformid,
                    platformid1: $rootScope.user.platformid,
                    starttime: $scope.search.year.toString() + "-01",
                    endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
                }, function (data) {
                    //$scope.coursewareCategoryscheduling = data;
                    var xdata = new Array();
                    var ydata = new Array();
                    var clickcountTotal = 0;
                    angular.forEach(data, function (n) { clickcountTotal += n.clickcount });
                    for (var i = 0; i < data.length ; i++) {
                        xdata.push(data[i].category);
                        ydata.push(parseFloat((data[i].clickcount / parseFloat(clickcountTotal) * 100).toFixed(2)));
                    }
                    bindchart(xdata, ydata);
                }, function (error) { })
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getCoursewareClickReport",
            {
                platformid: $rootScope.user.platformid,
                platformid1: $rootScope.user.platformid,
                starttime: $scope.search.year.toString() + "-01",
                endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
            },
            { firstRow: firstRow, pageSize: pageSize }, null, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    //---------------

    var bindchart = function (xdata,ydata) {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '课程点击情况分析图'
            },
            xAxis: {
                categories: xdata,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{point.x}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: "一级分类",
                data: ydata
            }]
        });
    }



}]);
angular.module("myApp")
.controller("coursewareschedulingController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    var date = new Date();
    $scope.yearlist = [
         { year: date.getFullYear() - 1 },
         { year: date.getFullYear() },
         { year: date.getFullYear() + 1 }];

    $scope.search = {
        platformid: $rootScope.user.platformid,
        year: date.getFullYear(),
        month: date.getMonth() + 1
    };

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '课程名称', field: "coursewarename", width: '30%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课人', field: "teachersname", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '授课时间', field: "teachtime", width: "8%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.teachtime | date:"yyyy-MM-dd"}}</div>' },
          { name: '一级分类', field: "category", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', field: "subcategory", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '排课次数', field: "classscheduling", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '最后调用时间', field: "lastusetime", width: "10%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.lastusetime | date:"yyyy-MM-dd"}}</div>' }
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


    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        if (paginationOptions.pageNumber == 1) {
            getDataSource.getDataSource("getCoursewareCategoryschedulingReport",
                {
                    platformid: $rootScope.user.platformid,
                    starttime: $scope.search.year.toString() + "-01",
                    endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
                }, function (data) {
                    //$scope.coursewareCategoryscheduling = data;
                    var xdata = new Array();
                    var ydata = new Array();
                    var classschedulingTotal = 0;
                    angular.forEach(data, function (n) { classschedulingTotal += n.classscheduling });
                    for (var i = 0; i < data.length ; i++) {
                        xdata.push(data[i].category);
                        ydata.push(parseFloat((data[i].classscheduling / parseFloat(classschedulingTotal) * 100 ).toFixed(2)));
                    }
                    bindchart(xdata, ydata);
                }, function (error) { })
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getCoursewareschedulingReport",
            {
                platformid: $rootScope.user.platformid,
                starttime: $scope.search.year.toString() + "-01",
                endtime: $scope.search.year.toString() + "-" + ($scope.search.month < 10 ? "0" + $scope.search.month.toString() : $scope.search.month)
            },
            { firstRow: firstRow, pageSize: pageSize }, null, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();

    //---------------

    var bindchart = function (xdata,ydata) {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '课程排课情况分析图'
            },
            xAxis: {
                categories: xdata,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{point.x}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: "一级分类",
                data: ydata
            }]
        });
    }



}]);
angular.module("myApp")
.controller("studentstatisticsController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {


    getDataSource.getDataSource("getAllCourseCategory", { platformid: $rootScope.user.platformid },
        function (data) {
            $scope.categorylist = data;
            $scope.maincategorylist = _.filter(data, function (n) { return n.fid == 0 });
        }, function (error) { })

    $scope.selectCategory = function () {
        $scope.search.subcategory = "";
        $scope.subcategorylist = _.filter($scope.categorylist, function (n) { return n.fid == _.find($scope.maincategorylist, { "name": $scope.search.category }).id });
    }

    var date = new Date();
    $scope.yearlist = [
         { year: date.getFullYear() - 1 },
         { year: date.getFullYear() },
         { year: date.getFullYear() + 1}];

    $scope.search = {
        platformid: $rootScope.user.platformid,
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        category: 0,
        datacategory : 0
    };


    $scope.gridOptions = {
        useExternalPagination: false,
        useExternalSorting: true,
        enablePaginationControls: false,
        enableSorting: false,
        data: [],
        columnDefs: [
          { name: '职级/班级', field: "item", width: '25%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '总计', field: "itemcount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '报到', field: "signcount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '0%-20%', field: "level1", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '20%-40%', field: "level2", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '40%-60%', field: "level3", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '60%-80%', field: "level4", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '80%-100%', field: "level5", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '100%以上', field: "level6", width: '8%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '未报到', field: "unsigncount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '已结业', field: "graduatecount", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
        ],
    };


    $scope.goSearch = function () {
        //$scope.gridOptions.columnDefs[0].name = $scope.search.category == 0 ? "职级" : "班级";
        $scope.search.datacategory = 0;
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        getDataSource.getUrlData("../api/getStudentStatistics",
            $scope.search,
            function (data) {
                $scope.studentstatisticsData = data;
                $scope.gridOptions.data = $scope.studentstatisticsData;
            },
            function (error) { })
    }
    $scope.loadGrid();

    var getrate = function (a, b) {
        return  ((b == 0 || a == 0) ? 0 : (parseFloat(a) / parseFloat(b) * 100).toFixed(1)) + "%";
    }

    $scope.changeDataCategory = function (type) {
        if (type == 0) {
            $scope.gridOptions.data = $scope.studentstatisticsData;
        }
        else {
            var data = angular.copy($scope.studentstatisticsData);
            for (var i = 0; i < data.length ; i++) {
                data[i].level1 = getrate(data[i].level1, data[i].signcount);
                data[i].level2 = getrate(data[i].level2, data[i].signcount);
                data[i].level3 = getrate(data[i].level3, data[i].signcount);
                data[i].level4 = getrate(data[i].level4, data[i].signcount);
                data[i].level5 = getrate(data[i].level5, data[i].signcount);
                data[i].level6 = getrate(data[i].level6, data[i].signcount);
                data[i].unsigncount = getrate(data[i].unsigncount, data[i].itemcount);
                data[i].graduatecount = getrate(data[i].graduatecount, data[i].signcount);
                data[i].signcount = getrate(data[i].signcount, data[i].itemcount);
            }
            $scope.gridOptions.data = data;
        }
    }


}]);
app.controller("syroleController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', 'getDataSource'
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
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
			  { name: '角色名称', field: "name", width: '55%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
			  { name: '级别', field: "syslevel", width: '35%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'sysLevelFilter' }
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
			$state.go("index.roleedit", { id: row.entity.id });
		}
		$scope.search = {};

		$scope.loadGrid = function () {
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			var pageSize = paginationOptions.pageSize;
			var array = ["getRoleList"];
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
			$scope.loadGrid();
		}
}])
angular.module("myApp")
.controller("roleEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource) {
	$scope.roleForm = new Object();
	$scope.roleForm.name = '';
	$scope.roleForm.enable = false;
	$scope.roleForm.syslevel = false;
	$scope.roleForm.platform = new Object();//存放平台
	$scope.saveButtonDisabled = false;

	//如果是分平台，则不能修改角色所属平台。
	if ($rootScope.user.platformcategory == "0") {
		$scope.choosePlatform = true;
		$scope.chooseSysLevel = true;
	}
	
	var roleid = $stateParams.id;
	if (roleid!=undefined&& roleid != "") {
		//编辑，获取表单信息
		getDataSource.getDataSource("getSigleRole", { roleid: roleid }, function (data) {
			$scope.roleForm = data[0];
			$scope.roleForm.enable = (data[0].enable == 1) ? true : false;
			$scope.roleForm.syslevel = (data[0].syslevel == 1) ? true : false;
			var tempplatform = new Array();
			var length = data.length;
			var platobj = new Object();
			for (var i = 0; i < length; i++) {
				platobj = new Object();
				platobj.id = data[i].platformid;
				platobj.name = data[i].platformname;
			}
			$scope.roleForm.platform = platobj;

		}, function (errortemp) { });
	} else {
		var platobj = new Object();
		platobj.id = $rootScope.user.platformid;
		platobj.name = $rootScope.user.platformname;
		$scope.roleForm.platform = platobj;
	}
		//选择管理员
	getDataSource.getDataSource("selectAllPlatform", {}, function (data) {
		var tempplatform = new Array();
		var length = data.length;
		for (var i = 0; i < length; i++) {
			tempplatform.push({ id: data[i].id, name: data[i].name });
		}
		$scope.platforms = tempplatform;
	}, function (errortemp) { });

	$scope.goToList = function () {
		$state.go("index.role");
	}

	$scope.saveRole = function () {
		$scope.saveButtonDisabled = true;
		//console.log( $scope.roleForm);
		if ($scope.roleForm.name == "" || $scope.roleForm.name.length <= 0) {
			$scope.saveButtonDisabled = false;
			notify({ message: '角色名称不能为空', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			return;
		}

		getDataSource.getUrlData('../api/Permission/SaveRole', $scope.roleForm, function (datatemp) {
			$scope.saveButtonDisabled = false;
			if (datatemp.code == "success") {
				notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			} else {
				notify({ message: datatemp.message, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}
		}, function (errortemp) {
			$scope.saveButtonDisabled = false;
		});
	}

	getDataSource.getDataSource(["getAllPermission", "getAllPermissionGroup", "getRolePermission"], { roleid: roleid }, function (data) {
		var groupdata = _.find(data, { name: 'getAllPermissionGroup' }).data;
		var permissiondata = _.find(data, { name: 'getAllPermission' }).data;
		var rolePermission = _.find(data, { name: 'getRolePermission' }).data;
		var length = groupdata.length;
		var groupname = '';
		$scope.roleForm.permissionGroupList = new Array();
		for (var i = 0; i < length; i++) {
			groupname = groupdata[i].groupname;
			category = groupdata[i].category;
			var permissionTemp = _.filter(permissiondata, { groupname: groupname });
			var templength = permissionTemp.length;
			for (var j = 0; j < templength; j++) {
				var chkobj = _.find(rolePermission, { permissionid: permissionTemp[j].id });
				if (chkobj != null) {
					permissionTemp[j].selected = true;
				}
			}
			$scope.roleForm.permissionGroupList.push({ groupname: groupname,category:category, permissionArray: permissionTemp });
		}
	}, function (errortemp) { });
}]);
angular.module("myApp")
.controller("statisticsIndexController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    $scope.statisticsdata = {};
    $scope.loadData = function () {
        getDataSource.getDataSource("statistics-index", {
            platformid1: $rootScope.user.platformid,
            platformid2: $rootScope.user.platformid,
            platformid3: $rootScope.user.platformid,
            platformid4: $rootScope.user.platformid
        }, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.statisticsdata = data[0];
        });
    }
    $scope.loadData();
    setInterval(function () { $scope.loadData();}, 5000);
}]);






angular.module("myApp")
.controller("statisticsIndexroleController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {

    $scope.gridOptions = {
        data: [],
        columnDefs: [
          { name: "序号", field: "rownum", width: '6%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "平台", field: "name", width: '34%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "用户人数", field: "studentcount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "在线人数", field: "onlineusercount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "当前班次", field: "onlineclasscount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "历史班次", field: "historyclasscount", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
  
    $scope.loadIndexData = function () {
        getDataSource.getDataSource("statistics-platformindexall", {}, function (data) {
            $scope.gridOptions.data = data;
        });

        $scope.statisticsdata = {};
        getDataSource.getDataSource("statistics-indexall", {}, function (data) {
            if (data != null && data != undefined && data.length > 0)
                $scope.statisticsdata = data[0];
        });
    }
    $scope.loadIndexData();
    setInterval(function () { $scope.loadIndexData(); }, 10000);

}]);






angular.module("myApp")
.controller("scoreController", ["$scope", "$rootScope", "getDataSource", "$state", 'notify', function ($scope, $rootScope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };

    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        data: [],
        columnDefs: [
            { name: "序号", field: "rownum", width: '10%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "维度", field: "dimension", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: '加分项', field: "eventname", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.eventname}}</a></div>' },
			{ name: "分值", field: "score", width: '20%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "最高得分", field: "maxscore", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
			{ name: "限制类型", field: "limittype", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "limittypeFilters" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.loadSource = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("getDimensionConfigAll", { }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }

    $scope.loadSource();


    $scope.goSearch = function () {
        $scope.loadSource();
    }

    $scope.goDetial = function (row) {
        //console.log(row);
        $state.go("index.scoreEdit", { id: row.entity.id });
    }

    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("deleteDimensionConfigById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadSource();
        });
    }


}])






angular.module("myApp")
.controller("scoreEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.score = {};
        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("selectDimensionConfigById", { id: $stateParams.id }, function (data) {
                    $scope.score = data[0];
                });
            }
        }();

        $scope.addDisabled = false;
        $scope.save = function () {
        	$scope.addDisabled = true;
        	if ($scope.score.dimension == "" || $scope.score.dimension == undefined || $scope.score.dimension == null) {
        		notify({ message: '请选择维度名称！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        		$scope.addDisabled = false;
                return;
            }
            if ($scope.score.eventname == "" || $scope.score.eventname == undefined || $scope.score.eventname == null) {
            	notify({ message: '加分项不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.score == "" || $scope.score.score == undefined || $scope.score.score == null) {
            	notify({ message: '分值不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.limittype == "" || $scope.score.limittype == undefined || $scope.score.limittype == null) {
            	notify({ message: '请选择限制类型！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($scope.score.maxscore == "" || $scope.score.maxscore == undefined || $scope.score.maxscore == null) {
            	notify({ message: '最高得分不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.addDisabled = false;
                return;
            }
            if ($stateParams.id) {
                var msg = '保存成功';
                getDataSource.getDataSource("updateDimensionConfigById", $scope.score, function (data) {
                	$scope.addDisabled = false;
                    notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (error) { $scope.addDisabled = false; });
            }
            else {
                var scoreid = getDataSource.getGUID();
                $scope.score.id = scoreid;
                getDataSource.getDataSource("insertDimensionConfig", $scope.score, function (data) {
                	$scope.addDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.score", {});
                }, function (error) { $scope.addDisabled = false; });
            }
        }

        $scope.goToList = function () {
            $state.go("index.score");
        }

        $scope.inputKeyDown = function (e) {
            var ss = window.event || e;
            if (!((ss.keyCode > 47 && ss.keyCode < 58) || ss.keyCode == 8)) {
                ss.preventDefault();
            }
        }
    }]);
angular.module("myApp")
.controller("teacherEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.teacher = { photofilename: "", accountid: "", photoserverfilename: "" ,sex:-1};
        $scope.uploadFiles = function (files) {
            $scope.files = files;
        }
        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("selectTeacherById", { id: $stateParams.id }, function (data) {
                    $scope.teacher = data[0];
                    $scope.nowfile = FilesService.showFile("teacherPhoto", $scope.teacher.photo_servername, $scope.teacher.photo_servername);
                });
            }
        }();

        $scope.saveDisabled = false;
        $scope.save = function () {
        	$scope.saveDisabled = true;
        	if ($scope.files) {
                FilesService.upLoadPicture($scope.files[0], { upcategory: "teacherPhoto" ,width:500,height:300}, function (data) {
                    $scope.teacher.photo_servername = data.data[0].servername;
                    doSaveData();
                }, function (error) { $scope.saveDisabled = false; });
            }
            else {
                doSaveData();
            }


        }
        $scope.getFile = function () {
            if ($scope.teacher.photofilename != "") {
                //$scope.nowfile = FilesService.showFile("teacherPhoto", $scope.teacher.photoserverfilename, $scope.teacher.photofilename);

                //return FilesService.showFile("teacherPhoto", $scope.teacher.photoserverfilename, $scope.teacher.photofilename);
            }
        }
        var doSaveData = function () {
            if ($stateParams.id) {
            	getDataSource.getDataSource("updateTeacherById", $scope.teacher, function (data) {
            		$scope.saveDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	}, function (error) { $scope.saveDisabled = false; });
            }
            else {
                var newid = getDataSource.getGUID();
                $scope.teacher.id = newid;
                $scope.teacher.platformid = $rootScope.user.platformid;
                getDataSource.getDataSource("insertTeacher", $scope.teacher, function (data) {
                	notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                	$scope.saveDisabled = false;
                    $state.go("index.teacherEdit", { id: newid });
                }, function (error) { $scope.saveDisabled = false; });
            }
        }

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null
        };
        $scope.search = {};
        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 100],
            paginationPageSize: 25,
            useExternalPagination: true,
            useExternalSorting: true,
            data: [],
            columnDefs: [
              { name: '序号', field: "rownum", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              //{ name: '课程名称', field: "name", width: '45%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
             { name: '课程名称', field: "name", width: '45%', cellClass: "mycenter", headerCellClass: 'mycenter' },
             { name: '授课人', field: "teachersname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '授课时间', field: "teachtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
              { name: '状态', field: "mainstatus", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "mainStatusFilters" }
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



        $scope.loadGrid = function () {
            var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
            var pageSize = paginationOptions.pageSize;

            var key = "selectTeacherCourseware";
            getDataSource.getList(key, { platformid: $rootScope.user.platformid, teacherid: $stateParams.id }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
                $scope.gridOptions.totalItems = data[0].allRowCount;
                $scope.gridOptions.data = data[0].data;
            });
        }
        $scope.loadGrid();
    }]);
angular.module("myApp")
.controller("teacherListController", ["$rootScope", "$scope", "getDataSource", "$state", "notify", function ($rootScope, $scope, getDataSource, $state, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {}
    //检索
    $scope.goSearch = function () {
        $scope.loadGrid();
    }

    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', width: '6%', field: "rownum", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '教师姓名', width: '15%', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>', cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '性别', width: '10%', field: "sexshowvalue", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "专业方向", width: '15%', field: "subject", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "最高学历", width: '11%', field: "education", cellFilter: "educationFilter", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "职称", width: '15%', field: "position", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "单位", width: '20%', field: "company", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: "关联课程数", width: '6%', field: "scount", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        getDataSource.doArray("delete_sy_TeacherById", selectRows, function (data) {
            notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            $scope.loadGrid();
        });
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        getDataSource.getList("selectAllTeacher", { platformid: $rootScope.user.platformid }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;
        });
    }
    $scope.loadGrid();

    $scope.goDetial = function (row) {
        //console.log(row);
        $state.go("index.teacherEdit", { id: row.entity.id });
    }
}]);
app.controller('IeTest1Ctrl', ['$rootScope', '$http', '$scope', '$timeout', '$state', '$stateParams'
, function ($rootScope, $http, $scope, $timeout, $state, $stateParams) {
	$scope.datalist = new Array();
	$scope.showtable = false;    
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			//$scope.datalist.push({ id:i, name: "test_" + btnname + "_1wsss_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
	    //var list = [];
	    //console.log(Date.now());
		$scope.datalist = new Array();
		//for (var i = 0; i < 1000/2; i++) {
		//    list.push({ id: i, name: btnname, sex: "男", age: "20" });
		//}
		$http.get("../testJSON/json1.json").success(function (data) {
		    $scope.datalist = data;
		})
		//$scope.datalist = list;
	}
	$scope.goSQL = function () {
	    $state.go("getSQL");
	};
	$scope.Change = function () {
		$scope.showtable = !$scope.showtable;
	}
	$scope.open1k('Btn1_');
	$scope.HrefTo = function (statename) {
		//console.log(statename);
		$state.go(statename)
	}
}])
app.controller('IeTest2Ctrl', ['$rootScope', '$http', '$scope', '$timeout', '$state', '$stateParams'
, function ($rootScope, $http, $scope, $timeout, $state, $stateParams) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ id: i, name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000 / 2; i++) {
			$scope.datalist.push({ id: i, name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k('Btn2_'); 
	$scope.HrefTo = function (statename) {
		//console.log(statename);
		$state.go(statename)
	}
}])
app.controller('IeTest3Ctrl', ['$rootScope', '$http', '$scope', '$timeout'
, function ($rootScope, $http, $scope, $timeout) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
}])

app.controller('IeTest4Ctrl', ['$rootScope', '$http', '$scope', '$timeout'
, function ($rootScope, $http, $scope, $timeout) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
}])

app.controller('IeTest5Ctrl', ['$rootScope', '$http', '$scope', '$timeout'
, function ($rootScope, $http, $scope, $timeout) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
}])

app.controller('IeTest6Ctrl', ['$rootScope', '$http', '$scope', '$timeout'
, function ($rootScope, $http, $scope, $timeout) {
	$scope.datalist = new Array();
	$scope.open1w = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 10000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1w_" + i, sex: "男", age: "20" });
		}
	}
	$scope.open1k = function (btnname) {
		$scope.datalist = new Array();
		for (var i = 0; i < 1000; i++) {
			$scope.datalist.push({ name: "test_" + btnname + "_1k_" + i, sex: "男", age: "20" });
		}
	}
}])

app.controller("testfileuploadController", ['$scope', '$rootScope', 'Upload', 'FilesService', 'Base64', function ($scope, $rootScope, Upload, FilesService, Base64) {
    $scope.files = [];
    $scope.doclick = function () {
        $("#myfile").click();
    }
    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.img1 = files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    }
    $scope.doUpload = function () {
        FilesService.upLoadFiles($scope.myfiles, "userPhoto");
    }
    $scope.down = function () {
        //FilesService.downFiles("userPhoto", "a5986d8c-1409-4af3-b2ec-9c082b3c7da9.sql", "a5986d8c-1409-4af3-b2ec-9c082b3c7da9.sql");
        FilesService.downFiles("userPhoto", "cccc.png", "cccc.png");
    }
    //$scope.img = "../api/uploadfile/userPhoto/" + Base64.encode("cccc.png") + "/" + Base64.encode("ccccddddd.png");

}])
angular.module("myApp")
.controller("totalvistorController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, notify, getDataSource, DateService, CommonService) {
		//日志统计图
		var categoryArray = [];
		var seriesData = [];
		var array = ["getlogchartdata"];
		$scope.search = {};
		getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid}
				, null
				, null, null, { connectionKey: "LogConnectionString" }
				, function (data) {
					//console.log(data);
			var length = data.length;
			var seriesdata = new Object();
			seriesdata.name = "访问";
			seriesdata.data = [];
			for (var i = 0; i < length; i++) {
				categoryArray.push(data[i].itemname);
				seriesdata.data.push(data[i].totalnum);
			}
			seriesData.push(seriesdata);
			$scope.chartOnlineUserConfig = {
				options: { chart: { type: 'bar' } },
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 80,
					floating: true,
					borderWidth: 1,
					backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
					shadow: true
				},
				xAxis: {
					categories: categoryArray, title: {
						text: null
					}
				},
				yAxis: {
					min: 0,
					title: { text: '访问人次', align: 'high' },
					labels: {
						overflow: 'justify'
					}
				},
				series: seriesData,
				title: { text: '访问统计' },
				tooltip: { valueSuffix: ' 人次' },
				credits: { enabled: false },
				loading: false,
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true
						}
					}
				}
			};
		}, function (error) {
			//console.log(error);
		});
}]);
app.controller("departusertreeController"
	, ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', "$modal", 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, $modal, notify, getDataSource, DateService, CommonService) {

		$scope.my_data = new Array();
		$scope.my_tree = tree = {};

		//分平台分类数据获取
		$scope.loadDepartTree = function () {
			getDataSource.getDataSource(["selectDepartRoot","selectDepartAll"], { platformid: $rootScope.user.platformid }, function (data) {
				var allplatform = _.find(data, { name: "selectDepartAll" });
				var rootform = _.find(data, { name: "selectDepartRoot" }).data[0];
				var root = new Object();
				root.label = rootform.name;
				root.rowid = rootform.id;
				root.children = new Array();

				drawChild(root, allplatform, rootform);
				$scope.my_data.push(root);
				$scope.doing_async = false;
				tree.expand_all();
			}, function (errortemp) {

			});
		}

		$scope.try_async_load = function () {
			$scope.my_data = new Array();
			$scope.doing_async = true;
			$scope.loadDepartTree();
		};

		$scope.try_async_load();

		//$scope.my_tree_handler = function (branch) {
		//	$scope.output = "";
		//	$scope.loadCourseCategoryParent(branch);
		//}

		function drawChild(root, datatemp, fobj) {
			var tempobj = { label: fobj.name, rowid: fobj.id, children: [], isedit: fobj.category };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			if (length > 0) {
				for (var i = 0; i < length; i++) {
					drawChild(tempobj, datatemp, childlist[i]);
				}
			}
			root.children.push(tempobj);
		}
}]);
angular.module("myApp")
.controller("userEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "$validation"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, $validation) {
		$scope.accForm = {
			submit: function () {
				//$scope.saveSyUser();
			}
		};
		$scope.initForm = function (clearidcard,clearpwd) {
			$scope.accForm.rolelist = new Array();
			$scope.accForm.name = '';
			$scope.accForm.sex = 0;
			$scope.accForm.logname = '';
			$scope.accForm.lognameDisabled = false;
			$scope.accForm.pwdDisabled = false;
			$scope.accForm.idcardDisabled = false;
			$scope.accForm.nameDisabled = false;
			if (clearpwd) {
				$scope.accForm.pwd = '';
				$scope.pwd = '';
			}
			$scope.accForm.cellphone = '';
			if (clearidcard) {
				$scope.accForm.idcard = '';
			}
			$scope.accForm.syuserid = '';
			$scope.accForm.status = 0;
			$scope.accForm.checkstatus = false;
			//$scope.accForm.defaultusertype = 0;
			$scope.accForm.accisnew = true;
			$scope.accForm.syuserisnew = true;
		}
		$scope.initForm(true,true);
		var initPwd = '******';

		$scope.goToList = function () {
			$state.go("index.userlist");
		}

		var syuserid = $stateParams.id;

		//先加载下拉框内容
		getDataSource.getDataSource("getRoleList", { platformid: $rootScope.user.platformid }, function (data) {
			var roletemp = new Object();
			var rolearray = new Array();
			var length = data.length;
			for (var i = 0; i < length; i++) {
				roletemp = new Object();
				roletemp.id = data[i].id;
				roletemp.name = data[i].name;
				roletemp.platformid = data[i].platformid;
				//roletemp.platformname = data[i].platformname;
				rolearray.push(roletemp);
			}
			$scope.roles = rolearray;
			//
			if (syuserid) {
				$scope.accForm.syuserisnew = false;
				$scope.accForm.syuserid = syuserid;
				getDataSource.getDataSource(["getSyUserByAccId", "getAccountRoleByUserId"], { syuserid: syuserid, platformid: $rootScope.user.platformid }, function (data) {
					$scope.accForm = _.find(data, { name: "getSyUserByAccId" }).data[0];
					$scope.pwd = initPwd;
					$scope.accForm.pwd = initPwd;
					$scope.accForm.checkstatus = $scope.accForm.status == 1;
					$scope.accForm.accisnew = false;
					$scope.accForm.syuserisnew = false;
					var accroles = _.find(data, { name: "getAccountRoleByUserId" }).data;
					var roles = _.filter(accroles, { syuserid: syuserid });

					//设置不可用
					$scope.accForm.lognameDisabled = true;
					//$scope.accForm.pwdDisabled = true;
					$scope.accForm.nameDisabled = true;
					$scope.accForm.idcardDisabled = true;

					var roletemp = new Object();
					var rolearray = new Array();
					var length = roles.length;
					for (var i = 0; i < length; i++) {
						roletemp = new Object();
						roletemp.id = roles[i].id;
						roletemp.name = roles[i].name;
						roletemp.platformid = roles[i].platformid;
						//roletemp.platformname = roles[i].platformname;
						rolearray.push(roletemp);
					}
					$scope.accForm.rolelist = rolearray;

				}, function (errortemp) { });
			} else {
				$scope.accForm.syuserisnew = true;
				$scope.accForm.lognameDisabled = false;
				$scope.accForm.pwdDisabled = false;
			}
		}, function (errortemp) { });

		$scope.idcardInvalidClearMsg = function () {
			$scope.inValidIdCardMessage = "";
		}
		$scope.remoteCheckIdCard = function (bol) {
			$scope.inValidIdCardMessage = '';
			if ($scope.accForm.idcard.length <= 0) {
				return;
			}
			if (!bol) {
				getDataSource.getDataSource(["getAccountInfoByIdCard", "getAccountRoleByIdcard"],
					{ idcard: $scope.accForm.idcard }, function (datatemp) {
						var accArray = _.find(datatemp, { name: "getAccountInfoByIdCard" }).data;
						var roles = _.find(datatemp, { name: "getAccountRoleByIdcard" }).data;
						if (accArray.length > 0) {
							var accdata = accArray[0];
							$scope.accForm.name = accdata.name;
							$scope.accForm.sex = accdata.sex;
							$scope.accForm.logname = accdata.logname;
							$scope.accForm.pwd = initPwd;
							$scope.pwd = initPwd;
							$scope.accForm.cellphone = accdata.cellphone;
							$scope.accForm.defaultusertype = accdata.defaultusertype;
							//$scope.accForm.idcard = '';
							//$scope.accForm.syuserid = '';
							$scope.accForm.status = 0;
							$scope.accForm.checkstatus = false;
							$scope.accForm.accountid = accdata.id;
							$scope.accForm.accisnew = false;
							//设置不可用
							$scope.accForm.lognameDisabled = true;
							//$scope.accForm.pwdDisabled = true;
							$scope.accForm.nameDisabled = true;

							var rolearray = new Array();
							var length = roles.length;
							for (var i = 0; i < length; i++) {
								roletemp = new Object();
								roletemp.id = roles[i].id;
								roletemp.platformid = roles[i].platformid;
								roletemp.name = roles[i].name;
								rolearray.push(roletemp);
							}
							$scope.accForm.rolelist = rolearray;
						} else {
							$scope.initForm(false,true);
						}
					}, function (errortemp) {});
			}
		}

		//检查账号
		$scope.remoteCheckLogname = function (bol) {
			$scope.lognameInvalidMsg = '';
			if ($scope.accForm.logname == undefined || $scope.accForm.logname.length < 6 || $scope.accForm.logname.length > 18) {
				return;
			}
			if (!bol) {
				getDataSource.getDataSource(["getAccountByLogname"], { formlogname: $scope.accForm.logname }, function (datatemp) {
					if (datatemp.length > 0) {
						$scope.lognameInvalidMsg = "该账号已经被使用。";
					} else {
						$scope.lognameInvalidMsg = "";
					}
				}, function (errortemp) {

				});
			}
		}
		$scope.lognameInvalidMsgClear = function () {
			$scope.lognameInvalidMsg = "";
		}

		$scope.saveButtonDisabled = false;

		$scope.saveSyUser = function () {
			$scope.saveButtonDisabled = true;
			var submitForm = $scope.accForm;
			if ($scope.pwd != initPwd) {
				submitForm.pwd = md5($scope.pwd);
			}
			//console.log("submitForm", submitForm);
			//return;
			getDataSource.getUrlData('../api/account/SaveSyUser', submitForm, function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.code == "success") {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$state.go("index.useredit", { id: datatemp.id});
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		}
	}
]);
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
angular.module("myApp")
.controller("trainlistController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "DateService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, DateService) {

    var start = new Date().getFullYear() - 5;
    var end = new Date().getFullYear();
    $scope.yearArr = [];
    for (var i = start; i <= end; i++) {
        $scope.yearArr.push(i);
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.search = {};
    var inityear = new Date().getFullYear();
    $timeout(function () {
        $scope.search.year = inityear;
        var mid = $rootScope.user.mdepartmentId;
        if ($rootScope.user.usertype == 2) {
            mid = $rootScope.user.departmentId;
        }
        $scope.search.departmentid = mid;
    	$scope.loadGrid();
    }, 500);
      
    //检索
    $scope.goSearch = function () {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.loadGrid();
    }
     
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        columnDefs: [
           { name: '培训名称', width: '30%', field: "title", cellClass: "mycenter", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goAudit(row)">{{row.entity.title}}</a>' },
           { name: '姓名', width: '10%', field: "name", headerCellClass: 'mycenter' },
          { name: '组织机构', width: '20%', field: "departmentname", headerCellClass: 'mycenter' },        
          { name: '一级分类', width: '10%', field: "categoryone", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '二级分类', width: '10%', field: "categorytwo", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '三级分类', width: '10%', field: "categorythree", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '四级分类', width: '10%', field: "categoryfour", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '申报年份', width: '10%', field: "year", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '拟报学时', width: '10%', field: "studytime", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '状态', width: '10%', field: "status", cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: 'trainStatuFilters' }
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
     
    $scope.goAudit = function (row) {
        //$scope.rowentity = row;
        $scope.train = row.entity;
        $scope.modalInstance = $modal.open({
            templateUrl: 'audit.html',
            size: 'lg',
            scope: $scope
        });
    }
    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }

    $scope.saveDisabled = false;
    $scope.goSubmitAudia = function (n, sta) {
    	var parameter = { status: sta, id: n.id, remark: n.remark };
    	if (parameter.remark == null || parameter.remark == '') {
    		notify({ message: '请输入审核意见', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		return;
    	}
        $scope.saveDisabled = true;
        getDataSource.getDataSource("submitrain", parameter, function (data) {
            if (data[0] && data[0].crow > 0) {
                notify({ message: '操作成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });          
                //$scope.rowentity.entity.status = sta;
                //$scope.rowentity.entity.remark = n.remark;
                $scope.train.status = sta;
                $scope.train.remark = n.remark;
                $scope.close();
                $scope.loadGrid();
            }
            $scope.saveDisabled = false;
        }, function (error) { });

    }


    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;

        var array = ["back_gettrain"];
        getDataSource.getList(array, $scope.search, { firstRow: firstRow, pageSize: pageSize }, {}, paginationOptions.sort
            , function (data) {
                $scope.gridOptions.totalItems = data[0].allRowCount;
                $scope.gridOptions.data = data[0].data; 
            }, function (error) {
                var e = error;
            });
        
    }


    $scope.delete = function () {
        var selectRows = $scope.gridApi.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray(["delete_sy_train"], selectRows, function (data) {
                $scope.loadGrid();
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }
    

}]);
angular.module("myApp")
.controller("userfeedbackController", ["$scope", "$rootScope", "getDataSource", "$state", "$modal", 'notify', 'CommonService', function ($scope, $rootScope, getDataSource, $state, $modal, notify) {
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: [{
            "sort": {
                "priority": 0,
                "direction": "desc"
            },
            "name": "createtime"
        }]
    };

    //打开反馈明细窗口
    $scope.goDetial = function (row) {
        $scope.feedback = row;
        $scope.modalInstance = $modal.open({
            templateUrl: 'feedbackDetail.html',
            size: 'lg',
            scope: $scope
        });
    }


    //关闭模式窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.search = {};
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        data: [],
        columnDefs: [
          { name: '序号', field: "rownum", width: "6%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '标题', field: "title", width: "24%", headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.title}}</a>' },
          { name: '内容', field: "content", width: "50%", headerCellClass: 'mycenter' },
          { name: '反馈人', field: "username", width: "10%", cellClass: "mycenter", headerCellClass: 'mycenter' },
          { name: '反馈时间', field: "createtime", width: "10%", cellClass: "mycenter", headerCellClass: 'mycenter' }
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
    $scope.goSearch = function () {
        $scope.loadGrid();
    }
    $scope.loadGrid = function () {
        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        var pageSize = paginationOptions.pageSize;
        //console.log($scope.search);
        getDataSource.getList("get_sy_user_feedback", {}, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
            $scope.gridOptions.totalItems = data[0].allRowCount;
            $scope.gridOptions.data = data[0].data;

        });
    }
    $scope.loadGrid();
}]);