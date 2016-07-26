/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('PointCtrl', function ($scope, $controller, $log, $filter) {
	$log.debug('point enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 5;
	$scope.noSubGroup = true;

	$scope.lawFilter = function (item) {
		var arr = [3,4,5,6,7,8,9,14];
		return arr.indexOf(item.id) == -1;
	}

})
.controller('PointEntryCtrl', function($scope, ChapterDao, $state, $rootScope, $ionicHistory, $controller, $log,
		progressQid, qidArr, PointService){

	$log.debug('point entry enter');

	//random没有进度
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : null, qidArr : qidArr});
	
	$scope.saveProgress = function (qid){
		PointService.saveProgress(qid);
	}


	
	$scope.init();
	$scope.loadQuestion();
});