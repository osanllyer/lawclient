/**
*  Module
*
* Description
*/
angular.module('starter.services')
.factory('RankboardService', function($log, AuthService, $q, $http, ENDPOINTS, Common){
	$log.debug('enter RankboardService');

	var topUsers = [];
	var selfFetched = false;
	var topFetched = false;
	var score = 0;
	var rank = 0;

	/**
	获取排名前20的用户id
	*/
	function getTopUsers () {
		var deferred = $q.defer();
		if(topFetched){
			deferred.resolve(topUsers);
		}else{
			topFetched = true;
			var promise = $http.get(Common.buildUrl(ENDPOINTS.top, {size:20}));
			promise.then(
				function (data) {
				//收到数据
					$log.debug('get top user ok:', JSON.stringify(data));
					var fetchedUsers = data.data;
					for(var uidx in fetchedUsers){
						var u = fetchedUsers[uidx];
						if(angular.isUndefined(u.avatar)){
							u.avatar = 'notlogin.png';
						}
						if(angular.isUndefined(u.nickname) || u.nickname == 'null'){
							u.nickname = '司考用户' + u.user.substring(7,11);
						}
						topUsers.push(u);
					}
					deferred.resolve(topUsers);
				},
				function (error){
				//错误
					$log.debug('get top user error:', JSON.stringify(error));
					deferred.reject('JSON.stringify(error)');
				}
			);
		}
		return deferred.promise;
	}

	/*
	获取自己的排名
	*/
	function getSelfRank () {
		var deferred = $q.defer();
		if(selfFetched){
			$log.debug('has fetched, load from cache:', JSON.stringify([score, rank]));
			deferred.resolve([score, rank]);
		}else{
			selfFetched = true;
			var u = AuthService.loadUserNamePassword();
			if(u){
				$log.debug('loaded username', JSON.stringify(u));
				var username = u[0];
				var promise = $http.get(Common.buildUrl(ENDPOINTS.rank, {user : username}));
				promise.then(
					function (data) {
					//收到数据
						if(data.data){
							$log.debug('get user rank ok:', JSON.stringify(data));
							score = data.data.score;
							rank = data.data.rank + 1;
							deferred.resolve([data.data.score, data.data.rank]);
						}else{
							deferred.resolve([0,0]);
						}
					},
					function (error){
					//错误
						$log.debug('get user rank error:', JSON.stringify(error));
						deferred.reject('JSON.stringify(error)');
					}
				);				
			}else{
				deferred.reject('no user name found');
			}
		}
		return deferred.promise;
	}

	return {
		getTopUsers : getTopUsers,
		getSelfRank : getSelfRank,
		rank : function(){return rank},
		score : function(){return score}
	};
});