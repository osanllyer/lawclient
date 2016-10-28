/**
*  Module
*
* Description
*/
angular.module('starter.services')

.factory('FavorService', function(DB, Strings, SyncAction, SyncType, SyncService, $log, Common){

	/*构建保存数据*/
	function syncProgressData(action, qid){
		$log.debug('begin sync fav progress:');
		var sql = "SELECT f.qid FROM userdb.favor_progress fp, userdb.favorite f where fp.qid = f.qid AND f.status = 1";
		var promise = DB.queryForObject(sql);
		promise.then(
			function(data){
				if(data){
					//如果有数据，将数据更新到服务器
					$log.debug('progres data fav:', JSON.stringify(data));
					data = SyncService.buildCommonData(SyncAction.ADD, SyncType.FAVPROGRESS, null, {qid:data.qid});
					var listData = SyncService.buildDataList([data]);
					SyncService.syncToServer(listData, 1);
				}else{
					//如果没有数据，从服务器下载数据并更新本地数据库
					$log.debug('fav progress get from server');
					var syncData = SyncService.buildCommonData(SyncAction.GET, SyncType.FAVPROGRESS, null, {});
					var syncDataList = SyncService.buildDataList([syncData]);
					var future = SyncService.syncToServer(syncDataList, 1);
					future.then(
						function(response){
							$log.debug('fav progress from server:', JSON.stringify(response));
							if(response){
								var qid = response.data[0].qid;
								var sqlarr = [
									'DELETE FROM userdb.favor_progress',
									'INSERT INTO userdb.favor_progress (qid) VALUES (' + qid + ') '
								];
								DB.multiTransaction(sqlarr);
							}
						},
						function(error){
							$log.debug('fav progress from server error:', JSON.stringify(error));
						}
					);
				}
			},
			function(error){$log.debug('syncProgressData func load db error:', JSON.stringify(error));}
		);

	}

	function genUploadData(localData, serverData){
		$log.debug('localdata:', JSON.stringify(localData));
		$log.debug('serverdata:', JSON.stringify(serverData));
		var tobeDelete = [];
		var tobeAdd = [];
		var tobeUpdate = [];
		for(var lidx in localData){
			var contain = false;
			for(var idx in serverData){
				//如果线上有这条数据
				if(localData[lidx].qid == serverData[idx].qid){
					contain = true;
					if(localData[lidx].status == 0){
						//从线上删除
						tobeDelete.push(localData[lidx]);
						break;
					}else{
						//比较时间
						if(localData[lidx].last_modified == Common.dateFormat(new Date(serverData[idx].add_at), "yyyy-MM-dd hh:mm:ss")){
							$log.debug('fav data is the same:', JSON.stringify(localData[lidx]));
						}else{
							//数据不同，需要
							tobeUpdate.push(localData[lidx]);
						}
					}
				}
			}
			//线上没有,只需要同步数据为1的
			if(contain == false && localData[lidx].status == 1){
				tobeAdd.push(localData[lidx]);
			}
		}

		var data = SyncService.buildAllData(SyncType.FAV, {"add":tobeAdd, "update":tobeUpdate, "delete":tobeDelete});
		data = SyncService.buildDataList([data]);
		SyncService.syncToServer(data, 2);
	}

	/**
	更新本地数据库
	*/
	function genLocalUpdateData(localData, serverData){
		var toBeAdd = [];
		for(var idx in serverData){
			var contain = false;
			for(var lidx in localData){
				//如果存在
				if(serverData[idx].qid == localData[lidx].qid){
					contain = true;
					break;
				}
			}
			//如果不存在
			if(contain == false){
				toBeAdd.push(serverData[idx]);
			}
		}

		$log.info('fav data tobe add to local database', JSON.stringify(toBeAdd));

		var sql = "INSERT INTO userdb.favorite(qid, last_modified) VALUES(?, ?)"
		var batchArray = [];
		for(var i in toBeAdd){
			batchArray.push([sql, [toBeAdd[i].qid, Common.dateFormat(new Date(toBeAdd[i].add_at), 'yyyy-MM-dd hh:mm:ss')]]);
		}

		DB.multiTransaction(batchArray, 
			function(){
				$log.debug('sync fav data sucess');
			}, 
			function(){
				$log.debug('sync fav data errors');
			});
	}

	/*
	同步成功，参数为服务器中所有的数据列表
	*/
	function syncAllSuccessCbk(data){
		var toBedelete = [];
		var update = [];
		var sql = "SELECT qid, status, last_modified FROM userdb.favorite";
		$log.debug('success', JSON.stringify(data));
		if(data){
			var promise = DB.queryForList(sql);
			promise.then(
				function(localdata){
					//生成对线上的数据
					genUploadData(localdata, data);
					//更新本地数据库
					genLocalUpdateData(localdata, data);
				},
				function(error){
					$log.debug('load fav all data error:', JSON.stringify(error));
				}
			);
		}

	}

	/*
	同步失败
	*/
	function syncAllErrorCbk(error){
		$log.debug('sycn all favor error', JSON.stringify(error));
	}

	/*
	全量同步
	*/
	function syncAllData(){
		$log.debug('同步所有收藏favor data');
		//首先从服务器下载所有的数据
		SyncService.syncAll(SyncType.FAV, syncAllSuccessCbk, syncAllErrorCbk);
		syncProgressData();
	}


	return {
		/**
		加载收藏
		*/
		loadFavorite : function(questionId){
			var query = "SELECT 1 FROM userdb.favorite WHERE status = 1 AND qid = " + questionId;
			return DB.queryForObject(query);
		},
		/**
		增加收藏
		*/
		addFavorite : function(questionId){
			var query = "REPLACE INTO userdb.favorite(qid, status) VALUES(" + questionId + ", 1)";
			DB.execute(query);
		},
		/**
		删除收藏
		*/
		removeFavorite : function(questionId){
			// var query = "DELETE FROM userdb.favorite WHERE qid = " + questionId;
			var query = "UPDATE userdb.favorite SET status = 0 WHERE qid = " + questionId;
			DB.execute(query);
		},

		syncAllData : syncAllData, 
		/**
		加载进度
		*/
		loadProgress : function(){
			$log.debug('load favor progress');
			var query = "SELECT qid FROM userdb.favor_progress f, question_answer q WHERE f.status = 1 AND f.qid = q.id AND q.emulate != -1 LIMIT 1";
			return DB.queryForObject(query).then(
				function(data){
					if(data){
						return data.qid;
					}
					return null;
				},
				function(error){
					return null;
				}
			);
		},

		/**
		加载收藏的题目
		*/
		loadQuestions : function(){
			$log.debug('load favorites');
			var query = "SELECT qid FROM userdb.favorite f, question_answer q WHERE f.qid = q.id AND q.emulate != -1 AND f.status = 1 ORDER BY f.last_modified ASC";
			var qidArr = [];
			return DB.queryForList(query, []).then(
			function(data){
				if(data){
					for(var idx in data){
						qidArr.push(data[idx].qid);
					}
				}
				return qidArr;
			}, 
			function(error){
				$log.debug('load fav qid array error: ', error);
				return [];
			});
		},

		/*保存进度*/
		saveProgress : function(qid){
			$log.debug('save favor progress');
			var query = "DELETE FROM userdb.favor_progress";
			DB.execute(query);
			query = "INSERT INTO userdb.favor_progress(qid) VALUES ({0})";
			DB.execute(Strings.format(query, [qid]));
			// syncProgressData(SyncAction.ADD, qid);
		}
	};
});