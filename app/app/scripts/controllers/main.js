angular.module('cupcakeDashboard')
  .controller('MainCtrl', function ($scope, $rootScope, $resource, PhaseService) {

    $rootScope.navPhase = 'all';

    var Project = $resource('/api/projects/:id', { cache: false });
    $scope.projects = Project.query();

    PhaseService.phases().then(function(data){
      $scope.phases = data;
    });
  });
