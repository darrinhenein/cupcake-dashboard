angular.module('cupcakeDashboard')
  .controller('ProfileCtrl', function ($scope, $rootScope, $location, $resource, AuthenticationService) {

    var User = $resource('/api/users/:id', { cache: false, isArray: false, id: $rootScope.loggedInUser._id}, {
      'update': {
        method: 'put'
      }
    });

    $scope.user = $rootScope.loggedInUser;
    $scope.userPermissions = AuthenticationService.getPermissions($scope.user);

    $scope.$watch('loggedInUser', function(){
      $scope.userPermissions = AuthenticationService.getPermissions($scope.user);
    });

    $scope.update = function(data){
      var path = data.path;
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      console.log(obj, model);

      switch(model) {
        case 'user':
          User.update({id: $scope.user._id}, obj);
          break;
      }
    }

  });
