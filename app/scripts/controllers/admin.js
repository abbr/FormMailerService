'use strict';

angular.module('formMailerServiceApp').controller('AdminCtrl',
    [ '$scope', 'Sites', function($scope, Sites) {
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
    } ]);

angular.module('formMailerServiceApp').controller('ModalDemoCtrl',
    [ '$scope', '$modal', function($scope, $modal) {
      $scope.newSite = function() {
        var modalInstance = $modal.open({
          templateUrl : 'partials/siteDetails.html',
          controller : ModalInstanceCtrl,
          resolve : {
            item : function() {
              return undefined;
            }
          }
        });
      };
    } ]);

var ModalInstanceCtrl = [ '$scope', '$modalInstance', 'item',
    function($scope, $modalInstance, item) {
      $scope.modalHeader = (item == undefined ? 'New Site' : 'Modify Site');
      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    } ];