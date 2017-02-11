angular.module('starter.services')
.factory('RealQASelectorService', function($log, DB){

  $log.debug('RealQASelectorService enter .......');

  function loadRealQA(year, paper) {
    console.log('fuck');
    $log.debug('load real progress', year, paper);
    var query = "SELECT qa.id, rp.state, rp.answer FROM question_answer qa LEFT JOIN userdb.real_progress_2 rp ON (qa.id = rp.qid) WHERE qa.emulate = 0 AND qa.paper = ? AND qa.published_at = ? ORDER BY qa.real_seq ASC";
    var promise = DB.queryForList(query, [paper, year]);
    return promise.then(
      function(data){
        if(data != null){
          return data;
        }else{
          return null;
        }
      },
      function(error){
        $log.info(JSON.stringify(error));
        return null;
    });
  }

  return {
    loadRealQA : loadRealQA
  };

});
