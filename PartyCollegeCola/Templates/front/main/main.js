app.controller("mainController", ['$scope', '$rootScope', '$state', '$http', '$location', '$document', 'getDataSource', 'DateService', 'SessionService', 'FilesService'
	, function ($scope, $rootScope, $state, $http, $location, $document, getDataSource, DateService, SessionService, FilesService) {

	    $scope.defaultUserPhoto = "../img/default_img.png";

	    $scope.userHeadphoto = FilesService.getUserPhoto();
	    $scope.departmentname = $rootScope.user.departmentName;
	    $scope.yearplanStudytimeRate = 0;
	    $scope.userReportData = {
	        id: '',
	        userid: '',
	        classcount: 0,
	        waitcoursecount: 0,
	        finishedcoursecount: 0,
	        totalstudytime: 0,
	        electivestudytime: 0
	    };
	    var parameter= { studentid: $rootScope.user.studentId,year: new Date().getFullYear() };
	    getDataSource.getDataSource("getUserReportByUserId", parameter,
            function (data) {
                if (data && data.length > 0) {
                    $scope.userReportData = data[0];
                    $scope.showYeaplan = false;
                    var totalstudytime = $scope.userReportData.totalstudytime;
                    if ($rootScope.user.yearplan && $rootScope.user.yearplan.departmentname != "") {
                    	$scope.departmentname = $rootScope.user.yearplan.departmentname;

                        var yearplanstudytime = $rootScope.user.yearplan.studytime;
                        if (yearplanstudytime != "无") {
                            $scope.showYeaplan = true;
                            $scope.yearplanStudytimeRate = $scope.userReportData.yearplan_progess;
                        }
                    }
                } else {
                    $scope.userReportData.classcount = 0; 
                    $scope.userReportData.finishedcoursecount = 0; 
                    $scope.userReportData.totalstudytime = 0;
                }
                setTimeout(function () {
                    var radObj = $('#indicatorContainer').data('radialIndicator');
                    radObj.animate($scope.yearplanStudytimeRate);
                }, 300);

            }, function (error) { })

        
	    $rootScope.confirmOptions = {
	        message: "提示",
	        isOpened: false,
	        open: function () {
	            this.isOpened = true;
	        },
	        closed: function () {
	            this.isOpened = false;
	        }
	    };

	    //弧形进度条
	    $(function () {
	        $('#indicatorContainer').radialIndicator({
	            barColor: '#84d849',
	            barWidth: 5,
	            initValue: 100,
	            roundCorner: true,
	            percentage: true,
	            displayNumber: false,
	            radius: 50
	        });
	    });


	    var path = $location.$$path;
	    var pArr = path.split("/");
	    var currentView = pArr[pArr.length - 1];
	    for (var i = 0; i < $rootScope.mainConfig.length; i++) {
	        var n = $rootScope.mainConfig[i];
	        n.select = false;
	        for (var a = 0; a < n.childMenus.length ; a++) {
	            if (path.indexOf(n.childMenus[a]) >= 0) {
	                n.select = true;
	                break;
	            }
	        }
	    }

	    //选项卡
	    $scope.aClick = function (ename) {

	        _.find($rootScope.mainConfig, { 'select': true }).select = false;;
	        _.find($rootScope.mainConfig, { 'elementName': ename }).select = true;

	    };

	    $rootScope.loadingOptions = {
	        message: "正在处理中,请稍候",
	        isOpened: false
	    };

	    //$scope.settotal = function () {
             
	    //    var p = {};
	    //    p.departmentid = $rootScope.user.departmentId;
	    //    p.studentid = $rootScope.user.studentId;
	    //    p.accountid = $rootScope.user.accountId;
	    //    p.rank = $rootScope.user.yearplan.rank;
	    //    return;
	    //    getDataSource.getUrlData("../api/gettotal", p, function (data) {
	    //        alert(JSON.stringify(data));
	    //    }, function (errortemp) { });
	    //}(); 
	    //console.log($rootScope.user); 
	}])