angular.module('cupcakeDashboard')
  .controller('FeedCtrl', function ($rootScope, $window, $scope, $http, $timeout, $location) {

  var isNewDelaySeconds = 60 * 3;

  $scope.events = [];
  $rootScope.newNotifications = 0;

  $http.get('/api/events').then(function(res){
    $scope.events = angular.copy(res.data, $scope.events);
  })

  var socket = io.connect($location.host());

  socket.on('feed', function(data){
    $scope.$apply(function(){
      data.isNew = true;
      $rootScope.changeNotificationNumber(1);
      $scope.events.push(data);
      $timeout(function(){
        data.isNew = false;
      }, isNewDelaySeconds * 1000, true);
    });
  })

  $rootScope.changeNotificationNumber = function(delta, reset){
    $rootScope.newNotifications += delta;
    $window.document.title = "(" + $rootScope.newNotifications + ") Cupcakes | Firefox UX Dashboard"
    if(reset)
    {
      $rootScope.newNotifications = 0;
      $window.document.title = "Cupcakes | Firefox UX Dashboard"
    }
  }

  $scope.feedLink = function(e){
    params = [e.type, e.model._id];
    if (e.model.phase != undefined) params.push(e.model.phase);
    return params.join('/');
  }

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
