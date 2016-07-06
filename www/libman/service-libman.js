/**
*  Module
*题库管理模块
* Description
*/
angular.module('starter.services')
.factory('LibManService', function(DB, $http, $q, $log, $rootScope, $cordovaFileTransfer, ENDPOINTS, AUTH_EVENTS, Strings, Common){


	var libVersion = {version:'', log:'', total:0, updatetime:''};

	function setLibVerLocal(versionlog){
		var sql = "DELETE FROM lib_ver_log";
		DB.execute(sql);
		sql = "INSERT INTO lib_ver_log(version, log) VALUES ('{0}', '{1}')";
		DB.execute(Strings.format(sql, [versionlog.version, versionlog.log]));
	}

	/**
	获取本地最新的更新时间
	*/
	function getLibVerLocal(){
		var sql = "SELECT max(date(last_modified)) as version, max(last_modified) as updatetime FROM question_answer";
		var promise = DB.queryForObject(sql);
		promise.then(function(data){
			if(data){
				libVersion.version = data.version;
				libVersion.updatetime = data.updatetime;
				$log.debug('fetch local updatetime:', libVersion.version);
			}
		}, function(error){
			$log.debug('getLibVerLocal:', JSON.stringify(error));
		});

		var sql = "SELECT count(1) as total FROM question_answer";
		promise = DB.queryForObject(sql);
		promise.then(function(data){
			if(data){
				libVersion.total = data.total;
			}
		}, function(error){});

		sql = "SELECT l.name AS law, count(1) AS count  FROM question_answer qa, law_chapter c, law l WHERE qa.chapter_id = c.id AND c.law_id = l.id GROUP BY l.name";
		promise = DB.queryForList(sql);
		promise.then(
			function(data){
				if(data){
					libVersion.log = data;
				}
			}, 
			function(error){
				$log.debug('error question state:' + JSON.stringify(error));
			}
		);
	}



	function saveUpdates(data){
		var x = 0;
		function countUp(){
			x ++ ;
			if(x % 10 == 0){
				//广播进度
				$rootScope.$broadcast(AUTH_EVENTS.libprogress, x);
			}
			if(x == data.length - 1){
				$log.debug('completed update lib, broadcast event');
				$rootScope.$broadcast(AUTH_EVENTS.libcomplete);
			}
		}
		for(var idx in data){
			var i = data[idx];
			$log.debug(JSON.stringify(i));
			DB.multiTransaction(
				[
					'DELETE FROM question_answer WHERE id =' + data[idx].id,
					[
						"INSERT INTO question_answer VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
						[i.id, i.type, i.question, i.a, i.b, i.c, i.d, i.answer, i.analysis, i.published_at, i.chapter_id,
						i.last_modified, i.real_seq, i.paper, i.point, i.law_id]
					]
				],
				countUp,
				function(error){
					$log.debug('update lib error:' + error);
				}
			);
		}
	}

	function checkupdate(){
		var deferred = $q.defer();
		$log.debug('libversion', libVersion.version);

		$http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:libVersion.updatetime, check:true}))
		// $http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:"2010-01-01 00:00:00", check:true}))
		.success(function(data, status){
			deferred.resolve(data);
			$log.debug(data);
		})
		.error(function(data, status){
			deferred.reject(data);
			$log.debug(data);
		});

		return deferred.promise;
	}


	return {
		//检查更新，获取updaetlog
		checkupdate : checkupdate,
		getLibVerLocal : getLibVerLocal,
		libVersion : libVersion,
		//下载题库更新
		//source, filePath, options, trustAllHosts
		downloadLib : function(){
			$http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:libVersion.updatetime, check:false}))
			// $http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:"2010-01-01 00:00:00", check:false}))
			.success(function(data){
				if(data){
					saveUpdates(data);
				}
			}).error(function(error){

			});
		}
	};
});