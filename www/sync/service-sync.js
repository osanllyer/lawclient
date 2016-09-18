/**
*  Module
*
* Description
同步系统模块
将用户数据备份到服务器
将服务器数据同步到用户
*/
angular.module('starter.services')
.factory('SyncService', function($http, ENDPOINTS){
	return {
		//备份到服务器
		syncToServer : function(data){
			$http.post(ENDPOINTS.sync, data);
		},
		//从服务器备份数据
		syncFromServer : function(){
			$http.get(ENDPOINTS.sync, data);
		}
	};
});