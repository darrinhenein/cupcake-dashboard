angular.module('cupcakeDashboard')
  .controller('ProjectPhasesCtrl', function ($scope, $resource, $stateParams, $location, PhaseService) {
    if($stateParams.phase){
      $scope.activePhase = $stateParams.phase;
    } else {
      $scope.activePhase = project.phase;
    }

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
  });
