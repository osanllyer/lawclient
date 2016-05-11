angular.module('starter.services')
.factory('LoginService', function($http){
	
	var loginUrl = "";

	return {
		login : function(user, password){
			return true;
		}	
	};
});
