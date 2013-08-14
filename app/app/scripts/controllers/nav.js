angular.module('nodeTestApp')
  .controller('NavCtrl', function ($scope, PhaseService) {
    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
    PhaseService.total().then(function(data){
      $scope.projectsTotal = data;
    });
  });
