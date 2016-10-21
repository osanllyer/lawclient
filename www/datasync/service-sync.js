/**
*  Module
*
* Description
同步系统模块
将用户数据备份到服务器
将服务器数据同步到用户
*/
angular.module('starter.services')
.factory('SyncService', function($http, ENDPOINTS, Common, SyncAction, AuthService, $log){

	function buildAllData(type, item){

		var namepasswd = AuthService.loadUserNamePassword();
		if(namepasswd == null){
			return;
		}

		var data = {};

		data.action = SyncAction.ALL;
		data.type = type;
		data.userid = namepasswd[0];
		data.item = item;
		
		return data;
	}

	function buildDataList(dataList){
		var data = {};
		data.syncDataList = dataList;
		return data;
	}


	return {
		//备份到服务器
		syncToServer : function(data){
			$http.get(ENDPOINTS.syncurl);
			// $http.post(ENDPOINTS.syncurl, data);
		},
		//从服务器备份数据
		syncFromServer : function(){
			$http.get(ENDPOINTS.syncurl, data);
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

		/*
		构建一个基本的数据, item is list
		*/
		buildAllData : function(type, item){

			var namepasswd = AuthService.loadUserNamePassword();
			if(namepasswd == null){
				return;
			}

			var data = {};

			data.action = SyncAction.ALL;
			data.type = type;
			data.userid = namepasswd[0];
			data.item = item;
			
			return data;
		},		

		/**
		构建发送到服务器的数据
		*/
		buildDataList : buildDataList,

		/*
		同步所有数据到服务器
		*/
		syncAll : function(syncType, successCbk, errorCbk){
			$log.debug('sync all data start');
			var data = buildAllData(syncType, []);
			var promise = $http.post(ENDPOINTS.syncurl, buildDataList([data]));

			promise.then(
				function(response){
					successCbk(response);
				},
				function(error){
					errorCbk(error);
				}
			);

			$log.debug('sync all data end');			
		}
	};
});