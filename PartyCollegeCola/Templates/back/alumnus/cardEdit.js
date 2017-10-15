angular.module("myApp")
.controller("cardEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    "FilesService",
    '$state', function ($scope, $rootScope, getDataSource, $stateParams, notify, FilesService, $state) {
        $scope.card = {};
        $scope.serialShow = false;
        $scope.cardid = $stateParams.id;
        $scope.opationConfig = {
            saveCardShow: true,
            serialCardShow: false,
            useCardShow: false,
            exportCardShow: false,
            useCardExitShow: false
        }

        $scope.gridOptions = {
            data: [],
            columnDefs: [
              { name: '序列号', field: "serialno", width: '25%' },
              { name: "有效时长", width: '19%', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.card.effectivetime}}{{grid.appScope.card.effectiveunitcn}}</div>' },
              { name: "状态", field: "statuscn", width: '15%' },
              { name: "开始时间", field: "begindate", width: '16%' },
              { name: "结束时间", field: "enddate", width: '12%' },
              { name: "使用用户", field: "studentname", width: '10%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.dataload = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("select_sy_alumnus_card_byid", { id: $stateParams.id }, function (data) {
                    $scope.card = data[0];
                    //获取序列号
                    if ($scope.card.state == 1) {
                        $scope.opationConfig.saveCardShow = false;
                        $scope.opationConfig.exportCardShow = true;
                        $scope.opationConfig.useCardExitShow = true;
                    }
                    else {
                        $scope.opationConfig.useCardShow = true;
                        $scope.opationConfig.serialCardShow = true;
                    }
                    getDataSource.getDataSource("select_sy_alumnus_serial", { pid: $stateParams.id }, function (data) {
                        if (data.length > 0) {
                            $scope.opationConfig.serialCardShow = false;
                            $scope.serialShow = true;
                            $scope.gridOptions.data = data;
                        }
                    });
                });
            }
        };

        $scope.dataload();

    	//生成序列号
        $scope.saveDisabled = false;
        $scope.serialCard = function () {
        	$scope.saveDisabled = true;
        	if ($stateParams.id) {
                getDataSource.getUrlData("../api/serialcard", {
                    id: $stateParams.id, enableddays: $scope.card.effectivetime,
                    dayuint: $scope.card.effectiveunit, createuser: $rootScope.user.name, sequenceCount: $scope.card.sequencecount
                }, function (data) {
                	$scope.saveDisabled = false;
                	$scope.opationConfig.serialCardShow = false;
                    getDataSource.getDataSource("select_sy_alumnus_serial", { pid: $stateParams.id }, function (data) {
                        if (data.length > 0) {
                            $scope.opationConfig.serialCardShow = false;
                            $scope.serialShow = true;
                            $scope.gridOptions.data = data;
                        }
                    });
                }, function (errortemp) {
                	$scope.saveDisabled = false;
                });
            }
        }

        //导出
        $scope.exportCard = function () {
            if ($stateParams.id) {
                window.location = "../api/exportcard/" + $stateParams.id + "/" + $scope.card.name;
            }
        }

    	//保存
        $scope.saveDisabled = false;
        $scope.saveCard = function () {
        	$scope.saveDisabled = true;
            if ($scope.card.name == "" || $scope.card.name == undefined || $scope.card.name == null) {
                notify({ message: '批次名称不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.saveDisabled = false;
                return;
            }
            if ($scope.card.effectivetime == undefined || $scope.card.effectiveunit == undefined) {
            	notify({ message: '请选择有效时长！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.courselength == "" || $scope.card.courselength == undefined || $scope.card.courselength == null) {
            	notify({ message: '课程数为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.price == "" || $scope.card.price == undefined || $scope.card.price == null) {
            	notify({ message: '价格不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($scope.card.sequencecount == "" || $scope.card.sequencecount == undefined || $scope.card.sequencecount == null) {
            	notify({ message: '序列号数不能为空！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
            	$scope.saveDisabled = false;
                return;
            }
            if ($stateParams.id) {
                var msg = '保存成功';
                getDataSource.getDataSource("save_sy_alumnus_card", $scope.card, function (data) {
                	$scope.saveDisabled = false;
                    notify({ message: msg, classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }, function (error) { $scope.saveDisabled = false; });
            }
            else {
                var newid = getDataSource.getGUID();
                $scope.card.id = newid;
                getDataSource.getDataSource("insert_sy_alumnus_card", $scope.card, function (data) {
                	$scope.saveDisabled = false;
                    notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $state.go("index.cardEdit", { id: newid });
                }, function (error) { $scope.saveDisabled = false; });
            }
        }

        //制卡
        $scope.useCard = function () {
            getDataSource.getDataSource("use_sy_alumnus_card", { useuserid: $rootScope.user.accountId, state: 1, userusername: $rootScope.user.name, id: $scope.card.id, pid: $scope.card.id }, function (data) {
                notify({ message: '制卡成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.dataload();
            });
        }

        //作废
        $scope.useCardExit = function () {
            getDataSource.getDataSource("use_sy_alumnus_card_zh", { useuserid: $rootScope.user.accountId, state: -1, userusername: $rootScope.user.name, id: $scope.card.id, pid: $scope.card.id }, function (data) {
                notify({ message: '作废成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                $scope.dataload();
            });
        }

        $scope.goToList = function () {
            $state.go("index.cardList");
        }

        $scope.inputKeyDown = function (e) {
            var ss = window.event || e;
            if (!((ss.keyCode > 47 && ss.keyCode < 58) || ss.keyCode == 8)) {
                ss.preventDefault();
            }
        }
    }
]);