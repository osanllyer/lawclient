angular.module('starter.controllers', ['ngCordova', 'chart.js'])
.controller('DashCtrl', function($scope, $rootScope, $log, $state, AUTH_EVENTS, Common, Device, 
    AuthService, LibManService, SyncService, FavorService, ProgressDao, ErrorExamService) {
    $scope.daysleft = 10;
    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
    };

    $scope.go = function(func){

      switch(func){
        case 'book':
          $state.go('tab.menu.practice.book');        
          break;
        case 'outline':
          $state.go('tab.menu.practice.outline');        
          break;
        case 'download':
          $state.go('tab.menu.practice.download.local'); 
          break;       
        case 'point':
          $state.go('tab.menu.practice.point');  
          break;
        case 'favor':
          $state.go('tab.menu.practice.favor');        
          break;
        case 'chapter':
          $state.go('tab.menu.practice.chapter');
          break;
        case 'random':
          $state.go('tab.menu.practice.random');
          break;
        case 'error':
          $state.go('tab.menu.practice.errorexam');
          break;
        case 'exampaper':
          $state.go('tab.menu.practice.exampaperlist');        
          break;
        case 'skexpress':
          $state.go('tab.menu.practice.expresslist');        
          break;  
        default:
          break; 
      }
    };

    $scope.examDate = '2017-09-23';
    var examDate = new Date($scope.examDate);
    var today = new Date();
    $scope.countDownDays = Math.round((examDate - today)/(1000*60*60*24));

    if($scope.countDownDays < 0){
      $scope.countDownDays = 0;
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      // console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.activeIndex;
      $scope.previousIndex = data.previousIndex;
    });  

    $scope.options = {
      loop: true,
      effect: 'slide',
      speed: 1000,
      autoplay: 5000
    }
    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      // console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.activeIndex;
      $scope.previousIndex = data.previousIndex;
    });


    switch(Device.deviceSize()){
      case Device.S:
        $scope.descFontSize = 1.25;
        break;
      case Device.M:
        $scope.descFontSize = 1.5;
        break;
      case Device.L:
        $scope.descFontSize = 1.75;
        break;
    }

    $scope.$on('$ionicView.afterEnter', function(event, data){
      var userPwd = AuthService.loadUserNamePassword();
      if(userPwd == null){
        $state.go('tab.login');
      }
    });

    /**
    数据库全部正常，或者应该等login完成之后，否则没有权限去同步数据？
    */
    $scope.$on(AUTH_EVENTS.login, function(event, data){
      $log.info('controller received login event');
      var userPwd = AuthService.loadUserNamePassword();
      if(userPwd != null){
        //用户已经登陆了，查看题库更新，自动下载, 启动错误db没有找到，延迟直到用户点了某一个节目再回来
        $log.debug('auto update lib');
        LibManService.getLibVerLocal(LibManService.downloadLib);
        $rootScope.notCheckedLib = 'checked';
      }

      //同步用户数据
      $log.debug('同步所有收藏数据');
      FavorService.syncAllData();
      ProgressDao.syncAllPracticeProgress();
      ProgressDao.syncAllStat();
      ErrorExamService.syncErrorProgress();
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
.controller('TabCtrl', function($scope, $ionicPopup, $state, $rootScope, AuthService, UserService, $log, LibManService, AUTH_EVENTS){

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
    $log.debug('user info updated:', JSON.stringify(data));
    $scope.user = UserService.user();
    $log.debug($scope.user);
  });


});