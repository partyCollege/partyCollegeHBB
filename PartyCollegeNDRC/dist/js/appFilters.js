angular.module("app.filters", [])
.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
})
.filter("idCardToYearFilter", function () {
    return function (input) {
    	if (!input && input != null && input.length == 0) {
            return '';
        } else {
            var nowyear = new Date().getFullYear();
            return nowyear - parseInt(input.substring(6, 10));
        }
    };
}).filter("idCardToBirthdayFilter", function () {
    return function (input) {
        if (input) {
            input = input.substr(6, 8);
            return input.substr(0, 4) + "-" + input.substr(4, 2) + "-" + input.substr(6);
        } else {
            return '';
        }
    };
})
.filter("sexFilter", function () {
    var genderHash = {
        0: '女',
        1: '男'
    };
    return function (input) {
    	if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
.filter("newsCategoryFilter", function () {
	var genderHash = {
		1: '图片新闻',
		2: '通知公告',
		3: '最新动态',
		4: '政策法规'
	};
	return function (input) {
		if (!input && input != null && input.length == 0) {
			return '';
		} else {
			return genderHash[input];
		}
	};
})
.filter('mapGender', function () {
    var genderHash = {
        0: '不可用',
        1: '正常'
    };

    return function (input) {
    	if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
.filter('lockStatus', function () {
	  
    return function (input) {
        var p=parseInt(input);
	    switch (p) {
	        case 0: return "正常";
	        case 1: return "锁定";
	        default: return "";
	    }
	};
})
.filter('activeStatus', function () {
    
    return function (input) {
        var p = parseInt(input);
        switch (p) {
            case -1: return "未激活";
            case 1: return "已激活"; 
            default: return "";
        }
    };
})
.filter('statusGender', function () {
    var genderHash = {
        "-1": '不可用',
        "0": '正常'
    };

    return function (input) {
        if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})

    .filter('istopGender', function () {
        var genderHash = {
            "1": '已推荐',
            "0": '未推荐'
        };

        return function (input) {
            if (!input && input != null && input.length == 0) {
                return '';
            } else {
                return genderHash[input];
            }
        };
    })

.filter("examCategoryFilter", function () {
    var genderHash = {
        0: '单选',
        1: '多选'
    };

    return function (input) {
        if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
.filter('educationFilter', function () {
    var genderHash = {
        0: '本科',
        1: '硕士',
        2: "博士",
        3: "博士后"
    };

    return function (input) {
    	if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
.filter('platformCategory', function () {
    var genderHash = {
        0: '分平台',
        1: '总平台'
    };

    return function (input) {
        if (!input && input != null && input.length == 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
.filter("dateFilter", ["DateService", function (DateService) {     
    return function (date, format) {
        if (date) {
           
            //if (typeof (date) == "string") {
            //    datetime = Date.parse(date.replace(/-/g, "/"));
            //    if (isNaN(datetime)) {
            //        datetime = Date.parse(date);
            //    }
            //} else if (typeof (date == "object")) {
            //    datetime = new Date(Date.parse(date));
            //}
            var datetime = DateService.parserDate(date);
            return DateService.format(datetime, format);
        } else {
            return "";
        }
    };
}])
.filter("defaultUserTypeFilter", function () {
	var genderHash = {
		0: '学习中心',
		1: '班级中心',
		2: '管理中心',
		3: '校友中心'
	};

	return function (input) {
		if (!input && input != null && input.length == 0) {
			return '';
		} else {
			return genderHash[input];
		}
	};
})

.filter("sysLevelFilter", function () {
	var genderHash = {
		0: '普通',
		1: '系统',
	};

	return function (input) {
		if (!input && input != null && input.length == 0) {
			return '';
		} else {
			return genderHash[input];
		}
	};
})
.filter("publishStatusFilter", function () {
	var genderHash = {
		0: '未发布',
		1: '已发布',
	};

	return function (input) {
		if (!input && input != null && input.length == 0) {
			return '';
		} else {
			return genderHash[input];
		}
	};
})
.filter("isShareFilter", function () {
	var genderHash = {
		0: '否',
		1: '是',
	};

	return function (input) {
		if (!input && input != null && input.length == 0) {
			return '';
		} else {
			return genderHash[input];
		}
	};
})
.filter("weekFilter", ["DateService", function (DateService) {
    return function (date) {
        var dt;
        if (date) {
            dt = DateService.parserDate(date);
        } else {
            dt=new Date();
        }
        var week = dt.getDay();
        var weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return weekArr[week];

    };
}])
.filter("questCategoryFilter", function () {
    var arrHash = {
        0: '课程问卷',
        1: '其他问卷'
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input];
        }
    };
})
.filter("quest_detailCategoryFilter", function () {
    var arrHash = {
        0: '单选',
        1: '多选',
        2:'主观'
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input];
        }
    };
})
.filter("coursewareStatusFilter", function () {
    var arrHash = {
    	"-2": "废弃",
    	"-10": "未通过",
        0: '正常',
        "1": '待分配',
        "2": "待审核",
        "3": "待授权",
        "4": "待编辑",
        "5": "待完善",
        "6": "待分类",
        "7":"已入库"
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input.toString()];
        }
    };
})
.filter("classCategoryFilter", function () {
    var arrHash = {
        0: '单专班',
        1: '多专班',
        2: '自主选学'
    };  
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input];
        }
    };
})
.filter("answerCategoryFilter", function () {
    var arrHash = {
        0: '单选',
        1: '多选',
        2: '主观',
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input];
        }
    };
})
.filter("recommendFilter", function () {
    var arrHash = {
        0: '',
        1: '班级',
        2: '平台',
        3: '班级、平台'
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else {
            return arrHash[input];
        }
    };
}).filter("workFilter", function () {
    var arrHash = {
        0: '班主任',
        1: '班级助理',
        2: '班级指导老师'
    };
    return function (input) {
        if (input == undefined || input == "undefined" || input == null || input.length == 0) {
            return '';
        } else { 
            var arrInput = input.toString().split(',');
            var arrResult = [];
            //for (var i in arrInput) {
            for (var i = 0; i < arrInput.length;i++) {
                arrResult.push(arrHash[arrInput[i]]);
            } 
            return arrResult.join(",");             
        }
    };
})
.filter('limittypeFilters', function () {
	//var genderHash = {
	//    0: '日期',
	//    1: '事件ID'
	//    /*-1: '无限制',*/
	//};

	return function (input) {
		if (input == null)
			return "";
		if (input == 0) return '日期';
		if (input == 1) return '事件ID';
		if (input == -1) return '无限制';
	};
})
.filter('trainStatuFilters', function () {
    //状态,0 未提交 1 已提交 2 审核通过 -1 驳回
    return function (input) { 
        if (input == 0) return '未提交';
        else if (input == 1) return '已提交';
        else if (input == 2) return '通过';
        else if (input == -1) return '未通过';
        else "未知状态";
    };
});
;