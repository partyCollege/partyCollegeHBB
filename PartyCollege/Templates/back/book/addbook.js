angular.module("myApp")
.controller("addbookController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    '$modal',
    '$timeout',
    '$state',
    'notify',
    "FilesService", 'DateService', function ($scope, $rootScope, getDataSource, $stateParams, $modal, $timeout, $state, notify, FilesService, DateService) {

        $scope.book = {
            defaultCover: "../img/defaultcover.jpg",
            coverObj: null,
            cover_servername: null,
            cover_serverthumbname: null,
            bookname: "",
            author: "",
            comment: "",
            foreword: "",
            authorcomment: "",
            catalog: "",
            publishtime: "",
            publishcompany: "",
            videopath: "",
            videoname:"",
            status: 0,
            istop:false,
            platformid: $rootScope.user.platformid,
            id: getDataSource.getGUID()
        };



        $scope.videofile = {
            files: [], 
            process: 0
        };

        //操作状态
        $scope.optstatus = {
            issuccess: false,//视频是否上传成功
            issave: false,//是否保存,
            iscoverchanged: false,//图书封面是否改变 
        };

        var sid = $stateParams.id; 
        if (sid) {
            $scope.optstatus.ismodify = true;

            getDataSource.getDataSource("getBookInfo", {id : sid}, function (data) {
                $scope.book = _.merge($scope.book, data[0]);
                $scope.book.coverObj = FilesService.showFile("bookPhoto", $scope.book.cover_servername, $scope.book.cover_servername);
                $scope.book.istop = $scope.book.istop == 0 ? false : true;
                $scope.optstatus.issave = true;
                $scope.optstatus.issuccess = true;

            }, function (e) { CommonService.alert("数据加载失败！"); });
        }

        var popupAlert = function (msg) { 
            notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }

        //选择图书封面
        $scope.changedCover = function (files, errors) {

            if (files.length > 0) {
                if ($scope.book.coverObj) {
                    $scope.optstatus.iscoverchanged = true;
                }
                $scope.book.coverObj = files[0];
            }

        }
        //选择视频
        $scope.uploadvideoFiles = function (files, errors) {

            if (files.length > 0) {
                $scope.videofile.files = files;
            }

        }

        //上传视频文件
        $scope.uploadvideo = function () {
            if ($scope.videofile.files.length > 0) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec($scope.videofile.files.name)[1];
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

                upload = polyv.upload($scope.videofile.files[0], options)
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
                  $scope.videofile.process = percentage;
                  $scope.$apply();
                  //console.log(bytesUploaded, bytesTotal, percentage + '%');
              })
              .done(function (url, file) {
                  $scope.optstatus.issuccess = true;
                  $scope.book.videoname = file.name;
                  $scope.book.videopath = url.substring(url.lastIndexOf("/") + 1);  
                  $scope.$apply();
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
                    'vid': $scope.book.videopath
                });

            }, 0);
        }

        //回到列表
        $scope.golist = function () {
            $state.go("index.booklist");
            //$scope.videofile.issuccess = !$scope.videofile.issuccess;
        }

        //上传图书封面
        $scope.uploadCover = function (callaback) {

            FilesService.upLoadPicture($scope.book.coverObj, { upcategory: "bookPhoto", width: 130, height: 184 }, function (data) {
                //上传成功，并且服务器返回有数据
                if (data.status == "200" && data.data.length >= 1) {

                    var fArr = data.data[0].servername.split(".");
                    $scope.book.cover_serverthumbname = fArr[0] + "_small." + fArr[1];
                    $scope.book.cover_servername = fArr[0] + "." + fArr[1];
                    $scope.optstatus.iscoverchanged = false;

                    if (callaback) {
                        callaback();
                    }
                } else {
                    CommonService.alert("教材封面照片上传失败");
                }
            });
        }

    	//保存
        $scope.saveDisabled = false;
        $scope.save = function () {
        	$scope.saveDisabled = true;

            var dosave = function () {

                $scope.book.createuser = $rootScope.user.name;
                $scope.book.createdate = DateService.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                $scope.book.status = 1;
                var exec = !$scope.optstatus.issave ? "back_savebook" : "back_updatebook";
                getDataSource.getDataSource(exec, $scope.book, function (data) {
                	$scope.saveDisabled = false;
                    if (data && data[0].crow > 0) {
                        $scope.optstatus.issave = true;
                        popupAlert("保存成功！");
                    }

                }, function (e) {
                	$scope.saveDisabled = false;
                    popupAlert("保存失败！");
                });
            }

            if ($scope.optstatus.iscoverchanged) {
                $scope.uploadCover(function () { dosave(); });
            } else {
                dosave();
            }
        }

        //发布
        $scope.submit = function () {

            $scope.book.publishuser = $rootScope.user.name;
            $scope.book.publishdate = DateService.format(new Date(), "yyyy-MM-dd hh:mm:ss");
            $scope.book.status = 1;

            getDataSource.getDataSource("back_submitbook", $scope.book, function (data) {

                if (data && data[0].crow > 0) {
                    popupAlert("发布成功！");
                    //$scope.golist();
                }

            }, function (e) {
                popupAlert("发布失败！");
            });

        }

        $scope.cancelsubmit = function () {

            $scope.book.publishuser = null;
            $scope.book.publishdate = null;
            $scope.book.status = 0;

            getDataSource.getDataSource("back_cancelsubmitbook", { id: $scope.book.id }, function (data) {

                if (data && data[0].crow > 0) {
                    popupAlert("取消发布成功！"); 
                }

            }, function (e) {
                popupAlert("取消发布失败！");
            });
        }
    }
]);




