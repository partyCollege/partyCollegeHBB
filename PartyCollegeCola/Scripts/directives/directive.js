angular.module('app.directive', [])
    .directive('goMainPage', [function () {
    	return {
    		restrict: "AE",
    		priority: 20000,
    		template: "<div>返回</div>",
    		replace: true,
    		controller: ["$rootScope", "$scope", function ($rootScope, $scope) {
    			$scope.goMain = function () {
    			};
    			$scope.goBack = function () {
    			}
    		}]
    	}
    }])
    .directive("checkNum", ["$rootScope", "notify", "debounce", function ($rootScope, notify, debounce) {
    	return {
    		restrict: "AE",
    		scope: {
    			min: "=min",
    			max: "=max",
    			myValue: "=ngModel",
    			defaultValue: "=defaultnum"
    		},
    		link: function (scope, element, attr, ctrl) {

    			var check = function () {
    				var v = scope.myValue;
    				if (isNaN(v)) {
    					notify({ message: '输入的不是数字', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    					scope.myValue = scope.defaultValue;
    					return;
    				}
    				if (scope.min != undefined && scope.max == undefined) {
    					if (parseFloat(v) < scope.min) {
    						notify({ message: '输入的值太小', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    						scope.myValue = scope.min;
    						return;
    					}
    				}
    				if (scope.max != undefined && scope.min == undefined) {
    					if (parseFloat(v) > scope.max) {
    						notify({ message: '输入的值太大', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    						scope.myValue = scope.max;
    						return;
    					}
    				}
    				if (scope.min != undefined && scope.max != undefined) {
    					if (parseFloat(v) < scope.min) {
    						notify({ message: '输入的值太小', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    						scope.myValue = scope.min;
    						return;
    					}
    					if (parseFloat(v) > scope.max) {
    						notify({ message: '输入的值太大', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
    						scope.myValue = scope.max;
    						return;
    					}
    				}
    			};
    			var fn = debounce(500, check);

    			scope.$watch("myValue", function (v, oldValue) {
    				if (v === oldValue || v === scope.defaultValue) { return; }

    				fn();
    			})
    		}
    	}
    }])
    .directive("searchHandle", ["$http", function ($http) {
    	return {
    		restrict: "A",
    		scope: false,
    		link: function ($scope, $element, $attrs) {
    			var split = $attrs.ngModel.split('.');
    			$scope[split[0]][split[1] + "_handle"] = $attrs.searchHandle;
    		}
    	}
    }])
    .directive("searchDbcolumn", ["$http", function ($http) {
    	return {
    		restrict: "A",
    		scope: false,
    		link: function ($scope, $element, $attrs) {
    			var split = $attrs.ngModel.split('.');
    			$scope[split[0]][split[1] + "_dbcolumn"] = $attrs.searchDbcolumn;
    		}
    	}
    }])
    .directive("searchDbtype", ["$http", function ($http) {
    	return {
    		restrict: "A",
    		scope: false,
    		link: function ($scope, $element, $attrs) {
    			var split = $attrs.ngModel.split('.');
    			$scope[split[0]][split[1] + "_dbtype"] = $attrs.searchDbtype;
    		}
    	}
    }])
      .directive("appDate", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
      	return {
      		restrict: "AE",
      		replace: true,
      		scope: {
      			myDate: "=ngModel",
      			minDate: "=minDate",
      			maxDate: "=maxDate",
      			myDisabled: "=ngDisabled"
      		},
      		templateUrl: '../Templates/directive/appDateInput.html',
      		// template:"<datepicker ng-model='dt' min-date='minDate' show-weeks='true' class='well well-sm'></datepicker>",
      		controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
      			$scope.dateOptions = {
      				formatYear: 'yyyy',
      				startingDay: 1,
      				showWeeks: false,
      				currentText: "今天"
      			};
      		}],
      		link: function (scope, element, attr, ctrl) {
      			//alert("123");
      			scope.format = 'yyyy-MM-dd'
      			scope.open = function ($event) {
      				$event.preventDefault();
      				$event.stopPropagation();
      				scope.opened = true;
      			};
      			scope.opened = false;
      		}
      	}
      }])
    .directive("appMessage", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
    	return {
    		restrict: "AE",
    		templateUrl: "../Templates/directive/appMessage.html",
    		replace: true,
    		scope: {},
    		controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
    		}],
    		link: function (scope, element, attr, ctrl) {
    			$http.get("../config/appconfig.json").success(function (data) {
    			});
    			scope.alerts = [
                  { type: 'danger', msg: $sce.trustAsHtml('Oh snap! <a>myname</a>Change a few things up and try submitting again.') }
    			];
    			scope.closeAlert = function (index) {
    				scope.alerts.splice(index, 1);
    			};
    		}
    	}
    }])
.directive("myDirective",['$http', function ($http) {
	return {
		restrict: "AE",
		//template: "<div>helloMyapp11111<div ng-transclude></div></div>",

		link: function (scope, element, attr) {
			element.bind("click", function () {
				alert("123");
				scope.$apply(attr.loadmore);
			});

		}
	}
}])
.directive("studentList", ['getDataSource', function (getDataSource) {
	return {
		restrict: "AE",
		templateUrl: '../Templates/directive/studentList.html',
		replace: true,
		transclude: true,
		scope: {
		    showStudentList: '=myConfig'
		},
		controller: ["$rootScope", "$scope", "$element", "$attrs", "$http", function ($rootScope, $scope, $element, $attrs, $http) {

			$scope.totalServerItems = 0;
			$scope.pagingOptions = {
				pageSizes: [10, 20, 50],
				pageSize: 10,
				currentPage: 1
			};

			$scope.filterOptions = {
				classid: $rootScope.user.classId,
				searchText: ""
			};

			$scope.getPagedDataAsync = function () {
				setTimeout(function () {
					var para = _.merge($scope.filterOptions, {
						pageSize: $scope.pagingOptions.pageSize,
						currentPage: $scope.pagingOptions.currentPage,
					});

					getDataSource.getUrlData("../api/GetStudentContacts", para, function (data) {
						var currentIndex = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
						for (var i = 0; i < data.stuList.length ; i++) {
							_.merge(data.stuList[i], { index: currentIndex + parseInt(i) + 1 });
						}
						$scope.myData = data.stuList;
						if ($scope.pagingOptions.currentPage == 1)
							$scope.totalServerItems = data.datacount;
					}, function (error) { });
				}, 100);
			};

			$scope.search = function () {
				$scope.pagingOptions.currentPage = 1;
				$scope.getPagedDataAsync();
			};

			$scope.getPagedDataAsync();

			$scope.$watch('pagingOptions', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
				}
			}, true);


			$scope.gridOptions = {
				data: 'myData',
				columnDefs: [
                    {
                    	field: 'index',
                    	displayName: '序号',
                    	width: 40
                    },
                    {
                    	field: 'studentname',
                    	displayName: '姓名',
                    	width: 140
                    },
                    {
                        field: 'departmentname',
                    	displayName: '机构',
                    	width: 300
                    },
                    {
                        field: 'rank',
                    	displayName: '职级',
                    	width: 120
                    },
                    {
                    	field: 'phonenum',
                    	displayName: '手机号',
                    	cellTemplate: '<a ng-click="phoneClick(row.entity.id)"><em ng-style="{display:row.entity.phonenumshow ? \'none\':\'block\'}">查看</em><span class="phone" ng-style="{display:row.entity.phonenumshow ? \'block\':\'none\'}">{{row.entity.phonenum}}</span></a>',
                    	width: 100
                    }
				],
				enablePaging: true,
				enableSorting: false,
				showFooter: true,
				multiSelect: false,
				//sortInfo: {
				//    fields: ['index'],
				//    directions: ['asc']
				//},
				totalServerItems: 'totalServerItems',
				pagingOptions: $scope.pagingOptions,
				filterOptions: $scope.filterOptions,
			};


		}],
		link: function (scope, element, attrs) {
			scope.phoneClick = function (id) {
				var currentItem = _.find(scope.myData, { "id": id });
				var flag = currentItem.phonenumshow ? 0 : 1;
				for (var i = 0; i < scope.myData.length ; i++) {
					scope.myData[i].phonenumshow = 0;
				}
				currentItem.phonenumshow = flag;
			}
		}
	}
}])
.directive("selectSource", ['getDataSource', function (getDataSource) {
	return {
		restrict: "AE",
		replace: true,
		scope: {
			ngModel: '=ngModel',
		},
		link: function (scope, element, attrs) {
			var html = "";
			$(element).html("");
			getDataSource.getDataSource("selectSyCodeByClass", { nowclass: attrs.code }, function (data) {
				$(element).html("");
				html += "<option value=''> </option>";
				angular.forEach(data, function (item, index) {
					html += "<option value='" + item.datavalue + "'>" + item.showvalue + "</option>";
				})
				element.append(html);

				scope.$watch('ngModel', function (data) {
					$(element).find("option").each(function (d) {
						if ($(this).val() == data) {
							$(this).attr("selected", "selected");
						}
					});
				});
			});
		}
	}
}])
.directive("committeeList", ['getDataSource', function (getDataSource) {
	return {
		restrict: "AE",
		templateUrl: '../Templates/directive/classCommitteeList.html',
		replace: true,
		transclude: true,
		scope: {
			myConfig: '=myConfig'
		},
		controller: ["$rootScope", "$scope", "$element", "$attrs", "$http",function ($rootScope, $scope, $element, $attrs, $http) {
			$scope.totalServerItems = 0;
			$scope.pagingOptions = {
				pageSizes: [10, 20, 50],
				pageSize: 10,
				currentPage: 1
			};

			$scope.filterOptions = {
				classid: $rootScope.user.classId,
				searchText: ""
			};

			$scope.getPagedDataAsync = function () {
				setTimeout(function () {
					var para = _.merge($scope.filterOptions, {
						pageSize: $scope.pagingOptions.pageSize,
						currentPage: $scope.pagingOptions.currentPage,
					});

					getDataSource.getUrlData("../api/GetCommitteeContacts", para, function (data) {
						var currentIndex = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;

						for (var i = 0; i < data.stuList.length ; i++) {
							_.merge(data.stuList[i], { index: currentIndex + parseInt(i) + 1 });
						}
						$scope.myData = data.stuList;
						if ($scope.pagingOptions.currentPage == 1)
							$scope.totalServerItems = data.datacount;
					}, function (error) { });
				}, 100);
			};

			$scope.search = function () {
				$scope.pagingOptions.currentPage = 1;
				$scope.getPagedDataAsync();
			};

			$scope.getPagedDataAsync();

			$scope.$watch('pagingOptions', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
				}
			}, true);


			$scope.gridOptions = {
				data: 'myData',
				columnDefs: [
                    {
                    	field: 'index',
                    	displayName: '序号',
                    	width: 40
                    },
                    {
                    	field: 'studentname',
                    	displayName: '姓名',
                    	width: 100
                    },
                    {
                    	field: 'workunit',
                    	displayName: '单位',
                    	width: 160
                    },
                    {
                    	field: 'job',
                    	displayName: '职务',
                    	width: 150
                    },
                    {
                    	field: 'jobgrade',
                    	displayName: '职级',
                    	width: 100
                    },
                    {
                    	field: 'phonenum',
                    	displayName: '手机号',
                    	cellTemplate: '<a ng-click="phoneClick(row.entity.id)"><em ng-style="{display:row.entity.phonenumshow ? \'none\':\'block\'}">查看</em><span class="phone" ng-style="{display:row.entity.phonenumshow ? \'block\':\'none\'}">{{row.entity.phonenum}}</span></a>',
                    	width: 100
                    },
                    {
                    	field: 'classposition',
                    	displayName: '班级职务',
                    	width: 170
                    }
				],
				enablePaging: true,
				showFooter: true,
				multiSelect: false,
				enableSorting: false,
				//sortInfo: {
				//    fields: ['index'],
				//    directions: ['asc']
				//},
				totalServerItems: 'totalServerItems',
				pagingOptions: $scope.pagingOptions,
				filterOptions: $scope.filterOptions,
			};

		}],
		link: function (scope, element, attrs) {
			scope.phoneClick = function (id) {
				var currentItem = _.find(scope.myData, { "id": id });
				var flag = currentItem.phonenumshow ? 0 : 1;
				for (var i = 0; i < scope.myData.length ; i++) {
					scope.myData[i].phonenumshow = 0;
				}
				currentItem.phonenumshow = flag;
			}
		}
	}
}])
.directive("teacherList", ['getDataSource', 'FilesService', function (getDataSource, FilesService) {
	return {
		restrict: "AE",
		templateUrl: '../Templates/directive/teacherList.html',
		replace: true,
		transclude: true,
		scope: {
			myConfig: '=myConfig',
			appConfig: '=appConfig'
		},
		controller: ["$rootScope", "$scope", "$element", "$attrs", "$http", function ($rootScope, $scope, $element, $attrs, $http) {
			getDataSource.getDataSource("myclass-teacherContacts", { classid: $rootScope.user.classId }, function (data) {
				for (var n = 0; n < data.length ; n++) {
					if (data[n].headimg)
						data[n].headimg = FilesService.showFile('userPhoto', data[n].headimg, data[n].headimg);
					else
						data[n].headimg = "../img/default_img.png";
				}
				$scope.teacherContactsData = data;
			});
		}],
		link: function (scope, element, attrs) {
			scope.phoneClick = function (id) {
				var currentItem = _.find(scope.teacherContactsData, { "id": id });
				var flag = currentItem.phonenumshow ? 0 : 1;
				//scope.teacherContactsData.forEach(function (n) { n.phonenumshow = 0 });

				for (var i = 0; i < scope.teacherContactsData.length ; i++) {
					scope.teacherContactsData[i].phonenumshow = 0;
				}
				currentItem.phonenumshow = flag;
			}

		}
	}
}])
//菜单 
.directive("pageMenu", [function () {
	return {
		restrict: "AE",
		templateUrl: "../Templates/directive/pageMenu.html",
		scope: {
			myList: "=ngModel"
		},
		replace: true,
		transclude: true,
		controller: ["$scope", "$element", "$attrs", "$location", function ($scope, $element, $attrs, $location) {

			var path = $location.$$path;
			var pArr = path.split("/");
			var isrun = true;
			for (var i = 0; i < $scope.myList.length ; i++) {
				var n = $scope.myList[i];
				n.isSelected = false;
				if (n.childMenus && isrun) {
					for (var a = 0; a < n.childMenus.length ; a++) {
						if (path.indexOf(n.childMenus[a]) >= 0) {
							n.isSelected = true;
							isrun = false;
							break;
						}
					}
				}
			}

		}],
		link: function (scope, element, attr, ctrl) {

			scope.selectMenu = function (iid) {
				var current = _.find(scope.myList, { isSelected: true });
				if (current) {
					current.isSelected = false;
				}
				current = _.find(scope.myList, { id: iid });
				if (current) {
					current.isSelected = true;
				}
			}

		}
	};
}])
.directive("confirmDialog", [function () {
	return {
		restrict: "AE",//<button class="btn btn-warning btn-circle" ng-click="close()" type="button"><i class="fa fa-times tubiaoicon-17"></i></button>
		template: '<div class="dialogMask" ng-show="isOpened"><div class="modal-content" ng-style="dialogStyle"><div class="modal-header red text-center" >温馨提示</div><div class="modal-body"><h3>{{options.message}}</h3></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="confirm()">确定</button><button class="btn btn-warning" type="button" ng-click="close()">取消</button></div></div></div>',
		scope: {
			options: "=ngModel"
		},
		replace: true,
		transclude: true,
		controller: ["$scope", "$element", "$attrs", "$location", function ($scope, $element, $attrs, $location) {
			$scope.isOpened = false;
		}],
		link: function (scope, element, attr, ctrl) {

			scope.$watch("options.isOpened", function () {
				if (scope.options && scope.options.isOpened) {
					scope.isOpened = true;
				} else {
					scope.isOpened = false;
				}
			})

			scope.confirm = function () {

				if (scope.options && scope.options.confirm) {
					scope.options.isOpened = false;
					scope.options.confirm();
				}
			}

			scope.close = function () {
				scope.isOpened = false;
				scope.options.isOpened = false;
			}

			if (scope.options) {
				scope.options.close = function () {
					scope.isOpened = false;
					scope.options.isOpened = false;
				}
			}
		}
	};
}])
.directive('triggerLoading', [function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			scope.prevText = element.text();
			scope.$watch(function () {
				return scope.$eval(attr.triggerLoading);
			}, function (value) {
				if (angular.isDefined(value)) {
					//element.toggleClass('disabled',value);
					value ? element.attr('disabled', true) : element.removeAttr('disabled');
					element.text((value ? attr.btnLoadingText : scope.prevText));
				}
			});
		}
	}
}])
.directive('ztree', ['$rootScope', 'getDataSource', function ($rootScope,getDataSource) {
	return {
		scope: {
			selectNode: '=selectnode',
			selectNodeId: '=selectnodeid'
		},
		restrict: 'AE',
		templateUrl: '../Templates/directive/ztree.html',
		replace: true,
		transclude: true,
		link: function (scope, element, attrs, ctrl) {
			//tree设置
			scope.setting = {
				view: {
					dblClickExpand: false
				},
				data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "pid"
					}
				},
				callback: {
					beforeClick: function () { },
					onClick: function (event, treeId, treeNode, clickFlag) {
						scope.$apply(function () {
							scope.selectNode = treeNode;
							scope.selectNodeName = treeNode.name;
							//selectNode.$setViewValue(treeNode);
							hideMenu();
						});
					}
				}
			};
			//显示部门树
			scope.departmentShow = function (event) {
				var cityObj = $("#txtdepartment");
				var cityOffset = cityObj.offset();
				//alert(cityOffset.left);
				//console.log("cityOffset", cityOffset);
				$("#menuContent").css({ left: 0 + "px", top: 0 + cityObj.outerHeight() + "px" }).slideDown("fast");
				$("body").bind("mousedown", onBodyDown);
			}

			//获取部门数据
			scope.getDepartmentArr = function () {
			    getDataSource.getDataSource('getDepartment', { pid: $rootScope.user.departmentId }, function (data) {
			    	scope.treeData = data;
					var treeObj = $.fn.zTree.init($("#treeDemo"), scope.setting, scope.treeData);
					if (scope.selectNodeId) {
						var node = treeObj.getNodeByParam("id", scope.selectNodeId, null);
						scope.selectNode = node;
						scope.selectNodeName = node.name;
					}
					//$scope.registerSetting.treeinit = true;
				}, function (error) { });
			}
			scope.getDepartmentArr();

			function hideMenu() {
				$("#menuContent").fadeOut("fast");
				$("body").unbind("mousedown", onBodyDown);
			}
			function onBodyDown(event) {
				if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
					hideMenu();
				}
			}
		}
	};
}])

.directive('departmentTree', ['$rootScope', 'getDataSource', function ($rootScope, getDataSource) {
    return {
        scope: {
            selectNode: '=selectnode',
            haschild:"=haschild",
            callback: '=callback'
        },
        restrict: 'AE',
        templateUrl: '../Templates/directive/departmentTree.html',
        replace: true,
        transclude: true,
        link: function (scope, element, attrs, ctrl) {

        	scope.search = {
                departmentid: "",
                departmentname: ""
            };
            //tree设置
        	scope.treeSetting = {
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid"
                    }
                },
                //async: {
                //    enable: true,
                //    url:"/TestZTree/test",
                //    autoParam:["id", "name"],
                //    otherParam:{"otherParam":"zTreeAsyncTest"},
                //    dataFilter: filter
                //},
                callback: {
                    beforeClick: function () { },
                    onClick: function (e, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var nodes = zTree.getSelectedNodes();
                        if (nodes.length > 0) {
                        	scope.$apply(function () {
                        		scope.selectNode=nodes[0];
                        		//if (scope.selectNodeId != undefined)
                        		//	 = nodes[0].id;
                        		//if (scope.selectNodeName != undefined)
                        		//    scope.selectNodeName = .name;
                        		if (nodes[0].children && nodes[0].children.length > 0)
                        		    scope.haschild = true;
                        		else
                        		    scope.haschild = false;
                            });

                        	scope.$apply(function () {
                        		if (scope.callback) {
                        			scope.callback();
                                }
                            });
                        }
                    }
                }
            };


            ////获取部门数据回调
        	//window.apiCallback.getAllDepartment = function (data) {

        	//    for (var i = 0; i < data.length; i++) {
        	//        data[i].icon = "../img/1_1.png";
        	//    }

        	//    scope.treeData = data;
        	//    $.fn.zTree.init($("#treeDemo"), scope.treeSetting, scope.treeData);

        	//    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        	//    //treeObj.expandAll(true);

        	//    var nodes = treeObj.getNodes();
        	//    if (nodes.length > 0) {
        	//        treeObj.expandNode(nodes[0], true, false, true);
        	//        //treeObj.selectNode(nodes[0], false, false);

        	//        //if (scope.callback) {
        	//        //    scope.callback();
        	//        //}
        	//    }
        	//}

            //获取部门数据
        	scope.getDepartmentArr = function () {

        	    getDataSource.getDepartmentAdmin(function (data) {
        	        scope.departmentdata = data;
        	        scope.treeData = data;
        	        $.fn.zTree.init($("#treeDemo"), scope.treeSetting, scope.treeData); 
        	        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");  
        	        var nodes = treeObj.getNodes();
        	        if (nodes.length > 0) {
        	            treeObj.expandNode(nodes[0], true, false, true); 
        	        }

        	    }, function (error) { });



        	    //var mid = $rootScope.user.mdepartmentId;
        	    //if ($rootScope.user.usertype == 2) {
        	    //    mid = $rootScope.user.departmentId;
        	    //}
        	    //getDataSource.getDataSource('getDepartmentHasAdminByPId', { id: mid, pid: mid }, function (data) {

        	    //    scope.treeData = data;
        	    //    $.fn.zTree.init($("#treeDemo"), scope.treeSetting, scope.treeData);
        	    //    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        	    //    var nodes = treeObj.getNodes();
        	    //    if (nodes.length > 0) {
        	    //        treeObj.expandNode(nodes[0], true, false, true);
        	    //    }
        	    //}, function (e) {
        	    //});



        	    //var data = [{ "id": "100000", "name": "全国环保系统", "pid": "", "pids": "100000", "nocheck": 1, "icon": "../img/1_1.png", "isparent": 1 }, { "id": "999999", "name": "环境保护部", "pid": "100000", "pids": "100000,999999", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "110000", "name": "北京市", "pid": "100000", "pids": "100000,110000", "nocheck": 1, "icon": "../img/1_1.png", "isparent": 1 }, { "id": "120000", "name": "天津市", "pid": "100000", "pids": "100000,120000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "130000", "name": "河北省", "pid": "100000", "pids": "100000,130000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "140000", "name": "山西省", "pid": "100000", "pids": "100000,140000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "150000", "name": "内蒙古自治区", "pid": "100000", "pids": "100000,150000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "210000", "name": "辽宁省", "pid": "100000", "pids": "100000,210000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "220000", "name": "吉林省", "pid": "100000", "pids": "100000,220000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "230000", "name": "黑龙江省", "pid": "100000", "pids": "100000,230000", "nocheck": 1, "icon": "../img/1_1.png", "isparent": 1 }, { "id": "240000", "name": "辽河保护区", "pid": "100000", "pids": "100000,240000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "310000", "name": "上海市", "pid": "100000", "pids": "100000,310000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "320000", "name": "江苏省", "pid": "100000", "pids": "100000,320000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "330000", "name": "浙江省", "pid": "100000", "pids": "100000,330000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "340000", "name": "安徽省", "pid": "100000", "pids": "100000,340000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "350000", "name": "福建省", "pid": "100000", "pids": "100000,350000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "360000", "name": "江西省", "pid": "100000", "pids": "100000,360000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "370000", "name": "山东省", "pid": "100000", "pids": "100000,370000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "410000", "name": "河南省", "pid": "100000", "pids": "100000,410000", "nocheck": 1, "icon": "../img/1_0.png", "isparent": 1 }, { "id": "420000", "name": "湖北省", "pid": "100000", "pids": "100000,420000", "nocheck": 1, "icon": "../img/1_1.png", "isparent": 1 }];
        	    //scope.treeData = data;
        	    //$.fn.zTree.init($("#treeDemo"), scope.treeSetting, scope.treeData);
        	    //var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        	    //var nodes = treeObj.getNodes();
        	    //if (nodes.length > 0) {
        	    //    treeObj.expandNode(nodes[0], true, false, true);
        	    //}

            }

        	scope.getDepartmentArr();
        }
    };
}])
;