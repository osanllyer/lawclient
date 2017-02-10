angular.module('starter.controllers')
.controller('RealCtrl', function($scope, $state, $ionicScrollDelegate, RealDao, $log){
	//真题tab页面
	$scope.years = new Array('2016', '2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003', '2002');
	$scope.realPractice = function(year, paperId){
		var position = $ionicScrollDelegate.$getByHandle('realScroll').getScrollPosition().top;
		$log.debug('save real pos', position)
		RealDao.saveRealPosition(position);
		$state.go('tab.menu.exam', {year:year, paper:paperId});
	};

	//滚动结束，保存real的当前位置，没有作用。。。。。。。why，在点击action中保存吧
	$scope.scrollComplete = function(){
		// var position = $ionicScrollDelegate.$getByHandle('realScroll').getScrollPosition().top;
		// $log.debug('save real pos', position)
		// RealDao.saveRealPosition(position);
	};

	$scope.$on('$ionicView.beforeEnter', function(event, data){
		var pos = RealDao.getRealPosition();
		$log.debug('real pos', pos);
		if(angular.isDefined(pos)){
			$ionicScrollDelegate.$getByHandle('realScroll').scrollTo(0,pos,true);
		}
	});
})
.controller('RealExamCtrl', function($scope, Common, RealDao, ChapterDao, ProgressDao,
	$stateParams, $cacheFactory, $log, progressQid, qidArr, $ionicScrollDelegate, $controller){
	//真题测试页面
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr});
	$scope.saveProgress = function(){
		//存储当前进度
		RealDao.saveProgress($stateParams.year, $stateParams.paper, $scope.qid);
	};

	$scope.init();
	$scope.loadQuestion();
});
