'use strict';

angular.module('formMailerServiceApp').controller('AdminCtrl',
    [ '$scope', 'Sites', '$modal', function($scope, Sites, $modal) {
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
          controller : ModalInstanceCtrl,
          resolve : {
            item : function() {
              return undefined;
            }
          }
        });
        mi.result.then(function(d){
          $scope.sites.push(d);
        });
      };

      $scope.editSite = function(site) {
        $modal.open({
          templateUrl : 'partials/siteDetails.html',
          controller : ModalInstanceCtrl,
          resolve : {
            item : function() {
              return site;
            }
          }
        });
      };
    } ]);

var ModalInstanceCtrl = [ '$scope', '$modalInstance', 'item', 'Sites',
    function($scope, $modalInstance, item, Sites) {
      $scope.modalHeader = (item == undefined ? 'New Site' : 'Modify Site');
      $scope.originalItem = item;
      $scope.item = angular.copy(item || {});
      $scope.ok = function() {
        if (item == undefined) {
          Sites.save($scope.item,function(v,h){
            $modalInstance.close(v);
          });
        } else {
          angular.copy($scope.item, item);
          item.$save({
            id : item.id
          });
          $modalInstance.close();
        }
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    } ];