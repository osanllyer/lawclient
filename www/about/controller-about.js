angular.module('starter.controllers')
.controller('AboutCtrl', function($scope, $log, $ionicPopup, $rootScope, $ionicHistory, $http, $cordovaFileTransfer, $cordovaFileOpener2, AboutService, Confs){
	$log.debug('enter about ctrl');

	$log.debug($ionicHistory.backView());
	$log.debug($ionicHistory.currentView());

	$scope.hasNewVersion = false;

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	//显示版本信息
	$scope.showVersionInfo = function(){
		if($scope.hasNewVersion){
			var popup = $ionicPopup.alert({
				title : '版本信息',
				template : $scope.versionInfo,
				okText : '关闭'
			});
		}
	};

	$scope.checkUpdate = function(){
		var promise = AboutService.checkAppVersion();
		promise.then(
			function(data){
				//有新版本
				if(data && data.version.localeCompare($rootScope.appVersion) == 1){
					$scope.hasNewVersion = true;
					$scope.appVersion = data.version;
					$scope.log = data.log;
					$scope.path = data.path;
					if(!$rootScope.isAndroid){
						$scope.downloadBtnText = "请前往AppStore进行更新";
					}else{
						$scope.downloadBtnText = "下载更新";
					}
				}else{
					//没有新版本
					$scope.hasNewVersion = false;
					$scope.downloadBtnText = "没有更新";
				}
			},
			function(error){
				$scope.hasNewVersion = false;
				$scope.downloadBtnText = "没有更新";
				$log.debug(error);
			}
		);
	};

	$scope.progress = {max :100, value:0};

	$scope.checkUpdate();

	$scope.downloadLibAlert = function(){
		var alertPop = $ionicPopup.alert({
			title : '下载提示',
			template : '请前往百度助手或应用宝搜索司考在线'
		});
		alertPop.then(function(res){
			$log.debug('close ');
		});
	}

  //因为速度太慢，所以建议跳转到appstore下载
	$scope.downloadLib = function(){
		if($rootScope.isAndroid){
			$scope.downloading = true;
			$scope.downloadBtnText = "正在下载更新，请稍候...";

			var filename = $scope.path.substring($scope.path.lastIndexOf('/') + 1);

			var localFile = cordova.file.externalApplicationStorageDirectory + filename;
			var fileTransfer = new FileTransfer();
			var uri = encodeURI($scope.path);
			fileTransfer.onprogress = function(progressEvent){
				    if (progressEvent.lengthComputable) {
	        			$scope.progress.value = Math.round(progressEvent.loaded / progressEvent.total)*100;
	    			} else {
	        			$scope.progress.value += 1;
	   				}
	   				//手动调用，否则无法实时更新progress
	   				$scope.$apply();
			};
			fileTransfer.download(
				uri,
				localFile,
				function(entry){
					$scope.downloading = false;
					$log.debug('success', entry.toURL(), entry.fullPath);
					window.plugins.webintent.startActivity(
						{
							action : window.plugins.webintent.ACTION_VIEW,
							url :  localFile,
							type : 'application/vnd.android.package-archive'
						},
						function(){},
						function(error){alert('安装失败，请重新安装:' + JSON.stringify(error));}
					);
				},
				function(error){
					$log.debug('下载升级包错误', JSON.stringify(error), error.source, error.target, error.code);
					alert('下载升级包错误:' + error.code);
				},
				false,
				{}
			);
			//is android end
		}else{
			//other platform
			// cordova.InAppBrowser.open("https://itunes.apple.com/us/app/temple-run/id420009108", "_system");
		}
	};
});
