angular.module('starter.controllers', ['ngCordova', 'chart.js'])
.controller('BaseExamCtrl', function($scope, Common, ChapterDao, ProgressDao, 
  $stateParams, $cacheFactory, $log, $ionicScrollDelegate, progressQid, qidArr, $ionicHistory, $ionicPopup){

  $scope.init = function(){
    $scope.question = null;
    $scope.choiced = {value : ""};
    $scope.choices = {};
    $scope.showAnalysis = false;
    $scope.answer = null;
    $scope.analysis = null;
    $scope.type = null;
    $scope.fav = false;
    $scope.qid = -1;
    $scope.index = -1;
    $scope.validateResult = false;
    $scope.qidArr = qidArr;
    $scope.total = qidArr.length;
  };

  //需要子controller实现
  $scope.saveProgress = function(){};

  $scope.fillQuestion = function(data){
    //设置显示顶部
    $ionicScrollDelegate.scrollTop();
    //清除选择项
    //关闭显示分析
    $scope.choiced = {value:""};
    $scope.showAnalysis = false;
    //加载数据
    $scope.question = data.question;
    if(data.type == 1 || data.type == 2){
      $scope.choices = { 
        A : { desc : data.a, checked : false},
        B : { desc : data.b, checked : false},
        C : { desc : data.c, checked : false},
        D : { desc : data.d, checked : false}
      };
    }else{
      $scope.choices = {};
    }
    $scope.answer = data.answer;
    $scope.analysis = data.analysis;
    $scope.type = data.type;

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
    if(angular.isDefined($scope.progressQid)){
      $scope.qid = $scope.progressQid;
      $scope.index = Common.findIndex($scope.progressQid, $scope.qidArr);
      if($scope.index == -1){
        $scope.index = 0;
      }
      var promise = ChapterDao.getQuestion($scope.progressQid);
      promise.then(function(data){
        if(data){
          //填充scope数据
          $scope.fillQuestion(data);
        }
      }, function(error){});
    }else{
      //从qidarr获取第一条
      if($scope.qidArr.length > 0){
        $scope.qid = $scope.qidArr[0];
        $scope.index = 0;
        var promise = ChapterDao.getQuestion($scope.qid);
        promise.then(function(data){
          if(data){
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
  $scope.toggleAnalysis = function(){
    $scope.showAnalysis = !$scope.showAnalysis;
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
  判断答案是否正确
  */
  $scope.validateAnswer = function(){
    $scope.validateResult = false;
    if($scope.type >= 3){
      //不是选择题，什么都不做
    }

    if($scope.type == 1){
      //单选题
      $scope.validateResult = $scope.choiced.value.toUpperCase() == $scope.answer.toUpperCase();
    }

    if($scope.type == 2){
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
.controller('ChatsCtrl', function($scope, $log, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $log.debug('chat ctrl enter');
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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
.controller('TabCtrl', function($scope, $ionicPopup, $state, $rootScope){
	$scope.showAbout = function(){
		var aboutPopDlg = $ionicPopup.alert({
			title : '关于',
			content : '司考宝典 2016.<br> 如果您有建议，请联系249532343@qq.com',
			okText : '关闭'
		});
		aboutPopDlg.then(function(res){});
	};
	/**
	登陆逻辑
	*/
	$scope.login = function(){
		if($rootScope.isLogin){
			//如果已经登陆，显示用户信息
			$state.go('tab.user', {});
		}else{
			//如果没有登陆，跳转到登陆页面
			$state.go('tab.login', {});
		}
	};
});