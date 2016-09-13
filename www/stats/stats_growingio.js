angular.module('starter.services')
.factory('GrowingIOService', function() {
	//growing io 统计服务
	return {
		//设置用户属性
		setCS : function(seq, csKey, csValue){
			if(angular.isDefined(window.cordova)){
				cordova.exec(
					null,
					null,
					"growingio-plugin", 
					"setCS", [
				    	['setCS' + seq, csKey, csValue]
				    ]
				);
			}
		}
	};
});