app.controller("containerController", ['$scope', '$rootScope', '$http', '$document', 'getDataSource', function ($scope, $rootScope, $http, $document, getDataSource) {
    $document[0].title = _.find($rootScope.myStudyLinks, { id: "1002" }).title;

}])
