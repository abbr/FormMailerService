'use strict';

angular.module('formMailerServiceApp').controller('UsersCtrl', [ '$scope', 'Users', '$modal', '$location', function($scope, Users, $modal, $location) {
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
        },
        cu : function() {
          return $scope.cu;
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
        },
        cu : function() {
          return $scope.cu;
        }
      }
    });
  };
} ]);

var ModalInstanceCtrl = [ '$scope', '$modalInstance', 'item', 'Users', '$location', 'cu', function($scope, $modalInstance, item, Users, $location, cu) {
  $scope.$location = $location;
  $scope.cu = cu;
  $scope.modalHeader = (item == undefined ? 'New User' : 'Modify User');
  $scope.originalItem = item;
  $scope.item = angular.copy(item || {});
  $scope.ok = function() {
    if (item == undefined) {
      Users.create($scope.item, function(v, h) {
        $modalInstance.close(v);
      });
    } else {
      angular.copy($scope.item, item);
      item.$update({
        id : item.username
      });
      $modalInstance.close();
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
} ];