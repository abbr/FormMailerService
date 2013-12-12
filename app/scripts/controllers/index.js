'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', '$http', function($scope, $location, $http) {
  $scope.socket = io.connect();
  $scope.$location = $location;
  $scope.cu = {};
  $http.get('api/cu').success(function(data) {
    $scope.cu = data;
    $scope.socket.emit('identify', $scope.cu.username);
  }).error(function() {
    $scope.socket.emit('unidentify', '');
  });
} ]);
