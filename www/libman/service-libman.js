/**
*  Module
*题库管理模块
* Description
*/
angular.module('starter.services')
.factory('LibManService', function(DB, $http, $q, $log, $rootScope, $cordovaFileTransfer, ENDPOINTS, AUTH_EVENTS, Strings, Common){


	var libVersion = {version:'', log:''};

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
		var sql = "SELECT max(last_modified) as updatetime FROM question_answer";
		var promise = DB.queryForObject(sql);
		promise.then(function(data){
			if(data){
				libVersion.version = data.updatetime;
				$log.debug('fetch local updatetime:', libVersion.version);
			}
		}, function(error){
			$log.debug('getLibVerLocal:', JSON.stringify(error));
		});

		sql = "SELECT l.name as law, count(1) as count  FROM question_answer qa, law_chapter c, law l where qa.chapter_id = c.id and c.law_id = l.id group by l.name";
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

	function updateQuestion(question){
		var i = question;
		DB.executeWithParams(
			"INSERT INTO question_answer VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
			[i.id, i.type, i.question, i.a, i.b, i.c, i.d, i.answer, i.analysis, i.published_at, i.chapter_id,
			i.last_modified, i.real_seq, i.paper], null, null);
	}

	function saveUpdates(data){
		for(var idx in data){
			var i = data[idx];
			var id = i.id;
			DB.executeWithParams("DELETE FROM question_answer WHERE id = " + id, [], updateQuestion, i);
		}
		//完成之后，发出更新完毕的通知，更新一下系统
		$rootScope.$broadcast(AUTH_EVENTS.libcomplete);
	}

	function checkupdate(){
		var deferred = $q.defer();
		$log.debug('libversion', libVersion.version);

		$http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:libVersion.version, check:true}))
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
			$http.get(Common.buildUrl(ENDPOINTS.libupdate, {updatetime:"2010-01-01 00:00:00", check:false}))
			.success(function(data){
				if(data){
					$log.debug(data);
					saveUpdates(data);
				}
			}).error(function(error){

			});
		}
	};
});