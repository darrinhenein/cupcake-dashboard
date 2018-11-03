angular.module('cupcakeDashboard')
  .controller('UserProjectsCtrl', function ($scope, $rootScope, $routeParams, $http, UIHelperService) {

    userEmail = $routeParams.email;

    $scope.email = userEmail;

    $http.get('/api/' + userEmail + '/projects', {}).success(function(data){
      $scope.projects = data;
    })

    $http.get('/api/' + userEmail + '/collaborations', {}).success(function(data){
      $scope.collaborations = data;
    })

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
