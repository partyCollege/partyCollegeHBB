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