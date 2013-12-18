'use strict';

angular.module('formMailerServiceApp').controller('LoginCtrl', [ '$scope', '$location', '$http', '$route', function($scope, $location, $http, $route) {
  $scope.doLogin = function(username, password) {
    $http.post('api/login', {
      'username' : username,
      'password' : password
    }).success(function(data) {
      $scope.updateCU(data);
      $location.path('/admin');
    }).error(function() {
      $("#login-form").effect("shake");
    });
  };
} ]);
