angular.module('starter.services.chapterDao')
.factory('ProgressDao', function($rootScope, DB, Strings, $log, SyncService, SyncAction, SyncType){
	$log.debug('ProgressDao initialized');

	function syncPracticeProgress(lawid, chapterId, qtype, qid){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.PRACTICEPROGRESS, null, 
				{law_id:lawid, chapter_id:chapterId, type:qtype, qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function syncEventSource(qid, correct){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.EVENT_SOURCE, null, {qid:qid, correct:correct});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function syncProgressStat(qid, correct_num, error_num){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.PRACTICE_STAT, null, 
			{qid:qid, correct_num:correct_num, error_num:error_num});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	return {
		//保存eventsource，用来统计用户每天的学习情况
		savePracticeEventSource : function(qid, correct){
			var sql = "INSERT INTO practice_event_source(qid, correct) VALUES ({0}, {1})";
			sql = Strings.format(sql, [qid, correct ? 1 : 0]);
			DB.execute(sql);

			syncEventSource(qid, correct);

		},
		//读取当前章节的学习进度
		loadChapterProgress: function(lawid, chapterId, type){
			if(chapterId != 0){
				var sql = "SELECT question_id FROM practice_progress where law_id = {0} AND chapter_id = {1} AND type = {2}";
				sql = Strings.format(sql, new Array(lawid, chapterId, type));
			}else{
				var sql = "SELECT question_id FROM practice_progress p, question_answer q WHERE p.chapter_id = 0 AND p.question_id = q.id AND q.law_id = {0} AND p.type = {1}";
				sql = Strings.format(sql, new Array(lawid, type));
			}
			var promise = DB.queryForObject(sql);
			return promise.then(function(data){
				return data != null ? data.question_id : null;
			}, function(error){$log.info(error);})
		},
		//检查是否有未完成的学习进度，用来在进入程序时提示用户, depressed
		loadLastProgress : function(){
			var sql = "select question_id from practice_progress order by last_modified desc limit 1";
			return DB.queryForObject(sql);
		},
		//增加错题
		addProgressStat : function(qid, result){
			var col = result ? 'correct_num' : 'error_num';
			var query = "INSERT OR IGNORE INTO practice_stat(qid, " + col + ") VALUES (" + qid + ", 0)";
			var query2 = "UPDATE practice_stat SET {0} = {0} + 1, last_modified = date('now') WHERE qid = {1}";
			query2 = Strings.format(query2, new Array(col, qid));
			DB.multiTransaction([query, query2], 
				function(data){
					var query = "SELECT * FROM practice_stat WHERE qid = " + qid;
					var promise = DB.queryForObject(query);
					promise.then(
						function(data){
							if(data != null){
								$log.debug('get progress stat data:', JSON.stringify(data));
								syncProgressStat(data.qid, data.correct_num, data.error_num);
							}
						},
						function(error){$log.debug('get practice stat error', JSON.stringify(error));}
					);
				},
				function(error){
					$log.debug('update progress data error:', JSON.stringify(error));
				}
			);

			// SyncService.syncToServer(SyncAction.ADD, SyncType.PRACTICE_STAT, null, );
			// ErrorExamService.syncErrors(SyncAction.ADD, qid);
		},
		//保存进度
		saveProgress : function(lawid, chapterId, qtype, qid){
			var query = "INSERT OR REPLACE INTO practice_progress(law_id, chapter_id, question_id, type) VALUES ({0}, {1}, {2}, {3})";	
			if(chapterId != 0){
				query = Strings.format(query, new Array(lawid, chapterId, qid, qtype));
			}else{
				query = Strings.format(query, new Array(lawid, '0', qid, qtype));
			}

			DB.execute(query);

			syncPracticeProgress(lawid, chapterId, qtype, qid);
		}

	};
});