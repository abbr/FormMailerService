'use strict';

angular.module('formMailerServiceApp').factory('Sites', [ '$resource', function($resource) {
	return $resource('api/sites/:id',{},{
	  update: {method:'PUT'},
    create: {method:'POST'},
	});
} ]);
