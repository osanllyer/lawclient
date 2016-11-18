angular.module('starter.controllers')
.controller('ErrCorrectCtrl', function ($scope, $stateParams, $log, $ionicHistory, ErrCorrectService, AuthService) {

  $scope.qid = $stateParams.qid;
  $scope.originAnswer = $stateParams.originAnswer;
  $scope.data = {analysis:"", answer:""};

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		//如果存在前一个view，显示返回按钮,否则不现实
		//在用户进入app时，保证没有登录的用户，进入login界面
		if($ionicHistory.backView() != null){
	    	viewData.enableBack = true;
		}
	});

  $scope.submit = function(){
    $scope.data.qid = $scope.qid;
    var username = AuthService.username();
    $scope.data.user = username;
    var promise = ErrCorrectService.submit($scope.data);
    promise.then(
      function(data){
        $log.debug('submit correct to server:', JSON.stringify(data));
      },
      function(error){
        $log.error('submit correct to server error:', JSON.stringify(error));
      }
    );
  }

});
