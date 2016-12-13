angular.module('starter.controllers')
.controller('SearchCtrl', function($log, $stateParams, $scope, SearchService){
  $log.debug("search keyword:", $stateParams.keyword);

  $scope.currentPos = 0;
  $scope.limit = 20;
  $scope.hasMore = true;

  // 加载更多的搜索结果
  $scope.loadMore = function(){
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  // 检测是否还有更多的搜索结果
  $scope.noMoreData = function() {
    return $scope.hasMore;
  };


  $scope.detailResult = function (itemid) {
    //查看题目详情，应该直接显示一个题目页面，但是不需要显示下面的上一题，下一题按钮什么的，默认展示所有的答案解析等
    //或者在本页面展开显示？
    // $state.go('');
  }
  $scope.results = [{question:'这是测试问题1', choice:'这是选择1', id:1},
      {question:'这是测试问题2', choice:'这是选择2', id:2},
      {question:'这是测试问题3', choice:'这是选择3', id:3},
      {question:'这是测试问题4', choice:'这是选择4', id:4},
      {question:'这是测试问题5', choice:'这是选择5', id:5}];
  $scope.$on('$ionicView.beforeEnter', function(event,data){
    // 进入之前，加载搜索结果，如果有必要，显示正在搜索，离线的一般不需要, 注意高亮
    $scope.data = {};
    $scope.data.keyword = $stateParams.keyword;

    var promise = SearchService.search($scope.keyword, $scope.currentPos, $scope.limit);
    promise.then(
      function(data) {
        $log.debug('load data ok');
        $scope.results = data;
        if(data.length < $scope.limit){
          //没有更多的数据了
          $scope.hasMore = false;
        }
        //停止刷新
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },
      function(error){
        $log.debug('load data error');
        //停止刷新
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  });

});
