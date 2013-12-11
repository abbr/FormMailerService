'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', function($scope, $location) {
  $scope.$location = $location;
} ]);
