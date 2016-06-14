angular.module('starter.controllers')
.controller('DairyCtrl', function($scope, $log, DairyService, Common){

	$scope.selected = {};

	//今天
	$scope.selected.date = new Date().toJSON().slice(0,10);
	$scope.selected.data = [0, 0];
	$scope.selected.lables = ['正确', '错误'];
	$scope.week = {};
	// $scope.week.labels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	$scope.week.labels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];



	//检测日期变化
	$scope.dateChange = function(selectedDate){
		$scope.selected.date = selectedDate;
		var week = Common.weekDate(selectedDate);
		$scope.week.dateRange = [week.start, week.end];
		$scope.week.series = ['总数', '正确数']

		var weekDays = Common.weedDays(selectedDate);
	
		//刷新选择的日期等数据
		var datePromise = DairyService.getDateStatistics(selectedDate);
		datePromise.then(
			function(data){
				$log.debug(JSON.stringify(data));
				if(data){
					$scope.selected.data = [];
					$scope.selected.data.push(angular.isUndefined(data.correctNum) ? 0 : data.correctNum);
					$scope.selected.data.push(angular.isUndefined(data.correctNum) ? data.total - 0 : data.total - data.correctNum);
				}else{
					$scope.selected.data = [0,0];
				}
			}, 
			function(error){
				$log.debug(JSON.stringify(error));
			}
		);
		//刷新选择的week的数据
		var weekPormise = DairyService.getWeekStatistics(selectedDate);
		weekPormise.then(
			function(data){
				// $log.debug('week data,', data);
				if(data){

					$scope.week.data = [];
					var dataTotal = new Array(7);
					Common.fillArray(dataTotal, 0);
					var dataCorrect = new Array(7);
					Common.fillArray(dataCorrect, 0);
					//如果当天没有数据，就会导致缺少一天的数据，需要补0
					for(var idx in data){
						var tmpDate = new Date(data[idx].date);
						var diff = tmpDate.getDay();
						dataTotal[diff] = data[idx].total;
						dataCorrect[diff] = data[idx].correctNum;
					}
					//显示两条曲线,一条总数，一条正确
					$scope.week.data.push(dataTotal);
					$scope.week.data.push(dataCorrect);
					$log.debug('week data', JSON.stringify($scope.week.data));
				}
			}, 
			function(error){
				$log.debug('week data error', JSON.stringify(error));
			}
		);

		//点击周统计表单
		$scope.weekChartClick = function(){

		};
	};

	//初始化为今天
	$scope.$on('$ionicView.beforeEnter', function(event, data){
		$scope.dateChange($scope.selected.date);
	});
});