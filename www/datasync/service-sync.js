/**
*  Module
*
* Description
同步系统模块
将用户数据备份到服务器
将服务器数据同步到用户
*/
angular.module('starter.services')
.factory('SyncService', function($http, ENDPOINTS, Common, AuthService){
	return {
		//备份到服务器
		syncToServer : function(data){
			$http.post(ENDPOINTS.syncUrl, data);
		},
		//从服务器备份数据
		syncFromServer : function(){
			$http.get(ENDPOINTS.syncUrl, data);
		},
		/*
		构建一个基本的数据
		*/
		buildCommonData : function(action, type, add_at, item){
			if(add_at == null){
				add_at = Common.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
			}
			var namepasswd = AuthService.loadUserNamePassword();
			if(namepasswd == null){
				return;
			}

			var data = {};

			data.action = action;
			data.type = type;
			data.userid = namepasswd[0];
			data.add_at = add_at;
			data.item = item;
			
			return data;
		},

		/**
		构建发送到服务器的数据
		*/
		buildDataList : function(dataList){
			var data = {};
			data.syncDataList = dataList;
			return data;
		}
	};
});