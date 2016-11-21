angular.module('starter.controllers')
.controller('CommentCtrl', function ($log, $scope, $stateParams) {
  $log.debug('enter comment controller');

  $scope.pageType = $stateParams.pageType;

  $scope.qid = $stateParams.qid;
  $scope.id = $stateParams.id;

  $scope.currentCommentId = 0;

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //如果存在前一个view，显示返回按钮,否则不现实
    //在用户进入app时，保证没有登录的用户，进入login界面
    if($ionicHistory.backView() != null){
        viewData.enableBack = true;
    }
  });

  //获取评论列表
  $scope.getCommentAndReply = function() {

  }

});
