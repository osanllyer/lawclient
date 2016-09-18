/**
*  Module
*
* Description
*/
angular.module('starter.services')
.constant('SyncAction', {
	UPDATE : 'update', //更新
	DELETE : 'delete', //删除
	ADD : 'add' //添加
})
.factory('FavorService', function(DB, Strings, SyncAction, SyncService){
	return {

		/**
		加载进度
		*/
		loadProgress : function(){
			var query = "SELECT qid FROM favor_progress LIMIT 1";
			return DB.queryForObject(query).then(
				function(data){
					if(data){
						return data.qid;
					}
					return null;
				},
				function(error){
					return null;
				});
		},

		/**
		加载收藏的题目
		*/
		loadQuestions : function(){
			var query = "SELECT qid FROM favorite ORDER BY last_modified ASC";
			var qidArr = [];
			return DB.queryForList(query).then(
			function(data){
				if(data){
					for(var idx in data){
						qidArr.push(data[idx].qid);
					}
				}
				return qidArr;
			}, 
			function(error){
				$log.debug('load fav qid array error: ', error);
				return [];
			});
		},

		/*保存进度*/
		saveProgress : function(qid){
			var query = "DELETE FROM favor_progress";
			DB.execute(query);
			query = "INSERT INTO favor_progress(qid) VALUES ({0})";
			DB.execute(Strings.format(query, [qid]));
		},

		/*构建保存数据*/
		buildProgressData : function(qid){
			var data = {};
			data.action = SyncAction.UPDATE;
			data.type = 'favprogress';
			data.data = [{qid: qid}];
			return data;
		},

		buildFavorData : function(){
			var data = {};

		},

		/*同步进度*/
		syncProgress : function(qid){
			//只有一道题
			//type update
			var data = buildProgressData(qid);
			SyncService.syncToServer(data);

		},
		
		/*同步收藏列表*/
		syncFavorite : function(){

		},

		/*定时同步数据*/
		syncFavoriteRepeat : function(){

		}
	};
});