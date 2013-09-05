angular.module('cupcakeDashboard')
  .controller('UserThemesCtrl', function ($scope, $rootScope, $stateParams, $http) {

    userEmail = $stateParams.email;

    $scope.email = userEmail;

    $http.get('/api/' + userEmail + '/themes', { cache: false }).success(function(data){
      $scope.themes = data;
    })
  });
