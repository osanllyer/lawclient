/**
*  Module
*题库管理模块
* Description
*/
angular.module('starter.services')
.factory('LibManService', function(DB, $http, $q, $log, $rootScope, $cordovaFileTransfer, ENDPOINTS, Strings){


	var libVersion = {version:'', log:''};

	function setLibVerLocal(versionlog){
		var sql = "DELETE FROM lib_ver_log";
		DB.execute(sql);
		sql = "INSERT INTO lib_ver_log(version, log) VALUES ('{0}', '{1}')";
		DB.execute(Strings.format(sql, [versionlog.version, versionlog.log]));
	}

	function getLibVerLocal(){
		var sql = "SELECT version, log FROM lib_ver_log";
		var promise = DB.queryForObject(sql);
		promise.then(function(data){
			if(data){
				libVersion.version = data.version;
				libVersion.log = data.log;
			}
		}, function(error){
			$log.debug('getLibVerLocal:', JSON.stringify(error));
		});
	}

	getLibVerLocal();

	return {
		//检查更新，获取updaetlog
		libVersion : function(){
			return libVersion;
		},
		checkLibVersion : function(){
			var deferred = $q.defer();
			$http.get(ENDPOINTS.libversion)
			.success(function(data, status){
				deferred.resolve(data);
				$log.debug(data);
			})
			.error(function(data, status){
				deferred.reject(data);
				$log.debug(data);
			});

			return deferred.promise;
		},

		//下载题库更新
		//source, filePath, options, trustAllHosts
		downloadLib : function(){
		}
	};
});