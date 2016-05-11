angular.module('starter.services')
.factory('RandomService', function($log){
	return {
		//生成随机数组
		generateQidArr : function(min, max){
			var len = max - min + 1;
			var mini = min;
			var arr = new Array(len);
			//填充
			for(var i=0; i<len; i++, mini++){
				arr[i] = mini;
			}
			$log.debug(arr);
			for(var i=0; i<len; i++){
				var toSwapIdx = Math.floor(Math.random() * len);
				var item = arr[i];
				arr[i] = arr[toSwapIdx];
				arr[toSwapIdx] = item;
			}
			$log.debug(arr);

			return arr;
		}
	};
});
