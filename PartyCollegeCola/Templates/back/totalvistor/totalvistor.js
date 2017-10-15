angular.module("myApp")
.controller("totalvistorController", ['$scope', '$rootScope', '$state', '$http', '$timeout', '$document', 'notify', 'getDataSource', 'DateService', 'CommonService',
	function ($scope, $rootScope, $state, $http, $timeout, $document, notify, getDataSource, DateService, CommonService) {
		//日志统计图
		var categoryArray = [];
		var seriesData = [];
		var array = ["getlogchartdata"];
		$scope.search = {};
		getDataSource.getConnKeyList(array, { platformid: $rootScope.user.platformid}
				, null
				, null, null, { connectionKey: "LogConnectionString" }
				, function (data) {
					//console.log(data);
			var length = data.length;
			var seriesdata = new Object();
			seriesdata.name = "访问";
			seriesdata.data = [];
			for (var i = 0; i < length; i++) {
				categoryArray.push(data[i].itemname);
				seriesdata.data.push(data[i].totalnum);
			}
			seriesData.push(seriesdata);
			$scope.chartOnlineUserConfig = {
				options: { chart: { type: 'bar' } },
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 80,
					floating: true,
					borderWidth: 1,
					backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
					shadow: true
				},
				xAxis: {
					categories: categoryArray, title: {
						text: null
					}
				},
				yAxis: {
					min: 0,
					title: { text: '访问人次', align: 'high' },
					labels: {
						overflow: 'justify'
					}
				},
				series: seriesData,
				title: { text: '访问统计' },
				tooltip: { valueSuffix: ' 人次' },
				credits: { enabled: false },
				loading: false,
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true
						}
					}
				}
			};
		}, function (error) {
			//console.log(error);
		});
}]);