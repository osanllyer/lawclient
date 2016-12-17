angular.module('starter.services')
.factory('SearchService', function($log, DB, $rootScope){

  function search(keyword, offset, limit, searchType){
    if(searchType == "1"){
      return search_qa(keyword, offset, limit);
    }else if (searchType == "2") {
      return search_book(keyword, offset, limit);
    }else{
      //法规搜索，暂时没做法律
    }
  }

  function search_qa(keyword, offset, limit){
    $log.debug( keyword, offset, limit );
    var sql = "SELECT id, snippet(qa_fts) as question, published_at, paper, real_seq FROM qa_fts WHERE question match ? LIMIT ?, ?";
    return DB.queryForList(sql, [keyword, offset, limit]);
  }

  function search_book(keyword, offset, limit){
    $log.debug( 'search book:', keyword, offset, limit );
    var sql = "SELECT cid, seg_id, chapter_name, law_name, seg_title FROM book_fts WHERE book_fts match ? LIMIT ?, ?";
    return DB.queryForList(sql, [keyword, offset, limit]);
  }

  // 创建索引, 不能每次都创建，需要在localstorage中存储一下是否已经创建都标志，另外在主库建最好，升级的时候会自动删除索引，和题库保持同步
  //苹果对icu支持不好，可能需要使用unicode61这种tokenize
  function buildIndex(success, error){
      if($rootScope.isAndroid){
        //创建题库索引
        var sql_create = "CREATE VIRTUAL TABLE IF NOT EXISTS qa_fts  using fts4(id, question, published_at, real_seq, paper, tokenize=icu zh_CN)";
        var sql_build = "INSERT INTO qa_fts(id, question, published_at, real_seq, paper) SELECT id, question, published_at, real_seq, paper FROM question_answer where emulate != -1";
        //创建书籍索引
        var sql_book_create = "CREATE VIRTUAL TABLE IF NOT EXISTS book_fts using fts4(law_name, cid, chapter_name, seg_id, seg_title, tokenize=icu zh_CN)";
        var sql_book_build = "INSERT INTO book_fts(law_name, cid, chapter_name, seg_id, seg_title) SELECT l.name as law_name, c.id as cid, c.name as chapter_name, s.seg_id, s.seg_title FROM law l, law_chapter c, chapter_book s WHERE l.id = c.law_id AND s.cid = c.id";
        // DB.multiTransaction([sql_book_create], success, error);
      }else{
        //创建题库索引
        var sql_create = "CREATE VIRTUAL TABLE IF NOT EXISTS qa_fts  using fts4(id, question, published_at, real_seq, paper, tokenize=unicode61)";
        var sql_build = "INSERT INTO qa_fts(id, question, published_at, real_seq, paper) SELECT id, question, published_at, real_seq, paper FROM question_answer where emulate != -1";
        //创建书籍索引
        var sql_book_create = "CREATE VIRTUAL TABLE IF NOT EXISTS book_fts using fts4(law_name, cid, chapter_name, seg_id, seg_title, tokenize=unicode61)";
        var sql_book_build = "INSERT INTO book_fts(law_name, cid, chapter_name, seg_id, seg_title) SELECT l.name as law_name, c.id as cid, c.name as chapter_name, s.seg_id, s.seg_title FROM law l, law_chapter c, chapter_book s WHERE l.id = c.law_id AND s.cid = c.id";
        // DB.multiTransaction([sql_book_create], success, error);
      }
      DB.multiTransaction([sql_create, sql_build, sql_book_create, sql_book_build], success, error);
  }

  return {
    search : search,
    buildIndex : buildIndex
  }
});
