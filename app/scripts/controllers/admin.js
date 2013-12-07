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
        $modal.open({
          templateUrl : 'partials/siteDetails.html',
          controller : ModalInstanceCtrl,
          resolve : {
            item : function() {
              return undefined;
            }
          }
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

var ModalInstanceCtrl = [ '$scope', '$modalInstance', 'item',
    function($scope, $modalInstance, item) {
      $scope.modalHeader = (item == undefined ? 'New Site' : 'Modify Site');
      $scope.item = item;
      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    } ];