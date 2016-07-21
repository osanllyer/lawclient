angular.module('starter.controllers')
.controller('SignUpCtrl', function($scope, $log, $http, $rootScope, $ionicHistory, AuthService, 
								$ionicNavBarDelegate, UserService, sharedConn, $interval, $timeout){
	//管理用户登录信息
	$log.debug('login ctrl enter');

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.valcodeLogin = true;

	$scope.data = {};

	$scope.emailRegx = "^(13\\d|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[^346,\\D]\\d{7}$";

	$scope.loginError = false;

	$scope.passwordcode = 'password';

	/**获取验证码*/
	$scope.getValidateCode = function(){

		//开始计时，将下次获取时间设定为30s后，无效btn
		$scope.fetchingValidateCode = true;
		$timeout(function(){
   			$scope.fetchingValidateCode = false;
   			//取消计时间隔
   			if(angular.isDefined($scope.valTimer)){
   				$interval.cancel($scope.valTimer);
   			}
   		},30000);
		$scope.leftTime = 30;
   		$scope.valTimer = $interval(function(){
   			$scope.leftTime -= 1;
   		}, 1000, 30);

   		//获取验证码
		var promise = AuthService.getValidateCode($scope.data.username);
		promise
		.success(function(){
			//发送验证码成功
		})
		.error(function(data){
			//发送验证码失败
			$log.debug('get validate code error:' + JSON.stringify(data));
		});
	}

	function callToRegister(){
			AuthService.signUp($scope.data.username, $scope.data.password).then(
			function(data){
				$log.debug('sign up ok', JSON.stringify(data));
				//注册成功，自动登陆
				if(data.registerResult){
					$scope.login(true);
				}
			},
			function(error){
				$log.error('sign up error', JSON.stringify(error));
			}
		);
	}

	$scope.signUp = function(){
		//注册xmpp用户
		sharedConn.signUp($scope.data.username, $scope.data.password, callToRegister);
	};


	$scope.change = function(){
		$scope.loginError = false;
	}

	//退出登陆
	$scope.logout = function(){
		AuthService.logout();
	};
});