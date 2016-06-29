/**
* starter.services l

*
* Description
*/
angular.module('starter.services')
.factory('BookService', function($log, DB){

	return {
		loadBook : function(chapterId){
			var query = "SELECT * FROM chapter_book WHERE cid = " + chapterId;
			return DB.queryForList(query);
		}
	};
});