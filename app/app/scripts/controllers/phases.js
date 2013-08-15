angular.module('nodeTestApp')
  .controller('PhaseCtrl', function ($scope, $rootScope, $http, $stateParams, PhaseService) {

    $rootScope.navPhase = $stateParams.id;

    $http.get('http://localhost:3000/api/phase/' + $stateParams.id, { cache: true }).success(function(data){
      $scope.projects = data;
    })

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
