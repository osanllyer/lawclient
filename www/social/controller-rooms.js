/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('RoomsCtrl', function($scope, RoomService, $log, $ionicNavBarDelegate, $state, $ionicSideMenuDelegate, sharedConn){
	//聊天室控件入口
	// $ionicNavBarDelegate.showBackButton(false);
	//获取room
	$scope.rooms = RoomService.rooms();

	//加入房间
	$scope.joinRoom = function(room){
		$state.go('tab.menu.chatroom', {room:room})
	};

	//打开sidemenu
	$scope.openSideMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}
}).controller('ChatRoomCtrl', function($scope, $controller, $stateParams, $log, 
			$ionicScrollDelegate, $state, RoomService, UserService, sharedConn){

	$scope.isChatRoom = true;
	
	$log.debug('chat room ctrl enter');

	var room = $stateParams.room;

	$controller('BaseChatDetailCtrl', { $scope : $scope, to_id : $stateParams.room });

	//聊天室页面
	var msg_handler = function(stanza){
		$log.debug('room message receive', stanza, JSON.stringify(stanza));
	};

	var pres_handler = function(stanza){
		$log.debug('room pres receive', stanza, JSON.stringify(stanza));
	};

	//参数是一个Object, 不是xml
	var roster_handler = function(stanza){
		$log.debug('room roster receive', stanza, JSON.stringify(stanza));
		//用户变动，不用处理，或者像微信一样，增加一个提示
	};

	$scope.sendMessage = function(){
		//发送消息，不能sharedConn中的sendMesasge，不支持groupchat
		// sharedConn.sendMessage($scope.to_id,$scope.data.message);
		RoomService.sendMessage(room, $scope.data.message);  
	}


	$scope.messageRecieve=function(msg){	
	  $log.debug('room ctrl msg receive:', msg);
	  	//昵称。。。会导致无法获取到真实的用户信息，从而无法获取头像等信息,日了够了
		var from = msg.getAttribute('from');
		var type = msg.getAttribute('type');
		var elems = msg.getElementsByTagName('body');
	  
		var d = new Date();
	    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	    //保证是群聊信息，并且有内容，并且不能是自己发送的
	    $log.debug('from user', RoomService.getNickName(from));
	    $log.debug('current suer', '司考-' + sharedConn.getBareJid());
		if (type == "groupchat" && elems.length > 0 && RoomService.getNickName(from) != '司考-' + sharedConn.getBareJid()) {
			
			var body = elems[0];
			var textMsg = Strophe.getText(body);
			
			$scope.messages.push({
			  userId: RoomService.getNickName(from),
			  face : '',//用户头像
			  text: textMsg,
			  time: d
			});
			
			//滚到底部
			$ionicScrollDelegate.scrollBottom(true);
			$scope.$apply();
			
			$log.debug('Message recieved from ' + from + ': ' + textMsg);
		}
	};

	//查看群组信息
	$scope.profile = function(){
		$state.go('tab.roomInfo', {room : room});
	};

	//加入聊天室，之所以放到这里，是因为需要注册回调函数，在这里处理
	$log.debug(room, sharedConn.getBareJid());
	RoomService.join(room, '司考-' + sharedConn.getBareJid(), msg_handler, pres_handler, roster_handler);

}).controller('RoomInfoCtrl', function($scope, $stateParams, sharedConn){
	
});