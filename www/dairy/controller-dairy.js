angular.module('starter.controllers')
.controller('DairyCtrl', function($scope, $log, DairyService, Common){

	DairyService.getWeekStatistics();

	$scope.selected = {};

	//今天
	$scope.selected.date = new Date().toJSON().slice(0,10);
	$scope.selected.data = {total:0, correct:0};

	$scope.week = {};


	//检测日期变化
	$scope.dateChange = function(selectedDate){
		$scope.selected.date = selectedDate;
		var week = Common.weekDate(selectedDate);
		$scope.week.dateRange = [week.start, week.end];

	
		//刷新选择的日期等数据
		var datePromise = DairyService.getDateStatistics(selectedDate);
		datePromise.then(
			function(data){
				$log.debug(JSON.stringify(data));
				if(data){
					$scope.selected.data.total = data.total;
					$scope.selected.data.correct = data.correctNum;
				}else{
					$scope.selected.data.total = 0;
					$scope.selected.data.correct = 0;
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
				$log.debug('week data,', data);
				if(data){
					$scope.week.data = data;
					//标题
				}
			}, 
			function(error){
				$log.debug(JSON.stringify(error));
			}
		);
	};

	//初始化为今天
	$scope.dateChange($scope.selected.date);
});