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
    [ '$scope', '$modal', '$log', function($scope, $modal, $log) {

      $scope.items = [ 'item1', 'item2', 'item3' ];

      $scope.open = function() {

        var modalInstance = $modal.open({
          templateUrl : 'myModalContent.html',
          controller : ModalInstanceCtrl,
          resolve : {
            items : function() {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    } ]);

var ModalInstanceCtrl = [ '$scope', '$modalInstance', 'items',
    function($scope, $modalInstance, items) {

      $scope.items = items;
      $scope.selected = {
        item : $scope.items[0]
      };

      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    } ];