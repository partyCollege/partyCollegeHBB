window.apiCallback = new Object();
angular.module('app.public.commonServices', [])
.service("getDataSource", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {
    return {
        getCacheStaticJson: function (options, success, error) {
            //通过key获取静态化数据,key是唯一的。
            var root = $rootScope.appConfig.fileServer.rootPath;
            var filepath = root + $rootScope.appConfig.fileServer["staticJson"] + "/";
            //实现按班或者更复杂的情况的缓存数据。
            var locationUrl = location.href;
            if (options.folder && options.folder != "") {
                var folder = $rootScope.appConfig.fileServer[options.folder];
                filepath = root + folder + "/" + options.key + ".json";
            } else {
                filepath = filepath + options.key + ".json";
            }
            $.ajax({
                type: "get",
                async: true,
                cache: true,
                url: filepath,
                dataType: "jsonp",//数据类型为jsonp  
                jsonp: options.callback, //服务端用于接收callback调用的function名的参数
                success: function (data) {
                    console.log("data", data);
                },
                error: function (e) { console.log("error", e); }
            });
        },
        getDataSource: function (type, data, success, error, options) {
            var array = [];
            if (typeof (type) == "string") {
                array.push(type);
            }
            else {
                array = type;
            }
            var pData = { key: array, postData: data };
            //options 用于读取本地静态数据
            //options.key 为json文件名
            if (options != null && typeof (options) == "object") {
                this.getCacheStaticJson(options, success, error);
            } else {
                //测试阶段读取本地JSON文件
                if ($rootScope.appConfig.localSQL === true) {
                    this.getLocalJSON(type, data, success, error);
                }
                else {
                    $http.post("../api/CommonSQL", JSON.stringify(pData))
					.success(function (data) {
					    if (data.error) {
					        //alert(JSON.stringify(error));
					        error(data.error);
					    }
					    else {
					        success(data);
					    }
					})
					.error(function (data) {
					    if (error) {
					        //alert(JSON.stringify(error));
					        error(data);
					    }
					});
                }
            }
        },
        getList: function (type, data, pageInfo, search, orderBy, success, error) {
            var array = [];
            if (typeof (type) == "string") {
                array.push(type);
            }
            else {
                array = type;
            }
            var pData = { key: array, postData: data, pageInfo: pageInfo, search: search, orderBy: orderBy };
            $http.post("../api/CommonSQL", JSON.stringify(pData))
            .success(function (data) {
                if (data.error) {
                    error(data.error);
                }
                else {
                    success(data);
                }
            })
            .error(function (data) {
                if (error) {
                    error(data);
                }
            });
        },
        getConnKeyList: function (type, data, pageInfo, search, orderBy, connectionKey, success, error) {
            var array = [];
            if (typeof (type) == "string") {
                array.push(type);
            }
            else {
                array = type;
            }
            var pData = { key: array, postData: data, pageInfo: pageInfo, search: search, orderBy: orderBy, connectionKey: connectionKey };
            $http.post("../api/CommonSQL", JSON.stringify(pData))
            .success(function (data) {
                if (data.error) {
                    error(data.error);
                }
                else {
                    success(data);
                }
            })
            .error(function (data) {
                if (error) {
                    error(data);
                }
            });
        },
        getUrlList: function (url, data, pageInfo, search, orderBy, success, error) {
            var pData = { postData: data, pageInfo: pageInfo, search: search, orderBy: orderBy };
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
                if (error) {
                    error(data);
                }
            });
        },
        //getDataPromise: function (type, data) {
        //	var array = [];
        //	if (typeof (type) == "string") {
        //		array.push(type);
        //	}
        //	else {
        //		array = type;
        //	}
        //	var pData = { key: array, postData: data };
        //	//测试阶段读取本地JSON文件
        //	if ($rootScope.appConfig.localSQL === true) {
        //		this.getLocalJSON(type, data, success, error);
        //	}
        //	else {
        //		return $http.post("../api/CommonSQL", JSON.stringify(pData));
        //	}
        //},
        doArray: function (type, data, success, error) {
            var array = [];
            if (typeof (type) == "string") {
                array.push(type);
            }
            else {
                array = type;
            }
            var pData = { key: array, postData: data };
            //测试阶段读取本地JSON文件
            if ($rootScope.appConfig.localSQL === true) {
                this.getLocalJSON(type, data, success, error);
            }
            else {
                $http.post("../api/CommonSQL/Array", JSON.stringify(pData))
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
        },
        getLocalJSON: function (type, data, success, error) {
            var q = $http.get("../testJSON/" + type + ".json");
            q.success(success);
            q.error(error);
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
        },
        queryLunbo: function (url) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '../config/img.json'
            }).success(function (data, status, header, config) {
                deferred.resolve(data);
            }).error(function (data, status, header, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        getData: function (url, success, error) {
            $http.get(url)
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
        changeUserPhoto: function (photo, photothumb) {
          
            this.getUrlData("../api/changeuserphoto", { photopath: photo, photothumbpath: photothumb }, function (data) {
                var a = data;
            }, function (errortemp) { });

        },
        writeLog: function (t, g) { 
            this.getUrlData("../api/writeoptlog", { tag:t, group:g }, function (data) {
                var a = data;
            }, function (errortemp) { });

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
        getDepartment: function (success, error) {
            if ($rootScope.user && $rootScope.user.isLogin && $rootScope.user.usertype == 2) {
                //有登陆，超级管理员直接读json文件
                this.getDataSource('getDepartment', { pid: $rootScope.user.departmentId }, function (data) {
                    //success(data);
                }, function (e) {
                    error(e);
                }, { key: "getAllDepartment", folder: "", callback: "apiCallback.getAllDepartment" });
                
            } else {
                this.getDataSource('getDepartment', { pid: $rootScope.user.mdepartmentId }, function (data) {
                    success(data);
                }, function (e) {
                    error(e);
                });
            }
        },
        getDepartmentAdmin: function (success, error) {

            var mid = $rootScope.user.mdepartmentId;
            if ($rootScope.user.usertype == 2) {
                mid = $rootScope.user.departmentId;
            }
            this.getDataSource('getDepartmentHasAdmin', { pid: mid }, function (data) {
                    success(data);
            }, function (e) {
                console.log(e);
            });
        }
    }
}])
.service("drawTable", ["$http", "$rootScope", "getDataSource", function ($http, $rootScope, getDataSource) {
    var table = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        data: [],
        columnDefs: [
          { name: '课程名称', field: "name", cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.goDetial(row)">{{row.entity.name}}</a></div>' },
          { name: '授课人', field: "teachersname" }
        ]
    };
    return {
        drawTable: function (coursewareid) {
            getDataSource.getDataSource("getCourseMicroVideo", { courseid: coursewareid }, function (data) {
                table.data = data;
            })
            return table;
        }
    }
}])
.service("smsService", ["$rootScope", "$http",function ($rootScope, $http) {
    return {
        "isSimulation": false,
        "send": function (args, successCallback, errorCallback) {
            $http.post("../api/SMS", args)
            .success(function () {
                successCallback();
            })
            .error(function () {
            });
        }
    }
}])
.service("AccountService", ["$http", "$rootScope", "getDataSource", 'CommonService',
    function ($http, $rootScope, getDataSource, CommonService) {
        return {
            saveAccount: function (loginobj, success, error) {
                getDataSource.getUrlData("../api/Register", loginobj, function (datatemp) {
                    if (datatemp.code == "success") {
                        success(datatemp);
                    } else {
                        error(datatemp);
                    }
                }, function (errortemp) {
                    error(errortemp);
                });
            }
        }
    }])
.service("SessionService", ["$http", "$rootScope", "getDataSource", "$state", 'CommonService'
	, function ($http, $rootScope, getDataSource, $state, CommonService) {
	    return {
	    	CheckSession: function (platformcode, success) {
	            if ($rootScope.user && $rootScope.user.isLogin) {

	            } else {
	            	return $http.post("../api/session", { platformcode: platformcode }).success(function (data) {
	            		$rootScope.user = new Object();
	            		$rootScope.user.isLogin = false;
	                    if (data.code == "success") {
	                        $rootScope.user = data.loginUser;
	                        $rootScope.user.isLogin = true;
	                        success($rootScope.user);
	                    } else {
	                        //$rootScope.user = data.loginUser;
	                        $rootScope.user.isLogin = false;
	                        location.href = "../html/login.html"
	                    }
	                    //console.log($rootScope.user);
	            	}).error(function (errortemp) {

	            	});
	            	
	            }
	    	},
	    	RenovatSession: function (platformcode, success) {
	    	    return $http.post("../api/session", { platformcode: platformcode }).success(function (data) {
	    	        $rootScope.user = new Object();
	    	        $rootScope.user.isLogin = false;
	    	        if (data.code == "success") {
	    	            $rootScope.user = data.loginUser;
	    	            $rootScope.user.isLogin = true;
	    	            success($rootScope.user);
	    	        } else {
	    	            //$rootScope.user = data.loginUser;
	    	            $rootScope.user.isLogin = false;
	    	            location.href = "../html/login.html"
	    	        }
	    	        //console.log($rootScope.user);
	    	    }).error(function (errortemp) {

	    	    });
	    	},
	    	HeartBeat: function (success,error) {
	    		getDataSource.getUrlData("../api/HeartBeat", {}, function (datatemp) {
	    			if (datatemp.code == "success") {
	    				success();
	    			} else {
	    				error();
	    			}
	    		}, function (errortemp) {
	    			error();
	    		});
	    	},
	        GetConfig: function () {
	            return $http.get("../config/appConfig.json").then(function (data) {
	                $rootScope.appConfig = data.data;
	            });
	        },
	        GetAlumnusDurationTime: function () {
	        	return $http.post("../api/getAlumnusDuration").success(function (data) {
	        		$rootScope.user.isduration = data.isduration;
	        	}).error(function (error) { });
	        },
	        Logout: function () {
	        	//console.log("$rootScope.user.firstpage", $rootScope.user.firstpage);
	            if (confirm("确定要退出系统吗?")) {
	                getDataSource.getUrlData("../api/Logout", {}, function (datatemp) {
	                	if (datatemp.code == "success") {
	                		var href = "../html/index.html"; //$rootScope.user.firstpage;
	                        location.href = href;
	                    }
	                }, function (errortemp) {
	                });
	            }
	        },
	        GetCenterUrl: function (type) {
	            var btnList = new Array();
	            if ($rootScope.user && $rootScope.user.isLogin) {
	            	//var roledata = $rootScope.user.roleList;
	            	var hrefobj = new Object();
	            	var btnlisttemp = $rootScope.user.btnList;
	            	var btnList = new Array();
	            	//var permissionList = $rootScope.user.permissionDic;
	            	//var permissonObj = _.find(permissionList, { Name: "学习中心" });
	            	//if (typeof (permissonObj) == "object") {
	            	//	hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 0 });
	            	//	btnList.push({ btnname: "学习中心", href: hrefobj.href, usertype: 0, isSelected: false });
	            	//}

	            	//permissonObj = _.find(permissionList, { Name: "班级中心" });
	            	//if (typeof (permissonObj) == "object") {
	            	//	hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 1 });
	            	//	btnList.push({ btnname: "班级中心", href: hrefobj.href, usertype: 1, isSelected: false });
	            	//}

	            	//permissonObj = _.find(permissionList, { Name: "校友学员" });
	            	//if (typeof (permissonObj) == "object") {
	            	//	hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 3 });
	            	//	btnList.push({ btnname: "校友学员", href: hrefobj.href, usertype: 3, isSelected: false });
	            	//}

	            	//permissonObj = _.find(permissionList, { Name: "管理中心" });
	            	//if (typeof (permissonObj) == "object") {
	            	//	hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 2 });
	            	//	btnList.push({ btnname: "管理中心", href: hrefobj.href, usertype: 2, isSelected: false });
	            	//}

	            	var length = btnlisttemp.length;
	            	var hrefobj = new Object();
	            	for (var i = 0; i < length; i++) {
	            		var btn = btnlisttemp[i];
	            		
	            		if (btn == "学习中心") {
	            			hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 0 });
	            			btnList.push({ btnname: btn, href: hrefobj.href, usertype: 0, isSelected: false });
	            		} else if (btn == "班级中心") {
	            			hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 1 });
	            			btnList.push({ btnname: btn, href: hrefobj.href, usertype: 1, isSelected: false });
	            		}
	            		else if (btn == "校友中心") {
	            			//hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 3 });
	            			//btnList.push({ btnname: "校友中心", href: hrefobj.href, usertype: 3, isSelected: false });
	            		}
	            		else {
	            			hrefobj = _.find($rootScope.appConfig.loginHref, { usertype: 2 });
	            			btnList.push({ btnname: btn, href: hrefobj.href, usertype: 2, isSelected: false });
	            		}
	            	}
	            }

	            //if (type) {
	            //    for (var i = 0; i < btnList.length; i++) {
	            //        if (btnList[i].btnname == type) {
	            //            btnList[i].isSelected = true;
	            //            break;
	            //        }
	            //    }
	            //}

	            return btnList;
	        },
	        HrefCenterUrl: function (btn_name, href,funcsuccess) {
	            var url = '';
	            if (btn_name == "学习中心") {
	                url = "../api/multiclass/GetMultiClass";
	                getDataSource.getUrlData(url, { accountid: $rootScope.user.accountId }, function (data) {
	                    if (data.code == "multiclass") {
	                    	var temp = data.multiclass;
	                    	funcsuccess(data);
	                    } else if (data.code == "failed") {
	                    	funcsuccess(data);
	                    }else {
	                        location.href = "../" + href;
	                    }
	                }, function (error) {
	                	
	                });
	            } else if (btn_name == "班级中心") {
	                //进入班级中心需重新拉取该帐号的老师班级
	                url = "../api/teacherInClass";
	                getDataSource.getUrlData(url, { accountid: $rootScope.user.accountId, platformid: $rootScope.user.platformid }, function (data) {
	                    if (data.code == "success") {
	                        location.href = "../" + href;
	                    } else {
	                        CommonService.alert(data.message);
	                    }
	                }, function (error) {
	                });
	            } else if (btn_name == "管理中心") {
	                getDataSource.getUrlData("../api/setplatformid", {}, function (datatemp) {
	                	location.href = "../" + href.replace("[domain]", $rootScope.user.domain);;
	                }, function (errortemp) {

	                });
	            } else if (btn_name == "校友中心") {
	                getDataSource.getUrlData("../api/inMateCenter", { accountid: $rootScope.user.accountId }, function (datatemp) {
	                    if (datatemp.code == "success") {
	                        //console.log("$rootScope.user",$rootScope.user);
	                        location.href = "../" + href;
	                    } else {
	                        CommonService.alert(datatemp.message);
	                    }
	                }, function (errortemp) {

	                });
	            }
	            else {
	                location.href = href;
	            }
	        },
	        GetPermissionList: function (allPermission, gName) {
	            var pList = [];

	            if ($rootScope.user.permissionDic.length == 0) return pList;
	            //var permission = _.filter($rootScope.user.permissionDic, { GroupName: gName });

	            for (var p in allPermission) {
	                var pp = _.find($rootScope.user.permissionDic, { Name: allPermission[p].title });
	                if (pp != undefined) {
	                    pList.push(allPermission[p]);
	                }
	            }

	            return pList;
	        },
	        HrefToIndex: function () {
	            return "../html/index.html";
	        },

	        HrefToSubIndex: function (Catalog) {
	            return "../" + Catalog + "/index.html";
	        },
	        GetStudent: function (studentid, classid) {
	            var self = this;
                
	            return $http.post("../api/getStudentInfo", { studentid: studentid }).success(function (data) {
	                if (data[0].classid != classid) {
	                    location.href = "../html/index.html";
	                    alert("该学员不属于该班级");
	                    return;
	                }

	                $rootScope.user.accountId = data[0].accountid;
	                $rootScope.user.classId = data[0].classid;
	                $rootScope.user.studentId = data[0].id;

	            }).error(function (errortemp) {

	            });

	            //getDataSource.getDataSource("selectClassStudentById", {id:studentid}, function (data) {
	            //    if (data && data.length > 0) {
	            //        if (data[0].classid != classid) {
	            //            location.href = "../html/index.html";
	            //            alert("该学员不属于该班级");
	            //            return;
	            //        }

	            //        $rootScope.user.accountId = data[0].accountid;
	            //        $rootScope.user.classId = data[0].classid;
	            //        $rootScope.user.studentId = data[0].id;
	            //    } else { 
	            //        location.href = "../html/index.html";
	            //        alert("该学员不属于该班级");
	            //    }
	            //}, function (e) {

	            //}); 
	        }
	    }
	}])
.service("FilesService", ["$http", "$rootScope", "Upload", "Base64", function ($http, $rootScope, Upload, Base64) {
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
			if (filename == null || filename=='') {
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
		    //老数据需要拼接category对应的路径
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
            //老数据需要拼接category对应的路径
            var filePath = root + $rootScope.appConfig.fileServer[category] + "/" + servername;
            if (servername.indexOf('/') > 0) {
                filePath = root + servername;
            }
        	//return filePath;
        	//var filepath = "../api/uploadfile/" + category + "/" + Base64.encode(servername).replace(/\+/g, "_") + "/" + Base64.encode(filename).replace(/\+/g, "_");
        	////window.location.href = filepath;
        	window.open(filePath);
        },
        downApiFiles: function (category, servername, filename) {
        	//var root = $rootScope.appConfig.fileServer.rootPath;
        	//var filePath = root + $rootScope.appConfig.fileServer[category] + "/" + servername;
        	//return filePath;
        	var servernameBase64=Base64.encode(servername).replace(/\+/g, "_");//中文base64后会有问题。
        	var clientnameEscape = Base64.encode(escape(filename)).replace(/\+/g, "_");
        	var filePath = "../api/uploadfile/" + category + "/" + servernameBase64 + "/" + clientnameEscape;
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
.service("UserPhotoService", ["$http", "$rootScope", "Upload", "Base64", "FilesService", "CommonService", "getDataSource", function ($http, $rootScope, Upload, Base64, FilesService, CommonService, getDataSource) {
	return {
		showFile: function (category, servername, filename) {
			return FilesService.getDefaultImage(category, servername, filename);
			//return "../api/uploadfile/" + category + "/" + Base64.encode(servername).replace(/\+/g, "_") + "/" + Base64.encode(filename).replace(/\+/g, "_");
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
		},
		updateAccountHeadImage: function (file, callback) {
			FilesService.upLoadPicture(file, { upcategory: "userPhoto", width: 80, height: 80 }, function (data) {
				//上传成功，并且服务器返回有数据
				if (data.status == "200" && data.data.length >= 1) {

					var servername = data.data[0].servername;
					var fArr = servername.split(".");
					var fileName = fArr[0] + "_small." + fArr[1];

					var param = { accountid: $rootScope.user.accountId, idphoto: data.data[0].servername, thumbname: fileName };

					getDataSource.getDataSource("updateUserInfoHeadImage", param, function (data) {

						CommonService.alert("修改图像成功！");
						if (callback) callback(true);

						getDataSource.getUrlData("../api/changeuserphoto", { photopath: servername, photothumbpath: fileName }, function (data) {
							var a = data;
						}, function (errortemp) { });


					}, function (e) {
						CommonService.alert("修改图像失败！");
						if (callback) callback(false);
					});


				}
			});
		}
	}
}])
.service("GetFileService", ["$http", "$rootScope", "Base64", "CommonService", "getDataSource", function ($http, $rootScope, Base64, CommonService, getDataSource) {
	return {
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
		    //老数据需要拼接category对应的路径
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
			if (category == "pptCourseFile") {
				return "../api/uploadfile/" + category + "/" + Base64.encode(servername).replace(/\+/g, "_") + "/" + Base64.encode(filename).replace(/\+/g, "_");
			} else {
				return this.getDefaultImage(category, servername, filename);
			}
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
.service("Base64", function () {
    var Base64 = {
        // 转码表
        table: [
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3',
                '4', '5', '6', '7', '8', '9', '+', '/'
        ],
        UTF16ToUTF8: function (str) {
            var res = [], len = str.length;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                if (code > 0x0000 && code <= 0x007F) {
                    // 单字节，这里并不考虑0x0000，因为它是空字节
                    // U+00000000 – U+0000007F  0xxxxxxx
                    res.push(str.charAt(i));
                } else if (code >= 0x0080 && code <= 0x07FF) {
                    // 双字节
                    // U+00000080 – U+000007FF  110xxxxx 10xxxxxx
                    // 110xxxxx
                    var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                    // 10xxxxxx
                    var byte2 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1),
                        String.fromCharCode(byte2)
                    );
                } else if (code >= 0x0800 && code <= 0xFFFF) {
                    // 三字节
                    // U+00000800 – U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                    // 1110xxxx
                    var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                    // 10xxxxxx
                    var byte2 = 0x80 | ((code >> 6) & 0x3F);
                    // 10xxxxxx
                    var byte3 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1),
                        String.fromCharCode(byte2),
                        String.fromCharCode(byte3)
                    );
                } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                    // 四字节
                    // U+00010000 – U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                    // 五字节
                    // U+00200000 – U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                    // 六字节
                    // U+04000000 – U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }

            return res.join('');
        },
        UTF8ToUTF16: function (str) {
            var res = [], len = str.length;
            var i = 0;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                // 对第一个字节进行判断
                if (((code >> 7) & 0xFF) == 0x0) {
                    // 单字节
                    // 0xxxxxxx
                    res.push(str.charAt(i));
                } else if (((code >> 5) & 0xFF) == 0x6) {
                    // 双字节
                    // 110xxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var byte1 = (code & 0x1F) << 6;
                    var byte2 = code2 & 0x3F;
                    var utf16 = byte1 | byte2;
                    res.push(Sting.fromCharCode(utf16));
                } else if (((code >> 4) & 0xFF) == 0xE) {
                    // 三字节
                    // 1110xxxx 10xxxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var code3 = str.charCodeAt(++i);
                    var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                    var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                    utf16 = ((byte1 & 0x00FF) << 8) | byte2
                    res.push(String.fromCharCode(utf16));
                } else if (((code >> 3) & 0xFF) == 0x1E) {
                    // 四字节
                    // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (((code >> 2) & 0xFF) == 0x3E) {
                    // 五字节
                    // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                    // 六字节
                    // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }

            return res.join('');
        },
        encode: function (str) {
            if (!str) {
                return '';
            }
            var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
            var i = 0; // 遍历索引
            var len = utf8.length;
            var res = [];
            while (i < len) {
                var c1 = utf8.charCodeAt(i++) & 0xFF;
                res.push(this.table[c1 >> 2]);
                // 需要补2个=
                if (i == len) {
                    res.push(this.table[(c1 & 0x3) << 4]);
                    res.push('==');
                    break;
                }
                var c2 = utf8.charCodeAt(i++);
                // 需要补1个=
                if (i == len) {
                    res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                    res.push(this.table[(c2 & 0x0F) << 2]);
                    res.push('=');
                    break;
                }
                var c3 = utf8.charCodeAt(i++);
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
                res.push(this.table[c3 & 0x3F]);
            }

            return res.join('');
        },
        decode: function (str) {
            if (!str) {
                return '';
            }

            var len = str.length;
            var i = 0;
            var res = [];

            while (i < len) {
                code1 = this.table.indexOf(str.charAt(i++));
                code2 = this.table.indexOf(str.charAt(i++));
                code3 = this.table.indexOf(str.charAt(i++));
                code4 = this.table.indexOf(str.charAt(i++));

                c1 = (code1 << 2) | (code2 >> 4);
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                c3 = ((code3 & 0x3) << 6) | code4;

                res.push(String.fromCharCode(c1));

                if (code3 != 64) {
                    res.push(String.fromCharCode(c2));
                }
                if (code4 != 64) {
                    res.push(String.fromCharCode(c3));
                }

            }

            return this.UTF8ToUTF16(res.join(''));
        }
    };
    return Base64;
})
.service("chatService", ["$http", "$rootScope", function ($http, $rootScope) {
    return {
        getsignalR: function () {
            return $http.get("../bower_components/signal/jquery.signalR-2.2.0.min.js");
        },
        getChatHub: function () {
            $http.get($rootScope.appConfig.signalRHub);
        }
    }
}])
.service("DateService", ["getDataSource", function (getDataSource) {
    return {
        getDateTimeStamp: function (dateStr) {
            //return Date.parse(dateStr.replace(/-/gi, "/"));
            return this.parserDate(dateStr);
        },
        getDateDiff: function (dateTimeStamp) {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var year = month * 12;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if (diffValue < 0) return "刚刚";
            var yearC = diffValue / year;
            if (yearC >= 1) return parseInt(yearC) + "年前";
            var monthC = diffValue / month;
            if (monthC >= 1) return parseInt(monthC) + "个月前";
            var weekC = diffValue / (7 * day);
            if (weekC >= 1) return parseInt(weekC) + "周前";
            var dayC = diffValue / day;
            if (dayC >= 1) return parseInt(dayC) + "天前";
            var hourC = diffValue / hour;
            if (hourC >= 1) return parseInt(hourC) + "个小时前";
            var minC = diffValue / minute;
            if (minC >= 1) return parseInt(minC) + "分钟前";
            return "刚刚";
        },
        format: function (formatdate, format) {
            //var date = new Date(formatdate);
            var date = this.parserDate(formatdate);
            var o = {
                "M+": date.getMonth() + 1, //month 
                "d+": date.getDate(), //day 
                "h+": date.getHours(), //hour 
                "m+": date.getMinutes(), //minute 
                "s+": date.getSeconds(), //second 
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
                "S": date.getMilliseconds() //millisecond 
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        getDayDiff: function (d1, d2) {

            var dt1 = this.getDateTimeStamp(this.format(d1, "yyyy-MM-dd"));
            var dt2 = this.getDateTimeStamp(this.format(d2, "yyyy-MM-dd"));

            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var year = month * 12;
            var now = dt1;
            var diffValue = dt2 - dt1;

            var dayC = diffValue / day;

            return parseInt(dayC);

        },
        parserDate: function (date) {
            var datetime;
            if (typeof (date) == "string") {
                //datetime = Date.parse(date.replace(/-/g, "/"));
                datetime = new Date(date.replace(/-/g, '/').replace(/T|Z/g, ' ').trim());
                if (isNaN(datetime)) {
                    datetime = new Date(Date.parse(date));
                }
            } else if (typeof (date == "object")) {
                datetime = new Date(Date.parse(date));
            }

            return datetime;

        },
        getWeek: function (date) {

            var week = this.parserDate(date).getDay();
            var weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            return weekArr[week];
        },
        getTimeToWeek: function (dd) {
            var today;
            if (dd)
                today = new Date(dd);
            else {
                today = new Date();
            }
            var day;
            var date;
            if (today.getDay() == 0) day = "星期日"
            if (today.getDay() == 1) day = "星期一"
            if (today.getDay() == 2) day = "星期二"
            if (today.getDay() == 3) day = "星期三"
            if (today.getDay() == 4) day = "星期四"
            if (today.getDay() == 5) day = "星期五"
            if (today.getDay() == 6) day = "星期六"
            yr = today.getYear();
            if (yr < 1000)
                yr += 1900;
            date = yr + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日 " + day;
            return date;
        }
		,
        getTodayDateSpan: function (Success, Error) {
            var func = this;
            getDataSource.getDataSource("getServerTime", {}, function (data) {
                Success(func.getTimeToWeek(data[0].servertime));
            }, function (error) {
                Success(func.getTimeToWeek(null));
            });
        },
        secondsToTime: function (seconds) {
            // 计算
            var h = 0, i = 0, s = parseInt(seconds);
            if (s > 60) {
                i = parseInt(s / 60);
                s = parseInt(s % 60);
                if (i > 60) {
                    h = parseInt(i / 60);
                    i = parseInt(i % 60);
                }
                if (s > 0) {
                    i = i + 1;
                }
            }
            // 补零
            var zero = function (v) {
                return (v >> 0) < 10 ? "0" + v : v;
            };
            //return zero(h) + "小时" + zero(i) + "分钟" + zero(s)+"秒";
            return zero(h) + "小时" + zero(i) + "分钟";
        },
        secondsToHHmmss: function (seconds) {
            // 计算
            var h = 0, i = 0, s = parseInt(seconds);
            if (s > 60) {
                i = parseInt(s / 60);
                s = parseInt(s % 60);
                if (i > 60) {
                    h = parseInt(i / 60);
                    i = parseInt(i % 60);
                }
            }
            // 补零
            var zero = function (v) {
                return (v >> 0) < 10 ? "0" + v : v;
            };
            return zero(h) + ":" + zero(i) + ":" + zero(s);
        },
        getDateTimeDifference: function (d1, d2) {
            var dt1 = this.parserDate(d1);
            var dt2 = this.parserDate(d2);

            var timespan = dt2 - dt1;

            var days = timespan / 24 / 60 / 60 / 1000;

            return parseInt(days);
        }
    }
}])
.service("CommonService", ["$rootScope", "notify", function ($rootScope, notify) {
	return {
		getQuery: function (qryname) {
			var url = location.href;
			var reg = new RegExp("(^|&)" + qryname + "=([^&]*)(&|$)");
			var r = url.substr(url.indexOf("\?") + 1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},
        alert: function (obj) {

            var options = {
                duration: "2000",
                position: "center"
            };

            if (typeof (obj) == "string") {

                options.message = obj;
                notify(options);

            } else if (typeof (obj) == "object") {

                options = _.merge(options, obj);
                notify(options);
            }
        },
        autoHeight: function (elements, control) {

            function windowHeight() {
                var de = document.documentElement;
                return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
            }
            var heights = 200;
            angular.forEach(elements, function (item) {
                heights += $(item).height();
            });
            alert(windowHeight() - heights);
            $(control).height(windowHeight() - heights);
        },
        error: function (err) {
            this.alert(JSON.stringify(err));
        },
        //获取数组中对象某一段用逗号合并后的字符串
        getJoinString: function (items, column) {
            var retrunVal = "";
            angular.forEach(items, function (item) {
                retrunVal += item[column] + ",";
            });
            if (retrunVal.length > 0)
                retrunVal = retrunVal.substring(0, retrunVal.length - 1);
            return retrunVal;
        },
        addMiniuts: function (timeObj, hourmin) {
            var miniuts = parseInt(hourmin.split(":")[0]) * 60 + parseInt(hourmin.split(":")[1]);
            return new Date(timeObj.setMinutes(timeObj.getMinutes() + miniuts, timeObj.getSeconds(), 0));
        },
        //判断输入框数字
        checkNum: function (min, max, value, defaultValue) {
            if (isNaN(parseFloat(value))) {
                notify({ message: '输入的不是数字', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                return;
            }
            if (min && !max) {
                if (parseFloat(min) > value) {
                    if (defaultStatus) {
                        value = defaultValue;
                    }
                    notify({ message: '输入的值太小', classes: 'alert-danger', templateUrl: $rootScope.appConfig.defaultNoticeUrl });
                    return;
                }
            }
        },
        formatUint: function (count) {
            var value = parseInt(count);
            if (value < 1000)
                value += "个";
            else if (value >= 1000 && value < 10000)
                value = parseFloat(parseFloat(value) / 1000).toFixed(1).toString() + "千";
            else
                value = parseFloat(parseFloat(value) / 10000).toFixed(1).toString() + "万";
            return value;
        },
        formatUintArray: function (count) {
            var arrayData = new Array();
            var value = parseInt(count);
            if (value < 1000)
                arrayData.push({ "value": value.toString(), "uint": "个" });
            else if (value >= 1000 && value < 10000)
                arrayData.push({ "value": parseFloat(parseFloat(value) / 1000).toFixed(1).toString(), "uint": "千" });
            else
                arrayData.push({ "value": parseFloat(parseFloat(value) / 10000).toFixed(1).toString(), "uint": "万" });
            return arrayData;
        },
        formatUintArrayInfo: function (count) {
            var arrayData = new Array();
            var value = parseInt(count);
            if (value < 1000)
                arrayData.push({ "value": value.toString(), "uint": "" });
            else if (value >= 1000 && value < 10000)
                arrayData.push({ "value": parseFloat(parseFloat(value) / 1000).toFixed(1).toString(), "uint": "K" });
            else
                arrayData.push({ "value": parseFloat(parseFloat(value) / 10000).toFixed(1).toString(), "uint": "W" });
            return arrayData;
        },
		uaMatch : function () {
    		var userAgent = navigator.userAgent,
			rMsie = /(msie\s|trident\/7)([\w.]+)/,
			rTrident = /(trident)\/([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rNewOpera = /(opr)\/(.+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/;
    		var matchBS, matchBS2;
    		var browser;
    		var version;
    		var ua = userAgent.toLowerCase();

    		var isWin10 = ua.indexOf("nt 10.0") > -1;
    		var isWin7 = ua.indexOf("nt 6.1") > -1;
    		var isVista = ua.indexOf("nt 6.0") > -1;
    		var isWin2003 = ua.indexOf("nt 5.2") > -1;
    		var isWinXp = ua.indexOf("nt 5.1") > -1;
    		var isWin2000 = ua.indexOf("nt 5.0") > -1;
    		var isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1);
    		var isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1);
    		var isAir = (ua.indexOf("adobeair") != -1);
    		var isLinux = (ua.indexOf("linux") != -1);

    		var sys = "";
    		if (isWin7) {
    			sys = "Windows 7";
    		} else if (isVista) {
    			sys = "Vista";
    		} else if (isWinXp) {
    			sys = "Windows xp";
    		}
    		else if (isWin10) {
    			sys = "Windows 10";
    		}
    		else if (isWin2003) {
    			sys = "Windows 2003";
    		} else if (isWin2000) {
    			sys = "Windows 2000";
    		} else if (isWindows) {
    			sys = "Windows";
    		} else if (isMac) {
    			sys = "Macintosh";
    		} else if (isAir) {
    			sys = "Adobeair";
    		} else if (isLinux) {
    			sys = "Linux";
    		} else {
    			sys = "Unknow";
    		}
    		matchBS = rMsie.exec(ua);
    		if (matchBS != null) {
    			matchBS2 = rTrident.exec(ua);
    			if (matchBS2 != null) {
    				switch (matchBS2[2]) {
    					case "4.0": return { sys: sys, browser: "IE", version: "8",useragent:ua }; break;
    					case "5.0": return { sys: sys, browser: "IE", version: "9", useragent: ua }; break;
    					case "6.0": return { sys: sys, browser: "IE", version: "10", useragent: ua }; break;
    					case "7.0": return { sys: sys, browser: "IE", version: "11", useragent: ua }; break;
    					default:
    						return { sys: sys, browser: "IE", version: "undefined", useragent: ua };
    				}
    			}
    			else
    				return { sys: sys, browser: "IE", version: matchBS[2] || "0", useragent: ua };
    		}
    		matchBS = rFirefox.exec(ua);
    		if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
    			return { sys: sys, browser: matchBS[1] || "", version: matchBS[2] || "0", useragent: ua };
    		}
    		matchBS = rOpera.exec(ua);
    		if ((matchBS != null) && (!(window.attachEvent))) {
    			return { sys: sys, browser: matchBS[1] || "", version: matchBS[2] || "0", useragent: ua };
    		}
    		matchBS = rChrome.exec(ua);
    		if ((matchBS != null) && (!!(window.chrome)) && (!(window.attachEvent))) {
    			matchBS2 = rNewOpera.exec(ua);
    			if (matchBS2 == null)
    				return { sys: sys, browser: matchBS[1] || "", version: matchBS[2] || "0", useragent: ua };
    			else
    				return { sys: sys, browser: "Opera", version: matchBS2[2] || "0", useragent: ua };
    		}
    		matchBS = rSafari.exec(ua);
    		if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
    			return { sys: sys, browser: matchBS[2] || "", version: matchBS[1] || "0", useragent: ua };
    		}
    		if (matchBS != null) {
    			return { sys: sys, browser: "undefined", version: " browser", useragent: ua };
    		}
		},
		checkIDCard: function (idcard) {
			var Errors = new Array("验证通过!", "身份证号码位数不对!", "出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
			var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }

			var Y, JYM;
			var S, M;
			var idcard_array = new Array();
			idcard_array = idcard.split("");
			if (area[parseInt(idcard.substr(0, 2))] == null) {
				return false;
			}

			switch (idcard.length) {
				case 15:
					if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
					} else {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
					}
					if (ereg.test(idcard)) {
						return true;
					}
					else {
						return false;
					}
					break;
				case 18:
					//18位身份号码检测
					if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}[1-9]\d{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
					} else {
						ereg = /^[1-9][0-9]{5}[1-9]\d{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
					}
					if (ereg.test(idcard)) {
						S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
							+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
							+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
							+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
							+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
							+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
							+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
							+ parseInt(idcard_array[7]) * 1
							+ parseInt(idcard_array[8]) * 6
							+ parseInt(idcard_array[9]) * 3;
						Y = S % 11;
						M = "F";
						JYM = "10X98765432";
						M = JYM.substr(Y, 1);
						if (M == idcard_array[17]) {
							return true;
						}
						else {
							return false;
						}
					}
					else {
						return false;
					}
					break;
				default:
					return false;
			}
		},
		initInputControlDisabled: function () {
			$("input").each(function () {
				$(this).attr("disabled", true);
			});
			$("select").each(function () {
				$(this).attr("disabled", true);
			});
			$(".platformdisabled").each(function () {
				$(this).attr("style", "display:none;");
			});
		}
    };
}])
.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
        function ($rootScope, $browser, $q, $exceptionHandler) {
            var deferreds = {},
                methods = {},
                uuid = 0;

            function debounce(fn, delay, invokeApply) {
                var deferred = $q.defer(),
                    promise = deferred.promise,
                    skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                    timeoutId, cleanup,
                    methodId, bouncing = false;

                // check we dont have this method already registered
                angular.forEach(methods, function (value, key) {
                    if (angular.equals(methods[key].fn, fn)) {
                        bouncing = true;
                        methodId = key;
                    }
                });

                // not bouncing, then register new instance
                if (!bouncing) {
                    methodId = uuid++;
                    methods[methodId] = { fn: fn };
                } else {
                    // clear the old timeout
                    deferreds[methods[methodId].timeoutId].reject('bounced');
                    $browser.defer.cancel(methods[methodId].timeoutId);
                }

                var debounced = function () {
                    // actually executing? clean method bank
                    delete methods[methodId];

                    try {
                        deferred.resolve(fn());
                    } catch (e) {
                        deferred.reject(e);
                        $exceptionHandler(e);
                    }

                    if (!skipApply) $rootScope.$apply();
                };

                timeoutId = $browser.defer(debounced, delay);

                // track id with method
                methods[methodId].timeoutId = timeoutId;

                cleanup = function (reason) {
                    delete deferreds[promise.$$timeoutId];
                };

                promise.$$timeoutId = timeoutId;
                deferreds[timeoutId] = deferred;
                promise.then(cleanup, cleanup);

                return promise;
            }


            // similar to angular's $timeout cancel
            debounce.cancel = function (promise) {
                if (promise && promise.$$timeoutId in deferreds) {
                    deferreds[promise.$$timeoutId].reject('canceled');
                    return $browser.defer.cancel(promise.$$timeoutId);
                }
                return false;
            };

            return debounce;
        }])
.service("StudyService", ["$http", "$rootScope", '$stateParams', "getDataSource", "CommonService", function ($http, $rootScope, $stateParams, getDataSource, CommonService) {
    return {
        getStudyData: function (data, success, error) {
            return $http.post("../api/studentstudy", JSON.stringify(data)).success(function (data) {
                success(data);
            }).error(function (errortemp) {
                error(errortemp);
            });
        },
        getStuSignStatus: function () {
            var data = { classid: $rootScope.user.classId, accountid: $rootScope.user.accountId };
            return $http.post("../api/GetStuSignStatus", JSON.stringify(data)).success(function (datatemp) {
                var stuobj = datatemp;
                $rootScope.user.signstatus = stuobj.signstatus;
            }).error(function (errortemp) {

            });
        },
        updateStudyStatus: function (param) {
            //param={ type:"",typeValue:"" }type=1更新视频状态，type=2更新考试状态，type=3更新学后感状态
            var self = this;
            var p = {
                classcourseid: $stateParams.classcourseid,
                coursewareid: $stateParams.coursewareid,
                studentid: $rootScope.user.studentId,
                classid: $rootScope.user.classId,
                accountid: $rootScope.user.accountId
            };
            param = _.merge(p, param);
            return $http.post("../api/updatestudystatus", JSON.stringify(param)).success(function (datatemp) {
                var obj = datatemp;

                if (datatemp.result) {
                    self.updateStudentStudyStatus(param);
                }
            }).error(function (errortemp) {
                CommonService.error(errortemp);
            });
        },
        updateStudentStudyStatus: function (param) {

            return $http.post("../api/updatestudentstudystatus", JSON.stringify(param)).success(function (datatemp) {
                var obj = datatemp;
            }).error(function (errortemp) {
                CommonService.error(errortemp);
            });
        }
    }
}])
.service("CookieService", ["$rootScope", function ($rootScope) {
    return {
        get: function (name) {
            return $.cookie(name);
        },
        remove: function (name) {
            return $.cookie(name,null);
        },
        save: function (name, value, options) {
            var setting = {
                expires: 7,
                path: '/'
            };
            $.extend(setting, options);
            $.cookie(name, value, setting);
        }
    }
}])
;