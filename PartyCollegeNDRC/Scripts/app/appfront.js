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
    var backRootUrl = '../Templates/back';
    var frontRootUrl = '../Templates/front';
    var mainRootUrl = '../Templates/main';
    var publicRootUrl = '../Templates/public';
    $stateProvider
        .state("main", {
            url: '/main',
            resolve: {
                SetSession: function (SessionService) {
                    return SessionService.CheckSession(platformcode, function (data) {
                        
                    });
                },
                GetConfig: function (SessionService) {
                    return SessionService.GetConfig();
                }
            },
            cache: false,
            templateUrl: frontRootUrl + "/main/main.html",
            controller: 'mainController'
        })
        .state("main.myclasslist", {
            url: '/myclasslist',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.myclasslist": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.myclasslist": {
                    templateUrl: frontRootUrl + "/mystudy/myclasslist.html",
                    controller: 'myclasslistController'
                }
            }
        })
		.state("main.myoptioncourse", {
			url: '/myoptioncourse',
			cache: false,
			views: {
				"contentView": {
					templateUrl: frontRootUrl + "/mystudy/container.html",
					controller: 'containerController'
				},
				"menuView@main.myoptioncourse": {
					templateUrl: frontRootUrl + "/mystudy/menu.html",
					controller: 'menuController'
				},
				"rightView@main.myoptioncourse": {
					templateUrl: frontRootUrl + "/mystudy/myoptioncourse.html",
					controller: 'myoptioncourseController'
				}
			}
		})
        .state("main.recentlearning", {
            url: '/recentlearning',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.recentlearning": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.recentlearning": {
                    templateUrl: frontRootUrl + "/mystudy/recentlearning.html",
                    controller: 'recentlearningController'
                }
            }
        })
		.state("main.myrequirecourse", {
			url: '/myrequirecourse',
			cache: false,
			views: {
				"contentView": {
					templateUrl: frontRootUrl + "/mystudy/container.html",
					controller: 'containerController'
				},
				"menuView@main.myrequirecourse": {
					templateUrl: frontRootUrl + "/mystudy/menu.html",
					controller: 'menuController'
				},
				"rightView@main.myrequirecourse": {
					templateUrl: frontRootUrl + "/mystudy/myrequirecourse.html",
					controller: 'myrequirecourseController'
				}
			}
		})
        .state("main.myclass", {
            url: '/myclass',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.myclass": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.myclass": {
                    templateUrl: frontRootUrl + "/mystudy/myclass.html",
                    controller: 'myclassController'
                }
            }
        })
        .state("main.allcourse", {
            url: '/allcourse/{param}',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.allcourse": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.allcourse": {
                    templateUrl: frontRootUrl + "/mystudy/coursewarelist.html",
                    controller: 'allCourseController'
                }
            }
        })
        .state("main.mystudy", {
            url: '/mystudy',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.mystudy": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.mystudy": {
                    templateUrl: frontRootUrl + "/mystudy/mystudy.html",
                    controller: 'mystudyController'
                }
            }
        })
        .state("main.studycenter", {
            url: '/studycenter',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.studycenter": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.studycenter": {
                    templateUrl: frontRootUrl + "/mystudy/studycenter.html",
                    controller: 'studyCenterController'
                }
            }
        }).state("main.courseinfo", {
            url: '/courseinfo/{id}',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.courseinfo": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.courseinfo": {
                    templateUrl: frontRootUrl + "/mystudy/courseinfo.html",
                    controller: 'courseinfoController'
                }
            }
        }).state("main.usercenter", {
            url: '/usercenter',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/usercenter/usercenter.html",
                    controller: 'usercenterController'
                },
                "userCenterMenu@main.usercenter": {
                    templateUrl: frontRootUrl + "/usercenter/usercentermenu.html"
                },
                "userCenterView@main.usercenter": {
                    templateUrl: frontRootUrl + "/usercenter/userinfo.html",
                    controller: 'userinfoController'
                }
            }
        }) 
        .state("main.studytotal", {
            url: '/studytotal/{no}',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.studytotal": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.studytotal": {
                    templateUrl: frontRootUrl + "/mystudy/studytotal.html",
                    controller: 'studytotalController'
                }
            }
        })
         .state("main.archives", {
             url: '/archives',
             cache: false,
             views: {
                 "contentView": {
                     templateUrl: frontRootUrl + "/mystudy/container.html",
                     controller: 'containerController'
                 },
                 "menuView@main.archives": {
                     templateUrl: frontRootUrl + "/mystudy/menu.html",
                     controller: 'menuController'
                 },
                 "rightView@main.archives": {
                     templateUrl: frontRootUrl + "/mystudy/archives.html",
                     controller: 'archivesController'
                 }
             }
         })

        .state("main.train1", {
            url: '/train',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.train1": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.train1": {
                    templateUrl: frontRootUrl + "/mystudy/train.html",
                    controller: 'trainController'
                }
            }
        }).state("main.train2", {
            url: '/train/{id}',
            cache: false,
            views: {
                "contentView": {
                    templateUrl: frontRootUrl + "/mystudy/container.html",
                    controller: 'containerController'
                },
                "menuView@main.train2": {
                    templateUrl: frontRootUrl + "/mystudy/menu.html",
                    controller: 'menuController'
                },
                "rightView@main.train2": {
                    templateUrl: frontRootUrl + "/mystudy/train.html",
                    controller: 'trainController'
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
		    $rootScope.urlState = "indexfront." + $rootScope.$state.name;
		}
	);({bookType:0})

	$rootScope.myStudyLinks = [
         { id: "1045", title: "最近学习", sref: "main.recentlearning", icon: "tubiaoicon-45", isSelected: false, isShow: true, childMenus: ["recentlearning"] },
         { id: "1005", title: "我的必修课", sref: "main.myrequirecourse", icon: "tubiaoicon-53", isSelected: false, isShow: true, childMenus: ["myrequirecourse"] },
         { id: "1001", title: "我的选修课", sref: "main.studycenter", icon: "tubiaoicon-10", isSelected: false, isShow: true, childMenus: ["studycenter"] },
         { id: "1002", title: "所有课程", sref: "main.allcourse({param:0})", icon: "tubiaoicon-33", isSelected: false, isShow: true, childMenus: ["allcourse", "courseinfo"] },
         //{ id: "1003", title: "所有课程", sref: "main.allcourse({param:0})", icon: "tubiaoicon-33", isSelected: false, isShow: true, childMenus: ["allcourse", "courseinfo"] },
         
         //{ id: "1008", title: "我的学习班", sref: "main.myclasslist", icon: "tubiaoicon-51", isSelected: false, isShow: true, childMenus: ["myclasslist", "myclass"] },
         //{ id: "1009", title: "选修课程", sref: "main.myoptioncourse", icon: "tubiaoicon-50", isSelected: false, isShow: true, childMenus: ["myoptioncourse", "myclass"] },
         //{ id: "1004", title: "面授培训", sref: "main.studytotal({no:3})", icon: "tubiaoicon-52", isSelected: false, isShow: true, childMenus: ["studytotal", "train"] },

         { id: "1007", title: "学习档案", sref: "main.studytotal({no:0})", icon: "tubiaoicon-52", isSelected: false, isShow: true, childMenus: ["archives", "studytotal", "train"] }
    ];

    $rootScope.userCenterLinks = [
         { id: "3001", title: "个人信息", sref: "main.usercenter", icon: "tubiaoicon-19", isSelected: true, isShow: true, childMenus: ["usercenter"] }//,
         //{ id: "3002", title: "学习档案", sref: "main.studyrecord", icon: "tubiaoicon-20", isSelected: false, isShow: true, childMenus: ["studyrecord"] },
         //{ id: "3003", title: "我的文章", sref: "main.myarticle", icon: "tubiaoicon-21", isSelected: false, isShow: true, childMenus: ["myarticle"] },
         //{ id: "3004", title: "我的问题", sref: "main.myproblem", icon: "tubiaoicon-22", isSelected: false, isShow: true, childMenus: ["myproblem"] },
         //{ id: "3005", title: "我的订单", sref: "#", icon: "tubiaoicon-23", isSelected: false, isShow: false },
         //{ id: "3006", title: "历史记录", sref: "main.myhistory", icon: "tubiaoicon-24", isSelected: false, isShow: true, childMenus: ["myhistory"] }
    ];

    //学员中心，一级tab配置
    $rootScope.mainConfig = [
            { elementName: "mystudy", childMenus: ["studycenter", "myclasslist", "allcourse", "mystudy", "studytotal", "train", "archives"], "select": true },
            { elementName: "usercenter", childMenus: ["usercenter"], "select": false }
    ];

}]);
