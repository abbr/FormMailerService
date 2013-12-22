'use strict';

var UserInstanceCtrl = [ '$scope', '$modalInstance', 'item', 'Users', '$location', 'cu', 'userArr', function($scope, $modalInstance, item, Users, $location, cu, userArr) {
  $scope.$location = $location;
  $scope.cu = cu;
  $scope.userArr = userArr;
  $scope.modalHeader = (item === undefined ? 'New User' : 'Modify User');
  $scope.item = angular.copy(item || {});
  $scope.ok = function() {
    if (item === undefined) {
      Users.create($scope.item, function(v) {
        $modalInstance.close(v);
      }, function(r) {
        $scope.errorMsg = r.data;
      });
    } else {
      Users.update({
        id : item.username
      }, $scope.item, function() {
        angular.copy($scope.item, item);
        $modalInstance.close();
      });
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.unique = function(value) {
    return $scope.userArr.indexOfObject('username', value) < 0;
  };

} ];

angular.module('formMailerServiceApp').controller('UsersCtrl', [ '$scope', 'Users', '$modal', '$location', function($scope, Users, $modal, $location) {
  $scope.$location = $location;
  var usersProm = Users.query(function() {
    $scope.users = usersProm;
    $scope.socket.on('user', function(d) {
      $scope.$apply(function() {
        switch (d.t) {
        case 'delete':
          $scope.users.splicePositiveIndex($scope.users.indexOfObject('username', d.od.username), 1);
          break;
        case 'update':
          angular.extend($scope.users[$scope.users.indexOfObject('username', d.od.username)], d.nd);
          break;
        case 'create':
          if ($scope.users.indexOfObject('username', d.nd.username) < 0)
            $scope.users.push(angular.extend(Object.create(Users.prototype), d.nd));
          break;
        }
      });
    });
  });
  $scope.removeUser = function(userId) {
    Users.remove({
      id : userId
    }, null, function() {
      $scope.users.splicePositiveIndex($scope.users.indexOfObject('username', userId), 1);
    });
  };

  $scope.newUser = function() {
    var mi = $modal.open({
      templateUrl : 'partials/userDetails.html',
      controller : UserInstanceCtrl,
      resolve : {
        item : function() {
          return undefined;
        },
        cu : function() {
          return $scope.cu;
        },
        userArr : function() {
          return $scope.users;
        }
      }
    });
    mi.result.then(function(d) {
      if ($scope.users.indexOfObject('username', d.username) < 0)
        $scope.users.push(d);
    });
  };

  $scope.editUser = function(user) {
    $modal.open({
      templateUrl : 'partials/userDetails.html',
      controller : UserInstanceCtrl,
      resolve : {
        item : function() {
          return user;
        },
        cu : function() {
          return $scope.cu;
        },
        userArr : function() {
          return $scope.users;
        }
      }
    });
  };

} ]);
