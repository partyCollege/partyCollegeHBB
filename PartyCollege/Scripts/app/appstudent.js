/****
*	处理前台的逻辑
*/
var app = angular.module('myApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'pasvaz.bindonce',
    'app.public.commonServices',
    'ngFileUpload',
    'ngGrid',
    'ui.scroll',
    'ui.scroll.jqlite',
    "ui.select",
    "app.directive",
    "app.filters",
    "cgNotify",
	'validation',
	'summernote',
	'validation.rule'
]);
var platformcode = "html";
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5mode = true;
    
    var studentRootUrl = '../Templates/student';

    $stateProvider
        .state("main", {
            url: '/main',
            resolve: {
                GetConfig: function (SessionService) {
                    return SessionService.GetConfig();
                }
            },
            cache: false,
            templateUrl: studentRootUrl + "/login/main.html",
            controller: 'mainController'            
        })
		.state("main.login", {
		    url: '/login', 
		    views: {
		        "contentView": {
		            templateUrl: studentRootUrl + "/login/login.html",
		            controller: 'loginController'
		        }
		    }
		})
    ;
    $urlRouterProvider.otherwise('/main/login'); 
}]);
app.run(['$http', '$rootScope', "SessionService", function ($http, $rootScope, SessionService) {
    
     
}]);
