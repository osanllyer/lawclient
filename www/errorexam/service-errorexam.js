angular.module('starter.services')
.factory('ErrorExamService', function(DB, $log, SyncAction, SyncType, SyncService){

	function syncProgress(action, qid, add_at = null){
		var data = SyncService.buildCommonData(action SyncType.ERRORPROGRESS, add_at, {qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function syncErrors(action, qid, add_at = null){
		var data = SyncService.buildCommonData(action, SyncType.ERRORS, add_at, {qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	return {
		saveProgress : function(qid){
			var query = "DELETE FROM error_progress";
			DB.execute(query);
			query = "INSERT INTO error_progress(qid) VALUES ( " + qid + " )";
			DB.execute(query);
			syncProgress(SyncAction.ADD, qid);
		},

		syncErrors : syncErrors,

		getErrorQuestionIds : function(){
			$log.debug('getErrorQuestionIds');
			var query = "SELECT qid FROM practice_stat WHERE error_num > 0";
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
			var query = "SELECT qid FROM error_progress";
			var promise = DB.queryForObject(query);
			return promise.then(function(data){
				return (data == null) ? null : data.qid;
			}, function(error){$log.debug(error);});
		},
		getErrorQuestionIdsByChapter : function(lawid, chapterid){
			$log.debug('getErrorQuestionIds by chapter');
			if(chapterid != 0){
				var query = "SELECT qid FROM practice_stat ps, question_answer qa WHERE ps.qid = qa.id AND ps.error_num > 0 AND qa.chapter_id = " + chapterid;
			}else{
				var query = "SELECT qid FROM practice_stat ps, question_answer qa WHERE ps.qid = qa.id AND ps.error_num > 0 AND qa.law_id = " + lawid;
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