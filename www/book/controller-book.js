/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('BookCtrl', function($scope, $controller, $log){
	$log.debug('book ctrl enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 4;
}).controller('BookEntryCtrl', function($scope, $log, $stateParams, $ionicActionSheet, $ionicScrollDelegate, BookService, Common){
	/*
	书籍
	*/

	$scope.segContent = '即将上线更新';
	$scope.chapter = [];

	$scope.segmentShow = false;
	$scope.currentSeg = 0;

	$log.debug('book entry ctrl enter');
	var promise = BookService.loadBook($stateParams.chapterid);
	promise.then(
		function(data){
			$log.debug('load book ok:', JSON.stringify(data))
			if(data){
				for(var idx in data){
					$scope.chapter[data[idx].seg_id - 1] = {id:data[idx].seg_id, title:data[idx].seg_title,content:data[idx].seg_content};
				}
				fillBookContent();
			}
		}, 
		function(error){
			$log.debug('load book error:', JSON.stringify(error))
		}
	);

	function fillBookContent(){
		$scope.segContent = '<h4>第' + Common.number2Chinese(($scope.currentSeg + 1)) + '节 ' +  $scope.chapter[$scope.currentSeg].title + '</h4>';
		$scope.segContent += $scope.chapter[$scope.currentSeg].content;
		$ionicScrollDelegate.scrollTop();
	}

	$scope.chooseSeg = function(segId){
		$log.debug('choose seg clicked');
		$scope.currentSeg = segId - 1;
		fillBookContent();
	};

	//往前
	$scope.prev = function(){
		if($scope.currentSeg > 0){
			$scope.currentSeg -= 1;
			fillBookContent();
		} 
	};

	//往后
	$scope.next = function(){
		if($scope.currentSeg < $scope.chapter.length - 1){
			$scope.currentSeg += 1;
			fillBookContent();
		}
	};

	$scope.showSegments = function(){
		var buttonDesc = [];
		for(var idx in $scope.chapter){
			var t = $scope.chapter[idx].id + '. ' + $scope.chapter[idx].title;
			if(idx == $scope.currentSeg){
				t = '<b>' + t + '</b>';
			}
			buttonDesc.push({text:t});
		}
		var segments = $ionicActionSheet.show({
			buttons : buttonDesc,
			buttonClicked : function(idx){
				$scope.currentSeg = idx;
				fillBookContent();
				return true;
			}
		});
	};
});