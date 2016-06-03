angular.module('starter.controllers')
.controller('AboutCtrl', function($scope, $log, Confs){
	$log.debug('enter about ctrl');
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});
});