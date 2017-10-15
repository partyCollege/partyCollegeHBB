angular.module("myApp")
.controller("microVideoEditController", ['$window', '$scope', '$rootScope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "FilesService", "CommonService",
function ($window, $scope, $rootScope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, FilesService, CommonService) {
    $scope.saveButtonDisabled = false;
    $scope.microVideo = {};
    $scope.uploadvideoFiles = function (file, valfile) {
        $scope.microVideo.videofile = file;
    }
    $scope.uploadFiles = function (files) {
        $scope.files = files;
    }

	//如果是共享的课程，那么分平台是不能删除和修改的。
    $scope.saveIsShareButtonDisabled = false;

    if ($stateParams.id)
    {
        getDataSource.getDataSource("select_sy_microVideoById", { id: $stateParams.id }, function (data) {
            $scope.microVideo = data[0];
            $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.microVideo.photo_servername, $scope.microVideo.photo_servername);

            if ($scope.microVideo.isshare == 1) {
            	$scope.saveIsShareButtonDisabled = true;
            	CommonService.initInputControlDisabled();
            }
        });
    }
    //上传文件
    $scope.uploadvideo = function () {
        if ($scope.microVideo.videofile.length>0) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec($scope.microVideo.videofile.name)[1];
            var ts = new Date().getTime();
            var newhash = md5(ts + $rootScope.appConfig.vhallConfig.writeToken);
            var options = {
                endpoint: $rootScope.appConfig.vhallConfig.uploadPath,
                resetBefore: $('#reset_before').prop('checked'),
                resetAfter: false,
                title: "title",
                desc: "desc",
                ext: ext,
                ts: ts,
                hash: newhash,
                userid: $rootScope.appConfig.vhallConfig.userid,
                writeToken: $rootScope.appConfig.vhallConfig.writeToken
            };


            $('.progress').addClass('active');

            upload = polyv.upload($scope.microVideo.videofile[0], options)
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
              $scope.process = percentage;
              $scope.$apply();
              //console.log(bytesUploaded, bytesTotal, percentage + '%');
          })
          .done(function (url, file) {
              $scope.microVideo.videoname = file.name;
              $scope.microVideo.videopath= url.substring(url.lastIndexOf("/") + 1);
          });
        }
    }
    //关闭弹出窗口
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    //视频预览
    $scope.openVideoPerview = function () {
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
                'vid': $scope.microVideo.videopath
            });

        }, 0);
    }
    $scope.goback = function () {
        $state.go("index.microVideo");
    }
    $scope.save = function () {
        if ($scope.files) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "coursewarePhoto", width: 310, height: 190 }, function (data) {
                $scope.microVideo.photo_servername = data.data[0].servername;
                doSaveData();
            });
        }
        else {
            doSaveData();
        }


    }
    var doSaveData = function () {
        
        $scope.saveButtonDisabled = true;
        if ($stateParams.id) {
        	getDataSource.getDataSource("update_sy_microVideo", $scope.microVideo, function (data) {
        		$scope.saveButtonDisabled = false;
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        	}, function (error) {
        		$scope.saveButtonDisabled = false;
        	});
        }
        else {
            $scope.microVideo.createtime = new Date();
            $scope.microVideo.id = getDataSource.getGUID();
            $scope.microVideo.createuser = $rootScope.user.name;
            $scope.microVideo.platformid = $rootScope.user.platformid;
            $scope.microVideo.microvideoid = $scope.microVideo.id;
            $scope.microVideo.isshare = 0;

            getDataSource.getDataSource(["insert_sy_microVideo"], $scope.microVideo, function (data) {
                $scope.saveButtonDisabled = false;
                $state.go("index.microVideoEdit", { id: $scope.microVideo.id });
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }, function (error) {
            	$scope.saveButtonDisabled = false;
            });
        }
    }
}]);