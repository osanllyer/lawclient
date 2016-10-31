angular.module('starter.services')
// .factory('AuthService', function($q, $http, USER_ROLES, $log, ENDPOINTS, Common, CONF, 
// 				$rootScope, UserService, sharedConn, $state, $ionicHistory){ //以后再加交流
.factory('AuthService', function($q, $http, USER_ROLES, $log, ENDPOINTS, Common, CONF, 
				$rootScope, UserService, $state, $ionicHistory, AUTH_EVENTS, DB){	
	var LOCAL_TOKEN_KEY = 'law_credential_key';
	var KEY_USERNAME_PASSWORD = 'law_username_password'
	var username = '';
	var isAuthenticated = false;
	var role = '';
	var authToken;

	function loadUserCredentials(){
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if(token){
			useCredentials(token);
		}
	}


	/**
	*/
	function checkValidateCode(recnum, passwd){
		return $http.get(Common.buildUrl(ENDPOINTS.checkvalidatecode, {phone:recnum, code:passwd}));
	}

	/**
	获取验证码
	*/
	function getValidateCode(mobile){
		return $http.get(Common.buildUrl(ENDPOINTS.validatecode, {recnum:mobile}));
	}

	function storeUserCredentials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}

	function storeUserNamePassword(username, password){
		window.localStorage.setItem(KEY_USERNAME_PASSWORD, username + ':_:' + password);
	}

	function loadUserNamePassword(){
		var upass = window.localStorage.getItem(KEY_USERNAME_PASSWORD);
		if(upass){
			return upass.split(':_:');
		}else{
			return null;
		}
	}

	function useCredentials(token){
		var res = token.split(":");
		isAuthenticated = true;
		$rootScope.isAuthenticated = true;
		username = res[0];
		role = res[1];
	}

	function parsePrincipal(data){
		var authorities = data.authorities;
		if(authorities){
			//设置角色
			role = authorities[0].authority;
		}
	}

	var login = function(name, pw, register) {

		// //登陆到xmpp服务
		// if(!register){
		// 	//需要区分是否是注册，注册时已经调用了一次登录，再次调用会导致退出。
		// 	sharedConn.login(name, ENDPOINTS.xmpp_domain, pw);
		// }

		var deferred = $q.defer();
		var headers = {};
		//使用httpbasic认证，base64编码，如果没有指定用户密码，使用rememberme登录
		if(name != null && pw != null){
			headers = {authorization:"Basic " + btoa(name + ":" + pw)};
		}
		//使用remeber me 登录，无法登录聊天服务器
		// $http.get(ENDPOINTS.authUrl + "?remember-me=true", {headers:headers}).success(
		//不使用remeberme
		$http.get(ENDPOINTS.authUrl, {headers:headers}).success(
			function(data, status, headers, config){
				$log.debug(JSON.stringify(data));
				$log.info('login success');
				parsePrincipal(data);
				//使用rootScope来保存，时刻保证menu里面是最新的状态
				$rootScope.isAuthenticated = true;
				username = name;
				UserService.getUserInfoByUsername(name, true);
				//存储username和userid到localstorage，本地使用
				storeUserCredentials(username + ":" + role);
				$rootScope.isAuthenticating = false;
				deferred.resolve(data);
				//广播登陆成功事件
				$rootScope.$broadcast(AUTH_EVENTS.login);
			}).error(function(data, status, headers, config){
				$log.info('login error');
				$rootScope.isAuthenticating = false;
				deferred.reject(data);
				$log.info(JSON.stringify(data), status, JSON.stringify(headers), JSON.stringify(config));
			});

		return deferred.promise;
	};
 
	/**
	删除用户信息
	*/
	function destroyUser(){
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
		window.localStorage.removeItem(KEY_USERNAME_PASSWORD);
		//跳转到登陆界面
		$http.get(ENDPOINTS.logout);
		//将attach的db做detach
		DB.detachUserDB();
		//禁止回退
		$ionicHistory.nextViewOptions({disableBack:true});
		$state.go('tab.login');

	}

	var logout = function() {
	    destroyUser();
	};
 
	var isAuthorized = function(authorizedRoles) {
	    if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
	    $log.debug(role);
	    return ($rootScope.isAuthenticated && authorizedRoles.indexOf(role) !== -1);
	};

  //注册
  var signUp = function(name, pw){
  	var deferred = $q.defer();
  	$log.debug('sign up with:', name, pw);
  	$http.get(Common.buildUrl(ENDPOINTS.signUpUrl, {account:name, password:pw}))
  	.success(function(data){
  		deferred.resolve(data);
  	})
  	.error(function(data){
  		deferred.reject(data);
  		$log.debug('singup error:', JSON.stringify(data));
  	});
  	return deferred.promise;
  };
 
  // loadUserCredentials();
 
  return {
  	checkValidateCode : checkValidateCode,
  	getValidateCode : getValidateCode,
    login: login,
    logout: logout,
    signUp : signUp,
    isAuthorized: isAuthorized,
    storeUserNamePassword : storeUserNamePassword,
    loadUserNamePassword : loadUserNamePassword,
	loadUserCredentials : loadUserCredentials,
    isAuthenticated: function() {return $rootScope.isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };	
});
