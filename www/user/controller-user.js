angular.module('starter.controllers')
.controller('UserCtrl', function($scope, $log, $http, $rootScope, UserService, $ionicPopup){
	//管理用户登录信息
	$log.debug('user ctrl enter');

	$scope.user = UserService.getUserInfo(11111);
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.editNickName = function(){
		$ionicPopup.prompt({
			title : '修改昵称',
			template : '好听的名字能让朋友更容易记住你',
			inputType : 'text',
			defaultText : $scope.user.nickname,
			cacelText : '放弃',
			okText : '保存'
		}).then(function(res){
			$scope.user.nickname = res;
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
			$scope.user.address = res;
		});
	};
	$scope.editGender = function(){
		$ionicPopup.show({
			title : '您的性别是？',
			template : '',
			buttons : [
			{
				text : '男',
				type : 'button-positive',
				onTap : function(e){
					$scope.user.gender = '男';
				}
			},
			{
				text : '女',
				type : 'button-positive',
				onTap : function(e){
					$scope.user.gender = '女';
				}
			}
			]
		});
	};

});