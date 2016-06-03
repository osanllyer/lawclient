angular.module('starter.services.commonservice', [])
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
		            result = result.split("{" + key + "}").join(value);
		        }
		    }
		    console.log("result:" , result);
		    return result;
		}
	};
}).factory('Common', function(){
	return {
		findIndex : function(item, arr){
			for(var idx in arr){
				if (arr[idx] == item){
					alert(idx);
					return idx;
				}
			}
			return -1;
		},
		//返回随机排序的数组
		randSortArray : function(arr){
			var len = arr.length;

			for(var idx=0; idx < len; idx++){
				var toSwap = Math.floor(Math.random() * len);
				var tmp = arr[toSwap];
				arr[toSwap] = arr[idx];
				arr[idx] = tmp;
			}
		},
		//将秒数转化为时间字符串00:00:00
		seconds2Time : function(seconds){
			if(seconds < 0) return '00:00:00';

			var hour = Math.floor(seconds / 3600);
			var minuter = Math.floor((seconds - hour * 3600) / 60);
			var second = seconds - hour * 3600 - minuter * 60;
			if (hour < 10){
				hour = '0' + hour;
			}

			if (minuter < 10){
				minuter = '0' + minuter;
			}

			if (second < 10){
				second = '0' + second;
			}
			return hour + ':' + minuter + ':' + second;

		},
		//生成url
		buildUrl : function EncodeQueryData(uri, data){
		   var ret = [];
		   for (var d in data)
		      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
		   return uri + "?" + ret.join("&");
		}
	};
});