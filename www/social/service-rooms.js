/**
*  Module
*
* Description
*/
angular.module('starter.services')
.factory('RoomService', function($http, $q, $log, sharedConn, ENDPOINTS, Common, UserService){

	var chatRooms = [];
	var inited = false;

	var listRoomCb = function (stanza){
		//解析xml
		$(stanza).find("item").each(function(){
			chatRooms.push(
				{
					id : $(this).attr("jid"),
					name : $(this).attr("name")
				}
			);
		});
	};

	var errorCb = function(stanza){
		//记录错误
		$log.debug(stanza);
	};

	var fetchAllRooms = function(cb1, cb2){
		$log.debug('fetch room list:');
		inited = true;
		sharedConn.getConnectObj().muc.listRooms('conference.im.local', cb1, cb2);
	};

	function joinRoom(room, nickname, c1, c2, c3){		
		sharedConn.getConnectObj().muc.join(room, nickname, c1, c2, c3);
	}

	function getRoomInfo(room){
		// sharedConn.getConnectObj.muc.
	}

	var sendMessage = function(room, data, msgId){
		sharedConn.getConnectObj().muc.groupchat(room, data, null, msgId);
	};

	var getNickName = function(fullname){
		if(fullname){
			return fullname.split('/')[1];
		}
		return null;
	};

	/**
	获取聊天室列表
	*/
	return {
		//获取聊天室列表
		rooms : function(){
			if(!inited){
				fetchAllRooms(listRoomCb, errorCb);
			}
			return chatRooms;
		},
		//加入聊天室
		join : 	function(room, nickname, c1, c2, c3){		
			sharedConn.getConnectObj().muc.join(room, nickname, 
				function(stanza){$log.debug('a');},
				function(stanza){console.log('b');},
				function(stanza){console.log('c');}
			);
		},
		sendMessage : sendMessage,
		getNickName : getNickName
	};
});