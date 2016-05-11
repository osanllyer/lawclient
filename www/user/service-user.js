angular.module('starter.services')
.factory('UserService', function(){
	return {
		getUserInfo : function(userId){
			return {
				avatar : 'img/notlogin.png',
				gender : '男',
				address : '来广营',
				region : '中国 北京',
				nickname : '李奋波',
				userId : userId
			};
		}
	};
});