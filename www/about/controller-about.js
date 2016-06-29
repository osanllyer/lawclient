angular.module('starter.controllers')
.controller('AboutCtrl', function($scope, $log, $ionicPopup, $rootScope, $http, $cordovaFileTransfer, $cordovaFileOpener2, AboutService, Confs){
	$log.debug('enter about ctrl');

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
				}else{
					//没有新版本
					$scope.hasNewVersion = false;
				}
			}, 
			function(error){
				$log.debug(error);
			}
		);
	};

	$scope.progress = {max :100, value:0};

	$scope.checkUpdate();

	$scope.downloadLib = function(){
		$scope.downloading = true;

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
	};

	// $scope.downloadLib = function(){
	// 	var localFile = 'cdvfile://localhost/persistent/a.apk';
	// 	var uri = encodeURI("http://app.sfks360.com/android-armv7-debug.apk");
	// 	$cordovaFileTransfer.download(
	// 		uri,
	// 		localFile,
	// 		{},
	// 		true
	// 	).then(
	// 		function(entry){
	// 			$log.debug('success', entry.toURL(), entry.fullPath);
	// 			cordova.plugins.fileOpener2.open(
	// 			   localFile,
	// 			    'application/vnd.android.package-archive',
	// 				{
	// 					error: function(error){alert(JSON.stringify(error));}, 
	// 					success : function(){alert('ok');}
	// 				}
	// 			);
	// 		},
	// 		function(error){
	// 			$log.debug('下载升级包错误', JSON.stringify(error), error.source, error.target, error.code);
	// 			alert('下载升级包错误:' + error.code);
	// 		},
	// 		function(progress){}
	// 	);
	// };

});