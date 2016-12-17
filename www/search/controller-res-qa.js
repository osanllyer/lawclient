angular.module('starter.controllers')
.controller('SearchQaResCtrl', function($scope, ChapterDao, $state, $rootScope, $ionicHistory, $controller, $log, qidArr){
  $log.debug('enter search qa res controller');
  $controller('BaseExamCtrl', {$scope:$scope, progressQid:null, qidArr:qidArr, showFooterBar:false, showAnalysis:true});
  $scope.init();
	$scope.loadQuestion();

  $scope.$on('$ionicView.beforeEnter', function(event, data){
    $log.debug('enter qa res detail page');
  });
});
