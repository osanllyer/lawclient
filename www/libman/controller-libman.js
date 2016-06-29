/**
*  Module
*题库管理模块
* Description
*/
angular.module('starter.controllers')
.controller('LibManCtrl', function($scope, $log, $rootScope, $ionicHistory, AUTH_EVENTS, LibManService){

	$log.debug('lib man ctrl enter');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});	

	//题库更新完成事件
	$scope.$on(AUTH_EVENTS.libcomplete, function(event){
		$scope.checkupdate();
	});

	$scope.updatelog = "";
	
	$scope.noupdate = true;

	function init(){
		$scope.title = '您用的是最新题库';
		$scope.version = LibManService.libVersion.version;
		$scope.log = LibManService.libVersion.log;
	}

	init();

	$scope.checkupdate = function(){
		var logVerPromise = LibManService.checkupdate();
		logVerPromise.then(
			function(data){
				if(data){
					alert(JSON.stringify(data));
					//是新版本
					if(data.count > 0){
						//有新版本
						$scope.log = data.qs;
						$scope.total = data.count;
						$scope.title = '有新版本, 请及时更新!';
						$scope.version = data.newestTime;
						$scope.noupdate = false;

					}else{
						//用户本森是最新版本
						$scope.log = data.qs;
						$scope.total = data.count;
						$scope.title = '您用的是最新版本!';
						$scope.version = data.newestTime;
						$scope.noupdate = true;
					}
				}
			}, 
			function(error){
				//链接网络出错，显示用户本地信息
				$log.debug(JSON.stringify(error));
			}
		);
	};

	$scope.checkupdate();

	//下载更新
	$scope.downloadLib = function(){
		LibManService.downloadLib();
	};
});