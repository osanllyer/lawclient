function copysucess(){
  $log.debug("copy success");
}

function copyerror(){
  $log.debug("copy error");
}
angular.module('starter.services')
.factory('DB', function($cordovaSQLite, $rootScope, $q, $log){
  return {
  	//load object
  	queryForObject : function queryForObject(sql){
  			var deferred = $q.defer();
	  		var res = null;		
			$cordovaSQLite.execute($rootScope.db, sql, []).then(
				function(resultset){
					if(resultset.rows.length > 0){
						res = resultset.rows.item(0);
					}
					deferred.resolve(res);
				},
				function(error){
					$log.debug(sql, error);
					deferred.reject(error);
				}
			);
			return deferred.promise;
  		},
  	//load for list
  	queryForList : function queryForList(sql){
		var deferred = $q.defer();
		var res = new Array();

		$cordovaSQLite.execute($rootScope.db, sql, []).then(
			function(resultset){
				if(resultset.rows.length > 0){
					for(var i=0; i<resultset.rows.length; i++){
						res.push(resultset.rows.item(i));
					}
					deferred.resolve(res);
				}
			},
			function(error){
				$log.debug(sql, error);
				deferred.reject(error);
			}
		);
		return deferred.promise;
	},

	execute : function insert(sql){
		$cordovaSQLite.execute($rootScope.db, sql, []).then(
			function(result){},
			function(error){$log.debug(sql, error)}
		);
	},

    getDB : function getDB(){
    	if(!$rootScope.db){
			$rootScope.db = window.openDatabase('law.db', '1.0', 'database', -1);
    	}
    	return $rootScope.db},
    copyDB : function copyDB(){
      //the second param 0 is for android
      window.plugins.sqlDB.copy("law.db", 0, copysuccess, copyerror);
    },

    initDB : function initDB(){
      if(!$rootScope.db){
      	$rootScope.db = window.openDatabase('law.db', '1.0', 'database', -1);
      }

      $log.debug("db is opened");

      var sqlarr = new Array(
      	'drop TABLE "law"',
      	'drop TABLE "law_chapter"',
      	'drop TABLE "question_type"',
      	'drop TABLE "question_answer"',
      	'drop TABLE "practice_stat"'
      	);
      for (var i = sqlarr.length - 1; i >= 0; i--) {
      	  $cordovaSQLite.execute($rootScope.db, sqlarr[i], null);      
      }

      sqlarr = new Array(
      	'CREATE TABLE "law" ("id" INTEGER PRIMARY KEY  NOT NULL , "name" TEXT NOT NULL  UNIQUE , "last_modified" DATETIME)',
      	'CREATE TABLE "law_chapter" ("id" INTEGER PRIMARY KEY  NOT NULL , "law_id" INTEGER NOT NULL , "name" TEXT NOT NULL , "last_modified" DATETIME)',
      	'CREATE TABLE "question_type" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "desc" TEXT NOT NULL )',
      	'CREATE TABLE "question_answer" ("id" INTEGER PRIMARY KEY  NOT NULL ,"type" INTEGER NOT NULL ,"question" TEXT NOT NULL ,"a" TEXT,"b" TEXT,"c" TEXT,"d" TEXT,"answer" TEXT,"analysis" TEXT DEFAULT (null) ,"published_at" DATETIME DEFAULT (CURRENT_DATE) ,"chapter_id" INTEGER,"last_modified" DATETIME NOT NULL  DEFAULT (CURRENT_DATE) , "real_seq" INTEGER DEFAULT 0, "paper" INTEGER)',
      	'CREATE TABLE "practice_progress" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "chapter_id" INTEGER NOT NULL  UNIQUE , "question_id" INTEGER NOT NULL , "last_modified" DATETIME NOT NULL  DEFAULT CURRENT_TIME)',
      	'CREATE TABLE "exam" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "answer" TEXT, "last_modified" DATETIME DEFAULT CURRENT_TIMESTAMP)',
      	'CREATE TABLE "favorite" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "last_modified"  DEFAULT CURRENT_TIMESTAMP)',
      	'CREATE TABLE "practice_stat" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "error_num" INTEGER DEFAULT 0, "correct_num" INTEGER DEFAULT 0, "last_modified" DATETIME DEFAULT CURRENT_TIME)',
      	'CREATE TABLE "real_progress" ("id" INTEGER PRIMARY KEY  NOT NULL ,"year" DATETIME,"exampaper" INTEGER,"qid" INTEGER DEFAULT (null) ,"last_modified" DATETIME DEFAULT (CURRENT_TIMESTAMP) )'
      	);
      for (var i = sqlarr.length - 1; i >= 0; i--) {
      	  $cordovaSQLite.execute($rootScope.db, sqlarr[i], null);      
      }




      $log.debug("table is created");

      var dataArr = new Array(
			"insert into law(id, name, last_modified) values(1, '中国特色社会主义法治理论', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(1, 1, '第一章 中国特色社会主义法治建设基本原理', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(2, 1, '第二章 法治工作的基本格局', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(3, 1, '第三章 法治工作的重要保障', datetime('now'))",
			"insert into law(id, name, last_modified) values(2, '法理学', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(4, 2, '第一章 法的本体', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(5, 2, '第二章 法的运行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(6, 2, '第三章 法的演进', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(7, 2, '第四章 法与社会', datetime('now'))",
			"insert into law(id, name, last_modified) values(3, '法制史', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(8, 3, '第一章 中国法制史', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(9, 3, '第二章 外国法制史', datetime('now'))",
			"insert into law(id, name, last_modified) values(4, '宪法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(10, 4, '第一章 宪法基本理论', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(11, 4, '第二章 国家的基本制度（上）', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(12, 4, '第三章 国家的基本制度（下）', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(13, 4, '第四章 公民的基本权利与义务', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(14, 4, '第五章 国家机构', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(15, 4, '第六章 宪法的实施及其保障', datetime('now'))",
			"insert into law(id, name, last_modified) values(5, '经济法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(16, 5, '第一章 竞争法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(17, 5, '第二章 消费者法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(18, 5, '第三章 食品安全法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(19, 5, '第四章 财税法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(20, 5, '第五章 劳动法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(21, 5, '第六章 土地法和房地产法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(22, 5, '第七章 环境保护法', datetime('now'))",
			"insert into law(id, name, last_modified) values(6, '国际法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(23, 6, '第一章 导 论', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(24, 6, '第二章 国际责任的构成和形式', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(25, 6, '第三章 国际法上的空间划分', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(26, 6, '第四章 国际法上的个人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(27, 6, '第五章 外交关系法与领事关系法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(28, 6, '第六章 条约法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(29, 6, '第七章 国际争端的和平解决', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(30, 6, '第八章 战争与武装冲突法', datetime('now'))",
			"insert into law(id, name, last_modified) values(7, '国际私法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(31, 7, '第一章 国际私法概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(32, 7, '第二章 国际私法的主体', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(33, 7, '第三章 法律冲突、冲突规范和准据法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(34, 7, '第四章 适用冲突规范的制度', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(35, 7, '第五章 国际民商事关系的法律适用', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(36, 7, '第六章 国际民商事争议的解决', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(37, 7, '第七章 区际法律问题', datetime('now'))",
			"insert into law(id, name, last_modified) values(8, '国际经济法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(38, 8, '第一章 导论', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(39, 8, '第二章 国际货物买卖', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(40, 8, '第三章 国际货物运输与保险', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(41, 8, '第四章 国际贸易支付', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(42, 8, '第五章 对外贸易管理制度', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(43, 8, '第六章 世界贸易组织', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(44, 8, '第七章 国际经济法领域的其他法律制度', datetime('now'))",
			"insert into law(id, name, last_modified) values(9, '司法制度与法律职业道德', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(45, 9, '第一章 司法制度和法律职业道德概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(46, 9, '第二章 审判制度与法官职业道德', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(47, 9, '第三章 检察制度与检察官职业道德', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(48, 9, '第四章 律师制度与律师职业道德', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(49, 9, '第五章 公证制度与公证员职业道德', datetime('now'))",
			"insert into law(id, name, last_modified) values(10, '刑法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(50, 10, '第一章 刑法概说', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(51, 10, '第二章 犯罪概说', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(52, 10, '第三章 犯罪构成', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(53, 10, '第四章 犯罪排除事由', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(54, 10, '第五章 犯罪未完成形态', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(55, 10, '第六章 共同犯罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(56, 10, '第七章 单位犯罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(57, 10, '第八章 因数形态', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(58, 10, '第九章 刑罚概说', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(59, 10, '第十章 刑罚种类', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(60, 10, '第十一章 刑罚裁量', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(61, 10, '第十二章 刑罚执行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(62, 10, '第十三章 刑罚消灭', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(63, 10, '第十四章 罪刑各论概说', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(64, 10, '第十五章 危害国家安全罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(65, 10, '第十六章 危���公共安全罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(66, 10, '第十七章 破坏社会主义市场经济秩序罪（1）生产、销售伪劣商品罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(67, 10, '第十八章 破坏社会主义市场经济秩序罪（2）走私罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(68, 10, '第十九章 破坏社会主义市场经济秩序罪（3）妨害对公司、企业的管理秩序罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(69, 10, '第二十章 破坏社会主义市场经济秩序罪（4）破坏金融管理秩序罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(70, 10, '第二十一章 破坏社会主义市场经济秩序罪（5）金融诈骗罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(71, 10, '第二十二章 破坏社会主义市场经济秩序罪（6）危害税收征管罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(72, 10, '第二十三章 破坏社会主义市场经济秩序罪（7）侵犯知识产权罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(73, 10, '第二十四章 破坏社会主义市场经济秩序罪（8）扰乱市场秩序罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(74, 10, '第二十五章 侵犯公民人身权利、民主权利罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(75, 10, '第二十六章 侵犯财产罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(76, 10, '第二十七章 妨害社会管理秩序罪（1）扰乱公共秩序罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(77, 10, '第二十八章 妨害社会管理秩序罪（2）妨害司法罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(78, 10, '第二十九章 妨害社会管理秩序罪（3）妨害国（边）境管理罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(79, 10, '第三十章  妨害社会管理秩序罪（4）妨害文物管理罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(80, 10, '第三十一章 妨害社会管理秩序罪（5）危害公共卫生罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(81, 10, '第三十二章 妨害社会管理秩序罪（6）破坏环境资源保护罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(82, 10, '第三十三章 妨害社会管理秩序罪（7）走私、贩卖、运输、制造毒品罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(83, 10, '第三十四章 妨害社会管理秩序罪（8）组织、强迫、引诱、容留、介绍卖淫罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(84, 10, '第三十五章 妨害社会管理秩序罪（9）制作、贩卖、传播淫秽物品罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(85, 10, '第三十六章 危害国际利益罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(86, 10, '第三十七章 贪污贿赂罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(87, 10, '第三十八章 渎职罪', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(88, 10, '第三十九章 军人违反职责罪', datetime('now'))",
			"insert into law(id, name, last_modified) values(11, '刑事诉讼法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(89, 11, '第一章 刑事诉讼法概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(90, 11, '第二章 刑事诉讼法的基本原则', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(91, 11, '第三章 刑事诉讼中的专门机关和诉讼参与人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(92, 11, '第四章 管辖', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(93, 11, '第五章 回避', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(94, 11, '第六章 辩护与代理', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(95, 11, '第七章 刑事证据', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(96, 11, '第八章 强制措施', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(97, 11, '第九章 附带民事诉讼', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(98, 11, '第十章 期间、送达', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(99, 11, '第十一章 立案', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(100, 11, '第十二章 侦查', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(101, 11, '第十三章 起诉', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(102, 11, '第十四章 刑事审判概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(103, 11, '第十五章 第一审程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(104, 11, '第十六章 第二审程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(105, 11, '第十七章 死刑复核程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(106, 11, '第十八章 审判监督程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(107, 11, '第十九章 执 行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(108, 11, '第二十章 未成年人刑事案件诉讼程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(109, 11, '第二十一章 当事人和解的公诉案件诉讼程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(110, 11, '第二十二章 犯罪嫌疑人、被告人逃匿、死亡 案件违法所得的没收程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(111, 11, '第二十三章 依法不负刑事责任的精神病人的强制医疗程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(112, 11, '第二十四章 涉外刑事诉讼程序与司法协助制度', datetime('now'))",
			"insert into law(id, name, last_modified) values(12, '行政法与行政诉讼法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(113, 12, '第一章 行政法概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(114, 12, '第二章 行政组织与公务员', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(115, 12, '第三章 抽象行政行为', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(116, 12, '第四章 具体行政行为概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(117, 12, '第五章 行政许可', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(118, 12, '第六章 行政处罚', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(119, 12, '第七章 行政强制', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(120, 12, '第八章 行政合同与行政给付', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(121, 12, '第九章 行政程序与政府信息公开', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(122, 12, '第十章 行政复议', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(123, 12, '第十一章 行政诉讼概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(124, 12, '第十二章 行政诉讼的受案范围', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(125, 12, '第十三章 行政诉讼的管辖', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(126, 12, '第十四章 行政诉讼参加人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(127, 12, '第十五章 行政诉讼程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(128, 12, '第十六章 行政诉讼的特殊制度与规则', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(129, 12, '第十七章 行政案件的裁判与执行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(130, 12, '第十八章 国家赔偿概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(131, 12, '第十九章 行政赔偿', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(132, 12, '第二十章 司法赔偿', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(133, 12, '第二十一章 国家赔偿方式、标准和费用', datetime('now'))",
			"insert into law(id, name, last_modified) values(13, '民法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(134, 13, '第一章 民法概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(135, 13, '第二章 自然人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(136, 13, '第三章 法人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(137, 13, '第四章 民事法律行为', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(138, 13, '第五章 代理', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(139, 13, '第六章 诉讼时效与期限', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(140, 13, '第七章 物权概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(141, 13, '第八章 所有权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(142, 13, '第九章 共有', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(143, 13, '第十章 用益物权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(144, 13, '第十一章 担保物权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(145, 13, '第十二章 占有', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(146, 13, '第十三章 债的概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(147, 13, '第十四章 债的履行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(148, 13, '第十五章 债的保全和担保', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(149, 13, '第十六章 债的移转和消灭', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(150, 13, '第十七章 合同的订立和履行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(151, 13, '第十八章 合同的变更和解除', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(152, 13, '第十九章 合同责任', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(153, 13, '第二十章 转移财产权利的合同', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(154, 13, '第二十一章 完成工作成果的合同', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(155, 13, '第二十二章 提供劳务的合同', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(156, 13, '第二十三章 技术合同', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(157, 13, '第二十四章 不当得利、无因管理', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(158, 13, '第二十五章 著作权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(159, 13, '第二十六章 专科权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(160, 13, '第二十七章 商标权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(161, 13, '第二十八章 婚姻家庭', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(162, 13, '第二十九章 继承概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(163, 13, '第三十章 法定继承', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(164, 13, '第三十一章 遗嘱继承、遗赠和遗赠扶养协议', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(165, 13, '第三十二章 遗产的处理', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(166, 13, '第三十三章 人身权', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(167, 13, '第三十四章 侵权责任概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(168, 13, '第三十五章 各类侵权行为与责任', datetime('now'))",
			"insert into law(id, name, last_modified) values(14, '商法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(169, 14, '第一章 公司法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(170, 14, '第二章 合伙企业法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(171, 14, '第三章 个人独资企业法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(172, 14, '第四章 外商投资企业法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(173, 14, '第五章 企业破产法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(174, 14, '第六章 票据法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(175, 14, '第七章 证券法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(176, 14, '第八章 保险法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(177, 14, '第九章 海商法', datetime('now'))",
			"insert into law(id, name, last_modified) values(15, '民事诉讼法(含仲裁制度)', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(178, 15, '第一章 民事诉讼与民事诉讼法', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(179, 15, '第二章 民事诉讼法的基本原则与基本制度', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(180, 15, '第三章 主管与管辖', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(181, 15, '第四章 诉', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(182, 15, '第五章 当事人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(183, 15, '第六章 诉讼代理人', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(184, 15, '第七章 民事证据', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(185, 15, '第八章 民事诉讼中的证明', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(186, 15, '第九章 期间、送达', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(187, 15, '第十章 法院调解', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(188, 15, '第十一章 保全和先予执行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(189, 15, '第十二章 对妨害民事诉讼的强制措施', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(190, 15, '第十三章 普通程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(191, 15, '第十四章 简易程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(192, 15, '第十五章 第二审程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(193, 15, '第十六章 特别程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(194, 15, '第十七章 审判监督程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(195, 15, '第十八章 督促程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(196, 15, '第十九章 公示催告程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(197, 15, '第二十章 民事裁判', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(198, 15, '第二十一章 执行程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(199, 15, '第二十二章 涉外民事诉讼程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(200, 15, '第二十三章 仲裁与仲裁法概述', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(201, 15, '第二十四章 仲裁委员会和仲裁协会', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(202, 15, '第二十五章 仲裁协议', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(203, 15, '第二十六章 仲裁程序', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(204, 15, '第二十七章 申请撤销仲裁裁决', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(205, 15, '第二十八章 仲裁裁决的执行与不予执行', datetime('now'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(206, 15, '第二十九章 涉外仲裁', datetime('now'))"
      	);
		for (var i = 0; i < dataArr.length; i++) {
			$cordovaSQLite.execute($rootScope.db, dataArr[i], null);
		}

		//init question type
		var sql = "insert into question_type(id, desc) values(1, '单项选择题'), (2, '不定项选择题'), (3, '论述题'), (4, '简析题')";
    	$cordovaSQLite.execute($rootScope.db, sql, null);

    	$log.debug("question type are inserted");

    	 var qasql = "insert into question_answer(type, question, a, b, c, d, answer, analysis, published_at, chapter_id, last_modified, paper) " + 
    	 	"values(1,'张某因其妻王某私自堕胎','王某与张某婚姻关系的消灭是由法律事件引起的','张某主张的生育权属于相对权','法院未支持张某的损害赔偿诉求，违反了“有侵害则有救济”的法律原则','“其他导致夫妻感情破裂的情形”属于概括性立法，有利于提高法律的适应性','B','题目解析','2005', 1, datetime('now'), 1), " + 
    	 		   "(1,'“法学作为科学无力回答正义的标准问题，因而是不是道德上的善或正义不是法律存在并有效力下列说法正确的是：','这段话既反映了实证主义法学派的观点，也反映了自然法学派的基本立场','根据社会法学派的看法，法的实施可以不考虑法律的社会实效','根据分析实证主义法学派的观点，内容正确性并非法的概念的定义要素','所有的法学学派均认为，法律与道德、正义等在内容上没有任何联系','A','题目解析','2005', 1, datetime('now'), 1), " + 
    	 		   "(2, '审判组织是我国法院行使审判权的组织形式。关于审判组织，下列说法错误的是：','独任庭只能适用简易程序审理民事案件，但并不排斥普通程序某些规则的运用','独任法官发现案件疑难复杂，可以转为普通程序审理，但不得提交审委会讨论','再审程序属于纠错程序，为确保办案质量，应当由审判员组成合议庭进行审理','不能以审委会名义发布裁判文书，但审委会意见对合议庭具有重要的参考作用','CD','哈哈哈哈哈','2014',1, datetime('now'), 1), " +
    	 		   "(3,'材料一：法律是治国之重器，法治是国家治理体系和治理能力的重要依托。全面推进依法治国，是解决党和国家事业发展面临的一系列重大问题，解放和增强社会活力、促进社会公平正义、维护社会和谐稳定、确保党和国家长治久安的根本要求。要推动我国经济社会持续健康发展，不断开拓中国特色社会主义事业更加广阔的发展前景，就必须全面推进社会主义法治国家建设，从法治上为解决这些问题提供制度化方案。(摘自习近平《关于<中共中央关于全面推进依法治国若干重大问题的决定>的说明》)<br>材料二：同党和国家事业发展要求相比，同人民群众期待相比，同推进国家治理体系和治理能力现代化目标相比，法治建设还存在许多不适应、不符合的问题，主要表现为：有的法律法规未能全面反映客观规律和人民意愿，针对性、可操作性不强，立法工作中部门化倾向、争权诿责现象较为突出;有法不依、执法不严、违法不究现象比较严重，执法体制权责脱节、多头执法、选择性执法现象仍然存在，执法司法不规范、不严格、不透明、不文明现象较为突出，群众对执法司法不公和****问题反映强烈。(摘自《中共中央关于全面推进依法治国若干重大问题的决定》)<br>问题：<br>根据以上材料，结合全面推进依法治国的总目标，从立法、执法、司法三个环节谈谈建设社会主义法治国家的意义和基本要求。<br>答题要求：<br>　　1.无观点或论述、照搬材料原文的不得分;<br>　　2.观点正确，表述完整、准确;<br>　　3.总字数不得少于400字。', '', '', '', '', '暂无','解析', '2016', 1, datetime('now'), 1)";
    	
     	$rootScope.db.transaction(function(tx){
    		tx.executeSql(qasql, [], function(tx, results){
    			$log.debug("inserting questions");
    		}, function(tx, error){$log.debug(error)});
    	});

    	$log.debug("db init finished");
	}
  };

});