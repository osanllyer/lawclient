angular.module('starter.services.configuration', ['ngCordova'])
.factory('Confs', function(){
	return {
		//试卷1法律
		LAW_PAPER_1 : '1,2,3,4,5,6,7,8,9',
		//试卷2法律
		LAW_PAPER_2 : '10,11,12',
		//试卷3法律
		LAW_PAPER_3 : '13,14,15',
		//试卷4法律所有章节
		LAW_PAPER_4 : '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
	};
});