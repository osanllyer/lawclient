angular.module('starter.controllers')
.controller('ExamPaperCtrl', function($scope, ExamService, $ionicPopup, $log, $state, $timeout, $ionicLoading){
	console.log("exam paper controller enter");

	//进入试卷，提醒试卷类型，时间，分数
    $scope.beginExaming = function(examPaper) {

		  $scope.show = function() {
		    $ionicLoading.show({
		      template: '<p>正在生成试卷，请稍等...</p><ion-spinner></ion-spinner>'
		    });
		  };
		  $scope.hide = function(){
		    $ionicLoading.hide();
		  };

	   	var examPaperDesc = new Array();
	   	examPaperDesc[0] = '试卷1，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[1] = '试卷2，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[2] = '试卷3，时间120分钟，总分150分，总计100题';
	   	examPaperDesc[3] = '试卷4，时间120分钟，总分150分，总计10题';
	    $ionicPopup.confirm({
	    	title : '提示',
	        template: examPaperDesc[examPaper - 1],
	        cancelText : '取消',
	        okText : '开始', 
	        okType : 'button-positive'
	    }).then(function(confirmed) {
	       if(confirmed) {
	       		ExamService.removeExamPaper();
	       		ExamService.genExamPaper();

	       		//延迟显示，否则会导致在插入之前就加载数据，导致无法显示试卷的问题
	       		$scope.generatingExampaper = true;
	       		$scope.show();
	       		$timeout(function(){
	       			$scope.generatingExampaper = false;
	       			$scope.hide();
	       			$state.go('tab.menu.practice.examing', {paper:examPaper});
	       		},1000);

	       } else {
	         //do nothing
	       }
	    });
	};
})
.controller('ExamingCtrl', function($scope, $log, $controller, qidArr, $interval, Common, $state, $ionicHistory){
	$log.debug('examing ctroller enter');
	$controller('BaseExamCtrl', {$scope:$scope, progressQid : null, qidArr : qidArr});
	
	$scope.isExampaper = true;
	//考试时间120分钟
	$scope.restTime = 7200;

	//定义并启动
	$scope.startTimer = function(){
		$scope.leftTimer = $interval(function(){
			$scope.restTime -= 1;
			$scope.restTimeStr = Common.seconds2Time($scope.restTime);
		}, 1000);
	};

	$scope.$on('$ionicView.enter', function(event, data){
		$scope.startTimer();
	});

	//退出时提醒是否还有正在进行的考试
	$scope.$on('$ionicView.beforeLeave', function(event, data){
		$scope.stopTimer();
	});

	//停止计时
	$scope.stopTimer = function(){
		if(angular.isDefined($scope.leftTimer)){
			$interval.cancel($scope.leftTimer);
		}
	};


	//交卷
	$scope.submitExampaper = function(){
		//停止计时
		$scope.stopTimer();
		//跳转到考试结果页面
		$ionicHistory.nextViewOptions({
    		disableBack: true
  		});
		$state.go('tab.menu.practice.examresult', {});
	};

	$scope.init();
	$scope.loadQuestion();
})
;