angular.module('starter.services')
.factory('AboutService', function($http, $log, $q, ENDPOINTS){
	return {
		//检查app版本
		checkAppVersion : function(){
			var defered = $q.defer();
			$http.get(ENDPOINTS.appversion)
			.success(
				function(data){
					defered.resolve( data );
				}
			)
			.error(function(error){
				$log.debug(error);
				defered.reject(error);
			});

			return defered.promise;
		}
	};
});