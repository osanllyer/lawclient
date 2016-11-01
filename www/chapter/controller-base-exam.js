angular.module('starter.controllers')
.controller('BaseExamCtrl', function($scope, Common, ChapterDao, ProgressDao, 
  $stateParams, $cacheFactory, $log, $location, $ionicScrollDelegate, progressQid, qidArr, 
  $ionicHistory, $ionicPopup, FavorService){

  $log.debug('base exam ctrl enter');
  $log.debug('progressQid:' + progressQid);

  if(qidArr){
    $scope.history = new Array(qidArr.length);
    // $scope.history.fill(null); 移动浏览器不支持
    for(var idx=0; idx<qidArr.length; idx++){
      $scope.history[idx] = null;
    }
  }
  /*提交之后跳转到答案的anchor*/
  function scrollToAnalysis(){
    $location.hash('analysisAnchor');
    $ionicScrollDelegate.anchorScroll();
  }

  $scope.init = function(){
    $scope.question = null;
    $scope.choices = {};
    $scope.showAnalysis = false;
    $scope.answer = null;
    $scope.analysis = null;
    $scope.type = null;
    $scope.fav = false;
    $scope.qid = -1;
    $scope.index = -1;
    $scope.validateResult = false;
    $scope.progressQid = progressQid;
    $scope.qidArr = qidArr;
    $scope.total = qidArr.length;
    $scope.chapter_level = null;
    //清理history
    $scope.history = new Array(qidArr.length);
    // $scope.history.fill(null); 移动浏览器不支持
    for(var idx=0; idx<qidArr.length; idx++){
      $scope.history[idx] = null;
    }
  };

  $scope.unselectOther = function(choice){
    //只有单选题需要把其他选项取消
    if($scope.type == 1){
      $log.debug('now clicked:', choice);
      for(var k in $scope.choices){
        $log.debug('choice now is K:', k);
        if(k != choice){
          $log.debug(k, ' not checked');
          $scope.choices[k].checked = false;
        }else{
          $log.debug(k, ' checked');
          $scope.choices[k].checked = true;
        }
      }
    }
    //存储答案
    $scope.saveCurrentChoice();    
  }

  //需要子controller实现
  $scope.saveProgress = function(){};

  $scope.fillQuestion = function(data){
    //设置显示顶部
    $ionicScrollDelegate.scrollTop();
    //清除选择项
    //关闭显示分析
    $scope.showAnalysis = false;
    //加载数据
    $scope.question = data.question;
    if(data.type == 1 || data.type == 2 || data.type == 3){
      $scope.choices = { 
        A : { desc : data.a, checked : false},
        B : { desc : data.b, checked : false},
        C : { desc : data.c, checked : false},
        D : { desc : data.d, checked : false}
      };
    }else{
      $scope.choices = {};
    }

    $scope.type = data.type;
    $scope.chapter_level = data.chapter_level;
    //如果存在当前学习
    if($scope.history[$scope.index] != null){
      //设置选择的答案
      $scope.choices = $scope.history[$scope.index];
      if(!$scope.isExampaper){
        $scope.showAnalysis = true;
      }
    }

    $scope.answer = data.answer;
    $scope.analysis = data.analysis;
    $scope.point = data.point;

    switch($scope.type){
      case 1:
        $scope.questionDesc = '单项选择题';
        break;
      case 2:
        $scope.questionDesc = '多项选择题';
        break;
      case 3:
        $scope.questionDesc = '不定项选择题';
        break;
      case 4:
        $scope.questionDesc = '简述论述题';
        break;
    }

    //收藏功能
    var favPromise = FavorService.loadFavorite(data.id);
    favPromise.then(function(res){
      $scope.fav = res ? true : false; 
    }, function(error){});

    //存储进度
    $scope.saveProgress();
  };

    /*
    左右滑动
    */
    $scope.swipe = function(direction){
      $log.debug('swipe:', direction);
      switch(direction){
        case 'left':
          $scope.nextQuestion();
          break;
        case 'right':
          $scope.prevQuestion();
          break;
        default:
          break;
      }
    };

  $scope.prevQuestion = function(){

    if($scope.index > 0){
      $scope.index -= 1;
    }else{
      //do nothing
      return;
    }
    $scope.qid = $scope.qidArr[$scope.index];

    var questionPromise = ChapterDao.getQuestion($scope.qid);
    questionPromise.then(function(data){
      if(data){
        // alert(JSON.stringify(data));
        $scope.fillQuestion(data);
      }
    }, function(error){
      $log.debug(error);
    });
  };

  $scope.nextQuestion = function(){
    $log.debug('next question');

    if($scope.index < $scope.qidArr.length - 1){
      $scope.index += 1;
    }else{
      return;
    }
    $scope.qid = $scope.qidArr[$scope.index];

    var questionPromise = ChapterDao.getQuestion($scope.qid );
    questionPromise.then(function(data){
      if(data){
        $scope.fillQuestion(data);
      }
    }, function(error){
      $log.debug(error);
    });
  };

  //加载问题
  $scope.loadQuestion = function(){
    //存在进度
    if(angular.isDefined($scope.progressQid) && $scope.progressQid != null){
      $log.debug('defined progressQid:' + $scope.progressQid);
      $scope.qid = $scope.progressQid;
      $scope.index = Common.findIndex($scope.progressQid, $scope.qidArr);
      //确保是数字，否则有可能导致index错误
      $scope.index -= 0;
      if($scope.index == -1){
        $scope.index = 0;
      }
      var promise = ChapterDao.getQuestion($scope.qid);
      promise.then(function(data){
        if(data){
          //填充scope数据
          $scope.fillQuestion(data);
        }
      }, function(error){});
    }else{
      //从qidarr获取第一条
      $log.debug('load question qid arr', JSON.stringify($scope.qidArr));
      if($scope.qidArr.length > 0){
        $scope.qid = $scope.qidArr[0];
        $scope.index = 0;
        var promise = ChapterDao.getQuestion($scope.qid);
        promise.then(function(data){
          if(data){
            $log.debug(JSON.stringify(data));
            //填充scope数据
            $scope.fillQuestion(data);
          }
        }, function(error){});
      }else{
      //没有数据，提示用户，然后返回上一层
        $ionicPopup.alert({
          title : '提示',
          template : '还没有数据哦',
          okText : '返回',
        }).then(function(res){
          $ionicHistory.goBack();
        });
      }
    }
  };

  $scope.isShowAnalysis = function(){
    return $scope.showAnalysis;
  };
  //点击提交
  $scope.toggleAnalysis = function(){
    $scope.showAnalysis = true;
    scrollToAnalysis();
  };

  //保存当前题目的选项，用来返回时查看
  $scope.saveCurrentChoice = function(){
      $scope.history[$scope.index] = $scope.choices;
  };

  
  $scope.toogleFavorite = function(){
    //reverse the fav state
    $scope.fav = !$scope.fav;
    if($scope.fav){
      //增加收藏
      FavorService.addFavorite($scope.qid);
    }else{
      //删除收藏
      FavorService.removeFavorite($scope.qid);
    }
  };  

  /**
  如果到达最后一题，提醒用户是否清空记录重新开始
  */
  function promptRestart (){
    var reComfirm = $ionicPopup.confirm(
      {
        title:'提示',
        template:'您已经完成最后一题，是否清除纪录重新开始？'
      });

    reComfirm.then(function(res){
      if(res){
        //清除纪录，重新开始
        $scope.init();
        //没有纪录了
        $scope.progressQid = null;
        $scope.loadQuestion();
      }else{
        //do nothing
      }
    });
  }

  /**
  判断答案是否正确
  */
  $scope.validateAnswer = function(){
    $scope.validateResult = false;
    if($scope.type >= 4){
      //不是选择题，什么都不做
    }

    if($scope.type == 2 || $scope.type == 1 || $scope.type == 3){
      //多选
      var choicedItem = Array();
      if($scope.choices.A.checked) choicedItem.push('A');
      if($scope.choices.B.checked) choicedItem.push('B');
      if($scope.choices.C.checked) choicedItem.push('C');
      if($scope.choices.D.checked) choicedItem.push('D');

      $scope.validateResult = choicedItem.join("").toUpperCase() == $scope.answer.toUpperCase();
    }

    $scope.toggleAnalysis();

    //加入统计表格
    ProgressDao.addProgressStat($scope.qid, $scope.validateResult);
    //加入eventsource;
    ProgressDao.savePracticeEventSource($scope.qid, $scope.validateResult);

    //到达最后一题，提示是否清理纪录
    if($scope.index == $scope.total - 1){
      promptRestart();
    }
  };  
});