/**
 * INSPINIA - Responsive Admin Theme
 *
 */

var app = angular.module('myApp', [
	'ui.router',                    // Routing
	'oc.lazyLoad',                  // ocLazyLoad
	'ui.bootstrap',                 // Ui Bootstrap
	'pascalprecht.translate',       // Angular Translate
	'ngIdle',                       // Idle timer
	'ngSanitize',                    // ngSanitize
	'ngFileUpload',
	'app.public.commonServices',     //通用Service
	'app.filters',//通用过滤器
	'app.directive',
	'ui.grid',
	'ui.grid.exporter',
	'ui.grid.selection',
    'ui.grid.autoResize',
	'ui.select',
	'ui.grid.pagination',
	'summernote',
	'cgNotify',//提醒控件
	'ui.router.tabs',
	'validation',
	'validation.rule',
    'rt.debounce',//防抖输入
    'ngImgCrop',
	'angularBootstrapNavTree',
     'ct.ui.router.extras.sticky',
     'ct.ui.router.extras.dsr',
     'ct.ui.router.extras.previous',
     'ct.ui.router.extras.statevis',
	 'multi-select-tree',
	 'highcharts-ng',
	 'ng.ueditor'
]);

angular
    .module('myApp')
    .config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider, $stickyStateProvider) {
        IdleProvider.idle(5); // in seconds
        IdleProvider.timeout(120); // in seconds
        var backTemplates = '../Templates/back/';
        var inspiniajs = "../bower_components/inspinia-angular-master/js/plugins/";

        $urlRouterProvider.otherwise("/index/main");
        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });
        $stateProvider
            .state('index', {
                abstract: true,
                url: "/index",
                cache: true,
                resolve: {
                	SetSession: function (SessionService, CommonService) {
                		return SessionService.CheckSession("", function (data) {
                        });
                    },
                    GetConfig: function (SessionService) {
                        return SessionService.GetConfig();
                    }
                },
                controller: "indexController",
                templateUrl: backTemplates + "index/index.html",
            })
			.state("index.main", {
				url: "/main",
				templateUrl: backTemplates + "main/main.html",
				controller: "mainController"
			})
            .state("index.testfileupload", {
                url: "/testfileupload",
                templateUrl: backTemplates + "testfileupload/testfileupload.html",
                controller: "testfileuploadController"
            })
            .state("index.content", {
                url: "/content",
                templateUrl: backTemplates + "content/content.html",
                controller: "contentController"
            })
            .state("index.news", {
                url: "/news",
                templateUrl: backTemplates + "news/news.html",
                controller: "newsController"
            })
            .state("index.newsEdit", {
                url: "/newsEdit/{id}",
                templateUrl: backTemplates + "news/newsEdit.html",
                controller: "newsEditController"
            })
            .state("index.score", {
                url: "/score",
                templateUrl: backTemplates + "score/score.html",
                controller: "scoreController"
            })
            .state("index.scoreEdit", {
                url: "/scoreEdit/{id}",
                templateUrl: backTemplates + "score/scoreEdit.html",
                controller: "scoreEditController"
            })
            .state("index.questionnaire", {
                url: "/questionnaire",
                templateUrl: backTemplates + "questionnaire/questionnaire.html",
                controller: "questionnaireController"
            })
            .state("index.questionnaire.questionnaire_list", {
                url: "/questionnaire_list",
                templateUrl: backTemplates + "questionnaire/questionnaire_list.html",
                controller: "questionnaire_listController"
            })
            .state("index.questionnaire.questionnaire_list_share", {
                url: "/questionnaire_list_share",
                templateUrl: backTemplates + "questionnaire/questionnaire_list_share.html",
                controller: "questionnaire_list_shareController"
            })
            .state("index.questionnaire_edit", {
                url: "/questionnaire_edit/{id}/{coursewareid}",
                templateUrl: backTemplates + "questionnaire/questionnaire_edit.html",
                controller: "questionnaire_editController"
            })
            .state("index.questionnaire_edit_share", {
                url: "/questionnaire_edit_share/{id}/{coursewareid}",
                templateUrl: backTemplates + "questionnaire/questionnaire_edit_share.html",
                controller: "questionnaire_edit_shareController"
            })
            .state("index.courseware", {
                url: "/courseware",
                templateUrl: backTemplates + "courseware/courseware.html",
                controller: "coursewareController"
            })
            .state("index.coursewareEdit", {
                url: "/coursewareEdit/:id/:type",
                templateUrl: backTemplates + "coursewareEdit/coursewareEdit.html",
                controller: "coursewareEditController"
            })
			.state("index.account", {
			    url: "/account",
			    templateUrl: backTemplates + "account/account.html",
			    controller: "accountController"
			})
			.state("index.accountedit", {
			    url: "/accountedit/:id",
			    templateUrl: backTemplates + "account/accountedit.html",
			    controller: "accountEditController"
			})
			.state("index.userlist", {
			    url: "/userlist",
			    templateUrl: backTemplates + "user/userlist.html",
			    controller: "userListController"
			})
			.state("index.useredit", {
			    url: "/useredit/{id}",
			    templateUrl: backTemplates + "user/useredit.html",
			    controller: "userEditController"
			})
			.state("index.role", {
			    url: "/role",
			    templateUrl: backTemplates + "role/syrole.html",
			    controller: "syroleController"
			})
			.state("index.roleedit", {
			    url: "/roleedit/{id}",
			    templateUrl: backTemplates + "roleedit/roleedit.html",
			    controller: "roleEditController"
			})
            .state("index.platformEdit", {
                url: "/platformEdit/{id}",
                templateUrl: backTemplates + "platform/platformEdit.html",
                controller: "platformEditController"
            })
			
			.state("index.platformEdit.courselist", {
				url: "/courselist/{type}",
				templateUrl: backTemplates + "platform/platformcourselist.html",
				controller: "platformCourseListController"
			})
			.state("index.platformEdit.teacherlist", {
				url: "/teacherlist/{type}",
				templateUrl: backTemplates + "platform/platformteacherlist.html",
				controller: "platformTeacherListController"
			})
			.state("index.platformEdit.permissionlist", {
				url: "/permissionlist/{type}",
				templateUrl: backTemplates + "platform/platformpermissionlist.html",
				controller: "platformPermissionController"
			})
			.state("index.platformEdit.microvideolist", {
				url: "/microvideolist/{type}",
				templateUrl: backTemplates + "platform/platformmicrovideolist.html",
				controller: "platformMicroVideoController"
			})
            .state("index.platformList", {
                url: "/platformList",
                templateUrl: backTemplates + "platform/platformList.html",
                controller: "platformListController"
            })
            .state("index.teacherList", {
                url: "/teacherList",
                templateUrl: backTemplates + "teacher/teacherList.html",
                controller: "teacherListController"
            })
            .state("index.teacherEdit", {
                url: "/teacherEdit/{id}",
                templateUrl: backTemplates + "teacher/teacherEdit.html",
                controller: "teacherEditController"
            })
            .state("index.microVideo", {
                url: "/microVideo",
                templateUrl: backTemplates + "microVideo/microVideo.html",
                controller: "microVideoController"
            })
            .state("index.microVideoEdit", {
                url: "/microVideoEdit/{id}",
                templateUrl: backTemplates + "microVideo/microVideoEdit.html",
                controller: "microVideoEditController"
            })
			.state("index.permission", {
			    url: "/permission",
			    templateUrl: backTemplates + "permission/permission.html",
			    controller: "permissionController"
			})
			.state("index.permissionEdit", {
			    url: "/permissionEdit/{id}",
			    templateUrl: backTemplates + "permission/permissionEdit.html",
			    controller: "permissionEditController"
			})
			.state("index.classlist", {
			    url: "/classlist",
			    templateUrl: backTemplates + "classmanager/classlist.html",
			    controller: "classlistController"
			})
        	.state("index.classedit", {
        	    url: "/classedit/{id}",
        	    templateUrl: backTemplates + "classmanager/classedit.html",
        	    controller: "classeditController"
        	})
        	.state("index.classedit.bxk", {
        	    url: "/bxk/:type",
        	    controller: "classCourseController",
        	    templateUrl: backTemplates + "classmanager/courseList.html",
        	})
            .state("index.classedit.xxk", {
                url: "/xxk/:type",
                controller: "classCourseController",
                templateUrl: backTemplates + "classmanager/courseList.html",
            })
            .state("index.classedit.aljx", {
                url: "/aljx/:type",
                controller: "classCourseController",
                templateUrl: backTemplates + "classmanager/courseList.html",
            })
            .state("index.classedit.khjz", {
                url: "/khjz",
                controller: "classAssessmentController",
                templateUrl: backTemplates + "classmanager/khjz.html",
            })
            .state("index.classedit.student", {
                url: "/student",
                controller: "classStudentController",
                templateUrl: backTemplates + "classmanager/studentlist.html",
            })
            .state("index.classedit.import", {
                url: "/importstudent",
                controller: "importstudentController",
                templateUrl: backTemplates + "classmanager/importstudent.html",
            })
            .state("index.import", {
                url: "/import/{id}",
                controller: "importstudentController",
                templateUrl: backTemplates + "classmanager/importstudent.html",
            })
            .state("index.classedit.classattach", {
                url: "/classattach",
                controller: "classAttachController",
                templateUrl: backTemplates + "classmanager/classattach.html",
            })

            .state("index.classedit.blackboard", {
                url: "/blackboard",
                controller: "blackboardController",
                templateUrl: backTemplates + "classmanager/blackboard.html",
            })
			.state("index.studynote", {
			    url: "/studynote",
			    templateUrl: backTemplates + "mainflatform/studynote.html",
			    controller: "studynoteController"
			})
			.state("index.studynoteedit", {
			    url: "/studynoteedit/:id",
			    templateUrl: backTemplates + "mainflatform/studynoteedit.html",
			    controller: "studynoteEditController"
			})
			.state("index.senseoflearning", {
			    url: "/senseoflearning",
			    templateUrl: backTemplates + "mainflatform/senseoflearning.html",
			    controller: "senseoflearningController"
			})
	        .state("index.senselearningedit", {
	            url: "/senselearningedit/:id",
	            templateUrl: backTemplates + "mainflatform/senselearningedit.html",
	            controller: "senselearningEditController"
	        })
        	.state("index.unit", {
        	    url: "/unit/{id}",
        	    templateUrl: backTemplates + "classmanager/unit.html",
        	    controller: "unitController"
        	})
            .state("index.unitEdit", {
                url: "/unitEdit/{id}",
                templateUrl: backTemplates + "classmanager/unitEdit.html",
                controller: "unitEditController"
            })
            .state("index.unitEdit.studentlist", {
                url: "/student",
                controller: "classStudentController",
                templateUrl: backTemplates + "classmanager/studentlist.html",
            })
            .state("index.liveList", {
                url: "/liveList/{id}",
                templateUrl: backTemplates + "live/liveList.html",
                controller: "liveListController"
            })
            .state("index.liveEdit", {
                url: "/liveEdit/{id}",
                templateUrl: backTemplates + "live/liveEdit.html",
                controller: "liveEditController"
            })
			.state("index.liveEdit.liverange", {
				url: "/liverange",
				templateUrl: backTemplates + "live/liverange.html",
				controller: "platformLiveRelationController"
			})
            .state("index.cardList", {
                url: "/cardList/{id}",
                templateUrl: backTemplates + "alumnus/cardList.html",
                controller: "cardListController"
            })
            .state("index.cardEdit", {
                url: "/cardEdit/{id}",
                templateUrl: backTemplates + "alumnus/cardEdit.html",
                controller: "cardEditController"
            })
            .state("index.renewlog", {
                url: "/renewlog",
                templateUrl: backTemplates + "alumnus/renewlog.html",
                controller: "renewlogController"
            })
           .state("index.alumnusUserlist", {
               url: "/alumnusUserlist",
               templateUrl: backTemplates + "alumnus/alumnusUserlist.html",
               controller: "alumnusUserlistController"
           })
            .state("index.alumnusUserEdit", {
                url: "/alumnusUserEdit/{id}",
                templateUrl: backTemplates + "alumnus/alumnusUserEdit.html",
                controller: "alumnusUserEditController"
            })
            .state("index.alumnusUserAdd", {
                url: "/alumnusUserAdd/{id}",
                templateUrl: backTemplates + "alumnus/alumnusUserAdd.html",
                controller: "alumnusUserAddController"
            })
            .state("index.alumnusCourseware", {
                url: "/alumnusCourseware",
                templateUrl: backTemplates + "alumnus/alumnusCourseware.html",
                controller: "alumnusCoursewareController"
            })
            .state("index.selectCourseware", {
                url: "/selectCourseware",
                templateUrl: backTemplates + "alumnus/selectCourseware.html",
                controller: "selectCoursewareController"
            })
			.state("index.querylog", {
			    url: "/querylog",
			    templateUrl: backTemplates + "querylog/querylog.html",
			    controller: "querylogController"
			})
            .state("index.statisticsindex", {
                url: "/statisticsindex",
                templateUrl: backTemplates + "statistics/index.html",
                controller: "statisticsIndexController"
            })
            .state("index.statisticsindexrole", {
                url: "/statisticsindexrole",
                templateUrl: backTemplates + "statistics/indexrole.html",
                controller: "statisticsIndexroleController"
            })
           .state("index.coursewarelist", {
               url: "/coursewarelist/{type}",
               templateUrl: backTemplates + "courseware/coursewarelist.html",
               controller: "coursewarelistController"
           })
        	.state("index.question", {
        	    url: "/question",
        	    templateUrl: backTemplates + "question/question.html",
        	    controller: "questionController"
        	})
        	.state("index.question.noanswered", {
        	    url: "/noanswered",
        	    controller: "noansweredController",
        	    templateUrl: backTemplates + "question/noanswered.html",
        	})
        	.state("index.question.answered", {
        	    url: "/answered",
        	    controller: "answeredController",
        	    templateUrl: backTemplates + "question/answered.html",
        	})
        	.state("index.question.shield", {
        	    url: "/shield",
        	    controller: "shieldController",
        	    templateUrl: backTemplates + "question/shield.html",
        	})
        	.state("index.questionDetail", {
        	    url: "/questionDetail/{id}",
        	    controller: "questionDetailController",
        	    templateUrl: backTemplates + "question/questionDetail.html",
        	})
            .state("index.courseEdit", {
                url: "/courseEdit/{id}/{type}",
                controller: "courseEditController",
                templateUrl: backTemplates + "courseware/courseEdit.html",
            })
			.state("index.userfeedback", {
			    url: "/userfeedback",
			    templateUrl: backTemplates + "userfeedback/userfeedback.html",
			    controller: "userfeedbackController"
			})
		.state("index.coursewarecategory", {
			url: "/coursewarecategory",
			templateUrl: backTemplates + "courseware/coursewarecategory.html",
			controller: "coursewarecategoryController"
		})
        .state("index.coursewarecategoryedit", {
        	url: "/coursewarecategoryedit/{id}",
        	templateUrl: backTemplates + "courseware/coursewarecategoryedit.html",
        	controller: "coursewarecategoryeditController"
        })
		.state("index.booklist", {
            url: "/booklist",
            templateUrl: backTemplates + "book/booklist.html",
            controller: "booklistController"
        }).state("index.addbook", {
            url: "/addbook",
            templateUrl: backTemplates + "book/addbook.html",
            controller: "addbookController"
        }).state("index.addbookparameter", {
            url: "/addbook/{id}",
            templateUrl: backTemplates + "book/addbook.html",
            controller: "addbookController"
        })
		.state("index.pushmessage", {
			url: "/pushmessage/{id}",
			templateUrl: backTemplates + "pushmessage/pushmessage.html",
			controller: "pushmessageController"
		})
		.state("index.pushmessagelist", {
			url: "/pushmessagelist/{id}",
			templateUrl: backTemplates + "pushmessagelist/pushmessagelist.html",
			controller: "pushmessagelistController"
		})
		.state("index.pushmessageEdit", {
			url: "/pushmessageEdit/{id}",
			templateUrl: backTemplates + "pushmessagelist/pushmessageEdit.html",
			controller: "pushmessageEditController"
		})
        .state("index.totalvistor", {
        	url: "/totalvistor",
        	templateUrl: backTemplates + "totalvistor/totalvistor.html",
        	controller: "totalvistorController"
        })
		.state("index.logconfig", {
			url: "/logconfig",
			templateUrl: backTemplates + "logconfig/logconfig.html",
			controller: "logconfigController"
		})
		.state("index.logconfigEdit", {
			url: "/logconfigEdit/{id}",
			templateUrl: backTemplates + "logconfig/logconfigEdit.html",
			controller: "logconfigEditController"
		})
		.state("index.logconfigtree", {
			url: "/logconfigtree",
			templateUrl: backTemplates + "logconfig/logconfigtree.html",
			controller: "logconfigtreeController"
		})
		.state("index.importacc", {
			url: "/importacc",
			templateUrl: backTemplates + "account/importacc.html",
			controller: "importaccController"
		})
		.state("index.notice", {
		    url: "/notice",
		    templateUrl: backTemplates + "notice/notice.html",
		    controller: "noticeController"
		})
		.state("index.noticeEdit", {
		    url: "/noticeEdit/{id}",
		    templateUrl: backTemplates + "notice/noticeEdit.html",
			controller: "noticeEditController"
		})
        .state("index.coursestatistics", {
            url: "/coursestatistics",
            templateUrl: backTemplates + "report/coursestatistics.html",
            controller: "coursestatisticsController"
        })

        .state("index.planedit", {
            url: "/planEdit",
            templateUrl: backTemplates + "plan/planEdit.html",
            controller: "planEditController"
        })

        .state("index.planlist", {
            url: "/planList",
            templateUrl: backTemplates + "plan/planList.html",
            controller: "planListController"
        })
        .state("index.trainlist", {
            url: "/trainlist",
            templateUrl: backTemplates + "train/trainlist.html",
            controller: "trainlistController"
        })

        .state("index.recommendcourse", {
            url: "/recommendcourse",
            controller: "recommendcourseController",
            templateUrl: backTemplates + "recommendcourse/courseList.html",
        })
        .state("index.recommendcourseEdit", {
            url: "/recommendcourseEdit/:id/:opencourseid",
            templateUrl: backTemplates + "recommendcourse/coursewareEdit.html",
            controller: "recommendcourseEditController"
        })

        .state("index.manager", {
            url: "/manager",
            templateUrl: backTemplates + "manager/manager.html",
            controller: "managerController"
        })
		.state("index.departusertree", {
			url: "/departusertree",
			templateUrl: backTemplates + "user/departusertree.html",
			controller: "departusertreeController"
		})

		.state("index.department", {
		    url: "/department",
		    templateUrl: backTemplates + "department/department.html",
		    controller: "departmentController"
		})
        .state("index.download", {
            url: "/download",
            controller: "downloadController",
            templateUrl: backTemplates + "download/download.html",
        })

    })
    .run(function ($rootScope, $state, $http, i18nService, SessionService, $previousState) {
        i18nService.setCurrentLang('zh-cn');
        $rootScope.$on('$stateChangeStart',
			function (event, toState, toParams, fromState, fromParams) {
				$rootScope.$state = toState;
				$rootScope.urlState = "indexback." + $rootScope.$state.name;
			}
		);
        //$rootScope.$state = $state;

        //$rootScope.$watch(function () {
        //    return $previousState.get('caller');
        //}, function (newval, oldval) {
        //    if (!newval || newval.state.abstract) {
        //        $rootScope.previous = null;
        //        $rootScope.previousLink = "No previous state";
        //    } else {
        //        $rootScope.previous = newval;
        //        $rootScope.previousLink = "Return to " + newval.state.name;
        //    }
        //});
        //$rootScope.goPrevious = function () {
        //    $previousState.go('caller');
        //};
    });


angular.module("myApp")
.controller("MainCtrl", function () {

})
// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad