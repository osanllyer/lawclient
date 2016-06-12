angular.module('starter.services.chapterDao')
.factory('ProgressDao', function($rootScope, DB, Strings, $log){
	$log.debug('ProgressDao initialized');
	return {
		//保存eventsource，用来统计用户每天的学习情况
		savePracticeEventSource : function(qid, correct){
			var sql = "INSERT INTO practice_event_source(qid, correct) VALUES ({0}, {1})";
			sql = Strings.format(sql, [qid, correct ? 1 : 0]);
			DB.execute(sql);
		},
		//读取当前章节的学习进度
		loadChapterProgress: function(chapterId, type){
			var sql = "SELECT question_id FROM practice_progress where chapter_id = {0} AND type = {1}";
			sql = Strings.format(sql, new Array(chapterId, type));
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
			DB.execute(query);
			query = "UPDATE practice_stat SET {0} = {0} + 1, last_modified = date('now') WHERE qid = {1}";
			query = Strings.format(query, new Array(col, qid));
			DB.execute(query);
		},
		//保存进度
		saveProgress : function( chapterId, qtype, qid){
			var query = "INSERT OR IGNORE INTO practice_progress(chapter_id, question_id, type) VALUES ({0}, {1}, {2})";
			query = Strings.format(query, new Array(chapterId, qid, qtype));
			DB.execute(query);
		}

	};
});