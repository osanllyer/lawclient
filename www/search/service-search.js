angular.module('starter.services')
.factory('SearchService', function(DB){

  function search(keyword){
    var sql = "SELECT id, snippet(question), snippet(question) FROM qa_fts WHERE qa_fts match ?";
    return DB.queryForList(sql, [keyword]);
  }

  return {
    search : search
  }
});
