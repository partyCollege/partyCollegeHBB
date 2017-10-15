angular.module("myApp")
.controller("downloadController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {

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
            { name: '资料名称', field: "attach", width: '30%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.attach_servername, row.entity.attach_clientname, \'download\')">{{row.entity.attach}}</a></div>' },
			 { name: "资料说明", field: "remark", width: '10%' },
            { name: '资料类型', field: "category", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category == 1 ?"常用资源":"常用软件"}}</div>' },
            { name: '首页显示', field: "bottomshow", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bottomshow == 0 ?"不显示":"显示"}}</div>' },
            { name: '首页排序', field: "bottomsort", width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.bottomsort}}</div>' },
              { name: "创建人", field: "username", width: '10%' },
              { name: "发布时间", field: "publishtime", width: '15%' },
              { name: "状态", field: "status", width: '15%' },
              

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("getMaterial", {}, function (data) {
                $scope.gridOptions.data = data;
            });
        }
        $scope.loadSource();


        //打开课程资料窗口
        $scope.files = [];

        $scope.saveAttachDisabled = false;
        $scope.addmaterial = function (row) {
            $scope.saveAttachDisabled = false;

            $scope.files = [];
            $scope.uploadFiles = function (files) {
                $scope.files = files;
            }

            //新增
            $scope.downloadInfo = {
                id: '',
                attach: '',
                attach_clientname: '',
                attach_servername: '',
                status: 0,
                createuser: $rootScope.user.name,
                category: 1,
                attach_logo: "",
                bottomshow: 0,
                bottomsort: "0"

            };
            $scope.selectFile = null;

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
                //var strlist = files[0].name.split('.');
                //if (_.indexOf($rootScope.appConfig.attachTypes, strlist[strlist.length - 1]) < 0) {
                //    notify({ message: '请选择有效的文件进行上传', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                //}
                //else {
                //    $scope.selectFile = files[0];
                //    //console.log($scope.selectFile);
                //}

                $scope.selectFile = files[0];
            }
        };


        $scope.doSave = function () {
            var newid = getDataSource.getGUID();
            $scope.downloadInfo.id = newid;
            if ($scope.downloadInfo.attach == "")
                $scope.downloadInfo.attach = $scope.downloadInfo.attach_clientname


            getDataSource.getDataSource("insert_sy_material", $scope.downloadInfo, function (data) {
                notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.loadSource();
                $scope.modalInstance.dismiss('cancel');
                $scope.saveAttachDisabled = false;
                //$state.go("index.newsEdit", { id: newid });
            });
        }
        $scope.Addattach = function () {

            if ($scope.downloadInfo.category == 2) {
                if ($scope.files.length <= 0) {
                    notify({ message: '请选择软件图标', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }
            }

        	$scope.saveAttachDisabled = true;
        	if ($scope.downloadInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadFiles($scope.selectFile, "download", function (data) {

                        $scope.downloadInfo.attach_clientname = $scope.selectFile.name;
                        $scope.downloadInfo.attach_servername = data.data[0].servername;

                        if ($scope.downloadInfo.category == 2) {
                            if ($scope.files) {
                                FilesService.upLoadPicture($scope.files[0], { upcategory: "download", width: 500, height: 300 }, function (data) {
                                    $scope.downloadInfo.attach_logo = data.data[0].servername;

                                    $scope.doSave();

                                }, function (error) { $scope.saveDisabled = false; });
                            }
                            else
                                notify({ message: '请选择软件图标', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        }
                        else
                            $scope.doSave();
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
                getDataSource.doArray("publishmaterial", selectRows, function (data) {
                    notify({ message: '发布成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deletematerial", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }

        $scope.unpageshow = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("deletematerial", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);