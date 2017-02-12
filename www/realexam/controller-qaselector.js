angular.module('starter.controllers')
.controller('RealQASelectorCtrl', function($scope, $state, $ionicScrollDelegate, RealDao, $log,
  $stateParams, RealQASelectorService, $ionicPopup){
  //qstateArr,存储所有的当前进度，题号，正确与否, 0未回答, 1正确, 2错误, 错误答案

  $log.debug('enter real qa selector ctrl');

  $scope.toQuesiton = function(qid){
    //点击题号跳转到对应题目
    var qidArr = [];
    for(idx in $scope.qstateArr){
      qidArr.push($scope.qstateArr[idx].id);
    }
    $state.go('tab.menu.exam', {progressQid : qid, year:$stateParams.year, paper:$stateParams.paper});
  }

  /*
  滚动结束
  */
  $scope.onScrollComplete = function(){
    var pos = $ionicScrollDelegate.$getByHandle('qaselectorHandle').getScrollPosition().top;
    window.localStorage.setItem('real_qa_sel_pos' + $stateParams.year + '_' + $stateParams.paper, pos);
  };

  /*
  清理题目的历史
  */
  $scope.clearQaHistory = function() {
    //弹出窗口，等待用户确认
      var confirmPopup = $ionicPopup.confirm({
         title: '确认',
         template: '清除当前练习记录，重新开始？',
         cancelText : '取消',
         okText : '确定'
       });

       confirmPopup.then(function(res) {
         if(res) {
           //清空做题记录
           $log.debug('clear real qa history');
           RealQASelectorService.clearQaHistory($stateParams.year, $stateParams.paper);
           //回到开头
           $ionicScrollDelegate.$getByHandle('qaselectorHandle').scrollTo(0, 0, true);
           initData();
         } else {
           $log.debug(' donot clear real qa history');
         }
       });
  }

  /*
  初始化数据
  */
  function initData(){
    var year = $stateParams.year;
    var paper = $stateParams.paper;
    console.log('加载带进度的真题', year, paper);
    var promise = RealQASelectorService.loadRealQA(year, paper);
    promise.then(
      function(data){
        if(data != null){
          $scope.qstateArr = data;
        }else{
        }
      },
      function(error){
        $log.info(JSON.stringify(error));
    });
  }

  $scope.$on('$ionicView.beforeEnter', function(event, data){
      //加载当前真题卷的答题进度,不仅仅是题目，还包括是否正确
      initData();
      //滚动到存储到位置
      var pos = window.localStorage.getItem('real_qa_sel_pos' + $stateParams.year + '_' + $stateParams.paper);
      $ionicScrollDelegate.$getByHandle('qaselectorHandle').scrollTo(0, pos, true);
  });

});
