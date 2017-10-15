angular.module("myApp")
.controller("pushmessageEditController", ["$scope", "$rootScope", "$modal", "$timeout", '$stateParams', 'notify', '$state', "getDataSource", "FilesService"
	, function ($scope, $rootScope, $modal, $timeout, $stateParams, notify, $state, getDataSource, FilesService) {

		$scope.allcategory = [];
		$scope.levelonelist = [];
		$scope.leveltwolist = [];
		$scope.levelthreelist = [];
		$scope.news = new Object();
		$scope.showPublishBtn = false;

		var editid = $stateParams.id;

		$scope.selectOnly1Or2 = function (item, selectedItems) {
			//console.log("item",item);
			if (selectedItems !== undefined && selectedItems.length >= 20) {
				return false;
			} else {
				return true;
			}
		};

		$scope.goback = function () {
			$state.go("index.pushmessagelist");
		}

		$scope.switchViewCallback = function (scopeObj) {
			//console.log("scopeObj",scopeObj);
			//if (scopeObj.switchViewLabel == 'test2') {
			//	scopeObj.switchViewLabel = 'test1';
			//	scopeObj.inputModel = data1;
			//	scopeObj.selectOnlyLeafs = true;
			//} else {
			//	scopeObj.switchViewLabel = 'test2';
			//	scopeObj.inputModel = data3;
			//	scopeObj.selectOnlyLeafs = false;
			//}
		}

		function drawChild(root,datatemp, fobj) {
			var tempobj = { name: fobj.name, id: fobj.id, children: [] };
			var childlist = _.filter(datatemp, { fid: fobj.id });
			var length = childlist.length;
			for (var i = 0; i < length; i++) {
				drawChild(tempobj,datatemp, childlist[i]);
			}
			root.children.push(tempobj);
		}

		function checkChildSelected(roottemp, selectlist) {
			var objArray = _.filter(selectlist, { id: roottemp.id })
			//console.log("objArray", objArray)
			if (objArray.length>0) {
				for (var i = 0; i < objArray.length; i++) {
					roottemp.selected = true;
					roottemp.isActive = true;
				}
				$scope.news.selectedItem.push(roottemp);
			} else {
				var length = roottemp.children.length;
				for (var i = 0; i < length; i++) {
					checkChildSelected(roottemp.children[i], selectlist)
				}
			}
		}

		$scope.LoadData = function () {
			getDataSource.getDataSource(["selectAllPushMessageCategory"], {}, function (data) {
				$scope.allcategory = [];
				var len = data.length;

				var root = new Object();
				root.label = "信息分类";
				root.rowid = "0";
				root.children = new Array()
				for (var i = 0; i < len; i++) {
					if (data[i].fid == '0') {
						drawChild(root,data, data[i])
					}
				}
				
				//加载表单数据
				if (editid != null && editid != "") {
					$scope.showPublishBtn = true;
					getDataSource.getDataSource(["getPushMessageById", "getPushMessageCategoryByMessageId"], { id: editid }, function (data) {
						$scope.news = _.find(data, { name: "getPushMessageById" }).data[0];
						//console.log($scope.news);
						$scope.news.selectedItem = new Array();
						var selectlist = _.find(data, { name: "getPushMessageCategoryByMessageId" }).data;
						var categorylength = root.children.length;

						//var selectlength = selectlist.length;
						//for (var i = 0; i < selectlength; i++) {
							
						//}

						//console.log("root", root);
						for (var i = 0; i < categorylength; i++) {
							checkChildSelected(root.children[i], selectlist);
						}
						$scope.allcategory = root.children;
					}, function (error) { });
				} else {
					$scope.allcategory = root.children;
				}
				
			}, function (errortemp) { });
		}

		$scope.uploadFiles = function (files) {
			$scope.files = files;
			$scope.news.pdfname = $scope.files[0].name;
		}

		$scope.saveNew = function () {
			var newid = getDataSource.getGUID();
			$scope.news.id = newid;
			var selectlist = $scope.news.selectedItem;
			var length = selectlist.length;
			var categorylist = new Array();
			for (var i = 0; i < length; i++) {
				var temp = new Object();
				temp.categoryid = selectlist[i].id;
				temp.messageid = newid;
				categorylist.push(temp);
			}
			$scope.news.pdfname = "";
			$scope.news.pdfservername = "";
			$scope.news.platformid = $rootScope.user.platformid;
			$scope.news.categorylist = categorylist;
			$scope.news.createuser = $rootScope.user.name;
			$scope.news.createtime = new Date();

			if ($scope.files!=undefined&& $scope.files.length > 0) {
				FilesService.upLoadPicture($scope.files[0], { upcategory: "pushMessagePdf" }, function (data) {
					$scope.news.pdfname = $scope.files[0].name;
					$scope.news.pdfservername = data.data[0].servername;
					//console.log("$scope.news", $scope.news)
					//文件上传成功后，再保存数据
					getDataSource.getDataSource(["insertPushMessage"], $scope.news, function (datatemp) {
						//console.log("$scope.news.categorylist", $scope.news.categorylist);
						getDataSource.doArray("insertPushMessageRelation", $scope.news.categorylist, function (data) {
							$scope.saveDisabled = false;
							notify({ message: "保存成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						}, function (error) {
							$scope.saveDisabled = false;
							notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
						});
					}, function (error) {
						$scope.saveDisabled = false;
						notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
					});
				});
			} else {
				$scope.saveDisabled = false;
				notify({ message: "请选择附件上传", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}
		}

		function SaveData() {
			getDataSource.getDataSource(["updatePushMessage","deletePushMessageRelationByMessageId"], $scope.news, function (datatemp) {
				//console.log(" $scope.news.categorylist", $scope.news.categorylist);
				getDataSource.doArray("insertPushMessageRelation", $scope.news.categorylist, function (data) {
					$scope.saveDisabled = false;
					notify({ message: "保存成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				}, function (error) {
					$scope.saveDisabled = false;
					notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
				});
			}, function (error) {
				$scope.saveDisabled = false;
				notify({ message: "保存失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}

		$scope.saveForm = function () {
			
			var selectlist = $scope.news.selectedItem;
			var length = selectlist.length;
			var categorylist = new Array();
			for (var i = 0; i < length; i++) {
				var temp = new Object();
				temp.categoryid = selectlist[i].id;
				temp.messageid = editid;
				categorylist.push(temp);
			}
			$scope.news.id = editid;
			$scope.news.categorylist = categorylist;
			$scope.news.publishuser = $rootScope.user.name;
			$scope.news.publishtime = new Date();
			if ($scope.files != undefined && $scope.files.length > 0) {
				FilesService.upLoadPicture($scope.files[0], { upcategory: "pushMessagePdf" }, function (data) {
					$scope.news.pdfname = $scope.files[0].name;
					$scope.news.pdfservername = data.data[0].servername;
					SaveData();
				});
			} else {
				SaveData();
			}
		}

		$scope.saveDisabled = false;
		$scope.save = function (act) {
			//console.log($scope.news);
			$scope.saveDisabled = true;
			if (editid == null || editid == "") {
				$scope.saveNew();
			} else {
				$scope.saveForm();
			}
		}
		$scope.LoadData();

		//发布
		$scope.publish = function () {
			var temp = new Object();
			temp.id = editid;
			temp.publishuser = $rootScope.user.name;
			temp.publishtime = new Date();
			temp.status = 1;
			
			getDataSource.getDataSource("publishPushMessage", temp, function (data) {
				$scope.saveDisabled = false;
				notify({ message: "发布成功", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			}, function (error) {
				$scope.saveDisabled = false;
				notify({ message: "发布失败", classes: 'alert-info', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
			});
		}
}]);