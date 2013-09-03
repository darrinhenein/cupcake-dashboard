angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $rootScope, $resource, $location, $stateParams, AuthenticationService) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false, id: projectId}, {
      'update': {
        method: 'put'
      }
    });


    $scope.project = Project.get({id: projectId}, function(){
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
    });

    $scope.$watch('loggedInUser', function(){
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
    });

    $scope.remove = function(){
      $scope.project.$delete(function(){
        $location.path('/projects');
      });
    }

    $scope.update = function(data){
      var path = data.path;
      var model = path.split('.')[0];
      var prop = path.split('.')[1];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      switch(model) {
        case 'project':
          Project.update({id: projectId}, obj);
          break;
      }
    }
  });
