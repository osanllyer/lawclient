angular.module('starter.services')
.factory('ErrCorrectService', function($http, ENDPOINTS){

  function submit(data) {
    return $http.post(ENDPOINTS.correct, data);
  }

  return{
    submit : submit
  };

});
