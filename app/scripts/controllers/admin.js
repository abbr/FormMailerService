'use strict';

var SiteInstanceCtrl = [ '$scope', '$modalInstance', 'item', 'Sites', '$location', 'cu', 'Users', function($scope, $modalInstance, item, Sites, $location, cu, Users) {
  $scope.$location = $location;
  $scope.modalHeader = (item === undefined ? 'New' : 'Modify') + ' Form Posting Settings';
  $scope.item = JSON.parse(JSON.stringify(item || {}));
  if ($scope.item.admins && $scope.item.admins.indexOf(cu.username) >= 0) {
    $scope.item.admins.splice($scope.item.admins.indexOf(cu.username), 1);
  }
  [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(v) {
    $scope.item[v] = $scope.item[v] && $scope.item[v].length > 0 ? $scope.item[v] : [ '' ];
  });
  var usersProm = Users.query(function() {
    $scope.nonSuperAdmins = usersProm.filter(function(v) {
      return !v.superAdmin;
    });
  });

  $scope.uniqueAdminFilter = function(val) {
    return $scope.item.admins.indexOf(val.username) < 0;
  };

  $scope.ok = function() {
    // add current non super user to item admins
    if (!cu.superAdmin && $scope.item.admins.indexOf(cu.username) < 0) {
      $scope.item.admins.push(cu.username);
    }
    // clear empty values
    [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(va) {
      $scope.item[va] = $scope.item[va].filter(function(v) {
        return v && v.trim().length > 0;
      });
    });

    if (item === undefined) {
      Sites.create($scope.item, function(v) {
        $modalInstance.close(v);
      });
    } else {
      angular.copy($scope.item, item);
      Sites.update({
        id : item.id
      }, item, function() {
        $modalInstance.close();
      });
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
} ];

angular.module('formMailerServiceApp').controller('AdminCtrl', [ '$scope', 'Sites', '$modal', '$location', '$window', function($scope, Sites, $modal, $location, $window) {
  $scope.$location = $location;
  var sitesProm = Sites.query(function() {
    $scope.sites = sitesProm;
    $scope.socket.on('site', function(d) {
      $scope.$apply(function() {
        switch (d.t) {
        case 'delete':
          $scope.sites.splicePositiveIndex($scope.sites.indexOfObject('id', d.od.id), 1);
          break;
        case 'update':
          angular.extend($scope.sites[$scope.sites.indexOfObject('id', d.od.id)], d.nd);
          break;
        case 'create':
          if ($scope.sites.indexOfObject('id', d.nd.id) < 0) {
            $scope.sites.push(angular.extend(Object.create(Sites.prototype), d.nd));
          }
          break;
        }
      });
    });
  });

  $scope.removeSite = function(siteId) {
    Sites.remove({
      id : siteId
    }, null, function() {
      $scope.sites.splicePositiveIndex($scope.sites.indexOfObject('id', siteId), 1);
    });
  };

  $scope.cloneSite = function(site) {
    Sites.create(site, function(v) {
      if ($scope.sites.indexOfObject('id', v.id) < 0) {
        $scope.sites.push(v);
      }
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
      if ($scope.sites.indexOfObject('id', d.id) < 0) {
        $scope.sites.push(d);
      }
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

  $scope.clip = new $window.ZeroClipboard(null, {
    moviePath : '/bower_components/zeroclipboard/ZeroClipboard.swf'
  });

  $scope.clip.on('load', function(client) {
    client.on('complete', function() {
      $window.$(this).tooltip('destroy');
      $window.$(this).tooltip({
        title : 'copied'
      });
      $window.$(this).tooltip('show');
    });

  });

  $scope.clip.on('mouseover', function() {
    $window.$(this).tooltip({
      title : 'copy URL to clipboard'
    });
    $window.$(this).tooltip('show');
  });

  $scope.clip.on('mouseout', function() {
    $window.$(this).tooltip('destroy');
  });

} ]);

angular.module('formMailerServiceApp').directive('copyIt', function() {
  return function(scope, element) {
    element.ready(function() {
      scope.clip.glue(element);
    });
  };
});
