angular.module('starter.controllers')
.controller('ExamRandomCtrl', function($scope, ChapterDao, $state, $rootScope, $ionicHistory, $controller, $log,
		RandomService, minMaxQid){

	$log.debug('random ctrl enter', minMaxQid);

	var qidArr = RandomService.generateQidArr(minMaxQid.min, minMaxQid.max);

	if(angular.isUndefined(qidArr)){
		qidArr = new Array();
	}
	//random没有进度
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : null, qidArr : qidArr});
	$scope.init();
	$scope.loadQuestion();
});