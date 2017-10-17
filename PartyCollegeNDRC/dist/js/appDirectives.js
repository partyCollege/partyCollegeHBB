(function() {
  var module;

  module = angular.module('angularBootstrapNavTree', []);

  module.directive('abnTree', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">\n  <li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-animate=\"'abn-tree-animate'\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"abn-tree-row\">\n    <a ng-click=\"user_clicks_branch(row.branch)\">\n      <i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"> </i>\n      <span class=\"indented tree-label\">{{ row.label }} </span>\n    </a>\n  </li>\n</ul>",
        replace: true,
        scope: {
          treeData: '=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '='
        },
        link: function(scope, element, attrs) {
          var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;
          error = function(s) {
            //console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
          }
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
          }
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }
          expand_level = parseInt(attrs.expandLevel, 10);
          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }
          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }
          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };
          selected_branch = null;
          select_branch = function(branch) {
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };
          scope.tree_rows = [];
          on_treeData_change = function() {
            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = "" + Math.random();
              }
            });
            //console.log('UIDs are set.');
            for_each_branch(function(b) {
              var child, _i, _len, _ref, _results;
              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });
            scope.tree_rows = [];
            for_each_branch(function(branch) {
              var child, f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };
                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child));
                    }
                    return _results;
                  })();
                }
              } else {
                return branch.children = [];
              }
            });
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (!branch.children || branch.children.length === 0) {
                tree_icon = attrs.iconLeaf;
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              scope.tree_rows.push({
                level: level,
                branch: branch,
                label: branch.label,
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };
          scope.$watch('treeData', on_treeData_change, true);
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          //console.log('num root branches = ' + n);
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;
                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };
              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]);

}).call(this);

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
                    	displayName: '类别',
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
angular.module('app.directive')
.directive('focusOnCondition', ['$timeout',
    function ($timeout) {
        var checkDirectivePrerequisites = function (attrs) {
            if (!attrs.focusOnCondition && attrs.focusOnCondition != "") {
                throw "FocusOnCondition missing attribute to evaluate";
            }
        }

        return {
            restrict: "A",
            link: function (scope, element, attrs, ctrls) {
                checkDirectivePrerequisites(attrs);

                scope.$watch(attrs.focusOnCondition, function (currentValue, lastValue) {
                    if (currentValue == true) {
                        $timeout(function () {
                            element.focus();
                        });
                    }
                });
            }
        };
    }
])
.directive("appLogin", ["$http", "$rootScope", "$timeout", "$interval", "$sce", "$validation", "SessionService", "AccountService", "getDataSource", "CommonService", "dateFilter", "smsService",
	function ($http, $rootScope, $timeout, $interval, $sce, $validation, SessionService, AccountService, getDataSource, CommonService, dateFilter, smsService) {
	    return {
	        restrict: "AE",
	        templateUrl: "../Templates/directive/appLogin.html",
	        replace: true,
	        transclude: true,
	        scope: {},
	        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
	            $scope.CloseDiv = function () {
	                $scope.showChooseMultiClass = { "display": "none" };
	                scope.changeCode();
	            }
	            $scope.selectedItems = [];
	            //$scope.gridStyle=
	            $scope.gridOptions = {
	                data: 'myData',
	                columnDefs: [
						{
						    headerCellTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
						    cellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>'
						},
						{ field: "name", displayName: '班级名称', width: 260 },
						{ field: "starttime", displayName: '开班时间', width: 180, cellFilter: 'date:mediumDate' },
						{ field: "endtime", displayName: '结班时间', width: 180, cellFilter: 'date:mediumDate' }
	                ],
	                showFooter: false,
	                selectedItems: $scope.selectedItems
	            };
	            $scope.loadGrid = function (multiobj) {
	                var array = ["getMultiClassList", "getMultiClassById"];
	                $scope.multiclass = multiobj;
	                getDataSource.getDataSource(array, { multipkgid: multiobj.multipkgid }, function (data) {
	                    $scope.myData = _.find(data, { name: "getMultiClassList" }).data;
	                    $scope.multiClassObj = _.find(data, { name: "getMultiClassById" }).data[0];
	                });
	            }
	        }],
	        link: function (scope, element, attr, ctrl) {
	            scope.studentTemp = new Object();
	            var configSeconds = 90;
	            var timer = null;
	            if (timer != null) {
	                $interval.cancel(timer);
	            }
	            //注册第一步四个文本框验证全部通过，全部为true
	            scope.oneformValidataArray = [
					{ valid: false },
					{ valid: false },
					{ valid: false }];
	            //注册第一步下一步是否可用
	            scope.BtnNextStepDisable = false;
	            //注册检查函数
	            scope.ClickNextStepDisable = function (formValidataArray) {
	                var length = formValidataArray.length;
	                var btndisable = false;
	                for (var i = 0; i < length; i++) {
	                    if (!formValidataArray[i].valid) {
	                        btndisable = true;
	                        break;
	                    }
	                }
	                return btndisable;
	            }

	            //注册第二步四个文本框验证全部通过，全部为true
	            scope.twoformValidataArray = [
					{ valid: false },
					{ valid: false }];
	            //注册第二步下一步是否可用
	            scope.BtnFinishStepDisable = false;


	            scope.confirmerrormsg = { message: '' };
	            //点击登录后，按钮设置成不可用
	            scope.clickLoginDisable = false;
	            scope.clickStuRegistDisable = false;
	            scope.clickForgotpwdStepDisable = false;
	            scope.clickForgotpwdDisable = false;
	            scope.clickNewpwdFormDisable = false;
	            //找回密码
	            scope.resetForm = function () {
	                scope.pwdobject = new Object();
	                scope.loginobj = new Object();
	                scope.loginobj = {
	                    requiredCallback: 'required',
	                    checkValid: $validation.checkValid,
	                    submit: function () {
	                        // angular validation 1.2 can reduce this procedure, just focus on your action
	                        // $validationProvider.validate(form);
	                    },
	                    reset: function () {
	                        // angular validation 1.2 can reduce this procedure, just focus on your action
	                        // $validationProvider.reset(form);
	                    }
	                };
	                scope.loginobj.logname = '';
	                scope.loginobj.hashpwd = '';
	                scope.loginobj.confirmhashpwd = '';
	                scope.loginobj.code = '';//正式上线时清空
	                scope.loginobj.name = '';
	                scope.loginobj.idcard = '';
	                scope.loginobj.cellphone = '';
	                scope.loginobj.smscode = '';//正式上线时清空
	                scope.loginobj.serialno_one = '';
	                scope.loginobj.serialno_two = '';
	                scope.loginobj.serialno_three = '';
	                scope.loginobj.serialno_four = '';
	                scope.loginobj.serialno = '';

	                scope.inValidIdCardMessage = '';
	                scope.registerSeconds = configSeconds;
	                scope.pwdSeconds = configSeconds;
	            }
	            scope.resetForm();
	            scope.registerstyle = { "display": "none" };//蒙版默认为隐藏
	            scope.registerStepPublicStyle = { "display": "none" };
	            scope.step = 0;
	            scope.stusteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            scope.matesteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            scope.pwdsteparary = [{ "display": "none" }, { "display": "none" }, { "display": "none" }];
	            //控制多专班
	            scope.showChooseMultiClass = { "display": "none" };
	            var length = scope.stusteparary.length;

	            //保存已选择的多专班
	            scope.SaveMultiClass = function () {
	                scope.clickMultiClassDisable = true;
	                if (scope.selectedItems.length <= 0) {
	                    CommonService.alert("请选择班级");
	                    scope.clickMultiClassDisable = false;
	                    return;
	                }
	                if (scope.selectedItems.length < scope.multiClassObj.minclassnum) {
	                    CommonService.alert("至少选择" + scope.multiClassObj.minclassnum + "个专题");
	                    scope.clickMultiClassDisable = false;
	                    return;
	                }
	                scope.multiclass.selectedClass = scope.selectedItems;
	                getDataSource.getUrlData("../api/multiclass/SaveMultiClass", scope.multiclass, function (datatemp) {
	                    scope.clickMultiClassDisable = false;
	                    CommonService.alert("保存成功");
	                    var hrefArry = $rootScope.appConfig.loginHref;
	                    var hrefobj = _.find(hrefArry, { usertype: 0 });
	                    location.href = "../" + hrefobj.href;
	                }, function (errortemp) {
	                    CommonService.alert("保存失败");
	                });
	            }

	            //回车登录
	            scope.loginKeyup = function (e) {
	                var keycode = window.event ? e.keyCode : e.which;
	                if (keycode == 13) {
	                    scope.login();
	                }
	            };

	            //登录
	            scope.login = function () {
	                scope.clickLoginDisable = true;
	                //return;
	                //验证数据
	                scope.login_logname_message = '';
	                if (scope.loginobj.logname.length == 0) {
	                    scope.login_logname_message = "请输入账号";
	                    scope.clickLoginDisable = false;
	                    return;
	                }
	                scope.login_pwd_message = '';
	                if (scope.pwdobject.hashpwd.length == 0) {
	                    scope.login_pwd_message = "请输入密码";
	                    scope.clickLoginDisable = false;
	                    return;
	                }
	                scope.login_code_message = '';
	                if (scope.loginobj.code.length == 0) {
	                    scope.login_code_message = "请输入验证码";
	                    scope.clickLoginDisable = false;
	                    return;
	                }

	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var loginform = new Object();
	                loginform.logname = scope.loginobj.logname;
	                loginform.hashpwd = md5pwd;
	                loginform.code = scope.loginobj.code;

	                getDataSource.getUrlData("../api/login", loginform, function (datatemp) {
	                    scope.clickLoginDisable = false;
	                    if (datatemp.code == "success") {
	                        //设置指定信息到 $rootScope
	                        if (typeof ($rootScope.user) != "object") {
	                            $rootScope.user = new Object();
	                        }
	                        $rootScope.user = datatemp.loginUser;
	                        $rootScope.user.isLogin = true;
	                        var hrefArry = $rootScope.appConfig.loginHref;
	                        var hrefobj = _.find(hrefArry, { usertype: $rootScope.user.userType });
	                        location.href = "../" + hrefobj.href;// "../" + datatemp.href;
	                    } else if (datatemp.code == "multiclass") {
	                        scope.showChooseMultiClass = { "display": "block" };
	                        scope.loadGrid(datatemp.multiclass);
	                    }
	                    else {
	                        scope.changeCode();
	                        scope.login_result_message = datatemp.message;
	                        //scope.login_result_message = "登录失败";
	                    }
	                }, function (errortemp) {
	                    scope.changeCode();
	                    scope.clickLoginDisable = false;
	                });
	            }
	            //更换验证码
	            scope.currentSrc = "../api/VerifyCode/" + new Date().getTime();
	            scope.changeCode = function () {
	                scope.currentSrc = "../api/VerifyCode/" + new Date().getTime();
	            }
	            //检查身份证
	            scope.remoteCheckIdCard = function () {
	                scope.inValidIdCardMessage = '';
	                if (scope.loginobj.idcard.length <= 0 || scope.loginobj.name.length <= 0) {
	                    return;
	                }
	                getDataSource.getDataSource(["getStudentByIdCard", "getAccountByIdCard"],
						{ idcard: scope.loginobj.idcard, stuname: scope.loginobj.name }, function (datatemp) {
						    var studata = _.find(datatemp, { name: "getStudentByIdCard" }).data;
						    var accdata = _.find(datatemp, { name: "getAccountByIdCard" }).data;

						    if (accdata.length > 0) {
						        scope.inValidIdCardMessage = "身份证号已被注册.";
						        scope.oneformValidataArray[0].valid = false;
						    } else {
						        scope.oneformValidataArray[0].valid = true;
						    }

						    if (scope.oneformValidataArray[0].valid) {
						        if (studata.length == 0) {
						            scope.inValidIdCardMessage = "系统未匹配到信息，请检查姓名和身份证是否匹配.";
						            scope.oneformValidataArray[0].valid = false;
						        } else {
						            scope.oneformValidataArray[0].valid = true;
						        }
						    }
						    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
						}, function (errortemp) {

						});
	            }
	            scope.idcardInvalidClearMsg = function () {
	                scope.inValidIdCardMessage = '';
	            }
	            //检查手机号码
	            scope.remoteCheckCellphone = function () {
	                scope.cellphoneInvalidMsg = '';
	                if (scope.loginobj.cellphone == undefined || scope.loginobj.cellphone.length < 11 || scope.loginobj.cellphone.length > 11) {
	                    return;
	                }

	                //验证idcard和手机号
	                getDataSource.getDataSource(["getStudentByPhone", "getAccountByCellphone"],
					{ idcard: scope.loginobj.idcard, stuphone: scope.loginobj.cellphone }, function (datatemp) {
					    var stuphonedata = _.find(datatemp, { name: "getStudentByPhone" }).data;
					    var accphonedata = _.find(datatemp, { name: "getAccountByCellphone" }).data;

					    if (accphonedata.length > 0) {
					        scope.cellphoneInvalidMsg = "手机号已被注册.";
					        scope.oneformValidataArray[1].valid = false;
					    } else {
					        scope.oneformValidataArray[1].valid = true;
					    }

					    if (scope.oneformValidataArray[1].valid) {
					        if (stuphonedata.length > 0) {
					            scope.sendRegisterSmsDisabled = false;
					            scope.cellphoneInvalidMsg = "";
					            scope.oneformValidataArray[1].valid = true;
					        } else {
					            scope.cellphoneInvalidMsg = "手机号与报名信息不符";
					            scope.oneformValidataArray[1].valid = false;
					        }
					    }
					    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
					}, function (errortemp) {

					});
	            }
	            scope.cellphoneInvalidMsgClear = function () {
	                $interval.cancel(timer);
	                scope.registerSeconds = configSeconds;
	                scope.registerSecondsString = "获取验证码";
	                scope.cellphoneInvalidMsg = '';
	                scope.sendRegisterSmsDisabled = true;
	            }
	            //注册短信模块,默认按钮不能点击，等验证通过后
	            scope.sendRegisterSmsDisabled = true;
	            scope.registerSeconds = configSeconds;

	            //注册验证码倒计时
	            scope.registerSecondsString = "获取验证码";
	            scope.getRegisterSmsCode = function () {
	                scope.sendRegisterSmsDisabled = true;
	                getDataSource.getUrlData("../api/getSMSCode", { phone: scope.loginobj.cellphone, keyname: "registersmscode" }, function (datatemp) { }, function (errortemp) { });
	                timer = $interval(function () {
	                    scope.registerSeconds = scope.registerSeconds - 1;
	                    scope.registerSecondsString = "获取验证码(" + scope.registerSeconds + ")";
	                    if (scope.registerSeconds <= 0) {
	                        $interval.cancel(timer);
	                        scope.registerSecondsString = "重新获取";
	                        scope.registerSeconds = configSeconds;
	                        scope.sendRegisterSmsDisabled = false;
	                        scope.sendSmsDisabled = false;
	                    }
	                }, 1000);
	            }
	            //验证短信验证码
	            scope.remoteCheckSmsCode = function () {
	                if (scope.loginobj.smscode == undefined || scope.loginobj.smscode.length != 4) {
	                    return;
	                }
	                getDataSource.getUrlData("../api/VerifySMSCode", { smscode: scope.loginobj.smscode, keyname: "registersmscode" }, function (datatemp) {
	                    if (datatemp.code == "success") {
	                        scope.sendSmsDisabled = true;
	                        scope.oneformValidataArray[2].valid = true;
	                        $interval.cancel(timer);
	                    } else {
	                        scope.sendSmsDisabled = false;
	                        //此处上线时应为false
	                        scope.oneformValidataArray[2].valid = true;
	                    }
	                    scope.BtnNextStepDisable = scope.ClickNextStepDisable(scope.oneformValidataArray);
	                }, function (errortemp) {

	                });
	            }
	            //检查账号
	            scope.remoteCheckLogname = function () {
	                scope.lognameInvalidMsg = '';
	                if (scope.loginobj.logname == undefined || scope.loginobj.logname.length < 6 || scope.loginobj.logname.length > 18) {
	                    return;
	                }
	                getDataSource.getDataSource(["getAccountByLogname"], { formlogname: scope.loginobj.logname }, function (datatemp) {
	                    if (datatemp.length > 0) {
	                        scope.lognameInvalidMsg = "该账号已经被使用。";
	                        scope.twoformValidataArray[0].valid = false;
	                    } else {
	                        scope.lognameInvalidMsg = "";
	                        scope.twoformValidataArray[0].valid = true;
	                    }
	                    scope.BtnFinishStepDisable = scope.ClickNextStepDisable(scope.twoformValidataArray);
	                }, function (errortemp) {

	                });
	            }
	            scope.lognameInvalidMsgClear = function () {
	                scope.lognameInvalidMsg = "";
	            }
	            //确认密码
	            scope.checkConfirmHashpwd = function () {
	                scope.inValidConfirmHashpwdMessage = '';
	                if (scope.pwdobject.hashpwd != scope.pwdobject.confirmhashpwd) {
	                    scope.inValidConfirmHashpwdMessage = '两次密码输入不一致';
	                    scope.twoformValidataArray[1].valid = false;
	                } else {
	                    scope.twoformValidataArray[1].valid = true;
	                }
	                scope.BtnFinishStepDisable = scope.ClickNextStepDisable(scope.twoformValidataArray);
	            }
	            scope.confirmHashpwdInvalidMsgClear = function () {
	                scope.inValidConfirmHashpwdMessage = '';
	            }
	            //初始化注册步骤
	            scope.initStep = function (op) {
	                scope.registerStepPublicStyle = { "display": "none" };
	                scope.getPwdStyle = { "display": "none" }//隐藏忘记密码框
	                if (op == "stu" || op == "") {
	                    for (var i = 0; i < length; i++) {
	                        scope.stusteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.stusteparary[i] = { "display": "block" };
	                        }
	                    }
	                } else if (op == "mate") {
	                    for (var i = 0; i < length; i++) {
	                        scope.matesteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.matesteparary[i] = { "display": "block" };
	                        }
	                    }
	                }
	                else if (op == "getpwd") {
	                    for (var i = 0; i < length; i++) {
	                        scope.pwdsteparary[i] = { "display": "none" };
	                        if (i == scope.step) {
	                            scope.pwdsteparary[i] = { "display": "block" };
	                        }
	                    }
	                }
	            }
	            //注册
	            scope.register = function () {
	                scope.registerstyle = { "display": "block" };//蒙版显示
	                scope.initStep('');
	                scope.registerStepPublicStyle = { "display": "none" };
	                scope.stuRegister('stu');
	            }
	            //校友注册
	            scope.mateRegister = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            //学员注册
	            scope.stuRegister = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            scope.upstep = function (op) {
	                scope.step--;
	                scope.initStep(op);
	                scope.registerStepPublicStyle = { "display": "block" };
	            }
	            scope.nextstep = function (op) {
	                scope.step++;
	                scope.initStep(op);
	            }
	            //关闭注册
	            scope.closeRegister = function () {
	                scope.resetForm();
	                if (timer != null) {
	                    $interval.cancel(timer);
	                }
	                scope.loginobj.reset();
	                scope.step = 0;
	                for (var i = 0; i < length; i++) {
	                    scope.stusteparary[i] = { "display": "none" };
	                    scope.matesteparary[i] = { "display": "none" };
	                    scope.pwdsteparary[i] = { "display": "none" };
	                }
	                scope.registerstyle = { "display": "none" };

	            }

	            //验证序列号
	            scope.checkSerialNo = function () {
	                if (scope.loginobj.serialno_one == undefined || scope.loginobj.serialno_one.length != 4
						|| scope.loginobj.serialno_two == undefined || scope.loginobj.serialno_two.length != 4
						|| scope.loginobj.serialno_three == undefined || scope.loginobj.serialno_three.length != 4
						|| scope.loginobj.serialno_four == undefined || scope.loginobj.serialno_four.length != 4) {
	                    return;
	                }
	                scope.loginobj.serialno = scope.loginobj.serialno_one + '-' + scope.loginobj.serialno_two + '-' + scope.loginobj.serialno_three + '-' + scope.loginobj.serialno_four;
	                scope.serialerrortext = { message: '' };
	                //无效序列号

	            }
	            //网络学院注册保存
	            scope.saveAccount = function () {
	                scope.clickStuRegistDisable = true;
	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var confirmmd5pwd = md5(scope.pwdobject.confirmhashpwd);
	                var submitform = scope.loginobj;
	                submitform.hashpwd = md5pwd;
	                submitform.confirmhashpwd = confirmmd5pwd;

	                AccountService.saveAccount(submitform, function (data) {
	                    scope.clickStuRegistDisable = false;
	                    CommonService.alert("注册成功");
	                    scope.loginobj.reset();
	                    scope.closeRegister();
	                }, function (error) {
	                    scope.clickStuRegistDisable = false;
	                    scope.pwdobject.hashpwd = '';
	                    scope.pwdobject.confirmhashpwd = '';
	                    CommonService.alert("注册失败");
	                });
	            }
	            //校友注册保存
	            scope.saveMateAccount = function () {

	            }
	            //找回密码
	            scope.getPwd = function () {
	                scope.step = 0;
	                scope.step++;
	                scope.initStep('getpwd');
	                //scope.getPwdStyle = { "display": "block" };
	                scope.registerstyle = { "display": "block" };
	            }
	            //找回密码，下一步
	            scope.getPwdConfirmInfo = function () {
	                scope.clickForgotpwdStepDisable = true;
	                getDataSource.getDataSource(["getAccountByLognameAndPhone"], { formlogname: scope.loginobj.logname, phone: scope.loginobj.cellphone }
					, function (datatemp) {
					    if (datatemp.length <= 0) {
					        CommonService.alert("该账号与手机号不匹配");
					        scope.clickForgotpwdStepDisable = false;
					    } else {
					        //匹配后，再发送短信码
					        scope.nextstep('getpwd');
					        scope.clickForgotpwdStepDisable = false;
					    }
					}, function (errortemp) {
					    scope.clickForgotpwdStepDisable = false;
					});
	            }
	            //发送短信的操作
	            scope.sendSmsDisabled = false;
	            scope.forgotpwdSeconds = configSeconds;

	            //找回密码验证码
	            scope.forgotpwdSecondsString = "获取验证码";
	            scope.getPwdSmsCode = function () {
	                scope.sendSmsDisabled = true;
	                getDataSource.getDataSource(["getAccountByLognameAndPhone"], { formlogname: scope.loginobj.logname, phone: scope.loginobj.cellphone }
						, function (datatemp) {
						    if (datatemp.length <= 0) {
						        CommonService.alert("该账号与手机号不匹配");
						        scope.sendSmsDisabled = false;
						    } else {
						        //匹配后，再发送短信码
						        getDataSource.getUrlData("../api/getSMSCode", { phone: scope.loginobj.cellphone, keyname: "forgotpwdsmscode" }, function (datatemp) { }, function (errortemp) { });
						        timer = $interval(function () {
						            scope.forgotpwdSeconds = scope.forgotpwdSeconds - 1;
						            scope.forgotpwdSecondsString = "获取验证码(" + scope.forgotpwdSeconds + ")";
						            if (scope.forgotpwdSeconds == 0) {
						                $interval.cancel(timer);
						                scope.forgotpwdSecondsString = "重新获取";
						                scope.forgotpwdSeconds = configSeconds;
						                scope.sendSmsDisabled = false;
						            }
						        }, 1000);
						    }
						}, function (errortemp) {
						    scope.sendSmsDisabled = false;
						});
	            }
	            scope.remoteForgotpwdSmscodeMessage = "";
	            scope.remoteForgotPwdCheckSmsCode = function () {
	                if (scope.loginobj.smscode == undefined || scope.loginobj.smscode.length != 4) {
	                    return;
	                }
	                getDataSource.getUrlData("../api/VerifySMSCode", { smscode: scope.loginobj.smscode, keyname: "forgotpwdsmscode" }, function (datatemp) {
	                    if (datatemp.code == "success") {
	                        scope.sendSmsDisabled = true;
	                        scope.clickForgotpwdStepDisable = false;
	                        scope.remoteForgotpwdSmscodeMessage = "";
	                        $interval.cancel(timer);
	                    } else {
	                        scope.remoteForgotpwdSmscodeMessage = "验证码错误";
	                        scope.sendSmsDisabled = false;
	                        scope.clickForgotpwdStepDisable = true;
	                    }
	                }, function (errortemp) {

	                });
	            }
	            scope.clearForgotPwdCheckSmsCodeMessage = function () {
	                scope.remoteForgotpwdSmscodeMessage = "";
	            }
	            //保存新密码
	            scope.saveNewPwd = function () {
	                var md5pwd = md5(scope.pwdobject.hashpwd);
	                var lognametemp = scope.loginobj.logname;
	                getDataSource.getUrlData("../api/Forgotpwd", { formlogname: lognametemp, cellphone: scope.loginobj.cellphone, newpwd: md5pwd }
						, function (datatemp) {
						    if (datatemp.code == "success") {
						        //scope.loginobj.logname = lognametemp;
						        CommonService.alert("更新密码成功");
						        scope.loginobj.reset();
						        scope.closeRegister();
						        scope.resetForm();
						    } else {
						        CommonService.alert("更新密码失败");
						    }
						}, function (errortemp) {
						    CommonService.alert("更新密码失败");
						});
	            }
	            //帮助按钮
	            scope.helpDoc = function () {
	                return;
	            }
	        }
	    }
	}])
.directive("apptop", ["$http", "$location", "$timeout", "$sce", '$rootScope', "DateService", 'getDataSource', function ($http, $location, $timeout, $sce, $rootScope, DateService, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/apptop.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
            DateService.getTodayDateSpan(function (data) {
                $scope.todaydatespan = data;
            }, function (error) {
                $scope.todaydatespan = error;
            });
            $scope.user = $rootScope.user;

            $scope.gologin = function () {
            	location.href = "../html/index.html#/main/index";
            }

            $scope.toToSetting = function () {
            	var path = $location.absUrl();

            	var objtemp = _.find($rootScope.mainConfig, { 'select': true });
            	if (typeof (objtemp) == "object") {
            		objtemp.select = false;
            	}

            	var obj = _.find($rootScope.mainConfig, { 'elementName': "usercenter" });
            	if (typeof (obj) == "object") {
            		obj.select = true;
            	}

            	console.log(path);

            	if (path.indexOf('indexfront.html') > -1) {
            		location.href = "indexfront.html#/main/usercenter";
            		console.log(path);
            	}
            	//indexfront.html#/main/usercenter
            }

            $scope.exit = function () {

                getDataSource.getUrlData("../api/Logout", {}, function (datatemp) {
                    if (datatemp.code == "success") {
                        location.href = "../html/login.html"
                    }
                }, function (errortemp) { });
            }

        }],
        link: function (scope, element, attr, ctrl) {

        }
    }
}])
.directive("appfooter", ["$http", "$timeout", "$sce", "getDataSource", "FilesService", function ($http, $timeout, $sce, getDataSource, FilesService) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/appFooter.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {

            $http.get("../config/dataSource.json").then(function (data) {
                $scope.data = data.data;
                $scope.data.infomation.no = $sce.trustAsHtml($scope.data.infomation.no);
            });

            $scope.linkClick = function (n) {
                if (n.url) {
                    window.open(n.url);
                }
            }

            getDataSource.getDataSource("getFooterDownload", {}, function (data) {
                $scope.downloadData = data;
            }, function (e) { })

            //下载文件
            $scope.downFiles = function (item) {
                return FilesService.downApiFiles("download", item.attach_servername, item.attach_clientname);
            }

        }],
        link: function (scope, element, attr, ctrl) {
            if ($(window).height() < $('body').height()) {
                $(element).find(".footer").css({ 'position': 'absolute', 'left': '0px', 'bottom': '0px' });
            }
        }
    }
}])
.directive("floatMenu", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/floatMenu.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
            $(element).find("li").hover(function () {
                $(this).find('i').hide();
                $(this).find('span').show();
            }, function () {
                $(this).find('i').show();
                $(this).find('span').hide();
            })
        }
    }
}])
.directive("sendSmscode", ["$http", "$timeout", "$sce", function ($http, $timeout, $sce) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/sendSmscode.html",
        replace: true,
        scope: {},
        controller: ["$scope", "$element", "$attrs", "$http", function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
        }
    }
}])
.directive("lunbo", ["$http", "$timeout", "$sce", "getDataSource", function ($http, $timeout, $sce, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/lunbo.html",
        replace: true,
        scope: {
            imglist: "=imglist"
        },
        controller: ["$scope", "$element", "$attrs", "$http",function ($scope, $element, $attrs, $http) {
        }],
        link: function (scope, element, attr, ctrl) {
            //var promise = getDataSource.queryLunbo(scope.url);
            var step = 0;
            var time = null;
            var length = 1;
            scope.$watch('imglist', function (item) {
                scope.imglist = item;
                //console.log(scope.imglist.length);
                if (scope.imglist.length > 0) {
                    length = scope.imglist.length;
                }
            });
            var stepFun = function () {
                //console.log("element",element.find("li"));
                element.find("li").removeClass("active");
                element.find("li").eq(step + 1).addClass("active");
                scope.pic = step;
                step++;
                //console.log("length", length);
                step = step % length;
                //time = $timeout(function () {
                //	stepFun();
                //}, 5000);
            };
            stepFun();
            /*点击事件*/
            scope.clickEvent = function (number) {
                scope.pic = number;
                element.find("li").removeClass("active");
                element.find("li").eq(number + 1).addClass("active");
                //$timeout.cancel(time);
                step = number;
            };
            /*鼠标移除动画重新开始*/
            scope.start = function () {
                //$timeout.cancel(time);
                stepFun();
            }
        }
    }
}])
.directive("treeDialog", ["$rootScope", "$modal", "$timeout", "getDataSource", function ($rootScope,$modal, $timeout, getDataSource) {
    return {
        restrict: "AE",
        templateUrl: "../Templates/directive/ztree.html",
        scope: {
            ngselect: "=ngSelect",
            ngid: "=ngId",
            ngname: "=ngName",
            ngcheck: "=ngCheck",
            ngcheckArray: "=ngCheckedArray",
            searchflag: "=searchFlag"
        },
        replace: true,
        transclude: true,
        controller: ["$scope", "$element", "$attrs",function ($scope, $element, $attrs) {
            if ($scope.searchflag == undefined || $scope.searchflag) {
                var mid = $rootScope.user.mdepartmentId;
                var mname = $rootScope.user.mdepartmentName;
                if ($rootScope.user.usertype == 2) {
                    mid = $rootScope.user.departmentId;
                    mname = $rootScope.user.departmentName;
                }

                $scope.depname = mname;
                if ($scope.ngid != undefined) $scope.ngid = mid;
                if ($scope.ngname != undefined) $scope.ngname = mname;
            }

            var getSelectDepartment = function (treeNode, checked) {
                var id = treeNode.id;
                if (checked) {
                    if (_.filter($scope.ngcheckArray, function (r) { return r.id == id }).length <= 0) {
                        $scope.ngcheckArray.push({ id: treeNode.id });
                    }
                } else
                    _.remove($scope.ngcheckArray, function (r) { return r.id == id });

                if (treeNode.children && treeNode.children.length > 0) {
                    angular.forEach(treeNode.children, function (item) {
                        getSelectDepartment(item, checked);
                    });
                }
            }
           
            //tree设置
            $scope.treeSetting = {
            	view: {
            		dblClickExpand: false,
            		expandSpeed: "slow"
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
            		onClick: function (e, treeId, treeNode) {
            			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            			var nodes = zTree.getSelectedNodes();
            			if (nodes.length > 0) {
            				$timeout(function () { 
            					$scope.depname = nodes[0].name;
            					if ($scope.ngid != undefined) $scope.ngid = nodes[0].id;
            					if ($scope.ngname != undefined) $scope.ngname = nodes[0].name;
            					if ($scope.ngselect) $scope.ngselect(nodes[0]); 
            					hideMenu();
            				}, 10);
                           
            			}
            		},
            		onCheck: function (e, treeId, treeNode) {
            			//if (treeNode.isParent) {
            			//	return;
            			//}
            			//if (treeNode.checked) {
            			//	if ($scope.ngcheckArray) {
            			//		$scope.ngcheckArray.push({ id: treeNode.id });
            			//	}
            			//} else {
            			//	_.remove($scope.ngcheckArray, function (o) { return o.id == treeNode.id });
            		    //}

            		    $timeout(function () {
            		        getSelectDepartment(treeNode, treeNode.checked);
            		    }, 1000);
            		}
                }
            };
			
            if ($scope.ngcheck) {
            	
            	var checktemp = {
            		enable: true,
            		chkboxType: { "Y": "s", "N": "s" }
            	};            	$scope.treeSetting.check = checktemp;
            }

            function hideMenu() {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                    hideMenu();
                }
            }

            //显示部门树
            $scope.open = function () {
                var cityObj = $("#txtdepartment");
                var cityOffset = $("#txtdepartment").offset();
                //$("#menuContent").css({ left: cityOffset.left - 75 + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");
                $("#menuContent").slideDown("fast");
                $("body").bind("mousedown", onBodyDown);

                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = zTree.getNodes();
                //if (nodes[0] && nodes[0].children && nodes[0].children.length > 0) {
                //    zTree.expandNode(nodes[0].children[0], true, true, true);
                //}
            }


            //获取部门数据回调
            window.apiCallback.getAllDepartment = function (data) {
                $scope.treeData = data;
                $.fn.zTree.init($("#treeDemo"), $scope.treeSetting, $scope.treeData);
            }


            //获取部门数据
            $scope.getDepartmentArr = function () { 
                //var p = {
                //    url: "getAllDepartment",
                //    parameter: {}
                //};   
                //if ($rootScope.user.usertype == "1") {
                //    p.url = "getDepartment";
                //    p.parameter = { pid: $rootScope.user.departmentId }; 
                //}
                //var p = {
                //    url: "getDepartment",
                //    parameter: { pid: $rootScope.user.departmentId }
                //};
                getDataSource.getDepartment(function (data) {
                    window.apiCallback.getAllDepartment(data);
                }, function (error) { }); 
            }();


        }]
    
    };
}])


app.animation('.fade-in', [function () {
	return {
		enter: function (element, done) {
			var step = 0;
			var time = null;//计时器
			var animationFunc = function () {
				step += 20;
				if (step > 100) {
					done();
					clearInterval(time);
				} else {
					element.css("opacity", step / 100);
				}
			};
			element.css("opacity", 0);
			time = setInterval(animationFunc, 50);
		},
		leave: function (element, done) {
			var step = 100;
			var time = null;
			var animationFun = function () {
				step -= 20;
				if (step < 0) {
					done();
					clearInterval(time);
				} else {
					element.css("opacity", step / 100)
				}
			};
			element.css("opacity", 1);
			time = setInterval(animationFun, 40);
		}
	}
}])
.directive("loading", [function () {
    return {
        restrict: "AE",//<button class="btn btn-warning btn-circle" ng-click="close()" type="button"><i class="fa fa-times tubiaoicon-17"></i></button>
        template: '<div class="dialogMask" ng-show="isOpened"><div class="modal-content" ng-style="dialogStyle" style="height:150px"><div class="modal-header red text-center" >温馨提示</div><div class="modal-body"><h3>{{options.message}}</h3></div></div></div>',
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

        }
    };
}])
;

angular.module('ui.bootstrap.rating', [])

.constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null
})

.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function($scope, $attrs, ratingConfig) {
  var ngModelCtrl  = { $setViewValue: angular.noop };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

    var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
                        new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
    $scope.range = this.buildTemplateObjects(ratingStates);
  };

  this.buildTemplateObjects = function(states) {
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
    }
    return states;
  };

  $scope.rate = function(value) {
    if ( !$scope.readonly && value >= 0 && value <= $scope.range.length ) {
      ngModelCtrl.$setViewValue(value);
      ngModelCtrl.$render();
    }
  };

  $scope.enter = function(value) {
    if ( !$scope.readonly ) {
      $scope.value = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.onLeave();
  };

  $scope.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.rate( $scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1) );
    }
  };

  this.render = function() {
    $scope.value = ngModelCtrl.$viewValue;
  };
}])

.directive('rating', [function() {
  return {
    restrict: 'EA',
    require: ['rating', 'ngModel'],
    scope: {
      readonly: '=?',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: '../templates/directive/rating.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        ratingCtrl.init( ngModelCtrl );
      }
    }
  };
}]);