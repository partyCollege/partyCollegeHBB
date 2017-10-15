app.controller("pptplayController", ["$scope", "$rootScope", "$stateParams", "getDataSource", "$timeout", "$interval", "$http", "CommonService", "SessionService", "GetFileService"
	, function ($scope, $rootScope, $stateParams, getDataSource, $timeout, $interval, $http, CommonService, SessionService, GetFileService) {
		$scope.pageindex = 1;
		$scope.enableGoUppage = false;
		$scope.enableGoDownpage = false;

		$scope.currentPlayID = getDataSource.getGUID();

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
					$scope.pageindex = $scope.studytime;
					if ($scope.pageindex == 0) $scope.pageindex = 1;
					$scope.isplaycompletion = stuPlayTime[0].isplaycompletion;
				}
				if (courwareStudytime[0]) {
					$scope.courwarestudytime = courwareStudytime[0].studytime;
				}
				getDataSource.getDataSource("selectCoursewareById", { id: $stateParams.coursewareid }, function (data) {
					$scope.course = data[0];
					$scope.nowVideoDuration = $scope.course.realduration;
					$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
					$scope.enableGoUppage = false;
					$scope.enableGoDownpage = false;
					$scope.goDownpageText = "下一页";

					//获取sy_video_log主键
					getDataSource.getUrlData("../api/getVideoLogPKey",
						{ studentid: $rootScope.user.studentId, coursewareid: $stateParams.coursewareid }
						, function (data) {
							if (data.code) {
								var pkey = data.pkey;
								if (pkey.length > 0) {
									$scope.isGetPKey = true;
									$scope.pkey = pkey;
									if (!$scope.$$phase) {
										$scope.$apply();
									}
								}
							}
						}, function (error) {
							alert(errorMessage);
						});
				});
		}, function (error) {
			alert(errorMessage);
		});

		$scope.gouppage = function () {
			$scope.pageindex--;
			if ($scope.pageindex < 1) {
				$scope.pageindex = 1;
				$scope.enableGoUppage = true;
				$scope.enableGoDownpage = false;
			}
			$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
		}

		var waiteSenconds=5;
		var intervalFunc = function () {
			$scope.$apply(function () {
				$scope.goDownpageText = "等待" + waiteSenconds-- + "s";
			});
			if (waiteSenconds < 0) {
				clearInterval(intervalObj);
				waiteSenconds = 5;
				$scope.$apply(function () {
					$scope.enableGoDownpage = false;
					$scope.goDownpageText = "下一页";
				});
			} else {
				$scope.enableGoUppage = true;
			}
		};
		var intervalObj = {};
		

		$scope.godownpage = function () {

			if ($scope.enableGoDownpage) {
				return;
			}
			$scope.pageindex++;
			if ($scope.pageindex >= parseInt($scope.course.realduration)) {
				$scope.pageindex = parseInt($scope.course.realduration);
				$scope.enableGoDownpage = true;
			} else {
				$scope.enableGoDownpage = false;
			}

			//第一次未学习完成，则点击下一页，需要等待5s
			//如果没有看完需要限制拖动
			if ($scope.isplaycompletion != 1) {
				if (!$scope.enableGoDownpage) {
					$scope.enableGoDownpage = true;
					clearInterval(intervalObj);
					intervalObj = setInterval(intervalFunc, 1000);
				}
			}

			$scope.loadPPTCoursewareImg($scope.pageindex, $scope.course.pptcoursefile_servername);
			O_func();
		}

		$scope.pptimgfileobj = {};

		$scope.loadPPTCoursewareImg = function (pageindex, pptcoursefile_servername) {
			getDataSource.getUrlData("../api/getPPTVideoCourse", { pageindex: pageindex, pptcoursefile_servername: pptcoursefile_servername }, function (data) {
				$scope.pptimgfileobj = data;
			}, function (error) {

			});
		}

		//提交数据
		var O_func = function () {
			var postData = {
				pkey: $scope.pkey,
				studentid: $rootScope.user.studentId,
				time: $scope.pageindex,
				currentID: $scope.currentPlayID,
				timestamp: $scope.pageindex,
				videoDuration: $scope.nowVideoDuration,
				coursewareid: $stateParams.coursewareid,
				videotype: $scope.course.videotype,
				accountid: $rootScope.user.accountId,
				studytime: $scope.studytime,
				studetailcount: $scope.stuPlayDetailCount,
				courwarestudytime: $scope.courwarestudytime,
				coursewarename: $scope.course.name
			};
			//console.log("postData", postData);
			//return;
			if ($scope.pkey && $scope.pkey.length > 0) {
				$http.post("../api/videoPlay", postData).success(function (data) {
					if (data && !data.code) {
						//videoError(errorMessage);
					}
					$scope.studytime = $scope.pageindex;
					$scope.stuPlayDetailCount = 1;
				}).error(function (ex, status) {
				});
			}
		}
	}]);