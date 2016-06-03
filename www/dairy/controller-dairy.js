angular.module('starter.controllers')
.controller('DairyCtrl', function($scope, DairyService, $log){
	// $scope.minDate = '2016-01-01';
	// $scope.maxDate = '2020-01-01';

	$scope.dairy = {};
	$scope.dairy.date = '2015年05月18日';
	$scope.dairy.content = '您今天完成了30道题，正确20道，错误10道，继续加油哦';

	//检测日期变化
	$scope.dateChange = function(){alert('c')};
});