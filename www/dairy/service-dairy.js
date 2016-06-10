angular.module('starter.services')
.factory('DairyService', function(DB, $log, $filter, Common, Strings){
	return {
		//获取某天的统计,测试通过
		getDateStatistics : function(date){
			var query = 'SELECT count(1) as total, sum(correct) as correctNum FROM practice_event_source WHERE date(last_modified) = "' + date + '"';
			$log.debug(query);
			return DB.queryForObject(query);
		},

		//获取本周的做题趋势
		getWeekStatistics : function(date){

			var week = Common.weekDate(date);
			$log.debug(week.start, week.end);
			var query = "SELECT date(last_modified) as date, count(1) as total, sum(correct) as correctNum FROM practice_event_source where last_modified >= '{0}' and last_modified < '{1}' group by date(last_modified)";
			query = Strings.format(query, [week.start, week.end]);
			$log.debug(query);
			return DB.queryForList(query);
		},

		//获取本月的做题趋势
		getMonthStatistics : function(date){
			// return DB.queryForList(query);
		}
	};
});