/**
*  Module
*交流页面控制
* Description
*/
angular.module('starter.controllers')
.controller('MessageCtrl', function($scope, $log, $ionicNavBarDelegate, RosterService, UserService, sharedConn){
	$log.debug('message ctrl enter');
	//disable back button
	// $ionicNavBarDelegate.showBackButton(false);

	$scope.chats = RosterService.allRoster();
	$log.debug(JSON.stringify($scope.chats));
	$scope.remove = function(chat) {
		RosterService.removeRoster(chat);
	};
	
	  
	// $scope.chatDetails=function(to_id){ 
	// 	ChatDetailsObj.setTo(to_id);
	// 	$state.go('tabsController.chatDetails', {}, {location: "replace", reload: true});
	// };
	  
	$scope.add = function(add_jid){
		RosterService.addNewRosterContact(add_jid);
	};
	  
  	// //进入就登陆
  	// if( !sharedConn.isLoggedIn() ){
  	// 	// sharedConn.login(UserService.user.username, 'localhost', UserService.user.password);
  	// 	 sharedConn.login('13011111111', 'im.local', '11111111');
  	// }
})
.controller('RosterCtrl', function($scope, $log, $ionicNavBarDelegate, $state, sharedConn, RosterService, UserService){
	//好友列表
	$log.debug('roster ctrl enter:');
	//disable back button
	// $ionicNavBarDelegate.showBackButton(false);

	$scope.chats = RosterService.allRoster();
	$log.debug(JSON.stringify($scope.chats));
	$scope.remove = function(chat) {
		RosterService.removeRoster(chat);
	};
	

	$scope.addFriends = function(){
		$state.go('tab.friends');
	}
	  
	// $scope.chatDetails=function(to_id){ 
	// 	ChatDetailsObj.setTo(to_id);
	// 	$state.go('tabsController.chatDetails', {}, {location: "replace", reload: true});
	// };
	  
	// $scope.add = function(add_jid){
	// 	RosterService.addNewRosterContact(add_jid);
	// };
	  
  	// //进入就登陆
  	// if( !sharedConn.isLoggedIn() ){
  	// 	// sharedConn.login(UserService.user.username, 'localhost', UserService.user.password);
  	// 	 sharedConn.login('13011111111', 'im.local', '11111111');

  	// }
	
})
.controller('RoomsCtrl', function($scope, $ionicNavBarDelegate){
	//聊天室控件入口
	// $ionicNavBarDelegate.showBackButton(false);

})
.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicScrollDelegate, $log, $timeout, sharedConn){

	//存储消息，包括收到的和发送的
	$scope.messages = [];
	//ios平台有不同的操作
    var isIOS = ionic.Platform.isIOS(); 


	$scope.to_id = $stateParams.chatId;
	$log.debug('to id:', $scope.to_id);

	$scope.messageRecieve=function(msg){	
  
		var from = msg.getAttribute('from');
		var type = msg.getAttribute('type');
		var elems = msg.getElementsByTagName('body');
	  
		var d = new Date();
	    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	    //保证是聊天信息，并且有内容
		if (type == "chat" && elems.length > 0) {
			
			var body = elems[0];
			var textMsg = Strophe.getText(body);
			
			$scope.messages.push({
			  userId: from,
			  text: textMsg,
			  time: d
			});
			
			//滚到底部
			$ionicScrollDelegate.scrollBottom(true);
			$scope.$apply();
			
			$log.debug($scope.messages);
			$log.debug('Message recieved from ' + from + ': ' + textMsg);
		}
  	}

	//收到消息处理，在sharedConn中发送事件
   $scope.$on('msgRecievedBroadcast', function(event, data) {
		$scope.messageRecieve(data);
    });

    $scope.showSendMessage = function() {
		sharedConn.sendMessage($scope.to_id,$scope.data.message);  

	    var d = new Date();
	    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	    $scope.messages.push({
	      userId: $scope.myId,
	      text: $scope.data.message,
	      time: d
	    });

	    delete $scope.data.message;
	    $ionicScrollDelegate.scrollBottom(true);
  };

   $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

})
.controller('FriendsSearchCtrl', function($scope, $log, RosterService, UserService){
	//添加好友
	$scope.jid_keyword = null;
	$scope.findUser = null;

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.add = function(add_jid){
		RosterService.addNewRosterContact(add_jid);
	};

	//搜索用户
	$scope.search = function(){
		var keyword = $scope.jid_keyword;
		var userPromise = UserService.getUserInfoByUsername(keyword);
		userPromise.then(function(data){
			if(data != null){
				$log.debug(data);
				$scope.searchResult = true;
				$scope.findUser = data;
			}else{
				$scope.searchResult = false;
			}
		}, function(error){
			$log.debug('search error:', error);
			$scope.searchResult = false;
		});
	};
});