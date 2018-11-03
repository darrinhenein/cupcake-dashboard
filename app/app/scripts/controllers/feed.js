angular.module('cupcakeDashboard')
  .controller('FeedCtrl', function ($rootScope, $window, $scope, EventsService, $timeout, $location, $angularCacheFactory) {

  var isNewDelaySeconds = 60 * 3;

  $scope.events = [];
  $rootScope.newNotifications = 0;

  EventsService.getEvents().then(function(data){
    $scope.events = angular.copy(data, $scope.events);
  });

  $rootScope.changeNotificationNumber = function(delta, reset){
    $rootScope.newNotifications += delta;
    $window.document.title = "(" + $rootScope.newNotifications + ") Concepts | Firefox UX Dashboard"
    if(reset)
    {
      $rootScope.newNotifications = 0;
      $window.document.title = "Concepts | Firefox UX Dashboard"
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
