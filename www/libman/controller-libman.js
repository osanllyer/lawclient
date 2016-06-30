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

	$scope.progress = {max:100, value:0};

	$scope.updatelog = "";
	
	$scope.noupdate = true;

	function init(){
		$scope.downloading = false; //是否正在下载
		$scope.title = '您用的是最新题库';
		$scope.version = LibManService.libVersion.version;
		$scope.log = LibManService.libVersion.log;
		$scope.total = LibManService.libVersion.total;
		$scope.downloadButtonText = '没有更新';
	}

	init();

	$scope.checkupdate = function(){
		$log.debug('check update enter');
		var logVerPromise = LibManService.checkupdate();
		logVerPromise.then(
			function(data){
				if(data){
					$log.debug('lib udpate data:' + JSON.stringify(data));
					//是新版本
					if(data.count > 0){
						//有新版本
						$scope.log = data.qs;
						$scope.total = data.total;
						$scope.title = '有新版本, 请及时更新!';
						$scope.version = data.newestTime;
						$scope.noupdate = false;
						$scope.downloadButtonText = '下载更新';
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
		$scope.downloading = true;
		$scope.downloadButtonText = '正在更新,请稍候...';
		LibManService.downloadLib();
	};

	/**
	更新完成
	*/
	$scope.$on(AUTH_EVENTS.libcomplete, function(event, data){
		$log.debug('update lib fininshed');
		$scope.downloading = false;
		$scope.downloadButtonText = '没有更新';
		$scope.title = '您用的是最新题库';	
		$scope.noupdate = true;
		$scope.$apply();
	});

	/**
	更新进度
	*/
	$scope.$on(AUTH_EVENTS.libprogress, function(event, data){
		$log.debug(data, Math.round((data / $scope.total) * 100));
		$scope.progress.value = Math.round((data / $scope.total) * 100);
		//更新界面
		$scope.$apply();
	});	
});