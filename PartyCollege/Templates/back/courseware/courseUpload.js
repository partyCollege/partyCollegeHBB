angular.module("myApp")
.controller("courseUploadController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.course.videofile = file;
        $scope.process_videofile = 0;
    }

    $scope.saveviewfale = false;

    //保存课件
    $scope.saveVideoInfo = function () {
        if ($scope.course.teachervideo == "") {
            notify({ message: '请上传编辑后的课件！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        getDataSource.getDataSource("update_sy_courseware_video_info", {
            coursewareid: $stateParams.id, teachervideo: $scope.course.teachervideo,
            pptvideo: $scope.course.pptvideo, teachervideoname: $scope.course.teachervideoname,
            pptvideoname: $scope.course.pptvideoname
        }, function (data) {
            if ($scope.saveviewfale) {
                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
            $scope.saveviewfale = true;
        })
    }

    //课件提交
    $scope.commitEditCourse = function () {
        $scope.saveviewfale = false;
        $scope.saveVideoInfo();
        getDataSource.getUrlData("../api/courseMainStatus", {
            coursewareids: $stateParams.id, mainstatus: 5, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件编辑", nextstep: "课件完善", operationcontent: ($rootScope.user.name + "已提交编辑后的课件，等待完善课件").toString()
        }, function (data) {
            if (data) {
                notify({ message: '提交成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.goback();
            }
            else
                notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '提交失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
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
        var options = {
            endpoint: 'http://v.polyv.net:1080/files/',
            resetBefore: $('#reset_before').prop('checked'),
            resetAfter: false,
            title: "title",
            desc: "desc",
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
}]).controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);