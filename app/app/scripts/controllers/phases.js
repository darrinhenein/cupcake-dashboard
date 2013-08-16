angular.module('cupcakeDashboard')
  .controller('PhaseCtrl', function ($scope, $rootScope, $http, $stateParams, PhaseService) {

    $rootScope.navPhase = $stateParams.id;

    $http.get('/api/phase/' + $stateParams.id, { cache: false }).success(function(data){
      $scope.projects = data;
    })

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
