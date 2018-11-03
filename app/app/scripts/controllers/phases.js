angular.module('cupcakeDashboard')
  .controller('PhaseCtrl', function ($scope, $rootScope, $http, $routeParams, UIHelperService) {

    $rootScope.navPhase = $routeParams.id;

    $http.get('/api/phase/' + $routeParams.id, {}).success(function(data){
      $scope.projects = data;
    })

    $scope.$watch('projects', function(){
      $http.get('/api/events/').then(function(res){
        $scope.events = res.data;
      });
    })

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });

    UIHelperService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
