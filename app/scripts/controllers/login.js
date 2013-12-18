'use strict';

angular.module('formMailerServiceApp').controller('LoginCtrl', [ '$scope', '$location', '$http', function($scope, $location, $http) {
  $scope.doLogin = function(username, password) {
    $http.post('api/login', {
      'username' : username,
      'password' : password
    }).success(function(data) {
      $scope.updateCU(data);
      $location.path(($scope.rdu || '/admin'));
      $scope.removeRdu();
    }).error(function() {
      $("#login-form").effect("shake");
    });
  };
} ]);
