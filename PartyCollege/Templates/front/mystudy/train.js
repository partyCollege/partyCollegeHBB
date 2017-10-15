app.controller("trainController", ['$scope', '$rootScope', '$state', '$timeout', '$stateParams', 'getDataSource', 'DateService', 'CommonService'
 , function ($scope, $rootScope, $state,$timeout, $stateParams, getDataSource, DateService, CommonService) {

     $scope.train = {
         title: "", categoryone: "组织调训", categorytwo: "业务培训", categorythree: "面授培训", categoryfour: "境内培训", starttime: "", endtime: "", studytime: "", year: "",
         address: "", company: "", reference: "",status:0,remark:"" };

     $scope.buttonCtrl = {
         btnSaveStatu: false,
         btnSubmitStatus: false,
         btnSaveDisplay:true,
         btnSubmitDisplay: true,
         enableEdited:false
     };

     var date = new Date();
     var yearInt = date.getFullYear();
     $scope.yearArr = [];
     //var start = yearInt;
     for (var i = 2012; i < yearInt + 2; i++) {
         $scope.yearArr.push(i);
     }

     $scope.pageinit = function () {
     	$scope.train.year = yearInt;
         if ($stateParams.id) {

             $scope.buttonCtrl.btnSaveDisplay = false;
             $scope.buttonCtrl.btnSubmitDisplay = false;

             getDataSource.getDataSource("gettrain", { id: $stateParams.id }, function (data) {
                 if (data[0]) {
                     $scope.train = data[0];
                     $scope.train.starttime = DateService.format(data[0].starttime, "yyyy-MM-dd");
                     $scope.train.endtime = DateService.format(data[0].endtime, "yyyy-MM-dd");
                 }
                 if ($scope.train.status==0) {
                     $scope.buttonCtrl.btnSaveDisplay = true;
                     $scope.buttonCtrl.btnSubmitDisplay = true;
                 } else if ($scope.train.status == 1) {
                     $scope.buttonCtrl.btnSaveDisplay = false;
                     $scope.buttonCtrl.btnSubmitDisplay = false;
                 }
                 if ($scope.train.status != 0) {
                     $scope.buttonCtrl.enableEdited = true;
                 }

             }, function (error) { });
         }
     }

     $scope.submit = function (sta) {

         if (new Date($scope.train.starttime) > new Date($scope.train.endtime)) {
             CommonService.alert("面授的开始时间不能大于结束时间");
             return;
         }
          
         $scope.buttonCtrl.btnSubmitStatus = true;
         $scope.buttonCtrl.btnSaveStatu = true;
         //$scope.buttonCtrl.btnSaveDisplay = false;
         //$scope.buttonCtrl.btnSubmitDisplay = false;

         $scope.train.status = sta;
         getDataSource.getUrlData("../api/addtrain", $scope.train, function (data) {
             CommonService.alert(data.message);
             if (data.result) {
                 $scope.train.id = data.trainid;

                 if (sta == 0) {
                     $scope.buttonCtrl.btnSubmitStatus = false;
                     $scope.buttonCtrl.btnSaveStatu = false;
                 } else if (sta == 1) {
                     $scope.buttonCtrl.btnSaveDisplay = false;
                     $scope.buttonCtrl.btnSubmitDisplay = false;
                 }
             } else {
                 $scope.buttonCtrl.btnSubmitStatus = false;
                 $scope.buttonCtrl.btnSaveStatu = false;
                 //$scope.buttonCtrl.btnSaveDisplay = true;
                 //$scope.buttonCtrl.btnSubmitDisplay = true;
             }
         }, function (errortemp) { });

     }

     $scope.cancel = function () {
         $state.go("main.studytotal", { no: 3 });
     }
     $timeout(function () {
     	$scope.pageinit();
     }, 500);
 }])

