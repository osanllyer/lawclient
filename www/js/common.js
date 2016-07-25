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
}).factory('Common', function($filter, $log){
	return {
		findIndex : function(item, arr){
			for(var idx in arr){
				if (arr[idx] == item){
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
		},

		dateFormat :  function(date, fmt)  { //author: meizz   
			  var o = {   
			    "M+" : date.getMonth()+1,                 //月份   
			    "d+" : date.getDate(),                    //日   
			    "h+" : date.getHours(),                   //小时   
			    "m+" : date.getMinutes(),                 //分   
			    "s+" : date.getSeconds(),                 //秒   
			    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
			    "S"  : date.getMilliseconds()             //毫秒   
			  };   
			  if(/(y+)/.test(fmt))   
			    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
			  for(var k in o)   
			    if(new RegExp("("+ k +")").test(fmt))   
			  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
			  return fmt;   
		},

		weekDate : function(date){
			var startDate = new Date(date);
			var diff = startDate.getDay();
			var strStartDate = $filter('date')(startDate.setDate(startDate.getDate() - diff), 'yyyy-MM-dd');
			var strEndDate = $filter('date')(startDate.setDate(startDate.getDate() + 8), 'yyyy-MM-dd');
			return {start: strStartDate, end : strEndDate};
		},
		//返回一周每天的日期
		weedDays : function(date){
			var days = [];
			var startDate = new Date(date);
			var diff = startDate.getDay();

			//这是正确的开始日期
			startDate.setDate(startDate.getDate() - diff);

			for(var i=0; i<7; i++){
				var strDate = $filter('date')(startDate.setDate(startDate.getDate() + i), 'yyyy-MM-dd');
				days.push(strDate);
			}

			return days;
		},
		fillArray : function(arr, obj){
			var len = arr.length;
			for(var i=0; i<len; i++){
				arr[i] = obj;
			}
		},

		number2Chinese : function (num){
		   var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
		   var chnUnitSection = ["","万","亿","万亿","亿亿"];
		   var chnUnitChar = ["","十","百","千"];

		   function SectionToChinese(section){
		       var strIns = '', chnStr = '';
		       var unitPos = 0;
		       var zero = true;
		       while(section > 0){
		           var v = section % 10;
		           if(v === 0){
		               if(!zero){
		                   zero = true;
		                   chnStr = chnNumChar[v] + chnStr;
		               }
		           }else{
		               zero = false;
		               strIns = chnNumChar[v];
		               strIns += chnUnitChar[unitPos];
		               chnStr = strIns + chnStr;
		           }
		           unitPos++;
		           section = Math.floor(section / 10);
		       }
		       return chnStr;
		   }

		  var unitPos = 0;
	      var strIns = '', chnStr = '';
	      var needZero = false;

	      if(num === 0){
	          return chnNumChar[0];
	      }

	      while(num > 0){
	          var section = num % 10000;
	          if(needZero){
	              chnStr = chnNumChar[0] + chnStr;
	          }
	          strIns = SectionToChinese(section);
	          strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
	          chnStr = strIns + chnStr;
	          needZero = (section < 1000) && (section > 0);
	          num = Math.floor(num / 10000);
	          unitPos++;
	      }

	      return chnStr;
		}
	};
})
.factory('Device', function(){
	return {
		S : 'S',
		M : 'M',
		L : 'L',
		deviceSize : function(){
			var height = window.screen.height * window.devicePixelRatio;
			var width = window.screen.width * window.devicePixelRatio;

			if(height < 1300){
				return 'S';
			}else if(height < 1900){
				return 'M';
			}else{
				return 'L';
			}
		}
	};
});