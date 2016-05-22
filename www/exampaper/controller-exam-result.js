angular.module('starter.controllers')
.controller('ExamResultCtrl', function($scope, $log, resultList, $ionicHistory){
	$log.debug('ExamResultCtrl enter');

	//结束考试，跳回试卷选择页面
	$scope.finishExam = function(){
		//距离试卷选择界面2
		$ionicHistory.goBack(-2);
	};
});