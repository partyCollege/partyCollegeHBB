angular.module("myApp")
.controller("classeditController", ['$previousState', '$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$filter', "$window", '$timeout', function ($previousState, $rootScope, $scope, getDataSource, $state, $stateParams, notify, $filter, $window, $timeout) {
    $scope.class = {
        categoryone: "组织调训",
        categorytwo: "业务培训",
        categorythree: "网络培训",
        categoryfour: "境内培训",
        starttime: new Date(),
        endtime: new Date(),
        signupstatus: 0,
        studentlimit: 99999,

    };
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

        if ($scope.class.departmentid == '1000000') {
            $scope.saveButtonDisabled = false;
            notify({ message: '请选择类别', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        
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
            }, function () {
                $scope.saveButtonDisabled = false;
                notify({ message: '保存失败', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        }
    }
}]);