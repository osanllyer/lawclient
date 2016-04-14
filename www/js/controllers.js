angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $cordovaSQLite) {
	console.log('dash enter');

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
.controller('ChapterCtrl', function($scope, $cordovaSQLite, DB){
	console.log('chpaterctrl enter');

	  $scope.groups = [];
	
	  $scope.toggleGroup = function(group) {
		    group.show = !group.show;
		  };
	  $scope.isGroupShown = function(group) {
	    return group.show;
	  };

	  DB.initLaw();

	  $scope.loadChapter = function(){
	  	var query = "select l.id as lid, l.name as lawName, c.id as cid, c.name as chapterName from law l " + 
	  				" left join law_chapter c on (l.id = c.law_id) order by l.id asc, c.id asc";
	  	console.log(DB.getDB());
	  	var db = DB.getDB();
	  	db.transaction(function(tx){
	  		tx.executeSql(query, [], function(tx, results){
	  			var length = results.rows.length;
	  			for(var i=0; i<length; i++){
	  				var row = results.rows.item(i);
	  				$scope.groups[i] = {id : row.lid, name : row.lawName, chapters:[], show:false};
	  			}
	  			for(var i=0; i<length; i++){
	  				var row = results.rows.item(i);
	  				$scope.groups[i].chapters.push({id:row.cid, name:row.chapterName});
	  			}
	  		}, null);
	  	});
	  };

	  $scope.loadChapter();
})
.controller('PracticeCtrl', function($scope){})
.controller('ExamCtrl', function($scope, $stateParams){
	// console.log('eaxmctrl enter');
	// console.log($stateParams.qid);
	$scope.title = '小二今天想吃饭';
	$scope.choices = ['吃了', '没吃', '不吃', '饿死'];
	$scope.analysis = '今天不吃饭';

})
;
