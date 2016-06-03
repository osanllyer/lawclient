angular.module('starter.services')
.factory('AvatarService', function($rootScope, $log, AUTH_EVENTS){

	var choosedAvatar = false;

	return {
		chooseAvatar : function(avatar){
			choosedAvatar = avatar;
		},
		choosedAvatar : function(){return choosedAvatar;}
	};

});