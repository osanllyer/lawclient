angular.module('starter.controllers', ['ngCordova', 'chart.js'])
.controller('DashCtrl', function($scope, $rootScope, $log, $state, AUTH_EVENTS, Common, Device,
    AuthService, LibManService, SyncService, FavorService, ProgressDao, ErrorExamService, ExpressService, RankboardService) {
    $scope.daysleft = 10;
    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
    };

    $scope.data = {type:"1"};
    // $scope.data = {type:{id:1}};
    // $scope.searchTypes = [{name:'题目', id:1}, {name:'书籍', id:2}, {name:'法规', id:3}];
    $scope.search = function () {
      $log.debug('go to search results page:', $scope.data.keyword);
      $state.go('tab.menu.practice.search', {keyword:$scope.data.keyword, searchType : $scope.data.type})
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
      $log.debug('enter tab dash..........................');
      //如果用户没有登录，跳转到login
      // var userPwd = AuthService.loadUserNamePassword();
      // if(userPwd == null){
      //   $state.go('tab.login');
      // }

      //检查是否有新消息，没必要每次检查，只在第一次进入之后需要
      if(angular.isUndefined($rootScope.newExpressChecked)){
        $rootScope.newExpressChecked = true;
        var promise = ExpressService.checkNewExpress();
        promise.then(
          function (data) {
            if(data){
              $log.debug('fetch new express count:', JSON.stringify(data));
              $scope.newExpressNum = data.data;
            }
          },
          function (error) {
            $log.debug('check express new error:', JSON.stringify(error));
          }
        );
      }else{
        $scope.newExpressNum = ExpressService.getNewExpressNum();
      }

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
.controller('TabCtrl', function($scope, $ionicPopup, $state, $rootScope, AuthService, UserService, $log, LibManService, AUTH_EVENTS, RankboardService){

  $scope.user = UserService.user();

  $scope.goLibMan = function(){
    $state.go('tab.libman', {});
  };

  $scope.rankboard = function(){
    $state.go('tab.rankboard', {});
  }

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

  $scope.rank = RankboardService.rank();
  $scope.score = RankboardService.score();

  $scope.$on('$ionicView.beforeEnter', function(event){
          //加载用户排名信息
      var promise = RankboardService.getSelfRank();
      promise.then(
        function(data){
            if(data){
                $log.debug('menu before enter data:', JSON.stringify(data));
                $scope.rank = data[1];
            }
        },
        function(error){}
      );
  });

  //收到用户信息更新
  $scope.$on(AUTH_EVENTS.updateUserInfo, function(event, data){
    $log.debug('user info updated:', JSON.stringify(data));
    $scope.user = UserService.user();
    $log.debug($scope.user);
  });


});
