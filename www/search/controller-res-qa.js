angular.module('starter.controllers')
.controller('SearchQaResCtrl', function($controller, $scope, qidArr, $log){
  $log.debug('enter search qa res controller');
  $controller('BaseExamCtrl', {$scope:$scope, progressQid:null, qidArr:qidArr});
  $scope.init();
	$scope.loadQuestion();
});
