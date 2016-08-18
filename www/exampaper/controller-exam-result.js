angular.module('starter.controllers')
.controller('ExamResultCtrl', function($scope, $log, resultList, $ionicHistory, ExamResultService, $stateParams, $state, Common){
	$log.debug('ExamResultCtrl enter');

	//结束考试，跳回试卷选择页面
	$scope.finishExam = function(){
		//距离试卷选择界面2
		$ionicHistory.goBack(-2);
	};

	//错题解析
	$scope.errorAnalysis = function(){
		//跳转到题目页面，默认显示解析，显示用户选择的错误答案，只显示错误题目
		$state.go('tab.menu.practice.exam');
	};

	//全部解析
	$scope.allAnalysis = function(){
		//跳转到题目页面，默认显示解析，显示用户选择的错误答案

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
					$log.debug(q.type);
					switch(q.type){
						case 1:
							errorScore += 1;
							break;
						case 2:
							errorScore += 2;
							break;
						case 3:
							errorScore += 2;
							break;
					}
					$scope.errorQuestionList.push(q.qid);
					$log.debug(errorScore);
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