// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
		[ 'ionic', 
			'pickadate',
			'starter.controllers', 
			'starter.services',
			'starter.services.chapterDao', 
			'ngCordova', 
			'starter.controllers.chapter',
			'starter.services.commonservice',
			'starter.services.configuration',
			'starter.router'
			])
.constant('AUTH_EVENTS', {
	notAuthenticated : 'auth-not-authenticated', //没有授权
	notAuthorized : 'auth-not-authorized', 	//没有认证
	upadteUserInfo : 'update_user_info', //用户信息更新
	avatarUpdated : 'avatar_updated' //头像更新
})
.constant('USER_ROLES', {
	vip : 'vip',
	superVip : 'superVip',
	user : 'user'
})
.constant('ENDPOINTS', {
	//登陆地址
	signUpUrl : '/user/register',
	//获取认证权限
	authUrl : '/user/auth',
	//更新用户
	updateUserUrl : '/user/update',
	userInfo : '/user/userinfo',
	userId : '/user/id',
	xmpp_server : 'http://im.local:7070/http-bind/',
	xmpp_rest : 'http://im.local:9090/plugins/restapi/v1/',
	xmpp_register : 'http://localhost:9090/user-create.jsp'
})
.constant('CONF', {
	remember_me_key : 'remember-me'
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  //避免弹出登陆窗口
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
})
.config(
	//配置日历组件中文显示
	function(pickadateI18nProvider, $ionicConfigProvider){
		pickadateI18nProvider.translations = {
			prev : '<i class="ion-arrow-left-a"></i> 上月',
			next : '下月 <i class="ion-arrow-right-a"></i>'
		};

		/*必须指定tab位置，否则安卓真机无法显示在底部*/
		$ionicConfigProvider.tabs.position('bottom');
	}
)
.run(
	function($ionicPlatform, $cordovaSQLite, $rootScope, DB, Confs, AuthService, AUTH_EVENTS, $http, $log, $state) {
		$rootScope.appVersion = Confs.APP_VERSION
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins
					&& window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();s
			}

			var db = null;
			//加载数据库
			if(window.sqlitePlugin){
				window.plugins.sqlDB.remove("law.db", 0, function(){alert("remove ok")}, function(e){});
				window.plugins.sqlDB.copy("law.db", 0, function() {
					alert('copy ok');
        			$rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
    			}, function(error) {
    				alert(JSON.stringify(error));
    				$rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
        			console.error("There was an error copying the database: " + error);        		
        		});
			}else{
				//in browser
				console.log("db initing");
				DB.initDB();
			}
			if(angular.isDefined(window.cordova)){
				//app的名字和版本
				cordova.getAppVersion.getVersionNumber(function(version){
					$rootScope.appVersion = version;
				});
				cordova.getAppVersion.getAppName(function(name){
					$rootScope.appName = name;
				});			
			}else{
				$rootScope.appVersion = '0.1';
				$rootScope.appName = '司考2016';
			}
		});

		//设置默认登陆状态
		$rootScope.isAuthenticated = false;
		// AuthService.login();

		//监控状态变化，加上验证和授权
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			$log.debug(JSON.stringify(toState));
			//需要在router.js中配置权限
			if('data' in toState && 'authorizedRoles' in toState.data){
				$log.debug('need to authorized');
				var authorizedRoles = toState.data.authorizedRoles;
				$log.debug(authorizedRoles);
				if(!AuthService.isAuthorized(authorizedRoles)){
					event.preventDefault();
					$state.go($state.current, {}, {reload:true});
					$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
				}

				if(!AuthService.isAuthenticated()){
					if(toState.name !== 'tab.login'){
						event.preventDefault();
						$state.go('tab.login');
					}
				}
			}
		});
	}
)
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
}).directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
});;