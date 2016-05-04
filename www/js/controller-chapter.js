angular.module('starter.controllers.chapter', ['ngCordova', 'chart.js'])

.controller('ChapterEntryCtrl', function($scope, $stateParams, $state, $log, ProgressDao, ChapterDao) {
  

	//获取题型统计信息
	$scope.singleChoice = 0;
	$scope.multiChoice = 0;
	$scope.essayQuestion = 0;
	$scope.uncertainChoice = 0;

	var typeStatPromise = ChapterDao.getQuestionTypeCounts($stateParams.chapterid);
	typeStatPromise.then(function(data){
		if(data){
			for(var idx in data){
				switch(data[idx].type){
					case 1:
						$scope.singleChoice = data[idx].count;
						break;
					case 2:
						$scope.multiChoice = data[idx].count;
						break;
					case 3:
						$scope.uncertainChoice = data[idx].count;
						break;
					case 4:
						$scope.essayQuestion = data[idx].count;
				}
			}
		}else{$log.debug("no question type stat");};
	}, function(error){});	

	//错题统计
	$scope.errorQuestion = 0;
	var errorStatPromise = ChapterDao.getErrorQuestionCount($stateParams.chapterid);
	errorStatPromise.then(
		function(data){
			if(data){
				$scope.errorQuestion = data.count;
			}else{
				$log.debug('no error question data found');
			}
		},
		function(error){}
	);

  $scope.labels = ["错误", "正确"];
  $scope.data = [30, 170];
  
  /**
	param: questionType : 1 单选，2 多选 3 不定项 4 简述 5 论述
  */
  $scope.beginPractice = function(questionType){
  	//先读取是否有正在复习的进度
  	var chapterId = $stateParams.chapterid;
  	var progressPromise = ProgressDao.loadChapterProgress(chapterId);
  	progressPromise.then(  	
	  	function(data){
	  		if(data){
	  			//如果有，就从当前进度开始
	  			$state.go(
	  				'tab.menu.practice.exam', 
	  				{chapterid:$stateParams.chapterid, qtype:questionType, qid:data.question_id}
	  			);
	  		}else{
	  			//如果没有，从头开始
	  			var chapterPromise = ChapterDao.getChapterStartQuestionId(chapterId);
	  			chapterPromise.then(function(data){
	  				if(data){
		  				$state.go(
		  					'tab.menu.practice.exam', 
		  					{chapterid:$stateParams.chapterid, qtype:questionType, qid:data.id}
		  				);
	  				}else{
	  					//本章没有内容，什么都不做
	  				}
	  			}, function(error){});
	  		}
	  	},
	  	function(error){
	  		$log.debug(error);
	  	}
  	);
  };
})
.controller('ChapterCtrl', function($scope, $cordovaSQLite, DB){
	console.log('chpaterctrl enter');

	  $scope.groups = [];
	
	  $scope.toggleGroup = function(group) {
		    group.show = !group.show;
		  };
	  $scope.isGroupShown = function(group) {
	  	//group may be null, to be corrected
	  	if(group){
	    	return group.show;
		}
	  };

	  $scope.loadChapter = function(){
	  	var query = "select l.id as lid, l.name as lawName, c.id as cid, c.name as chapterName from law l " + 
	  				" left join law_chapter c on (l.id = c.law_id) order by l.id asc, c.id asc";
	  	var db = DB.getDB();
	  	db.transaction(function(tx){
	  		tx.executeSql(query, [], function(tx, results){
	  			var length = results.rows.length;
	  			for(var i=0; i<length; i++){
	  				var row = results.rows.item(i);
	  				$scope.groups[row.lid] = {id : row.lid, name : row.lawName, chapters:[], show : false};
	  			}
	  			for(var i=0; i<length; i++){
	  				var row = results.rows.item(i);
	  				$scope.groups[row.lid].chapters.push({id:row.cid, name:row.chapterName});
	  			}
	  		}, null);
	  	});
	  };

	  $scope.loadChapter();
})
.controller('PracticeCtrl', function($scope){})
.controller('ExamCtrl', function($scope, $stateParams, $rootScope, ChapterDao, ProgressDao, $log){
	console.log('eaxmctrl enter');
	// console.log($stateParams);
	var qtype = $stateParams.qtype;
	var qid = $stateParams.qid;
	var chapterid = $stateParams.chapterid;
	
	//读取总数，准备分页
	var itemPromise = ChapterDao.getTotalCount(chapterid, qtype);

	itemPromise.then(function(data){
		if(data){
			$scope.total = data.total;
		}
	}, function(error){});
	//读取试题
	itemPromise = ChapterDao.getChapterQuestion(chapterid, qid);
	$log.debug("qid", qid);
	itemPromise.then(function(data){
		if(data){
			var item = data;
			console.log(item);
			$scope.qid = item.id;
			$scope.title = item.question;
			$scope.choices = new Array(item.a, item.b, item.c, item.d);
			$scope.analysis = item.analysis;
		}else{
			//no data found, should alert the user.
		}
	}, function(error){});

	//读取上一条记录id
	itemPromise = ChapterDao.getPrevId(chapterid, qid, qtype);
	itemPromise.then(function(data){

		$scope.previd = data ? data.id : -1;
	}, function(error){});
	//读取吓一条记录id
	itemPromise = ChapterDao.getNextId(chapterid, qid, qtype);
	itemPromise.then(function(data){
		$scope.nextid = data ? data.id : -1;
	}, function(error){});

	$scope.show = false;
	$scope.isShowAnalysis = function(){
		return $scope.show;
	};
	$scope.toggleAnalysis = function(){
		$scope.show = !$scope.show;
	};
	//收藏功能
	var favPromise = ChapterDao.loadFavorite(qid);
	favPromise.then(function(data){
		$scope.fav = data ? true : false; 
	}, function(error){});
	
	$scope.toogleFavorite = function(){
		//reverse the fav state
		$scope.fav = !$scope.fav;
		if($scope.fav){
			//增加收藏
			ChapterDao.addFavorite($scope.qid);
		}else{
			//删除收藏
			ChapterDao.removeFavorite($scope.qid);
		}
	};
	console.log($scope);
});

;