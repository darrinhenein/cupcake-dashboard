angular.module('cupcakeDashboard')
  .controller('FeedCtrl', function ($scope, $http) {

  $scope.events = [];

  $http.get('/api/events').then(function(res){
    $scope.events = angular.copy(res.data, $scope.events);
  })

  var socket = io.connect('http://localhost');

  socket.on('feed', function(data){
    $scope.$apply(function(){
      data.isNew = true;
      $scope.events.push(data);
    });
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
