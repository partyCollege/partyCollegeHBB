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
    "ui.bootstrap",
    "ui.bootstrap.rating",
    "ng.ueditor",
    "cgNotify",
	"pdf"
]);
var platformcode = "html";
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5mode = true;
    var backRootUrl = '../Templates/back';
    var frontRootUrl = '../Templates/front';
    var mainRootUrl = '../Templates/main';
    var publicRootUrl = '../Templates/public';
    var videoRootUrl = '../Templates';
	$stateProvider
		 .state("beforevideo", {
		 	url: '/beforevideo/:coursewareid',
		 	cache: false,
		 	templateUrl: videoRootUrl + "/videoCourse/beforevideo.html",
		 	controller: 'beforevideoController'
		 })
        .state("videoCourse", {
            url: '/videoCourse/:coursewareid',
            cache: false,
            resolve: {
                SetSession: function (SessionService) {
                	return SessionService.CheckSession(platformcode, function (data) {
                    });
                },
                GetConfig: function (SessionService) {
                    return SessionService.GetConfig();
                }
            },
            views: {
                "": {
                    templateUrl: videoRootUrl + "/videoCourse/videoCourse.html",
                    controller: 'videoCouresController'
                },
                "videoView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/video.html",
                    controller: 'videoController'
                },
                "pptplayView@videoCourse": {
                	templateUrl: videoRootUrl + "/videoCourse/pptplay.html",
                	controller: 'pptplayController'
                },
                "coursewareCommentView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/coursewareComment.html",
                    //controller: 'coursewareCommentController'
                },
                "questionView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/question.html",
                    controller: 'questionController'
                },
                "myQuestionView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/myQuestion.html",
                    //controller: 'questionController'
                },
                "questionsView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/questions.html",
                    //controller: 'questionController'
                },
                "feelLearnView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/feelLearn.html",
                    controller: 'feelLearnController'
                },
                "examinationView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/examination.html",
                    controller: 'examinationController'
                },
                "noteView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/coursewarenote.html",
                    controller: 'coursewarenoteController'
                },
                "appraisetView@videoCourse": {
                    templateUrl: videoRootUrl + "/videoCourse/courseAppraise.html",
                    controller: 'courseAppraiseController'
                }
            }
        })
		.state("testvideo", {
			url: '/testvideo',
			cache: false,
			templateUrl: videoRootUrl + "/videoCourse/testvideo.html",
			controller: 'testvideoController'
		})
        .state("videoCourseType", {
            url: '/videoCourse/:type/:classcourseid/:coursewareid',
            cache: false,
            resolve: {
                SetSession: function (SessionService) {
                	return SessionService.CheckSession(platformcode, function (data) {
                    });
                },
                GetConfig: function (SessionService) {
                    return SessionService.GetConfig();
                }
            },
            views: {
                "": {
                    templateUrl: videoRootUrl + "/videoCourse/videoCourse.html",
                    controller: 'videoCouresController'
                },
                "videoView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/video.html",
                    controller: 'videoController'
                },
                "coursewareCommentView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/coursewareComment.html",
                    //controller: 'coursewareCommentController'
                },
                "questionView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/question.html",
                    controller: 'questionController'
                },
                "myQuestionView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/myQuestion.html",
                    //controller: 'questionController'
                },
                "questionsView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/questions.html",
                    //controller: 'questionController'
                },
                "feelLearnView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/feelLearn.html",
                    controller: 'feelLearnController'
                },
                "examinationView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/examination.html",
                    controller: 'examinationController'
                },
                "noteView@videoCourseType": {
                    templateUrl: videoRootUrl + "/videoCourse/coursewarenote.html",
                    controller: 'coursewarenoteController'
                }
            }
        })
    ;
    $urlRouterProvider.otherwise('/');
}]);
app.run(['$http', '$rootScope', "SessionService", function ($http, $rootScope, SessionService) {
    $rootScope.$on('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams) {
			$rootScope.$state = toState;
			$rootScope.urlState = "indexvideo." + $rootScope.$state.name;
		}
	);


    //视频播放页面，页面tab配置
    $rootScope.videoConfig = {
        "mainConfig": [
            { "elementName": "coursewareCommentView", "show": true, "select": true },
            { "elementName": "questionnaireView", "show": false, "select": false },
            { "elementName": "questionsView", "show": false, "select": false },
            { "elementName": "feelLearnsView", "show": false, "select": false },
            { "elementName": "noteView", "show": false, "select": false },
            { "elementName": "examinationView", "show": false, "select": false },
            { "elementName": "videoView", "show": false, "select": false },
			{ "elementName": "pptplayView", "show": false, "select": false },
            { "elementName": "appraisetView", "show": false, "select": false }
        ],
        "questionConfig": [
            { "elementName": "myQuestionView", "show": true, "select": true },
            { "elementName": "questionsView", "show": false, "select": false }
        ],
        "feelLearnConfig": [
            { "elementName": "myfeelLearnView", "show": true, "select": true },
            { "elementName": "feelLearnsView", "show": false, "select": false }
        ],
        "questionCount": 0,
        "coursewarenoteCount": 0
    };
}]);
