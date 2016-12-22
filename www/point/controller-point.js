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
		progressQid, qidArr, PointService, $stateParams){

	$log.debug('point entry enter', progressQid, qidArr);

	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr, showFooterBar:true, showAnalysis:false});

	$scope.saveProgress = function (){
		PointService.saveProgress($scope.qid, $stateParams.lawid);
	}



	$scope.init();
	$scope.loadQuestion();
});
