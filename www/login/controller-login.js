angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $log, $http, $rootScope, $ionicHistory, AuthService, 
								$ionicNavBarDelegate, UserService, sharedConn, $interval, $timeout, $state){
	//管理用户登录信息
	$log.debug('login ctrl enter');

	// $log.debug($ionicHistory.backView());
	// $log.debug($ionicHistory.currentView());

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


	/**
	验证码登录
	*/
	$scope.loginWithValidateCode = function(){

		$log.debug('login with validate code:' + JSON.stringify($scope.data));
		var promise = AuthService.checkValidateCode($scope.data.username, $scope.data.password);
		promise.success(
			function(data, status, config, statusText){
				$log.debug("check validate code correct ,use password and user login", data, typeof(data));
				if(data.result == 'error'){
					//用户验证码错误，提醒用户重新输入
					$scope.loginError = true;
					$scope.loginErrorText = '验证码错误，请重新输入';
				}else{
					//验证码正确，返回用户名和密码，使用用户名和密码再次登陆
					if(data.username != null && data.password != null){
						$scope.data.username = data.username;
						$scope.data.password = data.password;
						alert(JSON.stringify($scope.data));
						$scope.login(false);
					}else{
						//没有用户和密码，说明此用户还没有注册
						$scope.loginError = true;
						$scope.loginErrorText = '您还没有注册，请先注册';
					}
				}
			}
		).error(
			function(data, status, config, statusText){
				//验证码错误，提示用户重新输入
				$log.debug('check validate code error:' + data )
			}
		);
	}

	/**联系服务器，请求登陆*/
	$scope.login = function(register){
		//设置userdetail，存储用户名称和密码，用以重新登陆xmpp服务
		UserService.userDetail = {username:$scope.data.username, password:$scope.data.password};
		AuthService.storeUserNamePassword($scope.data.username, $scope.data.password);
		//登陆服务器
		AuthService.login($scope.data.username, $scope.data.password, register).then(
			function(authenticated){
				//登陆成功，返回前一个状态
				$log.info('authenticated', JSON.stringify(authenticated));
				//填充用户信息
				$ionicHistory.goBack();
			}, 
			function(error){
				//登陆失败，提示用户不正确，在登陆框下面提示
				$log.debug(error);
				$scope.loginError = true;
			});
	};

	//进入注册界面
	$scope.goSignup = function(){
		$state.go('tab.signup');
	};



	$scope.change = function(){
		$scope.loginError = false;
	}

	//退出登陆
	$scope.logout = function(){
		AuthService.logout();
	};
});