angular.module('starter.services')
.factory('ExamPaperListService', function(DB){
	return {
		//加载试卷列表
		loadExamPaperList : function(){
			var sql = "SELECT emulate FROM question_answer WHERE emulate != 0 GROUP BY emulate";
			return DB.queryForList(sql);
		}
	};
})
.factory('ExamService', function(DB, Strings, Confs, $log, Common){
	return {
		/**
		删除现有的数据
		*/
		removeExamPaper : function(callback){
			var query = "DELETE FROM exam";
			DB.multiTransaction([query], callback, function(error){$log.debug(error);});
		},
		/**
		根据id获取试卷题目
		*/
		getExamPaper : function(){
			var query = "SELECT qid FROM exam";
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
		genExamPaper : function(paper, success, error){
			$log.debug('gen exam paper');
			var insert = "INSERT into exam(qid, paper) VALUES (?,?)"; 
			var qid = new Array();
			// var query = "SELECT qa.id as qid FROM question_answer qa, law_chapter l WHERE l.id = qa.chapter_id " +
			// 		 " AND l.law_id in ({0}) AND qa.type = {1} AND paper = {2} LIMIT {3}";
			var query = "SELECT qa.id as qid FROM question_answer qa WHERE qa.type = {0} AND paper = {1}";
			//选出符合条件的id，然后随机排列。
			//试卷1单选题
			var getIdAndInsertExam = function(args){
				var lawForPaper = Strings.format(query, args);
				var itemPromise = DB.queryForList(lawForPaper);
				var sqlArr = [];
				itemPromise.then(function(data){
					if(data){
						var idArr = new Array();
						// $log.debug('data', data);
						for(var idx in data){
							idArr.push(data[idx].qid);
						}
						Common.randSortArray(idArr);
						$log.debug(JSON.stringify(idArr));
						for(var i=0; i<args[2]; i++){
							// DB.execute(Strings.format(insert, [idArr[idx], args[1]]));
							sqlArr.push([insert, [idArr[i], args[1]]]);
						}
						$log.debug(sqlArr);
						DB.multiTransaction(sqlArr, success, error);
						$log.debug("paper 1 inserted");
					}else{
						$log.debug('no data found');
					}
				}, function(error){$log.debug(error)});				
			};
			if(paper != 4){
				//试卷单选题
				getIdAndInsertExam(['1', paper, 50]);
				//试卷多选题
				getIdAndInsertExam(['2', paper, 40]);
				getIdAndInsertExam(['3', paper, 10]);
			}else{
				//试卷四
				getIdAndInsertExam(['4', 4, 6]);
			}
		},
		/**
			检查是否有正在进行的考试
		*/
		checkExamProgress : function(){
			var query = "SELECT 1 FROM exam WHERE answer is NULL or answer = '' ";
			return DB.queryForObject(query);
		},
		/*从数据库加载模拟题*/
		loadExamPaper : function(paperObj, success, error){
			var paperId = paperObj.paperId;
			var paper = paperObj.paper;
			var query = "SELECT id FROM question_answer WHERE emulate = {0} AND paper = {1}";
			var insert = "INSERT INTO exam(qid, paper) VALUES(?,?)";
			var promise = DB.queryForList(Strings.format(query, [paperId, paper]));
			promise.then(
				function(data){
					var arr = [];
					for(var idx in data){
						arr.push([insert, [data[idx].id, paper]]);
					}
					//插入到exam库
					DB.multiTransaction(arr, success, error);
				},
				function(error){$log.debug(JSON.stringify(error)); return [];}
			);
		}
	};
});