angular.module('starter.controllers')
.controller('CommentCtrl', function ($log, $scope, $state, $stateParams, $ionicHistory, $ionicLoading, $timeout, CommentService, Common) {
  $log.debug('enter comment controller');

  $scope.pageType = $stateParams.pageType;

  $scope.qid = $stateParams.qid;
  $scope.comment = $stateParams.comment;

  $scope.currentPosition = 0;
  $scope.size = 10;

  $scope.commentContent = null;

  $scope.infinite = true;
  // $scope.commentList = [];

  $scope.getCommentError = false;

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

  function closeLoginMask() {
    Common.showMask(false);
  }

  $scope.postComment = function(){
    //显示loading窗口
    Common.showMask(true, true, '正在提交评论，审查过后显示');
    if($scope.commentContent == null || $scope.commentContent.length < 10){
      //不提交
      Common.showMask(true, false, '评论字数不符合要求');
      $timeout(closeLoginMask, 1000);
    }else{
      if($scope.commentContent.length > 500){
        $scope.commentContent = $scope.commentContent.subString(0,500);
      }
      $log.debug('comment content:', $scope.commentContent);
      var promise = CommentService.postComment($scope.qid, $scope.commentContent);
      promise.then(
        function (data) {
          //发送成功，返回数据,弹出一个发送窗口
          $log.debug('post comment success', JSON.stringify(data));
          Common.showMask(true, false, '提交成功，审核过后显示');
          $timeout(closeLoginMask, 1000);
        },
        function(error){
          //发送失败，提醒用户稍后再试
          $log.debug('post comment success', JSON.stringify(data));
          Common.showMask(true, false, '提交失败，请稍后再试');
          $timeout(closeLoginMask, 1000);        }
      );
    }
  };

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
        $scope.getCommentError = true;
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
        $scope.getCommentError = true;        
        $log.debug('fetch comment list error:', JSON.stringify(error));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  };

});
