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
	  
	// $scope.chatDetails=function(to_id){ 
	// 	ChatDetailsObj.setTo(to_id);
	// 	$state.go('tabsController.chatDetails', {}, {location: "replace", reload: true});
	// };
	  
  	// //进入就登陆
  	// if( !sharedConn.isLoggedIn() ){
  	// 	// sharedConn.login(UserService.user.username, 'localhost', UserService.user.password);
  	// 	 sharedConn.login('13011111111', 'im.local', '11111111');
  	// }
})
.controller('RosterCtrl', function($scope, $log, $ionicNavBarDelegate, $timeout, $state, sharedConn, ENDPOINTS, RosterService, UserService){
	//好友列表
	$log.debug('roster ctrl enter:');
	//disable back button
	// $ionicNavBarDelegate.showBackButton(false);

	//首先判断是否登陆了，如果没有登陆，那么先登录
	$scope.chats = RosterService.allRoster();
	//设置用户的头像

	var setFaces = function(){
		for(var idx in $scope.chats){
			UserService.getUserInfoByUsername($scope.chats[idx].name).then(
				function(data){
					$log.debug('fetch avatar ok:', JSON.stringify(data));
					if(data){
						$log.debug('fetch avatar ok:')
						$scope.chats[idx].face = '/img/avatar/' + data.avatar;
					}
				}, 
				function(error){
					$log.debug('rosterctrl fetch user avatar error:', JSON.stringify(error));
				});
		}
	};

	// $log.debug(JSON.stringify($scope.chats));

	//删除好友
	$scope.remove = function(chat) {
		RosterService.removeRoster(chat);
	};
	

	$scope.addFriends = function(){
		$state.go('tab.friends');
	}

	$scope.$on('$ionicView.beforeEnter', function(){
		if(!sharedConn.isLoggedIn()){
			var userPass = UserService.loadUserNamePassword();
			sharedConn.login(userPass[0], ENDPOINTS.xmpp_domain, userPass[1]);
		}
	});
	
})
.controller('BaseChatDetailCtrl', function($scope, $ionicScrollDelegate, $log, $timeout, ENDPOINTS, sharedConn, to_id){
	//存储消息，包括收到的和发送的
	$scope.messages = [];
	//ios平台有不同的操作
    var isIOS = ionic.Platform.isIOS(); 


	$scope.to_id = to_id;
	$log.debug('to id:', $scope.to_id);

  	//需要实现发送函数
  	$scope.sendMessage = function(){}

    $scope.showSendMessage = function() {

    	//发送，在窗口显示
    	$scope.sendMessage();

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

	//收到消息处理，在sharedConn中发送事件
   	$scope.$on('msgRecievedBroadcast', function(event, data) {
		$scope.messageRecieve(data);
    });  

   	//子类实现这个函数
    $scope.messageRecieve = function(data){};
})
.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicScrollDelegate, $log, $timeout, $controller, $state, RoomService, sharedConn){

	//继承基类
	$controller('BaseChatDetailCtrl', { $scope:$scope, to_id:$stateParams.chatId });

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
			  userId: RoomService.getNickName(from),
			  text: textMsg,
			  time: d
			});
			
			//滚到底部
			$ionicScrollDelegate.scrollBottom(true);
			$scope.$apply();
			
			$log.debug($scope.messages);
			$log.debug('Message recieved from ' + from + ': ' + textMsg);
		}
  	};

    $scope.sendMessage = function(){
  		sharedConn.sendMessage($scope.to_id,$scope.data.message);  
  	};

  	//查看用户信息
	$scope.profile = function(){
		//解析用户名称
		var username = $scope.to_id.split('@')[0];
		$state.go('tab.user', {name:username});
	};
})
.controller('FriendsSearchCtrl', function($scope, $log, RosterService, UserService){
	//添加好友
	$scope.jid_keyword = null;
	$scope.findUser = null;
	$scope.data = {};

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.add = function(add_jid){
		RosterService.addNewRosterContact(add_jid + '@' + ENDPOINTS.xmpp_domain);
	};

	//搜索用户
	$scope.search = function(){
		$log.debug('search user');
		$scope.searchResult = null;
		var userPromise = UserService.getUserInfoByUsername($scope.data.jid_keyword);
		userPromise.then(function(data){
			if(data != null && data.username != null){
				$log.debug(data);
				$scope.searchResult = true;
				$scope.findUser = data;
				//设置默认头像，其实应该在插入的时候就设置好
				if($scope.findUser.avatar == null){
					$scope.findUser.avatar = 'notlogin.png';
				}
			}else{
				$scope.searchResult = false;
			}
		}, function(error){
			$log.debug('search error:', error);
			$scope.searchResult = false;
		});
	};
});