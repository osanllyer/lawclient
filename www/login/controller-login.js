angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $log, $http, $rootScope, $ionicHistory, LoginService){
	//管理用户登录信息
	$log.debug('login ctrl enter');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());
	/**联系服务器，请求登陆*/
	$scope.askLogin = function(){
		$scope.data = {};
		$rootScope.login = LoginService.login($scope.data.username, $scope.data.password);
		if($rootScope.login){
			//登陆成功
			//回到前页面
			$ionicHistory.goBack();
		}else{
			//登录失败，提示错误，停留在此
		}
	};
});