angular.module('starter.services')
.factory('ExpressService', function ($http, ENDPOINTS, $log, Common, AuthService) {

	var newExperessNum = 0;

	var beginId = 0;
	var endId = 0;
	var currentPos = 0;
	var hasNewData = true;
	var expressList = [];

	function add(obj){
		expressList.push(obj);
	}

	function addList(objList) {
		for(var idx in objList){
			add(objList[idx]);
		}
	}

	function getHasNewData() {
		return hasNewData;
	}

	function setHasNewData(newdata){
		hasNewData = newdata;
	}

	function getExpressList(){
		return expressList;
	}

	function getNewExpressNum () {
		return newExperessNum;
	}

	function resetNewExpressNum(){
		newExperessNum = 0;
	}

	//加载某个值
	function loadExpressList(from, size){
		// $log.debug('express loadOutlink enter');
		return $http.get(Common.buildUrl(ENDPOINTS.expressListUrl, {from:from, size:size}));
	}

	function loadMore(){
		//获取begin开始的10条数据，如果到达下限，不能再提供loadmore
		return loadExpressList(currentPos, 10);
	}

	function setCurrentPos(pos){
		currentPos = pos;
	}

	function getCurrentPos(){
		return currentPos;
	}

	return {
		getHasNewData : getHasNewData,
		setHasNewData : setHasNewData,
		setCurrentPos : setCurrentPos,
		getCurrentPos : getCurrentPos,
		add : add,
		addList : addList,
		getExpressList : getExpressList,
		loadMore : loadMore,
		getNewExpressNum : getNewExpressNum,
		resetNewExpressNum : resetNewExpressNum,
		loadExpress : function(id){
			$log.debug('express loadOutlink enter');
			var promise = $http.get(Common.buildUrl(ENDPOINTS.expressIdUrl, {id:id}));

			return promise.then(
				function(data){
					var content = '';

					if(data.data){
 						content += '<h4>' + data.data.title + '</h4>';
						content += '<p>' + data.data.content + '</p>';
					}

					return {outline:content};

				},
				function(error){
					$log.debug('express load error:', JSON.stringify(error));
					return null;
				}
			);
		},

		/*
		检查是否有新的通知,需要最新的id
		*/
		checkNewExpress : function () {
			var expressId = window.localStorage.getItem('expressid_' + AuthService.username());
			if(expressId == null){
				expressId = 0;
			}
			return $http.get(Common.buildUrl(ENDPOINTS.check_express_new, {id:expressId}));
		},

		loadExpressList : loadExpressList,

	};

});
