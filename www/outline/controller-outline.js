/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('OutlineCtrl', function($scope, $controller, $log){
	$log.debug('out line ctrl enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 2;
})
.controller('OutlineEntryCtrl', function($scope, $controller, OutlineService){
	$scope.viewtitle = "大纲";
	$scope.loadOutline = OutlineService.loadOutline;	
	$controller('BaselineEntryCtrl', {$scope:$scope});

})
.controller('BaselineEntryCtrl', function($scope, $log, $stateParams, $filter, $ionicPopover){
	/*
	大纲
	*/

	//需要子类实现
	// $scope.loadOutline = function(){};

	$log.debug('outline entry ctrl enter');
	$scope.fontSize = 1.25;
	var outlinePromise = $scope.loadOutline($stateParams.chapterid);
	outlinePromise.then(
		function(data){
			$log.debug('load outline ok:', JSON.stringify(data))
			if(data){
				$scope.outline = data.outline;
			}
		}, 
		function(error){
			$log.debug('load outline error:', JSON.stringify(error))
		}
	);

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

	$scope.$on('$ionicView.beforeEnter', function(event){
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
	});

});