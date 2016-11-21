angular.module('starter.services')
.factory('CommentService', function ($log, $http, ENDPOINTS, Common) {
  $log.debug('enter comment service');

  /*
  获取题目的评论
  */
  function getCommentList(qid, from, size){
    return $http.get(Commn.buildUrl(CENDPOINTS.comment, {from:from, size:size}));
  }

  /*
  获取评论和回复
  */
  function getCommentAndReply(commentId, from, size){
    return $http.get(Commn.buildUrl(CENDPOINTS.comment + '/' + commentId, {from:from, size:size}));
  }

  return {
    getCommentAndReply : getCommentAndReply,
    getCommentList : getCommentList
  };

});
