angular.module('cupcakeDashboard')
  .controller('FeedCtrl', function ($scope, $http) {

  $http.get('/api/events').then(function(res){
    $scope.events = res.data;
  })

  $scope.formatVerb = function(verb){
    switch(verb){
      case 'POST':
        return 'created'
      case 'PUT':
        return 'updated'
    }
  }
});
