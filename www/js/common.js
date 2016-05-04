angular.module('starter.services.commonservice', ['starter.services.commonservice'])
.factory('Strings', function(){
	return {
		//字符串格式化函数
		format : function(orgString, args) {
		    var result = orgString;
		    if (args.length < 1) {
		        return result;
		    }

		    var data = args; // 如果模板参数是数组
		    if (args.length == 1 && typeof (args) == "object") {
		        // 如果模板参数是对象
		        data = args;
		    }
		    for ( var key in data) {
		        var value = data[key];
		        if (undefined != value) {
		            result = result.replace("{" + key + "}", value);
		        }
		    }
		    console.log("result:" , result);
		    return result;
		}
	};
})