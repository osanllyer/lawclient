angular.module('starter.controllers')
.controller('RealCtrl', function($scope, $state){
	//真题tab页面
	$scope.years = new Array('2002','2003','2004','2005','2006','2007','2008','2009','2010','2012','2013','2014','2015');
	$scope.realPractice = function(year, paperId){
		$state.go('tab.menu.exam', {year:year, paper:paperId});
	};
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