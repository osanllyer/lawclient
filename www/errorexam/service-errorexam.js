angular.module('starter.services')
.factory('ErrorExamService', function(DB, $log, SyncAction, SyncType, SyncService){

	function syncProgress(action, qid, add_at){
		if(qid != null){
			var data = SyncService.buildCommonData(action, SyncType.ERRORPROGRESS, add_at, {qid:qid});
		}else{
			var data = SyncService.buildCommonData(action, SyncType.ERRORPROGRESS, add_at, {});
		}
		var listData = SyncService.buildDataList([data]);
		var promise = SyncService.syncToServer(listData, 1);
		promise.then(
			function(data){
				$log.debug('sync error progres success:', JSON.stringify(data))
			}, 
			function(error){
				$log.error('sync error progerss error', JSON.stringify(error));
			});
	}

	function syncErrors(action, qid, add_at){
		var data = SyncService.buildCommonData(action, SyncType.ERRORS, add_at, {qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	/*
	同步错误进度，如果在表中存在，就发送到服务器，否则从服务器同步下来
	*/
	function syncErrorProgress(){
		var sql = "SELECT * FROM userdb.error_progress";
		var promise = DB.queryForObject(sql);
		promise.then(
			function(data){
				if(data){
					//有数据，将数据发送到服务器
					syncProgress(SyncAction.ADD, data.qid, null);
				}else{
					syncProgress(SyncAction.GET, null, null);
				}
			},
			function(error){
				$log.error('load error progress error:', JSON.stringify(error));
			}
		);
	}

	return {
		saveProgress : function(qid){
			var query = "DELETE FROM userdb.error_progress";
			$log.debug('error exam save progress enter');
			DB.execute(query);
			query = "INSERT INTO userdb.error_progress(qid) VALUES ( " + qid + " )";
			DB.execute(query);
			// syncProgress(SyncAction.ADD, qid, null);
		},

		syncErrors : syncErrors,
		syncErrorProgress : syncErrorProgress,

		getErrorQuestionIds : function(){
			$log.debug('getErrorQuestionIds');
			var query = "SELECT qid FROM userdb.practice_stat ps, question_answer q WHERE q.id = ps.qid AND ps.error_num > 0 AND q.emulate != -1 ";
			var promise = DB.queryForList(query);
			return promise.then(function(data){
				if(data != null){
					var arr = new Array();
					for(var idx in data){
						arr.push(data[idx].qid);
					}
					return arr;
				}else{
					return null;
				}
			}, function(error){$log.debug(error);});
		},
		getErrorProgress : function(){
			$log.debug('getErrorProgress');
			var query = "SELECT qid FROM userdb.error_progress e, question_answer q WHERE e.qid = q.id AND q.emulate != -1";
			var promise = DB.queryForObject(query);
			return promise.then(function(data){
				return (data == null) ? null : data.qid;
			}, function(error){$log.debug(error);});
		},
		getErrorQuestionIdsByChapter : function(lawid, chapterid){
			$log.debug('getErrorQuestionIds by chapter');
			if(chapterid != 0){
				var query = "SELECT qid FROM userdb.practice_stat ps, question_answer qa WHERE qa.emulate != -1 AND ps.qid = qa.id AND ps.error_num > 0 AND qa.chapter_id = " + chapterid;
			}else{
				var query = "SELECT qid FROM userdb.practice_stat ps, question_answer qa WHERE qa.emulate != -1 AND ps.qid = qa.id AND ps.error_num > 0 AND qa.law_id = " + lawid;
			}
			var promise = DB.queryForList(query);
			return promise.then(function(data){
				if(data != null){
					var arr = new Array();
					for(var idx in data){
						arr.push(data[idx].qid);
					}
					return arr;
				}else{
					return null;
				}
			}, function(error){$log.debug(error);});
		}
	};
});