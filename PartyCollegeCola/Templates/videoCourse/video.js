app.controller("videoController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService) {
	    var obj = {};
	    $scope.course = {};
	    $scope.lastPlayTime = 0;
	    $scope.courwarestudytime = 0;//课程学时
	    var player1 = {};
	    var player2 = {};

	    var errorMessage = "系统检测到当前网络异常，请刷新页面重试。";

	    var moethodError = function (message, stack, method, filename, errorline, arguments) {
	        try {
	            var postdata = {
	                filename: filename,
	                methodname: method,
	                errorline: errorline,
	                message: message,
	                msginfo: stack,
	                arguments: arguments
	            };

	            $http.post("../api/WriteException", postdata).success(function (data) { });
	        }
	        catch (ex) { }
	    }

	    $scope.currentPlayID = getDataSource.getGUID();

	    $scope.load = function () {
	        $timeout(function () {
	            $scope.open = s2j_onChapterBtnClick;
	            $scope.open = function () {
	            };
	            $scope.open = s2j_onChapterBtnClick;
	        }, 0)
	    }();
	    //加载聊天 

	    $timeout(function () {
	    	$(function () {
	    		$("#emotion").SinaEmotion($("#message"));
	    		var chat = {};
	    		$.getScript($rootScope.appConfig.signalRHub)
	    		.done(function (script, textStatus) {
	    			$.connection.hub.url = $rootScope.appConfig.signalRHub;
	    			chat = $.connection.chatHub;
	    			 //接受信息
	    			chat.client.broadcastMessage = function (data) {
	    				// Html encode display name and message.
	    				var encodedName = $('<div />').text(data.name).html();
	    				//// Add the message to the page.
	    				$('#chartDiv').append('<li><strong>' + encodedName
	    					+ ':</strong>' + "<div>" + AnalyticEmotion(data.message) + "</div>" + "<span class='time'>" + data.dateTime + '</span></li>');

	    			};
	    			chat.client.repeatLogin = function () {
	    			    player1.j2s_pauseVideo();
	    			    if ($scope.course.videotype > 0) {
	    			        if (player2 != undefined && player2.j2s_pauseVideo != undefined) {
	    			            player2.j2s_pauseVideo();
	    			        }
	    			    }
	    				var j = window.confirm("您已重复登录")
	    				if (j || !j) {
	    					window.close();
	    				}
	    			}
	    			$.connection.hub.start(function () {

	    				chat.server.addConnection($rootScope.user.accountId);
	    				//加入聊天室，同一门课程一个聊天室
	    				chat.server.joinRoom($stateParams.coursewareid);
	    				//发送信息
	    				$('#sendmessage').click(function () {
	    					// Call the Send method on the hub.
	    					chat.server.send($rootScope.user.name, $('#message').val(), $stateParams.coursewareid);
	    					// Clear text box and reset focus for next comment.
	    					$('#message').val('').focus();
	    				});
	    			}, function (data) {
	    				alert(errorMessage);
	    			});
	    		});

	    	});
	    }, 0);

	    var player1Obj = {};
	    var player2Obj = {};

	    $scope.isGetPKey = false;
	    $scope.pkey = "";

	    $scope.loadVideo = function () {
	        try {

	            var keyArray = new Array();
	            keyArray.push("selectStudentPlayDetailCount");
	            keyArray.push("selectStudentPlayTime");
	            keyArray.push("getStudytimeByCoursewareId");

	            getDataSource.getDataSource(keyArray
                    , { coursewareid: $stateParams.coursewareid, studentid: $rootScope.user.studentId, currentID: $scope.currentPlayID, courseid: $stateParams.coursewareid }
                    , function (data) {
                        //console.log("data", data);
                        var stuPlayTime = _.find(data, { name: "selectStudentPlayTime" }).data;
                        var stuPlayDetailCount = _.find(data, { name: "selectStudentPlayDetailCount" }).data;
                        var courwareStudytime = _.find(data, { name: "getStudytimeByCoursewareId" }).data;

                        $scope.stuPlayDetailCount = stuPlayDetailCount[0].dtlcount;
                        $scope.studytime = 0;
                        if (stuPlayTime[0]) {
                            $scope.lastPlayTime = stuPlayTime[0].timespan;
                            $scope.studytime = stuPlayTime[0].studytime;
                            $scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
                        }
                        if (courwareStudytime[0]) {
                            $scope.courwarestudytime = courwareStudytime[0].studytime;
                        }


                        getDataSource.getDataSource("selectCoursewareById", { id: $stateParams.coursewareid }, function (data) {
                            $scope.course = data[0];
                            $scope.nowVideoDuration = $scope.course.realduration;

                            //获取sy_video_log主键
                            getDataSource.getUrlData("../api/getVideoLogPKey",
                                { studentid: $rootScope.user.studentId, coursewareid: $stateParams.coursewareid, courwarestudytime: $scope.courwarestudytime }
                                , function (data) {
                                    //console.log("data", data);
                                    if (data.code) {
                                        var pkey = data.pkey;
                                        if (pkey.length > 0) {
                                            $scope.isGetPKey = true;
                                            $scope.pkey = pkey;
                                            if (!$scope.$$phase) {
                                                $scope.$apply();
                                            }
                                        }
                                    } else {
                                        //console.log("message", data.message);
                                    }
                                }, function (error) {
                                    alert(errorMessage);
                                });

                            player1Obj = {
                                'width': '100%',
                                'height': '100%',
                                'vid': $scope.course.teachervideo,
                                'flashvars': {
                                    "autoplay": "false",
                                    "teaser_time": "0",
                                    "setScreen": "16_9",
                                    "ban_history_time": "on",
                                    "history_video_duration": "10",
                                    "setVolumeM": "1",
                                    "ban_ui": "off",
                                    "ban_control": "off",
                                    "is_auto_replay": "off",
                                    "ban_skin_progress_dottween": "on"
                                }
                            };
                            //如果没有看完需要限制拖动
                            if ($scope.isplaycompletion != 1) {
                                player1Obj.flashvars.watchStartTime = $scope.studytime;
                                player1Obj.flashvars.ban_seek_by_limit_time = "on";
                            }
                            player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
                            //单视频样式调整
                            if ($scope.course.videotype == 0) {
                                $(".video-box.video-f").attr("class", "video-box video-f video_only");
                                $(".video-box.video-s").css("display", "none");
                                $(".exchange").css("display", "none");
                            }
                            if ($scope.course.videotype > 0) {
                                player2Obj = {
                                    'width': '100%',
                                    'height': '100%',
                                    'vid': $scope.course.pptvideo,
                                    'flashvars': {
                                        "autoplay": "false",
                                        "teaser_time": "0",
                                        "ban_history_time": "on",
                                        "history_video_duration": "10",
                                        "setVolumeM": "0",
                                        "ban_ui": "off",
                                        "ban_control": "off",
                                        "is_auto_replay": "off",
                                        "ban_skin_progress_dottween": "on"
                                    }
                                }
                                //如果没有看完需要限制拖动
                                if ($scope.isplaycompletion != 1) {
                                    player2Obj.flashvars.watchStartTime = $scope.studytime;
                                    player2Obj.flashvars.ban_seek_by_limit_time = "on";
                                }
                                player2 = polyvObject('#smallVideo').videoPlayer(player2Obj);
                            }
                        }, function (error) {
                            alert(errorMessage);
                        });
                    }, function (error) {
                        alert(errorMessage);
                    });
                }
	        catch (ex) {
	            alert(errorMessage);
	            moethodError(ex.message + "【错误码：001】", ex.stack, "loadVideo", "", 0);
	        }
	    }();

	    s2j_onChapterBtnClick = function () {
	    };

	    //视频初始化
	    s2j_onPlayerInitOver = function (vid) {

	        //日志参数
	        var par = {
	            studentid: $rootScope.user.studentId,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId
	        };

	        if (player1 != undefined && player1.j2s_rightpanelBtnSet != undefined) {
	            player1.j2s_rightpanelBtnSet();
	            if ($scope.course.videotype > 0) {
	                if (player2 != undefined && player2.j2s_rightpanelBtnSet != undefined && player2.j2s_banUI != undefined && player2.j2s_hideRightPanel != undefined) {
	                    player2.j2s_rightpanelBtnSet();
	                    player2.j2s_banUI();
	                    player2.j2s_hideRightPanel();
	                }
	            }

	            var mess = "";
	            if (player1 == undefined) { mess += " player1 is undefined, "; }
	            if (player1.j2s_getCurrentTime == undefined) {
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            }
	            if (player1.j2s_realPlayVideoTime == undefined) {
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            }

	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. " + mess, "s2j_onPlayerInitOver", "", 0, par);
	        }
	        else {
	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed. player1 is undefined && player1.j2s_rightpanelBtnSet is undefined", "s2j_onPlayerInitOver", "", 0, par);
	        }
	    }

	    //播放结束
	    s2j_onPlayOver = function (vid) {
	        //看主视频才调用此方法。
	    	if ($scope.course.teachervideo == vid) {
	    		//视频播放完成触发，再一次提交数据。
	    		O_func();
	            clearInterval(obj);

	            //日志参数
	            var par = {
	                studentid: $rootScope.user.studentId,
	                coursewareid: $stateParams.coursewareid,
	                accountid: $rootScope.user.accountId
	            };

	            var mess = "";
	            if (player1 == undefined) {
	                mess += " player1 is undefined, ";
	            }
	            if (player1.j2s_getCurrentTime == undefined) {
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            } else {
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            }
	            if (player1.j2s_realPlayVideoTime == undefined) {
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            }
	            else {
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            }
	            moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed." + mess, "s2j_onPlayOver", "", 0, par);
	        }
	    }

	    s2j_onPlayerError = function (type, vid) {
	        clearInterval(obj);
	        //日志参数
	        var par = {
	            studentid: $rootScope.user.studentId,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId,
	            type: type
	        };

	        var mess = "";
	        if (player1 == undefined) { mess += " player1 is undefined, "; }
	        if (player1.j2s_getCurrentTime == undefined){
	            mess += " player1.j2s_getCurrentTime is undefined, ";
	        } else{
	        	mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	        }
	        if (player1.j2s_realPlayVideoTime == undefined){
	            mess += " player1 j2s_realPlayVideoTime is undefined, ";
	        } else{
	            mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	        }
	        moethodError("播放器事件监控 【vid:" + vid + "】", "Method execution is completed." + mess, "s2j_onPlayerError", "", 0, par);
	    }

	    // 点击章节按钮
	    s2j_onChapterBtnClick = function () {
	        //目前暂没有章节
	        CommonService.alert("章节功能暂未开放");
	        return;

	        if (player1 != undefined && player1.j2s_pauseVideo != undefined) {
	            player1.j2s_pauseVideo();
	        }
	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined && player2.j2s_pauseVideo != undefined) {
	                player2.j2s_pauseVideo();
	            }
	        }
	    }

	    // 点击笔记按钮
	    s2j_onNoteBtnClick = function () {
	        //暂停
	        s2j_onVideoPause();
	        if (player1 != undefined && player1.j2s_screenShot != undefined) {
	            //截图
	            player1.j2s_screenShot();
	        }
	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined && player2.j2s_screenShot != undefined) {
	                player2.j2s_screenShot();
	            }
	        }
	    }

	    //定位播放
	    window.stutynotePlay = function (notetime) {
	        if (player1 != undefined) {
	            player1.j2s_seekVideo(notetime);
	        }

	        if ($scope.course.videotype > 0) {
	            if (player2 != undefined) {
	                player2.j2s_seekVideo(notetime);
	            }
	        }
	    }

	    //笔记截图
	    window.s2j_onScreenShotComplete = function (data) {
	        var ImgData = JSON.parse(data);
	        if (ImgData.vid == $scope.course.teachervideo) {
	            $scope.studynoteConfig.studynoteImg1 = ImgData.url;
	            if ($scope.course.videotype <= 0) {
	                if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	                    //视频1播放时间
	                    var sec1 = player1.j2s_getCurrentTime();
	                    //打开笔记界面
	                    $scope.showStudynoteView("lg", s2j_onVideoPlay, sec1);
	                }
	            }
	        }
	        else if (ImgData.vid == $scope.course.pptvideo) {
	            $scope.studynoteConfig.studynoteImg2 = ImgData.url;
	            if ($scope.course.videotype > 0) {
	                if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	                    //视频1播放时间
	                    var sec1 = player1.j2s_getCurrentTime();
	                    //打开笔记界面
	                    $scope.showStudynoteView("lg", s2j_onVideoPlay, sec1);
	                }
	            }
	        }
	    }

	    // 点击提问按钮
	    s2j_onQuestionBtnClick = function () {
	        //暂停
	        s2j_onVideoPause();
	        //视频1播放时间
	        if (player1 != undefined && player1.j2s_getCurrentTime != undefined) {
	            var sec1 = player1.j2s_getCurrentTime();
	            $scope.showQuestionView("lg", s2j_onVideoPlay, sec1);
	        }
	    }



	    // 点击交流按钮
	    s2j_onCommunicationBtnClick = function () {
	        if ($(".courseFile .chat_box").hasClass("show")) {
	            $(".courseFile .chat_box").removeClass("show");
	        } else {
	            $(".courseFile .chat_box").addClass("show");
	        }
	    }

		//视频播放
	    s2j_onVideoPlay = function (vid) {
	    	//看主视频才调用此方法。
	    	if (player1 != undefined && player1.j2s_resumeVideo != undefined) {
	    		player1.j2s_resumeVideo();
	    		if ($scope.course.videotype > 0) {
	    			if (player2 != undefined && player2.j2s_resumeVideo != undefined) {
	    				player2.j2s_resumeVideo();
	    			}
	    		}
	    		if ($scope.course.teachervideo == vid) {
	    			clearInterval(obj);
	    			//视频一播放就提交一次，解决定时器时间不够的问题
	    			O_func();
	    			obj = setInterval(O_func, 60000);
	    		}
	    	}
	    }

	    var O_func = function () {
	        var postData = {
	            pkey: $scope.pkey,
	            studentid: $rootScope.user.studentId,
	            time: 0,
	            currentID: $scope.currentPlayID,
	            timestamp: 0,
	            videoDuration: $scope.nowVideoDuration,
	            coursewareid: $stateParams.coursewareid,
	            accountid: $rootScope.user.accountId,
	            studytime: $scope.studytime,
	            studetailcount: $scope.stuPlayDetailCount,
	            courwarestudytime: $scope.courwarestudytime,
	            coursewarename: $scope.course.name
	        };

	        if (player1 != undefined && player1.j2s_getCurrentTime != undefined && player1.j2s_realPlayVideoTime != undefined) {
	            var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间;
	            //console.log("视屏播放时间" + new Date());
	            //记录播放
	            //校友观看视频是 studentid为null,calssid 为空。
	            if ($scope.studytime <= 0) {
	                $scope.studytime = $scope.studytime + 60;
	            }
	            //console.log("postData", postData);
	            postData.time = sec1;
	            postData.timestamp = player1.j2s_realPlayVideoTime();

	            try {

	                if ($scope.pkey && $scope.pkey.length > 0) {
	                    $http.post("../api/videoPlay", postData).success(function (data) {
	                        //console.log("videoPlay", data);
	                        if (data && !data.code) {
	                            moethodError("播放参数错误【错误码：002】", data.message, "O_func", "", 0, postData);
	                            videoError(errorMessage);
	                        }
	                        //console.log("sec1", sec1);
	                        if (sec1) {
	                            $scope.studytime = sec1;
	                        }
	                        $scope.stuPlayDetailCount = 1;
	                        //console.log("$scope.stuPlayDetailCount", $scope.stuPlayDetailCount);
	                    }).error(function (ex, status) {
	                        moethodError(ex + "【错误码：003】", ex, "O_func", "", 0, postData);
	                        if (status && status == 401)
	                            videoError("会话超时，请重新登陆。");
	                    });
	                }

	                //console.log("$scope.studytime", $scope.studytime);
	                //console.log("$scope.stuPlayDetailCount=" + $scope.stuPlayDetailCount);
	                //console.log("time=" + sec1);
	                //console.log("timestamp=" + player1.j2s_realPlayVideoTime());
	                //console.log("videoDuration=" + $scope.nowVideoDuration);
	                //console.log("$scope.course.videotype", $scope.course.videotype);
	                if ($scope.course.videotype > 0) {
	                    var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
	                    if (sec1 != sec2) {
	                        player2.j2s_seekVideo(sec1);
	                    }
	                }
	            }
	            catch (ex) {
	                moethodError(ex.message + "【错误码：004】", ex.stack, "O_func", "", 0, postData);
	                videoError(errorMessage);
	            }
	        }
	        else {
	            var mess = "";
	            if (player1 == undefined) mess += " player1 is undefined, ";
	            if (player1.j2s_getCurrentTime == undefined)
	                mess += " player1.j2s_getCurrentTime is undefined, ";
	            else
	                mess += " player1.j2s_getCurrentTime:" + player1.j2s_getCurrentTime();
	            if (player1.j2s_realPlayVideoTime == undefined)
	                mess += " player1 j2s_realPlayVideoTime is undefined, ";
	            else
	                mess += " player1.j2s_realPlayVideoTime:" + player1.j2s_realPlayVideoTime();
	            moethodError(mess + "【错误码：005】", "", "O_func", "", 0, postData);
	            videoError(errorMessage);
	        }
	    }

		//视频暂停
	    s2j_onVideoPause = function () {
	        if (player1 != undefined && player1.j2s_pauseVideo != undefined) {
	            player1.j2s_pauseVideo();
	            if ($scope.course.videotype > 0) {
	                if (player2 != undefined && player2.j2s_pauseVideo != undefined)
	                    player2.j2s_pauseVideo();
	            }
	            clearInterval(obj);
	        }
	    }

	    //定义全局暂停,打开微视频时停止课程视频播放
	    $rootScope.stopVideo = function () {
	        s2j_onVideoPause();
	    }

	    $scope.change = function () {
	        if ($(".video-f").hasClass("change")) {
	            //视频变大屏
	            player1.j2s_showUI();//显示皮肤
	            player1.j2s_showRightPanel();//显示右侧栏
	            player2.j2s_banUI();//隐藏皮肤
	            player2.j2s_hideRightPanel();//隐藏右侧栏
	            $(".video-f").removeClass('change');
	        } else {
	            //视频变小屏
	            player1.j2s_banUI();
	            player2.j2s_showUI();
	            player1.j2s_hideRightPanel();
	            player2.j2s_showRightPanel();
	            $(".video-f").addClass('change');
	        }
	        if ($(".video-s").hasClass("change")) {
	            //ppt变大屏
	            $(".video-s").removeClass('change');
	        } else {
	            //ppt变小屏
	            $(".video-s").addClass('change');
	        }
	    };

	    var videoError = function (showmessage) {
	        clearInterval(obj);
	        s2j_onVideoPause();
	        alert(showmessage);
	        location.reload(true);
	    }
	}]);