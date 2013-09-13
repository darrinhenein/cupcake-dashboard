angular.module('cupcakeDashboard')
  .controller('FeedCtrl', function ($scope, $http, $timeout) {

  var isNewDelaySeconds = 60;

  $scope.events = [];

  $http.get('/api/events').then(function(res){
    $scope.events = angular.copy(res.data, $scope.events);
  })

  var socket = io.connect('http://localhost');

  socket.on('feed', function(data){
    $scope.$apply(function(){
      data.isNew = true;
      $scope.events.push(data);
      $timeout(function(){
        data.isNew = false;
      }, isNewDelaySeconds * 1000, true);
    });
  })

  $scope.formatVerb = function(verb){
    switch(verb){
      case 'POST':
        return 'created'
      case 'PUT':
        return 'updated'
      case 'DELETE':
        return 'deleted'
    }
  }
});
