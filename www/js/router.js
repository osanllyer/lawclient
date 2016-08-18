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
				templateUrl : 'tab/tabs.html'
			}
		}
	})

	// Each tab has its own nav history stack:
	.state('tab.menu.dash', {
		url : '/dash',
		views : {
			'tab-dash' : {
				templateUrl : 'tab/tab-dash.html',
				controller : 'DashCtrl'
			}
		}
		// ,
		// data : {
		// 	//需要登录
		// 	authorizedRoles : "user"
		// }
	}).state('tab.menu.mine', {
		url : '/mine',
		views : {
			'tab-mine' : {
				templateUrl : 'tab/tab-mine.html',
				controller : 'MineCtrl',
			}
		},
		resolve : {
			lawList : function(LawService) {
				return LawService.fetchDefaultList();
			}
		}
	}).state('tab.login', {
		url : '/login',
		views : {
			'menuContent' : {
				templateUrl : 'login/login.html',
				controller : 'LoginCtrl'
			}
		}
	}).state('tab.signup', {
		url : '/signup',
		views : {
			'menuContent' : {
				templateUrl : 'login/signup.html',
				controller : 'SignUpCtrl'
			}
		}
	})	
	.state('tab.user', {
		url : '/user/:name',
		views : {
			'menuContent' : {
				templateUrl : 'user/user-detail.html',
				controller : 'UserCtrl'
			}
		},
		data : {
			//需要登录
			authorizedRoles : "user"
		}
	})
	.state('tab.avatar', {
		url : '/avatar',
		views : {
			'menuContent' : {
				templateUrl : 'user/user-avatar.html',
				controller : 'AvatarCtrl'
			}
		}
	})	
	.state('tab.menu.dairy', {
		url : '/dairy',
		views : {
			'tab-dairy' : {
				templateUrl : 'tab/tab-dairy.html',
				controller : 'DairyCtrl'
			}
		},
		// data : {
		// 	authorizedRoles : ["user", "vip"]
		// }
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
	}).state('tab.menu.practice.errorexam', {
		//错题强化
		url : '/errorexam',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'ErrorExamCtrl'
			}
		},
		resolve : {
			qidArr : function(ErrorExamService){
				return ErrorExamService.getErrorQuestionIds();
			},
			progressQid : function(ErrorExamService){
				return ErrorExamService.getErrorProgress();
			}
		}
	})
	.state('tab.menu.practice.chapter', {
		url : '/chapter',
		views : {
			'chapter' : {
				templateUrl : 'chapter/practice-chapter.html',
				controller : 'ChapterCtrl'
			}
		}
	})
	.state('tab.menu.practice.exam', {
		//chapterid qtype is params required
		url : '/exam/:lawid/:chapterid/:qtype',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'ExamCtrl',
				resolve : {
					progressQid : function(ProgressDao, $stateParams){
						var data = ProgressDao.loadChapterProgress($stateParams.lawid, $stateParams.chapterid, $stateParams.qtype);
						return data;
					},
					qidArr : function($stateParams, ChapterDao, ErrorExamService){
						if($stateParams.qtype != 5){
							var data = ChapterDao.loadChapterTypeQuestions($stateParams.lawid, $stateParams.chapterid, $stateParams.qtype);
							return data;
						}else{
							return ErrorExamService.getErrorQuestionIdsByChapter($stateParams.lawid, $stateParams.chapterid);
						}
					}
				}
			}
		}
	}).state('tab.menu.practice.chpentry', {
		url : '/chpentry/:lawid/:chapterid',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-entry.html',
				controller : 'ChapterEntryCtrl'
			}
		}
	})
	.state('tab.menu.practice.exampaperlist', {
		//
		url : '/exampaperlist',
		views : {
			'chapter' : {
				templateUrl : 'exampaper/exampaper-list.html',
				controller : 'ExamPaperListCtrl'
			}
		}
	})
	.state('tab.menu.practice.exampaper', {
		url : '/exampaper/:paperId',
		views : {
			'chapter' : {
				templateUrl : 'exampaper/exampaper-entry.html',
				controller : 'ExamPaperCtrl'
			}
		}
	}).state('tab.menu.practice.examing', {
		url : '/exampaper/:paper',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'ExamingCtrl',
				resolve : {
					qidArr : function(ExamService){
						var data = ExamService.getExamPaper();
						return data;
					}
				}
			}
		}
	})
	.state('tab.menu.practice.examresult', {
		//考试结果
		url : '/examresult?lefttime',
		views : {
			'chapter' : {
				templateUrl : 'exampaper/exampaper-result.html',
				controller : 'ExamResultCtrl'
			}
		},
		resolve : {
			resultList : function(ExamResultService){
				return 1;
			}
		}	
	}).state(
		'tab.menu.practice.errorquestions', {
			url : '/error-questions?qidArr',
			views : {
				'chapter' : {
					templateUrl : 'chapter/chapter-exam.html',
					controller : 'ErrorQuestionsCtrl'
				}
			}
		}
	)
	.state('tab.menu.practice.random', {
		url : '/random/:rand',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'ExamRandomCtrl'
			}
		},
		resolve : {
			minMaxQid : function(ChapterDao){
				var data = ChapterDao.getMaxMin();
				return data;
			}
		}
	}).state('tab.menu.practice.favor', {
		url : '/favor',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'FavorCtrl',
				resolve : {
					qidArr : function(FavorService){
						var data = FavorService.loadQuestions();
						return data;
					},
					progressQid : function(FavorService){
						var data = FavorService.loadProgress();
						return data;
					}
				}
			}
		}
	}).state('tab.menu.real', {
		url : '/real',
		views : {
			'tab-real' : {
				templateUrl : 'tab/tab-real.html',
				controller : 'RealCtrl'
			}
		}
	}).state('tab.menu.exam', {
		url : '/real/:year/:paper',
		views : {
			'tab-real' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'RealExamCtrl',
				resolve:{
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
	}).state('tab.about', {
		//关于页面
		url : '/about',
		views : {
			'menuContent' : {
				templateUrl : 'about/about.html',
				controller : 'AboutCtrl'
			}
		}
	}).state('tab.libman', {
		//关于页面
		url : '/libman',
		views : {
			'menuContent' : {
				templateUrl : 'libman/libman.html',
				controller : 'LibManCtrl'
			}
		}
	}).state('tab.menu.practice.outline', {
		//关于页面
		url : '/outline',
		views : {
			'chapter' : {
				templateUrl : 'chapter/practice-chapter.html',
				controller : 'OutlineCtrl'
			}
		}
	}).state('tab.menu.practice.outlineentry', {
		url : '/outlineentry/:lawid/:chapterid',
		views : {
			'chapter' : {
				templateUrl : 'outline/outline-entry.html',
				controller : 'OutlineEntryCtrl'
			}
		}
	}).state('tab.menu.practice.book', {
		//关于页面
		url : '/book',
		views : {
			'chapter' : {
				templateUrl : 'chapter/practice-chapter.html',
				controller : 'BookCtrl'
			}
		}
	}).state('tab.menu.practice.bookentry', {
		url : '/bookentry/:lawid/:chapterid',
		views : {
			'chapter' : {
				templateUrl : 'book/book-entry.html',
				controller : 'BookEntryCtrl'
			}
		}
	}).state('tab.menu.practice.download', {
		//关于页面
		url : '/download',
		abstract : true,
		views : {
			'chapter' : {
				templateUrl : 'download/download-entry.html',
			}
		}
	}).state('tab.menu.practice.download.local', {
		//关于页面
		url : '/download/local',
		views : {
			'download-content' : {
				templateUrl : 'download/download.html',
				controller : 'DownloadLocalCtl'
			}
		}
	})
	.state('tab.menu.practice.download.cloud', {
		//关于页面
		url : '/download/cloud',
		views : {
			'download-content' : {
				templateUrl : 'download/download.html',
				controller : 'DownloadCloudCtl'
			}
		}
	}).state('tab.menu.practice.pointentry', {
		//关于页面
		url : '/pointentry/:lawid/:chapterid',
		views : {
			'chapter' : {
				templateUrl : 'chapter/chapter-exam.html',
				controller : 'PointEntryCtrl',
				resolve : {
					qidArr : function(PointService, $stateParams){
						var data = PointService.loadQuestions($stateParams.lawid);
						return data;
					},
					progressQid : function(PointService, $stateParams){
						var data = PointService.loadProgress($stateParams.lawid);
						return data;
					}
				}
			}
		}
	}).state('tab.menu.practice.point', {
		//point目录页面
		url : '/point',
		views : {
			'chapter' : {
				templateUrl : 'chapter/practice-chapter.html',
				controller : 'PointCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	//如果使用另外一种方式会导致在stateChangeStart拦截函数中的使用preventDefault时，无限循环
	// $urlRouterProvider.otherwise('tab/menu/dash');

	$urlRouterProvider.otherwise(function($injector, $location){
		var $state =  $injector.get("$state");
		$state.go("tab.menu.dash");
	});
});