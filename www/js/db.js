function copysucess(){
  $log.debug("copy success");
}

function copyerror(){
  $log.debug("copy error");
}
angular.module('starter.services')
.factory('DB', function($cordovaSQLite, $rootScope, $q, $log, AUTH_EVENTS, $timeout){

    function initTestDB(){
      if(!$rootScope.db){
      	$rootScope.db = window.openDatabase('law.db', '1.0', 'database', -1);
      }

      $log.debug("db is opened");

      var sqlarr = new Array(
      	'drop TABLE "law"',
      	'drop TABLE "exam"',
      	'drop TABLE "law_chapter"',
      	'drop TABLE "question_type"',
      	'drop TABLE "question_answer"',
      	'drop TABLE "practice_stat"',
      	'drop TABLE practice_progress',
      	'drop TABLE practice_event_source',
      	'drop TABLE favor_progress',
      	'drop TABLE chapter_outline',
      	'drop TABLE chapter_book'
      	);
      for (var i = sqlarr.length - 1; i >= 0; i--) {
      	  $cordovaSQLite.execute($rootScope.db, sqlarr[i], null);      
      }

      sqlarr = new Array(
      	'CREATE TABLE "chapter_book" ("cid" INTEGER NOT NULL , "seg_id" INTEGER NOT NULL , "seg_title" VARCHAR(256) NOT NULL , "seg_content" TEXT NOT NULL , "last_modified" DATETIME)',
      	'CREATE TABLE "chapter_outline" ("cid" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "outline" TEXT)',
      	'CREATE TABLE "law" ("id" INTEGER PRIMARY KEY  NOT NULL , "name" TEXT NOT NULL  UNIQUE , "last_modified" DATETIME)',
      	'CREATE TABLE "law_chapter" ("id" INTEGER PRIMARY KEY  NOT NULL , "law_id" INTEGER NOT NULL , "name" TEXT NOT NULL , "last_modified" DATETIME)',
      	'CREATE TABLE "question_type" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "desc" TEXT NOT NULL )',
      	'CREATE TABLE "question_answer" ("id" INTEGER PRIMARY KEY  NOT NULL ,"type" INTEGER NOT NULL ,"question" TEXT NOT NULL ,"a" TEXT,"b" TEXT,"c" TEXT,"d" TEXT,"answer" TEXT,"analysis" TEXT DEFAULT (null) ,"published_at" DATETIME DEFAULT (CURRENT_DATE) ,"chapter_id" INTEGER,"last_modified" DATETIME NOT NULL  DEFAULT (CURRENT_DATE) , "real_seq" INTEGER DEFAULT 0, "paper" INTEGER)',
      	'CREATE TABLE "practice_progress" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "chapter_id" INTEGER NOT NULL  UNIQUE , "question_id" INTEGER NOT NULL , "last_modified" DATETIME NOT NULL  DEFAULT CURRENT_TIME, "type" INTEGER)',
      	'CREATE TABLE "exam" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "answer" TEXT, "last_modified" DATETIME DEFAULT CURRENT_TIMESTAMP, "paper" INTEGER NOT NULL  DEFAULT 0)',
      	'CREATE TABLE "favorite" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "last_modified"  DEFAULT CURRENT_TIMESTAMP)',
      	'CREATE TABLE "practice_stat" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL  UNIQUE , "error_num" INTEGER DEFAULT 0, "correct_num" INTEGER DEFAULT 0, "last_modified" DATETIME DEFAULT CURRENT_TIME)',
      	'CREATE TABLE "real_progress" ("id" INTEGER PRIMARY KEY  NOT NULL ,"year" DATETIME,"exampaper" INTEGER,"qid" INTEGER DEFAULT (null) ,"last_modified" DATETIME)',
      	'CREATE TABLE "error_progress" ("qid" INTEGER NOT NULL  DEFAULT 0, "last_modified" DATETIME NOT NULL )',
      	'CREATE TABLE "practice_event_source" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "qid" INTEGER NOT NULL , "correct" BOOL, "last_modified" DATETIME )',
      	'CREATE TABLE "favor_progress" ("qid" INTEGER PRIMARY KEY  NOT NULL ,"last_modified" DATETIME )'
      	);
      for (var i = sqlarr.length - 1; i >= 0; i--) {
      	  $cordovaSQLite.execute($rootScope.db, sqlarr[i], null);      
      }

      $log.debug("table is created");

      var dataArr = new Array(
      		'INSERT INTO "chapter_book" VALUES ("1","1","全面推进依法治国的重大意义","<p>依法治国，是坚持和发展中国特色社会主义的本质要求和重要保障，是实现国家治理体系和治理能力现代化的必然要求，事关我们党执政兴国，事关人民幸福安康，事关党和国家长治久安。</p><p>全面建成小康社会、实现中华民族伟大复兴的中国梦，全面深化改革、完善和发展中国特色社会主义制度，提高党的执政能力和执政水平，必须全面推进依法治国。</p><p>我国正处于社会主义初级阶段，全面建成小康社会进入决定性阶段，改革进入攻坚期和深水区，国际形势复杂多变，我们党面对的改革发展稳定任务之重前所未有、矛盾风险挑战之多前所未有，依法治国在党和国家工作全局中的地位更加突出、作用更加重大。面对新形势新任务，我们党要更好统筹国内国际两个大局，更好维护和运用我国发展的重要战略机遇期，更好统筹社会力量、平衡社会利益、调节社会关系、规范社会行为，使我国社会在深刻变革中既生机勃勃又井然有序，实现经济发展、政治清明、文化昌盛、社会公正、生态良好，实现我国和平发展的战略目标，必须更好发挥法治的引领和规范作用。</p><p>我们党高度重视法治建设。长期以来，特别是党的十一届三中全会以来，我们党深刻总结我国社会主义法治建设的成功经验和深刻教训，提出为了保障人民民主，必须加强法治，必须使民主制度化、法律化，把依法治国确定为党领导人民治理国家的基本方略，把依法执政确定为党治国理政的基本方式，积极建设社会主义法治，取得历史性成就。目前，中国特色社会主义法律体系已经形成，法治政府建设稳步推进，司法体制不断完善，全社会法治观念明显增强。</p><p>同时，必须清醒看到，同党和国家事业发展要求相比，同人民群众期待相比，同推进国家治理体系和治理能力现代化目标相比，法治建设还存在许多不适应、不符合的问题，主要表现为：有的法律法规未能全面反映客观规律和人民意愿，针对性、可操作性不强，立法工作中部门化倾向、争权诿责现象较为突出；有法不依、执法不严、违法不究现象比较严重，执法体制权责脱节、多头执法、选择性执法现象仍然存在，执法司法不规范、不严格、不透明、不文明现象较为突出，群众对执法司法不公和腐败问题反映强烈；部分社会成员尊法信法守法用法、依法维权意识不强，一些国家工作人员特别是领导干部依法办事观念不强、能力不足，知法犯法、以言代法、以权压法、徇私枉法现象依然存在。这些问题，违背社会主义法治原则，损害人民群众利益，妨碍党和国家事业发展，必须下大气力加以解决。</p>",null)',
      		'INSERT INTO "chapter_book" VALUES ("1","2","全面推进依法治国的指导思想和总目标","<p>全面推进依法治国，必须贯彻落实党的十八大和十八届三中全会精神，高举中国特色社会主义伟大旗帜，以马克思列宁主义、毛泽东思想、邓小平理论、“三个代表”重要思想、科学发展观为指导，深入贯彻习近平总书记系列重要讲话精神，坚持党的领导、人民当家作主、依法治国有机统一，坚定不移走中国特色社会主义法治道路，坚决维护宪法法律权威，依法维护人民权益、维护社会公平正义、维护国家安全稳定，为实现“两个一百年”奋斗目标、实现中华民族伟大复兴的中国梦提供有力法治保障。</p><p>全面推进依法治国，总目标是建设中国特色社会主义法治体系，建设社会主义法治国家。这就是，在中国共产党领导下，坚持中国特色社会主义制度，贯彻中国特色社会主义法治理论，形成完备的法律规范体系、高效的法治实施体系、严密的法治监督体系、有力的法治保障体系，形成完善的党内法规体系，坚持依法治国、依法执政、依法行政共同推进，坚持法治国家、法治政府、法治社会一体建设，实现科学立法、严格执法、公正司法、全民守法，促进国家治理体系和治理能力现代化。</p>",null)',
      		'INSERT INTO "chapter_book" VALUES ("1","3","全面推进依法治国的基本原则","<p>实现这个总目标，必须坚持以下原则。</p><p>——坚持中国共产党的领导。党的领导是中国特色社会主义最本质的特征，是社会主义法治最根本的保证。把党的领导贯彻到依法治国全过程和各方面，是我国社会主义法治建设的一条基本经验。我国宪法确立了中国共产党的领导地位。坚持党的领导，是社会主义法治的根本要求，是党和国家的根本所在、命脉所在，是全国各族人民的利益所系、幸福所系，是全面推进依法治国的题中应有之义。党的领导和社会主义法治是一致的，社会主义法治必须坚持党的领导，党的领导必须依靠社会主义法治。只有在党的领导下依法治国、厉行法治，人民当家作主才能充分实现，国家和社会生活法治化才能有序推进。依法执政，既要求党依据宪法法律治国理政，也要求党依据党内法规管党治党。必须坚持党领导立法、保证执法、支持司法、带头守法，把依法治国基本方略同依法执政基本方式统一起来，把党总揽全局、协调各方同人大、政府、政协、审判机关、检察机关依法依节程履行职能、开展工作统一起来，把党领导人民制定和实施宪法法律同党坚持在宪法法律范围内活动统一起来，善于使党的主张通过法定程序成为国家意志，善于使党组织推荐的人选通过法定程序成为国家政权机关的领导人员，善于通过国家政权机关实施党对国家和社会的领导，善于运用民主集中制原则维护中央权威、维护全党全国团结统一。</p><p>——坚持人民主体地位。人民是依法治国的主体和力量源泉，人民代表大会制度是保证人民当家作主的根本政治制度。必须坚持法治建设为了人民、依靠人民、造福人民、保护人民，以保障人民根本权益为出发点和落脚点，保证人民依法享有广泛的权利和自由、承担应尽的义务，维护社会公平正义，促进共同富裕。必须保证人民在党的领导下，依照法律规定，通过各种途径和形式管理国家事务，管理经济文化事业，管理社会事务。必须使人民认识到法律既是保障自身权利的有力武器，也是必须遵守的行为规范，增强全社会学法尊法守法用法意识，使法律为人民所掌握、所遵守、所运用。</p><p>——坚持法律面前人人平等。平等是社会主义法律的基本属性。任何组织和个人都必须尊重宪法法律权威，都必须在宪法法律范围内活动，都必须依照宪法法律行使权力或权利、履行职责或义务，都不得有超越宪法法律的特权。必须维护国家法制统一、尊严、权威，切实保证宪法法律有效实施，绝不允许任何人以任何借口任何形式以言代法、以权压法、徇私枉法。必须以规范和约束公权力为重点，加大监督力度，做到有权必有责、用权受监督、违法必追究，坚决纠正有法不依、执法不严、违法不究行为。</p><p>——坚持依法治国和以德治国相结合。国家和社会治理需要法律和道德共同发挥作用。必须坚持一手抓法治、一手抓德治，大力弘扬社会主义核心价值观，弘扬中华传统美德，培育社会公德、职业道德、家庭美德、个人品德，既重视发挥法律的规范作用，又重视发挥道德的教化作用，以法治体现道德理念、强化法律对道德建设的促进作用，以道德滋养法治精神、强化道德对法治文化的支撑作用，实现法律和道德相辅相成、法治和德治相得益彰。</p><p>——坚持从中国实际出发。中国特色社会主义道路、理论体系、制度是全面推进依法治国的根本遵循。必须从我国基本国情出发，同改革开放不断深化相适应，总结和运用党领导人民实行法治的成功经验，围绕社会主义法治建设重大理论和实践问题，推进法治理论创新，发展符合中国实际、具有中国特色、体现社会发展规律的社会主义法治理论，为依法治国提供理论指导和学理支撑。汲取中华法律文化精华，借鉴国外法治有益经验，但决不照搬外国法治理念和模式。</p><p>全面推进依法治国是一个系统工程，是国家治理领域一场广泛而深刻的革命，需要付出长期艰苦努力。全党同志必须更加自觉地坚持依法治国、更加扎实地推进依法治国，努力实现国家各项工作法治化，向着建设法治中国不断前进。</p>",null)',
      		"insert into chapter_outline(cid, outline) values(1, '<h3>基本要求:</h3><p>了解:法与政策的联系，法与政策的区别，法与国家的一般关系。</p><p>理解:法与和谐社会，法与政治的一般关系，法与道德的联系，法与宗教的相互关系，法与人权的一般关系。</p><p>熟悉并能够运用:法与社会的一般关系，法与经济的一般关系，法与科学技 术，法与道德的区别，分析和评价有关的案例、事例或者法条。</p><h3>考试内容:</h3><h4>第一节  法与社会的一般理论</h4><p>法与社会的一般关系法 与和谐社会</p><h4>第二节  法与经济</h4><p>法与经济的一般关系 法与科学技术（科技进步对法的影响 法对科技进步的作用）</p><h4>第三节  法与政治</h4><p>法与政治的一般关系（政治对法的作用 法对政治的作用）法与政策的联系 法与政策的区别（意志属性、规范形式、实施方式、调整范围、稳定性与程序性程度等方面的区别）法与国家（法与国家的一般关系）</p><h4>第四节  法与道德</h4><p>法与道德的联系 法与道德的区别（产生方式、表现形式、调整范围、实施方式等方面的区别）</p><h4>第五节  法与宗教</h4><p>法与宗教的相互影响（宗教对法的影响 法对宗教的影响）</p><h4>第六节  法与人权</h4><p>人权的概念 法与人权的一般关系（人权与法律的评价标准 法与人权的实现）</p>')",
			"insert into law(id, name, last_modified) values(1, '中国特色社会主义法治理论', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(1, 1, '第一章 中国特色社会主义法治建设基本原理', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(2, 1, '第二章 法治工作的基本格局', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(3, 1, '第三章 法治工作的重要保障', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(2, '法理学', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(4, 2, '第一章 法的本体', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(5, 2, '第二章 法的运行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(6, 2, '第三章 法的演进', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(7, 2, '第四章 法与社会', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(3, '法制史', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(8, 3, '第一章 中国法制史', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(9, 3, '第二章 外国法制史', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(4, '宪法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(10, 4, '第一章 宪法基本理论', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(11, 4, '第二章 国家的基本制度（上）', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(12, 4, '第三章 国家的基本制度（下）', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(13, 4, '第四章 公民的基本权利与义务', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(14, 4, '第五章 国家机构', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(15, 4, '第六章 宪法的实施及其保障', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(5, '经济法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(16, 5, '第一章 竞争法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(17, 5, '第二章 消费者法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(18, 5, '第三章 食品安全法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(19, 5, '第四章 财税法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(20, 5, '第五章 劳动法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(21, 5, '第六章 土地法和房地产法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(22, 5, '第七章 环境保护法', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(6, '国际法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(23, 6, '第一章 导 论', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(24, 6, '第二章 国际责任的构成和形式', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(25, 6, '第三章 国际法上的空间划分', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(26, 6, '第四章 国际法上的个人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(27, 6, '第五章 外交关系法与领事关系法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(28, 6, '第六章 条约法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(29, 6, '第七章 国际争端的和平解决', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(30, 6, '第八章 战争与武装冲突法', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(7, '国际私法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(31, 7, '第一章 国际私法概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(32, 7, '第二章 国际私法的主体', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(33, 7, '第三章 法律冲突、冲突规范和准据法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(34, 7, '第四章 适用冲突规范的制度', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(35, 7, '第五章 国际民商事关系的法律适用', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(36, 7, '第六章 国际民商事争议的解决', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(37, 7, '第七章 区际法律问题', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(8, '国际经济法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(38, 8, '第一章 导论', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(39, 8, '第二章 国际货物买卖', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(40, 8, '第三章 国际货物运输与保险', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(41, 8, '第四章 国际贸易支付', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(42, 8, '第五章 对外贸易管理制度', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(43, 8, '第六章 世界贸易组织', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(44, 8, '第七章 国际经济法领域的其他法律制度', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(9, '司法制度与法律职业道德', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(45, 9, '第一章 司法制度和法律职业道德概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(46, 9, '第二章 审判制度与法官职业道德', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(47, 9, '第三章 检察制度与检察官职业道德', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(48, 9, '第四章 律师制度与律师职业道德', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(49, 9, '第五章 公证制度与公证员职业道德', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(10, '刑法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(50, 10, '第一章 刑法概说', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(51, 10, '第二章 犯罪概说', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(52, 10, '第三章 犯罪构成', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(53, 10, '第四章 犯罪排除事由', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(54, 10, '第五章 犯罪未完成形态', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(55, 10, '第六章 共同犯罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(56, 10, '第七章 单位犯罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(57, 10, '第八章 因数形态', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(58, 10, '第九章 刑罚概说', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(59, 10, '第十章 刑罚种类', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(60, 10, '第十一章 刑罚裁量', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(61, 10, '第十二章 刑罚执行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(62, 10, '第十三章 刑罚消灭', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(63, 10, '第十四章 罪刑各论概说', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(64, 10, '第十五章 危害国家安全罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(65, 10, '第十六章 危害公共安全罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(66, 10, '第十七章 破坏社会主义市场经济秩序罪（1）生产、销售伪劣商品罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(67, 10, '第十八章 破坏社会主义市场经济秩序罪（2）走私罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(68, 10, '第十九章 破坏社会主义市场经济秩序罪（3）妨害对公司、企业的管理秩序罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(69, 10, '第二十章 破坏社会主义市场经济秩序罪（4）破坏金融管理秩序罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(70, 10, '第二十一章 破坏社会主义市场经济秩序罪（5）金融诈骗罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(71, 10, '第二十二章 破坏社会主义市场经济秩序罪（6）危害税收征管罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(72, 10, '第二十三章 破坏社会主义市场经济秩序罪（7）侵犯知识产权罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(73, 10, '第二十四章 破坏社会主义市场经济秩序罪（8）扰乱市场秩序罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(74, 10, '第二十五章 侵犯公民人身权利、民主权利罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(75, 10, '第二十六章 侵犯财产罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(76, 10, '第二十七章 妨害社会管理秩序罪（1）扰乱公共秩序罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(77, 10, '第二十八章 妨害社会管理秩序罪（2）妨害司法罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(78, 10, '第二十九章 妨害社会管理秩序罪（3）妨害国（边）境管理罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(79, 10, '第三十章  妨害社会管理秩序罪（4）妨害文物管理罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(80, 10, '第三十一章 妨害社会管理秩序罪（5）危害公共卫生罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(81, 10, '第三十二章 妨害社会管理秩序罪（6）破坏环境资源保护罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(82, 10, '第三十三章 妨害社会管理秩序罪（7）走私、贩卖、运输、制造毒品罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(83, 10, '第三十四章 妨害社会管理秩序罪（8）组织、强迫、引诱、容留、介绍卖淫罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(84, 10, '第三十五章 妨害社会管理秩序罪（9）制作、贩卖、传播淫秽物品罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(85, 10, '第三十六章 危害国际利益罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(86, 10, '第三十七章 贪污贿赂罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(87, 10, '第三十八章 渎职罪', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(88, 10, '第三十九章 军人违反职责罪', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(11, '刑事诉讼法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(89, 11, '第一章 刑事诉讼法概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(90, 11, '第二章 刑事诉讼法的基本原则', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(91, 11, '第三章 刑事诉讼中的专门机关和诉讼参与人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(92, 11, '第四章 管辖', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(93, 11, '第五章 回避', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(94, 11, '第六章 辩护与代理', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(95, 11, '第七章 刑事证据', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(96, 11, '第八章 强制措施', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(97, 11, '第九章 附带民事诉讼', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(98, 11, '第十章 期间、送达', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(99, 11, '第十一章 立案', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(100, 11, '第十二章 侦查', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(101, 11, '第十三章 起诉', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(102, 11, '第十四章 刑事审判概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(103, 11, '第十五章 第一审程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(104, 11, '第十六章 第二审程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(105, 11, '第十七章 死刑复核程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(106, 11, '第十八章 审判监督程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(107, 11, '第十九章 执 行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(108, 11, '第二十章 未成年人刑事案件诉讼程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(109, 11, '第二十一章 当事人和解的公诉案件诉讼程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(110, 11, '第二十二章 犯罪嫌疑人、被告人逃匿、死亡 案件违法所得的没收程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(111, 11, '第二十三章 依法不负刑事责任的精神病人的强制医疗程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(112, 11, '第二十四章 涉外刑事诉讼程序与司法协助制度', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(12, '行政法与行政诉讼法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(113, 12, '第一章 行政法概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(114, 12, '第二章 行政组织与公务员', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(115, 12, '第三章 抽象行政行为', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(116, 12, '第四章 具体行政行为概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(117, 12, '第五章 行政许可', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(118, 12, '第六章 行政处罚', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(119, 12, '第七章 行政强制', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(120, 12, '第八章 行政合同与行政给付', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(121, 12, '第九章 行政程序与政府信息公开', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(122, 12, '第十章 行政复议', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(123, 12, '第十一章 行政诉讼概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(124, 12, '第十二章 行政诉讼的受案范围', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(125, 12, '第十三章 行政诉讼的管辖', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(126, 12, '第十四章 行政诉讼参加人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(127, 12, '第十五章 行政诉讼程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(128, 12, '第十六章 行政诉讼的特殊制度与规则', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(129, 12, '第十七章 行政案件的裁判与执行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(130, 12, '第十八章 国家赔偿概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(131, 12, '第十九章 行政赔偿', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(132, 12, '第二十章 司法赔偿', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(133, 12, '第二十一章 国家赔偿方式、标准和费用', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(13, '民法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(134, 13, '第一章 民法概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(135, 13, '第二章 自然人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(136, 13, '第三章 法人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(137, 13, '第四章 民事法律行为', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(138, 13, '第五章 代理', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(139, 13, '第六章 诉讼时效与期限', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(140, 13, '第七章 物权概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(141, 13, '第八章 所有权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(142, 13, '第九章 共有', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(143, 13, '第十章 用益物权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(144, 13, '第十一章 担保物权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(145, 13, '第十二章 占有', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(146, 13, '第十三章 债的概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(147, 13, '第十四章 债的履行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(148, 13, '第十五章 债的保全和担保', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(149, 13, '第十六章 债的移转和消灭', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(150, 13, '第十七章 合同的订立和履行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(151, 13, '第十八章 合同的变更和解除', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(152, 13, '第十九章 合同责任', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(153, 13, '第二十章 转移财产权利的合同', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(154, 13, '第二十一章 完成工作成果的合同', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(155, 13, '第二十二章 提供劳务的合同', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(156, 13, '第二十三章 技术合同', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(157, 13, '第二十四章 不当得利、无因管理', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(158, 13, '第二十五章 著作权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(159, 13, '第二十六章 专科权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(160, 13, '第二十七章 商标权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(161, 13, '第二十八章 婚姻家庭', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(162, 13, '第二十九章 继承概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(163, 13, '第三十章 法定继承', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(164, 13, '第三十一章 遗嘱继承、遗赠和遗赠扶养协议', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(165, 13, '第三十二章 遗产的处理', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(166, 13, '第三十三章 人身权', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(167, 13, '第三十四章 侵权责任概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(168, 13, '第三十五章 各类侵权行为与责任', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(14, '商法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(169, 14, '第一章 公司法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(170, 14, '第二章 合伙企业法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(171, 14, '第三章 个人独资企业法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(172, 14, '第四章 外商投资企业法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(173, 14, '第五章 企业破产法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(174, 14, '第六章 票据法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(175, 14, '第七章 证券法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(176, 14, '第八章 保险法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(177, 14, '第九章 海商法', datetime('now', 'localtime'))",
			"insert into law(id, name, last_modified) values(15, '民事诉讼法(含仲裁制度)', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(178, 15, '第一章 民事诉讼与民事诉讼法', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(179, 15, '第二章 民事诉讼法的基本原则与基本制度', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(180, 15, '第三章 主管与管辖', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(181, 15, '第四章 诉', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(182, 15, '第五章 当事人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(183, 15, '第六章 诉讼代理人', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(184, 15, '第七章 民事证据', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(185, 15, '第八章 民事诉讼中的证明', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(186, 15, '第九章 期间、送达', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(187, 15, '第十章 法院调解', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(188, 15, '第十一章 保全和先予执行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(189, 15, '第十二章 对妨害民事诉讼的强制措施', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(190, 15, '第十三章 普通程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(191, 15, '第十四章 简易程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(192, 15, '第十五章 第二审程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(193, 15, '第十六章 特别程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(194, 15, '第十七章 审判监督程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(195, 15, '第十八章 督促程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(196, 15, '第十九章 公示催告程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(197, 15, '第二十章 民事裁判', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(198, 15, '第二十一章 执行程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(199, 15, '第二十二章 涉外民事诉讼程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(200, 15, '第二十三章 仲裁与仲裁法概述', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(201, 15, '第二十四章 仲裁委员会和仲裁协会', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(202, 15, '第二十五章 仲裁协议', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(203, 15, '第二十六章 仲裁程序', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(204, 15, '第二十七章 申请撤销仲裁裁决', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(205, 15, '第二十八章 仲裁裁决的执行与不予执行', datetime('now', 'localtime'))",
			"insert into law_chapter(id, law_id, name, last_modified) values(206, 15, '第二十九章 涉外仲裁', datetime('now', 'localtime'))",
      		"insert into practice_event_source(qid, correct, last_modified) values(1,1, '2016-06-10'), (2,0, '2016-06-10'), (1,1, '2016-06-09'),(1,0, '2016-06-09'), (1,1, '2016-06-08'), (1,0, '2016-06-08'),(1,1, '2016-06-08'), (1,1, '2016-06-07'), (1,0, '2016-06-07'), (1,1, '2016-06-07'), (1,1, '2016-06-07'), (1,0, '2016-06-07'), (1,0, '2016-06-06')"
      	);
		for (var i = 0; i < dataArr.length; i++) {
			$cordovaSQLite.execute($rootScope.db, dataArr[i], null);
		}

		//init question type
		var sql = "insert into question_type(id, desc) values(1, '单项选择题'), (2, '不定项选择题'), (3, '论述题'), (4, '简析题')";
    	$cordovaSQLite.execute($rootScope.db, sql, null);

    	$log.debug("question type are inserted");

    	 var qasql = "insert into question_answer(type, question, a, b, c, d, answer, analysis, published_at, chapter_id, last_modified, paper) " + 
    	 	"values(1,'张某因其妻王某私自堕胎','王某与张某婚姻关系的消灭是由法律事件引起的','张某主张的生育权属于相对权','法院未支持张某的损害赔偿诉求，违反了“有侵害则有救济”的法律原则','“其他导致夫妻感情破裂的情形”属于概括性立法，有利于提高法律的适应性','B','题目解析','2005', 1, datetime('now', 'localtime'), 1), " + 
    	 		   "(1,'“法学作为科学无力回答正义的标准问题，因而是不是道德上的善或正义不是法律存在并有效力下列说法正确的是：','这段话既反映了实证主义法学派的观点，也反映了自然法学派的基本立场','根据社会法学派的看法，法的实施可以不考虑法律的社会实效','根据分析实证主义法学派的观点，内容正确性并非法的概念的定义要素','所有的法学学派均认为，法律与道德、正义等在内容上没有任何联系','A','题目解析','2005', 1, datetime('now', 'localtime'), 1), " + 
    	 		   "(2, '审判组织是我国法院行使审判权的组织形式。关于审判组织，下列说法错误的是：','独任庭只能适用简易程序审理民事案件，但并不排斥普通程序某些规则的运用','独任法官发现案件疑难复杂，可以转为普通程序审理，但不得提交审委会讨论','再审程序属于纠错程序，为确保办案质量，应当由审判员组成合议庭进行审理','不能以审委会名义发布裁判文书，但审委会意见对合议庭具有重要的参考作用','CD','哈哈哈哈哈','2014',1, datetime('now', 'localtime'), 1), " +
    	 		   "(4,'<p>赵某孤身一人，因外出打工，将一祖传古董交由邻居钱某保管。钱某因结婚用钱，情急之下谎称该古董为自己所有，卖给了古董收藏商孙某，得款10000元。孙某因资金周转需要，向李某借款20000元，双方约定将该古董押给李某，如孙某到期不回赎，古董归李某所有。在赵某外出打工期间，其住房有倒塌危险，因此房与钱某的房屋相邻，如该房屋倒塌，有危及钱某房屋之虞。钱某遂请施工队修缮赵某的房屋，并约定，施工费用待赵某回来后由赵某付款。房屋修缮以后，因为百年不遇的台风而倒塌。年末，赵某回村，因古董和房屋修缮款与钱某发生纠纷。</p><p>请回答下列问题：</p><p>1、钱某与孙某之间的买卖合同效力如何?为什么?</p><p>2、孙某能否取得该古董的所有权?为什么?</p><p>3、孙某将古董当给李某，形成何种法律关系?</p><p>4、孙某与李某之间约定孙某到期不回赎，古董归李某所有，该约定效力如何?为什么?</p><p>5、钱某请施工队加固赵某的房屋，这一事实在钱某和赵某之间形成何种法律关系?</p><p>6、若赵某拒绝向施工队付款，施工队应向谁请求付款?为什么?</p><p>7、赵某对钱某擅自出卖古董之行为，可—提出何种之诉?</p>', '', '', '', '', '暂无','解析', '2016', 1, datetime('now', 'localtime'), 1)";
    	
     	$rootScope.db.transaction(function(tx){
    		tx.executeSql(qasql, [], function(tx, results){
    			$log.debug("inserting questions");
    		}, function(tx, error){$log.debug(error)});
    	});

    	$log.debug("db init finished");

    	$rootScope.$broadcast(AUTH_EVENTS.db_ok);

	}

	//打开db，否则会导致不是根启动话报错,在真实device会在platform ready之前运行，导致无法初始化数据库
	//加载数据库
	function initDB(){
		//如果已经初始化，返回
		if(angular.isDefined($rootScope.db)) return;

		if(window.sqlitePlugin){
			window.plugins.sqlDB.remove("law.db", 2, function(){alert("remove ok")}, function(e){});
			window.plugins.sqlDB.copy("law.db", 2, function() {
				// alert('copy ok');
				// $rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
				$rootScope.db = window.sqlitePlugin.openDatabase({name:"law.db",location:"default"});	
				$rootScope.$broadcast(AUTH_EVENTS.db_ok);
			}, function(error) {
				//已经有了，所以不需要重新复制
				// $rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
				$rootScope.db = window.sqlitePlugin.openDatabase({name:"law.db",location:"default"});
				console.error("There was an error copying the database: " + error);        		
			});
		}else{
			//in browser
			console.log("db initing");
			initTestDB();
		}	
	}


  	return {
  	//load object
  		initDB : initDB,
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
					$log.debug(sql, JSON.stringify(error));
					deferred.reject(error);
				}
			);
			$timeout(function(){deferred.reject();}, 1000);
			return deferred.promise;
  		},
  	//load for list
  		queryForList : function(sql){
			var deferred = $q.defer();
			var res = new Array();
			$cordovaSQLite.execute($rootScope.db, sql, []).then(
				function(resultset){
					if(resultset.rows.length > 0){
						for(var i=0; i<resultset.rows.length; i++){
							res.push(resultset.rows.item(i));
						}
					}
					deferred.resolve(res);
				},
				function(error){
					$log.debug(sql, JSON.stringify(error));
					deferred.reject(error);
				}
			);
			$timeout(function(){deferred.reject();}, 1000);
			return deferred.promise;
		},

		execute : function (sql){
			$cordovaSQLite.execute($rootScope.db, sql, []).then(
				function(result){},
				function(error){$log.debug(sql, error)}

			);
		},

		executeWithParams : function (sql, params, callback, args){
			$cordovaSQLite.execute($rootScope.db, sql, params).then(
				function(result){
					if(typeof callback === 'function'){
						callback(args);
					}

				},
				function(error){$log.debug(sql, error)}

			);
		},

		/**
		在一个里面执行多条语句，同时支持回调函数
		*/
		multiTransaction : function(sqlArr, success, error){
			$rootScope.db.sqlBatch(sqlArr, success, error);
		},

	    getDB : function getDB(){
	    	if(!$rootScope.db){
				$rootScope.db = window.openDatabase('law.db', '1.0', 'database', -1);
	    	}
	    	return $rootScope.db},
	    copyDB : function copyDB(){
	      //the second param 0 is for android
	      window.plugins.sqlDB.copy("law.db", 0, copysuccess, copyerror);
	    }
  	};
});