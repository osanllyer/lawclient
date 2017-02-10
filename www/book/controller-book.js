/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('BookCtrl', function($scope, $controller, $log, $state, BookmarkService){
	$log.debug('book ctrl enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 4;
	// 跳转到书签页面
	$scope.bookmark = function(){
		$log.debug('go bookmark');
		$state.go('tab.menu.practice.bookmark');
	};
	$scope.$on('$ionicView.beforeEnter', function(event){
		$scope.lastRead = BookmarkService.loadLastRead();
	});
})
.controller('BookEntryCtrl', function($scope, $log, $stateParams, $ionicActionSheet, $ionicScrollDelegate, $ionicPopover, $ionicPopup, BookService, OutlineService, Common, BookmarkService){
	/*
	书籍
	*/
	//如果传入的stateparams中有seg，说明是搜索结果过来的，这种情况不应该保存进度，不应该显示footerbar


	$scope.$on('$ionicView.beforeEnter', function(event){

		$scope.showFooterBar = true;
		$scope.saveProgress = true;

		if(angular.isDefined($stateParams.showFooterBar)){
			$scope.showFooterBar = $stateParams.showFooterBar == 'true' ? true : false;
		}

		if(angular.isDefined($stateParams.saveProgress)){
			$scope.saveProgress = $stateParams.saveProgress;
		}

		// $log.debug('stateparams:', $scope.showFooterBar, $scope.saveProgress, $stateParams.showFooterBar, $stateParams.saveProgress);



		if($stateParams.seg_id != null){
			$scope.currentSeg = $stateParams.seg_id;
		}

		var fontSize = window.localStorage.getItem('book-font-size');
		if(fontSize){
			$scope.fontSize = fontSize - '0';
		}
		var bgImage = window.localStorage.getItem('book-background-image');
		if(bgImage){
			$scope.background = bgImage;
		}else{
			$scope.background = "img/bg/b25.png";
		}
		//查看是否有阅读记录，如果有,跳转到对应章节
		if($scope.saveProgress){

			var seg_pos = BookmarkService.loadChapterPosition($stateParams.chapterid);
			$log.debug('book seg position:', JSON.stringify(seg_pos));
			if(seg_pos != null){
				var seg = seg_pos[0];
				var pos = seg_pos[1];
				$scope.currentSeg = seg - '0';
				// $ionicScrollDelegate.$getByHandle('handler').scrollTo(0, pos, true);
			}else{
				$scope.currentSeg = 0;
			}

			// var seg = BookService.loadSegmentCache($stateParams.chapterid);
			// if(seg != null){
			// 	$scope.currentSeg = seg - '0';
			// }else{
			// 	$scope.currentSeg = 0;
			// }
		}
	});

	//滚动结束，保存位置
	$scope.scrollComplete = function () {
		var position = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top;
		BookmarkService.saveLastRead($stateParams.chapterid, $scope.currentSeg, position);
	};

	/*增加书签*/
	$scope.addBookmark = function(){
		$log.debug('add bookmark');

		$ionicPopup.prompt({
			title : '增加书签',
			template : '请输入书签名称',
			inputType : 'text',
			defaultText : '',
			cacelText : '放弃',
			okText : '保存'
		}).then(function(res){
			if(angular.isDefined(res)){
				var data = {};
				data.seg_id = $scope.currentSeg;
				//必须通过handle调用
				data.position = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top;
				//书签的名称，让用户输入
				data.description = res;
				data.cid = $stateParams.chapterid;
				$log.debug('add bookmark params:', JSON.stringify(data));
				BookmarkService.addBookmark(data);
			}
		});

	};

	$scope.chapterName = $stateParams.chapterName;

	$scope.segContent = '';
	$scope.chapter = [];

	$scope.segmentShow = false;
	// $scope.currentSeg = 0;

	$scope.fontSize = 1.25;

	$log.debug('book entry ctrl enter');
	var promise = BookService.loadBook($stateParams.chapterid);
	promise.then(
		function(data){
			$log.debug('load book ok:', JSON.stringify(data))
			if(data){
				for(var idx in data){
					$scope.chapter[data[idx].seg_id - 1] = {id:data[idx].seg_id, title:data[idx].seg_title,content:data[idx].seg_content};
				}
				fillBookContent(false);
			}
		},
		function(error){
			$log.debug('load book error:', JSON.stringify(error))
		}
	);

	promise = OutlineService.loadOutline($stateParams.chapterid);
	promise.then(
		function(data){
			if(data){
				$scope.outline = data.outline;
				fillBookContent(false);
			}
		},
		function(error){
			$log.debug(JSON.stringify(error));
		}
	);

	function fillBookContent(scrollTop){
		//保存进度
		if($scope.saveProgress){
			BookService.saveSegmentCache($stateParams.chapterid, $scope.currentSeg);
		}
		if($scope.currentSeg > 0){
			$log.debug('curent seg:', $scope.currentSeg);
			$scope.segContent = '<h4>第' + Common.number2Chinese(($scope.currentSeg)) + '节 ' +  $scope.chapter[$scope.currentSeg-1].title + '</h4>';
			$scope.segContent += $scope.chapter[$scope.currentSeg - 1].content;
		}else{
			$scope.segContent = $scope.outline;
		}
		// $log.debug('scroll position:', $stateParams.position);
		// if(angular.isDefined($stateParams.position) && $stateParams.position != 0){
		// 	//如果有以前保存的位置
		// 	$ionicScrollDelegate.$getByHandle('handler').scrollTo(0,$stateParams.position,true);
		// }else{
		// 	$ionicScrollDelegate.$getByHandle('handler').scrollTop();
		// }
		if(scrollTop){
			$log.debug('滚动到顶部：', scrollTop);
			$ionicScrollDelegate.$getByHandle('handler').scrollTop();
			//需要清理一下缓存记录，否则会导致无法定位到新到地方
			BookmarkService.saveLastRead($stateParams.chapterid, $scope.currentSeg, 0);
		}else{
			//判断是不是传入了一个可以滚动的位置，如果是，就滚动到这个位置，如果不是，就滚动到最后一次阅读位置
			if(angular.isDefined($stateParams.position)){
				$ionicScrollDelegate.$getByHandle('handler').scrollTo(0, $stateParams.position, true);
			}else{
				var seg_pos = BookmarkService.loadChapterPosition($stateParams.chapterid);
				$log.debug('book seg position:', JSON.stringify(seg_pos));
				if(seg_pos != null){
					var pos = seg_pos[1];
					$ionicScrollDelegate.$getByHandle('handler').scrollTo(0, pos, true);
				}
			}
		}
	}

	//往前
	$scope.prev = function(){
		if($scope.currentSeg > 0){
			$scope.currentSeg -= 1;
			fillBookContent(true);
		}
	};

	//往后
	$scope.next = function(){
		if($scope.currentSeg < $scope.chapter.length ){
			$scope.currentSeg += 1;
			fillBookContent(true);
		}
	};

	$scope.showSegments = function(){

		var buttonDesc = [{text: $scope.currentSeg == 0 ? '<b>大纲</b>' : '大纲'}];
		for(var idx in $scope.chapter){
			var t = $scope.chapter[idx].id + '. ' + $scope.chapter[idx].title;
			if(idx == $scope.currentSeg - 1){
				t = '<b>' + t + '</b>';
			}
			buttonDesc.push({text:t});
		}
		var segments = $ionicActionSheet.show({
			buttons : buttonDesc,
			buttonClicked : function(idx){
				$scope.currentSeg = idx;
				fillBookContent(true);
				return true;
			}
		});
	};

	$scope.increaseFontSize = function(){
		if($scope.fontSize < 3){
			$scope.fontSize += 0.25;
		}
		window.localStorage.setItem('book-font-size', $scope.fontSize);
	}

	$scope.reduceFontSize = function(){
		if($scope.fontSize > 1){
			$scope.fontSize -= 0.25;
		}
		window.localStorage.setItem('book-font-size', $scope.fontSize);
	}

	$scope.setBackground = function(bgImage){
		$log.debug("set background:" + bgImage);
		$scope.background = bgImage;
		window.localStorage.setItem('book-background-image', bgImage);
	};

	$scope.bgImageArr = ["img/bg/mz.png", "img/bg/paper-6.png", "img/bg/paper-11.png", "img/bg/b25.png"];

	$ionicPopover.fromTemplateUrl('outline/popover.html', {scope : $scope}).then(
		function(popover){
			$log.debug("create popover");
			$scope.popover = popover;
		}
	);

	$scope.openPopover = function($event){
		$scope.popover.show($event);
	};
});
