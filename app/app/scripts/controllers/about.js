angular.module('cupcakeDashboard')
  .controller('AboutCtrl', function ($scope, $http) {

    $scope.ethepad = 'Loading...';

    $http.get('https://firefox-ux.etherpad.mozilla.org/ep/pad/export/prototype-dashboard/latest').then(function(res){
      console.log(res);
      $scope.etherpad = res.data;
    });

  });
