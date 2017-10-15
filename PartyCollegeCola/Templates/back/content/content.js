app.controller("contentController", ['$scope', '$http', "getDataSource", "$rootScope","$modal", function ($scope, $http, getDataSource, $rootScope,$modal) {
    getDataSource.getDataSource("gettbl", {}, function (data) {
        //console.log(data);

    });
    $scope.peoples = [
  { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States' },
  { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
  { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
  { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
  { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
  { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
  { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
  { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
  { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
  { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    ];

    $scope.itemArray = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
        { id: 4, name: 'fourth' },
        { id: 5, name: 'fifth' },
    ];

    $scope.selected = { value: $scope.itemArray[0] };
    $scope.open = function (size) {
        window.open("http://www.baidu.com");
        //var modalInstance = $modal.open({
        //    templateUrl: 'myModalContent.html',
        //    size: size,
        //    resolve: {
        //        items: function () {
        //            return $scope.items;
        //        }
        //    }
        //});

        //modalInstance.result.then(function (selectedItem) {
        //    $scope.selected = selectedItem;
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };
    $scope.gridOptions = {
        data: 'data1',
        enableCellSelection: true,
        enablePaging: true,
        showFooter: true,
        enablePinning: true,
        columnDefs: [
                { field: "classroom", width: 120, pinned: true },
                 { field: "id", width: 120 },
                 { field: "name", width: 300 },
                 { field: "createtime", width: 300 }
        ], 
        pagingOptions: $scope.pagingOptions,
    };

    getDataSource.getDataSource("gettbl", {}, function (data1) {
        //var d1 = [];
        //for (var c = 0; c < 200; c++) {
        //    d1.push({ id: c, classroom: "教室123" + c, createtime: (new Date()), name: "课程" + c, myname: '中国' + c, wow: c, wow1: c, wow2: c, wow3: c });
        //}



        //$scope.gridOptions.columnDefs = [
        //   { name: 'id', width: 200, enablePinning: false },
        //  { name: 'name', width: 200, pinnedLeft: true },
        //   { name: 'classsroom', width: 200, pinnedRight: true },
        //   { name: 'myname', width: 150, enableCellEdit: true },
        //   { name: 'wow', width: 150 },
        //    { name: 'wow1', width: 150 },
        //                { name: 'wow2', width: 300 },
        //                        { name: 'wow3', width: 300 }
        //];

        $scope.data1 = data1;

        //$scope.gridOptions = { data: $scope.myData};
    });

    //$scope.gridOptions = {};
    //$scope.gridOptions.enableCellEditOnFocus = true;

    //$scope.gridOptions.columnDefs = [
    //  { name: 'id', enableCellEdit: false },
    //  { name: 'age', enableCellEditOnFocus: false, displayName: 'age (f2/dblClick edit)', width: 200 },
    //  { name: 'address.city', enableCellEdit: true, width: 300 },
    //  { name: 'name', displayName: 'Name (editOnFocus)', width: 200 }
    //];
    //var d1 = [];
    //for (var c = 0; c < 200; c++) {
    //    d1.push({ id: c, classroom: "教室123" + c, createtime: (new Date()), name: "课程" + c, myname: '中国' + c, wow: c, wow1: c, wow2: c, wow3: c });
    //}

    //      $scope.gridOptions.data = d1;

    //$scope.currentFocused = "";

    //$scope.getCurrentFocus = function () {
    //    var rowCol = $scope.gridApi.cellNav.getFocusedCell();
    //    if (rowCol !== null) {
    //        $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
    //    }
    //}

    //$scope.gridOptions.onRegisterApi = function (gridApi) {
    //    $scope.gridApi = gridApi;
    //};
}])