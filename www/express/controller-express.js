angular.module('starter.controllers')
.controller('ExpressCtrl', function ($scope, $controller, $stateParams, ExpressService) {
	$scope.viewtitle = "今日速递";
	$scope.loadOutline = ExpressService.loadExpress;
	$controller('BaselineEntryCtrl', {$scope:$scope});

})
.controller('ExpressListCtrl', function($scope, $log, $state, ExpressService, AuthService, $rootScope){

	$log.debug("enter expresslist ctrl");
	// $scope.hasNewData = true;
	$scope.hasNewData = ExpressService.getHasNewData();
	/**
	进入之前加载数据
	*/
	$scope.$on('$ionicView.beforeEnter', function(event){
		$log.debug('before express list ctrl enter', $scope.expressList);
		$scope.expressList = ExpressService.getExpressList();
		if($scope.expressList.length > 0){
			$log.debug('load from cached express:', JSON.stringify($scope.expressList));
			return;
		}
		var promise = ExpressService.loadExpressList(0, 10);
		promise.then(
			function(data){
				if(data){
					$scope.expressList = data.data;
					ExpressService.addList($scope.expressList);
					$log.debug('expresslist:', JSON.stringify($scope.expressList));
					//将最大的id值写入localstorage
					var max = $scope.expressList[0].id;
					window.localStorage.setItem('expressid_' + AuthService.username(), max);
					ExpressService.setCurrentPos(10);
				}
			},
			function(error){
				$log.debug('load expresslist error:', JSON.stringify(error));
			}
		);
	});

	$scope.showExpress = function(id){
		// alert(id);
		//将newexpresscount设置为0
		ExpressService.resetNewExpressNum();
		$state.go('tab.menu.practice.express', {chapterid:id});
	};

	$scope.fetchLatestExpress = function(){
		var promise = ExpressService.loadExpressList(0,10);
		promise.then(
			function(data){
				$log.debug('fetch lastest express ok:', JSON.stringify(data));
				//在用户列表
		        $scope.$broadcast('scroll.refreshComplete');
			},
			function(error){
				$log.debug('fetch lastest express error:', JSON.stringify(error));
				$scope.$broadcast('scroll.refreshComplete');
			}
		);
	};

	$scope.fetcExpressList = function(){

	};

	$scope.loadMore = function(){
		var promise = ExpressService.loadMore();
		promise.then(
			function(data){
				if(data.data){
					var expressList = data.data;
					len = data.data.length;
					if(len < 10){
						//已经加载完所有的数据，不允许再次刷新，提示用户已经没有了
						$scope.hasNewData = false;
						ExpressService.setHasNewData(false);
					}

					ExpressService.setCurrentPos(ExpressService.getCurrentPos() + len);
					ExpressService.addList(expressList);
					for(var idx in expressList){
						$scope.expressList.push(expressList[idx]);
					}
					$log.debug('expressList after loadmore:', JSON.stringify($scope.expressList));
				}
				$log.debug('fetch loadmore express ok:', JSON.stringify(data));
      	$scope.$broadcast('scroll.infiniteScrollComplete');
			},
			function(error){
				$log.debug('fetch loadmore express error:', JSON.stringify(error));
				$scope.hasNewData = false;
				ExpressService.setHasNewData(false);
      	$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		);
	};

})
;
