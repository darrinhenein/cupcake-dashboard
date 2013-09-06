angular.module('cupcakeDashboard')
  .controller('UserProjectsCtrl', function ($scope, $rootScope, $stateParams, $http, UIHelperService) {

    userEmail = $stateParams.email;

    $scope.email = userEmail;

    $http.get('/api/' + userEmail + '/projects', { cache: false }).success(function(data){
      $scope.projects = data;
    })

    $http.get('/api/' + userEmail + '/collaborations', { cache: false }).success(function(data){
      $scope.collaborations = data;
    })

    UIHelperService.phases().then(function(data){
      $scope.phases = data;
    });
  });
