angular.module('starter.services')
.factory('RealDao', function(DB, $cacheFactory, $log, Strings, SyncAction, SyncService, SyncType){

	function syncRealProgress(year, paper, qid, add_at){
		SyncService.buildCommonData(SyncAction.UPDATE, SyncType.REALPROGRESS, add_at,
			{year:year, exampaper:paper, qid:qid}
		);
	}

	function saveRealPosition(pos){
		window.localStorage.setItem('real_pos', pos);
	}

	function getRealPosition(){
		return window.localStorage.getItem('real_pos');
	}

	return {
		//存储真实位置
		getRealPosition : getRealPosition,
		saveRealPosition : saveRealPosition,
		syncRealProgress : syncRealProgress,
		/**
		加载某年份的某试卷，返回所有的题目id，按照试卷的实际顺序排序。
		*/
		loadRealExamPaper : function(year, paper){
			$log.debug('load real exampaper');
			//首先从缓存加载
			var cache = $cacheFactory.get('RealExamDao_' + year + '_' + paper);
			$log.debug('cache', JSON.stringify(cache));
			if(!cache){
				//如果没有创建缓存
				cache = $cacheFactory('RealExamDao_' + year + '_' + paper);
			}

			var qidArr = cache.get('qidArr');
			$log.debug('qidArr', JSON.stringify(qidArr));
			if(qidArr){
				return qidArr;
			}else{
				var query = "SELECT id FROM question_answer qa WHERE qa.published_at = '{0}' AND paper = {1} AND emulate != -1 ORDER by real_seq ASC";
				query = Strings.format(query, [year, paper]);
				$log.debug(query);
				var promise = DB.queryForList(query);
				return promise.then(function(data){
					if(data){
						var arr = new Array();
						for(var idx in data){
							arr.push(data[idx].id);
						}
						cache.put('qidArr', arr);
						$log.debug(JSON.stringify(arr));
						return arr;
					}
					return null;
				}, function(error){});
			}
		},

		/**
		加载某个章节的进度, 使用userdb，不再使用main db
		*/
		loadRealProgress : function(year, paper){
			$log.debug('load real progress');
			var query = "SELECT qid, state, answer FROM userdb.real_progress_2 WHERE exampaper = ? AND year = ? ORDER BY real_seq ASC";
			var promise = DB.queryForList(query, [paper, year]);
			return promise.then(function(data){
				if(data != null){
					return data.data;
				}else{
					return null;
				}
			}, function(error){
				$log.info(JSON.stringify(error));
				return null
			});
		},

		/**
		存储当前进度
		*/
		saveProgress : function(year, paper, qid){
			var query = "INSERT OR IGNORE INTO real_progress(year, exampaper, qid) VALUES ('{0}',{1},{2})";
			DB.execute(Strings.format(query, new Array(year, paper, qid)));
			query = "UPDATE real_progress SET qid = {0} WHERE year = '{1}' AND exampaper = {2}";
			DB.execute(Strings.format(query, new Array(qid, year, paper)));

			//同步到服务器
			syncRealProgress(year, paper, qid);

		}
	};
})
