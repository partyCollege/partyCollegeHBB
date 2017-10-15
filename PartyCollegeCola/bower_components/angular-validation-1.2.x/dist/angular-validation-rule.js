(function() {
    angular.module('validation.rule', ['validation'])
        .config(['$validationProvider',
            function($validationProvider) {

            	var expression = {
            		required: function (value) {
            			return !!value;
            		},
            		url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
            		email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            		number: /^\d+$/,
            		inputzh: /[\u4E00-\u9FA5\uF900-\uFA2D]/,
            		//idcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            		idcard: function (value) {
            			return checkIDCard(value);
            		},
            		cellphone: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/,
            		logname: /^[a-zA-Z]+[a-zA-Z0-9_]{5,18}$/,
            		password: /^[0-9 | A-Z | a-z|*]{8,16}$/,
            		confirmpwd: /^[0-9 | A-Z | a-z|*]{6,16}$/,
            		telphone: /(^\d{3}-\d{8})|(^\d{4}-\d{7})/,
            		partserial: /^[0-9 | A-Z | a-z]{4}$/,
            		smscode: /^\d{6}$/
            	};

                var defaultMsg = {
                	required: {
                		error: '此项为必填项',
                		success: ''
                	},
                	url: {
                		error: 'URL格式不正确',
                		success: ''
                	},
                	email: {
                		error: '邮箱格式不正确',
                		success: ''
                	},
                	number: {
                		error: '请输入数字',
                		success: ''
                	},
                	inputzh: {
                		error: '请输入中文',
                		success: ''
                	},
                	idcard: {
                		error: '身份证格式不正确',
                		success: ''
                	},
                	cellphone: {
                		error: '手机号码格式不正确',
                		success: ''
                	},
                	logname: {
                		error: '登录名格式不正确',
                		success: ''
                	},
                	password: {
                		error: '密码格式不正确',
                		success: ''
                	},
                	confirmpwd: {
                		error: '密码格式不正确',
                		success: ''
                	},
                	telphone: {
                		error: '电话号码格式不正确',
                		success: ''
                	},
                	partserial: {
                		error: '序列号输入不正确',
                		success: ''
                	},
                	smscode: {
                		error: '验证码输入不正确',
                		success: ''
                	}
                };

                $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

            }
        ]);

}).call(this);

//身份证验证
function checkIDCard(idcard) {
	if (idcard == "" || idcard==undefined) {
		return false;
	}
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
}
