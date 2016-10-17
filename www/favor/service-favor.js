/**
*  Module
*
* Description
*/
angular.module('starter.services')
.factory('FavorService', function(DB, Strings, $log){
	return {

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
		}
	};
});