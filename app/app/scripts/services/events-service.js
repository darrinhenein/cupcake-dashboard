angular.module('cupcakeDashboard')
  .service('EventsService', function Events($http, DeferredWithUpdate, $window, $angularCacheFactory) {

    var _cache = $angularCacheFactory('eventCache');

     return {
      getEvents: function () {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/events', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        defer.resolve($window.bootstrap.events);
        return defer.promise;
      },

      getEventsForProject: function(id) {
        var defer = DeferredWithUpdate.defer();
        $http.get('/api/projects/' + id + '/activity', {
              cache: _cache
          }).success(function(res){
            defer.resolve(res);
          });
        return defer.promise;
      }
    };

  });