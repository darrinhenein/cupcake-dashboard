angular.module('cupcakeDashboard')
  .controller('NavCtrl', function ($scope, $rootScope, UIHelperService) {

    $rootScope.$watch('navPhase', function(){
      $scope.navPhase = $rootScope.navPhase;
    });

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
    UIHelperService.total().then(function(data){
      $scope.projectsTotal = data;
    });

  });
