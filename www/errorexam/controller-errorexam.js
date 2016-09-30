angular.module('starter.controllers')
.controller('ErrorExamCtrl', function($scope, $controller, ErrorExamService, progressQid, qidArr, $log){
	//必需的三个参数
	$log.debug('error exam ctrl enter', qidArr, progressQid);
	if(qidArr == null){
		qidArr = [];
	}
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr});
	$scope.saveProgress = function(){
		ErrorExamService.saveProgress($scope.qid);
	};

	$scope.init();
	$scope.loadQuestion();

});