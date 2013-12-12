'use strict';

angular.module('formMailerServiceApp').controller('AdminCtrl', [ '$scope', 'Sites', '$modal', '$location', function($scope, Sites, $modal, $location) {
  $scope.$location = $location;
  var sitesProm = Sites.query(function() {
    $scope.sites = sitesProm;
  });

  $scope.removeSite = function(siteId) {
    Sites.remove({
      id : siteId
    });
    var sitesProm = Sites.query(function() {
      $scope.sites = sitesProm;
    });
  };

  $scope.newSite = function() {
    var mi = $modal.open({
      templateUrl : 'partials/siteDetails.html',
      controller : SiteInstanceCtrl,
      resolve : {
        item : function() {
          return undefined;
        },
        cu : function() {
          return $scope.cu;
        }
      }
    });
    mi.result.then(function(d) {
      $scope.sites.push(d);
    });
  };

  $scope.editSite = function(site) {
    $modal.open({
      templateUrl : 'partials/siteDetails.html',
      controller : SiteInstanceCtrl,
      resolve : {
        item : function() {
          return site;
        },
        cu : function() {
          return $scope.cu;
        }
      }
    });
  };
} ]);

var SiteInstanceCtrl = [ '$scope', '$modalInstance', 'item', 'Sites', '$location', 'cu', function($scope, $modalInstance, item, Sites, $location, cu) {
  $scope.$location = $location;
  $scope.modalHeader = (item == undefined ? 'New' : 'Modify') + ' Form Posting Settings';
  $scope.originalItem = item;
  $scope.item = JSON.parse(JSON.stringify(item || {}));
  if ($scope.item.admins && $scope.item.admins.indexOf(cu.username) >= 0) {
    $scope.item.admins.splice($scope.item.admins.indexOf(cu.username), 1);
  }
  [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(v, i, a) {
    $scope.item[v] = $scope.item[v] && $scope.item[v].length > 0 ? $scope.item[v] : [ '' ];
  });
  $scope.ok = function() {
    // add current non super user to item admins
    if (!cu.superAdmin && $scope.item.admins.indexOf(cu.username) < 0) {
      $scope.item.admins.push(cu.username);
    }
    // clear empty values
    [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(va) {
      $scope.item[va] = $scope.item[va].filter(function(v){
        return v && v.trim().length>0;
      });
    });
    
    if (item == undefined) {
      Sites.create($scope.item, function(v, h) {
        $modalInstance.close(v);
      });
    } else {
      angular.copy($scope.item, item);
      Sites.update({
        id : item.id
      },item,function(){
        $modalInstance.close();
      });
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
} ];