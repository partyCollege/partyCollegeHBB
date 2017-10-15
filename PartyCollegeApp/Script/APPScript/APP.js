function getTemplatePath(tempPathRoot) {
    return "../templates/" + tempPathRoot;
}

function getUrlParam(paramName) {
    var url = location.href.split('#')[0];
    var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
    var oMatch = oRegex.exec(url);
    if (oMatch && oMatch.length > 1) {
        return decodeURI(oMatch[1]);
    } else {
        return "";
    }
}

var app = angular.module('app', [
    'ionic',
    'ngSanitize',
    'angularMoment',
    'restangular',
    'app.controllers',
    'app.filters',
    'wj',
	 'ngFileUpload',
	'app.factory',
    'app.directive',
    'app.commonServices',
    "com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"com.2fdevs.videogular.plugins.overlayplay",
	"com.2fdevs.videogular.plugins.poster"
]);
app.config(function (RestangularProvider, $locationProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
    //$ionicConfigProvider.views.maxCache(0);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms|weixin):/);
    $locationProvider.html5mode = true;
    if(localStorage.testData){
        RestangularProvider.setBaseUrl('http://192.168.1.106/CollegeAPPHBB/api/');
    }else{
        RestangularProvider.setBaseUrl('../api/');
    }
    
    $stateProvider
   /* .state('login', {
        url: '/',
        cache: false,
        templateUrl: getTemplatePath("login.html"),
        controller: 'loginController',
        onEnter: function () {
        }
    })*/
     .state('HbbLogin', {
        url: '/',
        cache: false,
        templateUrl: getTemplatePath("HbbLogin.html"),
        controller: 'HbbloginController',
        onEnter: function () {
        }
    })
    .state('HbbRegister', {
        url: '/HbbRegister',
        templateUrl: getTemplatePath("HbbRegister.html"),
         controller: 'HbbRegisterController',
    })
      .state('HbbActivate', {
        url: '/HbbActivate/:registerInfo',
        templateUrl: getTemplatePath("HbbActivate.html"),
         controller: 'HbbActivateController'
    })
    .state('HbbSelectCourses', {
        url: '/HbbSelectCourses',
        templateUrl: getTemplatePath("HbbSelectCourses.html"),
         controller: 'HbbSelectCoursesController'
    })
    .state('HbbCourse', {//课程详情播放
        cache: false,
        url: '/HbbCourse/:courseId/:videoId',
        views: {
        	"": {
        		templateUrl: getTemplatePath("HbbCourse.html"),
        		controller: 'HbbCourseController'
        	},
        	"videoView@HbbCourse": {
        		templateUrl: getTemplatePath("HbbVideo.html"),
        		controller: 'HbbVideoController'
        	},
        	"pptplayView@HbbCourse": {
        		templateUrl: getTemplatePath("HbbPptplay.html"),
        		controller: 'HbbPptplayController'
        	}
        }
    })
    .state('HbbCourseView', {//课程详情查看
        cache: false,
        url: '/HbbCourseView/:courseId/:videoId',
        templateUrl: getTemplatePath("HbbCourseView.html"),
        controller: 'HbbCourseViewController'
    })
    .state('HbbForgetPassword', {//忘记密码
        url: '/HbbForgetPassword',
        templateUrl: getTemplatePath("HbbForgetPassword.html"),
         controller: 'HbbForgetPasswordController'
    })
    .state('HbbFile', {
    	url: '/HbbFile',
    	cache: false,
        templateUrl: getTemplatePath("HbbFile.html"),
         controller: 'HbbFileController'
    })
	.state('HbbMainClassDetails', { //学习班详情
		url: '/HbbMainClassDetails/:classId',
		templateUrl: getTemplatePath("HbbMainClassDetails.html"),
		controller: 'HbbMainClassDetailsController'
	})
	.state('HbbFace', { //面授申请
		url: '/HbbFace',
		templateUrl: getTemplatePath("HbbFace.html"),
		controller: 'HbbFaceController',
        cache: false
	})
	.state('HbbFaceDetails', { //面授申请详情
		url: '/HbbFaceDetails/:id',
		templateUrl: getTemplatePath("HbbFaceDetails.html"),
		controller: 'HbbFaceDetailsController',
        cache: false
	})
	.state('HbbUpdatepassword', { //修改密码
		url: '/HbbUpdatepassword/:cellphone',
		templateUrl: getTemplatePath("HbbUpdatepassword.html"),
		controller: 'HbbUpdatepasswordController',
        cache: false
	})
    .state('HbbChangePhone', { //修改手机
		url: '/HbbChangePhone',
		templateUrl: getTemplatePath("HbbChangePhone.html"),
		controller: 'HbbChangePhoneController',
        cache: false
	})
	.state('HbbFeedback', { //反馈
		url: '/HbbFeedback',
		templateUrl: getTemplatePath("HbbFeedback.html"),
		controller: 'HbbFeedbackController'
	})
	.state('HbbAbout', { //关于
		url: '/HbbAbout',
		templateUrl: getTemplatePath("HbbAbout.html"),
		controller: 'HbbAboutController'
	})
    .state('HbbInfo', { //个人信息
        url: '/HbbInfo',
        templateUrl: getTemplatePath("HbbInfo.html"),
        controller: 'HbbInfoController'
    })
    .state('HbbMain', {
    	url: '/main',
    	resolve: {
			//SetSession: ["SessionService",function (SessionService) {
    		//	return SessionService.CheckSession("", function (data) {
    		//		console.log("登录用户Session信息", data);
    		//	});
    	    //}]

			//,
    		GetConfig: function (SessionService) {
    			return SessionService.GetConfig();
    		}
    	},
        cache: false,
        abstract: true,
        templateUrl: getTemplatePath("HbbMain.html"), 
        controller: 'HbbMainController'
    })
    .state('HbbMain.maincourse', {//课程
        url: "/maincourse",
        cache: false,
        views:{  
         'tabview-main-maincourse':{  
                templateUrl: getTemplatePath("HbbMainCourse.html"),  
                controller:'HbbMainCourseController'  
         }
        }  
    })
    .state('HbbMain.mainselectcourse', {//选课
        url: "/mainselectcourse",
        cache: false,
        views:{  
         'tabview-main-mainselectcourse':{  
                templateUrl: getTemplatePath("HbbSelectCourses.html"),  
                controller:'HbbSelectCoursesController'  
            }  
        }  
    })
    .state('HbbMain.mainclass', {//学习班
        url: "/mainclass",
        cache: false,
        views:{  
         'tabview-main-mainclass':{  
                templateUrl: getTemplatePath("HbbMainClass.html"),  
                controller:'HbbMainClassController'  
            }  
        }  
    })
	.state('HbbMain.HbbArchives', {//学档
		url: "/HbbArchives",
		cache: false,
		views:{  
			'tabview-main-mainrecord': {
				templateUrl: getTemplatePath("HbbArchives.html"),
				controller: 'HbbArchivesController'
			}  
		}  
		
	})
    .state('HbbMain.mainrecord', {//学档
        url: "/mainrecord/:tabindex",
        cache: false,
        views:{  
         'tabview-main-mainrecord':{  
                templateUrl: getTemplatePath("HbbFile.html"),  
                controller:'HbbFileMainRecordController'  
            }  
        }  
    })
    .state('HbbMain.mainsetting', {//设置
        url: "/mainsetting",
        cache: false,
        views:{  
         'tabview-main-mainsetting':{  
                templateUrl: getTemplatePath("HbbSetting.html"),  
                controller:'HbbSettingCoursesController'  
            }  
        }  
    })

    .state('app', {
        url: '/app',
        templateUrl: getTemplatePath("menu.html"),
        controller: 'menuController',
        abstract: true
    })

    .state('app.placardinfolist', {
        url: '/placardinfolist',
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("placardinfolist.html"),
                controller: "placardinfoController"
            }
        }
    })

    .state('app.placardinfo', {
        url: "/placardinfo/:id",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("PLACARDINFO.html"),
                controller: 'detialController'
            }
        }
    })
    .state('app.xblist', {
        url: "/xblist",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("collegePaper.html"),
                controller: 'xbController'
            }
        }
    })
    .state('autoLogin', {
        url: '/autoLogin/:phone/:bcid',
        cache: false,
        templateUrl: getTemplatePath("autoLogin.html"),
        controller: 'autoLoginController',
        onEnter: function () {
        }
    })
    //.state('app.editForm', {
    //    cache: false,
    //    url: "/editForm/:obj/:formid/{info_id}/{finfo_id}/{isview}/{otherParams}",
    //    views: {
    //        "menuContent": {
    //            templateUrl: getTemplatePath("editForm.html"),
    //            controller: 'editFormController'
    //        }
    //    }
    //})
    .state('editForm', {
        url: "/editForm/:obj/:formid/{info_id}/{finfo_id}/{isview}/{otherParams}",
        cache: false,
        templateUrl: getTemplatePath("editForm.html"),
        controller: 'editFormController'
    })
    .state('app.testpage', {
        url: "/xblist",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("test.html"),
                controller: 'testpageController'
            }
        }
    })
    .state('app.default_list', {
        cache: false,
        url: "/default_list/:title/:category/{finfo_id}",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("default_list.html"),
                controller: 'default_listController'
            }
        }
    })
	.state('app.appraise_default', {
	    cache: false,
	    url: "/appraise_default/:title/:category/:ispj/{finfo_id}",
	    views: {
	        "menuContent": {
	            templateUrl: getTemplatePath("appraise_default.html"),
	            controller: 'appraise_defaultController'
	        }
	    }
	})
    .state('app.studentSbf', {
        cache: false,
        url: "/studentSbf",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("studentSbf.html"),
                controller: 'studentSbfController'
            }
        }
    })
    .state('selectchatuser', {
        cache: false,
        url: "/selectchatuser",
        templateUrl: getTemplatePath("selectchatuser.html"),
        controller: 'selectchatuserController'
    })
    .state('chatsetting', {
        cache: false,
        url: "/chatsetting/:chatid/:chatName",
        templateUrl: getTemplatePath("chatSetting.html"),
        controller: 'chatsettingController'
    })
    .state('chatuserinfo', {
        cache: false,
        url: "/chatuserinfo/:userid/:usertype",
        templateUrl: getTemplatePath("chatuserinfo.html"),
        controller: 'chatuserinfoController'
    })
    .state('chatlist', {
        cache: false,
        url: "/chatlist",
        templateUrl: getTemplatePath("chatlist.html"),
        controller: 'chatlistController'
    })
    .state('app.default_detial', {
        url: "/default_detial/:id/:category/:title",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("default_detial.html"),
                controller: 'default_detialController'
            }
        }
    })
    .state('app.map', {
        url: "/map",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("map.html"),
                controller: 'mapController'
            }
        }
    })
    .state('app.VhallVideoTest', {
        cache: false,
        url: "/VhallVideoTest",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("VhallVideoTest.html"),
                controller: 'VhallVideoTestController'
            }
        }
    })
    .state('app.rmgpDemo', {
        url: "/rmgpDemo",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("rmgpDemo.html"),
                controller: 'rmgpDemoController'
            }
        }
    })
    .state('app.xbDetial', {
        url: "/xbDetial/:id",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("collegePaperDetial.html"),
                controller: 'xbDetialController'
            }
        }
    })
        .state('weburl', {
            url: "/weburl/:url",
            cache: false,
            templateUrl: getTemplatePath("weburl.html"),
            controller: 'weburlController'
        })
    .state("app.videoPlay", {
        url: "/videoPlay/:id",
        cache: false,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("videoPlay.html"),
                controller: 'videoPlayController'
            }
        }
    })
    .state("videoPlayGxy", {
        url: "/videoPlayGxy/:id",
        cache: false,
        templateUrl: getTemplatePath("videoPlayGxy.html"),
        controller: 'videoPlayGxyController'
    })
    .state("classChat", {
        url: "/classChat/:chatgroupid",
        cache: false,
        templateUrl: getTemplatePath("classChat.html"),
        controller: 'classChatController'
    })
	.state('app.index', {
	    url: "/index",
	    cache: true,
	    views: {
	        "menuContent": {
	            templateUrl: getTemplatePath("index.html"),
	            controller: 'indexController'
	        }
	    }
	})
    .state('app.index_video', {
        url: "/index_video",
    	cache: true,
    	views: {
    	    "menuContent": {
    	        templateUrl: getTemplatePath("index_video.html"),
    	        controller: 'index_videoController'
    	    }
    	}
    })
	.state('app.subindex', {
	    url: "/subindex/:title/:category",
	    views: {
	        "menuContent": {
	            templateUrl: getTemplatePath("subindex.html"),
	            controller: 'subindexController'
	        }
	    }
	})
	 .state('app.appraise_list', {
	     url: "/appraise_list/:tabid/:tabclass",
	     cache: true,
	     views: {
	         "menuContent": {
	             templateUrl: getTemplatePath("appraise.html"),
	             controller: 'appraiseListController'
	         }
	     }
	 })
	.state('app.appraise_detial', {
	    url: "/appraise_detail/:id/:category/:title",
	    views: {
	        "menuContent": {
	            templateUrl: getTemplatePath("appraiseDetail.html"),
	            controller: 'appraiseDetailController'
	        }
	    }
	})
    .state('app.addresslist', {
        cache: false,
        url: "/addresslist/:title/:forchoose",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("addresslist.html"),
                controller: 'addresslist'
            }
        }
    })
    .state('app.weekClass', {
        url: "/weekClass",
        cache: false,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("weekclass.html"),
                controller: 'weekClassController'
            }
        }
    })
        .state('app.weekReport', {
            url: "/weekReport/:title/:category",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("weekReport.html"),
                    controller: 'weekReportController'
                }
            }
        })
         .state('app.other', {
             url: '/other/:url',
             cache: false,
             views: {
                 "menuContent": {
                     templateUrl: getTemplatePath("other.html"),
                     controller: 'otherController'
                 }
             }
         })

        .state('app.iosfile', {
            url: '/iosfile/:url',
            cache: false,
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("iosfile.html"),
                    controller: 'iosfileController'
                }
            }
        })
        .state('app.qingjiaDisplay', {
            url: '/qingjiaDisplay/:info_id',
            cache: false,
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("qingjiaDisplay.html"),
                    controller: 'qingjiaDisplayController'
                }
            }
        })
.state('app.sharefile', {
    url: '/sharefile/:title',
    cache: false,
    views: {
        "menuContent": {
            templateUrl: getTemplatePath("ShareFile.html"),
            controller: 'sharefileController'
        }
    }
})
    .state('app.addresslistInfo', {
        url: "/addresslistInfo/:id",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("addresslistInfo.html"),
                controller: 'addresslistInfo'
            }
        }
    })
    .state('app.calendar', {
        url: "/calendar",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("calendar.html"),
                controller: 'calendarController'
            }
        }
    })
    .state('app.studentList', {
        url: "/studentList/:canchoose",
        cache: false,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("StudentList.html"),
                controller: 'studentListController'
            }
        }
    })
        .state('app.studentListInfo', {
            url: "/studentListInfo/:studentid",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("studentListInfo.html"),
                    controller: 'studentListInfoController'
                }
            }
        })
    .state('app.studentSetting', {
        url: "/studentSetting",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("studentInfoEdit.html"),
                controller: 'studentSettingController'
            }
        }
    })
    .state('app.xinlang', {
        url: "/xinlang",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("xinlang.html"),
                controller: 'xinlangController'
            }
        }
    })
        .state('app.myplace', {
            url: "/myplace",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("myPlace.html"),
                    controller: 'myplaceController'
                }
            }
        })
         .state('app.chooseclass', {
             url: "/chooseclass",
             views: {
                 "menuContent": {
                     templateUrl: getTemplatePath("chooseClass.html"),
                     controller: 'chooseclassController'
                 }
             }
         })
        .state('app.chooseAllClass', {
            url: "/chooseAllClass",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("chooseAllClass.html"),
                    controller: 'chooseAllClassController'
                }
            }
        })
    .state('app.qingjiaList', {
        url: "/qingjiaList",
        cache: false,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("qingjiaList.html"),
                controller: 'qingjiaListController'
            }
        }
    })
    .state('app.qingjia_Detial', {
        url: "/qingjia_Detial",
        cache: false,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("qingjia_Detial.html"),
                controller: 'qingjia_DetialController'
            }
        }
    })
    .state('app.editStudent', {
        url: "/editStudent",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("editStudent.html"),
                controller: 'editStudentController'
            }
        }
    })
    .state('app.tabs', {
        url: "/tabs",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("tabs.html"),
                controller: 'tabsController'
            },
            "view1": {
                templateUrl: getTemplatePath("xinlang.html"),
                controller: 'xinlangController'
            }
        }
    })
	.state('zjlogin', {//专家login
	    url: '/zjlogin',
	    cache: false,
	    templateUrl: getTemplatePath("zjlogin.html"),
	    controller: 'zjloginController',
	    onEnter: function () {
	    }
	})
	.state('app.zjpjdetail', {
	    url: '/zjpjdetail/:infoid',
	    cache: false,
	    views: {
	        "menuContent": {
	            templateUrl: getTemplatePath("zjpjdetail.html"),
	            controller: "zjpjdetailController"
	        }
	    }
	})
     .state('app.collegeGuide', {
         url: "/collegeGuide",
         views: {
             "menuContent": {
                 templateUrl: getTemplatePath("collegeGuide.html"),
                 controller: 'collegeGuideController'
             }
         }
     })
        .state('app.collegeLifeGuide', {
            url: "/collegeLifeGuide",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("collegeLifeGuide.html"),
                    controller: 'collegeLifeGuideController'
                }
            }
        }).state('app.xyxz', {
            url: "/xyxz",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("xyxz.html"),
                    controller: 'xyxzController'
                }
            }
        })
    .state('app.baoxiu', {
        url: "/baoxiu",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("baoxiu.html"),
                controller: 'baoxiuController'
            }
        }
    })
    .state('app.jxzy', {
        url: "/jxzy",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("jxzy.html"),
                controller: 'jxzyController'
            }
        }
    })
    .state('app.qna', {
        url: "/qna",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("qna.html"),
                controller: 'qnaController'
            }
        }
    })
    .state('app.jxzyDe', {
        url: "/jxzyDe",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("jxzyDe.html"),
                controller: 'jxzyDeController'
            }
        }
    })
    .state('app.swdxtsg', {
        url: "/swdxtsg",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("swdxtsg.html"),
                controller: 'swdxtsgController'
            }
        }
    })
        .state('app.shswdxdt', {
            url: "/shswdxdt",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("shswdxdt.html"),
                    controller: 'swdxtsgController'
                }
            }
        })
        .state('app.notice', {
            url: "/notice",
            cache: false,
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("noticelist.html"),
                    controller: 'noticelistController'
                }
            }
        }).state('app.noticedetail', {
            url: "/noticedetail/:id",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("noticedetail.html"),
                    controller: 'noticedetailController'
                }
            }
        })
    .state('app.noticeAdd', {
        url: "/noticeAdd",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("noticeAdd.html"),
                controller: 'noticeAddController'
            }
        }
    })
    .state('app.meeting_list', {
        url: "/meeting_list",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("meetinglist.html"),
                controller: 'meetingListController'
            }
        }
    })
    .state('app.meeting_detail', {
        cache: false,
        url: "/meeting_detail/:info_id",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("meetingDetail.html"),
                controller: 'meetingDetailController'
            }
        }
    })
    .state('app.moive_list', {
        url: "/moive_list",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("moivelist.html"),
                controller: 'moiveListController'
            }
        }
    })
    .state('app.moive_detail', {
        cache: false,
        url: "/moive_detail/:info_id",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("moiveDetail.html"),
                controller: 'moiveDetailController'
            }
        }
    })
    .state('app.studentUserInfo', {
        cache: false,
        url: "/studentUserInfo",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("studentUserInfo.html"),
                controller: 'studentUserInfoController'
            }
        }
    })
        .state('app.viewAllClass', {
            cache: false,
            url: "/viewAllClass",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("viewAllClass.html"),
                    controller: 'viewAllClassController'
                }
            }
        })
        .state('app.shswdx', {
            cache: false,
            url: "/shswdx",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("shswdx.html")
                }
            }
        })
         .state('app.viewAllKC', {
             cache: true,
             url: "/viewAllKC/:bcid",
             views: {
                 "menuContent": {
                     templateUrl: getTemplatePath("viewAllKC.html"),
                     controller: 'viewAllKCController'
                 }
             }
         })
        .state('app.viewKaoqin', {
            cache: false,
            url: "/viewKaoqin/:bcid/:kcid",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("viewKaoqin.html"),
                    controller: 'viewKaoqinController'
                }
            }
        })
    .state('app.stuQdMsg', {
        cache: false,
        url: "/stuQdMsg",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("studentqdmsg.html"),
                controller: 'studentQdMsgController'
            }
        }
    })

        .state('app.handSet', {
            cache: false,
            url: "/handSet",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("handSet.html"),
                    controller: 'handSetController'
                }
            }
        })
        .state('app.oneCardList', {
            cache: false,
            url: "/oneCardList/:canserch",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("oneCardList.html"),
                    controller: 'oneCardListController'
                }
            }
        })
        .state('loadingPage', {
            url: '/loadingpage',
            cache: false,
            templateUrl: getTemplatePath("loadingpage.html"),
            controller: 'loadingPageController',
            onEnter: function () {
            }
        })
    .state('LoginHand', {
        url: '/LoginHand',
        cache: false,
        templateUrl: getTemplatePath("LoginHand.html"),
        controller: 'LoginHandController'
    })
        .state('app.weekMeet', {
            cache: false,
            url: "/weekMeet",
            views: {
                "menuContent": {
                    templateUrl: getTemplatePath("weekMeet.html"),
                    controller: 'weekMeetController'
                }
            }
        })
        // 微信点名
    .state('kqaddinfo', {
        url: "/kqaddinfo",
        cache: false,
        templateUrl: getTemplatePath("kqaddinfo.html"),
        controller: 'kqaddinfoController'
    })
    .state('previewImg', {
        url: "/previewImg/:id",
        cache: false,
        templateUrl: getTemplatePath("previewImg.html"),
        controller: 'previewImgController'
    })
    .state('yddm', {
        url: "/yddm",
        cache: false,
        templateUrl: getTemplatePath("yddm.html"),
        controller: 'yddmController'
    })
    .state('kqlist', {
        url: "/kqlist/:id/:type",
        cache: false,
        templateUrl: getTemplatePath("kqlist.html"),
        controller: 'kqlistController'
    })
    .state('kqStudent', {
        url: "/kqStudent",
        cache: false,
        templateUrl: getTemplatePath("kqStudent.html"),
        controller: 'kqStudentController'
    })
         //.state('changePsd', {
         //    url: "/changePsd",
         //    cache: false,
         //    templateUrl: getTemplatePath("changePsd.html"),
         //    controller: 'changePsdController'
         //})
    .state('app.changePsd', {
        cache: false,
        url: "/changePsd",
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("changePsd.html"),
                controller: 'changePsdController'
            }
        }
    })
    .state('app.mainshdx', {
        url: "/mainshdx",
        cache: true,
        views: {
            "menuContent": {
                templateUrl: getTemplatePath("Main_shdx.html"),
                controller: 'mainshdxController'
            }
        }
    })
    //.state('HbbMain', {
    //    url: "/HbbMain",
    //    templateUrl: getTemplatePath("HbbMain.html")
    //})
    ;
    if (localStorage.user && localStorage.user != "undefined" && localStorage.user != null) {
        var user = JSON.parse(localStorage.user);
        if (user.ishandpsd == 1 && user.handpsd) {
            $urlRouterProvider.otherwise('/LoginHand');
        }
        else {
            //$urlRouterProvider.otherwise('/');
            $urlRouterProvider.otherwise('/app/index');
        }
    }
    else {
        $urlRouterProvider.otherwise('/');
    }

    //$urlRouterProvider.otherwise('/');
    //$ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.views.maxCache(3);
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.templates.maxPrefetch(1);
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.views.swipeBackEnabled(false);



});
app.run(function ($rootScope, $templateCache, getDataSource, userHelp, cordovaService,$cacheFactory, $ionicHistory, $ionicPlatform, $ionicPopup, $location, $http, showAlert, $state, Restangular , $timeout , $ionicTabsDelegate) {
    //showAlert.showLoading(5000, "加载中...");
    //sessionStorage.clear();

    //if ($location.absUrl().indexOf("index_wx.html") > -1) {
    //    $rootScope.fromweixin = true;
    //}
    //else {
    //    $rootScope.fromweixin = false;
    //}
    $rootScope.testMode = false;
    $rootScope.formweixin = true;

    //获取微信JSTickets
    $http.get("../Api/wxJSTickets").then(function (data) {
        var ticket = data.data;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: ticket.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: ticket.timestamp, // 必填，生成签名的时间戳
            nonceStr: ticket.nonceStr, // 必填，生成签名的随机串
            signature: ticket.signature,// 必填，签名，见附录1
            jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    });
    $http.get("../config/AppConfig.json").then(function (data) {
        var nowdata = data.data;
        $rootScope.appConfig = nowdata;
        //$rootScope.fromweixin = $rootScope.AppConfig.fromweixin;
    });
    $ionicPlatform.ready(function ($rootScope) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
    if (localStorage.user) {
        $rootScope.user = JSON.parse(localStorage.user);
        //localStorage.user = JSON.stringify($rootScope.user);
        sessionStorage.userid = $rootScope.user.userid;
        sessionStorage.usertype = $rootScope.user.usertype;
        sessionStorage.bcinfo_id = $rootScope.user.bcinfo_id;
        sessionStorage.stu_info_id = $rootScope.user.stu_info_id;
        sessionStorage.uname = $rootScope.user.uname;
        sessionStorage.phone = $rootScope.user.phone;
        sessionStorage.bcname = $rootScope.user.bcname;
        // 记录手势密码
        sessionStorage.ishandpsd = $rootScope.user.ishandpsd;
        sessionStorage.handpsd = $rootScope.user.handpsd;
        sessionStorage.decphone = $rootScope.user.decphone;

        //教职工属性
        if ($rootScope.user.onecard) {
            sessionStorage.onecard = $rootScope.user.onecard;
        }
        if ($rootScope.user.mainDept) {
            sessionStorage.maincode = $rootScope.user.mainDept;
        }
        if ($rootScope.user.roles) {
            sessionStorage.roles = $rootScope.user.roles;
        }
    }
    if (gopage && localStorage.user) {
        $location.path(gopage).replace();
    }
    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
        //alert(1);    
        //如果是一下页面，禁用返回
        switch ($state.$current.name) {
            case "index": return false; break;
        }
        //判断处于哪个页面时双击退出
        if ($location.path() == "/" || $location.path() == "/LoginHand") {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                window.plugins.toast.show("再按一次退出系统", 'short', 'center');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        }
        else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            window.plugins.toast.show("再按一次退出系统", 'short', 'center');
            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;
    }, 101);
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    function changeTab(handleName , selectedIndex) {
        var index = 0;
        try{
            index = parseInt(selectedIndex);
        } catch (e) {
            index = 0;
            console.error(e);
        }
        if (isNaN(index)) {
            index = 0;
        }
        if (localStorage.debug) {
            console.log("" + handleName + " index = ", index);
        }
        $timeout(function(){
            $ionicTabsDelegate.$getByHandle(handleName).select(index);
        } , 400);
    }

    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            if (localStorage.debug) {
                console.log("fromState name :" + fromState.name );
                console.log("toState name :" + toState.name );
            }

            if (toState.name == "HbbMain.maincourse") {
                changeTab("maincourse-tab-handle"  , localStorage.mainCourseTabIndex);
            }else if(toState.name == "HbbMain.mainselectcourse"){
                changeTab("mainselectcourse-tab-handle"  , localStorage.mainSelectCourseTabIndex);
            }else if(toState.name == "HbbMain.mainclass"){
                changeTab("mainclass-tab-handle"  , localStorage.mainClassTabIndex);
            }else if(toState.name == "HbbMain.mainrecord"){
                changeTab("mainrecord-tab-handle"  , localStorage.mainRecordTabIndex);
            }
            
            if (fromState.name == "HbbCourse"){
                $("#mainVideo").html(""); //解决视频播放器，返回后仍漂浮显示的问题
		    }
    });

    $rootScope.$on('$stateChangeStart',
	    function(event, toState, toParams, fromState, fromParams){
			//console.log("fromState name :" + fromState.name );
			//console.log("toState name :" + toState.name );
	});
    ////////////////////////////////////////////////////////////////////
    // 自动登录
    if (localStorage.logname) {
        $rootScope.logname = localStorage.logname;
        $rootScope.password = localStorage.password;
    }
    function startPushMessage() {

        data = {
            "action": sessionStorage.userid + "/" + sessionStorage.usertype,
            "refreshTime": 1000 * 5 //刷新时间 不传默认60s
        }
        //注：action 地址返回数据格式
        /* {
                "messageId" : "1cfa31dd47de6f8a485aac405a694974",
                "title":"你有一条新的消息",
                "content":"你有一条新的消息"
        } */
        if (!$rootScope.fromweixin) {
            xsfPushMessage.startPushMessage(data, onSuccess, onError);
        }
        function onSuccess(data) {
            console.log(data.message + " - " + data.data);
        }

        function onError(e) {
            console.log(e.message + " - " + e.data);
        }
    }
    if (localStorage.user && localStorage.user !== "undefined") {
        $rootScope.bclist = [];

        var loginData = Restangular.one('Gusers/action/StudentLogin/' + $rootScope.logname.toLocaleUpperCase() + '/' + $rootScope.password);
        loginData.post().then(function (data) {
            if (data.errorMessage == "") {
                sessionStorage.userid = data.onecard;
                sessionStorage.usertype = "student";
                sessionStorage.bcinfo_id = data.bcinfo;
                sessionStorage.stu_info_id = data.info_id;
                sessionStorage.uname = data.uname;
                sessionStorage.phone = data.phone;
                sessionStorage.bcname = data.bcname;
                // 记录手势密码
                sessionStorage.ishandpsd = data.ishandpsd;
                sessionStorage.handpsd = data.handpsd;

                if (!$rootScope.fromweixin) {
                    startPushMessage();
                }

                var decphone = Restangular.one('Gusers/action/decPhone/' + data.phone);
                decphone.post().then(function (data) {
                    sessionStorage.decphone = data.phone;
                });

                $rootScope.user = sessionStorage;
                //userHelp.setSession(function () { });
                localStorage.user = JSON.stringify($rootScope.user);
            } else {
                // 老师登录方法
                if (!$rootScope.fromweixin) {
                    cordovaService.checkVersion();
                }

                localStorage.IsFirstStart = false;

                var loginData = Restangular.one('Gusers/action/Login/' + $rootScope.logname + '/' + $rootScope.password);
                loginData.post().then(function (data) {
                    if (data.msgStatus) {
                        window.localStorage.userid = data.userid;
                        sessionStorage.userid = data.userid;
                        sessionStorage.usertype = "teacher";
                        sessionStorage.maincode = data.mainDept;
                        sessionStorage.uname = data.uname;
                        sessionStorage.onecard = data.onecard;
                        // 记录手势密码
                        sessionStorage.ishandpsd = data.ishandpsd;
                        sessionStorage.handpsd = data.handpsd;

                        getDataSource.getDataSource("getTeacherClass", {
                            userid: sessionStorage.userid
                        }, function (classdata) {
                            if (classdata.length > 0) {
                                $rootScope.bclist = classdata;
                                sessionStorage.bcinfo_id = classdata[0].classid;
                                sessionStorage.bcname = classdata[0].bt;
                            }
                            else {
                                delete sessionStorage.bcname;
                                delete $rootScope.user.bcname;
                                delete sessionStorage.bcinfo_id;
                                delete $rootScope.user.bcinfo_id;
                            }
                            userHelp.setSession(function () { });
                        })
                        sessionStorage.roles = JSON.stringify(data.roles);

                        $rootScope.user = sessionStorage;
                        localStorage.user = JSON.stringify($rootScope.user);
                    } else {
                        $state.go('login');
                    }
                });
            }
        });
    };
});
app.factory('getUser', function ($location) {
    return function () {
        return $location.search().userid;
    };
});
