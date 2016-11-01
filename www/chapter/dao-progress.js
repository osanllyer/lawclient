angular.module('starter.services')
.factory('ProgressDao', function($rootScope, DB, Strings, $log, SyncService, SyncAction, SyncType){

	$log.debug('ProgressDao initialized');

	function syncPracticeProgress(lawid, chapterId, qtype, qid){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.PRACTICEPROGRESS, null, 
				{law_id:lawid, chapter_id:chapterId, type:qtype, qid:qid});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function syncEventSource(qid, correct){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.EVENT_SOURCE, null, {qid:qid, correct:correct});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function syncProgressStat(qid, correct_num, error_num){
		var data = SyncService.buildCommonData(SyncAction.ADD, SyncType.PRACTICE_STAT, null, 
			{qid:qid, correct_num:correct_num, error_num:error_num});
		var listData = SyncService.buildDataList([data]);
		SyncService.syncToServer(listData);
	}

	function genUpload(serverData, localData){
		var toAdd = [];
		var toUpdate = [];
		var toDelete = [];

		for (var lidx in localData){
			var contain = false;
			for (var sidx in serverData){
				if(localData[lidx].chapter_id == serverData[sidx].chapter_id 
					&& localData[lidx].law_id == serverData[sidx].law_id
					&& localData[lidx].type == serverData[sidx].type
				){
					contain = true;
					if(localData[lidx].question_id != serverData[sidx].qid){
						toUpdate.push(localData[lidx]);
					}
					break;
				}
			}

			//没有匹配的，增加到服务器
			if(contain == false){
				toAdd.push(localData[lidx]);
			}
		}

		if(toAdd.length == 0 && toUpdate.length == 0 && toDelete.length == 0){
			return;
		}
		var data = SyncService.buildAllData(SyncType.PRACTICEPROGRESS, {"add":toAdd, "update":toUpdate, "delete":toDelete});
		data = SyncService.buildDataList([data]);
		SyncService.syncToServer(data, 2);		

	}
	//更新本地数据库
	function genLocalUpdate(serverData, localData){
		var sql = "INSERT INTO userdb.practice_progress(law_id, chapter_id, type, question_id) VALUES (?, ?, ?, ?)";
		var toAdd = [];
		// $log.debug('genLocalUpdate', JSON.stringify(serverData), JSON.stringify(localData));
		for(var sidx in serverData){
			var contain = false;
			for(var lidx in localData){
				if(localData[lidx].chapter_id == serverData[sidx].chapter_id 
					&& localData[lidx].law_id == serverData[sidx].law_id
					&& localData[lidx].type == serverData[sidx].type
				){
					//存在相同的
					contain = true;
					break;
				}
			}

			//如果不存在，加入到本地数据库
			if(contain == false){
				toAdd.push(serverData[sidx]);
			}
		}

		var sqlArr = [];
		for(var idx in toAdd){
			$log.debug('update local practice progress db:', JSON.stringify(toAdd[idx]));
			sqlArr.push([sql, [toAdd[idx].law_id, toAdd[idx].chapter_id, toAdd[idx].type, toAdd[idx].qid]]);
		}

		$log.debug('to be add to local pratice data:', JSON.stringify(toAdd));

		DB.multiTransaction(
			sqlArr,
			function(){
				$log.debug('sync practice data sucess');
			}, 
			function(error){
				$log.debug('sync practice data errors', JSON.stringify(error));
			}
		);

	}

	function syncAllSuccessCbk(data){
		var sql = "SELECT * FROM userdb.practice_progress";
		if(data){
			//如果有数据返回，和本地数据进行比较，生成需要的列表
			$log.debug('sync all practice_progress ok:', JSON.stringify(data));
			var promise = DB.queryForList(sql);
			promise.then(
				function(dbres){
					$log.debug('local db practice_progress data:', JSON.stringify(dbres));
					genUpload(data, dbres);
					genLocalUpdate(data, dbres);
				},
				function(error){
					$log.debug('sync practice local db error:', JSON.stringify(error));
				}
			);
		}
	}

	function syncAllErrorCbk(error){
		$log.debug('sync pratice progress error:', JSON.stringify(error));
	}

	/*
	同步所有章节有关数据
	*/
	function syncAllPracticeProgress(){
		SyncService.syncAll(SyncType.PRACTICEPROGRESS, syncAllSuccessCbk, syncAllErrorCbk);
	}


	function genStatUpload(serverData, localData){
		$log.debug('gen stat upload data', JSON.stringify(serverData), JSON.stringify(localData));
		var toUpdate = [];
		var toAdd = [];
		var toDelete = [];
		for(var lidx in localData){
			var contain = false;
			var update = false;
			for(var sidx in serverData){
				if(localData[lidx].qid == serverData[sidx].qid){
					// $log.info('contain ', JSON.stringify(serverData[sidx]));
					contain = true;
					if(localData[lidx].correct_num != serverData[sidx].correct_num ||
						localData[lidx].error_num != serverData[sidx].error_num){
						//需要update
						update = true;
						toUpdate.push(localData[lidx]);
					}
					break;
				}
			}
			//如果不包含
			if(contain == false && update == false){
				toAdd.push(localData[lidx]);
			}
		}

		var data = SyncService.buildAllData(SyncType.PRACTICE_STAT, {"add":toAdd, "update":toUpdate, "delete":toDelete});
		data = SyncService.buildDataList([data]);
		SyncService.syncToServer(data, 2);		

	}

	function genStatLocalUpdate(serverData, localData){
		$log.debug('gen stat local update data');
		var toAdd = [];
		for(var sidx in serverData){
			var contain = false;
			for(var lidx in localData){
				if(serverData[sidx].qid == localData[lidx].qid){
					contain = true;
					break;
				}
			}
			if(contain == false){
				toAdd.push(serverData[sidx]);
			}
		}

		//加入数据库
		var sqlArr = [];
		var sql = 'INSERT INTO userdb.practice_stat(qid, correct_num, error_num) VALUES (?,?,?)';
		for(var idx in toAdd){
			sqlArr.push([sql, [toAdd[idx].qid, toAdd[idx].correct_num, toAdd[idx].error_num]]);
		}

		DB.multiTransaction(
			sqlArr,
			function(){
				$log.debug('sync local stat data ok');
			},
			function(){
				$log.error('sync local stat data error');
			}
		);

	}

	/*
	同步数据成功
	*/
	function syncStatSuccessCbk(data){
		$log.debug('sync stat success', JSON.stringify(data));
		var sql = "SELECT * FROM userdb.practice_stat";
		var promise = DB.queryForList(sql);
		promise.then(
			function(dbres){
				genStatUpload(data, dbres);
				genStatLocalUpdate(data, dbres);
			},
			function(error){
				$log.error('get stat db data error:', JSON.stringify(error));
			}
		);

	}

	function syncStatErrorCbk(error){
		$log.debug('sync stat error:', JSON.stringify(error));
	}

	function syncAllStat(){
		$log.debug('sync all stat start');
		SyncService.syncAll(SyncType.PRACTICE_STAT, syncStatSuccessCbk, syncStatErrorCbk);
	}

	return {
		//保存eventsource，用来统计用户每天的学习情况
		savePracticeEventSource : function(qid, correct){
			var sql = "INSERT INTO userdb.practice_event_source(qid, correct) VALUES ({0}, {1})";
			sql = Strings.format(sql, [qid, correct ? 1 : 0]);
			DB.execute(sql);

			syncEventSource(qid, correct);

		},
		syncAllStat : syncAllStat,
		syncAllPracticeProgress : syncAllPracticeProgress,
		//读取当前章节的学习进度
		loadChapterProgress: function(lawid, chapterId, type){
			if(chapterId != 0){
				var sql = "SELECT question_id FROM userdb.practice_progress p, question_answer q WHERE q.id = p.question_id and q.emulate != -1 and p.law_id = {0} AND p.chapter_id = {1} AND p.type = {2}";
				sql = Strings.format(sql, [lawid, chapterId, type]);
			}else{
				var sql = "SELECT question_id FROM userdb.practice_progress p, question_answer q WHERE q.emulate != -1 AND p.chapter_id = 0 AND p.question_id = q.id AND q.law_id = {0} AND p.type = {1}";
				sql = Strings.format(sql, [lawid, type]);
			}
			var promise = DB.queryForObject(sql);
			return promise.then(
				function(data){
					return data != null ? data.question_id : null;
				}, function(error){
					$log.info('load chapter progress error:', JSON.stringify(error));
				}
			);
		},
		//检查是否有未完成的学习进度，用来在进入程序时提示用户, depressed
		loadLastProgress : function(){
			var sql = "select question_id from userdb.practice_progress order by last_modified desc limit 1";
			return DB.queryForObject(sql);
		},
		//增加错题
		addProgressStat : function(qid, result){
			var col = result ? 'correct_num' : 'error_num';
			var query = "INSERT OR IGNORE INTO userdb.practice_stat(qid, " + col + ") VALUES (" + qid + ", 0)";
			var query2 = "UPDATE userdb.practice_stat SET {0} = {0} + 1, last_modified = date('now') WHERE qid = {1}";
			query2 = Strings.format(query2, [col, qid]);
			DB.multiTransaction([query, query2], 
				function(data){
					var query = "SELECT * FROM practice_stat WHERE qid = " + qid;
					var promise = DB.queryForObject(query);
					promise.then(
						function(data){
							if(data != null){
								$log.debug('get progress stat data:', JSON.stringify(data));
								// syncProgressStat(data.qid, data.correct_num, data.error_num);
							}
						},
						function(error){$log.debug('get practice stat error', JSON.stringify(error));}
					);
				},
				function(error){
					$log.debug('update progress data error:', JSON.stringify(error));
				}
			);

			// SyncService.syncToServer(SyncAction.ADD, SyncType.PRACTICE_STAT, null, );
			// ErrorExamService.syncErrors(SyncAction.ADD, qid);
		},
		//保存进度
		saveProgress : function(lawid, chapterId, qtype, qid){
			var query = "REPLACE INTO userdb.practice_progress(law_id, chapter_id, question_id, type) VALUES ({0}, {1}, {2}, {3})";	
			if(chapterId != 0){
				query = Strings.format(query, new Array(lawid, chapterId, qid, qtype));
			}else{
				query = Strings.format(query, new Array(lawid, '0', qid, qtype));
			}

			DB.execute(query);

			// syncPracticeProgress(lawid, chapterId, qtype, qid);
		}

	};
});