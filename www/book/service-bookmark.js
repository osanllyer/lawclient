angular.module('starter.services')
.factory('BookmarkService', function($log, DB, AuthService){
  $log.debug('enter bookmark service');

  var BM_KEY = "bm";

  //同步书签
  function syncBookmark(){
    $log.debug('sync bookmark');
    //获取一个同步的时间戳，如果本地没有，那么上传所有数据，如果有，那么上传时间戳之后的数据
    var username = AuthService.username();
    if(angular.isUndefined(username)){
      $log.debug('not login, sync bookmark stopped');
      return;
    }
    var timeStamp = window.localStorage.getItem(username + BM_KEY);
    if(angular.isDefined(timeStamp)){
      //同步过数据
    }else{
      //没有同步过
    }
  }

  //加载书签列表，需要加载law，chapter名称
  function loadBookmark(){
    var sql = 'SELECT bm.id, l.id as law_id, l.name as law, c.name as chapter, bm.seg_id, cb.seg_title as segment, bm.cid, bm.description, bm.position FROM bookmark bm, law l, law_chapter c, chapter_book cb where bm.status =1 AND bm.cid = cb.cid AND bm.seg_id = cb.seg_id AND cb.cid = c.id AND c.law_id = l.id ORDER by bm.last_modified DESC';
    return DB.queryForList(sql);
  }

  //删除书签
  function deleteBookmark(bmId){
    var sql = "DELETE FROM userdb.bookmark WHERE id = " + bmId;
    DB.execute(sql);
  }

  // 增加书签
  function addBookmark(data){
    var sql = "INSERT INTO userdb.bookmark(cid, seg_id, description, position) VALUES(?,?,?,?)"
    DB.executeWithParams(sql, [data.cid, data.seg_id, data.description, data.position]);
  }

  function saveLastRead(cid, sid, position){
    var username = AuthService.username();
    if(angular.isUndefined(username)){
      username = 'default';
    }
    window.localStorage.setItem(username + '_book_read', cid + '_' + sid + '_' + position);
  }

  //从缓存中加载，不存储在
  function loadLastRead(){
    var username = AuthService.username();
    if(angular.isUndefined(username)){
      username = 'default';
    }
    var lastReadBm = window.localStorage.getItem(username + '_book_read');
    // $log.debug('load lastrest from cache:', lastReadBm);
    if(angular.isDefined(lastReadBm)){
      var bmArr = lastReadBm.split('_');
      var cid = bmArr[0];
      var seg_id = bmArr[1];
      var position = bmArr[2];
      // $log.debug('splited bookmark cache', cid, seg_id, position);
      var sql = "SELECT l.id as law_id, l.name as law, c.name as chapter, cb.seg_title as segment FROM law l, law_chapter c, chapter_book cb WHERE l.id = c.law_id AND c.id = cb.cid and cb.cid = ? AND cb.seg_id = ? ";
      var promise = DB.queryForList(sql, [cid, seg_id]);
      return [cid, seg_id, position, promise];
    }
  }

  return {
    loadBookmark : loadBookmark,
    deleteBookmark : deleteBookmark,
    addBookmark : addBookmark,
    loadLastRead : loadLastRead,
    saveLastRead : saveLastRead
  };

});
