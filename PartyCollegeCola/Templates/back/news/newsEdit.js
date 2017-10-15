angular.module("myApp")
.controller("newsEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    $scope.news = { file_servername: "", videofile: {}, videotype: 0, category: 1, istop: 1 };

    $scope.ueditorConfig = {
    	//这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
    	toolbars: [
            [
                //'undo', //撤销
                //'redo', //重做
                //'bold', //加粗
                //'indent', //首行缩进
                //'snapscreen', //截图
                //'italic', //斜体
                //'underline', //下划线
                //'strikethrough', //删除线
                //'subscript', //下标
                //'fontborder', //字符边框
                //'superscript', //上标
                //'formatmatch', //格式刷
                //'source', //源代码
                //'blockquote', //引用
                //'pasteplain', //纯文本粘贴模式
                //'selectall', //全选
                //'horizontal', //分隔线
                //'removeformat', //清除格式
                //'time', //时间
                //'date', //日期
                //'fontfamily', //字体
                //'fontsize', //字号
                //'paragraph', //段落格式
                ////'simpleupload', //单图上传
                //'insertimage', //多图上传
                ////'edittable', //表格属性

                //'inserttable', 'edittable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols',

                //'edittd', //单元格属性
                //'link', //超链接
                //'justifyleft', //居左对齐
                //'justifyright', //居右对齐
                //'justifycenter', //居中对齐
                //'justifyjustify', //两端对齐
                //'forecolor', //字体颜色
                //'insertorderedlist', //有序列表
                //'insertunorderedlist', //无序列表
                //'directionalityltr', //从左向右输入
                //'directionalityrtl', //从右向左输入
                //'rowspacingtop', //段前距
                //'rowspacingbottom', //段后距
                //'imagenone', //默认
                //'imageleft', //左浮动
                //'imageright', //右浮动
                //'attachment', //附件
                //'imagecenter', //居中
                //'wordimage', //图片转存
                //'lineheight', //行间距
                //'edittip ', //编辑提示
                //'touppercase', //字母大写
                //'tolowercase', //字母小写

                'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'edittable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
            ]
    	],
    	//focus时自动清空初始化时的内容
    	autoClearinitialContent: true,
    	//关闭字数统计
    	wordCount: false,
    	//关闭elementPath
    	elementPathEnabled: false,
    	enableAutoSave: false,
    	autoSyncData: false
    }

    $scope.uploadFiles = function (files) {
        $scope.files = files;
        //$scope.save();
    }
    var load = function () {
        if ($stateParams.id) {
            getDataSource.getDataSource("selectNewsById", { id: $stateParams.id }, function (data) {
                $scope.news = data[0];
                $scope.nowfile = FilesService.showFile("newsPhoto", $scope.news.file_servername, $scope.news.file_servername);
            });
        }
    };

    $scope.ready = function (editor) {
    	//$scope.loadSyCodeData();
    	load();
    }

    $scope.saveDisabled = false;
    $scope.save = function (optype) {
    	$scope.saveDisabled = true;
    	if ($scope.files) {

            //FilesService.upLoadFiles($scope.files[0], "newsPhoto", function (data) {
            FilesService.upLoadPicture($scope.files[0], { upcategory: "newsPhoto", width: 585, height: 361 }, function (data) {
                $scope.news.file_servername = data.data[0].servername;
                $scope.news.file_serverthumbname = data.data[0].servername.replace('.', '_small.');
                doSaveData(optype);
            }, function (error) { $scope.saveDisabled = false; });

        }
        else {
            //notify({ message: '请上传封面图片', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            doSaveData(optype);
        }
    }


    $scope.getFile = function () {
        if ($scope.news.file_servername != "") {
        }
    }
    var doSaveData = function (optype) {

        if ($stateParams.id) {
            //发布
            var msg = '保存成功';
            if (optype == "1") {
                $scope.news.status = 1;
                $scope.news.publishtime = new Date();
                msg = '发布成功';
            }
            //else {
            //    $scope.news.publishtime = null;
            //}
            getDataSource.getDataSource("updateNewsById", $scope.news, function (data) {
            	notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
            }, function (error) { $scope.saveDisabled = false; });
        }
        else {

            if ($scope.news.category == 1) {
                if ($scope.news.file_servername == "") {
                    notify({ message: '请上传封面图片', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.saveDisabled = false;
                    return;
                }
            }

            var newid = getDataSource.getGUID();
            $scope.news.id = newid;
            $scope.news.createuser = $rootScope.user.accountId;
            $scope.news.createtime = new Date();
            $scope.news.status = 0; //未发布
            $scope.news.clicknum = 0;
            $scope.news.platformid = $rootScope.user.platformid;

            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            $scope.news.departmentid = mid;

            // $scope.currentDate = DateService.format(date, "yyyy年MM月dd日") + "   " + DateService.getWeek(date);
            //id,title,content,creatuser,creattime,publishtime,status,filepath,abstract,source
            getDataSource.getDataSource("insertNews", $scope.news, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveDisabled = false;
                $state.go("index.newsEdit", { id: newid });
            }, function (error) { $scope.saveDisabled = false; });
        }
    }
    $scope.uploadvideoFiles = function (file, errFiles) {
        $scope.news.videofile = file;
        $scope.process_videofile = 0;
    }

    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
    $scope.openVideoPerview = function (type, vid) {
        perviewVideo(vid);
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

    var perviewDoubleVideo = function (news) {
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
                'vid': news.teachervideo,
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
                'vid': news.pptvideo,
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
        if ($scope.news.videotype > 0) {
            var sec2 = player2.j2s_getCurrentTime(); //视频2播放时间
            if (sec1 != sec2) {
                //console.log('小视频跳转至时间=' + sec1);
                player2.j2s_seekVideo(sec1);
            }
        }
    }

    s2j_onVideoPlay = function () {
        player1.j2s_resumeVideo();
        if ($scope.news.videotype > 0) {
            player2.j2s_resumeVideo();
        }
        clearInterval(obj);
        obj = setInterval(O_func, 5000);
    }
    s2j_onVideoPause = function () {
        player1.j2s_pauseVideo();
        if ($scope.news.videotype > 0) {
            player2.j2s_pauseVideo();
        }
        clearInterval(obj);
    }
    $scope.uploadvideo = function (type) {
        $scope.nowfile = $scope.news.videofile[0];
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec($scope.nowfile.name)[1];
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
              $scope.news.videopath = url.substring(url.lastIndexOf("/") + 1);
              $scope.news.videoname = file.name;
          }
          else {
              $scope.news.videopath = url.substring(url.lastIndexOf("/") + 1);
              $scope.news.videoname = file.name;
          }

          $scope[type + 'vid'] = url.substring(url.lastIndexOf("/") + 1);
          $scope.$apply();
      });
    }
}]).controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);