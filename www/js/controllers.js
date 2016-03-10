angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
	$scope.daysleft = 10;
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
})
.controller('ChapterCtrl', function($scope){
	  $scope.groups = [];
	  for (var i=0; i<10; i++) {
	    $scope.groups[i] = {
	      name: i,
	      items: [],
	      show: false
	    };
	    for (var j=0; j<3; j++) {
	      $scope.groups[i].items.push(i + '-' + j);
	    }
	  }
	
	  $scope.toggleGroup = function(group) {
		    group.show = !group.show;
		  };
	  $scope.isGroupShown = function(group) {
	    return group.show;
	  };
})
.controller('PracticeCtrl', function($scope){})
;
