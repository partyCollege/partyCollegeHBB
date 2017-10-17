app.controller("recentlearningController", ['$scope', '$rootScope', '$document', '$http', '$timeout', 'getDataSource', 'FilesService', 'CommonService'
            , function ($scope, $rootScope, $document, $http, $timeout, getDataSource, FilesService, CommonService) {

                $document[0].title = _.find($rootScope.myStudyLinks, { id: "1001" }).title;
                console.log($rootScope.user);
                $scope.nostudymessage = '';
                $scope.filter = {
                    filterType: 0,
                    classid: $rootScope.user.classId,
                    pageIndex: 1,
                    pageSize: 5,
                    itemCount: 0,
                    isMore: false
                };

                $timeout(function () {
                    //访问数据库，获取数据
                    getDataSource.getDataSource("mystudy-list", {}, function (data) {

                        var list = data;
                        if (!list || list.length == 0) {

                            if ($scope.data.length == 0)
                                $scope.nostudymessage = '暂无学习记录!';
                            return;
                        }

                        //for (var idx in list) { 
                        for (var idx = 0; idx < list.length; idx++) {
                            list[idx].photo = FilesService.showFile("coursewarePhoto", list[idx].imagephoto, list[idx].imagephoto);
                            list[idx].grade = parseFloat(list[idx].grade).toFixed(1);
                            list[idx].progressInt = parseInt(list[idx].progress.replace("%", ""));
                            list[idx].progress = list[idx].progressInt >= 100 ? "100%" : list[idx].progressInt + "%";
                        }

                        $scope.dataList = list;
                        $scope.moreList();

                    }, function (errortemp) { });
                }, 1000);

                //显示更多
                $scope.moreList = function () {

                    $scope.filter.isMore = false;
                    $scope.filter.pageIndex++;
                    $scope.filter.itemCount = ($scope.filter.pageIndex - 1) * $scope.filter.pageSize;
                    filterPaging();
                }


                $scope.data = [];
                var filterPaging = function () {
                    var dataTmp = [];
                    if ($scope.dataList) {
                        dataTmp = _.take($scope.dataList, $scope.filter.itemCount);
                    }
                    if ($scope.tmpData) {
                        if ($scope.tmpData.length < dataTmp.length) {
                            $scope.tmpData = dataTmp;
                        } else {
                            CommonService.alert("休息会儿！暂时没有新的学习记录啦。");
                            return;
                        }
                    } else {
                        $scope.tmpData = dataTmp;
                    }

                    if ($scope.filter.pageIndex == 2) {
                        if ($scope.tmpData.length < $scope.filter.pageSize)
                            $scope.filter.isMore = false;
                        else
                            $scope.filter.isMore = true;

                    }
                    else
                        $scope.filter.isMore = true;

                    var tmpList = _.chain($scope.tmpData).groupBy(function (n) {
                        return n.dyear + "年" + n.dtime;
                    }).map(function (g) {
                        return {
                            dYear: g[0].dyear,
                            dTime: g[0].dtime,
                            dataList: g
                        }
                    });

                    $scope.data = tmpList.value();
                }

                $scope.enableBtnWriteFeel = function (stu) {

                    //学习进度小于100%,不可以写学后感
                    if (stu.isplaycompletion != 1) return false;

                    //写过学后感之后不能继续写
                    if (stu.islearningsense == 1) return false;

                    return true;
                }

                $scope.enableBtnExam = function (stu) {


                    //学习进度小于100%,不可以考试
                    if (stu.isplaycompletion != 1) return false;

                    //考试之后不能考试
                    if (stu.isexamcompletion == 1) return false;

                    return true;
                }

                $scope.enableBtnAppraise = function (stu) {
                    //已看完视频，并且未写评价
                    if (stu.isplaycompletion && stu.appraise == 0) {
                        return true;
                    }
                    return false;
                }

                $scope.ContinueStudy = function (stu) {

                    if (stu.mainstatus < 0) return;

                    var href = "../html/indexvideo.html#/beforevideo/1/" + stu.classcourseid + "/" + stu.coursewareid;
                    openWindow(href, "playVideo");
                    getDataSource.writeLog("操作-开始学习/继续学习", "20002");
                }

                $scope.WriteFeel = function (stu) {
                    if ($scope.enableBtnWriteFeel(stu)) {

                        //getDataSource.getDataSource("mystudy-studylist-learningsense", {
                        //    studentid: $rootScope.user.studentId,
                        //    classcourseid: stu.classcourseid
                        //}, function (data) {
                        //    if (data[0] && data[0].count == 0) {
                        var href = "../html/indexvideo.html#/beforevideo/4/" + stu.classcourseid + "/" + stu.coursewareid;
                        openWindow(href, "playVideo");
                        //    } else {
                        //        CommonService.alert("哇！真勤奋，已经写过学后感啦！");
                        //    }
                        //});
                        getDataSource.writeLog("操作-学后感", "20002");



                    }
                }

                $scope.Exam = function (stu) {
                    if ($scope.enableBtnExam(stu)) {

                        //getDataSource.getDataSource("mystudy-studylist-exam", {
                        //    studentid: $rootScope.user.studentId,
                        //    classid: $rootScope.user.classId,
                        //    coursewareid: stu.coursewareid
                        //}, function (data) {
                        //    if (data[0] && data[0].count == 0) {
                        var href = "../html/indexvideo.html#/beforevideo/6/" + stu.classcourseid + "/" + stu.coursewareid;
                        openWindow(href, "playVideo");
                        //    } else {
                        //        CommonService.alert("哇！真勤奋，已经考过试啦！");
                        //    }
                        //}); 
                        getDataSource.writeLog("操作-考试", "20002");
                    }
                }
                //评价
                $scope.appraiseClick = function (stu) {

                    if ($scope.enableBtnAppraise(stu)) {

                        //getDataSource.getDataSource("mystudy-studylist-appraise", {
                        //    studentid: $rootScope.user.studentId, 
                        //    classcourseid: stu.classcourseid
                        //}, function (data) {
                        //    if (data[0] && data[0].count == 0) {
                        var href = "../html/indexvideo.html#/beforevideo/0/" + stu.classcourseid + "/" + stu.coursewareid;
                        openWindow(href, "playVideo");

                        getDataSource.writeLog("操作-评价", "20002");

                        //    } else {
                        //        CommonService.alert("哇！真勤奋，已经评价过啦！");
                        //    }
                        //});

                    }

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
            }])