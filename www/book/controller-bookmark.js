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
    $scope.bookmarkDisabled = false;
    var lastReadArr = BookmarkService.loadLastRead();
    if(angular.isUndefined(lastReadArr)){
      //禁止书签标记
      $scope.bookmarkDisabled = true;
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
          if(item != null){
            $scope.lastRead = {
              chapter:item.chapter,
              segment:item.segment,
              cid:parseInt(cid),
              seg_id:parseInt(seg_id),
              law_id:parseInt(item.law_id),
              position:position
            };
          }

        }
      },
      function(error){
        $log.debug('load last book error:', JSON.stringify(error));
      }
    );

  });

});
