var app = angular.module('myApp', [
    'ui.bootstrap',
    'ui.router',
    'pasvaz.bindonce',
    'app.public.commonServices',
    'ngGrid',
    'ui.scroll',
    'ui.scroll.jqlite',
    "ui.select",
    "app.directive"
]);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5mode = true;
    var backRootUrl = '../Templates/grant';
    var frontRootUrl = '../Templates/grant';
    var publicRootUrl = '../Templates/grant';
    $stateProvider

        .state("grantList", {
            url: '/grantList',
            templateUrl: backRootUrl + "/grantList.html",
            controller: 'grantListController'
        })
        .state("editForm", {
            url: '/editForm/{id}',
            templateUrl: backRootUrl + "/editForm.html",
            controller: 'editFormController'
        })
        .state("grantuser", {
            url: '/grantuser/{id}',
            templateUrl: backRootUrl + "/grantuser.html",
            controller: 'grantuserController'
        })

    ;
    $urlRouterProvider.otherwise('/grantList');
}]);
app.run(['$http', '$rootScope', function ($http, $rootScope) {
    $http.get("../config/appConfig.json").then(function (data) {
        $rootScope.appConfig = data.data;
        $rootScope.appConfig.localSQL = false;
    });
}]);
app.controller("grantListController", function ($scope, $state, getDataSource, $utilityService) {
    //$utilityService.seti18n($scope,"zh-cn");
    $scope.gonew = function () {
        $state.go("editForm", { id: "" });
    }
    $scope.pagingOptions = {
        pageSizes: [20, 50, 100],
        pageSize: 20,
        currentPage: 1
    };
    getDataSource.getDataSource("selectAllCourseGrant", {}, function (data) {
        //console.log(data);
        $scope.data1 = data;
    })
    $scope.gridOptions = {
        data: 'data1',
        jqueryUITheme: true,
        i18n: 'zh-cn',
        enableCellSelection: false,
        enablePaging: true,
        showFooter: true,
        enablePinning: false,
        columnDefs: [
                { field: "name", displayName: '课程名称', pinned: true, cellTemplate: '<a ng-click="goCourse(row)" style="text-decoration:underline;">{{row.entity[col.field]}}</a>' },
                { field: "teacher", displayName: "授课人", width: 120 },
                { field: "coursetime", displayName: "授课时间", width: 300, cellFilter: "date:'yyyy-MM-dd'" },
                { field: "status", displayName: "授权状态", width: 100 },
                { field: "fkstatus", displayName: "付款状态", width: 100 },
                { field: "authstime", displayName: "授权时间", width: 100, cellFilter: "date:'yyyy-MM-dd'" }

        ],
        pagingOptions: $scope.pagingOptions,
    };
    $scope.goCourse = function (row) {
        $state.go("editForm", { id: row.entity.id });
    }
});
app.controller("grantuserController", function ($scope, $rootScope, getDataSource, $stateParams) {
    $scope.width = document.body.clientWidth;
    $scope.form = {};
    $scope.form.hasDraw = false;
    $(function () {
        $scope.imageBoard = new DrawingBoard.Board('zbeubeu', {
            controls: false,
            color: '#000',
            webStorage: false
        });
        $scope.imageBoard.ev.bind('board:drawing', function () {
            $scope.form.hasDraw = true;
            $("#btn_tj").removeAttr("disabled");
        });
    });

    getDataSource.getDataSource("selectCourseGrant", { id: $stateParams.id }, function (data) {

        $scope.form = data[0];
        if (data[0].authstime) {
            $scope.form.step = 3;
        }
        else {
            $scope.form.step = 1;
        }
    })
    $scope.gonext = function () {
        $scope.form.step = 2;

    }
    $scope.doSave = function () {
        var img = $scope.imageBoard.getImg();
        getDataSource.getDataSource("updateGrantImg", { id: $stateParams.id, img: img,authstime:new Date() }, function (data) {
            $scope.form.step = 3;
        });
    }
    $scope.doReset = function () {
        //var img = $scope.imageBoard.getImg();
        //console.log(img);
        $scope.imageBoard.reset({
            color: true,
            size: true,
            webStorage: true,
            history: true,
            background: true
        });
        $("#btn_tj").attr("disabled","disabled");
    }
});
app.controller("editFormController", function ($rootScope, $http, $scope, getDataSource, $stateParams, $state, $filter) {
    $rootScope.appConfig.localSQL = false;
    $scope.form = {};
    $scope.loadData = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource("selectCourseGrant", { id: $stateParams.id }, function (data) {
                $scope.form = data[0];
                //var dddd = $filter('date')($scope.form.authstime, 'yyyy-MM-dd');
                $scope.form.codeimg = "../authImg/" + $scope.form.id + ".jpg";
            });
        }
    }();
    $scope.save = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource("updateCourseGrant", $scope.form, function (data) {
                alert("保存成功");
            });
        }
        else {
            $scope.form.id = getDataSource.getGUID();
            $scope.form.status = "待通知";
            getDataSource.getDataSource("insertCourseGrant", $scope.form, function () {
                var q = $http.get("../api/makeQRCODE/" + $scope.form.id);
                q.then(function () {
                    $scope.form.codeimg = "../authImg/" + $scope.form.id + ".jpg";
                    $state.go("editForm", { id: $scope.form.id });
                });
            });

        }
    }
    $scope.tz = function () {
        $scope.form.status = '待授权';
        getDataSource.getDataSource("updateCourseGrantStatus", { id: $scope.form.id, status: "待授权" }, function (data) {
            alert("保存成功");
        });
    }
    $scope.fk = function () {
        $scope.form.fkstatus = "已付款";
        getDataSource.getDataSource("updateCourseGrantFkStatus", {fkstatus:"已付款",id:$scope.form.id}, function (data) {
            alert("保存成功");
        });
    }
    
    //var guid= getDataSource.getGUID();
})
