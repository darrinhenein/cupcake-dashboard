angular.module('nodeTestApp')
  .controller('MainCtrl', function ($scope, $http, $resource, PhaseService) {
    var Project = $resource('http://localhost\\:3000/projects/:id', { cache: true });
    $scope.projects = Project.query();
    $scope.activePhase = 'all'

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });
  });
