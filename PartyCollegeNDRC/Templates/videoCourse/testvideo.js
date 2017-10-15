app.controller("testvideoController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService) {
		var player1 = {};
		var player2 = {};

		var getVideoInfo = function (data) {
			$scope.nowVideoDuration = data.data[0].duration;
		}
		window.getVideoInfo = getVideoInfo;

		var player1Obj = {};
		var player2Obj = {};

		player1Obj = {
			'width': '100%',
			'height': '100%',
			'vid': '873c41fa7561027fb25cf2c6797f5252_8',
			'flashvars': {
				"autoplay": "false",
				"teaser_time": "0",
				"setScreen": "16_9",
				"history_video_duration": "10",
				"setVolumeM": "1",
				"ban_ui": "off",
				"ban_control": "off",
				"is_auto_replay": "off",
				"ban_skin_progress_dottween": "on"
			}
		};
		player2Obj = {
			'width': '100%',
			'height': '100%',
			'vid': '873c41fa7561027fb25cf2c6797f5252_8',
			'flashvars': {
				"autoplay": "false",
				"teaser_time": "0",
				"setScreen": "16_9",
				"history_video_duration": "10",
				"setVolumeM": "1",
				"ban_ui": "off",
				"ban_control": "off",
				"is_auto_replay": "off",
				"ban_skin_progress_dottween": "on"
			}
		};
		player1 = polyvObject('#mainVideo').videoPlayer(player1Obj);
		player2 = polyvObject('#mainVideo').videoPlayer(player2Obj);



		s2j_onVideoPlay = function () {
			player1.j2s_resumeVideo();
			//if ($scope.course.videotype > 0) {
			//	player2.j2s_resumeVideo();
			//}
			//clearInterval(obj);
			obj = setInterval(O_func, 6000);
		}

		var O_func = function () {

			var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间;
			//console.log("视屏播放时间" + sec1);
			//console.log("视屏播放时间" + new Date());
			//记录播放

			//校友观看视频是 studentid为null,calssid 为空。
			$http.post("../api/videoPlay", {
				studentid: $rootScope.user.studentId,
				time: sec1, classcourseid: $stateParams.classcourseid,
				currentID: $scope.currentPlayID,
				timestamp: player1.j2s_realPlayVideoTime(),
				videoDuration: $scope.nowVideoDuration,
				coursewareid: $stateParams.coursewareid,
				accountid: $rootScope.user.accountId,
				usertype: $rootScope.user.userType
			}, function () {

			});

			//console.log("time=" + sec1);
			//console.log("timestamp=" + player1.j2s_realPlayVideoTime());
			//console.log("videoDuration=" + $scope.nowVideoDuration);

			if ($scope.course.videotype > 0) {
				var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
				if (sec1 != sec2) {
					player2.j2s_seekVideo(sec1);
				}
			}

		}
	}]);