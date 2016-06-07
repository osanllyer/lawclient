/**
*  Module
* 聊天页面服务
* Description
*/
angular.module('starter.services')
//好友列表
.factory('ContactService', function(){
	return {
		
	};
})
//连接服务器
.factory('sharedConn', function($ionicPopup, $state, $rootScope, $ionicPopup, $log, $http, ENDPOINTS, Common){
	
	 var SharedConnObj={};

	 SharedConnObj.BOSH_SERVICE = ENDPOINTS.xmpp_server;  
	 SharedConnObj.connection   = null;    // The main Strophe connection object.
	 SharedConnObj.loggedIn=false;

	 SharedConnObj.connection = new Strophe.Connection( SharedConnObj.BOSH_SERVICE , {'keepalive': true});  // We initialize the Strophe connection.


	 //------------------------------------------HELPER FUNCTIONS---------------------------------------------------------------
	 SharedConnObj.getConnectObj=function(){
			return SharedConnObj.connection; 
	 };
	  
	 SharedConnObj.isLoggedIn=function(){
			return SharedConnObj.loggedIn; 
	 };
	 
	 SharedConnObj.getBareJid=function(){	
		var str=SharedConnObj.connection.jid;
		str=str.substring(0, str.indexOf('/'));
        return str;
     };
	
	//发送消息
	SharedConnObj.sendMessage = function(jid, body){
		var to_jid = Strophe.getBareJidFromJid(jid);
		var timestamp = new Date().getTime();
		//$msg是strophe定义的，注册到了windows，所以可以直接使用，功能是返回一个message为root的builder
		var reqChannelsItems = $msg({id:timestamp, to:to_jid, type:'chat'}).c("body").t(body);
		SharedConnObj.connection.send(reqChannelsItems.tree());
	};	 
		 
	 
	 //--------------------------------------***END HELPER FUNCTIONS***----------------------------------------------------------
	 	
	//Login Function
	SharedConnObj.login=function (jid,host,pass) {	 
		SharedConnObj.connection.connect(jid+'@'+host, pass , SharedConnObj.onConnect);
	};
	
	//On connect XMPP
	SharedConnObj.onConnect=function(status){
		if (status == Strophe.Status.CONNECTING) {
			$log.debug('Strophe is connecting.');
		} else if (status == Strophe.Status.CONNFAIL) {
			$log.debug('Strophe failed to connect.');
		} else if (status == Strophe.Status.DISCONNECTING) {
			$log.debug('Strophe is disconnecting.');
		} else if (status == Strophe.Status.DISCONNECTED) {
			$log.debug('Strophe is disconnected.');
		} else if (status == Strophe.Status.CONNECTED) {	
			$log.debug('strophe is connected.');
			//其他人发送过来的消息
			SharedConnObj.connection.addHandler(SharedConnObj.onMessage, null, 'message', null, null ,null);
			SharedConnObj.connection.send($pres().tree());
			SharedConnObj.loggedIn=true;
			//用户请求消息处理接口
			SharedConnObj.connection.addHandler(SharedConnObj.on_subscription_request, null, "presence", "subscribe");	
			// $state.go('tabsController.chats', {}, {location: "replace", reload: true});
		}
	};

	
	//When a new message is recieved
	SharedConnObj.onMessage=function(msg){
		$log.debug(msg);
		$rootScope.$broadcast('msgRecievedBroadcast', msg );
		return true;
	};
	
	SharedConnObj.signUp = function (jid,pass) {
		//to add register function
		$log.debug('xmpp register');
		var callback = function (status) {
		    if (status === Strophe.Status.REGISTER) {
		        SharedConnObj.connection.register.fields.username = jid;
		        SharedConnObj.connection.register.fields.password = pass;
		        SharedConnObj.connection.register.submit();
		    } else if (status === Strophe.Status.REGISTERED) {
		        $log.debug("registered!");
		        SharedConnObj.connection.authenticate();
		    } else if (status === Strophe.Status.CONNECTED) {
		        $log.debug("logged in!");
		    } else {
		        // every other status a connection.connect would receive
		    }
		};

		SharedConnObj.connection.register.connect("im.local", callback);
	};
	
	SharedConnObj.logout=function () {
		$log.debug("reached");
		SharedConnObj.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
		SharedConnObj.connection.flush();
		SharedConnObj.connection.disconnect();
	};
	
	//Helper Function------------------------------
	var accepted_map={};  //store all the accpeted jid
	function is_element_map(jid){
		if (jid in accepted_map) {return true;} 
		else {return false;}	
	}
	function push_map(jid){
		accepted_map[jid]=true;
	}
	//--------------------------------------------
	
	//用户请求好友
	SharedConnObj.on_subscription_request = function(stanza){
		$log.debug(stanza);
		if(stanza.getAttribute("type") == "subscribe" && !is_element_map(stanza.getAttribute("from")) )
		{	
			//the friend request is recieved from Client 2
			var confirmPopup = $ionicPopup.confirm({
				 title: 'Confirm Friend Request!',
				 template: ' ' + stanza.getAttribute("from")+' wants to be your freind'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			 	//接受请求
			   SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from") , type: "subscribed" }));
			   push_map( stanza.getAttribute("from") ); //helper
			 } else {
			   SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from") , type: "unsubscribed" }));
			 }
		   });
			return true;
		}

	}
	return SharedConnObj;
})
.factory('RosterService', function(sharedConn, $rootScope, $state, $log){
	
	$log.debug('roster service enter');
	ChatsObj={};

	connection = sharedConn.getConnectObj();
	ChatsObj.roster = [];

	loadRoster= function() {

		//如果没有登陆，那么先登陆
		// if(!sharedConn.isLoggedIn()){
		// 	$log.debug('login first');
		// 	sharedConn.login('13011111111', 'localhost', '11111111');
		// }

		var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
		connection.sendIQ(iq, function(iq) {
			console.log(iq);
			if (!iq || iq.length == 0)
				return;
			
			//jquery load data after loading the page.This function updates data after jQuery loading
			$rootScope.$apply(function() {
				
				$(iq).find("item").each(function(){
					ChatsObj.roster.push({
						id: $(this).attr("jid"),
						name:  $(this).attr("name") || $(this).attr("jid"),
						lastText: 'Available to Chat',
						face: 'img/ben.png'
					});
	
				});						
			});	
		});
		// set up presence handler and send initial presence
		connection.addHandler(
			//on recieve precence iq
			function (presence){		
			   /*var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
			   var from = $(presence).attr('from'); // the jabber_id of the contact
			   if (presence_type != 'error'){
				 if (presence_type === 'unavailable'){
					console.log("offline"); //alert('offline');
				 }else{
				   var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
				   if (show === 'chat' || show === ''){
					 console.log("online"); //alert('online');
				   }else{
					 console.log("etc");//alert('etc');
				   }
				 }
			   }
			   */
			   return true;
			}
		, null, "presence");
		
		connection.send($pres());		

		connection.addHandler(
			//on recieve update roster iq
			function(iq) {
				
				console.log(iq);
				
				if (!iq || iq.length == 0)
					return;
				
				//jquery load data after loading the page.This function updates data after jQuery loading
				$rootScope.$apply(function() {
					
					$(iq).find("item").each(function(){
						
						//roster update via Client 1(ie this client) accepting request
						if($(this).attr("subscription")=="from"){
							
							ChatsObj.roster.push({
								id: $(this).attr("jid"),
								name:  $(this).attr("name") || $(this).attr("jid"),
								lastText: 'Available to Chat',
								face: 'img/ben.png'
							});
						}
						// Waiting for the Client 2 to accept the request
						else if ( $(this).attr("subscription")=="none"  && $(this).attr("ask")=="subscribe" ){
							
							ChatsObj.roster.push({
								id: $(this).attr("jid"),
								name:  $(this).attr("name") || $(this).attr("jid"),
								lastText: 'Waiting to Accept',
								face: 'img/ben.png'
							});
						}

						//roster update via Client 2 deleting the roster contact
						else if($(this).attr("subscription")=="none"){ 
							console.log( $(this).attr("jid")  );
							ChatsObj.removeRoster( ChatsObj.getRoster( $(this).attr("jid") ) );
						}
						
					});
					$state.go('tabsController.chats', {}, {location: "replace", reload: true});
				
				});	
					
			}

		,"jabber:iq:roster", "iq", "set");
		return ChatsObj.roster;
	}				

	ChatsObj.allRoster= function() {
		//判断是否已经填充
		if(ChatsObj.roster.length == 0){
			loadRoster();
		}
		return ChatsObj.roster;
	}
 
	ChatsObj.removeRoster= function(chat) {
		ChatsObj.roster.splice(ChatsObj.roster.indexOf(chat), 1);
	}

	ChatsObj.getRoster= function(chatId) {
		for (var i = 0; i < ChatsObj.roster.length; i++) {
			if (ChatsObj.roster[i].id == chatId) {
			  return ChatsObj.roster[i];
			}
		  }
	}
	ChatsObj.addNewRosterContact=function(to_id){
		console.log(to_id);
		connection.send($pres({ to: to_id , type: "subscribe" }));		
	}
	return ChatsObj;

});