/**
* starter.services l

*
* Description
*/
angular.module('starter.services')
.factory('DownloadService', function($log, $http, ENDPOINTS, DB){

	return {
		/*
		url : 下载文件地址
		onProgress : 进程
		success : 下载成功回调函数
		error : 下载错误回调函数
		*/
		downloadFile : function(url, localFile, onProgress, success, error){
			var fileTransfer = new FileTransfer();
			// var uri = encodeURI(url);
			alert(JSON.stringify(fileTransfer));
			var uri = ENDPOINTS.item;
			fileTransfer.onprogress = onProgress;
			fileTransfer.download(
				'http://121.42.193.2:8080/WORD%E7%89%882016%E5%8F%B8%E8%80%83%E8%BE%85%E5%AF%BC%E7%94%A8%E4%B9%A61.doc',
				localFile,
				success,
				error,
				false,
				{}
			);
		},
		getDownloadFiles : function(){
			return $http.get(ENDPOINTS.download);
		},
		/*
		读取已经下载的文件列表
		*/
		readLocalFilesDB : function(){
			var sql = "SELECT * FROM download";
			return DB.queryForList(sql);
		}
	};
});