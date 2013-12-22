'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', '$http', '$window', function($scope, $location, $http, $window) {
  $scope.socket = $window.io.connect();
  $scope.$location = $location;
  $scope.cu = {};
  $scope.updateCU = function(data) {
    $scope.cu = data;
    $scope.socket.emit('identify', $scope.cu.username);
  };

  $scope.removeRdu = function() {
    delete $scope.rdu;
  };

  $http.get('api/cu').success(function(data) {
    $scope.updateCU(data);
  }).error(function() {
    $scope.socket.emit('unidentify', '');
    var p = $location.path();
    if (p !== '/') {
      $scope.rdu = p;
      $location.path('/');
    }
  });
} ]);
