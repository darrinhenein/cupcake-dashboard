angular.module('cupcakeDashboard')
  .controller('AboutCtrl', function ($scope, $http) {

    $scope.ethepad = 'Loading...';

    $http.get('/api/etherpad/prototype-dashboard').then(function(res){
      console.log(res);
      $scope.etherpad = res.data;
    });

  });
