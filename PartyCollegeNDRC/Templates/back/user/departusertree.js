app.controller("departusertreeController"
	, ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', "$modal", 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, $modal, notify, getDataSource, DateService, CommonService) {

		$scope.my_data = new Array();
		$scope.my_tree = tree = {};

		//分平台分类数据获取
		$scope.loadDepartTree = function () {
			getDataSource.getDataSource(["selectDepartRoot","selectDepartAll"], { platformid: $rootScope.user.platformid }, function (data) {
				var allplatform = _.find(data, { name: "selectDepartAll" });
				var rootform = _.find(data, { name: "selectDepartRoot" }).data[0];
				var root = new Object();
				root.label = rootform.name;
				root.rowid = rootform.id;
				root.children = new Array();

				drawChild(root, allplatform, rootform);
				$scope.my_data.push(root);
				$scope.doing_async = false;
				tree.expand_all();
			}, function (errortemp) {

			});
		}

		$scope.try_async_load = function () {
			$scope.my_data = new Array();
			$scope.doing_async = true;
			$scope.loadDepartTree();
		};

		$scope.try_async_load();

		//$scope.my_tree_handler = function (branch) {
		//	$scope.output = "";
		//	$scope.loadCourseCategoryParent(branch);
		//}

		function drawChild(root, datatemp, fobj) {
			var tempobj = { label: fobj.name, rowid: fobj.id, children: [], isedit: fobj.category };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			if (length > 0) {
				for (var i = 0; i < length; i++) {
					drawChild(tempobj, datatemp, childlist[i]);
				}
			}
			root.children.push(tempobj);
		}
}]);