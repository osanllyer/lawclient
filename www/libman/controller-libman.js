/**
*  Module
*题库管理模块
* Description
*/
angular.module('starter.controllers')
.controller('LibManCtrl', function($scope, $log, $rootScope, $ionicHistory, LibManService){

	$log.debug('lib man ctrl enter');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});	

	$scope.updatelog = "";
	
	$scope.noupdate = true;

	var logVerPromise = LibManService.checkLibVersion();
	logVerPromise.then(
		function(data){
			if(data){
				//是新版本
				if(data.version.localeCompare(LibManService.libVersion().version) == 1){
					//有新版本
					$scope.log = data.log;
					$scope.title = '有新版本, 请及时更新!';
					$scope.version = data.version;
					$scope.noupdate = false;

				}else if(data.version.localeCompare(LibManService.libVersion().version) == 0){
					//用户本森是最新版本
					$scope.log = data.log;
					$scope.title = '恭喜！您用的是最新版本!'
					$scope.version = data.version;
					$scope.noupdate = true;

				}else{
					//版本错误。。。
				}
			}
		}, 
		function(error){
			$log.debug(JSON.stringify(error));
		}
	);


	//下载更新
	$scope.downloadLib = function(){
		LibManService.downloadLib();
	};
});