angular.module('starter.controllers')
.controller('RealCtrl', function($scope, $state){
	//真题tab页面
	$scope.years = new Array('2002','2003','2004','2005','2006','2007','2008','2009','2010','2012','2013','2014','2015');
	$scope.realPractice = function(year, paperId){
		$state.go('tab.menu.exam', {year:year, paper:paperId});
	};
})
.controller('RealExamCtrl', function($scope, Common, RealDao, ChapterDao, ProgressDao, 
	$stateParams, $cacheFactory, $log, progressQid, qidArr, $ionicScrollDelegate){
	//真题测试页面 
	$scope.choiced = {value : ""};
	$log.debug('enter real exam ctrl');
	$scope.index = 0;
	$scope.total = qidArr.length;
	$scope.showAnalysis = false;

	var fillQuestion = function(data){
		//设置显示顶部
		$ionicScrollDelegate.scrollTop();
		//清除选择项
		//关闭显示分析
		$scope.choiced = {value:""};
		$scope.showAnalysis = false;
		//加载数据
		$scope.question = data.question;
		if(data.type == 1 || data.type == 2){
			$scope.choices = { 
				A : { desc : data.a, checked : false},
				B : { desc : data.b, checked : false},
				C : { desc : data.c, checked : false},
				D : { desc : data.d, checked : false}
			};
		}else{
			$scope.choices = {};
		}
		$scope.answer = data.answer;
		$scope.analysis = data.analysis;
		$scope.type = data.type;

		//收藏功能
		var favPromise = ChapterDao.loadFavorite(data.id);
		favPromise.then(function(res){
			$scope.fav = res ? true : false; 
		}, function(error){});

		//存储当前进度
		RealDao.saveProgress($stateParams.year, $stateParams.paper, $scope.qid);
	}

	$scope.prevQuestion = function(){

		if($scope.index > 0){
			$scope.index -= 1;
		}else{
			//do nothing
			return;
		}
		$scope.qid = qidArr[$scope.index];

		var questionPromise = ChapterDao.getQuestion($scope.qid);
		questionPromise.then(function(data){
			if(data){
				// alert(JSON.stringify(data));
				fillQuestion(data);
			}
		}, function(error){
			$log.debug(error);
		});

	};

	$scope.nextQuestion = function(){
		$log.debug('next question');
		if($scope.index < qidArr.length - 1){
			$scope.index += 1;
		}else{
			return;
		}
		$scope.qid = qidArr[$scope.index];

		var questionPromise = ChapterDao.getQuestion($scope.qid );
		questionPromise.then(function(data){
			if(data){
				fillQuestion(data);
			}
		}, function(error){
			$log.debug(error);
		});
	}

	//存在进度
	if(progressQid){
		$scope.index = Common.findIndex(progressQid, qidArr);
		if($scope.index == -1){
			$scope.index = 0;
		}
		var promise = ChapterDao.getQuestion(progressQid);
		promise.then(function(data){
			if(data){
				//填充scope数据
				fillQuestion(data);
			}
		}, function(error){});
	}else{
	//从qidarr获取第一条
		var qid = qidArr[0];
		$scope.index = 0;
		var promise = ChapterDao.getQuestion(qid);
		promise.then(function(data){
			if(data){
				//填充scope数据
				fillQuestion(data);
			}
		}, function(error){});
	}


	$scope.isShowAnalysis = function(){
		return $scope.showAnalysis;
	};
	$scope.toggleAnalysis = function(){
		$scope.showAnalysis = !$scope.showAnalysis;
	};

	
	$scope.toogleFavorite = function(){
		//reverse the fav state
		$scope.fav = !$scope.fav;
		if($scope.fav){
			//增加收藏
			ChapterDao.addFavorite($scope.qid);
		}else{
			//删除收藏
			ChapterDao.removeFavorite($scope.qid);
		}
	};	

	/**
	判断答案是否正确
	*/
	$scope.validateAnswer = function(){
		$scope.validateResult = false;
		if($scope.type >= 3){
			//不是选择题，什么都不做
		}

		if($scope.type == 1){
			//单选题
			$scope.validateResult = $scope.choiced.value.toUpperCase() == $scope.answer.toUpperCase();
		}

		if($scope.type == 2){
			//多选
			var choicedItem = Array();
			if($scope.choices.A.checked) choicedItem.push('A');
			if($scope.choices.B.checked) choicedItem.push('B');
			if($scope.choices.C.checked) choicedItem.push('C');
			if($scope.choices.D.checked) choicedItem.push('D');

			$scope.validateResult = choicedItem.join("").toUpperCase() == $scope.answer.toUpperCase();
		}

		$scope.toggleAnalysis();

		//加入统计表格
		ProgressDao.addProgressStat($scope.qid, $scope.validateResult);
	}

})
;