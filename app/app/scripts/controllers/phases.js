angular.module('nodeTestApp')
  .controller('PhaseCtrl', function ($scope, $http, $routeParams, PhaseService) {
    $scope.activePhase = $routeParams.id;

    $http.get('http://localhost:3000/phase/' + $routeParams.id, { cache: true }).success(function(data){
      $scope.projects = data;
    })

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
