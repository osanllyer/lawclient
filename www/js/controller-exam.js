angular.module('starter.controllers.exampaper', ['ngCordova', 'chart.js'])
.controller('ExamPaperCtrl', function($scope, ExamDao, $ionicPopup, $log){
	console.log("exam paper controller enter");

	//提醒用户重新开始了，清除了原来的数据
   $scope.showConfirmProgress = function() {
     var confirmPopup = $ionicPopup.confirm({
        template: '您目前有正在进行的考试，是否继续?'
     });
     confirmPopup.then(function(res) {
       if(res) {
       } else {
         ExamDao.genExamPaper();
       }
     });
    };

	//进入试卷，提醒试卷类型，时间，分数
    $scope.showConfirmBeginExaming = function(examPaper) {
	   	var examPaperDesc = new Array();
	   	examPaperDesc[0] = '试卷1，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[1] = '试卷2，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[2] = '试卷3，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[3] = '试卷4，时间120分钟，总分150分，总计10题';
	    var confirmPopup = $ionicPopup.confirm({
	        template: examPaperDesc[examPaper - 1]
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

	var progressPromise = ExamDao.checkExamProgress();
	progressPromise.then(
		function(data){
			if(data){
				console.log("check progress exam:" , data);
				$scope.inProgress = true;
				if(inProgress){

				}
			}else{
				$scope.inProgress = false;
			}
		},
		function(error){$log.debug(error);}
	);

	   $scope.showConfirm();
})
.controller('ExamingCtrl', function($scope, $log){
	$log.debug('examing ctroller enter');

})
;