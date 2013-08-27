angular.module('cupcakeDashboard')
  .controller('PhaseCtrl', function ($scope, $rootScope, $http, $stateParams, UIHelperService) {

    $rootScope.navPhase = $stateParams.id;

    $http.get('/api/phase/' + $stateParams.id, { cache: false }).success(function(data){
      $scope.projects = data;
    })

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
    UIHelperService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
