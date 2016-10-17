angular.module('starter.services')
.factory('ChapterDao', function($rootScope, DB, $log, Strings){
	$log.debug('chapter dao enter:');
	return {

		//章节页面统计信息
		errorStat : function(lawid, chapterid){
			if(chapterid != 0){
				var query = "SELECT sum(correct_num) as cn, sum(error_num) as en FROM userdb.practice_stat ps, question_answer qa " + 
						" WHERE ps.qid = qa.id AND qa.emulate != -1 and qa.chapter_id = " + chapterid;
			}else{
				var query = "SELECT sum(correct_num) as cn, sum(error_num) as en FROM userdb.practice_stat ps, question_answer qa " + 
						" WHERE ps.qid = qa.id AND qa.emulate != -1 and  qa.law_id = " + lawid;
			}

			return DB.queryForObject(query);
		},

		loadChapterTypeQuestions : function(lawid, chapterId, qtype){
			var promise;
			if(chapterId != 0){
				var query = "SELECT id FROM question_answer qa WHERE chapter_id = ? AND type = ? AND emulate != -1";
				// query = Strings.format(query, new Array(chapterId, qtype));
				promise = DB.queryForList(query, [chapterId, qtype]);
			}else{
				var query = "SELECT id FROM question_answer qa WHERE law_id = ? AND type = ? AND emulate != -1";
				// var query = "SELECT id FROM question_answer WHERE  emulate != -1";

				promise = DB.queryForList(query, [lawid, qtype]);
			}
			// var promise = DB.queryForList(query);
			return promise.then(
				function(data){
					$log.debug('loadChapterTypeQuestions ok', JSON.stringify(data));
					var arr = [];
					if(data){
						for(var idx in data){
							arr.push(data[idx].id);
						}
					}
					return arr;
				}, function(error){
					$log.debug('loadChapterTypeQuestions error', JSON.stringify(error));
					return [];
				}
			);
		},
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
			var result = DB.queryForObject(query);
			return result.then(function(data){
				return data;
			}, function(error){});
		},
		/**
		获取章节错误题目的统计
		*/
		getErrorQuestionCount : function(lawid, chapterid){
			if(chapterid != 0){
				var query = "SELECT count(1) as count FROM userdb.practice_stat ps, question_answer qa WHERE ps.qid = qa.id "
					+ " AND qa.chapter_id = " + chapterid + " AND ps.error_num > 0 AND qa.emulate != -1";
			}else{
				var query = "SELECT count(1) as count FROM userdb.practice_stat ps, question_answer qa WHERE ps.qid = qa.id "
					+ " AND qa.law_id = " + lawid + " AND ps.error_num > 0 AND qa.emulate != -1";
			}
			return DB.queryForObject(query);
		},
		/**
		获取各题型数量
		*/
		getQuestionTypeCounts : function(lawid, chapterid){
			var query = "SELECT type, count(1) as count FROM question_answer WHERE chapter_id = "
					 + chapterid + " AND emulate != -1 GROUP BY type";
			
			if (chapterid == 0){
				query = "SELECT type, count(1) as count FROM question_answer WHERE law_id = "
					 + lawid + " AND emulate != -1 GROUP BY type";
			}
			return DB.queryForList(query);
		},
		/**
		获取开始的题目id
		*/
		getChapterStartQuestionId : function(chapterid){
			var query = "SELECT id FROM question_answer WHERE chapter_id = " + chapterid + " AND emulate != -1 order by id asc limit 1";
			return DB.queryForObject(query);
		},	

		getChapterQuestion : function(chapterid, index){
			var res;
			var query = "select * from question_answer where chapter_id = " + chapterid + " AND emulate != -1 ";
			if(index != -1){
				query += " and id = " + index;
			}else{
				query += " order by id asc limit 1"
			}
			return DB.queryForObject(query);			
		},
		getTotalCount : function(chapterid, type){
			var pageQuery = "select count(*) as total from question_answer where chapter_id = " + chapterid + " AND emualte != -1 ";
			if(type != -1){
				pageQuery += " and type = " + type;
			}
			return DB.queryForObject(pageQuery);
		},
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
			$log.debug('add favorite:', questionId);
			var query = "INSERT INTO userdb.favorite(qid) VALUES(" + questionId + ")";
			DB.execute(query);
		},
		/**
		删除收藏
		*/
		removeFavorite : function(questionId){
			var query = "DELETE FROM userdb.favorite WHERE qid = " + questionId;
			DB.execute(query);
		}
	};
});