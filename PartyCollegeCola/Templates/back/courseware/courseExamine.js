angular.module("myApp")
.controller("courseExamineController", ['$scope', '$modal', '$rootScope', '$timeout', 'getDataSource', '$stateParams', 'notify', '$state', "drawTable", "CommonService", "FilesService", function ($scope, $modal, $rootScope, $timeout, getDataSource, $stateParams, notify, $state, drawTable, CommonService, FilesService) {
    //评分项目
    $scope.coursewareeidt = {
        //评分项
        evaluateData: {},
        //关键字
        keyData: {}
    };

    //获取评价信息
    $scope.loadCodeData = function () {
        getDataSource.getDataSource("select_sy_courseware_ratebycoursewareid", { coursewareid: $stateParams.id }, function (ratedata) {
            if (ratedata != null && ratedata != undefined) {
                var edata = new Array();
                var keydata = new Array();
                for (var idx in ratedata) {
                    if (ratedata[idx].codetype == 0) {
                        edata.push(ratedata[idx]);
                    }
                    else {
                        keydata.push(ratedata[idx]);
                    }
                }
            }
            getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "课件评价等级" }, function (data) {
                if (edata != null && edata.length > 0 && data != null && data.length > 0) {
                    for (var i in data) {
                        for (var inx in edata) {
                            if (data[i].showvalue == edata[inx].category) {
                                data[i].datavalue = edata[inx].rate;
                            }
                        }
                    }
                }
                $scope.coursewareeidt.evaluateData = data;
            })
            getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "关键词" }, function (data) {
                getDataSource.getDataSource("select_sy_code_getall", {}, function (tempdata) {
                    if (data != null && data != undefined && data.length > 0 && tempdata != null && tempdata != undefined && tempdata.length > 0) {
                        for (var idx in data) {
                            var itemData = new Array();
                            for (var inx in tempdata) {
                                if (tempdata[inx].category == data[idx].showvalue) {
                                    itemData.push(tempdata[inx]);
                                }
                            }
                            if (keydata != null && keydata != undefined && keydata.length > 0) {
                                for (var i in keydata) {
                                    if (keydata[i].category == data[idx].showvalue)
                                        data[idx].datavalue = keydata[i].rate;
                                }
                            }
                            data[idx].itemData = itemData;
                        }
                    }
                    $scope.coursewareeidt.keyData = data;
                });

            })
        })
    }

    //加载信息
    $scope.loadRateData = function () {
        getDataSource.getDataSource("select_sy_courseware_ratebycoursewareid", { coursewareid: $stateParams.id }, function (data) {
            var edata = new Array();
            var keydata = new Array();
            for (var idx in data) {
                if (data[idx].codetype == 0) {
                    edata.push(data[idx]);
                }
                else {
                    keydata.push(data[idx]);
                }
            }
            $scope.coursewareeidt.keyData = keydata;
            $scope.coursewareeidt.evaluateData = edata;

            if (keydata.length == 0) {
                getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "课件评价等级" }, function (data) {
                    for (var inx in data) {
                        data[inx].category = data[inx].showvalue;
                        data[inx].rate = "未评";
                    }
                    $scope.coursewareeidt.evaluateData = data;
                })
            }
            if (edata.length == 0) {
                getDataSource.getDataSource("selectSyCodeByClass", { nowclass: "关键词" }, function (data) {
                    for (var inx in data) {
                        data[inx].category = data[inx].showvalue;
                        data[inx].rate = "无";
                    }
                    $scope.coursewareeidt.keyData = data;
                });
            }
        });
    }

    //获取CODE数据
    if ($scope.courseware.courseEditViewShow)
        $scope.loadCodeData();
    else
        $scope.loadRateData();

    //保存课程评价信息
    $scope.saveExamine = function () {
        //保存课件评价信息
        getDataSource.getUrlData("../api/saveCourseExamine", {
            coursewareeidt: $scope.coursewareeidt, rate: $scope.course.rate, coursewareid: $stateParams.id
        }, function (data) {
            if (data)
                notify({ message: '保存成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            else
                notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        }, function (errortemp) {
            notify({ message: '保存失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
        });
    }
}]);