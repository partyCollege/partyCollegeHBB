/****
*	处理首页的逻辑
*/
var app = angular.module('myApp', [
    'ui.bootstrap',
    //'ngAnimate',
    //'ngSanitize',
    'ui.router',
    //'pasvaz.bindonce',
    'app.public.commonServices',
	'ngFileUpload',
    'ngGrid',
    //'ui.scroll',
    //'ui.scroll.jqlite',
    //"ui.select",
    "app.directive",
    "app.filters",
    "cgNotify",
	'validation',
	'validation.rule',
    'me-lazyimg'
]);
var platformcode = "html";
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5mode = true;
    var backRootUrl = '../Templates/back';
    var frontRootUrl = '../Templates/front';
    var mainRootUrl = '../Templates/main';
    var publicRootUrl = '../Templates/public';
    $stateProvider
        .state("main", {
            url: '/main',
            cache: false,
            resolve: {
            	SetSession: ["SessionService",function (SessionService) {
                    return SessionService.CheckSession(platformcode, function (data) {

                    });
            	}],
            	GetConfig: ["SessionService",function (SessionService) {
                    return SessionService.GetConfig();
            	}]
            },
            templateUrl: mainRootUrl + "/main/main.html",
            controller: 'mainController'
        })

		.state("main.index", {
		    url: '/index',
		    cache: false,
		    views: {
		        "contentView": {
		            templateUrl: mainRootUrl + "/index/index.html",
		            controller: 'indexController'
		        }
		    }
		})
		.state("main.newslist", {
		    url: '/newslist/:type',
		    cache: false,
		    views: {
		        "contentView": {
		            templateUrl: mainRootUrl + "/news/inforList.html",
		            controller: 'inforListController'
		        }
		    }
		})

		.state("main.search", {
		    url: '/search/:keywords',
		    cache: false,
		    views: {
		        "contentView": {
		            templateUrl: mainRootUrl + "/news/search.html",
		            controller: 'searchController'
		        }
		    }
		})
		.state("main.news", {
		    url: '/news/:id',
		    cache: false,
		    views: {
		        "contentView": {
		            templateUrl: mainRootUrl + "/news/inforInfo.html",
		            controller: 'inforInfoController'
		        }
		    }
		})
    	.state("main.booklist", {
    	    url: '/booklist',
    	    cache: false,
    	    views: {
    	        "contentView": {
    	            templateUrl: mainRootUrl + "/book/booklist.html",
    	            controller: 'bookListController'
    	        }
    	    }
    	})

    	.state("main.bookInfo", {
    	    url: '/bookInfo/:id',
    	    cache: false,
    	    views: {
    	        "contentView": {
    	            templateUrl: mainRootUrl + "/book/bookInfo.html",
    	            controller: 'bookInfoController'
    	        }
    	    }
    	})

    	.state("main.help", {
    	    url: '/help',
    	    cache: false,
    	    views: {
    	        "contentView": {
    	            templateUrl: mainRootUrl + "/help/help.html",
    	            controller: 'helpController'
    	        }
    	    }
    	})

    	.state("main.download", {
    	    url: '/download',
    	    cache: false,
    	    views: {
    	        "contentView": {
    	            templateUrl: mainRootUrl + "/download/download.html",
    	            controller: 'downloadController'
    	        }
    	    }
    	})


    ;
    $urlRouterProvider.otherwise('/main/index');
}]);
app.run(['$http', "$state", '$rootScope', 'SessionService', function ($http, $state, $rootScope, SessionService) {

    $rootScope.$on('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams) {
		    $rootScope.$state = toState;
		    $rootScope.urlState = "index." + $rootScope.$state.name;
		}
	);
    //一级tab配置
    $rootScope.mainConfig = [
            { "title": "首页", "rounteName": "main.index","routeparam":null, "elementName": "index", "childMenus": ["index"], "select": true },
            { "title": "课程", "rounteName": "main.allcourse", "routeparam": null, "elementName": "allcourse", "childMenus": ["allcourse"], "select": false },
            //{ "title": "教材推荐", "rounteName": "main.booklist","routeparam":null, "elementName": "booklist", "childMenus": ["booklist", "bookInfo"], "select": false },
			{ "title": "通知公告", "rounteName": "main.newslist", "routeparam": { "type": "2" }, "elementName": "notice", "childMenus": ["notice"], "select": false },
			 { "title": "帮助中心", "rounteName": "main.help", "routeparam": null, "elementName": "help", "childMenus": ["help"], "select": false },
			{ "title": "推荐浏览器", "rounteName": "main.download", "routeparam": null, "elementName": "download", "childMenus": ["download"], "select": false }
			//{ "title": "最新动态", "rounteName": "main.newslist", "routeparam": { "type": "3" }, "elementName": "newinfo", "childMenus": ["newinfo"], "select": false },
			//{ "title": "政策法规", "rounteName": "main.newslist", "routeparam": { "type": "4" }, "elementName": "lowinfo", "childMenus": ["lowinfo"], "select": false }
    ];
}]);