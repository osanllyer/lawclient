angular.module('starter.controllers')
.controller('UserCtrl', function($scope, $log, $http, $rootScope, $state, $stateParams, UserService, $ionicPopup, AUTH_EVENTS, AvatarService){
	//管理用户登录信息
	$log.debug('user ctrl enter');
	$log.debug('username', $stateParams.name, UserService.user().username);
	if($stateParams.name == UserService.user().username){
		$scope.editable = true;
		$scope.user = UserService.user();
	}else{
		$scope.editable = false;

		//不是本地用户，不需要广播事件
		UserService.getUserInfoByUsername($stateParams.name, false).then(
			function(data){
				$scope.user = data;
			},
			function(error){
				$log.debug(error);
			}
		);
	}
	
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	//编辑头像
	$scope.editAvatar = function(){
		$state.go('tab.avatar');
	};

	$scope.editNickName = function(){
		$ionicPopup.prompt({
			title : '修改昵称',
			template : '好听的名字能让朋友更容易记住你',
			inputType : 'text',
			defaultText : $scope.user.nickname,
			cacelText : '放弃',
			okText : '保存'
		}).then(function(res){
			if(angular.isDefined(res)){
				$scope.user.nickname = res;
				UserService.updateUser($scope.user);
			}
		});
	};

	$scope.editAddress = function(){
		$ionicPopup.prompt({
			title : '修改地址',
			inputType : 'text',
			defaultText : $scope.user.address,
			cacelText : '放弃',
			okText : '保存'
		}).then(function(res){
			if(angular.isDefined(res)){
				$scope.user.address = res;
				UserService.updateUser($scope.user);
			}
		});
	};

	//什么都不用做
	$scope.donothing = function(){};

	$scope.editGender = function(){
		$ionicPopup.show({
			title : '您的性别是？',
			template : '',
			buttons : [
			{
				text : '男',
				type : 'button-positive',
				onTap : function(e){
					$scope.user.gender = 0;
					UserService.updateUser($scope.user);

				}
			},
			{
				text : '女',
				type : 'button-positive',
				onTap : function(e){
					$scope.user.gender = 1;
					UserService.updateUser($scope.user);
				}
			}
			]
		});
	};

	//需要用户登陆
	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
	    AuthService.logout();
	    $state.go('tab.login');
	    var alertPopup = $ionicPopup.alert({
	      title: 'Session Lost!',
	      template: 'Sorry, You have to login again.'
	    });
  	});

	//没有被触发，应该是缓存的原因
	// $scope.$on(AUTH_EVENTS.avatarUpdated, function(event, data) {
	// 	//更新avatar
	// 	$log.debug('avatar updated', event, data);
	// 	$scope.user.avatar = data.avatar;
	// 	UserService.updateUser($scope.user);
	// 	// event.preventDefault();
 //  	});  	

	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		console.log("enter controller user: ", JSON.stringify(fromState));
		//from avatar
		if(fromState.name == 'tab.avatar'){
			var avatar = AvatarService.choosedAvatar();
			//如果更新了avatar
			if(avatar != $scope.user.avatar){
				$scope.user.avatar = avatar;
				UserService.updateUser($scope.user);
			}
		}
	});
});