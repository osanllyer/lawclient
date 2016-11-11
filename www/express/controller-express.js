angular.module('starter.controllers')
.controller('ExpressCtrl', function ($scope, $controller, $stateParams, ExpressService) {
	$scope.viewtitle = "今日速递";
	$scope.loadOutline = ExpressService.loadExpress;
	$controller('BaselineEntryCtrl', {$scope:$scope});

})
.controller('ExpressListCtrl', function($scope, $log, $state, ExpressService, AuthService){
	
	$log.debug("enter expresslist ctrl");

	/**
	进入之前加载数据
	*/
	$scope.$on('$ionicView.beforeEnter', function(event){
		$log.debug('before express list ctrl enter', $scope.expresslist);
		if(angular.isDefined($scope.expresslist)){
			return;
		}
		var promise = ExpressService.loadExpressList(0, 10);
		promise.then(
			function(data){
				if(data){
					$scope.expressList = data.data;
					$log.debug('expresslist:', JSON.stringify($scope.expressList));
					//将最大的id值写入localstorage
					var max = $scope.expressList[0].id;
					window.localStorage.setItem('expressid_' + AuthService.username(), max);		
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
	}

})
;