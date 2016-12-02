angular.module('starter.controllers')
.controller('ErrCorrectCtrl', function ($scope, $stateParams, $log, $ionicHistory, $ionicPopup, ErrCorrectService, AuthService, ChapterDao) {



  $scope.selectLaw = function(){
    $log.debug('current selected law:', $scope.data.law_id);
    $scope.chapter_idList = $scope.chapterList[$scope.data.law_id];
    $log.debug('current chapter list:', JSON.stringify($scope.chapter_idList));
  }

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		//如果存在前一个view，显示返回按钮,否则不现实
		//在用户进入app时，保证没有登录的用户，进入login界面
		if($ionicHistory.backView() != null){
	    	viewData.enableBack = true;
		}

    $scope.qid = $stateParams.qid;
    $scope.originAnswer = $stateParams.originAnswer;
    $scope.currentChapterList = null;

    $scope.lawList = [];
    $scope.chapterList = [];
    $scope.data = {qid:$scope.qid, analysis:"", answer:"",law_id:null, chapter_id:null};

    var promise = ChapterDao.loadLawChapter();
    promise.then(
      function(data){
        if(data){
            var length = data.length;
  	  			for(var i=0; i<length; i++){
  	  				var row = data[i];
  	  				$scope.lawList[row.lid] = {id : row.lid, name : row.lawName};
  	  			}
  	  			for(var i=0; i<length; i++){
  	  				var row = data[i];
              if($scope.chapterList[row.lid] == null){
                $scope.chapterList[row.lid] = [];
              }
  	  				$scope.chapterList[row.lid].push({id:row.cid, name:row.chapterName});
  	  			}
        }
        $log.debug('load law ok:', JSON.stringify($scope.lawList));
        $log.debug('load chapter ok:', JSON.stringify($scope.chapterList));

      },
      function(error){
        $log.debug('load law chapter error:', JSON.stringify(error));
      }
    );
    $scope.showLawChp = true;
    var lawChpPromise = ChapterDao.getQuestion($scope.qid);
    lawChpPromise.then(
      function(data){
        $log.debug('load question:', JSON.stringify(data));
        if(data){
          if(data.chapter_id != null && data.law_id != null){
            $scope.showLawChp = false;
          }else{
            $scope.data.law_id = data.law_id;
            if($scope.data.law_id != null){
              $scope.currentChapterList = $scope.chapterList[$scope.data.law_id];
              // $scope.data.chapter_id = $scope.chapterList[$scope.data.law_id][0].id;
            }else{
              $scope.data.chapter_id = -1;
            }
            $log.debug('origin law:', $scope.data.law_id);
          }
        }
      },
      function(error) {
        $log.debug('load question error:', JSON.stringify(error));
      }
    );

	});



  function showAlert(head, message) {
    var alertPop = $ionicPopup.alert({title:head, template:message});
    alertPop.then(function(res){
      $ionicHistory.goBack();
    });
  }

  $scope.submit = function(){
    $scope.data.qid = $scope.qid;
    var username = AuthService.username();
    $scope.data.user = username;
    var promise = ErrCorrectService.submit($scope.data);
    promise.then(
      function(data){
        //正确提交，需要通知用户，并返回上一个页面
        $log.debug('submit correct to server:', JSON.stringify(data));
        showAlert('成功','谢谢您的提交');
      },
      function(error){
        $log.error('submit correct to server error:', JSON.stringify(error));
        showAlert('提交失败','请稍后再试');
      }
    );
  }

});
