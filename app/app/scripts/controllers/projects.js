angular.module('cupcakeDashboard')
  .controller('ProjectsCtrl', function ($scope, $rootScope, $resource, UIHelperService, AuthenticationService) {

    $rootScope.navPhase = 'all';

    var Project = $resource('/api/projects/:id', { cache: false });
    $scope.projects = Project.query();


    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
