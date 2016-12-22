angular.module('starter.controllers')
.controller('BookmarkCtrl', function($scope, $log, BookmarkService){
  $log.debug('enter bookmark ctrl');

  $scope.showDelete = false;

  $scope.toggleShowDelete = function(){
    $scope.showDelete = !$scope.showDelete;
  }

  $scope.deleteBookmark = function(bmId){
    $log.debug('删除bookmark:', bmId);
    BookmarkService.deleteBookmark(bmId);
    //同时更新一下bookmarkList
    for(var i in $scope.bookmarkList){
      if($scope.bookmarkList[i].id == bmId){
        $scope.bookmarkList.splice(i, 1);
        break;
      }
    }
  }

  $scope.bookmarkList = [
    {id:1,law:'民法', chapter:'物权法', segment:'无权概念', description:'dddddd'},
    {id:2,law:'商法', chapter:'经济法', segment:'无权概念', description:'asdfasdfasfd'},
    {id:3,law:'法治理论', chapter:'中国特色', segment:'无权概念', description:'adfadsfa'},
    {id:4,law:'国际法', chapter:'国际经济法', segment:'无权概念', description:'asdfasdf'},
    {id:5,law:'刑法', chapter:'起诉', segment:'无权概念', description:'asdfasdfadsf'}
  ];

  $scope.$on('$ionicView.beforeEnter', function(event, data){
    $log.debug('bookemark before enter');
    //加载列表
    // $scope.bookmarkList = [];

    // var promise = BookmarkService.loadBookmark();
    // promise.then(
    //   function(data){
    //     if(data){
    //       $log.debug('load bookmark ok:', JSON.stringify(data));
    //       $scope.bookmarkList = data;
    //     }
    //   },
    //   function(error){
    //     $log.debug('load bookmark list error:', JSON.stringify(error));
    //   }
    // );

  });

});
