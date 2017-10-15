angular.module("myApp")
.controller("recommendcourseEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify'
	, '$state', '$http', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state
		, $http, drawTable, CommonService, FilesService) {
	$scope.course = { teachers: [], videotype: 0 };
	$scope.isNew = true;

	
    
    $scope.st = {};
    $scope.checkedAnswer = {};
    $scope.nowid = $stateParams.id;
    $scope.type = $stateParams.type;
    $scope.typeShow = true;
    if ($scope.type == "1")
        $scope.typeShow = false;
    $scope.saveButtonDisabled = false;
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }


    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }

    


    if ($stateParams.id) {
    	$scope.isNew = false;
        getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation", "getKeywordByCourseId"], { id: $stateParams.id, coursewareid: $stateParams.id }, function (data) {
            var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
            $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
            $scope.course.teachers = teachrRelation.data;
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);

            var courseKeyword = _.find(data, function (o) { return o.name == "getKeywordByCourseId"; }).data;

            $scope.course.courseKeywordOne = _.filter(courseKeyword, function (n) { return n.category == '关键词（一级）' });
            $scope.course.courseKeywordTwo = _.filter(courseKeyword, function (n) { return n.category == '关键词（二级）' });

        	//如果是共享的课程，那么分平台是不能删除和修改的。
            $scope.saveIsShareButtonDisabled = false;
            if ($scope.course.isshare == 1) {
            	$scope.saveIsShareButtonDisabled = true;
            	CommonService.initInputControlDisabled();
            }
        });
    }

  
    $scope.goback = function () {
        if ($scope.type == "1")
            $state.go("index.alumnusCourseware");
        else
            $state.go("index.courseware");
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }
    $scope.save = function () {
        //保存封面图
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 200, height: 120 }, function (data) {
                $scope.course.imagephoto = data.data[0].servername;
                doSave();
            });
        }
        else {
            doSave();
        }

    }
    var doSave = function () {
        $scope.saveButtonDisabled = true;
        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
            insertCourseKeyWordRelation($stateParams.id);
            getDataSource.getDataSource("updateCoursewareById", $scope.course, function (data) {
                $scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (data) {
                notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveButtonDisabled = false;
            });
        }
        else {
            var newid = getDataSource.getGUID();
            $scope.course.id = newid;
            insertCourseRelation(newid);
            insertCourseKeyWordRelation($stateParams.id);
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            $scope.course.createtime = new Date();
            getDataSource.getDataSource("insertCourseware", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	
            	var pkgcse = new Object();
            	pkgcse.platformid = $rootScope.user.platformid;
            	pkgcse.coursewareid = newid;
            	pkgcse.coursewarename = $scope.course.name;
            	pkgcse.isshare = 0;

            	getDataSource.getDataSource("insertPkgCourseware", pkgcse, function (data) {
            		$state.go("index.coursewareEdit", { id: newid });
            	}, function (error) { });
            });
        }
    }
    


    //打开视频预览弹窗
    $scope.openVideoPerview = function (type, vid) {
        if ($scope.course.videotype == 0) {
            perviewVideo(vid);
        }
        else {
            perviewDoubleVideo($scope.course);
        }

    }
    var perviewVideo = function (vid) {
        //console.log(vid);
        $scope.modalInstance = $modal.open({
            templateUrl: 'videoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player = polyvObject('#divVideo').videoPlayer({
                'width': '850',
                'height': '490',
                'vid': vid
            });
        }, 0);
    }
  


    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };

    var perviewDoubleVideo = function (course) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'doubluevideoPerview.html',
            size: 'lg',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $timeout(function () {
            player1 = null;
            player2 = null;
            player1 = polyvObject('#doubleTeacher').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.teachervideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });

            player2 = polyvObject('#doublePPT').videoPlayer({
                'width': '100%',
                'height': '560',
                'vid': course.pptvideo,
                'flashvars': {
                    "autoplay": "true",
                    "teaser_time": "0",
                    "start": "0",
                    "setScreen": "fill",
                    "setVolumeM": "0",
                    "ban_ui": "off",
                    "ban_control": "off",
                    "is_auto_replay": "on",
                    "ban_seek_by_limit_time": "off",
                    "ban_skin_progress_dottween": "on"
                }
            });
        }, 0);
    }

    var O_func = function () {
        var sec1 = player1.j2s_getCurrentTime(); //视频1播放时间
        if ($scope.course.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.course.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        if (type == 'videofile') {
            $scope.nowfile = $scope.course.videofile[0];
        }
        else {
            $scope.nowfile = $scope.course.pptfile[0];
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
        var ts = new Date().getTime();
        var newhash=md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
        var options = {
            endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
            ts: ts,
            hash: newhash,
            userid: $rootScope.appConfig.vhallConfig.userid,
            ext: ext,
            writeToken: $rootScope.appConfig.vhallConfig.writeToken
        };


        $('.progress').addClass('active');

        upload = polyv.upload($scope.nowfile, options)
      .fail(function (error) {
          alert('Failed because: ' + error);
      })
      .always(function () {
          //$input.val('');
          //$('.js-stop').addClass('disabled');
          //$('.progress').removeClass('active');
      })
      .progress(function (e, bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          //$('.progress .bar').css('width', percentage + '%');
          $scope["process_" + type] = percentage;
          $scope.$apply();
          //console.log(bytesUploaded, bytesTotal, percentage + '%');
      })
      .done(function (url, file) {
      		//console.log(file);
          if (type == "videofile") {
              $scope.course.teachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.teachervideoname = file.name;
          }
          else {
              $scope.course.pptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.pptvideoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);