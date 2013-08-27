angular.module('cupcakeDashboard')
  .controller('ProjectPhasesCtrl', function ($scope, $resource, $stateParams, UIHelperService) {

    if($stateParams.phase){
      $scope.activePhase = $stateParams.phase;
    } else {
      $scope.activePhase = project.phase;
    }

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
