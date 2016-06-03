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
  //统计已经做了多少道题目
  $scope.errorstat = [0, 0];
  var statPromise = ChapterDao.errorStat($stateParams.chapterid);
  statPromise.then(function(data){
  	if(data){
  		//必须有数据
  		if(data.cn != null && data.en != null){
	  		$log.debug(data);
	  		$scope.errorstat[0] = data.en;
	  		$scope.errorstat[1] = data.en + data.cn;
	  		$log.debug($scope.errorstat);
  		}
  	}
  }, function(error){$log.debug(error);});

  
  /**
	param: questionType : 1 单选，2 多选 3 不定项 4 简述 5 论述
  */
  	$scope.beginPractice = function(questionType){
  	//先读取是否有正在复习的进度
		$state.go('tab.menu.practice.exam', {chapterid:$stateParams.chapterid, qtype:questionType});
	};
})
.controller('ChapterCtrl', function($scope, $cordovaSQLite, DB){
	console.log('chpaterctrl enter');

	  $scope.groups = [];
	
	  $scope.toggleGroup = function(group) {
		    group.show = !group.show;
		    //如果打开了一个group，需要关闭其他所有的group
		    if(group.show){
		    	for(var idx in $scope.groups){
		    		if($scope.groups[idx].id != group.id){
		    			$scope.groups[idx].show = false;
		    		}
		    	}
		    }
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
.controller('ExamCtrl', function($scope, $stateParams, $rootScope, $log, $controller, 
						progressQid, qidArr, ProgressDao, $interval, Common){
	$log.debug('eaxmctrl enter');
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr});

	$scope.saveProgress = function(){
		ProgressDao.saveProgress($stateParams.chapterid, $stateParams.qtype, $scope.qid);
	}

	$scope.init();
	$scope.loadQuestion();
});

;