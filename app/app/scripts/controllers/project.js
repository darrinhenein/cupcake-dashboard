angular.module('cupcakeDashboard')
  .controller('ProjectCtrl', function ($scope, $rootScope, $resource, $location, $stateParams, UIHelperService, AuthenticationService) {
    var projectId = $stateParams.id;

    var Project = $resource('/api/projects/:id', { cache: false, isArray: false, id: projectId}, {
      'update': {
        method: 'put'
      }
    });

    var Themes = $resource('/api/themes/:id');

    $scope.themes = Themes.query();

    $scope.project = Project.get({id: projectId}, function(){
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
    });

    $scope.$watch('loggedInUser', function(){
      $scope.projectPermissions = AuthenticationService.getPermissions($scope.project);
    });

    $scope.addTheme = function(themeId){
      themes = [];
      for (var i = $scope.project.themes.length - 1; i >= 0; i--) {
        if($scope.project.themes[i]._id != themeId)
        {
          themes.push($scope.project.themes[i]._id);
        }
        else
        {
          return;
        }
      };
      themes.push(themeId);
      Project.update({id: projectId}, {themes: themes}, function(data){
        $scope.project = data;
      });
    }

    $scope.removeTheme = function(themeId){
      themes = [];
      for (var i = $scope.project.themes.length - 1; i >= 0; i--) {
        if($scope.project.themes[i]._id != themeId)
        {
          themes.push($scope.project.themes[i]._id);
        }
      };
      Project.update({id: projectId}, {themes: themes}, function(data){
        $scope.project = data;
      });
    }

    $scope.remove = function(){
      $scope.project.$delete(function(){
        $location.path('/projects');
      });
    }

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });

    $scope.savePhase = function(){
      Project.update({id: projectId}, {phase: $scope.project.phase});
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

    $scope.notIn = function(group){
      return function( item ) {
          for(i in group)
          {
            if(group[i]._id == item._id)
            {
              return false;
            }
          }
          return true;
      };
    }
  });
