angular.module('starter.services')
.factory('RandomService', function(DB, $log){
	return {
		//生成随机数组
		// generateQidArr : function(min, max){
		// 	var len = max - min + 1;
		// 	var mini = min;
		// 	var arr = new Array(len);
		// 	//填充
		// 	for(var i=0; i<len; i++, mini++){
		// 		arr[i] = mini;
		// 	}
		// 	$log.debug(arr);
		// 	for(var i=0; i<len; i++){
		// 		var toSwapIdx = Math.floor(Math.random() * len);
		// 		var item = arr[i];
		// 		arr[i] = arr[toSwapIdx];
		// 		arr[toSwapIdx] = item;
		// 	}
		// 	$log.debug(arr);

		// 	return arr;
		// },
		generateQidArr : function(){
			var sql = "SELECT id FROM question_answer WHERE emulate != -1";
			var promise = DB.queryForList(sql);
			var arr = [];
			return promise.then(
				function(data){
					if(data){
						$log.debug('get random qid data:', JSON.stringify(data));
						for(var idx in data){
							arr.push(data[idx].id);
						}
						var len = arr.length;
						for(var i=0; i<len; i++){
							var toSwapIdx = Math.floor(Math.random() * len);
							var item = arr[i];
							arr[i] = arr[toSwapIdx];
							arr[toSwapIdx] = item;
						}
					}
					return arr;
				},
				function(error){
					$log.debug('get random sql error:', JSON.stringify(error));
					return arr;
				}
			);
		}
	};
});
