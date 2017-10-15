app.controller("testfileuploadController", ['$scope', '$rootScope', 'Upload', 'FilesService', 'Base64', function ($scope, $rootScope, Upload, FilesService, Base64) {
    $scope.files = [];
    $scope.doclick = function () {
        $("#myfile").click();
    }
    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.img1 = files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    }
    $scope.doUpload = function () {
        FilesService.upLoadFiles($scope.myfiles, "userPhoto");
    }
    $scope.down = function () {
        //FilesService.downFiles("userPhoto", "a5986d8c-1409-4af3-b2ec-9c082b3c7da9.sql", "a5986d8c-1409-4af3-b2ec-9c082b3c7da9.sql");
        FilesService.downFiles("userPhoto", "cccc.png", "cccc.png");
    }
    //$scope.img = "../api/uploadfile/userPhoto/" + Base64.encode("cccc.png") + "/" + Base64.encode("ccccddddd.png");

}])