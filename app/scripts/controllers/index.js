'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', '$http', function($scope, $location, $http) {
  $scope.$location = $location;
  $scope.cu = {};
  $http.get('api/cu').success(function(data) {
    $scope.cu = data;
  });
} ]);
