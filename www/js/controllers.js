angular.module('starter.controllers', ['ngCordova', 'chart.js'])
.controller('BaseExamCtrl', function($scope, Common, ChapterDao, ProgressDao, 
  $stateParams, $cacheFactory, $log, $location, $ionicScrollDelegate, progressQid, qidArr, $ionicHistory, $ionicPopup){

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
    //其他题型不做处理
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
    var favPromise = ChapterDao.loadFavorite(data.id);
    favPromise.then(function(res){
      $scope.fav = res ? true : false; 
    }, function(error){});

    //存储进度
    $scope.saveProgress();
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

    //如果是考试，就在点下一次的时候保存，否则就在提交的时候保存进度
    if($scope.isExampaper){
      $scope.saveCurrentChoice();
    }


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
      ChapterDao.addFavorite($scope.qid);
    }else{
      //删除收藏
      ChapterDao.removeFavorite($scope.qid);
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
    if($scope.type >= 3){
      //不是选择题，什么都不做
    }

    if($scope.type == 2 || $scope.type == 1){
      //多选
      var choicedItem = Array();
      if($scope.choices.A.checked) choicedItem.push('A');
      if($scope.choices.B.checked) choicedItem.push('B');
      if($scope.choices.C.checked) choicedItem.push('C');
      if($scope.choices.D.checked) choicedItem.push('D');

      $scope.validateResult = choicedItem.join("").toUpperCase() == $scope.answer.toUpperCase();
    }

    $scope.toggleAnalysis();
    //如果不是考试
    if(!$scope.isExampaper){
      $scope.saveCurrentChoice();
    }
    //加入统计表格
    ProgressDao.addProgressStat($scope.qid, $scope.validateResult);
    //加入eventsource;
    ProgressDao.savePracticeEventSource($scope.qid, $scope.validateResult);

    //到达最后一题，提示是否清理纪录
    if($scope.index == $scope.total - 1){
      promptRestart();
    }
  };  

})
.controller('DashCtrl', function($scope, $cordovaSQLite, $ionicPopup, $rootScope, Common) {
    //check if there is a unfinished examing or pracice.
    //if true, popup, otherwise donothing
    $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
        template: '您有未完成的练习，是否继续'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
        } else {
         console.log('You are not sure');
       }
     });
    };
    $scope.daysleft = 10;
    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.activeIndex;
      $scope.previousIndex = data.previousIndex;
    });  
})
.controller('MineCtrl', function($scope, lawList, LawService){
  $scope.start = 0;
  $scope.pageSize = 10;
  $scope.data = lawList;
  $scope.loadMore = function(){
    $scope.number += 1;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }
  $scope.search = function(keyword){
	  console.log(LawService.fetchList(keyword));
	  $scope.data = LawService.fetchList(keyword);
  }
})
.controller('LawDetailCtrl', function($scope, law){
	console.log(law);
	$scope.law = law;
})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('TabCtrl', function($scope, $ionicPopup, $state, $rootScope, AuthService, UserService, $log, AUTH_EVENTS){

  $scope.user = UserService.user();

  $scope.goLibMan = function(){
    $state.go('tab.libman', {});
  };

	$scope.showAbout = function(){
    $state.go('tab.about', {});
	};
	/**
	登陆逻辑
	*/
	$scope.login = function(){
		if(AuthService.isAuthenticated){
			//如果已经登陆，显示用户信息
			$state.go('tab.user', {name:UserService.user().username});
		}else{
			//如果没有登陆，跳转到登陆页面
			$state.go('tab.login', {});
		}
	};

  /*退出应用*/
  $scope.exit = function(){
    //在chrome中没啥用，需要测试在模拟其中反应
    if(navigator.app){
      navigator.app.exitApp();
    }else if(navigator.device){
      navigator.device.exitApp();
    }else{

    }
  };

  //收到用户信息更新
  $scope.$on(AUTH_EVENTS.updateUserInfo, function(event, data){
    $log.debug('user info updated:', data);
    $scope.user = UserService.user();
    $log.debug($scope.user);
  });
});