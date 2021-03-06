'use strict';

Object.defineProperty(Array.prototype, 'indexOfObject', {
	enumerable : false,
	value : function(property, value) {
		for ( var i = 0, len = this.length; i < len; i++) {
			if (this[i][property] === value) {
				return i;
			}
		}
		return -1;
	}
});

Array.prototype.splicePositiveIndex = function() {
	if (arguments[0] < 0) {
		return null;
	}
	return Array.prototype.splice.apply(this, arguments);
};

angular.module(
		'formMailerServiceApp',
		[ 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap',
				'ui.validate', 'ngTouch' ]).config(
		function($routeProvider, $locationProvider) {
			$routeProvider.when('/', {
				templateUrl : 'partials/login',
				controller : 'LoginCtrl'
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
