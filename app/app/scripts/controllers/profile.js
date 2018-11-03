angular.module('cupcakeDashboard')
  .controller('ProfileCtrl', function ($scope, $rootScope, $location, $resource, $http, AuthenticationService) {

    var User = $resource('/api/users/:id', {id: $rootScope.loggedInUser._id}, {
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


      switch(model) {
        case 'user':
          User.update({id: $scope.user._id}, obj);
          break;
      }
    }

    $scope.downloadDB = function(){
      $http.get('/admin/dump').then(function(res){
        $scope.dbDump = angular.toJson(res.data, true);
        $scope.status = {
          message: "Database downloaded.",
          date: new Date()
        };
      });
    }

    $scope.uploadDB = function(){
      $http.post('/admin/load', $scope.dbDump).then(function(res){
        $scope.status = res.data;
      });
    }

  });
