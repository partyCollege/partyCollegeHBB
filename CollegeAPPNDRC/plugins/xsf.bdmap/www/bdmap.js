cordova.define("xsf.bdmap", function(require, exports, module) {
	function onSucceed(args){
		alert("succeed:" + args);
	}
	
	function onError(err){
		alert("error:" + err);
	}
	
	function call(callee,args,succeedCallback,errorCallback){
		onSucceed = succeedCallback || onSucceed;
        onError = errorCallback || onError;
		exec(onSucceed,onError, "BDMapPlugin", callee,args);
	}
	
	var exec = require('cordova/exec');
	module.exports = {
		openMultiRoutePlan : function(url,isWebViewVisible,onSucceed,onError){
			call('openMultiRoutePlan',[url , isWebViewVisible],onSucceed,onError);
        },loadMultiRoutePlan : function(data,onSucceed,onError){
			call('loadMultiRoutePlan',[data],onSucceed,onError);
        },loadCurrentPosition : function(onSucceed,onError){
			call('loadCurrentPosition',[],onSucceed,onError);
        },getCurrentPosition : function(onSucceed,onError){
			call('getCurrentPosition',[],onSucceed,onError);
		},loadAddressByPosition : function(lat, lng,onSucceed,onError){
			call('loadAddressByPosition',[lat, lng],onSucceed,onError);
        },getAddressByPosition : function(lat, lng,onSucceed,onError){
			call('getAddressByPosition',[lat, lng],onSucceed,onError);
        },openAddressByPostion : function(lat, lng,onSucceed,onError){
			call('openAddressByPosition',[lat, lng],onSucceed,onError);
        },loadPositionByAddress : function(data, onSucceed,onError){
			call('loadPositionByAddress',[data],onSucceed,onError);
        },getPositionByAddress : function(data, onSucceed,onError){
			call('getPositionByAddress',[data],onSucceed,onError);
        },openPositionByAddress : function(data,onSucceed,onError){
			call('openPositionByAddress',[data],onSucceed,onError);
        },openBaseMap : function(url,isWebViewVisible,onSucceed,onError){
			call('openBaseMap',[url,isWebViewVisible],onSucceed,onError);
        },setPoint : function(data,onSucceed,onError){
			call('setPoint',[data],onSucceed,onError);
        },searchPOI : function(onSucceed,onError){
			call('searchPOI',[],onSucceed,onError);
        },getSearchPOI : function(onSucceed,onError){
			call('getSearchPOI',[],onSucceed,onError);
        },aroundPOI : function(onSucceed,onError){
			call('aroundPOI',[],onSucceed,onError);
        },getAroundPOI : function(onSucceed,onError){
			call('getAroundPOI',[],onSucceed,onError);
        },openSetting : function(onSucceed,onError){
			call('openSetting',[],onSucceed,onError);
        },openOfflineMap : function(onSucceed,onError){
			call('openOfflineMap',[],onSucceed,onError);
        },routePlan : function(type, startLat, startLng, endLat, endLng, onSucceed,onError){
			call('routePlan',[type, startLat, startLng, endLat, endLng],onSucceed,onError);
        },getRoutePlan : function(type, startLat, startLng, endLat, endLng, onSucceed,onError){
			call('getRoutePlan',[type, startLat, startLng, endLat, endLng],onSucceed,onError);
        },loadInspectionPoint : function(data, onSucceed,onError){
			call('loadInspectionPoint',[data],onSucceed,onError);
        },openInspectionPoint : function(isWebViewVisible, data, onSucceed,onError){
			call('openInspectionPoint',[isWebViewVisible, data],onSucceed,onError);
        },openNavigator : function(data, onSucceed,onError){
			call('openNavigator', [data] ,onSucceed,onError);
        },setOptions : function(type,state, onSucceed,onError){
			call('setOptions', [type,state] ,onSucceed,onError);
        }
	};
});
