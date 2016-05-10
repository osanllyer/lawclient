angular.module('starter.controllers', ['ngCordova', 'chart.js'])

.controller('DashCtrl', function($scope, $cordovaSQLite, $ionicPopup) {
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
	};
	$scope.data = {};
	$scope.$watch('data.slider', function(nv, ov) {
	  $scope.slider = $scope.data.slider;
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
.controller('TabCtrl', function($scope, $ionicPopup){
	$scope.showAbout = function(){
		var aboutPopDlg = $ionicPopup.alert({
			title : '关于',
			content : '司考宝典 2016',
			okText : '关闭'
		});
		aboutPopDlg.then(function(res){});
	};
});