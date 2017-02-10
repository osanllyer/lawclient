/**/
angular.module('starter.controllers')
.controller('ChapterEntryCtrl', function($scope, $stateParams, $state, $log, ProgressDao, ChapterDao) {

	$log.debug('ChapterEntryCtrl enter');

	//获取题型统计信息
	$scope.singleChoice = 0;
	$scope.multiChoice = 0;
	$scope.essayQuestion = 0;
	$scope.uncertainChoice = 0;

	$scope.canvasWidth = window.innerWidth;
	$scope.canvasHeight = window.innerHeight;


	var typeStatPromise = ChapterDao.getQuestionTypeCounts($stateParams.lawid, $stateParams.chapterid);
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

  $scope.labels = ["错误", "正确"];
  //统计已经做了多少道题目
  $scope.errorstat = [0, 0];
  $scope.$on('$ionicView.beforeEnter', function(event, data){
	var statPromise = ChapterDao.errorStat($stateParams.lawid, $stateParams.chapterid);
	statPromise.then(function(data){
	  	if(data){
	  		//必须有数据
	  		if(data.cn != null && data.en != null){
		  		$log.debug(data);
		  		$scope.errorstat[0] = data.en;
		  		$scope.errorstat[1] = data.cn;
		  		$log.debug($scope.errorstat);
	  		}
	  	}
	}, function(error){
		$log.debug('chapter entry beforeEnter load error stat', JSON.stringify(error));
	});

  	//错题统计
	$scope.errorQuestion = 0;
	var errorStatPromise = ChapterDao.getErrorQuestionCount($stateParams.lawid, $stateParams.chapterid);
	errorStatPromise.then(
		function(data){
			$log.debug('error state chapter desc:' + JSON.stringify(data));
			if(data){
				$scope.errorQuestion = data.count;
			}else{
				$log.debug('no error question data found');
			}
		},
		function(error){}
	);
  });



  /**
	param: questionType : 1 单选，2 多选 3 不定项 4 简述论述 5 error
  */
  	$scope.beginPractice = function(questionType){
  	//先读取是否有正在复习的进度
  		$log.debug('begin practice clicked', questionType);
		$state.go('tab.menu.practice.exam', {lawid:$stateParams.lawid, chapterid:$stateParams.chapterid, qtype:questionType});
	};
})
.controller('LawEntryCtrl', function($scope, $stateParams, $log, $controller, ProgressDao, ChapterDao){
	$controller('ChapterEntryCtrl', {$scope : $scope});
})
.controller('ChapterCtrl', function($scope, $rootScope, $cordovaSQLite, $state, $log, DB, $location, $ionicScrollDelegate){
	$log.debug('chpaterctrl enter');
	$scope.entryType = 1;
	//保存位置到缓存
	function savePosition(gid, cid){
		$log.debug('save position:', gid, cid);
		window.localStorage.setItem('bookpos', gid + '.' + cid);
	}

	/*
	gid: 书id
	cid: 章节id
	*/
	$scope.goEntry = function(gid, cid){
		switch($scope.entryType){
			case 1:
				savePosition(gid, cid);
				$state.go('tab.menu.practice.chpentry', {lawid: gid, chapterid:cid});
				break;
			case 2:
				savePosition(gid, cid);
				$state.go('tab.menu.practice.outlineentry', {lawid: gid, chapterid:cid});
				break;
			case 3:
				savePosition(gid, cid);

				$state.go('tab.menu.practice.pointentry', {lawid: gid, chapterid:cid});
				break;
			case 4:
				{
					savePosition(gid, cid);
					$state.go('tab.menu.practice.bookentry', {lawid: gid, chapterid:cid});
					break;
				}
			case 5:
				savePosition(gid, cid);
			//进入point
				$state.go('tab.menu.practice.pointentry', {lawid: gid, chapterid:cid});
				break;
			default:
				break;
		}
	}

	/*过滤*/
	$scope.lawFilter = function(item){return true;};

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

	  	$rootScope.db.transaction(function(tx){
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

	  //进入时，加载保存的位置
	  $scope.$on('$ionicView.beforeEnter', function(event, data){
	  	var pos = window.localStorage.getItem('bookpos');
	  	if(pos){
	  		$location.hash(pos);
	  		$ionicScrollDelegate.anchorScroll();
	  	}
	  });
})
.controller('PracticeCtrl', function($scope){})
.controller('ExamCtrl', function($scope, $stateParams, $rootScope, $log, $controller,
						progressQid, qidArr, ProgressDao, $interval, Common){
	$log.debug('eaxmctrl enter');
	$controller('BaseExamCtrl', {$scope : $scope, progressQid : progressQid, qidArr : qidArr});

	$scope.saveProgress = function(){
		ProgressDao.saveProgress($stateParams.lawid, $stateParams.chapterid, $stateParams.qtype, $scope.qid);
	}

	$scope.init();
	$scope.loadQuestion();
});

;
