'use strict';

angular.module('formMailerServiceApp').controller('AdminCtrl', [ '$scope', 'Sites', function($scope, Sites) {
	var sitesProm = Sites.query(function() {
		$scope.sites = sitesProm;
	});
	
	$scope.removeSite = function(siteId){
	  Sites.remove({id:siteId});
	  var sitesProm = Sites.query(function() {
	    $scope.sites = sitesProm;
	  });
	};
} ]);