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
      })
      .when('/admin/help', {
        templateUrl: 'partials/help'
      }).otherwise({
        redirectTo : '/'
      });
      $locationProvider.html5Mode(true);
    });
