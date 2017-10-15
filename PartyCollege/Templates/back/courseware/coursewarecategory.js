app.controller("coursewarecategoryController"
	, ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', "$modal", 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, $modal,notify, getDataSource, DateService, CommonService) {
		var apple_selected, tree, treedata_avm, treedata_geography;
		var id = 0;
		$scope.parentDisabled = false;
		$scope.nameDisabled = false;
		//$scope.childnameDisabled = false;
		$scope.saveCurrentButtonDisabled = false;
		//$scope.saveButtonDisabled = false;
		$scope.deleteDisabled = false;
		$scope.sortsDisabled = false;

		$scope.categoryForm = { sortnum: 0 };
		//选中事件
		$scope.my_tree_handler = function (branch) {
			$scope.output = ""; //"You selected: " + branch.label + ",rowid:" + branch.rowid+",fid="+branch.fid;
			//if ((_ref = branch.data) != null ? _ref.description : void 0) {
			//	return $scope.output += '(' + branch.data.description + ')';
		    //}
			//$scope.saveButtonDisabled = false;
			if (branch.rowid == "0") {
				$scope.parentDisabled = true;
				$scope.nameDisabled = true;
				$scope.categoryForm = { sortnum: 0 };

				$scope.saveCurrentButtonDisabled = true;
				$scope.deleteDisabled = true;
			} else {
				$scope.parentDisabled = false;
				$scope.nameDisabled = false;
				$scope.saveCurrentButtonDisabled = false;
				$scope.deleteDisabled = false;
				$scope.sortsDisabled = false;
				//$scope.childnameDisabled = false;
			}
			if (branch.isedit == 1) {
				$scope.parentDisabled = true;	 
				//$scope.childnameDisabled = true;
				$scope.nameDisabled = true;
				$scope.parentDisabled = true;
				$scope.sortsDisabled = true;

				$scope.saveCurrentButtonDisabled = true;
				$scope.deleteDisabled = true;
				//$scope.saveButtonDisabled = true;

			} else if (branch.isedit == 2) {
				if (branch.rowid == "0") {
					$scope.parentDisabled = true;
					$scope.nameDisabled = true;
					$scope.sortsDisabled = false;
					//$scope.childnameDisabled = false;
					//$scope.saveButtonDisabled = false;
				} else {
					$scope.parentDisabled = false;
					$scope.nameDisabled = false;
					$scope.sortsDisabled = false;
					//$scope.childnameDisabled = false;
				}
			}
			$scope.loadCourseCategoryParent(branch);
		};


		function drawDropChild(datatemp, fobj, str) {
			var tempobj = { id: fobj.id, fid: fobj.fid, name: fobj.name};
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			
			tempobj.name = str + '┕━' + fobj.name;
			$scope.parentCategory.push(tempobj);
			if (length > 0) {
				str = str + "　";
				for (var i = 0; i < length; i++) {
					drawDropChild(datatemp, childlist[i], str);
				}
			}
		}

		$scope.loadCourseCategoryParent = function (branch) {
			id = branch.rowid;
			getDataSource.getDataSource("select_courseCategoryParent", { platformid: $rootScope.user.platformid }, function (datatemp) {
				$scope.parentCategory = new Array();
				$scope.parentCategory.push({ id: "0", fid: "0", name: "根目录" });

				var fidData = _.filter(datatemp, { fid: "0" });
				var length = _.filter(fidData, { fid: "0" }).length;
				var str = '　';
				for (var i = 0; i < length; i++) {
					drawDropChild(datatemp, fidData[i], str);
				}

				//id不为空，则认为为修改
				if (id != "" && id != undefined && id != null) {
					getDataSource.getDataSource("getcourseCategoryById", { id: id }, function (datatemp) {
						if (datatemp.length > 0) {
							$scope.categoryForm = datatemp[0];
						}
					}, function (errortemp) { });
				}
			}, function (errortemp) { });
		}

		$scope.ok = function () {
			$scope.isAccept = true;
			$scope.deleteDisabled = true;
			getDataSource.getDataSource("select_courseCategoryChildren", { fid: id }, function (datatemp) {
				var childrencount = datatemp.length;
				//id不为空，则认为为修改
				if (childrencount <= 0) {
					getDataSource.getDataSource("deletecourseCategoryById", { id: id }, function (datatemp) {
						if (datatemp.length > 0) {
							notify({ message: '删除成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$scope.my_data = [];
							$scope.categoryForm = { sortnum: 0 };
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
			$scope.close();
		}
	    //打开新增窗口
		$scope.OpenNewForm = function () {
		    $scope.modalInstance = $modal.open({
		        templateUrl: 'newcategory.html',
		        size: 'bg',
		        scope: $scope
		    });
		}
		//关闭模式窗口
		$scope.close = function () {
			$scope.modalInstance.dismiss('cancel');
		}

		//删除
		$scope.deleteCourseCategory = function () {
			$scope.modalInstance = $modal.open({
				templateUrl: 'confirm.html',
				size: 'sm',
				scope: $scope
			});
		}

		$scope.saveCurrentCourseCategory = function () {
			$scope.saveCurrentButtonDisabled = true;
			var newid = getDataSource.getGUID();
			if (id != undefined && id != "0" && id != undefined && id != null) {

			    var newid = getDataSource.getGUID();

			    fids = $scope.categoryForm.id;
			    $scope.getFids($scope.categoryForm.fid);
			    if (fids) {
			        //反转
			        var fidsArray = fids.split('.');
			        _.reverse(fidsArray)
			        var length = fidsArray.length;
			        fids = _.join(fidsArray, '.');
			    }
			    if (fids == undefined) {
			        fids = newid;
			    }
			    var fid = "";
			    if ($scope.categoryForm.fid == "" || $scope.categoryForm.fid == undefined) {
			        fid = "0";
			    }

				//var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
				//var fids = "";
				//if (temp != null) {
				//	fids = temp.id + "." + id;
				//} else {
				//	fids = id;
				//}

				getDataSource.getDataSource("updateCourseCategoryById",
					{ id: id, fid: $scope.categoryForm.fid, name: $scope.categoryForm.name, sortnum: $scope.categoryForm.sortnum, fids: fids },
					function (datatemp) {
						$scope.saveCurrentButtonDisabled = false;
						if (datatemp.length > 0) {
							notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
							$scope.my_data = [];
							$scope.categoryForm = { sortnum: 0 };
							//id = 0;
							$scope.loadCategoryTree();
						} else {
							notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}
					}, function (errortemp) {
						$scope.saveCurrentButtonDisabled = false;
					});
			}
		}

		var fids = "";
		$scope.getFids = function (fid) {
		    var temp = _.find($scope.parentCategory, { id: fid });
		    if (temp != null && temp.id!="0") {
		        fids = fids + "." + temp.id;
		        $scope.getFids(temp.fid);
		    }
		}

		//$scope.test = function () {
		//    var newid = getDataSource.getGUID();
		//    fids = $scope.categoryForm.id;
		//    $scope.getFids($scope.categoryForm.fid);
		//    if (fids) {
		//        //反转
		//        var fidsArray = fids.split('.');
		//        _.reverse(fidsArray)
		//        var length = fidsArray.length;
		//        fids = _.join(fidsArray,'.');
		//    }
		//    console.log("fids", fids);
		//}
		
		

		$scope.saveCourseCategory = function () {
			//$scope.saveButtonDisabled = true;
		    var newid = getDataSource.getGUID();

		    fids = $scope.categoryForm.id;
		    $scope.getFids($scope.categoryForm.fid);
		    if (fids) {
		        //反转
		        var fidsArray = fids.split('.');
		        _.reverse(fidsArray)
		        var length = fidsArray.length;
		        fids = _.join(fidsArray, '.');
		    }
		    if (fids == undefined) {
		        fids = newid;
		    }

			//fids = $scope.categoryForm.id;
			//$scope.getFids($scope.categoryForm.fid);

			//var temp = _.find($scope.parentCategory, { id: $scope.categoryForm.fid });
			//if (temp != null) {
			//	fids = temp.id + "." + newid;
			//} else {
			//	fids = newid;
			//}

			var fid = id;
			if (fid == undefined || fid == "0") {
				fid = "0";
			}

			var postObj = {};
			postObj.id=newid;
			postObj.fid=fid; 
			postObj.name=$scope.categoryForm.childname;
			postObj.sortnum=$scope.categoryForm.sortnum;
			postObj.platformid=$rootScope.user.platformid
			postObj.fids=fids;
			postObj.categoryid = newid;
			//var fids = _.find($scope.parentCategory, { id: $scope.categoryForm.fid }).id + "." + newid;
			getDataSource.getDataSource(["insert_courseCategory"], postObj,
				function (datatemp) {
					//$scope.saveButtonDisabled = false;
					if (datatemp.length > 0) {
						notify({ message: '保存成功', classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						$scope.my_data = [];
						$scope.categoryForm = { sortnum: 0 };
						id = 0;
						$scope.loadCategoryTree();
						$scope.close();
					} else {
						notify({ message: datatemp.message, classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					}
				}, function (errortemp) {
					//$scope.saveButtonDisabled = false;
				});
			//}
		}


		$scope.my_data = new Array();
		$scope.my_tree = tree = {};

        //分平台分类数据获取
		$scope.loadCategoryTree = function () {
			getDataSource.getDataSource("select_courseCategoryParent", { platformid: $rootScope.user.platformid }, function (data) {
				var allplatform = data;

				var root = new Object();
				root.label = "总平台课程分类";
				root.rowid = "0";
				root.children = new Array();
				root.isedit = 1;
				for (var i = 0; i < allplatform.length; i++) {
					if (allplatform[i].fid == '0') {
						drawChild(root, allplatform, allplatform[i])
					}
				}
				$scope.my_data.push(root);
				$scope.doing_async = false;
				tree.expand_all();
			}, function (errortemp) {

			});
		}

		function drawChild(root, datatemp, fobj) {
			var tempobj = { label: fobj.name,rowid:fobj.id, children: [],isedit:fobj.category };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length=childlist.length;
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
}])