angular.module('app.commonServices', [])
    .service("getDataSource", function ($http) {
        return {
            getDataSource: function (type, data, success, error) {
                var array = [];
                if (typeof (type) == "string") {
                    array.push(type);
                }
                else {
                    array = type;
                }
                var pData = { key: array, postData: data };

                var url = "../api/CommonSQL";
                if(localStorage.testData){
                    url = "http://192.168.1.106/CollegeAPPHBB/api/CommonSQL";
                }
                $http.post(url, JSON.stringify(pData))
                .success(function (data) {
                    if (data.error) {
                        error(data.error);
                    }
                    else {
                        success(data);
                    }
                })
                .error(function (data) {
                    error(data);
                });
            },
            getGUID: function () {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            },
            validateCode: function (clientcode, servercode, success, failed) {
            	this.getUrlData("../api/VerifySMSCode", { smscode: clientcode, keyname: servercode }, function (datatemp) {
            		if (datatemp.code == "success") {
            			success();
            		} else {
            			failed();
            		}
            	}, function (errortemp) { });

            },
            getUrlData: function (url, data, success, error) {
            	$http.post(url, JSON.stringify(data))
				.success(function (data) {
					if (data.error) {
						error(data.error);
					}
					else {
						success(data);
					}
				})
				.error(function (data) {
					error(data);
				});
            }
        }
    })
.service("SessionService", ["$http", "$rootScope", "getDataSource", "$state"
	, function ($http, $rootScope, getDataSource, $state) {
	return {
		CheckSession: function (platformcode, success) {
			if ($rootScope.user && $rootScope.user.isLogin) {

			} else {
				return $http.post("../api/session", { platformcode: platformcode }).success(function (data) { 
					if (data.code == "success") {
						$rootScope.user = data.loginUser;
						$rootScope.user.isLogin = true;
						success($rootScope.user);
					} else {
					    if ($rootScope.testMode) {
                            $state.go("HbbMain.maincourse");
					    }else{
						    $rootScope.user = data.loginUser;
						    $rootScope.user.isLogin = false;
						    location.href = "../html/index_wx.html"
						    ///$state.go("HbbLogin");
                        }
					}
				}).error(function (errortemp) {

				});
	            	
			}
		},
		GetConfig: function () {
			return $http.get("../config/appConfig.json").then(function (data) {
				$rootScope.appConfig = data.data;
			});
		}
	}
	}])
.service("FilesService", ["$http", "$rootScope", "Upload", function ($http, $rootScope, Upload) {
	return {
		upLoadFiles: function (files, category, success) {
			var upload = Upload.upload({
				url: '../api/uploadfile',
				file: files,
				data: { upcategory: category }
			});
			upload.then(success);
		},
		upLoadPicture: function (files, uploadOption, success, error) {
			var upload = Upload.upload({
				url: '../api/uploadfile',
				file: files,
				data: uploadOption
			});
			upload.then(success, error);
		},
		getDefaultImage: function (category, servername, filename) {
			if (filename == null || filename == '') {
				var imagefile = '';
				switch (category) {
					case 'userPhoto':
					case 'teacherPhoto':
						imagefile = "../img/default_img.png";
						break;
					case 'coursewarePhoto':
					case 'livePhoto':
						imagefile = "../img/course_img.jpg";
						break;
				}
				return imagefile;
			}
			var root = $rootScope.appConfig.fileServer.rootPath;
			var filePath = root + $rootScope.appConfig.fileServer[category] + "/" + servername;

			if (servername.indexOf('/') > 0) {
				filePath = root + servername;
			}

			//若存储的图片为远程图片，则直接显示地址。
			if (servername.indexOf("http://") > -1 || servername.indexOf("https://") > -1) {
				filePath = servername;
			}
			return filePath;

		},
		showFile: function (category, servername, filename) {
			return this.getDefaultImage(category, servername, filename);
			//return "../api/uploadfile/" + category + "/" + Base64.encode(servername).replace(/\+/g, "_") + "/" + Base64.encode(filename).replace(/\+/g, "_");
		},
		downFiles: function (category, servername, filename) {
			var root = $rootScope.appConfig.fileServer.rootPath;
			var filePath = root + $rootScope.appConfig.fileServer[category] + "/" + servername;
			//return filePath;
			//var filepath = "../api/uploadfile/" + category + "/" + Base64.encode(servername).replace(/\+/g, "_") + "/" + Base64.encode(filename).replace(/\+/g, "_");
			////window.location.href = filepath;
			window.open(filePath);
		},
		getUserPhoto: function () {
			if ($rootScope.user != undefined) {
				if ($rootScope.user.photopath) {
					return this.showFile("userPhoto", $rootScope.user.photopath, $rootScope.user.photopath);
				} else {
					return "../img/default_img.png";
				}
			}
		},
		getUserThumbPhoto: function () {
			if ($rootScope.user != undefined) {
				if ($rootScope.user.photopath) {
					return this.showFile("userPhoto", $rootScope.user.photothumbpath, $rootScope.user.photothumbpath);
				} else {
					return "../img/default_img.png";
				}
			}
		}
	}
}])
.service("getBadge", function ($http, getDataSource) {
    return {
        getNum: function (menuItem) {
            getDataSource.getDataSource(menuItem.badgeUrl, { userid: sessionStorage.userid, xyid: sessionStorage.stu_info_id, bcid: sessionStorage.bcinfo_id }, function (data) {
                if (data.length > 0) {
                    if (data[0]['num'] != "0") {
                        menuItem.badgeNum = data[0]['num'];
                    }
                }
            });
        },
        getQdNum: function (menuItem) {
            getDataSource.getDataSource("getKqNum", { classid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['topnum'] != "0") {
                    menuItem.badgeNum = data[0]['topnum'];
                }
            });
        },
        getxxkNum: function (menuItem) {
            getDataSource.getDataSource("getxxkBadge", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getGBCPFBNum: function (menuItem) {
            getDataSource.getDataSource("GBCPFB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getHBBPBBNum: function (menuItem) {
            getDataSource.getDataSource("HBBPBB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getXXYDPFBNum: function (menuItem) {
            getDataSource.getDataSource("XXYDPFB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getDSCPBBNum: function (menuItem) {
            getDataSource.getDataSource("DSCPBB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getJSWSJCBLDWYYNum: function (menuItem) {
            getDataSource.getDataSource("JSWSJCBLDWYY_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getJSWSJCBXSHRYYNum: function (menuItem) {
            getDataSource.getDataSource("JSWSJCBXSHRYY_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getQSDSCJCBNum: function (menuItem) {
            getDataSource.getDataSource("QSDSCJCB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getQSRCWSJCBNum: function (menuItem) {
            getDataSource.getDataSource("QSRCWSJCB_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getWGWJNum: function (menuItem) {
            getDataSource.getDataSource("WGWJ_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getXJDXNum: function (menuItem) {
            getDataSource.getDataSource("XJDX_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getSBSSNum: function (menuItem) {
            getDataSource.getDataSource("SBSS_NUM", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getPjNum: function (menuItem) {
            getDataSource.getDataSource("getPjBadge", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        },
        getKCPjNum: function (menuItem) {
            getDataSource.getDataSource("getKCPjBadge", { bcid: sessionStorage.bcinfo_id, xyid: sessionStorage.stu_info_id }, function (data) {
                if (data[0]['num'] != "0") {
                    menuItem.badgeNum = data[0]['num'];
                }
            });
        }
    }
})
.service("uploadService", function ($http) {
    return {
        upload: function () {

        }
    }
})
.service("userHelp", function ($http, $rootScope, $state, $timeout, showAlert) {
    var returnVal = new Object();
    //安全等处
    returnVal.safeLogout = function () {
        console.log("start", new Date());
        localStorage.clear();
        $rootScope.user = null;
        console.log("end", new Date());
        //ionic.Platform.exitApp();
        showAlert.showLoading(10000, "正在关闭");
        $timeout(function () {
            xsf.kill();
        }, 3000);

        //$state.go("loginMobile");
    }
    returnVal.setSession = function (success, error) {
        if ($rootScope.user == null) {
            return;
        }
        $http.post("../api/SetSession", $rootScope.user)
        .success(function () {
            success();
        })
        .error(function () {
            error();
        });
    }
    //获取选择的人员列表
    returnVal.getSelectUsers = function () {
        var deep = _.cloneDeep($rootScope.selectUser);
        $rootScope.selectUser = null;
        return deep;
    }
    //聊天初始化
    returnVal.initUserChat = function (success) {
        try {
            var options = {
                "userId": $rootScope.user.info_id,
                "userName": $rootScope.user.username
            }
            xsfChat.initChat(options, success, function (data) { console.log(data) });
        }
        catch (e) {
            console.log(e);
        }
    }
    //单聊
    returnVal.sigalChat = function (userid, username) {
        options = {
            "chatId": userid,
            "chatName": username,
            "chatType": 0
        }
        try {
            xsfChat.openChat(options, function () {
            }, function () {

            });
        }
        catch (e) { }
    }
    //班级群聊
    returnVal.groupChat = function () {
        options = {
            "chatId": $rootScope.user.classid,
            "chatName": $rootScope.user.classname,
            "chatType": 1
        }
        try {
            xsfChat.openChat(options, function () {
                console.log("群聊");
            }, function () {

            });
        }
        catch (e) { }
    }
    //跟新首页几个聊天块的显示数字
    returnVal.changeHTML = function (controllerID, val) {
        if (parseInt(val) == 0) {
            $("#" + controllerID).css("display", "none");
        }
        else {
            $("#" + controllerID).css("display", "inline");
            $("#" + controllerID).html(val);
        }
    }
    //获取聊天数量
    returnVal.getChatNumber = function () {
        //我的需求数量
        if (localStorage.user && localStorage.user !== "undefined") {
            //班级交流
            xsfChat.getNewMessageCount({ type: 0 }, function (number) {
                _.find($rootScope.iconvalArray, function (d) {
                    return d.key == "myclasscount";
                }).val = number.message;
                returnVal.changeHTML("myclasscount", number.message);
            })
            xsfChat.getNewMessageCount({ type: 1 }, function (number) {
                //_.find($rootScope.iconvalArray, function (d) {
                //    return d.key == "studentcount";
                //}).val = number.message;
                //returnVal.changeHTML("studentcount", number.message);

                _.find($rootScope.iconvalArray, function (d) {
                    return d.key == "teachercount";
                }).val = number.message;
                returnVal.changeHTML("teachercount", number.message);
            })
        }
    }
    //我的需求
    returnVal.gomyNeeds = function () {
        if ($rootScope.isFirstLogin) {
            $state.go("myNeedsContent");
            $rootScope.isFirstLogin = false;
        }
    }
    returnVal.myNeeds = function () {
        options = {
            "chatId": $rootScope.user.classid + "_" + $rootScope.user.info_id,
            "chatName": $rootScope.user.username + "的需求",
            "chatType": 1
        }
        try {
            xsfChat.openChat(options, function () {
                console.log("群聊");
            }, function () {

            });
        }
        catch (e) { }
    }
    //获取未读数量，1为我的需求，0为普通会话
    returnVal.getNewMessageCount = function (type) {
        var returnval = 0;
        try {
            returnval = xsfChat.getNewMessageCount({ type: type }, function () {

            }, function () { });
        }
        catch (e) { }
        return returnval;
    }

    //打开会话列表0普通会话，1代表我的需求
    returnVal.openChatList = function (type, title) {
        try {
            xsfChat.openChatList({ type: type, title: title }, function () {
                console.log("打开会话列表");
            }, function () { });
        }
        catch (e) {

        }
    }

    returnVal.syncChat = function (success) {
        try {
            var url = $rootScope.AppConfig.syncChat + $rootScope.user.classid + "/" + $rootScope.user.type + "/" + $rootScope.user.info_id + "/" + $rootScope.user.username + "/" + $rootScope.user.isFirstLogin;
            var options = {
                url: url,
                "userId": $rootScope.user.info_id,
                "userName": $rootScope.user.username
            }
            xsfChat.syncChat(options, success, function () { });
        }
        catch (e) {
            console.log(e);
        }
    }
    returnVal.chatInitOne = function () {
        var options = {
            "url": $rootScope.AppConfig.syncChatSingle + $rootScope.user.classid + "/" + $rootScope.user.type + "/" + $rootScope.user.info_id + "/" + $rootScope.user.username
        }
        xsfChat.syncSingleChat(options, function () {
        }, function () {
        })
    }
    returnVal.chatAllinit = function () {
        returnVal.syncChat(function () {
            console.log("数据同步成功");
            returnVal.initUserChat(function () {
                console.log("聊天初始化成功");
            }, function () {
                console.log("初始化失败");
            });
        }, function () {
            console.log("同步失败");
        });
        console.log("chatAllinit");
        //returnVal.initUserChat(function () {
        //    alert("123");
        //});
    }
    //打开选人界面
    //type:single代表单选，multiple 代表多选
    //selected请传入数组，已选择的人员info_Id列表
    returnVal.openSelectUsers = function (type, selected) {
        $state.go("selectUser", { type: type, selected: selected });
    }
    return returnVal;
})
.service("showAlert", function ($ionicPopup, $ionicLoading, $rootScope) {
    return {
        alert: function (content) {
            $ionicPopup.alert({
                title: '', // String. The title of the popup.
                cssClass: '', // String, The custom CSS class name
                subTitle: '', // String (optional). The sub-title of the popup.
                template: content, // String (optional). The html template to place in the popup body.
                templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
                okText: '确定', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
            });
        },
        //原生小提示，停留3秒,传入提示文字
        showToast: function (content) {
            if ($rootScope.formweixin) {
                $ionicLoading.show({
                    template: content,
                    noBackdrop: true,
                    duration: 2000
                });
            }
            else {
                window.plugins.toast.show(content, 'short', 'center');
            }
        },
        //显示Loading页
        //因为避免超时等特殊情况默认值为10秒，10秒后不管有没有调用HideLoading都将关闭
        showLoading: function (duration, showTtile) {
            var nowduration = 10000;
            var title = "";
            if (duration) {
                nowduration = duration;
            }
            if (showTtile) {
                title = showTtile;
            }
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-energized"></ion-spinner><br/><span>' + title + '</span>',
                duration: nowduration
            });
        },
        //关闭Loading
        hideLoading: function () {
            $ionicLoading.hide();
        }
    }
})
.service("goDetail", function ($state, $rootScope) {
    return {
        goNewsDetail: function (item) {
            if (item) {
                if (item.category == 1 || item.category == 2) {
                    //xsf.playVideo($rootScope.AppConfig.videoPlayPath + item.videopath);
                    $state.go("videoPlay", { id: item.info_id });
                }
                    //else if (item.category == 2) {
                    //    $state.go("ydjxDetail", { id: item.info_id });
                    //}
                else if (item.category == 0) {
                    $state.go("zpNewsDetail", { id: item.info_id });
                }
                else if (item.category == 3) {
                    //xsfWindow.open1(item.webpath);
                    $state.go("other", { url: encodeURI(item.webpath) });
                    //window.open(item.webpath);
                }
            }
            else {
                $state.go("zpNewsDetail", { id: "123" });
            }
        }
    }
})
.factory("$sms", function ($rootScope, $http) {
    return {
        "isSimulation": false,
        "send": function (args, successCallback, errorCallback) {
            var phone = args.phone;
            var msg = args.msg;
            $http.post("../api/SMS", args)
            .success(function () {
                successCallback();
            })
            .error(function () {
            });
        }
    }
})
.service("calcStar", function () {
    var returnVal = new Object();
    returnVal.getStar = function (userInfo) {
        if (userInfo.score >= 480) {
            for (var i = 0; i < 5; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
        }
        else if (userInfo.score >= 360) {
            for (var i = 0; i < 4; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
            userInfo.starArr.push({ starClass: "ion-android-star-half golden" });
        }
        else if (userInfo.score >= 240) {
            for (var i = 0; i < 4; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
        }
        else if (userInfo.score >= 180) {
            for (var i = 0; i < 3; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
            userInfo.starArr.push({ starClass: "ion-android-star-half golden" });
        }
        else if (userInfo.score >= 120) {
            for (var i = 0; i < 3; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
        }
        else if (userInfo.score >= 90) {
            for (var i = 0; i < 2; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
            userInfo.starArr.push({ starClass: "ion-android-star-half golden" });
        }
        else if (userInfo.score >= 60) {
            for (var i = 0; i < 2; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
        }
        else if (userInfo.score >= 30) {
            for (var i = 0; i < 1; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
            userInfo.starArr.push({ starClass: "ion-android-star-half golden" });
        }
        else if (userInfo.score >= 10) {
            for (var i = 0; i < 1; i++) {
                userInfo.starArr.push({ starClass: "ion-android-star golden" });
            }
        }
        else if (userInfo.score >= 5) {
            userInfo.starArr.push({ starClass: "ion-android-star-half golden" });
        }
        else if (userInfo.score > 0) {
            userInfo.starArr.push({ starClass: "ion-android-star-outline" });
        }
    }
    returnVal.getUserType = function (user) {
        //usertype=0 学员，1 班主任指导老师，2 访问者
        var usertype = -1;
        if (user.type == "student") {
            usertype = 0;
        } else if (user.type == "teacher") {
            usertype = 1;
        } else if (user.type == "visitor") {
            usertype = 2;
        }
        return usertype;
    }
    return returnVal;
})
.service("defaultList", function ($rootScope, $http, getDataSource, downService) {
    return {
        viewbjgg: function (id) {
            getDataSource.getDataSource("viewbjgg", { ggid: id, xyinfo_id: sessionStorage.userid }, function () {
            });
        },
        downMaterial: function (id) {
            getDataSource.getDataSource("getMaterial", { id: id }, function (data) {
                var fpath = {
                    type: 'material',
                    id: id.toString(),
                    bcid: $rootScope.user.bcinfo_id
                }
                var fPath = JSON.stringify(fpath);
                var url = "/api/getAttach/action/getAttach/xy/" + Base64.encode(fPath);
                downService.cordovaDown(downService.getRootPath() + url, data[0].filename);
            });
            //window.location.href = "/api/getAttach/action/getAttach/xy/" + Base64.encode(id);
        }
    }
})
.service("calcDate", function ($filter) {
    return {
        getDateStr: function (dobj, isUTC) {
            //获取系统时间
            var dateTemp = new Date(dobj.createdate);
            var realDate = dateTemp;
            if (isUTC) {
                realDate = new Date(dateTemp.getUTCFullYear(), dateTemp.getUTCMonth(), dateTemp.getUTCDate(), dateTemp.getUTCHours(), dateTemp.getUTCMinutes(), dateTemp.getUTCSeconds());
            }
            var edate = $filter('date')(realDate, 'yyyy-MM-dd HH:mm:ss');
            var sysDate = new Date(),
				newDate = new Date(edate);
            catime = 0;
            var minuteNum = (sysDate.getTime() - newDate.getTime()) / 60 / 1000;//分钟
            //算出天时分,分钟大于60则使用小时，小时大于24则使用天，如果小于0则显示已过评价期限
            var rtnStr = "";
            var daymins = 1140;
            var monthMins = daymins * 30;
            var yearMins = monthMins * 12;
            if (parseInt(minuteNum) <= 0) {
                rtnStr = "1分钟前";
            } else if (parseInt(minuteNum) <= 60) {
                rtnStr = parseInt(minuteNum) + "分钟前";
            } else if (parseInt(minuteNum) < daymins) {
                catime = ((parseInt(minuteNum) % 60) / 60).toFixed(0) * 10;
                rtnStr = ((parseInt(parseInt(minuteNum) / 60) * 10 + catime) / 10) + "小时前";//算出不足1小时分钟数量转化为小于1小时的小时格式
            } else if (parseInt(minuteNum) < monthMins) {
                catime = ((parseInt(minuteNum) % daymins) / daymins).toFixed(0) * 10;
                rtnStr = ((parseInt(parseInt(minuteNum) / daymins) * 10 + catime) / 10) + "天前";//算出不足1天的分钟数量转化为小于1天的天数格式
            } else if (parseInt(minuteNum) < yearMins) {
                catime = ((parseInt(minuteNum) % monthMins) / monthMins).toFixed(0) * 10;
                rtnStr = ((parseInt(parseInt(minuteNum) / monthMins) * 10 + catime) / 10) + "月前";
            } else { }
            return rtnStr;
        }
    }
})
.service("editFormService", function ($http, $rootScope, getDataSource) {
    return {
        updateToSuccess: function (id) {
            getDataSource.getDataSource("updateToSuccess", { info_id: id }, function () { });
        },
        doReader: function (id) {
            getDataSource.getDataSource("updateToReader", { info_id: id }, function () { });
        }
    }
})
.service("menuService", function ($http, cordovaService) {
    return {
        goChaoXing: function () {
            cordovaService.checkAppInstall();
        }
    }
})
.service("checkidcard", function ($http) {
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子   
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X   
    function isTrueValidateCodeBy18IdCard(a_idCard) {
        var sum = 0;                             // 声明加权求和变量   
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i];            // 加权求和   
        }
        valCodePosition = sum % 11;                // 得到验证码所位置   
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    }
    /**  
      * 验证18位数身份证号码中的生日是否是有效生日  
      * @param idCard 18位书身份证字符串  
      * @return  
      */
    function isValidityBrithBy18IdCard(idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题   
        if (temp_date.getFullYear() != parseFloat(year)
              || temp_date.getMonth() != parseFloat(month) - 1
              || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }
    /**  
     * 验证15位数身份证号码中的生日是否是有效生日  
     * @param idCard15 15位书身份证字符串  
     * @return  
     */
    function isValidityBrithBy15IdCard(idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
        if (temp_date.getYear() != parseFloat(year)
                || temp_date.getMonth() != parseFloat(month) - 1
                || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }
    //去掉字符串头尾空格   
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    return {
        IdCardValidate: function (idCard) {
            idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格                     
            if (idCard.length == 15) {
                return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
            } else if (idCard.length == 18) {
                var a_idCard = idCard.split("");                // 得到身份证数组   
                if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}).service('BreadcrumbOrganizeSelect', function ($http, $ionicPopup, $ionicLoading , Restangular) {
    return {
        showPop: function ($timeout, showAlert, selectData, isSingle, scope, callBack, rootDept) {
            var template = '<div class="tabs-striped tabs-top tabs-background-positive tabs-color-light">'+
            //'<!--div class="tabs">'+
	        //'<a class="tab-item hbb active" ng-click="changeTab(2)" id="orgTab">' +
	        //  '环境保护部机构' +
	        //'</a></div-->' +
            '</div>' +
	        '<div class="list breadcrumb-select-content" id="selectUsersDom"  >' +
	        		'<ol class="breadcrumb breadcrumb-head" >' +
	        			'<li class="breadcrumb-head-item" ng-click="showUserByDept(parent,$event)" ng-repeat="parent in parents" >{{parent.name}}</li>' +
	        		'</ol>' +
	        		'<ion-list class="breadcrumb-select-content-list">' +
					     '<div ng-if="items && items.length > 0"  ng-repeat="item in items">' +
                            '<div ng-if="item.isLeaf">' +
						     	'<label class="checkbox checkbox-stable breadcrumb-select-leafnode-label" >' +
						     	'<input orgId="{{item.id}}" class="breadcrumb-select-leafnode-input" type="checkbox" ion-stop-event ng-click="finish(item,$event);" >' +
                                '<div  class="breadcrumb-select-leafnode-title">{{item.name}}</div>'+
                                '</label>'+
                            '</div>' +
					     	'<div ng-if="!item.isLeaf"  class="item item-divider breadcrumb-select-node">' +//  class="item item-divider breadcrumb-select-node" 
					     		//'<span>'+
                                   
                                    //'<span class="breadcrumb-select-node-title" ng-click="finish(item,$event);">{{item.name}}a</span>' +
									'<label class="checkbox checkbox-stable breadcrumb-select-leafnode-label" >' +
						     		'<input orgId="{{item.id}}" class="breadcrumb-select-leafnode-input" type="checkbox" ion-stop-event ng-click="finish(item,$event);"> ' + //  
									'</label>' +
									'<div  class="breadcrumb-select-leafnode-title" style="margin: -10px 0px 0px 40px;" ng-click="showUserByDept(item,$event)">' +
									 '<i class="icon ion-arrow-right-b padding-right"></i>' +
        							'{{item.name}}</div>' +
                                //'</span>' +
					     	'</div>' +
					     '</div>' +
			     	'</ion-list>' +
	      	'</div>';
            var userId = localStorage.userid;
            var rootDept = rootDept || localStorage.mainUnit;
            var deptId = -1;
            scope.nowpageIndex = 0;
            scope.tabType = 1;
            scope.isExistData = true;
            scope.items = new Array();
            scope.parents = new Array();
            scope.users = new Array();
            var jsonData = {
                pid: '0',
			    id: '100000'
            };

            //TODO
            var tempSelectedArr = [];
            for (var i = 0; scope.selectUserArr && i < scope.selectUserArr.length; i++) {
                tempSelectedArr.push(scope.selectUserArr[i]);
            }

            scope.changeTab = function (type) {
                if (type == 1) {
                    $("#commonTab").addClass("active");
                    $("#orgTab").removeClass("active");
                    getUsedUser();
                    scope.tabType = 0;
                } else {
                    $("#commonTab").removeClass("active");
                    $("#orgTab").addClass("active");
                    showDept(jsonData);
                    scope.tabType = 1;
                }
            }
            
            function containId(id, array) {
                for (var j = 0; j < array.length; j++) {
                    console.log(array[j].userid);
                    if (array[j].userid = id) {
                        return true;
                    }
                }
                return false;
            }


            function showDept(json) {
                showAlert.showLoading(20000, "加载中...");

                if (localStorage.debug) {
                    console.log("deptData=", json);
                }

                scope.items = new Array();
                scope.parents = new Array();


                Restangular.all("GetDepartment").post(json).then(function (data) {
                    showAlert.hideLoading();
                    if (localStorage.debug) {
                        console.log(data.parents, data.children);
                    }

                    if (data) {
                        if (localStorage.debug) {
                            console.log("加载成功");
                        }
                
                        var result = new Object();
                        result.data = data;
                    
                        var datas = data.children;
                        var parents = data.parents;
                        scope.groupName = "";
                        for (var i = 0; datas && i < datas.length; i++) {
                            datas[i].checked = false;
                            scope.items.push(datas[i]);
                        }

                        for (var i = 0; parents && i < parents.length; i++) {
                            parents[i].isShow = false;
                            scope.parents.push(parents[i]);
                        }
                    } else {
                        var msg = ""
                        if (data && data.message) {
                            msg = data.message;
                        } else {
                            msg = "加载失败";
                        }
                        showAlert.showToast(msg);
                    }
                })["catch"](function (data, status) {
                    console.log(data);
                    showAlert.hideLoading();
                    showAlert.showToast("加载出错");
                });
            }
            scope.showUserByDept = function (jsonData, $event) {
            	showDept(jsonData);
            	$event.stopPropagation();
            };

            scope.getCheckUsers = function () {
                callBack(scope.selectUserArr);
            };

            scope.checkAll = function (deptId, $event) {
                var checked = $event.target.checked;
                for (var j = 0; j < scope.orgitems.length; j++) {
                    if (deptId == scope.orgitems[j].id) {
                        for (var i = 0; i < scope.orgitems[j].users.length; i++) {
                            scope.orgitems[j].users[i]['checked'] = checked;
                        }
                    }
                }

                $("#" + deptId).find("input:checked").each(function (i) {
                    $(this).attr("checked", checked);
                });
                console.log(scope.orgitems);
            }

            scope.finish = function (item, $event) {
                var orgId = item.id;
                setSelectUsers(item);
                if (isSingle) {
                    $("#selectUsersDom").find("input:checked").each(function (i) {
                        if ($(this).attr('orgId') != orgId) {
                            $(this).attr("checked", false);
                        }
                    });
                }
                $event.stopPropagation();
            }

            function setSelectUsers(item, mobile) {
                var state = 0;

                if (isSingle) {
                    scope.selectUserArr = [];
                    scope.selectUserArr.push(item);
                }else{
                    if (scope.selectUserArr.length == 0) {
                        scope.selectUserArr.push(item);
                    } else {
                        for (var i = 0; i < scope.selectUserArr.length; i++) {
                            if (scope.selectUserArr[i].userid == userid) {
                                scope.selectUserArr.splice(i, 1);
                                state = 0;
                                break;
                            }
                            state = 1;
                        }
                        if (state) {
                            scope.selectUserArr.push(item);
                        }
                    }
                }
            }

            function initPopupData() {
                showDept(jsonData);
            }

            initPopupData();

            myPopup = $ionicPopup.show({
                title: '<p style="font-weight:bold;">机构选择</p>',
                template: template,
                scope: scope,
                buttons: [
			      {
			          text: '<b>关闭</b>',
			          type: 'button-positive',
			          onTap: function (e) {
			              scope.selectUserArr = new Array();
			              for (var i = 0; i < tempSelectedArr.length; i++) {
			                  scope.selectUserArr.push(tempSelectedArr[i]);
			              }
			              myPopup.close();
			              e.preventDefault();
			          }
			      }, {
			          text: '<b>确定</b>',
			          type: 'button-positive',
			          onTap: function (e) {
			              scope.getCheckUsers();
			              myPopup.close();
			              e.preventDefault();
			          }
			      }
                ]
            });

            return myPopup;
        }
    }
});