var app = angular.module('myApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'pasvaz.bindonce',
    'app.public.commonServices',
    'ngGrid',
    'ui.scroll',
    'ui.scroll.jqlite',
    "ui.select",
    "app.directive",
    "app.filters",
    "angularFileUpload"
]);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5mode = true;
    var backRootUrl = '../Templates/back';
    var frontRootUrl = '../Templates/back';
    var publicRootUrl = '../Templates/back';
    $stateProvider
		.state('test1', {
		    url: '/',

		    templateUrl: backRootUrl + "/test/test1.html",
		    controller: 'IeTest1Ctrl'
		})
		.state('test2', {
		    url: '/test2',

		    templateUrl: backRootUrl + "/test/test2.html",
		    controller: 'IeTest2Ctrl'
		})
		.state('test3', {
		    url: '/test3',

		    templateUrl: backRootUrl + "/test/test3.html",
		    controller: 'IeTest3Ctrl'
		})
		.state('test4', {
		    url: '/test4',

		    templateUrl: backRootUrl + "/test/test4.html",
		    controller: 'IeTest4Ctrl'
		})
    	.state('getSQL', {
    	    url: '/getSQL',

    	    templateUrl: backRootUrl + "/getSQL/getSQL.html",
    	    controller: 'getSQLController'
    	})
		.state('login', {
		    url: '/login',

		    templateUrl: backRootUrl + "/login/login.html",
		    controller: 'loginController'
		})
        .state("main", {
            url: '/main',

            templateUrl: backRootUrl + "/main/main.html",
            controller: 'mainController'
        })
        .state("main.testfileupload", {
            url: '/content',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: backRootUrl + "/testfileupload/testfileupload.html",
                    controller: 'testfileuploadController'
                }
            }
        })
        .state("main.content", {
            url: '/content',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: backRootUrl + "/content/content.html",
                    controller: 'contentController'
                }
            }
        })
    ;
    $urlRouterProvider.otherwise('/');
}]);
app.run(['$http', '$rootScope', function ($http, $rootScope) {
    $http.get("../config/appConfig.json").then(function (data) {
        $rootScope.appConfig = data.data;
    });
}]);