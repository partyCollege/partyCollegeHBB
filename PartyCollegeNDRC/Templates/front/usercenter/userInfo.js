app.controller("userinfoController", ['$scope', '$rootScope', '$document', '$http', '$timeout', '$interval', 'getDataSource', 'DateService', 'FilesService', 'CommonService', 'smsService', 'UserPhotoService', 'Base64'
    , function ($scope, $rootScope, $document, $http, $timeout, $interval, getDataSource, DateService, FilesService, CommonService, smsService, UserPhotoService, Base64) {
        $scope.showAvatar = false;
        $scope.showZJPhoto = false;
        $scope.showIDContainer = false; 
        $scope.uploadTitle = "上传头像";
        $document[0].title = _.find($rootScope.userCenterLinks, { id: "3001" }).title;

        $scope.ischangepwd = false;
        $scope.ischangetel = false;
        $scope.isuserchange = false;


        $scope.getSysCode = function (callback) {

            getDataSource.getUrlData("../api/getsycodes", { categorys: "职级,政治面貌,民族" }, function (data) {

                $scope.politicalArr = _.find(data, { type: "政治面貌" }).list;
                $scope.levelArr = _.find(data, { type: "职级" }).list;
                $scope.nations = _.find(data, { type: "民族" }).list;

                //获取城市数据对象
                $http.get("../config/usercenter-city.json").then(function (data) {
                    $scope.allCity = data.data;

                    if (callback) {
                        callback();
                    }
                })

            }, function (errortemp) { });
        }


        $scope.getSysCode(function () {
            //获取用户对象
            getDataSource.getDataSource("getUserInfo", {
                studentid: $rootScope.user.studentId,
            }, function (data) {
                var _data = data[0];
            	//模糊身份证号码和手机号码 

                _data.telphone = _.fill(_data.cellphone.split(''), '*', 3, 7).join('');
                //组装照片
                if (_data.photo_servername) {
                    _data.photo = FilesService.getUserPhoto();
                    _data.photoObj = _data.photo;
                } else {
                    _data.defaultphoto = "../img/default_img.png";
                }
                $scope.userinfo = _data;
                //备份原始数据，用于恢复原始数据
                $scope.sourceUserInfo = angular.copy(_data);
            });
        });

        //监控下拉框值变动
        $scope.$watch("userinfo.provice", function (newVal) {

            if (newVal && $scope.allCity) {
                $scope.currentCities = _.filter($scope.allCity, { name: newVal })[0].city;
                $scope.currentCounties = [];
                if ($scope.isuserchange) {
                    $scope.userinfo.city = $scope.currentCities[0].name;
                }
            }
        });
        //监控下拉框值变动
        $scope.$watch("userinfo.city", function (newVal) {

            if (newVal && $scope.currentCities) {
                $scope.currentCounties = _.filter($scope.currentCities, { name: newVal })[0].area;
                if ($scope.isuserchange) {
                    $scope.userinfo.area = $scope.currentCounties[0];
                }
            }
        });




        $scope.userInfoEdited = true;
        $scope.workPlaceEdited = true;
        //控制是否编辑
        $scope.editedClick = function (type) {
            $scope.showIDContainer = !$scope.showIDContainer;
            if (type == 1) {
                $scope.workPlaceEdited = !$scope.workPlaceEdited;
                if ($scope.workPlaceEdited) {
                    $scope.userinfo = angular.copy($scope.sourceUserInfo);
                    $scope.isuserchange = false;
                }
            } else if (type == 0) {
                $scope.userInfoEdited = !$scope.userInfoEdited;
                if ($scope.userInfoEdited) {
                    $scope.userinfo = angular.copy($scope.sourceUserInfo);
                }
            }
        }

        //下拉框是否变动
        $scope.userChanged = function () {
            $scope.isuserchange = true;
        }


        $scope.pwdObj = { sourcepassword: "", password: "", confirmpassword: "", message: "" };
        $scope.telObj = { accountid: $rootScope.user.accountId, telphone: "", syscode: "", inputcode: "", message: "" };
        $scope.btnVerifyCode = "获取验证码";
        $scope.isVerifyCode = true;
        $scope.isChangePwd = false;
        $scope.isChangeTel = false;

        //弹框-修改密码
        $scope.pwdDialogClick = function (flag) {

            $scope.isChangePwd = flag;

            if (!flag) {
                $scope.pwdObj = { sourcepassword: "", password: "", confirmpassword: "", message: "" };
            }

        }

        //弹框-修改手机号码
        $scope.telDialogClick = function (flag) {

            $scope.isChangeTel = flag;

            if (!flag) {
                $scope.telObj = { accountid: $rootScope.user.accountId, telphone: "", code: "" };
                $scope.btnVerifyCode = "获取验证码";
                $scope.isVerifyCode = true;
                $interval.cancel($scope.timer);
            }
        }


        //发送验证码
        $scope.verifyCodeClick = function () {
             
            $scope.updateCellPhoneErrorStyle.reset();

            if ($scope.telObj.telphone.trim().length != 11) { 
                $scope.updateCellPhoneErrorStyle.idx[0] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机号码格式不正确";
                return;
            }

            getDataSource.validateCode($scope.telObj.verifycode, "forgotpwdcode"
            , function () {

                $scope.isVerifyCode = false;

                getDataSource.getUrlData("../api/getSMSCode", { phone: $scope.telObj.telphone, keyname: "forgotpwdsmscode" }, function (datatemp) {
                    if (datatemp.code == "success") {
                        //alert("发送成功");
                    }
                }, function (errortemp) { });

                var i = 90;
                var ptime;
                $scope.timer = $interval(function () {
                    i--;
                    $scope.btnVerifyCode = i + "秒之后重新发送";
                    $scope.isVerifyCode = false;

                    if (i == 0) {
                        $scope.isVerifyCode = true;
                        $scope.btnVerifyCode = "重新获取验证码";
                        $interval.cancel($scope.timer);
                    }
                }, 1000);

            }
            , function () {
                $scope.changeRegVerifyCode();
                $scope.updateCellPhoneErrorStyle.idx[1] = true;
                $scope.updateCellPhoneErrorStyle.message = "验证码不正确";
            });

        }



        //修改密码
        $scope.modifyPwdDisabled = false;
        $scope.modifyPwd = function () {
            $scope.modifyPwdDisabled = true;
            var param = {
                accountid: $rootScope.user.accountId,
                sourcepassword: Base64.encode($scope.pwdObj.sourcepassword),
                confirmpassword: Base64.encode($scope.pwdObj.confirmpassword),
                password: Base64.encode($scope.pwdObj.password)
            };


            getDataSource.getUrlData("../api/changepassword", param, function (data) {
                $scope.modifyPwdDisabled = false;
                CommonService.alert(data);
                if (data.result) {
                    $scope.pwdDialogClick(false);
                    getDataSource.writeLog("操作-登录密码修改", "20019");
                }
            }, function (errortemp) {
                $scope.modifyPwdDisabled = false;
                CommonService.error(errortemp);
            });
        }

        $scope.updateCellPhoneBtnDisabled = false;

        //修改错误消息
        $scope.updateCellPhoneErrorStyle = {
            idx: [false, false, false], message: "", reset: function () {
                this.idx = [false, false, false];
            }
        };


        //修改手机号码
        $scope.modifyTel = function () {
            $scope.updateCellPhoneBtnDisabled = true;
            $scope.updateCellPhoneErrorStyle.reset();
            if ($scope.telObj.telphone.trim().length == 0) { 
                $scope.updateCellPhoneErrorStyle.idx[0] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机号码不能为空";
                $scope.updateCellPhoneBtnDisabled = false;
                return;
            }

            if ($scope.telObj.inputcode.trim().length == 0) { 
                $scope.updateCellPhoneErrorStyle.idx[2] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机验证码不能为空";
                $scope.updateCellPhoneBtnDisabled = false;
                return;
            }

            
            getDataSource.validateCode($scope.telObj.inputcode, "forgotpwdsmscode", function () {

                var p = {
                    accountid: $rootScope.user.accountId, studentid: $rootScope.user.studentId,
                    cellphone1: $scope.telObj.telphone, cellphone2: $scope.telObj.telphone
                };
                getDataSource.getDataSource("getMYDES_ENCRYPT_More_Cellphone", p, function (data) {

                	p.cellphone1 = data[0].cellphone1;
                	p.cellphone2 = data[0].cellphone2;

                	getDataSource.getDataSource("usercenter-changetel", p, function (data) {
                		if (data.length > 0 && data[0].crow > 1) {
                			$scope.userinfo.telphone = _.fill($scope.telObj.telphone.split(''), '*', 3, 7).join('');
                			$scope.telDialogClick(false);
                			CommonService.alert("手机号码修改成功");
                			$scope.updateCellPhoneBtnDisabled = false;
                			getDataSource.writeLog("操作-手机号码修改", "20019");
                		} else {
                			CommonService.alert("手机号码修改失败");
                			$scope.updateCellPhoneBtnDisabled = false;
                		}
                	}, function (error) {
                		CommonService.error(error);
                		$scope.updateCellPhoneBtnDisabled = false;
                	});
                }, function (error) {

                });

               

            }, function () {
                $scope.updateCellPhoneErrorStyle.idx[2] = true;
                $scope.updateCellPhoneErrorStyle.message = "手机验证码输入不正确";
                $scope.updateCellPhoneBtnDisabled = false;
            });

            
        }

        //保存
        $scope.saveInfoDisabled = false;
        $scope.submit = function (type) {
            $scope.saveInfoDisabled = true;

            if (!$scope.userInfoEdited && type == 0) {

                var param = {
                    sex: $scope.userinfo.sex,
                    nation: $scope.userinfo.nation,
                    political: $scope.userinfo.political,
                    rank: $scope.userinfo.rank,
                    positions: $scope.userinfo.positions,
                    email: $scope.userinfo.email,
                    studentid: $scope.user.studentId
                };

                getDataSource.getDataSource("updateUserInfoBaseInfo", param,
                function (data) {
                    $scope.saveInfoDisabled = false;
                    $scope.sourceUserInfo = angular.copy($scope.userinfo);
                    $scope.userInfoEdited = true;
                    CommonService.alert("保存基本信息成功！");
                    getDataSource.writeLog("操作-基本信息修改", "20019");
                },
                function (e) {
                    $scope.saveInfoDisabled = false;
                    CommonService.alert("保存基本信息失败！");
                });
            } else if (!$scope.workPlaceEdited && type == 1) {

                var param = {
                    provice: $scope.userinfo.provice,
                    city: $scope.userinfo.city,
                    area: $scope.userinfo.area,
                    company: $scope.userinfo.company,
                    companyaddress: $scope.userinfo.companyaddress,
                    officetel: $scope.userinfo.officetel,
                    studentid: $scope.user.studentId
                };
                getDataSource.getDataSource("updateUserInfoCompanyInfo", param, function (data) {
                    $scope.sourceUserInfo = angular.copy($scope.userinfo);
                    $scope.workPlaceEdited = true;
                    CommonService.alert("保存单位信息成功！");
                    $scope.saveInfoDisabled = false;
                    getDataSource.writeLog("操作-单位信息修改", "20019");
                }, function (e) {
                    CommonService.alert("保存单位信息失败！");
                    $scope.saveInfoDisabled = false;
                });
            }
        }

        //弹出上传证件照弹框
        $scope.showZJpopup = false;
        $scope.showZJPhotoBox = function (flag) {
            $scope.showZJpopup = !$scope.showZJpopup;
            if (flag)
                $scope.uploadTitle = "上传证件照";
            else
                $scope.uploadTitle = "上传头像";
        };

        //注册验证码
        $scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
        $scope.changeRegVerifyCode = function () {
            $scope.regVerifyCodeSrc = "../api/VerifyCode/forgotpwdcode/" + new Date().getTime();
        }

        $scope.showAvatarUpload = function () {
            if ($("#showAvatarDiv").css("display") == "none") {
                $("#showAvatarDiv").css("display", "block");
            }
            else {
                $("#showAvatarDiv").css("display", "none");
            }

        }
        $timeout(function () {
            var swf = new fullAvatarEditor("../bower_components/fullAvatarEditor-2.3/fullAvatarEditor.swf", "../bower_components/fullAvatarEditor-2.3/expressInstall.swf", "swfContainer", {
                id: "swf",
                upload_url: "../api/uploadAvatar/userPhoto",
                method: "post",
                tab_visible: false,
                src_upload: 1,
                tab_active: "upload",
                avatar_sizes: "80*80",
                avatar_sizes_desc: "80*80像素",
                src_size: "1MB",
                src_size_over_limit: "文件大小超出限制（1MB）\n请重新上传",
                browse_tip: "仅支持JPG、JPEG、GIF、PNG格式的图片文件\n文件不能大于1MB"
            }, function (msg) {
                if (msg.code == 5) {
                    $scope.showAvatar = false;
                    $scope.userinfo.photoObj = FilesService.showFile("userPhoto", msg.content.avatarUrls, msg.content.avatarUrls);

                    var param = { studentid: $rootScope.user.studentId, idphoto: msg.content.avatarUrls, thumbname: msg.content.avatarUrls };

                    getDataSource.getDataSource("updateUserInfoHeadImage", param, function (data) {

                        CommonService.alert("修改图像成功！"); 
                        getDataSource.changeUserPhoto(msg.content.avatarUrls, msg.content.avatarUrls);
                    }, function (e) {
                        CommonService.alert("修改图像失败！");
                    });
                    getDataSource.writeLog("操作-头像修改", "20019");

                    $scope.$apply();
                    $("#showAvatarDiv").css("display", "none");
                }
            }
            );
            
        }, 1000);


        $scope.validation = {
            confirmpassword: {
                message: "",
                valid: false,
                comfirm: function (password1, password2) {
                    if (password1 != password2) {
                        this.message = "两次输入密码不一致";
                        this.valid = false;
                    } else {
                        this.message = "";
                        this.valid = true;
                    }
                },
                reset: function () {
                    this.message = "";
                }
            },
            validtelphone: {
                message: "",
                valid: false,
                remotetelphone: function (oldtel, newtel) {
                    if (oldtel == newtel) {
                        this.valid = false;
                        this.message = "新手机号码不能和原手机号码一样";
                    } else {
                        this.message = "";
                        var self = this;
                        getDataSource.getDataSource("usercenter-telphone-valid", { cellphone: newtel }, function (data) {
                            if (data.length>0 && data[0].count > 0) {
                                self.valid = false;
                                self.message = "新手机号码已经存在";
                            } else {
                                self.valid = true;
                                self.message = "";
                            }
                        }, function (error) {
                            CommonService.error(error);
                        });
                    }
                },
                reset: function () {
                    this.message = "";
                }
            }


        };

    }])
