angular.module('starter.controllers')
.controller('CommentCtrl', function ($log, $scope, $stateParams, $ionicHistory, CommentService) {
  $log.debug('enter comment controller');

  $scope.pageType = $stateParams.pageType;

  $scope.qid = $stateParams.qid;
  $scope.id = $stateParams.id;

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
    $scope.getCommentList();
  });

  //获取评论和回复
  $scope.getCommentAndReply = function() {
    var promise = CommentService.getCommentList($scope.id, $scope.currentPosition, $scope.size );
    promise.then(
      function(data) {

      },
      function (error) {

      }
    );
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
      },
      function (error) {
        $scope.infinite = false;
        $log.debug('fetch comment list error:', JSON.stringify(error));
      }
    );
  };

});
