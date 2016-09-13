/**
*  Module
*
* 统计信息
*/
angular.module('starter.services')
.factory('StatsLfbService', function($http, ENDPOINTS, Common){
	return {
		track : function(user, fromstate, tostate, params){
			if(params == null) params = {};
			params.from = fromstate;
			params.to = tostate;
			$http.get(Common.buildUrl(ENDPOINTS.root, params));
		}
	};
});