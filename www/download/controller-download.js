/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('DownloadLocalCtl', function($scope, $log, File, DownloadService){

	$log.debug('download local enter');
	$scope.show = 'local';

	$scope.itemClick = function(file){
		//点击了打开按钮
		window.plugins.webintent.startActivity(
			{
				action : window.plugins.webintent.ACTION_VIEW,
				url :  localFile,
				type : 'application/vnd.android.package-archive'
			},
			function(){},
			function(error){}
		);
	};

	//本地
	$log.debug('download local ctrl enter');

	/*
	读取本地文件成功
	*/
	function successCbk(fileEntry){
		$log.debug('read local file dir success:' + JSON.stringify(fileEntry));
		for(i=0; i<fileEntry.length; i++){
			var item = fileEntry[i];
			if(item.isFile){
				//只需要处理文件，目录不需要处理
			}
		}
	}

	/*读取本地文件错误*/
	function errorCbk(error){
		$log.debug('read local file dir error : ' + JSON.stringify(error));
	}

	function onProgress(){

	}

	/*
	item: {url : '文件在服务器端url', downloaded:'是否已经下载', type:'文本还是视频', desc:'说明', path:'本地路径'}
	*/
	$scope.download = function(item){
		//调用下载
		var url = item.url;
		DownloadService.download(
			url,
			onProgress,
			successCbk,
			errorCbk
		);
	}

	/*
	进入之前，先填充文件说明
	*/
	$scope.$on('$ionicView.beforeEnter', function(event, data){
		//获取本地文件列表
		//读取数据库获取目录并和文件目录下的文件对应
		var promise = DownloadService.readLocalFilesDB();
		promise.then(
			function(data){
				//读取成功，和目录中的文件对比，将无效的从下载记录中删除
				if(data){

					File.listDir(cordova.file.externalApplicationStorageDirectory, successCbk, errorCbk);
				}
			},
			function(error){
				$log.debug('read local files db error:', JSON.stringify(error));
			}
		);
	});
})
.controller('DownloadCloudCtl', function($scope, $log, DownloadService){
	//云端
	//是否是云端界面，如果是，现实下载按钮，否则显示打开
	$scope.show = 'cloud';

	$scope.progressMap = {};
	$scope.downloading = {};

	function successCbk(){
		$log.debug("success download files");
		DownloadService.writeLocalDownloadDB();
	}

	function errorCbk(error){
		$log.debug("download files error " + JSON.stringify(error));
	}

	function onProgress(progressEvent){
	    if (progressEvent.lengthComputable) {
			$scope.progressMap[$scope.currentItem.id] = Math.round(progressEvent.loaded / progressEvent.total)*100;
		} else {
			$scope.progressMap[$scope.currentItem.id] += 1;
		}
		//手动调用，否则无法实时更新progress
		$scope.$apply();
	} 

	$scope.progress = function(id){
		return $scope.progressMap[id];
	}

	$scope.itemClick = function(item){

		//无效当前item的下载按钮，设置当前item的progress

		$scope.currentItem = item;
		$scope.downloading[item.id] = true;

		var localFile = cordova.file.externalApplicationStorageDirectory + item.path.substring(item.path.lastIndexOf('/') + 1);

		DownloadService.downloadFile(
			item.path,
			localFile,
			onProgress,	
			successCbk,
			errorCbk
		);
	};
	/*
	进入之前，先填充文件说明
	*/
	$scope.$on('$ionicView.beforeEnter', function(event, data){
		//获取
		var promise = DownloadService.getDownloadFiles();
		promise.then(
			function(data){
				$log.debug('get download files:' + JSON.stringify(data));
				$scope.items = data.data;
			}, 
			function(error){
				$log.debug('get download files error:' + JSON.stringify(error));
			}
		);
	});	
});