angular.module('cupcakeDashboard')
  .controller('UserThemesCtrl', function ($scope, $rootScope, $routeParams, $http) {

    userEmail = $routeParams.email;

    $scope.email = userEmail;

    $http.get('/api/' + userEmail + '/themes', {}).success(function(data){
      $scope.themes = data;
    })
  });
