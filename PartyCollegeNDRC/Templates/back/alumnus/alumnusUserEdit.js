angular.module("myApp")
.controller("alumnusUserEditController", ["$scope",
    "$rootScope",
    "getDataSource",
    '$stateParams',
    'notify',
    '$modal',
    "FilesService",
    '$state', '$filter', function ($scope, $rootScope, getDataSource, $stateParams, notify, $modal, FilesService, $state, $filter) {

        $scope.renewCardShow = false;
        $scope.user = {};
        $scope.gridOptions = {
            data: [],
            columnDefs: [
              { name: '序列号', field: "title", width: '28%' },
              { name: "有效时长", field: "enableddays", width: '19%' },
              { name: "开始时间", field: "begindate", width: '16%' },
              { name: "结束时间", field: "enddate", width: '16%' },
              { name: "操作人", field: "createuser", width: '20%' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };


        var load = function () {
            if ($stateParams.id) {
                getDataSource.getDataSource("select_sy_alumnus_accountbyid", { id: $stateParams.id }, function (data) {
                    $scope.user = data[0];
                    if ($scope.user.photo_serverthumbname != null && $scope.user.photo_serverthumbname != undefined && $scope.user.photo_serverthumbname != '')
                        $scope.user.filename = FilesService.showFile("userPhoto", $scope.user.photo_serverthumbname, $scope.user.photo_serverthumbname);
                    else
                        $scope.user.filename = "../img/default_img.png";
                    if ($scope.user.enddate != undefined) {
                        $scope.renewCardShow = true;
                    }
                });
                //获取序列号
                getDataSource.getDataSource("select_sy_alumnus_renew_logbystudentid", { studentid: $stateParams.id }, function (data) {
                    $scope.gridOptions.data = data;
                });

            }
        }();


        $scope.modalInstance = null;
        $scope.renew = {};
        //续费
        $scope.getRenewCard = function () {
            getDataSource.getUrlData('../api/getRenewCard', { id: $stateParams.id }, function (datatemp) {
                $scope.renew = datatemp;
                $scope.modalInstance = $modal.open({
                    templateUrl: 'renewcard.html',
                    size: 'lg',
                    scope: $scope
                });
            }, function (errortemp) {

            });
        }

    	//续费
        $scope.saveDisabled = false;
        $scope.saveRenewCard = function () {
        	$scope.saveDisabled = true;
        	$scope.renew.studentid = $stateParams.id;
            $scope.renew.studentname = $scope.user.name;
            $scope.renew.createuser = $rootScope.user.name;
            $scope.renew.createuserid = "";
            getDataSource.getUrlData('../api/RenewCard', $scope.renew, function (datatemp) {
            	if (datatemp.status == "success") {
            		$scope.saveDisabled = false;
                    notify({ message: '续费成功！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    $scope.close();
                    getDataSource.getDataSource("select_sy_alumnus_renew_logbystudentid", { studentid: $stateParams.id }, function (data) {
                        $scope.gridOptions.data = data;
                    });
                }
            	else {
            		$scope.saveDisabled = false;
                    notify({ message: '续费失败！', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                }
            }, function (errortemp) {
            	$scope.saveDisabled = false;
            });
        }

        $scope.$watch("renew.begindate", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });
        $scope.$watch("renew.reffectivetime", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });
        $scope.$watch("renew.reffectiveunit", function (newvalue, oldvalue) {
            if (oldvalue != undefined)
                $scope.changeDate();
        });

        $scope.format = function (date, format) {
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }

        $scope.changeDate = function () {
            var date = new Date($filter('date')($scope.renew.begindate, "yyyy-MM-dd"));
            if ($scope.renew.reffectiveunit == 0) {
                date.setFullYear(date.getFullYear() + parseInt($scope.renew.reffectivetime))
            }
            else {
                date.setMonth(date.getMonth() + parseInt($scope.renew.reffectivetime))
            }
            date.setDate(date.getDate() - 1);
            $scope.renew.enddate = $scope.format(date, 'yyyy-MM-dd');
        }

        $scope.close = function () {
            $scope.modalInstance.dismiss('cancel');
        }
        $scope.goToList = function () {
            $state.go("index.alumnusUserlist");
        }


    }
]);