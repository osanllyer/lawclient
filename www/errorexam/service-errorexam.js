angular.module('starter.services')
.factory('ErrorExamService', function(DB, $log){
	return {
		saveProgress : function(qid){
			var query = "DELETE FROM error_progress";
			DB.execute(query);
			query = "INSERT INTO error_progress(qid) VALUES ( " + qid + " )";
			DB.execute(query);
		},
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
		getErrorQuestionIdsByChapter : function(chapterid){
			$log.debug('getErrorQuestionIds by chapter');
			var query = "SELECT qid FROM practice_stat ps, question_answer qa WHERE ps.qid = qa.id AND ps.error_num > 0 AND qa.chapter_id = " + chapterid;
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