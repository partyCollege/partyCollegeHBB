angular.module('app.directive', ['ionic'])
    .directive('goMainPage', function ($state) {
        return {
            restrict: "E",
            priority: 500,
            template: "<ion-nav-buttons side='left'>\
                <button ng-show='{{showBack}}' class='button button-icon icon ion-ios7-arrow-left' style='font-size:16px' ng-click='goBack()'>返回</button>\
        </ion-nav-buttons>",
            replace: true,
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, $ionicHistory, $location) {
                // 屏蔽掉tab页中的返回按钮
                $scope.showBack = true;
                //for (var i = 0; i < $rootScope.AppConfig.mainTab.length; i++) {
                //    if ($location.absUrl().indexOf($rootScope.AppConfig.mainTab[i].link) > -1) {
                //        $scope.showBack = false;
                //    }
                //}

                $scope.goMain = function () {
                    if ($rootScope.AppConfig.hasMain == true) {
                        $state.go("app.index");
                    }
                    else {
                        $ionicSideMenuDelegate.toggleLeft();
                    }
                };
                $scope.goBack = function () {
                    $("#mainVideo").html("");
                    var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
                    if (gopage) {
                        $state.go("app.index");
                    } else {
                        $ionicHistory.goBack();
                    }
                }
            }
        }
    })
    .directive('goBack', function ($state) {
        return {
            restrict: "E",
            priority: 500,
            scope: {
                title: '@myTitle',
            },
            template: "<ion-header-bar align-title='center' class='bar-assertive'>\
            <a class='button button-icon icon ion-ios-arrow-back' ng-click='goBack()'>返回</a>\
            <h3 class='title'>{{title}} </h3>    </ion-header-bar>",
            replace: true,
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, $ionicHistory) {
                $scope.goMain = function () {
                    if ($rootScope.AppConfig.hasMain == true) {
                        $state.go("app.index");
                    }
                    else {
                        $ionicSideMenuDelegate.toggleLeft();
                    }
                };
                $scope.goBack = function () {
                    var gopage = getUrlParam("gopage");//获取需要跳转的页面的标识
                    if (gopage) {
                        $state.go("app.index");
                    } else {
                        $ionicHistory.goBack();
                    }
                }
            }
        }
    })
      .directive('takePicture', function ($state) {
          return {
              restrict: "AE",
              priority: 500,
              scope: {
                  doPicture: "&"
              },
              template: "<ion-nav-buttons side='right'>\
                <button class='button button-info' style='font-size:12px' ng-click='doPicture()'>拍照</button>\
        </ion-nav-buttons>",
              replace: true,
              controller: function ($scope, $ionicHistory, cordovaService) {


              }
          }
      })
    // 通知公告
    .directive('tzgg', function ($state) {
        return {
            restrict: "EA",
            templateUrl: getTemplatePath("tzgg.html"),
            scope: {
                assignobj: "="
            },
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, getDataSource) {
                $scope.load = function () {

                    $scope.ggList = new Array();
                    getDataSource.getDataSource(["getMainGG", "getNoticeNoRead"], { xyid: $rootScope.user.stu_info_id, bcid: $rootScope.user.bcinfo_id }, function (data) {
                        $scope.ggList = _.find(data, function (d) {
                            return d.name == "getMainGG";
                        }).data;
                        $scope.NoticeCount = _.find(data, function (d) {
                            return d.name == "getNoticeNoRead";
                        }).data;
                    });
                    var config = _.find($rootScope.AppConfig.mainModule, function (item) {
                        return item.type == "tzgg";
                    });
                    if (config) {
                        $scope.goList = config.link;
                        $scope.goDetial = function (gg) {

                            var obj = config.subLinkParams;
                            obj.id = gg.id;
                            $state.go(config.subLink, obj);
                        }
                    }
                };
                $scope.load();
                $scope.$on("indexReflash", function () {
                    $scope.load();
                });
                
            }
        }
    })
    // 今日课程
    .directive('jrkc', function ($state) {
        return {
            restrict: "EA",
            templateUrl: getTemplatePath("jrkc.html"),
            scope: {
                assignobj: "="
            },
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, getDataSource) {
                $scope.KCList = new Array();
                $scope.load = function () {
                    getDataSource.getDataSource("getTodayKc", { bcid: $rootScope.user.bcinfo_id }, function (data) {
                        $scope.KCList = data;
                    });
                }
                $scope.load();
                $scope.$on("indexReflash", function () {
                    $scope.load();
                });

            }
        }
    })
// 老师通知公告
    .directive('teachertzgg', function ($state) {
        return {
            restrict: "EA",
            templateUrl: getTemplatePath("tzggTeacher.html"),
            scope: {
                assignobj: "="
            },
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, getDataSource) {
                $scope.ggList = new Array();
                var config = _.find($rootScope.AppConfig.mainModule, function (item) {
                    return item.type == "teachertzgg";
                });
                $scope.load = function () {
                    getDataSource.getDataSource("getTeacherGG", { userid: $rootScope.user.userid, userid1: $rootScope.user.userid }, function (data) {
                        $scope.ggList = data;
                    });
                }
                if (config) {
                    $scope.goList = config.link;
                    $scope.goDetial = function (gg) {
                        console.log(gg);
                        var obj = config.subLinkParams;
                        obj.id = gg.infoid;
                        $state.go(config.subLink, obj);
                    }
                    $scope.load();
                    $scope.$on("indexReflash", function () {
                        $scope.load();
                    });
                }
            }
        }
    })
// 老师信息传送
    .directive('teacherxxts', function ($state) {
        return {
            restrict: "EA",
            templateUrl: getTemplatePath("xxts.html"),
            scope: {
                assignobj: "="
            },
            controller: function ($rootScope, $scope, $state, $ionicSideMenuDelegate, getDataSource) {
                $scope.XXList = new Array();
                $scope.load = function () {
                    getDataSource.getDataSource("getXxts", { userid: $rootScope.user.userid }, function (data) {
                        $scope.XXList = data;
                    });
                }
                $scope.load();
                $scope.$on("indexReflash", function () {
                    $scope.load();
                });

                var config = _.find($rootScope.AppConfig.mainModule, function (item) {
                    return item.type == "teacherxxts";
                });
                if (config) {
                    $scope.goList = config.link;
                    $scope.goDetial = function (gg) {

                        var obj = config.subLinkParams;
                        obj.id = gg.id;
                        $state.go(config.subLink, obj);
                    }
                }
            }
        }
    })
	.directive("sytextarea", function () {
	    return {
	        restrict: 'EA',
	        templateUrl: getTemplatePath("sytextarea.html"),
	        scope: {
	            assignobj: "="
	        }
	    }
	})
	.directive("sytext", function () {
	    return {
	        restrict: 'EA',
	        templateUrl: getTemplatePath("sytext.html"),
	        scope: {
	            assignobj: "="
	        },
	        link: function ($scope, $element, $attrs) {
	            $scope.minusData = function () {
	                var tempval = parseInt("0" + $scope.assignobj.selectValue);
	                if (tempval <= parseInt("0" + $scope.assignobj.rangeMin)) {
	                    tempval = parseInt("0" + $scope.assignobj.rangeMin);
	                } else {
	                    tempval = tempval - 1;
	                }
	                $scope.assignobj.selectValue = tempval;
	            }
	            $scope.addData = function () {
	                var tempval = parseInt("0" + $scope.assignobj.selectValue);
	                //默认初始值
	                if ($scope.assignobj.rangeMin > 0 && tempval == 0) {
	                    tempval = $scope.assignobj.rangeMin;
	                }
	                if (tempval >= parseInt("0" + $scope.assignobj.rangeMax)) {
	                    tempval = parseInt("0" + $scope.assignobj.rangeMax);
	                } else {
	                    tempval = tempval + 1;
	                }
	                $scope.assignobj.selectValue = tempval;
	            }
	        }
	    }
	})
	.directive("sycheckbox", function () {
	    return {
	        restrict: 'EA',
	        templateUrl: getTemplatePath("sycheckbox.html"),
	        scope: {
	            assignobj: "="
	        }
	    }
	})
	.directive("syselect", function () {
	    return {
	        restrict: 'EA',
	        templateUrl: getTemplatePath("syselect.html"),
	        scope: {
	            assignobj: "="
	        }
	    }
	})
	.directive("syselectsourse", function () {
		return {
			restrict: 'EA',
			templateUrl: getTemplatePath("syselectsourse.html"),
			scope: {
				assignobj: "="
			}
		}
	})
    .directive('dateFormat', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        return new Date(modelValue);
                    }
                });

                ngModelCtrl.$parsers.push(function (value) {
                    if (value) {
                        return $filter('date')(value, 'yyyy-MM-dd');
                    }
                });
            }
        };
    }])
	.directive("syradio", function () {
	    return {
	        restrict: 'EA',
	        templateUrl: getTemplatePath('syradio.html'),
	        scope: {
	            assignobj: "="
	        },
	        link: function ($scope, $element, $attrs) {
	            //给当前的每个选项注册控件并且赋值
	            $scope.optionChecked = function (elementid, text, val, tip) {
	                $("#" + elementid + "").find("input[class*='hide-ngmode-val']").val(val).change();

	                $("#" + elementid + "").find("input[class*='hide-ngmode-text']").val(text).change();

	                if ($("#" + elementid + "").find("button").hasClass("btn_active")) {
	                    $("#" + elementid + "").find("button").removeClass("btn_active");
	                }
	                //else {
	                $("#" + elementid + "").find("button[value='" + val + "']").addClass("btn_active");
	                //}
	                //console.log("aaaa:" + $("#" + elementid + "").find("button[value='" + val + "']").val());
	            }
	            $scope.tipshow = function (text) {
	                //showToast.show(text);
	            }
	        }
	    };
	})
.directive('errSrc', function() {
    	//图片加载出错时，显示默认图片<img ng-src="{{baseURL +'/'+ item.comment.userIcon}}" alt="" class="avatar-64" err-src="{{baseURL + '/' + defaultUserIcon }}">
		  return {
				link: function(scope, element, attrs) {
				  element.bind('error', function() {
					if (attrs.src != attrs.errSrc) {
					  attrs.$set('src', attrs.errSrc);
					}
				  });
				}
		}
});
;


angular.module('ui.bootstrap.rating', [])
.constant('ratingConfig', {
	max: 5,
	stateOn: null,
	stateOff: null
})
.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function ($scope, $attrs, ratingConfig) {
	var ngModelCtrl = { $setViewValue: angular.noop };

	this.init = function (ngModelCtrl_) {
		ngModelCtrl = ngModelCtrl_;
		ngModelCtrl.$render = this.render;

		this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
		this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

		var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
							new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
		$scope.range = this.buildTemplateObjects(ratingStates);
	};

	this.buildTemplateObjects = function (states) {
		for (var i = 0, n = states.length; i < n; i++) {
			states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
		}
		return states;
	};

	$scope.rate = function (value) {
		if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
			ngModelCtrl.$setViewValue(value);
			ngModelCtrl.$render();
		}
	};

	$scope.enter = function (value) {
		if (!$scope.readonly) {
			$scope.value = value;
		}
		$scope.onHover({ value: value });
	};

	$scope.reset = function () {
		$scope.value = ngModelCtrl.$viewValue;
		$scope.onLeave();
	};

	$scope.onKeydown = function (evt) {
		if (/(37|38|39|40)/.test(evt.which)) {
			evt.preventDefault();
			evt.stopPropagation();
			$scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
		}
	};

	this.render = function () {
		$scope.value = ngModelCtrl.$viewValue;
	};
}])

.directive('rating', [function () {
	return {
		restrict: 'EA',
		require: ['rating', 'ngModel'],
		scope: {
			readonly: '=?',
			onHover: '&',
			onLeave: '&'
		},
		controller: 'RatingController',
		templateUrl: getTemplatePath('rating.html'),
		replace: true,
		link: function (scope, element, attrs, ctrls) {
			var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

			if (ngModelCtrl) {
				ratingCtrl.init(ngModelCtrl);
			}
		}
	};
}]);
