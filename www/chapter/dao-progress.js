angular.module('starter.services.chapterDao')
.factory('ProgressDao', function($rootScope, DB, Strings){
	console.log('ProgressDao initialized');
	return {
		//读取当前章节的学习进度
		loadChapterProgress: function(chapterId){
			var sql = "select * from practice_progress where chapter_id = " + chapterId;
			return DB.queryForObject(sql);
		},
		//检查是否有未完成的学习进度，用来在进入程序时提示用户
		loadLastProgress : function(){
			var sql = "select * from practice_progress order by last_modified desc limit 1";
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
		}

	};
});