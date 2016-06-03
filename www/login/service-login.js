angular.module('starter.services')
.factory('AuthService', function($q, $http, USER_ROLES, $log, ENDPOINTS, Common, CONF, $cookies, $rootScope, UserService){
	var LOCAL_TOKEN_KEY = 'law_credential_key';
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
	//启动的时候执行，自动登陆
	loadUserCredentials();
	function storeUserCredentials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
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

	var login = function(name, pw) {

		var deferred = $q.defer();
		// $http.get(loginUrl, {user:name, password:pw}).success(
		var headers = {authorization:"Basic " + btoa(name + ":" + pw)};
		$log.debug(Common.buildUrl(ENDPOINTS.loginUrl, {user:name, password:pw, rememberMe:true}));
		$http.get(ENDPOINTS.authUrl + "?remember-me=true", {headers:headers}).success(
			function(data, status, headers, config){
				$log.info('login success');
				parsePrincipal(data);
				//使用rootScope来保存，时刻保证menu里面是最新的状态
				$rootScope.isAuthenticated = true;
				username = name;
				//存储username和userid到localstorage，本地使用
				storeUserCredentials(username + ":" + role);
				deferred.resolve(data);
			}).error(function(data, status){
				$log.info('login error');
				deferred.reject(data);
				$log.info(JSON.stringify(data), status);
			});

		return deferred.promise;
	};
 
  var logout = function() {
    destroyUserCredentials();
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
  	$http.post(Common.buildUrl(ENDPOINTS.signUpUrl, {account:name, password:pw}),{}).success(function(data){
  		deferred.resolve(data);
  	}).error(function(data){
  		deferred.reject(data);
  	});
  	return deferred.promise;
  };
 
  // loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    signUp : signUp,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return $rootScope.isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };	
});
