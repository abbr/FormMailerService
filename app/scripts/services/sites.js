'use strict';

angular.module('formMailerServiceApp').factory('Sites', [ '$resource', function($resource) {
	return $resource('api/sites/:id',{},{
	  save: {method:'PUT'}
	});
} ]);
