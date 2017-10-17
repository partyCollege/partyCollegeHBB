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

	////获取职级数据
    //$scope.getLevelArr = function () {
    //	if (!$scope.levelArr) {
    //		getDataSource.getUrlData("../api/getsycodes", { categorys: "职级" }, function (data) {
    //			$scope.levelArr = _.find(data, { type: "职级" }).list;
    //		}, function (errortemp) { });
    //	}
    //}

    //$scope.getLevelArr();

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
            { name: "类别", headerCellClass: "text-center", field: "departmentname" },
            { name: "状态", headerCellClass: "text-center", field: "status" },
            //{ name: "注册状态", headerCellClass: "text-center", field: "signstatus" },
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