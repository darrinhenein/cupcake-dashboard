angular.module('cupcakeDashboard')
  .controller('ThemeCtrl', function ($scope, $resource, $location, $stateParams, UIHelperService, AuthenticationService) {
    var themeId = $stateParams.id;

    var Theme = $resource('/api/themes/:id', { cache: false, isArray: false, id: themeId}, {
      'update': {
        method: 'put'
      }
    });

    $scope.theme = Theme.get({id: themeId}, function(){
        $scope.themePermissions = AuthenticationService.getPermissions($scope.theme.theme);
        $scope.isFound = true;
      }, function(res) {
        $scope.isFound = false;
      }
    );

    $scope.$watch('loggedInUser', function(){
      $scope.themePermissions = AuthenticationService.getPermissions($scope.theme.theme);
    });

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });

    $scope.update = function(data){
      var path = data.path;
      // theme.theme.prop or theme.projects
      var model = path.split('.')[1];
      var prop = path.split('.')[2];

      // create object to PUT to server
      var obj = {};
      obj[prop] = data.value;

      switch(model) {
        case 'theme':
          Theme.update({id: themeId}, obj);
          break;
      }
    }

    $scope.remove = function(){
      $scope.theme.$delete(function(){
        $location.path('/themes');
      });
    }

  });
