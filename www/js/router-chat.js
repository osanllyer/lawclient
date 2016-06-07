angular.module('starter.router')
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('tab.menu.chats', {
		url : '/chats',
		views : {
			'tab-chats' : {
				templateUrl : 'tab/tab-chats.html',
				controller : 'MessageCtrl'
			}
		}
		//需要权限?
		// ,data : {
		// 	authorizedRoles : ["user", "vip"]
		// }
	}).state('tab.menu.detail', {
		url : '/detail/:chatId',
		views : {
			'tab-chats' : {
				templateUrl : 'social/chat-detail.html',
				controller : 'ChatDetailCtrl'
			}
		}
	}).state('tab.menu.chats.messages', {
		url : '/messages',
		views : {
			'chats-content' : {
				templateUrl : 'social/messages.html',
				controller : 'MessageCtrl'
			}
		}
	}).state('tab.menu.chats.roster', {
		url : '/roster',
		views : {
			'chats-content' : {
				templateUrl : 'social/roster.html',
				controller : 'RosterCtrl'
			}
		}
	}).state('tab.menu.chats.rooms', {
		url : '/messages',
		views : {
			'chats-content' : {
				templateUrl : 'social/rooms.html',
				controller : 'RoomsCtrl'
			}
		}
	}).state('tab.friends', {
		url : '/friends',
		views : {
			'menuContent' : {
				templateUrl : 'social/friends-search.html',
				controller : 'FriendsSearchCtrl'
			}
		}
	});
});