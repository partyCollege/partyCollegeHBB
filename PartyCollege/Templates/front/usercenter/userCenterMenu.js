//app.controller("usercentermenuController", ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {

//    var path = $location.$$path;
//    var pArr = path.split("/");
//    var currentView = pArr[pArr.length - 1];

//    for (var i in $rootScope.userCenterLinks)
//    {
//        var n = $rootScope.userCenterLinks[i];
//        if (n.sref.indexOf(currentView) >= 0)
//            n.isSelected = true;
//        else
//            n.isSelected = false;
//    }

//    $scope.selectMenu = function (iid) {

//        var current = _.find($rootScope.userCenterLinks, { isSelected: true });
//        current.isSelected = false;
//        current = _.find($rootScope.userCenterLinks, { id: iid });
//        current.isSelected = true;

//    }

//}])