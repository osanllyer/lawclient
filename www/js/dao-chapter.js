angular.module('starter.services.chapterDao', ['ngCordova'])
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
})
.factory('ChapterDao', function($rootScope, DB){
	console.log('chapter dao enter:');
	return {
		/**
		根据id获取题目
		*/
		getQuestion : function(qid){
			var query = "SELECT * FROM question_answer WHERE id = " + qid;
			return DB.queryForObject(query);
		},
		/**
		随机选择两道题，一道是当前题目，另外一道是nextid
		*/
		getMaxMin : function(){
			var query = "SELECT max(id) as max, min(id) as min FROM question_answer";
			return DB.queryForObject(query);
		},
		/**
		获取章节错误题目的统计
		*/
		getErrorQuestionCount : function(chapterid){
			var query = "SELECT count(1) as count FROM practice_stat ps, question_answer qa WHERE ps.question_id = qa.id "
					+ " AND qa.chapter_id =  " + chapterid + " AND ps.error_num > 0";
			return DB.queryForObject(query);
		},
		/**
		获取各题型数量
		*/
		getQuestionTypeCounts : function(chapterid){
			var query = "SELECT type, count(1) as count FROM question_answer WHERE chapter_id = "
					 + chapterid + " GROUP BY type";
			return DB.queryForList(query);
		},
		/**
		获取开始的题目id
		*/
		getChapterStartQuestionId : function(chapterid){
			var query = "SELECT id FROM question_answer WHERE chapter_id = " + chapterid + " order by id asc limit 1";
			return DB.queryForObject(query);
		},	
		getChapterQuestion : function(chapterid, index){
			var res;
			var query = "select * from question_answer where chapter_id = " + chapterid;
			if(index != -1){
				query += " and id = " + index;
			}else{
				query += " order by id asc limit 1"
			}
			return DB.queryForObject(query);			
		},
		getTotalCount : function(chapterid, type){
			var pageQuery = "select count(*) as total from question_answer where chapter_id = " + chapterid;
			if(type != -1){
				pageQuery += " and type = " + type;
			}
			return DB.queryForObject(pageQuery);
		},
		getPrevId : function(chapterid, index, type){
			var prevQuery = "select id from question_answer where id < " + index 
						+ " and chapter_id = " + chapterid ;
			if(type != -1){
				prevQuery += " and type = " + type;
			}
			prevQuery += " order by id desc limit 1";
			return DB.queryForObject(prevQuery);
			
		},
		getNextId : function(chapterid, index, type){
			var nextQuery = "select id from question_answer where id > " + index 
						+ " and chapter_id = " + chapterid;
			if(type != -1){
				nextQuery += " and type = " + type;
			}
			nextQuery += " order by id asc limit 1";
			return DB.queryForObject(nextQuery);
		},
		getErrorQuestion : function(chapterid){
			var query = "select * from practice_stat ps, question_answer q where ps.question_id = q.id and q.chapterid = " + chapterid
				+ " ps.error_num > 0 limit 1";

		},
		/**
		加载收藏
		*/
		loadFavorite : function(questionId){
			var query = "SELECT 1 FROM favorite WHERE qid = " + questionId;
			return DB.queryForObject(query);
		},
		/**
		增加收藏
		*/
		addFavorite : function(questionId){
			var query = "INSERT INTO favorite(qid) VALUES(" + questionId + ")";
			DB.execute(query);
		},
		/**
		删除收藏
		*/
		removeFavorite : function(questionId){
			var query = "DELETE FROM favorite WHERE qid = " + questionId;
			DB.execute(query);
		}
	};
});