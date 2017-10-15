angular.module("myApp")
.controller("teacherEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.teacher = { photofilename: "", accountid: "", photoserverfilename: "" ,sex:-1};
        $scope.uploadFiles = function (files) {
            $scope.files = files;
        }
        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("selectTeacherById", { id: $stateParams.id }, function (data) {
                    $scope.teacher = data[0];
                    $scope.nowfile = FilesService.showFile("teacherPhoto", $scope.teacher.photo_servername, $scope.teacher.photo_servername);
                });
            }
        }();

        $scope.saveDisabled = false;
        $scope.save = function () {
        	$scope.saveDisabled = true;
        	if ($scope.files) {
                FilesService.upLoadPicture($scope.files[0], { upcategory: "teacherPhoto" ,width:500,height:300}, function (data) {
                    $scope.teacher.photo_servername = data.data[0].servername;
                    doSaveData();
                }, function (error) { $scope.saveDisabled = false; });
            }
            else {
                doSaveData();
            }


        }
        $scope.getFile = function () {
            if ($scope.teacher.photofilename != "") {
                //$scope.nowfile = FilesService.showFile("teacherPhoto", $scope.teacher.photoserverfilename, $scope.teacher.photofilename);

                //return FilesService.showFile("teacherPhoto", $scope.teacher.photoserverfilename, $scope.teacher.photofilename);
            }
        }
        var doSaveData = function () {
            if ($stateParams.id) {
            	getDataSource.getDataSource("updateTeacherById", $scope.teacher, function (data) {
            		$scope.saveDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	}, function (error) { $scope.saveDisabled = false; });
            }
            else {
                var newid = getDataSource.getGUID();
                $scope.teacher.id = newid;
                $scope.teacher.platformid = $rootScope.user.platformid;
                getDataSource.getDataSource("insertTeacher", $scope.teacher, function (data) {
                	notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                	$scope.saveDisabled = false;
                    $state.go("index.teacherEdit", { id: newid });
                }, function (error) { $scope.saveDisabled = false; });
            }
        }

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null
        };
        $scope.search = {};
        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 100],
            paginationPageSize: 25,
            useExternalPagination: true,
            useExternalSorting: true,
            data: [],
            columnDefs: [
              { name: '序号', field: "rownum", width: '7%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              //{ name: '课程名称', field: "name", width: '45%', headerCellClass: 'mycenter', cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
             { name: '课程名称', field: "name", width: '45%', cellClass: "mycenter", headerCellClass: 'mycenter' },
             { name: '授课人', field: "teachersname", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter' },
              { name: '授课时间', field: "teachtime", width: '15%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "date:'yyyy-MM-dd'" },
              { name: '状态', field: "mainstatus", width: '13%', cellClass: "mycenter", headerCellClass: 'mycenter', cellFilter: "mainStatusFilters" }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    $scope.loadGrid();
                });
                gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = null;
                    } else {
                        var array = [];
                        angular.forEach(sortColumns, function (c) {
                            array.push({ sort: c.sort, name: c.field });
                        });
                        paginationOptions.sort = array;
                    }
                    $scope.loadGrid();
                });
            }
        };



        $scope.loadGrid = function () {
            var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
            var pageSize = paginationOptions.pageSize;

            var key = "selectTeacherCourseware";
            getDataSource.getList(key, { platformid: $rootScope.user.platformid, teacherid: $stateParams.id }, { firstRow: firstRow, pageSize: pageSize }, $scope.search, paginationOptions.sort, function (data) {
                $scope.gridOptions.totalItems = data[0].allRowCount;
                $scope.gridOptions.data = data[0].data;
            });
        }
        $scope.loadGrid();
    }]);