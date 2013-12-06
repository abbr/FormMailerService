'use strict';

angular.module('formMailerServiceApp',
    [ 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute','ui.bootstrap']).config(
    function($routeProvider, $locationProvider) {
      $routeProvider.when('/', {
        templateUrl : 'partials/main',
        controller : 'MainCtrl'
      }).when('/admin', {
        templateUrl : 'partials/admin',
        controller : 'AdminCtrl'
      }).otherwise({
        redirectTo : '/'
      });
      $locationProvider.html5Mode(true);
    });
