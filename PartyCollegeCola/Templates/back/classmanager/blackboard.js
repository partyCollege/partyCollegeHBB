//angular.module("myApp")
//.controller("blackboardController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
//    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
//        var classid = $stateParams.id;


//        //黑板报
//        $scope.myInterval = 5000;
//        //var slideblackboard =
//        $scope.slideblackboard = [];
//        $scope.slideblackboardEdit = [];
//        $scope.addSlide = function () {
//            getDataSource.getDataSource("getClassBloackBoard", { classid: classid }, function (datatemp) {
//                $scope.slideblackboard = [];
//                if (datatemp.length <= 0) {
//                    $scope.slideblackboard.push({ id: new Date().getTime(), blackboardimg: "", src: '../img/myClass_banner.jpg', sortnum: 1 });
//                }
//                for (var i = 0; i < datatemp.length; i++) {
//                    var blackboardimg = FilesService.showFile("blackboard", datatemp[i].boardimg_servername, datatemp[i].boardimg_servername);
//                    $scope.slideblackboard.push({
//                        id: datatemp[i].id,
//                        blackboardimg: datatemp[i].boardimg_servername,
//                        src: blackboardimg,
//                        sortnum: datatemp[i].sortnum
//                    });
//                }
//                $scope.slideblackboardEdit = angular.copy($scope.slideblackboard);

//            }, function (errortemp) { });
//        }
//        $scope.addSlide();
//    }]);



angular.module("myApp")
.controller("blackboardController", ['$rootScope', '$scope', 'getDataSource', "$state", '$stateParams', 'notify', '$modal', 'FilesService', 'DateService',
    function ($rootScope, $scope, getDataSource, $state, $stateParams, notify, $modal, FilesService, DateService) {
        var classid = $stateParams.id;
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
            { name: '照片名称', field: "boardimg_clientname", width: '50%', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.downFiles(row.entity.boardimg_servername, row.entity.boardimg_clientname, \'blackboard\')">{{row.entity.boardimg_clientname}}</a></div>' },
              { name: "创建人", field: "createuser", width: '25%' },
              { name: "创建时间", field: "createtime", width: '20%' }


            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.loadSource = function () {
            getDataSource.getDataSource("getAllblackboard", { classid: classid }, function (data) {
                $scope.gridOptions.data = data;
            });
        }
        $scope.loadSource();


        $scope.oepnAD = function (row) {

            $scope.blackboardInfo = {
                id: '',
                boardimg_clientname: '',
                boardimg_servername: '',
                createuser: $rootScope.user.name,
                classid: classid
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

        $scope.selectFiles = function (files, errorfiles) {
            if (files && files.length > 0) {

                if (errorfiles && errorfiles.length > 0) {
                    notify({ message: "您选择的" + errorfiles.length.toString() + "张图片可能超过了大小限制,无法上传,单张图片最大为2MB", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }


                if ($scope.gridOptions.data.length > 5 || ($scope.gridOptions.data.length + files.length) > 5) {
                    notify({ message: "最多只能上传5张图片", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                } else {
                    $scope.selectFile = files[0];
                }

            }
        };

        $scope.saveAttachDisabled = false;
        $scope.Addattach = function () {
            $scope.saveAttachDisabled = true;
            if ($scope.blackboardInfo) {
                if ($scope.selectFile) {
                    FilesService.upLoadPicture($scope.selectFile, { upcategory: "blackboard", width: 640, height: 400 }, function (data) {

                        var newid = getDataSource.getGUID();
                        $scope.blackboardInfo.id = newid;
                        $scope.blackboardInfo.boardimg_clientname = $scope.selectFile.name;
                        $scope.blackboardInfo.boardimg_servername = data.data[0].servername;


                        getDataSource.getDataSource("insert_sy_blackboard", $scope.blackboardInfo, function (data) {
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


        $scope.delete = function () {
            var selectRows = $scope.gridApi.selection.getSelectedRows();
            if (selectRows != null && selectRows != undefined && selectRows.length > 0) {
                getDataSource.doArray("delete_sy_blackboard", selectRows, function (data) {
                    notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.loadSource();
                });
            }
        }
    }]);