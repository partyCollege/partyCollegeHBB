angular.module("myApp")
.controller("courseInforController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    var obj = {};
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
    getDataSource.getDataSource("selectAllTeacher", { platformid: $rootScope.user.platformid }, function (data) {
        $scope.allTeachers = data;
    });
    $scope.gridOptions = {};
    $scope.gridXXOptions = {};


    $scope.uploadpptFiles = function (file, errFiles) {
        $scope.course.temppptfile = file;
        $scope.process_pptfile = 0;
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.goback = function () {
        $state.go("index.coursewarelist", { type: $stateParams.type });
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }
    $scope.saveCourseInfo = function () {
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

        if ($scope.course.name == undefined || $scope.course.name == "") {
            notify({ message: '请输入课件名称！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        if ($scope.course.tempteachervideofilename == undefined || $scope.course.tempteachervideofilename == "") {
            notify({ message: '请选择课件信息！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }

        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
            getDataSource.getDataSource("update_sy_coursewareById", $scope.course, function (data) {
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
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            $scope.course.createtime = new Date();
            getDataSource.getDataSource("insert_sy_courseware_info", $scope.course, function (data) {
                $scope.saveButtonDisabled = false;
                $state.go("index.courseEdit", { id: newid });
                //$state.go("index.coursewareEdit", { id: newid });
            });
        }
    }

    $scope.commitCourseInfo = function () {
        if ($scope.course.id) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 1, operationuser: $rootScope.user.name, currentstep: "课件上传", nextstep: "课件分配", operationcontent: ($rootScope.user.name + "已提交课件，等待分配审核").toString()
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
    }


    var insertCourseRelation = function (coursewareid) {
        var teachers = [];
        angular.forEach($scope.course.teachers, function (item) {
            teachers.push({
                id: getDataSource.getGUID(),
                coursewareid: coursewareid,
                sourceid: item.id,
                type: 0
            });
        });

        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 0 }, function (data) {
            if (data) {
                getDataSource.doArray("insert_sy_course_relation", teachers, function (data) {
                });
            }
        });
    }
    //加载审核小组
    $scope.gridExamineOptions = {};
    $scope.loadExamineUser = function () {
        $scope.gridExamineOptions = {
            useExternalPagination: false,
            useExternalSorting: false,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            data: [],
            columnDefs: [
              { name: "姓名", field: "name", width: '99%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridExaminesApi = gridApi;
            }
        };
    }
    $scope.loadExamineUser();
    //获取审核小组用户
    $scope.loadExamineData = function () {
        getDataSource.getDataSource("select_sy_user_examine", { coursewareid: $stateParams.id }, function (data) {
            $scope.gridExamineOptions.data = data;
        })
    }
    //加载审核用户
    if ($scope.courseware.courseExamineShow)
        $scope.loadExamineData();


    //打开选人页面
    $scope.OpenUserInfo = function () {
        getDataSource.getDataSource("select_sy_user_examine", { platformid: $rootScope.user.platformid }, function (data) {
            $scope.gridExamineOptions.data = data;
            $scope.modalInstance = $modal.open({
                templateUrl: 'examinePerview.html',
                size: 'lg',
                scope: $scope
            });
        })
    }

    //分配
    $scope.distributionCourseware = function () {
        var ids = $stateParams.id;
        //获取审核人
        var selectUser = $scope.gridExaminesApi.selection.getSelectedRows();
        getDataSource.getDataSource("insert_sy_courseware_operation", { ids: ids, userid: selectUser[0].id, username: selectUser[0].name, idss: ids }, function (data) {
            getDataSource.getUrlData("../api/courseMainStatus", {
                coursewareids: $stateParams.id, mainstatus: 2, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分配", nextstep: "课件审核", operationcontent: ($rootScope.user.name + "已分配课件给" + selectUser[0].name + "，等待审核").toString()
            }, function (data) {
                if (data) {
                    notify({ message: '分配成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    $scope.goback();
                }
                else
                    notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (errortemp) {
                notify({ message: '分配失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        })

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
                'vid': course.tempteachervideo,
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
                'vid': course.temppptvideo,
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
              $scope.course.tempteachervideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.tempteachervideofilename = file.name;
          }
          else {
              $scope.course.temppptvideo = url.substring(url.lastIndexOf("/") + 1);
              $scope.course.temppptvideofilename = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);