angular.module('starter.services')
.factory('BookmarkService', function($log, DB){
  $log.debug('enter bookmark service');

  //加载书签列表
  function loadBookmark(){
    var sql = "SELECT * FROM userdb.bookmark where status =1 ORDER by last_modified DESC";
    return DB.queryForList(sql);
  }

  //删除书签
  function deleteBookmark(bmId){
    var sql = "DELETE FROM userdb.bookmark WHERE id = " + bmId;
    DB.execute(sql);
  }

  // 增加书签
  function addBookmark(law, chapter, segment, law_id, chapter_id, seg_id, description, position){
    var sql = "INSERT INTO userdb.bookmark(law, chapter, segment, law_id, chapter_id, seg_id, description, position) VALUES(?,?,?,?,?,?,?,?)"
    DB.executeWithParams(sql, [law, chapter, segment, law_id, chapter_id, seg_id, description, position]);
  }

  return {
    loadBookmark : loadBookmark,
    deleteBookmark : deleteBookmark,
    addBookmark : addBookmark
  };

});
