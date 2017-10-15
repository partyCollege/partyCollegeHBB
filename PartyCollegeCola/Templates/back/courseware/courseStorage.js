angular.module("myApp")
.controller("courseStorageController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {

    $scope.categoryData = {};
    //获取分类信息
    $scope.loadCategory = function () {
        //获取课程分类
        getDataSource.getDataSource("select_sy_courseware_category_relatiionbycourseid", { coursewareid: $stateParams.id }, function (reldata) {
            //获取根分类
            getDataSource.getDataSource("select_sy_courseware_category_root", {}, function (data) {
                //获取除根之外的分类
                getDataSource.getDataSource("select_sy_courseware_category_all", {}, function (tempdata) {
                    if (data != null && data != undefined && data.length > 0 && tempdata != null && tempdata != undefined && tempdata.length > 0) {
                        //遍历根分类
                        for (var idx in data) {
                            var arrayData = new Array();
                            //遍历子分类
                            for (var i in tempdata) {
                                if (data[idx].id == tempdata[i].fid) {
                                    if (reldata != null && reldata != undefined && reldata.length > 0) {
                                        for (var j in reldata) {
                                            if (reldata[j].categoryid == tempdata[i].id) {
                                                tempdata[i].checked = true;
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        tempdata[i].checked = false;
                                    }
                                    arrayData.push(tempdata[i]);
                                }
                            }
                            data[idx].categoryData = arrayData;
                        }
                    }
                    $scope.categoryData = data;
                }, function (data) { });
            }, function (data) {
                notify({ message: '获取分类数据失败', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            });
        });
    }

    $scope.loadCategory();


    $scope.saveCategory = function () {
        if ($scope.categoryData != null && $scope.categoryData != undefined && $scope.categoryData.length > 0) {
            var ids = "";
            for (var idx in $scope.categoryData) {
                var itemData = $scope.categoryData[idx].categoryData;
                if (itemData != null && itemData != undefined && itemData.length > 0) {
                    for (var i in itemData) {
                        if (itemData[i].checked) {
                            if (ids != "") {
                                ids += "," + itemData[i].id;
                            }
                            else {
                                ids = itemData[i].id;
                            }
                        }
                    }
                }
            }
            if (ids != "") {
                getDataSource.getUrlData("../api/courseMoveRelatiion", {
                    categoryids: ids, coursewareid: $stateParams.id
                }, function (data) {
                    if (data) {
                        getDataSource.getUrlData("../api/courseMainStatus", {
                            coursewareids: $stateParams.id, mainstatus: 7, operationuser: $rootScope.user.name, userid: $rootScope.user.accountId, currentstep: "课件分类入库", nextstep: "结束", operationcontent: ($rootScope.user.name + "已完成分类入库，流程结束").toString()
                        }, function (data) {
                            if (data) {
                                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                                $scope.goback();
                            }
                            else
                                notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        }, function (errortemp) {
                            notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                        });
                    }
                    else
                        notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (errortemp) {
                    notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                });
            }
            else {
                notify({ message: '请先选择课件分类！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            }
        }
    }
}]);