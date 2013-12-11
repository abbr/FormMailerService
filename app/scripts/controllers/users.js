'use strict';

angular.module('formMailerServiceApp').controller(
    'UsersCtrl',
    [ '$scope', 'Users', '$modal', '$location',
        function($scope, Users, $modal, $location) {
          $scope.$location = $location;
          var usersProm = Users.query(function() {
            $scope.users = usersProm;
          });

          $scope.removeUser = function(userId) {
            Users.remove({
              id : userId
            });
            var usersProm = Users.query(function() {
              $scope.users = usersProm;
            });
          };

          $scope.newUser = function() {
            var mi = $modal.open({
              templateUrl : 'partials/userDetails.html',
              controller : ModalInstanceCtrl,
              resolve : {
                item : function() {
                  return undefined;
                }
              }
            });
            mi.result.then(function(d) {
              $scope.users.push(d);
            });
          };

          $scope.editUser = function(user) {
            $modal.open({
              templateUrl : 'partials/userDetails.html',
              controller : ModalInstanceCtrl,
              resolve : {
                item : function() {
                  return user;
                }
              }
            });
          };
        } ]);

var ModalInstanceCtrl = [
    '$scope',
    '$modalInstance',
    'item',
    'Users',
    '$location',
    function($scope, $modalInstance, item, Users, $location) {
      $scope.$location = $location;
      $scope.modalHeader = (item == undefined ? 'New User'
          : 'Modify User');
      $scope.originalItem = item;
      $scope.item = angular.copy(item || {});
      [ 'referrers', 'admins', 'mailTo', 'mailCc' ].forEach(function(v, i, a) {
        $scope.item[v] = $scope.item[v] && $scope.item[v].length > 0 ? $scope.item[v]
            : [ '' ];
      });
      $scope.ok = function() {
        if (item == undefined) {
          Users.create($scope.item, function(v, h) {
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