angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $log, $http, $rootScope, $ionicHistory, LoginService, $ionicNavBarDelegate){
	//管理用户登录信息
	$log.debug('login ctrl enter');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	/**联系服务器，请求登陆*/
	$scope.askLogin = function(){
		$scope.data = {};
		$rootScope.isLogin = LoginService.login($scope.data.username, $scope.data.password);
		if($rootScope.isLogin){
			//登陆成功
			//回到前页面
			$ionicHistory.goBack();
		}else{
			//登录失败，提示错误，停留在此
		}
	};
});