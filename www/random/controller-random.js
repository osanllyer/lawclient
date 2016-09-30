angular.module('starter.controllers')
.controller('ExamRandomCtrl', function($scope, ChapterDao, $state, $rootScope, $ionicHistory, $controller, $log,
		RandomService, qidArr){

	$log.debug('random ctrl enter');
	//random没有进度
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : null, qidArr : qidArr});
	$scope.init();
	$scope.loadQuestion();
});