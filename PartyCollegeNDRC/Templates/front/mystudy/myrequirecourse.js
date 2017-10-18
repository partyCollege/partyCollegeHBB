app.controller("myrequirecourseController", ['$scope', '$rootScope', '$document', '$http', 'getDataSource', 'FilesService', 'CommonService', 'DateService', function ($scope, $rootScope, $document, $http, getDataSource, FilesService, CommonService, DateService) {
    //我的必修课
    $document[0].title = _.find($rootScope.myStudyLinks, { id: "1002" }).title;
    //弧形进度条
    $(function () {
        $('#class_indicatorContainer').radialIndicator({
            barColor: '#227700',
            barBgColor: '#FFFFFF',
            barWidth: 3,
            initValue: 100,
            roundCorner: true,
            percentage: true,
            displayNumber: false,
            radius: 77
        });


        $('#my_indicatorContainer').radialIndicator({
            barColor: '#EE8800',
            barBgColor: '#FFFFFF',
            barWidth: 6,
            initValue: 100,
            roundCorner: true,
            percentage: true,
            displayNumber: false,
            radius: 54
        });
    });

    $scope.myConfig = {
        imgShow: false,
        img: {},
        imgUrl: "",
        imgList: [],
        moreShow: false,
        imageType: "",
        interflowBtnShow: false,
        showStudentList: { look: false, select: function () { this.look = !this.look; } },
        coursemoreShow: false
    };

    //----------班级信息,班级资料，学员进度排名-------

    $scope.classAndMyStudyRate = { class_rate: 0, student_rate: 0 };
    var postData = {
        id: $rootScope.user.classId,
        studentid: $rootScope.user.studentId,
        classid: $rootScope.user.classId,
        classid1: $rootScope.user.classId,
        classid2: $rootScope.user.classId,
        classid3: $rootScope.user.classId,
    };

    getDataSource.getDataSource(["getClassInfoById", "getClassStudyRateTop4", "myclass-studyMaterials", "getClassAndMyStudyRate"],
        postData,
        function (data) {
            $scope.classInfo = _.find(data, { name: "getClassInfoById" }).data[0];
            $scope.studyrateTop4 = _.find(data, { name: "getClassStudyRateTop4" }).data;

            //学习资料
            var studyMaterials = _.find(data, { "name": "myclass-studyMaterials" }).data;
            if (studyMaterials.length > 0) {
                var types = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "jpg", "png", "gif", "bmp", "txt"];
                for (var i = 0; i < studyMaterials.length; i++) {
                    if (_.indexOf(types, studyMaterials[i].type) < 0) {
                        studyMaterials[i].type = "other";
                    }
                }
            }
            $scope.studyMaterialsData = studyMaterials;

            //班级，我的学习进度

            $scope.classAndMyStudyRate = _.find(data, { "name": "getClassAndMyStudyRate" }).data[0];

            setTimeout(function () {
                var class_radObj = $('#class_indicatorContainer').data('radialIndicator');
                class_radObj.animate(($scope.classAndMyStudyRate.class_rate * 100).toFixed(0));
                var my_radObj = $('#my_indicatorContainer').data('radialIndicator');
                my_radObj.animate(($scope.classAndMyStudyRate.student_rate * 100).toFixed(0));
            }, 300);
        },
        function (error) { })

    //下载文件
    $scope.downFiles = function (id, attachservername, attachname, type) {
        return FilesService.downApiFiles(type, attachservername, attachname);
    }


    //----------黑板报-------
    $scope.myInterval = 5000;
    var slideblackboard = $scope.slideblackboard = [];
    $scope.addSlide = function () {
        getDataSource.getDataSource("getClassBloackBoard", { classid: $rootScope.user.classId }, function (datatemp) {
            if (datatemp.length <= 0) {
                slideblackboard.push({ id: new Date().getTime(), src: '../img/myClass_banner.jpg' });
            }
            for (var i = 0; i < datatemp.length; i++) {
                var blackboardimg = FilesService.showFile("blackboard", datatemp[i].boardimg_servername, datatemp[i].boardimg_servername);
                slideblackboard.push({
                    id: datatemp[i].id,
                    src: blackboardimg
                });
            }
        }, function (errortemp) {

        });
    }
    $scope.addSlide();

    //------------------班级交流---------------

    //绑定表情
    $("#aCountenance").SinaEmotion($("#txtContent"));

    //解析表情
    function getCountenance(inputText) {
        return AnalyticEmotion(inputText);
    }

    //解析表情(回调)
    function getCountenanceCallback(inputText, type, id, fid, callback) {
        return AnalyticEmotionCallback(inputText, type, id, fid, callback);
    }

    //表情赋值(回调)
    var setModelValue = function (inputText, type, id, fid) {
        if (type == 1)
            _.find(_.find($scope.interflowData, { id: fid }).commentlist, { id: id }).commentcontent = inputText;
        else if (type == 0)
            _.find($scope.interflowData, { id: id }).content = inputText;
    }


    //默认头像
    $scope.defaultUserPhoto = "../img/default_img.png";
    $scope.defaultEventPhoto = "../img/course_img.jpg";

    //获取图片全路径
    $scope.getImg = function (photoserverfilename, photofilename, type) {
        return FilesService.showFile(type, photoserverfilename, photofilename);

    }

    //当前登录用户默认头像
    $scope.headImg = $rootScope.user.photopath ? $scope.getImg($rootScope.user.photopath, $rootScope.user.photopath, 'userPhoto') : $scope.defaultUserPhoto;

    $scope.files = [];
    $scope.selectFiles = function (files, errorfiles) {
        if ($scope.files.length > 6 || ($scope.files.length + files.length) > 6) {
            CommonService.alert("最多只能上传6张图片");
        }
        else {
            //console.log($scope.files);
            $scope.files = _.union($scope.files, files);
        }

        if (errorfiles && errorfiles.length > 0) {
            CommonService.alert("您选择的" + errorfiles.length.toString() + "张图片可能超过了大小限制,无法上传,单张图片最大为2MB", 3000);
        }

    };

    //删除已选择的图片
    $scope.deleFile = function (file) {
        _.remove($scope.files, function (n) {
            return n.$$hashKey == file.$$hashKey;
        });
    }
    //计算过去多久
    $scope.getDateDiff = function (dateTime) {
        return DateService.getDateDiff(DateService.getDateTimeStamp(dateTime));
    };


    //当前页
    $scope.currentPageIndex = 1;
    //页大小
    $scope.currentPageSize = 5;
    //班级交流数据
    $scope.interflowData = [];

    //加载更多
    $scope.loadMore = function () {
        loadInterflow("more");
    }


    //发布数量
    var insertCount = 0;

    var loadInterflow = function (type) {
        //班级交流
        getDataSource.getDataSource(["myclass-interflow", "myclass-interflow-commentList", "myclass-interflow-imgList"],
            {
                pageindex: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize: $scope.currentPageSize,
                pageindex1: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize1: $scope.currentPageSize,
                pageindex2: ($scope.currentPageIndex - 1) * $scope.currentPageSize + insertCount,
                pagesize2: $scope.currentPageSize,
                accountid: $rootScope.user.accountId,
                accountid1: $rootScope.user.accountId,
                accountid2: $rootScope.user.accountId,
                classid: $rootScope.user.classId,
                classid1: $rootScope.user.classId,
                classid2: $rootScope.user.classId,
                classid3: $rootScope.user.classId,
            }, function (data) {
                var interflow = _.find(data, { "name": "myclass-interflow" }).data;
                var commentList = _.find(data, { "name": "myclass-interflow-commentList" }).data;
                var imgList = _.find(data, { "name": "myclass-interflow-imgList" }).data;

                for (var n = 0; n < commentList.length; n++) {
                    if (commentList[n].headimg)
                        commentList[n].headimg = $scope.getImg(commentList[n].headimg, commentList[n].headimg, 'userPhoto');
                    else
                        commentList[n].headimg = $scope.defaultUserPhoto;

                    //解析表情
                    //commentList[n].commentcontent = getCountenance(commentList[n].commentcontent);
                    commentList[n].commentcontent = getCountenanceCallback(commentList[n].commentcontent, 1, commentList[n].id, commentList[n].fid, setModelValue);
                }

                for (var n = 0; n < interflow.length; n++) {
                    if (interflow[n].headimg)
                        interflow[n].headimg = $scope.getImg(interflow[n].headimg, interflow[n].headimg, 'userPhoto');
                    else
                        interflow[n].headimg = $scope.defaultUserPhoto;
                    //解析表情
                    //interflow[n].content = getCountenance(interflow[n].content);
                    interflow[n].content = getCountenanceCallback(interflow[n].content, 0, interflow[n].id, "", setModelValue);

                    _.merge(interflow[n], {
                        'commentlist': commentList.filter(function (a) { return a.fid == interflow[n].id }),
                        'imglist': imgList.filter(function (a) { return a.fid == interflow[n].id })
                    });
                }
                if (interflow && interflow.length > 0) {
                    $scope.interflowData = _.union($scope.interflowData, interflow);
                    $scope.currentPageIndex++;
                    if (interflow.length >= $scope.currentPageSize)
                        $scope.myConfig.moreShow = true;
                    else
                        $scope.myConfig.moreShow = false;
                }
                else
                    if (type && type == 'more') {
                        $scope.myConfig.moreShow = false;
                        CommonService.alert("没有更多数据了");
                    }
            }, function (errortemp) { });
    };

    loadInterflow();

    //交流点赞
    $scope.clickALike = function (id) {
        var like = _.find($scope.interflowData, { "id": id });
        if (!like.isclick) {
            like.isclick = 1;
            getDataSource.getUrlData("../api/commonPraise",
            {
                "eventid": id,
                "accountid": $rootScope.user.accountId,
                "passive_classid": $rootScope.user.classId,
                "passive_accountid": like.accountid,
                "passive_student": like.studentid,
                "usertype": "1", //学员操作
                "eventtype": like.usertype,
                "group": "20015001",
                "tag": "操作-班级交流点赞"
            }, function (flag) {
                if (flag == "true") {
                    like.clickcount++;
                    like.isclick = 1;
                }
            }, function (errortemp) { });
        }
    }

    //绑定表情
    var bindCountenance = function (id) {
        var a = $("#" + id);
        var text = $(a).prev();
        $(a).SinaEmotion($(text));
    }

    //评论显示
    $scope.commentShow = function (id) {

        _.find($scope.interflowData, { "id": id }).commentshow = !_.find($scope.interflowData, { "id": id }).commentshow;
        bindCountenance(id);
    }

    //评论发布
    $scope.comment = function (id) {
        var item = _.find($scope.interflowData, { "id": id });

        var text = $("#" + id).prev().val();
        item.commentcontent = text;

        if (item.commentcontent == "") {
            CommonService.alert("请先输入需要评论的内容");
            return;
        }

        var newid = getDataSource.getGUID();

        getDataSource.getUrlData("../api/interflowComment", {
            "id": newid,
            "classid": $rootScope.user.classId,
            "content": $scope.ReplaceAll(item.commentcontent, "\n", "<br/>"),
            "accountid": $rootScope.user.accountId,
            "fid": id,
            "studentid": $rootScope.user.studentId,
            "passive_classid": $rootScope.user.classId,
            "passive_accountid": item.accountid,
            "passive_student": item.studentid,
            "usertype": "1",  //学员操作
            "eventtype": item.usertype
        }, function (falg) {
            if (falg == "true") {
                //隐藏回复框
                item.commentshow = !item.commentshow;
                //插入前台对象
                item.commentlist.push(
                    {
                        "id": newid,
                        "commentcontent": getCountenance($scope.ReplaceAll(item.commentcontent, "\n", "<br/>")),
                        "commentuserid": $rootScope.user.accountId,
                        "commentuser": $rootScope.user.name,
                        "headimg": $scope.headImg,
                        "createdtime": DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                        "isdelete": 1,
                        "usertype": "1",
                        "studentid": $rootScope.user.studentId,
                    })
                //清空输入框
                item.commentcontent = "";
            }
        }, function (errortemp) { });
    }

    //交流内容输入框
    $scope.interflowcontent = "";



    var insertInterflow = function (newid) {
        getDataSource.getUrlData("../api/InsertInterflow", $scope.classexchangeData, function (flag) {
            if (flag == "true") {
                var imglist = [];
                if ($scope.classexchangeData.photolist) {

                    for (var i = 0; i < $scope.classexchangeData.photolist.length; i++) {
                        if ($scope.classexchangeData.photolist[i].servername) {
                            var strlist = $scope.classexchangeData.photolist[i].servername.split('.');
                            var servername = strlist[0] + "_small." + strlist[1];
                            imglist.push({
                                picture_serverthumbname: servername,
                                picturename: $scope.classexchangeData.photolist[i].filename,
                                pictureservername: $scope.classexchangeData.photolist[i].servername,
                                uploadTime: DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S')
                            });
                        }
                    }
                }
                $scope.interflowData.unshift(
                {
                    "id": newid,
                    "accountid": $rootScope.user.accountId,
                    "studentid": $rootScope.user.studentId,
                    "studentname": $rootScope.user.name,
                    "headimg": $scope.headImg,
                    "createdtime": DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    "content": getCountenance($scope.ReplaceAll($scope.interflowcontent, "\n", "<br/>")),
                    "imglist": imglist,
                    "commentlist": [],
                    "commentcontent": "",
                    "commentshow": 0,
                    "clickcount": 0,
                    "isdelete": 1,
                    "isclick": 0,
                    "usertype": "1"
                })

                insertCount++;

                //清空输入框
                $scope.interflowcontent = "";
                //清空图片list
                $scope.files = [];
                $scope.myConfig.interflowBtnShow = false;
                CommonService.alert("发布成功");
            }
        });
    };




    $scope.ReplaceAll = function (str, sptr, sptr1) {
        while (str.indexOf(sptr) >= 0) {
            str = str.replace(sptr, sptr1);
        }
        return str;
    }

    //交流内容发布
    $scope.interflow = function () {
        $scope.interflowcontent = $("#txtContent").val();

        if ($scope.interflowcontent == "") {
            CommonService.alert("请先输入需要发布的内容");
            return;
        }

        $scope.myConfig.interflowBtnShow = true;
        var newid = getDataSource.getGUID();

        $scope.classexchangeData =
            {
                classexchange: {
                    "id": newid,
                    "classid": $rootScope.user.classId,
                    "content": $scope.ReplaceAll($scope.interflowcontent, "\n", "<br/>"),
                    "accountid": $rootScope.user.accountId,
                    "usertype": "1",
                    "studentid": $rootScope.user.studentId,
                    "fid": ''
                }
            };


        if ($scope.files) {
            FilesService.upLoadPicture($scope.files, { upcategory: "interflowPhoto", width: 180, height: 180 }, function (data) {
                $scope.classexchangeData = _.merge($scope.classexchangeData, { photolist: data.data });
                insertInterflow(newid);

            }, function (error) {
                CommonService.alert("发布失败");
            });
        }
        else {
            insertInterflow(newid);
        }
    };


    //删除自己的交流内容
    $scope.deleteInterflow = function (id) {
        if (confirm("确定要删除吗？")) {
            getDataSource.getDataSource(['delete_sy_classexchange', 'delete_sy_classexchange_picture', 'delete_sy_classexchange_praise'],
                {
                    id: id,
                    fid: id,
                    exchangeid: id,
                    eventid: id
                }, function (data) {
                    _.remove($scope.interflowData, { "id": id });
                    insertCount--;
                    CommonService.alert("删除成功");
                }, function (data) {
                    CommonService.alert("删除失败，请重试");
                });
        }
    }

    //删除自己的评论
    $scope.deleteComent = function (id, fid) {
        if (confirm("确定要删除吗？")) {
            getDataSource.getDataSource(['delete_sy_classexchange_coment'],
                {
                    id: id
                }, function (data) {
                    var item = _.find($scope.interflowData, { "id": fid }).commentlist;
                    _.remove(item, { "id": id });
                    CommonService.alert("删除成功");
                }, function (data) {
                    CommonService.alert("删除失败，请重试");
                });
        }
    }

    //点击放大或者关闭图片
    $scope.showImg = function (imglist, img, type) {

        if (!$scope.myConfig.imgShow) {
            $scope.myConfig.imageType = type;
            if (imglist == undefined || imglist.length == 0) return;

            $scope.myConfig.imgUrl = $scope.getImg(img.pictureservername, img.pictureservername, type);
            $scope.myConfig.img = img;
            $scope.myConfig.imgList = imglist;

            $scope.myConfig.imgShow = !$scope.myConfig.imgShow;
            $(function () {
                $scope.ImgHeight = { "line-height": $(window).height() + "px" };
            });
        }
        else {
            $scope.myConfig.imgShow = !$scope.myConfig.imgShow;
            $scope.myConfig.img = {};
            $scope.myConfig.imgUrl = "";
            $scope.myConfig.imgList = [];
        }

    }

    //左右切换图片
    $scope.nextImg = function (type) {
        if ($scope.myConfig.imgList.length > 0) {
            var index = _.findIndex($scope.myConfig.imgList, function (n) {
                return n == $scope.myConfig.img;
            });
            var maxLength = $scope.myConfig.imgList.length;
            if (type == 2) {
                if ((index + 1) < maxLength) {
                    var nextImg = $scope.myConfig.imgList[index + 1];
                    $scope.myConfig.img = nextImg;
                    $scope.myConfig.imgUrl = $scope.getImg(nextImg.pictureservername, nextImg.pictureservername, $scope.myConfig.imageType);
                }
                else
                    CommonService.alert("已经是最后一张");
            }
            else {
                if ((index - 1) >= 0) {
                    var nextImg = $scope.myConfig.imgList[index - 1];
                    $scope.myConfig.img = nextImg;
                    $scope.myConfig.imgUrl = $scope.getImg(nextImg.pictureservername, nextImg.pictureservername, $scope.myConfig.imageType);
                } else
                    CommonService.alert("已经是第一张");
            }
        }
    }

    //---------必修课----------------------

    $scope.maxSize = 10;
    $scope.totalItems = 0;
    $scope.pageSize = 6;
    $scope.currentPage = 1;
    $scope.searchText = "";
    $scope.ordertype = 1;

    $scope.pageChanged = function () {
        var postData = {
            classid: $rootScope.user.classId,
            studentid: $rootScope.user.studentId,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            orderType: $scope.ordertype
        };

        getDataSource.getUrlData("../api/searchClassCoursewarelist", postData,
            function (data) {
                if ($scope.currentPage == 1)
                    $scope.totalItems = data.datacount;
                if (data && data.courseList && data.courseList.length > 0)
                    $scope.myConfig.coursemoreShow = true;
                var coursedata = data.courseList;
                for (var i = 0; i < coursedata.length; i++) {
                    coursedata[i].imagephoto = FilesService.showFile("coursewarePhoto", coursedata[i].imagephoto, coursedata[i].imagephoto);
                }
                $scope.courseList = coursedata;

            },
            function () { }
         );
    }


    $scope.pageChanged();

    $scope.selectOrderType = function (type) {
        $scope.ordertype = type;
        $scope.currentPage = 1;
        $scope.pageChanged();
    }



    var openWindow = function (href, name) {

        if ($scope.windowObj) {
            $scope.windowObj.close();
        }

        $scope.windowObj = window.open("about:blank", name);
        if ($scope.windowObj) {
            $scope.windowObj.location = href;
        }
    }

    $scope.ContinueStudy = function (coursewareid) {
        var href = "../html/indexvideo.html#/beforevideo/" + coursewareid;
        openWindow(href, "playVideo");
    }

}])