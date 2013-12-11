'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', '$http', function($scope, $location, $http) {
  $scope.$location = $location;
  $scope.isSuperAdmin = false;
  $http.get('api/isSuperAdmin').success(function(data) {
    $scope.isSuperAdmin = data[0];
  });
} ]);
