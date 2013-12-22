'use strict';

angular.module('formMailerServiceApp').controller('IndexCtrl', [ '$scope', '$location', '$http', '$window', 'Users', '$modal', function($scope, $location, $http, $window, Users, $modal) {
  $scope.socket = $window.io.connect();
  $scope.$location = $location;
  $scope.cu = {};
  $scope.updateCU = function(data) {
    $scope.cu = data;
    $scope.socket.emit('identify', $scope.cu.username);
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
            if ($scope.users.indexOfObject('username', d.nd.username) < 0) {
              $scope.users.push(angular.extend(Object.create(Users.prototype), d.nd));
            }
            break;
          }
        });
      });
    });
  };

  $scope.removeRdu = function() {
    delete $scope.rdu;
  };

  $http.get('api/cu').success(function(data) {
    $scope.updateCU(data);
  }).error(function() {
    $scope.socket.emit('unidentify', '');
    var p = $location.path();
    if (p !== '/') {
      $scope.rdu = p;
      $location.path('/');
    }
  });

  $scope.changePassword = function() {
    $modal.open({
      templateUrl : 'partials/userDetails.html',
      controller : $window.UserInstanceCtrl,
      resolve : {
        item : function() {
          return {
            username : $scope.cu.username,
            superAdmin : false
          };
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
