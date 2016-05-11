angular.module('starter.controllers.exampaper', ['ngCordova', 'chart.js'])
.controller('ExamPaperCtrl', function($scope, ExamDao, $ionicPopup, $log){
	console.log("exam paper controller enter");

	//进入试卷，提醒试卷类型，时间，分数
    $scope.beginExaming = function(examPaper) {
	   	var examPaperDesc = new Array();
	   	examPaperDesc[0] = '试卷1，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[1] = '试卷2，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[2] = '试卷3，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[3] = '试卷4，时间120分钟，总分150分，总计10题';
	    var confirmPopup = $ionicPopup.confirm({
	    	title : '提示',
	        template: examPaperDesc[examPaper - 1],
	        scope : $scope,
	        buttons : [
	        	{text : '取消'},
	        	{text : '开始', type : 'button-positive'}
	        ]
	    });
	    confirmPopup.then(function(confirmed) {
	       if(confirmed) {
	       		ExamDao.removeExamPaper();
	       		ExamDao.genExamPaper();
	       		$state.go('tab.menu.practice.examing', {paper:examPaper});
	       } else {
	         //do nothing
	       }
	    });
	};
})
.controller('ExamingCtrl', function($scope, $log){
	$log.debug('examing ctroller enter');
})
;