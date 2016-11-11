angular.module('starter.services')
.factory('ExpressService', function ($http, ENDPOINTS, $log, Common, AuthService) {

	var newExperessNum = 0;

	function getNewExpressNum () {
		return newExperessNum;
	}

	function resetNewExpressNum(){
		newExperessNum = 0;
	}

	return {

		getNewExpressNum : getNewExpressNum,
		resetNewExpressNum : resetNewExpressNum,
		loadExpress : function(id){
			$log.debug('express loadOutlink enter');
			var promise = $http.get(Common.buildUrl(ENDPOINTS.expressIdUrl, {id:id}));

			return promise.then(
				function(data){
					var content = '';

					if(data.data){
 						content += '<h4>' + data.data.title + '</h4>';
						content += '<p>' + data.data.content + '</p>';
					}

					return {outline:content};

				}, 
				function(error){
					$log.debug('express load error:', JSON.stringify(error));
					return null;
				}
			);
		},

		/*
		检查是否有新的通知,需要最新的id
		*/
		checkNewExpress : function () {
			var expressId = window.localStorage.getItem('expressid_' + AuthService.username());
			if(expressId == null){
				expressId = 0;
			}
			return $http.get(Common.buildUrl(ENDPOINTS.check_express_new, {id:expressId}));
		},

		loadExpressList : function(from, size){
			$log.debug('express loadOutlink enter');
			return $http.get(Common.buildUrl(ENDPOINTS.expressListUrl, {from:from, size:size}));
		}

	};

});