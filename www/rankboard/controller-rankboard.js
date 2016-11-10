/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('RankboardCtrl', function($log, $scope, UserService, RankboardService){
	$log.debug('enter RankboardCtrl');

	$scope.user = {};

	$scope.user.rank = RankboardService.rank();
	$scope.user.score = RankboardService.score();
	$scope.user.nickname = UserService.user().nickname;	
	$scope.user.avatar = UserService.user().avatar;

	$scope.$on('$ionicView.beforeEnter', function(event, viewData){
		$log.debug('RankboardCtrl enter');
	    viewData.enableBack = true;		
		// RankboardService.getSelfRank();
		var promise = RankboardService.getTopUsers();
		promise.then(
			function(data){
				$log.debug('RankboardCtrl topuser:', JSON.stringify(data));
				$scope.users = data;
			},
			function(error){
				$log.debug('rank board load top user:', JSON.stringify(error));
			}
		);
	});

});