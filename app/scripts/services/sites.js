'use strict';

angular.module('formMailerServiceApp').factory('Sites', [ '$resource', function($resource) {
	return $resource('api/sites');
} ]);
