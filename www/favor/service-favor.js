/**
*  Module
*
* Description
*/
angular.module('starter.services')

.factory('FavorService', function(DB, Strings, SyncAction, SyncType, SyncService, $log){

	function syncFavorData(action, qid){
		var data = SyncService.buildCommonData(action, SyncType.FAV, null, {qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	/*构建保存数据*/
	function syncProgressData(action, qid){
		var data = SyncService.buildCommonData(action, SyncType.FAVPROGRESS, null, {qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}


	/*
	同步成功
	*/
	function syncAllSuccessCbk(data){
		$log.debug('success', JSON.stringify(data));
	}

	/*
	同步失败
	*/
	function syncAllErrorCbk(error){
		$log.debug('sycn all favor error', JSON.stringify(error));
	}

	/*
	全量同步
	*/
	function syncAllData(){
		$log.debug('同步所有收藏favor data');
		//首先从服务器下载所有的数据
		SyncService.syncAll(SyncType.FAV, syncAllSuccessCbk, syncAllErrorCbk);

		// var sql = "SELECT qid, last_modified FROM userdb.favorite";
		// var promise = DB.queryForList(sql);
		// promise.then(
		// 	function(data){
		// 		if(data){
		// 			$log.debug('所有收藏数据:', JSON.stringify(data));
		// 			syncFavorData(SyncAction.ALL, data);
		// 		}
		// 	},
		// 	function(error){
		// 		$log.debug('select all fav data error:', JSON.stringify(error));
		// 	}
		// );
	}


	return {
		/**
		加载收藏
		*/
		loadFavorite : function(questionId){
			var query = "SELECT 1 FROM userdb.favorite WHERE qid = " + questionId;
			return DB.queryForObject(query);
		},
		/**
		增加收藏
		*/
		addFavorite : function(questionId){
			var query = "INSERT INTO userdb.favorite(qid) VALUES(" + questionId + ")";
			DB.execute(query);
		},
		/**
		删除收藏
		*/
		removeFavorite : function(questionId){
			var query = "DELETE FROM userdb.favorite WHERE qid = " + questionId;
			DB.execute(query);
		},

		syncAllData : syncAllData, 
		/**
		加载进度
		*/
		loadProgress : function(){
			$log.debug('load favor progress');
			var query = "SELECT qid FROM userdb.favor_progress f, question_answer q WHERE f.qid = q.id AND q.emulate != -1 LIMIT 1";
			return DB.queryForObject(query).then(
				function(data){
					if(data){
						return data.qid;
					}
					return null;
				},
				function(error){
					return null;
				}
			);
		},

		/**
		加载收藏的题目
		*/
		loadQuestions : function(){
			$log.debug('load favorites');
			var query = "SELECT qid FROM userdb.favorite f, question_answer q WHERE f.qid = q.id AND q.emulate != -1 ORDER BY f.last_modified ASC";
			var qidArr = [];
			return DB.queryForList(query, []).then(
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
			$log.debug('save favor progress');
			var query = "DELETE FROM userdb.favor_progress";
			DB.execute(query);
			query = "INSERT INTO userdb.favor_progress(qid) VALUES ({0})";
			DB.execute(Strings.format(query, [qid]));
			// syncProgressData(SyncAction.ADD, qid);
		},

		/**
		将收藏数据同步到服务器
		*/
		syncFavorData : syncFavorData
	};
});