angular.module('starter.controllers')
.controller('RealQASelectorCtrl', function($scope, $state, $ionicScrollDelegate, RealDao, $log, $stateParams, qstateArr){
  //qstateArr,存储所有的当前进度，题号，正确与否, 0未回答, 1正确, 2错误, 错误答案

  $log.debug('enter real qa selector ctrl');

  $scope.qstateArr = qstateArr;
  $log.debug('qstatearr', JSON.stringify($scope.qstateArr));
  $scope.toQuesiton = function(qid){
    //点击题号跳转到对应题目
    $state.go('tab.menu.exam', {progressQid : qid, qidArr : qstateArr});
  }

});
