angular.module('nodeTestApp')
  .controller('ProjectCtrl', function ($scope, $resource, $routeParams, PhaseService) {
    var projectId = $routeParams.id;

    var Project = $resource('http://localhost\\:3000/projects/:id', { cache: true });
    $scope.project = Project.get({id: projectId});

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });
  });
