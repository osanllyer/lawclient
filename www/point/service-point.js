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
})
.filter('outlineFormat', function(){
	//格式化大纲内容
	return function(content){
		var reg = new RegExp('(第?节\s+.*?)\n', 'gim');
		var find = reg.exec(content);
		alert(find);
	};
});
;