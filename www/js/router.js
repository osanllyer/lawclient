angular.module('starter.router', ['starter.services'])
.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// .state('app', {
	//     url: '/app',
	//     abstract:true,
	//     templateUrl:'templates/menu.html',
	//     controller : 'AppCtrl'
	//   }
	// )

	// setup an abstract state for the tabs directive
	.state('tab', {
		url : '/tab',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'TabCtrl'
	})

	.state('tab.menu', {
		url : '/menu',
		abstract : true,
		views : {
			'menuContent' : {
				templateUrl : 'templates/tabs.html'
			}
		}
	})

	// Each tab has its own nav history stack:

	.state('tab.menu.dash', {
		url : '/dash',
		views : {
			'tab-dash' : {
				templateUrl : 'templates/tab-dash.html',
				controller : 'DashCtrl'
			}
		}
	})
	.state('tab.menu.chats', {
		url : '/chats',
		views : {
			'tab-chats' : {
				templateUrl : 'templates/tab-chats.html',
				controller : 'ChatsCtrl'
			}
		}
	}).state('tab.menu.detail', {
		url : '/detail/:chatId',
		views : {
			'tab-chats' : {
				templateUrl : 'templates/chat-detail.html',
				controller : 'ChatDetailCtrl'
			}
		}
	}).state('tab.menu.mine', {
		url : '/mine',
		views : {
			'tab-mine' : {
				templateUrl : 'templates/tab-mine.html',
				controller : 'MineCtrl',
			}
		},
		resolve : {
			lawList : function(LawService) {
				return LawService.fetchDefaultList();
			}
		}
	})

	.state('tab.menu.account', {
		url : '/account',
		views : {
			'tab-account' : {
				templateUrl : 'templates/tab-account.html',
				controller : 'AccountCtrl'
			}
		}
	}).state('tab.menu.lawdetail', {
		url : '/lawdetail/:lawid',
		views : {
			'tab-mine' : {
				templateUrl : 'templates/law-detail.html',
				controller : 'LawDetailCtrl',
				resolve : {
					law : function($stateParams, LawService) {
						return LawService.fetchDetail($stateParams.lawid);
					}
				}
			}
		}
	}).state('tab.menu.practice', {
		url : '/practice',
		abstract : true,
		views : {
			'tab-dash' : {
				templateUrl : 'templates/practice.html',
				controller : 'PracticeCtrl'				
			}
		}
	}).state('tab.menu.practice.chapter', {
		url : '/chapter',
		views : {
			'chapter' : {
				templateUrl : 'templates/practice-chapter.html',
				controller : 'ChapterCtrl'
			}
		}
	}).state('tab.menu.practice.exam', {
		//chapterid qtype is bothe params required
		url : '/exam/:chapterid?qtype&qid',
		views : {
			'chapter' : {
				templateUrl : 'templates/chapter-exam.html',
				controller : 'ExamCtrl'
			}
		}
	}).state('tab.menu.practice.chpentry', {
		url : '/chpentry/:lawid/:chapterid',
		views : {
			'chapter' : {
				templateUrl : 'templates/chapter-entry.html',
				controller : 'ChapterEntryCtrl'
			}
		}
	}).state('tab.menu.practice.exampaper', {
		url : '/exampaper',
		views : {
			'chapter' : {
				templateUrl : 'templates/exampaper-entry.html',
				controller : 'ExamPaperCtrl'
			}
		}
	}).state('tab.menu.practice.examing', {
		url : '/exampaper/:paper/:qid',
		views : {
			'chapter' : {
				templateUrl : 'templates/exampaper-examing.html',
				controller : 'ExamingCtrl'
			}
		}
	}).state('tab.menu.practice.random', {
		url : '/random/:rand',
		views : {
			'chapter' : {
				templateUrl : 'templates/chapter-exam.html',
				controller : 'ExamRandomCtrl'
			}
		}
	}).state('tab.menu.real', {
		url : '/real',
		views : {
			'tab-real' : {
				templateUrl : 'templates/tab-real.html',
				controller : 'RealCtrl'
			}
		}
	}).state('tab.menu.exam', {
		url : '/real/:year/:paper',
		views : {
			'tab-real' : {
				templateUrl : 'templates/chapter-exam.html',
				controller : 'RealExamCtrl',
				resolve : {
					qidArr : function(RealDao, $stateParams){
						var data = RealDao.loadRealExamPaper($stateParams.year, $stateParams.paper);
						return data;
					},
					progressQid : function(RealDao, $stateParams){
						var data = RealDao.loadRealProgress($stateParams.year, $stateParams.paper);
						return data;
					}
				}
			}
		}
	})
	;

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/menu/dash');
});