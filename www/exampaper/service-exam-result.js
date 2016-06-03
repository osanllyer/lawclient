angular.module('starter.services')
.factory('ExamResultService', function(DB, $log){
	$log.debug('exam result service enter');
	


	return {
		//获取考试结果
		getExamResult : function(){
			var query = "SELECT qa.type as type, qa.id as qid, e.answer as examanswer, qa.answer as answer FROM exam e, question_answer qa WHERE e.qid = qa.id" ;
			return DB.queryForList(query);
		}
	};
});