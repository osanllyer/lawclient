/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('OutlineCtrl', function($scope, $controller, $log){
	$log.debug('out line ctrl enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 2;
}).controller('OutlineEntryCtrl', function($scope, $log, $stateParams, $filter, OutlineService){
	/*
	大纲
	*/
	$log.debug('outline entry ctrl enter');
	var outlinePromise = OutlineService.loadOutline($stateParams.chapterid);
	outlinePromise.then(
		function(data){
			$log.debug('load outline ok:', JSON.stringify(data))
			if(data){
				$scope.outline = data.outline;
			}
		}, 
		function(error){
			$log.debug('load outline error:', JSON.stringify(error))
		}
	);
});