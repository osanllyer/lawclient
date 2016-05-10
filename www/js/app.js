// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
		[ 'ionic', 
			'starter.controllers', 
			'starter.services',
			'starter.services.chapterDao', 
			'ngCordova', 
			'starter.controllers.chapter',
			'starter.controllers.exampaper',
			'starter.services.commonservice',
			'starter.services.configuration',
			'starter.router'
			])

.run(
	function($ionicPlatform, $cordovaSQLite, $rootScope, DB) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins
					&& window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();s
			}

			var db = null;
			console.log($rootScope); 
			//加载数据库
			if(window.sqlitePlugin){
				window.plugins.sqlDB.remove("law.db", 0, function(){alert("remove ok")}, function(e){});
				alert('copy db');
				window.plugins.sqlDB.copy("law.db", 0, function() {
					alert('copy ok');
        			$rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
        			alert($rootScope.db);
    			}, function(error) {
    				alert(JSON.stringify(error));
    				$rootScope.db = $cordovaSQLite.openDB({name:"law.db",location:"default"});
        			console.error("There was an error copying the database: " + error);        		
        		});
			}else{
				//in browser
				console.log("db initing");
				DB.initDB();
			}
		});
	}
)
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});