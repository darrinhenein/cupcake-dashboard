angular.module('cupcakeDashboard')
  .controller('NavCtrl', function ($scope, $rootScope, PhaseService) {

    $rootScope.$watch('navPhase', function(){
      $scope.navPhase = $rootScope.navPhase;
    });

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
