angular.module("myApp")
.controller("pushmessageController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope,$state, $http,$timeout, $document,notify, getDataSource, DateService, CommonService) {
	var apple_selected, tree, treedata_avm, treedata_geography;
	var id = 0;
	$scope.parentDisabled = false;
	$scope.nameDisabled = false;
	$scope.childnameDisabled = false;
	$scope.saveCurrentButtonDisabled = false;
	$scope.saveButtonDisabled = false;
	$scope.deleteDisabled = false;
	//选中事件
	$scope.my_tree_handler = function (branch) {
		//var _ref;
		//console.log(branch);
		$scope.output = ""; //"You selected: " + branch.label + ",rowid:" + branch.rowid+",fid="+branch.fid;
		//if ((_ref = branch.data) != null ? _ref.description : void 0) {
		//	return $scope.output += '(' + branch.data.description + ')';
		//}
		if (branch.rowid == "0") {
			$scope.parentDisabled = true;
			$scope.nameDisabled = true;
			$scope.saveCurrentButtonDisabled = true;
			$scope.deleteDisabled = true;
		} else {
			$scope.parentDisabled = false;
			$scope.nameDisabled = false;
			$scope.saveCurrentButtonDisabled = false;
			$scope.deleteDisabled = false;
		}
		$scope.loadPushMessageCategoryParent(branch);
	};

	$scope.loadPushMessageCategoryParent = function (branch) {
		id = branch.rowid;
		getDataSource.getDataSource("select_pushMessageParent", {}, function (datatemp) {
			$scope.parentCategory = datatemp;
			$scope.parentCategory.push({ id: "", fid: "0", name: "====根目录====" });
			//id不为空，则认为为修改
			if (id != "" && id != undefined && id != null) {
				getDataSource.getDataSource("getPushMessageCategoryById", { id: id }, function (datatemp) {
					$scope.categoryForm = datatemp[0];
					//console.log($scope.categoryForm);
				}, function (errortemp) { });
			}
		}, function (errortemp) { });
	}

	$scope.deletePushMessageCategory = function () {
		$scope.deleteDisabled = true;
		getDataSource.getDataSource("select_pushMessageChildren", { fid: id }, function (datatemp) {
			var childrencount = datatemp.length;
			//id不为空，则认为为修改
			if (childrencount <= 0) {
				getDataSource.getDataSource("deletePushMessageCategoryById", { id: id }, function (datatemp) {
					if (datatemp.length > 0) {
						notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.deleteDisabled = true;
						$scope.loadCategoryTree();
					} else {
						$scope.deleteDisabled = false;
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) { });
			} else {
				notify({ message: '删除失败，请先删除分类下子分类。', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				$scope.deleteDisabled = false;
			}
		}, function (errortemp) { });
	}

	$scope.saveCurrentPushMessageCategory = function () {
		$scope.saveCurrentButtonDisabled = true;
		var newid = getDataSource.getGUID();
		if (id != undefined && id != "0" && id != undefined && id != null) {
			var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
			var fids = "";
			if (temp != null) {
				fids = temp.id + "." + id;
			} else {
				fids = id;
			}
			getDataSource.getDataSource("updatePushMessageCategoryById",
				{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids },
				function (datatemp) {
					$scope.saveCurrentButtonDisabled = false;
					if (datatemp.length > 0) {
						notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.loadCategoryTree();
					} else {
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) {
					$scope.saveCurrentButtonDisabled = false;
				});
		}
	}

	$scope.savePushMessageCategory = function () {
		$scope.saveButtonDisabled = true;
		var newid = getDataSource.getGUID();

		var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
		var fids = "";
		if (temp != null) {
			fids = temp.id + "." + newid;
		} else {
			fids = newid;
		}

		var fid = id;
		if (fid == undefined || fid == "0") {
			fid = "0";
		}

		var postObj = { id: newid, fid: fid, name: $scope.categoryForm.childname,sortnum:$scope.categoryForm.sortnum, platformid: $rootScope.user.platformid, fids: fids }
		getDataSource.getDataSource("insert_pushMessageCategory", postObj,
			function (datatemp) {
				$scope.saveButtonDisabled = false;
				if (datatemp.length > 0) {
					notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.my_data = [];
					id = 0;
					$scope.loadCategoryTree();
				} else {
					notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}
			}, function (errortemp) {
				$scope.saveButtonDisabled = false;
			});
		//}
	}

	$scope.my_data = new Array();
	$scope.my_tree = tree = {};
	$scope.loadCategoryTree = function () {
		getDataSource.getDataSource("select_pushMessageParent", {}, function (datatemp) {
			var len = datatemp.length;
			var root = new Object();
			root.label = "消息推送分类";
			root.rowid = "0";
			root.children = new Array()
			for (var i = 0; i < len; i++) {
				if (datatemp[i].fid == '0') {
					drawChild(root, datatemp, datatemp[i])
				}
			}

			$scope.my_data.push(root);
			$scope.doing_async = false;
			///console.log("tree", tree);
			//tree.expand_branch(tree.get_first_branch());
			tree.expand_all();
		}, function (errortemp) {

		});
	}
	function drawChild(root, datatemp, fobj) {
		var tempobj = { label: fobj.name, rowid: fobj.id, children: [] };
		var childlist = _.filter(datatemp, { fid: fobj.id });
		var length = childlist.length;
		if (length > 0) {
			for (var i = 0; i < length; i++) {
				drawChild(tempobj, datatemp, childlist[i]);
			}
		}
		root.children.push(tempobj);
	}
	$scope.try_async_load = function () {
		$scope.my_data = new Array();
		$scope.doing_async = true;
		$scope.loadCategoryTree();
	};
	$scope.try_async_load();
}]);