/**
* starter.services l

*
* Description
*/
angular.module('starter.services')
.factory('BookService', function($log, DB, AuthService){

	var CACHE_KEY = 'book_seg';
	var DEFAULT_USER = 'default';

	return {
		saveSegmentCache : function (chapter_id, seg) {
			var username = AuthService.username();
			if(username != null){
				window.localStorage.setItem(username + '_' + chapter_id + '_' + CACHE_KEY, seg);
			}else{
				window.localStorage.setItem(DEFAULT_USER + '_' + chapter_id + '_' + CACHE_KEY, seg);
			}
		},
		loadSegmentCache : function (chapter_id) {
			var username = AuthService.username();
			var seg = null;
			if(username != null){
				seg = window.localStorage.getItem(username + '_' + chapter_id + '_' + CACHE_KEY);
			}else{
				seg = window.localStorage.getItem(DEFAULT_USER + '_' + chapter_id + '_' + CACHE_KEY);
			}
			return seg;
		},
		loadBook : function(chapterId){
			var query = "SELECT * FROM chapter_book WHERE cid = " + chapterId;
			return DB.queryForList(query);
		}
	};
});
