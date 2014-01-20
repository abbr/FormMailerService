'use strict';

angular.module('formMailerServiceApp').factory('Users', [ '$resource', function($resource) {
  return $resource('api/users/:id',{},{
    update: {method:'PATCH'},
    create: {method:'POST'},
  });
} ]);
