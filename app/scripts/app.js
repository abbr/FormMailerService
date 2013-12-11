'use strict';

angular.module('formMailerServiceApp', [ 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap' ]).config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl : 'partials/main'
  }).when('/admin', {
    templateUrl : 'partials/admin',
    controller : 'AdminCtrl'
  }).when('/admin/help', {
    templateUrl : 'partials/help'
  }).when('/admin/users', {
    templateUrl : 'partials/users',
    controller : 'UsersCtrl'
  }).otherwise({
    redirectTo : '/'
  });
  $locationProvider.html5Mode(true);
});
