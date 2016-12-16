angular.module('starter.controllers')
.controller('SearchCtrl', function($log, $stateParams, $scope, $state, SearchService){
  $log.debug("search keyword:", $stateParams.keyword, $stateParams.searchType);
  $scope.search = function(offset){
    if(offset == 0){
      //新的搜索
      $scope.currentPos = 0;
      $scope.results = [];
      $scope.hasMore = true;
    }
    var promise = SearchService.search($scope.data.keyword, offset, $scope.limit, $scope.searchType);
    promise.then(
      function(data) {
        $log.debug('load data ok', JSON.stringify(data));
        //高亮处理，需要将默认的三个...的高亮去除
        for(var i in data){
          //前面一次，后面一次，有点难看
          data[i].question = data[i].question.replace("<b>...</b>", "...");
          data[i].question = data[i].question.replace("<b>...</b>", "...");
          $scope.results.push(data[i]);
        }

        if(data.length < $scope.limit){
          //没有更多的数据了
          $log.debug('lengt < limit:', data.length, $scope.limit);
          $scope.hasMore = false;
        }
        //设置当前位置
        $scope.currentPos = offset + data.length;
        //停止刷新
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },
      function(error){
        $log.debug('load data error');
        //停止刷新
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  };

  // 加载更多的搜索结果
  $scope.loadMore = function(){
    $scope.search($scope.currentPos);
    // $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  // 检测是否还有更多的搜索结果
  $scope.noMoreData = function() {
    return $scope.hasMore;
  };


  $scope.detailResult = function (itemid) {
    $log.debug('go to detail result:', itemid);
    //需要根据搜索类型，显示不同的页面
    //题目搜索 searchtype = 1
    if($scope.searchType == "1"){
      $log.debug('to to qa res type page:', $scope.searchType);
      //查看题目详情，应该直接显示一个题目页面，但是不需要显示下面的上一题，下一题按钮什么的，默认展示所有的答案解析等
      $state.go('tab.menu.practice.search.qares', {qid:itemid});
    }else if($scope.searchType == "2"){
      //书籍搜索 searchtype = 2
      // $state.go('tab.menu.practice.');
    }else{
      //法律法规搜索
    }
  }
  // $scope.results = [{question:'这是测试问题1', choice:'这是选择1', id:1},
  //     {question:'这是测试问题2', choice:'这是选择2', id:2},
  //     {question:'这是测试问题3', choice:'这是选择3', id:3},
  //     {question:'这是测试问题4', choice:'这是选择4', id:4},
  //     {question:'这是测试问题5', choice:'这是选择5', id:5}];
  $scope.$on('$ionicView.beforeEnter', function(event,data){

    $log.debug('enter search result page:', $stateParams.searchType, $stateParams.keyword);
    // 进入之前，加载搜索结果，如果有必要，显示正在搜索，离线的一般不需要, 注意高亮
    $scope.results = [];
    $scope.data = {};
    $scope.data.keyword = $stateParams.keyword;
    $scope.currentPos = 0;
    $scope.limit = 20;
    $scope.hasMore = true;
    $scope.searchType = $stateParams.searchType;
    function success(data){
      $log.debug('build virtual table ok');
      //写入localstorage
      window.localStorage.setItem('key_build', true);
      $scope.search(0);
    }

    function error(error){
      $log.debug('create fts table and build error', JSON.stringify(error));
    }

    //首先检查是否已经建了索引，如果没有建，首先建立索引
    var builded = window.localStorage.getItem('key_build');
    if(builded == null){
      //建立索引,完成之后回调
      SearchService.buildIndex(success, error);
    }else{
      //查找
      $scope.search(0);
    }

  });

});
