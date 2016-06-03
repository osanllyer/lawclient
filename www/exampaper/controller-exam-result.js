angular.module('starter.controllers')
.controller('ExamResultCtrl', function($scope, $log, resultList, $ionicHistory, ExamResultService, $stateParams, Common){
	$log.debug('ExamResultCtrl enter');

	//结束考试，跳回试卷选择页面
	$scope.finishExam = function(){
		//距离试卷选择界面2
		$ionicHistory.goBack(-2);
	};

	//获取考试结果
	var examResultList = ExamResultService.getExamResult();
	$scope.errorQuestionList = new Array();

	examResultList.then(function(data){
		if(data){
			var errorScore = 0;
			for(var idx in data){
				var q = data[idx];
				if(q.examanswer != q.answer){
					//答案错误
					switch(q.type){
						case 1:
							errorScore += 1;
							break;
						case 2,3:
							errorScore += 2;
							break;
					}
					$scope.errorQuestionList.push(q.qid);
				}
			}
			//总分减去错误分数
			$scope.score = 150 - errorScore;
		}
	}, function(error){$log.debug(error)});

	//用时
	$scope.elapsedTime = Common.seconds2Time(7200 - $stateParams.lefttime);

	//错题列表
	$scope.showErrorQuestions = function(){
		$state.go('tab.menu.practice.errorquestions')
	};

});