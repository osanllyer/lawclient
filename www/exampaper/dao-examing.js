angular.module('starter.services')
.factory('ExamDao', function(DB, Strings, Confs, $log){
	return {
		/**
		删除现有的数据
		*/
		removeExamPaper : function(){
			var query = "DELETE FROM exam";
			DB.queryForObject(query);
		},
		/**
		根据id获取试卷题目
		*/
		getExamPaper : function(id){
			var query = "SELECT qa.* FROM question_answer qa, exam e WHERE e.qid = qa.id AND e.id = " + id;
			return DB.queryForObject(query);
		},
		/**
		生成试卷
		*/
		genExamPaper : function(){

			var insert = "INSERT into exam(qid) VALUES ("; 
			var qid = new Array();
			var query = "SELECT qa.id as qid FROM question_answer qa, law_chapter l WHERE l.id = qa.chapter_id " +
					 " and l.law_id in ({0}) and qa.type = {1} order by random() limit {2}";

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
						var ids = idArr.join("),(") + ")";
						$log.debug(idArr, insert + ids);
						DB.insert(insert + ids);
						$log.debug("paper 1 inserted");
					}else{
						$log.debug('no data found');
					}
				}, function(error){$log.debug(error)});				
			};
			//试卷1单选题
			getIdAndInsertExam([Confs.LAW_PAPER_1, '1', '50']);
			//试卷1多选题
			getIdAndInsertExam([Confs.LAW_PAPER_1, '2', '50']);
			//试卷2单选
			getIdAndInsertExam([Confs.LAW_PAPER_2, '1', '50']);
			//试卷2多选
			getIdAndInsertExam([Confs.LAW_PAPER_2, '2', '50']);
			//试卷3单选
			getIdAndInsertExam([Confs.LAW_PAPER_3, '1', '50']);
			//试卷3多选
			getIdAndInsertExam([Confs.LAW_PAPER_3, '2', '50']);
			//试卷四
			getIdAndInsertExam([Confs.LAW_PAPER_4, '1', '6']);
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