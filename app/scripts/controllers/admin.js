'use strict';

angular.module('formMailerServiceApp').controller(
    'AdminCtrl',
    [ '$scope', 'Sites', '$modal', '$location',
        function($scope, Sites, $modal, $location) {
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
                }
              }
            });
          };
        } ]);

var SiteInstanceCtrl = [
    '$scope',
    '$modalInstance',
    'item',
    'Sites',
    '$location',
    function($scope, $modalInstance, item, Sites, $location) {
      $scope.$location = $location;
      $scope.modalHeader = (item == undefined ? 'New Site Settings'
          : 'Modify Site Settings');
      $scope.originalItem = item;
      $scope.item = angular.copy(item || {});
      [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(v, i, a) {
        $scope.item[v] = $scope.item[v] && $scope.item[v].length > 0 ? $scope.item[v]
            : [ '' ];
      });
      $scope.ok = function() {
        if (item == undefined) {
          Sites.create($scope.item, function(v, h) {
            $modalInstance.close(v);
          });
        } else {
          angular.copy($scope.item, item);
          item.$update({
            id : item.id
          });
          $modalInstance.close();
        }
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    } ];