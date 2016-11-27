angular.module('starter.controllers')
.controller('CommentCtrl', function ($log, $scope, $state, $stateParams, $ionicHistory, CommentService) {
  $log.debug('enter comment controller');

  $scope.pageType = $stateParams.pageType;

  $scope.qid = $stateParams.qid;
  $scope.comment = $stateParams.comment;

  $scope.currentPosition = 0;
  $scope.size = 10;

  $scope.infinite = true;
  // $scope.commentList = [];

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //如果存在前一个view，显示返回按钮,否则不现实
    //在用户进入app时，保证没有登录的用户，进入login界面
    if($ionicHistory.backView() != null){
        viewData.enableBack = true;
    }
    $log.debug('comment qid is :', JSON.stringify($scope.qid));
    $scope.flag = $stateParams.flag;
    if($scope.flag == 0){
      $log.debug('comment page flag 0');
      $scope.qid = $stateParams.qid;
      $scope.getCommentList();
    }else{
      $log.debug('comment page flag 1', JSON.stringify($stateParams));
      $scope.comment = JSON.parse($stateParams.comment);
      $log.debug('comment', JSON.stringify($scope.comment));
      $scope.getCommentAndReply();
    }
  });

  //获取评论和回复
  $scope.getCommentAndReply = function() {

    var promise = CommentService.getCommentAndReply($scope.comment.id, $scope.currentPosition, $scope.size );
    promise.then(
      function(data) {
        $scope.infinite = false;
        $scope.commentList = data.data;
        $log.debug('get comment and reply:', JSON.stringify(data));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },
      function (error) {
        $scope.infinite = false;
        $log.debug('get comment and reply error:', JSON.stringify(error));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  };

  /*
  跳转到comment对应的页面，显示comment和它的reply
  */
  $scope.goCommentAndReply = function (comment) {
    //其实就是重新进入这个页面，使用不同的参数，不能覆盖原来的，否则缓存会无法使用
    //查看是否有下一级页面，如果没有就不需要进入了
    if(comment.childs <= 0){
      return;
    }
    $log.debug('before go to comment:', JSON.stringify(comment));
    $state.go('tab.comment', {qid:-1, comment:JSON.stringify(comment), flag:1});
  };


  /*
  加载更多
  */
  $scope.loadMore = function(){
    if($scope.flag == 0){
      $scope.getCommentList();
    }else{
      $scope.getCommentAndReply();
    }
  };

  //获取评论列表
  $scope.getCommentList = function() {
    var promise = CommentService.getCommentList($scope.qid, $scope.currentPosition, $scope.size );
    promise.then(
      function(data) {
        if(data.data){
          var len = data.data.length;
          if(len < 10){
            //没有新的，禁止下拉功能
            $scope.infinite = false;
          }
          $scope.commentList = data.data;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },
      function (error) {
        $scope.infinite = false;
        $log.debug('fetch comment list error:', JSON.stringify(error));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  };

});
