angular.module("myApp")
.controller("attachController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService','DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
        var coursewareid = $stateParams.id;
        $scope.maxorderby = 0;
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null
        };

        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            data: [],
            columnDefs: [
              { name: "序号", field: "orderby", width: '5%' },//ng-click="grid.appScope.goDetial(row)"
            { name: '资料名称', field: "attach_clientname", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.attach_servername, row.entity.attach_clientname, \'classAttach\')">{{row.entity.attach_clientname}}</a></div>' },
              { name: "创建人", field: "username", width: '15%' },
              { name: "创建时间", field: "createtime", width: '15%' },
              { name: "状态", field: "status", width: '15%' },
              

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("selectAttachByCid", { coursewareid: coursewareid }, function (data) {
                $scope.gridOptions.data = data;
                $scope.maxorderby = data.length;
            });
        }
        $scope.loadSource();


        //打开课程资料窗口
        $scope.oepnAD = function (row) {
            //是否是新增课程资料
            if (row) {
                //$scope.newst = false;
                //$scope.st = row.entity;
                //getDataSource.getDataSource("selectExamAnswerByExam", { examid: row.entity.id }, function (data) {
                //    $scope.answers = data;
                //});
            }
            else {
                //$scope.newst = true;
                //$scope.st = {};
                //$scope.answers = [];
                //新增
                $scope.classattachInfo = {
                    id: '',
                    attach_clientname: '',
                    attach_servername: '',
                    createtime: DateService.format(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    status: 0,
                    createuser: $rootScope.user.accountId,
                    coursewareid: coursewareid,
                    orderby: $scope.maxorderby+1
                };
                $scope.selectFile = null;
            }
            $scope.modalInstance = $modal.open({
                templateUrl: 'AttachDetail.html',
                size: 'lg',
                scope: $scope
            });
        }


        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        };

        //下载文件
        $scope.downFiles = function (attachservername, attachname, type) {
            return FilesService.downFiles(type, attachservername, attachname);
        }

        $scope.selectFiles = function (files) {
            if (files && files.length > 0) {
                //当前选择的文件
                var strlist = files[0].name.split('.');
                if (_.indexOf($rootScope.appConfig.attachTypes, strlist[strlist.length - 1]) < 0) {
                    notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
                else {
                    $scope.selectFile = files[0];
                    //console.log($scope.selectFile);
                }
            }
        };

        $scope.saveAttachDisabled = false;
        $scope.Addattach = function () {
        	$scope.saveAttachDisabled = true;
        	if ($scope.classattachInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadFiles($scope.selectFile, "classAttach", function (data) {
                       
                        var newid = getDataSource.getGUID();
                        $scope.classattachInfo.id = newid;
                        //$scope.classattachInfo.attach_clientname = escape(data.data[0].filename);
                        $scope.classattachInfo.attach_clientname = $scope.selectFile.name;
                        $scope.classattachInfo.attach_servername = data.data[0].servername;
                      

                        getDataSource.getDataSource("insertCoursewareAttach", $scope.classattachInfo, function (data) {
                            notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                            $scope.loadSource();
                            $scope.modalInstance.dismiss('cancel');
                            $scope.saveAttachDisabled = false;
                            //$state.go("index.newsEdit", { id: newid });
                        });


                    }, function (error) {
                    	$scope.saveAttachDisabled = false;
                        notify({ message: '保存失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    });
                }
                else {
                	$scope.saveAttachDisabled = false;
                    notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }
        	else {
        		$scope.saveAttachDisabled = false;
                notify({ message: '请先选择要上传的文件', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }

        //发布
        $scope.publish = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("publishCoursewareAttach", selectRows, function (data) {
                    notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deleteCoursewareAttach", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);