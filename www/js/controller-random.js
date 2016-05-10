angular.module('starter.controllers.chapter')
.controller('ExamRandomCtrl', function($scope, ChapterDao, $state, $rootScope, $ionicHistory){
	console.log('random ctrl enter');
	$scope.previd = -1;
	$scope.nextid = 1;
	$scope.random = true;
	//读取试题
	var itemPromise = ChapterDao.getMaxMin();

	itemPromise.then(function(data){
		if(data){
			var min = data.min;
			var max = data.max;

			$scope.qid = min + Math.round(Math.random() * (max - min));
			var promise = ChapterDao.getQuestion($scope.qid);
			alert($scope.qid);
			promise.then(function(data){
				var item = data;
				$scope.title = item.question;
				$scope.answer = item.answer;
				$scope.choices = new Array(item.a, item.b, item.c, item.d);
				$scope.analysis = item.analysis;
			}, function(error){});

			//收藏功能
			var favPromise = ChapterDao.loadFavorite($scope.qid);
			favPromise.then(function(data){
				$scope.fav = data ? true : false; 
			}, function(error){});
		}else{
			//no data found, should alert the user.
		}
	}, function(error){});

	$scope.show = false;
	$scope.isShowAnalysis = function(){
		return $scope.show;
	};
	$scope.toggleAnalysis = function(){
		$scope.show = !$scope.show;
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

	$scope.nextQuestion = function(){
		// $ionicHistory.currentView($ionicHistory.backView());
		$state.go('tab.menu.practice.random', {rand:Math.random()}, {location:'replace'});
	};

	$scope.prevQuestion = $scope.nextQuestion;

	console.log($scope);
});