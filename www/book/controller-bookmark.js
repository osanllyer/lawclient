angular.module('starter.controllers')
.controller('BookmarkCtrl', function($scope, $log, $state, BookmarkService){
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

  $scope.lastRead = BookmarkService.loadLastRead();

  $scope.gotoSegment = function(bm){
    $log.debug('go to segment', JSON.stringify(bm));
    $state.go('tab.menu.practice.bookentry', {chapterid:bm.cid, lawid:bm.law_id, seg_id:bm.seg_id, position:bm.position, showFooterBar:true, saveProgress:true});
  };

  // $scope.bookmarkList = [
  //   {id:1,law:'民法', chapter:'物权法', segment:'无权概念', description:'dddddd'},
  //   {id:2,law:'商法', chapter:'经济法', segment:'无权概念', description:'asdfasdfasfd'},
  //   {id:3,law:'法治理论', chapter:'中国特色', segment:'无权概念', description:'adfadsfa'},
  //   {id:4,law:'国际法', chapter:'国际经济法', segment:'无权概念', description:'asdfasdf'},
  //   {id:5,law:'刑法', chapter:'起诉', segment:'无权概念', description:'asdfasdfadsf'}
  // ];

  $scope.$on('$ionicView.beforeEnter', function(event, data){
    $log.debug('bookemark before enter');
    //加载列表
    $scope.bookmarkList = [];

    var promise = BookmarkService.loadBookmark();
    promise.then(
      function(data){
        if(data){
          $log.debug('load bookmark ok:', JSON.stringify(data));
          $scope.bookmarkList = data;
        }
      },
      function(error){
        $log.debug('load bookmark list error:', JSON.stringify(error));
      }
    );

    var lastReadArr = BookmarkService.loadLastRead();
    if(angular.isUndefined(lastReadArr)){
      return;
    }
    var cid = lastReadArr[0];
    var seg_id = lastReadArr[1];
    var position = lastReadArr[2]
    var promiseLast = lastReadArr[3];
    promiseLast.then(
      function(data){
        if(data){
          $log.debug('load last book data.......:', JSON.stringify(data));
          var item = data[0];
          $scope.lastRead = {
            chapter:item.chapter,
            segment:item.segment,
            cid:parseInt(cid),
            seg_id:parseInt(seg_id),
            law_id:parseInt(item.law_id),
            position:position
          };
        }
      },
      function(error){
        $log.debug('load last book error:', JSON.stringify(error));
      }
    );

  });

});
