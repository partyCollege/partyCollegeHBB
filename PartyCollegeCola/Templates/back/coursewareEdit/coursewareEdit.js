angular.module("myApp")
.controller("coursewareEditController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable"
	, "CommonService", "FilesService", "DateService", "$timeout", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state,
		drawTable, CommonService, FilesService,DateService, $timeout) {
		$scope.course = { teachers: [], videotype: 0, createtime: DateService.format(new Date(), "yyyy-MM-dd") };

	
    
    $scope.courseware = { coursePerfectEditShow: true };
    var obj = {};
    //getDataSource.getDataSource("selectLive", {}, function (data) {
    //    $scope.items = data;
    //    angular.forEach($scope.items, function (item) {
    //        item.nowsrc = FilesService.showFile('livePhoto', item.pic_servername, item.pic_servername);
    //        //item.nowsrc = "http://192.168.1.119/fileTest/img/livePhoto/" + item.pic_servername;
    //    })
    //})
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
    getDataSource.getDataSource("selectAllTeacher", { platformid: $rootScope.user.platformid}, function (data) {
        $scope.allTeachers = data;
    });

    $scope.GetRealDuration = function () {
        getDataSource.getUrlData("../api/getRealDuration", { vid: $scope.course.teachervideo }, function (data) {
            $scope.course.realduration = data[0].duration;
        }, function (error) { })
    }




    $scope.gridOptions = {};
    $scope.gridSTOptions = {};
    $scope.gridApiST = {};
    $scope.gridXXOptions = {};
    $scope.answers = [];

    //getDataSource.getDataSource("getAllMicroVideoByNotCourse", { coursewareid: $scope.nowid }, function (data) {
    //    $scope.allMicroVideo = data;
    //});

    //$scope.doinitMicroVideo = function () {
    //    getDataSource.getDataSource("getCourseMicroVideo", { courseid: $scope.course.id }, function (data) {
    //        $scope.gridOptions.data = data;
    //    })
    //}
    //$scope.doinitMicroVideo();
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '微视频名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.viewMicroVideo(row)">{{row.entity.name}}</a></div>' },
          { name: '提供者', field: "provider" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridMicrApiST = gridApi;
        }
    };

    //删除试题
    $scope.deleteST = function () {
        var selectRows = $scope.gridApiST.selection.getSelectedRows();
        getDataSource.doArray("deleteExam", selectRows, function (data) {
            $scope.doinitST();
        });
    }
    //试题初始化
    $scope.doinitST = function () {
        getDataSource.getDataSource("selectExamByCourse", { id: $stateParams.id }, function (data) {
            $scope.gridSTOptions.data = data;
        })
    }
    $scope.doinitST();
    $scope.gridSTOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
          { name: '试题名称', field: "examtitle", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.oepnST(row)">{{row.entity.examtitle}}</a></div>' },
          { name: '题型', field: "examcategory", cellFilter: "examCategoryFilter" }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApiST = gridApi;
        }
    };

    $scope.viewMicroVideo = function (item) {
        perviewVideo(item.entity.videopath);
    }

    $scope.addMicroDisabled = false;
    $scope.addMicroVideo = function () {
    	$scope.addMicroDisabled = true;
        //getDataSource.getDataSource("delete_sy_course_relation", { id: $scope.course.id, type: 2 }, function () {
        var forInsert = [];
        angular.forEach($scope.course.microVideo, function (item) {
            forInsert.push({
                id: getDataSource.getGUID(),
                coursewareid: $scope.course.id,
                sourceid: item.id,
                type: 2
            });
        });
        getDataSource.doArray("insert_sy_course_relation", forInsert, function (data) {
            angular.forEach($scope.course.microVideo, function (item) {
                _.remove($scope.allMicroVideo, { id: item.id });
            });
            $scope.course.microVideo = [];
            $scope.doinitMicroVideo();
            $scope.addMicroDisabled = false;
        }, function (error) {
        	$scope.addMicroDisabled = false;
        });
        //});
    };

    $scope.delMicroVideo = function () {
        var selectRows = $scope.gridMicrApiST.selection.getSelectedRows();
        if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
            getDataSource.doArray("deleteCourseMicroVideo", selectRows, function (data) {
                $scope.doinitMicroVideo(); 
                notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            })
        }
    }


    $scope.coursewareCategoryRoot = {};
    $scope.coursewareCategoryData = {};
    $scope.Category = {
        selectedCategoryRoot: "",
        selectedCategoryInfo: "",
    };

    //获取分类信息
    getDataSource.getDataSource("select_sy_courseware_category_root", {}, function (data) {
        $scope.coursewareCategoryRoot = data;


        if ($stateParams.id) {
            getDataSource.getDataSource(["selectCoursewareById", "selectCourseware_teacherRelation", "getCategoryByCourse"],
                {
                    id: $stateParams.id,
                    coursewareid: $stateParams.id,
                    courseid: $stateParams.id
                }, function (data) {
                var teachrRelation = _.find(data, function (o) { return o.name == "selectCourseware_teacherRelation"; });
                $scope.course = _.find(data, function (o) { return o.name == "selectCoursewareById"; }).data[0];
                $scope.course.teachers = teachrRelation.data;
                $scope.nowfile = FilesService.showFile("coursewarePhoto", $scope.course.imagephoto, $scope.course.imagephoto);
                var courseCategory = _.find(data, function (o) { return o.name == "getCategoryByCourse"; }).data[0];
                if (courseCategory.fid == "0" || courseCategory.fid == "") {
                    $scope.Category.selectedCategoryRoot = courseCategory.id;
                    $scope.Category.selectedCategoryInfo = "";
                } else {
                    $scope.Category.selectedCategoryRoot = courseCategory.fid;
                    $scope.categoryRootChange(courseCategory.id);
                }
            });
        }
        else {
            if (data != null && data != undefined && data.length > 0) {
                $scope.Category.selectedCategoryRoot = data[0].id;
                $scope.categoryRootChange();
            }
        }
    }, function (data) {
        notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    });


    $scope.categoryRootChange = function (categoryid) {
        getDataSource.getDataSource("select_sy_courseware_categorybyfid", { fid: $scope.Category.selectedCategoryRoot, platformid: $rootScope.user.platformid }, function (data) {
            $scope.coursewareCategoryData = data;
            if (categoryid && categoryid != "") {
                $timeout(function () {
                    $scope.Category.selectedCategoryInfo = categoryid;
                }, 500);
            }
            else {
                if (data != null && data != undefined && data.length > 0) {
                    $scope.Category.selectedCategoryInfo = data[0].id;
                }
            }
        }, function (data) {
            notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    };

    //删除一个试题答案
    $scope.deleteAnswer = function (item) {
        _.pull($scope.answers, item);
    }
	//保存一个试题
    $scope.saveExamDisabled = false;
    $scope.addST = function () {
    	$scope.saveExamDisabled = true;
        if ($scope.st.examcategory == 0) {
            angular.forEach($scope.answers, function (item) {
                if (item.id == $scope.checkedAnswer.checkedID) {
                    item.isright = 1;
                }
                else {
                    item.isright = 0;
                }
            })
        }
        var stRight = 0;
        angular.forEach($scope.answers, function (item) {
            if (item.isright == true) {
                stRight++;
            }
        });
        if (stRight == 0)
        {
            notify({ message: '必须选择一个正确答案', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            return;
        }
        if ($scope.newst) {
            $scope.st.id = getDataSource.getGUID();
            $scope.st.coursewareid = $stateParams.id;
            angular.forEach($scope.answers, function (data) {
                data.examid = $scope.st.id;
            });
            getDataSource.getDataSource("addCourseExam", $scope.st, function (data) {
            	$scope.saveExamDisabled = false;
                getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                    $scope.doinitST();
                    $scope.close();
                });
            }, function (error) {
            	$scope.saveExamDisabled = false;
            });
        }
        else {
        	getDataSource.getDataSource("updateCourseExam", $scope.st, function (data) {
        		$scope.saveExamDisabled = false;
                getDataSource.getDataSource("deleteExamAnswer", { examid: $scope.st.id }, function (data) {
                    getDataSource.doArray("insertExamAnswer", $scope.answers, function (data) {
                        $scope.doinitST();
                        $scope.close();
                    });
                });
        	}, function (error) { $scope.saveExamDisabled = false; });
        }
    }
    //新增一个试题答案
    $scope.addExamAnswer = function () {
        $scope.answers.push({
            id: getDataSource.getGUID(),
            isright: false,
            answer: "",
            examid: $scope.st.id
        });
    }
    $scope.uploadpptFiles = function (file, errFiles) {
        $scope.course.pptfile = file;
        $scope.process_pptfile = 0;
    }
    $scope.close = function () {
        $scope.modalInstance.dismiss('cancel');
    };
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
        //检测课程编码是否存在
        getDataSource.getDataSource("checkCoursecodeRepeat", $scope.course, function (data) {
            if (data[0].num == 0) {
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
            }else {
                notify({ message: '课程编码已存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        });
    }


    var saveCategory = function (courseid) {

        if ($scope.Category.selectedCategoryInfo == "") {
            $scope.Category.selectedCategoryInfo = $scope.Category.selectedCategoryRoot;
        }
        getDataSource.getUrlData("../api/courseMove", {
            categoryids: courseid, categoryid: $scope.Category.selectedCategoryInfo, rootCategoryid: $scope.Category.selectedCategoryRoot
        }, function (data) {}, function (errortemp) {});
    }

    var doSave = function () {
        $scope.saveButtonDisabled = true;
        $scope.course.teachersid = CommonService.getJoinString($scope.course.teachers, "id");
        $scope.course.teachersname = CommonService.getJoinString($scope.course.teachers, "name");
        if ($stateParams.id) {
            insertCourseRelation($stateParams.id);
        	//insertCourseKeyWordRelation($stateParams.id);
            if ($scope.course.videotype == 3) {
            	$scope.course.coursetype = 1;
            }
            else
                $scope.course.coursetype = 0;
            getDataSource.getDataSource("updateCoursewareById", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	insertPptCoursewareQueue($scope.course.id);
            	saveCategory($scope.course.id);
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
            //insertCourseKeyWordRelation($stateParams.id);
            $scope.course.createplatformid = $rootScope.user.platformid;
            $scope.course.createuser = $rootScope.user.name;
            //$scope.course.createtime = new Date();
            $scope.course.mainstatus = 7;
            if ($scope.course.videotype!=3) {
                $scope.course.mainstatus = 0;
                $scope.course.coursetype = 0;
            } else {
            	$scope.course.coursetype = 1;
            }
            getDataSource.getDataSource("insertCourseware", $scope.course, function (data) {
            	$scope.saveButtonDisabled = false;
            	insertPptCoursewareQueue($scope.course.id);
            	saveCategory($scope.course.id);
            	//var pkgcse = new Object();
            	//pkgcse.platformid = $rootScope.user.platformid;
            	//pkgcse.coursewareid = newid;
            	//pkgcse.coursewarename = $scope.course.name;
            	//pkgcse.isshare = 0;
            	$state.go("index.coursewareEdit", { id: newid });
            	//getDataSource.getDataSource("insertPkgCourseware", pkgcse, function (data) {
            		
            	//}, function (error) { });
            });
        }
    }

	//插入PPT转换队列记录
    var insertPptCoursewareQueue = function (coursewareid) {
    	var Queues = [];
    	//angular.forEach($scope.course.teachers, function (item) {
    	//	teachers.push({
    	//		id: getDataSource.getGUID(),
    	//		coursewareid: coursewareid,
    	//		sourceid: item.id,
    	//		type: 0
    	//	});
    	//});

    	getDataSource.getDataSource("delete_sy_pptcourseware_queue", { coursewareid: coursewareid }, function () {
    		$scope.course.foldername = "pptCourseFile";
    		getDataSource.getDataSource("insert_sy_pptcourseware_queue", $scope.course, function (data) {
    			//console.log("$scope.course", $scope.course);
    		});
    	});
    }

    //插入班级课程关系
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

        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 0 }, function () {
            getDataSource.doArray("insert_sy_course_relation", teachers, function (data) {
            });
        });
    }

    ////插入课程关键词关系
    //var insertCourseKeyWordRelation = function (coursewareid) {
    //    var keyWords = [];
    //    angular.forEach($scope.course.courseKeywordOne, function (item) {
    //        keyWords.push({
    //            id: getDataSource.getGUID(),
    //            coursewareid: coursewareid,
    //            sourceid: item.id,
    //            type: 4
    //        });
    //    });

    //    angular.forEach($scope.course.courseKeywordTwo, function (item) {
    //        keyWords.push({
    //            id: getDataSource.getGUID(),
    //            coursewareid: coursewareid,
    //            sourceid: item.id,
    //            type: 5
    //        });
    //    });

    //    getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 4 }, function () {
    //        getDataSource.getDataSource("delete_sy_course_relation", { id: coursewareid, type: 5 }, function () {
    //            getDataSource.doArray("insert_sy_course_relation", keyWords, function (data) {
    //            });
    //        });
    //    });
    //}


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
    //更换试题类型，清空所有课题
    $scope.changeST = function () {
        $scope.answers = [];
    }

    //打开试题编辑窗口
    $scope.oepnST = function (row) {
        //是否是新增试题
        if (row) {
            $scope.newst = false;
            $scope.st = row.entity;
            getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                var checkedid = "";
                angular.forEach(data, function (item) {
                    if (item.isright == 1) {
                        checkedid = item.id;
                        item.isright = true;
                    }
                });
                $scope.answers = data;
                $scope.checkedAnswer.checkedID = checkedid;
            });
        }
        else {
            $scope.newst = true;
            $scope.st = {};
            $scope.answers = [];
        }
        $scope.modalInstance = $modal.open({
            templateUrl: 'ST.html',
            size: 'lg',
            scope: $scope
        });
        $scope.stPlatformDisabled = false;
        if ($scope.course.isshare == 1) {
        	$scope.stPlatformDisabled = true;
        }
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

	//上传PPT
    $scope.selectFiles = function (files) {
    	if (files && files.length > 0) {
    		//当前选择的文件
    		var strlist = files[0].name.split('.');
    		//var attachEx = ["ppt", "pptx"];
    		var attachEx = ["pdf"];
    		if (_.indexOf(attachEx, strlist[strlist.length - 1]) < 0) {
    			notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    		}
    		else {
    			$scope.selectFile = files[0];
    			if ($scope.selectFile) {
    				FilesService.upLoadFiles($scope.selectFile, "pptCourseFile", function (data) {
    					$scope.course.pptcoursefile_servername = data.data[0].servername;
    					$scope.course.pptcoursefile_clientname = $scope.selectFile.name;
    					//doSave();
    				});
    			}
    		}
    	}
    };
}])
.controller("videoPerviewCtrl", ['$scope', function ($scope) {

}]);