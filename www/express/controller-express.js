angular.module('starter.controllers')
.controller('ExpressCtrl', function ($scope, $controller, $stateParams, ExpressService) {
	$scope.viewtitle = "今日速递";
	$scope.loadOutline = ExpressService.loadExpress;
	$controller('BaselineEntryCtrl', {$scope:$scope});

})
.controller('ExpressListCtrl', function($scope, $log, $state, ExpressService){
	
	$log.debug("enter expresslist ctrl");

	/**
	进入之前加载数据
	*/
	$scope.$on('$ionicView.beforeEnter', function(event){

		$log.debug('before express list ctrl enter');

		var promise = ExpressService.loadExpressList(0, 10);
		promise.then(
			function(data){
				if(data){
					$scope.expressList = data.data;
					$log.debug('expresslist:', JSON.stringify($scope.expressList));
				}
			},
			function(error){
				$log.debug('load expresslist error:', JSON.stringify(error));
			}
		);
	});

	$scope.showExpress = function(id){
		// alert(id);
		$state.go('tab.menu.practice.express', {chapterid:id});
	}

})
;