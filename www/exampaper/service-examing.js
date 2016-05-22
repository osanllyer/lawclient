angular.module('starter.services')
.factory('ExamService', function(DB, Strings, Confs, $log, Common){
	return {
		/**
		删除现有的数据
		*/
		removeExamPaper : function(){
			var query = "DELETE FROM exam";
			DB.execute(query);
		},
		/**
		根据id获取试卷题目
		*/
		getExamPaper : function(id){
			var offset = (id - 1) * 100;
			var limit = id == 4 ? 10 : 100;
			var query = "SELECT qid FROM exam WHERE paper = {0} LIMIT {1}, {2}";
			query = Strings.format(query, [id, offset, limit]);
			var promise = DB.queryForList(query);
			return promise.then(function(data){
				// alert(JSON.stringify(data));
				var arr = new Array();
				if(data){
					for(var idx in data){
						arr.push(data[idx].qid);
					}
				}
				return arr;
			}, function(error){$log.info(error)});
		},
		/**
		生成试卷
		*/
		genExamPaper : function(){
			$log.debug('gen exam paper');
			var insert = "INSERT into exam(qid, paper) VALUES ({0}, {1})"; 
			var qid = new Array();
			var query = "SELECT qa.id as qid FROM question_answer qa, law_chapter l WHERE l.id = qa.chapter_id " +
					 " AND l.law_id in ({0}) AND qa.type = {1} AND paper = {2} LIMIT {3}";
			//选出符合条件的id，然后随机排列。
			//试卷1单选题
			var getIdAndInsertExam = function(args){
				var lawForPaper = Strings.format(query, args);
				var itemPromise = DB.queryForList(lawForPaper);

				itemPromise.then(function(data){
					if(data){
						var idArr = new Array();
						$log.debug('data', data);
						for(var idx in data){
							idArr.push(data[idx].qid);
						}
						Common.randSortArray(idArr);
						for(var idx in idArr){
							DB.execute(Strings.format(insert, [idArr[idx], args[2]]));
						}
						$log.debug("paper 1 inserted");
					}else{
						$log.debug('no data found');
					}
				}, function(error){$log.debug(error)});				
			};
			//试卷1单选题
			getIdAndInsertExam([Confs.LAW_PAPER_1, '1', 1, '50']);
			//试卷1多选题
			getIdAndInsertExam([Confs.LAW_PAPER_1, '2', 1, '50']);
			//试卷2单选
			getIdAndInsertExam([Confs.LAW_PAPER_2, '1', 2, '50']);
			//试卷2多选
			getIdAndInsertExam([Confs.LAW_PAPER_2, '2', 2, '50']);
			//试卷3单选
			getIdAndInsertExam([Confs.LAW_PAPER_3, '1', 3, '50']);
			//试卷3多选
			getIdAndInsertExam([Confs.LAW_PAPER_3, '2', 3, '50']);
			//试卷四
			getIdAndInsertExam([Confs.LAW_PAPER_4, '1', 4, '6']);
		},
		/**
			检查是否有正在进行的考试
		*/
		checkExamProgress : function(){
			var query = "SELECT 1 FROM exam WHERE answer is NULL or answer = '' ";
			return DB.queryForObject(query);
		}
	};
});