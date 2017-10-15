angular.module("myApp")
.controller("logconfigtreeController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, notify, getDataSource, DateService, CommonService) {
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
			var array = ["select_logconfigParent"];
			getDataSource.getConnKeyList(array, {}
						, null
						, null, null, { connectionKey: "LogConnectionString" }
						, function (datatemp) {
				$scope.parentCategory = datatemp;
				$scope.parentCategory.push({ id: "", fid: "0", name: "" });
				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
						getDataSource.getConnKeyList(["getLogConfigById"], { id: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {

						$scope.categoryForm = datatemp[0];
					}, function (errortemp) { });
				}
			}, function (errortemp) { });
		}

		$scope.deletePushMessageCategory = function () {
			$scope.deleteDisabled = true;
				getDataSource.getConnKeyList(["getLogConfigChildrenByFId"], { fid: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {

				var childrencount = datatemp.length;
				//id不为空，则认为为修改
				if (childrencount <= 0) {
					getDataSource.getConnKeyList(["deleteLogConfig"], { id: id }
							, null
							, null, null, { connectionKey: "LogConnectionString" }
							, function (datatemp) {
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

		function saveCurrent(postData) {
			getDataSource.getConnKeyList(["updateLogConfig"],
			postData
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {

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

		function saveCategory(postObj) {
			var array = ["insertLogConfig"];
			getDataSource.getConnKeyList(array, postObj
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {

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
		}
		$scope.checkCode = function () {
			var postData = { id: id, code: $scope.categoryForm.code };
			getDataSource.getConnKeyList(["selectLogConfigCode"],
			postData
			, null
			, null, null, { connectionKey: "LogConnectionString" }
			, function (datatemp) {
				if (datatemp.length > 0) {
					notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					$scope.saveCurrentButtonDisabled = true;
				} else {
					$scope.saveCurrentButtonDisabled = false;
					//saveCurrent(postData);
				}
			}, function (errortemp) {

			});
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


				var postData={ id: id, fid: $scope.categoryForm.fid, code: $scope.categoryForm.code, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids };
				saveCurrent(postData);
				//getDataSource.getConnKeyList(["selectLogConfigCode"],
				//postData
				//, null
				//, null, null, { connectionKey: "LogConnectionString" }
				//, function (datatemp) {
				//	if (datatemp.length > 0) {
				//		notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				//	} else {
						
				//	}
				//}, function (errortemp) {

				//});
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

			var postObj = { id: newid, fid: fid, name: $scope.categoryForm.childname, code: $scope.categoryForm.code, sortnum: $scope.categoryForm.sortnum, fids: fids }
			saveCategory(postObj);
			//getDataSource.getConnKeyList(["selectLogConfigCode"],
			//postObj
			//, null
			//, null, null, { connectionKey: "LogConnectionString" }
			//, function (datatemp) {
			//	if (datatemp.length > 0) {
			//		notify({ message: '编码已经存在', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			//	} else {
					
			//	}
			//}, function (errortemp) {

			//});
		}

		$scope.my_data = new Array();
		$scope.my_tree = tree = {};
		$scope.loadCategoryTree = function () {
			var array = ["select_logconfigParent"];
			getDataSource.getConnKeyList(array, { }
				, null
				, null, null, { connectionKey: "LogConnectionString" }
				, function (datatemp) {
				var len = datatemp.length;
				var root = new Object();
				root.label = "日志分类";
				root.rowid = "0";
				root.children = new Array()
				for (var i = 0; i < len; i++) {
					if (datatemp[i].fid == '0') {
						drawChild(root, datatemp, datatemp[i])
					}
				}

				$scope.my_data.push(root);
				$scope.doing_async = false;
				//console.log("tree", tree);
				//tree.expand_branch(tree.get_first_branch());
				//tree.expand_all();
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