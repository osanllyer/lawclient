angular.module('starter.controllers')
.controller('UserCtrl', function($scope, $log, $http, $rootScope, UserService){
	//管理用户登录信息
	$log.debug('user ctrl enter');

	$scope.user = UserService.getUserInfo(11111);


});