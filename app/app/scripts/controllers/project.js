angular.module('nodeTestApp')
  .controller('ProjectCtrl', function ($scope, $resource, $routeParams, $location, PhaseService) {
    var projectId = $routeParams.id;

    var Project = $resource('http://localhost\\:3000/projects/:id', { cache: true , isArray: false});
    $scope.project = Project.get({id: projectId}, function(project){
      if($routeParams.phase){
        $scope.activePhase = $routeParams.phase;
      } else {
        $scope.activePhase = project.phase;
      }
    });

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
  });
