/**
* starter.services l

*
* Description
*/
angular.module('starter.services')
.factory('OutlineService', function($log, DB){

	return {
		loadOutline : function(chapterId){
			var query = "SELECT * FROM chapter_outline WHERE cid = " + chapterId;
			return DB.queryForObject(query);
		}
	};
});
