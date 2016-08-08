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

	//验证码认证成功后改为true
	$scope.validCode = false;
	$scope.checked = false;

	//正在修改验证码
	$scope.modifiValidateCode = function(){
		$scope.checked = false;
	};

	//检查验证码
	$scope.checkValidateCode = function(){
		//都正确才去验证
		if($scope.data.validatecode == null || $scope.data.validatecode.length < 4 || $scope.data.username.length < 11){
			$scope.checked = false;
			return;
		}
		var promise = AuthService.checkValidateCode($scope.data.username, $scope.data.validatecode);
		promise.then(
			function(data, status, config, statusText){
				//返回正确
				$scope.checked = true;
				$log.debug('check validate result:', data);
				if(data.data.result == 'correct'){
					$scope.validCode = true;
				}else{
					$scope.validCode = false;
				}
			},
			function(data, status, config, statusText){
				$log.debug('validate code error:' + data);
			}
		);
	};
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