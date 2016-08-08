/**
* starter.services l
目前用来读去试卷四点试题
*
* Description
*/
angular.module('starter.services')
.factory('PointService', function($log, DB, Strings){
	$log.debug('point service enter');
	return {
		loadQuestions : function(law){
			$log.debug('point service load questions');
			var query = "SELECT id FROM question_answer WHERE type = 4 AND law_id = {0} ORDER BY published_at DESC";
			var promise = DB.queryForList(Strings.format(query, [law]));
			return promise.then(
				function (data) {
					var arr = [];
					$log.debug('get question ok:');
					if(data){
						for(var i in data){
							arr.push(data[i].id);
						}
					}
					$log.debug('point service questions', JSON.stringify(arr));
					return arr;
				},
				function(error){
					$log.debug('get questions error:', JSON.stringify(error));
					return [];
				}
			);
		},

		loadProgress : function (law) {
			var query = "SELECT question_id FROM point_progress WHERE law_id = {0} LIMIT 1";
			var promise = DB.queryForObject(Strings.format(query, [law]));
			return promise.then(
				function (data) {
					$log.debug('get question ok:', JSON.stringify(data));
					return data == null ? null : data.question_id;
				},
				function(error){
					$log.debug('get questions error:', JSON.stringify(error));
					return null;
				}
			);
		},

		saveProgress : function(qid, law){
			var query = "INSERT OR REPLACE INTO point_progress(law_id, question_id) VALUES ({0}, {1})";	
			DB.execute(Strings.format(query, [law, qid]));
		}
	};
})
;