angular.module('app.factory', [])
.factory('myfactory', function ($state, $ionicSideMenuDelegate) {
    return {
        goMain: function (text) {
            alert(window.localStorage.AppConfig.hasMain);
            if (window.localStorage.AppConfig.hasMain) {
                $state.go("app.index");
            }
            else {
                $ionicSideMenuDelegate.toggleLeft();
            }
        }
    }
})

.factory('$dateService', function () {
    function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments));
    }
    var formatType = 'standard';
    var dates = {
        "zh-CN": {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今日",
            format: "yyyy年mm月dd日",
            weekStart: 1,
            meridiem: []
        }

    }
    var DPGlobal = {
        modes: [
			{
			    clsName: 'days',
			    navFnc: 'Month',
			    navStep: 1
			},
			{
			    clsName: 'months',
			    navFnc: 'FullYear',
			    navStep: 1
			},
			{
			    clsName: 'years',
			    navFnc: 'FullYear',
			    navStep: 10
			}],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        parseFormat: function (format, type) {
            type = type || formatType;
            var separators = format.replace(this.validParts(type), '\0').split('\0'),
                 parts = format.match(this.validParts(type));
            if (!separators || !separators.length || !parts || parts.length == 0) {
                throw new Error("Invalid date format.");
            }
            return { separators: separators, parts: parts };
        },
        validParts: function (type) {
            if (type == "standard") {
                return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
            } else if (type == "php") {
                return /[dDjlNwzFmMnStyYaABgGhHis]/g;
            } else {
                throw new Error("Invalid format type.");
            }
        },
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
    }
    return {
        //格式化日期
        format: function (date, format, language, type) {
            type = type || formatType;
            language = language || "zh-CN";
            if (date == null) {
                return '';
            }
            format = DPGlobal.parseFormat(format, type);
            var val;
            if (type == 'standard') {
                val = {
                    // year
                    yy: date.getFullYear().toString().substring(2),
                    yyyy: date.getFullYear(),
                    // month
                    m: date.getMonth() + 1,
                    M: dates[language].monthsShort[date.getMonth()],
                    MM: dates[language].months[date.getMonth()],
                    // day
                    d: date.getDate(),
                    D: dates[language].daysShort[date.getDay()],
                    DD: dates[language].days[date.getDay()],
                    p: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getHours() < 12 ? 0 : 1] : ''),
                    // hour
                    h: date.getHours(),
                    // minute
                    i: date.getMinutes(),
                    // second
                    s: date.getSeconds()
                };
                val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
                val.HH = (val.H < 10 ? '0' : '') + val.H;
                val.P = val.p.toUpperCase();
                val.hh = (val.h < 10 ? '0' : '') + val.h;
                val.ii = (val.i < 10 ? '0' : '') + val.i;
                val.ss = (val.s < 10 ? '0' : '') + val.s;
                val.dd = (val.d < 10 ? '0' : '') + val.d;
                val.mm = (val.m < 10 ? '0' : '') + val.m;
            }
            else {
                throw new Error("Invalid format type.");
            }
            var date = [],
				seps = $.extend([], format.separators);
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                if (seps.length)
                    date.push(seps.shift())
                date.push(val[format.parts[i]]);
            }
            return date.join('');
        },
        //日期字符转日期对象
        parse: function (date, format, language, type) {
            type = type || formatType;
            language = language || "zh-CN";
            if (date instanceof Date) {
                var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
                dateUTC.setMilliseconds(0);
                return dateUTC;
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
                format = DPGlobal.parseFormat('yyyy-mm-dd', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
                format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}:\d{1,2}(\.\d{1,3})?$/.test(date)) {
                format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii:ss', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
                format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii:ss', type);
            }
            var parts = date && date.match(DPGlobal.nonpunctuation) || [],
				date = new Date(0, 0, 0, 0, 0, 0, 0),
				parsed = {},
				setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
				setters_map = {
				    hh: function (d, v) { return d.setHours(v); },
				    h: function (d, v) { return d.setHours(v); },
				    HH: function (d, v) { return d.setHours(v == 12 ? 0 : v); },
				    H: function (d, v) { return d.setHours(v == 12 ? 0 : v); },
				    ii: function (d, v) { return d.setMinutes(v); },
				    i: function (d, v) { return d.setMinutes(v); },
				    ss: function (d, v) { return d.setSeconds(v); },
				    s: function (d, v) { return d.setSeconds(v); },
				    yyyy: function (d, v) { return d.setFullYear(v); },
				    yy: function (d, v) { return d.setFullYear(2000 + v); },
				    m: function (d, v) {
				        v -= 1;
				        while (v < 0) v += 12;
				        v %= 12;
				        d.setUTCMonth(v);
				        while (d.getMonth() != v)
				            d.setDate(d.getDate() - 1);
				        return d;
				    },
				    d: function (d, v) { return d.setDate(v); },
				    p: function (d, v) { return d.setHours(v == 1 ? d.getHours() + 12 : d.getHours()); }
				},
				val, filtered, part;
            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
            setters_map['dd'] = setters_map['d'];
            setters_map['P'] = setters_map['p'];
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                val = parseInt(parts[i], 10);
                part = format.parts[i];
                if (isNaN(val)) {
                    switch (part) {
                        case 'MM':
                            filtered = $(dates[language].months).filter(function () {
                                var m = this.slice(0, parts[i].length),
                                    p = parts[i].slice(0, m.length);
                                return m == p;
                            });
                            val = $.inArray(filtered[0], dates[language].months) + 1;
                            break;
                        case 'M':
                            filtered = $(dates[language].monthsShort).filter(function () {
                                var m = this.slice(0, parts[i].length),
                                    p = parts[i].slice(0, m.length);
                                return m == p;
                            });
                            val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                            break;
                        case 'p':
                        case 'P':
                            val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                            break;
                    }
                }
                parsed[part] = val;
            }
            for (var i = 0, s; i < setters_order.length; i++) {
                s = setters_order[i];
                if (s in parsed && !isNaN(parsed[s]))
                    setters_map[s](date, parsed[s])
            }
            return date;
        }
    }

})
.factory("downService", function ($rootScope, $state, $http, Restangular, $ionicPopup, $ionicPlatform) {
    return {
        //Cordova下载:
        cordovaDown: function localFile(fileUrl, fileName) {
            function downloadFile(sourceUrl, targetUrl, fileName) {
                $rootScope.baifenbi = 0;
                var myPopup = $ionicPopup.show({
                    template: '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="{{baifenbi}}" aria-valuemin="0" aria-valuemax="100" style="width:{{baifenbi}}%"><span class="sr-only">{{baifenbi}}%</span></div></div>',
                    title: '下载文件',
                    subTitle: '',
                    scope: $rootScope,
                    buttons: [

                    ]
                });
                var fileTransfer = new FileTransfer();
                var uri = encodeURI(sourceUrl);
                fileTransfer.onprogress = function (progressEvent) {
                    if (progressEvent.lengthComputable) {
                        //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                        $rootScope.baifenbi = (progressEvent.loaded / progressEvent.total) * 100;
                        //alert(progressEvent.loaded / progressEvent.total);
                    } else {

                        //loadingStatus.increment();
                    }
                };
                if (fileName) {
                    targetUrl = targetUrl.substr(0, targetUrl.lastIndexOf("/") + 1) + fileName;
                }
                var ishttps = false;
                if (uri.toUpperCase().indexOf("HTTPS") > -1) {
                    ishttps = true;
                }
                fileTransfer.download(
                uri, targetUrl, function (entry) {
                    $rootScope.baifenbi = 100;
                    myPopup.close();
                    cordova.plugins.disusered.open(targetUrl, function () { }, function () {
                        alert('没有找到文件');
                    }, function () { });
                }, function (error) {
                    myPopup.close();
                    alert("下载文件出错");
                }, ishttps);
            }

            if ($rootScope.fromweixin) {
                //var subFile = fileUrl.substr(fileUrl.lastIndexOf("/") + 1);
                //if (ionic.Platform.isIOS()) {
                //    $state.go("app.iosfile", { url: fileUrl })
                //    //window.open(fileUrl, '_blank', 'location=no,enableviewportscale=yes, closebuttoncaption=close');
                //}
                //else {
                //    window.location.href = fileUrl;
                //}
                window.location.href = fileUrl;
                //window.open(fileUrl, '_blank', 'location=no,enableviewportscale=yes, closebuttoncaption=close');
            }
            else if (ionic.Platform.isIOS()) {
                var subFile = fileUrl.substr(fileUrl.lastIndexOf("/") + 1);
                //subFile = "/Attach" + Base64.decode(subFile);
                //window.open("../api/getAttach/action/getAttach/" + subFile, "_blank");
                //alert(subFile);
                //xsfHttp.download("http://122.224.203.150:81/CollegeAPPIOS/api/getAttach/action/getAttach/" + subFile, function (data) {
                //        alert(data)
                //}, function (data) {
                //    alert(data)
                //});
                //alert($rootScope.AppConfig.rootPath + "/api/getAttach/action/getAttach/" + subFile);
                //alert($rootScope.AppConfig.rootPath + "/api/getAttach/action/getAttach/" + subFile);
                //window.open($rootScope.AppConfig.rootPath + "/api/getAttach/action/getAttach/" + subFile);
                //xsfWindow.open($rootScope.AppConfig.rootPath + "/api/getAttach/action/getAttach/" + subFile, "", true);
                //xsfWindow.open(fileUrl, "", true);
                window.open(fileUrl, '_blank', 'location=no,enableviewportscale=yes, closebuttoncaption=close');
            }
            else {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                    var _directory = "DreamSoftAppDownload";
                    //var _url = "https://61.139.79.231/collegeapp/APK/test.docx";
                    var _url = fileUrl;
                    var _localFile = _url.substr(_url.lastIndexOf("/") + 1);
                    var newfile = fileSystem.root.getDirectory(_directory, { create: true },
                       function (newfile) {
                           newfile.getFile(_localFile, { create: true }, function (fileEntry) {
                               var targetURL = fileEntry.toURL();
                               downloadFile(_url, targetURL, fileName);
                           }, function () {
                               alert("创建文件失败");
                           });
                       },
                    function () { alert("创建目录出错"); }
                    );
                },
                    function (evt) {
                        alert("文件系统出错");
                    }
                );
            }
        },
        getRootPath: function () {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            //return window.location.protocol + '//' + window.location.host + '/'+ webName + '/';
            return window.location.protocol + '//' + window.location.host + '/' + webName;
        }
    }

})
.factory("cordovaService", function ($rootScope, $state, $http, Restangular, $ionicPopup, downService, $ionicHistory, $templateCache,$timeout) {
    return {
        //退出系统
        exitApp: function () {
            if (1==2) {
                navigator.notification.confirm(
                    "<div style='text-align:center;'>确定要注销账号吗?</div>",  // message
                    function (button) {
                        if (button === 1) {
                            //cordova.plugins.backgroundMode.enable();
                            localStorage.clear();
                            //window.location.href = "http://192.168.1.72/collegeApp/html/index.html";
                            $state.go("login");

                            //navigator.app.exitApp();
                            //ionic.Platform.exitApp();
                        }
                    },            // callback function
                    '注销系统',               // title
                    '确定,取消'                           // confirm 选项，用逗号隔开
                );
            }
            else {
                $ionicPopup.confirm({
                    title: "注销系统",
                    template: "<div style='text-align:center;'>确定要注销账号吗?</div>",
                    buttons: [
                        {
                            text: '取消',
                            type: 'button-stable',
                            onTap: function () {
                            }
                        },
                        {
                            text: '<b>确认</b>',
                            type: 'button-positive',
                            onTap: function () {
                                $rootScope.user = null;
                                localStorage.clear();
                                sessionStorage.clear();
                                $ionicHistory.clearHistory();
                                $ionicHistory.clearCache();
                                $templateCache.removeAll();
                                var loc = window.location.href;
                                $timeout(function () {
                                    window.location.href = loc.substr(0, loc.indexOf("#"));
                                }, 200);
                                $state.go("login");
                            }
                        }
                    ]
                });
            }
        },
        //播放原生视频
        playVideo: function (url) {
            window.plugins.streamingMedia.playVideo(url);
        },
        //原生消息，停留2秒
        toast: function (message) {
            window.plugins.toast.show(message, 'short', 'center');
        },
        //判断APP是否安装
        checkAppInstall: function () {
            if ($rootScope.fromweixin) {
                return;
            }
            appAvailability.check(
                'com.superlib', // URI Scheme
                function () {  // Success callback
                    //window.plugins.launcher.launch({ packageName: 'com.superlib' }, function () { }, function () { });
                    var onecard = sessionStorage.onecard;
                    var loginData = Restangular.one('Gusers/action/getSuperPSD/' + onecard);
                    loginData.get().then(function (data) {
                        if (data != "") {
                            window.plugins.launcher.launch({ uri: "mobilelib://mobilelib/login?unitid=1595&username=" + onecard + "&password=" + data }, function () { }, function () { });
                        }
                    })
                },
                function () {  // Error callback
                    navigator.notification.confirm(
                        '您没有安装超星数字图书馆是否立即下载?',  // message
                        function (button) {
                            if (button === 1) {
                                $http.get("../config/AppConfig.json").then(function (data) {
                                    var nowdata = data.data;
                                    var chaoxing = nowdata.chaoxingHref;
                                    downService.cordovaDown(chaoxing);
                                });

                            }
                        },            // callback function
                        '安装超星',               // title
                        '是,否'                           // confirm 选项，用逗号隔开
                    );
                }
            );
        },
        //主屏推送
        notification: {
            add: function (userid) {
                if ($rootScope.fromweixin) {
                    return;
                }
                if (ionic.Platform.isIOS()) {
                    return;
                }
                var j = 1;

                try {
                    var myService = cordova.plugins.myService;
                    if (myService) {
                        myService.getStatus(function (r) { startService(r) }, function (e) { handleError(e) });
                    }
                } catch (e) {
                    return;
                }

                function startService(data) {
                    if (data.ServiceRunning) {
                        enableTimer(data);
                    } else {
                        if (myService) {
                            myService.startService(function (r) { enableTimer(r) }, function (e) { handleError(e) });
                        }
                    }
                }

                function enableTimer(data) {
                    if (data.TimerEnabled) {
                        if (myService) {
                            myService.enableTimer(30000, function (r) { registerForBootStart(); registerForUpdates(); }, function (e) { handleError(e) });
                        }
                    } else {
                        if (myService) {
                            myService.enableTimer(30000, function (r) { registerForBootStart(); registerForUpdates(); }, function (e) { handleError(e) });
                        }
                    }
                }
                function registerForUpdates() {
                    if (myService) {
                        myService.registerForUpdates(function (r) { getNotice() },
                                                        function (e) { handleError(e) });
                    }
                }
                function getNotice() {
                    if (!window.localStorage.userid) { return; }
                    $http.get("../api/getNotice/" + window.localStorage.userid).then(function (data) {
                        var noticeData = data.data;
                        for (var i = 0; i < noticeData.length; i++) {
                            if (noticeData[i].id != "0") {
                                window.plugin.notification.local.add({
                                    id: noticeData[i].id,
                                    sound: "",
                                    message: noticeData[i].message,
                                    title: noticeData[i].title,
                                    json: noticeData[i].parameters,
                                    autoCancel: true,
                                    ongoing: true
                                });
                            }
                        }
                    });

                    cordova.plugins.notification.local.on("click", function (notification, state) {
                        $http.post("../api/updateNotice/" + window.localStorage.userid + "/" + notification.data);
                    }, this);
                }
                function handleError(data) {
                    alert("Error: " + data.ErrorMessage);
                }

                function registerForBootStart() {
                    if (myService) {
                        myService.registerForBootStart(function (r) { },
                                                            function (e) { handleError(e) });
                    }
                }

                function allDone() {
                    getNotice();
                }

            }
        },
        //拍照
        takePicture: function (success, error) {
            var options = {
                quality: 80,
                targetWidth: 500,
                targetHeight: 500,
                allowEdit: true,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.PNG
            };
            navigator.camera.getPicture(success, error, options);
        },
        //摄像
        takeVideo: function (success, error) {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                mediaType: Camera.MediaType.VIDEO
            };
            navigator.camera.getPicture(success, error, options);
        },
        //上传照片
        upLoadPic: function (fileURL, info_id, win, fail) {
            $http.post("../api/uploadImg", JSON.stringify({ file: fileURL })).success(win);
        },
        //跟新系统
        checkVersion: function () {
            if ($rootScope.fromweixin) {
                return;
            }
            $http.get("../config/AppConfig.json").then(function (data) {
                data = data.data;
                var lastVersion = parseFloat(data.lastVersion);
                cordova.getAppVersion.getVersionNumber().then(function (version) {
                    if (parseFloat(version) < lastVersion) {
                        if (window.confirm("检测到新版本APP，是否立即更新？")) {
                            //window.cordova.plugins.FileOpener.openFile(data.lastAPKHref, function (success) {
                            //}, function (error) {
                            //    alert("下载出现错误");
                            //});
                            downService.cordovaDown(data.lastAPKHref);
                            //$("#myframe").attr("src", "http://192.168.1.72/collegeApp/APK/hello-debug-unaligned.apk");
                            //window.location.href = "http://192.168.1.72/collegeApp/APK/hello-debug-unaligned.apk";
                        }
                    }
                });
            });

        },
        //扫描二维码
        barCodeScan: function () {
            cordova.plugins.barcodeScanner.scan(
               function (result) {
                   //alert("We got a barcode\n" +
                   //      "Result: " + result.text + "\n" +
                   //      "Format: " + result.format + "\n" +
                   //      "Cancelled: " + result.cancelled);
                   return result;
               },
               function (error) {
                   alert("扫描失败: " + error);
               }
            );
        },
        //下载文件
        downFile: function (url) {
            window.cordova.plugins.FileOpener.openFile(url, function (success) {
            }, function (error) {
                alert("下载出现错误");
            });
        },
        cordovaDown: function (url, name) {
            downService.cordovaDown(url, name);
        }

    }
}).factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
        function($rootScope, $browser, $q, $exceptionHandler) {
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
                angular.forEach(methods, function(value, key) {
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

                var debounced = function() {
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

                cleanup = function(reason) {
                    delete deferreds[promise.$$timeoutId];
                };

                promise.$$timeoutId = timeoutId;
                deferreds[timeoutId] = deferred;
                promise.then(cleanup, cleanup);

                return promise;
            }


            // similar to angular's $timeout cancel
            debounce.cancel = function(promise) {
                if (promise && promise.$$timeoutId in deferreds) {
                    deferreds[promise.$$timeoutId].reject('canceled');
                    return $browser.defer.cancel(promise.$$timeoutId);
                }
                return false;
            };

            return debounce;
        }
]);