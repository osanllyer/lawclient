angular.module('starter.services')
.factory('RealQASelectorService', function($log, DB){

  $log.debug('RealQASelectorService enter .......');

  function loadRealQA(year, paper) {
    $log.debug('load real progress', year, paper);
    var query = "SELECT qa.id, rp.state, rp.answer FROM question_answer qa LEFT JOIN userdb.real_progress_2 rp ON (qa.id = rp.qid) WHERE qa.emulate = 0 AND qa.paper = ? AND qa.published_at = ? ORDER BY qa.real_seq ASC";
    return DB.queryForList(query, [paper, year]);
  }

  function clearQaHistory(year, paper){
    $log.debug('clear qa history', year, paper);
    var query = "DELETE FROM userdb.real_progress_2 WHERE qid in (SELECT id FROM question_answer WHERE published_at = ? AND paper = ?)";
    return DB.executeWithParams(query, [year, paper]);
  }

  return {
    loadRealQA : loadRealQA,
    clearQaHistory : clearQaHistory
  };

});
