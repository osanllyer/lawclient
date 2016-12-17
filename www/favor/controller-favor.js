/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('FavorCtrl', function($scope, $controller, $log, progressQid, qidArr, FavorService){

	$log.debug('fav ctrl enter');

	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr, showFooterBar:true, showAnalysis:false});

	$scope.saveProgress = function(){
		FavorService.saveProgress($scope.qid);
	};

	$scope.init();
	$scope.loadQuestion();
});
