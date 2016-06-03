angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $log, $http, $rootScope, $ionicHistory, AuthService, $ionicNavBarDelegate, UserService){
	//管理用户登录信息
	$log.debug('login ctrl enter');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.data = {};

	/**联系服务器，请求登陆*/
	$scope.login = function(){
		AuthService.login($scope.data.username, $scope.data.password).then(
			function(authenticated){
				//登陆成功，返回前一个状态
				$log.info('authenticated', JSON.stringify(authenticated));
				$rootScope.isAuthenticated = true;
				//填充用户信息
				UserService.getUserInfoByUsername($scope.data.username);
				$ionicHistory.goBack();
			}, 
			function(error){
				//登陆失败，提示用户不正确，在登陆框下面提示
				$log.debug(error);
			});
	};

	$scope.signUp = function(){
		AuthService.signUp($scope.data.username, $scope.data.password).then(
			function(data){
				//注册成功，自动登陆
				if(data.registerResult){
					$scope.login();
				}
			},
			function(error){
				$log.error('sign up error', JSON.stringify(error));
			}
		);
	};

	//退出登陆
	$scope.logout = function(){
		AuthService.logout();
	};
});