'use strict';

angular.module('formMailerServiceApp').controller('LoginCtrl', ['$scope', '$location', '$http', '$window',
function($scope, $location, $http, $window) {
  if ($scope.cu.username) {
    $location.path('/admin').replace();
  }
  $scope.doLogin = function(username, password) {
    $http.post('api/login', {
      'username' : username,
      'password' : password
    }).success(function(data) {
      $scope.updateCU(data);
      $location.path(($scope.rdu || '/admin'));
      $scope.removeRdu();
    }).error(function() {
      $window.$('#login-form').effect('shake');
    });
  };
}]);
